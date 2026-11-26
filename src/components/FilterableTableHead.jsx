import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

/**
 * FilterableTableHead
 * 
 * Props:
 *   columns: Array<{ key: string, label: string, placeholder?: string, align?: 'left'|'right'|'center', noFilter?: boolean }>
 *   onFilterChange: (filtersObj: Record<string, string>) => void
 *   thStyle?: React.CSSProperties  – extra styles for each <th>
 */
const FilterableTableHead = ({ columns = [], onFilterChange, thStyle = {} }) => {
    const [openCols, setOpenCols] = useState({});
    const [filters, setFilters] = useState(() =>
        Object.fromEntries(columns.map(c => [c.key, '']))
    );

    const toggleCol = (key) => {
        setOpenCols(prev => {
            const isOpen = !!prev[key];
            if (isOpen) {
                // close → clear filter
                const next = { ...filters, [key]: '' };
                setFilters(next);
                onFilterChange && onFilterChange(next);
            }
            return { ...prev, [key]: !isOpen };
        });
    };

    const updateFilter = (key, val) => {
        const next = { ...filters, [key]: val };
        setFilters(next);
        onFilterChange && onFilterChange(next);
    };

    const hasAnyOpen = columns.some(c => !c.noFilter && openCols[c.key]);

    return (
        <thead>
            {/* Column label row */}
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                {columns.map(col => {
                    const isOpen = !col.noFilter && !!openCols[col.key];
                    const hasValue = !col.noFilter && !!filters[col.key];
                    return (
                        <th
                            key={col.key}
                            className={col.className}
                            style={{
                                padding: '0.56rem 0.78rem',
                                fontSize: '0.652rem',
                                fontWeight: '800',
                                color: '#64748B',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                verticalAlign: 'middle',
                                textAlign: col.align || 'left',
                                letterSpacing: '0.03em',
                                ...(col.width ? { width: col.width } : {}),
                                ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                                ...(col.maxWidth ? { maxWidth: col.maxWidth } : {}),
                                ...thStyle,
                                ...(col.style || {})
                            }}
                        >
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.272rem',
                                width: '100%',
                                justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start'
                            }}>
                                <span>{col.label}</span>
                                {!col.noFilter && (
                                    <button
                                        type="button"
                                        onClick={() => toggleCol(col.key)}
                                        title={`Filter by ${col.label}`}
                                        aria-label={`Filter by ${col.label}`}
                                        style={{
                                            background: isOpen || hasValue ? '#F1F5F9' : 'transparent',
                                            border: `1px solid ${isOpen || hasValue ? '#94A3B8' : '#E2E8F0'}`,
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            padding: '2px 4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: isOpen || hasValue ? '#475569' : '#CBD5E1',
                                            transition: 'all 0.15s',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Filter size={10} />
                                        <ChevronDown
                                            size={9}
                                            style={{
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.15s'
                                            }}
                                        />
                                    </button>
                                )}
                            </div>
                        </th>
                    );
                })}
            </tr>

            {/* Filter input row — only renders when at least one column is open */}
            {hasAnyOpen && (
                <tr style={{ borderBottom: '2px solid rgba(148, 163, 184, 0.15)', background: '#FAFAFA' }}>
                    {columns.map(col => (
                        <th key={col.key} className={col.className} style={{ padding: '0.181rem 0.363rem', ...(col.minWidth ? { minWidth: col.minWidth } : {}), ...(col.style || {}) }}>
                            {!col.noFilter && openCols[col.key] ? (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder={col.placeholder || 'Filter...'}
                                        value={filters[col.key]}
                                        onChange={(e) => updateFilter(col.key, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.254rem 1.269rem 0.254rem 0.453rem',
                                            borderRadius: '6px',
                                            border: '1.5px solid #94A3B8',
                                            outline: 'none',
                                            fontSize: '0.652rem',
                                            fontWeight: '600',
                                            color: '#1E293B',
                                            background: 'white',
                                            boxSizing: 'border-box',
                                            boxShadow: '0 0 0 3px rgba(148, 163, 184, 0.12)',
                                        }}
                                    />
                                    {filters[col.key] && (
                                        <button
                                            onClick={() => updateFilter(col.key, '')}
                                            style={{
                                                position: 'absolute', right: '4px', top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none', border: 'none',
                                                cursor: 'pointer', color: '#94A3B8',
                                                padding: 0, display: 'flex'
                                            }}
                                        >
                                            <X size={10} />
                                        </button>
                                    )}
                                </div>
                            ) : null}
                        </th>
                    ))}
                </tr>
            )}
        </thead>
    );
};

export default FilterableTableHead;
