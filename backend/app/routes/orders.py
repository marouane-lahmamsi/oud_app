from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.product import Product, ProductVariant
from app.models.customer import Customer
from app.models.promotion import Promotion
from app.services.order_notifications import send_new_order_notification

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    """Generate a unique order number."""
    timestamp = datetime.utcnow().strftime('%Y%m%d')
    count = Order.query.filter(
        db.func.date(Order.created_at) == datetime.utcnow().date()
    ).count() + 1
    return f'ORD-{timestamp}-{count:04d}'


@orders_bp.route('/', methods=['GET'])
def get_orders():
    """Get all orders (admin endpoint)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = Order.query
        
        if status:
            query = query.filter(Order.status == status)
        
        pagination = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [o.to_dict(include_items=False) for o in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a single order by ID."""
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        return jsonify({
            'success': True,
            'data': order.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@orders_bp.route('/', methods=['POST'])
def create_order():
    """Create a new order."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['items', 'shipping']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        items = data['items']
        shipping = data['shipping']
        customer_data = data.get('customer', {})
        promo_code = data.get('promo_code')
        payment_method = data.get('payment_method', 'cash_on_delivery')
        notes = data.get('notes', '')
        
        if not items:
            return jsonify({'success': False, 'error': 'Order must contain at least one item'}), 400
        
        # Create or get customer
        customer = None
        if customer_data.get('email'):
            customer = Customer.query.filter_by(email=customer_data['email']).first()
            
            if not customer:
                customer = Customer(
                    full_name=customer_data.get('full_name', ''),
                    email=customer_data['email'],
                    phone=customer_data.get('phone', ''),
                    address=shipping.get('address', ''),
                    city=shipping.get('city', ''),
                    postal_code=shipping.get('postal_code', '')
                )
                db.session.add(customer)
                db.session.flush()
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            customer_id=customer.id if customer else None,
            guest_email=customer_data.get('email') if not customer else None,
            guest_phone=customer_data.get('phone') if not customer else None,
            guest_full_name=customer_data.get('full_name') if not customer else None,
            shipping_address=shipping.get('address', ''),
            shipping_city=shipping.get('city', ''),
            shipping_postal_code=shipping.get('postal_code', ''),
            shipping_country=shipping.get('country', 'Morocco'),
            payment_method=PaymentMethod(payment_method) if payment_method else PaymentMethod.CASH_ON_DELIVERY,
            notes=notes,
            subtotal=0,
            shipping_cost=45,  # Default shipping
            total_amount=0,
            currency='MAD'
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Add order items
        subtotal = 0
        for item_data in items:
            variant_id = item_data.get('variant_id')
            quantity = item_data.get('quantity', 1)
            
            variant = ProductVariant.query.get(variant_id)
            if not variant:
                return jsonify({'success': False, 'error': f'Product variant not found: {variant_id}'}), 400
            
            if variant.stock_qty < quantity:
                return jsonify({
                    'success': False, 
                    'error': f'Insufficient stock for {variant.product.name} - {variant.size}'
                }), 400
            
            # Determine price (use promo price if available)
            unit_price = variant.price
            promo_price = variant.promo_price if variant.promo_price else None
            
            line_total = (promo_price if promo_price else unit_price) * quantity
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=variant.product_id,
                variant_id=variant.id,
                product_name=variant.product.name,
                variant_size=variant.size,
                unit_price=unit_price,
                promo_price=promo_price,
                quantity=quantity,
                line_total=line_total
            )
            
            db.session.add(order_item)
            
            # Update stock
            variant.stock_qty -= quantity
            
            subtotal += line_total
        
        # Apply promo code if provided
        discount_amount = 0
        if promo_code:
            promo = Promotion.query.filter_by(code=promo_code.upper(), is_active=True).first()
            if promo and promo.is_valid:
                discount_amount = promo.calculate_discount(subtotal)
                order.promo_code = promo_code.upper()
                order.promo_discount = discount_amount
                promo.usage_count += 1
        
        # Calculate totals
        order.subtotal = subtotal
        order.discount_amount = discount_amount
        order.total_amount = subtotal + order.shipping_cost - discount_amount
        
        # Free shipping for orders over 500 MAD
        if subtotal >= 500:
            order.shipping_cost = 0
            order.total_amount = subtotal - discount_amount
        
        db.session.commit()

        # An accepted order must remain accepted even if the SMTP provider is unavailable.
        send_new_order_notification(order)
        
        return jsonify({
            'success': True,
            'data': order.to_dict(),
            'message': 'Order created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status."""
    try:
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'success': False, 'error': 'Status is required'}), 400
        
        try:
            order.status = OrderStatus(new_status)
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid status'}), 400
        
        # Update timestamp based on status
        if new_status == 'paid':
            order.payment_status = PaymentStatus.PAID
            order.paid_at = datetime.utcnow()
        elif new_status == 'shipped':
            order.shipped_at = datetime.utcnow()
        elif new_status == 'delivered':
            order.delivered_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': order.to_dict(include_items=False),
            'message': 'Order status updated'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@orders_bp.route('/validate-promo', methods=['POST'])
def validate_promo_code():
    """Validate a promo code."""
    try:
        data = request.get_json()
        code = data.get('code')
        order_amount = data.get('order_amount', 0)
        
        if not code:
            return jsonify({'success': False, 'error': 'Promo code is required'}), 400
        
        promo = Promotion.query.filter_by(code=code.upper(), is_active=True).first()
        
        if not promo:
            return jsonify({'success': False, 'error': 'Invalid promo code'}), 404
        
        if not promo.is_valid:
            return jsonify({'success': False, 'error': 'Promo code is expired or no longer valid'}), 400
        
        discount = promo.calculate_discount(order_amount)
        
        return jsonify({
            'success': True,
            'data': {
                'code': promo.code,
                'name': promo.name,
                'discount_type': promo.discount_type,
                'discount_value': float(promo.discount_value),
                'discount_amount': discount,
                'min_order_amount': float(promo.min_order_amount) if promo.min_order_amount else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
