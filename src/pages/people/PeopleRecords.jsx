import React, { useState } from 'react';
import {
    Plus,
    FileText,
    Image,
    Paperclip,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    Eye
} from 'lucide-react';
import '../../App.css';

const PeopleRecords = () => {
    const [records] = useState([
        { id: 1, title: 'Invoice #001 - John Doe', type: 'invoice', date: '2024-03-01', size: '2.4 MB', format: 'PDF' },
        { id: 2, title: 'Chat Screenshot', type: 'image', date: '2024-02-28', size: '500 KB', format: 'PNG' },
        { id: 3, title: 'Settlement Agreement', type: 'contract', date: '2024-02-25', size: '1.2 MB', format: 'DOCX' },
        { id: 4, title: 'Payment Receipt', type: 'receipt', date: '2024-02-20', size: '150 KB', format: 'JPG' },
    ]);

    const getIconForType = (type) => {
        switch (type) {
            case 'image': return <Image size={24} color="#3B82F6" />;
            case 'invoice': return <FileText size={24} color="#EF4444" />;
            case 'contract': return <Paperclip size={24} color="#F59E0B" />;
            default: return <FileText size={24} color="#64748B" />;
        }
    };

    return (
        <div className="records-page">
            {/* Header */}
            <div className="page-header-container">
                <div>

                    <p className="page-subtitle">Store and manage important financial documents</p>
                </div>
                <div className="header-controls">
                    <button className="btn-secondary">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} />
                        <span>Upload Record</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="content-card">
                {/* Toolbar */}
                <div className="table-toolbar">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="search-input-field"
                        />
                    </div>
                </div>

                {/* Records Grid */}
                <div className="records-grid">
                    {records.map(record => (
                        <div key={record.id} className="record-card">
                            <div className="record-preview">
                                {getIconForType(record.type)}
                                <span className="record-format">{record.format}</span>
                            </div>
                            <div className="record-info">
                                <h4 className="record-title">{record.title}</h4>
                                <div className="record-meta">
                                    <span>{record.date}</span>
                                    <span className="dot">•</span>
                                    <span>{record.size}</span>
                                </div>
                            </div>
                            <div className="record-actions">
                                <button className="action-btn" title="View">
                                    <Eye size={16} />
                                </button>
                                <button className="action-btn" title="Download">
                                    <Download size={16} />
                                </button>
                                <button className="action-btn" title="More">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder */}
                    <div className="upload-placeholder">
                        <div className="upload-content">
                            <div className="upload-icon">
                                <Plus size={24} />
                            </div>
                            <span className="upload-text">Add New File</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .records-page {
                    padding: 24px;
                    background-color: #E9F4FF;
                    min-height: 100vh;
                }

                .page-header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .page-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0;
                }

                .page-subtitle {
                    color: var(--text-muted);
                    font-size: 14px;
                    margin-top: 4px;
                }

                .header-controls {
                    display: flex;
                    gap: 12px;
                }

                .btn-secondary {
                    background: white;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                    padding: 8px 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    font-size: 13px;
                    cursor: pointer;
                }

                .btn-primary {
                    background: #195BAC;
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    font-size: 13px;
                    cursor: pointer;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }

                .content-card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    overflow: hidden;
                    padding: 24px;
                }

                .table-toolbar {
                    margin-bottom: 24px;
                }

                .search-input-wrapper {
                    position: relative;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94A3B8;
                }

                .search-input-field {
                    width: 100%;
                    padding: 10px 16px 10px 40px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                }
                .search-input-field:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
                }

                .records-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }

                .record-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: #fff;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }

                .record-card:hover {
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                    border-color: #cbd5e1;
                }

                .record-preview {
                    width: 48px;
                    height: 48px;
                    background: #F8FAFC;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    border: 1px solid #F1F5F9;
                }

                .record-format {
                    font-size: 8px;
                    font-weight: 700;
                    color: #64748B;
                    margin-top: 2px;
                }

                .record-info {
                    flex: 1;
                    min-width: 0;
                }

                .record-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0 0 4px 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .record-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: var(--text-muted);
                }

                .dot {
                    font-size: 18px;
                    line-height: 0;
                    color: #CBD5E1;
                }

                .record-actions {
                    display: flex;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .record-card:hover .record-actions {
                    opacity: 1;
                }

                .action-btn {
                    padding: 6px;
                    border: none;
                    background: transparent;
                    color: #94A3B8;
                    cursor: pointer;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn:hover {
                    background: #F1F5F9;
                    color: var(--text-main);
                }

                .upload-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px dashed #E2E8F0;
                    border-radius: 12px;
                    height: 82px; /* Match height of other cards roughly */
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .upload-placeholder:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .upload-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748B;
                }

                .upload-placeholder:hover .upload-content {
                    color: #3b82f6;
                }

                .upload-text {
                    font-size: 14px;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default PeopleRecords;
