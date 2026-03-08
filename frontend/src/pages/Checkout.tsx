import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Check } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { ordersAPI } from '@/services/api';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    
    const result = await ordersAPI.validatePromo(promoCode, cart.subtotal);
    if (result.success && result.data) {
      setPromoDiscount(result.data.discount_amount);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const orderData = {
      items: cart.items.map(item => ({
        variant_id: item.variant.id,
        quantity: item.quantity,
      })),
      customer: {
        full_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      },
      shipping: {
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postal_code: formData.get('postalCode') as string,
        country: 'Morocco',
      },
      promo_code: promoCode || undefined,
      payment_method: formData.get('paymentMethod') as string,
    };

    const result = await ordersAPI.create(orderData);
    
    if (result.success) {
      clearCart();
      navigate('/commande/confirmation');
    } else {
      alert(result.error || 'Une erreur est survenue');
    }
    
    setIsSubmitting(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-oud text-center py-16">
            <h1 className="font-serif text-3xl text-stone-900 mb-4">Votre panier est vide</h1>
            <Button asChild>
              <a href="#/collection">Continuer les achats</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          <a href="#/" className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </a>

          <h1 className="font-serif text-3xl text-stone-900 mb-8">Finaliser la commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="font-serif text-xl text-stone-900 mb-4">Contact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="font-serif text-xl text-stone-900 mb-4">Livraison</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input id="postalCode" name="postalCode" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h2 className="font-serif text-xl text-stone-900 mb-4">Paiement</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-stone-50">
                    <input type="radio" name="paymentMethod" value="cash_on_delivery" defaultChecked />
                    <Truck className="w-5 h-5 text-stone-600" />
                    <span>Paiement à la livraison</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-stone-50 opacity-50">
                    <input type="radio" name="paymentMethod" value="credit_card" disabled />
                    <CreditCard className="w-5 h-5 text-stone-600" />
                    <span>Carte bancaire (bientôt)</span>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-stone-900 hover:bg-stone-800 py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Traitement...' : `Commander - ${formatPrice(cart.total - promoDiscount)}`}
              </Button>
            </form>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 border border-stone-100 sticky top-24">
                <h2 className="font-serif text-xl text-stone-900 mb-4">Récapitulatif</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden">
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-900">{item.product.name}</p>
                        <p className="text-sm text-stone-500">{item.variant.size} x {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="Code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleApplyPromo}>
                    Appliquer
                  </Button>
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Livraison</span>
                    <span>{cart.shipping === 0 ? 'Gratuite' : formatPrice(cart.shipping)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Réduction</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(cart.total - promoDiscount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
