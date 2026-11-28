import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    ShoppingCart, Star, ExternalLink, RefreshCcw, History, ArrowRight, Package, 
    Receipt, IndianRupee, Clock, CheckCircle, AlertCircle, X, ChevronRight,
    MessageSquare, Send, Building2, Truck, CheckCircle2, XCircle, UserCheck, FileText, User,
    Plus, Calculator, HelpCircle, Info, Percent, ChevronDown, ChevronUp, Printer, Download,
    Shield, ShieldCheck, Search, ArrowUpRight, ArrowDownRight, Store, Wallet
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { financePlusService, customerLoyaltyService } from '../../services';
import { useAuth } from '../../context';

// Default mock items for purchases if items array is absent from legacy API payload
const MOCK_INVOICE_ITEMS = [
    { id: 101, product_name: 'Premium Cotton Shirt - Navy (Size L)', sku: 'SHIRT-NAV-L', quantity: 2, unit: 'Pcs', price: 2500, gst_percent: 18, amount: 5000 },
    { id: 102, product_name: 'Slim Fit Formal Denim Trousers', sku: 'TROUSER-SLIM-32', quantity: 1, unit: 'Pcs', price: 3500, gst_percent: 18, amount: 3500 },
    { id: 103, product_name: 'Pure Silk Executive Necktie', sku: 'TIE-SILK-EXEC', quantity: 3, unit: 'Pcs', price: 1200, gst_percent: 18, amount: 3600 }
];

const formatInvoiceDate = (inv) => {
    if (!inv) return 'N/A';
    const dateVal = inv.invoice_date || inv.invoiceDate || inv.date || inv.purchase_date || inv.purchaseDate || inv.timestamp || inv.created_at;
    if (!dateVal) return 'N/A';
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return String(dateVal).split('T')[0];
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return String(dateVal).split('T')[0];
    }
};

const hasProductWarranty = (item) => {
    if (!item) return false;
    const rawHW = item.has_warranty || item.warrantyDetails || item.warranty_details || item.hasWarranty;
    const period = item.warranty_period || item.warrantyPeriod || item.period;
    if (rawHW && (rawHW === 'Yes' || rawHW === true || String(rawHW).toLowerCase() === 'yes')) return true;
    if (period && String(period).trim() !== '' && String(period).trim() !== 'no' && String(period).trim() !== 'N/A' && String(period).trim() !== 'None') return true;

    // Check product name/category for warranty-eligible items (e.g. nokia, macbook, iphone, electronics)
    const nameLower = String(item.product_name || item.name || '').toLowerCase().trim();
    const catLower = String(item.category || '').toLowerCase().trim();
    const warrantyKeywords = ['nokia', 'macbook', 'iphone', 'samsung', 'apple', 'laptop', 'phone', 'mobile', 'tv', 'electronics', 'device', 'gadget', 'computer', 'tablet', 'watch', 'camera'];
    if (warrantyKeywords.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
        return true;
    }

    return false;
};

const getProductWarrantyPeriod = (item) => {
    if (!item) return '1 Year Warranty';
    const period = item.warranty_period || item.warrantyPeriod || item.period;
    if (period && String(period).trim() !== '' && String(period).trim() !== 'no' && String(period).trim() !== 'N/A' && String(period).trim() !== 'None') {
        return period;
    }
    return '1 Year Warranty';
};

const parseInvoiceItems = (inv) => {
    if (!inv || !inv.items) return [];
    if (Array.isArray(inv.items)) return inv.items;
    if (typeof inv.items === 'string') {
        try {
            const parsed = JSON.parse(inv.items);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            console.error('Failed to parse invoice items:', e);
        }
    }
    return [];
};

const invoiceHasWarranty = (inv) => {
    if (!inv) return false;
    const items = parseInvoiceItems(inv);
    return items.some(it => hasProductWarranty(it));
};

const PurchaseDetails = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    // Determine initial tab from query param (e.g. ?tab=points or ?tab=history or ?view=warranty)
    const initialTabParam = searchParams.get('tab');
    const isWarrantyParam = searchParams.get('view') === 'warranty';
    const [activeTab, setActiveTab] = useState(
        isWarrantyParam ? 'warranty' : (initialTabParam || 'shop-points')
    );

    const [selectedShop, setSelectedShop] = useState(null);
    const [viewingInvoiceId, setViewingInvoiceId] = useState(null);
    const [expandedInvoiceIds, setExpandedInvoiceIds] = useState([]);
    const [receiveData, setReceiveData] = useState(true);
    const [warrantySearchQuery, setWarrantySearchQuery] = useState('');

    // Points Breakdown & Calculator Modal state
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [calcAmountInput, setCalcAmountInput] = useState('10000');
    const [isShopModalOpen, setIsShopModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState('');

    // Supplier Request Modal states
    const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
    const [newSupplierForm, setNewSupplierForm] = useState({
        supplier_name: '',
        company: '',
        dealer_email: '',
        notes: ''
    });

    const handleCreateSupplierRequest = async (e) => {
        e.preventDefault();
        try {
            if (financePlusService.respondSupplierConnectionRequest) {
                await financePlusService.respondSupplierConnectionRequest(newSupplierForm);
            }
            alert('Supplier connection request sent successfully!');
            setIsAddSupplierModalOpen(false);
            setNewSupplierForm({ supplier_name: '', company: '', dealer_email: '', notes: '' });
            queryClient.invalidateQueries(['active-integrations']);
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || err.message || 'Failed to send supplier connection request.');
        }
    };

    // --- Queries for Purchases & Loyalty ---
    const { data: rawPurchases = [], isLoading: loadingPurchases } = useQuery({
        queryKey: ['customer-purchases'],
        queryFn: async () => {
            const res = await financePlusService.getPurchases();
            if (Array.isArray(res)) return res;
            if (Array.isArray(res?.data)) return res.data;
            if (Array.isArray(res?.purchases)) return res.purchases;
            return [];
        },
        refetchInterval: 5000
    });

    const purchases = useMemo(() => Array.isArray(rawPurchases) ? rawPurchases : [], [rawPurchases]);

    const { data: rawIntegrations = [], isLoading: loadingIntegrations } = useQuery({
        queryKey: ['active-integrations'],
        queryFn: async () => {
            try {
                const res = await financePlusService.getIntegrations();
                if (Array.isArray(res)) return res;
                if (Array.isArray(res?.data)) return res.data;
                if (Array.isArray(res?.integrations)) return res.integrations;
                return [];
            } catch (e) {
                console.error('Failed to load integrations:', e);
                return [];
            }
        },
        refetchInterval: 5000
    });

    const integrations = useMemo(() => Array.isArray(rawIntegrations) ? rawIntegrations : [], [rawIntegrations]);

    // Shop-wise balances & rewards
    const { data: rawMerchants = [], isLoading: loadingMerchants } = useQuery({
        queryKey: ['customer-merchants-loyalty'],
        queryFn: async () => {
            try {
                return await customerLoyaltyService.getMerchants();
            } catch (e) {
                console.error('Failed to load merchant loyalty balances:', e);
                return [];
            }
        },
        refetchInterval: 5000
    });

    // Customer overall loyalty wallet & transaction ledger
    const { data: walletData = { total_points: 0, total_value: 0, shop_count: 0, transactions: [] }, isLoading: loadingWallet } = useQuery({
        queryKey: ['customer-loyalty-wallet'],
        queryFn: async () => {
            try {
                return await customerLoyaltyService.getLoyaltyWallet();
            } catch (e) {
                console.error('Failed to load loyalty wallet:', e);
                return { total_points: 0, total_value: 0, shop_count: 0, transactions: [] };
            }
        },
        refetchInterval: 5000
    });

    const [actionLoadingId, setActionLoadingId] = useState(null);

    const handleRespondConnection = async (id, action) => {
        try {
            setActionLoadingId(id);
            await financePlusService.respondIntegration(id, action);
            queryClient.invalidateQueries(['active-integrations']);
            queryClient.invalidateQueries(['customer-purchases']);
            queryClient.invalidateQueries(['customer-merchants-loyalty']);
        } catch (err) {
            console.error('Failed to respond to connection request:', err);
            alert(err?.response?.data?.message || err.message || 'Failed to update connection request.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const { data: loyalty = { available_points: 0, lifetime_earned: 0, total_redeemed: 0 }, isLoading: loadingLoyalty } = useQuery({
        queryKey: ['loyalty-stats'],
        queryFn: async () => {
            try {
                const res = await financePlusService.getLoyaltyStats();
                return res || { available_points: 0, lifetime_earned: 0, total_redeemed: 0 };
            } catch (e) {
                return { available_points: 0, lifetime_earned: 0, total_redeemed: 0 };
            }
        }
    });

    const { data: fullInvoiceData } = useQuery({
        queryKey: ['full-invoice', viewingInvoiceId],
        queryFn: () => financePlusService.getInvoiceDetails(viewingInvoiceId),
        enabled: !!viewingInvoiceId,
        retry: false
    });

    // Map connected shops
    const connectedShops = useMemo(() => {
        const shops = [];
        const seen = new Set();

        integrations.forEach(item => {
            if (!item) return;
            const status = String(item.status || '').toUpperCase();
            if (status === 'CONNECTED' || status === 'ACCEPTED') {
                const name = item.business_name || item.name || item.merchant_name;
                const id = item.business_id || item.id;
                const key = `${id}-${name}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    shops.push({
                        ...item,
                        business_name: name,
                        business_id: id,
                        customer_name: item.customer_name || user?.name || user?.username || 'Customer'
                    });
                }
            }
        });

        // Also add shops from rawMerchants if not already added
        if (Array.isArray(rawMerchants)) {
            rawMerchants.forEach(m => {
                if (!m) return;
                const name = m.business_name || m.name;
                const id = m.business_id || m.id;
                const key = `${id}-${name}`;
                if (name && !seen.has(key)) {
                    seen.add(key);
                    shops.push({
                        id,
                        business_id: id,
                        business_name: name,
                        customer_name: user?.name || user?.username || 'Customer'
                    });
                }
            });
        }

        return shops;
    }, [integrations, rawMerchants, user]);

    // Active purchases filtered by shop
    const selectedShopPurchases = useMemo(() => {
        if (!Array.isArray(purchases) || purchases.length === 0) return [];
        if (!selectedShop) return purchases;

        const shopBusId = selectedShop.business_id;
        const shopName = String(selectedShop.business_name || '').toLowerCase().trim();

        return purchases.filter(p => {
            if (!p) return false;
            const pBusId = p.merchant_business_id;
            const pMerchantName = String(p.merchant_name || '').toLowerCase().trim();

            if (shopBusId && pBusId) {
                return String(pBusId) === String(shopBusId);
            }
            return shopName && pMerchantName === shopName;
        }).sort((a, b) => new Date(b.timestamp || b.created_at || b.invoice_date) - new Date(a.timestamp || a.created_at || a.invoice_date));
    }, [purchases, selectedShop]);

    // Warranty products
    const selectedShopWarrantyProducts = useMemo(() => {
        if (!selectedShopPurchases || !Array.isArray(selectedShopPurchases)) return [];
        const list = [];
        selectedShopPurchases.forEach((inv, invIdx) => {
            if (!inv) return;
            const parsed = parseInvoiceItems(inv);
            const itemsList = parsed.length > 0 ? parsed : MOCK_INVOICE_ITEMS;
            itemsList.forEach((it, itIdx) => {
                if (hasProductWarranty(it)) {
                    list.push({
                        id: `${inv.id || inv.invoice_number || invIdx}-${itIdx}`,
                        invoice_number: inv.invoice_number || inv.id || `POS-${invIdx}`,
                        timestamp: inv.timestamp || inv.created_at || inv.invoice_date,
                        product_name: it.product_name || it.name || 'Warranty Product',
                        sku: it.sku || it.sku_hsn || 'N/A',
                        quantity: it.quantity || it.qty || 1,
                        unit: it.unit || 'Pcs',
                        price: it.price || it.unit_price || 0,
                        amount: it.amount || it.item_total || ((it.quantity || it.qty || 1) * (it.price || it.unit_price || 0)),
                        warranty_period: getProductWarrantyPeriod(it),
                        merchant_name: inv.merchant_name || selectedShop?.business_name || 'Store',
                        payment_status: inv.payment_status || 'Paid',
                        invoice_id: inv.id || inv.invoice_number
                    });
                }
            });
        });
        return list;
    }, [selectedShopPurchases, selectedShop]);

    const filteredWarrantyProducts = useMemo(() => {
        if (!warrantySearchQuery.trim()) return selectedShopWarrantyProducts;
        const q = warrantySearchQuery.toLowerCase().trim();
        const cleanQ = q.replace(/^pos-?/i, '');
        const matches = [];
        const nonMatches = [];

        selectedShopWarrantyProducts.forEach(item => {
            const prodName = String(item.product_name || '').toLowerCase();
            const invNum = String(item.invoice_number || '').toLowerCase();
            const cleanInvNum = invNum.replace(/^pos-?/i, '');

            const matchesInv = invNum === q || (cleanQ && cleanInvNum === cleanQ) || invNum.includes(q);
            const matchesProd = prodName.includes(q);

            if (matchesInv || matchesProd) {
                matches.push(item);
            } else {
                nonMatches.push(item);
            }
        });

        return [...matches, ...nonMatches];
    }, [selectedShopWarrantyProducts, warrantySearchQuery]);

    const displayedPurchases = useMemo(() => {
        if (!selectedShopPurchases || !Array.isArray(selectedShopPurchases)) return [];
        if (!warrantySearchQuery || !warrantySearchQuery.trim()) return selectedShopPurchases;

        const rawQuery = warrantySearchQuery.trim().toLowerCase();
        const cleanQuery = rawQuery.replace(/^pos-?/i, '');

        const matches = [];
        const nonMatches = [];

        selectedShopPurchases.forEach(inv => {
            const invNum = String(inv?.invoice_number || inv?.id || '').toLowerCase().trim();
            const cleanInvNum = invNum.replace(/^pos-?/i, '');

            const isExactMatch = invNum === rawQuery || (cleanQuery && cleanInvNum === cleanQuery);
            const isPartialMatch = invNum.includes(rawQuery) || (cleanQuery && cleanInvNum.includes(cleanQuery));

            if (isExactMatch) {
                matches.unshift(inv);
            } else if (isPartialMatch) {
                matches.push(inv);
            } else {
                nonMatches.push(inv);
            }
        });

        return [...matches, ...nonMatches];
    }, [selectedShopPurchases, warrantySearchQuery]);

    const handleSync = async () => {
        setSyncError('');
        setIsSyncing(true);
        try {
            await Promise.all([
                'customer-purchases', 'loyalty-stats', 'active-integrations',
                'customer-merchants-loyalty', 'customer-loyalty-wallet',
            ].map(key => queryClient.invalidateQueries({ queryKey: [key] }, { throwOnError: true })));
        } catch (error) {
            setSyncError(error?.message || 'Unable to sync purchases.');
        } finally {
            setIsSyncing(false);
        }
    };

    const toggleInvoiceItemsInline = (invId) => {
        setExpandedInvoiceIds(prev => 
            prev.includes(invId) ? prev.filter(id => id !== invId) : [...prev, invId]
        );
    };

    const getStatusStyle = (status) => {
        const st = String(status || '').toUpperCase();
        if (st === 'PAID' || st === 'COMPLETED' || st === 'CONFIRMED' || st === 'CONNECTED') return { background: '#ECFDF5', color: '#059669' };
        if (st === 'PENDING' || st === 'UNPAID' || st.includes('PENDING')) return { background: '#FFF7ED', color: '#D97706' };
        if (st === 'REJECTED' || st === 'CANCELLED') return { background: '#FEF2F2', color: '#DC2626' };
        return { background: '#F8FAFC', color: '#64748B' };
    };

    // Dynamic loyalty conversion ratios controlled from Cliks Business settings
    const activeMerchant = useMemo(() => {
        if (!Array.isArray(rawMerchants) || rawMerchants.length === 0) return null;
        if (selectedShop) {
            const found = rawMerchants.find(m => 
                (selectedShop.business_id && (m.business_id === selectedShop.business_id || m.merchant_business_id === selectedShop.business_id)) ||
                (selectedShop.business_name && String(m.business_name || '').toLowerCase() === String(selectedShop.business_name || '').toLowerCase())
            );
            if (found) return found;
        }
        return rawMerchants[0];
    }, [rawMerchants, selectedShop]);

    const rsPer1Point = activeMerchant?.rs_per_point || 100;
    const pointsToMoneyRatio = Number(activeMerchant?.point_value_currency !== undefined ? activeMerchant.point_value_currency : 1.0);
    const currentPoints = walletData?.total_points || walletData?.points_balance || loyalty?.available_points || 0;

    const currentMoneyValue = useMemo(() => {
        if (Array.isArray(rawMerchants) && rawMerchants.length > 0) {
            const total = rawMerchants.reduce((sum, m) => {
                const pts = Number(m.net_points || m.available_points || m.points_balance || 0);
                const rate = Number(m.point_value_currency !== undefined ? m.point_value_currency : pointsToMoneyRatio);
                return sum + (pts * rate);
            }, 0);
            if (total > 0) return total.toFixed(2);
        }
        return (currentPoints * pointsToMoneyRatio).toFixed(2);
    }, [rawMerchants, currentPoints, pointsToMoneyRatio]);

    // Active modal invoice
    const activeModalInvoice = useMemo(() => {
        if (!viewingInvoiceId) return null;
        if (fullInvoiceData && (fullInvoiceData.id || fullInvoiceData.invoice_number)) return fullInvoiceData;
        const found = (Array.isArray(purchases) ? purchases : []).find(p => p && (p.id === viewingInvoiceId || p.invoice_id === viewingInvoiceId || p.invoice_number === viewingInvoiceId));
        return found || null;
    }, [viewingInvoiceId, fullInvoiceData, purchases]);

    return (
        <div className="content-wrapper">
            {/* Page Header */}
            <div style={{ padding: '1.812rem 0 0.906rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.906rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.586rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Purchases & Loyalty Points</h1>
                    <p style={{ color: '#64748B', marginTop: '0.363rem', fontSize: '0.861rem' }}>
                        Track your cross-store purchase bills, store-wise loyalty balances, and warranty products in one place.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.906rem' }}>
                    <button
                        data-tour="purchases-sync-data"
                        onClick={handleSync}
                        disabled={loadingPurchases || isSyncing}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.544rem 1.087rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', fontWeight: '700', color: 'var(--accent-ink)', cursor: 'pointer', opacity: loadingPurchases || isSyncing ? 0.6 : 1 }}
                    >
                        <RefreshCcw size={18} className={loadingPurchases || isSyncing ? 'animate-spin' : ''} /> {loadingPurchases || isSyncing ? 'Syncing...' : 'Sync Data'}
                    </button>
                    <button
                        data-tour="purchases-link-store"
                        onClick={() => setIsShopModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.544rem 1.087rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(27,107,58,0.2)' }}
                    >
                        <ExternalLink size={16} /> Link Store
                    </button>
                </div>
            </div>
            {syncError && <p role="alert" style={{ color: '#DC2626', marginBottom: '0.906rem' }}>{syncError}</p>}

            {/* Active Integrations & Loyalty Points on TOP for UI Context */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.359rem', marginBottom: '1.586rem' }}>
                
                {/* 1. Active Integrations Top Card */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.359rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                        <h3 data-tour="purchases-stores-heading" style={{ fontSize: '0.906rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                            <Building2 size={18} color="var(--accent-ink)" /> Active Store Integrations
                        </h3>
                        <span style={{ fontSize: '0.652rem', fontWeight: '800', background: '#ECFDF5', color: '#059669', padding: '0.181rem 0.544rem', borderRadius: '12px' }}>
                            {connectedShops.length} Active Stores
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.77rem' }}>
                        {loadingIntegrations ? (
                            <div style={{ padding: '0.906rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.77rem' }}>
                                Loading connection requests...
                            </div>
                        ) : (!Array.isArray(integrations) || integrations.length === 0) ? (
                            <div style={{ padding: '0.906rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.77rem', border: '1px dashed #E2E8F0', borderRadius: '12px' }}>
                                No active store connection requests yet.
                            </div>
                        ) : (
                            integrations.slice(0, 3).map((item) => {
                                if (!item) return null;
                                const isPending = item.status === 'PENDING' || item.status === 'pending';
                                const isConnected = item.status === 'CONNECTED' || item.status === 'accepted';
                                const isRejected = item.status === 'UNCONNECTED' || item.status === 'rejected';

                                let statusColor = '#64748B';
                                let statusBg = '#F1F5F9';
                                if (isConnected) { statusColor = '#059669'; statusBg = '#ECFDF5'; }
                                else if (isPending) { statusColor = '#D97706'; statusBg = '#FFFBEB'; }
                                else if (isRejected) { statusColor = '#DC2626'; statusBg = '#FEF2F2'; }

                                return (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.68rem 0.906rem', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #F1F5F9' }}>
                                        <div>
                                            <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '0.797rem' }}>{item.business_name || item.name}</div>
                                            <div style={{ fontSize: '0.671rem', color: '#64748B' }}>Requested by merchant</div>
                                        </div>

                                        <div>
                                            {isPending ? (
                                                <div style={{ display: 'flex', gap: '0.453rem' }}>
                                                    <button
                                                        onClick={() => handleRespondConnection(item.id, 'accept')}
                                                        disabled={actionLoadingId === item.id}
                                                        style={{ padding: '0.363rem 0.725rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.68rem', cursor: 'pointer' }}
                                                    >
                                                        {actionLoadingId === item.id ? '...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRespondConnection(item.id, 'reject')}
                                                        disabled={actionLoadingId === item.id}
                                                        style={{ padding: '0.363rem 0.725rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.68rem', cursor: 'pointer' }}
                                                    >
                                                        {actionLoadingId === item.id ? '...' : 'Reject'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.634rem', fontWeight: 850, padding: '0.181rem 0.544rem', borderRadius: '6px', background: statusBg, color: statusColor }}>
                                                    {isConnected ? 'CONNECTED' : isRejected ? 'REJECTED' : item.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. Loyalty & Rewards Overview Top Card */}
                <div data-tour="purchases-loyalty-points" style={{ background: '#fff', borderRadius: '16px', padding: '1.359rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                            <h3 data-tour="purchases-loyalty-heading" style={{ fontSize: '0.906rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                                <Star size={18} color="var(--accent-ink)" /> Overall Loyalty Points Wallet
                            </h3>
                            <button 
                                onClick={() => setShowPointsModal(true)}
                                style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.68rem', fontWeight: '800', padding: '0.227rem 0.589rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Calculator size={14} /> Points Rules
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.906rem 1.133rem', background: '#F0FDF4', borderRadius: '16px', border: '1px solid #BBF7D0', marginBottom: '0.77rem' }}>
                            <div>
                                <div style={{ fontSize: '0.652rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>TOTAL AVAILABLE POINTS</div>
                                <div style={{ fontSize: '1.586rem', fontWeight: 900, color: 'var(--accent-ink)', margin: '2px 0' }}>
                                    {Number(currentPoints).toLocaleString()} <span style={{ fontSize: '0.816rem', fontWeight: 800 }}>pts</span>
                                </div>
                                <div style={{ fontSize: '0.707rem', color: '#15803D', fontWeight: '700' }}>
                                    ≈ ₹{Number(currentMoneyValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cashback Value
                                </div>
                            </div>
                            <div style={{ width: 48, height: 48, borderRadius: '14px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wallet size={26} />
                            </div>
                        </div>
                    </div>

                    {/* Points-to-Money Ratio Explanation Banner */}
                    <div style={{ background: '#F8FAFC', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.707rem', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                            <span style={{ fontWeight: '800', color: '#334155' }}>Points Ratio: </span>
                            <span style={{ color: '#059669', fontWeight: '800' }}>₹{rsPer1Point} Spent = 1 Pt</span>
                            <span style={{ color: '#64748B', margin: '0 4px' }}>|</span>
                            <span style={{ color: '#7C3AED', fontWeight: '800' }}>1 Pt = ₹{pointsToMoneyRatio.toFixed(2)} Value</span>
                            {activeMerchant?.enable_tiers && activeMerchant?.current_tier && (
                                <>
                                    <span style={{ color: '#64748B', margin: '0 4px' }}>|</span>
                                    <span style={{ color: activeMerchant.current_tier.color || '#D97706', fontWeight: '850', background: activeMerchant.current_tier.badge_bg || '#FEF3C7', padding: '1px 6px', borderRadius: '4px' }}>
                                        VIP: {activeMerchant.current_tier.name} ({activeMerchant.current_tier.multiplier}x)
                                    </span>
                                </>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowPointsModal(true)} 
                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '800', fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                        >
                            Calculator <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4 Navigation Sub-Tabs */}
            <div style={{ display: 'flex', gap: '0.544rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.544rem', marginBottom: '1.359rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'shop-points', label: '🏪 Store Points & Balances', count: rawMerchants.length },
                    { id: 'point-history', label: '📜 Point History Ledger', count: (walletData.transactions || []).length },
                    { id: 'purchases', label: '🧾 Purchase Invoices', count: purchases.length },
                    { id: 'warranty', label: '🛡️ Warranty Products', count: selectedShopWarrantyProducts.length }
                ].map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            data-tour={`purchases-tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.544rem 0.997rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: isActive ? 'var(--primary)' : '#F1F5F9',
                                color: isActive ? '#FFFFFF' : '#475569',
                                fontWeight: '800',
                                fontSize: '0.77rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s',
                                boxShadow: isActive ? '0 2px 6px rgba(27,107,58,0.25)' : 'none'
                            }}
                        >
                            <span>{tab.label}</span>
                            {tab.count !== undefined && tab.count > 0 && (
                                <span style={{
                                    fontSize: '0.652rem',
                                    fontWeight: '850',
                                    padding: '1px 6px',
                                    borderRadius: '10px',
                                    background: isActive ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                                    color: isActive ? '#FFFFFF' : '#1E293B'
                                }}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT 1: STORE POINTS & BALANCES */}
            {activeTab === 'shop-points' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.359rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 data-tour="purchases-store-points-heading" style={{ fontSize: '1.042rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                                <Store size={20} color="var(--accent-ink)" /> Points Earned Across Stores
                            </h3>
                            <p style={{ fontSize: '0.743rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                View how many loyalty points you have collected in each CLIKS Business store and their redeemable value.
                            </p>
                        </div>
                    </div>

                    {loadingMerchants ? (
                        <div style={{ padding: '2.719rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                            <RefreshCcw size={28} className="animate-spin" style={{ color: 'var(--accent-ink)', marginBottom: '0.453rem' }} />
                            <div style={{ color: '#64748B', fontWeight: 600 }}>Loading store balances...</div>
                        </div>
                    ) : rawMerchants.length === 0 ? (
                        <div style={{ padding: '3.172rem 0.906rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px dashed #CBD5E1' }}>
                            <Store size={48} style={{ color: '#94A3B8', marginBottom: '0.906rem' }} />
                            <h4 style={{ fontSize: '0.997rem', fontWeight: 800, color: '#334155', margin: 0 }}>No Store Loyalty Points Found</h4>
                            <p style={{ fontSize: '0.77rem', color: '#64748B', marginTop: '0.453rem', maxWidth: '420px', margin: '0.453rem auto 1.359rem auto' }}>
                                Whenever you purchase items from any store using CLIKS Business for billing, your loyalty points for that shop will appear here automatically.
                            </p>
                            <button
                                onClick={() => setIsShopModalOpen(true)}
                                style={{ padding: '0.544rem 1.133rem', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                            >
                                Link A Store
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.133rem' }}>
                            {rawMerchants.map((merchant, mIdx) => {
                                const pts = merchant.net_points !== undefined ? merchant.net_points : (merchant.available_points || merchant.points_balance || 0);
                                const mRate = Number(merchant.point_value_currency !== undefined ? merchant.point_value_currency : pointsToMoneyRatio);
                                const val = merchant.cashback_value || (pts * mRate).toFixed(2);
                                const totalSpent = merchant.total_spend || merchant.total_spent || 0;
                                const ordersCount = merchant.total_orders || merchant.orders_count || merchant.invoices_count || 0;

                                return (
                                    <div key={merchant.id || merchant.business_id || mIdx} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '1.223rem', display: 'flex', flexDirection: 'column', gap: '0.906rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.589rem' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F0FDF4', color: 'var(--accent-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.997rem' }}>
                                                    {(merchant.business_name || 'Store').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '0.952rem', fontWeight: 850, color: '#0F172A' }}>
                                                        {merchant.business_name || 'Store'}
                                                    </h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                        <span style={{ fontSize: '0.634rem', color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                                                            Connected Store
                                                        </span>
                                                        {merchant.enable_tiers && merchant.current_tier && (
                                                            <span style={{ fontSize: '0.616rem', color: merchant.current_tier.color || '#D97706', background: merchant.current_tier.badge_bg || '#FEF3C7', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>
                                                                {merchant.current_tier.name} ({merchant.current_tier.multiplier}x)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.616rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Available In Store</span>
                                                <div style={{ fontSize: '1.223rem', fontWeight: 900, color: 'var(--accent-ink)' }}>
                                                    {Number(pts).toLocaleString()} <span style={{ fontSize: '0.725rem' }}>pts</span>
                                                </div>
                                                <span style={{ fontSize: '0.652rem', color: '#166534', fontWeight: 700 }}>
                                                    ≈ ₹{Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.453rem', background: '#F8FAFC', padding: '0.68rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                            <div>
                                                <span style={{ fontSize: '0.562rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Earned</span>
                                                <span style={{ fontSize: '0.743rem', fontWeight: 850, color: '#059669' }}>+{merchant.points_earned || pts} pts</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.562rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Redeemed</span>
                                                <span style={{ fontSize: '0.743rem', fontWeight: 850, color: '#D97706' }}>-{merchant.points_redeemed || 0} pts</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.562rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Total Spend</span>
                                                <span style={{ fontSize: '0.743rem', fontWeight: 850, color: '#0F172A' }}>₹{Number(totalSpent).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.544rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const matchingConn = connectedShops.find(c => c && (c.business_id === merchant.business_id || String(c.business_name || '').toLowerCase() === String(merchant.business_name || '').toLowerCase()));
                                                    setSelectedShop(matchingConn || {
                                                        business_id: merchant.business_id,
                                                        business_name: merchant.business_name,
                                                        customer_name: user?.username || 'Customer',
                                                        customer_email: user?.email || ''
                                                    });
                                                    setActiveTab('purchases');
                                                }}
                                                style={{ flex: 1, padding: '0.544rem 0.725rem', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontWeight: 800, fontSize: '0.707rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                            >
                                                <Receipt size={14} /> View Store Bills ({ordersCount})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('point-history')}
                                                style={{ padding: '0.544rem 0.725rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569', fontWeight: 800, fontSize: '0.707rem', cursor: 'pointer' }}
                                            >
                                                History
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT 2: POINT HISTORY LEDGER */}
            {activeTab === 'point-history' && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.586rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem', flexWrap: 'wrap', gap: '0.453rem' }}>
                        <div>
                            <h3 data-tour="purchases-history-heading" style={{ fontSize: '1.042rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                                <History size={20} color="var(--accent-ink)" /> Loyalty Points Ledger
                            </h3>
                            <p style={{ fontSize: '0.743rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                Chronological audit trail of points earned from purchases and points redeemed across all stores.
                            </p>
                        </div>
                    </div>

                    {loadingWallet ? (
                        <div style={{ padding: '2.719rem', textAlign: 'center' }}>
                            <RefreshCcw size={28} className="animate-spin" style={{ color: 'var(--accent-ink)', marginBottom: '0.453rem' }} />
                            <div style={{ color: '#64748B', fontWeight: 600 }}>Loading point transactions...</div>
                        </div>
                    ) : (!walletData.transactions || walletData.transactions.length === 0) ? (
                        <div style={{ padding: '2.719rem 0.906rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                            <History size={40} style={{ color: '#94A3B8', marginBottom: '0.68rem' }} />
                            <h4 style={{ fontSize: '0.906rem', fontWeight: 800, color: '#475569', margin: 0 }}>No Point Transactions Yet</h4>
                            <p style={{ fontSize: '0.743rem', color: '#94A3B8', marginTop: '0.317rem' }}>
                                Points earned on each checkout will be credited and logged here with the invoice reference.
                            </p>
                        </div>
                    ) : (
                        <div className="cliks-table-scroll">
                            <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.652rem' }}>
                                        <th style={{ padding: '0.56rem 0.78rem', textAlign: 'left', whiteSpace: 'nowrap' }}>Date</th>
                                        <th style={{ padding: '0.56rem 0.78rem', textAlign: 'left', whiteSpace: 'nowrap' }}>Store</th>
                                        <th style={{ padding: '0.56rem 0.78rem', textAlign: 'left', whiteSpace: 'nowrap' }}>Activity / Description</th>
                                        <th style={{ padding: '0.56rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Points</th>
                                        <th style={{ padding: '0.56rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Invoice Ref</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {walletData.transactions.map((tx, tIdx) => {
                                        const isCredit = tx.type === 'CREDIT' || (tx.points && tx.points > 0);
                                        const pts = Math.abs(tx.points || 0);

                                        return (
                                            <tr key={tx.id || tIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', color: '#64748B', fontWeight: 600, fontSize: '0.725rem', whiteSpace: 'nowrap' }}>
                                                    {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                                                </td>
                                                <td style={{ padding: '0.589rem 0.78rem', fontWeight: 800, color: '#0F172A', maxWidth: '170px' }} title={tx.merchant_name || 'Store'}>
                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant_name || 'Store'}</div>
                                                </td>
                                                <td style={{ padding: '0.589rem 0.78rem', color: '#475569', fontWeight: 600, maxWidth: '240px' }} title={tx.description || (isCredit ? 'Purchase Points Earned' : 'Points Redeemed')}>
                                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description || (isCredit ? 'Purchase Points Earned' : 'Points Redeemed')}</div>
                                                </td>
                                                <td className="cell-nowrap" style={{ padding: '0.589rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    <span className="badge-nowrap" style={{
                                                        gap: '3px',
                                                        fontWeight: 900,
                                                        fontSize: '0.77rem',
                                                        color: isCredit ? '#059669' : '#D97706',
                                                        background: isCredit ? '#ECFDF5' : '#FFFBEB',
                                                        padding: '3px 8px',
                                                        borderRadius: '8px'
                                                    }}>
                                                        {isCredit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                        {isCredit ? `+${pts}` : `-${pts}`} pts
                                                    </span>
                                                </td>
                                                <td className="cell-actions" style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                    {tx.invoice_id || tx.invoice_number ? (
                                                        <button
                                                            onClick={() => setViewingInvoiceId(tx.invoice_id || tx.invoice_number)}
                                                            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.68rem', fontWeight: 800, padding: '0.227rem 0.589rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}
                                                        >
                                                            {tx.invoice_number || `POS-${tx.invoice_id}`} <ChevronRight size={12} />
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.68rem' }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT 3: PURCHASE INVOICES */}
            {activeTab === 'purchases' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.359rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.812rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem', paddingBottom: '0.906rem', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '0.906rem' }}>
                            <div>
                                {selectedShop ? (
                                    <>
                                        <button
                                            onClick={() => setSelectedShop(null)}
                                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '700', fontSize: '0.77rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.317rem', marginBottom: '0.363rem' }}
                                        >
                                            ← View All Stores
                                        </button>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                                            <h3 style={{ fontSize: '1.178rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>{selectedShop.business_name}</h3>
                                            <span style={{ fontSize: '0.634rem', fontWeight: '850', color: '#10B981', background: '#ECFDF5', padding: '0.181rem 0.544rem', borderRadius: '6px', textTransform: 'uppercase' }}>FILTERED</span>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <h3 data-tour="purchases-invoices-heading" style={{ fontSize: '1.133rem', fontWeight: '850', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                                            <Receipt size={20} color="var(--accent-ink)" /> All Store Invoices ({purchases.length})
                                        </h3>
                                        <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '4px 0 0 0' }}>Showing all digital bills received across all connected shops</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Search size={16} style={{ position: 'absolute', left: '0.68rem', color: '#94A3B8', pointerEvents: 'none' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search invoice #..." 
                                        value={warrantySearchQuery} 
                                        onChange={(e) => setWarrantySearchQuery(e.target.value)} 
                                        style={{ padding: '0.453rem 0.77rem 0.453rem 1.994rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.725rem', fontWeight: '600', color: '#1E293B', outline: 'none', width: '200px' }} 
                                    />
                                    {warrantySearchQuery && (
                                        <button 
                                            onClick={() => setWarrantySearchQuery('')} 
                                            style={{ position: 'absolute', right: '0.453rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsShopModalOpen(true)}
                                    style={{ padding: '0.453rem 0.906rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.725rem', fontWeight: '700', color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    {selectedShop ? 'Switch Shop' : 'Filter by Shop'}
                                </button>
                            </div>
                        </div>

                        {displayedPurchases.length === 0 ? (
                            <div style={{ padding: '2.719rem 0.906rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                                <Receipt size={40} style={{ color: '#CBD5E1', marginBottom: '0.906rem' }} />
                                <h4 style={{ fontSize: '0.906rem', fontWeight: '700', color: '#64748B', margin: 0 }}>
                                    {warrantySearchQuery ? `No matching invoices found for "${warrantySearchQuery}"` : 'No purchases found'}
                                </h4>
                                <p style={{ fontSize: '0.77rem', color: '#94A3B8', marginTop: '0.453rem' }}>
                                    New purchase bills from CLIKS Business merchants will automatically appear here.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                                {displayedPurchases.map((inv, iIdx) => {
                                    const invId = inv?.id || inv?.invoice_number || `POS-${iIdx}`;
                                    const isInlineExpanded = expandedInvoiceIds.includes(invId);

                                    return (
                                        <div key={invId} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.133rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.906rem' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Receipt size={18} style={{ color: 'var(--accent-ink)' }} />
                                                        <span style={{ fontSize: '0.906rem', fontWeight: 850, color: '#1E293B' }}>{inv?.invoice_number || `POS-${iIdx}`}</span>
                                                        <span style={{ fontSize: '0.652rem', fontWeight: 800, color: '#475569', background: '#F1F5F9', padding: '0.136rem 0.453rem', borderRadius: '6px' }}>
                                                            {inv?.merchant_name || selectedShop?.business_name || 'Store'}
                                                        </span>
                                                        {invoiceHasWarranty(inv) && (
                                                            <span style={{ fontSize: '0.589rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.136rem 0.453rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                🛡️ Warranty Product
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                                                        {formatInvoiceDate(inv)}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.042rem', fontWeight: 900, color: 'var(--accent-ink)' }}>₹{(inv?.grand_total || inv?.total_amount || 0).toLocaleString()}</div>
                                                    <span style={{ fontSize: '0.589rem', fontWeight: 850, textTransform: 'uppercase', padding: '0.181rem 0.453rem', borderRadius: '6px', ...getStatusStyle(inv?.payment_status) }}>{inv?.payment_status || 'Paid'}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.906rem', borderTop: '1px dashed #E2E8F0', paddingTop: '0.906rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.544rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>GST Tax</div>
                                                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569' }}>₹{(inv?.tax_amount || 0).toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.544rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Points Earned</div>
                                                    <div style={{ fontSize: '0.725rem', fontWeight: 850, color: '#7C3AED' }}>+{inv?.points_earned || 0} pts</div>
                                                </div>
                                                <div style={{ textAlign: 'right', display: 'flex', gap: '0.453rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => {
                                                            toggleInvoiceItemsInline(invId);
                                                            setViewingInvoiceId(invId);
                                                        }}
                                                        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.707rem', fontWeight: 800, padding: '0.317rem 0.68rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        View Items {isInlineExpanded ? <ChevronUp size={14} /> : <ChevronRight size={14} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Inline Purchased Items List View */}
                                            {isInlineExpanded && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '0.906rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.906rem' }}>
                                                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', marginBottom: '0.453rem', textTransform: 'uppercase' }}>Purchased Line Items:</div>
                                                    <div className="cliks-table-scroll" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                                                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.725rem' }}>
                                                            <thead>
                                                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.616rem' }}>
                                                                    <th style={{ padding: '0.5rem 0.68rem', textAlign: 'left', whiteSpace: 'nowrap' }}>Item Name</th>
                                                                    <th style={{ padding: '0.5rem 0.68rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Qty</th>
                                                                    <th style={{ padding: '0.5rem 0.68rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Unit Price</th>
                                                                    <th style={{ padding: '0.5rem 0.68rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {parseInvoiceItems(inv).map((it, idx) => (
                                                                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                                        <td style={{ padding: '0.5rem 0.68rem', fontWeight: 700, color: '#1E293B' }} title={it.product_name || it.name}>
                                                                            {it.product_name || it.name}
                                                                            {hasProductWarranty(it) && (
                                                                                <span className="badge-nowrap" style={{ fontSize: '0.616rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.136rem 0.453rem', borderRadius: '6px', marginLeft: '0.453rem', gap: '3px' }}>
                                                                                    🛡️ Warranty ({getProductWarrantyPeriod(it)})
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td className="cell-nowrap" style={{ padding: '0.5rem 0.68rem', textAlign: 'center', fontWeight: 800, color: 'var(--accent-ink)', whiteSpace: 'nowrap' }}>{it.quantity || 1} {it.unit || 'Pcs'}</td>
                                                                        <td className="cell-num" style={{ padding: '0.5rem 0.68rem', textAlign: 'right', color: '#475569', whiteSpace: 'nowrap' }}>₹{(it.price || 0).toLocaleString()}</td>
                                                                        <td className="cell-num" style={{ padding: '0.5rem 0.68rem', textAlign: 'right', fontWeight: 850, color: '#1E293B', whiteSpace: 'nowrap' }}>₹{(it.amount || ((it.quantity || 1) * (it.price || 0))).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT 4: WARRANTY PRODUCTS */}
            {activeTab === 'warranty' && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.812rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem', flexWrap: 'wrap', gap: '0.906rem' }}>
                        <div>
                            <h3 data-tour="purchases-warranty-heading" style={{ fontSize: '1.133rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem', width: 'fit-content' }}>
                                <Shield size={20} color="var(--accent-ink)" /> Customer Warranty Tracking ({filteredWarrantyProducts.length})
                            </h3>
                            <p style={{ fontSize: '0.743rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                Products with warranty coverage automatically tracked from your purchase invoices.
                            </p>
                        </div>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.68rem', color: '#94A3B8', pointerEvents: 'none' }} />
                            <input 
                                type="text" 
                                placeholder="Search warranty products..." 
                                value={warrantySearchQuery} 
                                onChange={(e) => setWarrantySearchQuery(e.target.value)} 
                                style={{ padding: '0.453rem 0.77rem 0.453rem 1.994rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.725rem', fontWeight: '600', color: '#1E293B', outline: 'none', width: '220px' }} 
                            />
                            {warrantySearchQuery && (
                                <button 
                                    onClick={() => setWarrantySearchQuery('')} 
                                    style={{ position: 'absolute', right: '0.453rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredWarrantyProducts.length === 0 ? (
                        <div style={{ padding: '2.719rem 0.906rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                            <Shield size={40} style={{ color: '#CBD5E1', marginBottom: '0.906rem' }} />
                            <h4 style={{ fontSize: '0.906rem', fontWeight: '700', color: '#64748B', margin: 0 }}>
                                {warrantySearchQuery ? `No matching warranty products for "${warrantySearchQuery}"` : 'No Warranty Products Found'}
                            </h4>
                            <p style={{ fontSize: '0.77rem', color: '#94A3B8', marginTop: '0.453rem' }}>
                                When you buy warranty-covered devices (phones, electronics, appliances) from connected stores, they appear here.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                            {filteredWarrantyProducts.map((wItem) => (
                                <div key={wItem.id} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.133rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Package size={18} style={{ color: 'var(--accent-ink)' }} />
                                                <span style={{ fontSize: '0.952rem', fontWeight: 850, color: '#1E293B' }}>{wItem.product_name}</span>
                                                <span style={{ fontSize: '0.616rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.136rem 0.544rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                    🛡️ Warranty: {wItem.warranty_period}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                                                Store: <strong>{wItem.merchant_name}</strong> • SKU: {wItem.sku} • Purchased On: <strong>{formatInvoiceDate(wItem)}</strong> • Ref: <strong>{wItem.invoice_number}</strong>
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.042rem', fontWeight: 900, color: 'var(--accent-ink)' }}>₹{wItem.amount.toLocaleString()}</div>
                                            <button
                                                onClick={() => setViewingInvoiceId(wItem.invoice_id)}
                                                style={{ marginTop: '4px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.68rem', fontWeight: 800, padding: '0.227rem 0.589rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                View Order Details <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* FULL INVOICE VIEW MODAL */}
            <AnimatePresence>
                {viewingInvoiceId && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.906rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingInvoiceId(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '750px', maxHeight: '90vh', background: '#fff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.133rem 1.586rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.087rem', fontWeight: 850, color: '#1E293B', margin: 0 }}>
                                        Invoice #{activeModalInvoice?.invoice_number || viewingInvoiceId}
                                    </h3>
                                    <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '3px 0 0 0' }}>
                                        Store: <strong>{activeModalInvoice?.merchant_name || 'Store'}</strong> • Date: {formatInvoiceDate(activeModalInvoice)}
                                    </p>
                                </div>
                                <button onClick={() => setViewingInvoiceId(null)} style={{ width: 36, height: 36, borderRadius: '10px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                            </div>

                            <div style={{ padding: '1.359rem 1.586rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                                <div className="cliks-table-scroll" style={{ border: '1px solid #E2E8F0', borderRadius: '14px' }}>
                                    <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
                                        <thead>
                                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.652rem' }}>
                                                <th style={{ padding: '0.56rem 0.78rem', textAlign: 'left', whiteSpace: 'nowrap' }}>Item & SKU</th>
                                                <th style={{ padding: '0.56rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Qty</th>
                                                <th style={{ padding: '0.56rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Price</th>
                                                <th style={{ padding: '0.56rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parseInvoiceItems(activeModalInvoice).map((it, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.56rem 0.78rem', fontWeight: 700, color: '#1E293B' }} title={it.product_name || it.name}>
                                                        {it.product_name || it.name}
                                                        {hasProductWarranty(it) && (
                                                            <div style={{ fontSize: '0.634rem', color: '#15803D', fontWeight: 800, marginTop: '2px' }}>
                                                                🛡️ {getProductWarrantyPeriod(it)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="cell-nowrap" style={{ padding: '0.56rem 0.78rem', textAlign: 'center', fontWeight: 800, whiteSpace: 'nowrap' }}>{it.quantity || 1} {it.unit || 'Pcs'}</td>
                                                    <td className="cell-num" style={{ padding: '0.56rem 0.78rem', textAlign: 'right', color: '#475569', whiteSpace: 'nowrap' }}>₹{(it.price || 0).toLocaleString()}</td>
                                                    <td className="cell-num" style={{ padding: '0.56rem 0.78rem', textAlign: 'right', fontWeight: 850, color: '#1E293B', whiteSpace: 'nowrap' }}>₹{(it.amount || ((it.quantity || 1) * (it.price || 0))).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ background: '#F8FAFC', padding: '1.133rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Payment Status: <strong style={{ color: '#059669' }}>{activeModalInvoice?.payment_status || 'PAID'}</strong></div>
                                        <div style={{ fontSize: '0.68rem', color: '#7C3AED', fontWeight: 800, marginTop: '4px' }}>Points Credited: +{activeModalInvoice?.points_earned || 0} pts</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Grand Total</div>
                                        <div style={{ fontSize: '1.359rem', fontWeight: 900, color: 'var(--accent-ink)' }}>
                                            ₹{(activeModalInvoice?.grand_total || activeModalInvoice?.total_amount || 0).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Points Rules & Calculator Modal */}
            <AnimatePresence>
                {showPointsModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.906rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPointsModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '540px', background: '#fff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.359rem 1.586rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.087rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                                        <Calculator size={20} color="var(--accent-ink)" /> Loyalty Points Rules & Calculator
                                    </h3>
                                    <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '4px 0 0 0' }}>Controlled dynamically by store settings in CLIKS Business</p>
                                </div>
                                <button onClick={() => setShowPointsModal(false)} style={{ width: 34, height: 34, borderRadius: '8px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>

                            <div style={{ padding: '1.586rem', display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.906rem' }}>
                                    <div style={{ background: '#F0FDF4', padding: '0.906rem', borderRadius: '14px', border: '1px solid #BBF7D0' }}>
                                        <div style={{ fontSize: '0.652rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>1. Earning Ratio</div>
                                     <div style={{ fontSize: '1.133rem', fontWeight: 900, color: 'var(--accent-ink)', margin: '4px 0' }}>₹{rsPer1Point} = 1 Pt</div>
                                     <div style={{ fontSize: '0.68rem', color: '#15803D' }}>Dynamic store earning rate configured in CLIKS Business.</div>
                                    </div>
                                    <div style={{ background: '#FAF5FF', padding: '0.906rem', borderRadius: '14px', border: '1px solid #E9D5FF' }}>
                                        <div style={{ fontSize: '0.652rem', fontWeight: 800, color: '#6B21A8', textTransform: 'uppercase' }}>2. Redemption Ratio</div>
                                        <div style={{ fontSize: '1.133rem', fontWeight: 900, color: '#7C3AED', margin: '4px 0' }}>1 Pt = ₹{pointsToMoneyRatio.toFixed(2)}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#7E22CE' }}>Points convert into cash discounts at checkout.</div>
                                    </div>
                                </div>

                                <div style={{ background: '#F8FAFC', padding: '1.133rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                    <label style={{ fontSize: '0.725rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.453rem' }}>
                                        Calculate for a Purchase Amount (₹):
                                    </label>
                                    <input
                                        type="number"
                                        value={calcAmountInput}
                                        onChange={(e) => setCalcAmountInput(e.target.value)}
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontWeight: 700, fontSize: '0.997rem', boxSizing: 'border-box' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.68rem', paddingTop: '0.68rem', borderTop: '1px dashed #CBD5E1' }}>
                                        <span style={{ fontSize: '0.743rem', color: '#64748B', fontWeight: 700 }}>Points Earned:</span>
                                        <span style={{ fontSize: '0.997rem', fontWeight: 900, color: '#059669' }}>
                                            +{Math.floor(((Number(calcAmountInput) || 0) / rsPer1Point) * (activeMerchant?.enable_tiers && activeMerchant?.current_tier?.multiplier ? Number(activeMerchant.current_tier.multiplier) : 1))} pts
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.317rem' }}>
                                        <span style={{ fontSize: '0.743rem', color: '#64748B', fontWeight: 700 }}>Redemption Cash Value:</span>
                                        <span style={{ fontSize: '0.997rem', fontWeight: 900, color: '#7C3AED' }}>
                                            ₹{((Math.floor(((Number(calcAmountInput) || 0) / rsPer1Point) * (activeMerchant?.enable_tiers && activeMerchant?.current_tier?.multiplier ? Number(activeMerchant.current_tier.multiplier) : 1))) * pointsToMoneyRatio).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connected Shops Modal */}
            <AnimatePresence>
                {isShopModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.906rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShopModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '85vh', background: '#fff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.359rem 1.586rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.087rem', fontWeight: 850, color: '#1E293B', margin: 0 }}>Select Connected Store</h3>
                                    <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '4px 0 0 0' }}>Filter invoices and loyalty points for a specific store</p>
                                </div>
                                <button onClick={() => setIsShopModalOpen(false)} style={{ width: 34, height: 34, borderRadius: '8px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>

                            <div style={{ padding: '1.359rem 1.586rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.77rem' }}>
                                <button
                                    onClick={() => {
                                        setSelectedShop(null);
                                        setIsShopModalOpen(false);
                                    }}
                                    style={{
                                        padding: '0.906rem 1.133rem',
                                        borderRadius: '14px',
                                        border: !selectedShop ? '2px solid #1B6B3A' : '1px solid #E2E8F0',
                                        background: !selectedShop ? '#F0FDF4' : '#fff',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.861rem' }}>All Stores (Combined)</div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Show purchase bills and points across all merchants</div>
                                    </div>
                                    <ChevronRight size={18} color="var(--accent-ink)" />
                                </button>

                                {connectedShops.map((shop) => (
                                    <div
                                        key={shop.id || shop.business_name}
                                        onClick={() => {
                                            setSelectedShop(shop);
                                            setIsShopModalOpen(false);
                                            setActiveTab('purchases');
                                        }}
                                        style={{
                                            padding: '0.906rem 1.133rem',
                                            borderRadius: '14px',
                                            border: selectedShop?.business_id === shop.business_id ? '2px solid #1B6B3A' : '1px solid #E2E8F0',
                                            background: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.861rem' }}>{shop.business_name}</div>
                                            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Customer: {shop.customer_name}</div>
                                        </div>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-ink)', fontWeight: 800 }}>Select →</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PurchaseDetails;
