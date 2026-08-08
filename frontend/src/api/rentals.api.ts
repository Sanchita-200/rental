import { apiClient } from './client';
import { Rental, RentalCalculateResponse } from '../types';

export const rentalsApi = {
  calculateSummary: async (payload: { items: { product_id: string; quantity: number }[]; start_date: string; end_date: string }): Promise<RentalCalculateResponse> => {
    const res = await apiClient.post('/rentals/calculate-summary', payload);
    return res.data;
  },
  checkout: async (payload: { items: { product_id: string; quantity: number }[]; start_date: string; end_date: string; payment_method?: string }): Promise<Rental> => {
    const res = await apiClient.post('/rentals/checkout', payload);
    return res.data;
  },
  getMyRentals: async (): Promise<Rental[]> => {
    const res = await apiClient.get('/rentals/my-rentals');
    return res.data;
  },
  getAllRentalsAdmin: async (): Promise<Rental[]> => {
    const res = await apiClient.get('/rentals/admin/all');
    return res.data;
  },
  getRentalById: async (id: string): Promise<Rental> => {
    const res = await apiClient.get(`/rentals/${id}`);
    return res.data;
  },
  cancelRental: async (id: string): Promise<Rental> => {
    const res = await apiClient.post(`/rentals/${id}/cancel`);
    return res.data;
  },
};
