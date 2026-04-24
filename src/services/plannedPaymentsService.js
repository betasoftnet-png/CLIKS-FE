import { apiClient } from '../api/client';

/**
 * Planned Payments Service
 */
export const plannedPaymentsService = {
    getPlannedPayments: async () => {
        // return await apiClient.get('/planned-payments');
        const res = await apiClient.get('/planned-payments');
        return res.data; // ✅ only array return
    },
    createPlannedPayment: async (data) => {
        return await apiClient.post('/planned-payments', data);
    },
    updatePlannedPayment: async (id, data) => {
        return await apiClient.put(`/planned-payments/${id}`, data);
    },
    deletePlannedPayment: async (id) => {
        return await apiClient.delete(`/planned-payments/${id}`);
    }
};

export default plannedPaymentsService;
