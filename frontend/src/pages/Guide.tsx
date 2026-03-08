import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { guideArticles } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Guide() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const featuredArticle = guideArticles.find(a => a.featured);
  const otherArticles = guideArticles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div
            ref={ref}
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
              Le Guide Oud
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Tout Savoir sur l'Oud
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Découvrez nos guides complets pour apprendre à choisir, utiliser 
              et apprécier l'oud comme un connaisseur.
            </p>
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <div
              className={`mb-12 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link
                to={`/guide/${featuredArticle.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                        {featuredArticle.category}
                      </span>
                      <span className="text-stone-400 text-sm flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {featuredArticle.readTime} min de lecture
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl lg:text-3xl text-stone-900 mb-4 group-hover:text-amber-700 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-stone-600 mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center text-amber-600 font-medium">
                      Lire l'article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2 className="font-serif text-2xl text-stone-900 mb-6">
              Tous nos Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArticles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/guide/${article.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-200">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="text-stone-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} min
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-medium text-stone-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className={`mt-16 text-center transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="bg-stone-900 rounded-3xl p-8 lg:p-12">
              <h2 className="font-serif text-2xl lg:text-3xl text-white mb-4">
                Vous avez encore des questions ?
              </h2>
              <p className="text-stone-400 mb-6 max-w-lg mx-auto">
                Notre équipe est là pour vous aider à trouver l'oud parfait. 
                Contactez-nous sur WhatsApp pour des conseils personnalisés.
              </p>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors"
              >
                Discuter sur WhatsApp
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
