import React, { useState } from 'react';
import {
    Bell,
    Plus,
    Clock,
    CheckCircle2,
    Calendar,
    AlertTriangle,
    Mail,
    FileText
} from 'lucide-react';
import '../../App.css';

const PlanReminders = () => {
    const [reminders] = useState([
        { id: 1, title: 'Pay Electricity Bill', date: 'Feb 15, 2026', time: '10:00 AM', priority: 'High', type: 'Payment', status: 'Pending' },
        { id: 2, title: 'Review Mutual Funds', date: 'Feb 20, 2026', time: '02:00 PM', priority: 'Medium', type: 'Review', status: 'Pending' },
        { id: 3, title: 'File Tax Returns', date: 'Mar 15, 2026', time: '09:00 AM', priority: 'Critical', type: 'Tax', status: 'Pending' },
        { id: 4, title: 'Car Service Appointment', date: 'Jan 28, 2026', time: '11:00 AM', priority: 'Low', type: 'Personal', status: 'Completed' },
    ]);

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Never miss a payment or review</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Set Reminder</span>
                </button>
            </div>

            <div className="content-wrapper">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 hidden lg:block space-y-2">
                        <div className="bg-white p-4 rounded-xl border border-[var(--border-color)]">
                            <h3 className="font-semibold text-sm text-[var(--text-main)] mb-3 uppercase tracking-wider">Filters</h3>
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-[var(--primary)] font-medium text-sm flex items-center justify-between">
                                <span>All Reminders</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">4</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-[var(--text-muted)] font-medium text-sm flex items-center justify-between">
                                <span>Upcoming</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">3</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-[var(--text-muted)] font-medium text-sm flex items-center justify-between">
                                <span>Overdue</span>
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs">0</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-[var(--text-muted)] font-medium text-sm flex items-center justify-between">
                                <span>Completed</span>
                                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs">1</span>
                            </button>
                        </div>
                    </div>

                    {/* Reminders List */}
                    <div className="lg:col-span-3 space-y-4">
                        {reminders.map((reminder) => (
                            <div key={reminder.id} className={`bg-white p-5 rounded-xl border border-[var(--border-color)] hover:shadow-md transition-shadow flex items-start sm:items-center gap-4 group ${reminder.status === 'Completed' ? 'opacity-60' : ''}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${reminder.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                    reminder.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                        reminder.priority === 'Medium' ? 'bg-blue-100 text-blue-600' :
                                            'bg-green-100 text-green-600'
                                    }`}>
                                    <Bell size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className={`font-bold text-[var(--text-main)] text-lg ${reminder.status === 'Completed' ? 'line-through' : ''}`}>{reminder.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-sm text-muted">
                                                    <Calendar size={14} />
                                                    <span>{reminder.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-muted">
                                                    <Clock size={14} />
                                                    <span>{reminder.time}</span>
                                                </div>
                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-muted">{reminder.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                        <FileText size={18} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Done">
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                                <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${reminder.status === 'Completed'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : reminder.priority === 'Critical'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-white text-muted border-gray-200'
                                    }`}>
                                    {reminder.status === 'Completed' ? 'Done' : reminder.priority}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanReminders;
