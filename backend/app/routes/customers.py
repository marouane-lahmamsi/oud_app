from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer
from app.models.order import Order

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/', methods=['GET'])
def get_customers():
    """Get all customers (admin endpoint)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')
        
        query = Customer.query
        
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                db.or_(
                    Customer.full_name.ilike(search_term),
                    Customer.email.ilike(search_term),
                    Customer.phone.ilike(search_term)
                )
            )
        
        pagination = query.order_by(Customer.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [c.to_dict() for c in pagination.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@customers_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get a single customer by ID."""
    try:
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return jsonify({'success': False, 'error': 'Customer not found'}), 404
        
        return jsonify({
            'success': True,
            'data': customer.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@customers_bp.route('/<int:customer_id>/orders', methods=['GET'])
def get_customer_orders(customer_id):
    """Get orders for a specific customer."""
    try:
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return jsonify({'success': False, 'error': 'Customer not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        pagination = Order.query.filter_by(customer_id=customer_id).order_by(
            Order.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
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


@customers_bp.route('/', methods=['POST'])
def create_customer():
    """Create a new customer."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Check if email already exists
        if data.get('email'):
            existing = Customer.query.filter_by(email=data['email']).first()
            if existing:
                return jsonify({
                    'success': False, 
                    'error': 'Customer with this email already exists',
                    'data': existing.to_dict()
                }), 409
        
        customer = Customer(
            full_name=data.get('full_name', ''),
            email=data.get('email'),
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            city=data.get('city', ''),
            postal_code=data.get('postal_code', ''),
            country=data.get('country', 'Morocco'),
            is_registered=data.get('is_registered', False),
            marketing_consent=data.get('marketing_consent', False)
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': customer.to_dict(),
            'message': 'Customer created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@customers_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update a customer."""
    try:
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return jsonify({'success': False, 'error': 'Customer not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'full_name' in data:
            customer.full_name = data['full_name']
        if 'email' in data:
            # Check if email is already taken
            if data['email'] != customer.email:
                existing = Customer.query.filter_by(email=data['email']).first()
                if existing:
                    return jsonify({'success': False, 'error': 'Email already in use'}), 409
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'address' in data:
            customer.address = data['address']
        if 'city' in data:
            customer.city = data['city']
        if 'postal_code' in data:
            customer.postal_code = data['postal_code']
        if 'country' in data:
            customer.country = data['country']
        if 'marketing_consent' in data:
            customer.marketing_consent = data['marketing_consent']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': customer.to_dict(),
            'message': 'Customer updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
