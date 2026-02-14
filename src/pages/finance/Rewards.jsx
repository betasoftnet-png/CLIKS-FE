import React from 'react';
import { Gift, Tag, UserPlus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rewards = () => {
    const navigate = useNavigate();
    const features = [
        { label: "Rewards", icon: Tag, path: "", description: "Points redemption and history" },
        { label: "Offers", icon: Gift, path: "", description: "Exclusive deals for you" },
        { label: "Refer & Earn", icon: UserPlus, path: "", description: "Invite friends and earn bonuses" },
        { label: "Donation", icon: Heart, path: "", description: "Contribute to causes" }
    ];

    return (
        <div className="page-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Smarter spending and giving</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                    <Gift size={24} />
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
                                e.currentTarget.style.borderColor = '#6366F1';
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
                                background: '#E0E7FF',
                                color: '#6366F1',
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

export default Rewards;
