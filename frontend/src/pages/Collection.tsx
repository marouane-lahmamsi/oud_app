import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { productsAPI } from '@/services/api';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

type CollectionFocus = 'all' | 'discover' | 'intense' | 'coffret';

const focusChoices: Array<{ id: CollectionFocus; label: string; description: string }> = [
  { id: 'all', label: 'Toute la collection', description: 'Voir les 7 références' },
  { id: 'discover', label: 'Pour découvrir', description: 'Des signatures équilibrées' },
  { id: 'intense', label: 'Plus de caractère', description: 'Des oud affirmés' },
  { id: 'coffret', label: 'Coffret découverte', description: '6 oud à comparer' },
];

function getProductsFromResult(result: any): Product[] {
  if (!result?.success || !result.data) return [];
  return Array.isArray(result.data) ? result.data : result.data.data || [];
}

export function Collection() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState<CollectionFocus>('all');

  useEffect(() => {
    let isCurrent = true;

    const fetchProducts = async () => {
      setLoading(true);
      const urlFilter = searchParams.get('filter');
      const result = await productsAPI.getAll({
        page: 1,
        per_page: 24,
        ...(urlFilter === 'new' ? { is_new: true } : {}),
        ...(urlFilter === 'bestseller' ? { is_bestseller: true } : {}),
        ...(urlFilter === 'featured' ? { is_featured: true } : {}),
      });

      if (isCurrent) {
        setProducts(getProductsFromResult(result));
        setLoading(false);
      }
    };

    fetchProducts();
    return () => { isCurrent = false; };
  }, [searchParams]);

  const displayedProducts = useMemo(() => {
    if (focus === 'discover') {
      return products.filter((product) => product.intensity !== 'high' && product.category !== 'coffrets');
    }
    if (focus === 'intense') return products.filter((product) => product.intensity === 'high');
    if (focus === 'coffret') return products.filter((product) => product.category === 'coffrets');
    return products;
  }, [focus, products]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-28 sm:pt-32 pb-16">
        <div className="container-oud">
          <div className="mb-8 sm:mb-10">
            <p className="mb-2 text-sm font-medium text-amber-700">Medina Oud</p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-3">Notre Collection</h1>
            <p className="text-stone-600 max-w-2xl">
              Sept références sélectionnées avec soin. Choisissez selon votre envie, sans vous perdre dans les filtres.
            </p>
          </div>

          <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5" aria-label="Choisir une sélection">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-900">Par où commencer ?</p>
                <p className="text-sm text-stone-500">
                  {loading ? 'Chargement de la collection…' : `${displayedProducts.length} référence${displayedProducts.length > 1 ? 's' : ''} à découvrir`}
                </p>
              </div>
              <Link to="/quiz" className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900">
                Besoin d'un conseil ? Faire le quiz <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {focusChoices.map((choice) => (
                <Button
                  key={choice.id}
                  type="button"
                  variant={focus === choice.id ? 'default' : 'outline'}
                  aria-pressed={focus === choice.id}
                  onClick={() => setFocus(choice.id)}
                  className={cn(
                    'h-auto shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-left',
                    focus === choice.id
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50'
                  )}
                >
                  <span className="block text-sm font-medium">{choice.label}</span>
                  <span className={cn('block text-xs font-normal', focus === choice.id ? 'text-stone-300' : 'text-stone-500')}>
                    {choice.description}
                  </span>
                </Button>
              ))}
            </div>
          </section>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => <div key={index} className="aspect-[3/4] rounded-2xl bg-stone-200 animate-pulse" />)}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-amber-600" />
              <h2 className="font-serif text-2xl text-stone-900">Cette sélection arrive bientôt</h2>
              <p className="mx-auto mt-2 max-w-md text-stone-500">
                Retrouvez toute la collection Medina Oud ou laissez le quiz vous orienter.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="outline" onClick={() => setFocus('all')}>Voir toute la collection</Button>
                <Button asChild><Link to="/quiz">Faire le quiz</Link></Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
