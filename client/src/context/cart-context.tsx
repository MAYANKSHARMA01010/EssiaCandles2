import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { getSessionId } from '@/lib/utils';
import type { CartItem, Product } from '@shared/schema';

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [sessionId] = useState(() => getSessionId());

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart', {
        headers: {
          'X-Session-ID': sessionId,
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      return apiRequest('POST', '/api/cart', { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      return apiRequest('PUT', `/api/cart/${cartItemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      return apiRequest('DELETE', `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );

  // Set session ID header for API requests
  useEffect(() => {
    const originalRequest = apiRequest;
    (window as any).apiRequest = (method: string, url: string, data?: unknown) => {
      return fetch(url, {
        method,
        headers: {
          ...(data ? { "Content-Type": "application/json" } : {}),
          'X-Session-ID': sessionId,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });
    };
  }, [sessionId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart: async (productId: number, quantity = 1) => {
          await addToCartMutation.mutateAsync({ productId, quantity });
        },
        updateQuantity: async (cartItemId: number, quantity: number) => {
          await updateQuantityMutation.mutateAsync({ cartItemId, quantity });
        },
        removeFromCart: async (cartItemId: number) => {
          await removeFromCartMutation.mutateAsync(cartItemId);
        },
        clearCart: async () => {
          await clearCartMutation.mutateAsync();
        },
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
