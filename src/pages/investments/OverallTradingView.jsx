import React from 'react';
import {
    Briefcase, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight,
    Bitcoin, PiggyBank, LineChart, Layers, Clock
} from 'lucide-react';

const OverallTradingView = () => {
    const summaryCards = [
        { label: 'Total Portfolio', value: '₹12.5L', trend: '+12.5%', positive: true, icon: Briefcase, color: '#2563EB', bg: '#DBEAFE' },
        { label: 'Total Invested', value: '₹10.2L', trend: null, icon: Layers, color: '#7C3AED', bg: '#EDE9FE' },
        { label: 'Current Value', value: '₹14.8L', trend: '+45.1%', positive: true, icon: TrendingUp, color: '#16A34A', bg: '#DCFCE7' },
        { label: "Today's P&L", value: '+₹3,250', trend: '+2.6%', positive: true, icon: BarChart3, color: '#EA580C', bg: '#FFF7ED' },
    ];

    const allocations = [
        { name: 'Mutual Funds', pct: '45%', value: '₹5.6L', color: '#2563EB', icon: PiggyBank },
        { name: 'Stocks', pct: '30%', value: '₹3.7L', color: '#7C3AED', icon: LineChart },
        { name: 'Crypto', pct: '15%', value: '₹1.9L', color: '#EA580C', icon: Bitcoin },
        { name: 'SIP', pct: '10%', value: '₹1.2L', color: '#16A34A', icon: TrendingUp },
    ];

    const transactions = [
        { name: 'Buy Bitcoin', time: '2 hours ago', amount: '₹25,000', type: 'buy' },
        { name: 'Sell HDFC MF', time: '5 hours ago', amount: '+₹12,500', type: 'sell' },
        { name: 'Buy TCS Stock', time: 'Yesterday', amount: '₹50,000', type: 'buy' },
        { name: 'SIP Index Fund', time: '2 days ago', amount: '₹5,000', type: 'sip' },
    ];

    return (
        <div className="view-fade-in">
            <div className="inv-view-header">
                <h2 className="inv-view-title">Overall Trading Dashboard</h2>
                <p className="inv-view-subtitle">Complete overview of your trading portfolio</p>
            </div>

            <div className="ot-summary-grid">
                {summaryCards.map((card, i) => (
                    <div key={i} className="ot-summary-card">
                        <div className="ot-summary-top">
                            <div>
                                <p className="ot-summary-label">{card.label}</p>
                                <h3 className="ot-summary-value">{card.value}</h3>
                                {card.trend && (
                                    <span className={`ot-trend ${card.positive ? 'up' : 'down'}`}>
                                        {card.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                        {card.trend}
                                    </span>
                                )}
                            </div>
                            <div className="ot-summary-icon" style={{ background: card.bg, color: card.color }}>
                                <card.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="ot-two-cols">
                {/* Asset Allocation */}
                <div className="ot-panel">
                    <h3 className="inv-section-title">Asset Allocation</h3>
                    <div className="ot-alloc-bar">
                        {allocations.map((a, i) => (
                            <div key={i} className="ot-alloc-seg" style={{ width: a.pct, background: a.color }} title={`${a.name}: ${a.pct}`} />
                        ))}
                    </div>
                    <div className="ot-alloc-list">
                        {allocations.map((a, i) => (
                            <div key={i} className="ot-alloc-row">
                                <div className="ot-alloc-left">
                                    <div className="ot-alloc-dot" style={{ background: a.color }} />
                                    <div className="ot-alloc-icon" style={{ background: a.color + '18', color: a.color }}>
                                        <a.icon size={16} />
                                    </div>
                                    <span className="ot-alloc-name">{a.name}</span>
                                </div>
                                <div className="ot-alloc-right">
                                    <span className="ot-alloc-pct">{a.pct}</span>
                                    <span className="ot-alloc-val">{a.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="ot-panel">
                    <h3 className="inv-section-title">Recent Transactions</h3>
                    <div className="ot-txn-list">
                        {transactions.map((t, i) => (
                            <div key={i} className="ot-txn-row">
                                <div className="ot-txn-left">
                                    <div className={`ot-txn-icon ${t.type}`}>
                                        {t.type === 'sell' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                                    </div>
                                    <div>
                                        <div className="ot-txn-name">{t.name}</div>
                                        <div className="ot-txn-time"><Clock size={11} /> {t.time}</div>
                                    </div>
                                </div>
                                <span className={`ot-txn-amount ${t.type === 'sell' ? 'green' : ''}`}>{t.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .ot-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
                .ot-summary-card {
                    background: white; border-radius: 16px; padding: 1.25rem 1.5rem;
                    border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .ot-summary-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
                .ot-summary-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .ot-summary-label { color: var(--text-muted); font-size: 0.8rem; font-weight: 500; margin-bottom: 0.4rem; }
                .ot-summary-value { font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.3rem; }
                .ot-summary-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .ot-trend { display: inline-flex; align-items: center; gap: 0.15rem; font-size: 0.78rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; }
                .ot-trend.up { background: #DCFCE7; color: #16A34A; }
                .ot-trend.down { background: #FEE2E2; color: #DC2626; }

                .ot-two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
                .ot-panel { background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid var(--border-color); }

                .ot-alloc-bar { display: flex; height: 10px; border-radius: 99px; overflow: hidden; margin-bottom: 1.25rem; gap: 3px; }
                .ot-alloc-seg { border-radius: 99px; transition: width 0.5s; }
                .ot-alloc-list { display: flex; flex-direction: column; gap: 0.85rem; }
                .ot-alloc-row { display: flex; justify-content: space-between; align-items: center; }
                .ot-alloc-left { display: flex; align-items: center; gap: 0.6rem; }
                .ot-alloc-dot { width: 8px; height: 8px; border-radius: 50%; }
                .ot-alloc-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
                .ot-alloc-name { font-weight: 500; font-size: 0.9rem; color: var(--text-main); }
                .ot-alloc-right { display: flex; align-items: center; gap: 1rem; }
                .ot-alloc-pct { font-weight: 700; font-size: 0.9rem; color: var(--text-main); min-width: 40px; text-align: right; }
                .ot-alloc-val { font-size: 0.85rem; color: var(--text-muted); min-width: 55px; text-align: right; }

                .ot-txn-list { display: flex; flex-direction: column; gap: 0.85rem; }
                .ot-txn-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; }
                .ot-txn-left { display: flex; align-items: center; gap: 0.75rem; }
                .ot-txn-icon {
                    width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
                }
                .ot-txn-icon.buy { background: #DBEAFE; color: #2563EB; }
                .ot-txn-icon.sell { background: #DCFCE7; color: #16A34A; }
                .ot-txn-icon.sip { background: #EDE9FE; color: #7C3AED; }
                .ot-txn-name { font-weight: 500; font-size: 0.9rem; color: var(--text-main); }
                .ot-txn-time { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem; margin-top: 0.15rem; }
                .ot-txn-amount { font-weight: 600; font-size: 0.9rem; color: var(--text-main); }
                .ot-txn-amount.green { color: #16A34A; }

                @media (max-width: 1100px) { .ot-summary-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 900px) { .ot-two-cols { grid-template-columns: 1fr; } }
                @media (max-width: 600px) { .ot-summary-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default OverallTradingView;
