from flask import Blueprint, jsonify
from app.models.product import Product
from app.models.promotion import Promotion, FeatureFlag, HomepageSection

public_bp = Blueprint('public', __name__)

@public_bp.route('/config', methods=['GET'])
def get_public_config():
    """Get public configuration for the frontend."""
    try:
        # Get active promotions with banners
        promotions = Promotion.query.filter_by(
            is_active=True
        ).filter(
            Promotion.banner_text.isnot(None)
        ).all()
        
        # Get enabled feature flags
        flags = FeatureFlag.query.filter_by(is_enabled=True).all()
        
        # Get homepage sections
        sections = HomepageSection.query.filter_by(
            is_enabled=True
        ).order_by(HomepageSection.display_order).all()
        
        # Build config object
        config = {
            'promotions': [p.to_dict() for p in promotions if p.is_valid],
            'features': {f.key: f.value for f in flags},
            'homepage_sections': [s.to_dict() for s in sections],
            'store_info': {
                'name': 'Medina Oud',
                'currency': 'MAD',
                'free_shipping_threshold': 500,
                'shipping_cost': 45,
                'phone': '+212 6 00 00 00 00',
                'email': 'contact@medinaoud.ma'
            }
        }
        
        return jsonify({
            'success': True,
            'data': config
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@public_bp.route('/homepage', methods=['GET'])
def get_homepage_data():
    """Get all data needed for the homepage."""
    try:
        # Get featured products
        featured = Product.query.filter_by(
            is_active=True,
            is_featured=True
        ).order_by(Product.created_at.desc()).limit(4).all()
        
        # Get bestsellers
        bestsellers = Product.query.filter_by(
            is_active=True,
            is_bestseller=True
        ).order_by(Product.rating.desc()).limit(4).all()
        
        # Get new arrivals
        new_arrivals = Product.query.filter_by(
            is_active=True,
            is_new=True
        ).order_by(Product.created_at.desc()).limit(4).all()
        
        # Get active promotions
        promotions = Promotion.query.filter_by(is_active=True).all()
        valid_promotions = [p for p in promotions if p.is_valid]
        
        # Get feature flags
        flags = FeatureFlag.query.filter_by(is_enabled=True).all()
        
        # Get homepage sections
        sections = HomepageSection.query.filter_by(
            is_enabled=True
        ).order_by(HomepageSection.display_order).all()
        
        return jsonify({
            'success': True,
            'data': {
                'featured_products': [p.to_dict(include_variants=False) for p in featured],
                'bestsellers': [p.to_dict(include_variants=False) for p in bestsellers],
                'new_arrivals': [p.to_dict(include_variants=False) for p in new_arrivals],
                'promotions': [p.to_dict() for p in valid_promotions],
                'features': {f.key: f.value for f in flags},
                'homepage_sections': [s.to_dict() for s in sections]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
