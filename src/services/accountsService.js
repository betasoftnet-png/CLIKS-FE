import { apiClient } from '../api/client';

/**
 * Accounts Service
 */
export const accountsService = {
    /**
     * Get all accounts
     */
    getAccounts: async () => {
        const res = await apiClient.get('/accounts');
        return res.data; // only array return pannum
    },

    /**
     * Get account details by ID
     */
    getAccountById: async (id) => {
        return await apiClient.get(`/accounts/${id}`);
    },

    /**
     * Create a new account
     */
    createAccount: async (accountData) => {
        return await apiClient.post('/accounts', accountData);
    },

    /**
     * Update an account
     */
    updateAccount: async (id, accountData) => {
        return await apiClient.put(`/accounts/${id}`, accountData);
    },

    /**
     * Delete an account
     */
    deleteAccount: async (id) => {
        return await apiClient.delete(`/accounts/${id}`);
    }
};

export default accountsService;
