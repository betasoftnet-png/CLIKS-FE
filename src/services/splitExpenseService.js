import { apiClient } from '../api/client';

/**
 * Split Expense Service
 */
export const splitExpenseService = {
    getSplits: async () => await apiClient.get('/split-expense'),
    getSplitById: async (id) => await apiClient.get(`/split-expense/${id}`),
    createSplit: async (data) => await apiClient.post('/split-expense', data),
    updateSplit: async (id, data) => await apiClient.put(`/split-expense/${id}`, data),
    deleteSplit: async (id) => await apiClient.delete(`/split-expense/${id}`),

    // Participants
    getParticipants: async (splitId) => await apiClient.get(`/split-expense/${splitId}/participants`),
    addParticipant: async (splitId, data) => await apiClient.post(`/split-expense/${splitId}/participants`, data),
    updateParticipant: async (splitId, participantId, data) => await apiClient.put(`/split-expense/${splitId}/participants/${participantId}`, data),
    deleteParticipant: async (splitId, participantId) => await apiClient.delete(`/split-expense/${splitId}/participants/${participantId}`),
    settleParticipant: async (splitId, participantId) => await apiClient.post(`/split-expense/${splitId}/participants/${participantId}/settle`),
};

export default splitExpenseService;
