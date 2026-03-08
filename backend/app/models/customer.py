from datetime import datetime
from app import db

class Customer(db.Model):
    """Customer model."""
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Personal info
    full_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), unique=True)
    phone = db.Column(db.String(50))
    
    # Address
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100), default='Morocco')
    
    # Account
    password_hash = db.Column(db.String(255))
    is_registered = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Preferences
    preferred_language = db.Column(db.String(10), default='fr')
    marketing_consent = db.Column(db.Boolean, default=False)
    
    # Statistics
    total_orders = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Numeric(10, 2), default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Customer {self.full_name}>'
    
    def to_dict(self, include_stats=True):
        data = {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'postal_code': self.postal_code,
            'country': self.country,
            'is_registered': self.is_registered,
            'is_active': self.is_active,
            'preferred_language': self.preferred_language,
            'marketing_consent': self.marketing_consent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_stats:
            data['stats'] = {
                'total_orders': self.total_orders,
                'total_spent': float(self.total_spent)
            }
        
        return data
    
    def update_stats(self):
        """Update customer statistics."""
        from app.models.order import Order, OrderStatus
        
        self.total_orders = self.orders.filter(
            Order.status != OrderStatus.CANCELLED
        ).count()
        
        total = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.customer_id == self.id,
            Order.status != OrderStatus.CANCELLED
        ).scalar()
        
        self.total_spent = total or 0
