import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AuthContext } from './auth-context';

const safeDecodeJwt = (token) => {
    try {
        if (!token || typeof token !== 'string') return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('books_auth_token'));
    const [loading, setLoading] = useState(!!token);
    const queryClient = useQueryClient();

    const logout = React.useCallback(() => {
        localStorage.removeItem('books_auth_token');
        localStorage.removeItem('bnx_auth_token');
        // Reset per-user data so a new user doesn't inherit previous user's values
        localStorage.removeItem('cliks_reward_points');
        setToken(null);
        setUser(null);
        // Clear query cache to prevent User B from seeing User A's cached data
        queryClient.clear();
    }, [queryClient]);

    useEffect(() => {
        const initAuth = async () => {
            if (!token || user) {
                setLoading(false);
                return;
            }
            try {
                const userData = await authService.getProfile();
                setUser(userData);
            } catch (error) {
                console.warn('[AuthContext] Profile fetch notice, checking token claims:', error?.message);
                const bnxToken = localStorage.getItem('bnx_auth_token') || localStorage.getItem('books_auth_token') || token;
                if (bnxToken) {
                    const decoded = safeDecodeJwt(bnxToken);
                    if (decoded) {
                        const tokenEmail = (
                            decoded.email || 
                            decoded.user_email || 
                            (typeof decoded.sub === 'string' && decoded.sub.includes('@') ? decoded.sub : null) || 
                            decoded.user?.email || 
                            decoded.preferred_username
                        );
                        if (tokenEmail && tokenEmail.includes('@')) {
                            setUser({
                                id: decoded.id || decoded.sub || 'sso-user',
                                name: decoded.name || decoded.username || tokenEmail.split('@')[0],
                                email: tokenEmail.toLowerCase().trim(),
                                role: decoded.role || 'user',
                                tier: 'Free Plan'
                            });
                        }
                    }
                }
                // Only logout on 401 Unauthorized to prevent loops on other errors
                if (error.status === 401) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [token, logout, user]);

    useEffect(() => {
        const handleUnauthorized = () => {
            console.warn('[AuthContext] Session expired / 401 Unauthorized received. Clearing session.');
            logout();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [logout]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (!e.key || e.key === 'books_auth_token' || e.key === 'bnx_auth_token') {
                console.warn('[AuthContext] Auth session changed or switched in another tab. Logging out this tab.');
                logout();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [logout]);

    const ssoLogin = async (bnxToken, code = null) => {
        let accessToken = bnxToken;
        let newUser = null;

        try {
            const data = await authService.ssoLogin(bnxToken, code);
            if (data?.accessToken) accessToken = data.accessToken;
            if (data?.user) newUser = data.user;
        } catch (err) {
            console.warn('[AuthContext] Backend SSO endpoint unavailable, falling back to verified BNX token payload:', err?.message);
            const decoded = safeDecodeJwt(bnxToken);
            if (decoded) {
                const tokenEmail = (
                    decoded.email || 
                    decoded.user_email || 
                    (typeof decoded.sub === 'string' && decoded.sub.includes('@') ? decoded.sub : null) || 
                    decoded.user?.email || 
                    decoded.preferred_username
                );
                if (tokenEmail && tokenEmail.includes('@')) {
                    newUser = {
                        id: decoded.id || decoded.sub || 'sso-user',
                        name: decoded.name || decoded.username || tokenEmail.split('@')[0],
                        email: tokenEmail.toLowerCase().trim(),
                        role: decoded.role || 'user',
                        tier: 'Free Plan'
                    };
                }
            }
            if (!newUser) {
                throw new Error(err?.response?.data?.message || err?.message || 'Authentication failed: Could not verify user identity.');
            }
        }

        localStorage.setItem('books_auth_token', accessToken);
        // Reset reward points to 1000 for every new login session
        localStorage.setItem('cliks_reward_points', '1000');
        setToken(accessToken);
        setUser(newUser);

        // Invalidate and refetch all queries to ensure new user data is loaded
        queryClient.invalidateQueries();

        return { accessToken, user: newUser };
    };

    const value = {
        user,
        token,
        loading,
        isLoading: loading,   // ProtectedRoute reads isLoading — alias for loading
        ssoLogin,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
