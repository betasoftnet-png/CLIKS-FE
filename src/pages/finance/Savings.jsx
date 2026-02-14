import React from 'react';
import { PiggyBank, TrendingUp, Banknote, Shield, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinanceSavings = () => {
    const navigate = useNavigate();
    const features = [
        { label: "Saving", icon: TrendingUp, path: "", description: "Fixed deposits and recurring savings" },
        { label: "Loan", icon: Banknote, path: "", description: "Personal and home loans tracking" },
        { label: "Insurance", icon: Shield, path: "", description: "Life, failure and health policies" },
        { label: "CIBIL", icon: BarChart3, path: "", description: "Check credit score and report" }
    ];

    return (
        <div className="page-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Grow wealth and manage credit</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <PiggyBank size={24} />
                </div>
            </div>

            <div className="content-wrapper">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="dashboard-tile"
                            onClick={() => item.path && navigate(item.path)}
                            style={{
                                cursor: 'pointer',
                                padding: '1.5rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = '#10B981';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: '#D1FAE5',
                                color: '#10B981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <item.icon size={28} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{item.label}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
            `}</style>
        </div>
    );
};

export default FinanceSavings;
