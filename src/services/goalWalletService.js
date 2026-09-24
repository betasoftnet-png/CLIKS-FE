import { apiClient } from '../api/client';

/**
 * Goal Wallet Service (Personal Purpose Wallet)
 */
export const goalWalletService = {
    getWallets: async (params) => await apiClient.get('/goal-wallets', { params }).then(res => res.data?.data || res.data || []),
    getWalletById: async (id) => await apiClient.get(`/goal-wallets/${id}`).then(res => res.data?.data || res.data),
    getWallet: async (id) => await apiClient.get(`/goal-wallets/${id}`).then(res => res.data?.data || res.data),
    createWallet: async (data) => await apiClient.post('/goal-wallets', data).then(res => res.data?.data || res.data),
    updateWallet: async (id, data) => {
        const payload = {
            ...data,
            target_amount: Number(data.target_amount ?? data.targetCap ?? 0)
        };
        try {
            return await apiClient.patch(`/goal-wallets/${id}`, payload).then(res => res.data?.data || res.data);
        } catch (e) {
            try {
                return await apiClient.put(`/goal-wallets/${id}`, payload).then(res => res.data?.data || res.data);
            } catch (err) {
                return await apiClient.put(`/segregation/wallets/${id}`, payload).then(res => res.data?.data || res.data);
            }
        }
    },
    addMoney: async (id, amount) => await apiClient.post(`/goal-wallets/${id}/add-money`, { amount }).then(res => res.data?.data || res.data),
    claimWallet: async (id) => await apiClient.post(`/goal-wallets/${id}/claim`).then(res => res.data?.data || res.data),
    deleteWallet: async (id) => await apiClient.delete(`/goal-wallets/${id}`).then(res => res.data?.data || res.data),
};

export default goalWalletService;
