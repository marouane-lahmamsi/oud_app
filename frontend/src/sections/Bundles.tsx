import { Link } from 'react-router-dom';
import { ArrowRight, Package, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { bundles } from '@/data/products';
import type { BundleProduct, Accessory } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Bundles() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [addedBundle, setAddedBundle] = useState<string | null>(null);

  const handleAddBundle = (bundleId: string) => {
    // In a real app, this would add all bundle items
    setAddedBundle(bundleId);
    setTimeout(() => setAddedBundle(null), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
            Nos Packs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
            Packs & Coffrets
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Des ensembles pensés pour vous offrir la meilleure expérience oud, 
            avec des économies jusqu'à 200 DH.
          </p>
        </div>

        {/* Bundles Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className={cn(
                'relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500',
                bundle.isStarterKit
                  ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'border-stone-100 hover:border-stone-200'
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Starter Kit Badge */}
              {bundle.isStarterKit && (
                <div className="absolute top-4 left-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Recommandé pour Débuter
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-medium text-stone-900 mb-2">
                  {bundle.name}
                </h3>
                <p className="text-stone-600 text-sm mb-6">
                  {bundle.description}
                </p>

                {/* Items List */}
                <div className="space-y-2 mb-6">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                    Ce pack inclut :
                  </p>
                  {bundle.products.map((item: BundleProduct, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-stone-700">
                        {item.product.name} ({item.format})
                      </span>
                    </div>
                  ))}
                  {bundle.accessories.slice(0, 2).map((acc: Accessory, i: number) => (
                    <div key={`acc-${i}`} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-stone-700">{acc.name}</span>
                    </div>
                  ))}
                  {bundle.accessories.length > 2 && (
                    <p className="text-sm text-stone-400 pl-6">
                      +{bundle.accessories.length - 2} accessoires
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-serif text-3xl font-semibold text-stone-900">
                    {formatPrice(bundle.bundlePrice)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-stone-400 line-through text-sm">
                      {formatPrice(bundle.totalPrice)}
                    </span>
                    <span className="text-emerald-600 text-xs font-medium">
                      Économisez {formatPrice(bundle.savings)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <Button
                    className={cn(
                      'flex-1 transition-all duration-300',
                      addedBundle === bundle.id
                        ? 'bg-emerald-600 hover:bg-emerald-600'
                        : bundle.isStarterKit
                        ? 'bg-amber-500 hover:bg-amber-600 text-stone-900'
                        : 'bg-stone-900 hover:bg-stone-800'
                    )}
                    onClick={() => handleAddBundle(bundle.id)}
                  >
                    {addedBundle === bundle.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Ajouté
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        Ajouter le Pack
                      </>
                    )}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/pack/${bundle.slug}`}>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
