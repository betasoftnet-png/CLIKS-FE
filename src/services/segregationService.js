import { apiClient } from '../api/client';

/**
 * Segregation Service
 */
export const segregationService = {
    getSegregations: async () => await apiClient.get('/segregation'),
    createSegregation: async (data) => await apiClient.post('/segregation', data),
    deleteSegregation: async (id) => await apiClient.delete(`/segregation/${id}`),
    getSummary: async () => await apiClient.get('/segregation/summary'),
};

export default segregationService;
