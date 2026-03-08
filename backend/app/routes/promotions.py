from flask import Blueprint, request, jsonify
from app import db
from app.models.promotion import Promotion, FeatureFlag, HomepageSection

promotions_bp = Blueprint('promotions', __name__)

# Promotion Routes

@promotions_bp.route('/', methods=['GET'])
def get_promotions():
    """Get all promotions."""
    try:
        active_only = request.args.get('active_only', 'false').lower() == 'true'
        
        query = Promotion.query
        
        if active_only:
            query = query.filter_by(is_active=True)
        
        promotions = query.order_by(Promotion.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [p.to_dict() for p in promotions]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/<int:promo_id>', methods=['GET'])
def get_promotion(promo_id):
    """Get a single promotion."""
    try:
        promo = Promotion.query.get(promo_id)
        
        if not promo:
            return jsonify({'success': False, 'error': 'Promotion not found'}), 404
        
        return jsonify({
            'success': True,
            'data': promo.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/', methods=['POST'])
def create_promotion():
    """Create a new promotion."""
    try:
        data = request.get_json()
        
        promo = Promotion(
            name=data.get('name'),
            code=data.get('code', '').upper(),
            description=data.get('description'),
            discount_type=data.get('discount_type', 'percentage'),
            discount_value=data.get('discount_value', 0),
            min_order_amount=data.get('min_order_amount', 0),
            max_discount_amount=data.get('max_discount_amount'),
            usage_limit=data.get('usage_limit'),
            per_customer_limit=data.get('per_customer_limit', 1),
            is_active=data.get('is_active', True),
            is_auto_apply=data.get('is_auto_apply', False),
            banner_text=data.get('banner_text'),
            banner_color=data.get('banner_color', '#C9A962')
        )
        
        db.session.add(promo)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': promo.to_dict(),
            'message': 'Promotion created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/<int:promo_id>', methods=['PUT'])
def update_promotion(promo_id):
    """Update a promotion."""
    try:
        promo = Promotion.query.get(promo_id)
        
        if not promo:
            return jsonify({'success': False, 'error': 'Promotion not found'}), 404
        
        data = request.get_json()
        
        for field in ['name', 'description', 'discount_type', 'discount_value', 
                      'min_order_amount', 'max_discount_amount', 'usage_limit',
                      'per_customer_limit', 'is_active', 'is_auto_apply',
                      'banner_text', 'banner_color']:
            if field in data:
                setattr(promo, field, data[field])
        
        if 'code' in data:
            promo.code = data['code'].upper()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': promo.to_dict(),
            'message': 'Promotion updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# Feature Flag Routes

@promotions_bp.route('/flags', methods=['GET'])
def get_feature_flags():
    """Get all feature flags."""
    try:
        flags = FeatureFlag.query.order_by(FeatureFlag.display_order).all()
        
        return jsonify({
            'success': True,
            'data': [f.to_dict() for f in flags]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/flags/<key>', methods=['GET'])
def get_feature_flag(key):
    """Get a single feature flag by key."""
    try:
        flag = FeatureFlag.query.filter_by(key=key).first()
        
        if not flag:
            return jsonify({'success': False, 'error': 'Feature flag not found'}), 404
        
        return jsonify({
            'success': True,
            'data': flag.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/flags', methods=['POST'])
def create_feature_flag():
    """Create a new feature flag."""
    try:
        data = request.get_json()
        
        flag = FeatureFlag(
            key=data.get('key'),
            name=data.get('name'),
            description=data.get('description'),
            value_type=data.get('value_type', 'boolean'),
            boolean_value=data.get('boolean_value', False),
            string_value=data.get('string_value'),
            number_value=data.get('number_value'),
            section_title=data.get('section_title'),
            section_subtitle=data.get('section_subtitle'),
            display_order=data.get('display_order', 0),
            is_enabled=data.get('is_enabled', False)
        )
        
        db.session.add(flag)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': flag.to_dict(),
            'message': 'Feature flag created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/flags/<key>', methods=['PUT'])
def update_feature_flag(key):
    """Update a feature flag."""
    try:
        flag = FeatureFlag.query.filter_by(key=key).first()
        
        if not flag:
            return jsonify({'success': False, 'error': 'Feature flag not found'}), 404
        
        data = request.get_json()
        
        for field in ['name', 'description', 'value_type', 'boolean_value',
                      'string_value', 'number_value', 'section_title',
                      'section_subtitle', 'display_order', 'is_enabled']:
            if field in data:
                setattr(flag, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': flag.to_dict(),
            'message': 'Feature flag updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


# Homepage Section Routes

@promotions_bp.route('/homepage', methods=['GET'])
def get_homepage_sections():
    """Get all enabled homepage sections."""
    try:
        sections = HomepageSection.query.filter_by(
            is_enabled=True
        ).order_by(HomepageSection.display_order).all()
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in sections]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@promotions_bp.route('/homepage', methods=['POST'])
def create_homepage_section():
    """Create a homepage section."""
    try:
        data = request.get_json()
        
        section = HomepageSection(
            key=data.get('key'),
            name=data.get('name'),
            title=data.get('title'),
            subtitle=data.get('subtitle'),
            button_text=data.get('button_text'),
            button_link=data.get('button_link'),
            image_url=data.get('image_url'),
            display_order=data.get('display_order', 0),
            is_enabled=data.get('is_enabled', True),
            background_color=data.get('background_color'),
            text_color=data.get('text_color'),
            section_type=data.get('section_type', 'content'),
            product_filter=data.get('product_filter'),
            product_limit=data.get('product_limit', 4)
        )
        
        db.session.add(section)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': section.to_dict(),
            'message': 'Homepage section created successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
