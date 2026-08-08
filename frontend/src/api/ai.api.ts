import { apiClient } from './client';
import { AIChatResponse, AIInsightsResponse, AIDemandForecastResponse } from '../types';

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
