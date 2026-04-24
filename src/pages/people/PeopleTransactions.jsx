import { useQuery } from '@tanstack/react-query';
import { peopleService } from '../../services';
import '../../App.css';
import { Plus } from 'lucide-react';

const PeopleTransactions = () => {
    // Fetch Global Transactions
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['people-transactions-all'],
        queryFn: async () => {
            const data = await peopleService.getAllTransactions();
            return data.map(txn => ({
                id: txn.id,
                date: txn.date,
                person: txn.person_name || 'Generic',
                amount: parseFloat(txn.amount),
                type: txn.type, // 'given' or 'received'
                ref: txn.reference || 'N/A',
                category: txn.tags || 'Other'
            }));
        }
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #E3F2FD', borderTopColor: '#EC4899', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-header">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">People Transactions</h1>
                    <p className="text-muted text-sm mt-1">Full history of dealings with all contacts</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        <Plus size={16} />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                <div className="controls-bar">
                    <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Search transactions..." className="search-input"
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                    </div>
                </div>

                <div className="stock-list-container" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="stock-list-header" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr 1fr', padding: '1rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>
                        <div>Date</div>
                        <div>Person</div>
                        <div>Reference</div>
                        <div>Tags</div>
                        <div>Amount</div>
                        <div>Actions</div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="p-12 text-center text-muted">No transactions found.</div>
                    ) : transactions.map(txn => (
                        <div key={txn.id} className="stock-item-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{txn.date}</div>
                            <div style={{ fontWeight: '500' }}>{txn.person}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{txn.ref}</div>
                            <div>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: '#F3F4F6', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    <Tag size={12} /> {txn.category}
                                </span>
                            </div>
                            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', color: txn.type === 'received' ? '#16A34A' : '#DC2626' }}>
                                {txn.type === 'received' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                ₹{txn.amount.toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="icon-btn" title="Edit"><Edit2 size={16} /></button>
                                <button className="icon-btn" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PeopleTransactions;
