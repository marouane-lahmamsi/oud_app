import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    id: '1',
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons le paiement à la livraison (cash on delivery) et les virements bancaires pour les commandes importantes.',
  },
  {
    id: '2',
    question: 'Quels sont les délais de livraison ?',
    answer: 'Casablanca et Rabat : 24-48h. Autres villes : 48-72h. Livraison gratuite à partir de 500 DH.',
  },
  {
    id: '3',
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 14 jours après réception pour retourner un produit non utilisé dans son emballage d\'origine.',
  },
  {
    id: '4',
    question: 'Votre oud est-il 100% naturel ?',
    answer: 'Absolument. Tout notre oud est 100% naturel, sans additifs ni parfums artificiels.',
  },
  {
    id: '5',
    question: 'Comment choisir mon oud ?',
    answer: 'Utilisez notre quiz "Trouver mon oud" ou contactez-nous sur WhatsApp pour des conseils personnalisés.',
  },
  {
    id: '6',
    question: 'Comment conserver l\'oud ?',
    answer: 'Conservez votre oud dans une boîte hermétique, à l\'abri de la lumière et de l\'humidité.',
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqItems.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-stone-100 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="font-medium text-stone-900">{faq.question}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 text-stone-400 transition-transform duration-300 flex-shrink-0',
                          openIndex === faq.id && 'rotate-180'
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300',
                        openIndex === faq.id ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-stone-600 leading-relaxed ml-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="font-medium text-lg text-stone-900 mb-2">
                  Aucune question trouvée
                </h3>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <div className="bg-stone-900 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl text-white mb-3">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
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
