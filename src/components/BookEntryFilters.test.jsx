import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import BookEntryFilters, { useBookEntryFilters } from './BookEntryFilters';

const yearMonth = (offset) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + offset);
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-01';
};

function TestLedger() {
    const entries = [
        { label: 'A', category: 'One', date: yearMonth(0) },
        { label: 'B', category: 'Two', date: yearMonth(-1) },
        { label: 'C', category: 'One', date: yearMonth(-1) },
    ];
    const filters = useBookEntryFilters(entries, entry => entry.label);
    return <>
        <BookEntryFilters label="Find entries" categoryLabel="All categories" filters={filters} />
        <output>{filters.visibleRecords.map(entry => entry.label).join(',')}</output>
    </>;
}

it('combines search, category and date filters with no change to the underlying entries', () => {
    render(<TestLedger />);
    const result = screen.getByRole('status');
    expect(result.textContent).toBe('A,B,C');
    fireEvent.change(screen.getByLabelText('Date range'), { target: { value: 'previous' } });
    expect(result.textContent).toBe('B,C');
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'One' } });
    expect(result.textContent).toBe('C');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'a' } });
    expect(result.textContent).toBe('');
    fireEvent.change(screen.getByLabelText('Date range'), { target: { value: '' } });
    expect(result.textContent).toBe('A');
});
