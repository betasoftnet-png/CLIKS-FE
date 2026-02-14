import React, { useState, useRef, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Calendar,
    IndianRupee,
    Edit2,
    Trash2,
    Filter,
    Search,
    ChevronDown,
    Briefcase,
    Building2,
    Receipt,
    Coffee,
    Home,
    Smartphone,
    MoreHorizontal
} from 'lucide-react';
import '../App.css';
import './Transactions.css';
import { formatCurrency } from '../lib/formatCurrency';

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`icon-box ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="stat-footer">{subtext}</p>
    </div>
);

const Transactions = () => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsAddMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [transactions] = useState([
        { id: 1, type: 'Income', source: 'Salary', amount: 50000, category: 'Employment', date: '2026-01-01', icon: Briefcase },
        { id: 2, type: 'Expense', source: 'Rent Payment', amount: 12000, category: 'Housing', date: '2026-01-02', icon: Home },
        { id: 3, type: 'Expense', source: 'Starbucks', amount: 450, category: 'Food', date: '2026-01-03', icon: Coffee },
        { id: 4, type: 'Income', source: 'Freelance', amount: 8000, category: 'Business', date: '2026-01-05', icon: Building2 },
        { id: 5, type: 'Expense', source: 'Mobile Bill', amount: 600, category: 'Utilities', date: '2026-01-10', icon: Smartphone },
    ]);

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return (
        <div className="transactions-page page-fade-in">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">

                    <p className="page-subtitle">Track and manage your financial activity</p>
                </div>

                {/* Add Transaction Menu */}
                <div className="action-menu-container" ref={menuRef}>
                    <button
                        onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                        className={`btn-primary ${isAddMenuOpen ? 'active' : ''}`}
                    >
                        <Plus size={18} />
                        <span>Record Transaction</span>
                        <ChevronDown size={16} className={`chevron-icon ${isAddMenuOpen ? 'rotate' : ''}`} />
                    </button>

                    {isAddMenuOpen && (
                        <div className="dropdown-menu animate-scale-in">
                            <button className="dropdown-item">
                                <div className="icon-box bg-green">
                                    <TrendingUp size={16} />
                                </div>
                                <div className="dropdown-text">
                                    <span className="item-title">Add Income</span>
                                    <span className="item-desc">Salary, Freelance...</span>
                                </div>
                            </button>
                            <button className="dropdown-item">
                                <div className="icon-box bg-red">
                                    <TrendingDown size={16} />
                                </div>
                                <div className="dropdown-text">
                                    <span className="item-title">Add Expense</span>
                                    <span className="item-desc">Bills, Food, Shop...</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    label="Total Income"
                    value={formatCurrency(totalIncome)}
                    subtext="Actual • This Month"
                    icon={TrendingUp}
                    colorClass="stat-green"
                />
                <StatCard
                    label="Total Expenses"
                    value={formatCurrency(totalExpense)}
                    subtext="Actual • This Month"
                    icon={TrendingDown}
                    colorClass="stat-red"
                />
                <StatCard
                    label="Net Balance"
                    value={formatCurrency(netBalance)}
                    subtext="Cash Flow Status"
                    icon={IndianRupee}
                    colorClass="stat-blue"
                />
            </div>

            {/* Content Area */}
            <div className="transactions-container">

                {/* Toolbar */}
                <div className="toolbar-section">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="search-input"
                        />
                    </div>

                    <div className="filter-actions">
                        <button className="btn-secondary">
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>
                        <button className="btn-secondary">
                            <Calendar size={16} />
                            <span>This Month</span>
                        </button>
                    </div>
                </div>

                {/* Transaction List (Horizontal Tiles) */}
                {/* Transactions Table (New Layout) */}
                <div className="transactions-table-container">
                    <div className="table-header-row">
                        <div className="table-title">
                            <Filter size={18} />
                            <span>List of Transactions</span>
                        </div>
                        <span className="see-all-link">See All</span>
                    </div>

                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col"></th>
                                <th>APPLICATION</th>
                                <th>TYPE</th>
                                <th>RATE</th>
                                <th style={{ textAlign: 'right' }}>PROFIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((item, index) => {
                                // Dummy percentage for the 'Rate' column to match reference
                                const percentage = Math.floor(Math.random() * (90 - 20 + 1)) + 20;
                                return (
                                    <tr key={item.id} className="table-row-card">
                                        <td>
                                            <div className="custom-checkbox">
                                                {/* Logic for checkbox would go here */}
                                            </div>
                                        </td>
                                        <td className="app-col">
                                            <div className="app-info">
                                                <div className="app-icon-box">
                                                    {item.icon ? <item.icon size={20} /> : <Receipt size={20} />}
                                                </div>
                                                <span className="app-name">{item.source}</span>
                                            </div>
                                        </td>
                                        <td className="type-col">
                                            {item.category}
                                        </td>
                                        <td className="rate-col">
                                            <div className="rate-wrapper">
                                                <div className="progress-track">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${percentage}%`, background: item.type === 'Income' ? '#4F46E5' : '#10B981' }}
                                                    ></div>
                                                </div>
                                                <span className="rate-text">{percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="profit-col">
                                            <span style={{ color: item.type === 'Income' ? '#10B981' : '#1e293b' }}>
                                                {item.type === 'Expense' ? '-' : ''}{formatCurrency(item.amount)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar">
                    <span className="page-info">Showing {transactions.length} entries</span>
                    <div className="page-controls">
                        <button className="btn-page" disabled>Previous</button>
                        <button className="btn-page">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
