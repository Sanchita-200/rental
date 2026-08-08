import { apiClient } from './client';
import { QRVerificationResponse, Rental } from '../types';

export const operationsApi = {
  verifyQR: async (qrToken: string): Promise<QRVerificationResponse> => {
    const res = await apiClient.post('/operations/verify-qr', { qr_token: qrToken });
    return res.data;
  },
  processPickup: async (rentalId: string): Promise<Rental> => {
    const res = await apiClient.post('/operations/process-pickup', { rental_id: rentalId });
    return res.data;
  },
  processReturn: async (payload: { rental_id: string; damage_fee?: number; forfeit_reason?: string }): Promise<Rental> => {
    const res = await apiClient.post('/operations/process-return', payload);
    return res.data;
  },
};
