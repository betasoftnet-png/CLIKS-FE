import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarClock,
    Plus,
    DollarSign,
    AlertCircle,
    Clock,
    Edit2,
    Trash2,
    Home,
    Shield,
    Wifi,
    Activity,
    CreditCard,
    X,
    RefreshCw,
    ShoppingBag,
    Zap,
} from 'lucide-react';
import '../App.css';
import '../styles/modals.css';

const CATEGORIES = ['Housing', 'Insurance', 'Credit', 'Utilities', 'Health', 'Entertainment', 'Transport', 'Subscriptions', 'Other'];

const ICON_OPTIONS = [
    { label: 'Housing',        value: 'home',     Icon: Home       },
    { label: 'Insurance',      value: 'shield',   Icon: Shield     },
    { label: 'Internet / WiFi',value: 'wifi',     Icon: Wifi       },
    { label: 'Health / Gym',   value: 'activity', Icon: Activity   },
    { label: 'Credit Card',    value: 'card',     Icon: CreditCard },
    { label: 'Shopping',       value: 'shopping', Icon: ShoppingBag},
    { label: 'Utilities',      value: 'zap',      Icon: Zap        },
];

const EMPTY_FORM = { title: '', category: '', amount: '', dueDate: '', recurring: false, iconValue: 'home' };

const PaymentStat = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="payment-stat-card">
        <div className="flex justify-between items-start">
            <div>
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
            </div>
            <div className={`stat-icon-wrapper ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="stat-subtext">{subtext}</p>
    </div>
);

const PlannedPayments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData]       = useState(EMPTY_FORM);
    const [formError, setFormError]     = useState('');

    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem('books_payments');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Rent Payment',       amount: 1500, dueDate: '2026-02-01', status: 'upcoming',  category: 'Housing',   recurring: true,  iconValue: 'home'     },
            { id: 2, title: 'Car Insurance',       amount:  250, dueDate: '2026-01-25', status: 'due-soon',  category: 'Insurance', recurring: true,  iconValue: 'shield'   },
            { id: 3, title: 'Credit Card Payment', amount:  800, dueDate: '2026-01-22', status: 'overdue',   category: 'Credit',    recurring: false, iconValue: 'card'     },
            { id: 4, title: 'Internet Bill',       amount:   80, dueDate: '2026-01-28', status: 'upcoming',  category: 'Utilities', recurring: true,  iconValue: 'wifi'     },
            { id: 5, title: 'Gym Membership',      amount:   60, dueDate: '2026-02-05', status: 'upcoming',  category: 'Health',    recurring: true,  iconValue: 'activity' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('books_payments', JSON.stringify(payments));
    }, [payments]);

    const openModal = () => {
        setFormData(EMPTY_FORM);
        setFormError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.category || !formData.amount || !formData.dueDate) {
            setFormError('Payment name, category, amount and due date are required.');
            return;
        }

        const today = new Date();
        const due   = new Date(formData.dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        let status = 'upcoming';
        if (diffDays < 0)       status = 'overdue';
        else if (diffDays <= 5) status = 'due-soon';

        const newPayment = {
            id: Date.now(),
            title: formData.title,
            category: formData.category,
            amount: parseFloat(formData.amount),
            dueDate: formData.dueDate,
            recurring: formData.recurring,
            status,
            iconValue: formData.iconValue,
        };

        setPayments((prev) => [...prev, newPayment]);
        closeModal();
    };

    const handleDelete = (id) => {
        setPayments((prev) => prev.filter((p) => p.id !== id));
    };

    const totalPlanned     = payments.reduce((s, p) => s + p.amount, 0);
    const overduePayments  = payments.filter(p => p.status === 'overdue');
    const upcomingPayments = payments.filter(p => p.status === 'upcoming' || p.status === 'due-soon');

    const getStatusStyle = (s) => ({ overdue: 'status-overdue', 'due-soon': 'status-due-soon' }[s] || 'status-upcoming');
    const getStatusLabel = (s) => ({ overdue: 'Overdue', 'due-soon': 'Due Soon' }[s] || 'Upcoming');

    const getIcon = (iconValue) => {
        const match = ICON_OPTIONS.find((o) => o.value === iconValue);
        return match ? match.Icon : Home;
    };

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <p className="text-muted text-sm mt-1">Track and manage your upcoming bills</p>
                </div>
                <button className="btn-primary" onClick={openModal}>
                    <Plus size={18} />
                    <span>Add Payment</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats */}
                <div className="payment-stats-grid">
                    <PaymentStat label="Total Planned" value={`$${totalPlanned.toLocaleString()}`}    subtext="For this month"   icon={DollarSign}  colorClass="icon-blue"  />
                    <PaymentStat label="Overdue"        value={overduePayments.length}                 subtext="Needs attention"  icon={AlertCircle} colorClass="icon-red"   />
                    <PaymentStat label="Upcoming"       value={upcomingPayments.length}                subtext="Next 30 days"     icon={CalendarClock} colorClass="icon-green" />
                </div>

                {/* Payments List */}
                <div className="card-container">
                    <h2 className="section-title">Schedule</h2>

                    <div className="payments-list">
                        {payments
                            .slice()
                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                            .map((payment) => {
                                const PayIcon = getIcon(payment.iconValue);
                                return (
                                    <div key={payment.id} className="payment-row">
                                        <div className="payment-left">
                                            <div className="payment-icon-box">
                                                <PayIcon size={20} />
                                            </div>
                                            <div className="payment-info">
                                                <h3 className="payment-name">{payment.title}</h3>
                                                <div className="payment-meta">
                                                    <span>{payment.category}</span>
                                                    {payment.recurring && (
                                                        <>
                                                            <span className="dot">•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} /> Recurring
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="payment-center">
                                            <div className={`status-badge ${getStatusStyle(payment.status)}`}>
                                                {getStatusLabel(payment.status)}
                                            </div>
                                            <div className={`date-text ${payment.status === 'overdue' ? 'text-red' : ''}`}>
                                                Due {new Date(payment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="payment-right">
                                            <div className="amount-text">${payment.amount.toLocaleString()}</div>
                                            <div className="actions-group">
                                                <button className="btn-icon-soft" title="Delete" onClick={() => handleDelete(payment.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="btn-pay">Pay</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* ── Add Payment Modal ── */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            className="modal-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="modal-header">
                                <h2 className="modal-title">Add Payment</h2>
                                <button className="modal-close-btn" onClick={closeModal}><X size={16} /></button>
                            </div>

                            <form className="modal-form" onSubmit={handleSubmit}>
                                <div className="modal-field">
                                    <label className="modal-label">Payment Name</label>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        placeholder="e.g. Internet Bill"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="modal-field">
                                    <label className="modal-label">Category</label>
                                    <select
                                        className="modal-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-row">
                                    <div className="modal-field">
                                        <label className="modal-label">Amount ($)</label>
                                        <input
                                            type="number"
                                            className="modal-input"
                                            placeholder="0"
                                            min="0"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label className="modal-label">Due Date</label>
                                        <input
                                            type="date"
                                            className="modal-input"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="modal-field">
                                    <label className="modal-label">Icon</label>
                                    <select
                                        className="modal-select"
                                        value={formData.iconValue}
                                        onChange={(e) => setFormData({ ...formData, iconValue: e.target.value })}
                                    >
                                        {ICON_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-toggle-row">
                                    <span className="modal-toggle-label">Recurring payment</span>
                                    <button
                                        type="button"
                                        className={`toggle-track ${formData.recurring ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, recurring: !formData.recurring })}
                                    >
                                        <span className="toggle-thumb" />
                                    </button>
                                </div>

                                {formError && <p className="modal-error">{formError}</p>}

                                <div className="modal-footer">
                                    <button type="button" className="modal-btn-cancel" onClick={closeModal}>Cancel</button>
                                    <button type="submit" className="modal-btn-submit">Add Payment</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .payment-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .payment-stat-card {
                    background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
                .stat-subtext { font-size: 0.8rem; font-weight: 500; color: var(--text-muted); }
                
                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-blue { background: #DBEAFE; color: #2563EB; }
                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-red { background: #FEE2E2; color: #EF4444; }

                .card-container {
                    background: white; border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem;
                }
                .section-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 1.5rem; }

                .payments-list { display: flex; flex-direction: column; gap: 1rem; }
                .payment-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1rem; border: 1px solid var(--border-color); border-radius: 12px;
                    transition: all 0.2s;
                }
                .payment-row:hover { background: #F8FAFC; border-color: #CBD5E1; }

                .payment-left { display: flex; align-items: center; gap: 1rem; flex: 1.5; }
                .payment-icon-box { width: 40px; height: 40px; background: #F1F5F9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
                .payment-name { font-weight: 600; color: var(--text-main); font-size: 0.95rem; }
                .payment-meta { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
                .dot { font-size: 1.2rem; line-height: 0; }

                .payment-center { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; }
                .status-badge { font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 99px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
                .status-overdue { background: #FEE2E2; color: #DC2626; }
                .status-due-soon { background: #FFEDD5; color: #C2410C; }
                .status-upcoming { background: #EFF6FF; color: #2563EB; }
                .date-text { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
                .text-red { color: #DC2626; }

                .payment-right { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 2rem; }
                .amount-text { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
                .actions-group { display: flex; align-items: center; gap: 0.75rem; }
                
                .btn-icon-soft { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: var(--text-muted); transition: all 0.2s; }
                .btn-icon-soft:hover { background: #FEE2E2; color: #DC2626; }
                
                .btn-pay { 
                    padding: 0.4rem 1rem; background: var(--primary); color: white; 
                    border-radius: 8px; font-size: 0.85rem; font-weight: 600; 
                    transition: background 0.2s; 
                }
                .btn-pay:hover { background: var(--primary-hover); }

                @media (max-width: 768px) {
                    .payment-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .payment-right { width: 100%; justify-content: space-between; }
                    .payment-center { width: 100%; flex-direction: row; justify-content: space-between; align-items: center; }
                }
            `}</style>
        </div>
    );
};

export default PlannedPayments;
