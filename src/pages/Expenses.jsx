import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesService } from '../services';
import {
    TrendingDown,
    Plus,
    Calendar,
    ShoppingCart,
    Tag,
    Edit2,
    Trash2,
    Filter,
    Search,
    ChevronDown,
    Receipt,
    Coffee,
    Zap,
    Activity,
    Car,
    CreditCard
} from 'lucide-react';
import '../App.css';
import { formatCurrency } from '../lib/formatCurrency';

const ICON_MAP = {
    Food: ShoppingCart,
    Utilities: Zap,
    Health: Activity,
    Entertainment: Coffee,
    Transportation: Car,
    Default: Receipt
};

const ExpenseStat = (props) => {
    const { label, value, subtext, icon: Icon, colorClass } = props;
    return (
    <div className="expense-stat-card">
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

const Expenses = () => {
    const queryClient = useQueryClient();
    
    // Fetch expenses
    const { data: expenseData = [], isLoading } = useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            const data = await expensesService.getExpenses();
            return data.map(item => ({
                id: item.id,
                name: item.name,
                amount: parseFloat(item.amount),
                category: item.category,
                date: item.date || item.created_at,
                paymentMethod: item.payment_method || 'N/A',
                icon: ICON_MAP[item.category] || ICON_MAP.Default
            }));
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => expensesService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteMutation.mutate(id);
        }
    };

    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const avgDaily = (totalExpenses / 30).toFixed(2); // Using a 30-day baseline

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #DCF2E4', borderTopColor: '#F44336', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="page-fade-in">
            <div className="dashboard-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem', marginBottom: '0.363rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg,#DC2626 0%,#991B1B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <TrendingDown size={20} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.586rem', fontWeight: 900, color: 'var(--text-main, #0F172A)', lineHeight: 1.1 }}>Expenses</h1>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted, #64748B)', fontSize: '0.816rem', fontWeight: 500 }}>Monitor and control your spending habits</p>
                </div>
                <button className="btn-primary" data-tour="expense-add-button">
                    <Plus size={18} />
                    <span>Add Expense</span>
                </button>
            </div>

            <div className="content-wrapper">
                {/* Stats Grid */}
                <div className="expense-stats-grid">
                    <ExpenseStat
                        label="Total Spend"
                        value={formatCurrency(totalExpenses)}
                        subtext="+5% vs last month"
                        icon={TrendingDown}
                        colorClass="icon-red"
                    />
                    <ExpenseStat
                        label="Daily Average"
                        value={formatCurrency(avgDaily)}
                        subtext="Per day analysis"
                        icon={Calendar}
                        colorClass="icon-orange"
                    />
                    <ExpenseStat
                        label="Total Transactions"
                        value={expenseData.length}
                        subtext={`Across ${new Set(expenseData.map(e => e.category)).size} categories`}
                        icon={Receipt}
                        colorClass="icon-blue"
                    />
                </div>

                {/* Controls */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search expenses..." className="search-input" />
                    </div>

                    <div className="flex gap-3">
                        <button className="filter-btn">
                            <Filter size={16} />
                            <span>Category</span>
                            <ChevronDown size={14} />
                        </button>
                        <button className="filter-btn">
                            <Calendar size={16} />
                            <span>This Month</span>
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Detailed List */}
                <div className="expense-list-container">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.719rem', color: '#94a3b8' }}>
                                        No expenses found.
                                    </td>
                                </tr>
                            ) : (
                                expenseData.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="table-icon-bg">
                                                    <item.icon size={18} />
                                                </div>
                                                <div className="font-medium text-main">{item.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-pill">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="text-muted">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                        <td>
                                            <div className="flex items-center gap-2 text-sm text-muted">
                                                <CreditCard size={14} />
                                                {item.paymentMethod}
                                            </div>
                                        </td>
                                        <td className="font-bold text-danger">-{formatCurrency(item.amount)}</td>
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
                .page-fade-in { animation: fadeIn 0.4s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .expense-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.359rem;
                    margin-bottom: 1.812rem;
                }

                .expense-stat-card {
                    background: white;
                    padding: 1.359rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .stat-label { color: var(--text-muted); font-size: 0.793rem; font-weight: 500; margin-bottom: 0.453rem; }
                .stat-value { font-size: 1.586rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.227rem; }
                .stat-subtext { font-size: 0.725rem; color: var(--text-muted); font-weight: 500; }
                
                .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-red { background: #FEE2E2; color: #EF4444; }
                .icon-orange { background: #FFEDD5; color: #F97316; }
                .icon-blue { background: #DBEAFE; color: #1B6B3A; }

                /* Reuse search/filter styles from Income page implicitly via copy-paste consistency or global classes if promoted */
                .search-wrapper { position: relative; flex: 1; max-width: 400px; }
                .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                .search-input { width: 100%; padding: 0.68rem 0.906rem 0.68rem 2.266rem; border: 1px solid var(--border-color); border-radius: 10px; outline: none; font-size: 0.816rem; background: white; transition: border-color 0.2s; }
                .search-input:focus { border-color: var(--primary); }

                .filter-btn { display: flex; align-items: center; gap: 0.453rem; padding: 0.68rem 0.906rem; background: white; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.816rem; font-weight: 500; color: var(--text-main); transition: all 0.2s; }
                .filter-btn:hover { background: #F8FAFC; border-color: #CBD5E1; }

                .expense-list-container { background: white; border-radius: 16px; border: 1px solid var(--border-color); overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .expense-table { width: 100%; border-collapse: collapse; }
                .expense-table th { text-align: left; padding: 0.625rem 0.906rem; background: #F8FAFC; border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-weight: 700; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
                .expense-table td { padding: 0.625rem 0.906rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; color: var(--text-main); font-size: 0.8rem; }
                .expense-table tr:last-child td { border-bottom: none; }
                .expense-table tr:hover td { background: #F8FAFC; }

                .table-icon-bg { width: 34px; height: 34px; background: #F0FDF4; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
                .category-pill { display: inline-flex; align-items: center; white-space: nowrap; padding: 0.227rem 0.68rem; background: #FEE2E2; border-radius: 6px; font-size: 0.725rem; color: #000000; font-weight: 700; }
                
                .text-danger { color: #EF4444; }
                .text-main { color: var(--text-main); }

                .action-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
                .hover-blue:hover { background: #F0FDF4; color: #1B6B3A; }
                .hover-red:hover { background: #FEF2F2; color: #DC2626; }
                
                @media (max-width: 768px) {
                    .expense-table thead { display: none; }
                    .expense-table tr { display: flex; flex-direction: column; padding: 0.906rem; border-bottom: 1px solid var(--border-color); gap: 0.453rem; }
                    .expense-table td { padding: 0; border: none; }
                }
            `}</style>
        </div>
    );
};

export default Expenses;
