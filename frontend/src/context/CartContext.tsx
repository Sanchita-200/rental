import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import type { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { cartApi } from '../api/cart.api';

interface CartContextType {
  items: CartItem[];
  startDate: string;
  endDate: string;
  durationDays: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDates: (start: string, end: string) => void;
  clearCart: () => void;
  subtotalRent: number;
  totalDeposit: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Default dates: tomorrow to 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 2);

  const [startDate, setStartDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().split('T')[0]);

  // Track user session changes to prevent double loads
  const prevUserRef = useRef<string | null>(null);

  // 1. Initial Load & Synchronization when Auth state changes
  useEffect(() => {
    const syncWithBackend = async () => {
      if (user) {
        // User logged in
        try {
          const dbItems = await cartApi.getCartItems();
          
          // Get local items
          const localSaved = localStorage.getItem('rentflow_cart');
          const localItems: CartItem[] = localSaved ? JSON.parse(localSaved) : [];

          if (localItems.length > 0) {
            // Merge local items with DB items (giving priority to local quantity or combining)
            const mergedMap = new Map<string, CartItem>();
            
            // Add DB items first
            dbItems.forEach(item => {
              mergedMap.set(item.product.id, item);
            });
            
            // Overwrite or add local items
            localItems.forEach(item => {
              mergedMap.set(item.product.id, item);
            });

            const mergedList = Array.from(mergedMap.values());
            
            // Sync merged list to DB
            const synced = await cartApi.syncCart(
              mergedList.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
              }))
            );
            
            setItems(synced);
            localStorage.setItem('rentflow_cart', JSON.stringify(synced));
          } else {
            setItems(dbItems);
            localStorage.setItem('rentflow_cart', JSON.stringify(dbItems));
          }
        } catch (error) {
          console.error("Failed to sync cart with backend", error);
        }
      } else {
        // User logged out - load purely local fallback
        const localSaved = localStorage.getItem('rentflow_cart');
        if (localSaved) {
          try {
            setItems(JSON.parse(localSaved));
          } catch {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    // Only run if user session ID changes to avoid infinite loop
    const currentUserKey = user ? user.id : 'anonymous';
    if (prevUserRef.current !== currentUserKey) {
      prevUserRef.current = currentUserKey;
      syncWithBackend();
    }
  }, [user]);

  const durationDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [startDate, endDate]);

  const addToCart = async (product: Product, quantity = 1) => {
    // 1. Update React State
    let updatedItems: CartItem[] = [];
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        updatedItems = prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        updatedItems = [...prev, { product, quantity }];
      }
      localStorage.setItem('rentflow_cart', JSON.stringify(updatedItems));
      return updatedItems;
    });

    // 2. Persist to DB if user is logged in
    if (user) {
      try {
        await cartApi.addToCart(product.id, quantity);
      } catch (err) {
        console.error("Failed to add to database cart", err);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    // 1. Update React State
    setItems((prev) => {
      const updated = prev.filter((i) => i.product.id !== productId);
      localStorage.setItem('rentflow_cart', JSON.stringify(updated));
      return updated;
    });

    // 2. Persist to DB if user is logged in
    if (user) {
      try {
        await cartApi.removeFromCart(productId);
      } catch (err) {
        console.error("Failed to remove from database cart", err);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // 1. Update React State
    setItems((prev) => {
      const updated = prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      localStorage.setItem('rentflow_cart', JSON.stringify(updated));
      return updated;
    });

    // 2. Persist to DB if user is logged in
    if (user) {
      try {
        await cartApi.updateQuantity(productId, quantity);
      } catch (err) {
        console.error("Failed to update database cart quantity", err);
      }
    }
  };

  const updateDates = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const clearCart = async () => {
    // 1. Update React State
    setItems([]);
    localStorage.removeItem('rentflow_cart');

    // 2. Persist to DB if user is logged in
    if (user) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error("Failed to clear database cart", err);
      }
    }
  };

  const subtotalRent = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.base_daily_rate * durationDays * item.quantity, 0);
  }, [items, durationDays]);

  const totalDeposit = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.security_deposit_amount * item.quantity, 0);
  }, [items]);

  const grandTotal = useMemo(() => subtotalRent + totalDeposit, [subtotalRent, totalDeposit]);

  return (
    <CartContext.Provider
      value={{
        items,
        startDate,
        endDate,
        durationDays,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateDates,
        clearCart,
        subtotalRent,
        totalDeposit,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
