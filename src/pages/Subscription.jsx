import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    CreditCard, 
    Check, 
    Zap, 
    ShieldCheck, 
    ShieldAlert,
    Award, 
    Crown, 
    History, 
    ArrowUpRight, 
    Download, 
    Calendar,
    Sparkles,
    Minus,
    Plus
} from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';
import { apiClient } from '../api/client';
import { caService } from '../services';
import { profileService } from '../services/profileService';
import { getPlanDuration } from '../utils/subscriptionUtils';
import '../App.css';
import { formatCurrency } from '../lib/formatCurrency';
import { useAuth } from '../context';

const Subscription = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: icaiData } = useQuery({
        queryKey: ['icaiVerificationStatus'],
        queryFn: () => caService.getIcaiVerification(),
        retry: false
    });
    const isCaVerified = (icaiData?.data || icaiData || {}).status === 'VERIFIED';
    const currency = { code: 'INR' };
    const storedFinProPlan = user?.active_subscriptions?.fin_pro?.plan || user?.finpro_plan;
    const legacyFinProPlans = {
        'FIN-PRO Standard': 'Fin-Pro Solo',
        'FIN-PRO Premium': 'Fin-Pro Firm',
        'FIN-PRO Enterprise': 'Fin-Pro Firm'
    };
    const initialFinProPlan = legacyFinProPlans[storedFinProPlan] || storedFinProPlan || null;
    const [activeCategory, setActiveCategory] = useState('ca');
    const [betaSubCategory, setBetaSubCategory] = useState('investor'); 
    const [selectedTier, setSelectedTier] = useState(initialFinProPlan);
    const [activeFinProPlan, setActiveFinProPlan] = useState(initialFinProPlan);
    const [firmTeamMembers, setFirmTeamMembers] = useState(3);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showIcaiGuardModal, setShowIcaiGuardModal] = useState(false);

    const handleUpgrade = async (tier, categoryKey, teamMemberCount = firmTeamMembers) => {
        const currentPlan = categoryKey === 'ca' ? activeFinProPlan : selectedTier;
        if (tier.name === currentPlan) return;

        // Institutional ICAI Verification Guard for FIN-PRO Suite (reference flow)
        const isFinProTier = categoryKey === 'ca' || (tier.name && tier.name.startsWith('Fin-Pro'));
        if (isFinProTier) {
            try {
                const icaiRes = await caService.getIcaiVerification();
                const icai = icaiRes?.data || icaiRes;
                if (!icai || icai.status !== 'VERIFIED') {
                    setShowIcaiGuardModal(true);
                    return;
                }
            } catch (e) {
                setShowIcaiGuardModal(true);
                return;
            }
        }

        const extraTeamMembers = tier.includedTeamMembers
            ? Math.max(0, teamMemberCount - tier.includedTeamMembers)
            : 0;
        const amt = (tier.priceMonthly ?? tier.priceAnnually)
            + extraTeamMembers * (tier.additionalMemberMonthlyPrice || 0);

        try {
            setIsProcessing(true);
            const generatedOrderId = `SUB_${Date.now()}_${Math.floor(Math.random() * 999)}`;
            let paymentSessionId = null;

            const backendData = await apiClient.post('/payments/create-order', {
                amount: amt,
                orderId: generatedOrderId,
                currency: currency?.code || 'INR'
            });

            if (backendData && backendData.data && backendData.data.payment_session_id) {
                paymentSessionId = backendData.data.payment_session_id;
            } else {
                throw new Error("Malformed session received from server cluster.");
            }

            const mode = backendData?.data?.mode || backendData?.data?.cf_environment || (window.location.hostname.includes('cliksbusiness.com') || window.location.hostname.includes('cliks.beta-softnet.com') ? 'production' : 'sandbox');
            const cashfree = await load({ mode });

            const result = await cashfree.checkout({
                paymentSessionId: paymentSessionId,
                redirectTarget: "_modal"
            });

            if (result.error) {
                alert("Gateway Interrupted: " + result.error.message);
            } else {
                const duration = getPlanDuration(tier.name);
                let cat = categoryKey === 'ca' ? 'fin_pro' : null;
                if (!cat) {
                    if (['Fin-Pro Solo', 'Fin-Pro Firm', 'FIN-PRO'].includes(tier.name)) cat = 'fin_pro';
                    else if (['Basic Investor', 'Pro Investor', 'Investor Club'].includes(tier.name)) cat = 'investor';
                    else if (['Monthly Innovator', 'Yearly Founder', 'Poster Plan'].includes(tier.name)) cat = 'poster';
                    else cat = 'business';
                }

                const now = new Date();
                const expiryDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString();
                const existingSubs = user?.active_subscriptions || {};
                const updatedSubs = {
                    ...existingSubs,
                    [cat]: {
                        active: true,
                        plan: tier.name,
                        startDate: now.toISOString(),
                        expiryDate,
                        valid_until: expiryDate,
                        updated_at: now.toISOString()
                    }
                };
                const updatePayload = { active_subscriptions: updatedSubs };
                if (cat === 'business') {
                    updatePayload.tier = tier.name;
                    updatePayload.subscription_days_remaining = duration;
                }

                try {
                    await profileService.updateProfile(updatePayload);
                } catch (e) {
                    console.error('Failed to update active subscription after payment:', e);
                    alert(`Payment completed, but the ${tier.name} subscription could not be activated. Please contact support or refresh and verify your subscription status before retrying.`);
                    return;
                }

                queryClient.invalidateQueries();
                setSelectedTier(tier.name);
                if (isFinProTier || categoryKey === 'ca') {
                    setActiveFinProPlan(tier.name);
                    window.dispatchEvent(new Event('finpro:subscription-activated'));
                }
                alert(`Successfully upgraded to ${tier.name}!`);
                window.location.reload();
            }
        } catch (err) {
            console.warn("[CASHFREE GATEWAY LOGGER]:", err.message);
            alert(`Cashfree checkout could not be started: ${err.message || 'Unable to create a payment session.'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const allTiers = {
        basic: [
            {
                name: 'Basic Plan',
                priceAnnually: 249,
                originalPrice: 499,
                desc: 'Simple, ad-free experience to get you started.',
                icon: ShieldCheck,
                color: '#0E4F2E',
                badge: 'Starter',
                validity: 'Up to 12 Days',
                features: [
                    'No Ads',
                    'Validity: Up to 12 Days',
                ]
            }
        ],
        ca: [
            {
                name: 'Fin-Pro Solo',
                priceMonthly: 799,
                originalPrice: 1199,
                desc: 'Perfect for solo practitioners and independent auditors.',
                icon: ShieldCheck,
                color: '#4F46E5',
                badge: 'SOLO',
                features: [
                    'Manage up to 25 Active Client Ledgers',
                    'Standard Multi-Client GST/ITR Reporting',
                    'Direct Auditing & Daybook Verification Logs',
                    'Automated Exporting to CSV/Excel formats',
                    'Priority Email Support'
                ]
            },
            {
                name: 'Fin-Pro Firm',
                priceMonthly: 1499,
                originalPrice: 2499,
                includedTeamMembers: 3,
                additionalMemberMonthlyPrice: 299,
                desc: 'Designed for scaling accounting firms and collaborative auditing teams.',
                icon: Zap,
                color: '#3B82F6',
                badge: 'FIRM',
                features: [
                    'Manage Unlimited Active Client Ledgers',
                    'Custom White-Labeled Client Report Generation',
                    '3 team members included by default',
                    'Additional members at just ₹299/month each',
                    'Live Chat Support & Direct API Sandbox Access'
                ]
            }
        ],
        betaclub_investor: [
            {
                name: 'Beta Angel',
                priceAnnually: 4999,
                originalPrice: 7999,
                desc: 'Access curated startup directories and begin early-stage venture backing.',
                icon: ShieldCheck,
                color: '#7C3AED',
                badge: 'Early Stage',
                features: [
                    'Access to curated startup and deal directories',
                    'Filter pitches by industry, funding goal, and equity share',
                    'Direct contact channels with verified founders (up to 15/mo)',
                    'Access to standard investor mastermind forums',
                    'Real-time notifications for newly listed ventures'
                ]
            },
            {
                name: 'Beta Venture Partner',
                priceAnnually: 9999,
                originalPrice: 14999,
                desc: 'Designed for professional angels, syndicate participants, and active investors.',
                icon: Zap,
                color: '#6D28D9',
                badge: 'Professional Dealflow',
                features: [
                    'All features of Beta Angel tier',
                    'Direct contact details for unlimited startup listings',
                    'Interactive deal rooms & shared pitch folders',
                    'Monthly co-investment circulars & VC partner access',
                    '1-on-1 deal flow consultations with steering team'
                ]
            },
            {
                name: 'Beta Syndicate Lead',
                priceAnnually: 24999,
                originalPrice: 39999,
                desc: 'Ultimate sovereign tier for syndicates, institutional offices, and active VC networks.',
                icon: Crown,
                color: '#5B21B6',
                badge: 'VIP Sovereign',
                features: [
                    'All features of Beta Venture Partner tier',
                    'Direct syndicate matching & co-investment structures',
                    'VIP reserved seat at the Annual Founder\'s & Investor Gala',
                    'Priority invitations to physical Family Office roundtables',
                    'Dedicated investment analyst assistance & custom market research'
                ]
            }
        ],
        betaclub_product: [
            {
                name: 'Beta Innovator',
                priceAnnually: 1999,
                originalPrice: 2999,
                desc: 'Early access for founders seeking foundational product testing & community reach.',
                icon: ShieldCheck,
                color: '#EC4899',
                badge: 'Spark Launch',
                features: [
                    'Early access to new platform updates & beta tools',
                    'Standard community mastermind forum access',
                    'List 1 active roadmap/pitch in the Deal Marketplace',
                    '10% direct discount on partner integration modules',
                    'Standard investor-ready pitch templates & checklists'
                ]
            },
            {
                name: 'Beta Founder Premium',
                priceAnnually: 4999,
                originalPrice: 7999,
                desc: 'High-impact visibility, top placement, and verified badge for active venture teams.',
                icon: Zap,
                color: '#DB2777',
                badge: 'Venture Exposure',
                features: [
                    'All features of Beta Innovator tier',
                    'List up to 3 active roadmaps/pitches in the Marketplace',
                    'Top search placement inside the investor directory',
                    'Verified checkmark badge after deck review',
                    'Direct feedback channel to product steering team',
                    '20% lifetime discount on partner integrations'
                ]
            },
            {
                name: 'Beta Founding Partner',
                priceAnnually: 14999,
                originalPrice: 24999,
                desc: 'Sovereign founder tier with steering seat, lifetime fee freeze, and VIP gala entry.',
                icon: Crown,
                color: '#BE185D',
                badge: 'Founder Legacy',
                features: [
                    'All features of Beta Founder Premium tier',
                    'Unlimited active roadmaps/pitches in the Marketplace',
                    'Featured homepage and dashboard spotlight placement',
                    'VIP reserved seat at the Annual Founder\'s Gala',
                    'Direct voting seat on feature steering committee',
                    'Private Pitch-to-VC roundtable access pipelines',
                    'Lifetime subscription fee freeze guarantee'
                ]
            }
        ]
    };

    const invoices = [];

    const getRenewalDetails = () => {
        if (!selectedTier) {
            return {
                price: null,
                desc: 'No FIN-PRO subscription is active. Choose a plan below to get started.',
                gradient: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                color: '#1B6B3A',
                billingPeriod: null
            };
        }

        let foundTier = null;
        for (const cat of Object.keys(allTiers)) {
            const match = allTiers[cat].find(t => t.name === selectedTier);
            if (match) {
                foundTier = { ...match, category: cat };
                break;
            }
        }
        if (!foundTier) {
            return {
                price: null,
                desc: 'Subscription details are not available for this plan.',
                gradient: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                color: '#1B6B3A',
                billingPeriod: null
            };
        }
        
        let desc = '';
        let gradient = '';
        if (foundTier.category === 'basic') {
            desc = `Your workspace is running the Business plan with no ads, valid for up to 12 days.`;
            gradient = 'linear-gradient(135deg, #0E4F2E 0%, #064E3B 100%)';
        } else if (foundTier.category === 'business') {
            desc = `Your workspace is configured with high-performance ERP pipelines under the Business ${foundTier.name} tier.`;
            gradient = 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)';
        } else if (foundTier.category === 'ca') {
            desc = `Your workspace is configured with comprehensive auditor pipelines under the ${foundTier.name} plan.`;
            gradient = 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)';
        } else if (foundTier.category === 'betaclub_investor') {
            desc = `Your workspace is configured with exclusive investor network pipelines under the Partner Launch Desk (Investor) ${foundTier.name} tier.`;
            gradient = 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)';
        } else {
            desc = `Your workspace is configured with high-exposure roadmap channels under the Partner Launch Desk (Products & Ideas) ${foundTier.name} tier.`;
            gradient = 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)';
        }

        const extraTeamMembers = foundTier.includedTeamMembers
            ? Math.max(0, firmTeamMembers - foundTier.includedTeamMembers)
            : 0;
        
        return {
            price: (foundTier.priceMonthly ?? foundTier.priceAnnually)
                + extraTeamMembers * (foundTier.additionalMemberMonthlyPrice || 0),
            desc: desc,
            gradient: gradient,
            color: foundTier.category === 'ca' ? '#1B6B3A' : foundTier.color,
            billingPeriod: foundTier.priceMonthly ? 'month' : 'year'
        };
    };

    const renewal = getRenewalDetails();

    return (
        <div style={{ padding: '1.133rem 2.266rem', background: '#F8FAFC', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .sub-tab-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .sub-tab-btn:hover {
                    transform: translateY(-1px) scale(1.03);
                    opacity: 0.95;
                }
                .plan-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .plan-card:hover {
                    transform: translateY(-8px) !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08) !important;
                }
                .upgrade-btn {
                    transition: all 0.2s ease-in-out;
                }
                .upgrade-btn:hover {
                    opacity: 0.95;
                    transform: scale(1.02);
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', flexShrink: 0, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.359rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.68rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <CreditCard size={22} />
                        </div>
                        <h1 data-tour="subscription-heading" style={{ fontSize: '1.812rem', fontWeight: '850', color: '#064E3B' }}>Subscription & Billing</h1>
                    </div>
                    <p style={{ color: '#475569', fontWeight: '500' }}>Manage your active workspace tier, feature access, and transaction statements.</p>
                </div>
                
                {/* Billing Badge */}
                <div style={{ display: 'flex', background: '#DCF2E4', padding: '0.544rem 1.133rem', borderRadius: '14px', alignItems: 'center', gap: '0.453rem' }}>
                    <span style={{ color: '#064E3B', fontWeight: '800', fontSize: '0.77rem' }}>
                        {renewal.billingPeriod
                            ? `${renewal.billingPeriod === 'month' ? 'Monthly' : 'Annual'} Billing Cycle`
                            : 'No Active Plan'}
                    </span>
                    {selectedTier && (
                        <span style={{ background: '#1B6B3A', color: 'white', fontSize: '0.589rem', padding: '0.136rem 0.363rem', borderRadius: '6px', fontWeight: '800' }}>ACTIVE</span>
                    )}
                </div>
            </div>

            {/* Scrollable Main Content Wrapper */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: '1.812rem' }}>

            {/* Current Tier Widget */}
            <div style={{ 
                background: renewal.gradient, 
                borderRadius: '16px', 
                padding: '1.133rem 1.812rem', 
                color: 'white', 
                marginBottom: '1.812rem', 
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: `0 12px 20px -8px ${renewal.color}30`, 
                transition: 'all 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.359rem'
            }}>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', pointerEvents: 'none' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.359rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.227rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                                {selectedTier ? 'Active Plan:' : 'Plan Status:'}
                            </span>
                            <h2 style={{ fontSize: '1.359rem', fontWeight: '900', margin: 0, lineHeight: 1.2 }}>
                                {selectedTier === 'Basic Plan' ? 'Business' : selectedTier || 'No Active Plan'}
                            </h2>
                        </div>
                        <p style={{ color: '#DCF2E4', fontWeight: '500', fontSize: '0.77rem', margin: 0, opacity: 0.95 }}>{renewal.desc}</p>
                    </div>
                </div>

                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '0.68rem 1.359rem', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.12)', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.359rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.589rem', fontWeight: '800', color: '#DCF2E4', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>Next Renewal</p>
                        <h3 style={{ fontSize: '0.997rem', fontWeight: '900', margin: 0 }}>
                            {selectedTier ? '01 May, 2027' : 'Not scheduled'}
                        </h3>
                    </div>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.589rem', fontWeight: '800', color: '#DCF2E4', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>Renewal Amount</p>
                        <p style={{ fontSize: '0.997rem', fontWeight: '900', margin: 0 }}>
                            {renewal.price == null ? '—' : formatCurrency(renewal.price)}
                            {renewal.price != null && (
                                <span style={{ fontSize: '0.68rem', fontWeight: '500', opacity: 0.8 }}>
                                    {' '}+ GST / {renewal.billingPeriod}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Modern Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.812rem' }}>
                <div style={{ 
                    display: 'flex', 
                    background: 'rgba(220, 242, 228, 0.7)', 
                    backdropFilter: 'blur(8px)',
                    padding: '0.363rem', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(27, 107, 58, 0.15)',
                    boxShadow: '0 8px 32px 0 rgba(27, 107, 58, 0.04)',
                    gap: '0.227rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {[
                        { id: 'basic', label: 'Business', icon: ShieldCheck, color: '#0E4F2E' },
                        { id: 'ca', label: 'FIN-PRO', icon: Award, color: '#1E3A8A' },
                        { id: 'betaclub', label: 'Partner Launch Desk', icon: Crown, color: '#7C3AED' }
                    ].map((tab) => {
                        const isTabActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                data-tour={`subscription-category-${tab.id}`}
                                className="sub-tab-btn"
                                onClick={() => setActiveCategory(tab.id)}
                                style={{
                                    padding: '0.68rem 1.812rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: isTabActive 
                                        ? `linear-gradient(135deg, ${tab.color} 0%, #0c0f1d 160%)` 
                                        : 'transparent',
                                    color: isTabActive ? 'white' : '#475569',
                                    fontSize: '0.816rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.453rem',
                                    transform: isTabActive ? 'scale(1.04)' : 'scale(1)',
                                    boxShadow: isTabActive ? `0 10px 15px -3px ${tab.color}40` : 'none'
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Nested sub-selector for Partner Launch Desk */}
            {activeCategory === 'betaclub' && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '1.812rem', 
                    marginBottom: '2.719rem', 
                    flexWrap: 'wrap' 
                }}>
                    <div 
                        onClick={() => setBetaSubCategory('investor')}
                        style={{
                            background: betaSubCategory === 'investor' ? 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' : 'white',
                            color: betaSubCategory === 'investor' ? 'white' : '#1E293B',
                            border: betaSubCategory === 'investor' ? 'none' : '1px solid #E2E8F0',
                            padding: '1.133rem 1.812rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            width: '280px',
                            textAlign: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: betaSubCategory === 'investor' ? '0 15px 30px rgba(124, 58, 237, 0.25)' : 'none',
                            transform: betaSubCategory === 'investor' ? 'scale(1.05) translateY(-4px)' : 'scale(1)'
                        }}
                    >
                        <h4 style={{ margin: 0, fontSize: '1.133rem', fontWeight: '850', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.453rem' }}>
                            <Crown size={20} /> Investor Club
                        </h4>
                    </div>

                    <div 
                        onClick={() => setBetaSubCategory('product')}
                        style={{
                            background: betaSubCategory === 'product' ? 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' : 'white',
                            color: betaSubCategory === 'product' ? 'white' : '#1E293B',
                            border: betaSubCategory === 'product' ? 'none' : '1px solid #E2E8F0',
                            padding: '1.133rem 1.812rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            width: '280px',
                            textAlign: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: betaSubCategory === 'product' ? '0 15px 30px rgba(236, 72, 153, 0.25)' : 'none',
                            transform: betaSubCategory === 'product' ? 'scale(1.05) translateY(-4px)' : 'scale(1)'
                        }}
                    >
                        <h4 style={{ margin: 0, fontSize: '1.133rem', fontWeight: '850', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.453rem' }}>
                            <Zap size={20} /> Products & Ideas
                        </h4>
                    </div>
                </div>
            )}

            {/* Pricing Tiers Selection Grid */}
            <h3 data-tour="subscription-plans-heading" style={{ fontSize: '1.359rem', fontWeight: '850', color: '#064E3B', marginBottom: '1.133rem' }}>
                {activeCategory === 'basic' ? 'Business Details' : 'Upgrade Workspace Tier'}
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: activeCategory === 'basic'
                    ? 'repeat(1, minmax(0, 360px))'
                    : activeCategory === 'ca'
                        ? 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))'
                        : 'repeat(3, 1fr)',
                gap: activeCategory === 'ca' ? '0.906rem' : '1.359rem',
                marginBottom: '2.719rem',
                justifyContent: activeCategory === 'basic' || activeCategory === 'ca' ? 'center' : 'stretch',
                maxWidth: activeCategory === 'ca' ? '600px' : 'none',
                marginLeft: activeCategory === 'ca' ? 'auto' : 0,
                marginRight: activeCategory === 'ca' ? 'auto' : 0
            }}>
                {allTiers[activeCategory === 'betaclub' ? (betaSubCategory === 'investor' ? 'betaclub_investor' : 'betaclub_product') : activeCategory].map((tier, idx) => {
                    const extraTeamMembers = tier.includedTeamMembers
                        ? Math.max(0, firmTeamMembers - tier.includedTeamMembers)
                        : 0;
                    const price = (tier.priceMonthly ?? tier.priceAnnually)
                        + extraTeamMembers * (tier.additionalMemberMonthlyPrice || 0);
                    const originalPrice = tier.originalPrice == null
                        ? null
                        : tier.originalPrice + extraTeamMembers * (tier.additionalMemberMonthlyPrice || 0);
                    const billingPeriod = tier.priceMonthly ? 'month' : 'year';
                    const currentCategoryKey = activeCategory === 'betaclub' ? (betaSubCategory === 'investor' ? 'betaclub_investor' : 'betaclub_product') : activeCategory;
                    const activeModulePlan = 
                        currentCategoryKey === 'business' ? (user?.active_subscriptions?.business?.plan || user?.tier || 'Starter Plan') :
                        currentCategoryKey === 'ca' ? activeFinProPlan :
                        currentCategoryKey === 'betaclub_investor' ? (user?.active_subscriptions?.investor?.plan || user?.investor_plan || (localStorage.getItem('cliks_investor_active') === 'true' ? 'Basic Investor' : null)) :
                        currentCategoryKey === 'betaclub_product' ? (user?.active_subscriptions?.poster?.plan || user?.poster_plan || (localStorage.getItem('cliks_poster_active') === 'true' ? 'Monthly Innovator' : null)) : null;

                    const isActive = tier.name === activeModulePlan || (tier.name === selectedTier && currentCategoryKey === 'business');
                    const TierIcon = tier.icon;
                    return (
                        <div 
                            key={idx} 
                            className="plan-card"
                            onClick={() => {
                                if (currentCategoryKey !== 'ca') setSelectedTier(tier.name);
                            }}
                            style={{ 
                                background: 'white', 
                                borderRadius: '16px', 
                                border: isActive ? `3px solid #0f766e` : '1px solid #E2E8F0',
                                padding: activeCategory === 'ca' ? '1.359rem' : '1.586rem 1.812rem',
                                position: 'relative',
                                cursor: currentCategoryKey === 'ca' ? 'default' : 'pointer',
                                transform: isActive ? 'translateY(-6px)' : 'none',
                                boxShadow: isActive ? `0 20px 25px -5px rgba(15, 118, 110, 0.2)` : 'none'
                            }}
                        >
                            {isActive && (
                                <span style={{ position: 'absolute', top: '1.133rem', right: '1.133rem', background: '#0f766e', color: 'white', fontSize: '0.634rem', fontWeight: '800', padding: '0.363rem 0.725rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                                    {tier.badge}
                                </span>
                            )}
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${tier.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tier.color, marginBottom: '0.906rem' }}>
                                <TierIcon size={24} />
                            </div>
                            <h4 style={{ fontSize: '1.223rem', fontWeight: '850', color: '#1E293B', marginBottom: '0.453rem' }}>
                                {currentCategoryKey === 'basic' && tier.name === 'Basic Plan' ? 'Business' : tier.name}
                            </h4>
                            <p style={{ fontSize: '0.77rem', color: '#64748B', fontWeight: '500', marginBottom: '1.133rem', minHeight: '34px' }}>{tier.desc}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.181rem', marginBottom: '1.133rem' }}>
                                {originalPrice != null && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                                        <span style={{ fontSize: '1.133rem', fontWeight: '700', color: '#94A3B8', textDecoration: 'line-through' }}>{formatCurrency(originalPrice)}</span>
                                        <span style={{ fontSize: '0.725rem', fontWeight: '800', color: '#1B6B3A', background: '#DCF2E4', padding: '0.181rem 0.453rem', borderRadius: '6px' }}>
                                            Save {formatCurrency(originalPrice - price)}
                                        </span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.227rem' }}>
                                    <span style={{ fontSize: '2.039rem', fontWeight: '900', color: '#1E293B' }}>{formatCurrency(price)}</span>
                                    <span style={{ color: '#64748B', fontWeight: '600', fontSize: '0.816rem' }}>/ {billingPeriod}</span>
                                </div>
                                {tier.priceMonthly ? (
                                    <span style={{ fontSize: '0.77rem', fontWeight: '600', color: '#64748B' }}>
                                        (Billed every month)
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.77rem', fontWeight: '600', color: '#64748B' }}>
                                        (Equivalent to {formatCurrency(Math.round(price / 12))} per month)
                                    </span>
                                )}
                            </div>

                            {tier.includedTeamMembers && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.453rem',
                                    padding: '0.77rem 0.997rem',
                                    marginBottom: '0.906rem',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '20px',
                                    background: '#F8FAFC',
                                    color: '#475569',
                                    fontSize: '0.77rem',
                                    fontWeight: '700'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.68rem' }}>
                                        <span>Total Team Members:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.544rem' }}>
                                            <button
                                                type="button"
                                                aria-label="Decrease team members"
                                                disabled={firmTeamMembers <= 1}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setFirmTeamMembers(count => Math.max(1, count - 1));
                                                }}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    border: '1px solid #CBD5E1',
                                                    background: '#FFFFFF',
                                                    color: firmTeamMembers <= 1 ? '#CBD5E1' : '#475569',
                                                    cursor: firmTeamMembers <= 1 ? 'not-allowed' : 'pointer',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    padding: 0
                                                }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span aria-live="polite" style={{ minWidth: '16px', textAlign: 'center', color: '#475569', fontSize: '0.906rem' }}>
                                                {firmTeamMembers}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Increase team members"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setFirmTeamMembers(count => count + 1);
                                                }}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    border: '1px solid #CBD5E1',
                                                    background: '#FFFFFF',
                                                    color: '#475569',
                                                    cursor: 'pointer',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    padding: 0
                                                }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    {extraTeamMembers > 0 && (
                                        <span style={{ alignSelf: 'flex-end', color: '#3366FF', fontSize: '0.68rem', fontWeight: '700' }}>
                                            +{extraTeamMembers} extra {extraTeamMembers === 1 ? 'member' : 'members'} ({formatCurrency(tier.additionalMemberMonthlyPrice)}/mo each)
                                        </span>
                                    )}
                                </div>
                            )}

                            {isActive ? (
                                <button 
                                    disabled
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.77rem', 
                                        borderRadius: '9999px', 
                                        border: 'none',
                                        background: '#0f766e',
                                        color: '#FFFFFF',
                                        fontWeight: '700',
                                        fontSize: '0.793rem',
                                        letterSpacing: '0.025em',
                                        textAlign: 'center',
                                        cursor: 'default',
                                        marginBottom: '1.133rem',
                                        boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Currently Active Plan
                                </button>
                            ) : activeCategory === 'betaclub' ? (
                                <button 
                                    type="button"
                                    disabled
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-full py-2.5 px-4 border border-purple-400 text-purple-600 bg-white rounded-xl text-sm font-semibold cursor-default select-none transition-none shadow-none"
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.77rem', 
                                        borderRadius: '16px', 
                                        border: `1px solid ${tier.color || '#a855f7'}`,
                                        background: 'white',
                                        color: tier.color || '#7c3aed',
                                        fontWeight: '800',
                                        cursor: 'default',
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                        marginBottom: '1.133rem'
                                    }}
                                >
                                    Upgrade Plan
                                </button>
                            ) : (
                                <button 
                                    className="upgrade-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpgrade(tier, currentCategoryKey, firmTeamMembers);
                                    }}
                                    disabled={isProcessing}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.77rem', 
                                        borderRadius: '16px', 
                                        border: `1px solid ${tier.color}`,
                                        background: isProcessing ? '#94A3B8' : 'white',
                                        color: tier.color,
                                        fontWeight: '800',
                                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                                        marginBottom: '1.133rem'
                                    }}
                                >
                                    {isProcessing ? 'Connecting...' : 'Upgrade Plan'}
                                </button>
                            )}

                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.133rem' }}>
                                <p style={{ fontSize: '0.725rem', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', marginBottom: '0.68rem', letterSpacing: '0.05em' }}>What's Included</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.77rem' }}>
                                    {tier.features.map((feature, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.453rem', fontSize: '0.77rem', color: '#475569', fontWeight: '500' }}>
                                            <Check size={16} style={{ color: tier.color, flexShrink: 0, marginTop: '0.136rem' }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Invoices History list */}
            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '2.266rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', marginBottom: '1.812rem' }}>
                    <History size={20} style={{ color: '#1B6B3A' }} />
                    <h3 style={{ fontSize: '1.133rem', fontWeight: '800', color: '#064E3B', margin: 0 }}>Billing & Statement History</h3>
                </div>
                <div className="cliks-table-scroll" style={{ border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                    <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Invoice ID</th>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Billing Date</th>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Tier Details</th>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Payment Mode</th>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '0.625rem 0.906rem', fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap', textAlign: 'right' }}>Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length > 0 ? (
                                invoices.map((inv, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.906rem', fontWeight: '800', color: '#064E3B', whiteSpace: 'nowrap' }} title={inv.id}>{inv.id}</td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.906rem', fontSize: '0.77rem', color: '#64748B', fontWeight: '500', whiteSpace: 'nowrap' }}>{inv.date}</td>
                                        <td style={{ padding: '0.625rem 0.906rem', fontWeight: '700', color: '#1E293B', maxWidth: '200px' }} title={inv.tier}>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.tier}</div>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.906rem', fontSize: '0.725rem', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap' }}><span className="badge-nowrap" style={{ background: '#F1F5F9', padding: '0.227rem 0.5rem', borderRadius: '8px' }}>{inv.method}</span></td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.906rem', textAlign: 'center', whiteSpace: 'nowrap' }}><span className="badge-nowrap" style={{ padding: '0.272rem 0.625rem', borderRadius: '10px', background: '#F0FDF4', color: '#1B6B3A', fontSize: '0.725rem', fontWeight: '750' }}>{inv.status}</span></td>
                                        <td className="cell-num" style={{ padding: '0.625rem 0.906rem', textAlign: 'right', fontWeight: '850', color: '#1E293B', whiteSpace: 'nowrap' }}>{formatCurrency(inv.amount)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '1.812rem 1.133rem', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>
                                        No billing history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ðŸ›¡ ICAI Verification Guard Modal */}
            <style>{`
                .icai-modal-card {
                    background: #ffffff;
                    border: 1px solid #E2E8F0;
                    color: #0F172A;
                }
                .icai-modal-card h3 {
                    color: #0F172A;
                }
                .icai-modal-card p {
                    color: #64748B;
                }
                .icai-modal-info {
                    background: #F8FAFC;
                    border-top: 1px solid #F1F5F9;
                    border-bottom: 1px solid #F1F5F9;
                    color: #475569;
                }
                .icai-modal-cancel-btn {
                    background: #F1F5F9;
                    color: #475569;
                    border: 1px solid #CBD5E1;
                }
                [data-theme='dark'] .icai-modal-card,
                .dark-theme .icai-modal-card,
                .dark .icai-modal-card {
                    background: #141E33 !important;
                    border-color: #1E293B !important;
                    color: #F8FAFC !important;
                }
                [data-theme='dark'] .icai-modal-card h3,
                .dark-theme .icai-modal-card h3,
                .dark .icai-modal-card h3 {
                    color: #F8FAFC !important;
                }
                [data-theme='dark'] .icai-modal-card p,
                .dark-theme .icai-modal-card p,
                .dark .icai-modal-card p {
                    color: #94A3B8 !important;
                }
                [data-theme='dark'] .icai-modal-info,
                .dark-theme .icai-modal-info,
                .dark .icai-modal-info {
                    background: #0F172A !important;
                    border-color: #1E293B !important;
                    color: #CBD5E1 !important;
                }
                [data-theme='dark'] .icai-modal-cancel-btn,
                .dark-theme .icai-modal-cancel-btn,
                .dark .icai-modal-cancel-btn {
                    background: #1E293B !important;
                    border-color: #334155 !important;
                    color: #CBD5E1 !important;
                }
            `}</style>

            {/* ICAI Verification Guard Modal */}
            {showIcaiGuardModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    padding: '20px'
                }}>
                    <div className="icai-modal-card" style={{
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '520px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <div style={{
                            padding: '28px 28px 20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
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
                                marginBottom: '16px',
                                border: '1px solid #FDE68A'
                            }}>
                                <ShieldAlert size={34} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '850', margin: 0, letterSpacing: '-0.02em' }}>
                                Institutional ICAI Verification Required
                            </h3>
                            <p style={{ fontSize: '14px', marginTop: '10px', lineHeight: '1.6' }}>
                                You must verify your official ICAI credentials before subscribing to the <strong>FIN-PRO Advisory Suite</strong>. This ensures compliance with institutional CA standards.
                            </p>
                        </div>

                        <div className="icai-modal-info" style={{
                            padding: '16px 28px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0 }} />
                            <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                                Verification takes only a minute and unlocks multi-client auditing, direct workpapers, and client billing.
                            </span>
                        </div>

                        <div style={{
                            padding: '20px 28px',
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                type="button"
                                className="icai-modal-cancel-btn"
                                onClick={() => setShowIcaiGuardModal(false)}
                                style={{
                                    padding: '11px 20px',
                                    borderRadius: '12px',
                                    fontSize: '13.5px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Not Now
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowIcaiGuardModal(false);
                                    navigate('/ca?verify_icai=true');
                                }}
                                style={{
                                    padding: '11px 24px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '13.5px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>Proceed to ICAI Verification</span>
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Subscription;
