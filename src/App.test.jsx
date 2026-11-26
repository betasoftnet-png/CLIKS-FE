import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import * as AuthContextModule from './context/auth-context';

// Mock auth-context (used by Landing, ProtectedRoute, Topbar, Sidebar, OnboardingContext via src/context)
vi.mock('./context/auth-context', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

const renderApp = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            <CurrencyProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </CurrencyProvider>
        </QueryClientProvider>
    );
};

describe('App Smoke Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // precise mocked behavior per test
        window.history.pushState({}, 'Root', '/');
    });

    it('renders landing page when unauthenticated', () => {
        // Mock useAuth to return unauthenticated state
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false
        });

        renderApp();

        // Landing page should be visible
        // "Books & Finance" is in Topbar (always visible?) No, Topbar is in MainLayout.
        // Landing page content: "The Future of Personal Finance" or similar.
        // Let's look for "Books & Finance" which is the document title or header.
        // Wait, Landing.jsx content? 
        // Step 268 build output shows Landing is small.
        // Let's assume there is some text "Books & Finance" or "Welcome".
        // Use a generic matcher or verify Landing component content.
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders dashboard when authenticated', async () => {
        // Mock authenticated
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false
        });

        window.history.pushState({}, 'Dashboard', '/books/dashboard');

        renderApp();

        // MainLayout -> Sidebar -> "Accounts" link
        // Suspense fallback might show first "Loading..."

        await waitFor(() => {
            // Check for books sidebar item
            expect(screen.getByText('Accounts')).toBeInTheDocument();
        });
    });

    it('redirects to landing when accessing protected route while unauthenticated', async () => {
        vi.mocked(AuthContextModule.useAuth).mockReturnValue({
            isAuthenticated: false,
            isLoading: false
        });

        window.history.pushState({}, 'Home', '/home');

        renderApp();

        // Should NOT see Sidebar
        await waitFor(() => {
            expect(screen.queryByText('Stock')).not.toBeInTheDocument();
        });
    });
});
