import React, { useState } from 'react';
import { Plus, FileText, Image, Paperclip, Search } from 'lucide-react';
import '../../App.css';

const PeopleRecords = () => {
    const [records] = useState([
        { id: 1, title: 'Invoice #001 - John Doe', type: 'invoice', date: '2024-03-01', size: '2 MB' },
        { id: 2, title: 'Chat Screenshot', type: 'image', date: '2024-02-28', size: '500 KB' },
    ]);

    return (
        <>
            <div className="dashboard-header">
                <h1 className="page-title">Records & Attachments</h1>
                <div className="header-actions">
                    <button className="btn-primary" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                        <Plus size={16} />
                        <span>Add Note</span>
                    </button>
                    <button className="btn-primary">
                        <Paperclip size={16} />
                        <span>Upload Record</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="controls-bar">
                    <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search records..." className="search-input"
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                    </div>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {records.map(record => (
                        <div key={record.id} className="dashboard-tile" style={{ padding: '0', minHeight: 'auto', overflow: 'hidden', cursor: 'pointer' }}>
                            <div style={{ height: '140px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                {record.type === 'image' ? <Image size={48} /> : <FileText size={48} />}
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{record.title}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{record.date}</span>
                                    <span>{record.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PeopleRecords;
