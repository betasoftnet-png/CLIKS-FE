import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Package, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { queryKeys } from '../lib/queryClient';
import { fetchStockItems, fetchStockStats, addStockItem } from '../services/stockService';
import { ErrorState, EmptyState } from '../components/common';
import '../App.css';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StockItem = ({ name, category, quantity, unit, value, status }) => (
    <div className="stock-item-row">
        <div className="stock-info">
            <div className="stock-icon">
                <Package size={20} />
            </div>
            <div>
                <div className="stock-name">{name}</div>
                <div className="stock-category">{category}</div>
            </div>
        </div>
        <div className="stock-quantity">
            <span className="qty-value">{quantity}</span>
            <span className="qty-unit">{unit}</span>
        </div>
        <div className="stock-value">₹{value}</div>
        <div className={`stock-status status-${status.toLowerCase().replace(' ', '-')}`}>
            {status}
        </div>
    </div>
);

/**
 * Loading state component for the stock list.
 */
const StockListLoading = () => (
    <div className="stock-loading-state">
        <Loader2 size={32} className="loading-spinner" />
        <p>Loading stock items...</p>
    </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// AddItemModal Component
// ---------------------------------------------------------------------------
const AddItemModal = ({ isOpen, onClose, onAdd }) => {
    if (!isOpen) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formData, setFormData] = React.useState({
        name: '',
        category: 'Stationery',
        quantity: 1,
        unit: 'Pieces',
        pricePerUnit: ''
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const quantity = parseInt(formData.quantity) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    const totalValue = quantity * price;

    let status = 'In Stock';
    if (quantity <= 1) status = 'Critical';
    else if (quantity >= 2 && quantity <= 5) status = 'Low Stock';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onAdd(formData);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
            <div className="modal-content-box">
                <div className="modal-header">
                    <h2 className="text-xl font-bold text-slate-800" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add New Stock Item</h2>
                    <button onClick={onClose} className="icon-btn"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body space-y-4 p-6" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Item Name</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Office Paper A4" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Category</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="Stationery">Stationery</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="flex-1" style={{ flex: 1 }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Quantity</label>
                            <input required type="number" min="0" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        </div>
                        <div className="flex-1" style={{ flex: 1 }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Unit Type</label>
                            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                                <option value="Pieces">Pieces</option>
                                <option value="Reams">Reams</option>
                                <option value="Units">Units</option>
                                <option value="Cartridges">Cartridges</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Price per Unit (₹)</label>
                        <input required type="number" min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem' }} value={formData.pricePerUnit} onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-2" style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-gray-600 text-sm" style={{ color: '#4B5563', fontSize: '0.875rem' }}>Total Value:</span>
                            <span className="font-bold text-gray-800" style={{ fontWeight: 700, color: '#1F2937' }}>₹{new Intl.NumberFormat('en-IN').format(totalValue)}</span>
                        </div>
                        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-gray-600 text-sm" style={{ color: '#4B5563', fontSize: '0.875rem' }}>Status:</span>
                            <span className={`stock-status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition" style={{ padding: '0.5rem 1rem', border: '1px solid #E5E7EB', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white' }}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem', backgroundColor: '#2563EB', color: 'white', cursor: 'pointer' }}>
                            {isSubmitting ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Stock = () => {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);


    // Local state for search/filter (not server state)
    const [searchQuery, setSearchQuery] = useState('');

    const addItemMutation = useMutation({
        mutationFn: addStockItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.all });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        },
    });

    const handleAddItem = async (newItem) => {
        // Map frontend field names to backend expected names
        const payload = {
            name: newItem.name,
            category: newItem.category,
            quantity: parseInt(newItem.quantity),
            unit: newItem.unit,
            unit_price: parseFloat(newItem.pricePerUnit)
        };
        await addItemMutation.mutateAsync(payload);
    };

    // ---------------------------------------------------------------------------
    // React Query: Fetch Stock Items
    // ---------------------------------------------------------------------------
    const {
        data: items = [],
        isLoading: isLoadingItems,
        isError: isItemsError,
        error: itemsError,
        refetch: refetchItems,
    } = useQuery({
        queryKey: queryKeys.stock.list({ search: searchQuery }),
        queryFn: () => fetchStockItems({ search: searchQuery }),
        // Keep previous data while fetching new data (smooth UX during search)
        placeholderData: (previousData) => previousData,
    });

    // ---------------------------------------------------------------------------
    // React Query: Fetch Stock Stats
    // ---------------------------------------------------------------------------
    const {
        data: stats,
        isLoading: isLoadingStats,
    } = useQuery({
        queryKey: queryKeys.stock.stats(),
        queryFn: fetchStockStats,
    });

    // ---------------------------------------------------------------------------
    // Event Handlers
    // ---------------------------------------------------------------------------

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <>
            <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} />

            {showToast && (
                <div className="toast-notification animate-slide-up">
                    <CheckCircle2 size={20} className="text-green-500" style={{ color: '#10B981' }} />
                    <span>Item added successfully</span>
                </div>
            )}

            <div className="dashboard-header" style={{ justifyContent: 'flex-end' }}>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} />
                        <span>Add Item</span>
                    </button>
                </div>
            </div>

            <div className="content-wrapper">
                {/* Stats Row */}
                <div className="stock-stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Value</div>
                        <div className="stat-value">
                            {isLoadingStats ? '...' : `₹${stats?.totalValue || '0'}`}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Items</div>
                        <div className="stat-value">
                            {isLoadingStats ? '...' : stats?.totalItems || 0}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Low Stock</div>
                        <div className="stat-value warning">
                            {isLoadingStats ? '...' : stats?.lowStockCount || 0}
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="icon-btn" title="Filter"><Filter size={20} /></button>
                    </div>
                </div>

                {/* Stock List */}
                <div className="stock-list-container">
                    <div className="stock-list-header">
                        <div>Item Name</div>
                        <div>Quantity</div>
                        <div>Value</div>
                        <div>Status</div>
                    </div>
                    <div className="stock-list-body">
                        {/* Loading State */}
                        {isLoadingItems && items.length === 0 && (
                            <StockListLoading />
                        )}

                        {/* Error State */}
                        {isItemsError && (
                            <ErrorState
                                title="Failed to load stock"
                                message={itemsError?.message}
                                onRetry={refetchItems}
                            />
                        )}

                        {/* Empty State */}
                        {!isLoadingItems && !isItemsError && items.length === 0 && (
                            <EmptyState
                                title="No stock items found"
                                description="Try adjusting your search or filters."
                            />
                        )}

                        {/* Data */}
                        {items.map(item => (
                            <StockItem key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .stock-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .stat-label { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem; }
                .stat-value.warning { color: #EAB308; }

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
                    padding: 0.6rem 1rem 0.6rem 2.5rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    outline: none;
                    font-size: 0.9rem;
                }
                .search-input:focus { border-color: var(--primary); }

                .stock-list-container {
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .stock-list-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 1rem 1.5rem;
                    background: #F8FAFC;
                    border-bottom: 1px solid var(--border-color);
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                .stock-item-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    align-items: center;
                    transition: background 0.1s;
                }
                .stock-item-row:hover { background: #F8FAFC; }
                .stock-item-row:last-child { border-bottom: none; }

                .stock-info { display: flex; align-items: center; gap: 1rem; }
                .stock-icon {
                    width: 48px; height: 48px;
                    background: #F1F5F9;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                .stock-name { font-weight: 500; color: var(--text-main); }
                .stock-category { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
                
                .stock-quantity { display: flex; flex-direction: column; }
                .qty-value { font-weight: 600; color: var(--text-main); }
                .qty-unit { font-size: 0.75rem; color: var(--text-muted); }
                
                .stock-value { font-family: monospace; font-weight: 600; color: var(--text-main); }

                .stock-status {
                    display: inline-flex;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    width: fit-content;
                }
                .status-in-stock { background: #DCFCE7; color: #166534; }
                .status-low-stock { background: #FEF9C3; color: #854D0E; }
                .status-in-use { background: #DBEAFE; color: #1E40AF; }

                /* Loading State */
                .stock-loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.5rem;
                    color: var(--text-muted);
                    text-align: center;
                    gap: 1rem;
                }

                .loading-spinner {
                    animation: spin 1s linear infinite;
                    color: var(--primary);
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #F1F5F9;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .btn-secondary:hover {
                    background: #E2E8F0;
                    border-color: #CBD5E1;
                }

                /* Mobile Responsiveness for Stock List */
                @media (max-width: 768px) {
                    .stock-list-header { display: none; }
                    
                    .stock-item-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                        padding: 1rem;
                        align-items: flex-start;
                        position: relative;
                    }

                    .stock-info {
                        width: 100%;
                    }

                    .stock-quantity, .stock-value, .stock-status {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.9rem;
                    }

                    .stock-quantity::before { content: 'Qty:'; color: var(--text-muted); font-size: 0.8rem; }
                    .stock-value::before { content: 'Value:'; color: var(--text-muted); font-size: 0.8rem; }
                    
                    /* Adjust stats grid for mobile */
                    .stock-stats-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    /* Controls bar */
                    .controls-bar {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }
                    .search-wrapper { max-width: 100%; }
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.2s;
                }
                .modal-content-box {
                    background: white;
                border-radius: 12px;
                width: 100%;
                max-width: 500px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                animation: scaleUp 0.3s ease-out;
                }
                .modal-header {
                    padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                }

                /* Toast Styles */
                .toast-notification {
                    position: fixed;
                bottom: 24px;
                right: 24px;
                background: white;
                border-left: 4px solid #10B981;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1100;
                font-weight: 500;
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes fadeIn {from {opacity: 0; } to {opacity: 1; } }
                @keyframes scaleUp {from {transform: scale(0.95); opacity: 0; } to {transform: scale(1); opacity: 1; } }
                @keyframes slideUp {from {transform: translateY(20px); opacity: 0; } to {transform: translateY(0); opacity: 1; } }
                @keyframes fadeInRow {from {transform: translateX(-10px); opacity: 0; } to {transform: translateX(0); opacity: 1; } }

                .status-critical {background: #FEE2E2; color: #991B1B; }
            `}</style>
        </>
    );
};

export default Stock;
