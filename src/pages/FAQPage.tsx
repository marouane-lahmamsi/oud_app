import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle, Search } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { faqItems } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function FAQPage() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqItems.map(f => f.category)))];

  const filteredFaqs = faqItems.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div
            ref={ref}
            className={`text-center mb-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
              FAQ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos produits, 
              la livraison, les paiements et plus encore.
            </p>
          </div>

          {/* Search */}
          <div
            className={`max-w-xl mx-auto mb-8 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
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

          {/* Category Filter */}
          <div
            className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  selectedCategory === category
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                )}
              >
                {category === 'all' ? 'Toutes' : category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div
            className={`max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
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
                <p className="text-stone-500 mb-4">
                  Essayez avec d'autres mots-clés ou contactez-nous directement.
                </p>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-600 font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nous contacter sur WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div
            className={`mt-12 text-center transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="bg-stone-900 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl text-white mb-3">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <p className="text-stone-400 mb-6">
                Notre équipe est disponible pour répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
                >
                  Formulaire de contact
                </Link>
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
