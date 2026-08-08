import { apiClient } from './client';
import { CartItem } from '../types';

export const cartApi = {
  getCartItems: async (): Promise<CartItem[]> => {
    const res = await apiClient.get('/cart/');
    return res.data;
  },
  addToCart: async (productId: string, quantity = 1): Promise<CartItem> => {
    const res = await apiClient.post('/cart/', { product_id: productId, quantity });
    return res.data;
  },
  updateQuantity: async (productId: string, quantity: number): Promise<CartItem> => {
    const res = await apiClient.put(`/cart/${productId}`, { quantity });
    return res.data;
  },
  removeFromCart: async (productId: string): Promise<void> => {
    await apiClient.delete(`/cart/${productId}`);
  },
  syncCart: async (items: { product_id: string; quantity: number }[]): Promise<CartItem[]> => {
    const res = await apiClient.post('/cart/sync', { items });
    return res.data;
  },
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart/');
  }
};
