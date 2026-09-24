import React, { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    Building2,
    Briefcase,
    Lock,
    Unlock,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertCircle,
    IndianRupee,
    CreditCard,
    FileText,
    Download,
    ExternalLink,
    Clock,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Info,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
    Shield,
    Check,
    X,
    RotateCcw
} from 'lucide-react';
import { useAuth } from '../context';

export const StaffDetails = () => {
    const { user } = useAuth();
    const targetEmail = 'sanjay123@bnxmail.com';

    // Persist invitation status in localStorage (keys: 'pending', 'accepted', 'rejected')
    const [invitationStatus, setInvitationStatus] = useState(() => {
        try {
            return localStorage.getItem('cliks_staff_invitation_status') || 'pending';
        } catch (e) {
            return 'pending';
        }
    });

    const [activeTab, setActiveTab] = useState('overview');
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Save status
    const updateStatus = (newStatus) => {
        setIsActionLoading(true);
        setTimeout(() => {
            setInvitationStatus(newStatus);
            try {
                localStorage.setItem('cliks_staff_invitation_status', newStatus);
            } catch (e) {
                console.error(e);
            }
            setIsActionLoading(false);

            if (newStatus === 'accepted') {
                setNotification({
                    type: 'success',
                    message: 'Organization invitation accepted! Your salary structure and employment records are now unlocked.'
                });
            } else if (newStatus === 'rejected') {
                setNotification({
                    type: 'error',
                    message: 'Invitation declined. You can reconsider or re-accept at any time.'
                });
            } else {
                setNotification(null);
            }
        }, 300);
    };

    // Auto-dismiss toast
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="content-wrapper" style={{ padding: '1.75rem', maxWidth: '1440px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                            color: '#1D4ED8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(29, 78, 216, 0.12)'
                        }}>
                            <UserCheck size={26} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                                    Staff Details
                                </h1>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '50px',
                                    background: invitationStatus === 'accepted' ? '#ECFDF5' : '#FEF3C7',
                                    color: invitationStatus === 'accepted' ? '#047857' : '#B45309',
                                    border: `1px solid ${invitationStatus === 'accepted' ? '#A7F3D0' : '#FDE68A'}`
                                }}>
                                    {invitationStatus === 'accepted' ? 'INTEGRATION ACTIVE' : 'PENDING INVITATION'}
                                </span>
                            </div>
                            <p style={{ color: '#64748B', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                                Workforce integrations, organization linkage & salary structure.
                            </p>
                        </div>
                    </div>

                    {/* Quick indicator */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.82rem',
                        color: '#475569'
                    }}>
                        <Mail size={15} style={{ color: '#2563EB' }} />
                        <span>Target: <strong style={{ color: '#0F172A' }}>{targetEmail}</strong></span>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    background: notification.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${notification.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                    color: notification.type === 'success' ? '#166534' : '#991B1B'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{notification.message}</span>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Main 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ─────────────────────────────────────────────────────────
                    LEFT CARD: Active Integrations (lg:col-span-5)
                ───────────────────────────────────────────────────────── */}
                <div className="lg:col-span-5" style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Card Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #F1F5F9',
                        background: '#FAFBFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: '#EFF6FF',
                                color: '#2563EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Building2 size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    Active Integrations
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0' }}>
                                    Incoming organization & HR linkages
                                </p>
                            </div>
                        </div>

                        <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '50px',
                            background: '#F1F5F9',
                            color: '#475569'
                        }}>
                            1 Invite
                        </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        
                        {/* Invitation Item Box */}
                        <div style={{
                            borderRadius: '16px',
                            border: `1.5px solid ${invitationStatus === 'accepted' ? '#A7F3D0' : invitationStatus === 'rejected' ? '#FECACA' : '#E2E8F0'}`,
                            background: invitationStatus === 'accepted' ? '#F0FDF4' : invitationStatus === 'rejected' ? '#FEF2F2' : '#FFFFFF',
                            padding: '1.25rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.25s ease'
                        }}>
                            {/* Inviter Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '800',
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 6px rgba(27, 107, 58, 0.25)'
                                    }}>
                                        SH
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>
                                                santhoshhhhhh(HR)
                                            </span>
                                            <span style={{
                                                fontSize: '0.68rem',
                                                fontWeight: '700',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                background: '#DBEAFE',
                                                color: '#1E40AF'
                                            }}>
                                                Cliks Business
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                                            Organization: <strong>Santhosh Tech Ventures Pvt Ltd</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Status badge */}
                                <div>
                                    {invitationStatus === 'pending' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#FEF3C7',
                                            color: '#B45309',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <Clock size={12} />
                                            Pending
                                        </span>
                                    )}
                                    {invitationStatus === 'accepted' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#DCFCE7',
                                            color: '#15803D',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <Check size={12} />
                                            Active
                                        </span>
                                    )}
                                    {invitationStatus === 'rejected' && (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '50px',
                                            background: '#FEE2E2',
                                            color: '#B91C1C',
                                            fontSize: '0.72rem',
                                            fontWeight: '700'
                                        }}>
                                            <X size={12} />
                                            Declined
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Invitation Details Body */}
                            <div style={{
                                background: invitationStatus === 'accepted' ? '#FFFFFF' : '#F8FAFC',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                marginBottom: '1rem',
                                border: '1px solid #E2E8F0'
                            }}>
                                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.45' }}>
                                    You have been added to the organization payroll & HR roster for target email:
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    color: '#2563EB',
                                    background: '#EFF6FF',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: '6px',
                                    marginTop: '0.4rem'
                                }}>
                                    {targetEmail}
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.65rem',
                                    marginTop: '0.85rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px dashed #E2E8F0'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Position</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>Sales Executive</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Department</div>
                                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>Operations</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Buttons (Accept / Reject) */}
                            {invitationStatus === 'pending' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => updateStatus('accepted')}
                                        disabled={isActionLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.7rem 1rem',
                                            background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            boxShadow: '0 3px 10px rgba(27, 107, 58, 0.25)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Check size={16} strokeWidth={2.5} />
                                        <span>Accept</span>
                                    </button>

                                    <button
                                        onClick={() => updateStatus('rejected')}
                                        disabled={isActionLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.7rem 1rem',
                                            background: '#FFFFFF',
                                            color: '#DC2626',
                                            border: '1.5px solid #FCA5A5',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <X size={16} strokeWidth={2.5} />
                                        <span>Reject</span>
                                    </button>
                                </div>
                            )}

                            {/* Accepted View */}
                            {invitationStatus === 'accepted' && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803D', fontSize: '0.82rem', fontWeight: '700' }}>
                                        <CheckCircle2 size={16} />
                                        <span>Integration active & verified</span>
                                    </div>
                                    <button
                                        onClick={() => updateStatus('pending')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            background: 'none',
                                            border: 'none',
                                            color: '#64748B',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Reset Status</span>
                                    </button>
                                </div>
                            )}

                            {/* Rejected View */}
                            {invitationStatus === 'rejected' && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontSize: '0.82rem', fontWeight: '600' }}>
                                        <XCircle size={16} />
                                        <span>Invitation declined</span>
                                    </div>
                                    <button
                                        onClick={() => updateStatus('accepted')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            background: '#FFFFFF',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '8px',
                                            padding: '0.4rem 0.75rem',
                                            color: '#1E293B',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Re-accept Invitation</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Integration Security Info Card */}
                        <div style={{
                            background: '#F8FAFC',
                            borderRadius: '14px',
                            padding: '1rem',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                        }}>
                            <ShieldCheck size={20} style={{ color: '#1B6B3A', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A' }}>
                                    Direct HR Sync Protection
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', lineHeight: '1.4' }}>
                                    Your salary slips, tax deductions, and EPF records are securely synced directly from Cliks Business. Sensitive bank records remain read-only for security.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────
                    RIGHT CARD: YOUR SALARY History & Details (lg:col-span-7)
                ───────────────────────────────────────────────────────── */}
                <div className="lg:col-span-7" style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Card Header */}
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #F1F5F9',
                        background: '#FAFBFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: invitationStatus === 'accepted' ? '#ECFDF5' : '#FEF3C7',
                                color: invitationStatus === 'accepted' ? '#059669' : '#D97706',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {invitationStatus === 'accepted' ? <Unlock size={18} /> : <Lock size={18} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    YOUR SALARY History & Details
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0' }}>
                                    Official payroll structure, compensations & tax documents
                                </p>
                            </div>
                        </div>

                        {invitationStatus === 'accepted' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                padding: '0.2rem 0.65rem',
                                borderRadius: '50px',
                                background: '#ECFDF5',
                                color: '#059669',
                                border: '1px solid #A7F3D0'
                            }}>
                                <BadgeCheck size={13} />
                                VERIFIED UNLOCKED
                            </span>
                        )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.5rem' }}>
                        
                        {/* ─────── STATE A: PENDING / REJECTED (LOCKED PLACEHOLDER) ─────── */}
                        {invitationStatus !== 'accepted' && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2.5rem 1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '20px',
                                    background: '#FEF3C7',
                                    color: '#D97706',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.25rem',
                                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.15)'
                                }}>
                                    <Lock size={32} strokeWidth={2.2} />
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                                    Employment & Salary Details Locked
                                </h3>
                                <p style={{ color: '#64748B', fontSize: '0.875rem', maxWidth: '440px', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.5' }}>
                                    Your compensation structure, bank disbursement account, PAN, and PF/UAN are protected.
                                    Accept the incoming invitation from <strong style={{ color: '#0F172A' }}>santhoshhhhhh(HR)</strong> to unlock and view your records.
                                </p>

                                {/* Redacted Preview Placeholders */}
                                <div style={{
                                    width: '100%',
                                    maxWidth: '460px',
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                    marginBottom: '1.75rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>EMPLOYEE NAME</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>BASIC MONTHLY SALARY</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>₹ ••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>DISBURSEMENT BANK</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••••</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>PAN & PF INFO</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '2px' }}>••••••••••</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => updateStatus('accepted')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.75rem',
                                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: '700',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 3px 12px rgba(27, 107, 58, 0.28)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Unlock size={17} />
                                    <span>Accept Invitation to Unlock</span>
                                </button>
                            </div>
                        )}

                        {/* ─────── STATE B: ACCEPTED (FULL SALARY & PROFILE REVEALED) ─────── */}
                        {invitationStatus === 'accepted' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                
                                {/* 1. Employee Profile Header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '54px',
                                            height: '54px',
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                            color: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '800',
                                            fontSize: '1.3rem',
                                            boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
                                        }}>
                                            RK
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                                                    Rakesh Kumar
                                                </h3>
                                                <BadgeCheck size={18} style={{ color: '#10B981' }} />
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                                                Operations • <strong style={{ color: '#F1F5F9' }}>Sales Executive</strong>
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
                                                Employee Code: <span style={{ color: '#CBD5E1', fontWeight: '600' }}>CLK-EMP-088</span> • Joining: 01 Mar 2026
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>
                                            Employment Status
                                        </div>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: 'rgba(16, 185, 129, 0.18)',
                                            color: '#34D399',
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '50px',
                                            fontSize: '0.78rem',
                                            fontWeight: '700',
                                            marginTop: '0.25rem'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                                            FULL TIME ACTIVE
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Monthly Compensation & Salary Structure */}
                                <div style={{
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                                                Basic Monthly Salary
                                            </span>
                                            <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#1B6B3A', marginTop: '0.1rem' }}>
                                                ₹35,000
                                                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748B', marginLeft: '0.35rem' }}>
                                                    / month
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{
                                            background: '#ECFDF5',
                                            border: '1px solid #A7F3D0',
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '10px',
                                            textAlign: 'right'
                                        }}>
                                            <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>
                                                Annual CTC
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#065F46' }}>
                                                ₹4,20,000
                                            </div>
                                        </div>
                                    </div>

                                    {/* Breakdown */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                        gap: '0.75rem',
                                        background: '#FFFFFF',
                                        padding: '0.85rem',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>BASIC PAY (70%)</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>₹24,500</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>HRA (20%)</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>₹7,000</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>SPECIAL ALLOWANCE</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginTop: '0.1rem' }}>₹3,500</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>EST. IN-HAND TAKEHOME</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1B6B3A', marginTop: '0.1rem' }}>₹33,000</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Bank & Disbursement Details */}
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                        <CreditCard size={17} style={{ color: '#2563EB' }} />
                                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                            Bank Disbursement Details
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>BANK NAME</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                HDFC Bank
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>ACCOUNT NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                •••• •••• 5678
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>IFSC CODE</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                HDFC0001234
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>DISBURSEMENT MODE</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#10B981', marginTop: '0.15rem' }}>
                                                Auto Direct Credit (NEFT)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. PAN & PF / Statutory Compliance */}
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                        <ShieldCheck size={17} style={{ color: '#1B6B3A' }} />
                                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                            PAN, PF & Compliance Records
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>PAN NUMBER</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                                                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A' }}>
                                                    ABCDE1234F
                                                </span>
                                                <span style={{ fontSize: '0.65rem', background: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                                                    VERIFIED
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>PF / UAN NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                101234567890
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '600' }}>ESI ACCOUNT NUMBER</div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A', marginTop: '0.15rem' }}>
                                                31009876540001
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Recent Payslips / Documents */}
                                <div style={{
                                    background: '#F8FAFC',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    padding: '1.25rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FileText size={17} style={{ color: '#2563EB' }} />
                                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', textTransform: 'uppercase' }}>
                                                Disbursed Payslips
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                            Generated by santhoshhhhhh(HR)
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {[
                                            { month: 'August 2026', date: '31 Aug 2026', amount: '₹35,000', status: 'Disbursed' },
                                            { month: 'July 2026', date: '31 Jul 2026', amount: '₹35,000', status: 'Disbursed' }
                                        ].map((slip, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: '#FFFFFF',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '10px',
                                                border: '1px solid #E2E8F0'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>
                                                        {slip.month} Payslip
                                                    </div>
                                                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                                        Credited on {slip.date} • {slip.amount}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => alert(`Downloading ${slip.month} Payslip...`)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.4rem 0.75rem',
                                                        background: '#F1F5F9',
                                                        border: '1px solid #CBD5E1',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        color: '#334155',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Download size={13} />
                                                    <span>Slip</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default StaffDetails;
