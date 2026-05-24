from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import config
import logging
import sys

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name='default'):
    """Application factory pattern."""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp
    from app.routes.customers import customers_bp
    from app.routes.promotions import promotions_bp
    from app.routes.public import public_bp
    from app.routes.admin import admin_bp
    
    api_prefix = app.config['API_PREFIX']
    
    app.register_blueprint(products_bp, url_prefix=f'{api_prefix}/products')
    app.register_blueprint(orders_bp, url_prefix=f'{api_prefix}/orders')
    app.register_blueprint(customers_bp, url_prefix=f'{api_prefix}/customers')
    app.register_blueprint(promotions_bp, url_prefix=f'{api_prefix}/promotions')
    app.register_blueprint(public_bp, url_prefix=f'{api_prefix}')
    app.register_blueprint(admin_bp, url_prefix=f'{api_prefix}/admin')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'medina-oud-api'}, 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found', 'message': 'The requested resource was not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error', 'message': 'Something went wrong'}, 500

    @app.errorhandler(413)
    def payload_too_large(error):
        return {
            'error': 'Payload too large',
            'message': 'Maximum upload size is 10MB'
        }, 413
    
    return app
