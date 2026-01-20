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
        { label: 'Preferences', icon: Settings },
        { label: 'Categories & Defaults', icon: Target },
        { label: 'Security & Access', icon: Shield },
        { label: 'Data & Backup', icon: Database },
        { label: 'App Info', icon: Info },
    ];

    // --- Detail Views ---

    const BasicInfoView = () => {
        const [isEditing, setIsEditing] = useState(false);

        return (
            <div className="dashboard-tile" style={{ maxWidth: '1000px' }}>
                <div className="tile-header">
                    <div className="tile-title">
                        <User size={20} className="text-blue-600" />
                        Basic Information
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: isEditing ? '#195BAC' : 'white',
                            color: isEditing ? 'white' : '#195BAC',
                            border: '1px solid #195BAC',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
                <div className="tile-content" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        {/* Profile Picture */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%', background: '#E2E8F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={56} color="#64748B" />
                            </div>
                            {isEditing && (
                                <button style={{
                                    fontSize: '0.75rem',
                                    color: '#195BAC',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}>
                                    Change Photo
                                </button>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            {/* First Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    First Name <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue="Aditya"
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>Aditya</span>
                                )}
                            </div>

                            {/* Last Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    Last Name <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue="S"
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>S</span>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    Date of Birth
                                </label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        defaultValue="1995-06-15"
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>15 June 1995</span>
                                )}
                            </div>

                            {/* Email Address */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        defaultValue="adtya.s@example.com"
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                                        <Mail size={16} color="#64748B" />
                                        adtya.s@example.com
                                    </div>
                                )}
                            </div>

                            {/* Primary Phone Number */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    Primary Phone Number <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        defaultValue="+91 98765 43210"
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                                        <Phone size={16} color="#64748B" />
                                        +91 98765 43210
                                    </div>
                                )}
                            </div>

                            {/* Secondary Phone Number */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                                    Secondary Phone Number <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>(Optional)</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        defaultValue=""
                                        style={{
                                            padding: '0.75rem',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#195BAC'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                ) : (
                                    <span style={{ fontWeight: 500, fontSize: '0.95rem', color: '#94A3B8', fontStyle: 'italic' }}>Not provided</span>
                                )}
                            </div>

                            {/* Account Type - Full Width */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Account Type</label>
                                <span style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content', gap: '0.5rem', padding: '0.5rem 1rem', background: '#DBEAFE', color: '#1E40AF', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <Briefcase size={16} /> Personal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AccountSummaryView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Wallet size={20} /> Account Summary</div>
            </div>
            <div className="tile-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#F8FAFC', borderRadius: '8px' }}>
                        <span style={{ color: '#64748B' }}>Total Balance</span>
                        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0F172A' }}>₹ 1,24,500</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem', background: '#F0FDF4', borderRadius: '8px' }}>
                            <span style={{ color: '#166534', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={16} /> Receivables</span>
                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#166534' }}>₹ 15,000</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem', background: '#FEF2F2', borderRadius: '8px' }}>
                            <span style={{ color: '#991B1B', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingDown size={16} /> Payables</span>
                            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#991B1B' }}>₹ 4,200</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#195BAC' }}>12</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Active People</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#195BAC' }}>3</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Split Groups</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PreferencesView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Settings size={20} /> Preferences</div>
            </div>
            <div className="tile-content">
                {[
                    { icon: CreditCard, label: 'Default Currency', value: 'INR (₹)' },
                    { icon: Calendar, label: 'Date Format', value: 'DD/MM/YYYY' },
                    { icon: Globe, label: 'Language', value: 'English (US)' },
                    { icon: Calendar, label: 'Financial Month Start', value: 'April' },
                    { icon: Bell, label: 'Notifications', value: 'Enabled' },
                ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: '#64748B' }}><item.icon size={20} /></div>
                            <span style={{ fontWeight: 500, color: '#334155' }}>{item.label}</span>
                        </div>
                        <span style={{ color: '#195BAC', fontWeight: 600 }}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const CategoriesDefaultsView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Target size={20} /> Categories & Defaults</div>
            </div>
            <div className="tile-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Default Person Category</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['Friend', 'Family', 'Vendor', 'Colleague'].map(tag => (
                                <span key={tag} style={{ padding: '0.5rem 1rem', background: tag === 'Friend' ? '#195BAC' : '#F1F5F9', color: tag === 'Friend' ? 'white' : '#64748B', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Default Transaction Category</label>
                        <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#334155' }}>
                            General Expense
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Reminder Behavior</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Bell size={18} color="#F59E0B" /> 1 Day Before Due Date
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const SecurityView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Shield size={20} /> Security & Access</div>
            </div>
            <div className="tile-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Lock size={20} color="#64748B" />
                            <span style={{ color: '#334155', fontWeight: 500 }}>Change Password</span>
                        </div>
                        <ChevronRight size={18} color="#CBD5E1" />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Smartphone size={20} color="#64748B" />
                            <span style={{ color: '#334155', fontWeight: 500 }}>App Lock / Biometric</span>
                        </div>
                        <div style={{ width: '40px', height: '24px', background: '#E2E8F0', borderRadius: '12px', position: 'relative' }}>
                            <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}></div>
                        </div>
                    </button>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>Active Session</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%' }}></div>
                            <span style={{ color: '#15803D' }}>Windows PC - Chrome (Current)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const DataBackupView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Database size={20} /> Data & Backup</div>
            </div>
            <div className="tile-content">
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: '#334155', fontWeight: 500 }}>Backup Status</span>
                        <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem', background: '#DCFCE7', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>Synced</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Last successful backup: Today, 10:30 AM</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <Download size={32} color="#195BAC" />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Export Data</span>
                    </button>
                    <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <Upload size={32} color="#195BAC" />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Restore</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const AppInfoView = () => (
        <div className="dashboard-tile" style={{ maxWidth: '800px' }}>
            <div className="tile-header">
                <div className="tile-title"><Info size={20} /> App & Account Info</div>
            </div>
            <div className="tile-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748B' }}>App Version</span>
                        <span style={{ fontWeight: 600 }}>v2.4.0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748B' }}>Plan</span>
                        <span style={{ fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>PRO</span>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#64748B' }}>Storage Used</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>45%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '45%', height: '100%', background: '#195BAC' }}></div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                        <a href="#" style={{ color: '#195BAC', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
                        <a href="#" style={{ color: '#195BAC', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Main Render ---

    return (
        <div className={`app-root ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Topbar onToggleSidebar={toggleSidebar} />
            <div className="app-body">
                {/* Custom Profile Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`} style={{ borderRight: '1px solid #E2E8F0' }}>
                    <div className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', height: 'auto', padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                        <button
                            onClick={() => navigate(-1)}
                            className="back-button-profile"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: '1px solid #E2E8F0',
                                background: 'white',
                                color: '#195BAC',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#195BAC';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#195BAC';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#195BAC';
                                e.currentTarget.style.borderColor = '#E2E8F0';
                            }}
                        >
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>
                        <h2 className="app-title" style={{ fontSize: '1.1rem', color: '#195BAC', marginTop: '0.5rem' }}>Profile Settings</h2>
                    </div>
                    <nav className="sidebar-nav">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.label}
                                className={`sidebar-item ${activeSection === item.label ? 'active' : ''}`}
                                onClick={() => setActiveSection(item.label)}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span className="sidebar-label">{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                    <div className="sidebar-footer">
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8', padding: '0 1.5rem' }}>Profile v1.0</span>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="main-content-area" style={{ background: '#F8FAFC' }}>
                    <div className="content-scrollable">
                        <div className="content-wrapper">
                            {/* Back Button at Top of Content */}
                            <div style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                                <button
                                    onClick={() => navigate(-1)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        border: '1px solid #E2E8F0',
                                        background: 'white',
                                        color: '#195BAC',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#195BAC';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = '#195BAC';
                                        e.currentTarget.style.transform = 'translateX(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#195BAC';
                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back</span>
                                </button>
                            </div>

                            <div className="dashboard-header">
                                <h1 className="page-title">{activeSection}</h1>
                            </div>

                            <div style={{ paddingBottom: '3rem' }}>
                                {activeSection === 'Basic Info' && <BasicInfoView />}
                                {activeSection === 'Account Summary' && <AccountSummaryView />}
                                {activeSection === 'Preferences' && <PreferencesView />}
                                {activeSection === 'Categories & Defaults' && <CategoriesDefaultsView />}
                                {activeSection === 'Security & Access' && <SecurityView />}
                                {activeSection === 'Data & Backup' && <DataBackupView />}
                                {activeSection === 'App Info' && <AppInfoView />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
