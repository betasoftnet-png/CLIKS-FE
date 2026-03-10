import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/common/EmptyState';
import {
    PiggyBank,
    Plus,
    Target,
    TrendingUp,
    Calendar,
    DollarSign,
    Edit2,
    Trash2,
    Plane,
    Home,
    Car,
    Shield
} from 'lucide-react';
import '../App.css';

const SavingsStat = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="savings-stat-card">
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

const Segregation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', target: '', current: '', deadline: '', priority: 'Medium' });
    const [formError, setFormError] = useState('');

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
            deadline: formData.deadline,
            color: 'blue',
            priority: formData.priority
        };

        setSavingsGoals(prev => {
            const updated = [newGoal, ...prev];
            localStorage.setItem('books_goals', JSON.stringify(updated));
            return updated;
        });
        setIsModalOpen(false);
        setFormData({ name: '', target: '', current: '', deadline: '', priority: 'Medium' });
        setFormError('');
    };

    const [savingsGoals, setSavingsGoals] = useState(() => {
        const saved = localStorage.getItem('books_goals');
        return saved ? JSON.parse(saved) : [];
    });

    const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.current, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Track and segregate your financial goals</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    <span>New Goal</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats */}
                <div className="savings-stats-grid">
                    <SavingsStat
                        label="Total Segregated"
                        value={`$${totalSaved.toLocaleString()}`}
                        subtext="+12% vs last month"
                        icon={PiggyBank}
                        colorClass="icon-green"
                    />
                    <SavingsStat
                        label="Total Target"
                        value={`$${totalTarget.toLocaleString()}`}
                        subtext={`${savingsGoals.length} active buckets`}
                        icon={Target}
                        colorClass="icon-blue"
                    />
                    <SavingsStat
                        label="Overall Progress"
                        value={`${overallProgress.toFixed(1)}%`}
                        subtext="On track to completion"
                        icon={TrendingUp}
                        colorClass="icon-purple"
                    />
                </div>

                {/* Goals Grid */}
                {savingsGoals.length === 0 ? (
                    <EmptyState 
                        title="No Goals Found" 
                        description="Click 'New Goal' to start tracking your financial targets."
                    />
                ) : (
                    <div className="goals-grid">
                        {savingsGoals.map((goal) => {
                            const progress = (goal.current / goal.target) * 100;
                            return (
                                <div key={goal.id} className="goal-card">
                                    <div className="goal-header">
                                        <div className={`goal-icon-box bg-${goal.color}`}>
                                            <Target size={24} />
                                        </div>
                                    <span className={`priority-badge priority-${goal.priority}`}>
                                        {goal.priority} Priority
                                    </span>
                                </div>

                                <div className="goal-body">
                                    <h3 className="goal-title">{goal.name}</h3>
                                    <div className="goal-dates">
                                        <Calendar size={14} />
                                        Target: {new Date(goal.deadline).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="goal-footer">
                                    <div className="progress-info">
                                        <span className="current-amt">${goal.current.toLocaleString()}</span>
                                        <span className="target-amt">of ${goal.target.toLocaleString()}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className={`progress-bar-fill bg-${goal.color}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="pct-text">{progress.toFixed(0)}%</div>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="modal-content"
                        >
                            <h2 className="modal-title">Add New Goal</h2>
                            <form onSubmit={handleAddGoal} className="modal-form">
                                <div className="form-group">
                                    <label>Goal Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="form-input"
                                        placeholder="e.g. New Laptop"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Amount</label>
                                    <input 
                                        type="number" 
                                        value={formData.target} 
                                        onChange={e => setFormData({...formData, target: e.target.value})}
                                        className="form-input"
                                        placeholder="5000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Saved Amount</label>
                                    <input 
                                        type="number" 
                                        value={formData.current} 
                                        onChange={e => setFormData({...formData, current: e.target.value})}
                                        className="form-input"
                                        placeholder="2000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.deadline} 
                                        onChange={e => setFormData({...formData, deadline: e.target.value})}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                        className="form-input"
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                
                                {formError && <p className="form-error">{formError}</p>}
                                
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Add Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 1rem 0;
                    color: var(--text-main);
                }
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-muted);
                }
                .form-input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-size: 0.875rem;
                    outline: none;
                }
                .form-input:focus {
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
                }
                .form-error {
                    color: #EF4444;
                    font-size: 0.875rem;
                    margin: 0;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 1rem;
                }


                .savings-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .savings-stat-card {
                    background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-subtext { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
                
                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-purple { background: #F3E8FF; color: #9333EA; }

                /* Goals Grid */
                .goals-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .goal-card {
                    background: white; border-radius: 16px; border: 1px solid var(--border-color);
                    padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s;
                    display: flex; flex-direction: column; gap: 1rem;
                }
                .goal-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

                .goal-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .goal-icon-box { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
                
                .priority-badge { font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 99px; border: 1px solid; font-weight: 500; }
                .priority-High { background: #FEE2E2; color: #DC2626; border-color: #FECACA; }
                .priority-Medium { background: #FEF3C7; color: #D97706; border-color: #FDE68A; }
                .priority-Low { background: #F1F5F9; color: #64748B; border-color: #E2E8F0; }

                .bg-blue { background: #3B82F6; }
                .bg-purple { background: #A855F7; }
                .bg-green { background: #22C55E; }
                .bg-orange { background: #F97316; }

                .goal-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem; }
                .goal-dates { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }

                /* Progress Section */
                .progress-info { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 0.5rem; }
                .current-amt { font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
                .target-amt { font-size: 0.9rem; color: var(--text-muted); }

                .progress-bar-bg { width: 100%; height: 8px; background: #F1F5F9; border-radius: 99px; overflow: hidden; margin-bottom: 0.5rem; }
                .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease-out; }
                
                .pct-text { text-align: right; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
            `}</style>
        </div>
    );
};

export default Segregation;
