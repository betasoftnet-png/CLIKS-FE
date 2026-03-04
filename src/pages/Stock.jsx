import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Package, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { queryKeys } from '../lib/queryClient';
import { fetchStockItemsMock, fetchStockStatsMock } from '../services/stockService';
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

const Stock = () => {
    // Local state for search/filter (not server state)
    const [searchQuery, setSearchQuery] = useState('');

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
        queryFn: () => fetchStockItemsMock({ search: searchQuery }),
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
        queryFn: fetchStockStatsMock,
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
            <div className="dashboard-header" style={{ justifyContent: 'flex-end' }}>
                <div className="header-actions">
                    <button className="btn-primary">
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
            `}</style>
        </>
    );
};

export default Stock;
