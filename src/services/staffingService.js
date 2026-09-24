import { apiClient } from '../api/client';

/**
 * Staffing & Employee Service
 */
export const staffingService = {
    getEmployees: () => apiClient.get('/staff').then(res => res.data?.data || res.data || res),
    createEmployee: (data) => apiClient.post('/staff', data).then(res => res.data?.data || res.data || res),
    updateEmployee: (id, data) => apiClient.put(`/staff/${id}`, data).then(res => res.data?.data || res.data || res),
    deleteEmployee: (id) => apiClient.delete(`/staff/${id}`).then(res => res.data?.data || res.data || res),
    searchEmployees: (q) => apiClient.get('/staff/search', { params: { q } }).then(res => res.data?.data || res.data || res),
};

export default staffingService;
