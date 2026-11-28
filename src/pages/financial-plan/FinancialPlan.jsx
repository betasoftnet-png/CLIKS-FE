import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Calendar as CalendarIcon, 
    Plus, 
    Search, 
    Filter, 
    ArrowUpRight, 
    ArrowDownRight, 
    Clock, 
    CheckCircle2, 
    X, 
    Loader2, 
    User, 
    IndianRupee,
    Trash2,
    MoreVertical,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { plannedPaymentsService, peopleService } from '../../services';
import { customConfirm } from '../../utils/customConfirm';
import '../../App.css';
import './financial-plan-responsive.css';

const FinancialPlan = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, SEND, RECEIVE
    const filterType = activeFilter;
    const setFilterType = setActiveFilter;

    const [formData, setFormData] = useState({
        person_id: '',
        name: '', // Display name for the plan
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        type: 'SEND', // SEND or RECEIVE
        category: 'General',
        description: ''
    });

    // Queries
    const { data: plans = [], isLoading } = useQuery({
        queryKey: ['planned-payments'],
        queryFn: async () => {
            const res = await plannedPaymentsService.getPayments();
            return Array.isArray(res) ? res : (res.data || []);
        }
    });

    const { data: people = [] } = useQuery({
        queryKey: ['people-list'],
        queryFn: async () => {
            const res = await peopleService.getPeople();
            return Array.isArray(res) ? res : (res.data || res || []);
        }
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: plannedPaymentsService.createPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
            closeModal();
        }
    });

    const markPaidMutation = useMutation({
        mutationFn: plannedPaymentsService.markAsPaid,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: plannedPaymentsService.deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planned-payments'] });
        }
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            person_id: '',
            name: '',
            amount: '',
            due_date: new Date().toISOString().split('T')[0],
            type: 'SEND',
            category: 'General',
            description: ''
        });
    };

    const handleDelete = async (id) => {
        if (await customConfirm('Are you sure you want to cancel this scheduled payment?')) {
            deleteMutation.mutate(id);
        }
    };

    const metrics = React.useMemo(() => {
        const schedulesList = plans || [];
        let totalScheduled = schedulesList.length;
        let toSendTotal = 0;
        let toReceiveTotal = 0;
        let pendingCount = 0;
        let sendCount = 0;
        let receiveCount = 0;

        schedulesList.forEach((item) => {
            // 1. Sanitize amount safely
            const rawAmt = item.amount ?? item.value ?? item.total_amount ?? 0;
            const amount = typeof rawAmt === 'string' 
                ? parseFloat(rawAmt.replace(/[^0-9.]/g, '')) || 0 
                : Number(rawAmt) || 0;

            // 2. Normalize direction / transaction type
            const direction = String(item.direction || item.type || item.entry_type || item.flow || item.category || '').toUpperCase();
            const isReceive = 
                direction === 'RECEIVE' || 
                direction === 'INWARD' || 
                direction === 'INCOMING' || 
                direction === 'IN' ||
                item.is_receive === true ||
                String(item.flow || '').toLowerCase() === 'in';

            const isSend = 
                direction === 'SEND' || 
                direction === 'OUTWARD' || 
                direction === 'OUTGOING' || 
                direction === 'OUT' ||
                item.is_send === true ||
                String(item.flow || '').toLowerCase() === 'out';

            // 3. Status checks
            const status = String(item.status || '').toUpperCase();
            if (status === 'PENDING') {
                pendingCount += 1;
            }

            // 4. Accumulate totals
            if (isReceive) {
                toReceiveTotal += amount;
                receiveCount += 1;
            } else if (isSend) {
                toSendTotal += amount;
                sendCount += 1;
            }
        });

        return {
            totalScheduled,
            toSendTotal,
            toReceiveTotal,
            pendingCount,
            sendCount,
            receiveCount
        };
    }, [plans]);

    const stats = {
        totalScheduled: metrics.totalScheduled,
        toSend: metrics.toSendTotal,
        toSendTotal: metrics.toSendTotal,
        toReceive: metrics.toReceiveTotal,
        toReceiveTotal: metrics.toReceiveTotal,
        pendingCount: metrics.pendingCount,
        sendCount: metrics.sendCount,
        receiveCount: metrics.receiveCount
    };

    const filteredPlans = React.useMemo(() => {
        const schedulesList = plans || [];
        return schedulesList.filter(p => {
            const matchesSearch = !searchTerm || 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.person_name?.toLowerCase().includes(searchTerm.toLowerCase());

            const direction = String(p.direction || p.type || p.entry_type || p.flow || '').toUpperCase();
            const isReceive = direction === 'RECEIVE' || direction === 'INWARD' || direction === 'INCOMING' || p.is_receive === true || String(p.flow || '').toLowerCase() === 'in';
            const isSend = direction === 'SEND' || direction === 'OUTWARD' || direction === 'OUTGOING' || p.is_send === true || String(p.flow || '').toLowerCase() === 'out';

            const active = (activeFilter || 'ALL').toUpperCase();
            if (active === 'ALL') return matchesSearch;
            if (active === 'SEND') return matchesSearch && isSend;
            if (active === 'RECEIVE') return matchesSearch && isReceive;
            return matchesSearch;
        });
    }, [plans, searchTerm, activeFilter]);

    return (
        <div className="planner-page-container" style={{ padding: '1.133rem 2.266rem 5.5rem 2.266rem', background: '#F8FAFC', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div className="planner-header-wrapper" style={{ display: 'flex', flexShrink: 0, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.359rem' }}>
                <div className="planner-header-text">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.68rem' }}>
                        <div className="planner-header-icon-box" style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(27, 107, 58, 0.2)', flexShrink: 0 }}>
                            <CalendarIcon size={22} />
                        </div>
                        <h1 style={{ fontSize: '1.812rem', fontWeight: '850', color: '#064E3B', letterSpacing: '-0.02em' }}>Payment Planner</h1>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.952rem', fontWeight: '500' }}>Schedule and manage upcoming transfers and collections with ease.</p>
                </div>
                <button 
                    data-tour="planner-actions"
                    onClick={() => setIsModalOpen(true)}
                    className="planner-schedule-btn"
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.544rem', 
                        padding: '0.77rem 1.586rem', borderRadius: '14px', 
                        background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', color: 'white', border: 'none', 
                        fontWeight: '700', cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Plus size={20} />
                    Schedule Payment
                </button>
            </div>

            {/* Quick Stats */}
            <div className="planner-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.133rem', marginBottom: '1.812rem' }}>
                {[
                    { label: 'Total Scheduled', value: stats.totalScheduled, icon: CalendarIcon, color: '#1B6B3A', bg: '#DCF2E4' },
                    { label: 'Total sended', value: `₹${stats.toSend.toLocaleString()}`, icon: ArrowUpRight, color: '#EF4444', bg: '#FEE2E2' },
                    { label: 'Total received', value: `₹${stats.toReceive.toLocaleString()}`, icon: ArrowDownRight, color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Pending Task', value: stats.pendingCount, icon: Clock, color: '#F59E0B', bg: '#FEF3C7' }
                ].map((stat, idx) => (
                    <div key={idx} className="planner-stat-card" style={{ background: 'white', padding: '1.133rem', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '0.652rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', margin: 0 }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.359rem', fontWeight: '900', color: '#1E293B', margin: '0.181rem 0 0 0' }}>{stat.value}</h3>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and List */}
            <div className="planner-content-card" style={{ flex: 1, minHeight: 0, background: 'white', borderRadius: '18px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="planner-filter-header" style={{ padding: '1.133rem 1.359rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.906rem', flexWrap: 'wrap' }}>
                    {/* Subtab Filter Switcher */}
                    <div className="planner-tabs-group" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#F1F5F9',
                        padding: '4px',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        gap: '4px'
                    }}>
                        <button
                            data-tour="planner-filter-all"
                            type="button"
                            onClick={() => setActiveFilter('ALL')}
                            className="planner-tab-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.408rem',
                                padding: '0.498rem 1.042rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeFilter === 'ALL' ? 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)' : 'transparent',
                                color: activeFilter === 'ALL' ? '#FFFFFF' : '#64748B',
                                fontWeight: '800',
                                fontSize: '0.743rem',
                                cursor: 'pointer',
                                boxShadow: activeFilter === 'ALL' ? '0 4px 10px rgba(27, 107, 58, 0.25)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Filter size={14} style={{ color: activeFilter === 'ALL' ? '#FFFFFF' : '#64748B' }} />
                            <span>All</span>
                            <span style={{
                                padding: '0.136rem 0.453rem',
                                borderRadius: '999px',
                                fontSize: '0.634rem',
                                fontWeight: '800',
                                background: activeFilter === 'ALL' ? 'rgba(255, 255, 255, 0.22)' : '#E2E8F0',
                                color: activeFilter === 'ALL' ? '#FFFFFF' : '#475569'
                            }}>
                                {stats.totalScheduled || 0}
                            </span>
                        </button>

                        {/* Send Filter Button */}
                        <button
                            data-tour="planner-filter-send"
                            type="button"
                            onClick={() => setActiveFilter('SEND')}
                            className="planner-tab-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.408rem',
                                padding: '0.498rem 1.042rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeFilter === 'SEND' ? '#DC2626' : 'transparent',
                                color: activeFilter === 'SEND' ? '#FFFFFF' : '#64748B',
                                fontWeight: '800',
                                fontSize: '0.743rem',
                                cursor: 'pointer',
                                boxShadow: activeFilter === 'SEND' ? '0 4px 10px rgba(220, 38, 38, 0.25)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ArrowUpRight size={15} style={{ color: activeFilter === 'SEND' ? '#FFFFFF' : '#EF4444' }} />
                            <span>Send</span>
                            <span style={{
                                padding: '0.136rem 0.453rem',
                                borderRadius: '999px',
                                fontSize: '0.634rem',
                                fontWeight: '800',
                                background: activeFilter === 'SEND' ? 'rgba(255, 255, 255, 0.25)' : '#FEE2E2',
                                color: activeFilter === 'SEND' ? '#FFFFFF' : '#B91C1C'
                            }}>
                                {stats.sendCount || 0}
                            </span>
                        </button>

                        {/* Received Filter Button */}
                        <button
                            data-tour="planner-filter-received"
                            type="button"
                            onClick={() => setActiveFilter('RECEIVE')}
                            className="planner-tab-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.408rem',
                                padding: '0.498rem 1.042rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeFilter === 'RECEIVE' ? '#059669' : 'transparent',
                                color: activeFilter === 'RECEIVE' ? '#FFFFFF' : '#64748B',
                                fontWeight: '800',
                                fontSize: '0.743rem',
                                cursor: 'pointer',
                                boxShadow: activeFilter === 'RECEIVE' ? '0 4px 10px rgba(5, 150, 105, 0.25)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <ArrowDownRight size={15} style={{ color: activeFilter === 'RECEIVE' ? '#FFFFFF' : '#10B981' }} />
                            <span>Received</span>
                            <span style={{
                                padding: '0.136rem 0.453rem',
                                borderRadius: '999px',
                                fontSize: '0.634rem',
                                fontWeight: '800',
                                background: activeFilter === 'RECEIVE' ? 'rgba(255, 255, 255, 0.25)' : '#DCF2E4',
                                color: activeFilter === 'RECEIVE' ? '#FFFFFF' : '#15803D'
                            }}>
                                {stats.receiveCount || 0}
                            </span>
                        </button>
                    </div>

                    <div className="planner-search-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', padding: '0.498rem 0.906rem', borderRadius: '14px', border: '1px solid #E2E8F0', width: '280px' }}>
                        <Search size={18} color="#94A3B8" />
                        <input 
                            data-tour="planner-search"
                            placeholder="Search schedules..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '0.68rem', width: '100%', fontSize: '0.77rem', color: '#1E293B', fontWeight: '500' }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0.906rem' }}>
                    {isLoading ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#1B6B3A" /></div>
                    ) : filteredPlans.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                            <CalendarIcon size={48} style={{ marginBottom: '0.906rem', opacity: 0.5 }} />
                            <p style={{ fontWeight: '600' }}>No scheduled payments found.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.68rem' }}>
                            {filteredPlans.map(plan => {
                                const direction = String(plan.direction || plan.type || plan.entry_type || plan.flow || '').toUpperCase();
                                const isSend = direction === 'SEND' || direction === 'OUTWARD' || direction === 'OUTGOING' || direction === 'OUT' || plan.is_send === true || String(plan.flow || '').toLowerCase() === 'out';
                                
                                const personMatch = (people || []).find(p => String(p.id) === String(plan.person_id));
                                const contactName = plan.contactName || plan.person_name || plan.person?.name || personMatch?.name;
                                const displayTitle = plan.referenceName || plan.name || 'Untitled Plan';
                                const displayDate = plan.scheduledDate || plan.due_date;
                                const statusText = (plan.status || 'PENDING').toUpperCase();
                                const formattedAmount = parseFloat(plan.amount || 0).toLocaleString();

                                return (
                                <div key={plan.id} className="planner-list-item" style={{ padding: '1.133rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="planner-item-left" style={{ display: 'flex', alignItems: 'center', gap: '1.133rem' }}>
                                        <div className="planner-item-icon-box" style={{
                                            width: '50px', height: '50px', borderRadius: '15px', 
                                            background: isSend ? '#FFF1F2' : '#D1FAE5',
                                            color: isSend ? '#E11D48' : '#10B981',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {isSend ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                        </div>
                                        <div className="planner-item-details">
                                            <h4 style={{ margin: 0, fontSize: '0.952rem', fontWeight: '800', color: '#1E293B' }}>{displayTitle}</h4>
                                            <div className="planner-item-meta" style={{ display: 'flex', gap: '0.68rem', alignItems: 'center', marginTop: '0.227rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.363rem', fontWeight: '600' }}>
                                                    <Clock size={14} /> {displayDate ? new Date(displayDate).toLocaleDateString() : 'No date'}
                                                </span>
                                                <span style={{ fontSize: '0.725rem', color: '#1B6B3A', background: '#DCF2E4', padding: '0.091rem 0.453rem', borderRadius: '6px', fontWeight: '750' }}>
                                                    {statusText}
                                                </span>
                                                {contactName && (
                                                    <span style={{ fontSize: '0.725rem', color: '#0369A1', background: '#E0F2FE', padding: '0.091rem 0.453rem', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.227rem' }}>
                                                        <User size={12} /> {contactName}
                                                    </span>
                                                )}
                                            </div>
                                            {(plan.description || plan.notes) && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2" style={{ margin: '0.227rem 0 0 0', fontSize: '0.68rem', color: '#64748B' }}>
                                                    {plan.description || plan.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="planner-item-right" style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.812rem' }}>
                                        <div className="planner-item-amount-box">
                                            <p style={{ margin: 0, fontSize: '0.634rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Amount</p>
                                            <h4 style={{ margin: '0.091rem 0 0 0', fontSize: '1.133rem', fontWeight: '900', color: isSend ? '#E11D48' : '#10B981' }}>
                                                ₹{formattedAmount}
                                            </h4>
                                        </div>
                                        <div className="planner-item-actions" style={{ display: 'flex', gap: '0.453rem' }}>
                                            {plan.status !== 'paid' && (
                                                <button 
                                                    onClick={() => markPaidMutation.mutate(plan.id)}
                                                    style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ECFDF5', color: '#10B981', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Mark as Paid"
                                                >
                                                    <CheckCircle2 size={20} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(plan.id)}
                                                style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FFF1F2', color: '#E11D48', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="Cancel"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );})}
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '20px', padding: '2.266rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.812rem' }}>
                            <h2 style={{ fontSize: '1.359rem', fontWeight: '850', color: '#064E3B' }}>Schedule New Payment</h2>
                            <button onClick={closeModal} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={22} /></button>
                        </div>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const parsedAmount = parseFloat(formData.amount);
                                if (isNaN(parsedAmount) || parsedAmount <= 0) {
                                    alert('Payment amount must be strictly greater than 0.');
                                    return;
                                }
                                createMutation.mutate({
                                    ...formData,
                                    amount: parsedAmount
                                });
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.906rem' }}>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'SEND'})}
                                    style={{ 
                                        padding: '0.906rem', borderRadius: '16px', border: '2px solid', 
                                        borderColor: formData.type === 'SEND' ? '#EF4444' : '#E2E8F0',
                                        background: formData.type === 'SEND' ? '#FEF2F2' : 'white',
                                        color: formData.type === 'SEND' ? '#EF4444' : '#64748B',
                                        fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.453rem'
                                    }}
                                >
                                    <ArrowUpRight size={18} /> I am Sending
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'RECEIVE'})}
                                    style={{ 
                                        padding: '0.906rem', borderRadius: '16px', border: '2px solid', 
                                        borderColor: formData.type === 'RECEIVE' ? '#10B981' : '#E2E8F0',
                                        background: formData.type === 'RECEIVE' ? '#F0FDF4' : 'white',
                                        color: formData.type === 'RECEIVE' ? '#10B981' : '#64748B',
                                        fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.453rem'
                                    }}
                                >
                                    <ArrowDownRight size={18} /> I am Receiving
                                </button>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', marginBottom: '0.453rem', textTransform: 'uppercase' }}>Reference Name</label>
                                <input 
                                    required 
                                    placeholder="e.g. Monthly Rent, Client Payment" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    style={{ width: '100%', padding: '0.77rem 0.906rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', marginBottom: '0.453rem', textTransform: 'uppercase' }}>Link to Person (Optional)</label>
                                <select 
                                    value={formData.person_id} 
                                    onChange={e => setFormData({...formData, person_id: e.target.value})} 
                                    style={{ width: '100%', padding: '0.77rem 0.906rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}
                                >
                                    <option value="">Select Person...</option>
                                    {people.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.906rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', marginBottom: '0.453rem', textTransform: 'uppercase' }}>Amount (₹)</label>
                                    <input 
                                        required 
                                        type="number" 
                                        min="0"
                                        step="any"
                                        placeholder="0" 
                                        value={formData.amount} 
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val !== '' && Number(val) < 0) return;
                                            if (val === '' || parseFloat(val) >= 0) {
                                                setFormData({...formData, amount: val});
                                            }
                                        }}
                                        style={{ width: '100%', padding: '0.77rem 0.906rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: '700' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94A3B8', marginBottom: '0.453rem', textTransform: 'uppercase' }}>Scheduled Date</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={formData.due_date} 
                                        onChange={e => setFormData({...formData, due_date: e.target.value})} 
                                        style={{ width: '100%', padding: '0.77rem 0.906rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                    />
                                </div>
                            </div>



                            <button 
                                type="submit" 
                                disabled={createMutation.isLoading || !formData.amount || Number(formData.amount) <= 0}
                                style={{ 
                                    width: '100%', padding: '0.997rem', borderRadius: '18px', 
                                    background: (!formData.amount || Number(formData.amount) <= 0) ? '#94A3B8' : 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)', 
                                    color: 'white', border: 'none', fontWeight: '800', fontSize: '0.997rem', 
                                    marginTop: '0.453rem', 
                                    cursor: (createMutation.isLoading || !formData.amount || Number(formData.amount) <= 0) ? 'not-allowed' : 'pointer', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.68rem',
                                    opacity: (createMutation.isLoading || !formData.amount || Number(formData.amount) <= 0) ? 0.6 : 1
                                }}
                            >
                                {createMutation.isLoading ? <Loader2 className="animate-spin" /> : 'Schedule Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialPlan;
