import { apiClient } from '../api/client';

export const productsService = {
  getProducts: (params) => {
    const cleanParams = params && !params.queryKey ? params : undefined;
    return apiClient.get('/products', { params: cleanParams }).then(res => res.data?.data || res.data);
  },

  getProduct: (id) => apiClient.get(`/products/${id}`).then(res => res.data?.data || res.data),

  createProduct: (data) => apiClient.post('/products', data).then(res => res.data?.data || res.data),

  updateProduct: (id, data) => apiClient.patch(`/products/${id}`, data).then(res => res.data?.data || res.data),

  deleteProduct: (id) => apiClient.delete(`/products/${id}`).then(res => res.data?.data || res.data)
};

export default productsService;
