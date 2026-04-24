import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialPlanService } from '../../services';
import './financial-plan.css';

const EMPTY_FORM = { name: '', target: '', current: '', deadline: '' };
const DEFAULT_PLAN_ID = 1;

const PlanGoals = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData]       = useState(EMPTY_FORM);
    const [formError, setFormError]     = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Goals
    const { data: goals = [], isLoading } = useQuery({
        queryKey: ['plan-goals', DEFAULT_PLAN_ID],
        queryFn: async () => {
            const data = await financialPlanService.getPlanGoals(DEFAULT_PLAN_ID);
            return data.map(item => ({
                id: item.id,
                name: item.name || item.title,
                target: parseFloat(item.target_amount || item.target),
                current: parseFloat(item.current_amount || item.current),
                deadline: item.date || item.deadline
            }));
        }
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (newGoal) => financialPlanService.createPlanGoal(DEFAULT_PLAN_ID, newGoal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plan-goals', DEFAULT_PLAN_ID] });
            closeModal();
        },
        onError: (err) => {
            setFormError(err.message || 'Failed to add goal.');
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => financialPlanService.deletePlanGoal(DEFAULT_PLAN_ID, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plan-goals', DEFAULT_PLAN_ID] });
        }
    });

    const openModal = () => {
        setFormData(EMPTY_FORM);
        setFormError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.target || !formData.current || !formData.deadline) {
            setFormError('All fields are required.');
            return;
        }

        const newGoal = {
            name: formData.name,
            target_amount: parseFloat(formData.target),
            current_amount: parseFloat(formData.current),
            date: formData.deadline,
        };

        createMutation.mutate(newGoal);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            deleteMutation.mutate(id);
        }
    };

    const totalTarget = goals.reduce((sum, item) => sum + item.target, 0);
    const totalCurrent = goals.reduce((sum, item) => sum + item.current, 0);

    const filteredGoals = goals.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #E3F2FD', borderTopColor: '#4F46E5', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="fp-page">
            <div className="fp-header">
                <div className="fp-header-left">
                    <h1>Savings &amp; Goals</h1>
                    <p>Plan and track your long-term financial objectives</p>
                </div>
                <button className="btn-primary flex items-center gap-2" onClick={openModal}>
                    <Plus size={16} />
                    <span>Add Goal</span>
                </button>
            </div>

            <div className="fp-summary-grid">
                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--indigo">
                        <Target size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Total Target</p>
                        <h3>${totalTarget.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--green">
                        <Wallet size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Current Savings</p>
                        <h3>${totalCurrent.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="fp-summary-card">
                    <div className="fp-summary-icon fp-icon--yellow">
                        <Trophy size={22} />
                    </div>
                    <div className="fp-summary-info">
                        <p>Active Goals</p>
                        <h3>{goals.length}</h3>
                    </div>
                </div>
            </div>

            <div className="fp-toolbar">
                <div className="fp-search-wrap">
                    <Search size={15} className="fp-search-icon" />
                    <input
                        type="text"
                        placeholder="Search goals..."
                        className="fp-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="fp-toolbar-actions">
                    <button className="fp-filter-btn">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="fp-sort-btn">
                        Sort By
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {filteredGoals.length === 0 ? (
                <EmptyState
                    title="No goals set yet"
                    description="Add your first savings goal to start tracking your progress."
                />
            ) : (
                <div className="fp-table-card">
                    <table className="fp-table">
                        <thead>
                            <tr>
                                <th>Goal Name</th>
                                <th className="fp-th-right">Target Amount</th>
                                <th className="fp-th-right">Current Savings</th>
                                <th className="fp-th-center">Progress</th>
                                <th>Target Date</th>
                                <th className="fp-th-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGoals.map((goal) => {
                                const progress =
                                    goal.target > 0
                                        ? Math.min((goal.current / goal.target) * 100, 100)
                                        : 0;
                                return (
                                    <tr key={goal.id}>
                                        <td className="fp-td-name">{goal.name}</td>
                                        <td className="fp-td-amount">${goal.target.toLocaleString()}</td>
                                        <td className="fp-td-amount">${goal.current.toLocaleString()}</td>
                                        <td className="fp-td-center">
                                            <div className="fp-progress-wrap">
                                                <div className="fp-progress-bar-bg">
                                                    <div
                                                        className="fp-progress-bar-fill"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="fp-progress-label">
                                                    {progress.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="fp-td-muted">{goal.deadline}</td>
                                        <td className="fp-td-center">
                                            <div className="fp-row-actions">
                                                <button className="fp-action-btn fp-action-btn--edit" title="Edit">
                                                    <Edit size={15} />
                                                </button>
                                                <button
                                                    className="fp-action-btn fp-action-btn--delete"
                                                    title="Delete"
                                                    onClick={() => handleDelete(goal.id)}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fp-modal-overlay">
                        <motion.div
                            className="fp-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="fp-modal-header">
                                <h2 className="fp-modal-title">Add Savings Goal</h2>
                                <button className="fp-modal-close" onClick={closeModal}>
                                    <X size={18} />
                                </button>
                            </div>

                            <form className="fp-form" onSubmit={handleAddGoal}>
                                <div className="fp-field">
                                    <label className="fp-label">Goal Name</label>
                                    <input
                                        type="text"
                                        className="fp-input"
                                        placeholder="e.g. New Car, Emergency Fund"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Target Amount</label>
                                    <input
                                        type="number"
                                        className="fp-input"
                                        placeholder="0.00"
                                        value={formData.target}
                                        onChange={(e) =>
                                            setFormData({ ...formData, target: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Current Savings</label>
                                    <input
                                        type="number"
                                        className="fp-input"
                                        placeholder="0.00"
                                        value={formData.current}
                                        onChange={(e) =>
                                            setFormData({ ...formData, current: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="fp-field">
                                    <label className="fp-label">Target Date</label>
                                    <input
                                        type="date"
                                        className="fp-input"
                                        value={formData.deadline}
                                        onChange={(e) =>
                                            setFormData({ ...formData, deadline: e.target.value })
                                        }
                                    />
                                </div>

                                {formError && (
                                    <p className="fp-form-error">{formError}</p>
                                )}

                                <div className="fp-modal-footer">
                                    <button
                                        type="button"
                                        className="fp-btn-cancel"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="fp-btn-submit">
                                        Save Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlanGoals;
