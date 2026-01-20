import React, { useState } from 'react';
import {
    Plus,
    User,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Target,
    Send,
    History,
    Store,
    Briefcase,
    PlayCircle
} from 'lucide-react';
import '../App.css';

const AccountCard = ({ name, amount, color, icon: Icon }) => (
    <div className="account-card" style={{ backgroundColor: color }}>
        <div className="account-icon">
            <Icon size={24} />
        </div>
        <div className="account-details">
            <div className="account-name">{name}</div>
            <div className="account-amount">₹{amount}</div>
        </div>
    </div>
);

const DonutChart = ({ label, value, colorClass, percent = 75, icon: Icon }) => (
    <div className="circular-chart-container">
        <div className="relative">
            <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                    className="circle-bg"
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    className={`circle-progress ${colorClass}`}
                    strokeDasharray={`${percent}, 100`}
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
            {Icon && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={20} />
                </div>
            )}
        </div>

        <div className="chart-label">{label}</div>
        <div className="chart-value">{value}</div>
    </div>
);

const DashboardTile = ({ title, icon: Icon, children, className = '' }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`dashboard-tile ${expanded ? 'expanded' : ''} ${className}`}>
            <div className="tile-header">
                <div className="tile-title">
                    {Icon && <Icon size={18} className="text-muted" />}
                    <span>{title}</span>
                </div>
                <div className="flex gap-2">
                    <button className="icon-btn hover:bg-gray-100"><MoreVertical size={16} /></button>
                </div>
            </div>
            <div className="tile-content">
                {children}
            </div>
            <div
                className="tile-footer"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Collapse" : "Expand"}
            >
                <div className="expand-handle"></div>
            </div>
        </div>
    );
};

const ActivityItem = ({ name, date, amount, type, icon: Icon, colorBg, colorText }) => (
    <div className="activity-item">
        <div className="activity-icon-wrapper" style={{ backgroundColor: colorBg, color: colorText }}>
            <Icon size={20} />
        </div>
        <div className="activity-details">
            <div className="activity-name">{name}</div>
            <div className="activity-date">{date}</div>
        </div>
        <div className={`activity-amount ${type === 'in' ? 'income-text' : 'expense-text'}`}>
            {type === 'in' ? '+' : '-'}₹{amount}
        </div>
    </div>
);

const Home = () => {
    return (
        <>
            {/* Top Header */}
            <div className="dashboard-header">
                <h1 className="page-title">Dashboard</h1>

                <div className="header-actions">
                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Record</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Accounts Row */}
                <div className="accounts-grid">
                    <AccountCard
                        name="Bank 1"
                        amount="74.39"
                        color="#0EA5E9"
                        icon={Target}
                    />
                    <AccountCard
                        name="Locker"
                        amount="289.10"
                        color="#1E3A8A"
                        icon={Target}
                    />

                    <button className="add-account-btn">
                        <Plus size={20} />
                        <span>Add Account</span>
                    </button>
                </div>

                {/* Controls Row */}
                <div className="controls-bar">
                    <div className="spacer"></div>

                    <div className="month-selector">
                        <button className="icon-btn"><ChevronLeft size={20} /></button>
                        <div className="current-month">
                            <span>This month</span>
                            <MoreVertical size={14} />
                        </div>
                        <button className="icon-btn"><ChevronRight size={20} /></button>
                    </div>

                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Add Card</span>
                    </button>
                </div>

                {/* Dashboard Tiles Grid */}
                <div className="dashboard-grid">

                    {/* Widget 1: Financial Overview */}
                    <DashboardTile title="Financial Overview" icon={Target}>
                        <div className="gauges-container">
                            <DonutChart label="Balance" value="363" colorClass="chart-success" percent={65} />
                            <DonutChart label="Cash Flow" value="0" colorClass="chart-warning" percent={0} />
                            <DonutChart label="Spending" value="0" colorClass="chart-danger" percent={25} />
                        </div>
                    </DashboardTile>

                    {/* Widget 2: Recent Activity (Enhanced Vertical) */}
                    <DashboardTile title="Recent Activity" icon={History}>
                        <div className="activity-flow">
                            <ActivityItem
                                name="Paypal - Received"
                                date="20 December 2020, 08:20 AM"
                                amount="8,200.00"
                                type="in"
                                icon={Briefcase}
                                colorBg="#E0F2FE" // Light Blue
                                colorText="#0284C7"
                            />
                            <ActivityItem
                                name="Spotify Premium"
                                date="19 December 2020, 07:25 PM"
                                amount="199.00"
                                type="out"
                                icon={PlayCircle}
                                colorBg="#DCFCE7" // Light Green
                                colorText="#16A34A"
                            />
                            <ActivityItem
                                name="Transferwise - Received"
                                date="19 December 2020, 10:15 AM"
                                amount="1,200.00"
                                type="in"
                                icon={Target}
                                colorBg="#F0F9FF" // Light Cyan/Blue match
                                colorText="#0891B2"
                            />
                            <ActivityItem
                                name="H&M Payment"
                                date="15 December 2020, 06:30 PM"
                                amount="2,200.00"
                                type="out"
                                icon={Store}
                                colorBg="#FFE4E6" // Light Red/Pink
                                colorText="#E11D48"
                            />
                        </div>
                    </DashboardTile>

                    {/* Widget 3: Quick Transfer */}
                    <DashboardTile title="Quick Transfer" icon={Send}>
                        <div className="transfer-container">
                            <div className="transfer-contact">
                                <div className="contact-card">
                                    <div className="contact-avatar">
                                        <User size={20} />
                                    </div>
                                    <div className="contact-info">
                                        <div className="contact-name">Dad</div>
                                        <div className="contact-bank">Example Bank •••• 4582</div>
                                    </div>
                                </div>
                            </div>

                            <div className="transfer-icons text-muted"> <ChevronRight size={16} /> </div>

                            <div className="transfer-input-group">
                                <div className="amount-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input type="text" className="amount-input" placeholder="Amount" />
                                </div>
                                <button className="send-btn">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </DashboardTile>

                </div>
            </div>
        </>
    );
}

export default Home;
