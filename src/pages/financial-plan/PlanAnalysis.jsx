import React from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import '../../App.css';

const PlanAnalysis = () => {
    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Financial Analysis</h1>
                    <p className="text-muted text-sm mt-1">Deep dive into your financial health</p>
                </div>
                <button className="btn-secondary">
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            <div className="content-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)]">
                        <p className="text-sm font-medium text-muted mb-2">Net Savings Rate</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-[var(--text-main)]">24%</h3>
                            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                <ArrowUpRight size={14} /> 2.1%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)]">
                        <p className="text-sm font-medium text-muted mb-2">Debt-to-Income</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-[var(--text-main)]">15%</h3>
                            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                <ArrowDownRight size={14} /> 0.5%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)]">
                        <p className="text-sm font-medium text-muted mb-2">Discretionary Spend</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-[var(--text-main)]">$1,200</h3>
                            <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                                <ArrowUpRight size={14} /> $150
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)]">
                        <p className="text-sm font-medium text-muted mb-2">Liquid Runway</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-[var(--text-main)]">4.5 Mo</h3>
                            <span className="text-xs text-muted">Goal: 6 Mo</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Monthly Trends Chart Widget */}
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] min-h-[350px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                                <TrendingUp size={20} className="text-[var(--primary)]" />
                                Income vs Expenses
                            </h3>
                            <div className="flex gap-2">
                                <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none text-muted">
                                    <option>Last 6 Months</option>
                                    <option>YTD</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                            {/* Mock Chart Bars */}
                            {[65, 59, 80, 81, 56, 95].map((val, i) => (
                                <div key={i} className="w-full flex gap-2 h-full items-end justify-center">
                                    <div className="w-full bg-blue-100 rounded-t-lg relative group transition-all hover:bg-blue-200" style={{ height: `${val}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${val}00</div>
                                    </div>
                                    <div className="w-full bg-blue-500 rounded-t-lg relative group transition-all hover:bg-blue-600" style={{ height: `${val * 0.7}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${val * 0.7 * 100}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between px-4 mt-2 text-xs text-muted font-medium">
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>

                    {/* Spend Allocation Widget */}
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] min-h-[350px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                                <PieChart size={20} className="text-purple-500" />
                                Expense Breakdown
                            </h3>
                        </div>
                        <div className="flex items-center justify-center h-[200px] mb-6">
                            {/* Mock Donut */}
                            <div className="w-48 h-48 rounded-full border-[16px] border-blue-500 border-r-green-400 border-b-orange-400 border-l-purple-400 relative">
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xs text-muted font-medium uppercase">Total</span>
                                    <span className="text-xl font-bold text-[var(--text-main)]">$2,450</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-sm text-muted">Housing (40%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-muted">Food (25%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <span className="text-sm text-muted">Transport (15%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                                <span className="text-sm text-muted">Others (20%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .btn-secondary {
                    background: white; border: 1px solid var(--border-color); color: var(--text-muted);
                    padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; font-size: 0.875rem;
                }
                .btn-secondary:hover { background: #F8FAFC; color: var(--text-main); }
            `}</style>
        </div>
    );
};

export default PlanAnalysis;
