import React, { useState } from 'react';
import { Plus, Search, Filter, User, MoreVertical, Edit2 } from 'lucide-react';
import '../../App.css';
import { formatCurrency } from '../../lib/formatCurrency';

const PeopleOverview = () => {
    // Mock Data
    const [people] = useState([
        { id: 1, name: 'John Doe', category: 'Friend', netBalance: 500, type: 'receivable', totalGiven: 1000, totalReceived: 500, status: 'Active' },
        { id: 2, name: 'Jane Smith', category: 'Vendor', netBalance: -200, type: 'payable', totalGiven: 0, totalReceived: 200, status: 'Active' },
    ]);

    return (
        <>
            <div className="dashboard-header">

                <div className="header-actions">
                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Add Person</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Stats Cards */}
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', minHeight: 'auto' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Net Receivables</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16A34A', marginTop: '0.5rem' }}>{formatCurrency(500)}</div>
                    </div>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', minHeight: 'auto' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Net Payables</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DC2626', marginTop: '0.5rem' }}>{formatCurrency(200)}</div>
                    </div>
                    <div className="dashboard-tile" style={{ padding: '1.5rem', minHeight: 'auto' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Contacts</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>2</div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="controls-bar">
                    <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="search-input"
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none' }}
                        />
                    </div>
                    <button className="icon-btn"><Filter size={20} /></button>
                </div>

                {/* People List */}
                <div className="stock-list-container" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="stock-list-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>
                        <div>Name</div>
                        <div>Category</div>
                        <div>Net Balance</div>
                        <div>Total Given</div>
                        <div>Total Received</div>
                        <div></div>
                    </div>

                    {people.map(person => (
                        <div key={person.id} className="stock-item-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} className="text-muted" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500' }}>{person.name}</div>
                                </div>
                            </div>
                            <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', background: '#E0F2FE', color: '#0369A1', fontSize: '0.8rem', width: 'fit-content' }}>
                                {person.category}
                            </div>
                            <div style={{ fontWeight: '600', color: person.type === 'receivable' ? '#16A34A' : '#DC2626' }}>
                                {person.type === 'receivable' ? '+' : '-'}{formatCurrency(Math.abs(person.netBalance))}
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>{formatCurrency(person.totalGiven)}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{formatCurrency(person.totalReceived)}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PeopleOverview;
