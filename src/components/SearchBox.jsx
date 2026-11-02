import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, LayoutDashboard, TrendingUp, Users, DollarSign,
    ShoppingCart, ShoppingBag, Boxes, UserCheck, Briefcase,
    Settings, HelpCircle, CreditCard, Zap, Wallet, ArrowLeftRight,
    Target, Gift, BarChart3, Split, Calculator, Receipt,
    Landmark, PiggyBank, LineChart, FileCheck, Bell, User,
    Home, BookOpen, Globe, Star, Calendar, Clock, Tag, ShieldCheck,
    CheckCircle2, AlertCircle, ArrowDownRight, Sliders, Monitor, Barcode, Plus, Coins,
    Percent
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   SEARCH INDEX
   Comprehensive index covering every main module, submodule,
   internal feature, action, and tool.
───────────────────────────────────────────────────────────────── */
const SHOW_BETA_CLUB_UI = true;

const SEARCH_INDEX = [
    // ── Primary Modules ──────────────────────────────────────────
    { label: 'Books Workspace',      path: '/books/dashboard',           icon: BookOpen,        category: 'Books',       type: 'Module',   desc: 'Enterprise ERP, Invoicing & Accounts', keywords: ['books', 'erp', 'business', 'company', 'workspace'] },
    { label: 'Payments Workspace',   path: '/payments/people',           icon: CreditCard,      category: 'Payments',    type: 'Module',   desc: 'Cash Flow Engine, Escrow & P2P Ledger', keywords: ['payments', 'finance', 'billing', 'upi', 'cash flow', 'escrow', 'money'] },
    { label: 'Social Workspace',     path: '/social/betaclub',           icon: Users,           category: 'Social',      type: 'Module',   desc: 'Founder Community & Trading Documents', keywords: ['social', 'network', 'chat', 'feed', 'pitches', 'community'] },
    { label: 'Access Kit Tools',     path: '/beta-launcher',             icon: Sliders,         category: 'Tools',       type: 'Module',   desc: 'Floating Utilities & Financial Calculators', keywords: ['access kit', 'beta products', 'launcher', 'apps', 'utilities', 'sidebar tools'] },

    // ── Books Hubs & Submodules ───────────────────────────────────
    { label: 'Dashboard',            path: '/books/dashboard',           icon: LayoutDashboard, category: 'Books',       type: 'Page',     desc: 'Financial Overview, Net Worth & Quick Stats', keywords: ['dashboard', 'home', 'overview', 'console', 'books', 'metrics'] },
    { label: 'Stock & Inventory',    path: '/books/stock',               icon: Boxes,           category: 'Books',       type: 'Page',     desc: 'Products, inventory valuation & stock tracking', keywords: ['stock', 'inventory', 'assets', 'items', 'products', 'levels'] },
    { label: 'People Network',       path: '/payments/people',           icon: Users,           category: 'Payments',    type: 'Page',     desc: 'Contacts, counterparty ledgers & friendly advances', keywords: ['people', 'contacts', 'customers', 'clients', 'parties', 'ledger'] },
    { label: 'Report & Analytics',   path: '/books',                     icon: BarChart3,        category: 'Books',       type: 'Page',     desc: 'Financial performance summaries & charts', keywords: ['report', 'analytics', 'summary', 'charts', 'financial reports'] },
    { label: 'FIN-PRO CA Audit Hub', path: '/ca',                        icon: Briefcase,       category: 'Audit',       type: 'Page',     desc: 'Chartered Accountant portal, Section 43B(h) MSME & Form 3CD', keywords: ['finpro', 'fin-pro', 'audit', 'ca', 'chartered', 'auditor', 'tax audit', 'msme'] },

    // ── Payments Hub & Cash Flow Engine ──────────────────────────
    { label: 'Payments Dashboard',   path: '/payments/people',           icon: DollarSign,      category: 'Payments',    type: 'Page',     desc: 'Cash Flow Engine, receivables & payables', keywords: ['payments dashboard', 'cash flow', 'money hub'] },
    { label: 'Add Transaction',      path: '/payments/people?action=log',icon: Plus,            category: 'Payments',    type: 'Action',   desc: 'Record money entry, payment, expense or transfer', keywords: ['add transaction', 'log transaction', 'money entry', 'record payment', 'transfer note'] },
    { label: 'Add People Contact',   path: '/payments/people?action=add',icon: Plus,            category: 'Payments',    type: 'Action',   desc: 'Register a new person, peer or company contact', keywords: ['add people contact', 'new person', 'add contact', 'new peer'] },
    { label: 'Outstanding Receivables',path: '/payments/people?tab=rec', icon: TrendingUp,      category: 'Payments',    type: 'Internal', desc: 'Money owed to you from customers and peers', keywords: ['outstanding receivables', 'receivables card', 'money owed', 'due to me'] },
    { label: 'Outstanding Payables', path: '/payments/people?tab=pay',   icon: ArrowDownRight,  category: 'Payments',    type: 'Internal', desc: 'Money you owe to suppliers, lenders and vendors', keywords: ['outstanding payables', 'payables card', 'due money', 'pending payments'] },
    { label: 'Segregation Wallets',  path: '/payments/segregation',      icon: Target,          category: 'Payments',    type: 'Page',     desc: 'Allocate funds to specific purpose goal wallets', keywords: ['segregation', 'purpose wallets', 'target funds', 'envelope', 'goals'] },
    { label: 'Split & Collect',      path: '/payments/split-collect',    icon: Split,           category: 'Payments',    type: 'Page',     desc: 'Group expense sharing and bill splitting', keywords: ['split and collect', 'split expense', 'group bill', 'share bill', 'split payment'] },
    { label: 'Financial Planner',    path: '/payments/planner',          icon: Calendar,        category: 'Payments',    type: 'Page',     desc: 'Schedule recurring payment reminders & EMI deadlines', keywords: ['planner', 'financial plan', 'plan', 'recurring payments', 'calendar reminders'] },
    { label: 'Loyalty Points & Store Rewards', path: '/payments/loyalty', icon: Coins,           category: 'Payments',    type: 'Page',     desc: 'Shop-wise loyalty balances, point ledger & purchase invoices', keywords: ['loyalty', 'loyalty points', 'store points', 'shop points', 'reward points', 'cashback', 'point history'] },
    { label: 'Rewards & Offers',     path: '/payments/rewards-offers',   icon: Gift,            category: 'Payments',    type: 'Page',     desc: 'Earned cashback points, partner deals and loyalty perks', keywords: ['reward', 'offer', 'points', 'loyalty', 'cashback', 'perks'] },
    { label: 'Wallet & Cash Balance',path: '/payments/wallet',           icon: Wallet,          category: 'Payments',    type: 'Page',     desc: 'View personal wallet balance and add funds', keywords: ['wallet', 'money', 'balance', 'add money', 'cash balance'] },
    { label: 'Transaction History',  path: '/payments/transactions',     icon: ArrowLeftRight,  category: 'Payments',    type: 'Page',     desc: 'Comprehensive bank transfer and payment history', keywords: ['transaction', 'history', 'transfer', 'payment ledger'] },

    // ── Finance, Accounting & Tax ────────────────────────────────
    { label: 'Accounting & Ledger',  path: '/books/accounting',          icon: Calculator,      category: 'Finance',     type: 'Page',     desc: 'Double-entry general ledger, daybook & chart of accounts', keywords: ['accounting', 'acct', 'general ledger', 'daybook', 'ledger', 'chart of accounts'] },
    { label: 'Profit & Loss (P&L)',  path: '/books/accounting?tab=pnl',  icon: TrendingUp,      category: 'Finance',     type: 'Internal', desc: 'Revenue, gross profit, operating costs and net margin', keywords: ['profit and loss', 'p&l', 'income statement', 'gross profit', 'net profit'] },
    { label: 'Income & Revenue',     path: '/books/income',              icon: TrendingUp,      category: 'Finance',     type: 'Page',     desc: 'Record and track non-invoice revenue & earnings', keywords: ['income', 'revenue', 'earnings', 'salary', 'add income'] },
    { label: 'Expenses Tracker',     path: '/books/expenses',            icon: ShoppingCart,    category: 'Finance',     type: 'Page',     desc: 'Operational expense logs, category breakdown and receipts', keywords: ['expense', 'expenses', 'spend', 'cost', 'expenditure', 'add expense'] },
    { label: 'Add Income',           path: '/books/income?create=true',  icon: Plus,            category: 'Finance',     type: 'Action',   desc: 'Add a new revenue or income entry', keywords: ['add income', 'log revenue', 'record earnings', 'new income'] },
    { label: 'Add Expense',          path: '/books/expenses?create=true',icon: Plus,            category: 'Finance',     type: 'Action',   desc: 'Add a new business expense or payment receipt', keywords: ['add expense', 'log expense', 'record spend', 'new expense'] },
    { label: 'Tax Deductions',       path: '/books/tax-deductions',      icon: Percent,         category: 'Finance',     type: 'Page',     desc: 'Section 80C, 80D tax exemptions & regime optimizer', keywords: ['tax deductions', 'section 80c', 'section 80d', 'tax saving', 'old vs new regime'] },
    { label: 'Purchase Details',     path: '/books/purchase-details',    icon: ShoppingBag,     category: 'Purchases',   type: 'Page',     desc: 'Inward purchase logs, supplier invoices & orders', keywords: ['purchase details', 'purchases', 'vendor bills', 'inward bills'] },
    { label: 'Staff Details & Pay',  path: '/books/finance/staff-details',icon: UserCheck,      category: 'HR',          type: 'Page',     desc: 'Employee salary registers and staff payroll advances', keywords: ['staff details', 'employee pay', 'salary register', 'hr'] },

    // ── Simple Billing & Records ─────────────────────────────────
    { label: 'Simple Billing',       path: '/books/track/simple-billing',icon: Receipt,         category: 'Billing',     type: 'Page',     desc: 'Fast thermal receipt generator with dynamic line items', keywords: ['simple billing', 'quick bill', 'thermal bill', 'cash memo', 'fast receipt'] },
    { label: 'Billing Records',      path: '/books/track/billing-records',icon: FileCheck,      category: 'Billing',     type: 'Page',     desc: 'Archive of submitted quick bills and sales records', keywords: ['billing records', 'past bills', 'bills history', 'receipt archive'] },

    // ── Social & Community ───────────────────────────────────────
    { label: SHOW_BETA_CLUB_UI ? 'Beta Club Page' : 'Meetup', path: '/social/meetup', icon: Users, category: 'Social', type: 'Page', desc: 'Founder community feed, venture pitches and networking', keywords: SHOW_BETA_CLUB_UI ? ['beta', 'club', 'meetup', 'event', 'social', 'network', 'pitches'] : ['meetup', 'event', 'social', 'network'] },
    { label: 'Trading Docs',         path: '/social/trading',            icon: LineChart,       category: 'Social',      type: 'Page',     desc: 'Company shares, legal contracts & market agreements', keywords: ['trading', 'docs', 'market', 'trade', 'shares', 'contracts'] },
    { label: 'Beta Club Feed',       path: '/social/beta-club',          icon: Star,            category: 'Social',      type: 'Page',     desc: 'Startup community updates, founder ideas & investors', keywords: ['beta', 'club', 'investor', 'founders', 'pitches'] },

    // ── Access Kit & Tools ───────────────────────────────────────
    { label: 'Calculator Utility',   path: '__CALC__',                   icon: Calculator,      category: 'Tools',       type: 'Tool',     desc: 'GST tax computation, margin and discount calculator', keywords: ['calculator', 'calc', 'math', 'compute', 'tax', 'gst calculator'] },
    { label: 'Refer & Earn Program', path: '/referral',                  icon: Gift,            category: 'Tools',       type: 'Tool',     desc: 'Share your referral code and earn bonus points', keywords: ['referral', 'refer and earn', 'invite friends', 'reward code'] },
    { label: 'Settings',             path: '/books/settings',            icon: Settings,        category: 'System',      type: 'Page',     desc: 'Application configuration, branding and preferences', keywords: ['setting', 'config', 'preference', 'appearance', 'dark mode', 'theme'] },
    { label: 'Help & Support',       path: '/books/faq',                 icon: HelpCircle,      category: 'System',      type: 'Page',     desc: 'Frequently asked questions and customer support desk', keywords: ['help', 'faq', 'support', 'ticket', 'question', 'guide'] },
    { label: 'Subscription & Plans', path: '/subscription',              icon: CreditCard,      category: 'System',      type: 'Page',     desc: 'Manage your active plan, upgrade and renewal status', keywords: ['subscription', 'plan', 'billing', 'upgrade', 'premium', 'license tier'] },
    { label: 'User Profile & KYC',   path: '/books/profile',             icon: User,            category: 'System',      type: 'Page',     desc: 'Profile details, business name, avatar and email', keywords: ['profile', 'account', 'user', 'name', 'avatar', 'kyc'] }
];

/* ─── Enhanced scoring algorithm ─────────────────────────────── */
const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

const scoreItem = (item, query) => {
    const q = normalize(query);
    if (!q) return -1;
    const labelN = normalize(item.label);
    const catN   = normalize(item.category);
    const descN  = normalize(item.desc || '');
    const typeN  = normalize(item.type || '');
    const qWords = q.split(/\s+/).filter(Boolean);

    // Exact label match
    if (labelN === q) return 120;
    if (labelN.startsWith(q)) return 95;
    if (labelN.includes(q)) return 75;

    // Category or Type match
    if (catN.includes(q)) return 65;
    if (typeN.includes(q)) return 55;

    // Keywords match
    for (const kw of (item.keywords || [])) {
        const kwN = normalize(kw);
        if (kwN === q)          return 90;
        if (kwN.startsWith(q))  return 75;
        if (kwN.includes(q))    return 60;
    }

    // Description match
    if (descN.includes(q)) return 40;

    // Multi-word partial matching: if all words match somewhere
    if (qWords.length > 1) {
        const allWordsFound = qWords.every(w =>
            labelN.includes(w) ||
            catN.includes(w) ||
            descN.includes(w) ||
            (item.keywords || []).some(k => normalize(k).includes(w))
        );
        if (allWordsFound) return 70;
    }

    return -1;
};

const searchItems = (query, max = 50) => {
    if (!query || normalize(query).length < 1) return [];
    return SEARCH_INDEX
        .map(item => ({ item, score: scoreItem(item, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, max)
        .map(({ item }) => item);
};

/* ─── SearchBox component ─────────────────────────────────────── */
const SearchBox = ({ onOpenCalculator }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const wrapperRef = useRef(null);
    const inputRef   = useRef(null);
    const debounceRef = useRef(null);

    const expand = () => {
        setIsExpanded(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => inputRef.current?.focus());
        });
    };

    const collapse = () => {
        setIsExpanded(false);
        setIsDropdownOpen(false);
        setQuery('');
        setResults([]);
        inputRef.current?.blur();
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setActiveIdx(0);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const found = searchItems(val);
            setResults(found);
            setIsDropdownOpen(val.trim().length > 0);
        }, 120);
    };

    const handleSelect = useCallback((item) => {
        if (!item) return;
        if (item.path === '__CALC__') {
            if (onOpenCalculator) onOpenCalculator();
        } else {
            navigate(item.path);
        }
        collapse();
    }, [navigate, onOpenCalculator]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            collapse();
            return;
        }
        if (!isDropdownOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[activeIdx]) handleSelect(results[activeIdx]);
            else if (!query.trim()) collapse();
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                collapse();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    return (
        <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {!isExpanded && (
                <button
                    onClick={expand}
                    aria-label="Open search"
                    title="Search all features & tools"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '34px',
                        height: '34px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        padding: 0,
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                    <Search size={15} color="rgba(255,255,255,0.85)" />
                </button>
            )}

            {isExpanded && (
                <div
                    className="topbar-search-input-box"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.14)',
                        border: '1px solid rgba(255,255,255,0.28)',
                        width: 'clamp(180px, 18vw, 260px)',
                        animation: 'searchExpand 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    <Search size={15} color="rgba(255,255,255,0.8)" style={{ flexShrink: 0 }} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search all features..."
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { if (query.trim()) setIsDropdownOpen(true); }}
                        aria-label="Global search"
                        aria-autocomplete="list"
                        aria-expanded={isDropdownOpen}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            color: '#ffffff',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            width: '100%',
                            minWidth: 0,
                            padding: 0,
                        }}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>×</span>
                        </button>
                    )}
                </div>
            )}

            {/* ── Dropdown results ── */}
            {isDropdownOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 'clamp(320px, 32vw, 420px)',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.08)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    zIndex: 9999,
                    maxHeight: '440px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Results count header bar */}
                    <div style={{
                        padding: '8px 14px',
                        background: '#F8FAFC',
                        borderBottom: '1px solid #F1F5F9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#334155' }}>
                            {results.length} {results.length === 1 ? 'Feature found' : 'Features found'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>
                            ↑↓ to navigate • ↵ select • ESC close
                        </span>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                        {results.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>
                                No matching features found for "{query}"
                            </div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {results.map((item, i) => {
                                    const Icon = item.icon || Info;
                                    const isActive = i === activeIdx;
                                    return (
                                        <li key={`${item.path}-${i}`}>
                                            <button
                                                onMouseEnter={() => setActiveIdx(i)}
                                                onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '8px 14px',
                                                    border: 'none',
                                                    background: isActive ? '#F0FDF4' : 'transparent',
                                                    borderLeft: isActive ? '3px solid #16A34A' : '3px solid transparent',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.12s ease',
                                                }}
                                            >
                                                <span style={{
                                                    width: 32, height: 32, borderRadius: 8,
                                                    background: isActive ? '#DCFCE7' : '#F1F5F9',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <Icon size={15} color={isActive ? '#15803D' : '#64748B'} />
                                                </span>
                                                <span style={{ flex: 1, minWidth: 0 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '9px', fontWeight: '850', color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                            {item.category}
                                                        </span>
                                                        {item.type && (
                                                            <span style={{ fontSize: '9px', fontWeight: '750', color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px' }}>
                                                                {item.type}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span style={{ display: 'block', fontSize: '0.84rem', fontWeight: 750, color: isActive ? '#15803D' : '#1E293B', lineHeight: 1.3 }}>
                                                        {item.label}
                                                    </span>
                                                    {item.desc && (
                                                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                                                            {item.desc}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes searchExpand {
                    from { opacity: 0; transform: scaleX(0.6); transform-origin: left; }
                    to   { opacity: 1; transform: scaleX(1);   transform-origin: left; }
                }
            `}</style>
        </div>
    );
};

export default SearchBox;
