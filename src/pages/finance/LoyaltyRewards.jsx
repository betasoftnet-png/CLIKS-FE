import React, { useState, useMemo, useEffect } from 'react';
import { 
    Coins, 
    Star, 
    Store, 
    Receipt, 
    History, 
    Search, 
    Filter, 
    ArrowUpRight, 
    ArrowDownLeft, 
    ShoppingBag, 
    Calendar, 
    ChevronDown, 
    ChevronUp, 
    ExternalLink, 
    FileText, 
    Printer, 
    X, 
    CheckCircle2, 
    Sparkles, 
    HelpCircle, 
    RefreshCw, 
    Wallet, 
    Gift, 
    BadgePercent, 
    Building2,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { customerLoyaltyService } from '../../services';
import { useAuth } from '../../context';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr).split('T')[0];
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return String(dateStr).split('T')[0];
    }
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return String(dateStr);
    }
};

const formatCurrency = (amount) => {
    const val = parseFloat(amount) || 0;
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseItems = (rawItems) => {
    if (!rawItems) return [];
    if (Array.isArray(rawItems)) return rawItems;
    if (typeof rawItems === 'string') {
        try {
            const parsed = JSON.parse(rawItems);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            return [];
        }
    }
    return [];
};

const LoyaltyRewards = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    // Default tab: 'shops', 'points', 'purchases', or 'offers'
    const initialTab = searchParams.get('tab') || 'shops';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Selected Shop filter across tabs
    const [selectedShopFilter, setSelectedShopFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [txTypeFilter, setTxTypeFilter] = useState('ALL'); // 'ALL', 'EARNED', 'REDEEMED'

    // Invoice View Modal state
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [expandedPurchaseIds, setExpandedPurchaseIds] = useState([]);

    // Points Rules & Calculator Modal
    const [showCalculatorModal, setShowCalculatorModal] = useState(false);
    const [calcAmount, setCalcAmount] = useState('5000');

    // 1. Fetch Merchants Summary
    const { 
        data: merchants = [], 
        isLoading: isMerchantsLoading, 
        refetch: refetchMerchants,
        isFetching: isMerchantsFetching 
    } = useQuery({
        queryKey: ['customer-merchants-loyalty'],
        queryFn: customerLoyaltyService.getMerchants,
        staleTime: 30000
    });

    // 2. Fetch Loyalty Wallet & Transaction Ledger
    const { 
        data: walletData = { wallet: {}, transactions: [] }, 
        isLoading: isWalletLoading,
        refetch: refetchWallet 
    } = useQuery({
        queryKey: ['customer-loyalty-wallet'],
        queryFn: customerLoyaltyService.getLoyaltyWallet,
        staleTime: 30000
    });

    // 3. Fetch Full Purchase History
    const { 
        data: purchases = [], 
        isLoading: isPurchasesLoading,
        refetch: refetchPurchases 
    } = useQuery({
        queryKey: ['customer-purchase-history'],
        queryFn: customerLoyaltyService.getPurchaseHistory,
        staleTime: 30000
    });

    const isRefreshing = isMerchantsFetching;

    const handleRefreshAll = () => {
        refetchMerchants();
        refetchWallet();
        refetchPurchases();
    };

    // Calculate aggregated totals
    const wallet = walletData.wallet || {};
    const transactions = walletData.transactions || [];

    const totalPointsBalance = useMemo(() => {
        if (wallet.points_balance !== undefined && wallet.points_balance !== null) {
            return Number(wallet.points_balance);
        }
        // Fallback: sum of net points from merchants
        return merchants.reduce((sum, m) => sum + (parseInt(m.net_points) || 0), 0);
    }, [wallet, merchants]);

    const totalCashValue = useMemo(() => {
        // 10 pts = ₹1.00
        return totalPointsBalance / 10;
    }, [totalPointsBalance]);

    const totalSpentAcrossShops = useMemo(() => {
        return merchants.reduce((sum, m) => sum + (parseFloat(m.total_spent) || 0), 0);
    }, [merchants]);

    const totalOrdersCount = useMemo(() => {
        return merchants.reduce((sum, m) => sum + (parseInt(m.purchases_count) || 0), 0);
    }, [merchants]);

    // Unique Shop Names for Dropdown Filters
    const availableShopNames = useMemo(() => {
        const set = new Set();
        merchants.forEach(m => {
            if (m.merchant_name) set.add(m.merchant_name);
        });
        purchases.forEach(p => {
            if (p.merchant_name) set.add(p.merchant_name);
        });
        transactions.forEach(t => {
            if (t.merchant_name) set.add(t.merchant_name);
        });
        return Array.from(set).sort();
    }, [merchants, purchases, transactions]);

    // Filtered Merchants
    const filteredMerchants = useMemo(() => {
        return merchants.filter(m => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (m.merchant_name && m.merchant_name.toLowerCase().includes(q)) ||
                   (m.merchant_email && m.merchant_email.toLowerCase().includes(q));
        });
    }, [merchants, searchQuery]);

    // Filtered Transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Shop filter
            if (selectedShopFilter !== 'ALL') {
                if (!t.merchant_name || t.merchant_name.toLowerCase() !== selectedShopFilter.toLowerCase()) {
                    return false;
                }
            }
            // Type filter
            const earned = parseInt(t.points_earned) || 0;
            const redeemed = parseInt(t.points_redeemed) || 0;
            if (txTypeFilter === 'EARNED' && earned <= 0) return false;
            if (txTypeFilter === 'REDEEMED' && redeemed <= 0) return false;

            // Search query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const inv = String(t.invoice_number || '').toLowerCase();
                const shop = String(t.merchant_name || '').toLowerCase();
                const desc = String(t.description || '').toLowerCase();
                return inv.includes(q) || shop.includes(q) || desc.includes(q);
            }
            return true;
        });
    }, [transactions, selectedShopFilter, txTypeFilter, searchQuery]);

    // Filtered Purchases
    const filteredPurchases = useMemo(() => {
        return purchases.filter(p => {
            // Shop filter
            if (selectedShopFilter !== 'ALL') {
                if (!p.merchant_name || p.merchant_name.toLowerCase() !== selectedShopFilter.toLowerCase()) {
                    return false;
                }
            }
            // Search query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const inv = String(p.invoice_number || '').toLowerCase();
                const shop = String(p.merchant_name || '').toLowerCase();
                const itemsStr = typeof p.items === 'string' ? p.items.toLowerCase() : JSON.stringify(p.items || '').toLowerCase();
                return inv.includes(q) || shop.includes(q) || itemsStr.includes(q);
            }
            return true;
        });
    }, [purchases, selectedShopFilter, searchQuery]);

    const toggleExpandPurchase = (id) => {
        setExpandedPurchaseIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleOpenInvoiceModal = async (purchaseOrId) => {
        try {
            const targetId = typeof purchaseOrId === 'object' ? (purchaseOrId.invoice_id || purchaseOrId.id || purchaseOrId.invoice_number) : purchaseOrId;
            const fullDetails = await customerLoyaltyService.getInvoiceDetails(targetId).catch(() => null);
            if (fullDetails && (fullDetails.invoice_number || fullDetails.id)) {
                setSelectedInvoice(fullDetails);
            } else if (typeof purchaseOrId === 'object') {
                setSelectedInvoice(purchaseOrId);
            }
            setIsInvoiceModalOpen(true);
        } catch (e) {
            if (typeof purchaseOrId === 'object') {
                setSelectedInvoice(purchaseOrId);
                setIsInvoiceModalOpen(true);
            }
        }
    };

    const handleFilterByShop = (shopName) => {
        setSelectedShopFilter(shopName);
        setActiveTab('purchases');
        setSearchParams({ tab: 'purchases', shop: shopName });
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8FAFC', overflow: 'hidden' }}>
            
            {/* Top Header Bar */}
            <div style={{ 
                background: '#FFFFFF', 
                borderBottom: '1px solid #E2E8F0', 
                padding: '1.25rem 2rem', 
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                        width: '46px', 
                        height: '46px', 
                        borderRadius: '14px', 
                        background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#34D399',
                        boxShadow: '0 4px 14px rgba(6, 78, 59, 0.2)'
                    }}>
                        <Coins size={24} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '850', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
                                Customer Loyalty & Store Points
                            </h1>
                            <span style={{ 
                                background: '#ECFDF5', 
                                color: '#059669', 
                                border: '1px solid #A7F3D0',
                                padding: '0.2rem 0.6rem', 
                                borderRadius: '99px', 
                                fontSize: '0.72rem', 
                                fontWeight: '800' 
                            }}>
                                CLIKS Multi-Store Network
                            </span>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '500', margin: '0.2rem 0 0 0' }}>
                            Track available points in every shop you purchase from, monitor complete bill history, and inspect point ledger.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={() => setShowCalculatorModal(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 0.95rem',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontSize: '0.8rem',
                            fontWeight: '750',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#1B6B3A'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                    >
                        <HelpCircle size={15} color="#1B6B3A" /> Point Rules & Ratio
                    </button>

                    <button
                        onClick={handleRefreshAll}
                        disabled={isRefreshing}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.55rem 0.95rem',
                            borderRadius: '10px',
                            border: '1px solid #1B6B3A',
                            background: '#1B6B3A',
                            color: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: '750',
                            cursor: isRefreshing ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(27, 107, 58, 0.25)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
                        {isRefreshing ? 'Syncing...' : 'Sync Store Data'}
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem 3rem 2rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    
                    {/* Top KPI Banner Cards */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                        gap: '1.25rem' 
                    }}>
                        {/* 1. Total Points Balance */}
                        <div style={{
                            background: 'linear-gradient(135deg, #064E3B 0%, #135029 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: '#FFFFFF',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.16)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#A7F3D0' }}>
                                        TOTAL POINTS BALANCE
                                    </span>
                                    <div style={{ fontSize: '2.25rem', fontWeight: '900', margin: '0.25rem 0 0.15rem 0', lineHeight: 1.1 }}>
                                        {totalPointsBalance.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: '750' }}>pts</span>
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#D1FAE5', fontWeight: '700', marginTop: '0.35rem' }}>
                                        ≈ {formatCurrency(totalCashValue)} Net Store Credit
                                    </div>
                                </div>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: 'rgba(255, 255, 255, 0.15)', 
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#FCD34D'
                                }}>
                                    <Star size={24} fill="#FCD34D" />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', color: '#ECFDF5', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Ratio: 10 pts = ₹1.00</span>
                                <span style={{ fontWeight: '800', color: '#FCD34D' }}>Active in all shops</span>
                            </div>
                        </div>

                        {/* 2. Total Connected Shops */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                                        CONNECTED STORES
                                    </span>
                                    <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#0F172A', margin: '0.25rem 0 0.15rem 0', lineHeight: 1.1 }}>
                                        {merchants.length} <span style={{ fontSize: '1rem', fontWeight: '750', color: '#64748B' }}>shops</span>
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#059669', fontWeight: '700', marginTop: '0.35rem' }}>
                                        {totalOrdersCount} Total Purchases Recorded
                                    </div>
                                </div>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: '#F0FDF4', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#1B6B3A'
                                }}>
                                    <Store size={22} />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Multi-shop network</span>
                                <span style={{ fontWeight: '700', color: '#1B6B3A' }}>Auto-synced</span>
                            </div>
                        </div>

                        {/* 3. Lifetime Spent at Stores */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                                        LIFETIME STORE SPEND
                                    </span>
                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A', margin: '0.25rem 0 0.15rem 0', lineHeight: 1.1 }}>
                                        {formatCurrency(totalSpentAcrossShops)}
                                    </div>
                                    <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: '600', marginTop: '0.35rem' }}>
                                        Across all billing invoices
                                    </div>
                                </div>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: '#EFF6FF', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#2563EB'
                                }}>
                                    <ShoppingBag size={22} />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Earn Rate: ₹100 = 1 pt</span>
                                <span style={{ fontWeight: '750', color: '#2563EB' }}>1% Return</span>
                            </div>
                        </div>

                        {/* 4. Lifetime Points Activity */}
                        <div style={{
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                                        POINTS ACTIVITY
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.4rem 0 0.2rem 0' }}>
                                        <div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '850', color: '#059669' }}>
                                                +{(wallet.total_earned || 0).toLocaleString()}
                                            </div>
                                            <span style={{ fontSize: '0.68rem', fontWeight: '750', color: '#64748B' }}>Earned</span>
                                        </div>
                                        <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
                                        <div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '850', color: '#DC2626' }}>
                                                -{(wallet.total_redeemed || 0).toLocaleString()}
                                            </div>
                                            <span style={{ fontSize: '0.68rem', fontWeight: '750', color: '#64748B' }}>Redeemed</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                                        {transactions.length} total ledger records
                                    </div>
                                </div>
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: '#FEF3C7', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#D97706'
                                }}>
                                    <History size={22} />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Ledger Audit</span>
                                <span style={{ fontWeight: '750', color: '#D97706' }}>Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs and Universal Search Bar */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '18px',
                        padding: '0.85rem 1.25rem',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => { setActiveTab('shops'); setSearchParams({ tab: 'shops' }); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    background: activeTab === 'shops' ? '#1B6B3A' : '#F1F5F9',
                                    color: activeTab === 'shops' ? '#FFFFFF' : '#475569',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeTab === 'shops' ? '0 3px 10px rgba(27, 107, 58, 0.2)' : 'none'
                                }}
                            >
                                <Store size={16} />
                                Shop Balances ({merchants.length})
                            </button>

                            <button
                                onClick={() => { setActiveTab('points'); setSearchParams({ tab: 'points' }); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    background: activeTab === 'points' ? '#1B6B3A' : '#F1F5F9',
                                    color: activeTab === 'points' ? '#FFFFFF' : '#475569',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeTab === 'points' ? '0 3px 10px rgba(27, 107, 58, 0.2)' : 'none'
                                }}
                            >
                                <History size={16} />
                                Point History ({transactions.length})
                            </button>

                            <button
                                onClick={() => { setActiveTab('purchases'); setSearchParams({ tab: 'purchases' }); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    background: activeTab === 'purchases' ? '#1B6B3A' : '#F1F5F9',
                                    color: activeTab === 'purchases' ? '#FFFFFF' : '#475569',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeTab === 'purchases' ? '0 3px 10px rgba(27, 107, 58, 0.2)' : 'none'
                                }}
                            >
                                <Receipt size={16} />
                                Purchase History ({purchases.length})
                            </button>

                            <button
                                onClick={() => { setActiveTab('offers'); setSearchParams({ tab: 'offers' }); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.55rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    background: activeTab === 'offers' ? '#1B6B3A' : '#F1F5F9',
                                    color: activeTab === 'offers' ? '#FFFFFF' : '#475569',
                                    transition: 'all 0.2s ease',
                                    boxShadow: activeTab === 'offers' ? '0 3px 10px rgba(27, 107, 58, 0.2)' : 'none'
                                }}
                            >
                                <Gift size={16} />
                                Perks & Offers
                            </button>
                        </div>

                        {/* Search and Dropdown Filter controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {/* Shop Selector Dropdown (for points and purchases tabs) */}
                            {(activeTab === 'points' || activeTab === 'purchases') && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Store size={15} color="#64748B" />
                                    <select
                                        value={selectedShopFilter}
                                        onChange={(e) => setSelectedShopFilter(e.target.value)}
                                        style={{
                                            padding: '0.45rem 0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: '#1E293B',
                                            background: '#F8FAFC',
                                            cursor: 'pointer',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="ALL">All Stores ({availableShopNames.length})</option>
                                        {availableShopNames.map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Type Filter for Point History */}
                            {activeTab === 'points' && (
                                <select
                                    value={txTypeFilter}
                                    onChange={(e) => setTxTypeFilter(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: '#1E293B',
                                        background: '#F8FAFC',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="EARNED">+ Points Earned</option>
                                    <option value="REDEEMED">- Points Redeemed</option>
                                </select>
                            )}

                            {/* Search Box */}
                            <div style={{ 
                                position: 'relative', 
                                display: 'flex', 
                                alignItems: 'center' 
                            }}>
                                <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px' }} />
                                <input
                                    type="text"
                                    placeholder={
                                        activeTab === 'shops' ? 'Search store name...' :
                                        activeTab === 'points' ? 'Search by invoice # or store...' :
                                        activeTab === 'purchases' ? 'Search invoice or item...' : 'Search...'
                                    }
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '0.45rem 0.75rem 0.45rem 2rem',
                                        borderRadius: '8px',
                                        border: '1px solid #CBD5E1',
                                        fontSize: '0.8rem',
                                        color: '#0F172A',
                                        background: '#FFFFFF',
                                        outline: 'none',
                                        width: '210px'
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TAB 1: SHOP-WISE LOYALTY BALANCES */}
                    {activeTab === 'shops' && (
                        <div>
                            {isMerchantsLoading ? (
                                <div style={{ background: '#fff', borderRadius: '18px', padding: '3rem', textAlign: 'center', border: '1px solid #E2E8F0', color: '#64748B' }}>
                                    <RefreshCw size={28} className="spin" style={{ margin: '0 auto 1rem auto', color: '#1B6B3A' }} />
                                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Loading your multi-store loyalty balances...</p>
                                </div>
                            ) : filteredMerchants.length === 0 ? (
                                <div style={{ 
                                    background: '#FFFFFF', 
                                    borderRadius: '24px', 
                                    padding: '3.5rem 2rem', 
                                    textAlign: 'center', 
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#F0FDF4', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                                        <Store size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '850', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                                        {searchQuery ? 'No shops match your search' : 'No Store Points Yet'}
                                    </h3>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                                        Whenever you buy from any merchant or shop using CLIKS Business POS and provide your phone or email, your loyalty points and purchase invoices automatically appear here!
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(''); handleRefreshAll(); }}
                                        style={{
                                            padding: '0.65rem 1.25rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: '#1B6B3A',
                                            color: '#fff',
                                            fontWeight: '800',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Check & Refresh Data
                                    </button>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                                    gap: '1.25rem' 
                                }}>
                                    {filteredMerchants.map((merchant) => {
                                        const netPoints = parseInt(merchant.net_points) || 0;
                                        const cashVal = netPoints / 10;
                                        const totalSpent = parseFloat(merchant.total_spent) || 0;
                                        const earned = parseInt(merchant.points_earned) || 0;
                                        const redeemed = parseInt(merchant.points_redeemed) || 0;
                                        const initial = (merchant.merchant_name || 'Store').charAt(0).toUpperCase();

                                        return (
                                            <motion.div
                                                key={merchant.merchant_business_id || merchant.merchant_name}
                                                whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
                                                transition={{ duration: 0.2 }}
                                                style={{
                                                    background: '#FFFFFF',
                                                    borderRadius: '20px',
                                                    border: '1px solid #E2E8F0',
                                                    padding: '1.5rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div>
                                                    {/* Card Header: Avatar & Shop Name */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                            <div style={{
                                                                width: '46px',
                                                                height: '46px',
                                                                borderRadius: '12px',
                                                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                                                color: '#FFFFFF',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '1.2rem',
                                                                fontWeight: '850',
                                                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                                            }}>
                                                                {initial}
                                                            </div>
                                                            <div>
                                                                <h4 style={{ fontSize: '1.1rem', fontWeight: '850', color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                                                                    {merchant.merchant_name}
                                                                </h4>
                                                                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '500' }}>
                                                                    {merchant.merchant_email || 'Verified CLIKS Partner'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span style={{
                                                            fontSize: '0.65rem',
                                                            fontWeight: '800',
                                                            textTransform: 'uppercase',
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '6px',
                                                            background: '#ECFDF5',
                                                            color: '#065F46',
                                                            border: '1px solid #A7F3D0'
                                                        }}>
                                                            CONNECTED
                                                        </span>
                                                    </div>

                                                    {/* Central Loyalty Points Highlight Box */}
                                                    <div style={{
                                                        background: '#F0FDF4',
                                                        borderRadius: '16px',
                                                        padding: '1.1rem 1.25rem',
                                                        border: '1px solid #BBF7D0',
                                                        marginBottom: '1.25rem'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                                    AVAILABLE IN THIS SHOP
                                                                </span>
                                                                <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#1B6B3A', margin: '2px 0', lineHeight: 1 }}>
                                                                    {netPoints.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>pts</span>
                                                                </div>
                                                                <div style={{ fontSize: '0.8rem', fontWeight: '750', color: '#15803D' }}>
                                                                    ≈ {formatCurrency(cashVal)} Store Value
                                                                </div>
                                                            </div>

                                                            <div style={{
                                                                width: '42px',
                                                                height: '42px',
                                                                borderRadius: '12px',
                                                                background: '#DCFCE7',
                                                                color: '#15803D',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Star size={22} fill="#15803D" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Store Stats Grid */}
                                                    <div style={{ 
                                                        display: 'grid', 
                                                        gridTemplateColumns: '1fr 1fr', 
                                                        gap: '0.75rem',
                                                        padding: '0.85rem',
                                                        background: '#F8FAFC',
                                                        borderRadius: '12px',
                                                        border: '1px solid #E2E8F0',
                                                        marginBottom: '1.25rem'
                                                    }}>
                                                        <div>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Total Purchases</span>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '850', color: '#0F172A' }}>
                                                                {merchant.purchases_count || 1} Orders
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Total Spend</span>
                                                            <span style={{ fontSize: '0.95rem', fontWeight: '850', color: '#0F172A' }}>
                                                                {formatCurrency(totalSpent)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Earned / Redeemed</span>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669' }}>
                                                                +{earned} <span style={{ color: '#DC2626' }}>/-{redeemed}</span>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748B', display: 'block' }}>Last Visited</span>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                                                                {formatDate(merchant.last_purchase_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button: Filter to this Shop's Purchases */}
                                                <button
                                                    onClick={() => handleFilterByShop(merchant.merchant_name)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.65rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '1px solid #E2E8F0',
                                                        background: '#FFFFFF',
                                                        color: '#1B6B3A',
                                                        fontWeight: '800',
                                                        fontSize: '0.825rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.4rem',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = '#1B6B3A';
                                                        e.currentTarget.style.color = '#FFFFFF';
                                                        e.currentTarget.style.borderColor = '#1B6B3A';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                        e.currentTarget.style.color = '#1B6B3A';
                                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                                    }}
                                                >
                                                    View Shop Invoices & Ledger →
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: POINT HISTORY (CHRONOLOGICAL LEDGER) */}
                    {activeTab === 'points' && (
                        <div>
                            {isWalletLoading ? (
                                <div style={{ background: '#fff', borderRadius: '18px', padding: '3rem', textAlign: 'center', border: '1px solid #E2E8F0', color: '#64748B' }}>
                                    <RefreshCw size={28} className="spin" style={{ margin: '0 auto 1rem auto', color: '#1B6B3A' }} />
                                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Loading point transaction ledger...</p>
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div style={{ 
                                    background: '#FFFFFF', 
                                    borderRadius: '24px', 
                                    padding: '3.5rem 2rem', 
                                    textAlign: 'center', 
                                    border: '1px solid #E2E8F0' 
                                }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                                        <History size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '850', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                                        No Point Transactions Found
                                    </h3>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                                        {selectedShopFilter !== 'ALL' ? `No loyalty points activity recorded at "${selectedShopFilter}".` : 'No point credits or debits recorded yet.'}
                                    </p>
                                </div>
                            ) : (
                                <div style={{
                                    background: '#FFFFFF',
                                    borderRadius: '20px',
                                    border: '1px solid #E2E8F0',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                }}>
                                    {/* Table Header */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '160px 1.2fr 2fr 130px 130px',
                                        padding: '0.9rem 1.5rem',
                                        background: '#F8FAFC',
                                        borderBottom: '1px solid #E2E8F0',
                                        fontSize: '0.72rem',
                                        fontWeight: '850',
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em'
                                    }}>
                                        <div>Date & Time</div>
                                        <div>Shop Name</div>
                                        <div>Activity / Description</div>
                                        <div>Invoice Slip</div>
                                        <div style={{ textAlign: 'right' }}>Points Delta</div>
                                    </div>

                                    {/* Table Rows */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {filteredTransactions.map((tx, idx) => {
                                            const earned = parseInt(tx.points_earned) || 0;
                                            const redeemed = parseInt(tx.points_redeemed) || 0;
                                            const isCredit = earned > 0;
                                            const pts = isCredit ? earned : redeemed;

                                            return (
                                                <div
                                                    key={tx.id || idx}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '160px 1.2fr 2fr 130px 130px',
                                                        padding: '1rem 1.5rem',
                                                        alignItems: 'center',
                                                        borderBottom: idx === filteredTransactions.length - 1 ? 'none' : '1px solid #F1F5F9',
                                                        fontSize: '0.85rem',
                                                        transition: 'background 0.15s ease'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                                                >
                                                    {/* Date & Time */}
                                                    <div style={{ color: '#475569', fontWeight: '600', fontSize: '0.8rem' }}>
                                                        {formatDateTime(tx.created_at)}
                                                    </div>

                                                    {/* Shop Name */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ 
                                                            width: '26px', 
                                                            height: '26px', 
                                                            borderRadius: '6px', 
                                                            background: '#ECFDF5', 
                                                            color: '#059669', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            fontSize: '0.72rem',
                                                            fontWeight: '800'
                                                        }}>
                                                            <Store size={14} />
                                                        </div>
                                                        <span style={{ fontWeight: '800', color: '#0F172A' }}>
                                                            {tx.merchant_name || 'CLIKS Store'}
                                                        </span>
                                                    </div>

                                                    {/* Activity / Description */}
                                                    <div style={{ color: '#334155', fontWeight: '500' }}>
                                                        {tx.description || (isCredit ? `Earned from purchase #${tx.invoice_number}` : `Redeemed on purchase #${tx.invoice_number}`)}
                                                    </div>

                                                    {/* Invoice Link */}
                                                    <div>
                                                        {tx.invoice_number ? (
                                                            <button
                                                                onClick={() => handleOpenInvoiceModal({ invoice_number: tx.invoice_number, merchant_name: tx.merchant_name })}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.3rem',
                                                                    padding: '0.25rem 0.6rem',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #CBD5E1',
                                                                    background: '#FFFFFF',
                                                                    color: '#1D4ED8',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: '800',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <FileText size={12} />
                                                                #{tx.invoice_number}
                                                            </button>
                                                        ) : (
                                                            <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Direct Bonus</span>
                                                        )}
                                                    </div>

                                                    {/* Points Delta */}
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.2rem',
                                                            padding: '0.25rem 0.6rem',
                                                            borderRadius: '8px',
                                                            fontWeight: '850',
                                                            fontSize: '0.825rem',
                                                            background: isCredit ? '#ECFDF5' : '#FEF2F2',
                                                            color: isCredit ? '#059669' : '#DC2626',
                                                            border: `1px solid ${isCredit ? '#A7F3D0' : '#FECACA'}`
                                                        }}>
                                                            {isCredit ? <ArrowDownLeft size={13} strokeWidth={2.5} /> : <ArrowUpRight size={13} strokeWidth={2.5} />}
                                                            {isCredit ? `+${pts}` : `-${pts}`} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: PURCHASE HISTORY WITH ITEM BREAKDOWN & MODAL */}
                    {activeTab === 'purchases' && (
                        <div>
                            {isPurchasesLoading ? (
                                <div style={{ background: '#fff', borderRadius: '18px', padding: '3rem', textAlign: 'center', border: '1px solid #E2E8F0', color: '#64748B' }}>
                                    <RefreshCw size={28} className="spin" style={{ margin: '0 auto 1rem auto', color: '#1B6B3A' }} />
                                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Loading all store purchase bills...</p>
                                </div>
                            ) : filteredPurchases.length === 0 ? (
                                <div style={{ 
                                    background: '#FFFFFF', 
                                    borderRadius: '24px', 
                                    padding: '3.5rem 2rem', 
                                    textAlign: 'center', 
                                    border: '1px solid #E2E8F0' 
                                }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#F0FDF4', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                                        <Receipt size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '850', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                                        No Purchase Invoices Found
                                    </h3>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                                        {selectedShopFilter !== 'ALL' ? `No purchase bills recorded for store "${selectedShopFilter}".` : 'No purchases found matching your criteria.'}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {filteredPurchases.map((purchase) => {
                                        const pId = purchase.invoice_id || purchase.id;
                                        const isExpanded = expandedPurchaseIds.includes(pId);
                                        const items = parseItems(purchase.items);
                                        const totalAmt = parseFloat(purchase.grand_total || purchase.net_amount || purchase.total_amount) || 0;
                                        const earnedPts = parseInt(purchase.points_earned) || parseInt(purchase.earned_points) || 0;
                                        const redeemedPts = parseInt(purchase.points_redeemed) || 0;

                                        return (
                                            <div
                                                key={pId}
                                                style={{
                                                    background: '#FFFFFF',
                                                    borderRadius: '18px',
                                                    border: '1px solid #E2E8F0',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {/* Bill Header Row */}
                                                <div style={{
                                                    padding: '1.25rem 1.5rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '1rem',
                                                    background: isExpanded ? '#F8FAFC' : '#FFFFFF',
                                                    borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none'
                                                }}>
                                                    {/* Left: Invoice Number, Store Name, Date */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '42px',
                                                            height: '42px',
                                                            borderRadius: '12px',
                                                            background: '#F0FDF4',
                                                            color: '#1B6B3A',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        }}>
                                                            <Receipt size={20} />
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                                                <span style={{ fontSize: '1rem', fontWeight: '850', color: '#0F172A' }}>
                                                                    #{purchase.invoice_number || `INV-${purchase.id}`}
                                                                </span>
                                                                <span style={{ 
                                                                    background: '#ECFDF5', 
                                                                    color: '#059669', 
                                                                    padding: '0.15rem 0.5rem', 
                                                                    borderRadius: '6px', 
                                                                    fontSize: '0.7rem', 
                                                                    fontWeight: '800' 
                                                                }}>
                                                                    PAID
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.8rem', color: '#64748B' }}>
                                                                <span style={{ fontWeight: '750', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                    <Store size={13} color="#1B6B3A" /> {purchase.merchant_name || 'CLIKS Merchant'}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{formatDate(purchase.invoice_date || purchase.created_at)}</span>
                                                                {items.length > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Points Delta, Bill Total, Actions */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                        {/* Points earned/redeemed badges */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                            {earnedPts > 0 && (
                                                                <span style={{ 
                                                                    display: 'inline-flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '0.25rem', 
                                                                    fontSize: '0.78rem', 
                                                                    fontWeight: '850', 
                                                                    color: '#059669', 
                                                                    background: '#ECFDF5', 
                                                                    border: '1px solid #A7F3D0',
                                                                    padding: '0.2rem 0.5rem', 
                                                                    borderRadius: '6px' 
                                                                }}>
                                                                    <Star size={11} fill="#059669" /> +{earnedPts} pts earned
                                                                </span>
                                                            )}
                                                            {redeemedPts > 0 && (
                                                                <span style={{ 
                                                                    display: 'inline-flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '0.25rem', 
                                                                    fontSize: '0.78rem', 
                                                                    fontWeight: '850', 
                                                                    color: '#DC2626', 
                                                                    background: '#FEF2F2', 
                                                                    border: '1px solid #FECACA',
                                                                    padding: '0.2rem 0.5rem', 
                                                                    borderRadius: '6px' 
                                                                }}>
                                                                    -{redeemedPts} pts redeemed
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Total Amount */}
                                                        <div style={{ textAlign: 'right' }}>
                                                            <span style={{ fontSize: '0.68rem', fontWeight: '750', color: '#64748B', display: 'block' }}>BILL TOTAL</span>
                                                            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A' }}>
                                                                {formatCurrency(totalAmt)}
                                                            </span>
                                                        </div>

                                                        {/* Actions: View Receipt Modal + Expand Items Toggle */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => handleOpenInvoiceModal(purchase)}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.35rem',
                                                                    padding: '0.5rem 0.85rem',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #1B6B3A',
                                                                    background: '#FFFFFF',
                                                                    color: '#1B6B3A',
                                                                    fontSize: '0.78rem',
                                                                    fontWeight: '800',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.currentTarget.style.background = '#1B6B3A';
                                                                    e.currentTarget.style.color = '#FFFFFF';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.currentTarget.style.background = '#FFFFFF';
                                                                    e.currentTarget.style.color = '#1B6B3A';
                                                                }}
                                                            >
                                                                <FileText size={14} /> View Receipt
                                                            </button>

                                                            {items.length > 0 && (
                                                                <button
                                                                    onClick={() => toggleExpandPurchase(pId)}
                                                                    style={{
                                                                        padding: '0.5rem',
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #E2E8F0',
                                                                        background: '#F8FAFC',
                                                                        color: '#475569',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                    title={isExpanded ? 'Collapse items' : 'Expand items'}
                                                                >
                                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expandable Items List */}
                                                {isExpanded && items.length > 0 && (
                                                    <div style={{ padding: '1rem 1.5rem', background: '#FAFAFA' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                                                            Billed Products ({items.length})
                                                        </div>
                                                        <div style={{
                                                            background: '#FFFFFF',
                                                            borderRadius: '12px',
                                                            border: '1px solid #E2E8F0',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: '2fr 80px 100px 90px 110px',
                                                                padding: '0.65rem 1rem',
                                                                background: '#F1F5F9',
                                                                fontSize: '0.7rem',
                                                                fontWeight: '800',
                                                                color: '#475569',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                <div>Item Description</div>
                                                                <div>Qty</div>
                                                                <div>Price</div>
                                                                <div>GST</div>
                                                                <div style={{ textAlign: 'right' }}>Total</div>
                                                            </div>
                                                            {items.map((it, itIdx) => {
                                                                const itName = it.product_name || it.description || it.name || 'Item';
                                                                const itQty = parseFloat(it.quantity) || 1;
                                                                const itPrice = parseFloat(it.price || it.rate || it.unit_price) || 0;
                                                                const itGst = parseFloat(it.gst_percent || it.tax_rate) || 0;
                                                                const itTotal = parseFloat(it.total || it.item_total || it.amount) || (itQty * itPrice);

                                                                return (
                                                                    <div
                                                                        key={itIdx}
                                                                        style={{
                                                                            display: 'grid',
                                                                            gridTemplateColumns: '2fr 80px 100px 90px 110px',
                                                                            padding: '0.75rem 1rem',
                                                                            borderBottom: itIdx === items.length - 1 ? 'none' : '1px solid #F1F5F9',
                                                                            fontSize: '0.8rem',
                                                                            color: '#1E293B'
                                                                        }}
                                                                    >
                                                                        <div style={{ fontWeight: '700' }}>
                                                                            {itName}
                                                                            {it.hsn_code && (
                                                                                <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginLeft: '0.4rem' }}>
                                                                                    HSN: {it.hsn_code}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div>{itQty} {it.unit || 'Pcs'}</div>
                                                                        <div>{formatCurrency(itPrice)}</div>
                                                                        <div>{itGst > 0 ? `${itGst}%` : '0%'}</div>
                                                                        <div style={{ textAlign: 'right', fontWeight: '800' }}>{formatCurrency(itTotal)}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 4: PERKS & WALLET OFFERS */}
                    {activeTab === 'offers' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #064E3B 0%, #1B6B3A 100%)',
                                borderRadius: '24px',
                                padding: '2rem',
                                color: '#FFFFFF',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1.5rem',
                                boxShadow: '0 8px 24px rgba(6, 78, 59, 0.15)'
                            }}>
                                <div style={{ maxWidth: '640px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.75rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                        <Sparkles size={14} color="#FCD34D" />
                                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#A7F3D0', textTransform: 'uppercase' }}>Points Conversion</span>
                                    </div>
                                    <h2 style={{ fontSize: '1.65rem', fontWeight: '850', margin: '0 0 0.5rem 0' }}>
                                        Convert Store Points Directly to Wallet Cash
                                    </h2>
                                    <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                                        Every 10 loyalty points you hold equals ₹1.00 in real spending money. Convert your points balance directly to your Cliks Wallet to pay for utilities, split bills, or subscription discounts!
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/payments/wallet?addMoney=true&tab=points')}
                                    style={{
                                        padding: '0.85rem 1.5rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                                        color: '#78350F',
                                        fontWeight: '850',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Wallet size={18} /> Convert Points to Wallet
                                </button>
                            </div>

                            {/* Booster Deals */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                                {[
                                    { title: 'Starter Wallet Load Reward', desc: 'Load ₹5,000 or more into your Cliks Wallet and claim a 2% flat discount on your next monthly or annual Cliks Pro subscription.', label: '2% OFF PRO', icon: Wallet, bg: '#ECFDF5', accent: '#10B981', text: '#065F46' },
                                    { title: 'Silver Wallet Load Reward', desc: 'Load ₹10,000 or more into your Cliks Wallet and claim a 3.5% flat discount on your next monthly or annual Cliks Pro subscription.', label: '3.5% OFF PRO', icon: Coins, bg: '#EFF6FF', accent: '#3B82F6', text: '#1E40AF' },
                                    { title: 'Gold Wallet Load Reward', desc: 'Load ₹25,000 or more into your Cliks Wallet and claim a 5% flat discount on your next monthly or annual Cliks Pro subscription.', label: '5% OFF PRO', icon: BadgePercent, bg: '#FEF3C7', accent: '#F59E0B', text: '#92400E' },
                                    { title: 'Platinum Wallet Load Reward', desc: 'Load ₹50,000 or more into your Cliks Wallet and claim an 8% flat discount on your next monthly or annual Cliks Pro subscription.', label: '8% OFF PRO', icon: Sparkles, bg: '#FEE2E2', accent: '#EF4444', text: '#991B1B' }
                                ].map((deal, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: '#FFFFFF',
                                            borderRadius: '18px',
                                            border: '1px solid #E2E8F0',
                                            padding: '1.35rem',
                                            display: 'flex',
                                            gap: '1.25rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div style={{
                                            width: '46px',
                                            height: '46px',
                                            borderRadius: '14px',
                                            background: deal.bg,
                                            color: deal.accent,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <deal.icon size={22} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>{deal.title}</h4>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '850', padding: '0.2rem 0.5rem', borderRadius: '6px', background: deal.bg, color: deal.text }}>
                                                    {deal.label}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
                                                {deal.desc}
                                            </p>
                                            <button
                                                onClick={() => navigate('/payments/wallet?addMoney=true')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: deal.accent,
                                                    fontWeight: '800',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}
                                            >
                                                Load Wallet Now →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* INVOICE DETAIL & RECEIPT SLIP MODAL */}
            <AnimatePresence>
                {isInvoiceModalOpen && selectedInvoice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: '#FFFFFF',
                                width: '100%',
                                maxWidth: '680px',
                                maxHeight: '90vh',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '1.25rem 1.75rem',
                                background: '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '850', color: '#0F172A', margin: 0 }}>
                                            Tax Invoice & Receipt Slip
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                                            #{selectedInvoice.invoice_number || `INV-${selectedInvoice.id}`}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsInvoiceModalOpen(false)}
                                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Printable Receipt Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
                                {/* Merchant & Customer Info Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>BILLED BY (STORE)</span>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '850', color: '#0F172A', margin: '0.2rem 0' }}>
                                            {selectedInvoice.merchant?.name || selectedInvoice.merchant_name || 'CLIKS Partner Store'}
                                        </h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                                            {selectedInvoice.merchant?.email || selectedInvoice.merchant_email || 'Verified Merchant Partner'}
                                        </p>
                                    </div>

                                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>CUSTOMER DETAILS</span>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '850', color: '#0F172A', margin: '0.2rem 0' }}>
                                            {selectedInvoice.customer?.name || selectedInvoice.customer_name || selectedInvoice.client_name || user?.username || 'Customer'}
                                        </h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                                            {selectedInvoice.customer?.email || selectedInvoice.customer_email || selectedInvoice.client_email || user?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Bill Meta details */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#ECFDF5', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                                    <div>
                                        <span style={{ color: '#065F46', fontWeight: '600' }}>Date: </span>
                                        <span style={{ fontWeight: '800', color: '#064E3B' }}>{formatDate(selectedInvoice.invoice_date || selectedInvoice.created_at)}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#065F46', fontWeight: '600' }}>Status: </span>
                                        <span style={{ fontWeight: '850', color: '#059669' }}>PAID & VERIFIED</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#065F46', fontWeight: '600' }}>Payment: </span>
                                        <span style={{ fontWeight: '800', color: '#064E3B' }}>{selectedInvoice.payment_mode || 'Online / Cash'}</span>
                                    </div>
                                </div>

                                {/* Line Items Table */}
                                <div style={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 110px', padding: '0.7rem 1rem', background: '#F1F5F9', fontSize: '0.72rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                                        <div>Item Description</div>
                                        <div>Qty</div>
                                        <div>Price</div>
                                        <div style={{ textAlign: 'right' }}>Total</div>
                                    </div>

                                    {parseItems(selectedInvoice.items).length > 0 ? (
                                        parseItems(selectedInvoice.items).map((it, idx) => {
                                            const qty = parseFloat(it.quantity) || 1;
                                            const price = parseFloat(it.price || it.rate || it.unit_price) || 0;
                                            const tot = parseFloat(it.total || it.amount || it.item_total) || (qty * price);
                                            return (
                                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 110px', padding: '0.75rem 1rem', borderTop: idx > 0 ? '1px solid #F1F5F9' : 'none', fontSize: '0.825rem' }}>
                                                    <div style={{ fontWeight: '750', color: '#0F172A' }}>
                                                        {it.product_name || it.description || it.name || 'Product Item'}
                                                    </div>
                                                    <div style={{ color: '#64748B' }}>{qty} {it.unit || 'Pcs'}</div>
                                                    <div style={{ color: '#334155' }}>{formatCurrency(price)}</div>
                                                    <div style={{ textAlign: 'right', fontWeight: '800', color: '#0F172A' }}>{formatCurrency(tot)}</div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B', fontSize: '0.825rem' }}>
                                            Standard billing items included
                                        </div>
                                    )}
                                </div>

                                {/* Financial Summary Totals */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
                                        {selectedInvoice.subtotal > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                                                <span>Subtotal</span>
                                                <span style={{ fontWeight: '700' }}>{formatCurrency(selectedInvoice.subtotal)}</span>
                                            </div>
                                        )}
                                        {selectedInvoice.discount_amount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                                                <span>Discount</span>
                                                <span style={{ fontWeight: '750' }}>-{formatCurrency(selectedInvoice.discount_amount)}</span>
                                            </div>
                                        )}
                                        {selectedInvoice.gst_amount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                                                <span>Taxes (GST)</span>
                                                <span style={{ fontWeight: '700' }}>{formatCurrency(selectedInvoice.gst_amount)}</span>
                                            </div>
                                        )}
                                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.2rem 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900', color: '#0F172A' }}>
                                            <span>Grand Total</span>
                                            <span>{formatCurrency(selectedInvoice.grand_total || selectedInvoice.total_amount || selectedInvoice.net_amount || 0)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Loyalty Earned Highlight Box */}
                                <div style={{
                                    background: '#F0FDF4',
                                    borderRadius: '14px',
                                    padding: '1rem 1.25rem',
                                    border: '1px solid #BBF7D0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Star size={18} fill="#15803D" />
                                        </div>
                                        <div>
                                            <h5 style={{ fontSize: '0.85rem', fontWeight: '850', color: '#166534', margin: 0 }}>
                                                Loyalty Earned on this Bill
                                            </h5>
                                            <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: '600' }}>
                                                Earned 1 point per ₹100 eligible spend
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#15803D' }}>
                                        +{(selectedInvoice.points_earned || selectedInvoice.loyalty_points_earned || Math.floor((selectedInvoice.grand_total || selectedInvoice.total_amount || 0) / 100))} pts
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div style={{
                                padding: '1rem 1.75rem',
                                background: '#F8FAFC',
                                borderTop: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                                    Synced directly from CLIKS Business POS
                                </span>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => window.print()}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            padding: '0.55rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid #CBD5E1',
                                            background: '#FFFFFF',
                                            color: '#334155',
                                            fontSize: '0.825rem',
                                            fontWeight: '800',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Printer size={15} /> Print Bill
                                    </button>
                                    <button
                                        onClick={() => setIsInvoiceModalOpen(false)}
                                        style={{
                                            padding: '0.55rem 1.25rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: '#1B6B3A',
                                            color: '#FFFFFF',
                                            fontSize: '0.825rem',
                                            fontWeight: '800',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* POINTS RULES & CALCULATOR MODAL */}
            <AnimatePresence>
                {showCalculatorModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '1.5rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: '#FFFFFF',
                                width: '100%',
                                maxWidth: '500px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <HelpCircle size={20} color="#1B6B3A" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: '#0F172A', margin: 0 }}>
                                        Loyalty Point Rules & Ratio
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowCalculatorModal(false)}
                                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '1rem', border: '1px solid #BBF7D0' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '850', color: '#166534', margin: '0 0 0.35rem 0' }}>
                                        Earning Ratio
                                    </h4>
                                    <p style={{ fontSize: '0.825rem', color: '#15803D', margin: 0, lineHeight: 1.45 }}>
                                        You earn <strong>1 Loyalty Point</strong> for every <strong>₹100</strong> billed across any CLIKS Business participating merchant.
                                    </p>
                                </div>

                                <div style={{ background: '#EFF6FF', borderRadius: '14px', padding: '1rem', border: '1px solid #BFDBFE' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '850', color: '#1E40AF', margin: '0 0 0.35rem 0' }}>
                                        Redemption & Cash Value
                                    </h4>
                                    <p style={{ fontSize: '0.825rem', color: '#1D4ED8', margin: 0, lineHeight: 1.45 }}>
                                        Every <strong>10 Points = ₹1.00 Value</strong>. Points can be redeemed at checkout with the merchant or converted to your Cliks Wallet balance.
                                    </p>
                                </div>

                                {/* Interactive Calculator */}
                                <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        Bill Amount Calculator (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={calcAmount}
                                        onChange={(e) => setCalcAmount(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '1rem',
                                            fontWeight: '800',
                                            color: '#0F172A',
                                            marginBottom: '1rem'
                                        }}
                                        placeholder="e.g. 5000"
                                    />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
                                        <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '750', color: '#64748B' }}>Points Earned</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1B6B3A', marginTop: '0.2rem' }}>
                                                +{Math.floor((parseFloat(calcAmount) || 0) / 100)} pts
                                            </div>
                                        </div>
                                        <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '750', color: '#64748B' }}>Cashback Value</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#2563EB', marginTop: '0.2rem' }}>
                                                {formatCurrency((Math.floor((parseFloat(calcAmount) || 0) / 100)) / 10)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCalculatorModal(false)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#1B6B3A',
                                        color: '#FFFFFF',
                                        fontWeight: '850',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Got It
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LoyaltyRewards;

