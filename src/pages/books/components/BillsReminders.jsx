import React, { useState, useMemo } from 'react';
import { Calendar, AlertTriangle, Bell, Plus, Trash2, Repeat, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plannedPaymentsService } from '../../../services';

/**
 * Format a YYYY-MM-DD or ISO string into "DD MMM YYYY" (e.g. "30 Nov 2026")
 */
const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'No date';
    try {
        const parts = String(dateStr).split('T')[0].split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            if (!isNaN(day) && monthIdx >= 0 && monthIdx < 12 && !isNaN(year)) {
                return `${day} ${months[monthIdx]} ${year}`;
            }
        }
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    } catch {
        // Fallback below
    }
    return dateStr;
};

/**
 * Get user's current date string in local timezone YYYY-MM-DD
 */
const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const BillsReminders = ({ bills = [], onUpdateBills, currencySymbol = '₹', plannedPayments = [] }) => {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '', repeat: 'Monthly' });

    // Mutation to mark a scheduled payment as completed/paid
    const markPaidMutation = useMutation({
        mutationFn: (id) => plannedPaymentsService.markAsPaid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
        }
    });

    const handleAddBill = (e) => {
        e.preventDefault();
        if (!newBill.name.trim() || !newBill.amount || !newBill.dueDate) return;

        const bill = {
            id: Date.now(),
            name: newBill.name,
            amount: parseFloat(newBill.amount) || 0,
            dueDate: newBill.dueDate,
            repeat: newBill.repeat,
            status: 'Pending'
        };

        onUpdateBills([...bills, bill]);
        setNewBill({ name: '', amount: '', dueDate: '', repeat: 'Monthly' });
        setShowAddForm(false);
    };

    const handleDeleteBill = (id) => {
        onUpdateBills(bills.filter(b => b.id !== id));
    };

    const handleToggleStatus = (id) => {
        const updated = bills.map(b => {
            if (b.id === id) {
                return { ...b, status: b.status === 'Paid' ? 'Pending' : 'Paid' };
            }
            return b;
        });
        onUpdateBills(updated);
    };

    // Process and merge Payment Planner scheduled payments into Bills & Reminders
    const mergedList = useMemo(() => {
        const todayStr = getLocalDateString();

        // 1. Convert manual bills
        const manualItems = (bills || []).map(bill => {
            const rawDue = bill.dueDate ? String(bill.dueDate).split('T')[0] : '';
            let status = 'Pending';
            if (bill.status === 'Paid') {
                status = 'Paid';
            } else if (rawDue === todayStr) {
                status = 'Due Today';
            } else if (rawDue < todayStr) {
                status = 'Overdue';
            } else {
                status = 'Upcoming';
            }

            return {
                id: bill.id,
                isPlanner: false,
                name: bill.name,
                amount: parseFloat(bill.amount) || 0,
                dueDate: rawDue,
                displayDate: formatDisplayDate(rawDue),
                repeat: bill.repeat || 'Monthly',
                paymentType: 'To Pay',
                direction: 'SEND',
                status,
                rawItem: bill
            };
        });

        // 2. Filter and convert Payment Planner scheduled payments
        const plannerItems = [];
        (plannedPayments || []).forEach(plan => {
            const rawStatus = String(plan.status || 'PENDING').toLowerCase().trim();
            // Exclude completed/paid/received and cancelled payments
            if (
                rawStatus === 'paid' || 
                rawStatus === 'completed' || 
                rawStatus === 'received' || 
                rawStatus === 'settled' || 
                rawStatus === 'cancelled' || 
                rawStatus === 'canceled'
            ) {
                return;
            }

            // Determine payment direction: SEND vs RECEIVE
            const dir = String(plan.direction || plan.type || plan.entry_type || plan.flow || '').toUpperCase();
            const isReceive = 
                dir === 'RECEIVE' || 
                dir === 'INWARD' || 
                dir === 'INCOMING' || 
                dir === 'IN' || 
                plan.is_receive === true || 
                String(plan.flow || '').toLowerCase() === 'in';

            const paymentType = isReceive ? 'To Receive' : 'To Pay';
            const rawDate = plan.scheduledDate || plan.due_date || plan.date;
            const dueDateStr = rawDate ? String(rawDate).split('T')[0] : '';
            if (!dueDateStr) return;

            // Determine status based on scheduled date vs today
            let status = 'Upcoming';
            if (dueDateStr === todayStr) {
                status = 'Due Today';
            } else if (dueDateStr < todayStr) {
                status = 'Overdue';
            } else {
                status = 'Upcoming';
            }

            // Only due and overdue scheduled payments should appear in Bills & Reminders
            if (status !== 'Due Today' && status !== 'Overdue') {
                return;
            }

            const rawAmt = plan.amount ?? plan.value ?? plan.total_amount ?? 0;
            const amount = typeof rawAmt === 'string'
                ? parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0
                : Number(rawAmt) || 0;

            plannerItems.push({
                id: `planner-${plan.id}`,
                plannerId: plan.id,
                isPlanner: true,
                name: plan.referenceName || plan.name || plan.title || 'Scheduled Payment',
                amount,
                dueDate: dueDateStr,
                displayDate: formatDisplayDate(dueDateStr),
                repeat: plan.recurring ? (plan.frequency || 'Recurring') : 'One-time',
                paymentType,
                direction: isReceive ? 'RECEIVE' : 'SEND',
                status,
                rawItem: plan
            });
        });

        // Combine and sort by due date ascending (most urgent first)
        return [...manualItems, ...plannerItems].sort((a, b) => {
            if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
            if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
            if (a.status === 'Due Today' && b.status !== 'Due Today') return -1;
            if (b.status === 'Due Today' && a.status !== 'Due Today') return 1;
            return (a.dueDate || '').localeCompare(b.dueDate || '');
        });
    }, [bills, plannedPayments]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid':
                return { background: '#D1FAE5', color: '#065F46' };
            case 'Due Today':
                return { background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' };
            case 'Overdue':
                return { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' };
            default:
                return { background: '#F1F5F9', color: '#475569' };
        }
    };

    const overdueCount = mergedList.filter(b => b.status === 'Overdue').length;
    const dueTodayCount = mergedList.filter(b => b.status === 'Due Today').length;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.359rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #E2E8F0',
            marginBottom: '1.359rem'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem', flexWrap: 'wrap', gap: '0.68rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
                    <h3 data-tour="accounting-bills-reminders" style={{ fontSize: '0.997rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.453rem', margin: 0, width: 'fit-content' }}>
                        <Bell size={20} style={{ color: '#7C3AED' }} /> Bills & Reminders
                    </h3>
                    {(overdueCount > 0 || dueTodayCount > 0) && (
                        <div style={{ display: 'flex', gap: '0.363rem' }}>
                            {dueTodayCount > 0 && (
                                <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.634rem', fontWeight: 800, padding: '0.136rem 0.453rem', borderRadius: '999px', border: '1px solid #FCD34D' }}>
                                    {dueTodayCount} Due Today
                                </span>
                            )}
                            {overdueCount > 0 && (
                                <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: '0.634rem', fontWeight: 800, padding: '0.136rem 0.453rem', borderRadius: '999px', border: '1px solid #FCA5A5' }}>
                                    {overdueCount} Overdue
                                </span>
                            )}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        padding: '0.408rem 0.906rem',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.707rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.227rem'
                    }}
                >
                    <Plus size={14} /> Add Bill
                </button>
            </div>

            {/* Overdue Alert Notification */}
            {overdueCount > 0 && (
                <div style={{
                    background: '#FEF2F2',
                    borderLeft: '4px solid #EF4444',
                    borderRadius: '8px',
                    padding: '0.77rem 0.906rem',
                    marginBottom: '0.906rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.68rem',
                    color: '#991B1B',
                    fontSize: '0.77rem',
                    fontWeight: 600
                }}>
                    <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                    <span>You have {overdueCount} outstanding overdue bill/payment(s) that require attention!</span>
                </div>
            )}

            {/* Add Bill Form Overlay/Panel */}
            {showAddForm && (
                <form onSubmit={handleAddBill} style={{
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                    borderRadius: '12px',
                    padding: '1.133rem',
                    marginBottom: '1.133rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.906rem'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.906rem'
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: 700, color: '#64748B', marginBottom: '0.227rem', textTransform: 'uppercase' }}>Bill Name</label>
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Server Hosting"
                                value={newBill.name}
                                onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                                style={{ width: '100%', padding: '0.453rem', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: 700, color: '#64748B', marginBottom: '0.227rem', textTransform: 'uppercase' }}>Amount</label>
                            <input 
                                type="number"
                                required
                                placeholder="e.g. 5000"
                                value={newBill.amount}
                                onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
                                style={{ width: '100%', padding: '0.453rem', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: 700, color: '#64748B', marginBottom: '0.227rem', textTransform: 'uppercase' }}>Due Date</label>
                            <input 
                                type="date"
                                required
                                value={newBill.dueDate}
                                onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })}
                                style={{ width: '100%', padding: '0.453rem', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.634rem', fontWeight: 700, color: '#64748B', marginBottom: '0.227rem', textTransform: 'uppercase' }}>Repeat Cycle</label>
                            <select
                                value={newBill.repeat}
                                onChange={e => setNewBill({ ...newBill, repeat: e.target.value })}
                                style={{ width: '100%', padding: '0.453rem', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.453rem' }}>
                        <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: '0.408rem 0.906rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer', fontSize: '0.725rem', fontWeight: 600 }}>Cancel</button>
                        <button type="submit" style={{ padding: '0.408rem 0.906rem', borderRadius: '6px', border: 'none', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', cursor: 'pointer', fontSize: '0.725rem', fontWeight: 600 }}>Create Bill</button>
                    </div>
                </form>
            )}

            {/* List */}
            {mergedList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.812rem', color: '#94A3B8', border: '1px dashed #E2E8F0', borderRadius: '12px' }}>
                    No recurring bills set up. Add your first bill reminder!
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: '0.652rem', textTransform: 'uppercase', fontWeight: 800 }}>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Reference Name</th>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Amount</th>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Payment Type</th>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Scheduled Date</th>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Repeat</th>
                                <th style={{ padding: '0.68rem 0.906rem' }}>Status</th>
                                <th style={{ padding: '0.68rem 0.906rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedList.map((item) => {
                                const badgeStyle = getStatusStyle(item.status);
                                const isReceive = item.direction === 'RECEIVE';
                                return (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #F8FAFC', fontSize: '0.743rem', fontWeight: 600, color: '#334155' }}>
                                        <td style={{ padding: '0.68rem 0.906rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                                                <span style={{ fontWeight: 750, color: '#0F172A' }}>{item.name}</span>
                                                {item.isPlanner && (
                                                    <span style={{ fontSize: '0.589rem', fontWeight: 800, background: '#EFF6FF', color: '#2563EB', padding: '0.091rem 0.363rem', borderRadius: '4px', border: '1px solid #DBEAFE' }}>
                                                        Planner
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem', color: isReceive ? '#10B981' : '#0F172A', fontWeight: 750 }}>
                                            {currencySymbol}{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.227rem',
                                                fontSize: '0.68rem',
                                                fontWeight: 800,
                                                padding: '0.181rem 0.453rem',
                                                borderRadius: '6px',
                                                background: isReceive ? '#F0FDF4' : '#FEF2F2',
                                                color: isReceive ? '#10B981' : '#EF4444',
                                                border: `1px solid ${isReceive ? '#BBF7D0' : '#FECACA'}`
                                            }}>
                                                {isReceive ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                                                {item.paymentType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem', color: item.status === 'Overdue' ? '#EF4444' : '#475569' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={13} /> {item.displayDate}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748B', fontSize: '0.707rem' }}>
                                                <Repeat size={12} /> {item.repeat}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem' }}>
                                            <span style={{
                                                padding: '0.227rem 0.453rem',
                                                borderRadius: '6px',
                                                fontSize: '0.616rem',
                                                fontWeight: 800,
                                                ...badgeStyle
                                            }}>{item.status}</span>
                                        </td>
                                        <td style={{ padding: '0.68rem 0.906rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.453rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {item.isPlanner ? (
                                                    <button 
                                                        onClick={() => markPaidMutation.mutate(item.plannerId)}
                                                        disabled={markPaidMutation.isPending}
                                                        style={{
                                                            padding: '0.272rem 0.544rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #10B981',
                                                            background: 'white',
                                                            color: '#10B981',
                                                            fontSize: '0.634rem',
                                                            fontWeight: 700,
                                                            cursor: markPaidMutation.isPending ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isReceive ? 'Mark Received' : 'Mark Paid'}
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleToggleStatus(item.id)}
                                                            style={{
                                                                padding: '0.272rem 0.544rem',
                                                                borderRadius: '6px',
                                                                border: `1px solid ${item.status === 'Paid' ? '#CBD5E1' : '#10B981'}`,
                                                                background: 'white',
                                                                color: item.status === 'Paid' ? '#64748B' : '#10B981',
                                                                fontSize: '0.634rem',
                                                                fontWeight: 700,
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {item.status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteBill(item.id)}
                                                            style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                                                            onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                                                            onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BillsReminders;
