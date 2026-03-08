#!/usr/bin/env python3
"""Seed script to create test orders for demonstration."""
import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.product import Product, ProductVariant
from app.models.customer import Customer

# Test customers
TEST_CUSTOMERS = [
    {
        'full_name': 'Ahmed Benali',
        'email': 'ahmed.benali@email.com',
        'phone': '+212 6 12 34 56 78',
        'address': '123 Rue Mohammed V',
        'city': 'Casablanca',
        'postal_code': '20000',
        'is_registered': True
    },
    {
        'full_name': 'Fatima Zahra',
        'email': 'fatima.zahra@email.com',
        'phone': '+212 6 23 45 67 89',
        'address': '45 Avenue Hassan II',
        'city': 'Rabat',
        'postal_code': '10000',
        'is_registered': True
    },
    {
        'full_name': 'Youssef Alami',
        'email': 'youssef.alami@email.com',
        'phone': '+212 6 34 56 78 90',
        'address': '78 Boulevard Moulay Youssef',
        'city': 'Marrakech',
        'postal_code': '40000',
        'is_registered': False
    }
]

# Test orders with items
TEST_ORDERS = [
    {
        'customer_index': 0,  # Ahmed Benali
        'status': OrderStatus.DELIVERED,
        'payment_status': PaymentStatus.PAID,
        'payment_method': PaymentMethod.CASH_ON_DELIVERY,
        'items': [
            {'product_slug': 'oud-al-majlis', 'variant_size': '50g', 'quantity': 1},
            {'product_slug': 'oud-al-fajr', 'variant_size': '10g', 'quantity': 2},
        ],
        'created_days_ago': 15,
        'notes': 'Client fidèle, livraison rapide demandée'
    },
    {
        'customer_index': 1,  # Fatima Zahra
        'status': OrderStatus.SHIPPED,
        'payment_status': PaymentStatus.PAID,
        'payment_method': PaymentMethod.CREDIT_CARD,
        'items': [
            {'product_slug': 'oud-al-khaleej', 'variant_size': '100g', 'quantity': 1},
            {'product_slug': 'oud-al-mubarak', 'variant_size': '50g', 'quantity': 1},
        ],
        'created_days_ago': 3,
        'notes': 'Cadeau pour la fête'
    },
    {
        'customer_index': 2,  # Youssef Alami (guest)
        'status': OrderStatus.PROCESSING,
        'payment_status': PaymentStatus.PENDING,
        'payment_method': PaymentMethod.CASH_ON_DELIVERY,
        'items': [
            {'product_slug': 'oud-al-yasmin', 'variant_size': '10g', 'quantity': 1},
            {'product_slug': 'oud-al-sahra', 'variant_size': '10g', 'quantity': 1},
            {'product_slug': 'oud-al-misk', 'variant_size': '50g', 'quantity': 1},
        ],
        'created_days_ago': 1,
        'notes': ''
    }
]


def create_test_customers():
    """Create test customers."""
    print("Creating test customers...")
    customers = []
    
    for cust_data in TEST_CUSTOMERS:
        existing = Customer.query.filter_by(email=cust_data['email']).first()
        if not existing:
            customer = Customer(**cust_data)
            db.session.add(customer)
            db.session.flush()
            customers.append(customer)
            print(f"  Created customer: {cust_data['full_name']}")
        else:
            customers.append(existing)
            print(f"  Customer already exists: {cust_data['full_name']}")
    
    db.session.commit()
    return customers


def create_test_orders(customers):
    """Create test orders."""
    print("Creating test orders...")
    
    for order_data in TEST_ORDERS:
        customer = customers[order_data['customer_index']]
        
        # Calculate order date
        created_at = datetime.utcnow() - timedelta(days=order_data['created_days_ago'])
        
        # Create order
        order = Order(
            order_number=f"ORD-TEST-{order_data['customer_index'] + 1}",
            customer_id=customer.id if customer.is_registered else None,
            guest_email=customer.email if not customer.is_registered else None,
            guest_phone=customer.phone if not customer.is_registered else None,
            guest_full_name=customer.full_name if not customer.is_registered else None,
            shipping_address=customer.address,
            shipping_city=customer.city,
            shipping_postal_code=customer.postal_code,
            shipping_country='Morocco',
            status=order_data['status'],
            payment_status=order_data['payment_status'],
            payment_method=order_data['payment_method'],
            notes=order_data['notes'],
            subtotal=0,
            shipping_cost=45,
            total_amount=0,
            currency='MAD',
            created_at=created_at,
            updated_at=created_at
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Add order items
        subtotal = 0
        for item_data in order_data['items']:
            # Find product and variant
            product = Product.query.filter_by(slug=item_data['product_slug']).first()
            if not product:
                print(f"  Warning: Product not found: {item_data['product_slug']}")
                continue
            
            variant = ProductVariant.query.filter_by(
                product_id=product.id,
                size=item_data['variant_size']
            ).first()
            
            if not variant:
                print(f"  Warning: Variant not found: {item_data['product_slug']} - {item_data['variant_size']}")
                continue
            
            # Calculate line total
            unit_price = variant.price
            promo_price = variant.promo_price
            quantity = item_data['quantity']
            line_total = (promo_price if promo_price else unit_price) * quantity
            
            # Create order item
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                variant_id=variant.id,
                product_name=product.name,
                variant_size=variant.size,
                unit_price=unit_price,
                promo_price=promo_price,
                quantity=quantity,
                line_total=line_total
            )
            
            db.session.add(order_item)
            subtotal += line_total
        
        # Calculate totals
        order.subtotal = subtotal
        if subtotal >= 500:
            order.shipping_cost = 0
        order.total_amount = subtotal + order.shipping_cost
        
        # Set timestamps based on status
        if order_data['status'] == OrderStatus.DELIVERED:
            order.paid_at = created_at + timedelta(days=1)
            order.shipped_at = created_at + timedelta(days=2)
            order.delivered_at = created_at + timedelta(days=5)
        elif order_data['status'] == OrderStatus.SHIPPED:
            order.paid_at = created_at + timedelta(hours=2)
            order.shipped_at = created_at + timedelta(days=1)
        
        # Update customer stats if registered
        if customer.is_registered:
            customer.total_orders += 1
            customer.total_spent = float(customer.total_spent) + float(order.total_amount)
        
        print(f"  Created order: {order.order_number} - {order.total_amount} MAD")
    
    db.session.commit()


def main():
    """Main function."""
    app = create_app()
    
    with app.app_context():
        print("=" * 60)
        print("CREATING TEST ORDERS")
        print("=" * 60)
        
        customers = create_test_customers()
        create_test_orders(customers)
        
        print("=" * 60)
        print("TEST ORDERS CREATED")
        print("=" * 60)
        
        # Print summary
        total_orders = Order.query.count()
        total_customers = Customer.query.count()
        
        print(f"\nSummary:")
        print(f"  Total customers: {total_customers}")
        print(f"  Total orders: {total_orders}")


if __name__ == '__main__':
    main()
