# Adam Vegetables Kerala - Django REST Backend

Production-ready backend API service for the Adam Vegetables Kerala fresh produce e-commerce platform, built with Python Django and Django REST Framework (DRF).

---

## 📁 Project Architecture & Folder Structure

```text
backend/
├── .env.example                     # Sample environment variables (DB, Secret Key, CORS)
├── manage.py                        # Django administrative CLI
├── requirements.txt                 # Python dependencies
├── db.sqlite3                       # Local development database (auto-created)
├── core/                            # Project core configuration
│   ├── __init__.py
│   ├── asgi.py                      # ASGI entry point for async servers
│   ├── settings.py                  # Django, DRF, Database, & CORS settings
│   ├── urls.py                      # Master API router & discovery endpoints
│   └── wsgi.py                      # WSGI entry point for production servers (Gunicorn)
└── apps/                            # Modular domain applications
    ├── __init__.py
    ├── users/                       # User accounts, B2B wholesale profiles, authentication
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py                # Custom User model (retail vs wholesale client types)
    │   ├── serializers.py
    │   ├── urls.py
    │   └── views.py                 # Registration and user profile endpoints
    ├── categories/                  # Vegetable classifications & native Kerala produce groups
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py                # Category model with Malayalam / Arabic names
    │   ├── serializers.py
    │   ├── urls.py
    │   └── views.py                 # Category listing and detail ViewSet
    ├── products/                    # Produce catalog, inventory, and morning mandi rates
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py                # Product and MandiDailyPrice models
    │   ├── serializers.py
    │   ├── urls.py
    │   ├── views.py                 # ProductViewSet with filters, search, and todays_prices
    │   └── management/commands/
    │       └── seed_produce.py      # Command to seed authentic Kerala produce
    ├── cart/                        # Shopping cart supporting guest sessions & authenticated users
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py                # Cart and CartItem models with dynamic wholesale pricing
    │   ├── serializers.py
    │   ├── urls.py
    │   └── views.py                 # Add, update, remove, and clear cart actions
    └── orders/                      # Customer checkouts, order processing, and tracking
        ├── admin.py
        ├── apps.py
        ├── models.py                # Order and OrderItem models
        ├── serializers.py           # Order creation & tracking serializers
        ├── urls.py
        └── views.py                 # Order creation & public tracking endpoint
```

---

## ⚙️ Configuration & Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory:

```bash
cp .env.example .env
```

Key environment configurations available in `.env.example`:

* `DJANGO_SECRET_KEY`: Cryptographic signing secret.
* `DJANGO_DEBUG`: Set to `True` for development, `False` for production.
* `DJANGO_ALLOWED_HOSTS`: Comma-separated allowed hostnames (e.g., `localhost,127.0.0.1,api.adamvegetables.com`).
* `CORS_ALLOWED_ORIGINS`: Origins permitted to make cross-origin requests. Defaults to `http://localhost:3000` (Vite dev server).
* `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQL connection credentials.

*(Note: When PostgreSQL is not configured, the backend automatically falls back to local SQLite for seamless local execution).*

---

## 🚀 How to Start the Django Development Server

1. **Activate Virtual Environment or Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Apply Migrations**:
   ```bash
   python manage.py migrate
   ```

3. **(Optional) Seed Baseline Kerala Produce & Categories**:
   ```bash
   python manage.py seed_produce
   ```

4. **Create a Superuser for Django Admin**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Start the Development Server**:
   ```bash
   python manage.py runserver 8000
   ```
   Or bind to all interfaces:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

---

## 🌐 API Base URL & Endpoints

* **Base URL**: `http://localhost:8000/api/v1/`
* **Health Check**: `GET /api/health/`

### Available Endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/` | GET | API directory and service discovery |
| `/api/v1/products/` | GET, POST | Vegetable catalog with filtering and search |
| `/api/v1/products/featured/` | GET | Featured farm-fresh vegetables |
| `/api/v1/products/todays_prices/` | GET | Live morning mandi auction rates and trends |
| `/api/v1/products/rates/` | GET | Historical mandi daily rate records |
| `/api/v1/categories/` | GET, POST | Vegetable categories |
| `/api/v1/cart/` | GET | Active cart details (items, totals, wholesale discounts) |
| `/api/v1/cart/add_item/` | POST | Add produce item to cart |
| `/api/v1/cart/update_item/` | POST | Modify item quantity |
| `/api/v1/cart/remove_item/` | POST | Remove specific item from cart |
| `/api/v1/cart/clear/` | POST | Empty cart |
| `/api/v1/orders/` | GET, POST | Place new order or view order history |
| `/api/v1/orders/track/?order_no=...` | GET | Public order tracking status by order ID |
| `/api/v1/users/register/` | POST | Register new retail or wholesale account |
| `/api/v1/users/me/` | GET, PUT | View and update authenticated user profile |
| `/admin/` | GET | Django Administration Dashboard |
