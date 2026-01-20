import React, { useState } from 'react';
import {
    TrendingUp,
    Plus,
    Calendar,
    DollarSign,
    Tag,
    Edit2,
    Trash2,
    Filter,
    Search,
    ChevronDown,
    Briefcase,
    Building2,
    PieChart,
    ArrowUpRight
} from 'lucide-react';
import '../App.css';

const IncomeStr = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="income-stat-card">
        <div className="flex justify-between items-start">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="stat-subtext">{subtext}</p>
    </div>
);

const Income = () => {
    const [incomeData] = useState([
        { id: 1, source: 'Salary', amount: 5000, category: 'Employment', date: '2026-01-01', recurring: true, icon: Briefcase },
        { id: 2, source: 'Freelance Project', amount: 1200, category: 'Business', date: '2026-01-15', recurring: false, icon: Building2 },
        { id: 3, source: 'Investment Returns', amount: 350, category: 'Investments', date: '2026-01-10', recurring: false, icon: TrendingUp },
        { id: 4, source: 'Rental Income', amount: 800, category: 'Property', date: '2026-01-05', recurring: true, icon: Building2 },
        { id: 5, source: 'Dividend Payout', amount: 150, category: 'Investments', date: '2026-01-20', recurring: false, icon: PieChart },
    ]);

    const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const recurringIncome = incomeData.filter(item => item.recurring).reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Income</h1>
                    <p className="text-muted text-sm mt-1">Track and manage your revenue streams</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Record Income</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="income-stats-grid">
                    <IncomeStr
                        label="Total Income"
                        value={`$${totalIncome.toLocaleString()}`}
                        subtext="+12% from last month"
                        icon={DollarSign}
                        colorClass="icon-green"
                    />
                    <IncomeStr
                        label="Recurring Revenue"
                        value={`$${recurringIncome.toLocaleString()}`}
                        subtext="Monthly stable income"
                        icon={Calendar}
                        colorClass="icon-blue"
                    />
                    <IncomeStr
                        label="Active Sources"
                        value={incomeData.length}
                        subtext="Across 3 categories"
                        icon={PieChart}
                        colorClass="icon-purple"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search income sources..." className="search-input" />
                    </div>

                    <div className="flex gap-3">
                        <button className="filter-btn">
                            <Filter size={16} />
                            <span>Filter</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="filter-btn">
                            <Calendar size={16} />
                            <span>This Month</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Income Table */}
                <div className="income-list-container">
                    <table className="income-table">
                        <thead>
                            <tr>
                                <th>Source Name</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="table-icon-bg">
                                                {item.icon ? <item.icon size={18} /> : <DollarSign size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-main">{item.source}</div>
                                                {item.recurring && (
                                                    <span className="recurring-badge">Recurring</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-pill">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="text-muted">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="font-bold text-success">+${item.amount.toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="action-btn hover-blue" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn hover-red" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .page-fade-in {
                    animation: fadeIn 0.4s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .income-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .income-stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .income-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px rgba(0,0,0,0.04);
                }

                .stat-label {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 0.25rem;
                }

                .stat-subtext {
                    font-size: 0.8rem;
                    color: #10B981; /* Green for positive growth hints */
                    font-weight: 500;
                }

                .stat-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-purple { background: #F3E8FF; color: #9333EA; }

                /* Search & Filters */
                .search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    outline: none;
                    font-size: 0.9rem;
                    background: white;
                    transition: border-color 0.2s;
                }
                .search-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(25, 91, 172, 0.1);
                }

                .filter-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-main);
                    transition: all 0.2s;
                }
                .filter-btn:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                }

                /* Table Styling */
                .income-list-container {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }

                .income-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .income-table th {
                    text-align: left;
                    padding: 1rem 1.5rem;
                    background: #F8FAFC;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-muted);
                    font-weight: 600;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .income-table td {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    vertical-align: middle;
                    color: var(--text-main);
                }

                .income-table tr:last-child td {
                    border-bottom: none;
                }

                .income-table tr:hover td {
                    background: #F8FAFC;
                }

                .table-icon-bg {
                    width: 36px;
                    height: 36px;
                    background: #F1F5F9;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }

                .recurring-badge {
                    display: inline-block;
                    font-size: 0.65rem;
                    padding: 0.1rem 0.5rem;
                    background: #EFF6FF;
                    color: #2563EB;
                    border-radius: 999px;
                    margin-top: 2px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }

                .category-pill {
                    padding: 0.25rem 0.75rem;
                    background: #F1F5F9;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }

                .text-success { color: #16A34A; }
                .text-main { color: var(--text-main); }
                
                .action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                
                .hover-blue:hover { background: #EFF6FF; color: #2563EB; }
                .hover-red:hover { background: #FEF2F2; color: #DC2626; }

                @media (max-width: 768px) {
                    .income-table thead { display: none; }
                    .income-table tr { display: block; border-bottom: 1px solid var(--border-color); padding: 1rem; }
                    .income-table td { display: flex; justify-content: space-between; padding: 0.5rem 0; border: none; }
                    .income-table td::before { content: attr(date-label); font-weight: 600; color: var(--text-muted); display: block; }
                }
            `}</style>
        </div>
    );
};

export default Income;
