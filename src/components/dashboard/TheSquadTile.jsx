import React from 'react';
import { Plus, Send } from 'lucide-react';

const TheSquadTile = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #195BAC', padding: '2px' }}>
                        <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>Sarah</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #E2E8F0', padding: '2px' }}>
                        <img src="https://i.pravatar.cc/150?u=ben" alt="Ben" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>Ben</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #E2E8F0', padding: '2px' }}>
                        <img src="https://i.pravatar.cc/150?u=chloe" alt="Chloe" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>Chloe</span>
                </div>

                <button style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '2px dashed #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#195BAC'; e.currentTarget.style.color = '#195BAC'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#94A3B8'; }}
                >
                    <Plus size={24} />
                </button>
            </div>

            <button style={{
                width: '100%',
                padding: '0.85rem',
                background: '#195BAC',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(25, 91, 172, 0.3)',
                marginTop: 'auto'
            }}>
                <Send size={18} />
                QUICK SEND
            </button>
        </div>
    );
};

export default TheSquadTile;
