import React, { useState } from 'react';
import {
    MoreHorizontal,
    Phone,
    Mail,
    Globe,
    Plus,
    Search,
    Filter
} from 'lucide-react';
import '../App.css';

const FinancialContacts = () => {
    // Mock data
    const [columns, setColumns] = useState([
        {
            id: 'new',
            title: 'Lead Received',
            count: 48,
            color: '#EF4444', // Red
            items: [
                {
                    id: 1,
                    initials: 'RE',
                    avatarBg: '#3B82F6', // Blue
                    name: 'Ralph Edwards',
                    time: 'Today 12:56 PM',
                    phone: '-',
                    email: 'ralphedwards@email.com',
                    website: 'COMPASS',
                    tag: 'Need Contact Details',
                    tagBg: '#FEF3C7',
                    tagColor: '#D97706'
                },
                {
                    id: 2,
                    initials: 'RR',
                    avatarBg: '#06B6D4', // Cyan
                    name: 'Ronald Richards',
                    time: 'Yesterday 3:56 PM',
                    phone: '(229) 529-7238',
                    email: '-',
                    website: 'Openrent',
                    tag: 'Need Contact Details',
                    tagBg: '#FEF3C7',
                    tagColor: '#D97706'
                },
                {
                    id: 3,
                    initials: 'LA',
                    avatarBg: '#2563EB', // Dark Blue
                    name: 'Lucas Arlene',
                    time: 'Yesterday 2:39 PM',
                    phone: '(316) 578-8293',
                    email: 'lucasa@email.com',
                    website: 'Apartments.com',
                    tag: 'Going Cold',
                    tagBg: '#F3F4F6',
                    tagColor: '#4B5563'
                },
                {
                    id: 4,
                    initials: 'SA',
                    avatarBg: '#9CA3AF', // Gray
                    name: 'Savannah Andrea',
                    time: 'Yesterday 1:02 PM',
                    phone: '-',
                    email: '-',
                    website: '-',
                    tag: 'Going Cold',
                    tagBg: '#F3F4F6',
                    tagColor: '#4B5563'
                }
            ]
        },
        {
            id: 'scheduled',
            title: 'Tour Scheduled',
            count: 5,
            color: '#F97316', // Orange
            items: [
                {
                    id: 5,
                    initials: 'CG',
                    avatarBg: '#A855F7', // Purple
                    name: 'Cameron Gilson',
                    time: 'Today 9:23 AM',
                    phone: '(702) 566-5172',
                    email: 'camerongil@email.com',
                    website: 'Apartments.com',
                    tag: 'Going Cold',
                    tagBg: '#F3F4F6',
                    tagColor: '#4B5563'
                },
                {
                    id: 6,
                    initials: 'MM',
                    avatarBg: '#1F2937', // Dark
                    name: 'Marvin McKinney',
                    time: 'Yesterday 2:39 PM',
                    phone: '(684) 555-9230',
                    email: 'marvinmc@email.com',
                    website: 'Zillow',
                    tag: 'Need Follow Up',
                    tagBg: '#DBEAFE',
                    tagColor: '#1D4ED8'
                },
                {
                    id: 15,
                    initials: 'JC',
                    avatarBg: '#4F46E5', // Indigo
                    name: 'Jane Cooper',
                    time: 'Yesterday 9:23 AM',
                    phone: '(702) 566-5172',
                    email: 'janecooper@email.com',
                    website: 'Apartments.com',
                    tag: 'Need Follow Up',
                    tagBg: '#DBEAFE',
                    tagColor: '#1D4ED8'
                },
                {
                    id: 16,
                    initials: 'BS',
                    avatarBg: '#0EA5E9', // Sky
                    name: 'Brooklyn Simmons',
                    time: 'Yesterday 9:05 AM',
                    phone: '-',
                    email: '-',
                    website: '-',
                    tag: 'Going Cold',
                    tagBg: '#F3F4F6',
                    tagColor: '#4B5563'
                }
            ]
        },
        {
            id: 'process',
            title: 'Application Received',
            count: 3,
            color: '#3B82F6', // Blue
            items: [
                {
                    id: 7,
                    initials: 'EP', // Image placeholder
                    isImage: true,
                    avatarBg: '#EC4899',
                    name: 'Eleanor Pena',
                    time: 'Today 10:49 AM',
                    phone: '(704) 592-0627',
                    email: 'elepena@email.com',
                    website: 'Zillow',
                    tag: 'Need Follow Up',
                    tagBg: '#DBEAFE',
                    tagColor: '#1D4ED8'
                },
                {
                    id: 8,
                    initials: 'AC', // Image placeholder
                    isImage: true,
                    avatarBg: '#EF4444',
                    name: 'Andrew Cody',
                    time: 'Yesterday 4:23 PM',
                    phone: '(252) 543-0627',
                    email: 'andrewcd@email.com',
                    website: 'trulia',
                    tag: 'Fast Response',
                    tagBg: '#DCFCE7',
                    tagColor: '#15803D'
                },
                {
                    id: 9,
                    initials: 'RF',
                    avatarBg: '#F97316',
                    name: 'Robert Fox',
                    time: 'Yesterday 4:05 PM',
                    phone: '(702) 566-5172',
                    email: 'robertfox@email.com',
                    website: 'trulia',
                    tag: 'Fast Response',
                    tagBg: '#DCFCE7',
                    tagColor: '#15803D'
                }
            ]
        },
        {
            id: 'approved',
            title: 'Application Approved',
            count: 2,
            color: '#22C55E', // Green
            items: [
                {
                    id: 10,
                    initials: 'RH',
                    isImage: true,
                    avatarBg: '#1E40AF',
                    name: 'Robert Hawkins',
                    time: 'Today 2:38 PM',
                    phone: '(270) 685-0957',
                    email: 'roberth@email.com',
                    website: 'Openrent',
                    tag: 'Fast Response',
                    tagBg: '#DCFCE7',
                    tagColor: '#15803D'
                },
                {
                    id: 11,
                    initials: 'AC',
                    isImage: true,
                    avatarBg: '#CA8A04',
                    name: 'Annette Cute',
                    time: 'Yesterday 4:23 PM',
                    phone: '(302) 566-9823',
                    email: 'annettecute@email.com',
                    website: 'Zillow',
                    tag: 'Need Follow Up',
                    tagBg: '#DBEAFE',
                    tagColor: '#1D4ED8'
                }
            ]
        }
    ]);

    return (
        <div className="contacts-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Financial Contacts</h1>
                    <p className="subtitle">Manage your professional network</p>
                </div>
                <div className="controls">
                    <button className="btn-secondary">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} />
                        Add Contact
                    </button>
                </div>
            </div>

            <div className="kanban-board">
                {columns.map((column) => (
                    <div key={column.id} className="kanban-column">


                        <div className="column-content">
                            {column.items.map((item) => (
                                <div key={item.id} className="contact-card">
                                    <div className="card-header-row">
                                        <h4 className="contact-name">{item.name}</h4>
                                        {item.tag && (
                                            <span
                                                className="status-tag"
                                                style={{ background: item.tagBg, color: item.tagColor }}
                                            >
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>

                                    <p className="contact-time">{item.time}</p>

                                    <div className="contact-details">
                                        <div className="detail-row">
                                            <Phone size={14} className="detail-icon" />
                                            <span>{item.phone}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Mail size={14} className="detail-icon" />
                                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Globe size={14} className="detail-icon" />
                                            <span className="website-link">{item.website}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .contacts-page {
                    display: flex;
                    flex-direction: column;
                    background-color: #F8FAFC;
                    min-height: 100vh;
                    padding-bottom: 20px;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 32px;
                    background: white;
                    border-bottom: 1px solid var(--border-color);
                    flex-shrink: 0;
                    margin-bottom: 20px;
                }

                .page-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-main);
                }

                .subtitle {
                    margin: 4px 0 0;
                    font-size: 14px;
                    color: var(--text-muted);
                }

                .controls {
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
                    cursor: pointer;
                    font-size: 13px;
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
                    cursor: pointer;
                    font-size: 13px;
                }

                .kanban-board {
                    flex: 1;
                    display: flex;
                    align-items: flex-start;
                    gap: 20px; 
                    padding: 0 32px;
                    height: auto;
                }

                .kanban-column {
                    flex: 1; 
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    background: transparent;
                    border-right: none;
                }

                .column-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 2px 16px 2px;
                    background: transparent;
                    margin-bottom: 0;
                }

                .column-title-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                .column-header h3 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #334155;
                }

                .count-badge {
                    background: #E2E8F0;
                    color: #64748B;
                    font-size: 11px;
                    padding: 1px 6px;
                    border-radius: 10px;
                    font-weight: 600;
                }

                .column-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .contact-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    border: 1px solid transparent;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                }

                .contact-card:hover {
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    transform: translateY(-1px);
                    border-color: #E2E8F0;
                }

                .card-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 4px;
                }

                .contact-name {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 700;
                    color: #1E293B;
                }

                .status-tag {
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                    margin-left: 12px;
                }

                .contact-time {
                    margin: 0 0 16px 0;
                    font-size: 12px;
                    color: #64748B;
                }

                .contact-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    color: #475569;
                    min-width: 0;
                }

                .detail-icon {
                    color: #94A3B8;
                    width: 15px;
                    height: 15px;
                    flex-shrink: 0;
                }

                .truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .website-link {
                    color: #0F172A;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default FinancialContacts;
