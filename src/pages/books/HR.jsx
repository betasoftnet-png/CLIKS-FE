import React from 'react';
import { Users, UserCheck, Clock, Banknote } from 'lucide-react';

const HR = () => {
    return (
        <div className="content-wrapper">
            <div style={{ padding: '1.812rem 0 0.906rem 0' }}>
                <h1 style={{ fontSize: '1.586rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>HR</h1>
                <p style={{ color: '#64748B', marginTop: '0.363rem', fontSize: '0.861rem' }}>
                    Manage employees, attendance, payroll, and HR operations.
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.133rem', marginTop: '1.359rem' }}>
                {[
                    { icon: <Users size={24} />, label: 'Total Employees', color: '#ECFDF5', iconColor: '#10B981', count: '0' },
                    { icon: <UserCheck size={24} />, label: 'Present Today', color: '#EFF6FF', iconColor: '#3B82F6', count: '0' },
                    { icon: <Clock size={24} />, label: 'Attendance %', color: '#FEF3C7', iconColor: '#F59E0B', count: '0%' },
                    { icon: <Banknote size={24} />, label: 'Payroll', color: '#F0FDFA', iconColor: '#14B8A6', count: '₹0' },
                ].map((item) => (
                    <div key={item.label} style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '1.359rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.68rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.color, color: item.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                            <div style={{ fontSize: '1.586rem', fontWeight: '800', color: '#1E293B', marginTop: '0.181rem' }}>{item.count}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '1.812rem', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2.719rem', textAlign: 'center', color: '#94A3B8' }}>
                <Users size={40} style={{ opacity: 0.3, marginBottom: '0.906rem' }} />
                <p style={{ fontSize: '0.906rem', fontWeight: '600', color: '#64748B' }}>No employees added yet</p>
                <p style={{ fontSize: '0.793rem', marginTop: '0.363rem' }}>Add your first employee to start managing HR.</p>
            </div>
        </div>
    );
};

export default HR;
