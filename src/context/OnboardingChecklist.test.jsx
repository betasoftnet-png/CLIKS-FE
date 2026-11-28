import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { BIT_GUIDES, CHECKLIST_TOURS } from '../config/onboardingChecklist';
import { OnboardingProvider } from './OnboardingContext';
import { useOnboarding } from './onboarding-context';

const auth = vi.hoisted(() => ({
    user: { id: 'checklist-test', is_new_user: true },
    isAuthenticated: true,
    isLoading: false,
}));

vi.mock('./auth-context', () => ({ useAuth: () => auth }));

function Harness() {
    const { currentStep, targetElement, nextStep, skipActiveTour } = useOnboarding();
    const navigate = useNavigate();
    const [panel, setPanel] = useState(null);
    const openTool = (tool) => {
        window.dispatchEvent(new CustomEvent('cliks:bit-tool-click', { detail: { tool } }));
        setTimeout(() => setPanel(tool.toLowerCase()), 500);
    };
    return <>
        <button data-tour="topbar-nav-books">Books target</button>
        <button data-tour="topbar-nav-payments">Payments target</button>
        <button data-tour="people-log-transaction">Log Transaction target</button>
        <button data-tour="people-tab-contacts">Contacts target</button>
        {targetElement && <output>{currentStep.title}</output>}
        <button onClick={nextStep}>Next guide</button>
        <button onClick={skipActiveTour}>Skip guide</button>
        <button onClick={() => navigate('/payments/people')}>Open People</button>
        <button onClick={() => navigate('/books/dashboard')}>Open Dashboard</button>
        <button onClick={() => openTool('Calculator')}>Open Calculator</button>
        <button onClick={() => openTool('Calendar')}>Open Calendar</button>
        {panel && <section data-tour={`docked-${panel}`}>Tool panel</section>}
    </>;
}

afterEach(() => {
    localStorage.clear();
    auth.user = { id: 'checklist-test', is_new_user: true };
    auth.isAuthenticated = true;
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

it('defines the 60 required guides and shares the Report aliases', () => {
    expect(CHECKLIST_TOURS.flatMap(({ steps }) => steps).length + Object.keys(BIT_GUIDES).length).toBe(60);
    const report = CHECKLIST_TOURS.find(({ id }) => id === 'page_books');
    expect(['/books', '/books/report', '/books/reports'].every(report.matchPath)).toBe(true);
    expect(CHECKLIST_TOURS.find(({ id }) => id === 'page_social').steps.map(({ id }) => id))
        .toEqual(['trading_dock', 'active_deals', 'my_studio', 'region', 'venture']);
});

it('waits for a clicked tool panel on a route without a page checklist', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', class {
        constructor(callback) { this.callback = callback; }
        observe(target) {
            queueMicrotask(() => this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]));
        }
        disconnect() {}
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 140, height: 40, left: 0, top: 0, right: 140, bottom: 40,
    });
    const tick = (ms) => act(async () => vi.advanceTimersByTimeAsync(ms));
    render(<MemoryRouter initialEntries={['/books/stock']}>
        <OnboardingProvider checklist><Harness /></OnboardingProvider>
    </MemoryRouter>);

    await tick(5000);
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.click(screen.getByText('Open Calculator'));
    await tick(499);
    expect(screen.queryByText('Tool panel')).toBeNull();
    await tick(1);
    expect(screen.getByText('Tool panel')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
    await tick(2000);
    expect(screen.getByRole('status').textContent).toBe('Calculator');
    fireEvent.click(screen.getByText('Skip guide'));
    const stored = () => JSON.parse(localStorage.getItem('cliks_onboarding_v1:checklist-test')).guides;
    expect(stored()).toEqual({ 'page_bit:bit_calculator': 'skipped' });
    fireEvent.click(screen.getByText('Open Calendar'));
    await tick(500);
    await tick(2000);
    expect(screen.getByRole('status').textContent).toBe('Calendar');
    fireEvent.click(screen.getByText('Next guide'));
    expect(stored()).toEqual({ 'page_bit:bit_calculator': 'skipped', 'page_bit:bit_calendar': 'completed' });
});

it('uses continuous visibility and independent completion across managed pages', async () => {
    vi.useFakeTimers();
    const observed = new Map();
    vi.stubGlobal('IntersectionObserver', class {
        constructor(callback) { this.callback = callback; }
        observe(element) { this.element = element; observed.set(element.dataset.tour, this); }
        disconnect() { if (this.element) observed.delete(this.element.dataset.tour); }
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 140, height: 40, left: 0, top: 0, right: 140, bottom: 40,
    });
    const storageKey = 'cliks_onboarding_v1:checklist-test';
    localStorage.setItem(storageKey, JSON.stringify({
        mainCompleted: true, suppressAutoPageTours: true, checklistEligible: true, completedPages: { page_people: 'completed' },
    }));
    const stored = () => JSON.parse(localStorage.getItem(storageKey)).guides;
    const visibility = (anchor, isIntersecting) => {
        const observer = observed.get(anchor);
        act(() => observer.callback([{
            target: observer.element, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0,
        }]));
    };
    const tick = (ms) => act(async () => vi.advanceTimersByTimeAsync(ms));
    render(<MemoryRouter initialEntries={['/books/dashboard']}>
        <OnboardingProvider checklist><Harness /></OnboardingProvider>
    </MemoryRouter>);

    visibility('topbar-nav-books', true);
    await tick(4999);
    expect(screen.queryByRole('status')).toBeNull();
    await tick(1);
    expect(screen.getByRole('status').textContent).toBe('Books');
    fireEvent.click(screen.getByText('Next guide'));
    visibility('topbar-nav-payments', true);
    await tick(1500);
    fireEvent.click(screen.getByText('Open People'));
    await tick(1000);
    expect(screen.queryByRole('status')).toBeNull();
    expect(stored()).toEqual({ 'page_dashboard:nav_books': 'completed' });

    visibility('people-log-transaction', true);
    await tick(1000);
    visibility('people-log-transaction', false);
    await tick(2000);
    expect(screen.queryByRole('status')).toBeNull();
    visibility('people-log-transaction', true);
    await tick(2000);
    expect(screen.getByRole('status').textContent).toBe('Log Transaction');
    fireEvent.click(screen.getByText('Skip guide'));
    expect(stored()['page_people:log_transaction']).toBe('skipped');

    fireEvent.click(screen.getByText('Open Dashboard'));
    visibility('topbar-nav-payments', true);
    await tick(2000);
    expect(screen.getByRole('status').textContent).toBe('Payments');

    act(() => window.dispatchEvent(new CustomEvent('cliks:bit-tool-click', { detail: { tool: 'Calculator' } })));
    expect(screen.queryByRole('status')).toBeNull();
    act(() => window.dispatchEvent(new CustomEvent('cliks:bit-toggle-click')));
    visibility('topbar-nav-payments', true);
    await tick(2000);
    expect(screen.getByRole('status').textContent).toBe('Payments');
    expect(stored()['page_bit:bit_calculator']).toBeUndefined();
});

it('uses first-time evidence, restores progress, and separates SSO accounts without a token subject', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', class {
        constructor(callback) { this.callback = callback; }
        observe(target) {
            queueMicrotask(() => this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]));
        }
        disconnect() {}
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 140, height: 40, left: 0, top: 0, right: 140, bottom: 40,
    });
    const frame = () => <MemoryRouter initialEntries={['/books/dashboard']}>
        <OnboardingProvider checklist><Harness /></OnboardingProvider>
    </MemoryRouter>;
    const tick = (ms) => act(async () => vi.advanceTimersByTimeAsync(ms));
    auth.user = { id: 'sso-user', email: 'first@example.test', is_new_user: true };
    const view = render(frame());
    await tick(5000);
    expect(screen.getByRole('status').textContent).toBe('Books');
    fireEvent.click(screen.getByText('Next guide'));
    await tick(2000);
    fireEvent.click(screen.getByText('Skip guide'));

    auth.user = { id: 'sso-user', email: 'second@example.test', created_at: '2020-01-01' };
    view.rerender(frame());
    await tick(5000);
    expect(screen.queryByRole('status')).toBeNull();
    expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:second@example.test')).guides).toEqual({});

    auth.isAuthenticated = false;
    view.rerender(frame());
    auth.user = { id: 'sso-user', email: 'first@example.test', created_at: '2020-01-01' };
    auth.isAuthenticated = true;
    view.rerender(frame());
    await tick(5000);
    expect(screen.queryByRole('status')).toBeNull();
    expect(JSON.parse(localStorage.getItem('cliks_onboarding_v1:first@example.test')).guides).toEqual({
        'page_dashboard:nav_books': 'completed', 'page_dashboard:nav_payments': 'skipped',
    });
    expect(localStorage.getItem('cliks_onboarding_v1:sso-user')).toBeNull();
});
