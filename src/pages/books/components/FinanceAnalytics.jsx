import React from 'react';
import { TrendingUp, BarChart2, PieChart, Activity } from 'lucide-react';
import './analytics-responsive.css';

const FinanceAnalytics = ({ transactions = [], currencySymbol = '₹' }) => {
    // Process Data
    const incomeTotal = transactions
        .filter(t => (t.type || '').toLowerCase() === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const expenseTotal = transactions
        .filter(t => (t.type || '').toLowerCase() === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    // Group by Category
    const categoryGroup = {};
    transactions
        .filter(t => (t.type || '').toLowerCase() === 'expense')
        .forEach(t => {
            const cat = t.category || 'Other';
            categoryGroup[cat] = (categoryGroup[cat] || 0) + (parseFloat(t.amount) || 0);
        });

    const categoryData = Object.keys(categoryGroup).map(cat => ({
        name: cat,
        value: categoryGroup[cat]
    })).sort((a, b) => b.value - a.value);

    // Group by Month (simplified grouping by date parsing)
    const monthGroup = {};
    transactions.forEach(t => {
        if (!t.date) return;
        // Assume date is in format YYYY-MM-DD or readable text containing Month name
        let monthName = 'Other';
        if (t.date.includes('-')) {
            const parts = t.date.split('-');
            const monthIndex = parseInt(parts[1]) - 1;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            monthName = months[monthIndex] || 'Other';
        } else {
            // E.g. "24 Jun 2026"
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const found = months.find(m => t.date.includes(m));
            if (found) monthName = found;
        }

        if (!monthGroup[monthName]) monthGroup[monthName] = { income: 0, expense: 0 };
        if ((t.type || '').toLowerCase() === 'income') {
            monthGroup[monthName].income += (parseFloat(t.amount) || 0);
        } else {
            monthGroup[monthName].expense += (parseFloat(t.amount) || 0);
        }
    });

    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthsOrder
        .filter(m => monthGroup[m])
        .map(m => ({
            month: m,
            income: monthGroup[m].income,
            expense: monthGroup[m].expense,
            savings: monthGroup[m].income - monthGroup[m].expense
        }));

    // SVG parameters
    const maxVal = Math.max(incomeTotal, expenseTotal, 100);
    const scaleY = 120 / maxVal;

    return (
        <div className="analytics-card-container">
            <h3 data-tour="books-interactive-analytics" style={{ fontSize: '0.997rem', fontWeight: 800, color: '#1E293B', marginBottom: '1.359rem', display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                <TrendingUp size={20} style={{ color: '#7C3AED' }} /> Interactive Analytics
            </h3>

            <div className="analytics-grid-two-column">
                {/* 1. Income vs Expense Bar Chart */}
                <div className="analytics-subcard">
                    <h4 style={{ fontSize: '0.77rem', fontWeight: 750, color: '#475569', margin: '0 0 0.906rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BarChart2 size={15} /> Income vs Expense
                    </h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '160px', padding: '10px 0', borderBottom: '2px solid #E2E8F0', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.453rem', minWidth: 0 }}>
                            <div style={{ 
                                width: '40px', 
                                height: `${incomeTotal * scaleY}px`, 
                                background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', 
                                borderRadius: '6px 6px 0 0',
                                transition: 'height 0.3s ease'
                            }} />
                            <span style={{ fontSize: '0.652rem', fontWeight: 700, color: '#64748B' }}>Income</span>
                            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{currencySymbol}{incomeTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.453rem', minWidth: 0 }}>
                            <div style={{ 
                                width: '40px', 
                                height: `${expenseTotal * scaleY}px`, 
                                background: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', 
                                borderRadius: '6px 6px 0 0',
                                transition: 'height 0.3s ease'
                            }} />
                            <span style={{ fontSize: '0.652rem', fontWeight: 700, color: '#64748B' }}>Expense</span>
                            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{currencySymbol}{expenseTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Category-wise Expense Breakdown */}
                <div className="analytics-subcard">
                    <h4 style={{ fontSize: '0.77rem', fontWeight: 750, color: '#475569', margin: '0 0 0.906rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PieChart size={15} /> Category Breakdown
                    </h4>

                    {categoryData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.719rem 0', color: '#94A3B8', fontSize: '0.725rem' }}>No expense records available</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem', maxHeight: '150px', overflowY: 'auto' }}>
                            {categoryData.slice(0, 5).map((item, idx) => {
                                const pct = expenseTotal > 0 ? Math.round((item.value / expenseTotal) * 100) : 0;
                                const colors = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                                return (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.227rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, color: '#475569', gap: '8px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[idx % colors.length], flexShrink: 0 }} />
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                            </span>
                                            <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{currencySymbol}{item.value.toLocaleString('en-IN')} ({pct}%)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: colors[idx % colors.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Monthly Savings Trend Line */}
                <div className="analytics-savings-growth-card">
                    <h4 style={{ fontSize: '0.77rem', fontWeight: 750, color: '#475569', margin: '0 0 1.133rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={15} /> Monthly Savings Growth
                    </h4>

                    {monthlyData.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2.719rem 0', color: '#94A3B8', fontSize: '0.725rem' }}>No historical trend data found</div>
                    ) : (
                        <div className="savings-growth-scroll">
                            {monthlyData.map((d, i) => (
                                <div key={i} style={{
                                    flex: '1',
                                    minWidth: '70px',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    padding: '0.498rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.227rem',
                                    boxSizing: 'border-box'
                                }}>
                                    <span style={{ fontSize: '0.634rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{d.month}</span>
                                    <span style={{ fontSize: '0.77rem', fontWeight: 800, color: d.savings < 0 ? '#EF4444' : '#10B981', whiteSpace: 'nowrap' }}>
                                        {d.savings >= 0 ? '+' : ''}{currencySymbol}{d.savings.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinanceAnalytics;
