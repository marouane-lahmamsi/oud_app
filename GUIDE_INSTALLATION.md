# 🌿 Medina Oud - Guide d'Installation

## 🔗 Aperçu en ligne
**Site déployé :** https://zgfs2yjowq2lc.ok.kimi.link

---

## 📋 Prérequis

### Logiciels requis
- **Node.js** 18+ (pour le frontend)
- **Python** 3.10+ (pour le backend)
- **MySQL** 8.0+ (base de données)
- **npm** ou **yarn** (gestionnaire de packages)

### Vérifier les installations
```bash
# Vérifier Node.js
node --version  # Doit afficher v18.x.x ou plus

# Vérifier npm
npm --version   # Doit afficher 9.x.x ou plus

# Vérifier Python
python --version  # ou python3 --version

# Vérifier MySQL
mysql --version
```

---

## 🚀 Installation Rapide

### Étape 1 : Cloner/Télécharger le projet
```bash
cd /chemin/vers/medina-oud
```

### Étape 2 : Configuration Backend

#### 2.1 Créer l'environnement virtuel Python
```bash
cd backend

# Créer le virtualenv
python -m venv venv

# Activer le virtualenv
# Sur macOS/Linux :
source venv/bin/activate

# Sur Windows :
venv\Scripts\activate
```

#### 2.2 Installer les dépendances Python
```bash
pip install -r requirements.txt
```

#### 2.3 Configurer les variables d'environnement
```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env avec vos informations
nano .env  # ou utilisez votre éditeur préféré
```

**Contenu du fichier `.env` :**
```env
# Base de données MySQL
DATABASE_URL='mysql+pymysql://utilisateur:motdepasse@localhost:3306/medina_oud'

# Configuration Flask
FLASK_ENV=development
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire

# CORS (origines autorisées)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Exemple avec votre base de données :**
```env
DATABASE_URL='mysql+pymysql://u123565645_mar3:aqwa&rty2A@srv1045.hstgr.io:3306/u123565645_dhina'
```

#### 2.4 Créer la base de données MySQL
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE medina_oud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Créer un utilisateur (optionnel)
CREATE USER 'medina_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON medina_oud.* TO 'medina_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

#### 2.5 Exécuter les migrations
```bash
# Initialiser les migrations (si ce n'est pas déjà fait)
flask db init

# Créer une migration
flask db migrate -m "Initial migration"

# Appliquer les migrations
flask db upgrade
```

#### 2.6 Peupler la base de données (seed)
```bash
# Insérer les produits
python seed/products_seed.py

# Créer les commandes de test
python seed/test_orders.py
```

#### 2.7 Lancer le serveur backend
```bash
# Méthode 1 : Avec Flask
flask run --host=0.0.0.0 --port=5000

# Méthode 2 : Avec le script run.py
python run.py
```

**Le backend est accessible sur :** http://localhost:5000

---

### Étape 3 : Configuration Frontend

#### 3.1 Installer les dépendances Node.js
```bash
cd ../frontend

# Installer les packages
npm install

# Si vous avez des problèmes :
npm install --legacy-peer-deps
```

#### 3.2 Configurer les variables d'environnement
```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Contenu du fichier `.env` :**
```env
# URL de l'API backend
VITE_API_URL=http://localhost:5000/api/v1
```

#### 3.3 Lancer le serveur de développement
```bash
npm run dev
```

**Le frontend est accessible sur :** http://localhost:5173

---

## 🏗️ Structure du Projet

```
medina-oud/
├── backend/                    # API Flask + SQLAlchemy
│   ├── app/
│   │   ├── models/            # Modèles de données
│   │   │   ├── product.py     # Product, ProductVariant, Category
│   │   │   ├── order.py       # Order, OrderItem
│   │   │   ├── customer.py    # Customer
│   │   │   └── promotion.py   # Promotion, FeatureFlag
│   │   └── routes/            # Endpoints API
│   │       ├── products.py    # GET /products, /products/:slug
│   │       ├── orders.py      # POST /orders, GET /orders/:id
│   │       ├── customers.py   # Gestion clients
│   │       ├── promotions.py  # Promotions et codes promo
│   │       └── public.py      # Données publiques (homepage)
│   ├── migrations/            # Migrations Alembic
│   ├── seed/                  # Scripts de peuplement
│   │   ├── products_seed.py   # 8 produits de démo
│   │   └── test_orders.py     # 3 commandes de test
│   ├── config.py              # Configuration Flask
│   ├── requirements.txt       # Dépendances Python
│   ├── run.py                 # Point d'entrée
│   └── .env.example           # Template de configuration
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Home.tsx       # Page d'accueil
│   │   │   ├── Collection.tsx # Catalogue produits
│   │   │   ├── Product.tsx    # Détail produit
│   │   │   ├── Checkout.tsx   # Paiement
│   │   │   └── ...
│   │   ├── components/        # Composants réutilisables
│   │   ├── hooks/             # Hooks personnalisés
│   │   │   ├── useProducts.ts
│   │   │   └── useProduct.ts
│   │   ├── services/          # Services API
│   │   │   └── api.ts
│   │   └── types/             # Types TypeScript
│   ├── public/
│   │   └── logo/              # Logos SVG/PNG
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── deploy/                     # Version statique déployée
├── README.md                   # Documentation générale
├── TEST_REPORT.md             # Rapport de tests
└── GUIDE_INSTALLATION.md      # Ce fichier
```

---

## 🔌 API Endpoints

### Produits
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/products` | Liste des produits (avec filtres) |
| GET | `/api/v1/products/:slug` | Détail d'un produit |
| GET | `/api/v1/products/featured` | Produits en vedette |
| GET | `/api/v1/products/bestsellers` | Meilleures ventes |
| GET | `/api/v1/products/new` | Nouveautés |

### Commandes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/orders` | Créer une commande |
| GET | `/api/v1/orders/:id` | Détail d'une commande |
| PUT | `/api/v1/orders/:id/status` | Mettre à jour le statut |

### Public
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/homepage` | Données page d'accueil |
| GET | `/api/v1/feature-flags` | Flags de fonctionnalités |
| GET | `/api/v1/promo-banner` | Bannière promotionnelle |

---

## 🗄️ Schéma de Base de Données

### Tables principales

**products** - Catalogue produits
- `id`, `name`, `slug`, `description`
- `category_id` (clé étrangère)
- `price`, `promo_price`, `stock_qty`
- `image_url_local`, `is_active`
- `created_at`, `updated_at`

**product_variants** - Variantes (tailles)
- `id`, `product_id`, `size`
- `price`, `promo_price`, `stock_qty`

**orders** - Commandes
- `id`, `order_number`, `customer_id`
- `total_amount`, `status`, `payment_status`
- `created_at`, `updated_at`

**order_items** - Lignes de commande
- `id`, `order_id`, `product_id`
- `quantity`, `unit_price`, `line_total`

**customers** - Clients
- `id`, `full_name`, `email`, `phone`
- `address`, `city`, `postal_code`

**promotions** - Promotions
- `id`, `code`, `discount_type`, `discount_value`
- `is_active`, `starts_at`, `ends_at`

**feature_flags** - Flags de fonctionnalités
- `id`, `key`, `value_type`, `boolean_value`
- `is_enabled`

---

## 🧪 Tests

### Tester l'API
```bash
# Liste des produits
curl http://localhost:5000/api/v1/products

# Détail d'un produit
curl http://localhost:5000/api/v1/products/oud-al-majlis

# Créer une commande (exemple)
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "full_name": "Test User",
      "email": "test@example.com",
      "phone": "+33123456789"
    },
    "items": [
      {"product_id": 1, "variant_id": 1, "quantity": 2}
    ],
    "shipping_address": "123 Rue Test",
    "shipping_city": "Paris",
    "shipping_postal_code": "75001"
  }'
```

### Vérifier les données en base
```bash
# Se connecter à MySQL
mysql -u medina_user -p medina_oud

# Voir les produits
SELECT * FROM products;

# Voir les commandes
SELECT * FROM orders;

# Voir les lignes de commande
SELECT * FROM order_items;
```

---

## 🐛 Dépannage

### Problème : `ModuleNotFoundError`
```bash
# Solution : Réinstaller les dépendances
pip install -r requirements.txt
```

### Problème : `Access denied for user`
```bash
# Vérifier les credentials dans .env
# S'assurer que l'utilisateur MySQL existe et a les droits

# Créer l'utilisateur si nécessaire
mysql -u root -p
CREATE USER 'votre_user'@'localhost' IDENTIFIED BY 'votre_mdp';
GRANT ALL PRIVILEGES ON medina_oud.* TO 'votre_user'@'localhost';
FLUSH PRIVILEGES;
```

### Problème : `npm install` échoue
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problème : Port déjà utilisé
```bash
# Changer le port du backend
flask run --port=5001

# Ou tuer le processus existant
# macOS/Linux :
lsof -ti:5000 | xargs kill -9

# Windows :
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📦 Déploiement en Production

### Backend (ex: Heroku, Railway, VPS)
```bash
# 1. Définir les variables d'environnement
export DATABASE_URL="votre_url_production"
export FLASK_ENV="production"
export SECRET_KEY="cle-tres-securisee"

# 2. Lancer avec Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

### Frontend (ex: Vercel, Netlify)
```bash
# 1. Build de production
npm run build

# 2. Déployer le dossier dist/
# Suivre les instructions de votre hébergeur
```

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : contact@medinaoud.com
- 💬 WhatsApp : +212 6 00 00 00 00

---

**Dernière mise à jour :** Février 2026
