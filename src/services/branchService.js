import { apiClient } from '../api/client';

export const branchService = {
  getBranches: (params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get('/branches', { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  getBranch: (id) => apiClient.get(`/branches/${id}`).then(res => res.data?.data || res.data),

  createBranch: (data) => apiClient.post('/branches', data).then(res => res.data?.data || res.data),

  updateBranch: (id, data) => apiClient.patch(`/branches/${id}`, data).then(res => res.data?.data || res.data),

  deleteBranch: (id) => apiClient.delete(`/branches/${id}`).then(res => res.data?.data || res.data),

  getBranchStock: (branchId, params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get(`/branches/${branchId}/stock`, { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  getBranchLowStock: (branchId, params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get(`/branches/${branchId}/low-stock`, { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  adjustBranchStock: (data) => apiClient.post('/branches/stock/adjust', data).then(res => res.data?.data || res.data),

  getTransfers: (params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get('/branches/transfers', { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  createTransfer: (data) => apiClient.post('/branches/transfers', data).then(res => res.data?.data || res.data),

  createReverseTransfer: (data) => apiClient.post('/branches/transfers/reverse', data).then(res => res.data?.data || res.data),

  createAutoRequisition: (branchId, data) => apiClient.post(`/branches/${branchId}/auto-requisition`, data).then(res => res.data?.data || res.data),

  getShowroomPromotions: (params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get('/branches/showroom-promotions', { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  requestShowroomPromotion: (data) => apiClient.post('/branches/showroom-promotions', data).then(res => res.data?.data || res.data),

  updateShowroomPromotionStatus: (id, data) => apiClient.patch(`/branches/showroom-promotions/${id}/status`, data).then(res => res.data?.data || res.data),

  deleteShowroomPromotion: (id) => apiClient.delete(`/branches/showroom-promotions/${id}`).then(res => res.data?.data || res.data),

  getCrossBranchCustomers: (params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get('/branches/cross-branch/customers', { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  getCustomerCrossBranchHistory: (customerId, params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get(`/branches/cross-branch/customers/${customerId}/history`, { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  issueCrossBranchStoreCredit: (customerId, payload) => apiClient.post(`/branches/cross-branch/customers/${customerId}/store-credit`, payload).then(res => res.data?.data || res.data),

  updateSubIdBranch: (subId, data) => apiClient.patch(`/branches/sub-ids/${subId}/branch`, data).then(res => res.data?.data || res.data)
};

export default branchService;
