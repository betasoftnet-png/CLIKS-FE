import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BOOK_ENTRY_EVENT } from '../lib/bookEntry';
import { storageService } from '../services/storageService';
import { Tooltip } from './common';
import {
    Home,
    Compass,
    LayoutDashboard,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    CalendarClock,
    PiggyBank,
    LineChart,
    Banknote,
    Settings,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    DollarSign,
    ShoppingCart,
    Calculator,
    Calendar,
    CalendarDays,
    Target,
    Plus,
    Bell,
    Users,
    UserCheck,
    Eye,
    ArrowLeftRight,
    Receipt,
    BookOpen,
    Layers,
    Split,
    HelpCircle,
    Crown,
    // Finance icons
    Building2,
    Gift,
    Coins,
    Star,
    Send,
    Landmark,
    History,
    Smartphone,
    FileCheck,
    AlertCircle,
    Shield,
    Heart,
    Tag,
    UserPlus,
    // Social & Public icons
    Gamepad2,
    UsersRound,
    Handshake,
    Rocket,
    Bitcoin,
    Bot,
    Briefcase,
    Package,
    Grid3X3,
    Cloud,
    ArrowDownRight,
    ArrowUpRight,
    X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useCurrency } from '../context';
import { useQueryClient } from '@tanstack/react-query';
import { incomeService, expensesService, transactionsService, paymentService } from '../services';
import '../App.css';
import logoPng from '../assets/cliks.png'; // Final branding

const SHOW_BETA_CLUB_UI = true;

const CrownIcon = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const img = new Image();
        img.src = '/crown_icon.png';
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                const targetColor = { r: 27, g: 107, b: 58 };
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    if (r > 150 && g > 150 && b > 150) {
                        data[i + 3] = 0;
                    } else {
                        data[i] = targetColor.r;
                        data[i + 1] = targetColor.g;
                        data[i + 2] = targetColor.b;
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            } catch (e) {
                console.error(e);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '23px',
                height: '23px',
                objectFit: 'contain',
                display: 'block'
            }}
        />
    );
};

const BOOK_ENTRY_CATEGORIES = {
    income: ['Sales & Revenue', 'Consulting & Services', 'Investments', 'Salary', 'Rental Income', 'Other Income'],
    expense: ['Office Rent', 'Utilities & Bills', 'Supplies & Hardware', 'Staff & Payroll', 'Travel & Fuel', 'Food & Refreshments', 'Other Expense'],
};
const BOOK_ENTRY_MODES = ['UPI', 'Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'Cheque', 'Other'];

const Sidebar = ({ isOpen, onReferralClick, onItemClick, onLogoClick }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Determine active item based on path
    const getActiveItemFromPath = (path, search) => {
        if (path.includes('/payments/transaction')) return 'Transaction';
        if (path.includes('/payments/segregation')) return 'Segregation';
        if (path.includes('/payments/planner') || path.includes('/payments/plan')) return 'Planner';
        if (path === '/payments/wallet' || path.includes('/payments/wallet/')) return 'Wallet';

        if (path.includes('/books/dashboard')) return 'Dashboard';
        if (path.includes('/books/accounting') || path.includes('/finance/accounts')) return 'Accounts';
        if (path.includes('/books/purchase-details') || path.includes('/payments/loyalty') || path.includes('/payments/rewards-offers') || path.includes('/payments/rewards')) return 'Purchases';
        if (path.includes('/books/income') || path.includes('/finance/income')) return 'Income';
        if (path.includes('/books/expense') || path.includes('/finance/expenses')) return 'Expense';
        if (path.includes('/books/stock')) return 'Stock';
        if (path.includes('/books/people') || path.includes('/payments/people')) return 'People';
        if (path.includes('/books/split-collect') || path.includes('/books/split-expense') || path.includes('/payments/split-collect') || path.includes('/payments/split-expense')) return 'Split & Collect';
        if (path === '/books' || path === '/books/' || path.includes('/books/report')) return 'Report';
        if (path.includes('/books/settings')) return 'Settings';
        if (path.includes('/books/faq')) return 'Help & Support';
        if (path.includes('/ca')) return 'FIN-PRO';
        if (path === '/auditor') return 'Audit';

        if (path.startsWith('/public') || path.startsWith('/social')) {
            const params = new URLSearchParams(search);
            const qpage = params.get('page');
            // Support /social/:page path-based routing
            if (path === '/social/beta-club') return 'PARTNER LAUNCH DESK';
            if (path === '/social/meetup') return 'PARTNER LAUNCH DESK';
            if (path === '/social/trading') return 'Trading docs';
            // Legacy ?page= query param support
            if (qpage === 'investors') return 'PARTNER LAUNCH DESK';
            if (qpage === 'meetup') return 'PARTNER LAUNCH DESK';
            if (qpage === 'trading') return 'Trading docs';
        }

        return 'Dashboard';
    };

    const queryClient = useQueryClient();
    const { currency } = useCurrency();
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);
    const [bookEntryError, setBookEntryError] = useState('');
    const bookEntryRef = useRef(null);
    const [bookModalType, setBookModalType] = useState('income'); // 'income' | 'expense'
    const [bookTxForm, setBookTxForm] = useState({
        title: '',
        amount: '',
        category: 'Sales & Revenue',
        payment_mode: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        reference: ''
    });
    const [isSubmittingBookTx, setIsSubmittingBookTx] = useState(false);
    const entryCategories = BOOK_ENTRY_CATEGORIES[bookModalType];

    const openBookTxModal = useCallback((type, record) => {
        if (type !== 'income' && type !== 'expense') return;
        setBookModalType(type);
        setEditingBookId(record?.id ?? null);
        setBookEntryError('');
        setBookTxForm({
            title: record?.source ?? record?.description ?? record?.name ?? '',
            amount: record?.amount ?? '',
            category: record?.category || (type === 'income' ? 'Sales & Revenue' : 'Office Rent'),
            payment_mode: record?.payment_mode || record?.payment_method || 'UPI',
            date: String(record?.date || record?.created_at || new Date().toISOString()).slice(0, 10),
            notes: '',
            reference: '',
            recurring: record?.recurring ?? false,
        });
        setIsAddBookModalOpen(true);
    }, []);

    useEffect(() => {
        const onEntry = ({ detail }) => openBookTxModal(detail?.type, detail?.record);
        window.addEventListener(BOOK_ENTRY_EVENT, onEntry);
        return () => window.removeEventListener(BOOK_ENTRY_EVENT, onEntry);
    }, [openBookTxModal]);

    useEffect(() => {
        if (!isAddBookModalOpen) return;
        const trigger = document.activeElement;
        bookEntryRef.current?.focus();
        return () => { if (trigger?.isConnected) trigger.focus(); };
    }, [isAddBookModalOpen]);

    const handleSaveBookTx = async (e) => {
        e.preventDefault();
        const amt = parseFloat(bookTxForm.amount);
        if (isNaN(amt) || amt <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }
        if (!bookTxForm.title.trim()) {
            alert('Please enter a description.');
            return;
        }

        setIsSubmittingBookTx(true);
        setBookEntryError('');
        try {
            if (editingBookId !== null) {
                const fields = {
                    amount: amt,
                    category: bookTxForm.category,
                    date: bookTxForm.date,
                    payment_mode: bookTxForm.payment_mode,
                };
                if (bookModalType === 'income') {
                    await incomeService.updateIncome(editingBookId, {
                        ...fields, source: bookTxForm.title, recurring: bookTxForm.recurring,
                    });
                } else {
                    await expensesService.updateExpense(editingBookId, { ...fields, description: bookTxForm.title });
                }
                queryClient.invalidateQueries({ queryKey: ['income'] });
                queryClient.invalidateQueries({ queryKey: ['expenses'] });
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                queryClient.invalidateQueries({ queryKey: ['books-dashboard-data'] });
                queryClient.invalidateQueries({ queryKey: ['finance-dashboard-enhanced'] });
                queryClient.invalidateQueries({ queryKey: ['paymentReports'] });
                queryClient.invalidateQueries({ queryKey: ['accounts'] });

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('transaction-added', { detail: { type: bookModalType, amount: amt } }));
                }

                setIsAddBookModalOpen(false);
                return;
            }
            const syncErrors = [];
            const keepSyncError = (label) => (error) => {
                syncErrors.push(label + ': ' + (error?.message || 'Request failed'));
            };
            if (bookModalType === 'income') {
                await incomeService.createIncome({
                    source: bookTxForm.title,
                    amount: amt,
                    category: bookTxForm.category || 'Sales & Revenue',
                    date: bookTxForm.date,
                    payment_mode: bookTxForm.payment_mode,
                    recurring: false
                });

                await transactionsService.createTransaction({
                    type: 'Income',
                    title: bookTxForm.title,
                    category: bookTxForm.category || 'Sales & Revenue',
                    amount: amt,
                    date: bookTxForm.date,
                    notes: bookTxForm.notes || bookTxForm.reference || ''
                }).catch(keepSyncError('Transaction history'));

                await paymentService.receivePayment({
                    customer_name: bookTxForm.title,
                    invoice_id: bookTxForm.reference || `INC-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: bookTxForm.payment_mode,
                    reference_number: bookTxForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(keepSyncError('Payment register'));
            } else {
                await expensesService.createExpense({
                    description: bookTxForm.title,
                    amount: amt,
                    category: bookTxForm.category || 'Office Rent',
                    date: bookTxForm.date,
                    payment_mode: bookTxForm.payment_mode
                });

                await transactionsService.createTransaction({
                    type: 'Expense',
                    title: bookTxForm.title,
                    category: bookTxForm.category || 'Other Expense',
                    amount: amt,
                    date: bookTxForm.date,
                    notes: bookTxForm.notes || bookTxForm.reference || ''
                }).catch(keepSyncError('Transaction history'));

                await paymentService.paySupplier({
                    supplier_name: bookTxForm.title,
                    purchase_id: bookTxForm.reference || `EXP-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: bookTxForm.payment_mode,
                    reference_number: bookTxForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(keepSyncError('Payment register'));
            }

            queryClient.invalidateQueries({ queryKey: ['income'] });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['books-dashboard-data'] });
            queryClient.invalidateQueries({ queryKey: ['finance-dashboard-enhanced'] });
            queryClient.invalidateQueries({ queryKey: ['paymentReports'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('transaction-added', { detail: { type: bookModalType, amount: amt } }));
            }

            if (syncErrors.length) {
                window.alert('The entry was saved, but some records could not be updated.\n' + syncErrors.join('\n'));
            }
            setIsAddBookModalOpen(false);
            setBookTxForm({
                title: '',
                amount: '',
                category: 'Sales & Revenue',
                payment_mode: 'UPI',
                date: new Date().toISOString().split('T')[0],
                notes: '',
                reference: ''
            });
        } catch (err) {
            setBookEntryError(err?.message || 'Unable to save this entry.');
        } finally {
            setIsSubmittingBookTx(false);
        }
    };

    const [activeItem, setActiveItem] = useState(getActiveItemFromPath(location.pathname, location.search));
    const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

    const defaultStorageData = {
        totalCapacityBytes: 1073741824,
        totalCapacityFormatted: '1.00 GB',
        usedBytes: 0,
        usedFormatted: '0 KB',
        usedPercent: 0,
        freeBytes: 1073741824,
        freeFormatted: '1.00 GB',
        moduleBreakdown: [
            { module: 'Audit & Tax (FIN-PRO)', formatted: '0 KB', allocatedFormatted: '400 MB', typicalQuota: '40%', bytes: 0, files: 'PDFs, XLS, Signed Certificates', color: '#2563EB', badgeBg: '#EFF6FF' },
            { module: 'Sales & Purchases', formatted: '0 KB', allocatedFormatted: '250 MB', typicalQuota: '25%', bytes: 0, files: 'PDF Invoices, Vendor Bills', color: '#10B981', badgeBg: '#ECFDF5' },
            { module: 'Expenses', formatted: '0 KB', allocatedFormatted: '150 MB', typicalQuota: '15%', bytes: 0, files: 'Receipt Scans, Images', color: '#8B5CF6', badgeBg: '#F5F3FF' },
            { module: 'HR & Payroll', formatted: '0 KB', allocatedFormatted: '100 MB', typicalQuota: '10%', bytes: 0, files: 'ID Documents, Payslip PDFs', color: '#F59E0B', badgeBg: '#FFFBEB' },
            { module: 'Inventory & Media', formatted: '0 KB', allocatedFormatted: '100 MB', typicalQuota: '10%', bytes: 0, files: 'Product Photos, Barcodes', color: '#06B6D4', badgeBg: '#ECFEFF' }
        ]
    };

    const [storageData, setStorageData] = useState(defaultStorageData);

    React.useEffect(() => {
        let isMounted = true;
        const fetchStorage = async () => {
            try {
                const data = await storageService.getStorageUsage();
                if (data && isMounted) {
                    setStorageData(data);
                }
            } catch (e) {
                // keep default if offline or error
            }
        };
        fetchStorage();
        return () => { isMounted = false; };
    }, [isStorageModalOpen]);

    // Update active item when location changes
    React.useEffect(() => {
        const newItem = getActiveItemFromPath(location.pathname, location.search);
        setActiveItem(newItem);
    }, [location.pathname, location.search]);

    // Books Section State (from snippet)
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
    }

    const handleItemClick = (label, path) => {
        setActiveItem(label);
        if (path) navigate(path);
        if (onItemClick) onItemClick();
    };

    // Show Finance sidebar for root, home (redirect), and finance/payments paths
    const showFinanceSidebar = location.pathname === '/' || location.pathname.startsWith('/home') || location.pathname.startsWith('/finance') || location.pathname.startsWith('/payments');
    const showBooksSidebar = (location.pathname.startsWith('/books') && location.pathname !== '/books/profile') || location.pathname === '/auditor' || location.pathname.startsWith('/ca') || location.pathname === '/subscription' || location.pathname.startsWith('/manage-subids') || location.pathname.startsWith('/inventory/branches') || location.pathname === '/branches' || location.pathname.startsWith('/settings/branches') || location.pathname.startsWith('/customization');
    const showPublicSidebar = location.pathname.startsWith('/public') || location.pathname.startsWith('/social');


    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div 
                    className="brand-logo" 
                    data-tour="sidebar-product-launcher"
                    onClick={onLogoClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Open Product Launcher"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (onLogoClick) onLogoClick();
                        }
                    }}
                    style={{ 
                        background: 'var(--accent-sidebar)',
                        padding: '1px', 
                        borderRadius: '6px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '28px', 
                        height: '28px', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Grid3X3 size={18} style={{ color: 'var(--accent-ink)' }} />
                </div>
                <h2 className="app-title">CLIKS</h2>
            </div>

            <div className="sidebar-scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <nav className="sidebar-nav" style={{ paddingTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {showFinanceSidebar && (
                    <>
                        {/* 1. Add Transaction */}
                        <button
                            data-tour="sidebar-payments-add-tx"
                            onClick={() => {
                                navigate('/payments/transactions?add=true');
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('open-add-transaction'));
                                }
                            }}
                            style={{
                                width: 'calc(100% - 1rem)',
                                margin: '0.15rem 0.5rem 0.45rem 0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 0.75rem',
                                background: 'var(--primary-gradient)',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '800',
                                fontSize: '0.8rem',
                                boxShadow: '0 3px 10px rgba(27, 107, 58, 0.18)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={14} strokeWidth={3} /> Add Transaction
                        </button>

                        {/* Divider Line */}
                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.1rem 0.5rem 0.35rem 0.5rem' }} />

                        {/* 2. People */}
                        <button
                            className={`sidebar-item ${activeItem === 'People' ? 'active' : ''}`}
                            onClick={() => handleItemClick('People', '/payments/people')}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} style={{ color: activeItem === 'People' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">People</span>
                            </div>
                        </button>

                        {/* 3. Transaction */}
                        <button
                            data-tour="sidebar-transactions"
                            className={`sidebar-item ${activeItem === 'Transaction' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Transaction', '/payments/transactions')}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} style={{ color: activeItem === 'Transaction' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Transaction</span>
                            </div>
                        </button>

                        {/* 4. Segregation */}
                        <button
                            className={`sidebar-item ${activeItem === 'Segregation' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Segregation', '/payments/segregation')}
                        >
                            <div className="flex items-center gap-3">
                                <Target size={20} style={{ color: activeItem === 'Segregation' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Segregation</span>
                            </div>
                        </button>

                        {/* 5. Split & Collect */}
                        <button
                            className={`sidebar-item ${activeItem === 'Split & Collect' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Split & Collect', '/payments/split-collect')}
                        >
                            <div className="flex items-center gap-3">
                                <Split size={20} style={{ color: activeItem === 'Split & Collect' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Split & Collect</span>
                            </div>
                        </button>

                        {/* 6. Planner */}
                        <button
                            className={`sidebar-item ${activeItem === 'Planner' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Planner', '/payments/plan')}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={20} style={{ color: activeItem === 'Planner' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Planner</span>
                            </div>
                        </button>
                    </>
                )}

                {showBooksSidebar && (
                    <>
                        {/* Action Buttons: Add Income & Add Expense */}
                        <div data-tour="sidebar-books-quick-entry" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', margin: '0.15rem 0.5rem 0.45rem 0.5rem' }}>
                            <button
                                data-tour="sidebar-quick-income"
                                onClick={() => openBookTxModal('income')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem',
                                    padding: '0.45rem 0.25rem',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    color: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.72rem',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.22)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                title="Add Income"
                            >
                                <Plus size={12} strokeWidth={3} /> Add Income
                            </button>
                            <button
                                data-tour="sidebar-quick-expense"
                                onClick={() => openBookTxModal('expense')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem',
                                    padding: '0.45rem 0.25rem',
                                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                    color: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.72rem',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.22)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                title="Add Expense"
                            >
                                <Plus size={12} strokeWidth={3} /> Add Expense
                            </button>
                        </div>

                        {/* 1. Dashboard */}
                        <button
                            className={`sidebar-item ${activeItem === 'Dashboard' || activeItem === 'Books Dashboard' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Dashboard', '/books/dashboard')}
                        >
                            <div className="flex items-center gap-3">
                                <Home size={20} style={{ color: (activeItem === 'Dashboard' || activeItem === 'Books Dashboard') ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Dashboard</span>
                            </div>
                        </button>

                        {/* Divider Line */}
                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.2rem 0.5rem' }} />
                        {/* 2. Accounts */}
                        <button
                            data-tour="sidebar-accounts"
                            className={`sidebar-item ${activeItem === 'Accounts' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Accounts', '/books/accounting')}
                        >
                            <div className="flex items-center gap-3">
                                <Calculator size={20} style={{ color: activeItem === 'Accounts' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Accounts</span>
                            </div>
                        </button>

                        {/* 3. Purchases */}
                        <button
                            data-tour="sidebar-purchases"
                            className={`sidebar-item ${activeItem === 'Purchases' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Purchases', '/books/purchase-details')}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingCart size={20} style={{ color: activeItem === 'Purchases' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Purchases</span>
                            </div>
                        </button>

                        {/* 4. Income */}
                        <button
                            data-tour="sidebar-income"
                            className={`sidebar-item ${activeItem === 'Income' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Income', '/books/income')}
                        >
                            <div className="flex items-center gap-3">
                                <Banknote size={20} style={{ color: activeItem === 'Income' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Income</span>
                            </div>
                        </button>

                        {/* 5. Expense */}
                        <button
                            data-tour="sidebar-expenses"
                            className={`sidebar-item ${activeItem === 'Expense' || activeItem === 'Expenses' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Expense', '/books/expenses')}
                        >
                            <div className="flex items-center gap-3">
                                <TrendingDown size={20} style={{ color: (activeItem === 'Expense' || activeItem === 'Expenses') ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Expense</span>
                            </div>
                        </button>

                        {/* 8. Report */}
                        <button
                            data-tour="sidebar-report"
                            className={`sidebar-item ${activeItem === 'Report' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Report', '/books')}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 size={20} style={{ color: activeItem === 'Report' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Report</span>
                            </div>
                        </button>

                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.25rem 0.75rem' }} />

                        
                    </>
                )}

                {showPublicSidebar && (
                    <>
                        {/* PARTNER LAUNCH DESK */}
                        <button
                            className={`sidebar-item ${(activeItem === 'PARTNER LAUNCH DESK') ? 'active' : ''}`}
                            onClick={() => handleItemClick('PARTNER LAUNCH DESK', '/social/meetup')}
                        >
                            <div className="flex items-center gap-3">
                                <CrownIcon />
                                <span className="sidebar-label sidebar-item-beta-club-text">PARTNER LAUNCH DESK</span>
                            </div>
                        </button>

                        {/* Trading docs */}
                        <button
                            className={`sidebar-item ${activeItem === 'Trading docs' ? 'active' : ''}`}
                            data-tour="social-trading-dock"
                            onClick={() => handleItemClick('Trading docs', '/social/trading')}
                        >
                            <div className="flex items-center gap-3">
                                <LineChart size={20} style={{ color: activeItem === 'Trading docs' ? '#ffffff' : 'var(--accent-ink)' }} />
                                <span className="sidebar-label">Trading docs</span>
                            </div>
                        </button>
                    </>
                )}


                </nav>
            </div>

            {/* Refer & Earn Block */}
            <div style={{ padding: '0 0.75rem', marginBottom: '0.4rem', flexShrink: 0 }}>
                <button
                    data-tour="sidebar-refer-earn"
                    onClick={() => {
                        if (onReferralClick) onReferralClick();
                    }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.45rem 0.5rem',
                        background: 'transparent',
                        color: '#6B7280',
                        borderRadius: '10px',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        fontWeight: '750',
                        fontSize: '0.8rem',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        outline: 'none'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)';
                        e.currentTarget.style.color = '#7C3AED';
                        e.currentTarget.style.borderColor = '#DDD6FE';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6B7280';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Gift size={16} strokeWidth={2.5} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                    <span>Refer &amp; Earn</span>
                </button>
            </div>

            {/* Fixed Sidebar Footer */}
            <div data-tour="sidebar-footer-system" className="sidebar-footer-container" style={{ 
                padding: '0.55rem 0.75rem 0.65rem 0.75rem', 
                borderTop: '1px solid #F1F5F9', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.4rem',
                flexShrink: 0,
                background: '#FFFFFF'
            }}>
                {/* Subscription Badge: Dark rounded card holding two gold circular badges */}
                <button
                    type="button"
                    data-tour="sidebar-finpro-subscription"
                    onClick={() => handleItemClick('Subscription', '/subscription')}
                    style={{
                        width: '100%',
                        padding: '0.5rem 0.6rem',
                        background: '#0f172a',
                        color: '#FFFFFF',
                        border: '1px solid #1e293b',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.35rem',
                        boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {/* Badge 1: BOOK ELITE */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, flex: 1 }}>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '2px solid #F59E0B',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <span style={{ fontSize: '0.52rem', fontWeight: '900', color: '#F59E0B', lineHeight: 1 }}>353</span>
                            <span style={{ fontSize: '0.34rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', lineHeight: 1, marginTop: '1px' }}>DAYS</span>
                        </div>
                        <div style={{ textAlign: 'left', minWidth: 0 }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: '900', color: '#F8FAFC', display: 'block', letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                BOOK
                            </span>
                            <span style={{ fontSize: '0.54rem', fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', lineHeight: 1.1 }}>
                                ELITE
                            </span>
                        </div>
                    </div>

                    {/* Center Divider */}
                    <div style={{ width: '1px', height: '20px', background: '#334155', flexShrink: 0, margin: '0 1px' }} />

                    {/* Badge 2: FIN-PRO SOLO */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '2px solid #F59E0B',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <span style={{ fontSize: '0.52rem', fontWeight: '900', color: '#F59E0B', lineHeight: 1 }}>353</span>
                            <span style={{ fontSize: '0.34rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', lineHeight: 1, marginTop: '1px' }}>DAYS</span>
                        </div>
                        <div style={{ textAlign: 'left', minWidth: 0 }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: '900', color: '#F8FAFC', display: 'block', letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                FIN-PRO
                            </span>
                            <span style={{ fontSize: '0.54rem', fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', lineHeight: 1.1 }}>
                                SOLO
                            </span>
                        </div>
                    </div>
                </button>

                {/* Bottom Settings & Help & Support (Side-by-Side Grid matching Cliks Business) */}
                <div className="sidebar-footer-nav-grid">
                    <button
                        type="button"
                        onClick={() => handleItemClick('Settings', '/books/settings')}
                        className="sidebar-footer-btn"
                        style={{
                            color: location.pathname.includes('/books/settings') ? 'var(--accent-ink)' : '#334155',
                            backgroundColor: location.pathname.includes('/books/settings') ? 'var(--accent-tint)' : '#FFFFFF',
                            borderColor: location.pathname.includes('/books/settings') ? 'var(--accent-shadow)' : 'var(--accent-tint)'
                        }}
                        title="Settings"
                    >
                        <Settings size={16} className="sidebar-footer-btn-icon" style={{ opacity: 0.85, flexShrink: 0 }} />
                        <span className="sidebar-footer-btn-label">Settings</span>
                    </button>

                    <button
                        type="button"
                        data-tour="sidebar-help-support"
                        onClick={() => handleItemClick('Help & Support', '/books/faq')}
                        className="sidebar-footer-btn"
                        style={{
                            color: location.pathname.includes('/books/faq') ? 'var(--accent-ink)' : '#334155',
                            backgroundColor: location.pathname.includes('/books/faq') ? 'var(--accent-tint)' : '#FFFFFF',
                            borderColor: location.pathname.includes('/books/faq') ? 'var(--accent-shadow)' : 'var(--accent-tint)'
                        }}
                        title="Help & Support"
                    >
                        <HelpCircle size={16} className="sidebar-footer-btn-icon" style={{ opacity: 0.85, flexShrink: 0 }} />
                        <span className="sidebar-footer-btn-label">Help & Support</span>
                    </button>
                </div>
            </div>

            {/* Storage Allocation Breakdown Modal */}
            {isStorageModalOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={() => setIsStorageModalOpen(false)}
                >
                    <div 
                        style={{
                            width: '90%',
                            maxWidth: '620px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden',
                            animation: 'fadeInScale 0.2s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#F8FAFC'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    backgroundColor: '#EFF6FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Cloud size={20} color="#2563EB" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                                        Storage Allocation & Breakdown
                                    </h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                                        Real-time storage usage across CLIKS modules
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsStorageModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748B',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
                            {/* Summary Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Total Capacity</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{storageData.totalCapacityFormatted}</div>
                                </div>
                                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase' }}>Used Storage</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E40AF', marginTop: '2px' }}>{`${storageData.usedFormatted} (${storageData.usedPercent}%)`}</div>
                                </div>
                                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase' }}>Free Available</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#15803D', marginTop: '2px' }}>{storageData.freeFormatted}</div>
                                </div>
                            </div>

                                {/* Storage Capacity Usage Visual Progress Bar */}
                                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem 1.15rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', fontSize: '0.82rem', fontWeight: '750', color: '#334155' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Cloud size={16} color="#2563EB" /> Storage Capacity Usage ({storageData.totalCapacityFormatted})
                                        </span>
                                        <span style={{ color: storageData.usedPercent > 90 ? '#DC2626' : '#2563EB', fontWeight: '850', fontSize: '0.85rem' }}>
                                            {storageData.usedPercent}% Used ({storageData.usedFormatted}) • {storageData.freeFormatted} Free
                                        </span>
                                    </div>

                                    {/* Proportional Capacity Bar: Shows real usage out of 1.00 GB */}
                                    <div style={{
                                        display: 'flex',
                                        height: '14px',
                                        width: '100%',
                                        borderRadius: '999px',
                                        overflow: 'hidden',
                                        backgroundColor: '#E2E8F0',
                                        border: '1px solid #CBD5E1',
                                        padding: '1px',
                                        boxSizing: 'border-box'
                                    }}>
                                        {storageData.moduleBreakdown.map((item, idx) => {
                                            const totalCap = storageData.totalCapacityBytes || 1073741824;
                                            const pct = totalCap > 0 ? (item.bytes / totalCap) * 100 : 0;
                                            if (!item.bytes || item.bytes <= 0) return null;
                                            const visualPct = Math.max(1.2, pct);
                                            return (
                                                <div 
                                                    key={idx} 
                                                    style={{ 
                                                        width: `${visualPct}%`, 
                                                        backgroundColor: item.color,
                                                        height: '100%',
                                                        transition: 'width 0.3s ease'
                                                    }} 
                                                    title={`${item.module}: ${item.formatted || '0 KB'} (${pct.toFixed(2)}% of 1 GB)`} 
                                                />
                                            );
                                        })}
                                        {storageData.usedBytes === 0 && (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#E2E8F0', borderRadius: '999px' }} />
                                        )}
                                    </div>

                                    {/* Footprint Indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.75rem', fontSize: '0.74rem', color: '#64748B' }}>
                                        {storageData.moduleBreakdown.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                                                <span style={{ fontWeight: item.bytes > 0 ? '750' : '500', color: item.bytes > 0 ? '#0F172A' : '#64748B' }}>
                                                    {item.module.split(' ')[0]}: {item.formatted || '0 KB'}
                                                </span>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8', flexShrink: 0 }} />
                                            <span style={{ fontWeight: '700', color: '#15803D' }}>Available: {storageData.freeFormatted}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Clean Module Allocation & Usage Table */}
                                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                                <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569' }}>Module</th>
                                                <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569', textAlign: 'center' }}>Allocated Quota</th>
                                                <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569', textAlign: 'center' }}>Space Used</th>
                                                <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569' }}>Main File Types</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {storageData.moduleBreakdown.map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: idx < storageData.moduleBreakdown.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                                    <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block', flexShrink: 0 }} />
                                                        {item.module}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                        <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '750', border: '1px solid #E2E8F0' }}>
                                                            {item.allocatedFormatted || item.typicalQuota} ({item.typicalQuota})
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                        <span style={{ 
                                                            backgroundColor: item.bytes > 0 ? item.badgeBg : '#F8FAFC', 
                                                            color: item.bytes > 0 ? item.color : '#94A3B8', 
                                                            padding: '3px 10px', 
                                                            borderRadius: '999px', 
                                                            fontSize: '0.8rem', 
                                                            fontWeight: '800', 
                                                            border: `1px solid ${item.bytes > 0 ? item.color + '40' : '#E2E8F0'}` 
                                                        }}>
                                                            {item.formatted || '0 Bytes'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 1rem', color: '#64748B', fontWeight: '500' }}>
                                                        {item.files}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid #F1F5F9',
                            backgroundColor: '#F8FAFC',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => setIsStorageModalOpen(false)}
                                style={{
                                    padding: '0.55rem 1.25rem',
                                    backgroundColor: '#2563EB',
                                    color: '#FFFFFF',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontWeight: '750',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                                }}
                            >
                                Close Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Income / Add Expense Modal */}
            {isAddBookModalOpen && createPortal(
                <div data-tour-blocking="true" style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(8px)', padding: '1.5rem' }}>
                    <div role="dialog" aria-modal="true" aria-labelledby="book-entry-title" tabIndex={-1} ref={bookEntryRef}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape' && !isSubmittingBookTx) {
                                event.stopPropagation();
                                setIsAddBookModalOpen(false);
                            }
                        }}
                        style={{ background: '#FFFFFF', width: '100%', maxWidth: '460px', borderRadius: '24px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 id="book-entry-title" style={{ fontSize: '1.25rem', fontWeight: '850', color: bookModalType === 'income' ? '#059669' : '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {bookModalType === 'income' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                                {editingBookId !== null ? (bookModalType === 'income' ? 'Edit Income' : 'Edit Expense') : (bookModalType === 'income' ? 'Add Income' : 'Add Expense')}
                            </h3>
                            <button type="button" aria-label="Close entry" disabled={isSubmittingBookTx} onClick={() => setIsAddBookModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.45rem', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Income / Expense Switcher Tab */}
                        {editingBookId === null && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: '#F1F5F9', padding: '4px', borderRadius: '12px', marginBottom: '1.2rem' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setBookModalType('income');
                                    setBookTxForm(prev => ({ ...prev, category: 'Sales & Revenue' }));
                                }}
                                style={{
                                    padding: '0.55rem',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: bookModalType === 'income' ? '#10B981' : 'transparent',
                                    color: bookModalType === 'income' ? '#FFFFFF' : '#475569',
                                    fontWeight: '800',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ArrowDownRight size={15} /> Income
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setBookModalType('expense');
                                    setBookTxForm(prev => ({ ...prev, category: 'Office Rent' }));
                                }}
                                style={{
                                    padding: '0.55rem',
                                    borderRadius: '9px',
                                    border: 'none',
                                    background: bookModalType === 'expense' ? '#EF4444' : 'transparent',
                                    color: bookModalType === 'expense' ? '#FFFFFF' : '#475569',
                                    fontWeight: '800',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ArrowUpRight size={15} /> Expense
                            </button>
                        </div>}

                        <form onSubmit={handleSaveBookTx} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {/* Description / Source */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>
                                    {bookModalType === 'income' ? 'Income Source / Received From' : 'Expense / Paid To Description'} *
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder={bookModalType === 'income' ? 'e.g. Client Payment, Product Sales, Salary' : 'e.g. Office Rent, Hardware Supplies, Tea'}
                                    value={bookTxForm.title}
                                    onChange={(e) => setBookTxForm({ ...bookTxForm, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Amount & Date in one row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>
                                        Amount ({currency?.symbol || '₹'}) *
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0.01"
                                        step="any"
                                        placeholder="0.00"
                                        value={bookTxForm.amount}
                                        onChange={(e) => setBookTxForm({ ...bookTxForm, amount: e.target.value })}
                                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.92rem', fontWeight: '700', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Date *</label>
                                    <input
                                        required
                                        type="date"
                                        value={bookTxForm.date}
                                        onChange={(e) => setBookTxForm({ ...bookTxForm, date: e.target.value })}
                                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* Category & Mode */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Category</label>
                                    <select
                                        value={bookTxForm.category}
                                        onChange={(e) => setBookTxForm({ ...bookTxForm, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.85rem', boxSizing: 'border-box', background: '#FFFFFF' }}
                                    >
                                        {!entryCategories.includes(bookTxForm.category) && (
                                            <option value={bookTxForm.category}>{bookTxForm.category}</option>
                                        )}
                                        {entryCategories.map(category => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Payment Mode</label>
                                    <select
                                        value={bookTxForm.payment_mode}
                                        onChange={(e) => setBookTxForm({ ...bookTxForm, payment_mode: e.target.value })}
                                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.85rem', boxSizing: 'border-box', background: '#FFFFFF' }}
                                    >
                                        {!BOOK_ENTRY_MODES.includes(bookTxForm.payment_mode) && (
                                            <option value={bookTxForm.payment_mode}>{bookTxForm.payment_mode}</option>
                                        )}
                                        {BOOK_ENTRY_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Reference / Notes */}
                            {editingBookId === null && <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Notes / Reference (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Transaction ID, receipt #, or remark"
                                    value={bookTxForm.notes}
                                    onChange={(e) => setBookTxForm({ ...bookTxForm, notes: e.target.value, reference: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box' }}
                                />
                            </div>}

                            {bookEntryError && <p role="alert" style={{ color: '#DC2626' }}>{bookEntryError}</p>}
                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
                                <button
                                    type="button"
                                    disabled={isSubmittingBookTx}
                                    onClick={() => setIsAddBookModalOpen(false)}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontWeight: '750', fontSize: '0.88rem', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingBookTx}
                                    style={{
                                        flex: 2,
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: bookModalType === 'income' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                        color: '#FFFFFF',
                                        fontWeight: '800',
                                        fontSize: '0.88rem',
                                        cursor: isSubmittingBookTx ? 'not-allowed' : 'pointer',
                                        opacity: isSubmittingBookTx ? 0.7 : 1,
                                        boxShadow: bookModalType === 'income' ? '0 4px 14px rgba(16, 185, 129, 0.3)' : '0 4px 14px rgba(239, 68, 68, 0.3)'
                                    }}
                                >
                                    {isSubmittingBookTx ? 'Saving...' : editingBookId !== null ? 'Save Changes' : (bookModalType === 'income' ? 'Save Income Entry' : 'Save Expense Entry')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

        </aside>
    );
};

export default Sidebar;
