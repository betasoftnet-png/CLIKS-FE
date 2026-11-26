import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { OnboardingProvider } from './OnboardingContext';
import { useOnboarding } from './onboarding-context';
import OnboardingManager from '../components/onboarding/OnboardingManager';

const authMock = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
};

vi.mock('./auth-context', () => ({
    useAuth: () => authMock,
}));

const DemoHarness = ({ omitTargets = [], onFinancialAction = () => {} }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);
    const [toolbarOpen, setToolbarOpen] = React.useState(false);
    const [launcherOpen, setLauncherOpen] = React.useState(false);
    const [purchaseTab, setPurchaseTab] = React.useState('shop-points');
    const [financeTab, setFinanceTab] = React.useState('receivables');
    const [peopleTab, setPeopleTab] = React.useState('contacts');
    const {
        availablePageTours,
        startMainTour,
        startPageTour,
        resetOnboarding,
        activeTour,
        currentStep,
    } = useOnboarding();

    const hasTarget = (name) => !omitTargets.includes(name);

    return (
        <div>
            <div data-testid="current-route">{location.pathname}</div>
            <div data-testid="active-tour-id">{activeTour?.id || ''}</div>
            <div data-testid="active-step-id">{currentStep?.id || ''}</div>

            {hasTarget('topbar-nav-books') && (
                <button data-tour="topbar-nav-books" type="button" onClick={() => navigate('/books/dashboard')}>
                    Books
                </button>
            )}
            {hasTarget('topbar-nav-payments') && (
                <button data-tour="topbar-nav-payments" type="button" onClick={() => navigate('/payments/people')}>
                    Payments
                </button>
            )}
            {hasTarget('topbar-nav-social') && (
                <button data-tour="topbar-nav-social" type="button" onClick={() => navigate('/social/meetup')}>
                    Social
                </button>
            )}
            {hasTarget('topbar-notifications') && (
                <button data-tour="topbar-notifications" type="button" onClick={() => setNotificationsOpen((open) => !open)}>
                    Notifications
                </button>
            )}
            {notificationsOpen && <div data-tour="notification-panel-heading">Recent notifications</div>}
            {hasTarget('profile-dropdown-toggle') && (
                <button
                    data-tour="profile-dropdown-toggle"
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                >
                    Profile
                </button>
            )}
            {profileOpen && <div data-tour="profile-summary">Profile details</div>}
            {hasTarget('topbar-toolbar-toggle') && (
                <button data-tour="topbar-toolbar-toggle" type="button" onClick={() => setToolbarOpen((open) => !open)}>
                    Access Kit
                </button>
            )}
            {toolbarOpen && (
                <button data-tour="toolbar-beta-products" type="button" onClick={() => setLauncherOpen(true)}>
                    Product launcher
                </button>
            )}
            {launcherOpen && (
                <button type="button">
                    <span data-tour="product-bit-tool-icon">Tool icon</span>
                    <span data-tour="product-bit-tool">BIT Tool</span>
                </button>
            )}
            {hasTarget('sidebar-product-launcher') && (
                <button data-tour="sidebar-product-launcher" type="button" onClick={() => setLauncherOpen(true)}>
                    Sidebar app launcher
                </button>
            )}
            {hasTarget('topbar-search') && <div data-tour="topbar-search">Search</div>}
            {hasTarget('topbar-finpro') && <button data-tour="topbar-finpro" type="button">FIN-PRO</button>}
            {hasTarget('sidebar-books-quick-entry') && (
                <div data-tour="sidebar-books-quick-entry">
                    <button type="button" onClick={onFinancialAction}>Add Income</button>
                </div>
            )}
            {hasTarget('sidebar-accounts') && (
                <button data-tour="sidebar-accounts" type="button" onClick={() => navigate('/books/accounting')}>
                    Accounts
                </button>
            )}
            {hasTarget('sidebar-transactions') && (
                <button data-tour="sidebar-transactions" type="button" onClick={() => navigate('/payments/transactions')}>
                    Transaction
                </button>
            )}
            {hasTarget('sidebar-purchases') && (
                <button data-tour="sidebar-purchases" type="button" onClick={() => navigate('/books/purchase-details')}>
                    Purchases
                </button>
            )}
            {hasTarget('sidebar-income') && (
                <button data-tour="sidebar-income" type="button" onClick={() => navigate('/books/income')}>Income</button>
            )}
            {hasTarget('sidebar-expenses') && (
                <button data-tour="sidebar-expenses" type="button" onClick={() => navigate('/books/expenses')}>Expenses</button>
            )}
            {hasTarget('sidebar-report') && (
                <button data-tour="sidebar-report" type="button" onClick={() => navigate('/books')}>Report</button>
            )}
            {hasTarget('sidebar-payments-add-tx') && (
                <button data-tour="sidebar-payments-add-tx" type="button" onClick={onFinancialAction}>
                    Add Transaction
                </button>
            )}
            {hasTarget('sidebar-footer-system') && <div data-tour="sidebar-footer-system">Footer</div>}
            {hasTarget('sidebar-help-support') && (
                <button data-tour="sidebar-help-support" type="button">Help &amp; Support</button>
            )}

            <Routes>
                <Route
                    path="/books/dashboard"
                    element={
                        <div>
                            {hasTarget('books-dashboard-shortcuts') && (
                                <div data-tour="books-dashboard-shortcuts">Shortcuts</div>
                            )}
                        </div>
                    }
                />
                <Route
                    path="/books/accounting"
                    element={
                        <div>
                            <button data-tour="accounting-tax-deductions" type="button" onClick={() => navigate('/books/tax-deductions')}>
                                Tax &amp; Deductions
                            </button>
                            <div data-tour="accounting-additional-source">Additional source</div>
                            <div data-tour="accounting-bills-reminders">Bills &amp; reminders</div>
                            <div data-tour="accounting-fixed-source">Fixed source</div>
                        </div>
                    }
                />
                <Route path="/books/tax-deductions" element={<div data-tour="tax-deductions-heading">Tax &amp; Deductions</div>} />
                <Route
                    path="/books/purchase-details"
                    element={
                        <div>
                            <button data-tour="purchases-link-store" type="button">Link Store</button>
                            <div data-tour="purchases-stores-heading">Active Store Integrations</div>
                            {['shop-points', 'point-history', 'purchases', 'warranty'].map((tab) => (
                                <button
                                    key={tab}
                                    data-tour={`purchases-tab-${tab}`}
                                    type="button"
                                    onClick={() => setPurchaseTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                            {purchaseTab === 'shop-points' && <div data-tour="purchases-store-points-heading">Store Points &amp; Balance</div>}
                            {purchaseTab === 'point-history' && <div data-tour="purchases-history-heading">Point History Ledger</div>}
                            {purchaseTab === 'purchases' && <div data-tour="purchases-invoices-heading">Purchase Invoices</div>}
                            {purchaseTab === 'warranty' && <div data-tour="purchases-warranty-heading">Warranty Products</div>}
                        </div>
                    }
                />
                <Route path="/books/income" element={<button data-tour="income-record-button">Record Income</button>} />
                <Route path="/books/expenses" element={<button data-tour="expense-add-button">Add Expense</button>} />
                <Route
                    path="/payments/people"
                    element={
                        <div>
                            <span data-tour="people-pay-icon">Pay icon</span>
                            <span data-tour="people-pay-heading">To Pay</span>
                            <button data-tour="people-log-transaction">Log Transaction</button>
                            <button data-tour="people-add-contact">Add People Contact</button>
                            {['contacts', 'groups', 'requests', 'transactions', 'reminders'].map((tab) => (
                                <button
                                    key={tab}
                                    data-tour={`people-tab-${tab}`}
                                    type="button"
                                    onClick={() => setPeopleTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                            <div data-testid="people-tab-content">{peopleTab}</div>
                        </div>
                    }
                />
                <Route
                    path="/payments/transactions"
                    element={
                        <div>
                            <button data-tour="finance-add-transaction">Add Transaction</button>
                            {['receivables', 'payables', 'bank', 'reminders'].map((tab) => (
                                <button
                                    key={tab}
                                    data-tour={`finance-tab-${tab}`}
                                    type="button"
                                    onClick={() => setFinanceTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                            <div data-testid="finance-tab-content">{financeTab}</div>
                        </div>
                    }
                />
                <Route
                    path="/social/meetup"
                    element={
                        <div data-tour="social-guide-ready">
                            <button data-tour="social-active-deals" type="button">Active Deals Marketplace</button>
                            <button data-tour="social-my-studio" type="button">My Studio (Founder View)</button>
                        </div>
                    }
                />
                <Route
                    path="/books"
                    element={
                        <div>
                            <div data-tour="books-interactive-analytics">Interactive Analysis</div>
                            <button data-tour="books-overview-stock" type="button" onClick={() => navigate('/books/stock')}>
                                Stock
                            </button>
                            <div data-tour="books-report-ready">Reports</div>
                        </div>
                    }
                />
                <Route
                    path="/books/stock"
                    element={
                        <div>
                            <span data-tour="stock-active-items-icon">Active icon</span>
                            <span data-tour="stock-active-items-heading">Active Items</span>
                            <button data-tour="stock-add-product" type="button">Add New Product</button>
                        </div>
                    }
                />
                <Route
                    path="/books/faq"
                    element={
                        <div>
                            <button type="button" onClick={() => startMainTour({ manual: true })}>
                                Manual Main Tour
                            </button>
                            <button type="button" onClick={() => startPageTour('page_people', { manual: true })}>
                                Manual People Tour
                            </button>
                            <button type="button" onClick={resetOnboarding}>
                                Reset Onboarding
                            </button>
                            <div data-testid="available-page-tours">
                                {availablePageTours.map((t) => t.id).join(',')}
                            </div>
                        </div>
                    }
                />
                <Route path="*" element={<div>Other Route</div>} />
            </Routes>
        </div>
    );
};

const renderWithOnboarding = ({
    initialRoute = '/books/dashboard',
    omitTargets = [],
    onFinancialAction = vi.fn(),
} = {}) => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <OnboardingProvider>
                <DemoHarness omitTargets={omitTargets} onFinancialAction={onFinancialAction} />
                <OnboardingManager />
            </OnboardingProvider>
        </MemoryRouter>
    );
};

describe('OnboardingContext & Tour System', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        authMock.user = { id: 'u1', name: 'Asha', email: 'asha@example.com', is_new_user: true };
        authMock.isAuthenticated = true;
        authMock.isLoading = false;

        Element.prototype.scrollIntoView = vi.fn();
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
            if (this.getAttribute('data-hidden-rect') === 'true') {
                return { width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0 };
            }
            return { width: 140, height: 42, top: 40, left: 40, bottom: 82, right: 180, x: 40, y: 40 };
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('shows Welcome and advances the main tour through real workspace clicks', async () => {
        sessionStorage.setItem('cliks_just_registered_email', 'asha@example.com');
        const financialSpy = vi.fn();
        renderWithOnboarding({ initialRoute: '/books/faq', onFinancialAction: financialSpy });

        await waitFor(() => {
            expect(screen.getByText(/Welcome to CLIKS/i)).toBeTruthy();
        });

        fireEvent.click(screen.getByRole('button', { name: /Start Tour/i }));

        await waitFor(() => {
            expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-books');
        });
        expect(screen.queryByRole('button', { name: /^Next$/i })).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Books' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/books/dashboard');
            expect(screen.getByTestId('active-step-id').textContent).toBe('dashboard-shortcuts');
        });

        // Verify single rounded spotlight with no green border
        const spotlights = document.querySelectorAll('[data-tour-spotlight="true"]');
        expect(spotlights.length).toBe(1);
        expect(spotlights[0].style.border).not.toContain('34, 197, 94');
        expect(spotlights[0].style.borderRadius).toBe('14px');

        fireEvent.click(screen.getByRole('button', { name: /Next/i }));
        await waitFor(() => {
            expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-payments');
        });
        expect(screen.queryByRole('button', { name: /^Next$/i })).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Payments' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/payments/people');
            expect(screen.getByTestId('active-step-id').textContent).toBe('payments-overview');
        });

        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-social'));
        fireEvent.click(screen.getByRole('button', { name: 'Social' }));

        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/social/meetup');
            expect(screen.getByTestId('active-step-id').textContent).toBe('social-active-deals');
        });
        fireEvent.click(screen.getByRole('button', { name: 'Active Deals Marketplace' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('social-my-studio'));
        fireEvent.click(screen.getByRole('button', { name: 'My Studio (Founder View)' }));
        await waitFor(() => {
            expect(screen.getByTestId('active-step-id').textContent).toBe('profile-menu');
        });
        fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('profile-summary'));

        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('access-kit'));
        fireEvent.click(screen.getByRole('button', { name: 'Access Kit' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('beta-products'));
        fireEvent.click(screen.getByRole('button', { name: 'Product launcher' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('bit-tool'));
        fireEvent.click(document.querySelector('[data-tour="product-bit-tool"]'));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('return-books-for-accounts'));
        fireEvent.click(screen.getByRole('button', { name: 'Books' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-accounts'));
        fireEvent.click(screen.getByRole('button', { name: 'Accounts' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('accounting-tax-link'));
        fireEvent.click(screen.getByRole('button', { name: 'Tax & Deductions' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/books/tax-deductions');
            expect(screen.getByTestId('active-step-id').textContent).toBe('tax-deductions-heading');
        });

        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('return-to-accounts'));
        fireEvent.click(screen.getByRole('button', { name: 'Accounts' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('accounting-additional-source'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('accounting-bills-reminders'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('accounting-fixed-source'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-purchases'));
        fireEvent.click(screen.getByRole('button', { name: 'Purchases' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-link-store'));

        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-stores'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-store-points-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'shop-points' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-store-points'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-history-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'point-history' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-history-heading'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-invoices-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'purchases' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-invoices-heading'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-warranty-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'warranty' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('purchases-warranty-heading'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-income'));
        fireEvent.click(screen.getByRole('button', { name: 'Income' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('income-record-button'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-expenses'));
        fireEvent.click(screen.getByRole('button', { name: 'Expenses' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('expense-add-button'));

        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-payments-transactions'));
        fireEvent.click(screen.getByRole('button', { name: 'Payments' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-transactions'));
        fireEvent.click(screen.getByRole('button', { name: 'Transaction' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('transaction-add'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('transaction-income-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'receivables' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('transaction-expenses-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'payables' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('transaction-bank-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'bank' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('transaction-reminders-tab'));
        fireEvent.click(screen.getByRole('button', { name: 'reminders' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('return-books-workspace'));
        fireEvent.click(screen.getByRole('button', { name: 'Books' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-reports'));
        fireEvent.click(screen.getByRole('button', { name: 'Report' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('books-interactive-analytics'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('books-stock-overview'));
        fireEvent.click(screen.getByRole('button', { name: 'Stock' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('stock-active-items'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('stock-add-product'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('topbar-search-tools'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('notifications-open'));
        fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('notifications-panel'));
        fireEvent.click(screen.getByRole('button', { name: /^Next$/i }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('notifications-close'));
        fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('sidebar-help-support'));
        fireEvent.click(screen.getByRole('button', { name: /^Finish$/i }));
        await waitFor(() => {
            expect(screen.getByTestId('active-tour-id').textContent).toBe('');
            expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1')).mainCompleted).toBe(true);
        });
        expect(financialSpy).not.toHaveBeenCalled();
    }, 15000);

    it('does not force onboarding onto existing users, while allowing manual replay', async () => {
        authMock.user = {
            id: 'old-1',
            name: 'Vikram',
            email: 'vikram@example.com',
            created_at: '2024-01-01T00:00:00.000Z',
        };

        renderWithOnboarding({ initialRoute: '/books/faq' });
        await act(async () => {
            await new Promise((r) => setTimeout(r, 30));
        });

        expect(screen.queryByText(/Welcome to CLIKS/i)).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Manual Main Tour' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/books/faq');
            expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-books');
        });
        fireEvent.click(screen.getByRole('button', { name: 'Books' }));
        await waitFor(() => expect(screen.getByTestId('current-route').textContent).toBe('/books/dashboard'));
    });

    it('supports skipping welcome modal & isolating onboarding state across account switches', async () => {
        const view = renderWithOnboarding();

        await waitFor(() => {
            expect(screen.getByText(/Welcome to CLIKS/i)).toBeTruthy();
        });

        fireEvent.click(screen.getByRole('button', { name: /Skip Tour/i }));
        await waitFor(() => {
            expect(screen.queryByText(/Welcome to CLIKS/i)).toBeNull();
        });

        const u1State = JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1'));
        expect(u1State.mainSkipped).toBe(true);

        // Switch to another user account -> should show Welcome cleanly for u2
        view.unmount();
        authMock.user = { id: 'u2', name: 'Meera', email: 'meera@example.com', is_new_user: true };
        renderWithOnboarding();

        await waitFor(() => {
            expect(screen.getByText(/Hi Meera/i)).toBeTruthy();
        });
        expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1')).mainSkipped).toBe(true);
    });

    it('triggers contextual People page tour on first visit only and supports manual replay & reset', async () => {
        localStorage.setItem(
            'cliks_onboarding_v1:u1',
            JSON.stringify({
                version: 1,
                mainCompleted: true,
                mainSkipped: false,
                autoWelcomeSuppressed: true,
                suppressAutoPageTours: false,
                completedPages: {},
            })
        );

        const view = renderWithOnboarding({ initialRoute: '/payments/people' });

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'To Pay' })).toBeTruthy();
        });

        // Escape closes and records page tour skipped so revisiting does not repeat
        fireEvent.keyDown(window, { key: 'Escape' });
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: 'To Pay' })).toBeNull();
        });

        expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1')).completedPages.page_people).toBe('skipped');

        view.unmount();
        const view2 = renderWithOnboarding({ initialRoute: '/payments/people' });
        await act(async () => {
            await new Promise((r) => setTimeout(r, 30));
        });
        expect(screen.queryByRole('dialog', { name: 'To Pay' })).toBeNull();

        // Manual replay from FAQ works even after completion/skip
        view2.unmount();
        const view3 = renderWithOnboarding({ initialRoute: '/books/faq' });
        fireEvent.click(screen.getByRole('button', { name: 'Manual People Tour' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/payments/people');
            expect(screen.getByRole('dialog', { name: 'To Pay' })).toBeTruthy();
        });

        // Reset clears flags
        view3.unmount();
        renderWithOnboarding({ initialRoute: '/books/faq' });
        fireEvent.click(screen.getByRole('button', { name: 'Reset Onboarding' }));
        expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1')).mainCompleted).toBe(false);
        expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:u1')).completedPages).toEqual({});
    });

    it('filters steps and page guides by role (FIN-PRO CA vs sub_id) and supports interactive clicks', async () => {
        authMock.user = { id: 'ca1', name: 'CA Dev', email: 'ca@example.com', is_finpro_verified: true };
        const view = renderWithOnboarding({ initialRoute: '/books/faq' });

        expect(screen.getByTestId('available-page-tours').textContent).toContain('page_ca');
        expect(screen.getByTestId('available-page-tours').textContent).toContain('page_subscription');

        view.unmount();
        authMock.user = { id: 'sub1', name: 'Staff', email: 'staff@example.com', is_sub_id: true, role: 'sub_id' };
        renderWithOnboarding({ initialRoute: '/books/faq' });

        expect(screen.getByTestId('available-page-tours').textContent).not.toContain('page_ca');
        expect(screen.getByTestId('available-page-tours').textContent).not.toContain('page_subscription');
    });

    it('waits for a missing destination target instead of skipping the current step', async () => {
        renderWithOnboarding({
            initialRoute: '/books/faq',
            omitTargets: ['books-dashboard-shortcuts'],
        });

        fireEvent.click(screen.getByRole('button', { name: 'Manual Main Tour' }));
        await waitFor(() => expect(screen.getByTestId('active-step-id').textContent).toBe('workspace-books'));
        fireEvent.click(screen.getByRole('button', { name: 'Books' }));
        await waitFor(() => {
            expect(screen.getByTestId('current-route').textContent).toBe('/books/dashboard');
            expect(screen.getByTestId('active-step-id').textContent).toBe('dashboard-shortcuts');
        });
        expect(screen.queryByRole('dialog')).toBeNull();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1900));
        });
        expect(screen.getByTestId('active-step-id').textContent).toBe('dashboard-shortcuts');
    });

    it('does not trigger on login/unauthenticated state and persists completion across logout/login', async () => {
        authMock.isAuthenticated = false;
        authMock.user = null;
        const view = renderWithOnboarding({ initialRoute: '/auth' });
        await act(async () => {
            await new Promise((r) => setTimeout(r, 30));
        });
        expect(screen.queryByText(/Welcome to CLIKS/i)).toBeNull();

        // Simulate successful login of a first-time user on Dashboard
        view.unmount();
        authMock.isAuthenticated = true;
        authMock.user = { id: 'u-login', name: 'Rohan', email: 'rohan@example.com', is_new_user: true };
        const view2 = renderWithOnboarding({ initialRoute: '/books/dashboard' });
        await waitFor(() => {
            expect(screen.getByText(/Hi Rohan/i)).toBeTruthy();
        });

        // Mark completed, simulate logout -> login again -> should NOT re-open Welcome
        localStorage.setItem(
            'cliks_onboarding_v1:u-login',
            JSON.stringify({
                version: 1,
                mainCompleted: true,
                mainSkipped: false,
                autoWelcomeSuppressed: true,
                suppressAutoPageTours: false,
                completedPages: {},
            })
        );
        view2.unmount();
        authMock.isAuthenticated = false;
        authMock.user = null;
        const view3 = renderWithOnboarding({ initialRoute: '/auth' });
        view3.unmount();
        authMock.isAuthenticated = true;
        authMock.user = { id: 'u-login', name: 'Rohan', email: 'rohan@example.com' };
        renderWithOnboarding({ initialRoute: '/books/dashboard' });
        await act(async () => {
            await new Promise((r) => setTimeout(r, 30));
        });
        expect(screen.queryByText(/Welcome to CLIKS/i)).toBeNull();
    });
});
