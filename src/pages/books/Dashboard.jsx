import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrency, useLanguage, useAuth } from '../../context';
import {
    Calculator,
    ShoppingCart,
    Banknote,
    TrendingDown,
    BarChart3,
    Gift,
    Award,
    Users,
    CreditCard,
    Target,
    Split,
    Calendar,
    Contact2,
    LayoutDashboard,
    Package,
    Wallet,
    SplitSquareVertical,
    ArrowRight,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Bell,
    Settings,
    Activity,
    Plus,
    Loader2,
    TrendingUp,
    Clock,
    PiggyBank,
    FileText,
    ShieldCheck,
    Briefcase,
    X
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../../services';
import '../../App.css';

const MASTER_SHORTCUTS = [
    { id: 'accounts', label: 'Accounts', path: '/books/accounting', icon: Calculator, color: '#1B6B3A' },
    { id: 'purchases', label: 'Purchases', path: '/books/purchase-details', icon: ShoppingCart, color: '#F59E0B' },
    { id: 'income', label: 'Income', path: '/books/income', icon: Banknote, color: '#10B981' },
    { id: 'expense', label: 'Expense', path: '/books/expenses', icon: TrendingDown, color: '#DC2626' },
    { id: 'report', label: 'Report', path: '/books', icon: BarChart3, color: '#4F46E5' },
    { id: 'refer_earn', label: 'Refer & Earn', path: '/refer-earn', action: 'referral_modal', icon: Gift, color: '#8B5CF6' },
    { id: 'loyalty_rewards', label: 'Loyalty Rewards', path: '/books/purchase-details', icon: Award, color: '#EC4899' },
    { id: 'people', label: 'People', path: '/payments/people', icon: Users, color: '#2563EB' },
    { id: 'transaction', label: 'Transaction', path: '/payments/transactions', icon: CreditCard, color: '#0D9488' },
    { id: 'segregation', label: 'Segregation', path: '/payments/segregation', icon: Target, color: '#7C3AED' },
    { id: 'split_collect', label: 'Split & Collect', path: '/payments/split-collect', icon: Split, color: '#059669' },
    { id: 'planner', label: 'Planner', path: '/payments/plan', icon: Calendar, color: '#0284C7' },
    { id: 'contacts', label: 'Contacts', path: '/payments/people?tab=contacts', icon: Contact2, color: '#0891B2' },
];

const DEFAULT_SHORTCUT_IDS = [
    'accounts',
    'purchases',
    'income',
    'expense',
    'people',
    'segregation'
];

const VALID_SHORTCUT_IDS = new Set(MASTER_SHORTCUTS.map(s => s.id));

const BooksDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { formatCurrency } = useCurrency();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // User-scoped storage key with guest fallback
    const storageKey = useMemo(() => {
        const uid = user?.id || user?._id || user?.email || 'guest';
        return `cliks_books_shortcuts_${uid}`;
    }, [user]);

    // Helper to sanitize shortcut IDs against VALID_SHORTCUT_IDS
    const sanitizeShortcuts = useCallback((rawList) => {
        if (!Array.isArray(rawList)) return null;
        const validList = rawList.filter(id => VALID_SHORTCUT_IDS.has(id));
        return validList.length > 0 ? Array.from(new Set(validList)) : null;
    }, []);

    const [selectedShortcuts, setSelectedShortcuts] = useState(() => {
        const uid = user?.id || user?._id || user?.email || 'guest';
        const scopedKey = `cliks_books_shortcuts_${uid}`;
        const savedScoped = localStorage.getItem(scopedKey);
        const parsedScoped = savedScoped ? (() => { try { return JSON.parse(savedScoped); } catch { return null; } })() : null;
        const validScoped = sanitizeShortcuts(parsedScoped);
        if (validScoped) return validScoped;

        // Fallback to legacy global key
        const savedLegacy = localStorage.getItem('cliks_books_shortcuts');
        const parsedLegacy = savedLegacy ? (() => { try { return JSON.parse(savedLegacy); } catch { return null; } })() : null;
        const validLegacy = sanitizeShortcuts(parsedLegacy);
        if (validLegacy) {
            try {
                localStorage.setItem(scopedKey, JSON.stringify(validLegacy));
                localStorage.setItem('cliks_books_shortcuts', JSON.stringify(validLegacy));
            } catch {}
            return validLegacy;
        }

        // Default initial shortcuts
        try {
            localStorage.setItem(scopedKey, JSON.stringify(DEFAULT_SHORTCUT_IDS));
            localStorage.setItem('cliks_books_shortcuts', JSON.stringify(DEFAULT_SHORTCUT_IDS));
        } catch {}
        return DEFAULT_SHORTCUT_IDS;
    });

    // Sync state when active user changes or mounts
    useEffect(() => {
        const savedScoped = localStorage.getItem(storageKey);
        const parsed = savedScoped ? (() => { try { return JSON.parse(savedScoped); } catch { return null; } })() : null;
        const valid = sanitizeShortcuts(parsed);
        if (valid) {
            setSelectedShortcuts(valid);
        } else {
            const savedLegacy = localStorage.getItem('cliks_books_shortcuts');
            const parsedLegacy = savedLegacy ? (() => { try { return JSON.parse(savedLegacy); } catch { return null; } })() : null;
            const validLegacy = sanitizeShortcuts(parsedLegacy);
            const fallback = validLegacy || DEFAULT_SHORTCUT_IDS;
            setSelectedShortcuts(fallback);
            try {
                localStorage.setItem(storageKey, JSON.stringify(fallback));
                localStorage.setItem('cliks_books_shortcuts', JSON.stringify(fallback));
            } catch {}
        }
    }, [storageKey, sanitizeShortcuts]);

    // Handle cross-tab or cross-window storage synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === storageKey || e.key === 'cliks_books_shortcuts') {
                try {
                    const nextParsed = JSON.parse(e.newValue);
                    const valid = sanitizeShortcuts(nextParsed);
                    if (valid) setSelectedShortcuts(valid);
                } catch {}
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [storageKey, sanitizeShortcuts]);

    const [searchTerm, setSearchTerm] = useState('');

    const toggleShortcut = (id) => {
        setSelectedShortcuts(prev => {
            const next = prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id];
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
                localStorage.setItem('cliks_books_shortcuts', JSON.stringify(next));
            } catch {}
            return next;
        });
    };

    const handleShortcutClick = (shortcut) => {
        if (shortcut.action === 'referral_modal') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('cliks:open-referral-modal'));
            }
        }
        if (shortcut.path) {
            navigate(shortcut.path);
        }
    };

    const { data: stats, isLoading, refetch } = useQuery({
        queryKey: ['books-dashboard-data'],
        queryFn: homeService.getBooksDashboardData,
        select: (res) => res?.data || res,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });

    React.useEffect(() => {
        refetch();
        const handleTxAdded = () => {
            refetch();
        };
        window.addEventListener('transaction-added', handleTxAdded);
        return () => window.removeEventListener('transaction-added', handleTxAdded);
    }, [refetch]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={48} className="animate-spin" color="var(--accent-ink)" />
            </div>
        );
    }

    const contactsCount = typeof stats?.people === 'object' && stats?.people !== null
        ? (Array.isArray(stats.people) ? stats.people.length : (stats.people.total ?? stats.people.count ?? Object.keys(stats.people).length ?? 0))
        : (Number(stats?.people) || 0);

    const segregationsCount = typeof stats?.wallets === 'object' && stats?.wallets !== null
        ? (stats.wallets.total ?? 0)
        : (Number(stats?.segregation_count ?? stats?.segregations) || 0);

    const metrics = [
        { 
            label: t('totalIncome', 'Total Income'), 
            value: formatCurrency(stats?.income || 0), 
            change: t('live', 'Live'), 
            icon: ArrowUpRight, 
            color: '#1B6B3A'
        },
        { 
            label: t('totalExpenses', 'Total Expenses'), 
            value: formatCurrency(stats?.expenses || 0), 
            change: t('live', 'Live'), 
            icon: ArrowDownLeft, 
            color: '#DC2626' 
        },
        { 
            label: t('netBalance', 'Net Balance'), 
            value: formatCurrency((stats?.income || 0) - (stats?.expenses || 0)), 
            change: t('live', 'Live'), 
            icon: Wallet, 
            color: '#059669' 
        },
        { 
            label: t('activeInvestments', 'Active Investments'), 
            value: formatCurrency(stats?.investments || 0), 
            change: t('live', 'Live'), 
            icon: PiggyBank, 
            color: '#2563EB' 
        },
        { 
            label: t('activePeople', 'Active People'), 
            value: `${contactsCount} Contacts`, 
            change: t('live', 'Live'), 
            icon: Users, 
            color: '#D97706' 
        },
        { 
            label: t('activeSegregations', 'Active Segregations'), 
            value: `${segregationsCount} Records`, 
            change: t('live', 'Live'), 
            icon: SplitSquareVertical, 
            color: '#059669'
        }
    ];

    return (
        <div className="premium-container books-console-page" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', background: 'var(--bg-color, #ffffff)' }}>
            <div className="dashboard-header" style={{ flexShrink: 0 }}>
                <div className="dashboard-header-title">
                    <h1>{t('booksConsole', 'Books Console')}</h1>
                    <p>{t('booksSubtitle', 'Monitor your personal finance & operational intelligence suite.')}</p>
                </div>
                <div className="dashboard-header-actions">
                    <div className="dashboard-search-wrapper">
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder={t('findModulesPlaceholder', 'Find modules, assets...')}
                            className="dashboard-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        data-tour="dashboard-customize-btn"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '0.589rem 1.359rem',
                            borderRadius: '12px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.453rem',
                            boxShadow: '0 4px 12px rgba(27, 107, 58, 0.15)'
                        }}
                    >
                        <Settings size={16} /> {t('customise', 'Customise')}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '0.906rem' }}>
                <div className="dashboard-stats-grid">
                    {metrics.map((stat, idx) => (
                        <div
                            key={idx}
                            className="dashboard-stat-card compact-stat-card"
                            style={{
                                borderTop: `3px solid ${stat.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                <h3
                                    style={{
                                        fontSize: '0.72rem',
                                        fontWeight: '800',
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                        margin: 0,
                                        lineHeight: 1.2
                                    }}
                                >
                                    {stat.label}
                                </h3>
                                <div
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        background: `${stat.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: stat.color,
                                        flexShrink: 0
                                    }}
                                >
                                    <stat.icon size={14} strokeWidth={2.5} />
                                </div>
                            </div>

                            <h2
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '900',
                                    color: '#0F172A',
                                    letterSpacing: '-0.5px',
                                    margin: '0 0 0.25rem 0',
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {stat.value}
                            </h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: stat.color,
                                        display: 'inline-block'
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '0.62rem',
                                        fontWeight: '800',
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em'
                                    }}
                                >
                                    LIVE
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1.133rem', marginBottom: '0.68rem' }}>
                    <h2 className="dashboard-quick-actions-title" data-tour="books-dashboard-shortcuts">
                        {t('quickActionCenter', 'Quick Action Center')}
                    </h2>

                    {(() => {
                        const q = searchTerm.trim().toLowerCase();
                        const visibleShortcuts = MASTER_SHORTCUTS
                            .filter(s => selectedShortcuts.includes(s.id))
                            .filter(s => !q || s.label.toLowerCase().includes(q));

                        return (
                            <>
                                {q && visibleShortcuts.length === 0 ? (
                                    <div style={{ padding: '1.359rem 0', color: '#94A3B8', fontSize: '0.816rem', fontWeight: 600 }}>
                                        {t('noMatchingModules', 'No matching modules found.')}
                                    </div>
                                ) : (
                                    <div className="dashboard-shortcuts-container">
                                        {visibleShortcuts.map(shortcut => {
                                            const Icon = shortcut.icon;
                                            return (
                                                <button
                                                    key={shortcut.id}
                                                    onClick={() => handleShortcutClick(shortcut)}
                                                    className="dashboard-shortcut-btn"
                                                    style={{ '--shortcut-color': shortcut.color }}
                                                >
                                                    <div
                                                        className="dashboard-shortcut-btn-icon-wrapper"
                                                        style={{
                                                            background: `${shortcut.color}12`,
                                                            color: shortcut.color
                                                        }}
                                                    >
                                                        <Icon size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="dashboard-shortcut-btn-label">{t(shortcut.id, shortcut.label)}</span>
                                                </button>
                                            );
                                        })}

                                        {!q && (
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="dashboard-manage-shortcuts-btn"
                                            >
                                                <Plus size={16} strokeWidth={2.5} />
                                                <span style={{ fontWeight: '750', fontSize: '0.816rem' }}>Manage Shortcuts</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-content-split">
                    {/* Left Panel: Modules Suite */}
                    <div className="dashboard-panel" data-tour="dashboard-modules-suite" style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem', background: 'white', padding: '1.042rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '0.952rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>Modules & Management Suite</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem' }}>
                            {/* Inventory Module */}
                            <div
                                data-tour="dashboard-module-inventory"
                                style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => navigate('/books/stock')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: 'var(--accent-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0' }}>Inventory & Stocks</h4>
                                        <p style={{ fontSize: '0.707rem', color: '#64748B', fontWeight: '500', margin: 0, lineHeight: '1.4' }}>Real-time overview of products, stock alerts, and individual restock thresholds.</p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--accent-ink)', background: 'var(--accent-tint)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ArrowRight size={15} />
                                </div>
                            </div>

                            {/* People Module */}
                            <div
                                data-tour="dashboard-module-people"
                                style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => navigate('/books/people')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: 'var(--accent-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0', width: 'fit-content' }}>People Hub</h4>
                                        <p style={{ fontSize: '0.707rem', color: '#64748B', fontWeight: '500', margin: 0, lineHeight: '1.4' }}>Operational base for handling contacts, payables, receivables, and transactions.</p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--accent-ink)', background: 'var(--accent-tint)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ArrowRight size={15} />
                                </div>
                            </div>

                            {/* Finance Module */}
                            <div
                                data-tour="dashboard-module-finance"
                                style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => navigate('/books/accounting')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: 'var(--accent-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0' }}>Finance</h4>
                                        <p style={{ fontSize: '0.607rem', color: '#64748B', fontWeight: '300', margin: 0, lineHeight: '1.0' }}>Track personal income, fixed costs, and daily expenses with automatic balance calculation.</p>
                                    </div>
                                </div>
                                <div style={{ color: 'var(--accent-ink)', background: 'var(--accent-tint)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ArrowRight size={15} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Operational Health & Metrics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                        
                        {/* Goal Targets Widget */}
                        <div style={{ background: 'white', padding: '1.042rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.77rem' }}>
                                <h3 style={{ fontSize: '0.952rem', fontWeight: '800', color: '#0F172A' }}>Fund Segregation</h3>
                                <Link to="/payments/segregation" style={{ textDecoration: 'none', fontSize: '0.725rem', fontWeight: '700', color: 'var(--accent-ink)' }}>
                                    Manage
                                </Link>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.77rem', padding: '0.68rem 0.816rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9', marginBottom: '0.544rem' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={17} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.634rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Active Wallets</p>
                                    <p style={{ fontSize: '0.861rem', fontWeight: '800', color: '#1E293B', margin: '0.091rem 0 0 0' }}>{stats?.wallets?.total || 0} Established</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.77rem', padding: '0.68rem 0.816rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Plus size={17} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.634rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Target Saved</p>
                                    <p style={{ fontSize: '0.861rem', fontWeight: '800', color: '#1E293B', margin: '0.091rem 0 0 0' }}>{formatCurrency(stats?.wallets?.saved || 0)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shared Cost & Bill Segregation */}
                        <div style={{ background: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', color: 'white', padding: '1.042rem', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(6, 78, 59, 0.15)' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 style={{ fontSize: '0.952rem', fontWeight: '800', marginBottom: '0.363rem' }}>Personalized Bills & Splits</h3>
                                <p style={{ fontSize: '0.725rem', opacity: 0.85, marginBottom: '0.906rem', fontWeight: '500', lineHeight: '1.45' }}>
                                    Manage complex bill cost splits among groups, monitor personal accounting logs, and reconcile joint statements.
                                </p>
                                <Link to="/payments/split-collect" style={{ textDecoration: 'none' }}>
                                    <button style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', background: 'white', color: '#064E3B', border: 'none', fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.453rem', transition: 'all 0.2s' }}>
                                        View Joint Expenses <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                            <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                        </div>

                    </div>
                </div>
            </div>

            {/* Configure Quick Actions Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(6, 78, 59, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            backdropFilter: 'blur(8px)'
                        }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <Motion.div
                            className="dashboard-configure-modal"
                            initial={{ scale: 0.95, opacity: 0, y: 25 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 25 }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                            style={{
                                width: '90%',
                                maxWidth: '460px',
                                background: 'white',
                                borderRadius: '18px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                padding: '1.359rem',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.359rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.223rem', fontWeight: '900', color: '#1E293B', letterSpacing: '-0.5px' }}>Configure Quick Actions</h2>
                                    <p style={{ fontSize: '0.77rem', color: '#64748B', marginTop: '0.317rem', lineHeight: 1.4 }}>Pin your most frequent workflows straight to the Dashboard overview.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="dashboard-configure-modal-close"
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--dm-border, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dm-surface, white)', cursor: 'pointer', flexShrink: 0, color: 'var(--dm-muted, #64748B)' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.589rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1.586rem' }}>
                                {MASTER_SHORTCUTS.map(shortcut => {
                                    const Icon = shortcut.icon;
                                    const isActive = selectedShortcuts.includes(shortcut.id);
                                    return (
                                        <div
                                            key={shortcut.id}
                                            onClick={() => toggleShortcut(shortcut.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.68rem 0.816rem',
                                                borderRadius: '12px',
                                                background: isActive ? `${shortcut.color}10` : 'var(--dm-surface-2, #F8FAFC)',
                                                border: '2px solid',
                                                borderColor: isActive ? shortcut.color : 'var(--dm-border, #F1F5F9)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!isActive) e.currentTarget.style.borderColor = 'var(--dm-muted, #CBD5E1)';
                                            }}
                                            onMouseOut={(e) => {
                                                if (!isActive) e.currentTarget.style.borderColor = 'var(--dm-border, #F1F5F9)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.77rem' }}>
                                                <div style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '10px',
                                                    background: isActive ? `${shortcut.color}15` : 'var(--dm-surface, white)',
                                                    border: isActive ? 'none' : '1px solid var(--dm-border, #E2E8F0)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: isActive ? shortcut.color : '#94A3B8'
                                                }}>
                                                    <Icon size={18} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: '800', fontSize: '0.834rem', color: 'var(--dm-text, #1E293B)' }}>{shortcut.label}</span>
                                                </div>
                                            </div>

                                            {/* Checkbox Switch Indicator */}
                                            <div style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '7px',
                                                border: '2.5px solid',
                                                borderColor: isActive ? shortcut.color : 'var(--dm-muted, #CBD5E1)',
                                                background: isActive ? shortcut.color : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}>
                                                {isActive && <Plus size={14} strokeWidth={3.5} color="white" style={{ transform: 'rotate(45deg)' }} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    width: '100%',
                                    padding: '0.725rem',
                                    borderRadius: '12px',
                                    background: 'var(--primary-gradient)',
                                    color: 'white',
                                    fontWeight: '850',
                                    fontSize: '0.861rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px -5px rgba(27, 107, 58, 0.35)',
                                    letterSpacing: '0.2px'
                                }}
                            >
                                Save Configuration
                            </button>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BooksDashboard;
