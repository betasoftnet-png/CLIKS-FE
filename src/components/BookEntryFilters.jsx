import { useState } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';

function inMonth(date, offset) {
    const month = new Date();
    month.setDate(1);
    month.setMonth(month.getMonth() + offset);
    const prefix = String(month.getFullYear()) + '-' + String(month.getMonth() + 1).padStart(2, '0');
    return typeof date === 'string' && date.slice(0, 7) === prefix;
}

export function useBookEntryFilters(records, getDescription) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [period, setPeriod] = useState('');
    const query = search.trim().toLowerCase();
    const categories = [...new Set(records.map(record => record.category).filter(Boolean))].sort();
    const visibleRecords = records.filter(record =>
        (!query || [getDescription(record), record.category].some(value =>
            String(value ?? '').toLowerCase().includes(query))) &&
        (!category || record.category === category) &&
        (!period || inMonth(record.date, period === 'previous' ? -1 : 0))
    );
    return { search, setSearch, category, setCategory, period, setPeriod, categories, visibleRecords };
}

export default function BookEntryFilters({ label, filters, categoryLabel }) {
    const { search, setSearch, category, setCategory, period, setPeriod, categories } = filters;
    return (
        <div className="controls-bar">
            <div className="search-wrapper">
                <Search size={18} className="search-icon" aria-hidden="true" />
                <input type="search" placeholder={label} aria-label={label} className="search-input"
                    value={search} onChange={event => setSearch(event.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3">
                <label className="filter-btn">
                    <Filter size={16} aria-hidden="true" />
                    <select aria-label="Category" value={category} onChange={event => setCategory(event.target.value)}>
                        <option value="">{categoryLabel}</option>
                        {categories.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </label>
                <label className="filter-btn">
                    <Calendar size={16} aria-hidden="true" />
                    <select aria-label="Date range" value={period} onChange={event => setPeriod(event.target.value)}>
                        <option value="">All dates</option>
                        <option value="current">This Month</option>
                        <option value="previous">Last Month</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
