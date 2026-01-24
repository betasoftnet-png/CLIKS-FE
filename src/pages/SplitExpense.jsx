import React, { useState } from 'react';
import {
    Plus,
    Search,
    Users,
    Receipt,
    ArrowUpRight,
    ArrowDownLeft,
    ScanLine,
    MoreVertical,
    Wallet
} from 'lucide-react';
import '../App.css';

const SplitExpense = () => {
    // Mock Data
    const [friends] = useState([
        { id: 1, name: 'Alice', bg: '#E0F2FE', color: '#0284C7', initial: 'A' },
        { id: 2, name: 'Bob', bg: '#FCE7F3', color: '#DB2777', initial: 'B' },
        { id: 3, name: 'Charlie', bg: '#DCFCE7', color: '#16A34A', initial: 'C' },
        { id: 4, name: 'David', bg: '#FEF9C3', color: '#CA8A04', initial: 'D' },
        { id: 5, name: 'Trip Group', bg: '#F3F4F6', color: '#4B5563', initial: 'TG', isGroup: true },
    ]);

    const [activities] = useState([
        { id: 1, title: 'Dinner at Italian Place', date: 'Today, 8:30 PM', amount: 1200, type: 'lent', with: 'Alice' },
        { id: 2, title: 'Movie Tickets', date: 'Yesterday', amount: 300, type: 'borrowed', with: 'Bob' },
        { id: 3, title: 'Groceries', date: 'Oct 24', amount: 450, type: 'lent', with: 'Charlie' },
        { id: 4, title: 'Uber Ride', date: 'Oct 20', amount: 150, type: 'borrowed', with: 'David' },
    ]);

    return (
        <div className="split-page">
            {/* Header Section */}
            <div className="split-header">
                <div className="header-top">
                    <div>
                        <h1 className="header-title">Split Expense</h1>
                        <p className="header-subtitle">Simplify your shared spending</p>
                    </div>
                    <button className="icon-btn-ghost">
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Hero Balance Card */}
                <div className="balance-hero">
                    <div className="balance-info">
                        <span className="balance-label">Overall, you are owed</span>
                        <h2 className="balance-amount">₹1,350.00</h2>
                    </div>
                    <div className="balance-chart">
                        {/* Abstract Visual for Balance */}
                        <div className="pie-mini"></div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button className="action-pill">
                        <ScanLine size={18} />
                        <span>Scan Receipt</span>
                    </button>
                    <button className="action-pill">
                        <Users size={18} />
                        <span>Create Group</span>
                    </button>
                </div>
            </div>

            {/* Main Content Body */}
            <div className="split-body">

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Pay friends or groups" className="search-input" />
                    </div>
                </div>

                {/* People & Groups (Horizontal Scroll) */}
                <div className="section-label">Recents</div>
                <div className="people-scroll">
                    <div className="person-item add-new">
                        <div className="avatar-circle add">
                            <Plus size={24} />
                        </div>
                        <span className="person-name">New</span>
                    </div>
                    {friends.map(friend => (
                        <div key={friend.id} className="person-item">
                            <div
                                className="avatar-circle"
                                style={{ backgroundColor: friend.bg, color: friend.color }}
                            >
                                {friend.initial}
                            </div>
                            <span className="person-name">{friend.name}</span>
                        </div>
                    ))}
                </div>

                {/* Recent Activity List */}
                <div className="section-label mt-6">Recent Activity</div>
                <div className="activity-list">
                    {activities.map(item => (
                        <div key={item.id} className="activity-card">
                            <div className={`activity-icon-box ${item.type}`}>
                                {item.type === 'lent' ? <Receipt size={20} /> : <Wallet size={20} />}
                            </div>
                            <div className="activity-details">
                                <h4 className="activity-title">{item.title}</h4>
                                <p className="activity-meta">
                                    <span className="meta-with">{item.with}</span> • {item.date}
                                </p>
                            </div>
                            <div className="activity-amount-box">
                                <span className={`amount-text ${item.type}`}>
                                    {item.type === 'lent' ? '+' : '-'}₹{item.amount}
                                </span>
                                <span className="status-text">
                                    {item.type === 'lent' ? 'you lent' : 'you borrowed'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Action Button */}
                <button className="fab-main">
                    <Plus size={24} />
                    <span className="fab-text">Split Bill</span>
                </button>
            </div>

            <style>{`
                .split-page {
                    background-color: #F8FAFC; /* Consistent very light grey bg */
                    min-height: 100vh;
                    position: relative;
                    padding-bottom: 80px; /* Space for FAB */
                    font-family: 'Inter', sans-serif;
                }

                /* Header Styling */
                .split-header {
                    background: white;
                    padding: 24px;
                    border-bottom: 1px solid #F1F5F9;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                }

                .header-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1E293B;
                    margin: 0;
                }

                .header-subtitle {
                    color: #64748B;
                    font-size: 14px;
                    margin-top: 4px;
                }

                .icon-btn-ghost {
                    background: transparent;
                    border: none;
                    color: #64748B;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                }
                .icon-btn-ghost:hover {
                    background-color: #F1F5F9;
                }

                /* Hero Balance Card */
                .balance-hero {
                    background: linear-gradient(135deg, #195BAC 0%, #3B82F6 100%);
                    color: white;
                    padding: 24px;
                    border-radius: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    box-shadow: 0 10px 25px -5px rgba(25, 91, 172, 0.25);
                }

                .balance-label {
                    font-size: 13px;
                    opacity: 0.9;
                    font-weight: 500;
                    display: block;
                    margin-bottom: 8px;
                }

                .balance-amount {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .pie-mini {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: conic-gradient(rgba(255,255,255,0.2) 0% 70%, transparent 70% 100%);
                    border: 4px solid rgba(255,255,255,0.3);
                }

                /* Quick Actions */
                .quick-actions {
                    display: flex;
                    gap: 12px;
                }

                .action-pill {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: white;
                    border: 1px solid #E2E8F0;
                    padding: 10px;
                    border-radius: 99px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #334155;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .action-pill:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                }

                /* Body Content */
                .split-body {
                    padding: 24px;
                }

                /* Search */
                .search-section {
                    margin-bottom: 24px;
                }

                .search-bar {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .search-icon {
                    color: #94A3B8;
                    margin-right: 12px;
                }

                .search-input {
                    border: none;
                    background: transparent;
                    flex: 1;
                    font-size: 15px;
                    color: #1E293B;
                    outline: none;
                }

                .section-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 16px;
                }
                .mt-6 { margin-top: 24px; }

                /* People Scroll */
                .people-scroll {
                    display: flex;
                    gap: 20px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: none; /* Hide scrollbar Firefox */
                }
                .people-scroll::-webkit-scrollbar {
                    display: none; /* Hide scrollbar Chrome */
                }

                .person-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    min-width: 64px;
                }

                .avatar-circle {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: 600;
                    transition: transform 0.2s;
                    border: 2px solid transparent;
                }

                .person-item:hover .avatar-circle {
                    transform: scale(1.05);
                }

                .avatar-circle.add {
                    background: white;
                    border: 2px dashed #CBD5E1;
                    color: #64748B;
                }

                .person-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: #475569;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }

                /* Activity List */
                .activity-list {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #F1F5F9;
                    overflow: hidden;
                }

                .activity-card {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid #F1F5F9;
                    transition: background 0.2s;
                    cursor: pointer;
                }

                .activity-card:last-child {
                    border-bottom: none;
                }

                .activity-card:hover {
                    background: #F8FAFC;
                }

                .activity-icon-box {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                }
                .activity-icon-box.lent { background: #DCFCE7; color: #15803D; }
                .activity-icon-box.borrowed { background: #FEE2E2; color: #B91C1C; }

                .activity-details {
                    flex: 1;
                }

                .activity-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #1E293B;
                    margin: 0 0 4px 0;
                }

                .activity-meta {
                    font-size: 12px;
                    color: #64748B;
                    margin: 0;
                }
                .meta-with { font-weight: 500; color: #334155; }

                .activity-amount-box {
                    text-align: right;
                }

                .amount-text {
                    font-size: 15px;
                    font-weight: 700;
                    display: block;
                    margin-bottom: 2px;
                }
                .amount-text.lent { color: #15803D; }
                .amount-text.borrowed { color: #B91C1C; }

                .status-text {
                    font-size: 11px;
                    color: #94A3B8;
                    font-weight: 500;
                }

                /* FAB */
                .fab-main {
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    background: #195BAC;
                    color: white;
                    border: none;
                    height: 56px;
                    padding: 0 24px;
                    border-radius: 28px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(25, 91, 172, 0.4);
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    z-index: 100;
                }

                .fab-main:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(25, 91, 172, 0.5);
                }
            `}</style>
        </div>
    );
};

export default SplitExpense;
