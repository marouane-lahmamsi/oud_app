import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { assetUrl } from '@/lib/assets';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
}

export function ProductCard({ product, className, showQuickAdd = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(product.formats?.[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickAdd = () => {
    if (selectedFormat) {
      addToCart(product, selectedFormat.size);
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

  // Get intensity label
  const intensityLabels: Record<string, string> = {
    low: 'Doux',
    medium: 'Moyen',
    high: 'Intense',
  };

  const intensityColors: Record<string, string> = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden transition-all duration-500',
        'border border-stone-200 hover:border-stone-300',
        'hover:shadow-lg',
        'hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <Link to={`/produit/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-stone-100">
        {/* Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
        )}
        
        {/* Product Image */}
        <img
          src={product.images?.[0] || assetUrl('images/products/oud-al-majlis-1.jpg')}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700',
            'group-hover:scale-105',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded-full">
              Nouveau
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Best-seller
            </span>
          )}
          {selectedFormat?.originalPrice && (
            <span className="px-2.5 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
              Promo
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-stone-900 hover:bg-stone-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/produit/${product.slug}`);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Profile & Intensity */}
        <div className="flex items-center justify-between mb-2">
          {product.intensity && (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              intensityColors[product.intensity]
            )}>
              {intensityLabels[product.intensity]}
            </span>
          )}
          {product.rating && (
            <span className="text-xs text-stone-500">
              ★ {product.rating}
            </span>
          )}
        </div>

        {/* Name */}
        <Link to={`/produit/${product.slug}`}>
          <h3 className="font-serif text-lg font-medium text-stone-900 mb-1 group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-sm text-stone-500 line-clamp-2 mb-3">
          {product.shortDescription}
        </p>

        {/* Format Selection */}
        {product.formats && product.formats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.formats.map((format) => (
              <button
                key={format.size}
                onClick={() => setSelectedFormat(format)}
                disabled={!format.inStock}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border transition-all',
                  selectedFormat?.size === format.size
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400',
                  !format.inStock && 'opacity-40 cursor-not-allowed'
                )}
              >
                {format.size}
              </button>
            ))}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-semibold text-stone-900">
              {formatPrice(selectedFormat?.price || product.price || 0)}
            </span>
            {selectedFormat?.originalPrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(selectedFormat.originalPrice)}
              </span>
            )}
          </div>

          {showQuickAdd && (
            <Button
              size="sm"
              onClick={handleQuickAdd}
              disabled={isAdded || !selectedFormat?.inStock}
              className={cn(
                'transition-all duration-300',
                isAdded
                  ? 'bg-emerald-600 hover:bg-emerald-600'
                  : 'bg-stone-900 hover:bg-stone-800'
              )}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Ajouté
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Ajouter
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
