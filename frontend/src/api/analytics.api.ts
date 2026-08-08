import { apiClient } from './client';
import { OverviewKPIs, RevenuePoint, AIInsightsResponse, AIChatResponse, AIDemandForecastResponse } from '../types';

export const analyticsApi = {
  getOverview: async (): Promise<OverviewKPIs> => {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  },
  getRevenueChart: async (): Promise<RevenuePoint[]> => {
    const res = await apiClient.get('/analytics/revenue-chart');
    return res.data;
  },
};

export const aiApi = {
  chat: async (message: string, contextRentalId?: string): Promise<AIChatResponse> => {
    const res = await apiClient.post('/ai/assistant/chat', { message, context_rental_id: contextRentalId });
    return res.data;
  },
  getDashboardInsights: async (): Promise<AIInsightsResponse> => {
    const res = await apiClient.get('/ai/dashboard-insights');
    return res.data;
  },
  getDemandPrediction: async (): Promise<AIDemandForecastResponse> => {
    const res = await apiClient.get('/ai/demand-prediction');
    return res.data;
  },
};
