import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/common/EmptyState';
import {
    Plus,
    ShoppingCart,
    CalendarClock,
    Tag,
    AlertCircle,
    ArrowRight,
    Search,
    Filter,
    ChevronDown,
    Edit,
    Trash2,
    DollarSign,
    TrendingUp,
    Wallet
} from 'lucide-react';
import '../../App.css';

const PlanExpense = () => {
    const [plannedExpenses, setPlannedExpenses] = useState(() => {
        const saved = localStorage.getItem('books_plan_expense');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ item: '', category: '', estimatedCost: '', plannedMonth: '' });
    const [formError, setFormError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('books_plan_expense', JSON.stringify(plannedExpenses));
    }, [plannedExpenses]);

    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!formData.item || !formData.category || !formData.estimatedCost || !formData.plannedMonth) {
            setFormError('All fields are required');
            return;
        }

        const newExpense = {
            id: Date.now(),
            item: formData.item,
            category: formData.category,
            estimatedCost: parseFloat(formData.estimatedCost),
            plannedMonth: formData.plannedMonth,
            priority: 'Medium'
        };

        setPlannedExpenses(prev => [newExpense, ...prev]);
        setIsModalOpen(false);
        setFormData({ item: '', category: '', estimatedCost: '', plannedMonth: '' });
        setFormError('');
    };

    const handleDelete = (id) => {
        setPlannedExpenses(prev => prev.filter(item => item.id !== id));
    };

    const totalProjected = plannedExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);
    const monthlyAverage = plannedExpenses.length > 0 ? totalProjected / plannedExpenses.length : 0; // Simplified

    const filteredExpenses = plannedExpenses.filter(item => 
        item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="page-title text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Expense</h1>
                    <p className="text-sm text-muted mt-1" style={{ color: 'var(--text-muted)' }}>Track and prepare for upcoming large expenses</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '50%' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Planned</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${totalProjected.toLocaleString()}</h3>
                    </div>
                </div>
                
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#FFEDD5', color: '#C2410C', padding: '12px', borderRadius: '50%' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Average</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${monthlyAverage.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
                    </div>
                </div>

                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#E0E7FF', color: '#4338CA', padding: '12px', borderRadius: '50%' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>upcoming items</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{plannedExpenses.length}</h3>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 toolbar border rounded-lg p-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64" style={{ borderColor: 'var(--border-color)' }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        className="outline-none w-full text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        <Filter size={16} />
                        <span className="text-sm">Filter</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        <span className="text-sm">Sort By</span>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Data Section */}
            {plannedExpenses.length === 0 ? (
                <EmptyState 
                    title="No expenses planned yet"
                    description="Add your first planned expense to start preparing"
                />
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expense Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>{expense.item}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">{expense.category}</span>
                                    </td>
                                    <td className="p-4 text-right font-bold" style={{ color: 'var(--text-main)' }}>$\${expense.estimatedCost.toLocaleString()}</td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>{expense.plannedMonth}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(expense.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
                        >
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Add Planned Expense</h2>
                            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Expense Name</label>
                                    <input 
                                        type="text" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. New Laptop"
                                        value={formData.item}
                                        onChange={e => setFormData({...formData, item: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Category</label>
                                    <input 
                                        type="text" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. Electronics"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Amount</label>
                                    <input 
                                        type="number" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="0.00"
                                        value={formData.estimatedCost}
                                        onChange={e => setFormData({...formData, estimatedCost: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Date</label>
                                    <input 
                                        type="date" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        value={formData.plannedMonth}
                                        onChange={e => setFormData({...formData, plannedMonth: e.target.value})}
                                    />
                                </div>
                                {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button 
                                        type="button" 
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    >
                                        Save Expense
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{\`
                .card {
                    background-color: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                }
                .dashboard-tile {
                    padding: 24px;
                }
                .text-muted {
                    color: #64748b;
                }
            \`}</style>
        </div>
    );
};

export default PlanExpense;
`;

fs.writeFileSync('src/pages/financial-plan/PlanExpense.jsx', content);
