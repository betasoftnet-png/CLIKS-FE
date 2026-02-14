import React, { useState } from 'react';

const MarketPulseTile = () => {
    const [period, setPeriod] = useState('1W');

    // Simple SVG path for the wave
    const pathData = "M 0 100 Q 30 80 60 40 T 120 40 T 180 120 T 240 20 T 300 60";
    // Scale it roughly to SVG viewbox
    // Let's use a fixed viewbox 0 0 600 200 for easier coordinates
    // Approximate curve from image: Start low, go high, dip, go high, dip deep, skyrocket.
    // Normalized points (0-100 x, 0-100 y inverted)
    // Start: 0, 80 (low)
    // P1: 20, 40
    // P2: 40, 60
    // P3: 60, 20
    // P4: 80, 90
    // End: 100, 30

    return (
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>MARKET PULSE</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>$42,069.00</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#10B981' }}>+12.5%</div>
                    </div>
                </div>
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '4px' }}>
                    {['1D', '1W', '1M'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{
                                border: 'none',
                                background: period === p ? '#1E3A8A' : 'transparent',
                                color: period === p ? 'white' : '#64748B',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
                <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid lines (optional) */}
                    {/* Path */}
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Filled Area */}
                    {/* Filled Area */}
                    <path
                        d="M0,160 C100,160 150,50 200,80 C250,110 300,180 350,180 C400,180 450,20 500,50 S 550,80 600,100 L600,200 L0,200 Z"
                        fill="url(#gradient)"
                    />
                    {/* Stroke Line */}
                    <path
                        d="M0,160 C100,160 150,50 200,80 C250,110 300,180 350,180 C400,180 450,20 500,50 S 550,80 600,100"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
                <span>SUN</span>
            </div>
        </div>
    );
};

export default MarketPulseTile;
