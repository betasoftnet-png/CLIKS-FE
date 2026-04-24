import { apiClient } from '../api/client';

/**
 * Income Service
 */
export const incomeService = {
    getIncome: async () => {
        return await apiClient.get('/income');
    },
    createIncome: async (data) => {
        return await apiClient.post('/income', data);
    },
    updateIncome: async (id, data) => {
        return await apiClient.put(`/income/${id}`, data);
    },
    deleteIncome: async (id) => {
        return await apiClient.delete(`/income/${id}`);
    }
};

export default incomeService;
