import React, { useState } from 'react';
import {
    Plus,
    Briefcase,
    TrendingUp,
    Calendar,
    MoreVertical,
    DollarSign,
    CheckCircle2
} from 'lucide-react';
import '../../App.css';

const PlanIncome = () => {
    const [incomeSources] = useState([
        { id: 1, name: 'Primary Salary', amount: 4200, frequency: 'Monthly', type: 'Employment', date: '1st of Month', status: 'Confident' },
        { id: 2, name: 'Freelance Design', amount: 800, frequency: 'Variable', type: 'Contract', date: 'Various', status: 'Estimated' },
        { id: 3, name: 'Stock Dividends', amount: 150, frequency: 'Quarterly', type: 'Investment', date: 'End of Quarter', status: 'Confident' },
    ]);

    const totalMonthlyExpected = 5000; // Simplified calculation for demo

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Forecast expected earnings</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Add Income Source</span>
                </button>
            </div>

            <div className="content-wrapper">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Expected Monthly</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">${totalMonthlyExpected.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Active Sources</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">{incomeSources.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Safety Score</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">High</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Projected Income Streams</h3>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-muted text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 pl-6">Source Name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Frequency</th>
                                <th className="p-4">Expected Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Amount</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {incomeSources.map((source) => (
                                <tr key={source.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-[var(--text-main)]">{source.name}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs text-muted font-medium">{source.type}</span></td>
                                    <td className="p-4 text-sm text-[var(--text-main)]">{source.frequency}</td>
                                    <td className="p-4 text-sm text-[var(--text-main)] flex items-center gap-2">
                                        <Calendar size={14} className="text-muted" />
                                        {source.date}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${source.status === 'Confident' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {source.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6 font-bold text-[var(--text-main)]">${source.amount.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <button className="text-gray-400 hover:text-[var(--text-main)]">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                /* Additional local styles if needed */
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
            `}</style>
        </div>
    );
};

export default PlanIncome;
