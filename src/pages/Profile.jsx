import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import {
    User,
    Wallet,
    Settings,
    Target,
    Shield,
    Database,
    Info,
    Mail,
    Phone,
    Briefcase,
    TrendingUp,
    TrendingDown,
    MapPin,
    CreditCard,
    Calendar,
    Globe,
    Bell,
    Lock,
    Smartphone,
    ChevronRight,
    ArrowLeft,
    Download,
    Upload
} from 'lucide-react';
import '../App.css';

import Breadcrumbs from '../components/Breadcrumbs';

const Profile = () => {
    const navigate = useNavigate();
    // Simulate sidebar logic
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('Basic Info');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        // Maybe navigate back or standard toggle behavior if we want to share that logic
    };

    // Define sidebar items
    const sidebarItems = [
        { label: 'Basic Info', icon: User },
        { label: 'Account Summary', icon: Wallet },
        { label: 'Data & Backup', icon: Database },
    ];

    // --- Detail Views (Reduced Sizes for No-Scroll) ---

    const BasicInfoView = () => {
        const [isEditing, setIsEditing] = useState(false);
        const [isSaving, setIsSaving] = useState(false);

        const handleSave = () => {
            if (isEditing) {
                setIsSaving(true);
                // Simulate network request
                setTimeout(() => {
                    setIsSaving(false);
                    setIsEditing(false);
                }, 2000);
            } else {
                setIsEditing(true);
            }
        };

        return (
            <div className="dashboard-tile" style={{ maxWidth: '100%', height: '100%' }}>
                <div className="tile-header" style={{ padding: '0.75rem 1rem' }}>
                    <div className="tile-title" style={{ fontSize: '0.9rem' }}>
                        <User size={18} className="text-blue-600" />
                        Basic Information
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            padding: '0.4rem 0.8rem',
                            background: isEditing ? '#195BAC' : 'white',
                            color: isEditing ? 'white' : '#195BAC',
                            border: '1px solid #195BAC',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: isSaving ? 0.7 : 1
                        }}
                        className="transition"
                    >
                        {isSaving && (
                            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSaving ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
                    </button>
                </div>
                <div className="tile-content" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        {/* Profile Picture */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%', background: '#E2E8F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={48} color="#64748B" />
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <table className="table-auto border-separate border-spacing-2 border border-gray-400 dark:border-gray-500">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 dark:border-gray-600" style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontSize: '0.85rem' }}>Field</th>
                                        <th className="border border-gray-300 dark:border-gray-600" style={{ padding: '8px', textAlign: 'left', color: '#64748B', fontSize: '0.85rem' }}>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>First Name</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>Aditya</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>Last Name</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>S</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>Date of Birth</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>15 June 1995</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>Email Address</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>adtya.s@example.com</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>Phone</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontWeight: 600, color: '#0F172A', fontSize: '0.95rem' }}>+91 98765 43210</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px', fontSize: '0.9rem', color: '#64748B' }}>Account Type</td>
                                        <td className="border border-gray-300 dark:border-gray-700" style={{ padding: '8px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                Personal
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AccountSummaryView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '100%' }}>
            <div className="tile-header" style={{ padding: '0.75rem 1rem' }}>
                <div className="tile-title" style={{ fontSize: '0.9rem' }}><Wallet size={18} /> Account Summary</div>
            </div>
            <div className="tile-content" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                        <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Total Balance</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>₹ 1,24,500</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem', background: '#F0FDF4', borderRadius: '8px' }}>
                            <span style={{ color: '#166534', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={14} /> Receivables</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#166534' }}>₹ 15,000</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '8px' }}>
                            <span style={{ color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingDown size={14} /> Payables</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#991B1B' }}>₹ 4,200</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const DataBackupView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '100%' }}>
            <div className="tile-header" style={{ padding: '0.75rem 1rem' }}>
                <div className="tile-title" style={{ fontSize: '0.9rem' }}><Database size={18} /> Data & Backup</div>
            </div>
            <div className="tile-content" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#334155', fontWeight: 500, fontSize: '0.9rem' }}>Backup Status</span>
                        <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.8rem', background: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>Synced</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Last successful backup: Today, 10:30 AM</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
                        <Download size={24} color="#195BAC" />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Export Data</span>
                    </button>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
                        <Upload size={24} color="#195BAC" />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Restore</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // --- Main Render ---

    return (
        <div className={`app-root select-none ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ height: '100vh', overflow: 'hidden' }}>
            <Topbar onToggleSidebar={toggleSidebar} />
            <div className="app-body" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                {/* Main Content Area - Full Width & No Scroll if possible */}
                <div className="main-content-area" style={{ background: '#F8FAFC', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '0' }}>

                    {/* Static Breadcrumbs Area */}
                    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 2rem 0 2rem', width: '100%', flexShrink: 0 }}>
                        <Breadcrumbs />
                    </div>

                    <div className="content-scrollable" style={{ overflowY: 'auto' }}> {/* Allow internal scroll if absolutely needed, but try to avoid it */}
                        <div className="content-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 2rem', height: '100%' }}>
                            {/* Header Section: Back Button & Title */}
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Profile Settings</h1>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage your account settings.</p>
                                </div>
                                <button
                                    onClick={() => navigate(-1)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#64748B',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: 'transparent',
                                        border: '1px solid #E2E8F0',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.color = '#1E293B'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; }}
                                >
                                    <ArrowLeft size={18} />
                                    <span>Back</span>
                                </button>
                            </div>

                            {/* Horizontal Tab Navigation */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem', // Spacing for perfect alignment
                                borderBottom: '1px solid #E2E8F0',
                                marginBottom: '1.5rem',
                                paddingBottom: '1px'
                            }}>
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setActiveSection(item.label)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.75rem 0', // Vertical padding only
                                            borderBottom: activeSection === item.label ? '2px solid #195BAC' : '2px solid transparent',
                                            background: 'transparent',
                                            color: activeSection === item.label ? '#195BAC' : '#64748B',
                                            fontSize: '0.95rem',
                                            fontWeight: activeSection === item.label ? 600 : 500,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            borderTop: 'none',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                            transition: 'all 0.2s',
                                            marginBottom: '-1px' // Overlap border
                                        }}
                                    >
                                        <item.icon size={18} strokeWidth={activeSection === item.label ? 2.5 : 2} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Content Views */}
                            <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                                {activeSection === 'Basic Info' && <BasicInfoView />}
                                {activeSection === 'Account Summary' && <AccountSummaryView />}
                                {activeSection === 'Data & Backup' && <DataBackupView />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default Profile;
