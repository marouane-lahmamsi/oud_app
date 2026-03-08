import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getBestsellers, getNewProducts } from '@/data/products';

export function BestSellers() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const bestsellers = getBestsellers();
  const newProducts = getNewProducts();

  return (
    <section ref={ref} className="section-padding bg-[#FAF7F2]">
      <div className="container-oud">
        {/* Section Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
              Nos Best-Sellers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900">
              Les Favoris de Nos Clients
            </h2>
          </div>
          <Button variant="outline" className="self-start sm:self-auto" asChild>
            <Link to="/collection">
              Voir Tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Bestsellers Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {bestsellers.map((product, index) => (
            <div
              key={product.id}
              className={`transition-all duration-500`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* New Arrivals */}
        {newProducts.length > 0 && (
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
                Nouveautés
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`transition-all duration-500`}
                  style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
