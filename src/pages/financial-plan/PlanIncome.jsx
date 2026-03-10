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

const EMPTY_FORM = { source: '', category: '', amount: '', date: '' };

const PlanIncome = () => {
    const [incomeSources, setIncomeSources] = useState(() => {
        const saved = localStorage.getItem('books_plan_income');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('books_plan_income', JSON.stringify(incomeSources));
    }, [incomeSources]);

    const openModal = () => {
        setFormData(EMPTY_FORM);
        setFormError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
    };

    const handleAddIncome = (e) => {
        e.preventDefault();
        if (!formData.source || !formData.category || !formData.amount || !formData.date) {
            setFormError('All fields are required.');
            return;
        }

        const newIncome = {
            id: Date.now(),
            source: formData.source,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date,
        };

        setIncomeSources((prev) => [newIncome, ...prev]);
        closeModal();
    };

    const handleDelete = (id) => {
        setIncomeSources((prev) => prev.filter((item) => item.id !== id));
    };

    const totalIncome = incomeSources.reduce((sum, item) => sum + item.amount, 0);
    const monthlyAverage =
        incomeSources.length > 0 ? totalIncome / incomeSources.length : 0;

    const filteredSources = incomeSources.filter(
        (item) =>
            item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fp-page">
            {/* ── Page Header ── */}
            <div className="fp-header">
                <div className="fp-header-left">
                    <h1>Income</h1>
                    <p>Track and manage your income sources</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={openModal}>
                    <Plus size={16} />
                    <span>Add Income</span>
                </button>
            </div>

            {/* ── Summary Cards ── */}
            <div className="fp-summary-grid">
                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--green">
                        <DollarSign size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Total Income</p>
                        <h3>${totalIncome.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--blue">
                        <TrendingUp size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Monthly Average</p>
                        <h3>${monthlyAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--purple">
                        <Wallet size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Income Sources</p>
                        <h3>{incomeSources.length}</h3>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="fp-toolbar">
                <div className="fp-search-wrap">
                    <Search size={15} className="fp-search-icon" />
                    <input
                        type="text"
                        placeholder="Search income..."
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
            {filteredSources.length === 0 ? (
                <EmptyState
                    title="No income records yet"
                    description="Add your first income source to start tracking your earnings."
                />
            ) : (
                <div className="fp-table-card">
                    <table className="fp-table">
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Category</th>
                                <th className="fp-th-right">Amount</th>
                                <th>Date</th>
                                <th className="fp-th-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSources.map((item) => (
                                <tr key={item.id}>
                                    <td className="fp-td-name">{item.source}</td>
                                    <td>
                                        <span className="fp-badge">{item.category}</span>
                                    </td>
                                    <td className="fp-td-amount">${item.amount.toLocaleString()}</td>
                                    <td className="fp-td-muted">{item.date}</td>
                                    <td className="fp-td-center">
                                        <div className="fp-row-actions">
                                            <button className="fp-action-btn fp-action-btn--edit" title="Edit">
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                className="fp-action-btn fp-action-btn--delete"
                                                title="Delete"
                                                onClick={() => handleDelete(item.id)}
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

            {/* ── Add Income Modal ── */}
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
                                <h2 className="fp-modal-title">Add Income Source</h2>
                                <button className="fp-modal-close" onClick={closeModal}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form className="fp-form" onSubmit={handleAddIncome}>
                                <div className="fp-field">
                                    <label className="fp-label">Source Name</label>
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="e.g. Salary, Freelance"
                                        value={formData.source}
                                        onChange={(e) =>
                                            setFormData({ ...formData, source: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Category</label>
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="e.g. Employment, Investment"
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
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, amount: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Date</label>
                                    <input
                                        type="date"
                                        className="fp-input"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
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
                                        Save Income
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

export default PlanIncome;
