from flask import Blueprint, request, jsonify
from sqlalchemy import or_, and_
from app import db
from app.models.product import Product, Category, ProductVariant
from app.models.promotion import Promotion

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products with filtering and pagination."""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        intensity = request.args.get('intensity')
        profile = request.args.get('profile')
        origin = request.args.get('origin')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        is_featured = request.args.get('is_featured', type=bool)
        is_bestseller = request.args.get('is_bestseller', type=bool)
        is_new = request.args.get('is_new', type=bool)
        search = request.args.get('search')
        
        # Base query
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if category:
            query = query.join(Category).filter(Category.slug == category)
        
        if intensity:
            query = query.filter(Product.intensity == intensity)
        
        if profile:
            query = query.filter(Product.profile == profile)
        
        if origin:
            query = query.filter(Product.origin == origin)
        
        if is_featured:
            query = query.filter(Product.is_featured == True)
        
        if is_bestseller:
            query = query.filter(Product.is_bestseller == True)
        
        if is_new:
            query = query.filter(Product.is_new == True)
        
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.tags.contains([search])
                )
            )
        
        # Price filter (check variants)
        if min_price is not None or max_price is not None:
            variant_query = ProductVariant.query
            if min_price is not None:
                variant_query = variant_query.filter(ProductVariant.price >= min_price)
            if max_price is not None:
                variant_query = variant_query.filter(ProductVariant.price <= max_price)
            product_ids = [v.product_id for v in variant_query.all()]
            query = query.filter(Product.id.in_(product_ids))
        
        # Pagination
        pagination = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        products = pagination.items
        
        return jsonify({
            'success': True,
            'data': [p.to_dict() for p in products],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/<slug>', methods=['GET'])
def get_product(slug):
    """Get a single product by slug."""
    try:
        product = Product.query.filter_by(slug=slug, is_active=True).first()
        
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        # Get related products
        related = Product.query.filter(
            Product.id != product.id,
            Product.is_active == True,
            or_(
                Product.category_id == product.category_id,
                Product.profile == product.profile
            )
        ).limit(4).all()
        
        return jsonify({
            'success': True,
            'data': {
                'product': product.to_dict(),
                'related_products': [p.to_dict(include_variants=False) for p in related]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories."""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()
        
        return jsonify({
            'success': True,
            'data': [c.to_dict() for c in categories]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/filters', methods=['GET'])
def get_filter_options():
    """Get available filter options."""
    try:
        # Get unique values for filters
        origins = db.session.query(Product.origin).filter(
            Product.origin.isnot(None)
        ).distinct().all()
        
        profiles = db.session.query(Product.profile).filter(
            Product.profile.isnot(None)
        ).distinct().all()
        
        intensities = db.session.query(Product.intensity).filter(
            Product.intensity.isnot(None)
        ).distinct().all()
        
        # Get price range
        price_stats = db.session.query(
            db.func.min(ProductVariant.price),
            db.func.max(ProductVariant.price)
        ).filter(ProductVariant.is_active == True).first()
        
        return jsonify({
            'success': True,
            'data': {
                'origins': [o[0] for o in origins if o[0]],
                'profiles': [p[0] for p in profiles if p[0]],
                'intensities': [i[0] for i in intensities if i[0]],
                'price_range': {
                    'min': float(price_stats[0]) if price_stats[0] else 0,
                    'max': float(price_stats[1]) if price_stats[1] else 0
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products for homepage."""
    try:
        limit = request.args.get('limit', 4, type=int)
        
        products = Product.query.filter_by(
            is_active=True,
            is_featured=True
        ).order_by(Product.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [p.to_dict(include_variants=False) for p in products]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/bestsellers', methods=['GET'])
def get_bestsellers():
    """Get bestseller products."""
    try:
        limit = request.args.get('limit', 4, type=int)
        
        products = Product.query.filter_by(
            is_active=True,
            is_bestseller=True
        ).order_by(Product.rating.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [p.to_dict(include_variants=False) for p in products]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@products_bp.route('/new', methods=['GET'])
def get_new_products():
    """Get new arrival products."""
    try:
        limit = request.args.get('limit', 4, type=int)
        
        products = Product.query.filter_by(
            is_active=True,
            is_new=True
        ).order_by(Product.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'data': [p.to_dict(include_variants=False) for p in products]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
