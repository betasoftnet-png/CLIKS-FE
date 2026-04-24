import { apiClient } from '../api/client';

/**
 * Savings Service
 */
export const savingsService = {
    getSavings: async () => {
        return await apiClient.get('/savings');
    },
    createSaving: async (data) => {
        return await apiClient.post('/savings', data);
    },
    updateSaving: async (id, data) => {
        return await apiClient.put(`/savings/${id}`, data);
    },
    deleteSaving: async (id) => {
        return await apiClient.delete(`/savings/${id}`);
    }
};

export default savingsService;
