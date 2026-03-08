from datetime import datetime
from app import db

class Category(db.Model):
    """Product category model."""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy='dynamic')
    
    def __repr__(self):
        return f'<Category {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'display_order': self.display_order,
            'product_count': self.products.filter_by(is_active=True).count()
        }


class Product(db.Model):
    """Product model for oud items."""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    description = db.Column(db.Text)
    short_description = db.Column(db.String(500))
    
    # Category & Attributes
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    origin = db.Column(db.String(100))
    grade = db.Column(db.String(50))  # premium, superieure, elite
    intensity = db.Column(db.String(20))  # low, medium, high
    profile = db.Column(db.String(50))  # boise, epice, floral, etc.
    
    # Media
    image_url_local = db.Column(db.String(500))
    additional_images = db.Column(db.JSON, default=list)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_bestseller = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=False)
    
    # Ratings
    rating = db.Column(db.Numeric(2, 1), default=5.0)
    review_count = db.Column(db.Integer, default=0)
    
    # SEO
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(500))
    tags = db.Column(db.JSON, default=list)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    variants = db.relationship('ProductVariant', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product', lazy='dynamic')
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    @property
    def base_price(self):
        """Get the base price from the first variant."""
        variant = self.variants.order_by(ProductVariant.price.asc()).first()
        return float(variant.price) if variant else 0
    
    @property
    def base_promo_price(self):
        """Get the base promo price from the first variant."""
        variant = self.variants.order_by(ProductVariant.price.asc()).first()
        return float(variant.promo_price) if variant and variant.promo_price else None
    
    def to_dict(self, include_variants=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'short_description': self.short_description,
            'category': self.category.to_dict() if self.category else None,
            'origin': self.origin,
            'grade': self.grade,
            'intensity': self.intensity,
            'profile': self.profile,
            'image_url': self.image_url_local,
            'additional_images': self.additional_images or [],
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_bestseller': self.is_bestseller,
            'is_new': self.is_new,
            'rating': float(self.rating),
            'review_count': self.review_count,
            'tags': self.tags or [],
            'base_price': self.base_price,
            'base_promo_price': self.base_promo_price,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_variants:
            data['variants'] = [v.to_dict() for v in self.variants.all()]
        
        return data


class ProductVariant(db.Model):
    """Product variant model for different sizes/formats."""
    __tablename__ = 'product_variants'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Variant attributes
    size = db.Column(db.String(50), nullable=False)  # 10g, 50g, 100g, 200g
    sku = db.Column(db.String(100), unique=True)
    
    # Pricing
    price = db.Column(db.Numeric(10, 2), nullable=False)
    promo_price = db.Column(db.Numeric(10, 2))
    cost_price = db.Column(db.Numeric(10, 2))
    
    # Inventory
    stock_qty = db.Column(db.Integer, default=0)
    low_stock_threshold = db.Column(db.Integer, default=5)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_default = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductVariant {self.product.name} - {self.size}>'
    
    @property
    def is_in_stock(self):
        return self.stock_qty > 0
    
    @property
    def is_low_stock(self):
        return 0 < self.stock_qty <= self.low_stock_threshold
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'size': self.size,
            'sku': self.sku,
            'price': float(self.price),
            'promo_price': float(self.promo_price) if self.promo_price else None,
            'stock_qty': self.stock_qty,
            'is_in_stock': self.is_in_stock,
            'is_low_stock': self.is_low_stock,
            'is_active': self.is_active,
            'is_default': self.is_default
        }
