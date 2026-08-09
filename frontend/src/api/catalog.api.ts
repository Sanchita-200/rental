import { apiClient } from './client';
import { Category, Product, ProductVariant } from '../types';

export const catalogApi = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories/');
    return res.data;
  },
  getProducts: async (params?: { category_id?: string; search?: string; min_price?: number; max_price?: number }): Promise<Product[]> => {
    const res = await apiClient.get('/products/', { params });
    return res.data;
  },
  getProductById: async (id: string): Promise<Product> => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (productData: any): Promise<Product> => {
    const res = await apiClient.post('/products/', productData);
    return res.data;
  },
  updateProduct: async (productId: string, productData: any): Promise<Product> => {
    const res = await apiClient.put(`/products/${productId}`, productData);
    return res.data;
  },
  deleteProduct: async (productId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
  },
  addProductVariant: async (productId: string, variantData: any): Promise<ProductVariant> => {
    const res = await apiClient.post(`/products/${productId}/variants`, variantData);
    return res.data;
  },
  checkAvailability: async (productId: string, startDate: string, endDate: string): Promise<{ product_id: string; available: boolean; available_units: number; total_units: number; message: string }> => {
    const res = await apiClient.get(`/products/${productId}/availability`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return res.data;
  },
};
