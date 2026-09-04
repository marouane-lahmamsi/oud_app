import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { publicAPI } from '@/services/api';
import { assetUrl } from '@/lib/assets';
import type { Product } from '@/types';

export function Home() {
  console.log('[DEBUG] Home component rendering started');
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [promoBanner, setPromoBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] useEffect called');
    const fetchHomepageData = async () => {
      try {
        console.log('[DEBUG] Fetching homepage data...');
        const result = await publicAPI.getHomepage();
        console.log('[DEBUG] API result:', result);
        if (result.success && result.data) {
          console.log('[DEBUG] featured_products:', result.data.featured_products?.length);
          console.log('[DEBUG] bestsellers:', result.data.bestsellers?.length);
          setFeatured(result.data.featured_products || []);
          setBestsellers(result.data.bestsellers || []);
          
          // Get promo banner from active promotions
          const activePromo = result.data.promotions?.find((p: any) => p.banner_text && p.is_valid);
          if (activePromo) {
            setPromoBanner(activePromo.banner_text);
          }
        } else {
          console.log('[DEBUG] API returned no data or success=false');
        }
      } catch (err) {
        console.error('[DEBUG] Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  console.log('[DEBUG] About to render, loading:', loading, 'featured:', featured.length);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      
      {/* Promo Banner */}
      {promoBanner && (
        <div className="bg-stone-900 text-white text-center py-2.5 text-sm">
          {promoBanner}
        </div>
      )}
      
      <main>
        {/* Hero - Minimal */}
        <section className="relative min-h-[85vh] flex items-center">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={assetUrl('images/hero/hero-1.jpg')}
              alt="Oud"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
          </div>

          <div className="container-oud relative z-10">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Oud Naturel Premium
              </span>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Medina Oud
              </h1>
              
              <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                L'art ancestral de l'oud, sélectionné aux quatre coins du monde.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-900" asChild>
                  <Link to="/collection">
                    Découvrir
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-white" asChild>
                  <Link to="/quiz">Quiz</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 lg:py-28">
          <div className="container-oud">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl text-stone-900">Nos Coups de Cœur</h2>
              </div>
              <Link to="/collection" className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-sm">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-stone-200 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-20 lg:py-28 bg-stone-50">
          <div className="container-oud">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl text-stone-900 mb-2">Les Favoris</h2>
              <p className="text-stone-500">Les oud préférés de nos clients</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-stone-200 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quiz CTA - Minimal */}
        <section className="py-20 lg:py-28">
          <div className="container-oud">
            <div className="bg-stone-900 rounded-3xl p-10 lg:p-16 text-center">
              <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                Trouvez Votre Oud
              </h2>
              <p className="text-stone-400 mb-8 max-w-md mx-auto">
                Répondez à quelques questions pour découvrir l'oud parfait pour vous.
              </p>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-stone-900" asChild>
                <Link to="/quiz">
                  Commencer le Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Section - Minimal */}
        <section className="py-16 border-t border-stone-200">
          <div className="container-oud">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-1">100%</div>
                <div className="text-stone-500 text-sm">Naturel</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-1">24-72h</div>
                <div className="text-stone-500 text-sm">Livraison</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-1">8</div>
                <div className="text-stone-500 text-sm">Pays</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-stone-900 mb-1">4.8/5</div>
                <div className="text-stone-500 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
