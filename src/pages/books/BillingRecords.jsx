import React, { useState, useEffect } from 'react';
import { 
    Receipt, 
    Search, 
    Trash2, 
    Plus, 
    User, 
    Calendar, 
    ShoppingBag, 
    Eye, 
    X,
    FileSpreadsheet,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSavedBillingRecords } from './SimpleBilling';

const LOCAL_STORAGE_KEY = 'cliks_billing_records_v1';

const BillingRecords = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        setRecords(getSavedBillingRecords());
    }, []);

    const handleDeleteRecord = (id, e) => {
        if (e) e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete bill #${id}?`)) {
            const updated = records.filter(r => r.id !== id);
            setRecords(updated);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            if (selectedRecord?.id === id) {
                setSelectedRecord(null);
            }
        }
    };

    const handleClearAll = () => {
        if (records.length === 0) return;
        if (window.confirm('Are you sure you want to clear ALL billing records? This action cannot be undone.')) {
            setRecords([]);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setSelectedRecord(null);
        }
    };

    const filteredRecords = records.filter(r => {
        const term = searchTerm.toLowerCase();
        const customerMatch = r.customerName?.toLowerCase().includes(term);
        const billIdMatch = r.id?.toLowerCase().includes(term);
        const productMatch = r.products?.some(p => p.name?.toLowerCase().includes(term));
        return customerMatch || billIdMatch || productMatch;
    });

    const grandTotalRevenue = records.reduce((sum, r) => sum + (parseFloat(r.grandTotal) || 0), 0);
    const grandTotalItemsSold = records.reduce((sum, r) => sum + (parseFloat(r.totalQuantity) || 0), 0);

    return (
        <div style={{ padding: '1.812rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.812rem',
                flexWrap: 'wrap',
                gap: '0.906rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', color: '#1B6B3A', marginBottom: '0.227rem' }}>
                        <Receipt size={22} />
                        <span style={{ fontSize: '0.77rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Track Module</span>
                    </div>
                    <h1 style={{ fontSize: '1.677rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                        Billing Records
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.816rem', margin: '0.227rem 0 0 0' }}>
                        View, search, and manage all your submitted customer bills.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.68rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/books/track/simple-billing')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.453rem',
                            padding: '0.589rem 1.133rem',
                            background: 'linear-gradient(135deg, #1B6B3A 0%, #064E3B 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.793rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(27, 107, 58, 0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Plus size={16} /> Create New Bill
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.133rem',
                marginBottom: '1.812rem'
            }}>
                {/* Card 1: Total Bills */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.133rem 1.359rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <span>Total Bills Issued</span>
                        <Receipt size={18} style={{ color: '#1B6B3A' }} />
                    </div>
                    <div style={{ fontSize: '1.586rem', fontWeight: 900, color: '#0F172A', marginTop: '0.453rem' }}>
                        {records.length}
                    </div>
                </div>

                {/* Card 2: Total Items Sold */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.133rem 1.359rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <span>Total Items Sold</span>
                        <ShoppingBag size={18} style={{ color: '#0284C7' }} />
                    </div>
                    <div style={{ fontSize: '1.586rem', fontWeight: 900, color: '#0F172A', marginTop: '0.453rem' }}>
                        {grandTotalItemsSold}
                    </div>
                </div>

                {/* Card 3: Total Sales Revenue */}
                <div style={{
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    borderRadius: '16px',
                    padding: '1.133rem 1.359rem',
                    border: '1px solid #BBF7D0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#166534', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <span>Total Billing Revenue</span>
                        <FileSpreadsheet size={18} style={{ color: '#1B6B3A' }} />
                    </div>
                    <div style={{ fontSize: '1.586rem', fontWeight: 900, color: '#1B6B3A', marginTop: '0.453rem' }}>
                        ₹{grandTotalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Filter & Table Section */}
            <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '1.359rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
            }}>
                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.359rem',
                    flexWrap: 'wrap',
                    gap: '0.906rem'
                }}>
                    <div style={{
                        position: 'relative',
                        flex: '1',
                        minWidth: '280px',
                        maxWidth: '500px'
                    }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search by customer name, bill ID, or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.589rem 0.906rem 0.589rem 2.356rem',
                                borderRadius: '12px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.816rem',
                                fontWeight: 500,
                                outline: 'none',
                                background: '#F8FAFC'
                            }}
                        />
                    </div>

                    {records.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            style={{
                                background: '#FEE2E2',
                                color: '#DC2626',
                                border: 'none',
                                padding: '0.498rem 0.906rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.748rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.363rem'
                            }}
                        >
                            <Trash2 size={15} /> Clear All Records
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="cliks-table-scroll">
                    <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', color: '#64748B', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>Billing Order #</th>
                                <th style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>Customer Name</th>
                                <th style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>Date & Time</th>
                                <th style={{ padding: '0.589rem 0.78rem', whiteSpace: 'nowrap' }}>Products Summary</th>
                                <th style={{ padding: '0.589rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Total Qty</th>
                                <th style={{ padding: '0.589rem 0.78rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Grand Total</th>
                                <th style={{ padding: '0.589rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr 
                                    key={record.id}
                                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                                >
                                    {/* Bill ID */}
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', fontWeight: 800, color: '#1B6B3A', whiteSpace: 'nowrap' }} title={`#${record.id}`}>
                                        #{record.id}
                                    </td>

                                    {/* Customer Name */}
                                    <td style={{ padding: '0.625rem 0.78rem', fontWeight: 700, color: '#0F172A', maxWidth: '180px' }} title={record.customerName}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{record.customerName}</div>
                                    </td>

                                    {/* Date & Time */}
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', color: '#64748B', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                                        {record.formattedDate}
                                    </td>

                                    {/* Products Summary */}
                                    <td style={{ padding: '0.625rem 0.78rem', color: '#334155', minWidth: '160px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.317rem' }}>
                                            {record.products?.slice(0, 2).map((p, idx) => (
                                                <span key={idx} className="badge-nowrap" style={{
                                                    background: '#F1F5F9',
                                                    color: '#334155',
                                                    padding: '0.181rem 0.453rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.707rem',
                                                    fontWeight: 600
                                                }}>
                                                    {p.name} ({p.quantity})
                                                </span>
                                            ))}
                                            {record.products?.length > 2 && (
                                                <span className="badge-nowrap" style={{
                                                    background: '#E2E8F0',
                                                    color: '#475569',
                                                    padding: '0.181rem 0.453rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.707rem',
                                                    fontWeight: 700
                                                }}>
                                                    +{record.products.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Total Quantity */}
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                                        {record.totalQuantity}
                                    </td>

                                    {/* Grand Total */}
                                    <td className="cell-num" style={{ padding: '0.625rem 0.78rem', textAlign: 'right', fontWeight: 900, color: '#1B6B3A', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                                        ₹{parseFloat(record.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>

                                    {/* Actions */}
                                    <td className="cell-nowrap" style={{ padding: '0.625rem 0.78rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'inline-flex', justifyContent: 'center', gap: '0.453rem' }}>
                                            <button
                                                onClick={() => setSelectedRecord(record)}
                                                style={{
                                                    background: '#F0FDF4',
                                                    color: '#1B6B3A',
                                                    border: 'none',
                                                    padding: '0.363rem 0.589rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                    fontSize: '0.725rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.272rem',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                title="View Bill Details"
                                            >
                                                <Eye size={15} /> Details
                                            </button>

                                            <button
                                                onClick={(e) => handleDeleteRecord(record.id, e)}
                                                style={{
                                                    background: '#FEE2E2',
                                                    color: '#EF4444',
                                                    border: 'none',
                                                    padding: '0.363rem 0.589rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Delete Bill"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3.172rem', textAlign: 'center', color: '#94A3B8' }}>
                                        <Receipt size={36} style={{ color: '#CBD5E1', marginBottom: '0.453rem' }} />
                                        <h4 style={{ margin: 0, fontWeight: 700, color: '#64748B' }}>No Billing Records Found</h4>
                                        <p style={{ margin: '0.227rem 0 0.906rem 0', fontSize: '0.77rem' }}>
                                            {searchTerm ? 'No results matched your search query.' : 'You have not submitted any bills yet.'}
                                        </p>
                                        {!searchTerm && (
                                            <button
                                                onClick={() => navigate('/books/track/simple-billing')}
                                                style={{
                                                    background: '#1B6B3A',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    padding: '0.544rem 1.087rem',
                                                    borderRadius: '10px',
                                                    fontWeight: 700,
                                                    fontSize: '0.77rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Create First Bill
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: View Bill Details */}
            {selectedRecord && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '0.906rem'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        maxWidth: '650px',
                        width: '100%',
                        padding: '1.812rem',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        position: 'relative',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
                            <div>
                                <span style={{ background: '#F0FDF4', color: '#1B6B3A', padding: '0.227rem 0.544rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                                    #{selectedRecord.id}
                                </span>
                                <h2 style={{ margin: '0.363rem 0 0 0', fontSize: '1.269rem', fontWeight: 800, color: '#0F172A' }}>
                                    Bill Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#64748B' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Customer & Timestamp Info */}
                        <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '0.906rem 1.133rem', marginBottom: '1.359rem', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.453rem' }}>
                                <span style={{ color: '#64748B', fontSize: '0.725rem', fontWeight: 700 }}>Customer Name</span>
                                <strong style={{ color: '#0F172A', fontSize: '0.861rem' }}>{selectedRecord.customerName}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748B', fontSize: '0.725rem', fontWeight: 700 }}>Date & Time</span>
                                <span style={{ color: '#475569', fontSize: '0.77rem' }}>{selectedRecord.formattedDate}</span>
                            </div>
                        </div>

                        {/* Items Table */}
                        <h4 style={{ margin: '0 0 0.68rem 0', fontSize: '0.861rem', fontWeight: 800, color: '#1E293B' }}>
                            Products List
                        </h4>
                        <div className="cliks-table-scroll" style={{ border: '1px solid #E2E8F0', borderRadius: '12px', marginBottom: '1.359rem' }}>
                            <table className="cliks-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.77rem' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', color: '#64748B', fontWeight: 800, borderBottom: '1px solid #E2E8F0' }}>
                                        <th style={{ padding: '0.544rem 0.77rem', whiteSpace: 'nowrap' }}>Product</th>
                                        <th style={{ padding: '0.544rem 0.77rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Selling Rate</th>
                                        <th style={{ padding: '0.544rem 0.77rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Qty</th>
                                        <th style={{ padding: '0.544rem 0.77rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedRecord.products?.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '0.544rem 0.77rem', fontWeight: 700, color: '#0F172A' }}>{item.name}</td>
                                            <td className="cell-num" style={{ padding: '0.544rem 0.77rem', color: '#475569', textAlign: 'right', whiteSpace: 'nowrap' }}>₹{parseFloat(item.rate).toFixed(2)}</td>
                                            <td className="cell-nowrap" style={{ padding: '0.544rem 0.77rem', textAlign: 'center', fontWeight: 700, whiteSpace: 'nowrap' }}>{item.quantity}</td>
                                            <td className="cell-num" style={{ padding: '0.544rem 0.77rem', textAlign: 'right', fontWeight: 800, color: '#1B6B3A', whiteSpace: 'nowrap' }}>
                                                ₹{parseFloat(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer Totals */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #F1F5F9', paddingTop: '0.906rem' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>Total Items</span>
                                <strong style={{ fontSize: '0.997rem', color: '#0F172A' }}>{selectedRecord.totalQuantity}</strong>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748B', fontWeight: 700 }}>Grand Total</span>
                                <strong style={{ fontSize: '1.269rem', color: '#1B6B3A', fontWeight: 900 }}>
                                    ₹{parseFloat(selectedRecord.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingRecords;
