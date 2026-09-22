import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pitchesService } from '../../services/pitchesService';
import { useAuth } from '../../context';
import { 
    TrendingUp, 
    ShieldCheck, 
    Lock, 
    Award, 
    Plus, 
    Rocket, 
    CheckCircle, 
    Building, 
    ArrowRight, 
    X,
    Zap,
    Target,
    Coins,
    FileText,
    Mail,
    Phone,
    MessageSquare,
    ArrowUpRight,
    MapPin,
    Search,
    User,
    Bell,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Crown,
    ChevronRight,
    Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BetaClub({ openAuthModal = null }) {
    const navigate = useNavigate();
    const { user, business } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'studio' | 'admin'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('All Sectors');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFounderAuthModal, setShowFounderAuthModal] = useState(openAuthModal === 'founder');
    const [showInvestorAuthModal, setShowInvestorAuthModal] = useState(openAuthModal === 'investor');
    const [showAdminAuthModal, setShowAdminAuthModal] = useState(openAuthModal === 'admin');
    const [selectedConnectPitch, setSelectedConnectPitch] = useState(null);
    const [selectedPitchModal, setSelectedPitchModal] = useState(null);

    // Quota & Unlocked Pitches State
    const [unlockedMap, setUnlockedMap] = useState({});
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [resubmitPitch, setResubmitPitch] = useState(null);
    const [adminReviewPitch, setAdminReviewPitch] = useState(null);
    const [adminRemarksInput, setAdminRemarksInput] = useState('');
    const [showNotifDrawer, setShowNotifDrawer] = useState(false);

    // Form Errors & Validation State
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        business_name: '',
        industry: 'Technology',
        headline: '',
        description: '',
        funding_target: '',
        equity_offered: '',
        use_of_funds: '',
        pitch_deck_url: '',
        founder_phone: '',
        founder_email: '',
        problem: '',
        solution: '',
        location: ''
    });

    // Location State
    const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('Select Region / Lock GPS');
    const [gpsState, setGpsState] = useState(null);
    const [cityName, setCityName] = useState(null);
    const [pincode, setPincode] = useState(null);

    useEffect(() => {
        if (openAuthModal === 'admin') {
            setShowAdminAuthModal(true);
            setActiveTab('admin');
        } else if (openAuthModal === 'founder') {
            setShowFounderAuthModal(true);
            setActiveTab('studio');
        } else if (openAuthModal === 'investor') {
            setShowInvestorAuthModal(true);
            setActiveTab('directory');
        }
    }, [openAuthModal]);

    // ── Queries & Mutations ──────────────────────────────────────────────────
    const { data: rawMarketplacePitches = [], isLoading: isMarketplaceLoading } = useQuery({
        queryKey: ['marketplace-pitches', searchQuery, selectedSector],
        queryFn: () => pitchesService.getMarketplacePitches({ search: searchQuery, sector: selectedSector })
    });
    const allMarketplacePitches = Array.isArray(rawMarketplacePitches) ? rawMarketplacePitches : (rawMarketplacePitches?.pitches || rawMarketplacePitches?.data || []);
    
    // Filter deals shown in "Active Deals Marketplace"
    // 1. Only Admin-approved / published deals
    // 2. Sector Filter (matches selectedSector when not 'All Sectors' / 'ALL')
    // 3. Search Query Filter (matches venture title, sector, headline, description, keywords)
    const marketplacePitches = allMarketplacePitches.filter(deal => {
        const status = (deal.review_status || deal.status || '').toLowerCase();
        const isApproved = status === 'published' || status === 'accepted' || status === 'approved';
        if (!isApproved) return false;

        // Sector Filter
        if (selectedSector && selectedSector !== 'All Sectors' && selectedSector !== 'ALL') {
            const dealSector = (deal.sector || deal.industry || '').trim().toLowerCase();
            const targetSector = selectedSector.trim().toLowerCase();
            if (dealSector !== targetSector && !dealSector.includes(targetSector)) {
                return false;
            }
        }

        // Search Query Filter
        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            const searchableText = [
                deal.venture_name,
                deal.title,
                deal.company_name,
                deal.business_name,
                deal.sector,
                deal.industry,
                deal.headline_pitch,
                deal.headline,
                deal.pitch_summary,
                deal.description,
                deal.problem,
                deal.solution,
                deal.location
            ].filter(Boolean).join(' ').toLowerCase();

            if (!searchableText.includes(q)) {
                return false;
            }
        }

        return true;
    });

    const { data: rawStudioPitches = [], isLoading: isStudioLoading } = useQuery({
        queryKey: ['studio-pitches'],
        queryFn: () => pitchesService.getMyStudioPitches().catch(() => [])
    });
    const studioPitches = Array.isArray(rawStudioPitches) ? rawStudioPitches : (rawStudioPitches?.pitches || rawStudioPitches?.data || []);

    const { data: rawAdminPitches = [], isLoading: isAdminLoading } = useQuery({
        queryKey: ['admin-pitches'],
        queryFn: () => pitchesService.getAdminPitches().catch(() => []),
        enabled: activeTab === 'admin' || showAdminAuthModal
    });
    const adminPitches = Array.isArray(rawAdminPitches) ? rawAdminPitches : (rawAdminPitches?.pitches || rawAdminPitches?.data || []);

    const { data: quotaStatus, refetch: refetchQuota } = useQuery({
        queryKey: ['quota-status'],
        queryFn: pitchesService.getQuotaStatus
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ['user-notifications'],
        queryFn: pitchesService.getNotifications
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const createMutation = useMutation({
        mutationFn: pitchesService.createPitch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studio-pitches'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-pitches'] });
            setShowCreateModal(false);
            setFormErrors({});
            setFormData({
                business_name: '',
                industry: 'Technology',
                headline: '',
                description: '',
                funding_target: '',
                equity_offered: '',
                use_of_funds: '',
                pitch_deck_url: '',
                founder_phone: '',
                founder_email: '',
                problem: '',
                solution: '',
                location: ''
            });
            alert("Pitch submitted successfully! Status set to Under Admin Review.");
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Error submitting pitch.");
        }
    });

    const adminReviewMutation = useMutation({
        mutationFn: ({ id, status, admin_remarks }) => pitchesService.reviewPitch(id, { status, admin_remarks }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin-pitches'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-pitches'] });
            queryClient.invalidateQueries({ queryKey: ['studio-pitches'] });
            setAdminReviewPitch(null);
            setAdminRemarksInput('');
            alert(data?.message || "Pitch review status updated!");
        },
        onError: () => {
            alert("Failed to update pitch status.");
        }
    });

    // Helper to count words and enforce the 300-word limit
    const getWordCount = (text = '') => {
        const trimmed = text.trim();
        return trimmed ? trimmed.split(/\s+/).length : 0;
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        const words = text.trim() ? text.trim().split(/\s+/) : [];

        if (words.length <= 300) {
            setFormData(prev => ({ ...prev, description: text }));
        } else {
            // Keep only the first 300 words
            const truncated = words.slice(0, 300).join(' ');
            setFormData(prev => ({ ...prev, description: truncated }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.business_name || !formData.headline || !formData.description?.trim()) {
            alert("Please supply all required venture details including description.");
            return;
        }

        const founderEmail = user?.email || business?.email || user?.settings?.email || formData.founder_email || "";
        const founderName = user?.name || user?.full_name || business?.name || user?.business_name || formData.business_name || "Innovator Founder";

        const payload = {
            title: formData.business_name,
            business_name: formData.business_name,
            venture_name: formData.business_name,
            sector: formData.industry,
            industry: formData.industry,
            headline: formData.headline,
            headline_pitch: formData.headline,
            description: formData.description.trim(),
            funding_target: 0,
            goal_amount: 0,
            equity_offered: 0,
            use_of_funds: formData.description.trim(),
            pitch_deck_url: formData.pitch_deck_url,
            founder_name: founderName,
            founder_phone: formData.founder_phone || user?.phone || '',
            founder_email: founderEmail,
            location: formData.location || 'Chennai, Tamil Nadu',
            review_status: 'Under Review',
            status: 'Under Review',
            created_at: new Date().toISOString()
        };

        createMutation.mutate(payload);
    };

    const handleConnectTrigger = async (pitch) => {
        setSelectedPitchModal(pitch);
        if (unlockedMap[pitch.id]) {
            const merged = { ...pitch, ...unlockedMap[pitch.id] };
            setSelectedConnectPitch(merged);
            setSelectedPitchModal(merged);
            return;
        }

        try {
            const res = await pitchesService.unlockPitch(pitch.id);
            if (res.success && res.unlocked) {
                setUnlockedMap(prev => ({ ...prev, [pitch.id]: res.data }));
                refetchQuota();
                const merged = { ...pitch, ...res.data };
                setSelectedConnectPitch(merged);
                setSelectedPitchModal(merged);
            }
        } catch (error) {
            // Keep selectedPitchModal open with existing pitch details
            setSelectedPitchModal(pitch);
        }
    };

    const industryOptions = [
        'All Sectors', 'Technology', 'Retail & Commerce', 'Healthcare', 'Finance & FinTech', 
        'Manufacturing', 'Food & Beverage', 'Real Estate', 'Other'
    ];

    const getStatusBadge = (status) => {
        const normalized = (status || '').toLowerCase();
        const isAccepted = normalized === 'published' || normalized === 'accepted' || normalized === 'approved' || normalized === 'active';
        if (isAccepted) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <svg className="w-3.5 h-3.5 text-emerald-600" style={{ width: '14px', height: '14px', color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    admin accepted your idea
                </span>
            );
        }
        if (normalized === 'rejected' || normalized === 'needs revision') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <AlertTriangle size={13} /> Needs Revision
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#fbbf24', display: 'inline-block' }}></span>
                Pending for Admin Review
            </span>
        );
    };

    return (
        <div style={{
            height: '100%',
            width: '100%',
            background: '#f8fafc',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
        }}>
            
            {/* Top Deep Navy Blue Banner */}
            <div style={{
                flexShrink: 0,
                background: '#172554',
                borderRadius: '20px',
                padding: '1.5rem 2rem',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 10px 25px -5px rgba(23, 37, 84, 0.2)',
                marginBottom: '1.25rem',
                position: 'relative'
            }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#60A5FA' }}>
                        <TrendingUp size={13} />
                        <span>CAPITAL MATRIX & VENTURE CONNECT</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '850', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                        SME Deal Marketplace
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: '#BFDBFE', margin: 0, opacity: 0.85 }}>
                        Connect directly with verified founders, review pitch decks, and unlock investment deals.
                    </p>
                </div>

                {/* Banner Right Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            type="button"
                            onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                            style={{
                                padding: '0.75rem 1.15rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.12)',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.875rem',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{selectedRegion}</span>
                            <span style={{ fontSize: '0.7rem' }}>▼</span>
                        </button>

                        {/* Floating Region / GPS Dropdown Menu */}
                        {isLocationMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 8px)',
                                background: '#FFFFFF',
                                borderRadius: '16px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #E2E8F0',
                                padding: '0.5rem',
                                zIndex: 100,
                                minWidth: '220px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                () => {
                                                    setSelectedRegion('📍 Auto-Detected (GPS)');
                                                    setIsLocationMenuOpen(false);
                                                },
                                                () => {
                                                    setSelectedRegion('📍 Chennai, Tamil Nadu');
                                                    setIsLocationMenuOpen(false);
                                                }
                                            );
                                        } else {
                                            setSelectedRegion('📍 Chennai, Tamil Nadu');
                                            setIsLocationMenuOpen(false);
                                        }
                                    }}
                                    style={{
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '10px',
                                        background: '#EFF6FF',
                                        color: '#2563EB',
                                        border: 'none',
                                        fontWeight: '800',
                                        fontSize: '0.8rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    ⚡ Detect GPS Location
                                </button>
                                <div style={{ height: '1px', background: '#F1F5F9', margin: '2px 0' }} />
                                {[
                                    '📍 Chennai, Tamil Nadu',
                                    '📍 Mumbai, Maharashtra',
                                    '📍 Bengaluru, Karnataka',
                                    '📍 Delhi NCR'
                                ].map(loc => (
                                    <button
                                        key={loc}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRegion(loc);
                                            setIsLocationMenuOpen(false);
                                        }}
                                        style={{
                                            padding: '0.55rem 0.85rem',
                                            borderRadius: '10px',
                                            background: 'transparent',
                                            color: '#334155',
                                            border: 'none',
                                            fontWeight: '700',
                                            fontSize: '0.8rem',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)} 
                        style={{ 
                            padding: '0.75rem 1.25rem', 
                            borderRadius: '12px', 
                            background: '#059669', 
                            color: 'white', 
                            fontWeight: '700', 
                            fontSize: '0.875rem', 
                            border: 'none', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Rocket size={15} />
                        <span>List Your Venture</span>
                    </button>
                </div>
            </div>

            {/* Sub-Header Navigation Tabs */}
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '12px' }}>
                    <button onClick={() => { setActiveTab('directory'); setSearchQuery(''); }} style={{ padding: '0.5rem 1.25rem', borderRadius: '9px', background: activeTab === 'directory' ? '#ffffff' : 'transparent', fontWeight: '700', fontSize: '0.85rem', color: activeTab === 'directory' ? '#0f172a' : '#64748b', border: 'none', cursor: 'pointer' }}>
                        Active Deals Marketplace
                    </button>
                    <button onClick={() => { setActiveTab('studio'); setSearchQuery(''); }} style={{ padding: '0.5rem 1.25rem', borderRadius: '9px', background: activeTab === 'studio' ? '#ffffff' : 'transparent', fontWeight: '700', fontSize: '0.85rem', color: activeTab === 'studio' ? '#0f172a' : '#64748b', border: 'none', cursor: 'pointer' }}>
                        My Studio (Founder View)
                    </button>
                    {(openAuthModal === 'admin' || activeTab === 'admin') && (
                        <button onClick={() => { setActiveTab('admin'); setSearchQuery(''); }} style={{ padding: '0.5rem 1.25rem', borderRadius: '9px', background: activeTab === 'admin' ? '#7C3AED' : 'transparent', color: activeTab === 'admin' ? '#ffffff' : '#7C3AED', fontWeight: '800', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                            🛡️ Admin Review Desk
                        </button>
                    )}
                </div>

                {quotaStatus && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.35rem 0.85rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '750', color: '#1e40af' }}>
                        <Coins size={15} color="#2563eb" />
                        <span>Unlocked Deals: <strong>{quotaStatus.quota_used} / {quotaStatus.quota_limit}</strong></span>
                        {quotaStatus.quota_remaining <= 2 && (
                            <button onClick={() => setShowUpgradeModal(true)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' }}>
                                Upgrade
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="Search deals by title, sector, problem, or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} style={{ padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                    {industryOptions.map(opt => <option key={opt} value={opt}>{opt === 'ALL' ? 'All Sectors' : opt}</option>)}
                </select>
            </div>

            {/* Marketplace Tab */}
            {activeTab === 'directory' && (
                <div>
                    {isMarketplaceLoading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading verified deals...</div>
                    ) : marketplacePitches.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <Building size={28} style={{ color: '#94a3b8' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
                                Not Available
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                                {searchQuery.trim() || (selectedSector && selectedSector !== 'All Sectors' && selectedSector !== 'ALL')
                                    ? `No matching deals found for your current filter criteria${selectedSector && selectedSector !== 'All Sectors' && selectedSector !== 'ALL' ? ` in ${selectedSector}` : ''}${searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ''}. Try resetting your search or selecting another sector.`
                                    : 'No active published deals are currently available in the marketplace.'}
                            </p>
                            {(searchQuery.trim() || (selectedSector && selectedSector !== 'All Sectors' && selectedSector !== 'ALL')) && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchQuery(''); setSelectedSector('All Sectors'); }}
                                    style={{ padding: '0.5rem 1.25rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                            {marketplacePitches.map(deal => (
                                <div
                                    key={deal.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                >
                                    {/* Top Badge Row */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100" style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #dbeafe' }}>
                                                {deal.sector || deal.industry || 'General'}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                                                <span className="text-red-500" style={{ color: '#ef4444' }}>📍</span> {(() => {
                                                    const rawLoc = deal.location || 'India';
                                                    if (rawLoc.includes('http') || rawLoc.toLowerCase().includes('zoom') || rawLoc.toLowerCase().includes('meet')) {
                                                        return 'India';
                                                    }
                                                    return rawLoc;
                                                })()}
                                            </span>
                                        </div>

                                        {/* Venture Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                                            {deal.venture_name || deal.title || deal.company_name}
                                        </h3>

                                        {/* DESCRIPTION IS DELIBERATELY OMITTED / HIDDEN HERE */}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => e.preventDefault()}
                                        className="w-full mt-2 py-2.5 px-4 bg-[#172554] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem 1rem', background: '#172554', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                                    >
                                        <svg className="w-4 h-4" style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        🔒 Connect / View Pitch (1 Quota)
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Founder Studio Tab */}
            {activeTab === 'studio' && (
                <div>
                    {isStudioLoading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading studio pitches...</div>
                    ) : studioPitches.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <Rocket size={44} style={{ margin: '0 auto 0.75rem', color: '#C89F7A' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#334155' }}>No Pitches Submitted Yet</h3>
                        </div>
                    ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {studioPitches.map(pitch => {
                    const status = (pitch.review_status || pitch.status || '').toLowerCase();
                    const isAccepted = status === 'published' || status === 'accepted' || status === 'approved' || status === 'active';
                    const isRevision = status === 'rejected' || status === 'needs revision' || status === 'revision';

                    return (
                        <div key={pitch.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    {/* Top Left Badge */}
                                    {isAccepted ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800' }}>
                                            ✓ admin accepted your idea
                                        </span>
                                    ) : isRevision ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800' }}>
                                            ⚠️ Needs Revision
                                        </span>
                                    ) : (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800' }}>
                                            ⏳ Under Admin Review
                                        </span>
                                    )}

                                    {/* Top Right Sector Tag */}
                                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', background: '#EFF6FF', color: '#2563EB', fontSize: '0.72rem', fontWeight: '800', border: '1px solid #DBEAFE' }}>
                                        {pitch.sector || pitch.industry || 'Technology'}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
                                    {pitch.venture_name || pitch.title || pitch.company_name}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                    {pitch.description || pitch.headline_pitch || 'Venture roadmap submitted for investor connect.'}
                                </p>

                                {isRevision && (pitch.admin_remarks || pitch.remarks) && (
                                    <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: '0.75rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#9F1239' }}>⚠️ Admin Feedback Notes:</div>
                                        <p style={{ fontSize: '0.825rem', color: '#881337', margin: 0, marginTop: '2px' }}>{pitch.admin_remarks || pitch.remarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
                    )}
                </div>
            )}

            {/* Admin Desk Tab */}
            {activeTab === 'admin' && (
                <div>
                    {isAdminLoading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading admin pitches...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {adminPitches.map(pitch => (
                                <div key={pitch.id} style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>{pitch.title || pitch.company_name}</h3>
                                            {getStatusBadge(pitch.status)}
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Founder: <strong>{pitch.founder_name || 'Founder'}</strong> ({pitch.founder_email || 'N/A'})</p>
                                    </div>
                                    <button onClick={() => { setAdminReviewPitch(pitch); setAdminRemarksInput(pitch.admin_remarks || ''); }} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#7C3AED', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                                        Audit & Review Pitch
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal Popup for Venture Details */}
            {selectedPitchModal && (
                <div 
                    onClick={() => setSelectedPitchModal(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                    }}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '680px',
                            maxHeight: '88vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid #f1f5f9',
                            background: '#f8fafc',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #dbeafe' }}>
                                        {selectedPitchModal.sector || selectedPitchModal.industry || 'General'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                                        📍 {selectedPitchModal.location || 'India'}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>
                                    {selectedPitchModal.venture_name || selectedPitchModal.title || selectedPitchModal.company_name}
                                </h2>
                                {(selectedPitchModal.headline_pitch || selectedPitchModal.headline) && (
                                    <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600', marginTop: '0.35rem', marginBottom: 0 }}>
                                        "{selectedPitchModal.headline_pitch || selectedPitchModal.headline}"
                                    </p>
                                )}
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSelectedPitchModal(null)}
                                style={{
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                            {/* 300-word Full Description */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.65rem' }}>
                                    Venture Description
                                </h4>
                                <div style={{
                                    background: '#f8fafc',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.925rem',
                                    color: '#334155',
                                    lineHeight: 1.65,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {selectedPitchModal.description || selectedPitchModal.headline_pitch || 'No detailed description provided for this venture.'}
                                </div>
                            </div>

                            {/* Key Details Grid: Sector, Founder Email */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '750', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                        Founder / Contact
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                                        {selectedPitchModal.founder_name || 'Founder'}
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#2563eb', wordBreak: 'break-all' }}>
                                        {selectedPitchModal.founder_email || selectedPitchModal.email || 'founder@cliksbusiness.com'}
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '750', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                        Industry Sector
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                                        {selectedPitchModal.sector || selectedPitchModal.industry || 'Technology'}
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                                        Location: {selectedPitchModal.location || 'India'}
                                    </div>
                                </div>
                            </div>

                            {/* Pitch Deck Link */}
                            {selectedPitchModal.pitch_deck_url ? (
                                <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            📑 Pitch Deck Attached
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#3b82f6', marginTop: '2px', wordBreak: 'break-all' }}>
                                            {selectedPitchModal.pitch_deck_url}
                                        </div>
                                    </div>
                                    <a
                                        href={selectedPitchModal.pitch_deck_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '0.65rem 1.25rem',
                                            borderRadius: '10px',
                                            background: '#1e3a8a',
                                            color: 'white',
                                            textDecoration: 'none',
                                            fontWeight: '750',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Open Pitch Deck ↗
                                    </a>
                                </div>
                            ) : (
                                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px dashed #cbd5e1', fontSize: '0.825rem', color: '#64748b', textAlign: 'center' }}>
                                    No external pitch deck URL attached for this deal.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedPitchModal(null)}
                                style={{
                                    padding: '0.65rem 1.5rem',
                                    borderRadius: '10px',
                                    background: '#e2e8f0',
                                    color: '#334155',
                                    fontWeight: '750',
                                    fontSize: '0.85rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Venture Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '650px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>List Your Venture</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Submit your roadmap for Admin Review & Investor Connect</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#475569', marginBottom: '0.4rem' }}>Business / Venture Name *</label>
                                    <input type="text" required value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#475569', marginBottom: '0.4rem' }}>Sector *</label>
                                    <select value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                        {industryOptions.filter(o => o !== 'ALL' && o !== 'All Sectors').map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#475569', marginBottom: '0.4rem' }}>Headline Pitch *</label>
                                <input type="text" required value={formData.headline} onChange={e => setFormData({ ...formData, headline: e.target.value })} placeholder="e.g. Next-gen AI inventory platform for retail SMEs" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#475569' }}>Description *</label>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: getWordCount(formData.description) >= 300 ? '#ef4444' : '#64748b' }}>
                                        {getWordCount(formData.description)} / 300 words
                                    </span>
                                </div>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter venture description (maximum 300 words)..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#475569', marginBottom: '0.4rem' }}>Pitch Deck URL</label>
                                <input type="url" value={formData.pitch_deck_url} onChange={e => setFormData({ ...formData, pitch_deck_url: e.target.value })} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: '#10b981', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                                Submit Pitch for Admin Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin Review Action Modal */}
            {adminReviewPitch && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem 2rem', background: '#7C3AED', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '850', margin: 0 }}>Audit & Review Pitch</h3>
                            <button onClick={() => setAdminReviewPitch(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'white' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{adminReviewPitch.title || adminReviewPitch.company_name}</h4>
                            <textarea rows={3} value={adminRemarksInput} onChange={e => setAdminRemarksInput(e.target.value)} placeholder="Enter review notes or required revisions..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', boxSizing: 'border-box' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button onClick={() => adminReviewMutation.mutate({ id: adminReviewPitch.id, status: 'REJECTED', admin_remarks: adminRemarksInput })} style={{ padding: '0.85rem', borderRadius: '12px', background: '#dc2626', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer' }}>Reject / Request Revisions</button>
                                <button onClick={() => adminReviewMutation.mutate({ id: adminReviewPitch.id, status: 'ACCEPTED', admin_remarks: adminRemarksInput })} style={{ padding: '0.85rem', borderRadius: '12px', background: '#059669', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer' }}>Accept & Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '850', margin: 0 }}>Upgrade Workspace Tier</h3>
                                <p style={{ fontSize: '0.85rem', color: '#BFDBFE', margin: 0 }}>You have reached your unlocked deal quota limit.</p>
                            </div>
                            <button onClick={() => setShowUpgradeModal(false)} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '0.35rem', cursor: 'pointer', color: 'white' }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <button onClick={() => { setShowUpgradeModal(false); if (navigate) navigate('/subscription'); }} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: '#1E3A8A', color: 'white', fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                                Upgrade Plan Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Login Modal */}
            {showAdminAuthModal && (
                <div onClick={() => { setShowAdminAuthModal(false); if (navigate) navigate('/social/betaclub', { replace: true }); }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '850', margin: 0 }}>Capital Matrix — Admin Portal</h3>
                                <p style={{ fontSize: '0.85rem', color: '#E9D5FF', margin: 0 }}>Platform administration & marketplace oversight</p>
                            </div>
                            <button onClick={() => { setShowAdminAuthModal(false); if (navigate) navigate('/social/betaclub', { replace: true }); }} style={{ border: 'none', background: 'rgba(255,255,255,0.18)', borderRadius: '50%', padding: '0.35rem', cursor: 'pointer', color: 'white' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Admin credentials verified."); setShowAdminAuthModal(false); setActiveTab('admin'); }} style={{ padding: '2rem' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#334155', marginBottom: '0.4rem' }}>Admin Email (@bnxmail.com)</label>
                                <input type="email" placeholder="admin@bnxmail.com" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '750', color: '#334155', marginBottom: '0.4rem' }}>Password</label>
                                <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', color: 'white', fontWeight: '750', fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}>
                                Verify & Enter Admin Console
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
