import { apiClient } from '../api/client';

/**
 * Contacts Service
 */
export const contactsService = {
    getContacts: async () => await apiClient.get('/contacts'),
    createContact: async (data) => await apiClient.post('/contacts', data),
    updateContact: async (id, data) => await apiClient.put(`/contacts/${id}`, data),
    deleteContact: async (id) => await apiClient.delete(`/contacts/${id}`),
};

export default contactsService;
