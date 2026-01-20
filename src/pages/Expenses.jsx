import React, { useState } from 'react';
import {
    TrendingDown,
    Plus,
    Calendar,
    ShoppingCart,
    Tag,
    Edit2,
    Trash2,
    Filter,
    Search,
    ChevronDown,
    Receipt,
    Coffee,
    Zap,
    Activity,
    Car,
    CreditCard
} from 'lucide-react';
import '../App.css';

const ExpenseStat = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="expense-stat-card">
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

const Expenses = () => {
    const [expenseData] = useState([
        { id: 1, name: 'Groceries', amount: 450, category: 'Food', date: '2026-01-18', paymentMethod: 'Credit Card', icon: ShoppingCart },
        { id: 2, name: 'Electricity Bill', amount: 120, category: 'Utilities', date: '2026-01-15', paymentMethod: 'Bank Transfer', icon: Zap },
        { id: 3, name: 'Gym Membership', amount: 60, category: 'Health', date: '2026-01-10', paymentMethod: 'Debit Card', icon: Activity },
        { id: 4, name: 'Netflix Subscription', amount: 15, category: 'Entertainment', date: '2026-01-05', paymentMethod: 'Credit Card', icon: Coffee },
        { id: 5, name: 'Fuel', amount: 200, category: 'Transportation', date: '2026-01-12', paymentMethod: 'Cash', icon: Car },
    ]);

    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const avgDaily = (totalExpenses / 18).toFixed(2); // Assuming 18 days passed

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Expenses</h1>
                    <p className="text-muted text-sm mt-1">Monitor and control your spending habits</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="expense-stats-grid">
                    <ExpenseStat
                        label="Total Spend"
                        value={`$${totalExpenses.toLocaleString()}`}
                        subtext="+5% vs last month"
                        icon={TrendingDown}
                        colorClass="icon-red"
                    />
                    <ExpenseStat
                        label="Daily Average"
                        value={`$${avgDaily}`}
                        subtext="Per day analysis"
                        icon={Calendar}
                        colorClass="icon-orange"
                    />
                    <ExpenseStat
                        label="Total Transactions"
                        value={expenseData.length}
                        subtext=" across 5 categories"
                        icon={Receipt}
                        colorClass="icon-blue"
                    />
                </div>

                {/* Controls */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search expenses..." className="search-input" />
                    </div>

                    <div className="flex gap-3">
                        <button className="filter-btn">
                            <Filter size={16} />
                            <span>Category</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="filter-btn">
                            <Calendar size={16} />
                            <span>This Month</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Detailed List */}
                <div className="expense-list-container">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="table-icon-bg">
                                                {item.icon ? <item.icon size={18} /> : <Receipt size={18} />}
                                            </div>
                                            <div className="font-medium text-main">{item.name}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-pill">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="text-muted">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                    <td>
                                        <div className="flex items-center gap-2 text-sm text-muted">
                                            <CreditCard size={14} />
                                            {item.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="font-bold text-danger">-${item.amount.toLocaleString()}</td>
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
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .expense-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .expense-stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-subtext { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
                
                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-red { background: #FEE2E2; color: #EF4444; }
                .icon-orange { background: #FFEDD5; color: #F97316; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }

                /* Reuse search/filter styles from Income page implicitly via copy-paste consistency or global classes if promoted */
                .search-wrapper { position: relative; flex: 1; max-width: 400px; }
                .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                .search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid var(--border-color); border-radius: 10px; outline: none; font-size: 0.9rem; background: white; transition: border-color 0.2s; }
                .search-input:focus { border-color: var(--primary); }

                .filter-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: white; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.9rem; font-weight: 500; color: var(--text-main); transition: all 0.2s; }
                .filter-btn:hover { background: #F8FAFC; border-color: #CBD5E1; }

                .expense-list-container { background: white; border-radius: 16px; border: 1px solid var(--border-color); overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .expense-table { width: 100%; border-collapse: collapse; }
                .expense-table th { text-align: left; padding: 1rem 1.5rem; background: #F8FAFC; border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .expense-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; color: var(--text-main); }
                .expense-table tr:last-child td { border-bottom: none; }
                .expense-table tr:hover td { background: #F8FAFC; }

                .table-icon-bg { width: 36px; height: 36px; background: #F1F5F9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
                .category-pill { padding: 0.25rem 0.75rem; background: #F1F5F9; border-radius: 6px; font-size: 0.85rem; color: var(--text-muted); }
                
                .text-danger { color: #EF4444; }
                .text-main { color: var(--text-main); }

                .action-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
                .hover-blue:hover { background: #EFF6FF; color: #2563EB; }
                .hover-red:hover { background: #FEF2F2; color: #DC2626; }
                
                @media (max-width: 768px) {
                    .expense-table thead { display: none; }
                    .expense-table tr { display: flex; flex-direction: column; padding: 1rem; border-bottom: 1px solid var(--border-color); gap: 0.5rem; }
                    .expense-table td { padding: 0; border: none; }
                }
            `}</style>
        </div>
    );
};

export default Expenses;
