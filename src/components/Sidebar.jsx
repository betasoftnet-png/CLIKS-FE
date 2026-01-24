import React, { useState, useEffect } from 'react';
import {
    Home,
    LayoutDashboard,
    FileText,
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
    Calendar,
    Target,
    Bell,
    Users,
    Eye,
    ArrowLeftRight,
    Receipt,
    BookOpen,
    Layers,
    Split,
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
    Bitcoin
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Home Section State
    const [expandedSections, setExpandedSections] = useState({
        home: true,
        financialPlan: true,
        people: true
    });

    // Determine active item based on path
    const getActiveItemFromPath = (path) => {
        if (path === '/' || path === '/home') return 'Dashboard';
        if (path === '/home/reports') return 'Reports';
        if (path === '/home/statistics') return 'Statistics';
        if (path === '/home/income') return 'Income';
        if (path === '/home/expenses') return 'Expenses';
        if (path === '/home/budgets') return 'Budgets';
        if (path === '/home/accounts') return 'Accounts';
        if (path === '/home/planned-payments') return 'Planned payments';
        if (path === '/home/savings') return 'Savings';
        if (path === '/home/investments') return 'Investments';
        if (path === '/home/debts') return 'Debts';
        if (path.includes('/books/stock')) return 'Stock';
        if (path.includes('/books/plan/budget')) return 'Budget';
        if (path.includes('/books/plan/income')) return 'Income';
        if (path.includes('/books/plan/expense')) return 'Expense';
        if (path.includes('/books/plan/calendar')) return 'Financial Calendar';
        if (path.includes('/books/plan/goals')) return 'Savings & Goals';
        if (path.includes('/books/plan/reminders')) return 'Reminders';
        if (path.includes('/books/plan/analysis')) return 'Analysis';
        if (path.includes('/books/people/overview')) return 'Overview';
        if (path.includes('/books/people/transactions')) return 'Transactions';
        if (path.includes('/books/people/reminders')) return 'PeopleReminders';
        if (path.includes('/books/people/records')) return 'Records';
        return 'Dashboard';
    };

    const [activeItem, setActiveItem] = useState(getActiveItemFromPath(location.pathname));

    // Update active item when location changes
    React.useEffect(() => {
        const newItem = getActiveItemFromPath(location.pathname);
        setActiveItem(newItem);

        // Auto-expand sections if needed
        if (location.pathname.includes('/books/plan')) {
            setExpandedSections(prev => ({ ...prev, financialPlan: true }));
        }
        if (location.pathname.includes('/books/people')) {
            setExpandedSections(prev => ({ ...prev, people: true }));
        }
    }, [location.pathname]);

    // Books Section State (from snippet)
    const [openDropdown, setOpenDropdown] = useState(null);

    // Close dropdowns when sidebar collapses (if you have collapse functionality)
    useEffect(() => {
        if (!isOpen) {
            setOpenDropdown(null);
        }
    }, [isOpen]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleItemClick = (label, path) => {
        setActiveItem(label);
        if (path) navigate(path);
    };

    const showHomeSidebar = location.pathname === '/' || location.pathname.startsWith('/home');
    const showBooksSidebar = location.pathname.startsWith('/books') && location.pathname !== '/books/profile';
    const showFinanceSidebar = location.pathname.startsWith('/finance');
    const showPublicSidebar = location.pathname.startsWith('/public');

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <div className="brand-logo">
                    <Wallet size={20} color="white" />
                </div>
                <h2 className="app-title">Books</h2>
            </div>

            <nav className="sidebar-nav">
                {showHomeSidebar && (
                    <>
                        {/* Home Section (Dropdown) */}
                        <div className={`sidebar-item ${expandedSections.home ? 'active' : ''}`} onClick={() => toggleSection('home')} style={{ cursor: 'pointer' }}>
                            <div className="flex items-center gap-3">
                                <Home size={20} />
                                <span className="sidebar-label">Home</span>
                            </div>
                            <div className="sidebar-chevron">
                                {expandedSections.home ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        </div>

                        {/* Smooth Dropdown Animation for Home */}
                        <div
                            style={{
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                maxHeight: expandedSections.home ? '500px' : '0',
                                opacity: expandedSections.home ? 1 : 0
                            }}
                        >
                            <div className="sidebar-subgroup">
                                <button className={`sidebar-item level-1 ${activeItem === 'Dashboard' ? 'active' : ''}`} onClick={() => handleItemClick('Dashboard', '/home')}>
                                    <div className="flex items-center gap-3"><LayoutDashboard size={18} /><span className="sidebar-label">Dashboard</span></div>
                                </button>
                                <button className={`sidebar-item level-1 ${activeItem === 'Reports' ? 'active' : ''}`} onClick={() => handleItemClick('Reports')}>
                                    <div className="flex items-center gap-3"><FileText size={18} /><span className="sidebar-label">Reports</span></div>
                                </button>
                                <button className={`sidebar-item level-1 ${activeItem === 'Statistics' ? 'active' : ''}`} onClick={() => handleItemClick('Statistics')}>
                                    <div className="flex items-center gap-3"><BarChart3 size={18} /><span className="sidebar-label">Statistics</span></div>
                                </button>
                            </div>
                        </div>

                        {/* Standard Home Items */}
                        {[
                            { icon: TrendingUp, label: 'Income', path: '/home/income' },
                            { icon: TrendingDown, label: 'Expenses', path: '/home/expenses' },
                            { icon: Wallet, label: 'Budgets', path: '/home/budgets' },
                            { icon: CreditCard, label: 'Accounts', path: '/home/accounts' },
                            { icon: CalendarClock, label: 'Planned payments', path: '/home/planned-payments' },
                            { icon: PiggyBank, label: 'Savings', path: '/home/savings' },
                            { icon: LineChart, label: 'Investments', path: '/home/investments' },
                            { icon: Banknote, label: 'Debts', path: '/home/debts' }
                        ].map(item => (
                            <button
                                key={item.label}
                                className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.label, item.path)}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span className="sidebar-label">{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </>
                )}

                {showBooksSidebar && (
                    <>
                        {/* Stock */}
                        <button
                            className={`sidebar-item ${activeItem === 'Stock' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Stock', '/books/stock')}
                        >
                            <div className="flex items-center gap-3">
                                <TrendingUp size={20} style={{ color: '#195BAC' }} />
                                <span className="sidebar-label">Stock</span>
                            </div>
                        </button>

                        {/* Financial Plan Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('financial')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'financial' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Wallet size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Financial Plan</span>
                                </div>
                                {openDropdown === 'financial' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            {/* Smooth Dropdown Animation */}
                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'financial' ? '400px' : '0',
                                    opacity: openDropdown === 'financial' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Budget' ? 'active' : ''}`} onClick={() => handleItemClick('Budget', '/books/plan/budget')}>
                                        <div className="flex items-center gap-3"><DollarSign size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Budget</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Income' ? 'active' : ''}`} onClick={() => handleItemClick('Income', '/books/plan/income')}>
                                        <div className="flex items-center gap-3"><ArrowLeftRight size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Income</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Expense' ? 'active' : ''}`} onClick={() => handleItemClick('Expense', '/books/plan/expense')}>
                                        <div className="flex items-center gap-3"><ShoppingCart size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Expense</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Financial Calendar' ? 'active' : ''}`} onClick={() => handleItemClick('Financial Calendar', '/books/plan/calendar')}>
                                        <div className="flex items-center gap-3"><Calendar size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Financial Calendar</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Savings & Goals' ? 'active' : ''}`} onClick={() => handleItemClick('Savings & Goals', '/books/plan/goals')}>
                                        <div className="flex items-center gap-3"><Target size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Savings & Goals</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Reminders' ? 'active' : ''}`} onClick={() => handleItemClick('Reminders', '/books/plan/reminders')}>
                                        <div className="flex items-center gap-3"><Bell size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Reminders</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Analysis' ? 'active' : ''}`} onClick={() => handleItemClick('Analysis', '/books/plan/analysis')}>
                                        <div className="flex items-center gap-3"><BarChart3 size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Analysis</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* People Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('people')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'people' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Users size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">People</span>
                                </div>
                                {openDropdown === 'people' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            {/* Smooth Dropdown Animation */}
                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'people' ? '300px' : '0',
                                    opacity: openDropdown === 'people' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Overview' ? 'active' : ''}`} onClick={() => handleItemClick('Overview', '/books/people/overview')}>
                                        <div className="flex items-center gap-3"><Eye size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Overview</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Transactions' ? 'active' : ''}`} onClick={() => handleItemClick('Transactions', '/books/people/transactions')}>
                                        <div className="flex items-center gap-3"><Receipt size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Transactions</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'PeopleReminders' ? 'active' : ''}`} onClick={() => handleItemClick('PeopleReminders', '/books/people/reminders')}>
                                        <div className="flex items-center gap-3"><Bell size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Reminders</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Records' ? 'active' : ''}`} onClick={() => handleItemClick('Records', '/books/people/records')}>
                                        <div className="flex items-center gap-3"><BookOpen size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Records</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Other Items */}
                        <button
                            className={`sidebar-item ${activeItem === 'Financial Contacts' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Financial Contacts', '/books/contacts')}
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={20} style={{ color: '#195BAC' }} />
                                <span className="sidebar-label">Financial Contacts</span>
                            </div>
                        </button>
                        <button
                            className={`sidebar-item ${activeItem === 'Segregation' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Segregation', '/books/segregation')}
                        >
                            <div className="flex items-center gap-3">
                                <Layers size={20} style={{ color: '#195BAC' }} />
                                <span className="sidebar-label">Segregation</span>
                            </div>
                        </button>
                        <button
                            className={`sidebar-item ${activeItem === 'Split Expense' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Split Expense', '/books/split-expense')}
                        >
                            <div className="flex items-center gap-3">
                                <Split size={20} style={{ color: '#195BAC' }} />
                                <span className="sidebar-label">Split Expense</span>
                            </div>
                        </button>
                    </>
                )}

                {showFinanceSidebar && (
                    <>
                        {/* Transfers & Payments Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('transfers')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'transfers' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <ArrowLeftRight size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Transfers & Payments</span>
                                </div>
                                {openDropdown === 'transfers' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'transfers' ? '200px' : '0',
                                    opacity: openDropdown === 'transfers' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Bank & Self Transfer' ? 'active' : ''}`} onClick={() => handleItemClick('Bank & Self Transfer')}>
                                        <div className="flex items-center gap-3"><Send size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Bank & Self Transfer</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Split & Collect' ? 'active' : ''}`} onClick={() => handleItemClick('Split & Collect')}>
                                        <div className="flex items-center gap-3"><Users size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Split & Collect</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Salary Funds' ? 'active' : ''}`} onClick={() => handleItemClick('Salary Funds')}>
                                        <div className="flex items-center gap-3"><Wallet size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Salary Funds</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Accounts & Banking Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('accounts')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'accounts' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Accounts & Banking</span>
                                </div>
                                {openDropdown === 'accounts' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'accounts' ? '150px' : '0',
                                    opacity: openDropdown === 'accounts' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Banking' ? 'active' : ''}`} onClick={() => handleItemClick('Banking')}>
                                        <div className="flex items-center gap-3"><Landmark size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Banking</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Balance & History' ? 'active' : ''}`} onClick={() => handleItemClick('Balance & History')}>
                                        <div className="flex items-center gap-3"><History size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Balance & History</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bills, Tax & Penalties Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('bills')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'bills' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Bills, Tax & Penalties</span>
                                </div>
                                {openDropdown === 'bills' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'bills' ? '250px' : '0',
                                    opacity: openDropdown === 'bills' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Bills' ? 'active' : ''}`} onClick={() => handleItemClick('Bills')}>
                                        <div className="flex items-center gap-3"><Receipt size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Bills</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Recharge' ? 'active' : ''}`} onClick={() => handleItemClick('Recharge')}>
                                        <div className="flex items-center gap-3"><Smartphone size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Recharge</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Pay Tax' ? 'active' : ''}`} onClick={() => handleItemClick('Pay Tax')}>
                                        <div className="flex items-center gap-3"><FileCheck size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Pay Tax</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Fines & Challans' ? 'active' : ''}`} onClick={() => handleItemClick('Fines & Challans')}>
                                        <div className="flex items-center gap-3"><AlertCircle size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Fines & Challans</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Savings, Loans & Insurance Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('savings')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'savings' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <PiggyBank size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Savings & Credit</span>
                                </div>
                                {openDropdown === 'savings' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'savings' ? '250px' : '0',
                                    opacity: openDropdown === 'savings' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Saving' ? 'active' : ''}`} onClick={() => handleItemClick('Saving')}>
                                        <div className="flex items-center gap-3"><TrendingUp size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Saving</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Loan' ? 'active' : ''}`} onClick={() => handleItemClick('Loan')}>
                                        <div className="flex items-center gap-3"><Banknote size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Loan</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Insurance' ? 'active' : ''}`} onClick={() => handleItemClick('Insurance')}>
                                        <div className="flex items-center gap-3"><Shield size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Insurance</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'CIBIL' ? 'active' : ''}`} onClick={() => handleItemClick('CIBIL')}>
                                        <div className="flex items-center gap-3"><BarChart3 size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">CIBIL</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* Rewards & Benefits Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('rewards')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'rewards' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Gift size={20} style={{ color: '#195BAC' }} />
                                    <span className="sidebar-label">Rewards & Benefits</span>
                                </div>
                                {openDropdown === 'rewards' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'rewards' ? '250px' : '0',
                                    opacity: openDropdown === 'rewards' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'Rewards' ? 'active' : ''}`} onClick={() => handleItemClick('Rewards')}>
                                        <div className="flex items-center gap-3"><Tag size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Rewards</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Offers' ? 'active' : ''}`} onClick={() => handleItemClick('Offers')}>
                                        <div className="flex items-center gap-3"><Gift size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Offers</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Refer & Earn' ? 'active' : ''}`} onClick={() => handleItemClick('Refer & Earn')}>
                                        <div className="flex items-center gap-3"><UserPlus size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Refer & Earn</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Donation' ? 'active' : ''}`} onClick={() => handleItemClick('Donation')}>
                                        <div className="flex items-center gap-3"><Heart size={16} style={{ color: '#195BAC' }} /><span className="sidebar-label">Donation</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showPublicSidebar && (
                    <>
                        {/* Trading Dropdown */}
                        <div className="mb-1">
                            <div
                                onClick={() => toggleDropdown('trading')}
                                className="sidebar-item"
                                style={{ cursor: 'pointer', backgroundColor: openDropdown === 'trading' ? '#F8FAFC' : 'transparent' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Bitcoin size={20} style={{ color: '#F59E0B' }} />
                                    <span className="sidebar-label">Trading</span>
                                </div>
                                {openDropdown === 'trading' ? (
                                    <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={16} className="text-gray-500" />
                                )}
                            </div>

                            <div
                                style={{
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                    maxHeight: openDropdown === 'trading' ? '250px' : '0',
                                    opacity: openDropdown === 'trading' ? 1 : 0
                                }}
                            >
                                <div className="ml-4 mt-1 space-y-1">
                                    <button className={`sidebar-item ${activeItem === 'SIP' ? 'active' : ''}`} onClick={() => handleItemClick('SIP', '/public?page=trading-sip')}>
                                        <div className="flex items-center gap-3"><TrendingUp size={16} style={{ color: '#F59E0B' }} /><span className="sidebar-label">SIP</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Mutual Funds' ? 'active' : ''}`} onClick={() => handleItemClick('Mutual Funds', '/public?page=trading-mutual-funds')}>
                                        <div className="flex items-center gap-3"><PiggyBank size={16} style={{ color: '#F59E0B' }} /><span className="sidebar-label">Mutual Funds</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Crypto' ? 'active' : ''}`} onClick={() => handleItemClick('Crypto', '/public?page=trading-crypto')}>
                                        <div className="flex items-center gap-3"><Bitcoin size={16} style={{ color: '#F59E0B' }} /><span className="sidebar-label">Crypto</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Bitcoin' ? 'active' : ''}`} onClick={() => handleItemClick('Bitcoin', '/public?page=trading-bitcoin')}>
                                        <div className="flex items-center gap-3"><Bitcoin size={16} style={{ color: '#F59E0B' }} /><span className="sidebar-label">Bitcoin</span></div>
                                    </button>
                                    <button className={`sidebar-item ${activeItem === 'Overall Trading' ? 'active' : ''}`} onClick={() => handleItemClick('Overall Trading', '/public?page=trading-overall')}>
                                        <div className="flex items-center gap-3"><LineChart size={16} style={{ color: '#F59E0B' }} /><span className="sidebar-label">Overall Trading</span></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Investors */}
                        <button
                            className={`sidebar-item ${activeItem === 'Investors' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Investors', '/public?page=investors')}
                        >
                            <div className="flex items-center gap-3">
                                <UsersRound size={20} style={{ color: '#8B5CF6' }} />
                                <span className="sidebar-label">Investors</span>
                            </div>
                        </button>

                        {/* Games */}
                        <button
                            className={`sidebar-item ${activeItem === 'Games' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Games', '/public?page=games')}
                        >
                            <div className="flex items-center gap-3">
                                <Gamepad2 size={20} style={{ color: '#10B981' }} />
                                <span className="sidebar-label">Games</span>
                            </div>
                        </button>

                        {/* Meetup */}
                        <button
                            className={`sidebar-item ${activeItem === 'Meetup' ? 'active' : ''}`}
                            onClick={() => handleItemClick('Meetup', '/public?page=meetup')}
                        >
                            <div className="flex items-center gap-3">
                                <Handshake size={20} style={{ color: '#EC4899' }} />
                                <span className="sidebar-label">Meetup</span>
                            </div>
                        </button>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button
                    className={`sidebar-item ${activeItem === 'Settings' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Settings')}
                >
                    <div className="flex items-center gap-3">
                        <Settings size={20} style={{ color: showBooksSidebar ? '#195BAC' : 'inherit' }} />
                        <span className="sidebar-label">Settings</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
