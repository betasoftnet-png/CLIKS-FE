import { apiClient } from '../api/client';

export const customerLoyaltyService = {
    // Get all connected shops/merchants with points balance, spend, and visit count
    getMerchants: () => apiClient.get('/customer/merchants').then(res => res.data?.data || res.data || []),

    // Get customer overall loyalty wallet balance and chronological transaction ledger
    getLoyaltyWallet: () => apiClient.get('/customer/loyalty-wallet').then(res => res.data?.data || res.data || {}),

    // Get full purchase history from all shops with item breakdowns and points
    getPurchaseHistory: () => apiClient.get('/customer/purchase-history').then(res => res.data?.data || res.data || []),

    // Get specific shop history
    getMerchantHistory: (merchantId) => apiClient.get(`/customer/merchants/${merchantId}/history`).then(res => res.data?.data || res.data || {}),

    // Get individual invoice details for preview / receipt slip
    getInvoiceDetails: (id) => apiClient.get(`/customer/invoice/${id}`).then(res => res.data?.data || res.data || {}),

    // Overall loyalty stats
    getLoyaltyStats: () => apiClient.get('/finance-plus/loyalty').then(res => res.data?.data || res.data || {})
};

export default customerLoyaltyService;

