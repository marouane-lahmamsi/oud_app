import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { faqItems } from '@/data/products';
import { cn } from '@/lib/utils';

export function FAQ() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqItems.map(f => f.category)))];
  
  const filteredFaqs = selectedCategory === 'all' 
    ? faqItems.slice(0, 6) 
    : faqItems.filter(f => f.category === selectedCategory).slice(0, 6);

  return (
    <section ref={ref} className="section-padding bg-[#FAF7F2]">
      <div className="container-oud">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
              FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-stone-600">
              Tout ce que vous devez savoir sur nos produits et services.
            </p>
          </div>

          {/* Category Filter */}
          <div
            className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 delay-100 ${
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
            className={`space-y-3 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-stone-100 overflow-hidden"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="font-medium text-stone-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-stone-400 transition-transform duration-300',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-5 pb-5 pl-13">
                    <p className="text-stone-600 text-sm leading-relaxed ml-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div
            className={`mt-10 text-center transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-stone-600 mb-4">
              Vous ne trouvez pas votre réponse ?
            </p>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
            >
              Contactez-nous sur WhatsApp
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
