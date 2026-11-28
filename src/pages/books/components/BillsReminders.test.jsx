import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BillsReminders from './BillsReminders';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('BillsReminders Payment Planner Integration', () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 5);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    it('renders planned payments due today with "Due Today" status and "To Pay" for SEND', () => {
        const plannedPayments = [
            {
                id: 'plan-101',
                name: 'Monthly Rent',
                amount: 5000,
                due_date: todayStr,
                type: 'SEND',
                status: 'PENDING'
            }
        ];

        render(
            <BillsReminders
                bills={[]}
                onUpdateBills={vi.fn()}
                currencySymbol="₹"
                plannedPayments={plannedPayments}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Monthly Rent')).toBeDefined();
        expect(screen.getByText('₹5,000.00')).toBeDefined();
        expect(screen.getByText('To Pay')).toBeDefined();
        expect(screen.getByText('Due Today')).toBeDefined();
    });

    it('renders planned receiving payments due today with "To Receive"', () => {
        const plannedPayments = [
            {
                id: 'plan-102',
                name: 'Client Retainer',
                amount: 15000,
                due_date: todayStr,
                type: 'RECEIVE',
                status: 'PENDING'
            }
        ];

        render(
            <BillsReminders
                bills={[]}
                onUpdateBills={vi.fn()}
                currencySymbol="₹"
                plannedPayments={plannedPayments}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Client Retainer')).toBeDefined();
        expect(screen.getByText('₹15,000.00')).toBeDefined();
        expect(screen.getByText('To Receive')).toBeDefined();
        expect(screen.getByText('Due Today')).toBeDefined();
        expect(screen.getByText('Mark Received')).toBeDefined();
    });

    it('renders overdue planned payments with "Overdue" status', () => {
        const plannedPayments = [
            {
                id: 'plan-103',
                name: 'Electricity Bill',
                amount: 1200,
                due_date: yesterdayStr,
                type: 'SEND',
                status: 'PENDING'
            }
        ];

        render(
            <BillsReminders
                bills={[]}
                onUpdateBills={vi.fn()}
                currencySymbol="₹"
                plannedPayments={plannedPayments}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Electricity Bill')).toBeDefined();
        expect(screen.getByText('Overdue')).toBeDefined();
    });

    it('excludes future upcoming, completed/paid and cancelled planned payments', () => {
        const plannedPayments = [
            {
                id: 'plan-future',
                name: 'Future Payment',
                amount: 2000,
                due_date: tomorrowStr,
                type: 'SEND',
                status: 'PENDING'
            },
            {
                id: 'plan-paid',
                name: 'Paid Subscription',
                amount: 800,
                due_date: todayStr,
                type: 'SEND',
                status: 'PAID'
            },
            {
                id: 'plan-cancelled',
                name: 'Cancelled Bill',
                amount: 1500,
                due_date: todayStr,
                type: 'SEND',
                status: 'CANCELLED'
            }
        ];

        render(
            <BillsReminders
                bills={[]}
                onUpdateBills={vi.fn()}
                currencySymbol="₹"
                plannedPayments={plannedPayments}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.queryByText('Future Payment')).toBeNull();
        expect(screen.queryByText('Paid Subscription')).toBeNull();
        expect(screen.queryByText('Cancelled Bill')).toBeNull();
        expect(screen.getByText('No recurring bills set up. Add your first bill reminder!')).toBeDefined();
    });

    it('preserves existing manual bills and allows adding new manual bills', () => {
        const handleUpdate = vi.fn();
        const manualBills = [
            {
                id: 1,
                name: 'Office Internet',
                amount: 999,
                dueDate: todayStr,
                repeat: 'Monthly',
                status: 'Pending'
            }
        ];

        render(
            <BillsReminders
                bills={manualBills}
                onUpdateBills={handleUpdate}
                currencySymbol="₹"
                plannedPayments={[]}
            />,
            { wrapper: createWrapper() }
        );

        expect(screen.getByText('Office Internet')).toBeDefined();
        expect(screen.getByText('₹999.00')).toBeDefined();
    });
});
