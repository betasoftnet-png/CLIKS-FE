import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/common/EmptyState';
import {
    Plus,
    DollarSign,
    TrendingUp,
    Wallet,
    Search,
    Filter,
    ChevronDown,
    Edit,
    Trash2,
    X,
} from 'lucide-react';
import './financial-plan.css';

const EMPTY_FORM = { item: '', category: '', estimatedCost: '', plannedMonth: '' };

const PlanExpense = () => {
    const [plannedExpenses, setPlannedExpenses] = useState(() => {
        const saved = localStorage.getItem('books_plan_expense');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('books_plan_expense', JSON.stringify(plannedExpenses));
    }, [plannedExpenses]);

    const openModal = () => {
        setFormData(EMPTY_FORM);
        setFormError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!formData.item || !formData.category || !formData.estimatedCost || !formData.plannedMonth) {
            setFormError('All fields are required.');
            return;
        }

        const newExpense = {
            id: Date.now(),
            item: formData.item,
            category: formData.category,
            estimatedCost: parseFloat(formData.estimatedCost),
            plannedMonth: formData.plannedMonth,
        };

        setPlannedExpenses((prev) => [newExpense, ...prev]);
        closeModal();
    };

    const handleDelete = (id) => {
        setPlannedExpenses((prev) => prev.filter((item) => item.id !== id));
    };

    const totalProjected = plannedExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);
    const monthlyAverage =
        plannedExpenses.length > 0 ? totalProjected / plannedExpenses.length : 0;

    const filteredExpenses = plannedExpenses.filter(
        (item) =>
            item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fp-page">
            {/* ── Page Header ── */}
            <div className="fp-header">
                <div className="fp-header-left">
                    <h1>Expense</h1>
                    <p>Track and prepare for upcoming large expenses</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={openModal}>
                    <Plus size={16} />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* ── Summary Cards ── */}
            <div className="fp-summary-grid">
                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--red">
                        <DollarSign size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Total Planned</p>
                        <h3>${totalProjected.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--orange">
                        <TrendingUp size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Monthly Average</p>
                        <h3>${monthlyAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--indigo">
                        <Wallet size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Upcoming Items</p>
                        <h3>{plannedExpenses.length}</h3>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="fp-toolbar">
                <div className="fp-search-wrap">
                    <Search size={15} className="fp-search-icon" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        className="fp-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="fp-toolbar-actions">
                    <button className="fp-filter-btn">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="fp-sort-btn">
                        Sort By
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* ── Data Section ── */}
            {filteredExpenses.length === 0 ? (
                <EmptyState
                    title="No expenses planned yet"
                    description="Add your first planned expense to start preparing your budget."
                />
            ) : (
                <div className="fp-table-card">
                    <table className="fp-table">
                        <thead>
                            <tr>
                                <th>Expense Name</th>
                                <th>Category</th>
                                <th className="fp-th-right">Amount</th>
                                <th>Date</th>
                                <th className="fp-th-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td className="fp-td-name">{expense.item}</td>
                                    <td>
                                        <span className="fp-badge">{expense.category}</span>
                                    </td>
                                    <td className="fp-td-amount">${expense.estimatedCost.toLocaleString()}</td>
                                    <td className="fp-td-muted">{expense.plannedMonth}</td>
                                    <td className="fp-td-center">
                                        <div className="fp-row-actions">
                                            <button className="fp-action-btn fp-action-btn--edit" title="Edit">
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                className="fp-action-btn fp-action-btn--delete"
                                                title="Delete"
                                                onClick={() => handleDelete(expense.id)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Add Expense Modal ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fp-modal-overlay">
                        <motion.div
                            className="fp-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="fp-modal-header">
                                <h2 className="fp-modal-title">Add Planned Expense</h2>
                                <button className="fp-modal-close" onClick={closeModal}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form className="fp-form" onSubmit={handleAddExpense}>
                                <div className="fp-field">
                                    <label className="fp-label">Expense Name</label>
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="e.g. New Laptop"
                                        value={formData.item}
                                        onChange={(e) =>
                                            setFormData({ ...formData, item: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Category</label>
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="e.g. Electronics"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Amount</label>
                                    <input
                                        type="number"
                                        className="fp-input"
                                        placeholder="0.00"
                                        value={formData.estimatedCost}
                                        onChange={(e) =>
                                            setFormData({ ...formData, estimatedCost: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Date</label>
                                    <input
                                        type="date"
                                        className="fp-input"
                                        value={formData.plannedMonth}
                                        onChange={(e) =>
                                            setFormData({ ...formData, plannedMonth: e.target.value })
                                        }
                                    />
                                </div>

                                {formError && (
                                    <p className="fp-form-error">{formError}</p>
                                )}

                                <div className="fp-modal-footer">
                                    <button
                                        type="button"
                                        className="fp-btn-cancel"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="fp-btn-submit">
                                        Save Expense
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlanExpense;
