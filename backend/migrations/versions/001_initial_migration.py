"""Initial migration - Create all tables

Revision ID: 001
Revises: 
Create Date: 2026-02-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create categories table
    op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('slug', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('display_order', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )

    # Create customers table
    op.create_table('customers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(200), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('postal_code', sa.String(20), nullable=True),
        sa.Column('country', sa.String(100), default='Morocco'),
        sa.Column('is_registered', sa.Boolean(), default=False),
        sa.Column('total_orders', sa.Integer(), default=0),
        sa.Column('total_spent', sa.Numeric(10, 2), default=0),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Create feature_flags table
    op.create_table('feature_flags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(100), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('value_type', sa.String(20), default='boolean'),
        sa.Column('boolean_value', sa.Boolean(), default=False),
        sa.Column('string_value', sa.Text(), nullable=True),
        sa.Column('number_value', sa.Numeric(10, 2), nullable=True),
        sa.Column('section_title', sa.String(200), nullable=True),
        sa.Column('section_subtitle', sa.String(500), nullable=True),
        sa.Column('display_order', sa.Integer(), default=0),
        sa.Column('is_enabled', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )

    # Create homepage_sections table
    op.create_table('homepage_sections',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('key', sa.String(100), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('title', sa.String(500), nullable=True),
        sa.Column('subtitle', sa.Text(), nullable=True),
        sa.Column('button_text', sa.String(100), nullable=True),
        sa.Column('button_link', sa.String(500), nullable=True),
        sa.Column('image_url', sa.String(500), nullable=True),
        sa.Column('display_order', sa.Integer(), default=0),
        sa.Column('is_enabled', sa.Boolean(), default=True),
        sa.Column('background_color', sa.String(50), nullable=True),
        sa.Column('text_color', sa.String(50), nullable=True),
        sa.Column('section_type', sa.String(50), default='content'),
        sa.Column('product_filter', sa.String(50), nullable=True),
        sa.Column('product_limit', sa.Integer(), default=4),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('key')
    )

    # Create promotions table
    op.create_table('promotions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('code', sa.String(50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('discount_type', sa.String(20), default='percentage'),
        sa.Column('discount_value', sa.Numeric(10, 2), default=0),
        sa.Column('min_order_amount', sa.Numeric(10, 2), default=0),
        sa.Column('max_discount_amount', sa.Numeric(10, 2), nullable=True),
        sa.Column('usage_limit', sa.Integer(), nullable=True),
        sa.Column('usage_count', sa.Integer(), default=0),
        sa.Column('per_customer_limit', sa.Integer(), default=1),
        sa.Column('starts_at', sa.DateTime(), nullable=True),
        sa.Column('ends_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_auto_apply', sa.Boolean(), default=False),
        sa.Column('banner_text', sa.String(500), nullable=True),
        sa.Column('banner_color', sa.String(50), default='#C9A962'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # Create products table
    op.create_table('products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('short_description', sa.String(500), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('origin', sa.String(100), nullable=True),
        sa.Column('grade', sa.String(50), nullable=True),
        sa.Column('intensity', sa.String(20), nullable=True),
        sa.Column('profile', sa.String(50), nullable=True),
        sa.Column('image_url_local', sa.String(500), nullable=True),
        sa.Column('additional_images', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_featured', sa.Boolean(), default=False),
        sa.Column('is_bestseller', sa.Boolean(), default=False),
        sa.Column('is_new', sa.Boolean(), default=False),
        sa.Column('rating', sa.Numeric(2, 1), default=5.0),
        sa.Column('review_count', sa.Integer(), default=0),
        sa.Column('meta_title', sa.String(200), nullable=True),
        sa.Column('meta_description', sa.String(500), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    op.create_foreign_key('fk_products_category', 'products', 'categories', ['category_id'], ['id'])

    # Create product_variants table
    op.create_table('product_variants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('size', sa.String(50), nullable=False),
        sa.Column('sku', sa.String(100), nullable=True),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('promo_price', sa.Numeric(10, 2), nullable=True),
        sa.Column('cost_price', sa.Numeric(10, 2), nullable=True),
        sa.Column('stock_qty', sa.Integer(), default=0),
        sa.Column('low_stock_threshold', sa.Integer(), default=5),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_default', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('sku')
    )
    op.create_foreign_key('fk_variants_product', 'product_variants', 'products', ['product_id'], ['id'])

    # Create orders table
    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_number', sa.String(50), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=True),
        sa.Column('guest_email', sa.String(255), nullable=True),
        sa.Column('guest_phone', sa.String(50), nullable=True),
        sa.Column('guest_full_name', sa.String(200), nullable=True),
        sa.Column('shipping_address', sa.Text(), nullable=True),
        sa.Column('shipping_city', sa.String(100), nullable=True),
        sa.Column('shipping_postal_code', sa.String(20), nullable=True),
        sa.Column('shipping_country', sa.String(100), default='Morocco'),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('shipping_cost', sa.Numeric(10, 2), default=0),
        sa.Column('discount_amount', sa.Numeric(10, 2), default=0),
        sa.Column('tax_amount', sa.Numeric(10, 2), default=0),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('currency', sa.String(3), default='MAD'),
        sa.Column('status', sa.Enum('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', name='orderstatus'), default='pending'),
        sa.Column('payment_status', sa.Enum('pending', 'paid', 'failed', 'refunded', name='paymentstatus'), default='pending'),
        sa.Column('payment_method', sa.Enum('cash_on_delivery', 'credit_card', 'bank_transfer', 'paypal', name='paymentmethod'), nullable=True),
        sa.Column('tracking_number', sa.String(100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('promo_code', sa.String(50), nullable=True),
        sa.Column('promo_discount', sa.Numeric(10, 2), default=0),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('paid_at', sa.DateTime(), nullable=True),
        sa.Column('shipped_at', sa.DateTime(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('order_number')
    )
    op.create_foreign_key('fk_orders_customer', 'orders', 'customers', ['customer_id'], ['id'])

    # Create order_items table
    op.create_table('order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('variant_id', sa.Integer(), nullable=True),
        sa.Column('product_name', sa.String(200), nullable=False),
        sa.Column('variant_size', sa.String(50), nullable=True),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('promo_price', sa.Numeric(10, 2), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('line_total', sa.Numeric(10, 2), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_foreign_key('fk_items_order', 'order_items', 'orders', ['order_id'], ['id'])
    op.create_foreign_key('fk_items_product', 'order_items', 'products', ['product_id'], ['id'])
    op.create_foreign_key('fk_items_variant', 'order_items', 'product_variants', ['variant_id'], ['id'])


def downgrade():
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('product_variants')
    op.drop_table('products')
    op.drop_table('promotions')
    op.drop_table('homepage_sections')
    op.drop_table('feature_flags')
    op.drop_table('customers')
    op.drop_table('categories')
