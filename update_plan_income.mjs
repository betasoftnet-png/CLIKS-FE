import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
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
    Trash2
} from 'lucide-react';
import '../../App.css';

const PlanIncome = () => {
    const [incomeSources, setIncomeSources] = useState(() => {
        const saved = localStorage.getItem('books_plan_income');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ source: '', category: '', amount: '', date: '' });
    const [formError, setFormError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('books_plan_income', JSON.stringify(incomeSources));
    }, [incomeSources]);

    const handleAddIncome = (e) => {
        e.preventDefault();
        if (!formData.source || !formData.category || !formData.amount || !formData.date) {
            setFormError('All fields are required');
            return;
        }

        const newIncome = {
            id: Date.now(),
            source: formData.source,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date
        };

        setIncomeSources(prev => [newIncome, ...prev]);
        setIsModalOpen(false);
        setFormData({ source: '', category: '', amount: '', date: '' });
        setFormError('');
    };

    const handleDelete = (id) => {
        setIncomeSources(prev => prev.filter(item => item.id !== id));
    };

    const totalIncome = incomeSources.reduce((sum, item) => sum + item.amount, 0);
    const monthlyAverage = incomeSources.length > 0 ? totalIncome / incomeSources.length : 0; // Simplified
    
    const filteredSources = incomeSources.filter(item => 
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="page-title text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Income</h1>
                    <p className="text-sm text-muted mt-1" style={{ color: 'var(--text-muted)' }}>Track and manage your income sources</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>Add Income</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#DCFCE7', color: '#15803D', padding: '12px', borderRadius: '50%' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Income</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${totalIncome.toLocaleString()}</h3>
                    </div>
                </div>
                
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '12px', borderRadius: '50%' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Average</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${monthlyAverage.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
                    </div>
                </div>

                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#F3E8FF', color: '#7E22CE', padding: '12px', borderRadius: '50%' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Income Sources</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{incomeSources.length}</h3>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 toolbar border rounded-lg p-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64" style={{ borderColor: 'var(--border-color)' }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search income..." 
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
            {incomeSources.length === 0 ? (
                <EmptyState 
                    title="No income records yet"
                    description="Add your first income source to start tracking"
                />
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSources.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>{item.source}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">{item.category}</span>
                                    </td>
                                    <td className="p-4 text-right font-bold" style={{ color: 'var(--text-main)' }}>$\${item.amount.toLocaleString()}</td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>{item.date}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(item.id)}>
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
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Add Income Source</h2>
                            <form onSubmit={handleAddIncome} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Source Name</label>
                                    <input 
                                        type="text" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. Salary, Freelance"
                                        value={formData.source}
                                        onChange={e => setFormData({...formData, source: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Category</label>
                                    <input 
                                        type="text" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. Employment, Investment"
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
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Date</label>
                                    <input 
                                        type="date" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
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
                                        Save Income
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

export default PlanIncome;
`;

fs.writeFileSync('src/pages/financial-plan/PlanIncome.jsx', content);
