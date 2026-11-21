import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import { pitchesService } from '../services/pitchesService';

vi.mock('../context', () => ({
    useAuth: () => ({ logout: vi.fn(), user: { id: 'user-1' } }),
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
    },
}));

const CurrentPath = () => {
    const location = useLocation();
    return <span data-testid="current-path">{location.pathname}</span>;
};

describe('Topbar notifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
});
