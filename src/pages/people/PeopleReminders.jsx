import React, { useState } from 'react';
import { Plus, Bell, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import '../../App.css';

const PeopleReminders = () => {
    const [reminders] = useState([
        { id: 1, person: 'John Doe', amount: 500, dueDate: '2024-03-20', status: 'upcoming' },
        { id: 2, person: 'Mike Ross', amount: 1500, dueDate: '2024-03-10', status: 'overdue' },
    ]);

    return (
        <>
            <div className="dashboard-header">
                <h1 className="page-title">Payment Reminders</h1>
                <div className="header-actions">
                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Set Reminder</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1D4ED8', fontWeight: '600' }}>
                            <Calendar size={18} /> Due Today
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>0</div>
                    </div>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', borderLeft: '4px solid #EAB308' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: '600' }}>
                            <Clock size={18} /> Upcoming
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>1</div>
                    </div>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontWeight: '600' }}>
                            <AlertCircle size={18} /> Overdue
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>1</div>
                    </div>
                </div>

                <div className="stock-list-container" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="stock-list-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>
                        <div>Person</div>
                        <div>Amount Due</div>
                        <div>Due Date</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>
                    {reminders.map(rem => (
                        <div key={rem.id} className="stock-item-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                            <div style={{ fontWeight: '500' }}>{rem.person}</div>
                            <div style={{ fontWeight: '600' }}>₹{rem.amount}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{rem.dueDate}</div>
                            <div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    background: rem.status === 'overdue' ? '#FEE2E2' : '#FEF3C7',
                                    color: rem.status === 'overdue' ? '#991B1B' : '#92400E'
                                }}>
                                    {rem.status.charAt(0).toUpperCase() + rem.status.slice(1)}
                                </span>
                            </div>
                            <div>
                                <button className="icon-btn" title="Mark Settled" style={{ color: '#059669' }}>
                                    <CheckCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PeopleReminders;
