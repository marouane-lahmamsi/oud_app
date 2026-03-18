import { useState, useEffect } from 'react';
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
import { productsAPI } from '@/services/api';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface Filters {
  intensity: string[];
  profile: string[];
  origin: string[];
}

export function Collection() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    intensity: [],
    profile: [],
    origin: [],
  });
  const [availableFilters, setAvailableFilters] = useState<{
    origins: string[];
    profiles: string[];
    intensities: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    pages: 1,
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      console.log('[DEBUG] fetchProducts started');
      
      const params: any = {
        page: pagination.page,
        per_page: pagination.per_page,
      };

      // Apply URL filters
      const urlFilter = searchParams.get('filter');
      if (urlFilter === 'new') params.is_new = true;
      if (urlFilter === 'bestseller') params.is_bestseller = true;
      if (urlFilter === 'featured') params.is_featured = true;

      // Apply user filters
      if (filters.intensity.length > 0) {
        params.intensity = filters.intensity[0]; // API supports single value
      }
      if (filters.profile.length > 0) {
        params.profile = filters.profile[0];
      }
      if (filters.origin.length > 0) {
        params.origin = filters.origin[0];
      }

      console.log('[DEBUG] params to API:', params);
      const result = await productsAPI.getAll(params);
      
      console.log('[DEBUG] Full API result:', result);
      console.log('[DEBUG] result.success:', result.success);
      console.log('[DEBUG] result.data:', result.data);
      console.log('[DEBUG] Type of result.data:', typeof result.data);
      console.log('[DEBUG] Is Array?:', Array.isArray(result.data));
      
      // Check if result.data has .data property (nested structure)
      if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
        console.log('[DEBUG] result.data has .data?:', 'data' in result.data);
        console.log('[DEBUG] result.data.data:', (result.data as any).data);
        console.log('[DEBUG] result.data.pagination:', (result.data as any).pagination);
      }
      
      if (result.success && result.data) {
        let productsData: any[] = [];
        let paginationData: any = null;
        
        if (Array.isArray(result.data)) {
          // Backend returns: { data: [...products], pagination: {...}, success: true }
          // So result.data is directly the products array
          productsData = result.data;
          paginationData = (result as any).pagination;
          console.log('[DEBUG] result.data is Array - using directly');
        } else {
          // Nested structure: result.data = { data: [...], pagination: {...} }
          productsData = (result.data as any).data || [];
          paginationData = (result.data as any).pagination;
          console.log('[DEBUG] result.data is Object - using .data property');
        }
        
        console.log('[DEBUG] Final products count:', productsData.length);
        setProducts(productsData);
        setPagination(prev => ({
          ...prev,
          total: paginationData?.total || productsData.length,
          pages: paginationData?.pages || 1,
        }));
      } else {
        console.log('[DEBUG] API error or no data:', result.error);
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, [searchParams, filters, pagination.page]);

  // Fetch categories and filters
  useEffect(() => {
    const fetchData = async () => {
      const filtersResult = await productsAPI.getFilters();

      if (filtersResult.success && filtersResult.data) {
        setAvailableFilters(filtersResult.data);
      }
    };

    fetchData();
  }, []);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      intensity: [],
      profile: [],
      origin: [],
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  const intensityLabels: Record<string, string> = {
    low: 'Doux',
    medium: 'Moyen',
    high: 'Intense',
  };

  const profileLabels: Record<string, string> = {
    boise: 'Boisé',
    epice: 'Épicé',
    floral: 'Floral',
    sucre: 'Sucré',
    fume: 'Fumé',
    resineux: 'Résineux',
    doux: 'Doux',
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Effacer les filtres
        </Button>
      )}

      {/* Intensity Filter */}
      {availableFilters?.intensities && availableFilters.intensities.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-900 mb-3">Intensité</h4>
          <div className="space-y-2">
            {availableFilters.intensities.map((intensity) => (
              <div key={intensity} className="flex items-center space-x-2">
                <Checkbox
                  id={`intensity-${intensity}`}
                  checked={filters.intensity.includes(intensity)}
                  onCheckedChange={() => toggleFilter('intensity', intensity)}
                />
                <Label htmlFor={`intensity-${intensity}`} className="text-sm text-stone-600 cursor-pointer">
                  {intensityLabels[intensity] || intensity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Filter */}
      {availableFilters?.profiles && availableFilters.profiles.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-900 mb-3">Profil</h4>
          <div className="space-y-2">
            {availableFilters.profiles.map((profile) => (
              <div key={profile} className="flex items-center space-x-2">
                <Checkbox
                  id={`profile-${profile}`}
                  checked={filters.profile.includes(profile)}
                  onCheckedChange={() => toggleFilter('profile', profile)}
                />
                <Label htmlFor={`profile-${profile}`} className="text-sm text-stone-600 cursor-pointer">
                  {profileLabels[profile] || profile}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Origin Filter */}
      {availableFilters?.origins && availableFilters.origins.length > 0 && (
        <div>
          <h4 className="font-medium text-stone-900 mb-3">Origine</h4>
          <div className="space-y-2">
            {availableFilters.origins.map((origin) => (
              <div key={origin} className="flex items-center space-x-2">
                <Checkbox
                  id={`origin-${origin}`}
                  checked={filters.origin.includes(origin)}
                  onCheckedChange={() => toggleFilter('origin', origin)}
                />
                <Label htmlFor={`origin-${origin}`} className="text-sm text-stone-600 cursor-pointer">
                  {origin}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Notre Collection
            </h1>
            <p className="text-stone-600 max-w-2xl">
              Découvrez notre sélection d'oud 100% naturels.
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
                {pagination.total} produit{pagination.total > 1 ? 's' : ''}
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
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-stone-200 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Précédent
                  </Button>
                  <span className="flex items-center px-4 text-stone-600">
                    Page {pagination.page} sur {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Suivant
                  </Button>
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
