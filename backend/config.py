import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class."""
    
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
        'max_overflow': 20
    }
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # API
    API_PREFIX = os.environ.get('API_PREFIX', '/api/v1')
    
    # Upload
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    # Keep a bit of overhead for multipart boundaries while enforcing 10MB file size in route logic.
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 12 * 1024 * 1024))

    # Order notification email (Hostinger Email SMTP by default)
    ORDER_NOTIFICATION_ENABLED = os.environ.get('ORDER_NOTIFICATION_ENABLED', 'true').lower() == 'true'
    ORDER_NOTIFICATION_RECIPIENTS = tuple(
        email.strip() for email in os.environ.get(
            'ORDER_NOTIFICATION_RECIPIENTS',
            'lahmamsimarouane@gmail.com,jaknitaha@gmail.com'
        ).split(',') if email.strip()
    )
    SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.hostinger.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', '465'))
    SMTP_USERNAME = os.environ.get('SMTP_USERNAME', 'contact@medinaoud.com')
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
    SMTP_USE_SSL = os.environ.get('SMTP_USE_SSL', 'true').lower() == 'true'
    SMTP_TIMEOUT = int(os.environ.get('SMTP_TIMEOUT', '15'))
    MAIL_FROM = os.environ.get('MAIL_FROM', 'contact@medinaoud.com')
    MAIL_FROM_NAME = os.environ.get('MAIL_FROM_NAME', 'Medina Oud')

class DevelopmentConfig(Config):
    """Development configuration."""
    FLASK_ENV = 'development'
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    FLASK_ENV = 'production'
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
