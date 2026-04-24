import { apiClient } from '../api/client';

/**
 * Budgets Service
 */
export const budgetsService = {
    getBudgets: async () => {
        // return await apiClient.get('/budgets');
        const res = await apiClient.get('/budgets');
        return res.data; // only array return pannum
    },
    createBudget: async (data) => {
        return await apiClient.post('/budgets', data);
    },
    updateBudget: async (id, data) => {
        return await apiClient.put(`/budgets/${id}`, data);
    },
    deleteBudget: async (id) => {
        return await apiClient.delete(`/budgets/${id}`);
    }
};

export default budgetsService;
