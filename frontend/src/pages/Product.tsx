import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Check, 
  Heart,
  Truck,
  Shield,
  Award
} from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { product, relatedProducts, loading, error } = useProduct(slug || '');
  const { addToCart } = useCart();
  
  const [selectedFormat, setSelectedFormat] = useState(product?.formats?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product?.formats?.[0]) {
      setSelectedFormat(product.formats[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-stone-900 mb-4">Produit non trouvé</h1>
          <Button asChild>
            <Link to="/collection">Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedFormat) {
      addToCart(product, selectedFormat.size, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

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

  const allImages = product.images || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link to="/" className="hover:text-stone-900">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/collection" className="hover:text-stone-900">Boutique</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-900">{product.name}</span>
          </nav>

          {/* Product Main */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden">
                <img
                  src={allImages[selectedImage] || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                        selectedImage === index
                          ? 'border-amber-500'
                          : 'border-transparent hover:border-stone-300'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.intensity && (
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full">
                    {intensityLabels[product.intensity]}
                  </span>
                )}
                {product.profile && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    {profileLabels[product.profile]}
                  </span>
                )}
                {product.isNew && (
                  <span className="px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-full">
                    Nouveau
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                    Best-seller
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <h1 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-stone-500">
                  ★ {product.rating} ({product.reviewCount} avis)
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-sm text-stone-500">{product.origin}</span>
              </div>

              {/* Description */}
              <p className="text-stone-600 mb-6">{product.shortDescription}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif text-3xl font-semibold text-stone-900">
                  {formatPrice(selectedFormat?.price || product.price || 0)}
                </span>
                {selectedFormat?.originalPrice && (
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(selectedFormat.originalPrice)}
                  </span>
                )}
              </div>

              {/* Variant Selection */}
              {product.formats && product.formats.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    Format
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.formats.map((format) => (
                      <button
                        key={format.size}
                        onClick={() => setSelectedFormat(format)}
                        disabled={!format.inStock}
                        className={cn(
                          'px-4 py-2 rounded-lg border-2 font-medium transition-all',
                          selectedFormat?.size === format.size
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-200 text-stone-700 hover:border-stone-400',
                          !format.inStock && 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        {format.size}
                        {!format.inStock && ' (Rupture)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Quantité
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <Button
                  size="lg"
                  className={cn(
                    'flex-1 transition-all duration-300',
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-600'
                      : 'bg-stone-900 hover:bg-stone-800'
                  )}
                  onClick={handleAddToCart}
                  disabled={!selectedFormat?.inStock}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Ajouté
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Ajouter
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'h-12 w-12',
                    isWishlisted && 'text-rose-500 border-rose-500'
                  )}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Livraison 24-72h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>100% Authentique</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Grade {product.grade}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent py-3"
              >
                Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-6">
              <div className="max-w-2xl">
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-500">Origine</span>
                    <p className="font-medium">{product.origin}</p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-500">Grade</span>
                    <p className="font-medium capitalize">{product.grade}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-6">Vous pourriez aussi aimer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
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
