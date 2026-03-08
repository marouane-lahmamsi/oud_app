import { Link } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { Button } from '@/components/ui/button';

export function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h1 className="font-serif text-3xl text-stone-900 mb-4">
              Commande confirmée !
            </h1>
            
            <p className="text-stone-600 mb-8">
              Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
            </p>
            
            <div className="space-y-3">
              <Button className="w-full bg-stone-900 hover:bg-stone-800" asChild>
                <Link to="/collection">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continuer les achats
                </Link>
              </Button>
              
              <a 
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
              >
                Suivre sur WhatsApp
              </a>
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
