import React, { useState } from 'react';
import {
    CreditCard,
    Plus,
    Building2,
    Wallet,
    TrendingUp,
    TrendingDown,
    Eye,
    EyeOff,
    MoreVertical,
    Globe,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import '../App.css';

const AccountStat = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="account-stat-card">
        <div className="flex justify-between items-start">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="stat-subtext">{subtext}</p>
    </div>
);

const Accounts = () => {
    const [showBalances, setShowBalances] = useState(true);
    const [accounts] = useState([
        {
            id: 1,
            name: 'Main Checking',
            type: 'Checking',
            bank: 'Chase Bank',
            balance: 12450.50,
            accountNumber: '**** 4521',
            theme: 'dark-blue',
            network: 'Visa'
        },
        {
            id: 2,
            name: 'Savings Select',
            type: 'Savings',
            bank: 'Bank of America',
            balance: 28900.00,
            accountNumber: '**** 7832',
            theme: 'emerald',
            network: 'Mastercard'
        },
        {
            id: 3,
            name: 'Platinum Credit',
            type: 'Credit',
            bank: 'American Express',
            balance: -2340.75,
            accountNumber: '**** 9012',
            theme: 'purple',
            network: 'Amex'
        },
        {
            id: 4,
            name: 'Growth Folio',
            type: 'Investment',
            bank: 'Fidelity',
            balance: 45200.00,
            accountNumber: '**** 3456',
            theme: 'orange',
            network: 'Invest'
        },
    ]);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalAssets = accounts.filter(acc => acc.balance > 0).reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = Math.abs(accounts.filter(acc => acc.balance < 0).reduce((sum, acc) => sum + acc.balance, 0));

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>

                    <p className="text-muted text-sm mt-1">Manage your banking & investment portfolios</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowBalances(!showBalances)}
                        className="btn-secondary"
                    >
                        {showBalances ? <EyeOff size={18} /> : <Eye size={18} />}
                        <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} />
                        <span>Link Account</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="account-stats-grid">
                    <AccountStat
                        label="Net Worth"
                        value={showBalances ? `$${totalBalance.toLocaleString()}` : '••••••••'}
                        subtext="Total cumulative value"
                        icon={Wallet}
                        colorClass="icon-blue"
                    />
                    <AccountStat
                        label="Total Assets"
                        value={showBalances ? `$${totalAssets.toLocaleString()}` : '••••••••'}
                        subtext="Liquid & fixed assets"
                        icon={TrendingUp}
                        colorClass="icon-green"
                    />
                    <AccountStat
                        label="Liabilities"
                        value={showBalances ? `$${totalLiabilities.toLocaleString()}` : '••••••••'}
                        subtext="Outstanding debt"
                        icon={TrendingDown}
                        colorClass="icon-red"
                    />
                </div>

                {/* Cards Grid */}
                <div className="cards-grid">
                    {accounts.map((account) => (
                        <div key={account.id} className={`bank-card theme-${account.theme}`}>
                            <div className="card-top">
                                <div className="card-chip"></div>
                                <div className="card-contactless"><ShieldCheck size={18} /></div>
                            </div>

                            <div className="card-balance-section">
                                <span className="card-label">Current Balance</span>
                                <h3 className="card-balance">
                                    {showBalances ? `$${Math.abs(account.balance).toLocaleString()}` : '•••• •••• ••••'}
                                </h3>
                            </div>

                            <div className="card-details">
                                <div className="card-info">
                                    <div className="card-holder">{account.name}</div>
                                    <div className="card-number">{account.accountNumber}</div>
                                </div>
                                <div className="card-brand">{account.bank}</div>
                            </div>

                            <div className="card-actions-overlay">
                                <button className="overlay-btn"><Smartphone size={16} /> Pay</button>
                                <button className="overlay-btn"><Globe size={16} /> Details</button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Placemat */}
                    <div className="add-card-placeholder">
                        <div className="placeholder-content">
                            <div className="plus-circle"><Plus size={24} /></div>
                            <span className="font-medium">Add New Account</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .btn-secondary {
                    background: white; border: 1px solid var(--border-color); color: var(--text-muted);
                    padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; font-size: 0.875rem;
                }
                .btn-secondary:hover { background: #F8FAFC; color: var(--text-main); }

                .account-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .account-stat-card {
                    background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-subtext { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
                
                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-red { background: #FEE2E2; color: #EF4444; }

                /* Cards Grid */
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2rem;
                }

                .bank-card {
                    height: 220px;
                    border-radius: 20px;
                    padding: 1.5rem;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);
                    transition: transform 0.3s;
                    overflow: hidden;
                    cursor: pointer;
                }

                .bank-card:hover { transform: translateY(-5px); }
                .bank-card:hover .card-actions-overlay { opacity: 1; }

                /* Themes */
                .theme-dark-blue { background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); }
                .theme-emerald { background: linear-gradient(135deg, #065F46 0%, #10B981 100%); }
                .theme-purple { background: linear-gradient(135deg, #581C87 0%, #8B5CF6 100%); }
                .theme-orange { background: linear-gradient(135deg, #9A3412 0%, #F97316 100%); }

                .card-top { display: flex; justify-content: space-between; align-items: center; }
                .card-chip { width: 40px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); }
                .card-contactless { opacity: 0.8; }

                .card-balance-section { margin-top: 1rem; }
                .card-label { font-size: 0.75rem; opacity: 0.8; letter-spacing: 0.05em; text-transform: uppercase; }
                .card-balance { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }

                .card-details { display: flex; justify-content: space-between; align-items: flex-end; }
                .card-holder { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
                .card-number { font-family: monospace; font-size: 1rem; opacity: 0.9; }
                .card-brand { font-size: 1rem; font-weight: 700; font-style: italic; opacity: 0.9; }

                /* Overlay */
                .card-actions-overlay {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; gap: 1rem;
                    opacity: 0; transition: opacity 0.2s;
                }

                .overlay-btn {
                    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
                    padding: 0.5rem 1rem; border-radius: 8px; color: white; display: flex; align-items: center; gap: 0.5rem;
                    font-weight: 500; font-size: 0.9rem; transition: background 0.2s;
                }
                .overlay-btn:hover { background: white; color: var(--text-main); }

                /* Add Card */
                .add-card-placeholder {
                    height: 220px;
                    border: 2px dashed var(--border-color);
                    border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    background: #F8FAFC;
                    transition: all 0.2s;
                    color: var(--text-muted);
                }
                .add-card-placeholder:hover { border-color: var(--primary); color: var(--primary); background: #EFF6FF; }
                .placeholder-content { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
                .plus-circle { width: 48px; height: 48px; border-radius: 50%; background: white; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
            `}</style>
        </div>
    );
};

export default Accounts;
