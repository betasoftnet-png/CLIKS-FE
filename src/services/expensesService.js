import { apiClient } from '../api/client';

/**
 * Expenses Service
 */
export const expensesService = {
    getExpenses: async () => {
        return await apiClient.get('/expenses');
    },
    createExpense: async (data) => {
        return await apiClient.post('/expenses', data);
    },
    updateExpense: async (id, data) => {
        return await apiClient.put(`/expenses/${id}`, data);
    },
    deleteExpense: async (id) => {
        return await apiClient.delete(`/expenses/${id}`);
    }
};

export default expensesService;
