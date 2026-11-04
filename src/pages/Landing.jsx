import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, ArrowRight, ShieldCheck, TrendingUp, TrendingDown,
    PlayCircle, Users, Shield, Star, PieChart, CreditCard, LineChart,
    Calendar, Target, UserPlus, Link as LinkIcon, Sparkles, Check,
    BarChart3, Clock, DollarSign, CheckCircle2, ChevronDown,
    Lock, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, Award,
    Sliders, Smartphone, Menu, X, Globe, Layers, AlertCircle
} from 'lucide-react';

import logoPng from '../assets/cliks.png';
import { useAuth } from '../context';

const PRODUCT_DEMOS = [
    {
        id: 'cashflow',
        label: 'Cashflow & Banks',
        icon: Wallet,
        badge: 'Real-Time Sync',
        title: 'Unified Multi-Bank Cashflow & Liquid Reserves',
        description: 'Aggregate current accounts, fixed deposits, credit lines, and cash in hand in one crystal-clear real-time ledger. Automatic categorization with zero manual spreadsheets.',
        stats: [
            { label: 'Total Tracked Net Assets', value: '₹24,85,600.00', trend: '+14.8% YTD', positive: true },
            { label: 'Monthly Inflow (Oct 2026)', value: '₹4,12,800.00', trend: '+8.2%', positive: true },
            { label: 'Monthly Outflow (Spend)', value: '₹2,68,450.00', trend: '-3.1% Controlled', positive: true }
        ],
        transactions: [
            { title: 'Client Retainer — Apex Systems Tech', category: 'Professional Services', date: 'Today, 11:20 am', amount: '+₹1,25,000.00', type: 'in' },
            { title: 'Commercial Office Lease Rent', category: 'Facility Overhead', date: '01 Nov 2026', amount: '-₹48,000.00', type: 'out' },
            { title: 'Quarterly Advance Tax Payment', category: 'Statutory Direct Tax', date: '28 Oct 2026', amount: '-₹32,500.00', type: 'out' },
            { title: 'Index Fund SIP Investment', category: 'Capital Growth Asset', date: '25 Oct 2026', amount: '-₹25,000.00', type: 'out' }
        ]
    },
    {
        id: 'budgets',
        label: 'Budget Guardrails',
        icon: PieChart,
        badge: 'Zero Overspending',
        title: 'Dynamic Budget Envelopes with Overspend Alerts',
        description: 'Set proactive category-level caps for operations, marketing, employee reimbursements, and subscriptions. Get notified before budgets breach, not after.',
        stats: [
            { label: 'Active Monthly Budget', value: '₹3,50,000.00', trend: 'Optimal', positive: true },
            { label: 'Budget Spent So Far', value: '62.4%', trend: 'On Track (Day 18)', positive: true },
            { label: 'Projected Month-End Savings', value: '₹48,500.00', trend: 'Within Safe Margin', positive: true }
        ],
        transactions: [
            { title: 'Software & Cloud Servers (AWS/SaaS)', category: 'Budget: ₹35,000', date: '₹28,400 spent', amount: '81% Utilized', type: 'warning' },
            { title: 'Client Entertainment & Travel', category: 'Budget: ₹50,000', date: '₹22,100 spent', amount: '44% Utilized', type: 'in' },
            { title: 'Logistics & Dispatch Fleet Fuel', category: 'Budget: ₹45,000', date: '₹31,800 spent', amount: '70% Utilized', type: 'in' }
        ]
    },
    {
        id: 'debt',
        label: 'Debt Payoff Radar',
        icon: LineChart,
        badge: 'Optimized Paydown',
        title: 'Accelerated Repayment Timelines & Interest Savings',
        description: 'Consolidate equipment loans, credit cards, and overdrafts. Discover mathematical snowball and avalanche payoff schedules that save thousands in cumulative interest.',
        stats: [
            { label: 'Total Outstanding Liabilities', value: '₹6,40,000.00', trend: '-₹1,80,000 YTD', positive: true },
            { label: 'Accelerated Payoff Date', value: 'March 2028', trend: '14 Months Faster', positive: true },
            { label: 'Calculated Interest Saved', value: '₹84,200.00', trend: 'Optimized Schedule', positive: true }
        ],
        transactions: [
            { title: 'Commercial Machinery Equipment Loan', category: 'HDFC Bank • 9.8% p.a.', date: '₹14,200/mo EMI', amount: '₹3,80,000 Remaining', type: 'out' },
            { title: 'Business Revolving Overdraft Line', category: 'SBI Current • 11.2% p.a.', date: 'Interest Only: ₹2,100', amount: '₹1,50,000 Drawn', type: 'out' },
            { title: 'Corporate Fleet Vehicle Loan', category: 'ICICI Bank • 8.9% p.a.', date: '₹8,800/mo EMI', amount: '₹1,10,000 Remaining', type: 'out' }
        ]
    }
];

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDemoId, setActiveDemoId] = useState('cashflow');
    const [annualPricing, setAnnualPricing] = useState(true);
    const [openFaq, setOpenFaq] = useState(0);

    // Interactive Savings Goal Simulator
    const [monthlyContribution, setMonthlyContribution] = useState(20000);
    const [expectedReturnRate, setExpectedReturnRate] = useState(12);
    const [horizonYears, setHorizonYears] = useState(5);

    const { isAuthenticated, user } = useAuth();

    // Calculate Projected Future Corpus with compounding
    const projectedCorpus = useMemo(() => {
        const monthlyRate = expectedReturnRate / 100 / 12;
        const totalMonths = horizonYears * 12;
        if (monthlyRate === 0) return monthlyContribution * totalMonths;
        const fv = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        return Math.round(fv);
    }, [monthlyContribution, expectedReturnRate, horizonYears]);

    const totalInvestedAmount = useMemo(() => {
        return monthlyContribution * horizonYears * 12;
    }, [monthlyContribution, horizonYears]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/books/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref') || urlParams.get('referral');
        if (refCode && refCode.trim()) {
            const clean = refCode.trim().toUpperCase();
            localStorage.setItem('cliks_referral_code', clean);
            sessionStorage.setItem('cliks_pending_ref', clean);
        }
    }, []);

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref') || urlParams.get('referral') || localStorage.getItem('cliks_referral_code');
        if (refCode && refCode.trim()) {
            const clean = refCode.trim().toUpperCase();
            localStorage.setItem('cliks_referral_code', clean);
            sessionStorage.setItem('cliks_pending_ref', clean);
        }
        const CLIENT_ID = 'cliks-app';
        const REDIRECT_URI = 'https://cliks.beta-softnet.com/auth';
        const BNX_AUTH_URL = 'https://www.b2auth.com';
        const state = 'cliks-auth-state';
        window.location.href = `${BNX_AUTH_URL}/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const activeDemo = PRODUCT_DEMOS.find(d => d.id === activeDemoId) || PRODUCT_DEMOS[0];

    return (
        <div style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#0F172A',
            background: '#FAFCFA',
            minHeight: '100vh',
            overflowX: 'hidden'
        }}>
            {/* 1. TOP ANNOUNCEMENT TICKER */}
            <div style={{
                background: 'linear-gradient(90deg, #064E3B 0%, #1B6B3A 50%, #064E3B 100%)',
                color: '#ECFDF5',
                padding: '0.55rem 1rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
            }}>
                <span style={{
                    background: '#22C55E', color: '#064E3B', padding: '0.15rem 0.5rem',
                    borderRadius: '12px', fontSize: '0.68rem', fontWeight: '900', textTransform: 'uppercase'
                }}>NEW</span>
                <span>Automated Bank Statement OCR Reconciliation & Real-Time Cashflow Predictor.</span>
                <span onClick={() => scrollToSection('features')} style={{ textDecoration: 'underline', cursor: 'pointer', opacity: 0.95 }}>
                    Explore Platform →
                </span>
            </div>

            {/* 2. STICKY GLASS NAVBAR */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(250, 252, 250, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
                transition: 'all 0.25s ease'
            }}>
                <div style={{
                    maxWidth: '1220px',
                    margin: '0 auto',
                    padding: '0.85rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logoPng} alt="CLIKS" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1B6B3A', letterSpacing: '-0.02em' }}>
                            CLIKS
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-only">
                        {[
                            { label: 'Capabilities', target: 'features' },
                            { label: 'Interactive Console', target: 'showcase' },
                            { label: 'Corpus Simulator', target: 'simulator' },
                            { label: 'Pricing Plans', target: 'pricing' }
                        ].map((nav, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToSection(nav.target)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#475569',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#1B6B3A'}
                                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                            >
                                {nav.label}
                            </button>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={handleLogin}
                            style={{
                                background: 'transparent',
                                border: '1px solid #CBD5E1',
                                color: '#1E293B',
                                padding: '0.55rem 1.15rem',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: '750',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.color = '#1B6B3A'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#1E293B'; }}
                        >
                            Sign In
                        </button>

                        <button
                            onClick={handleLogin}
                            style={{
                                background: 'linear-gradient(135deg, #1B6B3A 0%, #228B4C 100%)',
                                border: 'none',
                                color: 'white',
                                padding: '0.58rem 1.35rem',
                                borderRadius: '10px',
                                fontSize: '0.82rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                boxShadow: '0 4px 14px rgba(27, 107, 58, 0.28)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(27, 107, 58, 0.35)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(27, 107, 58, 0.28)'; }}
                        >
                            <span>Open Books Free</span>
                            <ArrowRight size={14} />
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="mobile-toggle"
                            style={{
                                display: 'none',
                                background: 'none',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '0.45rem',
                                cursor: 'pointer'
                            }}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'white',
                                borderBottom: '1px solid #E2E8F0',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >
                            {['features', 'showcase', 'simulator', 'pricing'].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    style={{
                                        background: 'none', border: 'none', textAlign: 'left',
                                        fontSize: '0.95rem', fontWeight: '750', color: '#1E293B', padding: '0.4rem 0'
                                    }}
                                >
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </button>
                            ))}
                            <button
                                onClick={handleLogin}
                                style={{
                                    background: '#1B6B3A', color: 'white', padding: '0.75rem', borderRadius: '10px',
                                    border: 'none', fontWeight: '800', marginTop: '0.5rem'
                                }}
                            >
                                Open Books Free
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 3. HERO SECTION */}
            <section style={{
                padding: '4.5rem 1.5rem 3.5rem',
                maxWidth: '1220px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                {/* Pill */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.35rem 0.95rem',
                        borderRadius: '24px',
                        background: '#DCF2E4',
                        border: '1px solid #A7F3D0',
                        color: '#1B6B3A',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        marginBottom: '1.75rem'
                    }}
                >
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
                    <span>PRECISION FINANCIAL LEDGER FOR PROFESSIONALS & GROWING BUSINESSES</span>
                </motion.div>

                {/* Main Hero Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
                        fontWeight: '900',
                        lineHeight: 1.12,
                        letterSpacing: '-0.035em',
                        color: '#064E3B',
                        maxWidth: '920px',
                        margin: '0 auto 1.35rem'
                    }}
                >
                    Clarity across your accounts, cashflow & assets in one ledger.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                        fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
                        lineHeight: 1.6,
                        color: '#475569',
                        maxWidth: '720px',
                        margin: '0 auto 2.25rem',
                        fontWeight: '500'
                    }}
                >
                    No messy spreadsheets. Connect bank accounts, track debt repayment, automate category budgets, and preserve clean tax-ready financial statements in seconds.
                </motion.p>

                {/* Primary Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '2.75rem'
                    }}
                >
                    <button
                        onClick={handleLogin}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.95rem 2.2rem',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #1B6B3A 0%, #228B4C 100%)',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '850',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(27, 107, 58, 0.28)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(27, 107, 58, 0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(27, 107, 58, 0.28)'; }}
                    >
                        <span>Start Free Workspace</span>
                        <ArrowRight size={17} />
                    </button>

                    <button
                        onClick={() => scrollToSection('showcase')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.95rem 1.85rem',
                            borderRadius: '14px',
                            background: 'white',
                            color: '#1E293B',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.95rem',
                            fontWeight: '750',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B6B3A'; e.currentTarget.style.background = '#F8FAFC'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = 'white'; }}
                    >
                        <PlayCircle size={17} color="#1B6B3A" />
                        <span>Interactive Dashboard Tour</span>
                    </button>
                </motion.div>

                {/* Trust Badges */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    color: '#64748B',
                    fontSize: '0.8rem',
                    fontWeight: '650'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ShieldCheck size={16} color="#1B6B3A" /> Bank-Grade Read-Only Encryption
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} color="#1B6B3A" /> Zero Data Selling Guarantee
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Award size={16} color="#1B6B3A" /> Tax Season Reconciled Reports
                    </span>
                </div>
            </section>

            {/* 4. SHOWCASE: THE INTERACTIVE FINANCIAL CONSOLE */}
            <section id="showcase" style={{
                maxWidth: '1220px',
                margin: '0 auto 5rem',
                padding: '0 1.5rem'
            }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 25px 60px -15px rgba(27, 107, 58, 0.12), 0 0 1px 1px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                }}>
                    {/* Console Header Bar */}
                    <div style={{
                        background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#EF4444' }} />
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#F59E0B' }} />
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#22C55E' }} />
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.02em', color: '#DCF2E4' }}>
                                CLIKS BOOKS CONSOLE • REAL-TIME ASSET & CASHFLOW MONITOR
                            </span>
                        </div>

                        <span style={{
                            padding: '0.2rem 0.65rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.12)',
                            fontSize: '0.72rem',
                            fontWeight: '750',
                            color: '#A7F3D0'
                        }}>
                            ● 4 Bank Accounts Synced
                        </span>
                    </div>

                    {/* Interactive Tab Switcher */}
                    <div style={{
                        display: 'flex',
                        background: '#F8FAFC',
                        borderBottom: '1px solid #E2E8F0',
                        padding: '0.5rem 1rem',
                        overflowX: 'auto',
                        gap: '0.4rem'
                    }}>
                        {PRODUCT_DEMOS.map((demo) => {
                            const isSelected = demo.id === activeDemoId;
                            const IconComp = demo.icon;
                            return (
                                <button
                                    key={demo.id}
                                    onClick={() => setActiveDemoId(demo.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.55rem',
                                        padding: '0.65rem 1.15rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.82rem',
                                        fontWeight: '800',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.15s ease',
                                        background: isSelected ? 'white' : 'transparent',
                                        color: isSelected ? '#1B6B3A' : '#64748B',
                                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                                    }}
                                >
                                    <IconComp size={15} color={isSelected ? '#1B6B3A' : '#94A3B8'} />
                                    <span>{demo.label}</span>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '6px',
                                        background: isSelected ? '#DCF2E4' : '#F1F5F9',
                                        color: isSelected ? '#1B6B3A' : '#94A3B8',
                                        fontWeight: '850'
                                    }}>
                                        {demo.badge}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Console Body */}
                    <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.9fr)', gap: '2rem', alignItems: 'start' }}>
                            {/* Left Text */}
                            <div>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: '900',
                                    color: '#1B6B3A',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'block',
                                    marginBottom: '0.5rem'
                                }}>
                                    CORE FINANCIAL INTELLIGENCE
                                </span>
                                <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                                    {activeDemo.title}
                                </h3>
                                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: '500' }}>
                                    {activeDemo.description}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                    {activeDemo.stats.map((s, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.65rem 0.95rem',
                                            borderRadius: '10px',
                                            background: '#F8FAFC',
                                            border: '1px solid #F1F5F9'
                                        }}>
                                            <span style={{ fontSize: '0.78rem', fontWeight: '650', color: '#64748B' }}>{s.label}</span>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.88rem', fontWeight: '850', color: '#064E3B' }}>{s.value}</div>
                                                <div style={{ fontSize: '0.68rem', fontWeight: '750', color: '#059669' }}>{s.trend}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleLogin}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        borderRadius: '12px',
                                        background: '#1B6B3A',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '800',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span>Experience {activeDemo.label} Free</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>

                            {/* Right Live Simulation Stream */}
                            <div style={{
                                background: '#F8FAFC',
                                borderRadius: '18px',
                                border: '1px solid #E2E8F0',
                                padding: '1.25rem',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0F172A' }}>Real-Time Activity Stream</div>
                                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800' }}>● Auto Categorized</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    {activeDemo.transactions.map((tx, idx) => (
                                        <div key={idx} style={{
                                            background: 'white',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #E2E8F0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0F172A' }}>{tx.title}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{tx.category} • <span style={{ color: '#94A3B8' }}>{tx.date}</span></div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.9rem',
                                                fontWeight: '900',
                                                color: tx.type === 'in' ? '#059669' : (tx.type === 'warning' ? '#D97706' : '#0F172A')
                                            }}>
                                                {tx.amount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. INTERACTIVE CORPUS & WEALTH SIMULATOR */}
            <section id="simulator" style={{
                maxWidth: '1220px',
                margin: '0 auto 5rem',
                padding: '0 1.5rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    color: 'white',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.3fr)',
                    gap: '3rem',
                    alignItems: 'center',
                    boxShadow: '0 20px 50px rgba(27, 107, 58, 0.25)'
                }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            COMPOUND GROWTH SIMULATOR
                        </span>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: '900', lineHeight: 1.2, margin: '0.6rem 0 1rem' }}>
                            Simulate your wealth roadmap with mathematical certainty.
                        </h2>
                        <p style={{ color: '#D1FAE5', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Disciplined cashflow management turns surplus into long-term enterprise value. Test monthly allocation, return rate, and time horizons.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '750', marginBottom: '0.5rem' }}>
                                    <span>Monthly Surplus Reinvested:</span>
                                    <span style={{ color: '#6EE7B7', fontWeight: '900', fontSize: '1rem' }}>₹{monthlyContribution.toLocaleString('en-IN')} / mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="200000"
                                    step="5000"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer' }}
                                />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '750', marginBottom: '0.5rem' }}>
                                    <span>Time Horizon:</span>
                                    <span style={{ color: '#6EE7B7', fontWeight: '900', fontSize: '1rem' }}>{horizonYears} Years</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="1"
                                    value={horizonYears}
                                    onChange={(e) => setHorizonYears(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: '#22C55E', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#A7F3D0', fontWeight: '800', textTransform: 'uppercase' }}>
                                PROJECTED FUTURE WEALTH CORPUS
                            </span>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#FFFFFF', marginTop: '0.35rem' }}>
                                ₹{(projectedCorpus / 100000).toFixed(2)} Lakhs
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#D1FAE5', display: 'block', marginTop: '0.2rem' }}>
                                Calculated using monthly compounding at conservative 12% p.a.
                            </span>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.72rem', color: '#A7F3D0', fontWeight: '800', textTransform: 'uppercase' }}>
                                TOTAL PRINCIPAL ALLOCATED
                            </span>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#FFFFFF', marginTop: '0.35rem' }}>
                                ₹{(totalInvestedAmount / 100000).toFixed(2)} Lakhs
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            style={{
                                background: 'white',
                                color: '#1B6B3A',
                                border: 'none',
                                padding: '0.9rem',
                                borderRadius: '12px',
                                fontWeight: '850',
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                            }}
                        >
                            <span>Start Building Your Wealth In CLIKS</span>
                            <ArrowRight size={15} color="#1B6B3A" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. TRANSPARENT PRICING */}
            <section id="pricing" style={{
                background: '#FFFFFF',
                padding: '5rem 1.5rem',
                borderTop: '1px solid #E2E8F0'
            }}>
                <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#1B6B3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            SIMPLE PRICING
                        </span>
                        <h2 style={{ fontSize: '2.3rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
                            Start free. Upgrade as your assets scale.
                        </h2>
                        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                            No surprise fees. Encrypted financial privacy guaranteed forever.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.75rem',
                        alignItems: 'stretch'
                    }}>
                        {[
                            {
                                name: 'Personal Free',
                                price: '₹0',
                                period: 'forever',
                                desc: 'Essential budgeting and multi-bank tracking for individuals.',
                                features: [
                                    'Up to 2 Linked Bank Accounts',
                                    'Automated Inflow & Outflow Categorization',
                                    'Monthly Expense Breakdown Visuals',
                                    'Standard SSL Data Encryption'
                                ],
                                cta: 'Get Started Free',
                                highlight: false
                            },
                            {
                                name: 'Pro Professional',
                                price: '₹599',
                                period: '/ month',
                                desc: 'Advanced tracking, debt acceleration, and tax deduction tags.',
                                features: [
                                    'Unlimited Bank Accounts & Credit Cards',
                                    'Debt Payoff Snowball & Avalanche Radar',
                                    'Category Budget Guardrails & Alerts',
                                    'Tax-Deductible Expense Tagging',
                                    '1-Click Export for Annual ITR Filing',
                                    'Priority Support Assistance'
                                ],
                                cta: 'Start Pro 14-Day Free Trial',
                                highlight: true
                            },
                            {
                                name: 'Family & Partners',
                                price: '₹999',
                                period: '/ month',
                                desc: 'Collaborative cashflow tracking for families and co-founders.',
                                features: [
                                    'Up to 5 Collaborator Accounts',
                                    'Shared Envelopes & Individual Wallets',
                                    'Split & Collect Settlement Links',
                                    'Joint Investment Asset Tracking',
                                    'Dedicated Support Desk'
                                ],
                                cta: 'Launch Family Plan',
                                highlight: false
                            }
                        ].map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    background: p.highlight ? '#FFFFFF' : '#F8FAFC',
                                    borderRadius: '24px',
                                    border: p.highlight ? '2px solid #1B6B3A' : '1px solid #E2E8F0',
                                    padding: '2.25rem 2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: p.highlight ? '0 20px 40px rgba(27, 107, 58, 0.12)' : 'none'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A' }}>{p.name}</div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.35rem 0 1.25rem' }}>{p.desc}</p>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1.75rem' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1B6B3A' }}>{p.price}</span>
                                        <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: '600' }}>{p.period}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                        {p.features.map((feat, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#334155', fontWeight: '600' }}>
                                                <CheckCircle2 size={16} color="#1B6B3A" style={{ flexShrink: 0 }} />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogin}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: '850',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        background: p.highlight ? 'linear-gradient(135deg, #1B6B3A 0%, #228B4C 100%)' : '#E2E8F0',
                                        color: p.highlight ? 'white' : '#1E293B',
                                        boxShadow: p.highlight ? '0 4px 14px rgba(27, 107, 58, 0.28)' : 'none'
                                    }}
                                >
                                    {p.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. REFINED FOOTER */}
            <footer style={{
                background: '#064E3B',
                color: 'rgba(255,255,255,0.7)',
                padding: '3rem 1.5rem 2rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.8rem'
            }}>
                <div style={{
                    maxWidth: '1220px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={logoPng} alt="CLIKS" style={{ width: '28px', height: '28px' }} />
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: 'white' }}>CLIKS Books</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span onClick={() => scrollToSection('features')} style={{ cursor: 'pointer' }}>Features</span>
                        <span onClick={() => scrollToSection('simulator')} style={{ cursor: 'pointer' }}>Simulator</span>
                        <span onClick={() => scrollToSection('pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
                        <span onClick={handleLogin} style={{ cursor: 'pointer', color: '#6EE7B7' }}>Sign In</span>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1220px',
                    margin: '2rem auto 0',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.45)'
                }}>
                    <span>© {new Date().getFullYear()} CLIKS. All rights reserved. Precision financial software.</span>
                    <span>Encrypted with Bank-Grade TLS • Zero Data Sharing</span>
                </div>
            </footer>
        </div>
    );
}
