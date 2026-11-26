import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrency, useLanguage } from '../../context';
import { LayoutDashboard, Package, Users, Wallet, SplitSquareVertical, ArrowRight,
    ArrowUpRight, ArrowDownLeft,Search, Bell, Settings, Activity, Plus, Loader2, TrendingUp,
    Target, Clock, PiggyBank, FileText, ShieldCheck, Briefcase, X, Calendar, Award} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../../services';
import '../../App.css';

const MASTER_SHORTCUTS = [
    { id: 'stock_management', label: 'Stock Management', path: '/inventory/stock', icon: LayoutDashboard, color: '#1B6B3A' },
    { id: 'people_hub', label: 'People Hub', path: '/people', icon: Users, color: '#2563EB' },
    { id: 'expenses', label: 'Expenses', path: '/finance/expenses', icon: FileText, color: '#DC2626' },
    { id: 'budgets', label: 'Budgets & Planning', path: '/finance/budgets', icon: PiggyBank, color: '#D97706' },
    { id: 'split_collect', label: 'Split & Collect', path: '/books/split-collect', icon: Wallet, color: '#059669' },
    { id: 'segregation', label: 'Segregation', path: '/finance/segregation', icon: SplitSquareVertical, color: '#7C3AED' },
    { id: 'planner', label: 'Planner & Reminders', path: '/planner', icon: Calendar, color: '#0284C7' },
    { id: 'rewards', label: 'Rewards & Benefits', path: '/payments/rewards', icon: Award, color: '#E11D48' },
    { id: 'investments', label: 'Investments', path: '/finance/investments', icon: ArrowUpRight, color: '#EA580C' },
    { id: 'debts', label: 'Debts & Loans', path: '/finance/debts', icon: ShieldCheck, color: '#65A30D' },
    { id: 'ca_hub', label: 'FIN-PRO CA Hub', path: '/ca', icon: Briefcase, color: '#004aad' },
    { id: 'finance_module', label: 'Finance', path: '/books/accounting', icon: TrendingUp, color: '#1B6B3A' },
];

const BooksDashboard = () => {
    const navigate = useNavigate();
    const { formatCurrency } = useCurrency();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedShortcuts, setSelectedShortcuts] = useState(() => {
        const default6 = ['stock_management', 'people_hub', 'expenses', 'budgets', 'split_collect', 'segregation'];
        const saved = localStorage.getItem('cliks_books_shortcuts');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 6) {
                localStorage.setItem('cliks_books_shortcuts', JSON.stringify(default6));
                return default6;
            }
            return parsed;
        }
        localStorage.setItem('cliks_books_shortcuts', JSON.stringify(default6));
        return default6;
    });

    const [searchTerm, setSearchTerm] = useState('');

    const toggleShortcut = (id) => {
        setSelectedShortcuts(prev => {
            const next = prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id];
            localStorage.setItem('cliks_books_shortcuts', JSON.stringify(next));
            return next;
        });
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
    }, [refetch]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={48} className="animate-spin" color="#1B6B3A" />
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
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '0.589rem 1.359rem',
                            borderRadius: '12px',
                            background: '#1B6B3A',
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
                        <div key={idx} className="dashboard-stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.544rem' }}>
                                <div
                                    style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}
                                >
                                    <stat.icon size={17} />
                                </div>
                                <span style={{ fontSize: '0.652rem', fontWeight: '700', color: '#059669', background: '#F0FDF4', padding: '0.181rem 0.408rem', borderRadius: '6px' }}>{stat.change}</span>
                            </div>
                            <h3
                                style={{ fontSize: '0.725rem', fontWeight: '600', color: '#64748B', marginBottom: '0.227rem', width: 'fit-content' }}
                            >
                                {stat.label}
                            </h3>
                            <h2 style={{ fontSize: '1.223rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>{stat.value}</h2>
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
                                                    onClick={() => navigate(shortcut.path)}
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
                    <div className="dashboard-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem', background: 'white', padding: '1.042rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '0.952rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>Modules & Management Suite</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem' }}>
                            {/* Inventory Module */}
                            <div style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/books/stock')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0' }}>Inventory & Stocks</h4>
                                        <p style={{ fontSize: '0.707rem', color: '#64748B', fontWeight: '500', margin: 0, lineHeight: '1.4' }}>Real-time overview of products, stock alerts, and individual restock thresholds.</p>
                                    </div>
                                </div>
                                <div style={{ color: '#1B6B3A', background: '#DCF2E4', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ArrowRight size={15} />
                                </div>
                            </div>

                            {/* People Module */}
                            <div style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/books/people')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0', width: 'fit-content' }}>People Hub</h4>
                                        <p style={{ fontSize: '0.707rem', color: '#64748B', fontWeight: '500', margin: 0, lineHeight: '1.4' }}>Operational base for handling contacts, payables, receivables, and transactions.</p>
                                    </div>
                                </div>
                                <div style={{ color: '#1B6B3A', background: '#DCF2E4', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <ArrowRight size={15} />
                                </div>
                            </div>

                            {/* Finance Module */}
                            <div style={{ padding: '0.816rem 0.906rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => navigate('/books/accounting')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'white', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.181rem 0' }}>Finance</h4>
                                        <p style={{ fontSize: '0.607rem', color: '#64748B', fontWeight: '300', margin: 0, lineHeight: '1.0' }}>Track personal income, fixed costs, and daily expenses with automatic balance calculation.</p>
                                    </div>
                                </div>
                                <div style={{ color: '#1B6B3A', background: '#DCF2E4', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                                <Link to="/payments/segregation" style={{ textDecoration: 'none', fontSize: '0.725rem', fontWeight: '700', color: '#1B6B3A' }}>
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
                                    background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
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
