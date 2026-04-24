import { apiClient } from '../api/client';

/**
 * Public Feed Service
 */
export const publicService = {
    getFeed: async (params = {}) => await apiClient.get('/public/feed', { params }),
    getPostById: async (id) => await apiClient.get(`/public/posts/${id}`),
    createPost: async (data) => await apiClient.post('/public/posts', data),
    deletePost: async (id) => await apiClient.delete(`/public/posts/${id}`),
    likePost: async (id) => await apiClient.post(`/public/posts/${id}/like`),
};

export default publicService;
