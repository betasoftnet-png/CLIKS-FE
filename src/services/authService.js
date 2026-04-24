import { apiClient } from '../api/client';

/**
 * Authentication Service
 */
export const authService = {
    /**
     * Login with username and password
     */
    login: async (identifier, password) => {
        // Send as both so backend finds by either email or username
        return await authService.apiLogin({ email: identifier, username: identifier, password });
    },

    apiLogin: async (data) => {
        const res = await apiClient.post('/auth/login', data);
        return res.data;
    },

    /**
     * Register a new user
     */
    register: async (userData) => {
        const res = await apiClient.post('/auth/register', userData);
        return res.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        const res = await apiClient.get('/profile');
        return res.data;
    }
};

export default authService;
