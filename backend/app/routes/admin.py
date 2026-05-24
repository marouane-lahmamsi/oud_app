from datetime import datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path
import re
from urllib.parse import urlparse

from flask import Blueprint, current_app, jsonify, render_template, request, send_from_directory
from werkzeug.utils import secure_filename

from app import db
from app.models.product import Category, Product, ProductVariant

admin_bp = Blueprint('admin', __name__)
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}


def slugify(value):
    """Create a URL-friendly slug."""
    value = (value or '').strip().lower()
    value = re.sub(r'[^a-z0-9]+', '-', value)
    return value.strip('-')


def parse_bool(value, default=False):
    """Parse bool values from JSON or form payloads."""
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def parse_list_field(value):
    """Accept arrays or comma/newline separated text."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]

    parts = re.split(r'[\n,]+', str(value))
    return [part.strip() for part in parts if part.strip()]


def parse_decimal(value, field_name, allow_empty=False):
    """Convert values to Decimal for SQLAlchemy numeric columns."""
    if value in (None, ''):
        if allow_empty:
            return None
        raise ValueError(f'{field_name} is required')

    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError):
        raise ValueError(f'{field_name} must be a valid number')


def parse_int(value, field_name, default=None):
    """Convert values to integer."""
    if value in (None, ''):
        if default is not None:
            return default
        raise ValueError(f'{field_name} is required')

    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError(f'{field_name} must be an integer')


def get_payload():
    """Read JSON payload first, fallback to form data."""
    return request.get_json(silent=True) or request.form.to_dict()


def parse_optional_str(value):
    """Normalize optional text values."""
    cleaned = str(value or '').strip()
    return cleaned or None


def parse_display_order(value):
    """Parse display order and fallback to 0."""
    if value in (None, ''):
        return 0
    return parse_int(value, 'display_order', default=0)


def merge_with_defaults(values, defaults):
    """Merge distinct values with defaults while preserving readability."""
    items = [item for item in defaults if item]
    for value in values:
        if value and value not in items:
            items.append(value)
    return items


def get_product_option_values():
    """Collect existing values for dropdown fields."""
    origins = db.session.query(Product.origin).filter(
        Product.origin.isnot(None),
        Product.origin != ''
    ).distinct().order_by(Product.origin.asc()).all()

    grades = db.session.query(Product.grade).filter(
        Product.grade.isnot(None),
        Product.grade != ''
    ).distinct().order_by(Product.grade.asc()).all()

    intensities = db.session.query(Product.intensity).filter(
        Product.intensity.isnot(None),
        Product.intensity != ''
    ).distinct().order_by(Product.intensity.asc()).all()

    profiles = db.session.query(Product.profile).filter(
        Product.profile.isnot(None),
        Product.profile != ''
    ).distinct().order_by(Product.profile.asc()).all()

    tags = []
    for row in Product.query.with_entities(Product.tags).all():
        for tag in row[0] or []:
            clean_tag = str(tag).strip()
            if clean_tag and clean_tag not in tags:
                tags.append(clean_tag)

    return {
        'origins': [row[0] for row in origins],
        'grades': merge_with_defaults([row[0] for row in grades], ['premium', 'superieure', 'elite']),
        'intensities': merge_with_defaults([row[0] for row in intensities], ['low', 'medium', 'high']),
        'profiles': [row[0] for row in profiles],
        'tags': tags
    }


def get_image_upload_directory():
    """Resolve where image files should be stored."""
    configured = current_app.config.get('PRODUCT_IMAGE_UPLOAD_DIR')
    if configured:
        upload_dir = Path(configured)
        upload_dir.mkdir(parents=True, exist_ok=True)
        return upload_dir

    app_root = Path(current_app.root_path)
    repo_root = app_root.parent.parent
    prod_frontend = Path('/var/www/oud_app/frontend')

    if prod_frontend.exists():
        upload_dir = prod_frontend / 'images' / 'products'
        upload_dir.mkdir(parents=True, exist_ok=True)
        return upload_dir

    upload_dir = repo_root / 'frontend' / 'public' / 'images' / 'products'
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def get_persistent_upload_directory():
    """Store uploaded images in backend folder not affected by frontend deploy sync."""
    configured = current_app.config.get('PRODUCT_IMAGE_UPLOAD_DIR')
    if configured:
        upload_dir = Path(configured)
    else:
        app_root = Path(current_app.root_path)
        repo_root = app_root.parent.parent
        prod_backend = Path('/var/www/oud_app/backend')
        base = prod_backend if prod_backend.exists() else repo_root / 'backend'
        upload_dir = base / 'uploads' / 'products'

    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def build_image_filename(filename, product_slug=''):
    """Build a safe unique file name for uploaded images."""
    safe = secure_filename(filename or '')
    extension = Path(safe).suffix.lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError('Image format not supported. Use jpg, jpeg, png, webp or gif.')

    stem = slugify(Path(safe).stem) or slugify(product_slug) or 'product-image'
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    return f'{stem}-{timestamp}{extension}'


def build_public_uploaded_url(file_name):
    """Return a public URL compatible with local and current production routing."""
    api_prefix = current_app.config.get('API_PREFIX', '/api/v1')
    public_prefix = parse_optional_str(request.headers.get('X-Forwarded-Prefix')) or ''

    referer = parse_optional_str(request.headers.get('Referer') or request.headers.get('Referrer'))
    if not public_prefix and referer:
        referer_path = urlparse(referer).path or ''
        marker = f'{api_prefix}/'
        index = referer_path.find(marker)
        if index > 0:
            public_prefix = referer_path[:index].rstrip('/')
        elif referer_path.startswith(api_prefix):
            public_prefix = ''

    configured = parse_optional_str(current_app.config.get('PUBLIC_BASE_PATH'))
    if configured:
        public_prefix = configured

    if public_prefix and not public_prefix.startswith('/'):
        public_prefix = f'/{public_prefix}'
    public_prefix = public_prefix.rstrip('/')

    return f'{public_prefix}{api_prefix}/admin/uploads/files/{file_name}'


def product_admin_dict(product):
    """Consistent admin response with category and variants."""
    data = product.to_dict(include_variants=True)
    data['category_id'] = product.category_id
    data['meta_title'] = product.meta_title
    data['meta_description'] = product.meta_description
    data['image_url_local'] = product.image_url_local
    return data


def validate_slug(slug, current_product_id=None):
    """Ensure slug is present and unique."""
    if not slug:
        raise ValueError('slug is required')

    existing = Product.query.filter_by(slug=slug).first()
    if existing and existing.id != current_product_id:
        raise ValueError('slug already exists')


def build_variants(product, variants_data):
    """Replace product variants from submitted payload."""
    if not isinstance(variants_data, list) or not variants_data:
        raise ValueError('At least one variant is required')

    normalized_variants = []
    seen_sizes = set()
    default_index = None

    for index, variant_data in enumerate(variants_data):
        size = str((variant_data or {}).get('size', '')).strip()
        if not size:
            raise ValueError(f'Variant #{index + 1}: size is required')

        size_key = size.lower()
        if size_key in seen_sizes:
            raise ValueError(f'Variant size "{size}" is duplicated')
        seen_sizes.add(size_key)

        normalized_variants.append({
            'size': size,
            'price': parse_decimal(variant_data.get('price'), f'Variant {size} price'),
            'promo_price': parse_decimal(
                variant_data.get('promo_price'),
                f'Variant {size} promo_price',
                allow_empty=True
            ),
            'stock_qty': parse_int(variant_data.get('stock_qty'), f'Variant {size} stock_qty', default=0),
            'is_active': parse_bool(variant_data.get('is_active'), default=True),
            'is_default': parse_bool(variant_data.get('is_default'), default=False),
        })

        if normalized_variants[-1]['is_default'] and default_index is None:
            default_index = index

    if default_index is None and normalized_variants:
        default_index = 0

    for index, variant_data in enumerate(normalized_variants):
        variant_data['is_default'] = index == default_index

    for variant in product.variants.all():
        db.session.delete(variant)
    db.session.flush()

    slug_prefix = product.slug.upper().replace('-', '')
    for variant_data in normalized_variants:
        size_slug = slugify(variant_data['size']).upper().replace('-', '')
        sku = f'{slug_prefix}-{size_slug}'
        variant = ProductVariant(
            product_id=product.id,
            size=variant_data['size'],
            sku=sku,
            price=variant_data['price'],
            promo_price=variant_data['promo_price'],
            stock_qty=variant_data['stock_qty'],
            is_active=variant_data['is_active'],
            is_default=variant_data['is_default']
        )
        db.session.add(variant)


def apply_product_payload(product, payload):
    """Map request payload to the product model."""
    product.name = str(payload.get('name', '')).strip()
    if not product.name:
        raise ValueError('name is required')

    slug = str(payload.get('slug') or slugify(product.name)).strip().lower()
    product.slug = slug
    with db.session.no_autoflush:
        validate_slug(slug, current_product_id=product.id)

    category_id = payload.get('category_id')
    if category_id not in (None, ''):
        category_id = parse_int(category_id, 'category_id')
        with db.session.no_autoflush:
            category = Category.query.get(category_id)
        if not category:
            raise ValueError('category_id is invalid')
        product.category_id = category.id
    else:
        product.category_id = None

    product.description = str(payload.get('description') or '').strip() or None
    product.short_description = str(payload.get('short_description') or '').strip() or None
    product.origin = str(payload.get('origin') or '').strip() or None
    product.grade = str(payload.get('grade') or '').strip() or None
    product.intensity = str(payload.get('intensity') or '').strip() or None
    product.profile = str(payload.get('profile') or '').strip() or None
    product.image_url_local = str(payload.get('image_url_local') or '').strip() or None
    product.additional_images = parse_list_field(payload.get('additional_images'))
    product.tags = parse_list_field(payload.get('tags'))
    product.meta_title = str(payload.get('meta_title') or '').strip() or None
    product.meta_description = str(payload.get('meta_description') or '').strip() or None
    product.rating = parse_decimal(payload.get('rating', 5), 'rating')
    product.review_count = parse_int(payload.get('review_count', 0), 'review_count', default=0)
    product.is_active = parse_bool(payload.get('is_active'), default=True)
    product.is_featured = parse_bool(payload.get('is_featured'), default=False)
    product.is_bestseller = parse_bool(payload.get('is_bestseller'), default=False)
    product.is_new = parse_bool(payload.get('is_new'), default=False)

    if not product.id:
        db.session.flush()

    build_variants(product, payload.get('variants', []))


@admin_bp.route('/products/ui', methods=['GET'])
def admin_products_ui():
    """Simple admin interface for managing products."""
    return render_template('admin_products.html')


@admin_bp.route('/categories', methods=['GET'])
def admin_categories():
    """List categories for the admin form."""
    categories = Category.query.order_by(Category.display_order.asc(), Category.name.asc()).all()
    return jsonify({
        'success': True,
        'data': [category.to_dict() for category in categories]
    }), 200


@admin_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category from admin UI."""
    payload = get_payload()
    name = parse_optional_str(payload.get('name'))
    if not name:
        return jsonify({'success': False, 'error': 'name is required'}), 400

    slug = slugify(payload.get('slug') or name)
    if not slug:
        return jsonify({'success': False, 'error': 'slug is required'}), 400

    existing = Category.query.filter_by(slug=slug).first()
    if existing:
        return jsonify({'success': False, 'error': 'category slug already exists'}), 400

    category = Category(
        name=name,
        slug=slug,
        description=parse_optional_str(payload.get('description')),
        image_url=parse_optional_str(payload.get('image_url')),
        is_active=parse_bool(payload.get('is_active'), default=True),
        display_order=parse_display_order(payload.get('display_order'))
    )
    db.session.add(category)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Category created successfully',
        'data': category.to_dict()
    }), 201


@admin_bp.route('/product-options', methods=['GET'])
def admin_product_options():
    """Return distinct values to feed dropdown lists in UI."""
    return jsonify({
        'success': True,
        'data': get_product_option_values()
    }), 200


@admin_bp.route('/uploads/image', methods=['POST'])
def upload_product_image():
    """Upload product image and return public path."""
    image = request.files.get('image')
    if not image or not image.filename:
        return jsonify({'success': False, 'error': 'image file is required'}), 400

    try:
        file_name = build_image_filename(image.filename, request.form.get('slug', ''))
        upload_dir = get_persistent_upload_directory()
        destination = upload_dir / file_name

        suffix = 1
        while destination.exists():
            base_name = Path(file_name).stem
            extension = Path(file_name).suffix
            destination = upload_dir / f'{base_name}-{suffix}{extension}'
            suffix += 1

        image.save(destination)
        relative_url = build_public_uploaded_url(destination.name)

        return jsonify({
            'success': True,
            'message': 'Image uploaded successfully',
            'data': {
                'file_name': destination.name,
                'url': relative_url
            }
        }), 201
    except ValueError as exc:
        return jsonify({'success': False, 'error': str(exc)}), 400
    except Exception as exc:
        return jsonify({'success': False, 'error': str(exc)}), 500


@admin_bp.route('/uploads/files/<path:file_name>', methods=['GET'])
def serve_uploaded_image(file_name):
    """Serve uploaded images from persistent backend storage."""
    upload_dir = get_persistent_upload_directory()
    safe_name = Path(file_name).name
    file_path = upload_dir / safe_name
    if not file_path.exists():
        return jsonify({'success': False, 'error': 'Image not found'}), 404
    return send_from_directory(str(upload_dir), safe_name)


@admin_bp.route('/products', methods=['GET'])
def admin_products():
    """List products including inactive ones."""
    include_inactive = parse_bool(request.args.get('include_inactive'), default=True)
    query = Product.query
    if not include_inactive:
        query = query.filter_by(is_active=True)

    products = query.order_by(Product.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [product_admin_dict(product) for product in products]
    }), 200


@admin_bp.route('/products/<int:product_id>', methods=['GET'])
def admin_product_detail(product_id):
    """Get one product for editing."""
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'success': True,
        'data': product_admin_dict(product)
    }), 200


@admin_bp.route('/products', methods=['POST'])
def create_product():
    """Create a product with variants."""
    payload = get_payload()

    try:
        product = Product()
        db.session.add(product)
        apply_product_payload(product, payload)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'data': product_admin_dict(product)
        }), 201
    except ValueError as exc:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(exc)}), 400
    except Exception as exc:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(exc)}), 500


@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product and replace its variants."""
    payload = get_payload()
    product = Product.query.get_or_404(product_id)

    try:
        apply_product_payload(product, payload)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'data': product_admin_dict(product)
        }), 200
    except ValueError as exc:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(exc)}), 400
    except Exception as exc:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(exc)}), 500


@admin_bp.route('/products/<int:product_id>/deactivate', methods=['PATCH'])
def deactivate_product(product_id):
    """Soft-disable a product without deleting it."""
    product = Product.query.get_or_404(product_id)
    product.is_active = False
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Product deactivated successfully',
        'data': product_admin_dict(product)
    }), 200


@admin_bp.route('/products/<int:product_id>/activate', methods=['PATCH'])
def activate_product(product_id):
    """Reactivate a previously disabled product."""
    product = Product.query.get_or_404(product_id)
    product.is_active = True
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Product activated successfully',
        'data': product_admin_dict(product)
    }), 200
