import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
    Wallet, ArrowRight, ShieldCheck, TrendingUp, TrendingDown,
    PlayCircle, Users, Shield, Star, PieChart, CreditCard, LineChart,
    Calendar, Target, Sparkles, Check, BarChart3, Clock, DollarSign,
    CheckCircle2, ChevronDown, Lock, ArrowUpRight, ArrowDownRight,
    RefreshCw, Zap, Award, Sliders, Smartphone, Menu, X, Globe,
    Layers, AlertCircle, FileSpreadsheet, Building, HelpCircle
} from 'lucide-react';

import logoPng from '../assets/cliks.png';
import { useAuth } from '../context';

// Animated Count-Up on Viewport Entrance
function StatCounter({ end, prefix = '', suffix = '', duration = 1600 }) {
    const [displayVal, setDisplayVal] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.25 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayVal(Math.floor(easeOut * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplayVal(end);
            }
        };
        window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref}>
            {prefix}{displayVal.toLocaleString('en-IN')}{suffix}
        </span>
    );
}

// Magnetic Mouse Cursor Spotlight Card
function SpotlightCard({ children, style = {}, className = '', isHighlighted = false }) {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '22px',
                border: isHighlighted
                    ? '2px solid #1B6B3A'
                    : (isHovered ? '1px solid #22C55E' : '1px solid #E2E8F0'),
                background: '#FFFFFF',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                boxShadow: isHighlighted
                    ? '0 20px 45px -10px rgba(27, 107, 58, 0.18)'
                    : (isHovered
                        ? '0 20px 40px -15px rgba(27, 107, 58, 0.12), 0 0 1px 1px rgba(34, 197, 94, 0.15)'
                        : '0 4px 6px -1px rgba(0,0,0,0.02)'),
                ...style
            }}
        >
            {/* Spotlight Gradient */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 197, 94, 0.09), transparent 80%)`,
                    zIndex: 1
                }}
            />
            <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </motion.div>
    );
}

const PRODUCT_DEMOS = [
    {
        id: 'cashflow',
        label: 'Cashflow & Banks',
        icon: Wallet,
        badge: 'Real-Time Sync',
        title: 'Unified Multi-Bank Cashflow & Liquid Reserves',
        description: 'Aggregate current accounts, fixed deposits, credit lines, and petty cash in one crystal-clear real-time ledger. Automatic categorization with zero manual spreadsheets.',
        stats: [
            { label: 'Total Tracked Net Assets', value: '₹24,85,600.00', trend: '+14.8% YTD', positive: true },
            { label: 'Monthly Inflow (Current)', value: '₹4,12,800.00', trend: '+8.2%', positive: true },
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
            { title: 'Cloud Servers & Infrastructure (AWS)', category: 'Budget: ₹35,000', date: '₹28,400 spent', amount: '81% Utilized', type: 'warning', percent: 81 },
            { title: 'Logistics & Dispatch Fleet Fuel', category: 'Budget: ₹45,000', date: '₹31,800 spent', amount: '70% Utilized', type: 'in', percent: 70 },
            { title: 'Client Entertainment & Travel', category: 'Budget: ₹50,000', date: '₹22,100 spent', amount: '44% Utilized', type: 'in', percent: 44 }
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

    // Interactive Console state
    const [cashflowFilter, setCashflowFilter] = useState('all'); // 'all', 'in', 'out'
    const [paydownStrategy, setPaydownStrategy] = useState('avalanche'); // 'avalanche' | 'snowball'

    // Interactive Savings Goal Simulator
    const [monthlyContribution, setMonthlyContribution] = useState(25000);
    const [expectedReturnRate, setExpectedReturnRate] = useState(12);
    const [horizonYears, setHorizonYears] = useState(7);

    const { isAuthenticated, user } = useAuth();

    // Scroll Progress Spring Hook
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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

    const wealthGained = useMemo(() => {
        return Math.max(0, projectedCorpus - totalInvestedAmount);
    }, [projectedCorpus, totalInvestedAmount]);

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
        const redirectUri = encodeURIComponent(window.location.origin + '/auth');
        const BNX_AUTH_URL = 'https://www.b2auth.com';
        const state = 'cliks-auth-state';
        window.location.href = `${BNX_AUTH_URL}/?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const activeDemo = PRODUCT_DEMOS.find(d => d.id === activeDemoId) || PRODUCT_DEMOS[0];

    const filteredTransactions = useMemo(() => {
        if (activeDemoId !== 'cashflow') return activeDemo.transactions;
        if (cashflowFilter === 'in') return activeDemo.transactions.filter(t => t.type === 'in');
        if (cashflowFilter === 'out') return activeDemo.transactions.filter(t => t.type === 'out');
        return activeDemo.transactions;
    }, [activeDemoId, activeDemo, cashflowFilter]);

    return (
        <div style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#0F172A',
            background: '#FAFCFA',
            minHeight: '100vh',
            overflowX: 'hidden'
        }}>
            {/* TOP SCROLL PROGRESS BAR */}
            <motion.div
                style={{
                    scaleX,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #1B6B3A 0%, #22C55E 100%)',
                    transformOrigin: '0%',
                    zIndex: 9999
                }}
            />

            {/* 1. TOP ANNOUNCEMENT TICKER */}
            <div style={{
                background: 'linear-gradient(90deg, #064E3B 0%, #1B6B3A 50%, #064E3B 100%)',
                color: '#ECFDF5',
                padding: '0.498rem 0.906rem',
                fontSize: '0.707rem',
                fontWeight: '700',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.544rem'
            }}>
                <span style={{
                    background: '#22C55E', color: '#064E3B', padding: '0.136rem 0.453rem',
                    borderRadius: '12px', fontSize: '0.616rem', fontWeight: '900', textTransform: 'uppercase'
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
                    padding: '0.77rem 1.359rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logoPng} alt="CLIKS" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.133rem', fontWeight: '900', color: '#1B6B3A', letterSpacing: '-0.02em' }}>
                            CLIKS Books
                        </span>
                    </div>

                    {/* Nav Items */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1.812rem' }} className="desktop-only">
                        {[
                            { label: 'Capabilities', target: 'features' },
                            { label: 'Interactive Console', target: 'showcase' },
                            { label: 'Corpus Simulator', target: 'simulator' },
                            { label: 'Pricing Plans', target: 'pricing' },
                            { label: 'FAQ', target: 'faq' }
                        ].map((nav, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToSection(nav.target)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#475569',
                                    fontWeight: '700',
                                    fontSize: '0.77rem',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                        <button
                            onClick={handleLogin}
                            style={{
                                background: 'transparent',
                                border: '1px solid #CBD5E1',
                                color: '#1E293B',
                                padding: '0.498rem 1.042rem',
                                borderRadius: '10px',
                                fontSize: '0.743rem',
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
                                padding: '0.526rem 1.223rem',
                                borderRadius: '10px',
                                fontSize: '0.743rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.408rem',
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
                                padding: '0.408rem',
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
                                padding: '1.133rem 1.359rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.906rem'
                            }}
                        >
                            {['features', 'showcase', 'simulator', 'pricing', 'faq'].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    style={{
                                        background: 'none', border: 'none', textAlign: 'left',
                                        fontSize: '0.861rem', fontWeight: '750', color: '#1E293B', padding: '0.363rem 0'
                                    }}
                                >
                                    {id.charAt(0).toUpperCase() + id.slice(1)}
                                </button>
                            ))}
                            <button
                                onClick={handleLogin}
                                style={{
                                    background: '#1B6B3A', color: 'white', padding: '0.68rem', borderRadius: '10px',
                                    border: 'none', fontWeight: '800', marginTop: '0.453rem'
                                }}
                            >
                                Open Books Free
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 3. HERO SECTION WITH FLOATING AMBIENT PILLS */}
            <section style={{
                position: 'relative',
                padding: '4.078rem 1.359rem 3.172rem',
                maxWidth: '1220px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                {/* Floating Transaction Badge 1 (Left) */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        left: '2%',
                        top: '25%',
                        display: 'none',
                        background: 'white',
                        padding: '0.589rem 0.906rem',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08)',
                        alignItems: 'center',
                        gap: '0.589rem',
                        zIndex: 10
                    }}
                    className="hero-badge-left"
                >
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowDownRight size={18} color="#1B6B3A" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#0F172A' }}>Client Retainer Received</div>
                        <div style={{ fontSize: '0.616rem', color: '#059669', fontWeight: '700' }}>+₹1,25,000.00 • Reconciled</div>
                    </div>
                </motion.div>

                {/* Floating Transaction Badge 2 (Right) */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        right: '2%',
                        top: '32%',
                        display: 'none',
                        background: 'white',
                        padding: '0.589rem 0.906rem',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08)',
                        alignItems: 'center',
                        gap: '0.589rem',
                        zIndex: 10
                    }}
                    className="hero-badge-right"
                >
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PieChart size={18} color="#D97706" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#0F172A' }}>Monthly Budget Cap</div>
                        <div style={{ fontSize: '0.616rem', color: '#D97706', fontWeight: '700' }}>62% Spent • ₹48.5k Remaining</div>
                    </div>
                </motion.div>

                {/* Hero Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.453rem',
                        padding: '0.317rem 0.861rem',
                        borderRadius: '16px',
                        background: '#DCF2E4',
                        border: '1px solid #A7F3D0',
                        color: '#1B6B3A',
                        fontSize: '0.707rem',
                        fontWeight: '800',
                        marginBottom: '1.586rem'
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
                        fontSize: 'clamp(2.175rem, 5.2vw, 3.444rem)',
                        fontWeight: '900',
                        lineHeight: 1.12,
                        letterSpacing: '-0.035em',
                        color: '#064E3B',
                        maxWidth: '920px',
                        margin: '0 auto 1.223rem'
                    }}
                >
                    Clarity across your accounts, cashflow & assets in one ledger.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                        fontSize: 'clamp(0.906rem, 1.8vw, 1.069rem)',
                        lineHeight: 1.6,
                        color: '#475569',
                        maxWidth: '720px',
                        margin: '0 auto 2.039rem',
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
                        gap: '0.906rem',
                        flexWrap: 'wrap',
                        marginBottom: '2.492rem'
                    }}
                >
                    <button
                        onClick={handleLogin}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.589rem',
                            padding: '0.861rem 1.994rem',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #1B6B3A 0%, #228B4C 100%)',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.861rem',
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
                            gap: '0.498rem',
                            padding: '0.861rem 1.677rem',
                            borderRadius: '14px',
                            background: 'white',
                            color: '#1E293B',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.861rem',
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
                    gap: '1.812rem',
                    flexWrap: 'wrap',
                    color: '#64748B',
                    fontSize: '0.725rem',
                    fontWeight: '650'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.317rem' }}>
                        <ShieldCheck size={16} color="#1B6B3A" /> 256-Bit Financial Encryption
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.317rem' }}>
                        <CheckCircle2 size={16} color="#1B6B3A" /> Zero Data Selling Guarantee
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.317rem' }}>
                        <Award size={16} color="#1B6B3A" /> Tax Season Reconciled Reports
                    </span>
                </div>
            </section>

            {/* 4. ANIMATED STAT COUNTERS TICKER */}
            <section style={{
                background: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                borderBottom: '1px solid #E2E8F0',
                padding: '2.266rem 1.359rem',
                margin: '1.359rem 0 4.078rem'
            }}>
                <div style={{
                    maxWidth: '1220px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.812rem',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '2.175rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.03em' }}>
                            <StatCounter end={450} prefix="₹" suffix=" Cr+" />
                        </div>
                        <div style={{ fontSize: '0.743rem', fontWeight: '750', color: '#64748B', marginTop: '0.227rem' }}>
                            Assets & Cashflow Reconciled
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '2.175rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.03em' }}>
                            <StatCounter end={50000} suffix="+" />
                        </div>
                        <div style={{ fontSize: '0.743rem', fontWeight: '750', color: '#64748B', marginTop: '0.227rem' }}>
                            Bank Transactions Analyzed
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '2.175rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.03em' }}>
                            <StatCounter end={99} suffix=".98%" />
                        </div>
                        <div style={{ fontSize: '0.743rem', fontWeight: '750', color: '#64748B', marginTop: '0.227rem' }}>
                            Auto-Categorization Accuracy
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '2.175rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.03em' }}>
                            <StatCounter end={14} suffix=" Months" />
                        </div>
                        <div style={{ fontSize: '0.743rem', fontWeight: '750', color: '#64748B', marginTop: '0.227rem' }}>
                            Average Debt Acceleration Gain
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SHOWCASE: THE INTERACTIVE FINANCIAL CONSOLE */}
            <section id="showcase" style={{
                maxWidth: '1220px',
                margin: '0 auto 4.531rem',
                padding: '0 1.359rem'
            }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 25px 60px -15px rgba(27, 107, 58, 0.12), 0 0 1px 1px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                }}>
                    {/* Console Header Bar */}
                    <div style={{
                        background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                        padding: '0.906rem 1.359rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        flexWrap: 'wrap',
                        gap: '0.68rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.77rem' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#EF4444' }} />
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#F59E0B' }} />
                                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#22C55E' }} />
                            </div>
                            <span style={{ fontSize: '0.743rem', fontWeight: '800', letterSpacing: '0.02em', color: '#DCF2E4' }}>
                                CLIKS BOOKS CONSOLE • REAL-TIME ASSET & CASHFLOW MONITOR
                            </span>
                        </div>

                        <span style={{
                            padding: '0.181rem 0.589rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.12)',
                            fontSize: '0.652rem',
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
                        padding: '0.453rem 0.906rem',
                        overflowX: 'auto',
                        gap: '0.363rem'
                    }}>
                        {PRODUCT_DEMOS.map((demo) => {
                            const isSelected = demo.id === activeDemoId;
                            const IconComp = demo.icon;
                            return (
                                <button
                                    key={demo.id}
                                    onClick={() => setActiveDemoId(demo.id)}
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.498rem',
                                        padding: '0.589rem 1.042rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.743rem',
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
                                        fontSize: '0.589rem',
                                        padding: '0.136rem 0.408rem',
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
                    <div style={{ padding: '1.812rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.9fr)', gap: '1.812rem', alignItems: 'start' }}>
                            {/* Left Text & Controls */}
                            <div>
                                <span style={{
                                    fontSize: '0.652rem',
                                    fontWeight: '900',
                                    color: '#1B6B3A',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'block',
                                    marginBottom: '0.453rem'
                                }}>
                                    CORE FINANCIAL INTELLIGENCE
                                </span>
                                <h3 style={{ fontSize: '1.314rem', fontWeight: '900', color: '#0F172A', lineHeight: 1.25, marginBottom: '0.68rem' }}>
                                    {activeDemo.title}
                                </h3>
                                <p style={{ fontSize: '0.797rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.359rem', fontWeight: '500' }}>
                                    {activeDemo.description}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem', marginBottom: '1.586rem' }}>
                                    {activeDemo.stats.map((s, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.589rem 0.861rem',
                                            borderRadius: '10px',
                                            background: '#F8FAFC',
                                            border: '1px solid #F1F5F9'
                                        }}>
                                            <span style={{ fontSize: '0.707rem', fontWeight: '650', color: '#64748B' }}>{s.label}</span>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.797rem', fontWeight: '850', color: '#064E3B' }}>{s.value}</div>
                                                <div style={{ fontSize: '0.616rem', fontWeight: '750', color: '#059669' }}>{s.trend}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {activeDemoId === 'debt' && (
                                    <div style={{ marginBottom: '1.359rem', background: '#F0FDF4', padding: '0.77rem', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                                        <div style={{ fontSize: '0.652rem', fontWeight: '800', color: '#166534', marginBottom: '0.363rem' }}>
                                            SELECT PAYDOWN ALGORITHM:
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.453rem' }}>
                                            <button
                                                onClick={() => setPaydownStrategy('avalanche')}
                                                style={{
                                                    flex: 1, padding: '0.408rem', fontSize: '0.68rem', fontWeight: '800', borderRadius: '8px',
                                                    border: 'none', cursor: 'pointer',
                                                    background: paydownStrategy === 'avalanche' ? '#1B6B3A' : 'white',
                                                    color: paydownStrategy === 'avalanche' ? 'white' : '#166534'
                                                }}
                                            >
                                                ⚡ Avalanche (Saves ₹84k)
                                            </button>
                                            <button
                                                onClick={() => setPaydownStrategy('snowball')}
                                                style={{
                                                    flex: 1, padding: '0.408rem', fontSize: '0.68rem', fontWeight: '800', borderRadius: '8px',
                                                    border: 'none', cursor: 'pointer',
                                                    background: paydownStrategy === 'snowball' ? '#1B6B3A' : 'white',
                                                    color: paydownStrategy === 'snowball' ? 'white' : '#166534'
                                                }}
                                            >
                                                ❄️ Snowball (Quick Wins)
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleLogin}
                                    style={{
                                        width: '100%',
                                        padding: '0.725rem',
                                        borderRadius: '12px',
                                        background: '#1B6B3A',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '800',
                                        fontSize: '0.77rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.453rem'
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
                                padding: '1.133rem',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.68rem' }}>
                                    <div style={{ fontSize: '0.797rem', fontWeight: '900', color: '#0F172A' }}>
                                        {activeDemoId === 'cashflow' ? 'Live Bank Activity Feed' : activeDemoId === 'budgets' ? 'Active Budget Envelopes' : 'Debt Repayment Velocity'}
                                    </div>
                                    {activeDemoId === 'cashflow' ? (
                                        <div style={{ display: 'flex', gap: '0.317rem' }}>
                                            {['all', 'in', 'out'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setCashflowFilter(tab)}
                                                    style={{
                                                        padding: '0.181rem 0.498rem',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        fontSize: '0.634rem',
                                                        fontWeight: '800',
                                                        cursor: 'pointer',
                                                        background: cashflowFilter === tab ? '#1B6B3A' : '#E2E8F0',
                                                        color: cashflowFilter === tab ? 'white' : '#475569'
                                                    }}
                                                >
                                                    {tab.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.652rem', color: '#059669', fontWeight: '800' }}>● Auto Categorized</span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.589rem' }}>
                                    {activeDemoId === 'budgets' ? (
                                        activeDemo.transactions.map((tx, idx) => (
                                            <div key={idx} style={{
                                                background: 'white',
                                                padding: '0.906rem',
                                                borderRadius: '12px',
                                                border: '1px solid #E2E8F0'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.363rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '800', fontSize: '0.77rem', color: '#0F172A' }}>{tx.title}</div>
                                                        <div style={{ fontSize: '0.652rem', color: '#64748B' }}>{tx.category} • <span style={{ color: '#0F172A', fontWeight: '700' }}>{tx.date}</span></div>
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.725rem',
                                                        fontWeight: '900',
                                                        color: tx.percent > 80 ? '#DC2626' : (tx.percent > 65 ? '#D97706' : '#059669')
                                                    }}>
                                                        {tx.amount}
                                                    </span>
                                                </div>
                                                {/* Visual bar */}
                                                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${tx.percent}%` }}
                                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                                        style={{
                                                            height: '100%',
                                                            background: tx.percent > 80 ? '#EF4444' : (tx.percent > 65 ? '#F59E0B' : '#10B981'),
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        filteredTransactions.map((tx, idx) => (
                                            <div key={idx} style={{
                                                background: 'white',
                                                padding: '0.77rem 0.906rem',
                                                borderRadius: '12px',
                                                border: '1px solid #E2E8F0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: '800', fontSize: '0.77rem', color: '#0F172A' }}>{tx.title}</div>
                                                    <div style={{ fontSize: '0.652rem', color: '#64748B' }}>{tx.category} • <span style={{ color: '#94A3B8' }}>{tx.date}</span></div>
                                                </div>
                                                <div style={{
                                                    fontSize: '0.816rem',
                                                    fontWeight: '900',
                                                    color: tx.type === 'in' ? '#059669' : (tx.type === 'warning' ? '#D97706' : '#0F172A')
                                                }}>
                                                    {tx.amount}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. BENTO GRID CORE CAPABILITIES SECTION */}
            <section id="features" style={{
                maxWidth: '1220px',
                margin: '0 auto 4.531rem',
                padding: '0 1.359rem'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.719rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#1B6B3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        PRECISION PLATFORM
                    </span>
                    <h2 style={{ fontSize: '2.084rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.02em', margin: '0.453rem 0' }}>
                        Engineered for financial mastery & effortless audits.
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.861rem' }}>
                        Everything you need to turn raw transactions into crystal-clear cashflow insights, debt reduction, and compliance certainty.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '1.359rem'
                }}>
                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <Wallet size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            Multi-Bank Automated Reconciliation
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Aggregate HDFC, ICICI, SBI, Axis, and Razorpay ledgers into one unified balance. OCR statement scanner automatically reconciles unmatched credits and debits.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> 100% Read-Only TLS Bank Sync
                        </div>
                    </SpotlightCard>

                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <PieChart size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            Zero-Leakage Budget Guardrails
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Lock monthly envelope thresholds for operational overhead, travel, software SaaS, and contractor wages. Proactive email and WhatsApp alerts notify you at 80% utilization.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> Proactive Threshold Overspend Alerts
                        </div>
                    </SpotlightCard>

                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <LineChart size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            Accelerated Debt Paydown Velocity
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Mathematically simulate snowball and avalanche repayment schedules. Automatically calculate interest saved when extra cashflow is funneled toward high-APR credit lines.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> Save up to 28% in Lifetime Interest
                        </div>
                    </SpotlightCard>

                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <ShieldCheck size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            Tax Deduction Classifier (80C, 80D, 37)
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Instantly tag deductible business expenses, depreciation, life insurance, medical premiums, and NPS contributions. Generate audit-ready schedules for your CA before March 31.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> Direct CA / Auditor Read-Only Portal
                        </div>
                    </SpotlightCard>

                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <Users size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            Split & Shared Partner Accounts
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Manage co-founder reimbursements, joint venture capital pools, and household shared expenses. Auto-calculate net settlement amounts with 1-click UPI payment links.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> Instant UPI Settlement QR Codes
                        </div>
                    </SpotlightCard>

                    <SpotlightCard style={{ padding: '1.812rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCF2E4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.133rem' }}>
                            <FileSpreadsheet size={22} color="#1B6B3A" />
                        </div>
                        <h4 style={{ fontSize: '1.069rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.453rem' }}>
                            1-Click Export to Tally & Excel
                        </h4>
                        <p style={{ fontSize: '0.779rem', color: '#475569', lineHeight: 1.6, flexGrow: 1 }}>
                            Export reconciled ledgers, profit & loss, balance sheets, and journal entries straight into standard Tally XML, Zoho Books JSON, or clean formatted Excel workbooks.
                        </p>
                        <div style={{ marginTop: '1.133rem', paddingTop: '0.906rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '800' }}>
                            <CheckCircle2 size={15} /> Formatted for Indian Compliance Standards
                        </div>
                    </SpotlightCard>
                </div>
            </section>

            {/* 7. INTERACTIVE CORPUS & WEALTH SIMULATOR */}
            <section id="simulator" style={{
                maxWidth: '1220px',
                margin: '0 auto 4.531rem',
                padding: '0 1.359rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                    borderRadius: '16px',
                    padding: '2.719rem 2.266rem',
                    color: 'white',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.3fr)',
                    gap: '2.719rem',
                    alignItems: 'center',
                    boxShadow: '0 20px 50px rgba(27, 107, 58, 0.25)'
                }}>
                    <div>
                        <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            COMPOUND GROWTH SIMULATOR
                        </span>
                        <h2 style={{ fontSize: '1.903rem', fontWeight: '900', lineHeight: 1.2, margin: '0.544rem 0 0.906rem' }}>
                            Simulate your wealth roadmap with mathematical certainty.
                        </h2>
                        <p style={{ color: '#D1FAE5', fontSize: '0.834rem', lineHeight: 1.6, marginBottom: '1.812rem' }}>
                            Disciplined cashflow management turns surplus into long-term enterprise value. Test monthly allocation, return rate, and time horizons.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.359rem' }}>
                            {/* Monthly Contribution */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', fontWeight: '750', marginBottom: '0.453rem' }}>
                                    <span>Monthly Surplus Allocated:</span>
                                    <span style={{ color: '#6EE7B7', fontWeight: '900', fontSize: '0.906rem' }}>₹{monthlyContribution.toLocaleString('en-IN')} / mo</span>
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

                            {/* Return Rate Selector */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', fontWeight: '750', marginBottom: '0.453rem' }}>
                                    <span>Expected Growth Rate:</span>
                                    <span style={{ color: '#6EE7B7', fontWeight: '900', fontSize: '0.906rem' }}>{expectedReturnRate}% p.a.</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.453rem' }}>
                                    {[
                                        { label: '8% FD/Debt', val: 8 },
                                        { label: '12% Balanced', val: 12 },
                                        { label: '15% Equity Index', val: 15 }
                                    ].map((rate) => (
                                        <button
                                            key={rate.val}
                                            onClick={() => setExpectedReturnRate(rate.val)}
                                            style={{
                                                flex: 1,
                                                padding: '0.408rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '0.68rem',
                                                fontWeight: '800',
                                                cursor: 'pointer',
                                                background: expectedReturnRate === rate.val ? '#22C55E' : 'rgba(255,255,255,0.12)',
                                                color: expectedReturnRate === rate.val ? '#064E3B' : 'white',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {rate.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Horizon */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', fontWeight: '750', marginBottom: '0.453rem' }}>
                                    <span>Time Horizon:</span>
                                    <span style={{ color: '#6EE7B7', fontWeight: '900', fontSize: '0.906rem' }}>{horizonYears} Years</span>
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

                    {/* Output Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        padding: '1.812rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.133rem'
                    }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '1.133rem' }}>
                            <span style={{ fontSize: '0.652rem', color: '#A7F3D0', fontWeight: '800', textTransform: 'uppercase' }}>
                                PROJECTED FUTURE WEALTH CORPUS
                            </span>
                            <div style={{ fontSize: '2.266rem', fontWeight: '900', color: '#FFFFFF', marginTop: '0.317rem' }}>
                                ₹{(projectedCorpus / 100000).toFixed(2)} Lakhs
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#D1FAE5', display: 'block', marginTop: '0.181rem' }}>
                                Compounded monthly at {expectedReturnRate}% annual return.
                            </span>
                        </div>

                        {/* Breakdown Bars */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.707rem', marginBottom: '0.363rem' }}>
                                <span style={{ color: '#A7F3D0' }}>Invested: ₹{(totalInvestedAmount / 100000).toFixed(2)} L</span>
                                <span style={{ color: '#6EE7B7', fontWeight: '800' }}>Returns: +₹{(wealthGained / 100000).toFixed(2)} L</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', display: 'flex', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.round((totalInvestedAmount / projectedCorpus) * 100)}%`,
                                    background: '#A7F3D0'
                                }} />
                                <div style={{
                                    width: `${Math.round((wealthGained / projectedCorpus) * 100)}%`,
                                    background: '#22C55E'
                                }} />
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            style={{
                                background: 'white',
                                color: '#1B6B3A',
                                border: 'none',
                                padding: '0.816rem',
                                borderRadius: '12px',
                                fontWeight: '850',
                                fontSize: '0.797rem',
                                cursor: 'pointer',
                                marginTop: '0.453rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                gap: '0.453rem',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                            }}
                        >
                            <span>Start Building Your Wealth In CLIKS</span>
                            <ArrowRight size={15} color="#1B6B3A" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 8. TRANSPARENT PRICING WITH SPOTLIGHT CARDS */}
            <section id="pricing" style={{
                background: '#FFFFFF',
                padding: '4.531rem 1.359rem',
                borderTop: '1px solid #E2E8F0'
            }}>
                <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.266rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#1B6B3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            SIMPLE TRANSPARENT PRICING
                        </span>
                        <h2 style={{ fontSize: '2.084rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.02em', margin: '0.453rem 0' }}>
                            Start free. Upgrade as your assets scale.
                        </h2>
                        <p style={{ color: '#475569', fontSize: '0.861rem', marginBottom: '1.359rem' }}>
                            Zero surprise fees. 256-bit encrypted financial privacy guaranteed forever.
                        </p>

                        {/* Annual / Monthly Toggle */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.453rem',
                            padding: '0.317rem',
                            background: '#F1F5F9',
                            borderRadius: '14px',
                            border: '1px solid #E2E8F0'
                        }}>
                            <button
                                onClick={() => setAnnualPricing(false)}
                                style={{
                                    padding: '0.408rem 0.906rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '0.743rem',
                                    fontWeight: '750',
                                    cursor: 'pointer',
                                    background: !annualPricing ? 'white' : 'transparent',
                                    color: !annualPricing ? '#0F172A' : '#64748B',
                                    boxShadow: !annualPricing ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                                }}
                            >
                                Monthly Billing
                            </button>
                            <button
                                onClick={() => setAnnualPricing(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.363rem',
                                    padding: '0.408rem 0.906rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '0.743rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    background: annualPricing ? '#1B6B3A' : 'transparent',
                                    color: annualPricing ? 'white' : '#64748B',
                                    boxShadow: annualPricing ? '0 2px 6px rgba(27,107,58,0.25)' : 'none'
                                }}
                            >
                                <span>Annual Billing</span>
                                <span style={{
                                    background: annualPricing ? '#22C55E' : '#DCF2E4',
                                    color: '#064E3B',
                                    padding: '0.091rem 0.363rem',
                                    borderRadius: '6px',
                                    fontSize: '0.589rem',
                                    fontWeight: '900'
                                }}>SAVE 20%</span>
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.586rem',
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
                                    'Standard TLS 256-Bit Data Encryption',
                                    'Mobile & Desktop Web Access'
                                ],
                                cta: 'Get Started Free',
                                highlight: false
                            },
                            {
                                name: 'Pro Professional',
                                price: annualPricing ? '₹479' : '₹599',
                                period: '/ month',
                                desc: 'Advanced tracking, debt acceleration, and tax deduction tags.',
                                features: [
                                    'Unlimited Bank Accounts & Credit Cards',
                                    'Debt Payoff Snowball & Avalanche Radar',
                                    'Category Budget Guardrails & Threshold Alerts',
                                    'Tax-Deductible Expense Tagging (80C / 37)',
                                    '1-Click Export for Annual ITR Filing',
                                    'Direct WhatsApp Expense Logging'
                                ],
                                cta: 'Start Pro 14-Day Free Trial',
                                highlight: true
                            },
                            {
                                name: 'Family & Partners',
                                price: annualPricing ? '₹799' : '₹999',
                                period: '/ month',
                                desc: 'Collaborative cashflow tracking for families and co-founders.',
                                features: [
                                    'Up to 5 Collaborator Accounts',
                                    'Shared Envelopes & Individual Wallets',
                                    'Split & Collect Settlement UPI Links',
                                    'Joint Investment Asset Tracking',
                                    'Direct Read-Only CA Auditor Link',
                                    'Priority Support Assistance'
                                ],
                                cta: 'Launch Family Plan',
                                highlight: false
                            }
                        ].map((p, i) => (
                            <SpotlightCard
                                key={i}
                                isHighlighted={p.highlight}
                                style={{
                                    padding: '2.039rem 1.812rem'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '1.133rem', fontWeight: '900', color: '#0F172A' }}>{p.name}</div>
                                        {p.highlight && (
                                            <span style={{
                                                background: '#DCF2E4',
                                                color: '#1B6B3A',
                                                fontSize: '0.616rem',
                                                fontWeight: '900',
                                                padding: '0.181rem 0.544rem',
                                                borderRadius: '10px'
                                            }}>
                                                MOST POPULAR
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '0.317rem 0 1.133rem' }}>{p.desc}</p>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.317rem', marginBottom: '1.586rem' }}>
                                        <span style={{ fontSize: '2.266rem', fontWeight: '900', color: '#1B6B3A' }}>{p.price}</span>
                                        <span style={{ fontSize: '0.797rem', color: '#64748B', fontWeight: '600' }}>{p.period}</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem', marginBottom: '1.812rem' }}>
                                        {p.features.map((feat, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.498rem', fontSize: '0.743rem', color: '#334155', fontWeight: '600' }}>
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
                                        padding: '0.816rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: '850',
                                        fontSize: '0.797rem',
                                        cursor: 'pointer',
                                        marginTop: 'auto',
                                        background: p.highlight ? 'linear-gradient(135deg, #1B6B3A 0%, #228B4C 100%)' : '#E2E8F0',
                                        color: p.highlight ? 'white' : '#1E293B',
                                        boxShadow: p.highlight ? '0 4px 14px rgba(27, 107, 58, 0.28)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {p.cta}
                                </button>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FAQ ACCORDION SECTION */}
            <section id="faq" style={{
                maxWidth: '920px',
                margin: '0 auto 4.531rem',
                padding: '0 1.359rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.266rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#1B6B3A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        FREQUENTLY ASKED QUESTIONS
                    </span>
                    <h2 style={{ fontSize: '1.903rem', fontWeight: '900', color: '#064E3B', letterSpacing: '-0.02em', margin: '0.453rem 0' }}>
                        Questions & Transparent Answers
                    </h2>
                    <p style={{ color: '#475569', fontSize: '0.834rem' }}>
                        Have a question about security, bank connectivity, or CA compliance? We have answers.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.77rem' }}>
                    {[
                        {
                            q: 'Is my financial and banking data secure and private?',
                            a: 'Yes, 100%. We employ bank-grade 256-bit TLS encryption in transit and AES-256 at rest. We maintain strict read-only access with zero capability to initiate transactions or debits, and we never sell user data to advertising or insurance brokers.'
                        },
                        {
                            q: 'How does automated bank statement reconciliation work?',
                            a: 'You can connect through secure read-only aggregator protocols or drop your PDF / Excel statements into our OCR engine. CLIKS automatically identifies opening balances, credits, debits, GST numbers, and closing reconciliations with 99.98% accuracy.'
                        },
                        {
                            q: 'Can my Chartered Accountant or tax auditor access my workspace?',
                            a: 'Yes. With Pro and Family plans, you can invite your CA via read-only Auditor Access. They can review your tagged tax deductions (Section 80C, 80D, 37(1)), export ledger schedules, and prepare ITR filing without altering your balances.'
                        },
                        {
                            q: 'What is the difference between CLIKS Books and CLIKS Business?',
                            a: 'CLIKS Books is optimized for personal and micro-business cashflow, multi-bank management, debt acceleration, and category budgets. CLIKS Business is an all-in-one ERP suite supporting GST E-Way bills, multi-warehouse inventory, and purchase orders.'
                        },
                        {
                            q: 'Can I export my data to Tally or Microsoft Excel at any time?',
                            a: 'Always. You can export complete transaction ledgers, categorization summaries, and tax deduction schedules with 1 click in standard CSV, Excel (.xlsx), or Tally-compliant XML.'
                        }
                    ].map((item, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={idx}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s ease'
                                }}
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                                    style={{
                                        width: '100%',
                                        padding: '1.133rem 1.359rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '0.861rem', fontWeight: '800', color: '#0F172A' }}>
                                        {item.q}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={18} color="#1B6B3A" />
                                    </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        >
                                            <div style={{
                                                padding: '0 1.359rem 1.133rem',
                                                fontSize: '0.797rem',
                                                color: '#475569',
                                                lineHeight: 1.6,
                                                borderTop: '1px solid #F1F5F9',
                                                paddingTop: '0.77rem'
                                            }}>
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 10. REFINED ENTERPRISE FOOTER */}
            <footer style={{
                background: '#064E3B',
                color: 'rgba(255,255,255,0.7)',
                padding: '3.172rem 1.359rem 1.812rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.725rem'
            }}>
                <div style={{
                    maxWidth: '1220px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.359rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                        <img src={logoPng} alt="CLIKS" style={{ width: '28px', height: '28px' }} />
                        <span style={{ fontSize: '0.952rem', fontWeight: '900', color: 'white' }}>CLIKS Books</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.359rem', flexWrap: 'wrap' }}>
                        <span onClick={() => scrollToSection('features')} style={{ cursor: 'pointer' }}>Capabilities</span>
                        <span onClick={() => scrollToSection('showcase')} style={{ cursor: 'pointer' }}>Console</span>
                        <span onClick={() => scrollToSection('simulator')} style={{ cursor: 'pointer' }}>Simulator</span>
                        <span onClick={() => scrollToSection('pricing')} style={{ cursor: 'pointer' }}>Pricing</span>
                        <span onClick={() => scrollToSection('faq')} style={{ cursor: 'pointer' }}>FAQ</span>
                        <span onClick={handleLogin} style={{ cursor: 'pointer', color: '#6EE7B7', fontWeight: '800' }}>Sign In →</span>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1220px',
                    margin: '1.812rem auto 0',
                    paddingTop: '1.359rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.906rem',
                    fontSize: '0.652rem',
                    color: 'rgba(255,255,255,0.45)'
                }}>
                    <span>© {new Date().getFullYear()} CLIKS Technologies. All rights reserved. Precision financial software.</span>
                    <span>Encrypted with Bank-Grade TLS 256-Bit • Zero Data Sharing</span>
                </div>
            </footer>

            {/* Responsive Media Query Styles */}
            <style>{`
                @media (max-width: 900px) {
                    .desktop-only { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    .hero-badge-left, .hero-badge-right { display: none !important; }
                }
                @media (min-width: 901px) {
                    .hero-badge-left, .hero-badge-right { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
