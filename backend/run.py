#!/usr/bin/env python3
"""Entry point for the Flask application."""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import *

app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """Make database models available in shell."""
    return {
        'db': db,
        'Product': Product,
        'ProductVariant': ProductVariant,
        'Category': Category,
        'Order': Order,
        'OrderItem': OrderItem,
        'Customer': Customer,
        'Promotion': Promotion,
        'FeatureFlag': FeatureFlag,
        'HomepageSection': HomepageSection
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
