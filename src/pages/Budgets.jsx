import React, { useState } from 'react';
import {
    Wallet,
    Plus,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Edit2,
    Trash2,
    PieChart,
    ChevronRight,
    Search,
    ShoppingBag,
    Car,
    Zap,
    HeartPulse,
    Coffee
} from 'lucide-react';
import '../App.css';

const BudgetStat = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="budget-stat-card">
        <div className="flex justify-between items-start">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className={`stat-subtext ${subtext.includes('Over') ? 'text-red' : 'text-green'}`}>{subtext}</p>
    </div>
);

const Budgets = () => {
    const [budgets] = useState([
        { id: 1, category: 'Food & Dining', allocated: 800, spent: 650, color: 'orange', icon: ShoppingBag },
        { id: 2, category: 'Transportation', allocated: 300, spent: 280, color: 'blue', icon: Car },
        { id: 3, category: 'Entertainment', allocated: 200, spent: 220, color: 'purple', icon: Coffee },
        { id: 4, category: 'Utilities', allocated: 400, spent: 320, color: 'green', icon: Zap },
        { id: 5, category: 'Healthcare', allocated: 250, spent: 150, color: 'red', icon: HeartPulse },
    ]);

    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalAllocated - totalSpent;

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Budgets</h1>
                    <p className="text-muted text-sm mt-1">Plan and track your monthly spending limits</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Create Budget</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="budget-stats-grid">
                    <BudgetStat
                        label="Total Budget"
                        value={`$${totalAllocated.toLocaleString()}`}
                        subtext="Monthly Cap"
                        icon={Wallet}
                        colorClass="icon-blue"
                    />
                    <BudgetStat
                        label="Total Spent"
                        value={`$${totalSpent.toLocaleString()}`}
                        subtext={`${((totalSpent / totalAllocated) * 100).toFixed(1)}% utilizied`}
                        icon={TrendingUp}
                        colorClass="icon-orange"
                    />
                    <BudgetStat
                        label="Remaining"
                        value={`$${Math.abs(remaining).toLocaleString()}`}
                        subtext={remaining > 0 ? 'Safe margin' : 'Over budget'}
                        icon={remaining > 0 ? CheckCircle : AlertCircle}
                        colorClass={remaining > 0 ? "icon-green" : "icon-red"}
                    />
                </div>

                {/* Main Budget Grid */}
                <div className="budget-cards-container">
                    {budgets.map((budget) => {
                        const percentage = Math.min((budget.spent / budget.allocated) * 100, 100);
                        const isOver = budget.spent > budget.allocated;

                        return (
                            <div key={budget.id} className="budget-card">
                                <div className="budget-card-header">
                                    <div className="flex items-center gap-3">
                                        <div className={`category-icon bg-${budget.color}`}>
                                            <budget.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-main">{budget.category}</h3>
                                            <p className="text-xs text-muted">Monthly limit</p>
                                        </div>
                                    </div>
                                    <button className="icon-btn-ghost"><Edit2 size={16} /></button>
                                </div>

                                <div className="budget-values">
                                    <div>
                                        <span className="text-xl font-bold text-main">${budget.spent}</span>
                                        <span className="text-sm text-muted"> / ${budget.allocated}</span>
                                    </div>
                                    <div className={`text-percentage ${isOver ? 'text-red' : ''}`}>
                                        {Math.round((budget.spent / budget.allocated) * 100)}%
                                    </div>
                                </div>

                                <div className="progress-bar-bg">
                                    <div
                                        className={`progress-bar-fill bg-${budget.color} ${isOver ? 'bg-red' : ''}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>

                                <div className="budget-footer text-sm">
                                    {isOver ? (
                                        <span className="text-red flex items-center gap-1 font-medium">
                                            <AlertCircle size={14} /> Over by ${budget.spent - budget.allocated}
                                        </span>
                                    ) : (
                                        <span className="text-muted">
                                            ${budget.allocated - budget.spent} left
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .budget-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .budget-stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-subtext { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
                .text-green { color: #16A34A; }
                .text-red { color: #DC2626; }

                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-orange { background: #FFEDD5; color: #F97316; }
                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-red { background: #FEE2E2; color: #EF4444; }

                /* Budget Cards Grid */
                .budget-cards-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 1.5rem;
                }

                .budget-card {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.5rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .budget-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

                .budget-card-header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
                
                .category-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
                .bg-orange { background: #F97316; }
                .bg-blue { background: #3B82F6; }
                .bg-purple { background: #A855F7; }
                .bg-green { background: #22C55E; }
                .bg-red { background: #EF4444; }

                .icon-btn-ghost { color: var(--text-muted); padding: 0.5rem; border-radius: 6px; transition: background 0.2s; }
                .icon-btn-ghost:hover { background: #F1F5F9; color: var(--text-main); }

                .budget-values { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.75rem; }
                .text-percentage { font-weight: 700; color: var(--text-main); }
                
                .progress-bar-bg { width: 100%; height: 8px; background: #F1F5F9; border-radius: 99px; overflow: hidden; margin-bottom: 1rem; }
                .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease-out; }

                .budget-footer { display: flex; justify-content: flex-end; font-weight: 500; }
            `}</style>
        </div>
    );
};

export default Budgets;
