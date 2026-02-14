import React, { useState } from 'react';
import {
    Target,
    Plus,
    Trophy,
    Calendar,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import '../../App.css';

const PlanGoals = () => {
    const [goals] = useState([
        { id: 1, name: 'Emergency Fund', target: 10000, current: 6500, deadline: 'Dec 2026', icon: Trophy, color: 'yellow' },
        { id: 2, name: 'New Car', target: 25000, current: 8000, deadline: 'Aug 2027', icon: Target, color: 'blue' },
        { id: 3, name: 'Home Downpayment', target: 50000, current: 15000, deadline: 'Jan 2029', icon: HomeIcon, color: 'purple' },
    ]);

    // Simple mock icon component
    function HomeIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        );
    }

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Plan and track your long-term objectives</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Create New Goal</span>
                </button>
            </div>

            <div className="content-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = (goal.current / goal.target) * 100;
                        return (
                            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <button className="text-gray-300 hover:text-[var(--text-main)]"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-${goal.color}-50 text-${goal.color}-600`}>
                                    <goal.icon size={28} />
                                </div>

                                <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">{goal.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted mb-6">
                                    <Calendar size={14} />
                                    <span>Target: {goal.deadline}</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-3xl font-bold text-[var(--text-main)]">${goal.current.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-muted mb-1">of ${goal.target.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out bg-${goal.color}-500`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium mt-1">
                                        <span className={`text-${goal.color}-600`}>{progress.toFixed(0)}% Completed</span>
                                        <span className="text-muted">${(goal.target - goal.current).toLocaleString()} left</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-main)] font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <TrendingUp size={16} />
                                    Add Funds
                                </button>
                            </div>
                        );
                    })}

                    {/* Add New Goal Card */}
                    <button className="border-2 border-dashed border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center gap-4 text-muted hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors min-h-[300px] bg-gray-50/50 hover:bg-blue-50/50 group">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                        </div>
                        <div className="text-center">
                            <span className="font-bold text-lg block">Start a New Goal</span>
                            <span className="text-sm opacity-70">Save for a vacation, gadget, or future</span>
                        </div>
                    </button>
                </div>
            </div>

            <style>{`
                .bg-yellow-50 { background-color: #FEFCE8; } .text-yellow-600 { color: #CA8A04; } .bg-yellow-500 { background-color: #EAB308; }
                .bg-blue-50 { background-color: #EFF6FF; } .text-blue-600 { color: #2563EB; } .bg-blue-500 { background-color: #3B82F6; }
                .bg-purple-50 { background-color: #FAF5FF; } .text-purple-600 { color: #9333EA; } .bg-purple-500 { background-color: #A855F7; }
            `}</style>
        </div>
    );
};

export default PlanGoals;
