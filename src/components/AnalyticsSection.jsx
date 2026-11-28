import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { formatCurrency } from '../lib/formatCurrency';

const parseTransactionDate = (tx) => {
    if (!tx) return null;
    const raw = String(tx.date || tx.created_at || '').trim();
    if (!raw) return null;

    // ISO or hyphen format: YYYY-MM-DD
    const isoMatch = raw.match(/^(\d{4})-(0[1-9]|1[0-2])/);
    if (isoMatch) {
        return { year: isoMatch[1], month: parseInt(isoMatch[2], 10) };
    }

    // Slash format: DD/MM/YYYY or YYYY/MM/DD
    if (raw.includes('/')) {
        const parts = raw.split('/');
        if (parts[0].length === 4) {
            return { year: parts[0], month: parseInt(parts[1], 10) };
        } else if (parts[2] && parts[2].length === 4) {
            return { year: parts[2], month: parseInt(parts[1], 10) };
        }
    }

    // Text format: "15 Oct 2026" or "15 Oct, 2026"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = raw.split(' ');
    if (parts.length >= 3) {
        const monthPart = parts[1].replace(',', '').substring(0, 3);
        const yearPart = parts[2].replace(',', '');
        const moIdx = months.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
        if (moIdx !== -1 && yearPart.length === 4) {
            return { year: yearPart, month: moIdx + 1 };
        }
    }

    // JavaScript Date parse fallback
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
        return { year: String(parsed.getFullYear()), month: parsed.getMonth() + 1 };
    }

    return null;
};

const AnalyticsSection = ({ transactions = [], error }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [flow, setFlow] = useState('all');
    const currentYear = new Date().getFullYear().toString();

    const dates = transactions.map(tx => {
        const parsed = parseTransactionDate(tx);
        return { tx, parsed };
    }).filter(entry => entry.parsed && ['Income', 'Expense'].includes(entry.tx.type));

    const availableYears = dates.map(e => e.parsed.year);
    const years = [...new Set([currentYear, ...availableYears])].sort().reverse();
    const year = selectedYear || years[0];

    const months = Array.from({ length: 12 }, (_, index) => ({
        month: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(2000, index, 1)),
        income: 0,
        expense: 0,
    }));

    const visible = dates.filter(({ tx, parsed }) => parsed.year === year && (flow === 'all' || tx.type === flow));
    for (const { tx, parsed } of visible) {
        const typeKey = tx.type.toLowerCase();
        if (months[parsed.month - 1]) {
            months[parsed.month - 1][typeKey] += (parseFloat(tx.amount) || 0);
        }
    }

    return (
        <section style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            marginBottom: '32px',
            width: '100%'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Finance Analytics</h2>
                    <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Income vs Expense comparison</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <label style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: '#4B5563',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <Calendar size={16} aria-hidden="true" />
                        <select aria-label="Analytics year" value={year} onChange={event => setSelectedYear(event.target.value)}>
                            {years.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </label>
                    <label style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: '#4B5563',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <Filter size={16} aria-hidden="true" />
                        <select aria-label="Analytics filter" value={flow} onChange={event => setFlow(event.target.value)}>
                            <option value="all">Income and expenses</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expenses</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Chart Container */}
            <div className="chart-container" style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
                {visible.length ? <InteractiveBarChart data={months} /> : (
                    <p role={error ? 'alert' : 'status'} style={{ paddingTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>{error ? (error.message || 'Unable to load transactions.') : `No matching transactions for ${year}.`}</p>
                )}
            </div>
        </section>
    );
};

const InteractiveBarChart = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const peak = Math.max(1, ...data.flatMap(({ income, expense }) => [income, expense]));
    const step = Math.ceil(peak / 5);
    const maxValue = step * 5;
    const ySteps = Array.from({ length: 6 }, (_, index) => index * step);

    const barWidth = 12; // Width of individual bar
    const groupGap = 4; // Gap between income and expense bars
    const itemWidth = graphWidth / data.length; // Width allocated for each month

    // Helper to calculate bar height
    const getBarHeight = (value) => (Math.max(0, value) / maxValue) * graphHeight;
    const getY = (value) => height - padding.bottom - getBarHeight(value);

    // Hover Tooltip Position (Centered over the group)
    const getTooltipX = (index) => padding.left + (index * itemWidth) + (itemWidth / 2);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {/* Grid Lines & Y-Axis Labels */}
            {ySteps.map((val, i) => {
                const y = getY(val);
                return (
                    <g key={`grid-${i}`}>
                        {/* Dot visual for 0 line is solid, others dotted if needed. Reference image uses light solid/dotted lines. */}
                        <line
                            x1={padding.left}
                            y1={y}
                            x2={width - padding.right}
                            y2={y}
                            stroke={val === 0 ? "#E5E7EB" : "#F3F4F6"}
                            strokeWidth="1"
                            strokeDasharray={val === 0 ? "0" : "4 4"}
                        />
                        <text
                            x={padding.left - 10}
                            y={y + 4}
                            fontSize="11"
                            fill="#9CA3AF"
                            textAnchor="end"
                            fontFamily="sans-serif"
                        >
                            ₹{val}
                        </text>
                    </g>
                );
            })}

            {/* Bars and X-Axis Labels */}
            {data.map((item, i) => {
                const groupX = padding.left + (i * itemWidth); // Start x of the group slot
                const centerX = groupX + (itemWidth / 2);

                // Income Bar (Left)
                const incomeHeight = getBarHeight(item.income);
                const incomeY = getY(item.income);
                const incomeX = centerX - barWidth - (groupGap / 2);

                // Expense Bar (Right)
                const expenseHeight = getBarHeight(item.expense);
                const expenseY = getY(item.expense);
                const expenseX = centerX + (groupGap / 2);

                const isHovered = hoveredIndex === i;

                return (
                    <g key={`group-${i}`}>
                        {/* Invisible Hover Rect for easier targeting */}
                        <rect
                            x={groupX}
                            y={padding.top}
                            width={itemWidth}
                            height={graphHeight}
                            fill="transparent"
                            onMouseEnter={() => setHoveredIndex(i)}
                        />

                        {/* Income Bar (Dark) */}
                        <rect
                            x={incomeX}
                            y={incomeY}
                            width={barWidth}
                            height={incomeHeight}
                            rx="4" // Rounded top corners
                            ry="4"
                            fill="#1E293B" // Dark Slate
                            opacity={isHovered ? 0.8 : 1}
                            style={{ transition: 'opacity 0.2s' }}
                            pointerEvents="none" // Let hover pass to the group rect
                        />

                        {/* Expense Bar (Light) */}
                        <rect
                            x={expenseX}
                            y={expenseY}
                            width={barWidth}
                            height={expenseHeight}
                            rx="4"
                            ry="4"
                            fill="#E2E8F0" // Light Slate
                            opacity={isHovered ? 0.8 : 1}
                            style={{ transition: 'opacity 0.2s' }}
                            pointerEvents="none"
                        />

                        {/* X-Axis Label */}
                        <text
                            x={centerX}
                            y={height - 10}
                            fontSize="11"
                            fill="#9CA3AF"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                        >
                            {item.month}
                        </text>
                    </g>
                );
            })}

            {/* Tooltip */}
            {hoveredIndex !== null && (
                <g transform={`translate(${getTooltipX(hoveredIndex)}, ${height / 2 - 50})`}>
                    {/* Tooltip Background */}
                    <rect
                        x="-60"
                        y="-40"
                        width="120"
                        height="70"
                        rx="8"
                        fill="white"
                        stroke="#E5E7EB"
                        strokeWidth="1"
                        filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
                    />

                    {/* Tooltip Content */}
                    <text
                        x="0"
                        y="-20"
                        textAnchor="middle"
                        fontWeight="bold"
                        fontSize="13"
                        fill="#1F2937"
                        fontFamily="sans-serif"
                    >
                        {data[hoveredIndex].month}
                    </text>

                    {/* Income Row */}
                    <circle cx="-35" cy="0" r="4" fill="#1E293B" />
                    <text x="-25" y="4" fontSize="11" fill="#4B5563" textAnchor="start" fontFamily="sans-serif">
                        Inc: {formatCurrency(data[hoveredIndex].income)}
                    </text>

                    {/* Expense Row */}
                    <circle cx="-35" cy="18" r="4" fill="#E2E8F0" />
                    <text x="-25" y="22" fontSize="11" fill="#4B5563" textAnchor="start" fontFamily="sans-serif">
                        Exp: {formatCurrency(data[hoveredIndex].expense)}
                    </text>
                </g>
            )}
        </svg>
    );
};

export default AnalyticsSection;
