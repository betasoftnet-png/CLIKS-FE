import React, { useState, useRef, useEffect } from 'react';
import {
    Plus,
    User,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Target,
    History,
    TrendingUp,
    TrendingDown,
    Building2,
    FileText,
    PiggyBank,
    Gift,
    X,
    Trash2,
    AlertTriangle,
    LayoutGrid,
    LineChart
} from 'lucide-react';
import '../../App.css';
import { formatCurrency } from '../../lib/formatCurrency';
import AnalyticsSection from '../../components/AnalyticsSection';
import BudgetMixTile from '../../components/dashboard/BudgetMixTile';
import SplitBillsTile from '../../components/dashboard/SplitBillsTile';
import TheSquadTile from '../../components/dashboard/TheSquadTile';
import MarketPulseTile from '../../components/dashboard/MarketPulseTile';
import MoneyGoalsTile from '../../components/dashboard/MoneyGoalsTile';

// Fix for potential ReferenceError in stale builds or cached components
const StatsCard = () => null;

const AccountCard = ({ name, amount, color, icon: Icon }) => (
    <div className="account-card" style={{ backgroundColor: color }}>
        <div className="account-icon">
            <Icon size={24} />
        </div>
        <div className="account-details">
            <div className="account-name">{name}</div>
            <div className="account-amount">{formatCurrency(amount)}</div>
        </div>
    </div>
);

const DonutChart = ({ label, value, colorClass, percent = 75, icon: Icon }) => (
    <div className="circular-chart-container">
        <div className="relative">
            <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                    className="circle-bg"
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    className={`circle-progress ${colorClass}`}
                    strokeDasharray={`${percent}, 100`}
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
            {Icon && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={20} />
                </div>
            )}
        </div>

        <div className="chart-label">{label}</div>
        <div className="chart-value">{value}</div>
    </div>
);

const DashboardTile = ({ title, icon: Icon, children, className = '', onRemove, style }) => {
    const [expanded, setExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    return (
        <div className={`dashboard-tile ${expanded ? 'expanded' : ''} ${className}`} style={style}>
            {title && (
                <div className="tile-header">
                    <div className="tile-title">
                        {Icon && <Icon size={18} className="text-muted" />}
                        <span>{title}</span>
                    </div>
                    <div className="flex gap-2 relative" ref={menuRef}>
                        <button
                            className="icon-btn hover:bg-gray-100"
                            onClick={handleMenuClick}
                        >
                            <MoreVertical size={16} />
                        </button>

                        {menuOpen && (
                            <div className="tile-menu-dropdown">
                                <button className="tile-menu-item danger" onClick={() => { onRemove(); setMenuOpen(false); }}>
                                    <Trash2 size={14} />
                                    Remove tile
                                </button>
                                <button className="tile-menu-item" onClick={() => { alert('Issue reported!'); setMenuOpen(false); }}>
                                    <AlertTriangle size={14} />
                                    Report issue !
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!title && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }} ref={menuRef}>
                    <button
                        className="icon-btn hover:bg-gray-100"
                        onClick={handleMenuClick}
                    >
                        <MoreVertical size={16} />
                    </button>
                    {menuOpen && (
                        <div className="tile-menu-dropdown">
                            <button className="tile-menu-item danger" onClick={() => { onRemove(); setMenuOpen(false); }}>
                                <Trash2 size={14} />
                                Remove tile
                            </button>
                            <button className="tile-menu-item" onClick={() => { alert('Issue reported!'); setMenuOpen(false); }}>
                                <AlertTriangle size={14} />
                                Report issue !
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="tile-content" style={{ padding: title ? '1.25rem' : '0' }}>
                {children}
            </div>
            <div
                className="tile-footer"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? "Collapse" : "Expand"}
            >
                <div className="expand-handle"></div>
            </div>
        </div>
    );
};

const AddWidgetModal = ({ isOpen, onClose, widgets, activeWidgets, onAddWidget }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={24} className="text-primary" />
                        <h2 className="modal-title">Add Widget</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {widgets.map(widget => {
                        const isActive = activeWidgets.includes(widget.id);
                        const WidgetIcon = widget.icon || LayoutGrid;

                        return (
                            <div
                                key={widget.id}
                                className={`widget-option ${isActive ? 'disabled' : ''}`}
                                onClick={() => !isActive && onAddWidget(widget.id)}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '10px',
                                    background: '#F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748B'
                                }}>
                                    <WidgetIcon size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{widget.title || widget.id}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                        {isActive ? 'Already added to dashboard' : 'Click to add to dashboard'}
                                    </div>
                                </div>
                                {isActive ? (
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981', background: '#DCFCE7', padding: '0.25rem 0.5rem', borderRadius: '999px' }}>
                                        Added
                                    </div>
                                ) : (
                                    <button style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#EFF6FF',
                                        color: '#3B82F6',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ConfirmRemoveModal = ({ isOpen, onClose, onConfirm, widgetName }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={24} />
                        <h2 className="modal-title">Remove Tile</h2>
                    </div>
                </div>
                <div className="modal-body">
                    <p style={{ color: '#64748B', lineHeight: '1.5' }}>
                        Do you want to remove the <strong>{widgetName}</strong> tile?
                    </p>
                    <div className="flex gap-3 justify-end mt-4">
                        <button
                            className="btn-secondary"
                            style={{
                                background: '#F1F5F9',
                                color: '#64748B',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                            onClick={onClose}
                        >
                            No
                        </button>
                        <button
                            className="btn-danger"
                            style={{
                                background: '#EF4444',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                            onClick={onConfirm}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BooksDashboard = () => {
    const [activeWidgets, setActiveWidgets] = useState(['market', 'budget', 'goals', 'split', 'squad']);
    const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
    const [widgetToRemove, setWidgetToRemove] = useState(null);

    const ALL_WIDGETS = [
        {
            id: 'market',
            title: null,
            icon: LineChart,
            className: '',
            style: { gridColumn: 'span 2', gridRow: 'span 1', minHeight: '190px' }
        },
        {
            id: 'budget',
            title: 'Budget',
            icon: null,
            className: '',
            style: { gridColumn: 'span 1', gridRow: 'span 1' }
        },
        {
            id: 'goals',
            title: null,
            icon: null,
            className: '',
            style: { gridColumn: 'span 1', gridRow: 'span 1' }
        },
        {
            id: 'split',
            title: 'Split Bills',
            icon: null,
            className: '',
            style: { gridColumn: 'span 1', gridRow: 'span 1' }
        },
        {
            id: 'squad',
            title: 'Financial Contacts',
            icon: null,
            className: '',
            style: { gridColumn: 'span 1', gridRow: 'span 1' }
        },
        {
            id: 'overview',
            title: 'Financial Overview',
            icon: Target,
            className: '',
            style: { gridColumn: 'span 1', gridRow: 'span 1' }
        },
        {
            id: 'transactions',
            title: 'Recent Transactions',
            icon: History,
            className: '',
            style: { gridColumn: 'span 2', gridRow: 'span 1' }
        },
    ];

    const addWidget = (id) => {
        if (!activeWidgets.includes(id)) {
            setActiveWidgets([...activeWidgets, id]);
            setIsAddWidgetOpen(false);
        }
    };

    const initiateRemoveWidget = (id) => {
        setWidgetToRemove(id);
    };

    const confirmRemoveWidget = () => {
        if (widgetToRemove) {
            setActiveWidgets(activeWidgets.filter(w => w !== widgetToRemove));
            setWidgetToRemove(null);
        }
    };

    const renderWidget = (id) => {
        switch (id) {
            case 'market': return <MarketPulseTile />;
            case 'goals': return <MoneyGoalsTile />;
            case 'overview':
                return (
                    <div className="gauges-container">
                        <DonutChart label="Balance" value={formatCurrency(50000)} colorClass="chart-success" percent={65} />
                        <DonutChart label="Cash Flow" value={formatCurrency(12000)} colorClass="chart-warning" percent={40} />
                        <DonutChart label="Spending" value={formatCurrency(5000)} colorClass="chart-danger" percent={25} />
                    </div>
                );
            case 'transactions':
                return (
                    <div className="hide-scrollbar" style={{ overflowX: 'auto', width: '100%' }}>
                        <table className="table-auto" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <th style={{ textAlign: 'left', padding: '16px', color: '#94A3B8', fontWeight: '500', fontSize: '0.85rem' }}>Type</th>
                                    <th style={{ textAlign: 'left', padding: '16px', color: '#94A3B8', fontWeight: '500', fontSize: '0.85rem' }}>Description</th>
                                    <th style={{ textAlign: 'left', padding: '16px', color: '#94A3B8', fontWeight: '500', fontSize: '0.85rem' }}>Date</th>
                                    <th style={{ textAlign: 'right', padding: '16px', color: '#94A3B8', fontWeight: '500', fontSize: '0.85rem' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { desc: 'Rare Book Purchase', date: 'Today', amount: -125.00, type: 'expense' },
                                    { desc: 'Freelance Payment', date: 'Yesterday', amount: 2450.00, type: 'income' },
                                    { desc: 'Library Subscription', date: 'Oct 24', amount: -15.00, type: 'expense' },
                                    { desc: 'Coffee & Pastry', date: 'Oct 23', amount: -8.50, type: 'expense' },
                                ].map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: item.type === 'income' ? '#DCFCE7' : '#FFE4E6',
                                                color: item.type === 'income' ? '#16A34A' : '#E11D48',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {item.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '500', color: '#1E293B' }}>
                                            {item.desc}
                                        </td>
                                        <td style={{ padding: '16px', color: '#64748B' }}>
                                            {item.date}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#1E293B' }}>
                                            {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'budget':
                return <BudgetMixTile />;
            case 'split':
                return <SplitBillsTile />;
            case 'squad':
                return <TheSquadTile />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Top Header */}
            <div className="dashboard-header" style={{ justifyContent: 'flex-end' }}>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddWidgetOpen(true)}>
                        <Plus size={16} />
                        <span>Add Widget</span>
                    </button>

                </div>
            </div>

            <div className="content-wrapper">
                {/* Accounts Row */}
                <div className="accounts-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <AccountCard
                        name="Bank 1"
                        amount={75000}
                        color="" // handled by css
                        icon={Building2}
                    />
                    <AccountCard
                        name="Locker"
                        amount={28500}
                        color="" // handled by css
                        icon={Target}
                    />

                    <button className="add-account-btn">
                        <Plus size={20} />
                        <span>Add Account</span>
                    </button>
                </div>

                {/* Dashboard Tiles Grid */}
                <div className="dashboard-grid">
                    {activeWidgets.map(widgetId => {
                        const widgetDef = ALL_WIDGETS.find(w => w.id === widgetId);
                        if (!widgetDef) return null;

                        return (
                            <DashboardTile
                                key={widgetDef.id}
                                title={widgetDef.title}
                                icon={widgetDef.icon}
                                className={widgetDef.className}
                                onRemove={() => initiateRemoveWidget(widgetDef.id)}
                                style={widgetDef.style}
                            >
                                {renderWidget(widgetDef.id)}
                            </DashboardTile>
                        );
                    })}
                </div>
            </div>

            <AddWidgetModal
                isOpen={isAddWidgetOpen}
                onClose={() => setIsAddWidgetOpen(false)}
                widgets={ALL_WIDGETS}
                activeWidgets={activeWidgets}
                onAddWidget={addWidget}
            />

            <ConfirmRemoveModal
                isOpen={!!widgetToRemove}
                onClose={() => setWidgetToRemove(null)}
                onConfirm={confirmRemoveWidget}
                widgetName={ALL_WIDGETS.find(w => w.id === widgetToRemove)?.title || widgetToRemove}
            />
        </>
    );
};

export default BooksDashboard;
