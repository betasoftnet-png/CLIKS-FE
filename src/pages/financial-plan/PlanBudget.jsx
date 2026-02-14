import React, { useState } from 'react';
import {
    DollarSign,
    PieChart,
    Plus,
    Save,
    RotateCcw,
    ShoppingBag,
    Coffee,
    Home,
    Car,
    Smartphone
} from 'lucide-react';
import '../../App.css';

const PlanBudget = () => {
    const [totalIncome] = useState(5000);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Housing', allocated: 1500, icon: Home, color: 'blue' },
        { id: 2, name: 'Food & Dining', allocated: 600, icon: Coffee, color: 'orange' },
        { id: 3, name: 'Transportation', allocated: 400, icon: Car, color: 'green' },
        { id: 4, name: 'Shopping', allocated: 300, icon: ShoppingBag, color: 'purple' },
        { id: 5, name: 'Utilities', allocated: 250, icon: Smartphone, color: 'yellow' },
    ]);

    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const remaining = totalIncome - totalAllocated;

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Allocate your monthly funds effectively</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        <RotateCcw size={18} />
                        <span>Reset</span>
                    </button>
                    <button className="btn-primary">
                        <Save size={18} />
                        <span>Save Plan</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-muted text-sm font-medium mb-1">Projected Income</p>
                            <h2 className="text-3xl font-bold text-[var(--text-main)]">${totalIncome.toLocaleString()}</h2>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-muted text-sm font-medium mb-1">Total Allocated</p>
                            <h2 className="text-3xl font-bold text-blue-600">${totalAllocated.toLocaleString()}</h2>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-muted text-sm font-medium mb-1">Remaining to Assign</p>
                            <h2 className={`text-3xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                ${remaining.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                    <div className="mt-6 w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${remaining < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min((totalAllocated / totalIncome) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-center mt-2 text-sm text-muted">
                        You have allocated {Math.round((totalAllocated / totalIncome) * 100)}% of your income.
                    </p>
                </div>

                {/* Categories Grid */}
                <h3 className="section-title mb-4">Category Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white p-5 rounded-xl border border-[var(--border-color)] hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${cat.color}-100 text-${cat.color}-600`}>
                                        <cat.icon size={20} />
                                    </div>
                                    <span className="font-semibold text-[var(--text-main)]">{cat.name}</span>
                                </div>
                                <button className="text-gray-400 hover:text-blue-600"><Plus size={18} /></button>
                            </div>

                            <div className="mb-2">
                                <label className="text-xs font-semibold text-muted uppercase">Allocated Amount</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <DollarSign size={16} className="text-muted" />
                                    <input
                                        type="number"
                                        value={cat.allocated}
                                        className="w-full font-bold text-lg text-[var(--text-main)] border-b border-gray-200 outline-none focus:border-blue-500 transition-colors bg-transparent"
                                        readOnly // Making readonly for UI demo, in real app needs onChange
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-muted flex justify-between mt-3">
                                <span>{((cat.allocated / totalAllocated) * 100).toFixed(1)}% of budget</span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Category */}
                    <button className="border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center gap-2 text-muted hover:border-blue-500 hover:text-blue-500 transition-colors min-h-[160px]">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Add Category</span>
                    </button>
                </div>
            </div>

            <style>{`
                .btn-secondary {
                    background: white; border: 1px solid var(--border-color); color: var(--text-muted);
                    padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; font-size: 0.875rem;
                }
                .btn-secondary:hover { background: #F8FAFC; color: var(--text-main); }
                
                .section-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
                
                /* Tailwind-like utilities if not globally available yet for color classes */
                .bg-blue-100 { background-color: #DBEAFE; } .text-blue-600 { color: #2563EB; }
                .bg-orange-100 { background-color: #FFEDD5; } .text-orange-600 { color: #EA580C; }
                .bg-green-100 { background-color: #DCFCE7; } .text-green-600 { color: #16A34A; }
                .bg-purple-100 { background-color: #F3E8FF; } .text-purple-600 { color: #9333EA; }
                .bg-yellow-100 { background-color: #FEF9C3; } .text-yellow-600 { color: #CA8A04; }
                
                .text-blue-500 { color: #3B82F6; }
                .bg-blue-500 { background-color: #3B82F6; }
                .text-red-500 { color: #EF4444; }
                .bg-red-500 { background-color: #EF4444; }
                .text-green-500 { color: #22C55E; }
            `}</style>
        </div>
    );
};

export default PlanBudget;
