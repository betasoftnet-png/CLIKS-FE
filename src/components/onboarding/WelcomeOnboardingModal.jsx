import React from 'react';
import { Sparkles, ArrowRight, X, Compass } from 'lucide-react';

/**
 * Compact welcome dialog shown once to newly signed-up / first-time users.
 */
const WelcomeOnboardingModal = ({ isOpen, userName, onStart, onSkip }) => {
    const startBtnRef = React.useRef(null);

    React.useEffect(() => {
        if (!isOpen) return undefined;
        const t = requestAnimationFrame(() => startBtnRef.current?.focus());
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onSkip();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            cancelAnimationFrame(t);
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onSkip]);

    if (!isOpen) return null;

    const firstName = (userName || '').trim().split(/\s+/)[0] || 'there';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cliks-welcome-title"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                zIndex: 10050,
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'var(--card-bg, #FFFFFF)',
                    color: 'var(--text-main, #0F172A)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color, #E2E8F0)',
                    boxShadow: '0 24px 54px rgba(6, 78, 59, 0.24)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                        padding: '1.15rem 1.25rem',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                            style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.16)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85 }}>
                                Welcome to CLIKS
                            </div>
                            <h2 id="cliks-welcome-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                                Hi {firstName}, let&apos;s get oriented
                            </h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onSkip}
                        aria-label="Skip welcome tour"
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(255, 255, 255, 0.14)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div style={{ padding: '1.2rem 1.25rem' }}>
                    <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.84rem', lineHeight: 1.55, color: 'var(--text-muted, #475569)' }}>
                        Explore Books, Payments, Social, Accounts, Purchases, and Reports with an interactive guide tailored to your account.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '10px',
                            background: 'var(--bg-color, #F0FDF4)',
                            border: '1px solid var(--border-color, #DCF2E4)',
                            fontSize: '0.75rem',
                            color: 'var(--text-main, #064E3B)',
                            marginBottom: '1rem',
                        }}
                    >
                        <Compass size={15} style={{ color: 'var(--primary, #1B6B3A)', flexShrink: 0 }} />
                        <span>You can skip anytime or replay guides later from <strong>Help &amp; Support</strong>.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onSkip}
                            style={{
                                padding: '0.55rem 0.95rem',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color, #E2E8F0)',
                                background: 'transparent',
                                color: 'var(--text-muted, #475569)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Skip Tour
                        </button>
                        <button
                            ref={startBtnRef}
                            type="button"
                            onClick={onStart}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.55rem 1.05rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                color: '#FFFFFF',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 6px 14px rgba(27, 107, 58, 0.25)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Start Tour <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeOnboardingModal;
