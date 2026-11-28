import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import { pitchesService } from '../services/pitchesService';

const authState = {
    logout: vi.fn(),
    user: { id: 'user-1' },
};

vi.mock('../context', () => ({
    useAuth: () => authState,
}));

vi.mock('./ProfileDropdown', () => ({
    ProfileDropdown: () => null,
}));

vi.mock('./SearchBox', () => ({
    default: () => null,
}));

vi.mock('../services/pitchesService', () => ({
    pitchesService: {
        getNotifications: vi.fn(),
        markNotificationRead: vi.fn(),
    },
}));

vi.mock('../services/caService', () => ({
    caService: {
        getIcaiVerification: vi.fn().mockResolvedValue(null),
        getFinproSubscription: vi.fn().mockResolvedValue(null),
    },
}));

const CurrentPath = () => {
    const location = useLocation();
    return <span data-testid="current-path">{location.pathname}</span>;
};

describe('Topbar notifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        authState.user = { id: 'user-1' };
        pitchesService.getNotifications.mockResolvedValue([
            { id: 'notification-1', title: 'Payment received', is_read: false },
        ]);
    });

    it('opens the notifications list and shows the unread count', async () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));

        expect(await screen.findByText('Payment received')).toBeInTheDocument();
        expect(screen.getByLabelText('1 unread notifications')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Mark as read' })).toBeInTheDocument();
    });

    it('marks a notification as read on button click and updates unread badge dynamically', async () => {
        pitchesService.getNotifications.mockResolvedValue([
            { id: 'notif-1', message: 'Invoice 101 generated', is_read: false, created_at: '2026-11-17T17:02:00Z' },
            { id: 'notif-2', message: 'Invoice 102 generated', is_read: false, created_at: '2026-11-17T16:55:00Z' },
        ]);
        pitchesService.markNotificationRead.mockResolvedValue({ success: true });

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // Badge initially shows 2
        expect(await screen.findByLabelText('2 unread notifications')).toBeInTheDocument();

        // Open notifications dropdown - count must NOT change just from opening
        fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
        expect(await screen.findByText('Invoice 101 generated')).toBeInTheDocument();
        expect(screen.getByLabelText('2 unread notifications')).toBeInTheDocument();

        // Find the "Mark as read" buttons
        const markButtons = screen.getAllByRole('button', { name: 'Mark as read' });
        expect(markButtons.length).toBe(2);

        // Click mark as read on the first notification
        fireEvent.click(markButtons[0]);

        // Expect service to be called
        expect(pitchesService.markNotificationRead).toHaveBeenCalledWith('notif-1');

        // Badge should update from 2 to 1
        expect(await screen.findByLabelText('1 unread notifications')).toBeInTheDocument();

        // The first button now says "Read" and is disabled
        expect(screen.getByRole('button', { name: 'Read' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Read' })).toBeDisabled();

        // Clicking the remaining "Mark as read" button
        const secondMarkBtn = screen.getByRole('button', { name: 'Mark as read' });
        fireEvent.click(secondMarkBtn);

        // Badge should disappear when count reaches 0
        await waitFor(() => {
            expect(screen.queryByLabelText(/unread notifications/i)).not.toBeInTheDocument();
        });
    });

    it('shows the FIN-PRO navbar button after activation and opens FIN-PRO', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.queryByRole('button', { name: 'FIN-PRO' })).not.toBeInTheDocument();

        act(() => {
            window.dispatchEvent(new Event('finpro:subscription-activated'));
        });

        fireEvent.click(screen.getByRole('button', { name: 'FIN-PRO' }));
        expect(screen.getByTestId('current-path')).toHaveTextContent('/ca');
    });

    it('shows the FIN-PRO badge for active Fin-Pro Solo and Fin-Pro Firm subscriptions', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        authState.user = {
            id: 'user-solo',
            active_subscriptions: { fin_pro: { plan: 'Fin-Pro Solo', status: 'active' } },
        };

        const view = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'FIN-PRO' }));
        expect(screen.getByTestId('current-path')).toHaveTextContent('/ca');

        view.unmount();
        authState.user = {
            id: 'user-firm',
            finpro_plan: 'Fin-Pro Firm',
        };

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByRole('button', { name: 'FIN-PRO' })).toBeInTheDocument();
    });

    it('shows FIN-PRO badge when user active_subscriptions is a JSON string', () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        authState.user = {
            id: 'user-json-subs',
            active_subscriptions: JSON.stringify({
                fin_pro: { plan: 'Fin-Pro Solo', active: true }
            }),
        };

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByRole('button', { name: 'FIN-PRO' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'FIN-PRO' }));
        expect(screen.getByTestId('current-path')).toHaveTextContent('/ca');
    });

    it('shows FIN-PRO badge when user is ICAI-verified via caService', async () => {
        const { caService } = await import('../services/caService');
        caService.getIcaiVerification.mockResolvedValueOnce({
            status: 'VERIFIED',
            isVerified: true,
        });

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        authState.user = { id: 'user-icai' };

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByRole('button', { name: 'FIN-PRO' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'FIN-PRO' }));
        expect(screen.getByTestId('current-path')).toHaveTextContent('/ca');
    });

    it('shows FIN-PRO badge when user has active subscription from caService.getFinproSubscription', async () => {
        const { caService } = await import('../services/caService');
        caService.getFinproSubscription.mockResolvedValueOnce({
            active: true,
            subscription: { plan_name: 'Fin-Pro Firm', status: 'ACTIVE' },
        });

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        authState.user = { id: 'user-sub-api' };

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Topbar
                        onToggleSidebar={vi.fn()}
                        onToggleAudit={vi.fn()}
                        onToggleToolbar={vi.fn()}
                        isToolbarOpen={false}
                        onOpenCalculator={vi.fn()}
                    />
                    <CurrentPath />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByRole('button', { name: 'FIN-PRO' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'FIN-PRO' }));
        expect(screen.getByTestId('current-path')).toHaveTextContent('/ca');
    });
});
