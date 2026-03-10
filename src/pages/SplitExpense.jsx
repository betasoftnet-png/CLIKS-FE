import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/common/EmptyState';
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', amount: '', paidBy: 'You', splitWith: '', date: '' });
    const [formError, setFormError] = useState('');

    const [people, setPeople] = useState(() => {
        const saved = localStorage.getItem('books_splits');
        return saved ? JSON.parse(saved) : [];
    });

    const handleAddSplit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || !formData.paidBy || !formData.splitWith || !formData.date) {
            setFormError('All fields are required');
            return;
        }

        const totalAmount = parseFloat(formData.amount);
        const splitNames = formData.splitWith.split(',').map(n => n.trim()).filter(Boolean);
        if (splitNames.length === 0) {
            setFormError('Include at least one friend');
            return;
        }

        const splitAmount = totalAmount / (splitNames.length + (formData.paidBy === 'You' ? 1 : 0)); // Assuming equal split
        
        // Add or update people
        const newPeople = [...people];
        splitNames.forEach(name => {
            const existingIdx = newPeople.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
            if (existingIdx >= 0) {
                // Simplified update logic
                let currentPerson = {...newPeople[existingIdx]};
                let owesYouAmt = currentPerson.status === 'owes_you' ? currentPerson.amount : -currentPerson.amount;
                
                if (formData.paidBy === 'You') {
                    owesYouAmt += splitAmount;
                } else {
                    owesYouAmt -= splitAmount;
                }
                
                if (owesYouAmt > 0) {
                    currentPerson.status = 'owes_you';
                    currentPerson.amount = owesYouAmt;
                } else if (owesYouAmt < 0) {
                    currentPerson.status = 'you_owe';
                    currentPerson.amount = Math.abs(owesYouAmt);
                } else {
                    currentPerson.status = 'settled';
                    currentPerson.amount = 0;
                }
                newPeople[existingIdx] = currentPerson;
            } else {
                // New person
                const isOwedToYou = formData.paidBy === 'You';
                newPeople.push({
                    id: Date.now() + Math.random(),
                    name: name,
                    status: isOwedToYou ? 'owes_you' : 'you_owe',
                    amount: splitAmount,
                    avatar: name.substring(0, 2).toUpperCase(),
                    avatarColor: isOwedToYou ? '#D1FAE5' : '#FFE4E6',
                    textColor: isOwedToYou ? '#065F46' : '#9F1239'
                });
            }
        });

        setPeople(newPeople);
        localStorage.setItem('books_splits', JSON.stringify(newPeople));
        setIsModalOpen(false);
        setFormData({ title: '', amount: '', paidBy: 'You', splitWith: '', date: '' });
        setFormError('');
    };

    const totalOwesYou = people.filter(p => p.status === 'owes_you').reduce((sum, p) => sum + p.amount, 0);
    const totalYouOwe = people.filter(p => p.status === 'you_owe').reduce((sum, p) => sum + p.amount, 0);
    const totalVolume = totalOwesYou + totalYouOwe;
    const ratio = totalVolume > 0 ? (totalOwesYou / totalVolume) * 100 : 0;

    return (
        <div className="split-page">
            {/* Header */}
            <div className="split-header-row">
                <div>

                    <p className="page-subtitle">Manage your shared expenses and friend balances</p>
                </div>
                <button className="btn-new-split" onClick={() => setIsModalOpen(true)}>
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
                    <div className="stat-value">${totalOwesYou.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
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
                    <div className="stat-value">${totalYouOwe.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="stat-trend text-orange">
                        <TrendingDown size={16} />
                        <span>-5.2% this month</span>
                    </div>
                </div>

                {/* Ratio Card */}
                <div className="stat-card">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Owed vs Owing Ratio</span>
                        <span className="text-sm font-bold text-blue-600">{ratio.toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${ratio}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-3 font-medium tracking-wide uppercase">
                        ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })} Total Volume
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
            {people.length === 0 ? (
                <EmptyState 
                    title="No Split Expenses" 
                    description="It looks like you haven't added any shared expenses yet. Click 'New Split' to manage balances with friends."
                />
            ) : (
            <div className="main-grid">
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
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="modal-content"
                        >
                            <h2 className="modal-title">Add New Split</h2>
                            <form onSubmit={handleAddSplit} className="modal-form">
                                <div className="form-group">
                                    <label>Expense Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="form-input"
                                        placeholder="e.g. Dinner"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Amount ($)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={formData.amount} 
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="form-input"
                                        placeholder="120.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Paid By</label>
                                    <select 
                                        value={formData.paidBy} 
                                        onChange={e => setFormData({...formData, paidBy: e.target.value})}
                                        className="form-input"
                                    >
                                        <option value="You">You</option>
                                        <option value="Friend">Someone else</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Split With (comma separated names)</label>
                                    <input 
                                        type="text" 
                                        value={formData.splitWith} 
                                        onChange={e => setFormData({...formData, splitWith: e.target.value})}
                                        className="form-input"
                                        placeholder="Sarah, Alex"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.date} 
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="form-input"
                                    />
                                </div>
                                
                                {formError && <p className="form-error">{formError}</p>}
                                
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" style={{ background: '#195BAC', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                                        Add Split
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 1rem 0;
                    color: var(--text-dark);
                }
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-slate);
                }
                .form-input {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #E2E8F0;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    outline: none;
                }
                .form-input:focus {
                    border-color: #195BAC;
                    box-shadow: 0 0 0 2px rgba(25, 91, 172, 0.1);
                }
                .form-error {
                    color: #EF4444;
                    font-size: 0.875rem;
                    margin: 0;
                }
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 1rem;
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
