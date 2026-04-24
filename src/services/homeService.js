import { apiClient } from '../api/client';

/**
 * Home Service
 */
export const homeService = {
    getHomeStats: async () => {
        return await apiClient.get('/home');
    }
};

export default homeService;
