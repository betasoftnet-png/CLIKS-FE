import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/common/EmptyState';
import {
    Plus,
    Target,
    Trophy,
    TrendingUp,
    Search,
    Filter,
    ChevronDown,
    Edit,
    Trash2,
    DollarSign,
    Wallet
} from 'lucide-react';
import '../../App.css';

const PlanGoals = () => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('books_plan_goals');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', target: '', current: '', deadline: '' });
    const [formError, setFormError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('books_plan_goals', JSON.stringify(goals));
    }, [goals]);

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.target || !formData.current || !formData.deadline) {
            setFormError('All fields are required');
            return;
        }

        const newGoal = {
            id: Date.now(),
            name: formData.name,
            target: parseFloat(formData.target),
            current: parseFloat(formData.current),
            deadline: formData.deadline
        };

        setGoals(prev => [newGoal, ...prev]);
        setIsModalOpen(false);
        setFormData({ name: '', target: '', current: '', deadline: '' });
        setFormError('');
    };

    const handleDelete = (id) => {
        setGoals(prev => prev.filter(item => item.id !== id));
    };

    const totalTarget = goals.reduce((sum, item) => sum + item.target, 0);
    const totalCurrent = goals.reduce((sum, item) => sum + item.current, 0);

    const filteredGoals = goals.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="page-title text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Savings & Goals</h1>
                    <p className="text-sm text-muted mt-1" style={{ color: 'var(--text-muted)' }}>Plan and track your long-term objectives</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>Add Goal</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#E0E7FF', color: '#4338CA', padding: '12px', borderRadius: '50%' }}>
                        <Target size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Target</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${totalTarget.toLocaleString()}</h3>
                    </div>
                </div>
                
                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#DCFCE7', color: '#15803D', padding: '12px', borderRadius: '50%' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Current Savings</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>$\${totalCurrent.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="card dashboard-tile flex items-center gap-4">
                    <div className="icon-wrapper" style={{ background: '#FEF9C3', color: '#A16207', padding: '12px', borderRadius: '50%' }}>
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Goals</p>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{goals.length}</h3>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 toolbar border rounded-lg p-2" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64" style={{ borderColor: 'var(--border-color)' }}>
                    <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                    <input 
                        type="text" 
                        placeholder="Search goals..." 
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
            {goals.length === 0 ? (
                <EmptyState 
                    title="No goals set yet"
                    description="Add your first savings goal to start tracking"
                />
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Target Amount</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Current Savings</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Progress</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredGoals.map((goal) => {
                                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                                return (
                                <tr key={goal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>{goal.name}</td>
                                    <td className="p-4 text-right font-bold" style={{ color: 'var(--text-main)' }}>$\${goal.target.toLocaleString()}</td>
                                    <td className="p-4 text-right" style={{ color: 'var(--text-main)' }}>$\${goal.current.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: \`\${progress}%\` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}%</span>
                                    </td>
                                    <td className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>{goal.deadline}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleDelete(goal.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
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
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Add Savings Goal</h2>
                            <form onSubmit={handleAddGoal} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Goal Name</label>
                                    <input 
                                        type="text" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. New Car"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Target Amount</label>
                                    <input 
                                        type="number" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="0.00"
                                        value={formData.target}
                                        onChange={e => setFormData({...formData, target: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Current Savings</label>
                                    <input 
                                        type="number" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="0.00"
                                        value={formData.current}
                                        onChange={e => setFormData({...formData, current: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-600">Target Date</label>
                                    <input 
                                        type="date" 
                                        className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        value={formData.deadline}
                                        onChange={e => setFormData({...formData, deadline: e.target.value})}
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
                                        Save Goal
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

export default PlanGoals;
`;

fs.writeFileSync('src/pages/financial-plan/PlanGoals.jsx', content);
