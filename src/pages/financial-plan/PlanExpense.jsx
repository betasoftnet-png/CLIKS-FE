import React, { useState } from 'react';
import {
    Plus,
    ShoppingCart,
    CalendarClock,
    Tag,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import '../../App.css';

const PlanExpense = () => {
    // These are planned/future expenses, distinct from actual tracked expenses
    const [plannedExpenses] = useState([
        { id: 1, item: 'New Laptop', category: 'Electronics', estimatedCost: 1200, plannedMonth: 'March 2026', priority: 'High' },
        { id: 2, item: 'Car Insurance Renewal', category: 'Insurance', estimatedCost: 850, plannedMonth: 'May 2026', priority: 'Critical' },
        { id: 3, item: 'Holiday Trip', category: 'Travel', estimatedCost: 2000, plannedMonth: 'August 2026', priority: 'Medium' },
        { id: 4, item: 'Home Repairs', category: 'Housing', estimatedCost: 500, plannedMonth: 'Feb 2026', priority: 'Low' },
    ]);

    const totalProjected = plannedExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Expense Planning</h1>
                    <p className="text-muted text-sm mt-1">Track and prepare for upcoming large expenses</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Plan New Expense</span>
                </button>
            </div>

            <div className="content-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Stats */}
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-muted mb-2">
                            <ShoppingCart size={20} />
                            <span className="font-medium">Total Planned (Attempts)</span>
                        </div>
                        <h2 className="text-4xl font-bold text-[var(--text-main)]">${totalProjected.toLocaleString()}</h2>
                        <p className="text-sm text-muted mt-2">Across {plannedExpenses.length} upcoming items</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <AlertCircle size={20} />
                            <span className="font-medium">Upcoming Critical</span>
                        </div>
                        <h2 className="text-3xl font-bold text-blue-900">$850</h2>
                        <p className="text-sm text-blue-700 mt-2">Car Insurance Renewal due in May</p>
                    </div>
                </div>

                <h3 className="section-title mb-4">Planned Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plannedExpenses.map((expense) => (
                        <div key={expense.id} className="bg-white p-5 rounded-xl border border-[var(--border-color)] hover:shadow-lg transition-all relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${expense.priority === 'Critical' ? 'bg-red-500' :
                                    expense.priority === 'High' ? 'bg-orange-500' :
                                        expense.priority === 'Medium' ? 'bg-blue-500' : 'bg-green-500'
                                }`}></div>

                            <div className="flex justify-between items-start mb-3 pl-3">
                                <h4 className="font-bold text-lg text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{expense.item}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${expense.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                        expense.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                            expense.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>{expense.priority}</span>
                            </div>

                            <div className="pl-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <Tag size={16} />
                                    <span>{expense.category}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <CalendarClock size={16} />
                                    <span>{expense.plannedMonth}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-between items-center pl-3">
                                <span className="font-bold text-xl text-[var(--text-main)]">${expense.estimatedCost.toLocaleString()}</span>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[var(--primary)] transition-colors">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <button className="border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center text-muted hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-h-[200px] bg-gray-50/50 hover:bg-blue-50/50">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium">Plan Item</span>
                    </button>
                </div>
            </div>

            <style>{`
                .section-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
                .text-blue-700 { color: #1D4ED8; }
                .text-blue-900 { color: #1E3A8A; }
                .bg-blue-50 { background-color: #EFF6FF; }
                .bg-blue-100 { background-color: #DBEAFE; }
            `}</style>
        </div>
    );
};

export default PlanExpense;
