import { Link } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-[#FAF7F2] flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="w-5 h-5" />
            Votre Panier
            {cart.items.length > 0 && (
              <span className="text-sm font-normal text-stone-500">
                ({cart.items.length} article{cart.items.length > 1 ? 's' : ''})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="font-serif text-xl text-stone-900 mb-2">
              Votre panier est vide
            </h3>
            <p className="text-stone-500 text-sm mb-6">
              Découvrez notre collection et trouvez l'oud parfait pour vous.
            </p>
            <Button onClick={() => setIsOpen(false)} asChild>
              <Link to="/collection">Découvrir la Collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-xl border border-stone-100"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/produit/${item.product.slug}`}
                            className="font-medium text-stone-900 hover:text-amber-700 transition-colors line-clamp-1"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-stone-500">
                            Format: {item.format}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 hover:bg-stone-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 hover:bg-stone-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-medium text-stone-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Shipping Progress */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    {cart.subtotal >= 500 ? (
                      'Livraison gratuite activée !'
                    ) : (
                      `Plus que ${formatPrice(500 - cart.subtotal)} pour la livraison gratuite`
                    )}
                  </span>
                </div>
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cart.subtotal / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="border-t border-stone-200 pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Sous-total</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Livraison</span>
                <span className={cn(
                  'font-medium',
                  cart.shipping === 0 && 'text-emerald-600'
                )}>
                  {cart.shipping === 0 ? 'Gratuite' : formatPrice(cart.shipping)}
                </span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Remise</span>
                  <span className="font-medium text-emerald-600">
                    -{formatPrice(cart.discount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-serif text-xl font-semibold">
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <Button 
                  className="w-full bg-stone-900 hover:bg-stone-800" 
                  size="lg"
                  asChild
                >
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>
                    Passer la Commande
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link to="/collection">
                    Continuer les Achats
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
