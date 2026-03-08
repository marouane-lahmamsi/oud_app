# Medina Oud - E-commerce Platform

A production-grade, database-driven e-commerce web application for selling premium oud products in Morocco.

## Project Structure

```
medina-oud/
├── backend/           # Flask API with SQLAlchemy + MySQL
│   ├── app/          # Application code
│   │   ├── models/   # Database models
│   │   ├── routes/   # API endpoints
│   │   └── __init__.py
│   ├── migrations/   # Alembic migrations
│   ├── seed/         # Database seed scripts
│   ├── config.py     # Configuration
│   ├── run.py        # Entry point
│   └── requirements.txt
│
└── frontend/         # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── sections/
    │   ├── services/
    │   └── types/
    ├── public/
    └── package.json
```

## Backend Setup

### Prerequisites
- Python 3.9+
- MySQL database

### Installation

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run migrations:
```bash
flask db upgrade
```

5. Seed the database:
```bash
python seed/products_seed.py
python seed/test_orders.py
```

6. Run the server:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

### API Endpoints

- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:slug` - Get single product
- `GET /api/v1/products/featured` - Featured products
- `GET /api/v1/products/bestsellers` - Bestseller products
- `GET /api/v1/products/categories` - Product categories
- `POST /api/v1/orders` - Create order
- `GET /api/v1/config` - Public configuration
- `GET /api/v1/homepage` - Homepage data

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your API URL
```

3. Run development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Database Schema

### Products
- `id`, `name`, `slug`, `description`, `short_description`
- `category_id`, `origin`, `grade`, `intensity`, `profile`
- `image_url_local`, `additional_images`
- `is_active`, `is_featured`, `is_bestseller`, `is_new`
- `rating`, `review_count`, `tags`

### Product Variants
- `id`, `product_id`, `size`, `sku`
- `price`, `promo_price`, `stock_qty`
- `is_active`, `is_default`

### Orders
- `id`, `order_number`, `customer_id`
- `shipping_address`, `shipping_city`, `shipping_postal_code`
- `subtotal`, `shipping_cost`, `discount_amount`, `total_amount`
- `status`, `payment_status`, `payment_method`

### Customers
- `id`, `full_name`, `email`, `phone`
- `address`, `city`, `postal_code`, `country`
- `is_registered`, `total_orders`, `total_spent`

### Promotions
- `id`, `name`, `code`, `description`
- `discount_type`, `discount_value`, `min_order_amount`
- `is_active`, `banner_text`, `banner_color`

### Feature Flags
- `id`, `key`, `name`, `value_type`, `value`
- `is_enabled`, `display_order`

## Features

- ✅ Product catalog with filtering (from database)
- ✅ Product variants (10g, 50g, 100g, 200g)
- ✅ Shopping cart with local storage
- ✅ Checkout with order creation (stored in DB)
- ✅ Promo code support (database-driven)
- ✅ Dynamic homepage sections (feature flags)
- ✅ Quiz for product recommendations
- ✅ Responsive design
- ✅ Minimal, UX-focused homepage

## Brand Assets

Logo files are located in:
- `frontend/public/logo/medina-oud-logo.svg` - Main logo
- `frontend/public/logo/medina-oud-icon.svg` - Icon only
- `frontend/public/logo/medina-oud-dark.svg` - Dark version
- `frontend/public/logo/medina-oud-wordmark.svg` - Wordmark only
- `frontend/public/logo/*.png` - PNG exports

## Test Report

See [TEST_REPORT.md](./TEST_REPORT.md) for comprehensive testing documentation including:
- Test data (3 simulated orders)
- API endpoint testing
- Feature flags verification
- Issues found and fixes applied

## Deployment

### Static Site (Frontend Only)

A static version is available in the `deploy/` folder:

```bash
cd deploy
# Serve with any static server
python -m http.server 8080
```

### Full Stack Deployment

1. Deploy backend to your server (Heroku, Railway, VPS, etc.)
2. Set environment variables (DATABASE_URL, SECRET_KEY, etc.)
3. Run migrations: `flask db upgrade`
4. Seed database: `python seed/products_seed.py`
5. Build frontend: `npm run build`
6. Deploy frontend to static hosting (Vercel, Netlify, etc.)

## Environment Variables

### Backend (.env)
```
DATABASE_URL='mysql+pymysql://user:pass@host:3306/dbname'
FLASK_ENV=production
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-api-domain.com/api/v1
```

## License

Private - All rights reserved.
