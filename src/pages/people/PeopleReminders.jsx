import { useQuery } from '@tanstack/react-query';
import { peopleService } from '../../services';
import '../../App.css';

const PeopleReminders = () => {
    // Fetch Global Reminders
    const { data: reminders = [], isLoading } = useQuery({
        queryKey: ['people-reminders-all'],
        queryFn: async () => {
            const data = await peopleService.getAllReminders();
            return data.map(rem => ({
                id: rem.id,
                person: rem.person_name || 'Generic',
                amount: parseFloat(rem.amount),
                dueDate: rem.due_date,
                status: rem.status || 'upcoming',
                type: rem.type || 'Payment'
            }));
        }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const dueToday = reminders.filter(r => r.dueDate === todayStr && r.status !== 'settled').length;
    const upcoming = reminders.filter(r => r.status === 'upcoming').length;
    const overdue = reminders.filter(r => r.status === 'overdue').length;

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #E3F2FD', borderTopColor: '#1E40AF', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="reminders-page">
            <div className="page-header-container">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">People Reminders</h1>
                    <p className="page-subtitle">Manage payments and follow-ups</p>
                </div>
                <div className="header-controls">
                    <button className="btn-secondary">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="btn-primary">
                        <Plus size={18} />
                        <span>Set Reminder</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <p className="stat-label">Due Today</p>
                        <h3 className="stat-value">{dueToday}</h3>
                    </div>
                    <div className="stat-icon-wrapper bg-blue">
                        <Calendar size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div>
                        <p className="stat-label">Upcoming</p>
                        <h3 className="stat-value">{upcoming}</h3>
                    </div>
                    <div className="stat-icon-wrapper bg-amber">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div>
                        <p className="stat-label">Overdue</p>
                        <h3 className="stat-value">{overdue}</h3>
                    </div>
                    <div className="stat-icon-wrapper bg-red">
                        <AlertCircle size={20} />
                    </div>
                </div>
            </div>

            <div className="content-card">
                <div className="table-toolbar">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search reminders..."
                            className="search-input-field"
                        />
                    </div>
                </div>

                <div className="list-header">
                    <div>Person</div>
                    <div>Type</div>
                    <div>Amount</div>
                    <div>Due Date</div>
                    <div>Status</div>
                    <div className="text-right">Action</div>
                </div>

                <div className="list-body">
                    {reminders.length === 0 ? (
                        <div className="p-8 text-center text-muted italic">No reminders found.</div>
                    ) : reminders.map(rem => (
                        <div key={rem.id} className="list-row">
                            <div className="font-strong">{rem.person}</div>
                            <div className="text-muted">{rem.type}</div>
                            <div className="font-strong">₹{rem.amount.toLocaleString()}</div>
                            <div className="text-date">
                                <Calendar size={14} />
                                {rem.dueDate}
                            </div>
                            <div>
                                <span className={`status-badge ${rem.status}`}>
                                    {rem.status.charAt(0).toUpperCase() + rem.status.slice(1)}
                                </span>
                            </div>
                            <div className="row-actions">
                                <button className="icon-btn success" title="Mark Settled">
                                    <CheckCircle size={18} />
                                </button>
                                <button className="icon-btn neutral">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .reminders-page {
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .stat-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text-muted);
                    margin: 0 0 4px 0;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0;
                }

                .stat-icon-wrapper {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .bg-blue { background: #eff6ff; color: #2563eb; }
                .bg-amber { background: #fffbeb; color: #d97706; }
                .bg-red { background: #fef2f2; color: #dc2626; }

                .content-card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    overflow: hidden;
                }

                .table-toolbar {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-color);
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

                .list-header {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1fr 0.5fr;
                    gap: 16px;
                    padding: 16px;
                    background: #F8FAFC;
                    border-bottom: 1px solid var(--border-color);
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .list-body .list-row {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1fr 0.5fr;
                    gap: 16px;
                    padding: 16px;
                    align-items: center;
                    border-bottom: 1px solid var(--border-color);
                    transition: background 0.2s;
                }

                .list-row:hover {
                    background: #F8FAFC;
                }

                .list-row:last-child {
                    border-bottom: none;
                }

                .font-strong {
                    font-weight: 600;
                    color: var(--text-main);
                    font-size: 14px;
                }

                .text-muted {
                    color: var(--text-muted);
                    font-size: 14px;
                }

                .text-date {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-muted);
                    font-size: 14px;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 10px;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .status-badge.upcoming { background: #fffbeb; color: #b45309; }
                .status-badge.overdue { background: #fef2f2; color: #b91c1c; }

                .row-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .icon-btn {
                    padding: 6px;
                    border: none;
                    background: transparent;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .icon-btn.success { color: #CBD5E1; }
                .icon-btn.success:hover { background: #ecfdf5; color: #059669; }

                .icon-btn.neutral { color: #CBD5E1; }
                .icon-btn.neutral:hover { background: #F1F5F9; color: #475569; }

                .text-right { text-align: right; }
            `}</style>
        </div>
    );
};

export default PeopleReminders;
