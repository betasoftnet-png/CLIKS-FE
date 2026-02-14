import React, { useState } from 'react';
import {
    LineChart,
    Plus,
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart3,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    PiggyBank,
    Bitcoin,
    Activity,
    Coins
} from 'lucide-react';
import '../App.css';
import { formatCurrency } from '../lib/formatCurrency';

// --- Sub-View: Overall Trading (Existing Dashboard Logic) ---
const OverallTradingView = () => {
    const [investments] = useState([
        { id: 1, name: 'Apple Inc.', symbol: 'AAPL', type: 'Stock', amount: 150000, returns: 22500, returnPercent: 15, color: 'blue', qty: 85 },
        { id: 2, name: 'Vanguard S&P 500', symbol: 'VOO', type: 'ETF', amount: 250000, returns: 37500, returnPercent: 12, color: 'green', qty: 60 },
        { id: 3, name: 'Real Estate Fund', symbol: 'REIT', type: 'Property', amount: 500000, returns: 50000, returnPercent: 10, color: 'orange', qty: 1200 },
        { id: 4, name: 'Bitcoin', symbol: 'BTC', type: 'Crypto', amount: 80000, returns: -16000, returnPercent: -20, color: 'yellow', qty: 0.15 },
    ]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
    const portfolioValue = totalInvested + totalReturns;
    const overallReturnPercent = (totalReturns / totalInvested) * 100;

    return (
        <div className="view-fade-in">
            <div className="dashboard-header">
                <div>
                    <h2 className="view-title">Overall Portfolio</h2>
                    <p className="text-muted text-sm mt-1">Comprehensive view of all asset classes</p>
                </div>
            </div>

            {/* Stats */}
            <div className="investment-stats-grid">
                <InvestmentStat
                    label="Portfolio Value"
                    value={formatCurrency(portfolioValue)}
                    subtext="Total equity"
                    icon={Briefcase}
                    colorClass="icon-blue"
                    trend={2.4}
                />
                <InvestmentStat
                    label="Total Earnings"
                    value={`${totalReturns >= 0 ? '+' : '-'}${formatCurrency(Math.abs(totalReturns))}`}
                    subtext="All time returns"
                    icon={TrendingUp}
                    colorClass={totalReturns >= 0 ? "icon-green" : "icon-red"}
                    trend={overallReturnPercent.toFixed(1)}
                />
                <InvestmentStat
                    label="Day Change"
                    value={'+' + formatCurrency(12405)}
                    subtext="Today's P&L"
                    icon={BarChart3}
                    colorClass="icon-purple"
                    trend={0.8}
                />
            </div>

            {/* Portfolio Table */}
            <div className="portfolio-container">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="section-title">Your Assets</h2>
                    <div className="flex gap-2">
                        <span className="pill-active">All</span>
                        <span className="pill-inactive">Stocks</span>
                        <span className="pill-inactive">Crypto</span>
                    </div>
                </div>

                <table className="portfolio-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Type</th>
                            <th>Balance</th>
                            <th>Returns</th>
                            <th>Allocation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map((inv) => (
                            <tr key={inv.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className={`asset-icon bg-${inv.color}-light text-${inv.color}`}>
                                            <span className="font-bold">{inv.symbol.substring(0, 1)}</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-main">{inv.name}</div>
                                            <div className="text-muted text-xs">{inv.symbol} • {inv.qty} Shares</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`asset-type-badge type-${inv.color}`}>
                                        {inv.type}
                                    </span>
                                </td>
                                <td>
                                    <div className="font-bold text-main">{formatCurrency(inv.amount + inv.returns)}</div>
                                    <div className="text-muted text-xs">Cost: {formatCurrency(inv.amount)}</div>
                                </td>
                                <td>
                                    <div className={`font-semibold flex items-center gap-1 ${inv.returns >= 0 ? 'text-green' : 'text-red'}`}>
                                        {inv.returns >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {Math.abs(inv.returnPercent)}%
                                    </div>
                                    <div className={`text-xs ${inv.returns >= 0 ? 'text-green' : 'text-red'}`}>
                                        {inv.returns >= 0 ? '+' : '-'}{formatCurrency(Math.abs(inv.returns))}
                                    </div>
                                </td>
                                <td width="20%">
                                    <div className="allocation-bar-bg">
                                        <div
                                            className={`allocation-bar-fill bg-${inv.color}`}
                                            style={{ width: `${((inv.amount + inv.returns) / portfolioValue * 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right text-xs text-muted mt-1">
                                        {((inv.amount + inv.returns) / portfolioValue * 100).toFixed(1)}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Placeholder Views for other sections ---
const PlaceholderView = ({ title, icon: Icon }) => (
    <div className="view-fade-in flex flex-col items-center justify-center h-64 text-center p-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Icon size={32} className="text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-main mb-2">{title} Management</h3>
        <p className="text-muted max-w-md">This module uses the same professional layout logic. Connect your {title} data source to visualize holdings.</p>
        <button className="btn-primary mt-6">
            <Plus size={16} /> <span>Add {title}</span>
        </button>
    </div>
);

const InvestmentStat = ({ label, value, subtext, icon: Icon, colorClass, trend }) => (
    <div className="investment-stat-card">
        <div className="flex justify-between items-start">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="stat-footer">
            {trend && (
                <span className={`trend-badge ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </span>
            )}
            <p className="stat-subtext">{subtext}</p>
        </div>
    </div>
);

// --- Main Layout Component ---
const Investments = () => {
    const [activeTab, setActiveTab] = useState('sip');

    const menuItems = [
        { id: 'sip', label: 'SIP', icon: TrendingUp },
        { id: 'mutual_funds', label: 'Mutual Funds', icon: PiggyBank },
        { id: 'crypto', label: 'Crypto', icon: Bitcoin },
        { id: 'bitcoin', label: 'Bitcoin', icon: Coins },
        { id: 'overall', label: 'Overall Trading', icon: Activity }
    ];

    return (
        <div className="investments-page-root">
            {/* Header */}
            <div className="dashboard-header mb-6">

            </div>

            <div className="investments-layout-container">
                {/* Sidebar Navigation */}
                <div className="investments-sidebar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`inv-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <div className="inv-nav-icon">
                                <item.icon size={20} />
                            </div>
                            <span className="inv-nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="investments-content-area">
                    {activeTab === 'overall' && <OverallTradingView />}
                    {activeTab === 'sip' && <PlaceholderView title="SIP" icon={TrendingUp} />}
                    {activeTab === 'mutual_funds' && <PlaceholderView title="Mutual Funds" icon={PiggyBank} />}
                    {activeTab === 'crypto' && <PlaceholderView title="Crypto" icon={Bitcoin} />}
                    {activeTab === 'bitcoin' && <PlaceholderView title="Bitcoin" icon={Coins} />}
                </div>
            </div>

            <style>{`
                .investments-page-root {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .investments-layout-container {
                    display: flex;
                    gap: 2rem;
                    align-items: flex-start;
                    flex: 1;
                }

                .investments-sidebar {
                    width: 260px;
                    background: white;
                    border-radius: 16px;
                    padding: 1rem;
                    border: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }

                .inv-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    width: 100%;
                    border: none;
                    background: transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .inv-nav-item:hover {
                    background: #F8FAFC;
                    color: var(--text-main);
                }

                .inv-nav-item.active {
                    background: #EFF6FF; /* Light Blue */
                    color: var(--primary); /* Blue */
                    font-weight: 600;
                }
                
                /* Icon Colors for Inactive State to match image "Gold/Yellowish" feel? 
                   User image showed orange/yellow outlines. 
                   I will add a specific class for inactive icons if needed, 
                   but strictly user said "Simple and professional". 
                   Theme consistecy is safer. I'll stick to theme colors for active, muted for inactive.
                */
                .inv-nav-item .inv-nav-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .investments-content-area {
                    flex: 1;
                    min-width: 0;
                }

                .view-title { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.5rem; }

                /* Animations */
                .view-fade-in { animation: fadeIn 0.3s ease-out; }

                /* Existing Component Styles needed for Overall View (Copied/Adapted) */
                .investment-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .investment-stat-card {
                    background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-footer { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; }
                .stat-subtext { font-size: 0.8rem; color: var(--text-muted); }
                .trend-badge { display: flex; align-items: center; gap: 0.25rem; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
                .trend-up { background: #DCFCE7; color: #16A34A; }
                .trend-down { background: #FEE2E2; color: #DC2626; }
                .stat-icon-wrapper { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-red { background: #FEE2E2; color: #EF4444; }
                .icon-purple { background: #F3E8FF; color: #9333EA; }

                .portfolio-container {
                    background: white; border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem;
                }
                .section-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
                .pill-active { background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500; cursor: pointer; }
                .pill-inactive { background: #F1F5F9; color: var(--text-muted); padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .pill-inactive:hover { background: #E2E8F0; color: var(--text-main); }
                
                .portfolio-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                .portfolio-table th { text-align: left; padding: 0.75rem 0; color: var(--text-muted); font-weight: 500; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); }
                .portfolio-table td { padding: 1rem 0; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
                .portfolio-table tr:last-child td { border-bottom: none; }

                .asset-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .bg-blue-light { background: #EFF6FF; } .text-blue { color: #2563EB; } .bg-blue { background: #2563EB; }
                .bg-green-light { background: #F0FDF4; } .text-green { color: #16A34A; } .bg-green { background: #16A34A; }
                .bg-orange-light { background: #FFF7ED; } .text-orange { color: #F97316; } .bg-orange { background: #F97316; }
                .bg-yellow-light { background: #FEF9C3; } .text-yellow { color: #CA8A04; } .bg-yellow { background: #CA8A04; }
                .asset-type-badge { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; background: #F8FAFC; border: 1px solid var(--border-color); color: var(--text-muted); }
                .text-green { color: #16A34A; } .text-red { color: #DC2626; }
                .allocation-bar-bg { width: 100%; height: 6px; background: #F1F5F9; border-radius: 99px; }
                .allocation-bar-fill { height: 100%; border-radius: 99px; }

                @media (max-width: 1024px) {
                    .investments-layout-container { flex-direction: column; gap: 1rem; }
                    .investments-sidebar { width: 100%; flex-direction: row; overflow-x: auto; }
                    .inv-nav-item { width: auto; whitespace: nowrap; }
                }
            `}</style>
        </div>
    );
};

export default Investments;
