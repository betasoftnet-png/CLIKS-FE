import React, { useState } from 'react';
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
        if (path.includes('/payments/rewards-offers')) return 'Rewards & Offers';

        if (path.includes('/books/dashboard')) return 'Dashboard';
        if (path.includes('/books/accounting') || path.includes('/finance/accounts')) return 'Accounts';
        if (path.includes('/books/purchase-details')) return 'Purchases';
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

    const openBookTxModal = (type) => {
        setBookModalType(type);
        setBookTxForm({
            title: '',
            amount: '',
            category: type === 'income' ? 'Sales & Revenue' : 'Office Rent',
            payment_mode: 'UPI',
            date: new Date().toISOString().split('T')[0],
            notes: '',
            reference: ''
        });
        setIsAddBookModalOpen(true);
    };

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
        try {
            if (bookModalType === 'income') {
                await incomeService.createIncome({
                    source: bookTxForm.title,
                    amount: amt,
                    category: bookTxForm.category || 'Sales & Revenue',
                    date: bookTxForm.date,
                    payment_mode: bookTxForm.payment_mode,
                    recurring: false
                }).catch(() => {});

                await transactionsService.createTransaction({
                    type: 'Income',
                    title: bookTxForm.title,
                    category: bookTxForm.category || 'Sales & Revenue',
                    amount: amt,
                    date: bookTxForm.date,
                    notes: bookTxForm.notes || bookTxForm.reference || ''
                }).catch(() => {});

                await paymentService.receivePayment({
                    customer_name: bookTxForm.title,
                    invoice_id: bookTxForm.reference || `INC-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: bookTxForm.payment_mode,
                    reference_number: bookTxForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(() => {});
            } else {
                await expensesService.createExpense({
                    description: bookTxForm.title,
                    amount: amt,
                    category: bookTxForm.category || 'Office Rent',
                    date: bookTxForm.date,
                    payment_mode: bookTxForm.payment_mode
                }).catch(() => {});

                await transactionsService.createTransaction({
                    type: 'Expense',
                    title: bookTxForm.title,
                    category: bookTxForm.category || 'Other Expense',
                    amount: amt,
                    date: bookTxForm.date,
                    notes: bookTxForm.notes || bookTxForm.reference || ''
                }).catch(() => {});

                await paymentService.paySupplier({
                    supplier_name: bookTxForm.title,
                    purchase_id: bookTxForm.reference || `EXP-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: bookTxForm.payment_mode,
                    reference_number: bookTxForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(() => {});
            }

            queryClient.invalidateQueries({ queryKey: ['income'] });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['paymentReports'] });

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('transaction-added', { detail: { type: bookModalType, amount: amt } }));
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
            console.error('Failed to save entry:', err);
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
            { module: 'Audit & Tax (FIN-PRO)', share: '40%', sharePercent: 40, files: 'PDFs, XLS, Signed Certificates', color: '#2563EB', badgeBg: '#EFF6FF' },
            { module: 'Sales & Purchases', share: '25%', sharePercent: 25, files: 'PDF Invoices, Vendor Bills', color: '#10B981', badgeBg: '#ECFDF5' },
            { module: 'Expenses', share: '15%', sharePercent: 15, files: 'Receipt Scans, Images', color: '#8B5CF6', badgeBg: '#F5F3FF' },
            { module: 'HR & Payroll', share: '10%', sharePercent: 10, files: 'ID Documents, Payslip PDFs', color: '#F59E0B', badgeBg: '#FFFBEB' },
            { module: 'Inventory & Media', share: '10%', sharePercent: 10, files: 'Product Photos, Barcodes', color: '#06B6D4', badgeBg: '#ECFEFF' }
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
    const showBooksSidebar = (location.pathname.startsWith('/books') && location.pathname !== '/books/profile') || location.pathname === '/auditor' || location.pathname.startsWith('/ca') || location.pathname === '/subscription';
    const showPublicSidebar = location.pathname.startsWith('/public') || location.pathname.startsWith('/social');


    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div 
                    className="brand-logo" 
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
                        background: '#f0fdf4', 
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
                    <Grid3X3 size={18} style={{ color: '#1B6B3A' }} />
                </div>
                <h2 className="app-title">CLIKS</h2>
            </div>

            <div className="sidebar-scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <nav className="sidebar-nav" style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {showFinanceSidebar && (
                    <>
                        {/* 1. Add Transaction */}
                        <button
                            onClick={() => {
                                navigate('/payments/transactions?add=true');
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('open-add-transaction'));
                                }
                            }}
                            style={{
                                width: 'calc(100% - 1.5rem)',
                                margin: '0.25rem 0.75rem 0.85rem 0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.65rem 1rem',
                                background: 'linear-gradient(135deg, #1B6B3A 0%, #135029 100%)',
                                color: '#FFFFFF',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '800',
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 12px rgba(27, 107, 58, 0.2)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={16} strokeWidth={3} /> Add Transaction
                        </button>

                        {/* Divider Line */}
                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.1rem 0.75rem 0.5rem 0.75rem' }} />

                        {/* 2. People */}
                        <button
                            className={`sidebar-item ${activeItem === 'People' ? 'active' : ''}`}
                            onClick={() => handleItemClick('People', '/payments/people')}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} style={{ color: activeItem === 'People' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">People</span>
                            </div>
                        </button>

                        {/* 3. Transaction */}
                        <button
                            className={`sidebar-item ${activeItem === 'Transaction' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Transaction', '/payments/transactions')}
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} style={{ color: activeItem === 'Transaction' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Transaction</span>
                            </div>
                        </button>

                        {/* 4. Segregation */}
                        <button
                            className={`sidebar-item ${activeItem === 'Segregation' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Segregation', '/payments/segregation')}
                        >
                            <div className="flex items-center gap-3">
                                <Target size={20} style={{ color: activeItem === 'Segregation' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Segregation</span>
                            </div>
                        </button>

                        {/* 5. Split & Collect */}
                        <button
                            className={`sidebar-item ${activeItem === 'Split & Collect' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Split & Collect', '/payments/split-collect')}
                        >
                            <div className="flex items-center gap-3">
                                <Split size={20} style={{ color: activeItem === 'Split & Collect' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Split & Collect</span>
                            </div>
                        </button>

                        {/* 6. Planner */}
                        <button
                            className={`sidebar-item ${activeItem === 'Planner' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Planner', '/payments/plan')}
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={20} style={{ color: activeItem === 'Planner' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Planner</span>
                            </div>
                        </button>
                    </>
                )}

                {showBooksSidebar && (
                    <>
                        {/* Action Buttons: Add Income & Add Expense */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', margin: '0.25rem 0.75rem 0.75rem 0.75rem' }}>
                            <button
                                onClick={() => openBookTxModal('income')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem',
                                    padding: '0.6rem 0.35rem',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    color: '#FFFFFF',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.78rem',
                                    boxShadow: '0 3px 10px rgba(16, 185, 129, 0.25)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                title="Add Income"
                            >
                                <Plus size={14} strokeWidth={3} /> Add Income
                            </button>
                            <button
                                onClick={() => openBookTxModal('expense')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem',
                                    padding: '0.6rem 0.35rem',
                                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                    color: '#FFFFFF',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '0.78rem',
                                    boxShadow: '0 3px 10px rgba(239, 68, 68, 0.25)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                title="Add Expense"
                            >
                                <Plus size={14} strokeWidth={3} /> Add Expense
                            </button>
                        </div>

                        {/* 1. Dashboard */}
                        <button
                            className={`sidebar-item ${activeItem === 'Dashboard' || activeItem === 'Books Dashboard' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Dashboard', '/books/dashboard')}
                        >
                            <div className="flex items-center gap-3">
                                <Home size={20} style={{ color: (activeItem === 'Dashboard' || activeItem === 'Books Dashboard') ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Dashboard</span>
                            </div>
                        </button>

                        {/* Divider Line */}
                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.4rem 0.5rem' }} />
                        {/* 2. Accounts */}
                        <button
                            className={`sidebar-item ${activeItem === 'Accounts' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Accounts', '/books/accounting')}
                        >
                            <div className="flex items-center gap-3">
                                <Calculator size={20} style={{ color: activeItem === 'Accounts' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Accounts</span>
                            </div>
                        </button>

                        {/* 3. Purchases */}
                        <button
                            className={`sidebar-item ${activeItem === 'Purchases' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Purchases', '/books/purchase-details')}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingCart size={20} style={{ color: activeItem === 'Purchases' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Purchases</span>
                            </div>
                        </button>

                        {/* 4. Income */}
                        <button
                            className={`sidebar-item ${activeItem === 'Income' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Income', '/books/income')}
                        >
                            <div className="flex items-center gap-3">
                                <Banknote size={20} style={{ color: activeItem === 'Income' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Income</span>
                            </div>
                        </button>

                        {/* 5. Expense */}
                        <button
                            className={`sidebar-item ${activeItem === 'Expense' || activeItem === 'Expenses' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Expense', '/books/expenses')}
                        >
                            <div className="flex items-center gap-3">
                                <TrendingDown size={20} style={{ color: (activeItem === 'Expense' || activeItem === 'Expenses') ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Expense</span>
                            </div>
                        </button>

                        {/* 6. Split & Collect */}
                        <button
                            className={`sidebar-item ${activeItem === 'Split & Collect' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Split & Collect', '/books/split-collect')}
                        >
                            <div className="flex items-center gap-3">
                                <Split size={20} style={{ color: activeItem === 'Split & Collect' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Split & Collect</span>
                            </div>
                        </button>

                        {/* 8. Report */}
                        <button
                            className={`sidebar-item ${activeItem === 'Report' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Report', '/books')}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 size={20} style={{ color: activeItem === 'Report' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Report</span>
                            </div>
                        </button>

                        <div style={{ height: '1px', background: '#E2E8F0', margin: '0.5rem 1rem' }} />

                        {/* 6. FIN-PRO */}
                        <button
                            className="sidebar-custom-yellow-btn"
                            onClick={() => handleItemClick('FIN-PRO', '/ca')}
                            style={{
                                width: '136px',
                                height: '38px',
                                margin: '0.5rem auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 12px',
                                background: '#FFCC00',
                                border: activeItem === 'FIN-PRO' ? '2.5px solid #E5B800' : 'none',
                                cursor: 'pointer',
                                borderRadius: '50px',
                                boxShadow: activeItem === 'FIN-PRO' 
                                    ? '0 0 0 1px rgba(229, 184, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)' 
                                    : '0 3px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                gap: '10px',
                                outline: 'none'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                e.currentTarget.style.background = '#FFD300';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = activeItem === 'FIN-PRO' 
                                    ? '0 0 0 1px rgba(229, 184, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)' 
                                    : '0 3px 8px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.background = '#FFCC00';
                            }}
                        >
                            <Briefcase size={18} strokeWidth={2.5} style={{ color: '#000000', flexShrink: 0 }} />
                            <div style={{ width: '1.5px', height: '18px', backgroundColor: '#000000', opacity: 0.8 }} />
                            <span style={{ 
                                fontWeight: '900', 
                                color: '#000000', 
                                letterSpacing: '0.3px',
                                textTransform: 'uppercase',
                                fontSize: '0.82rem'
                            }}>FIN-PRO</span>
                        </button>
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
                            onClick={() => handleItemClick('Trading docs', '/social/trading')}
                        >
                            <div className="flex items-center gap-3">
                                <LineChart size={20} style={{ color: activeItem === 'Trading docs' ? '#ffffff' : '#1B6B3A' }} />
                                <span className="sidebar-label">Trading docs</span>
                            </div>
                        </button>
                    </>
                )}


                </nav>
                <div style={{ flex: 1 }} />
            </div>

            {/* Refer & Earn Block */}
            <div style={{ padding: '0 1rem', marginBottom: '0.75rem', flexShrink: 0 }}>
                <button
                    onClick={() => {
                        if (onReferralClick) onReferralClick();
                    }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.65rem',
                        padding: '0.60rem',
                        background: 'transparent',
                        color: '#6B7280',
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        cursor: 'pointer',
                        fontWeight: '750',
                        fontSize: '0.875rem',
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
                    <Gift size={18} strokeWidth={2.5} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                    <span>Refer &amp; Earn</span>
                </button>
            </div>

            {/* Fixed Sidebar Footer */}
            <div style={{ 
                padding: '1rem', 
                borderTop: '1px solid #F1F5F9', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.6rem',
                flexShrink: 0,
                background: '#FFFFFF'
            }}>
                {/* Subscription Badge: Dark rounded card holding two gold circular badges */}
                <button
                    type="button"
                    onClick={() => handleItemClick('Subscription', '/subscription')}
                    style={{
                        width: '100%',
                        padding: '0.75rem 0.85rem',
                        background: '#0f172a',
                        color: '#FFFFFF',
                        border: '1px solid #1e293b',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {/* Badge 1: BOOK ELITE */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1 }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '2px solid #F59E0B',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#F59E0B', lineHeight: 1 }}>353</span>
                            <span style={{ fontSize: '0.38rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', lineHeight: 1, marginTop: '1px' }}>DAYS</span>
                        </div>
                        <div style={{ textAlign: 'left', minWidth: 0 }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#F8FAFC', display: 'block', letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                BOOK
                            </span>
                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', lineHeight: 1.1 }}>
                                ELITE
                            </span>
                        </div>
                    </div>

                    {/* Center Divider */}
                    <div style={{ width: '1px', height: '24px', background: '#334155', flexShrink: 0, margin: '0 2px' }} />

                    {/* Badge 2: FIN-PRO SOLO */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '2px solid #F59E0B',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#F59E0B', lineHeight: 1 }}>353</span>
                            <span style={{ fontSize: '0.38rem', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', lineHeight: 1, marginTop: '1px' }}>DAYS</span>
                        </div>
                        <div style={{ textAlign: 'left', minWidth: 0 }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '900', color: '#F8FAFC', display: 'block', letterSpacing: '-0.01em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                FIN-PRO
                            </span>
                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: '#FCD34D', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', lineHeight: 1.1 }}>
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
                            color: location.pathname.includes('/books/settings') ? '#1B6B3A' : '#334155',
                            backgroundColor: location.pathname.includes('/books/settings') ? '#F0FDF4' : '#FFFFFF',
                            borderColor: location.pathname.includes('/books/settings') ? '#BBF7D0' : '#D8F3E5'
                        }}
                        title="Settings"
                    >
                        <Settings size={16} className="sidebar-footer-btn-icon" style={{ opacity: 0.85, flexShrink: 0 }} />
                        <span className="sidebar-footer-btn-label">Settings</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleItemClick('Help & Support', '/books/faq')}
                        className="sidebar-footer-btn"
                        style={{
                            color: location.pathname.includes('/books/faq') ? '#1B6B3A' : '#334155',
                            backgroundColor: location.pathname.includes('/books/faq') ? '#F0FDF4' : '#FFFFFF',
                            borderColor: location.pathname.includes('/books/faq') ? '#BBF7D0' : '#D8F3E5'
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

                            {/* Multi-Color Segmented Storage Quota Distribution Bar */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>
                                    <span>Module Storage Quota Distribution</span>
                                    <span>100% Allocated</span>
                                </div>
                                <div style={{ display: 'flex', height: '10px', width: '100%', borderRadius: '999px', overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                                    {storageData.moduleBreakdown.map((item, idx) => (
                                        <div key={idx} style={{ width: `${item.sharePercent}%`, backgroundColor: item.color }} title={`${item.module}: ${item.share}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                            <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569' }}>Module</th>
                                            <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569', textAlign: 'center' }}>Typical Storage Share</th>
                                            <th style={{ padding: '0.75rem 1rem', fontWeight: '750', color: '#475569' }}>Main File Types</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storageData.moduleBreakdown.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: idx < storageData.moduleBreakdown.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                                <td style={{ padding: '0.75rem 1rem', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }} />
                                                    {item.module}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                                    <span style={{ backgroundColor: item.badgeBg, color: item.color, padding: '2px 8px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '800', border: `1px solid ${item.color}33` }}>
                                                        {item.share}
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
            {isAddBookModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(8px)', padding: '1.5rem' }}>
                    <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '460px', borderRadius: '24px', padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '850', color: bookModalType === 'income' ? '#059669' : '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {bookModalType === 'income' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                                {bookModalType === 'income' ? 'Add Income' : 'Add Expense'}
                            </h3>
                            <button onClick={() => setIsAddBookModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.45rem', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Income / Expense Switcher Tab */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', background: '#F1F5F9', padding: '4px', borderRadius: '12px', marginBottom: '1.2rem' }}>
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
                        </div>

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
                                        {bookModalType === 'income' ? (
                                            <>
                                                <option value="Sales & Revenue">Sales & Revenue</option>
                                                <option value="Consulting & Services">Consulting & Services</option>
                                                <option value="Investments">Investments</option>
                                                <option value="Salary">Salary</option>
                                                <option value="Rental Income">Rental Income</option>
                                                <option value="Other Income">Other Income</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Office Rent">Office Rent</option>
                                                <option value="Utilities & Bills">Utilities & Bills</option>
                                                <option value="Supplies & Hardware">Supplies & Hardware</option>
                                                <option value="Staff & Payroll">Staff & Payroll</option>
                                                <option value="Travel & Fuel">Travel & Fuel</option>
                                                <option value="Food & Refreshments">Food & Refreshments</option>
                                                <option value="Other Expense">Other Expense</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Payment Mode</label>
                                    <select
                                        value={bookTxForm.payment_mode}
                                        onChange={(e) => setBookTxForm({ ...bookTxForm, payment_mode: e.target.value })}
                                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.85rem', boxSizing: 'border-box', background: '#FFFFFF' }}
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Reference / Notes */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '0.35rem' }}>Notes / Reference (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Transaction ID, receipt #, or remark"
                                    value={bookTxForm.notes}
                                    onChange={(e) => setBookTxForm({ ...bookTxForm, notes: e.target.value, reference: e.target.value })}
                                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
                                <button
                                    type="button"
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
                                    {isSubmittingBookTx ? 'Saving...' : (bookModalType === 'income' ? 'Save Income Entry' : 'Save Expense Entry')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </aside>
    );
};

export default Sidebar;
