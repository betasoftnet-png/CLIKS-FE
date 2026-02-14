import React from 'react';
import {
    TrendingUp,
    CalendarClock,
    User,
    BookUser,
    Split,
    Banknote,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import AnalyticsSection from '../components/AnalyticsSection';

const OverviewCard = ({ title, icon: Icon, color, path, stats, children }) => {
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
                    {stats ? stats.map((stat, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{stat.value}</span>
                        </div>
                    )) : children}
                </div>
            </div>
        </div>
    );
};

const Books = () => {
    return (
        <>
            <div className="dashboard-header">

            </div>

            <div className="content-wrapper">
                <div style={{ marginBottom: '24px' }}>
                    <AnalyticsSection />
                </div>
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Stock Overview */}
                    <OverviewCard
                        title="Stock"
                        icon={TrendingUp}
                        color="#0EA5E9"
                        path="/books/stock"
                        stats={[
                            { label: 'Total Items', value: '26' },
                            { label: 'Total Value', value: '₹2,60,500' },
                            { label: 'Low Stock', value: '1 Item' }
                        ]}
                    />

                    {/* Financial Plan Overview */}
                    <OverviewCard
                        title="Financial Plan"
                        icon={CalendarClock}
                        color="#8B5CF6"
                        path="/books/plan/budget"
                        stats={[
                            { label: 'Active Budgets', value: '4' },
                            { label: 'Pending Goals', value: '2' },
                            { label: 'Next Reminder', value: 'Today' }
                        ]}
                    />

                    {/* People Overview */}
                    <OverviewCard
                        title="People"
                        icon={User}
                        color="#F59E0B"
                        path="/books/people/overview"
                        stats={[
                            { label: 'Total Contacts', value: '12' },
                            { label: 'To Receive', value: '₹500' },
                            { label: 'To Pay', value: '₹200' }
                        ]}
                    />

                    {/* Financial Contacts */}
                    <OverviewCard
                        title="Financial Contacts"
                        icon={BookUser}
                        color="#10B981"
                        // path="/books/contacts" // Placeholder
                        stats={[
                            { label: 'Bankers', value: '2' },
                            { label: 'Advisors', value: '1' },
                            { label: 'Auditors', value: '1' }
                        ]}
                    />

                    {/* Segregation */}
                    <OverviewCard
                        title="Segregation"
                        icon={Split}
                        color="#EC4899"
                        // path="/books/segregation" // Placeholder
                        stats={[
                            { label: 'Categories', value: '8' },
                            { label: 'Uncategorized', value: '3 Items' },
                            { label: 'Tagged', value: '45 Transactions' }
                        ]}
                    />

                    {/* Split Expenses */}
                    <OverviewCard
                        title="Split Expenses"
                        icon={Banknote}
                        color="#6366F1"
                        // path="/books/split" // Placeholder
                        stats={[
                            { label: 'Active Splits', value: '2' },
                            { label: 'Settled', value: '5' },
                            { label: 'You Owe', value: '₹150' }
                        ]}
                    />

                </div>
            </div>
        </>
    );
};

export default Books;
