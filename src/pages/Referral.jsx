
import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { 
    Gift, 
    Copy, 
    Check, 
    Users, 
    Award, 
    ArrowRight, 
    Sparkles, 
    TrendingUp, 
    Share2, 
    Twitter, 
    Facebook, 
    Linkedin, 
    Coins,
    ChevronRight,
    MessageSquare,
    Clock,
    Trophy,
    ShieldAlert,
    CheckCircle2,
    Lock,
    ShoppingBag,
    Tag,
    Zap,
    FileSpreadsheet,
    HardDrive,
    BadgeCheck
} from 'lucide-react';
import referralService, { REDEMPTION_CATALOG, STAGE_REWARDS } from '../services/referralService';
import '../App.css';

const BusinessReferral = () => {
    const [copied, setCopied] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [wallet, setWallet] = useState({ available_points: 0, pending_points: 0, total_earned_points: 0 });
    const [referralsList, setReferralsList] = useState([]);
    const [redemptionsLog, setRedemptionsLog] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'store' | 'anti-fraud'
    
    // Redeem Code State
    const [inputReferralCode, setInputReferralCode] = useState('');
    const [redeemMessage, setRedeemMessage] = useState(null);

    const refreshData = async () => {
        const code = referralService.getUserReferralCode();
        const link = referralService.getReferralLink();
        await referralService.fetchReferrals();
        const w = referralService.getWallet();
        const refs = referralService.getReferralsList();
        const rdms = referralService.getRedemptions();

        setReferralCode(code);
        setReferralLink(link);
        setWallet(w);
        setReferralsList(refs);
        setRedemptionsLog(rdms);
    };

    useEffect(() => {
        refreshData();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = (platform) => {
        const text = `Join Cliks Business and supercharge your ledger today! Use my invite link: ${referralLink}`;
        let url = '';
        if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        } else if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        } else if (platform === 'linkedin') {
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        } else if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        }
        
        if (url) window.open(url, '_blank');
    };

    const handleRedeemReward = (rewardId) => {
        try {
            const result = referralService.redeemPoints(rewardId);
            alert(`🎉 Success! You have redeemed "${result.title}". Item added to your active features.`);
            refreshData();
        } catch (err) {
            alert(err.message || 'Failed to redeem reward.');
        }
    };

    const handleApplyReferralCode = (e) => {
        e.preventDefault();
        if (!inputReferralCode.trim()) return;

        const res = referralService.validateAndApplyReferralCode(inputReferralCode, 'currentuser@business.in');
        setRedeemMessage(res);
        if (res.success) {
            refreshData();
            setInputReferralCode('');
        }
    };

    const handleAdvanceStage = (id, newStage) => {
        const res = referralService.advanceReferralStage(id, newStage);
        if (res.success) {
            refreshData();
        } else {
            alert(res.message);
        }
    };

    return (
        <div style={{ padding: '1.133rem 2.266rem', background: '#F8FAFC', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
            
            {/* Header Title Grid */}
            <div style={{ display: 'flex', flexShrink: 0, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.133rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.272rem' }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white',
                            boxShadow: '0 8px 16px rgba(6, 78, 59, 0.2)'
                        }}>
                            <Gift size={22} />
                        </div>
                        <h1 style={{ fontSize: '1.677rem', fontWeight: '850', color: '#1E293B', letterSpacing: '-0.02em', margin: 0 }}>Refer. Grow. Earn Premium.</h1>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.861rem', fontWeight: '500', margin: 0 }}>
                        Refer a business owner → They join Cliks → They become active → You both earn rewards.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '1.812rem' }}>

                {/* Hero Splendor Banner */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #064E3B 0%, #0F766E 100%)', 
                    borderRadius: '18px', 
                    padding: '2.266rem', 
                    color: 'white', 
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.812rem',
                    boxShadow: '0 20px 40px rgba(6, 78, 59, 0.15)'
                }}>
                    <div style={{ maxWidth: '60%', zIndex: 1 }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.363rem 0.816rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.453rem', marginBottom: '1.133rem', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <Sparkles size={15} color="#FCD34D" />
                            <span style={{ fontSize: '0.707rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliks Partner Network</span>
                        </div>
                        <h2 style={{ fontSize: '2.039rem', fontWeight: '950', margin: '0 0 0.68rem 0', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                            Refer & Earn Premium
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.453rem', opacity: 0.95 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', fontSize: '0.906rem', fontWeight: '700', color: '#A7F3D0' }}>
                                <span>🎁 You earn <strong>500 Points</strong> when your referral becomes active.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', fontSize: '0.906rem', fontWeight: '700', color: '#FCD34D' }}>
                                <span>🚀 Earn <strong>1,000 Bonus Points</strong> if they upgrade to Premium.</span>
                            </div>
                        </div>
                    </div>

                    {/* Referral Wallet Quick Pill */}
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.12)', 
                        backdropFilter: 'blur(16px)', 
                        border: '1px solid rgba(255,255,255,0.25)', 
                        borderRadius: '16px', 
                        padding: '1.586rem',
                        textAlign: 'center',
                        minWidth: '260px',
                        zIndex: 1
                    }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FCD34D', color: '#78350F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.68rem auto', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                            <Coins size={24} />
                        </div>
                        <span style={{ display: 'block', fontSize: '0.652rem', fontWeight: '800', color: '#D1FAE5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.181rem' }}>Referral Points Balance</span>
                        <h3 style={{ fontSize: '2.266rem', fontWeight: '950', margin: 0, color: '#FFFFFF', lineHeight: 1 }}>{wallet.available_points}</h3>
                        <p style={{ margin: '0.544rem 0 0 0', fontSize: '0.725rem', fontWeight: '700', color: '#A7F3D0' }}>
                            {wallet.pending_points} Points Pending 🕒
                        </p>
                    </div>
                </div>

                {/* 3 Referral Wallet Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.133rem', marginBottom: '1.812rem' }}>
                    
                    {/* Card 1: Available Points */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.223rem 1.359rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.652rem', fontWeight: '850', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.363rem' }}>
                                🪙 Available Points
                            </span>
                            <h4 style={{ fontSize: '1.677rem', fontWeight: '950', margin: 0, color: '#064E3B' }}>{wallet.available_points} Pts</h4>
                            <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748B' }}>Ready to redeem for discounts & extensions</span>
                        </div>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Coins size={22} />
                        </div>
                    </div>

                    {/* Card 2: Pending Points */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.223rem 1.359rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.652rem', fontWeight: '850', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.363rem' }}>
                                🕒 Pending Points
                            </span>
                            <h4 style={{ fontSize: '1.677rem', fontWeight: '950', margin: 0, color: '#B45309' }}>{wallet.pending_points} Pts</h4>
                            <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748B' }}>Unlocks as referred users activate</span>
                        </div>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={22} />
                        </div>
                    </div>

                    {/* Card 3: Total Points Earned */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '1.223rem 1.359rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.652rem', fontWeight: '850', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.363rem' }}>
                                🏆 Total Points Earned
                            </span>
                            <h4 style={{ fontSize: '1.677rem', fontWeight: '950', margin: 0, color: '#4C1D95' }}>{wallet.total_earned_points} Pts</h4>
                            <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748B' }}>Lifetime earned across all stages</span>
                        </div>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trophy size={22} />
                        </div>
                    </div>

                </div>

                {/* Referral Link & Social Sharing Bar */}
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.586rem', marginBottom: '1.812rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                        <div>
                            <h3 style={{ fontSize: '0.997rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>Your Exclusive Referral Link</h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.725rem', color: '#64748B', fontWeight: '500' }}>Share with fellow business owners. Anti-fraud engine automatically tracks stage progress.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.453rem' }}>
                            <span style={{ background: '#F1F5F9', color: '#334155', padding: '0.317rem 0.68rem', borderRadius: '8px', fontSize: '0.68rem', fontWeight: '800' }}>Code: {referralCode}</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.133rem', alignItems: 'center' }}>
                        <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1.5px dashed #CBD5E1', padding: '0.77rem 0.997rem', display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                            <input 
                                readOnly
                                value={referralLink}
                                style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '0.816rem', fontWeight: '750', color: '#064E3B', outline: 'none' }}
                            />
                            <button 
                                onClick={copyToClipboard}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.363rem', padding: '0.589rem 0.997rem', 
                                    borderRadius: '12px', border: 'none', cursor: 'pointer',
                                    background: copied ? '#059669' : '#1E293B', color: 'white',
                                    fontWeight: '800', fontSize: '0.725rem', transition: 'all 0.2s ease'
                                }}
                            >
                                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Referral Link</>}
                            </button>
                        </div>

                        {/* Social Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.453rem' }}>
                            {[
                                { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, bg: '#25D366', color: 'white' },
                                { key: 'facebook', label: 'Facebook', icon: Facebook, bg: '#1877F2', color: 'white' },
                                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, bg: '#0A66C2', color: 'white' },
                                { key: 'twitter', label: 'Twitter', icon: Twitter, bg: '#1DA1F2', color: 'white' }
                            ].map(sns => (
                                <button 
                                    key={sns.key}
                                    onClick={() => shareUrl(sns.key)}
                                    style={{ 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        gap: '3px', padding: '0.498rem 0.272rem', borderRadius: '12px', border: 'none',
                                        background: sns.bg, color: sns.color, cursor: 'pointer', fontWeight: '800', fontSize: '0.634rem'
                                    }}
                                >
                                    <sns.icon size={15} />
                                    <span>{sns.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div style={{ display: 'flex', gap: '0.68rem', marginBottom: '1.359rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.68rem' }}>
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        style={{ 
                            padding: '0.589rem 1.133rem', borderRadius: '12px', border: 'none',
                            background: activeTab === 'dashboard' ? '#064E3B' : '#FFFFFF',
                            color: activeTab === 'dashboard' ? '#FFFFFF' : '#475569',
                            fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.453rem',
                            boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(6,78,59,0.2)' : 'none'
                        }}
                    >
                        <Users size={16} /> Referral Progress Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('store')}
                        style={{ 
                            padding: '0.589rem 1.133rem', borderRadius: '12px', border: 'none',
                            background: activeTab === 'store' ? '#064E3B' : '#FFFFFF',
                            color: activeTab === 'store' ? '#FFFFFF' : '#475569',
                            fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.453rem',
                            boxShadow: activeTab === 'store' ? '0 4px 12px rgba(6,78,59,0.2)' : 'none'
                        }}
                    >
                        <ShoppingBag size={16} /> Points Redemption Center ({REDEMPTION_CATALOG.length} Rewards)
                    </button>
                    <button 
                        onClick={() => setActiveTab('anti-fraud')}
                        style={{ 
                            padding: '0.589rem 1.133rem', borderRadius: '12px', border: 'none',
                            background: activeTab === 'anti-fraud' ? '#064E3B' : '#FFFFFF',
                            color: activeTab === 'anti-fraud' ? '#FFFFFF' : '#475569',
                            fontWeight: '800', fontSize: '0.77rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.453rem',
                            boxShadow: activeTab === 'anti-fraud' ? '0 4px 12px rgba(6,78,59,0.2)' : 'none'
                        }}
                    >
                        <Lock size={16} /> Anti-Fraud & Rules
                    </button>
                </div>

                {/* TAB 1: REFERRAL DASHBOARD TABLE */}
                {activeTab === 'dashboard' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.359rem', alignItems: 'start' }}>
                        <div style={{ minWidth: 0, background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.359rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '0.997rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>Referral Stage Progress Tracker</h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.707rem', color: '#64748B', fontWeight: '500' }}>Track friend signups, business setups, active status, and premium upgrades.</p>
                                </div>
                                <span style={{ background: '#ECFDF5', color: '#047857', padding: '0.317rem 0.68rem', borderRadius: '8px', fontSize: '0.68rem', fontWeight: '800' }}>
                                    {referralsList.length} Total Referrals
                                </span>
                            </div>

                            {/* Dashboard Table */}
                            <div className="cliks-table-scroll" style={{ border: '1px solid #E2E8F0', borderRadius: '14px' }}>
                                <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
                                    <thead style={{ background: '#F8FAFC' }}>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                                            <th style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '800', whiteSpace: 'nowrap' }}>Referred User</th>
                                            <th style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '800', whiteSpace: 'nowrap' }}>Status / Stage</th>
                                            <th style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '800', whiteSpace: 'nowrap' }}>Reward Earned</th>
                                            <th style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: '800', textAlign: 'right', whiteSpace: 'nowrap' }}>Stage Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referralsList.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '2.266rem 0.906rem', textAlign: 'center', color: '#64748B', fontWeight: '500' }}>
                                                    No referrals yet. Share your exclusive referral link above to start earning rewards!
                                                </td>
                                            </tr>
                                        ) : (
                                            [...referralsList].sort((a, b) => {
                                                const timeB = new Date(b.registered_at || b.joined_date || 0).getTime();
                                                const timeA = new Date(a.registered_at || a.joined_date || 0).getTime();
                                                if (timeB !== timeA) return timeB - timeA;
                                                return (Number(b.id) || 0) - (Number(a.id) || 0);
                                            }).map((ref) => {
                                                const isRegistered = ref.stage === 'REGISTERED' || ref.stage === 'Registered';
                                                const isSetup = ref.stage === 'SETUP_COMPLETE' || ref.stage === 'Setup Complete';
                                                const isActive = ref.stage === 'ACTIVE' || ref.stage === 'Active' || ref.stage === 'Active User';
                                                const isPremium = ref.stage === 'PREMIUM' || ref.stage === 'Premium';

                                                const displayName = ref.refereeName || ref.name || 'Friend';
                                                const displayEmail = ref.refereeEmail || ref.email || '';
                                                const displayDate = ref.registered_at || ref.joinedDate || ref.joined_date || 'Today';
                                                const displayReward = ref.rewardEarned || ref.reward_earned || (
                                                    isRegistered ? 'Pending' :
                                                    isSetup ? '100 Points' :
                                                    isActive ? '200 Points' :
                                                    isPremium ? '1,600 Points (+1,000 Bonus)' : '200 Points'
                                                );

                                                return (
                                                    <tr key={ref.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                        <td style={{ padding: '0.589rem 0.78rem', maxWidth: '210px' }} title={`${displayName} (${displayEmail}) • Joined ${displayDate}`}>
                                                            <div style={{ fontWeight: '800', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                                                            <div style={{ fontSize: '0.652rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayEmail} • Joined {displayDate}</div>
                                                        </td>
                                                        <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                            {isRegistered && (
                                                                <span className="badge-nowrap" style={{ background: '#FEF3C7', color: '#B45309', padding: '0.227rem 0.544rem', borderRadius: '8px', fontSize: '0.652rem', fontWeight: '800' }}>
                                                                    Registered
                                                                </span>
                                                            )}
                                                            {isSetup && (
                                                                <span className="badge-nowrap" style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.227rem 0.544rem', borderRadius: '8px', fontSize: '0.652rem', fontWeight: '800' }}>
                                                                    Setup Complete
                                                                </span>
                                                            )}
                                                            {isActive && (
                                                                <span className="badge-nowrap" style={{ background: '#D1FAE5', color: '#065F46', padding: '0.227rem 0.544rem', borderRadius: '8px', fontSize: '0.652rem', fontWeight: '800' }}>
                                                                    Active User
                                                                </span>
                                                            )}
                                                            {isPremium && (
                                                                <span className="badge-nowrap" style={{ background: '#F3E8FF', color: '#6B21A8', padding: '0.227rem 0.544rem', borderRadius: '8px', fontSize: '0.652rem', fontWeight: '800' }}>
                                                                    Premium User 👑
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>
                                                            <span style={{ color: isActive ? '#059669' : isPremium ? '#7C3AED' : isSetup ? '#2563EB' : '#94A3B8', fontWeight: '900' }} title={displayReward}>
                                                                {displayReward}
                                                            </span>
                                                        </td>
                                                        <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                            <div style={{ display: 'inline-flex', gap: '4px', whiteSpace: 'nowrap' }}>
                                                                {isRegistered && (
                                                                    <button 
                                                                        onClick={() => handleAdvanceStage(ref.id, 'ACTIVE')}
                                                                        style={{ border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', padding: '4px 8px', borderRadius: '6px', fontSize: '0.634rem', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                                        title="Activate referred user"
                                                                    >
                                                                        + Activate
                                                                    </button>
                                                                )}
                                                                {isActive && (
                                                                    <span style={{ border: '1px solid #A7F3D0', background: '#ECFDF5', color: '#047857', padding: '4px 8px', borderRadius: '6px', fontSize: '0.634rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                                                                        ✓ Active
                                                                    </span>
                                                                )}
                                                                {isPremium && (
                                                                    <span style={{ fontSize: '0.634rem', color: '#059669', fontWeight: '800', whiteSpace: 'nowrap' }}>✓ Max Rewards Earned</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Redeem Code Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                            {/* Apply Referral Code Card */}
                            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.359rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                                <h4 style={{ margin: '0 0 0.363rem 0', fontSize: '0.906rem', fontWeight: '850', color: '#1E293B' }}>Have a Referral Code?</h4>
                                <p style={{ margin: '0 0 0.906rem 0', fontSize: '0.707rem', color: '#64748B', fontWeight: '500' }}>
                                    Enter your friend's invite code to claim 🎁 <strong>200 Welcome Points</strong>.
                                </p>

                                <form onSubmit={handleApplyReferralCode} style={{ display: 'flex', flexDirection: 'column', gap: '0.68rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. CLIKS-BIZ-9821X"
                                        value={inputReferralCode}
                                        onChange={(e) => setInputReferralCode(e.target.value)}
                                        style={{ padding: '0.68rem', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.77rem', outline: 'none' }}
                                    />
                                    <button 
                                        type="submit"
                                        style={{ padding: '0.68rem', borderRadius: '12px', border: 'none', background: '#064E3B', color: 'white', fontWeight: '850', fontSize: '0.77rem', cursor: 'pointer' }}
                                    >
                                        Claim 200 Welcome Points
                                    </button>
                                </form>

                                {redeemMessage && (
                                    <div style={{ marginTop: '0.77rem', padding: '0.68rem', borderRadius: '10px', background: redeemMessage.success ? '#ECFDF5' : '#FEF2F2', border: redeemMessage.success ? '1px solid #A7F3D0' : '1px solid #FCA5A5', color: redeemMessage.success ? '#047857' : '#991B1B', fontSize: '0.707rem', fontWeight: '700' }}>
                                        {redeemMessage.message}
                                    </div>
                                )}
                            </div>

                            {/* Reward Conversion Rules Box */}
                            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.359rem' }}>
                                <h4 style={{ margin: '0 0 0.68rem 0', fontSize: '0.816rem', fontWeight: '850', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Conversion Rates
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.544rem', fontSize: '0.725rem', fontWeight: '700' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.453rem 0.68rem', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        <span style={{ color: '#475569' }}>500 Points</span>
                                        <span style={{ color: '#059669', fontWeight: '900' }}>= ₹50 Discount</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.453rem 0.68rem', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        <span style={{ color: '#475569' }}>1,000 Points</span>
                                        <span style={{ color: '#7C3AED', fontWeight: '900' }}>= 7 Days Extension</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: REDEMPTION CENTER */}
                {activeTab === 'store' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.087rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>Points Redemption Store</h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.725rem', color: '#64748B', fontWeight: '500' }}>Use your available points for subscription discounts, extensions, advanced reports, and extra storage.</p>
                            </div>
                            <div style={{ background: '#ECFDF5', color: '#064E3B', padding: '0.453rem 0.906rem', borderRadius: '12px', fontWeight: '900', fontSize: '0.816rem', border: '1px solid #A7F3D0' }}>
                                🪙 Balance: {wallet.available_points} Points
                            </div>
                        </div>

                        {/* Catalog Cards Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.133rem', marginBottom: '1.812rem' }}>
                            {REDEMPTION_CATALOG.map((item) => {
                                const canAfford = wallet.available_points >= item.cost;
                                return (
                                    <div key={item.id} style={{ background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '1.359rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.68rem' }}>
                                                <span style={{ background: '#F1F5F9', color: '#475569', padding: '0.227rem 0.544rem', borderRadius: '6px', fontSize: '0.634rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    {item.category}
                                                </span>
                                                <span style={{ background: '#ECFDF5', color: '#047857', padding: '0.227rem 0.544rem', borderRadius: '6px', fontSize: '0.634rem', fontWeight: '800' }}>
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <h4 style={{ margin: '0 0 0.363rem 0', fontSize: '0.952rem', fontWeight: '850', color: '#1E293B' }}>{item.title}</h4>
                                            <p style={{ margin: '0 0 1.133rem 0', fontSize: '0.725rem', color: '#64748B', lineHeight: '1.4' }}>{item.desc}</p>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.906rem', marginBottom: '0.906rem' }}>
                                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>Points Cost</span>
                                                <span style={{ fontSize: '1.087rem', fontWeight: '950', color: '#064E3B' }}>{item.cost} Pts</span>
                                            </div>

                                            <button 
                                                onClick={() => handleRedeemReward(item.id)}
                                                disabled={!canAfford}
                                                style={{ 
                                                    width: '100%', padding: '0.68rem', borderRadius: '12px', border: 'none',
                                                    background: canAfford ? 'linear-gradient(135deg, #064E3B 0%, #047857 100%)' : '#E2E8F0',
                                                    color: canAfford ? 'white' : '#94A3B8',
                                                    fontWeight: '850', fontSize: '0.77rem', cursor: canAfford ? 'pointer' : 'not-allowed',
                                                    boxShadow: canAfford ? '0 4px 12px rgba(6,78,59,0.15)' : 'none'
                                                }}
                                            >
                                                {canAfford ? 'Redeem Now 🎁' : `Need ${item.cost - wallet.available_points} More Pts`}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Redemption Log Table */}
                        {redemptionsLog.length > 0 && (
                            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.359rem' }}>
                                <h4 style={{ margin: '0 0 0.906rem 0', fontSize: '0.906rem', fontWeight: '850', color: '#1E293B' }}>Redemption History</h4>
                                <div style={{ border: '1px solid #E2E8F0', borderRadius: '14px', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.748rem' }}>
                                        <thead style={{ background: '#F8FAFC' }}>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                                                <th style={{ padding: '0.68rem 0.906rem', color: '#64748B' }}>Reward Title</th>
                                                <th style={{ padding: '0.68rem 0.906rem', color: '#64748B' }}>Category</th>
                                                <th style={{ padding: '0.68rem 0.906rem', color: '#64748B' }}>Cost</th>
                                                <th style={{ padding: '0.68rem 0.906rem', color: '#64748B', textAlign: 'right' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {redemptionsLog.map(log => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.68rem 0.906rem', fontWeight: '800' }}>{log.title}</td>
                                                    <td style={{ padding: '0.68rem 0.906rem' }}>{log.category}</td>
                                                    <td style={{ padding: '0.68rem 0.906rem', fontWeight: '900', color: '#DC2626' }}>-{log.cost} Pts</td>
                                                    <td style={{ padding: '0.68rem 0.906rem', textAlign: 'right', color: '#64748B' }}>{new Date(log.redeemed_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: ANTI-FRAUD RULES & PROTECTION */}
                {activeTab === 'anti-fraud' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.359rem' }}>
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.586rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '1.133rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShieldAlert size={22} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.042rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>Strict Anti-Fraud Protection Rules</h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.725rem', color: '#64748B' }}>Active security protocols safeguarding the Refer & Earn ecosystem.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                {[
                                    { title: 'Self-Referral Prevention', desc: 'A user cannot refer themselves or use their own referral code. Codes matching the logged-in account are automatically rejected.', status: 'Active Enforcement' },
                                    { title: 'Single Referral Code Limit', desc: 'Each new user account can only redeem a single referral code during setup.', status: 'Active Enforcement' },
                                    { title: 'Stage-Gated Reward Unlock', desc: 'Rewards are not issued immediately for simple registration. Registration remains Pending until setup and activation stages complete.', status: 'Active Enforcement' },
                                    { title: 'Duplicate Reward Prevention', desc: 'Points are credited exactly ONCE per qualifying stage for each referred user. Re-triggering stages does not generate duplicate rewards.', status: 'Active Enforcement' },
                                    { title: 'Stage-Based Tracking', desc: 'Referrals transition dynamically across Registered (Pending) → Setup Complete (100 Pts) → Active (500 Pts) → Premium (1,000 Bonus Pts).', status: 'Active Enforcement' }
                                ].map((rule, idx) => (
                                    <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.997rem 1.133rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.272rem 0', fontSize: '0.834rem', fontWeight: '800', color: '#1E293B' }}>{idx + 1}. {rule.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.725rem', color: '#64748B', lineHeight: '1.4' }}>{rule.desc}</p>
                                        </div>
                                        <span style={{ background: '#ECFDF5', color: '#047857', padding: '0.272rem 0.589rem', borderRadius: '8px', fontSize: '0.634rem', fontWeight: '850', border: '1px solid #A7F3D0', whiteSpace: 'nowrap' }}>
                                            ✓ {rule.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Anti-Fraud Monitor Box */}
                        <div style={{ background: '#064E3B', color: 'white', borderRadius: '16px', padding: '1.586rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', marginBottom: '0.906rem' }}>
                                    <BadgeCheck size={20} color="#FCD34D" />
                                    <span style={{ fontSize: '0.725rem', fontWeight: '850', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#A7F3D0' }}>System Health</span>
                                </div>
                                <h3 style={{ fontSize: '1.495rem', fontWeight: '950', margin: '0 0 0.68rem 0', lineHeight: 1.2 }}>
                                    Anti-Fraud Engine Status: 100% Operational
                                </h3>
                                <p style={{ fontSize: '0.77rem', opacity: 0.9, lineHeight: '1.5' }}>
                                    All referral registrations, stage progressions, and points redemptions are verified against anti-fraud rules before points credit to wallet balances.
                                </p>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.906rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', marginTop: '1.812rem' }}>
                                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase' }}>Active Account Info</span>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.77rem', fontWeight: '750' }}>Referral Code: {referralCode}</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.68rem', opacity: 0.8 }}>Status: Verified Partner</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BusinessReferral;
