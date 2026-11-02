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
            try {
                const res = await financePlusService.getPurchases();
                if (Array.isArray(res)) return res;
                if (Array.isArray(res?.data)) return res.data;
                if (Array.isArray(res?.purchases)) return res.purchases;
                return [];
            } catch (e) {
                console.error('Failed to load purchases:', e);
                return [];
            }
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

    const handleSync = () => {
        queryClient.invalidateQueries(['customer-purchases']);
        queryClient.invalidateQueries(['loyalty-stats']);
        queryClient.invalidateQueries(['active-integrations']);
        queryClient.invalidateQueries(['customer-merchants-loyalty']);
        queryClient.invalidateQueries(['customer-loyalty-wallet']);
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

    // Calculate money value ratio: 10 Points = ₹1.00 Value (1 Pt = ₹0.10)
    const pointsToMoneyRatio = 0.10;
    const currentPoints = walletData?.total_points || loyalty?.available_points || 0;
    const currentMoneyValue = walletData?.total_value || (currentPoints * pointsToMoneyRatio).toFixed(2);

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
            <div style={{ padding: '2rem 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Purchases & Loyalty Points</h1>
                    <p style={{ color: '#64748B', marginTop: '0.4rem', fontSize: '0.95rem' }}>
                        Track your cross-store purchase bills, store-wise loyalty balances, and warranty products in one place.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={handleSync}
                        disabled={loadingPurchases}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', fontWeight: '700', color: '#1B6B3A', cursor: 'pointer', opacity: loadingPurchases ? 0.6 : 1 }}
                    >
                        <RefreshCcw size={18} className={loadingPurchases ? 'animate-spin' : ''} /> {loadingPurchases ? 'Syncing...' : 'Sync Data'}
                    </button>
                    <button
                        onClick={() => setIsShopModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#1B6B3A', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(27,107,58,0.2)' }}
                    >
                        <ExternalLink size={16} /> Link Store
                    </button>
                </div>
            </div>

            {/* Active Integrations & Loyalty Points on TOP for UI Context */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                
                {/* 1. Active Integrations Top Card */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Building2 size={18} color="#1B6B3A" /> Active Store Integrations
                        </h3>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#ECFDF5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                            {connectedShops.length} Active Stores
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {loadingIntegrations ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                                Loading connection requests...
                            </div>
                        ) : (!Array.isArray(integrations) || integrations.length === 0) ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', border: '1px dashed #E2E8F0', borderRadius: '12px' }}>
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
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #F1F5F9' }}>
                                        <div>
                                            <div style={{ fontWeight: '800', color: '#1E293B', fontSize: '0.88rem' }}>{item.business_name || item.name}</div>
                                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Requested by merchant</div>
                                        </div>

                                        <div>
                                            {isPending ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleRespondConnection(item.id, 'accept')}
                                                        disabled={actionLoadingId === item.id}
                                                        style={{ padding: '0.4rem 0.8rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
                                                    >
                                                        {actionLoadingId === item.id ? '...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRespondConnection(item.id, 'reject')}
                                                        disabled={actionLoadingId === item.id}
                                                        style={{ padding: '0.4rem 0.8rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
                                                    >
                                                        {actionLoadingId === item.id ? '...' : 'Reject'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', fontWeight: 850, padding: '0.2rem 0.6rem', borderRadius: '6px', background: statusBg, color: statusColor }}>
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
                <div style={{ background: '#fff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star size={18} color="#1B6B3A" /> Overall Loyalty Points Wallet
                            </h3>
                            <button 
                                onClick={() => setShowPointsModal(true)}
                                style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: '800', padding: '0.25rem 0.65rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Calculator size={14} /> Points Rules
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: '#F0FDF4', borderRadius: '16px', border: '1px solid #BBF7D0', marginBottom: '0.85rem' }}>
                            <div>
                                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>TOTAL AVAILABLE POINTS</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1B6B3A', margin: '2px 0' }}>
                                    {Number(currentPoints).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>pts</span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: '700' }}>
                                    ≈ ₹{Number(currentMoneyValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cashback Value
                                </div>
                            </div>
                            <div style={{ width: 48, height: 48, borderRadius: '14px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wallet size={26} />
                            </div>
                        </div>
                    </div>

                    {/* Points-to-Money Ratio Explanation Banner */}
                    <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                        <div>
                            <span style={{ fontWeight: '800', color: '#334155' }}>Points Ratio: </span>
                            <span style={{ color: '#059669', fontWeight: '800' }}>₹100 Spent = 1 Pt</span>
                            <span style={{ color: '#64748B', margin: '0 6px' }}>|</span>
                            <span style={{ color: '#7C3AED', fontWeight: '800' }}>10 Pts = ₹1.00 Value</span>
                        </div>
                        <button 
                            onClick={() => setShowPointsModal(true)} 
                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                        >
                            Calculator <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4 Navigation Sub-Tabs */}
            <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.6rem 1.1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: isActive ? '#1B6B3A' : '#F1F5F9',
                                color: isActive ? '#FFFFFF' : '#475569',
                                fontWeight: '800',
                                fontSize: '0.85rem',
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
                                    fontSize: '0.72rem',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Store size={20} color="#1B6B3A" /> Points Earned Across Stores
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                View how many loyalty points you have collected in each CLIKS Business store and their redeemable value.
                            </p>
                        </div>
                    </div>

                    {loadingMerchants ? (
                        <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                            <RefreshCcw size={28} className="animate-spin" style={{ color: '#1B6B3A', marginBottom: '0.5rem' }} />
                            <div style={{ color: '#64748B', fontWeight: 600 }}>Loading store balances...</div>
                        </div>
                    ) : rawMerchants.length === 0 ? (
                        <div style={{ padding: '3.5rem 1rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px dashed #CBD5E1' }}>
                            <Store size={48} style={{ color: '#94A3B8', marginBottom: '1rem' }} />
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', margin: 0 }}>No Store Loyalty Points Found</h4>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.5rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem auto' }}>
                                Whenever you purchase items from any store using CLIKS Business for billing, your loyalty points for that shop will appear here automatically.
                            </p>
                            <button
                                onClick={() => setIsShopModalOpen(true)}
                                style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', background: '#1B6B3A', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                            >
                                Link A Store
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                            {rawMerchants.map((merchant, mIdx) => {
                                const pts = merchant.available_points || merchant.points_balance || 0;
                                const val = merchant.cashback_value || (pts * pointsToMoneyRatio).toFixed(2);
                                const totalSpent = merchant.total_spend || merchant.total_spent || 0;
                                const ordersCount = merchant.total_orders || merchant.orders_count || merchant.invoices_count || 0;

                                return (
                                    <div key={merchant.id || merchant.business_id || mIdx} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F0FDF4', color: '#1B6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                                                    {(merchant.business_name || 'Store').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 850, color: '#0F172A' }}>
                                                        {merchant.business_name || 'Store'}
                                                    </h4>
                                                    <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '6px', fontWeight: 800, textTransform: 'uppercase' }}>
                                                        Connected Store
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Available In Store</span>
                                                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1B6B3A' }}>
                                                    {Number(pts).toLocaleString()} <span style={{ fontSize: '0.8rem' }}>pts</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                                                    ≈ ₹{Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                            <div>
                                                <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Earned</span>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 850, color: '#059669' }}>+{merchant.points_earned || pts} pts</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Redeemed</span>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 850, color: '#D97706' }}>-{merchant.points_redeemed || 0} pts</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Total Spend</span>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 850, color: '#0F172A' }}>₹{Number(totalSpent).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.6rem' }}>
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
                                                style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                            >
                                                <Receipt size={14} /> View Store Bills ({ordersCount})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('point-history')}
                                                style={{ padding: '0.6rem 0.8rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
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
                <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <History size={20} color="#1B6B3A" /> Loyalty Points Ledger
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                Chronological audit trail of points earned from purchases and points redeemed across all stores.
                            </p>
                        </div>
                    </div>

                    {loadingWallet ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <RefreshCcw size={28} className="animate-spin" style={{ color: '#1B6B3A', marginBottom: '0.5rem' }} />
                            <div style={{ color: '#64748B', fontWeight: 600 }}>Loading point transactions...</div>
                        </div>
                    ) : (!walletData.transactions || walletData.transactions.length === 0) ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                            <History size={40} style={{ color: '#94A3B8', marginBottom: '0.75rem' }} />
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#475569', margin: 0 }}>No Point Transactions Yet</h4>
                            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                                Points earned on each checkout will be credited and logged here with the invoice reference.
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.72rem' }}>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Store</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Activity / Description</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Points</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Invoice Ref</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {walletData.transactions.map((tx, tIdx) => {
                                        const isCredit = tx.type === 'CREDIT' || (tx.points && tx.points > 0);
                                        const pts = Math.abs(tx.points || 0);

                                        return (
                                            <tr key={tx.id || tIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontWeight: 600, fontSize: '0.8rem' }}>
                                                    {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F172A' }}>
                                                    {tx.merchant_name || 'Store'}
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 600 }}>
                                                    {tx.description || (isCredit ? 'Purchase Points Earned' : 'Points Redeemed')}
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '3px',
                                                        fontWeight: 900,
                                                        fontSize: '0.88rem',
                                                        color: isCredit ? '#059669' : '#D97706',
                                                        background: isCredit ? '#ECFDF5' : '#FFFBEB',
                                                        padding: '3px 8px',
                                                        borderRadius: '8px'
                                                    }}>
                                                        {isCredit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                        {isCredit ? `+${pts}` : `-${pts}`} pts
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                                    {tx.invoice_id || tx.invoice_number ? (
                                                        <button
                                                            onClick={() => setViewingInvoiceId(tx.invoice_id || tx.invoice_number)}
                                                            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                                        >
                                                            {tx.invoice_number || `POS-${tx.invoice_id}`} <ChevronRight size={12} />
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>-</span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                {selectedShop ? (
                                    <>
                                        <button
                                            onClick={() => setSelectedShop(null)}
                                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}
                                        >
                                            ← View All Stores
                                        </button>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <h3 style={{ fontSize: '1.3rem', fontWeight: '850', color: '#1E293B', margin: 0 }}>{selectedShop.business_name}</h3>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '850', color: '#10B981', background: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase' }}>FILTERED</span>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '850', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Receipt size={20} color="#1B6B3A" /> All Store Invoices ({purchases.length})
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>Showing all digital bills received across all connected shops</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: '#94A3B8', pointerEvents: 'none' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search invoice #..." 
                                        value={warrantySearchQuery} 
                                        onChange={(e) => setWarrantySearchQuery(e.target.value)} 
                                        style={{ padding: '0.5rem 0.85rem 0.5rem 2.2rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', color: '#1E293B', outline: 'none', width: '200px' }} 
                                    />
                                    {warrantySearchQuery && (
                                        <button 
                                            onClick={() => setWarrantySearchQuery('')} 
                                            style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsShopModalOpen(true)}
                                    style={{ padding: '0.5rem 1rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    {selectedShop ? 'Switch Shop' : 'Filter by Shop'}
                                </button>
                            </div>
                        </div>

                        {displayedPurchases.length === 0 ? (
                            <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                                <Receipt size={40} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#64748B', margin: 0 }}>
                                    {warrantySearchQuery ? `No matching invoices found for "${warrantySearchQuery}"` : 'No purchases found'}
                                </h4>
                                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.5rem' }}>
                                    New purchase bills from CLIKS Business merchants will automatically appear here.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {displayedPurchases.map((inv, iIdx) => {
                                    const invId = inv?.id || inv?.invoice_number || `POS-${iIdx}`;
                                    const isInlineExpanded = expandedInvoiceIds.includes(invId);

                                    return (
                                        <div key={invId} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Receipt size={18} style={{ color: '#1B6B3A' }} />
                                                        <span style={{ fontSize: '1rem', fontWeight: 850, color: '#1E293B' }}>{inv?.invoice_number || `POS-${iIdx}`}</span>
                                                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', background: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                                                            {inv?.merchant_name || selectedShop?.business_name || 'Store'}
                                                        </span>
                                                        {invoiceHasWarranty(inv) && (
                                                            <span style={{ fontSize: '0.65rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                🛡️ Warranty Product
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                                                        {formatInvoiceDate(inv)}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1B6B3A' }}>₹{(inv?.grand_total || inv?.total_amount || 0).toLocaleString()}</div>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 850, textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '6px', ...getStatusStyle(inv?.payment_status) }}>{inv?.payment_status || 'Paid'}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>GST Tax</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>₹{(inv?.tax_amount || 0).toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Points Earned</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 850, color: '#7C3AED' }}>+{inv?.points_earned || 0} pts</div>
                                                </div>
                                                <div style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => {
                                                            toggleInvoiceItemsInline(invId);
                                                            setViewingInvoiceId(invId);
                                                        }}
                                                        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.78rem', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        View Items {isInlineExpanded ? <ChevronUp size={14} /> : <ChevronRight size={14} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Inline Purchased Items List View */}
                                            {isInlineExpanded && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Purchased Line Items:</div>
                                                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                                            <thead>
                                                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.68rem' }}>
                                                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Item Name</th>
                                                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Qty</th>
                                                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Unit Price</th>
                                                                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {parseInvoiceItems(inv).map((it, idx) => (
                                                                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                                        <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: '#1E293B' }}>
                                                                            {it.product_name || it.name}
                                                                            {hasProductWarranty(it) && (
                                                                                <span style={{ fontSize: '0.68rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.5rem', borderRadius: '6px', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                                    🛡️ Warranty ({getProductWarrantyPeriod(it)})
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 800, color: '#1B6B3A' }}>{it.quantity || 1} {it.unit || 'Pcs'}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#475569' }}>₹{(it.price || 0).toLocaleString()}</td>
                                                                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 850, color: '#1E293B' }}>₹{(it.amount || ((it.quantity || 1) * (it.price || 0))).toLocaleString()}</td>
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
                <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={20} color="#1B6B3A" /> Customer Warranty Tracking ({filteredWarrantyProducts.length})
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                                Products with warranty coverage automatically tracked from your purchase invoices.
                            </p>
                        </div>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: '#94A3B8', pointerEvents: 'none' }} />
                            <input 
                                type="text" 
                                placeholder="Search warranty products..." 
                                value={warrantySearchQuery} 
                                onChange={(e) => setWarrantySearchQuery(e.target.value)} 
                                style={{ padding: '0.5rem 0.85rem 0.5rem 2.2rem', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', color: '#1E293B', outline: 'none', width: '220px' }} 
                            />
                            {warrantySearchQuery && (
                                <button 
                                    onClick={() => setWarrantySearchQuery('')} 
                                    style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredWarrantyProducts.length === 0 ? (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                            <Shield size={40} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#64748B', margin: 0 }}>
                                {warrantySearchQuery ? `No matching warranty products for "${warrantySearchQuery}"` : 'No Warranty Products Found'}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.5rem' }}>
                                When you buy warranty-covered devices (phones, electronics, appliances) from connected stores, they appear here.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredWarrantyProducts.map((wItem) => (
                                <div key={wItem.id} style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Package size={18} style={{ color: '#1B6B3A' }} />
                                                <span style={{ fontSize: '1.05rem', fontWeight: 850, color: '#1E293B' }}>{wItem.product_name}</span>
                                                <span style={{ fontSize: '0.68rem', fontWeight: '850', color: '#15803D', background: '#DCFCE7', padding: '0.15rem 0.6rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                    🛡️ Warranty: {wItem.warranty_period}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                                                Store: <strong>{wItem.merchant_name}</strong> • SKU: {wItem.sku} • Purchased On: <strong>{formatInvoiceDate(wItem)}</strong> • Ref: <strong>{wItem.invoice_number}</strong>
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1B6B3A' }}>₹{wItem.amount.toLocaleString()}</div>
                                            <button
                                                onClick={() => setViewingInvoiceId(wItem.invoice_id)}
                                                style={{ marginTop: '4px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
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
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingInvoiceId(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '750px', maxHeight: '90vh', background: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#1E293B', margin: 0 }}>
                                        Invoice #{activeModalInvoice?.invoice_number || viewingInvoiceId}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
                                        Store: <strong>{activeModalInvoice?.merchant_name || 'Store'}</strong> • Date: {formatInvoiceDate(activeModalInvoice)}
                                    </p>
                                </div>
                                <button onClick={() => setViewingInvoiceId(null)} style={{ width: 36, height: 36, borderRadius: '10px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                            </div>

                            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textTransform: 'uppercase', color: '#64748B', fontSize: '0.72rem' }}>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Item & SKU</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Price</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parseInvoiceItems(activeModalInvoice).map((it, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#1E293B' }}>
                                                        {it.product_name || it.name}
                                                        {hasProductWarranty(it) && (
                                                            <div style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 800, marginTop: '2px' }}>
                                                                🛡️ {getProductWarrantyPeriod(it)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 800 }}>{it.quantity || 1} {it.unit || 'Pcs'}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#475569' }}>₹{(it.price || 0).toLocaleString()}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 850, color: '#1E293B' }}>₹{(it.amount || ((it.quantity || 1) * (it.price || 0))).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Payment Status: <strong style={{ color: '#059669' }}>{activeModalInvoice?.payment_status || 'PAID'}</strong></div>
                                        <div style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 800, marginTop: '4px' }}>Points Credited: +{activeModalInvoice?.points_earned || 0} pts</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Grand Total</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1B6B3A' }}>
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
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPointsModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '540px', background: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calculator size={20} color="#1B6B3A" /> Loyalty Points Rules & Calculator
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>Standard conversion rules across CLIKS Business</p>
                                </div>
                                <button onClick={() => setShowPointsModal(false)} style={{ width: 34, height: 34, borderRadius: '8px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>

                            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '14px', border: '1px solid #BBF7D0' }}>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>1. Earning Ratio</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1B6B3A', margin: '4px 0' }}>₹100 = 1 Pt</div>
                                        <div style={{ fontSize: '0.75rem', color: '#15803D' }}>1% of purchase bill credited as loyalty points.</div>
                                    </div>
                                    <div style={{ background: '#FAF5FF', padding: '1rem', borderRadius: '14px', border: '1px solid #E9D5FF' }}>
                                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6B21A8', textTransform: 'uppercase' }}>2. Redemption Ratio</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7C3AED', margin: '4px 0' }}>10 Pts = ₹1.00</div>
                                        <div style={{ fontSize: '0.75rem', color: '#7E22CE' }}>Points convert into cash discounts at checkout.</div>
                                    </div>
                                </div>

                                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                                        Calculate for a Purchase Amount (₹):
                                    </label>
                                    <input
                                        type="number"
                                        value={calcAmountInput}
                                        onChange={(e) => setCalcAmountInput(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', fontWeight: 700, fontSize: '1.1rem', boxSizing: 'border-box' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #CBD5E1' }}>
                                        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>Points Earned:</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>
                                            +{Math.floor((Number(calcAmountInput) || 0) / 100)} pts
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                                        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>Redemption Cash Value:</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#7C3AED' }}>
                                            ₹{((Math.floor((Number(calcAmountInput) || 0) / 100)) * pointsToMoneyRatio).toFixed(2)}
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
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShopModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '85vh', background: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#1E293B', margin: 0 }}>Select Connected Store</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>Filter invoices and loyalty points for a specific store</p>
                                </div>
                                <button onClick={() => setIsShopModalOpen(false)} style={{ width: 34, height: 34, borderRadius: '8px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>

                            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <button
                                    onClick={() => {
                                        setSelectedShop(null);
                                        setIsShopModalOpen(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
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
                                        <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.95rem' }}>All Stores (Combined)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Show purchase bills and points across all merchants</div>
                                    </div>
                                    <ChevronRight size={18} color="#1B6B3A" />
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
                                            padding: '1rem 1.25rem',
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
                                            <div style={{ fontWeight: 850, color: '#0F172A', fontSize: '0.95rem' }}>{shop.business_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Customer: {shop.customer_name}</div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#1B6B3A', fontWeight: 800 }}>Select →</span>
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
