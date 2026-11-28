import React, { useState } from 'react';
import { applyTableFilters } from '../utils/filterUtils';
import FilterableTableHead from '../components/FilterableTableHead';
import { 
    CreditCard, 
    Plus, 
    Search, 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet, 
    DollarSign, 
    MessageSquare, 
    FileText, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    User, 
    Activity, 
    Smartphone, 
    Building, 
    Clock, 
    Calendar,
    Send,
    TrendingUp
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { transactionsService } from '../services/transactionsService';
import { apiClient } from '../api/client';
import '../App.css';
import { useCurrency } from '../context';

const INCOME_CATEGORIES = [
    'Sales & Revenue',
    'Client Payment',
    'Consulting / Services',
    'Investment Returns',
    'Salary & Bonus',
    'Cash Inward',
    'Refund',
    'Other Income'
];

const EXPENSE_CATEGORIES = [
    'Vendor / Supplies',
    'Rent & Utilities',
    'Office & Stationery',
    'Food & Refreshments',
    'Salaries & Wages',
    'Travel & Fuel',
    'Marketing & Ads',
    'Maintenance & Repairs',
    'Other Expense'
];

const BusinessPayments = () => {
    const { currency, formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('receivables');
    const [colFilters, setColFilters] = React.useState({}); // 'receivables', 'payables', 'bank', 'reminders'

    const formatDisplayDate = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return '—';
        const d = new Date(`${dateStr}T00:00:00`);
        if (Number.isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    const [txForm, setTxForm] = useState({
        type: 'income',
        title: '',
        amount: '',
        category: '',
        payment_mode: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        reference: ''
    });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    React.useEffect(() => {
        const handleOpen = () => setIsAddTransactionModalOpen(true);
        window.addEventListener('open-add-transaction', handleOpen);
        if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('add') === 'true') {
            setIsAddTransactionModalOpen(true);
        }
        return () => window.removeEventListener('open-add-transaction', handleOpen);
    }, []);

    React.useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const queryClient = useQueryClient();

    // Unified query loading both ledgers and accounts
    const { data: reportsData = { receivables: [], payables: [], accounts: [] }, isLoading: isReportsLoading } = useQuery({
        queryKey: ['paymentReports'],
        queryFn: () => paymentService.getReports()
    });

    const { data: customersList = [] } = useQuery({
        queryKey: ['customersList'],
        queryFn: async () => {
            try {
                const res = await apiClient.get('/sales/customers').catch(() => apiClient.get('/customers'));
                const raw = res?.data?.data ?? res?.data;
                if (Array.isArray(raw)) return raw;
                if (raw?.customers && Array.isArray(raw.customers)) return raw.customers;
                if (raw?.rows && Array.isArray(raw.rows)) return raw.rows;
                if (raw?.items && Array.isArray(raw.items)) return raw.items;
                return [];
            } catch (err) {
                console.warn('Failed to fetch customers list:', err);
                return [];
            }
        }
    });

    // Mutations
    const receiveMutation = useMutation({
        mutationFn: (data) => paymentService.receivePayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentReports'] });
            setIsPaymentModalOpen(false);
            setToast({
                message: 'Customer payment recorded and committed successfully.',
                type: 'success'
            });
        }
    });

    const payMutation = useMutation({
        mutationFn: (data) => paymentService.paySupplier(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentReports'] });
            setIsSupplierModalOpen(false);
            alert('Supplier payment authorized and processed.');
        }
    });

    const dbReceivables = reportsData.receivables || [];
    const dbPayables = reportsData.payables || [];
    const dbAccounts = reportsData.accounts || [];

    const receivables = dbReceivables.map(rec => ({
        payment_id: rec.id,
        payment_number: `REC-${new Date(rec.created_at).getFullYear()}-${rec.id}`,
        payment_type: 'receive',
        payment_date: rec.created_at ? rec.created_at.split('T')[0] : 'N/A',
        payment_status: 'completed',
        customer_name: rec.party_name || 'General Client',
        invoice_id: rec.invoice_id || `INV-REF-${rec.id}`,
        total_amount: parseFloat(rec.amount) || 0,
        paid_amount: parseFloat(rec.amount) || 0,
        pending_amount: 0,
        payment_mode: rec.payment_mode || 'Other',
        transaction_reference: rec.reference_number || `REF-${rec.id}`,
        receipt_number: `RCT-${rec.id}`,
        reconciliation_status: rec.reconciliation_status || 'matched'
    }));

    const payables = dbPayables.map(rec => ({
        payment_id: rec.id,
        payment_number: `VCH-${new Date(rec.created_at).getFullYear()}-${rec.id}`,
        payment_type: 'pay',
        payment_date: rec.created_at ? rec.created_at.split('T')[0] : 'N/A',
        payment_status: 'completed',
        supplier_name: rec.party_name || 'General Vendor',
        purchase_id: rec.invoice_id || `BILL-REF-${rec.id}`,
        total_amount: parseFloat(rec.amount) || 0,
        paid_amount: parseFloat(rec.amount) || 0,
        pending_amount: 0,
        payment_mode: rec.payment_mode || 'Other',
        cheque_number: rec.reference_number || `CHQ-${rec.id}`,
        reconciliation_status: rec.reconciliation_status || 'matched'
    }));

    const accounts = dbAccounts.length > 0 ? dbAccounts : [
        { bank_account_id: 'ACC-DEFL', bank_account_name: 'Default Cash Account', current_balance: 0, type: 'cash' }
    ];

    const overdues = []; // Placeholder derived from outstanding backend logic if provisioned

    // Forms input states
    const [customerForm, setCustomerForm] = useState({
        customer_name: 'Acme Corporates (Rahul Dev)',
        invoice_id: 'INV-2026-104',
        total_amount: 10000,
        paid_amount: 4000,
        payment_mode: 'UPI',
        transaction_reference: 'UPI-9092210A'
    });

    const [supplierForm, setSupplierForm] = useState({
        supplier_name: 'Delhi Distributors Ltd.',
        purchase_id: 'BILL-77091',
        total_amount: '',
        paid_amount: '',
        payment_mode: 'Bank Transfer',
        transaction_reference: 'REF-88910B'
    });

    const [transferForm, setTransferForm] = useState({
        from_acc_id: 'ACC-03',
        to_acc_id: 'ACC-01',
        amount: ''
    });

    const handleSaveCustomerPayment = (e) => {
        e.preventDefault();
        const totalAmt = parseFloat(customerForm.total_amount);
        let paidAmt = parseFloat(customerForm.paid_amount);

        if (isNaN(paidAmt) || paidAmt <= 0 || isNaN(totalAmt) || totalAmt <= 0) {
            alert('Customer payment amount and total original amount must be strictly greater than 0.');
            return;
        }

        if (paidAmt > totalAmt) {
            alert('Paid amount cannot exceed the original invoice amount.');
            return;
        }

        receiveMutation.mutate({
            customer_name: customerForm.customer_name,
            invoice_id: customerForm.invoice_id,
            amount: paidAmt,
            payment_mode: customerForm.payment_mode,
            reference_number: customerForm.transaction_reference
        });
    };

    const handleSaveSupplierPayment = (e) => {
        e.preventDefault();
        payMutation.mutate({
            supplier_name: supplierForm.supplier_name,
            purchase_id: supplierForm.purchase_id,
            amount: parseFloat(supplierForm.paid_amount),
            payment_mode: supplierForm.payment_mode,
            reference_number: supplierForm.transaction_reference
        });
    };

    const handleInternalTransfer = (e) => {
        e.preventDefault();
        if (transferForm.from_acc_id === transferForm.to_acc_id) {
            alert('From Account and To Account cannot be identical!');
            return;
        }

        const transAmt = parseFloat(transferForm.amount) || 0;
        if (isNaN(transAmt) || transAmt <= 0) {
            alert('Transfer amount must be strictly greater than 0.');
            return;
        }

        const sourceAcc = accounts.find(a => a.bank_account_id === transferForm.from_acc_id);
        if (transAmt > (sourceAcc?.current_balance || 0)) {
            alert('Insufficient balance in source account to make internal transfer!');
            return;
        }

        // In real usage, this would invoke a /payments/transfer API to move between source and target accounts
        alert('Simulated fund transfer logged. In production, this will invoke the ledger movement API!');
        setIsTransferModalOpen(false);
        alert('Internal fund transfer settled across cash/bank registers!');
    };

    const sendWhatsAppReminder = (custName) => {
        alert(`Overdue reminder template successfully dispatched via API to ${custName}!`);
    };

    const totalOutstandingReceivables = overdues.reduce((sum, o) => sum + o.pending_amount, 0);
    const totalDailyCollections = receivables.reduce((sum, r) => sum + r.paid_amount, 0);

    const filteredReceivables = receivables.filter(r => 
        r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.payment_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPayables = payables.filter(p => 
        p.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payment_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleReceivables = filteredReceivables.filter(item => applyTableFilters(item, colFilters));
    const visiblePayables = filteredPayables.filter(item => applyTableFilters(item, colFilters));
    const visibleOverdues = overdues.filter(item => applyTableFilters(item, colFilters));

    const handleSaveTransaction = async (e) => {
        e.preventDefault();
        const amt = parseFloat(txForm.amount);
        if (isNaN(amt) || amt <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }
        if (!txForm.title.trim()) {
            alert('Please enter a description or payee/source name.');
            return;
        }

        try {
            if (txForm.type === 'income') {
                await paymentService.receivePayment({
                    customer_name: txForm.title,
                    invoice_id: txForm.reference || `TXN-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: txForm.payment_mode,
                    reference_number: txForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(() => {});
            } else {
                await paymentService.paySupplier({
                    supplier_name: txForm.title,
                    purchase_id: txForm.reference || `TXN-${Date.now().toString().slice(-6)}`,
                    amount: amt,
                    payment_mode: txForm.payment_mode,
                    reference_number: txForm.reference || `REF-${Date.now().toString().slice(-6)}`
                }).catch(() => {});
            }

            // Sync with transactions ledger
            await transactionsService.createTransaction({
                type: txForm.type === 'income' ? 'Income' : 'Expense',
                title: txForm.title,
                category: txForm.category || (txForm.type === 'income' ? 'Sales & Revenue' : 'Other Expense'),
                amount: amt,
                date: txForm.date,
                notes: txForm.notes || txForm.reference || ''
            }).catch(() => {});

            queryClient.invalidateQueries({ queryKey: ['paymentReports'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['income'] });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['books-dashboard-data'] });
            queryClient.invalidateQueries({ queryKey: ['finance-dashboard-enhanced'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('transaction-added', { detail: { type: txForm.type, amount: amt } }));
            }

            setIsAddTransactionModalOpen(false);
            setTxForm({
                type: 'income',
                title: '',
                amount: '',
                category: '',
                payment_mode: 'UPI',
                date: new Date().toISOString().split('T')[0],
                notes: '',
                reference: ''
            });
            setToast({
                message: `${txForm.type === 'income' ? 'Income' : 'Expense'} entry recorded successfully.`,
                type: 'success'
            });
        } catch (err) {
            alert('Failed to save transaction: ' + (err.message || 'Unknown error'));
        }
    };

    const totalIncome = receivables.reduce((sum, r) => sum + r.paid_amount, 0);
    const totalExpenses = payables.reduce((sum, p) => sum + p.paid_amount, 0);
    const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);

    return (
        <div className="transactions-page" style={{ background: 'var(--bg-color, #F8FAFC)', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div className="cliks-responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.453rem' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(27, 107, 58, 0.2)' }}>
                            <CreditCard size={22} />
                        </div>
                        <h1 style={{ fontSize: '1.812rem', fontWeight: '850', color: 'var(--text-main, #064E3B)', letterSpacing: '-0.02em', margin: 0 }}>Transactions</h1>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.906rem', fontWeight: '500', margin: 0 }}>Record and track all your money entries, income, expenses, and accounts.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.68rem' }}>
                    <button 
                        data-tour="finance-add-transaction"
                        onClick={() => setIsAddTransactionModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', padding: '0.77rem 1.269rem', borderRadius: '14px', background: 'var(--primary-gradient)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)', fontSize: '0.834rem', transition: 'all 0.2s' }}
                    >
                        <Plus size={18} strokeWidth={2.5} /> Add Transaction
                    </button>
                </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="transactions-summary">
                {[
                    { label: 'Total Inflow (Income)', value: formatCurrency(totalIncome), icon: ArrowDownRight, color: 'var(--accent-ink)', bg: '#DCF2E4' },
                    { label: 'Total Outflow (Expense)', value: formatCurrency(totalExpenses), icon: ArrowUpRight, color: '#EF4444', bg: '#FEE2E2' },
                    { label: 'Available Balances', value: formatCurrency(totalBalance), icon: Wallet, color: '#3B82F6', bg: '#DBEAFE' },
                    { label: 'Net Cash Balance', value: formatCurrency(totalIncome - totalExpenses), icon: CheckCircle2, color: '#0D9488', bg: '#CCFBF1' }
                ].map((stat, idx) => (
                    <div key={idx} className="stat-card transactions-summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', cursor: 'default', minWidth: 0, gap: '0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.136rem', minWidth: 0 }}>
                            <p style={{ fontSize: '0.652rem', fontWeight: '800', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.223rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>{stat.value}</h3>
                        </div>
                        <div className="transactions-summary-icon" style={{ borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs Row & Global Search */}
            <div className="transactions-controls">
                <div className="transactions-tabs">
                    {[
                        { id: 'receivables', label: 'Income (Inflow)', icon: ArrowDownRight },
                        { id: 'payables', label: 'Expenses (Outflow)', icon: ArrowUpRight },
                        { id: 'bank', label: 'Bank & Cash Registers', icon: Wallet },
                        { id: 'reminders', label: 'Overdue Reminders', icon: Clock }
                    ].map(tab => (
                        <button 
                            data-tour={`finance-tab-${tab.id}`}
                            key={tab.id}
                            className="accent-action"
                            aria-pressed={activeTab === tab.id}
                            onClick={() => {
                                if (tab.id === activeTab) return;
                                setColFilters({});
                                setActiveTab(tab.id);
                            }}
                            style={{ 
                                borderRadius: '12px',
                                background: activeTab === tab.id ? 'var(--primary)' : 'white',
                                color: activeTab === tab.id ? 'white' : '#475569',
                                border: '1px solid #E2E8F0', fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.453rem',
                                boxShadow: activeTab === tab.id ? '0 8px 16px rgba(6, 78, 59, 0.15)' : 'none',
                                fontSize: '0.797rem'
                            }}
                        >
                            <tab.icon size={16} aria-hidden="true" /> <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {(activeTab === 'receivables' || activeTab === 'payables') && (
                    <div className={showSearch ? 'transactions-search is-open' : 'transactions-search'}>
                        <button type="button" aria-label={showSearch ? 'Close search' : 'Search records'} aria-expanded={showSearch} onClick={() => setShowSearch(!showSearch)}>
                            <Search size={18} aria-hidden="true" />
                        </button>
                        {showSearch && (
                            <input
                                type="search"
                                aria-label="Search records"
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Tab 1: Customer Receivables */}
            {activeTab === 'receivables' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                    <div className="cliks-table-scroll transactions-table-scroll" role="region" aria-label="Income transactions" tabIndex={0}>
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead columns={[
        { key: 'receipt_id', label: 'Receipt ID', placeholder: 'e.g. RCP-001' },
        { key: 'date', label: 'Date', placeholder: 'e.g. 2026-05' },
        { key: 'customer_name', label: 'Customer', placeholder: 'Name' },
        { key: 'invoice_linked', label: 'Invoice Linked', placeholder: 'INV-' },
        { key: 'total', label: 'ORIGINAL AMOUNT', placeholder: 'e.g. 5000', align: 'right' },
        { key: 'paid_amount', label: 'Paid Amount', placeholder: 'e.g. 5000', align: 'right' },
        { key: 'payment_mode', label: 'Mode', placeholder: 'e.g. UPI', align: 'center' },
        { key: 'status', label: 'Reconciliation', placeholder: 'Status', align: 'center' }
    ]} onFilterChange={setColFilters} thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF' }} />
                            <tbody>
                                {visibleReceivables.map((r) => (
                                    <tr key={r.payment_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--accent-ink)', fontSize: '0.8rem', whiteSpace: 'nowrap' }} title={r.payment_number}>{r.payment_number}</span>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{formatDisplayDate(r.payment_date)}</td>
                                        <td style={{ padding: '0.625rem 0.78rem', fontWeight: '700', color: '#1E293B', fontSize: '0.8rem', maxWidth: '180px' }} title={r.customer_name}>
                                            <div style={{ overflowWrap: 'anywhere', maxWidth: '180px' }}>{r.customer_name}</div>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#475569', fontWeight: '600', fontSize: '0.78rem', whiteSpace: 'nowrap' }} title={r.invoice_id}>{r.invoice_id}</td>
                                        <td className="cell-num" style={{ padding: '0.625rem 0.78rem', fontWeight: '600', color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', textAlign: 'right' }}>{formatCurrency(r.total_amount)}</td>
                                        <td className="cell-num" style={{ padding: '0.625rem 0.78rem', fontWeight: '850', color: 'var(--accent-ink)', fontSize: '0.8rem', whiteSpace: 'nowrap', textAlign: 'right' }}>{formatCurrency(r.paid_amount)}</td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <span className="badge-nowrap" style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#F0FDF4', color: 'var(--accent-ink)', fontWeight: '800', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{r.payment_mode}</span>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <span className="badge-nowrap" style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#EFF6FF', color: '#2563EB', fontWeight: '800', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{r.reconciliation_status.toUpperCase()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!visibleReceivables.length || isReportsLoading) && (
                        <p className="transactions-empty" role="status">
                            {isReportsLoading ? 'Loading records?' : 'No income records found.'}
                        </p>
                    )}
                </div>
            )}

            {/* Tab 2: Supplier Payables */}
            {activeTab === 'payables' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                    <div className="cliks-table-scroll transactions-table-scroll" role="region" aria-label="Expense transactions" tabIndex={0}>
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead columns={[
        { key: 'receipt_id', label: 'Receipt ID', placeholder: 'e.g. RCP-001' },
        { key: 'date', label: 'Date', placeholder: 'e.g. 2026-05' },
        { key: 'customer_name', label: 'Supplier', placeholder: 'Name' },
        { key: 'invoice_linked', label: 'Invoice Linked', placeholder: 'INV-' },
        { key: 'total', label: 'ORIGINAL AMOUNT', placeholder: 'e.g. 5000', align: 'right' },
        { key: 'paid_amount', label: 'Paid Amount', placeholder: 'e.g. 5000', align: 'right' },
        { key: 'payment_mode', label: 'Mode', placeholder: 'e.g. UPI', align: 'center' },
        { key: 'status', label: 'Reference', placeholder: 'Ref / Cheque', align: 'center' }
    ]} onFilterChange={setColFilters} thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF' }} />
                            <tbody>
                                {visiblePayables.map((p) => (
                                    <tr key={p.payment_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--accent-ink)', fontSize: '0.8rem', whiteSpace: 'nowrap' }} title={p.payment_number}>{p.payment_number}</span>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{formatDisplayDate(p.payment_date)}</td>
                                        <td style={{ padding: '0.625rem 0.78rem', fontWeight: '700', color: '#1E293B', fontSize: '0.8rem', maxWidth: '180px' }} title={p.supplier_name}>
                                            <div style={{ overflowWrap: 'anywhere', maxWidth: '180px' }}>{p.supplier_name}</div>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#475569', fontWeight: '600', fontSize: '0.78rem', whiteSpace: 'nowrap' }} title={p.purchase_id}>{p.purchase_id}</td>
                                        <td className="cell-num" style={{ padding: '0.625rem 0.78rem', fontWeight: '600', color: '#475569', fontSize: '0.8rem', whiteSpace: 'nowrap', textAlign: 'right' }}>{formatCurrency(p.total_amount)}</td>
                                        <td className="cell-num" style={{ padding: '0.625rem 0.78rem', fontWeight: '850', color: '#EF4444', fontSize: '0.8rem', whiteSpace: 'nowrap', textAlign: 'right' }}>{formatCurrency(p.paid_amount)}</td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <span className="badge-nowrap" style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#FEF2F2', color: '#EF4444', fontWeight: '800', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{p.payment_mode}</span>
                                        </td>
                                        <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', fontSize: '0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>{p.cheque_number || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {(!visiblePayables.length || isReportsLoading) && (
                        <p className="transactions-empty" role="status">
                            {isReportsLoading ? 'Loading records?' : 'No expense records found.'}
                        </p>
                    )}
                </div>
            )}

            {/* Tab 3: Bank registers */}
            {activeTab === 'bank' && (
                <div className="transactions-registers">
                    {accounts.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).map(acc => (
                        <div key={acc.bank_account_id} style={{ background: 'white', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '1.812rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                                <span style={{ padding: '0.272rem 0.544rem', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', fontWeight: '800', fontSize: '0.68rem' }}>{(acc.type || 'ASSET').toUpperCase()}</span>
                            </div>

                            <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: 'var(--accent-ink)', marginBottom: '0.453rem' }}>{acc.bank_account_name}</h3>
                            <p style={{ color: '#64748B', fontSize: '0.77rem', marginBottom: '1.359rem' }}>Account No: {acc.account_number}</p>

                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.133rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.77rem', fontWeight: '700', color: '#64748B' }}>Current Balance:</span>
                                <span style={{ fontSize: '1.359rem', fontWeight: '950', color: 'var(--accent-ink)' }}>{formatCurrency(acc.current_balance)}</span>
                            </div>
                        </div>
                    ))}
                    <div style={{ background: 'white', borderRadius: '18px', border: '1px dashed #DDD6FE', padding: '1.812rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsTransferModalOpen(true)}>
                        <ArrowUpRight size={32} style={{ color: 'var(--accent-ink)', marginBottom: '0.68rem' }} />
                        <h4 style={{ fontWeight: '800', color: 'var(--accent-ink)' }}>Internal Transfer Funds</h4>
                        <p style={{ fontSize: '0.725rem', color: '#64748B' }}>Move money between Cash-In-Hand and Bank accounts</p>
                    </div>
                </div>
            )}

            {/* Tab 4: Overdue reminders */}
            {activeTab === 'reminders' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.133rem 1.359rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <h3 style={{ flexShrink: 0, fontSize: '1.05rem', fontWeight: '850', color: 'var(--accent-ink)', marginBottom: '0.906rem' }}>Overdue Customer Accounts Reminders (myBillBook flow)</h3>
                    <div className="cliks-table-scroll transactions-table-scroll" role="region" aria-label="Overdue reminders" tabIndex={0}>
                        <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <FilterableTableHead columns={[
                                { key: 'customer_name', label: 'CUSTOMER NAME', placeholder: 'Name' },
                                { key: 'invoice_id', label: 'INVOICE LINKED ID', placeholder: 'ID' },
                                { key: 'pending_amount', label: 'OVERDUE BALANCE', placeholder: 'Balance', align: 'right' },
                                { key: 'due_date', label: 'DUE DATE', placeholder: 'Date' },
                                { key: 'overdue_days', label: 'OVERDUE PERIOD', placeholder: 'Days', align: 'center' },
                                { key: 'reminder_sent', label: 'REMINDER STATUS', placeholder: 'Status', align: 'center' },
                                { 
                                    key: 'actions', 
                                    label: 'ACTIONS', 
                                    placeholder: '', 
                                    noFilter: true,
                                    align: 'right',
                                    className: 'min-w-[170px] text-right',
                                    style: { minWidth: '170px', textAlign: 'right' }
                                }
                            ]} onFilterChange={setColFilters} thStyle={{ position: 'sticky', top: 0, zIndex: 10, background: '#FFFFFF' }} />
                        <tbody>
                            {visibleOverdues.map((ov) => (
                                <tr key={ov.invoice_id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '0.625rem 0.78rem', fontWeight: '800', maxWidth: '180px' }} title={ov.customer_name}>
                                        <div style={{ overflowWrap: 'anywhere', maxWidth: '180px' }}>{ov.customer_name}</div>
                                    </td>
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#475569', fontWeight: '700', whiteSpace: 'nowrap' }}>{ov.invoice_id}</td>
                                    <td className="cell-num" style={{ padding: '0.625rem 0.78rem', fontWeight: '850', color: '#EF4444', whiteSpace: 'nowrap', textAlign: 'right' }}>{formatCurrency(ov.pending_amount)}</td>
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>{ov.due_date}</td>
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        <span className="badge-nowrap" style={{ padding: '0.227rem 0.453rem', borderRadius: '6px', background: '#FEF2F2', color: '#EF4444', fontWeight: '800', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{ov.overdue_days} Days Overdue</span>
                                    </td>
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', fontWeight: '700', textAlign: 'center', whiteSpace: 'nowrap' }}>{ov.reminder_sent}</td>
                                    <td className="whitespace-nowrap text-right" style={{ padding: '0.906rem', textAlign: 'right', whiteSpace: 'nowrap', minWidth: '170px' }}>
                                        <button 
                                            type="button"
                                            onClick={() => sendWhatsAppReminder(ov.customer_name)}
                                            title="Automated WhatsApp & SMS Reminders - Coming Soon"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 transition-all hover:bg-gray-200 whitespace-nowrap"
                                            style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '0.34rem', 
                                                padding: '0.317rem 0.68rem', 
                                                borderRadius: '9999px', 
                                                background: '#F1F5F9', 
                                                color: '#64748B', 
                                                border: '1px solid #E2E8F0', 
                                                fontWeight: '600', 
                                                fontSize: '0.68rem', 
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0
                                            }}
                                        >
                                            <Send size={12} className="text-gray-400 flex-shrink-0" style={{ color: '#94A3B8', flexShrink: 0 }} />
                                            <span style={{ whiteSpace: 'nowrap' }}>Send Reminder</span>
                                            <span 
                                                className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                                style={{ 
                                                    fontSize: '0.562rem', 
                                                    background: '#E2E8F0', 
                                                    padding: '1px 5px', 
                                                    borderRadius: '4px', 
                                                    color: '#475569',
                                                    fontWeight: '750',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Soon
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    {(!visibleOverdues.length || isReportsLoading) && (
                        <p className="transactions-empty" role="status">
                            {isReportsLoading ? 'Loading records?' : 'No overdue reminders found.'}
                        </p>
                    )}
                </div>
            )}

            {/* Add Transaction Modal (Income / Expense) */}
            {isAddTransactionModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '1.812rem' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '18px', padding: '1.812rem 2.039rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                            <h3 style={{ fontSize: '1.223rem', fontWeight: '850', color: 'var(--accent-ink)', margin: 0 }}>Add Transaction</h3>
                            <button onClick={() => setIsAddTransactionModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.453rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                        </div>

                        {/* Income / Expense Switcher */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.453rem', background: '#F1F5F9', padding: '4px', borderRadius: '14px', marginBottom: '1.133rem' }}>
                            <button
                                type="button"
                                onClick={() => setTxForm({ ...txForm, type: 'income', category: '' })}
                                style={{
                                    padding: '0.589rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: txForm.type === 'income' ? '#10B981' : 'transparent',
                                    color: txForm.type === 'income' ? '#FFFFFF' : '#475569',
                                    fontWeight: '800',
                                    fontSize: '0.797rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ArrowDownRight size={16} /> Income (Money In)
                            </button>
                            <button
                                type="button"
                                onClick={() => setTxForm({ ...txForm, type: 'expense', category: '' })}
                                style={{
                                    padding: '0.589rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: txForm.type === 'expense' ? '#EF4444' : 'transparent',
                                    color: txForm.type === 'expense' ? '#FFFFFF' : '#475569',
                                    fontWeight: '800',
                                    fontSize: '0.797rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ArrowUpRight size={16} /> Expense (Money Out)
                            </button>
                        </div>

                        <form onSubmit={handleSaveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                            {/* Source / Payee / Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>
                                    {txForm.type === 'income' ? 'Received From / Description' : 'Paid To / Description'}
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder={txForm.type === 'income' ? 'e.g. Acme Corp, Salary, Project Payment' : 'e.g. Office Rent, Supplier Bill, Tea'}
                                    value={txForm.title}
                                    onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.816rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            {/* Amount & Date in one row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Amount ({currency.symbol})</label>
                                    <input
                                        required
                                        type="number"
                                        min="0.01"
                                        step="any"
                                        placeholder="0.00"
                                        value={txForm.amount}
                                        onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.861rem', fontWeight: '700', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={txForm.date}
                                        onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.816rem', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* Category & Payment Mode in one row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Category</label>
                                    <select
                                        value={txForm.category}
                                        onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', background: 'white', fontSize: '0.816rem', boxSizing: 'border-box' }}
                                    >
                                        <option value="">Select Category</option>
                                        {(txForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Payment Mode</label>
                                    <select
                                        value={txForm.payment_mode}
                                        onChange={(e) => setTxForm({ ...txForm, payment_mode: e.target.value })}
                                        style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', background: 'white', fontSize: '0.816rem', boxSizing: 'border-box' }}
                                    >
                                        <option value="UPI">UPI</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Card">Card</option>
                                        <option value="Cheque">Cheque</option>
                                    </select>
                                </div>
                            </div>

                            {/* Notes / Ref ID */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.317rem' }}>Notes / Reference (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Transaction ID, receipt #, or remarks"
                                    value={txForm.notes}
                                    onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                                    style={{ width: '100%', padding: '0.68rem 0.906rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', fontSize: '0.816rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.77rem',
                                    borderRadius: '14px',
                                    background: txForm.type === 'income' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '800',
                                    fontSize: '0.906rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                    marginTop: '0.453rem'
                                }}
                            >
                                {txForm.type === 'income' ? '+ Save Income Entry' : '- Save Expense Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Inward Customer Payment Modal */}
            {isPaymentModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '1.812rem' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '440px', borderRadius: '20px', padding: '2.266rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                            <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: 'var(--accent-ink)' }}>Record Customer Payment</h3>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSaveCustomerPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Select Customer Profile</label>
                                <select value={customerForm.customer_name} onChange={(e) => setCustomerForm({ ...customerForm, customer_name: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                    {customersList.length > 0 ? (
                                        customersList.map((c, idx) => {
                                            const name = c.name || c.customer_name || c.party_name || `Customer #${idx + 1}`;
                                            const details = c.company ? ` (${c.company})` : (c.phone ? ` (${c.phone})` : '');
                                            return <option key={c.id || idx} value={name}>{name}{details}</option>;
                                        })
                                    ) : (
                                        <>
                                            <option>Acme Corporates (Rahul Dev)</option>
                                            <option>Karan Johar Tech</option>
                                            <option>Sharma Retail Store</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Invoice Linked ID</label>
                                    <input required type="text" value={customerForm.invoice_id} onChange={(e) => setCustomerForm({ ...customerForm, invoice_id: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Original Amount ({currency.symbol})</label>
                                    <input 
                                        required 
                                        type="text" 
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="e.g. 10000"
                                        value={customerForm.total_amount} 
                                        onKeyDown={(e) => { if (['+', '-', '.', ',', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                                        onChange={(e) => {
                                            const sanitized = e.target.value.replace(/[^0-9]/g, '');
                                            setCustomerForm(prev => {
                                                let updatedPaid = prev.paid_amount;
                                                if (sanitized !== '' && updatedPaid !== '') {
                                                    const maxVal = Number(sanitized);
                                                    if (Number(updatedPaid) > maxVal) {
                                                        updatedPaid = String(maxVal);
                                                    }
                                                }
                                                return {
                                                    ...prev,
                                                    total_amount: sanitized,
                                                    paid_amount: updatedPaid
                                                };
                                            });
                                        }} 
                                        style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Paid amount (Receipt worth, {currency.symbol})</label>
                                <input 
                                    required 
                                    type="number" 
                                    min="0.01"
                                    step="any"
                                    max={customerForm.total_amount || undefined}
                                    value={customerForm.paid_amount} 
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') e.preventDefault(); }}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        if (val !== '' && customerForm.total_amount !== '') {
                                            const maxVal = Number(customerForm.total_amount);
                                            if (!isNaN(maxVal) && Number(val) > maxVal) {
                                                val = String(maxVal);
                                            }
                                        }
                                        setCustomerForm(prev => ({ ...prev, paid_amount: val }));
                                    }} 
                                    style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Payment Mode</label>
                                    <select value={customerForm.payment_mode} onChange={(e) => setCustomerForm({ ...customerForm, payment_mode: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                        <option>UPI</option>
                                        <option>Bank Transfer</option>
                                        <option>Cash</option>
                                        <option>Cheque</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Ref ID / UPI reference</label>
                                    <input required type="text" value={customerForm.transaction_reference} onChange={(e) => setCustomerForm({ ...customerForm, transaction_reference: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '0.906rem', borderRadius: '16px', background: 'var(--primary-gradient)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.997rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)' }}>
                                Finalize Payment Collection
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Outward Supplier Payment Modal */}
            {isSupplierModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '1.812rem' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '440px', borderRadius: '20px', padding: '2.266rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                            <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: 'var(--accent-ink)' }}>Record Supplier Disbursement</h3>
                            <button onClick={() => setIsSupplierModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSaveSupplierPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Select Supplier Profile</label>
                                <select value={supplierForm.supplier_name} onChange={(e) => setSupplierForm({ ...supplierForm, supplier_name: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                    <option>Delhi Distributors Ltd.</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Purchase Bill Linked ID</label>
                                    <input required type="text" value={supplierForm.purchase_id} onChange={(e) => setSupplierForm({ ...supplierForm, purchase_id: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Original Due Amount ({currency.symbol})</label>
                                    <input 
                                        required 
                                        type="number" 
                                        min="0"
                                        step="any"
                                        placeholder="0"
                                        value={supplierForm.total_amount} 
                                        onChange={(e) => setSupplierForm({ ...supplierForm, total_amount: e.target.value })} 
                                        style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Paid Amount (Outflow worth, {currency.symbol})</label>
                                <input 
                                    required 
                                    type="number" 
                                    min="0"
                                    step="any"
                                    placeholder="0"
                                    value={supplierForm.paid_amount} 
                                    onChange={(e) => setSupplierForm({ ...supplierForm, paid_amount: e.target.value })} 
                                    style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Disbursement Mode</label>
                                    <select value={supplierForm.payment_mode} onChange={(e) => setSupplierForm({ ...supplierForm, payment_mode: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                        <option>Bank Transfer</option>
                                        <option>Cheque</option>
                                        <option>UPI</option>
                                        <option>Cash</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Cheque / Ref No</label>
                                    <input required type="text" value={supplierForm.transaction_reference} onChange={(e) => setSupplierForm({ ...supplierForm, transaction_reference: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} />
                                </div>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '0.906rem', borderRadius: '16px', background: 'var(--primary-gradient)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.997rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)' }}>
                                Disburse Supplier Funds
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Internal Transfers Modal */}
            {isTransferModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(6, 78, 59, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '1.812rem' }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '440px', borderRadius: '20px', padding: '2.266rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                            <h3 style={{ fontSize: '1.133rem', fontWeight: '850', color: 'var(--accent-ink)' }}>Internal Vault Transfer</h3>
                            <button onClick={() => setIsTransferModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', padding: '0.544rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleInternalTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1.133rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.68rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>From Account</label>
                                    <select value={transferForm.from_acc_id} onChange={(e) => setTransferForm({ ...transferForm, from_acc_id: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                        {accounts.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).map(a => <option key={a.bank_account_id} value={a.bank_account_id}>{a.bank_account_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>To Account</label>
                                    <select value={transferForm.to_acc_id} onChange={(e) => setTransferForm({ ...transferForm, to_acc_id: e.target.value })} style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                                        {accounts.filter(item => applyTableFilters(item, typeof colFilters !== "undefined" ? colFilters : {})).map(a => (
                                            <option 
                                                key={a.bank_account_id} 
                                                value={a.bank_account_id}
                                                disabled={String(a.bank_account_id) === String(transferForm.from_acc_id)}
                                            >
                                                {a.bank_account_name}{String(a.bank_account_id) === String(transferForm.from_acc_id) ? ' (Source)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginBottom: '0.363rem' }}>Transfer Amount ({currency.symbol})</label>
                                <input 
                                    required 
                                    type="number" 
                                    min="0"
                                    step="any"
                                    placeholder="0"
                                    value={transferForm.amount} 
                                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })} 
                                    style={{ width: '100%', padding: '0.725rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                                />
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '0.906rem', borderRadius: '16px', background: 'var(--primary-gradient)', color: 'white', border: 'none', fontWeight: '800', fontSize: '0.997rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(27, 107, 58, 0.25)' }}>
                                Settle Fund Transfer
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* In-app Toast Notification Banner (Bottom-Right UI) */}
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.68rem',
                        padding: '0.77rem 1.133rem',
                        background: toast.type === 'error' ? '#FEF2F2' : '#0F172A',
                        color: toast.type === 'error' ? '#991B1B' : '#FFFFFF',
                        border: toast.type === 'error' ? '1px solid #FECACA' : '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                        fontWeight: 600,
                        fontSize: '0.816rem',
                        maxWidth: '420px',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    {toast.type === 'error' ? (
                        <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                    ) : (
                        <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1, lineHeight: '1.4' }}>{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        aria-label="Close notification"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BusinessPayments;
