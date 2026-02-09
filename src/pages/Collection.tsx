import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { products } from '@/data/products';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Filters {
  intensity: string[];
  profile: string[];
  occasion: string[];
  priceRange: string[];
  origin: string[];
}

export function Collection() {
  const [searchParams] = useSearchParams();
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    intensity: [],
    profile: [],
    occasion: [],
    priceRange: [],
    origin: [],
  });

  // Apply URL filters
  const urlFilter = searchParams.get('filter');
  
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply URL filter
    if (urlFilter === 'new') {
      result = result.filter(p => p.isNew);
    } else if (urlFilter === 'bestseller') {
      result = result.filter(p => p.isBestseller);
    }

    // Apply user filters
    if (filters.intensity.length > 0) {
      result = result.filter(p => filters.intensity.includes(p.intensity));
    }
    if (filters.profile.length > 0) {
      result = result.filter(p => filters.profile.includes(p.profile));
    }
    if (filters.occasion.length > 0) {
      result = result.filter(p => p.occasion.some(o => filters.occasion.includes(o)));
    }
    if (filters.origin.length > 0) {
      result = result.filter(p => filters.origin.includes(p.origin));
    }
    if (filters.priceRange.length > 0) {
      result = result.filter(p => {
        const price = p.formats[0].price;
        return filters.priceRange.some(range => {
          if (range === 'under-300') return price < 300;
          if (range === '300-500') return price >= 300 && price <= 500;
          if (range === 'over-500') return price > 500;
          return false;
        });
      });
    }

    return result;
  }, [filters, urlFilter]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      intensity: [],
      profile: [],
      occasion: [],
      priceRange: [],
      origin: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  const filterOptions = {
    intensity: [
      { value: 'low', label: 'Doux' },
      { value: 'medium', label: 'Moyen' },
      { value: 'high', label: 'Intense' },
    ],
    profile: [
      { value: 'boise', label: 'Boisé' },
      { value: 'epice', label: 'Épicé' },
      { value: 'floral', label: 'Floral' },
      { value: 'sucre', label: 'Sucré' },
      { value: 'fume', label: 'Fumé' },
      { value: 'resineux', label: 'Résineux' },
    ],
    occasion: [
      { value: 'quotidien', label: 'Quotidien' },
      { value: 'special', label: 'Occasions spéciales' },
      { value: 'priere', label: 'Prière' },
      { value: 'meditation', label: 'Méditation' },
      { value: 'hotes', label: 'Recevoir' },
      { value: 'cadeau', label: 'Cadeau' },
    ],
    priceRange: [
      { value: 'under-300', label: 'Moins de 300 DH' },
      { value: '300-500', label: '300 - 500 DH' },
      { value: 'over-500', label: 'Plus de 500 DH' },
    ],
    origin: [
      { value: 'Cambodge', label: 'Cambodge' },
      { value: 'Indonésie', label: 'Indonésie' },
      { value: 'Malaisie', label: 'Malaisie' },
      { value: 'Thaïlande', label: 'Thaïlande' },
      { value: 'Vietnam', label: 'Vietnam' },
      { value: 'Yémen', label: 'Yémen' },
      { value: 'Inde', label: 'Inde' },
      { value: 'Brunei', label: 'Brunei' },
    ],
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Effacer les filtres
        </Button>
      )}

      {Object.entries(filterOptions).map(([category, options]) => (
        <div key={category}>
          <h4 className="font-medium text-stone-900 mb-3 capitalize">
            {category === 'priceRange' ? 'Prix' : 
             category === 'profile' ? 'Profil olfactif' :
             category === 'occasion' ? 'Occasion' :
             category === 'intensity' ? 'Intensité' : 'Origine'}
          </h4>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${option.value}`}
                  checked={filters[category as keyof Filters].includes(option.value)}
                  onCheckedChange={() => toggleFilter(category as keyof Filters, option.value)}
                />
                <Label
                  htmlFor={`${category}-${option.value}`}
                  className="text-sm text-stone-600 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div
            ref={ref}
            className={`mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Notre Collection
            </h1>
            <p className="text-stone-600 max-w-2xl">
              Découvrez notre sélection d'oud 100% naturels, soigneusement choisis 
              aux quatre coins du monde pour leur qualité exceptionnelle.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-stone-100">
            <div className="flex items-center gap-4">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtres
                    {hasActiveFilters && (
                      <span className="ml-2 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                        {Object.values(filters).flat().length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-stone-500">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-stone-100">
                <h3 className="font-medium text-lg mb-4">Filtres</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={viewMode === 'list' ? 'flex flex-row' : ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="font-medium text-lg text-stone-900 mb-2">
                    Aucun produit ne correspond
                  </h3>
                  <p className="text-stone-500 mb-4">
                    Essayez de modifier vos filtres
                  </p>
                  <Button onClick={clearFilters}>Effacer les filtres</Button>
                </div>
              )}
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
