import { useState, useEffect } from 'react';
import { Star, Quote, MapPin, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { reviews } from '@/data/products';

export function SocialProof() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(reviews.length, 6));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const displayedReviews = reviews.slice(0, 6);
  const stats = [
    { value: '15,000+', label: 'Clients satisfaits' },
    { value: '4.8/5', label: 'Note moyenne' },
    { value: '98%', label: 'Recommandent' },
    { value: '24h', label: 'Livraison CBL/RBT' },
  ];

  return (
    <section ref={ref} className="section-padding bg-[#FAF7F2]">
      <div className="container-oud">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
            Avis Vérifiés
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Découvrez les témoignages de notre communauté passionnée par l'oud authentique.
          </p>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl border border-stone-100 shadow-sm"
            >
              <div className="font-serif text-3xl lg:text-4xl font-semibold text-stone-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {displayedReviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-6 border border-stone-100 shadow-sm transition-all duration-500 ${
                index === activeIndex ? 'ring-2 ring-amber-500/30' : ''
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-200'
                    }`}
                  />
                ))}
                {review.verified && (
                  <span className="ml-2 flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle className="w-3 h-3" />
                    Vérifié
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="relative mb-4">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-amber-100" />
                <h4 className="font-medium text-stone-900 mb-2 relative z-10">
                  {review.title}
                </h4>
                <p className="text-stone-600 text-sm line-clamp-4 relative z-10">
                  {review.content}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <div>
                  <p className="font-medium text-stone-900 text-sm">{review.author}</p>
                  <p className="text-xs text-stone-400">{review.date}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <MapPin className="w-3 h-3" />
                  <span>Maroc</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {displayedReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-amber-500'
                  : 'bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
