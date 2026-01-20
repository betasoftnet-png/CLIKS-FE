import React from 'react';
import {
    ArrowLeftRight,
    Building2,
    FileText,
    PiggyBank,
    CreditCard,
    Gift,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const OverviewCard = ({ title, icon: Icon, color, path, stats }) => {
    const navigate = useNavigate();

    return (
        <div
            className="dashboard-tile"
            style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
            }}
            onClick={() => path && navigate(path)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            }}
        >
            <div className="tile-header" style={{ borderBottom: 'none', padding: '1.5rem 1.5rem 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${color}15`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{title}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View Details <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="tile-content" style={{ padding: '0 1.5rem 1.5rem', flex: 1 }}>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Finance = () => {
    return (
        <>
            <div className="dashboard-header">
                <h1 className="page-title">Finance Overview</h1>
            </div>

            <div className="content-wrapper">
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Transfers & Payments */}
                    <OverviewCard
                        title="Transfers & Payments"
                        icon={ArrowLeftRight}
                        color="#0EA5E9"
                        // path="/finance/transfers"
                        stats={[
                            { label: 'Pending Transfers', value: '3' },
                            { label: 'This Month', value: '₹45,200' },
                            { label: 'Split Bills', value: '2 Active' }
                        ]}
                    />

                    {/* Accounts & Banking */}
                    <OverviewCard
                        title="Accounts & Banking"
                        icon={Building2}
                        color="#8B5CF6"
                        // path="/finance/accounts"
                        stats={[
                            { label: 'Total Balance', value: '₹1,24,500' },
                            { label: 'Active Accounts', value: '4' },
                            { label: 'Last Transaction', value: 'Today' }
                        ]}
                    />

                    {/* Bills, Tax & Penalties */}
                    <OverviewCard
                        title="Bills, Tax & Penalties"
                        icon={FileText}
                        color="#F59E0B"
                        // path="/finance/bills"
                        stats={[
                            { label: 'Pending Bills', value: '2' },
                            { label: 'Due This Week', value: '₹3,500' },
                            { label: 'Tax Payments', value: '1 Upcoming' }
                        ]}
                    />

                    {/* Savings, Loans & Insurance */}
                    <OverviewCard
                        title="Savings, Loans & Insurance"
                        icon={PiggyBank}
                        color="#10B981"
                        // path="/finance/savings"
                        stats={[
                            { label: 'Total Savings', value: '₹85,000' },
                            { label: 'Active Loans', value: '1' },
                            { label: 'Insurance Policies', value: '3' }
                        ]}
                    />

                    {/* Credit & Contributions */}
                    <OverviewCard
                        title="Credit & Contributions"
                        icon={CreditCard}
                        color="#EC4899"
                        // path="/finance/credit"
                        stats={[
                            { label: 'Credit Score', value: '750' },
                            { label: 'Credit Utilization', value: '35%' },
                            { label: 'Donations YTD', value: '₹12,000' }
                        ]}
                    />

                    {/* Rewards & Benefits */}
                    <OverviewCard
                        title="Rewards & Benefits"
                        icon={Gift}
                        color="#6366F1"
                        // path="/finance/rewards"
                        stats={[
                            { label: 'Reward Points', value: '2,450' },
                            { label: 'Active Offers', value: '5' },
                            { label: 'Referral Earnings', value: '₹500' }
                        ]}
                    />

                </div>
            </div>
        </>
    );
};

export default Finance;
