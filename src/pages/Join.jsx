import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    Gift, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    User, 
    Mail, 
    Lock, 
    Building2, 
    Eye, 
    EyeOff,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context';
import { referralService } from '../services/referralService';
import logoPng from '../assets/cliks.png';
import '../App.css';

const Join = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, mockLogin } = useAuth();

    // 1. Capture referral parameter from URL
    const urlParams = new URLSearchParams(location.search);
    const refFromUrl = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('code') || '';

    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // a) Immediately store referral code in localStorage on mount so it is not lost
    useEffect(() => {
        if (refFromUrl && refFromUrl.trim()) {
            const clean = refFromUrl.trim().toUpperCase();
            localStorage.setItem('cliks_referral_code', clean);
            sessionStorage.setItem('cliks_pending_ref', clean);
            setReferralCode(clean);
        } else {
            // b) Automatically populate the "Referral Code" field from storage if previously saved
            const stored = localStorage.getItem('cliks_referral_code') || sessionStorage.getItem('cliks_pending_ref') || '';
            if (stored) {
                setReferralCode(stored);
            }
        }
    }, [refFromUrl]);

    // c) If user clicking the link is already logged in on that browser, navigate cleanly to dashboard
    useEffect(() => {
        if (isAuthenticated || user) {
            navigate('/books/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!fullName.trim()) {
            setErrorMsg('Please enter your full name.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setErrorMsg('Please provide a valid email address.');
            return;
        }
        if (!password || password.length < 4) {
            setErrorMsg('Password must be at least 4 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Apply referral code if present
            if (referralCode.trim()) {
                const cleanCode = referralCode.trim().toUpperCase();
                localStorage.setItem('cliks_referral_code', cleanCode);
                sessionStorage.setItem('cliks_pending_ref', cleanCode);
                try {
                    await referralService.apply(cleanCode);
                    setSuccessMsg('Referral accepted! 200 Welcome Points awarded.');
                } catch (refErr) {
                    console.warn('[Join] Referral notice:', refErr.message);
                }
            }

            if (typeof mockLogin === 'function') {
                mockLogin();
            } else {
                localStorage.setItem('books_auth_token', `cliks-token-${Date.now()}`);
            }

            setTimeout(() => {
                navigate('/books/dashboard', { replace: true });
            }, 800);

        } catch (err) {
            console.error('[Join] Registration error:', err);
            setErrorMsg(err.message || 'Registration failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleSsoSignup = () => {
        if (referralCode.trim()) {
            const clean = referralCode.trim().toUpperCase();
            localStorage.setItem('cliks_referral_code', clean);
            sessionStorage.setItem('cliks_pending_ref', clean);
        }
        const CLIENT_ID    = 'cliks-app';
        const REDIRECT_URI = 'https://cliks.beta-softnet.com/auth';
        const BNX_AUTH_URL = 'https://www.b2auth.com';
        const state        = 'cliks-auth-state';
        window.location.href =
            `${BNX_AUTH_URL}/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
            padding: '2rem 1.5rem',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient background glows */}
            <div style={{
                position: 'absolute',
                top: '-15%',
                right: '-10%',
                width: '450px',
                height: '450px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            <div style={{
                background: '#FFFFFF',
                width: '100%',
                maxWidth: '520px',
                borderRadius: '32px',
                padding: '2.5rem 2.25rem',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Header branding */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        background: '#ECFDF5',
                        borderRadius: '20px',
                        marginBottom: '1rem',
                        boxShadow: '0 10px 20px rgba(16,185,129,0.15)'
                    }}>
                        <img src={logoPng} alt="Cliks Logo" style={{ width: '38px', height: '38px' }} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0F172A', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                        Join Cliks
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
                        Smart finance management, automated ledger, and compliance suite.
                    </p>
                </div>

                {/* Referral Applied Notification Badge */}
                {referralCode && (
                    <div style={{
                        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                        border: '1px solid #A7F3D0',
                        borderRadius: '16px',
                        padding: '0.85rem 1.1rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.1)'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: '#10B981',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Gift size={20} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '850', color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Referral Invite Applied
                            </div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#047857' }}>
                                Code: <strong>{referralCode}</strong> • +200 Welcome Bonus Points
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                    <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#991B1B',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                    <div style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#065F46',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '750', color: '#334155', marginBottom: '0.4rem' }}>
                            Full Name *
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Rajesh Kumar"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                                    borderRadius: '14px',
                                    border: '1.5px solid #E2E8F0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '750', color: '#334155', marginBottom: '0.4rem' }}>
                            Work Email *
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input 
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                                    borderRadius: '14px',
                                    border: '1.5px solid #E2E8F0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '750', color: '#334155', marginBottom: '0.4rem' }}>
                            Password *
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 2.75rem 0.8rem 2.75rem',
                                    borderRadius: '14px',
                                    border: '1.5px solid #E2E8F0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#94A3B8'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '750', color: '#334155' }}>
                                Referral Code
                            </label>
                            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', background: '#ECFDF5', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                                +200 Welcome Pts
                            </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Gift size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: referralCode ? '#059669' : '#94A3B8' }} />
                            <input 
                                type="text"
                                placeholder="CLIKS-BIZ-XXXXX"
                                value={referralCode}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    setReferralCode(val);
                                    if (val) localStorage.setItem('cliks_referral_code', val);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                                    borderRadius: '14px',
                                    border: referralCode ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                                    background: referralCode ? '#F0FDF4' : '#FFFFFF',
                                    fontWeight: '800',
                                    color: referralCode ? '#065F46' : '#1E293B',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.95rem 1.5rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                            color: '#FFFFFF',
                            fontWeight: '800',
                            fontSize: '0.95rem',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.3)',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Creating Account...' : (
                            <>
                                Create Account <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* SSO Alternative */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '750', color: '#94A3B8', textTransform: 'uppercase' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                    </div>

                    <button
                        type="button"
                        onClick={handleSsoSignup}
                        style={{
                            width: '100%',
                            padding: '0.85rem 1.25rem',
                            borderRadius: '14px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontWeight: '750',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem'
                        }}
                    >
                        <ShieldCheck size={18} color="#1B6B3A" /> Continue with BNX Single Sign-On
                    </button>
                </div>

                <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                    Already have an account?{' '}
                    <Link to="/" style={{ color: '#1B6B3A', fontWeight: '800', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Join;
