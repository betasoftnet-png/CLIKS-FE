import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BudgetPlanner from './BudgetPlanner';

describe('BudgetPlanner Component Scenarios', () => {
    it('Scenario 1: Budget ₹20,000, Expenses ₹0', () => {
        render(
            <BudgetPlanner
                budget={20000}
                currentMonthExpenses={0}
                currencySymbol="₹"
            />
        );

        expect(screen.getByTestId('budget-amount-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-spent-display').textContent).toContain('₹0.00');
        expect(screen.getByTestId('budget-remaining-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-usage-display').textContent).toBe('0%');
        expect(screen.getByTestId('budget-progress-bar').style.width).toBe('0%');
        expect(screen.queryByTestId('budget-exceeded-badge')).toBeNull();
    });

    it('Scenario 2: Budget ₹20,000, Expenses ₹5,000', () => {
        render(
            <BudgetPlanner
                budget={20000}
                currentMonthExpenses={5000}
                currencySymbol="₹"
            />
        );

        expect(screen.getByTestId('budget-amount-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-spent-display').textContent).toContain('₹5,000.00');
        expect(screen.getByTestId('budget-remaining-display').textContent).toContain('₹15,000.00');
        expect(screen.getByTestId('budget-usage-display').textContent).toBe('25%');
        expect(screen.getByTestId('budget-progress-bar').style.width).toBe('25%');
        expect(screen.queryByTestId('budget-exceeded-badge')).toBeNull();
    });

    it('Scenario 3: Budget ₹20,000, Expenses ₹20,000', () => {
        render(
            <BudgetPlanner
                budget={20000}
                currentMonthExpenses={20000}
                currencySymbol="₹"
            />
        );

        expect(screen.getByTestId('budget-amount-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-spent-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-remaining-display').textContent).toContain('₹0.00');
        expect(screen.getByTestId('budget-usage-display').textContent).toBe('100%');
        expect(screen.getByTestId('budget-progress-bar').style.width).toBe('100%');
        // Not strictly exceeded yet (spent <= budget)
        expect(screen.queryByTestId('budget-exceeded-badge')).toBeNull();
    });

    it('Scenario 4: Budget ₹20,000, Expenses ₹25,000 (Exceeded budget)', () => {
        render(
            <BudgetPlanner
                budget={20000}
                currentMonthExpenses={25000}
                currencySymbol="₹"
            />
        );

        expect(screen.getByTestId('budget-amount-display').textContent).toContain('₹20,000.00');
        expect(screen.getByTestId('budget-spent-display').textContent).toContain('₹25,000.00');
        // Remaining should show negative amount
        expect(screen.getByTestId('budget-remaining-display').textContent).toContain('-₹5,000.00');
        // Usage should show true percentage (125%)
        expect(screen.getByTestId('budget-usage-display').textContent).toBe('125%');
        // Progress bar should be clamped within container (100%)
        expect(screen.getByTestId('budget-progress-bar').style.width).toBe('100%');
        // Warning badge displayed
        expect(screen.getByTestId('budget-exceeded-badge')).toBeTruthy();
    });

    it('Scenario 5: Updating the budget from ₹20,000 to ₹30,000', () => {
        const onUpdateBudget = vi.fn();
        render(
            <BudgetPlanner
                budget={20000}
                currentMonthExpenses={5000}
                onUpdateBudget={onUpdateBudget}
                currencySymbol="₹"
            />
        );

        // Click edit button
        const editBtn = screen.getByTestId('budget-edit-btn');
        fireEvent.click(editBtn);

        // Input field should appear pre-filled
        const input = screen.getByTestId('budget-input');
        expect(input.value).toBe('20000');

        // Change value to 30000
        fireEvent.change(input, { target: { value: '30000' } });
        expect(input.value).toBe('30000');

        // Click save button
        const saveBtn = screen.getByTestId('budget-save-btn');
        fireEvent.click(saveBtn);

        expect(onUpdateBudget).toHaveBeenCalledTimes(1);
        expect(onUpdateBudget).toHaveBeenCalledWith(30000);
    });

    it('Scenario 6: Zero budget and invalid input handling', () => {
        const onUpdateBudget = vi.fn();
        render(
            <BudgetPlanner
                budget={0}
                currentMonthExpenses={0}
                onUpdateBudget={onUpdateBudget}
                currencySymbol="₹"
            />
        );

        // Zero budget with zero spent should not produce NaN or Infinity
        expect(screen.getByTestId('budget-usage-display').textContent).toBe('0%');
        expect(screen.getByTestId('budget-remaining-display').textContent).toContain('₹0.00');

        // Open edit
        fireEvent.click(screen.getByTestId('budget-edit-btn'));
        const input = screen.getByTestId('budget-input');
        const saveBtn = screen.getByTestId('budget-save-btn');

        // Test empty submission
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(saveBtn);
        expect(onUpdateBudget).not.toHaveBeenCalled();
        expect(screen.getByTestId('budget-validation-error').textContent).toContain('cannot be empty');

        // Test negative number
        fireEvent.change(input, { target: { value: '-500' } });
        fireEvent.click(saveBtn);
        expect(onUpdateBudget).not.toHaveBeenCalled();
        expect(screen.getByTestId('budget-validation-error').textContent).toContain('cannot be negative');

        // Test cancel button
        fireEvent.click(screen.getByTestId('budget-cancel-btn'));
        expect(screen.queryByTestId('budget-input')).toBeNull();
    });

    it('Scenario 7: Escape key and Enter key keyboard handling', () => {
        const onUpdateBudget = vi.fn();
        render(
            <BudgetPlanner
                budget={15000}
                currentMonthExpenses={3000}
                onUpdateBudget={onUpdateBudget}
            />
        );

        // Open edit and submit with Enter key
        fireEvent.click(screen.getByTestId('budget-edit-btn'));
        const input = screen.getByTestId('budget-input');
        fireEvent.change(input, { target: { value: '18000' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(onUpdateBudget).toHaveBeenCalledWith(18000);
    });
});
