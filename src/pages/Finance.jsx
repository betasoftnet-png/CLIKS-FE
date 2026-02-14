import React from 'react';
import {
    Plus,
    Minus,
    ShoppingCart,
    Home,
    MonitorPlay,
    Zap,
    Utensils,
    Briefcase,
    TrendingUp
} from 'lucide-react';
import '../App.css';
import BudgetMixTile from '../components/dashboard/BudgetMixTile';

const Finance = () => {
    return (
        <>
            {/* Top Header */}
            <div className="dashboard-header">


                <div className="header-actions">
                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Add Widget</span>
                    </button>
                    <button className="btn-primary" style={{ background: '#10B981' }}>
                        <Plus size={16} />
                        <span>Record</span>
                    </button>
                </div>
            </div>

            <div className="books-dashboard-container">
                {/* Main Grid Layout - Fixed Bento Grid */}
                <div className="bento-grid">
                    {/* Left Column (Wide) */}
                    <div className="bento-col-left">
                        {/* Recent Activity Tile */}
                        <div className="bento-tile recent-activity-tile">
                            <div className="tile-header-row">
                                <h2 className="tile-heading">Recent Activity</h2>
                                <div className="header-actions">
                                    <button className="btn-action primary">
                                        <Plus size={16} />
                                        <span>Add Income</span>
                                    </button>
                                    <button className="btn-action secondary">
                                        <Minus size={16} className="text-blue-500" />
                                        <span>Expense</span>
                                    </button>
                                </div>
                            </div>

                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon bg-orange-100 text-orange-600">
                                        <Utensils size={20} />
                                    </div>
                                    <div className="activity-details">
                                        <span className="activity-name">Starbucks Coffee</span>
                                        <span className="activity-meta">Food & Drinks • 10:24 AM</span>
                                    </div>
                                    <span className="activity-amount negative">-$6.50</span>
                                </div>

                                <div className="activity-item">
                                    <div className="activity-icon bg-green-100 text-green-600">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="activity-details">
                                        <span className="activity-name">Freelance Payment</span>
                                        <span className="activity-meta">Income • Yesterday</span>
                                    </div>
                                    <span className="activity-amount positive">+$1,200.00</span>
                                </div>

                                <div className="activity-item">
                                    <div className="activity-icon bg-blue-100 text-blue-600">
                                        <ShoppingCart size={20} />
                                    </div>
                                    <div className="activity-details">
                                        <span className="activity-name">Amazon.com</span>
                                        <span className="activity-meta">Shopping • 2 days ago</span>
                                    </div>
                                    <span className="activity-amount negative">-$84.20</span>
                                </div>
                            </div>
                        </div>

                        {/* Budgets Tile */}
                        <div className="bento-tile budgets-tile">
                            <div className="tile-header-row" style={{ marginBottom: '1rem' }}>
                                <h2 className="tile-heading">Budgets</h2>
                            </div>
                            <BudgetMixTile />
                        </div>
                    </div>

                    {/* Right Column (Narrow) */}
                    <div className="bento-col-right">
                        {/* Total Liquidity Tile */}
                        <div className="bento-tile liquidity-card">
                            <span className="liquidity-label">Total Liquidity</span>
                            <h1 className="liquidity-amount">$12,450.80</h1>
                            <div className="liquidity-trend">
                                <TrendingUp size={16} />
                                <span>+4.2% this month</span>
                            </div>
                        </div>

                        {/* Upcoming Bills Tile */}
                        <div className="bento-tile bills-tile">
                            <h2 className="tile-heading">Upcoming Bills</h2>

                            <div className="bills-list">
                                <div className="bill-item">
                                    <div className="bill-icon bg-gray-100 text-gray-600">
                                        <Home size={20} />
                                    </div>
                                    <div className="bill-details">
                                        <span className="bill-name">Monthly Rent</span>
                                        <span className="bill-date overdue">Due in 2 days</span>
                                    </div>
                                    <div className="bill-action">
                                        <span className="bill-amount">$1,850.00</span>
                                        <button className="btn-pay">Pay Now</button>
                                    </div>
                                </div>

                                <div className="bill-item">
                                    <div className="bill-icon bg-blue-100 text-blue-600">
                                        <MonitorPlay size={20} />
                                    </div>
                                    <div className="bill-details">
                                        <span className="bill-name">Netflix Premium</span>
                                        <span className="bill-date">Sept 15, 2024</span>
                                    </div>
                                    <div className="bill-action">
                                        <span className="bill-amount">$19.99</span>
                                        <button className="btn-pay">Pay Now</button>
                                    </div>
                                </div>

                                <div className="bill-item">
                                    <div className="bill-icon bg-yellow-100 text-yellow-600">
                                        <Zap size={20} />
                                    </div>
                                    <div className="bill-details">
                                        <span className="bill-name">Electricity Bill</span>
                                        <span className="bill-date">Sept 18, 2024</span>
                                    </div>
                                    <div className="bill-action">
                                        <span className="bill-amount">$64.12</span>
                                        <button className="btn-pay">Pay Now</button>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Tip */}
                            <div className="financial-tip-box">
                                <span className="tip-label">FINANCIAL TIP</span>
                                <p className="tip-text">
                                    You're on track to save <span className="highlight-text">$400</span> more than last month if you stick to your coffee budget!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Finance;
