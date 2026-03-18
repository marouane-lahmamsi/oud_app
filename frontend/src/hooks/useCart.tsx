import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, variantSize: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isOpen, setIsOpen] = useState(false);

  const calculateTotals = useCallback((items: CartItem[]): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 45;
    const discount = 0;
    const total = subtotal + shipping - discount;
    
    return {
      items,
      subtotal,
      shipping,
      discount,
      total,
    };
  }, []);

  const addToCart = useCallback((product: Product, variantSize: string, quantity: number = 1) => {
    const format = product.formats?.find(f => f.size === variantSize);
    if (!format) return;

    setCart(prev => {
      const existingItem = prev.items.find(
        item => item.product.id === product.id && item.variant.size === variantSize
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${format.size}-${Date.now()}`,
          product,
          variant: {
            id: Date.now(),
            product_id: parseInt(product.id.replace(/\D/g, '')) || 0,
            size: format.size,
            sku: `${product.slug}-${format.size}`,
            price: format.price,
            promo_price: format.originalPrice,
            stock_qty: 100,
            is_in_stock: format.inStock,
            is_low_stock: false,
            is_active: true,
            is_default: product.formats[0]?.size === format.size,
          },
          quantity,
          price: format.originalPrice || format.price,
        };
        newItems = [...prev.items, newItem];
      }

      return calculateTotals(newItems);
    });
    
    setIsOpen(true);
  }, [calculateTotals]);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      return calculateTotals(newItems);
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev => {
      const newItems = prev.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return calculateTotals(newItems);
    });
  }, [calculateTotals]);

  const clearCart = useCallback(() => {
    setCart(initialCart);
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
