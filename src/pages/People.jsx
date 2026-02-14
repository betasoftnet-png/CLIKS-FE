import React from 'react';
import {
    Users,
    ArrowLeftRight,
    Bell,
    FileText,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { formatCurrency } from '../lib/formatCurrency';

const FeatureCard = ({ title, icon: Icon, color, path, stats }) => {
    const navigate = useNavigate();

    return (
        <div
            className="dashboard-tile"
            onClick={() => navigate(path)}
            style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
            }}
        >
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${color}15`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1E293B',
                        margin: '0 0 6px 0',
                        lineHeight: '1.2'
                    }}>
                        {title}
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#64748B',
                        fontWeight: '500'
                    }}>
                        View Details <ArrowRight size={14} />
                    </div>
                </div>
            </div>

            {/* Stats List */}
            <div style={{ marginTop: 'auto' }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderTop: index === 0 ? 'none' : '1px solid #F1F5F9',
                        fontSize: '14px'
                    }}>
                        <span style={{ color: '#64748B', fontWeight: '500' }}>{stat.label}</span>
                        <span style={{ color: '#0F172A', fontWeight: '700' }}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const People = () => {
    // Configuration for people sections
    const sections = [
        {
            title: "People & Network",
            icon: Users,
            color: "#2563EB", // Blue
            path: "/books/people/overview",
            stats: [
                { label: "Total Contacts", value: "24 People" },
                { label: "Active Month", value: "5 Contacts" },
                { label: "Groups", value: "2 Active" }
            ]
        },
        {
            title: "Friend Transactions",
            icon: ArrowLeftRight,
            color: "#9333EA", // Purple
            path: "/books/people/transactions",
            stats: [
                { label: "Pending Requests", value: "3 Requests" },
                { label: "Total Volume", value: formatCurrency(15400) },
                { label: "Settled", value: "12 Trans" }
            ]
        },
        {
            title: "Payment Reminders",
            icon: Bell,
            color: "#F59E0B", // Amber
            path: "/books/people/reminders",
            stats: [
                { label: "Upcoming", value: "2 Due" },
                { label: "Overdue", value: "None" },
                { label: "Recurring", value: "3 Active" }
            ]
        },
        {
            title: "Documents & Records",
            icon: FileText,
            color: "#10B981", // Emerald
            path: "/books/people/records",
            stats: [
                { label: "Files", value: "15 Docs" },
                { label: "Shared With", value: "4 People" },
                { label: "Storage", value: "45 MB" }
            ]
        }
    ];

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>

                <p className="section-subtitle" style={{ fontSize: '16px', color: '#64748B' }}>Manage your network, track shared expenses, and organize records.</p>
            </div>

            <div className="content-wrapper">
                <div className="dashboard-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                    gap: '24px'
                }}>
                    {sections.map((section, index) => (
                        <FeatureCard
                            key={index}
                            title={section.title}
                            icon={section.icon}
                            color={section.color}
                            path={section.path}
                            stats={section.stats}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default People;
