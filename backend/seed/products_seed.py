#!/usr/bin/env python3
"""Seed script to populate products from the original hardcoded data."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.product import Product, ProductVariant, Category
from app.models.promotion import Promotion, FeatureFlag, HomepageSection

# Product data migrated from the original TypeScript file
PRODUCTS_DATA = [
    {
        'name': 'Oud Al-Majlis',
        'slug': 'oud-al-majlis',
        'description': 'Un oud d\'exception aux notes boisées profondes et subtiles touches fumées. Issu des forêts d\'Aquilaria du Cambodge, vieilli pendant 15 ans pour développer toute sa complexité aromatique.',
        'short_description': 'Oud cambodgien vieilli 15 ans, notes boisées fumées',
        'origin': 'Cambodge',
        'grade': 'elite',
        'intensity': 'high',
        'profile': 'boise',
        'image_url_local': '/images/products/oud-al-majlis-1.jpg',
        'additional_images': ['/images/products/oud-al-majlis-2.jpg', '/images/products/oud-al-majlis-3.jpg'],
        'is_bestseller': True,
        'is_new': False,
        'rating': 4.9,
        'review_count': 127,
        'tags': ['cambodge', 'vieilli', 'premium', 'boise'],
        'variants': [
            {'size': '10g', 'price': 450, 'promo_price': None, 'stock_qty': 50},
            {'size': '50g', 'price': 2100, 'promo_price': 2400, 'stock_qty': 30},
            {'size': '100g', 'price': 3900, 'promo_price': 4500, 'stock_qty': 20},
            {'size': '200g', 'price': 7200, 'promo_price': 8400, 'stock_qty': 0},
        ]
    },
    {
        'name': 'Oud Al-Fajr',
        'slug': 'oud-al-fajr',
        'description': 'Un oud délicat et lumineux, parfait pour commencer la journée. Notes douces de miel et de fleurs blanches avec une base boisée subtile.',
        'short_description': 'Oud indonésien doux, notes florales et miellées',
        'origin': 'Indonésie',
        'grade': 'premium',
        'intensity': 'low',
        'profile': 'floral',
        'image_url_local': '/images/products/oud-al-fajr-1.jpg',
        'additional_images': ['/images/products/oud-al-fajr-2.jpg'],
        'is_bestseller': False,
        'is_new': True,
        'rating': 4.7,
        'review_count': 89,
        'tags': ['indonesie', 'doux', 'floral', 'quotidien'],
        'variants': [
            {'size': '10g', 'price': 280, 'promo_price': 320, 'stock_qty': 100},
            {'size': '50g', 'price': 1300, 'promo_price': 1500, 'stock_qty': 50},
            {'size': '100g', 'price': 2400, 'promo_price': 2800, 'stock_qty': 30},
            {'size': '200g', 'price': 4500, 'promo_price': 5200, 'stock_qty': 15},
        ]
    },
    {
        'name': 'Oud Al-Khaleej',
        'slug': 'oud-al-khaleej',
        'description': 'L\'essence du Golfe dans un oud puissant et charismatique. Notes épicées de safran et de cardamome sur un fond boisé intense.',
        'short_description': 'Oud style khaleeji, notes épicées puissantes',
        'origin': 'Malaisie',
        'grade': 'superieure',
        'intensity': 'high',
        'profile': 'epice',
        'image_url_local': '/images/products/oud-al-khaleej-1.jpg',
        'additional_images': ['/images/products/oud-al-khaleej-2.jpg'],
        'is_bestseller': True,
        'is_new': False,
        'rating': 4.8,
        'review_count': 156,
        'tags': ['khaleeji', 'epice', 'puissant', 'majlis'],
        'variants': [
            {'size': '10g', 'price': 380, 'promo_price': None, 'stock_qty': 80},
            {'size': '50g', 'price': 1800, 'promo_price': None, 'stock_qty': 40},
            {'size': '100g', 'price': 3400, 'promo_price': None, 'stock_qty': 25},
            {'size': '200g', 'price': 6400, 'promo_price': None, 'stock_qty': 10},
        ]
    },
    {
        'name': 'Oud Al-Mubarak',
        'slug': 'oud-al-mubarak',
        'description': 'Un oud bénit pour les moments spirituels. Notes résineuses profondes avec des touches de myrrhe et d\'encens.',
        'short_description': 'Oud spirituel, notes résineuses et sacrées',
        'origin': 'Thaïlande',
        'grade': 'superieure',
        'intensity': 'medium',
        'profile': 'resineux',
        'image_url_local': '/images/products/oud-al-mubarak-1.jpg',
        'additional_images': ['/images/products/oud-al-mubarak-2.jpg'],
        'is_bestseller': False,
        'is_new': False,
        'rating': 4.9,
        'review_count': 203,
        'tags': ['spirituel', 'resineux', 'priere', 'meditation'],
        'variants': [
            {'size': '10g', 'price': 320, 'promo_price': None, 'stock_qty': 60},
            {'size': '50g', 'price': 1500, 'promo_price': None, 'stock_qty': 35},
            {'size': '100g', 'price': 2800, 'promo_price': None, 'stock_qty': 20},
            {'size': '200g', 'price': 5200, 'promo_price': None, 'stock_qty': 0},
        ]
    },
    {
        'name': 'Oud Al-Yasmin',
        'slug': 'oud-al-yasmin',
        'description': 'Une fusion délicate entre le bois d\'oud et les fleurs de jasmin. Notes sucrées et florales qui dansent sur un fond boisé chaleureux.',
        'short_description': 'Oud floral au jasmin, délicat et élégant',
        'origin': 'Vietnam',
        'grade': 'premium',
        'intensity': 'medium',
        'profile': 'floral',
        'image_url_local': '/images/products/oud-al-yasmin-1.jpg',
        'additional_images': [],
        'is_bestseller': False,
        'is_new': True,
        'rating': 4.6,
        'review_count': 78,
        'tags': ['floral', 'jasmin', 'feminin', 'elegant'],
        'variants': [
            {'size': '10g', 'price': 340, 'promo_price': None, 'stock_qty': 70},
            {'size': '50g', 'price': 1600, 'promo_price': None, 'stock_qty': 40},
            {'size': '100g', 'price': 3000, 'promo_price': None, 'stock_qty': 25},
            {'size': '200g', 'price': 5600, 'promo_price': None, 'stock_qty': 12},
        ]
    },
    {
        'name': 'Oud Al-Sahra',
        'slug': 'oud-al-sahra',
        'description': 'L\'âme du désert capturée dans l\'oud. Notes fumées et sablonneuses qui évoquent les dunes au crépuscule.',
        'short_description': 'Oud fumé du désert, notes mystérieuses',
        'origin': 'Yémen',
        'grade': 'elite',
        'intensity': 'high',
        'profile': 'fume',
        'image_url_local': '/images/products/oud-al-sahra-1.jpg',
        'additional_images': [],
        'is_bestseller': False,
        'is_new': False,
        'rating': 4.8,
        'review_count': 94,
        'tags': ['fume', 'desert', 'mysterieux', 'intense'],
        'variants': [
            {'size': '10g', 'price': 420, 'promo_price': None, 'stock_qty': 40},
            {'size': '50g', 'price': 2000, 'promo_price': None, 'stock_qty': 20},
            {'size': '100g', 'price': 3800, 'promo_price': None, 'stock_qty': 0},
            {'size': '200g', 'price': 7200, 'promo_price': None, 'stock_qty': 0},
        ]
    },
    {
        'name': 'Oud Al-Misk',
        'slug': 'oud-al-misk',
        'description': 'Un oud sucré et enveloppant avec des notes de miel et de vanille. Parfait pour ceux qui préfèrent les parfums gourmands.',
        'short_description': 'Oud sucré gourmand, notes de miel et vanille',
        'origin': 'Inde',
        'grade': 'premium',
        'intensity': 'low',
        'profile': 'sucre',
        'image_url_local': '/images/products/oud-al-misk-1.jpg',
        'additional_images': [],
        'is_bestseller': False,
        'is_new': False,
        'rating': 4.5,
        'review_count': 112,
        'tags': ['sucre', 'gourmand', 'accessible', 'miel'],
        'variants': [
            {'size': '10g', 'price': 260, 'promo_price': None, 'stock_qty': 120},
            {'size': '50g', 'price': 1200, 'promo_price': None, 'stock_qty': 60},
            {'size': '100g', 'price': 2200, 'promo_price': None, 'stock_qty': 35},
            {'size': '200g', 'price': 4000, 'promo_price': None, 'stock_qty': 18},
        ]
    },
    {
        'name': 'Oud Al-Oud',
        'slug': 'oud-al-oud',
        'description': 'L\'oud dans sa forme la plus pure et traditionnelle. Sans artifice, sans ajout, juste l\'essence même du bois sacré.',
        'short_description': 'Oud pur traditionnel, authenticité absolue',
        'origin': 'Brunei',
        'grade': 'elite',
        'intensity': 'medium',
        'profile': 'boise',
        'image_url_local': '/images/products/oud-al-oud-1.jpg',
        'additional_images': [],
        'is_bestseller': False,
        'is_new': False,
        'rating': 5.0,
        'review_count': 67,
        'tags': ['pur', 'traditionnel', 'authentique', 'elite'],
        'variants': [
            {'size': '10g', 'price': 500, 'promo_price': None, 'stock_qty': 30},
            {'size': '50g', 'price': 2400, 'promo_price': None, 'stock_qty': 15},
            {'size': '100g', 'price': 4600, 'promo_price': None, 'stock_qty': 8},
            {'size': '200g', 'price': 8800, 'promo_price': None, 'stock_qty': 0},
        ]
    },
]

# Categories
CATEGORIES_DATA = [
    {'name': 'Oud Naturel', 'slug': 'oud-naturel', 'description': 'Oud 100% naturel de qualité premium'},
    {'name': 'Coffrets', 'slug': 'coffrets', 'description': 'Coffrets cadeaux et packs spéciaux'},
    {'name': 'Accessoires', 'slug': 'accessoires', 'description': 'Brûleurs, charbons et accessoires'},
]

# Promotions
PROMOTIONS_DATA = [
    {
        'name': 'Livraison Gratuite',
        'code': None,
        'description': 'Livraison gratuite pour toute commande de 500 DH ou plus',
        'discount_type': 'fixed_amount',
        'discount_value': 45,
        'min_order_amount': 500,
        'is_auto_apply': True,
        'banner_text': 'Livraison gratuite dès 500 DH d\'achat',
        'banner_color': '#C9A962',
        'is_active': True
    },
    {
        'name': 'Nouveau Client',
        'code': 'WELCOME10',
        'description': '10% de réduction pour votre première commande',
        'discount_type': 'percentage',
        'discount_value': 10,
        'min_order_amount': 200,
        'max_discount_amount': 200,
        'usage_limit': 100,
        'is_auto_apply': False,
        'banner_text': 'Code WELCOME10 : 10% sur votre première commande',
        'banner_color': '#4A7C59',
        'is_active': True
    }
]

# Feature Flags
FEATURE_FLAGS_DATA = [
    {
        'key': 'promo_banner_enabled',
        'name': 'Promo Banner',
        'description': 'Show promotional banner on homepage',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    },
    {
        'key': 'free_shipping_enabled',
        'name': 'Free Shipping',
        'description': 'Enable free shipping for orders over threshold',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    },
    {
        'key': 'free_shipping_threshold',
        'name': 'Free Shipping Threshold',
        'description': 'Minimum order amount for free shipping',
        'value_type': 'number',
        'number_value': 500,
        'is_enabled': True
    },
    {
        'key': 'featured_products_enabled',
        'name': 'Featured Products Section',
        'description': 'Show featured products on homepage',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    },
    {
        'key': 'bestsellers_enabled',
        'name': 'Bestsellers Section',
        'description': 'Show bestsellers on homepage',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    },
    {
        'key': 'new_arrivals_enabled',
        'name': 'New Arrivals Section',
        'description': 'Show new arrivals on homepage',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    },
    {
        'key': 'quiz_enabled',
        'name': 'Quiz Feature',
        'description': 'Enable the product recommendation quiz',
        'value_type': 'boolean',
        'boolean_value': True,
        'is_enabled': True
    }
]

# Homepage Sections
HOMEPAGE_SECTIONS_DATA = [
    {
        'key': 'hero',
        'name': 'Hero Section',
        'title': 'Découvrez l\'Art de l\'Oud Authentique',
        'subtitle': 'Oud 100% naturel sélectionné aux quatre coins du monde. Du Cambodge au Yémen, découvrez des arômes d\'exception.',
        'button_text': 'Découvrir la Collection',
        'button_link': '/collection',
        'image_url': '/images/hero/hero-1.jpg',
        'section_type': 'hero',
        'display_order': 1,
        'is_enabled': True
    },
    {
        'key': 'featured',
        'name': 'Featured Products',
        'title': 'Nos Coups de Cœur',
        'subtitle': 'Sélection de nos oud les plus appréciés',
        'section_type': 'products',
        'product_filter': 'featured',
        'product_limit': 4,
        'display_order': 2,
        'is_enabled': True
    },
    {
        'key': 'bestsellers',
        'name': 'Bestsellers',
        'title': 'Les Favoris',
        'subtitle': 'Les oud préférés de nos clients',
        'section_type': 'products',
        'product_filter': 'bestseller',
        'product_limit': 4,
        'display_order': 3,
        'is_enabled': True
    },
    {
        'key': 'quiz',
        'name': 'Quiz CTA',
        'title': 'Trouvez Votre Oud Idéal',
        'subtitle': 'Répondez à quelques questions pour découvrir l\'oud parfait pour vous.',
        'button_text': 'Commencer le Quiz',
        'button_link': '/quiz',
        'section_type': 'content',
        'display_order': 4,
        'is_enabled': True
    }
]


def seed_categories():
    """Seed categories."""
    print("Seeding categories...")
    for cat_data in CATEGORIES_DATA:
        existing = Category.query.filter_by(slug=cat_data['slug']).first()
        if not existing:
            category = Category(**cat_data)
            db.session.add(category)
            print(f"  Created category: {cat_data['name']}")
        else:
            print(f"  Category already exists: {cat_data['name']}")
    db.session.commit()


def seed_products():
    """Seed products with variants."""
    print("Seeding products...")
    
    # Get the default category
    category = Category.query.filter_by(slug='oud-naturel').first()
    category_id = category.id if category else None
    
    for prod_data in PRODUCTS_DATA:
        existing = Product.query.filter_by(slug=prod_data['slug']).first()
        if not existing:
            # Extract variants data
            variants_data = prod_data.pop('variants', [])
            
            # Create product
            product = Product(
                name=prod_data['name'],
                slug=prod_data['slug'],
                description=prod_data['description'],
                short_description=prod_data['short_description'],
                category_id=category_id,
                origin=prod_data['origin'],
                grade=prod_data['grade'],
                intensity=prod_data['intensity'],
                profile=prod_data['profile'],
                image_url_local=prod_data['image_url_local'],
                additional_images=prod_data['additional_images'],
                is_bestseller=prod_data['is_bestseller'],
                is_new=prod_data['is_new'],
                rating=prod_data['rating'],
                review_count=prod_data['review_count'],
                tags=prod_data['tags'],
                is_active=True
            )
            db.session.add(product)
            db.session.flush()  # Get product ID
            
            # Create variants
            for i, var_data in enumerate(variants_data):
                variant = ProductVariant(
                    product_id=product.id,
                    size=var_data['size'],
                    sku=f"{prod_data['slug'].upper()}-{var_data['size']}",
                    price=var_data['price'],
                    promo_price=var_data['promo_price'],
                    stock_qty=var_data['stock_qty'],
                    is_active=True,
                    is_default=(i == 0)  # First variant is default
                )
                db.session.add(variant)
            
            print(f"  Created product: {prod_data['name']}")
        else:
            print(f"  Product already exists: {prod_data['name']}")
    
    db.session.commit()


def seed_promotions():
    """Seed promotions."""
    print("Seeding promotions...")
    for promo_data in PROMOTIONS_DATA:
        existing = Promotion.query.filter_by(name=promo_data['name']).first()
        if not existing:
            promo = Promotion(**promo_data)
            db.session.add(promo)
            print(f"  Created promotion: {promo_data['name']}")
        else:
            print(f"  Promotion already exists: {promo_data['name']}")
    db.session.commit()


def seed_feature_flags():
    """Seed feature flags."""
    print("Seeding feature flags...")
    for flag_data in FEATURE_FLAGS_DATA:
        existing = FeatureFlag.query.filter_by(key=flag_data['key']).first()
        if not existing:
            flag = FeatureFlag(**flag_data)
            db.session.add(flag)
            print(f"  Created feature flag: {flag_data['key']}")
        else:
            print(f"  Feature flag already exists: {flag_data['key']}")
    db.session.commit()


def seed_homepage_sections():
    """Seed homepage sections."""
    print("Seeding homepage sections...")
    for section_data in HOMEPAGE_SECTIONS_DATA:
        existing = HomepageSection.query.filter_by(key=section_data['key']).first()
        if not existing:
            section = HomepageSection(**section_data)
            db.session.add(section)
            print(f"  Created homepage section: {section_data['key']}")
        else:
            print(f"  Homepage section already exists: {section_data['key']}")
    db.session.commit()


def main():
    """Main seed function."""
    app = create_app()
    
    with app.app_context():
        print("=" * 60)
        print("SEEDING DATABASE")
        print("=" * 60)
        
        seed_categories()
        seed_products()
        seed_promotions()
        seed_feature_flags()
        seed_homepage_sections()
        
        print("=" * 60)
        print("SEEDING COMPLETE")
        print("=" * 60)


if __name__ == '__main__':
    main()
