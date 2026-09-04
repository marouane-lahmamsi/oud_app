"""Internal email notifications for newly created orders."""

from __future__ import annotations

import html
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

from flask import current_app


def _customer_details(order):
    customer = order.customer
    if customer:
        return customer.full_name or 'Client non renseigné', customer.email or '—', customer.phone or '—'
    return order.guest_full_name or 'Client non renseigné', order.guest_email or '—', order.guest_phone or '—'


def _format_amount(amount, currency='MAD'):
    return f'{float(amount or 0):,.2f} {currency}'.replace(',', ' ').replace('.00', '')


def _order_lines(order):
    return [
        f'{item.product_name} — {item.variant_size or "Standard"} × {item.quantity} : '
        f'{_format_amount(item.line_total, order.currency)}'
        for item in order.items
    ]


def _build_message(order, recipients):
    full_name, email, phone = _customer_details(order)
    address = ', '.join(filter(None, [
        order.shipping_address,
        order.shipping_postal_code,
        order.shipping_city,
        order.shipping_country,
    ])) or '—'
    item_lines = _order_lines(order)
    items_text = '\n'.join(f'• {line}' for line in item_lines) or '• Aucun article'
    total = _format_amount(order.total_amount, order.currency)
    subject = f'[Medina Oud] Nouvelle commande {order.order_number}'

    message = EmailMessage()
    message['Subject'] = subject
    message['From'] = formataddr((current_app.config['MAIL_FROM_NAME'], current_app.config['MAIL_FROM']))
    message['To'] = ', '.join(recipients)
    message['Reply-To'] = current_app.config['MAIL_FROM']
    message.set_content(
        f'Nouvelle commande Medina Oud : {order.order_number}\n\n'
        f'Client : {full_name}\nE-mail : {email}\nTéléphone : {phone}\n'
        f'Livraison : {address}\n\n'
        f'Articles :\n{items_text}\n\n'
        f'Sous-total : {_format_amount(order.subtotal, order.currency)}\n'
        f'Livraison : {_format_amount(order.shipping_cost, order.currency)}\n'
        f'Réduction : {_format_amount(order.discount_amount, order.currency)}\n'
        f'Total : {total}\n\n'
        f'Notes client : {order.notes or "Aucune"}'
    )

    escaped_lines = ''.join(f'<li>{html.escape(line)}</li>' for line in item_lines) or '<li>Aucun article</li>'
    message.add_alternative(
        f'''<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#292524">
  <h2 style="margin-bottom:4px">Nouvelle commande Medina Oud</h2>
  <p style="margin-top:0"><strong>{html.escape(order.order_number)}</strong> · Total : <strong>{html.escape(total)}</strong></p>
  <hr style="border:0;border-top:1px solid #e7e5e4">
  <h3>Client</h3>
  <p>{html.escape(full_name)}<br>{html.escape(email)}<br>{html.escape(phone)}<br>{html.escape(address)}</p>
  <h3>Articles</h3><ul>{escaped_lines}</ul>
  <h3>Récapitulatif</h3>
  <p>Sous-total : {_format_amount(order.subtotal, order.currency)}<br>
  Livraison : {_format_amount(order.shipping_cost, order.currency)}<br>
  Réduction : {_format_amount(order.discount_amount, order.currency)}<br>
  <strong>Total : {html.escape(total)}</strong></p>
  <p><strong>Notes client :</strong> {html.escape(order.notes or 'Aucune')}</p>
</body></html>''',
        subtype='html'
    )
    return message


def send_new_order_notification(order):
    """Send the internal notification without impacting order creation on failure."""
    config = current_app.config
    recipients = config['ORDER_NOTIFICATION_RECIPIENTS']

    if not config['ORDER_NOTIFICATION_ENABLED']:
        current_app.logger.info('Order notification disabled for %s', order.order_number)
        return False
    if not recipients or not config['SMTP_PASSWORD']:
        current_app.logger.warning('Order notification not configured for %s', order.order_number)
        return False

    message = _build_message(order, recipients)
    try:
        smtp_client = (
            smtplib.SMTP_SSL(config['SMTP_HOST'], config['SMTP_PORT'], timeout=config['SMTP_TIMEOUT'])
            if config['SMTP_USE_SSL']
            else smtplib.SMTP(config['SMTP_HOST'], config['SMTP_PORT'], timeout=config['SMTP_TIMEOUT'])
        )
        with smtp_client as smtp:
            if not config['SMTP_USE_SSL']:
                smtp.starttls()
            smtp.login(config['SMTP_USERNAME'], config['SMTP_PASSWORD'])
            smtp.send_message(message)
        current_app.logger.info('Order notification sent for %s', order.order_number)
        return True
    except (OSError, smtplib.SMTPException):
        current_app.logger.exception('Could not send order notification for %s', order.order_number)
        return False
