import React from 'react';
import { Plane, Footprints, Plus } from 'lucide-react'; // Using icons for visual match

const GoalItem = ({ title, sub, current, total, percent, color, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                />
                <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray={`${percent}, 100`}
                />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.65rem', fontWeight: 700, color: color }}>
                {percent}%
            </div>
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {title} <Icon size={14} className="text-muted-foreground" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                <span style={{ fontWeight: 600 }}>${current}</span> of ${total}
            </div>
        </div>
    </div>
);

const MoneyGoalsTile = () => {
    return (
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Money Goals
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#195BAC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '8px', height: '8px', background: 'white', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <GoalItem
                    title="Euro Summer '25"
                    current="3,750"
                    total="5,000"
                    percent={75}
                    color="#195BAC"
                    icon={Plane}
                />
                <GoalItem
                    title="New Sneaker Fund"
                    current="150"
                    total="500"
                    percent={30}
                    color="#93C5FD"
                    icon={Footprints}
                />
            </div>

            <button style={{
                marginTop: 'auto',
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed #CBD5E1',
                borderRadius: '99px',
                background: 'transparent',
                color: '#195BAC',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#195BAC'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = 'transparent'; }}
            >
                <Plus size={16} /> Add New Goal
            </button>
        </div>
    );
};

export default MoneyGoalsTile;
