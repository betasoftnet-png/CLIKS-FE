import { apiClient } from '../api/client';

/**
 * Investments Service
 */
export const investmentsService = {
    getInvestments: async (params = {}) => {
        return await apiClient.get('/investments', { params });
    },
    createInvestment: async (data) => {
        return await apiClient.post('/investments', data);
    },
    updateInvestment: async (id, data) => {
        return await apiClient.put(`/investments/${id}`, data);
    },
    deleteInvestment: async (id) => {
        return await apiClient.delete(`/investments/${id}`);
    }
};

export default investmentsService;
