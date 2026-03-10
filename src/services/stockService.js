/**
 * Stock API Service
 * 
 * API functions for stock/assets data.
 * Uses the centralized API client.
 */

import { apiClient } from '../api';

// ---------------------------------------------------------------------------
// API Endpoints
// ---------------------------------------------------------------------------

const ENDPOINTS = {
    STOCK_LIST: '/stock',
    STOCK_DETAIL: (id) => `/stock/${id}`,
    STOCK_STATS: '/stock/stats',
};

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

/**
 * Fetch all stock items.
 * 
 * @param {Object} filters - Optional filters
 * @param {string} filters.search - Search query
 * @param {string} filters.category - Category filter
 * @param {string} filters.status - Status filter
 * @returns {Promise<Array>} List of stock items
 */
export async function fetchStockItems(filters = {}) {
    return apiClient.get(ENDPOINTS.STOCK_LIST, { params: filters });
}

/**
 * Fetch a single stock item by ID.
 * 
 * @param {string|number} id - Stock item ID
 * @returns {Promise<Object>} Stock item details
 */
export async function fetchStockItem(id) {
    return apiClient.get(ENDPOINTS.STOCK_DETAIL(id));
}

/**
 * Fetch stock statistics (total value, count, low stock, etc.)
 * 
 * @returns {Promise<Object>} Stock statistics
 */
export async function fetchStockStats() {
    return apiClient.get(ENDPOINTS.STOCK_STATS);
}

// ---------------------------------------------------------------------------
// Mock Data (Temporary - Remove when backend is ready)
// ---------------------------------------------------------------------------

/**
 * TEMPORARY: Mock data for development.
 * This simulates API responses until the backend is ready.
 * Remove this entire section once the backend is implemented.
 */
let MOCK_STOCK_ITEMS = [
    { id: 1, name: 'Office Paper A4', category: 'Stationery', quantity: 15, unit: 'Reams', value: '4,500', status: 'In Stock' },
    { id: 2, name: 'Printer Ink (Black)', category: 'Stationery', quantity: 2, unit: 'Cartridges', value: '2,800', status: 'Low Stock' },
    { id: 3, name: 'Laptops', category: 'Electronics', quantity: 5, unit: 'Units', value: '2,50,000', status: 'In Use' },
    { id: 4, name: 'Coffee Beans', category: 'Pantry', quantity: 4, unit: 'kg', value: '3,200', status: 'In Stock' },
    { id: 5, name: 'Desk Chairs', category: 'Furniture', quantity: 12, unit: 'Units', value: '36,000', status: 'In Stock' },
    { id: 6, name: 'Monitors', category: 'Electronics', quantity: 8, unit: 'Units', value: '1,20,000', status: 'In Stock' },
];

let MOCK_STOCK_STATS = {
    totalValue: '2,60,500',
    totalItems: 26,
    lowStockCount: 1,
    inUseCount: 5,
    categories: ['Stationery', 'Electronics', 'Pantry', 'Furniture'],
};

/**
 * TEMPORARY: Mock fetch for stock items.
 * Simulates network delay and returns mock data.
 * 
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Mock stock items
 */
export async function fetchStockItemsMock(filters = {}) {
    // Simulate network delay (300-800ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    let items = [...MOCK_STOCK_ITEMS];

    // Apply search filter
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(item =>
            item.name.toLowerCase().includes(searchLower) ||
            item.category.toLowerCase().includes(searchLower)
        );
    }

    // Apply category filter
    if (filters.category) {
        items = items.filter(item => item.category === filters.category);
    }

    // Apply status filter
    if (filters.status) {
        items = items.filter(item => item.status === filters.status);
    }

    return items;
}

/**
 * TEMPORARY: Mock fetch for stock stats.
 * 
 * @returns {Promise<Object>} Mock stock statistics
 */
export async function fetchStockStatsMock() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    return { ...MOCK_STOCK_STATS };
}

export async function addStockItemMock(newItem) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quantity = parseInt(newItem.quantity, 10);
    const price = parseFloat(newItem.pricePerUnit);
    const totalValueNumeric = quantity * price;
    
    // Auto-determine status
    let status = 'In Stock';
    if (quantity <= 1) status = 'Critical';
    else if (quantity >= 2 && quantity <= 5) status = 'Low Stock';
    
    const formattedValue = new Intl.NumberFormat('en-IN').format(totalValueNumeric);
    
    const item = {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category,
        quantity: quantity,
        unit: newItem.unit,
        value: formattedValue,
        status: status
    };
    
    MOCK_STOCK_ITEMS.unshift(item);
    
    // Update stats
    const currentTotalValue = parseFloat(MOCK_STOCK_STATS.totalValue.replace(/,/g, ''));
    MOCK_STOCK_STATS.totalValue = new Intl.NumberFormat('en-IN').format(currentTotalValue + totalValueNumeric);
    MOCK_STOCK_STATS.totalItems += 1;
    if (status === 'Low Stock' || status === 'Critical') {
        MOCK_STOCK_STATS.lowStockCount += 1;
    }
    
    return item;
}
