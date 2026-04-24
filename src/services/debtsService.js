import { apiClient } from '../api/client';

/**
 * Debts Service
 */
export const debtsService = {
    getDebts: async () => {
        return await apiClient.get('/debts');
    },
    createDebt: async (data) => {
        return await apiClient.post('/debts', data);
    },
    updateDebt: async (id, data) => {
        return await apiClient.put(`/debts/${id}`, data);
    },
    deleteDebt: async (id) => {
        return await apiClient.delete(`/debts/${id}`);
    }
};

export default debtsService;
