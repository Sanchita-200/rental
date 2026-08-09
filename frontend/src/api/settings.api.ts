import { apiClient } from './client';

export const settingsApi = {
  getMetrics: async () => {
    const res = await apiClient.get('/settings/metrics');
    return res.data;
  },

  getPriceLists: async () => {
    const res = await apiClient.get('/settings/price-lists');
    return res.data;
  },
  createPriceList: async (data: any) => {
    const res = await apiClient.post('/settings/price-lists', data);
    return res.data;
  },
  deletePriceList: async (id: string) => {
    const res = await apiClient.delete(`/settings/price-lists/${id}`);
    return res.data;
  },

  getAttributes: async () => {
    const res = await apiClient.get('/settings/attributes');
    return res.data;
  },
  createAttribute: async (data: any) => {
    const res = await apiClient.post('/settings/attributes', data);
    return res.data;
  },
  deleteAttribute: async (id: string) => {
    const res = await apiClient.delete(`/settings/attributes/${id}`);
    return res.data;
  },

  getRentalPeriods: async () => {
    const res = await apiClient.get('/settings/rental-periods');
    return res.data;
  },
  createRentalPeriod: async (data: any) => {
    const res = await apiClient.post('/settings/rental-periods', data);
    return res.data;
  },
  deleteRentalPeriod: async (id: string) => {
    const res = await apiClient.delete(`/settings/rental-periods/${id}`);
    return res.data;
  },
};
