import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incomeService } from '../services';
import {
    TrendingUp,
    Plus,
    Calendar,
    PieChart,
    ArrowUpRight,
    IndianRupee,
    Briefcase,
    Building2,
    Search,
    Filter,
    ChevronDown,
    Trash2,
    Edit2
} from 'lucide-react';
import '../App.css';
import { formatCurrency } from '../lib/formatCurrency';

const ICON_MAP = {
    Employment: Briefcase,
    Business: Building2,
    Investments: TrendingUp,
    Property: Building2,
    Default: IndianRupee
};

const IncomeStr = (props) => {
    const { label, value, subtext, icon: Icon, colorClass } = props;
    return (
    <div className="income-stat-card">
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
};

const Income = () => {
    const queryClient = useQueryClient();
    
    // Fetch income data
    const { data: incomeData = [], isLoading } = useQuery({
        queryKey: ['income'],
        queryFn: async () => {
            const data = await incomeService.getIncome();
            return data.map(item => ({
                id: item.id,
                source: item.source,
                amount: parseFloat(item.amount),
                category: item.category,
                date: item.date || item.created_at,
                recurring: !!item.recurring,
                icon: ICON_MAP[item.category] || ICON_MAP.Default
            }));
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => incomeService.deleteIncome(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['income'] });
        }
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this income record?')) {
            deleteMutation.mutate(id);
        }
    };

    const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const recurringIncome = incomeData.filter(item => item.recurring).reduce((sum, item) => sum + item.amount, 0);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #DCF2E4', borderTopColor: '#1B6B3A', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.363rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#1B6B3A 0%,#064E3B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <TrendingUp size={20} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.586rem', fontWeight: 900, color: 'var(--text-main, #0F172A)', lineHeight: 1.1 }}>Income</h1>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted, #64748B)', fontSize: '0.816rem', fontWeight: 500 }}>Track and manage your revenue streams</p>
                </div>
                <button className="btn-primary" data-tour="income-record-button">
                    <Plus size={18} />
                    <span>Record Income</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="income-stats-grid">
                    <IncomeStr
                        label="Total Income"
                        value={formatCurrency(totalIncome)}
                        subtext="+12% from last month"
                        icon={IndianRupee}
                        colorClass="icon-green"
                    />
                    <IncomeStr
                        label="Recurring Revenue"
                        value={formatCurrency(recurringIncome)}
                        subtext="Monthly stable income"
                        icon={Calendar}
                        colorClass="icon-blue"
                    />
                    <IncomeStr
                        label="Active Sources"
                        value={incomeData.length}
                        subtext={`Across ${new Set(incomeData.map(i => i.category)).size} categories`}
                        icon={PieChart}
                        colorClass="icon-purple"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search income sources..." className="search-input" />
                    </div>

                    <div className="flex gap-3">
                        <button className="filter-btn">
                            <Filter size={16} />
                            <span>Filter</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="filter-btn">
                            <Calendar size={16} />
                            <span>This Month</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Income Table */}
                <div className="income-list-container">
                    <table className="income-table">
                        <thead>
                            <tr>
                                <th>Source Name</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.719rem', color: '#94a3b8' }}>
                                        No income records found.
                                    </td>
                                </tr>
                            ) : (
                                incomeData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="table-icon-bg">
                                                    <item.icon size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-main">{item.source}</div>
                                                    {item.recurring && (
                                                        <span className="recurring-badge">Recurring</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-pill">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="text-muted">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className="font-bold text-success">+{formatCurrency(item.amount)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="action-btn hover-blue" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="action-btn hover-red" 
                                                    title="Delete"
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .page-fade-in {
                    animation: fadeIn 0.4s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .income-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.359rem;
                    margin-bottom: 1.812rem;
                }

                .income-stat-card {
                    background: white;
                    padding: 1.359rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .income-stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 12px rgba(0,0,0,0.04);
                }

                .stat-label {
                    color: var(--text-muted);
                    font-size: 0.793rem;
                    font-weight: 500;
                    margin-bottom: 0.453rem;
                }

                .stat-value {
                    font-size: 1.586rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 0.227rem;
                }

                .stat-subtext {
                    font-size: 0.725rem;
                    color: #10B981; /* Green for positive growth hints */
                    font-weight: 500;
                }

                .stat-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon-green { background: #DCFCE7; color: #16A34A; }
                .icon-blue { background: #DBEAFE; color: #1B6B3A; }
                .icon-purple { background: #F3E8FF; color: #9333EA; }

                /* Search & Filters */
                .search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .search-input {
                    width: 100%;
                    padding: 0.68rem 0.906rem 0.68rem 2.266rem;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    outline: none;
                    font-size: 0.816rem;
                    background: white;
                    transition: border-color 0.2s;
                }
                .search-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(27, 107, 58, 0.1);
                }

                .filter-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.453rem;
                    padding: 0.68rem 0.906rem;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    font-size: 0.816rem;
                    font-weight: 500;
                    color: var(--text-main);
                    transition: all 0.2s;
                }
                .filter-btn:hover {
                    background: #F8FAFC;
                    border-color: #CBD5E1;
                }

                /* Table Styling */
                .income-list-container {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }

                .income-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .income-table th {
                    text-align: left;
                    padding: 0.625rem 0.906rem;
                    background: #F8FAFC;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-muted);
                    font-weight: 700;
                    font-size: 0.68rem;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    white-space: nowrap;
                }

                .income-table td {
                    padding: 0.625rem 0.906rem;
                    border-bottom: 1px solid var(--border-color);
                    vertical-align: middle;
                    color: var(--text-main);
                    font-size: 0.8rem;
                }

                .income-table tr:last-child td {
                    border-bottom: none;
                }

                .income-table tr:hover td {
                    background: #F8FAFC;
                }

                .table-icon-bg {
                    width: 36px;
                    height: 36px;
                    background: #F0FDF4;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }

                .recurring-badge {
                    display: inline-block;
                    font-size: 0.589rem;
                    padding: 0.091rem 0.453rem;
                    background: #F0FDF4;
                    color: #1B6B3A;
                    border-radius: 999px;
                    margin-top: 2px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }

                .category-pill {
                    padding: 0.227rem 0.68rem;
                    background: #FEE2E2;
                    border-radius: 6px;
                    font-size: 0.77rem;
                    color: #000000;
                    font-weight: 700;
                }

                .text-success { color: #16A34A; }
                .text-main { color: var(--text-main); }
                
                .action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                
                .hover-blue:hover { background: #F0FDF4; color: #1B6B3A; }
                .hover-red:hover { background: #FEF2F2; color: #DC2626; }

                @media (max-width: 768px) {
                    .income-table thead { display: none; }
                    .income-table tr { display: block; border-bottom: 1px solid var(--border-color); padding: 0.75rem; }
                    .income-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border: none; }
                    .income-table td::before { content: attr(data-label); font-weight: 600; color: var(--text-muted); display: block; }
                }
            `}</style>
        </div>
    );
};

export default Income;
