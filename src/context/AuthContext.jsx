/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * 
 * IMPORTANT: This is a structural placeholder. Real authentication logic
 * (login, logout, token management) will be implemented in a future phase.
 */

import React, { createContext, useContext, useState, useMemo } from 'react';

// ---------------------------------------------------------------------------
// Context Creation
// ---------------------------------------------------------------------------

const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// Placeholder User Shape (for documentation/typing purposes)
// ---------------------------------------------------------------------------

/**
 * User object shape (when authenticated):
 * {
 *   id: string,
 *   email: string,
 *   name: string,
 *   // Additional fields TBD based on backend response
 * }
 */

// ---------------------------------------------------------------------------
// Auth Provider
// ---------------------------------------------------------------------------

/**
 * AuthProvider component.
 * Wraps the application and provides authentication state to all children.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
    // -------------------------------------------------------------------------
    // PLACEHOLDER STATE
    // -------------------------------------------------------------------------
    // TODO: Replace with real authentication logic in future phase.
    // Currently defaults to `true` so the app remains functional during development.
    // Set to `false` to test unauthenticated flows.
    // -------------------------------------------------------------------------

    const [isAuthenticated, setIsAuthenticated] = useState(true); // PLACEHOLDER: Change to `false` for testing
    const [user, setUser] = useState(null); // PLACEHOLDER: Will be populated from auth response
    const [isLoading, setIsLoading] = useState(false); // For future: loading state during auth check

    // -------------------------------------------------------------------------
    // Placeholder Auth Methods (to be implemented)
    // -------------------------------------------------------------------------

    /**
     * PLACEHOLDER: Login method.
     * Will be replaced with real API call in future phase.
     */
    const login = async (/* credentials */) => {
        // TODO: Implement real login
        // 1. Call auth API
        // 2. Store tokens
        // 3. Set user state
        // 4. Set isAuthenticated to true
        console.warn('[AuthContext] login() is a placeholder - not implemented');
    };

    /**
     * PLACEHOLDER: Logout method.
     * Will be replaced with real logout logic in future phase.
     */
    const logout = async () => {
        // TODO: Implement real logout
        // 1. Clear tokens
        // 2. Call logout API (if needed)
        // 3. Clear user state
        // 4. Set isAuthenticated to false
        console.warn('[AuthContext] logout() is a placeholder - not implemented');
        setUser(null);
        setIsAuthenticated(false);
    };

    /**
     * PLACEHOLDER: Check if user session is still valid.
     * Will be used on app mount to restore session.
     */
    const checkAuth = async () => {
        // TODO: Implement session validation
        // 1. Check for stored token
        // 2. Validate token with backend (or decode JWT)
        // 3. Set user and isAuthenticated accordingly
        console.warn('[AuthContext] checkAuth() is a placeholder - not implemented');
    };

    // -------------------------------------------------------------------------
    // Context Value
    // -------------------------------------------------------------------------

    const value = useMemo(
        () => ({
            // State
            isAuthenticated,
            user,
            isLoading,

            // Methods (placeholders)
            login,
            logout,
            checkAuth,

            // Internal setters (for future use)
            setUser,
            setIsAuthenticated,
        }),
        [isAuthenticated, user, isLoading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Custom Hook
// ---------------------------------------------------------------------------

/**
 * useAuth hook.
 * Provides access to authentication context.
 * Must be used within an AuthProvider.
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { isAuthenticated, user, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error(
            'useAuth must be used within an AuthProvider. ' +
            'Wrap your application with <AuthProvider> in main.jsx or App.jsx.'
        );
    }

    return context;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default AuthContext;
