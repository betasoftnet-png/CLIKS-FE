import React from 'react';
import { FileText, Receipt, Smartphone, FileCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bills = () => {
    const navigate = useNavigate();
    const features = [
        { label: "Bills", icon: Receipt, path: "", description: "Electricity, Water, Broadband utilites" },
        { label: "Recharge", icon: Smartphone, path: "", description: "Mobile and DTH recharges" },
        { label: "Pay Tax", icon: FileCheck, path: "", description: "Income tax and property tax" },
        { label: "Fines & Challans", icon: AlertCircle, path: "", description: "Traffic and other penalties" }
    ];

    return (
        <div className="page-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Track and pay your obligations</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <FileText size={24} />
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
                                e.currentTarget.style.borderColor = '#F59E0B';
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
                                background: '#FEF3C7',
                                color: '#F59E0B',
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

export default Bills;
