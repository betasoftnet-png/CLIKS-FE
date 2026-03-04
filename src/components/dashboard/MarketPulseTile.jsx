import React, { useState } from 'react';

const MarketPulseTile = () => {
    const [period, setPeriod] = useState('1W');

    const data = {
        '1D': {
            path: "M0,150 C100,140 150,80 200,100 C250,120 300,60 350,80 C400,100 450,120 500,80 S 550,60 600,90",
            labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
            value: '$42,500.00',
            change: '+2.1%'
        },
        '1W': {
            path: "M0,160 C100,160 150,50 200,80 C250,110 300,180 350,180 C400,180 450,20 500,50 S 550,80 600,100",
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            value: '$42,069.00',
            change: '+12.5%'
        },
        '1M': {
            path: "M0,120 C80,140 160,60 240,100 C320,130 400,40 480,80 S 560,20 600,60",
            labels: ['W1', 'W2', 'W3', 'W4'],
            value: '$45,120.00',
            change: '+8.4%'
        }
    };

    const currentData = data[period];

    return (
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>MARKET PULSE</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{currentData.value}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#10B981' }}>{currentData.change}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '4px' }}>
                    {['1D', '1W', '1M'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{
                                border: 'none',
                                background: period === p ? '#195BAC' : 'transparent',
                                color: period === p ? 'white' : '#64748B',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
                <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id={`gradient-${period}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#195BAC" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#195BAC" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`${currentData.path} L600,200 L0,200 Z`}
                        fill={`url(#gradient-${period})`}
                        style={{ transition: 'd 0.5s ease' }}
                    />
                    <path
                        d={currentData.path}
                        fill="none"
                        stroke="#195BAC"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ transition: 'd 0.5s ease' }}
                    />
                </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
                {currentData.labels.map((label, index) => (
                    <span key={index}>{label}</span>
                ))}
            </div>
        </div>
    );
};

export default MarketPulseTile;
