import React, { createContext, useContext, useState, useMemo } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  startDate: string;
  endDate: string;
  durationDays: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateDates: (start: string, end: string) => void;
  clearCart: () => void;
  subtotalRent: number;
  totalDeposit: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Default dates: tomorrow to 3 days later
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 2);

  const [startDate, setStartDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().split('T')[0]);

  const durationDays = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [startDate, endDate]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateDates = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const clearCart = () => {
    setItems([]);
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
