from datetime import datetime
from enum import Enum
from app import db

class OrderStatus(Enum):
    """Order status enumeration."""
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    PROCESSING = 'processing'
    SHIPPED = 'shipped'
    DELIVERED = 'delivered'
    CANCELLED = 'cancelled'
    REFUNDED = 'refunded'

class PaymentStatus(Enum):
    """Payment status enumeration."""
    PENDING = 'pending'
    PAID = 'paid'
    FAILED = 'failed'
    REFUNDED = 'refunded'

class PaymentMethod(Enum):
    """Payment method enumeration."""
    CASH_ON_DELIVERY = 'cash_on_delivery'
    CREDIT_CARD = 'credit_card'
    BANK_TRANSFER = 'bank_transfer'
    PAYPAL = 'paypal'

class Order(db.Model):
    """Order model."""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    
    # Customer info (can be guest or registered)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    # Guest checkout fields
    guest_email = db.Column(db.String(255))
    guest_phone = db.Column(db.String(50))
    guest_full_name = db.Column(db.String(200))
    
    # Shipping address
    shipping_address = db.Column(db.Text)
    shipping_city = db.Column(db.String(100))
    shipping_postal_code = db.Column(db.String(20))
    shipping_country = db.Column(db.String(100), default='Morocco')
    
    # Order totals
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    shipping_cost = db.Column(db.Numeric(10, 2), default=0)
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='MAD')
    
    # Status
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = db.Column(db.Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_method = db.Column(db.Enum(PaymentMethod))
    
    # Tracking
    tracking_number = db.Column(db.String(100))
    notes = db.Column(db.Text)
    internal_notes = db.Column(db.Text)
    
    # Promo code
    promo_code = db.Column(db.String(50))
    promo_discount = db.Column(db.Numeric(10, 2), default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    paid_at = db.Column(db.DateTime)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    customer = db.relationship('Customer', backref='orders')
    
    def __repr__(self):
        return f'<Order {self.order_number}>'
    
    def generate_order_number(self):
        """Generate a unique order number."""
        timestamp = datetime.utcnow().strftime('%Y%m%d')
        return f'ORD-{timestamp}-{self.id:06d}'
    
    def calculate_totals(self):
        """Calculate order totals from items."""
        self.subtotal = sum(item.line_total for item in self.items)
        self.total_amount = self.subtotal + self.shipping_cost - self.discount_amount
    
    def to_dict(self, include_items=True):
        data = {
            'id': self.id,
            'order_number': self.order_number,
            'customer': self.customer.to_dict() if self.customer else {
                'full_name': self.guest_full_name,
                'email': self.guest_email,
                'phone': self.guest_phone
            },
            'shipping': {
                'address': self.shipping_address,
                'city': self.shipping_city,
                'postal_code': self.shipping_postal_code,
                'country': self.shipping_country
            },
            'totals': {
                'subtotal': float(self.subtotal),
                'shipping_cost': float(self.shipping_cost),
                'discount_amount': float(self.discount_amount),
                'tax_amount': float(self.tax_amount),
                'total_amount': float(self.total_amount),
                'currency': self.currency
            },
            'status': self.status.value if self.status else None,
            'payment_status': self.payment_status.value if self.payment_status else None,
            'payment_method': self.payment_method.value if self.payment_method else None,
            'tracking_number': self.tracking_number,
            'notes': self.notes,
            'promo_code': self.promo_code,
            'promo_discount': float(self.promo_discount) if self.promo_discount else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'shipped_at': self.shipped_at.isoformat() if self.shipped_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }
        
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
        
        return data


class OrderItem(db.Model):
    """Order item model."""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.id'))
    
    # Item details (snapshot at time of order)
    product_name = db.Column(db.String(200), nullable=False)
    variant_size = db.Column(db.String(50))
    
    # Pricing
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    promo_price = db.Column(db.Numeric(10, 2))
    quantity = db.Column(db.Integer, nullable=False)
    line_total = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    variant = db.relationship('ProductVariant')
    
    def __repr__(self):
        return f'<OrderItem {self.product_name} x {self.quantity}>'
    
    def calculate_line_total(self):
        """Calculate line total."""
        price = self.promo_price if self.promo_price else self.unit_price
        self.line_total = price * self.quantity
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'variant_id': self.variant_id,
            'product_name': self.product_name,
            'variant_size': self.variant_size,
            'unit_price': float(self.unit_price),
            'promo_price': float(self.promo_price) if self.promo_price else None,
            'quantity': self.quantity,
            'line_total': float(self.line_total),
            'product_image': self.product.image_url_local if self.product else None
        }
