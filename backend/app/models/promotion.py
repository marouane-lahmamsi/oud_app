from datetime import datetime
from app import db

class Promotion(db.Model):
    """Promotion model for sales and discounts."""
    __tablename__ = 'promotions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(50), unique=True)
    description = db.Column(db.Text)
    
    # Discount type
    discount_type = db.Column(db.String(20), default='percentage')  # percentage, fixed_amount
    discount_value = db.Column(db.Numeric(10, 2), default=0)  # % or amount
    
    # Limits
    min_order_amount = db.Column(db.Numeric(10, 2), default=0)
    max_discount_amount = db.Column(db.Numeric(10, 2))
    usage_limit = db.Column(db.Integer)  # Total usage limit
    usage_count = db.Column(db.Integer, default=0)
    per_customer_limit = db.Column(db.Integer, default=1)
    
    # Validity
    starts_at = db.Column(db.DateTime)
    ends_at = db.Column(db.DateTime)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_auto_apply = db.Column(db.Boolean, default=False)  # Apply automatically at checkout
    
    # Display
    banner_text = db.Column(db.String(500))
    banner_color = db.Column(db.String(50), default='#C9A962')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Promotion {self.name}>'
    
    @property
    def is_valid(self):
        """Check if promotion is currently valid."""
        if not self.is_active:
            return False
        
        now = datetime.utcnow()
        
        if self.starts_at and now < self.starts_at:
            return False
        
        if self.ends_at and now > self.ends_at:
            return False
        
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        
        return True
    
    def calculate_discount(self, order_amount):
        """Calculate discount for a given order amount."""
        if not self.is_valid:
            return 0
        
        if order_amount < self.min_order_amount:
            return 0
        
        if self.discount_type == 'percentage':
            discount = order_amount * (self.discount_value / 100)
        else:
            discount = self.discount_value
        
        if self.max_discount_amount:
            discount = min(discount, self.max_discount_amount)
        
        return float(discount)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_order_amount': float(self.min_order_amount) if self.min_order_amount else 0,
            'max_discount_amount': float(self.max_discount_amount) if self.max_discount_amount else None,
            'usage_limit': self.usage_limit,
            'usage_count': self.usage_count,
            'per_customer_limit': self.per_customer_limit,
            'starts_at': self.starts_at.isoformat() if self.starts_at else None,
            'ends_at': self.ends_at.isoformat() if self.ends_at else None,
            'is_active': self.is_active,
            'is_auto_apply': self.is_auto_apply,
            'is_valid': self.is_valid,
            'banner_text': self.banner_text,
            'banner_color': self.banner_color
        }


class FeatureFlag(db.Model):
    """Feature flag model for enabling/disabling features."""
    __tablename__ = 'feature_flags'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Value can be boolean, string, or JSON
    value_type = db.Column(db.String(20), default='boolean')  # boolean, string, number, json
    boolean_value = db.Column(db.Boolean, default=False)
    string_value = db.Column(db.Text)
    number_value = db.Column(db.Numeric(10, 2))
    
    # For homepage sections
    section_title = db.Column(db.String(200))
    section_subtitle = db.Column(db.String(500))
    display_order = db.Column(db.Integer, default=0)
    
    # Status
    is_enabled = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<FeatureFlag {self.key}>'
    
    @property
    def value(self):
        """Get the appropriate value based on type."""
        if self.value_type == 'boolean':
            return self.boolean_value
        elif self.value_type == 'string':
            return self.string_value
        elif self.value_type == 'number':
            return float(self.number_value) if self.number_value else 0
        else:
            return self.string_value
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'name': self.name,
            'description': self.description,
            'value_type': self.value_type,
            'value': self.value,
            'section_title': self.section_title,
            'section_subtitle': self.section_subtitle,
            'display_order': self.display_order,
            'is_enabled': self.is_enabled,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class HomepageSection(db.Model):
    """Homepage section configuration."""
    __tablename__ = 'homepage_sections'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    
    # Content
    title = db.Column(db.String(500))
    subtitle = db.Column(db.Text)
    button_text = db.Column(db.String(100))
    button_link = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    
    # Display settings
    display_order = db.Column(db.Integer, default=0)
    is_enabled = db.Column(db.Boolean, default=True)
    background_color = db.Column(db.String(50))
    text_color = db.Column(db.String(50))
    
    # Section type
    section_type = db.Column(db.String(50), default='content')  # hero, products, banner, content
    
    # For product sections
    product_filter = db.Column(db.String(50))  # featured, bestseller, new, category
    product_limit = db.Column(db.Integer, default=4)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<HomepageSection {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'name': self.name,
            'title': self.title,
            'subtitle': self.subtitle,
            'button_text': self.button_text,
            'button_link': self.button_link,
            'image_url': self.image_url,
            'display_order': self.display_order,
            'is_enabled': self.is_enabled,
            'background_color': self.background_color,
            'text_color': self.text_color,
            'section_type': self.section_type,
            'product_filter': self.product_filter,
            'product_limit': self.product_limit
        }
