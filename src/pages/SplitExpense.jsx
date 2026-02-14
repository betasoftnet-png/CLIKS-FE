import React, { useState } from 'react';
import {
    Plus,
    Search,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownLeft,
    MonitorPlay,
    Music,
    MoreVertical
} from 'lucide-react';


const SplitExpense = () => {
    const [activeTab, setActiveTab] = useState('ALL FRIENDS');
    const [searchQuery, setSearchQuery] = useState('');

    const people = [
        { id: 1, name: 'Sarah Jenks', status: 'owes_you', amount: 240.00, avatar: 'SJ', avatarColor: '#D1FAE5', textColor: '#065F46' },
        { id: 2, name: 'Michael Chen', status: 'you_owe', amount: 85.25, avatar: 'MC', avatarColor: '#FFE4E6', textColor: '#9F1239' },
    ];

    const subscriptions = [
        { id: 1, name: 'Netflix Family', cost: 4.50, detail: 'Split with 4 friends', icon: MonitorPlay, color: '#DC2626' },
        { id: 2, name: 'Spotify Premium', cost: 3.33, detail: 'Split with 3 friends', icon: Music, color: '#10B981' },
    ];

    return (
        <div className="split-page">
            {/* Header */}
            <div className="split-header-row">
                <div>

                    <p className="page-subtitle">Manage your shared expenses and friend balances</p>
                </div>
                <button className="btn-new-split">
                    <Plus size={18} />
                    <span>New Split</span>
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="stats-row">
                {/* People Owe You */}
                <div className="stat-card">
                    <div className="stat-label-row text-green">
                        <ArrowDownLeft size={18} />
                        <span>PEOPLE OWE YOU</span>
                    </div>
                    <div className="stat-value">$1,240.50</div>
                    <div className="stat-trend text-green">
                        <TrendingUp size={16} />
                        <span>+12.5% this month</span>
                    </div>
                </div>

                {/* You Owe */}
                <div className="stat-card">
                    <div className="stat-label-row text-orange">
                        <ArrowUpRight size={18} />
                        <span>YOU OWE</span>
                    </div>
                    <div className="stat-value">$450.25</div>
                    <div className="stat-trend text-orange">
                        <TrendingDown size={16} />
                        <span>-5.2% this month</span>
                    </div>
                </div>

                {/* Ratio Card */}
                <div className="stat-card">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Owed vs Owing Ratio</span>
                        <span className="text-sm font-bold text-blue-600">73%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '73%' }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-3 font-medium tracking-wide uppercase">
                        $1,690.75 Total Volume
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="controls-row">
                <div className="tabs-group">
                    {['ALL FRIENDS', 'OWED TO YOU', 'YOU OWE'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Find a friend..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
                {/* Subscription Card */}
                <div className="subscription-card">
                    <div className="sub-header">
                        <div>
                            <h3 className="sub-title">Shared Subscriptions</h3>
                            <p className="sub-subtitle">MONTHLY RECURRING</p>
                        </div>
                        <div className="sub-icon-badge">
                            <MonitorPlay size={16} color="white" />
                        </div>
                    </div>

                    <div className="sub-list">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="sub-item">
                                <div className="sub-item-icon" style={{ backgroundColor: sub.color }}>
                                    {sub.name.charAt(0)}
                                </div>
                                <div className="sub-item-details">
                                    <div className="sub-name">{sub.name}</div>
                                    <div className="sub-detail">{sub.detail}</div>
                                </div>
                                <div className="sub-cost text-white font-bold">${sub.cost.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-manage-subs">
                        Manage Subscriptions
                    </button>
                </div>

                {/* Friend Cards */}
                {people.map(person => (
                    <div key={person.id} className="friend-card">
                        <div className="friend-header">
                            <div className="friend-avatar">
                                <img
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${person.name}`}
                                    alt={person.name}
                                />
                            </div>
                            <div className="friend-info">
                                <div className="friend-name">{person.name}</div>
                                <div className={`status-badge ${person.status}`}>
                                    {person.status.replace('_', ' ')}
                                </div>
                            </div>
                        </div>

                        <div className="friend-balance-area">
                            <span className="balance-label">Net Balance</span>
                            <div className={`balance-amount ${person.status === 'settled' ? 'text-slate-400' : (person.status === 'owes_you' ? 'text-green' : 'text-orange')}`}>
                                ${person.amount.toFixed(2)}
                            </div>
                        </div>

                        <div className="friend-actions">
                            {person.status === 'owes_you' && (
                                <button className="btn-action primary-light">Remind</button>
                            )}
                            {person.status === 'you_owe' && (
                                <button className="btn-action primary">Settle</button>
                            )}
                            {person.status === 'settled' && (
                                <button className="btn-action outline">View History</button>
                            )}
                            {person.status !== 'settled' && (
                                <button className="btn-action outline">Details</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                /* Colors */
                :root {
                    --primary: #195BAC;
                    --primary-hover: #154a8f;
                    --bg-color: #E9F4FF;
                    --text-dark: #0F172A;
                    --text-slate: #64748B;
                    --green: #10B981;
                    --orange: #F97316;
                    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                }

                .split-page {
                    background-color: var(--bg-color);
                    min-height: 100vh;
                    padding: 2rem 3rem;
                    font-family: 'Inter', sans-serif;
                }

                /* Header */
                .split-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .page-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-dark);
                    margin: 0;
                    letter-spacing: -0.03em;
                }

                .page-subtitle {
                    color: var(--text-slate);
                    font-size: 0.95rem;
                    margin-top: 0.25rem;
                }

                .btn-new-split {
                    background-color: var(--primary);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 99px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(25, 91, 172, 0.25);
                }
                .btn-new-split:hover {
                    background-color: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(25, 91, 172, 0.35);
                }

                /* Stats Row */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-height: 140px; /* Golden-ish ratio landscape */
                }

                .stat-label-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-dark);
                    margin-bottom: 0.5rem;
                }

                .stat-trend {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .text-green { color: var(--green); }
                .text-orange { color: var(--orange); }

                .progress-bar-bg {
                    width: 100%;
                    height: 8px;
                    background: #F1F5F9;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: 4px;
                }

                /* Controls */
                .controls-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    padding-bottom: 1rem;
                }

                .tabs-group {
                    display: flex;
                    gap: 2rem;
                }

                .tab-btn {
                    background: none;
                    border: none;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-slate);
                    cursor: pointer;
                    padding-bottom: 0.5rem;
                    position: relative;
                }
                .tab-btn.active {
                    color: var(--primary);
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1rem; /* Align with container border-bottom */
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: var(--primary);
                    border-radius: 3px 3px 0 0;
                }

                .search-wrapper {
                    background: white;
                    border-radius: 99px;
                    padding: 0.6rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border: 1px solid white;
                    transition: all 0.2s;
                    width: 300px;
                }
                .search-wrapper:focus-within {
                    border-color: #BFDBFE;
                    box-shadow: 0 0 0 3px rgba(191, 219, 254, 0.5);
                }
                .search-icon { color: #94A3B8; }
                .search-wrapper input {
                    border: none;
                    outline: none;
                    font-size: 0.9rem;
                    color: var(--text-dark);
                    width: 100%;
                }

                /* Grid */
                .main-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                    gap: 1.5rem;
                }

                /* Subscription Card */
                .subscription-card {
                    background: var(--primary);
                    border-radius: 1.5rem; /* Rounder corners */
                    padding: 1.5rem;
                    color: white;
                    box-shadow: 0 10px 25px -5px rgba(25, 91, 172, 0.4);
                    display: flex;
                    flex-direction: column;
                }

                .sub-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }
                .sub-title { font-size: 1.1rem; font-weight: 700; margin: 0; }
                .sub-subtitle { font-size: 0.7rem; opacity: 0.8; font-weight: 600; margin-top: 0.25rem; letter-spacing: 0.05em; }

                .sub-icon-badge {
                    width: 32px;
                    height: 32px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sub-list {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .sub-item {
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .sub-item-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    font-size: 0.85rem;
                }

                .sub-item-details { flex: 1; }
                .sub-name { font-size: 0.85rem; font-weight: 600; }
                .sub-detail { font-size: 0.7rem; opacity: 0.7; }

                .btn-manage-subs {
                    background: white;
                    color: var(--primary);
                    border: none;
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 99px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-manage-subs:hover { transform: translateY(-1px); }

                /* Friend Card */
                .friend-card {
                    background: white;
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    box-shadow: var(--card-shadow);
                    display: flex;
                    flex-direction: column;
                    align-items: center; /* Center content like image */
                    text-align: center;
                    transition: transform 0.2s;
                }
                .friend-card:hover { transform: translateY(-3px); }

                .friend-header {
                    margin-bottom: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }

                .friend-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #f1f5f9;
                }
                .friend-avatar img { width: 100%; height: 100%; object-fit: cover; }

                .friend-name { font-weight: 700; font-size: 1.1rem; color: var(--text-dark); margin-bottom: 0.25rem; }
                
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .status-badge.owes_you { background: #DCFCE7; color: #166534; }
                .status-badge.you_owe { background: #FFEDD5; color: #C2410C; }
                .status-badge.settled { background: #F1F5F9; color: #64748B; }

                .friend-balance-area {
                    margin-bottom: 1.5rem;
                }
                .balance-label { font-size: 0.8rem; color: var(--text-slate); }
                .balance-amount { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }

                .friend-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    width: 100%;
                    margin-top: auto;
                }

                .btn-action {
                    padding: 0.6rem;
                    font-size: 0.85rem;
                    border-radius: 99px;
                    font-weight: 600;
                    cursor: pointer;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .btn-action.primary {
                    background: var(--primary);
                    color: white;
                }
                .btn-action.primary-light {
                    background: #DBEAFE;
                    color: var(--primary);
                }
                .btn-action.primary-light:hover { background: #BFDBFE; }

                .btn-action.outline {
                    background: white;
                    border: 1px solid #E2E8F0;
                    color: var(--text-dark);
                }
                .btn-action.outline:hover { background: #F8FAFC; border-color: #CBD5E1; }

                @media (max-width: 1024px) {
                   .stats-row { grid-template-columns: 1fr; }
                   .main-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
                }
            `}</style>
        </div>
    );
};

export default SplitExpense;
