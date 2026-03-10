import fs from 'fs';
const path = 'd:/Books/src/pages/Stock.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. imports
content = content.replace(
  "import { useQuery } from '@tanstack/react-query';",
  "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';"
);
content = content.replace(
  "import { Plus, Search, Filter, Package, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';",
  "import { Plus, Search, Filter, Package, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';"
);
content = content.replace(
  "import { fetchStockItemsMock, fetchStockStatsMock } from '../services/stockService';",
  "// eslint-disable-next-line no-unused-vars\nimport { fetchStockItemsMock, fetchStockStatsMock, addStockItemMock } from '../services/stockService';"
);

// 2. AddItemModal component before Stock = () =>
const modalCode = `
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
        <div className="modal-overlay" style={{ zIndex: 1000}}>
            <div className="modal-content-box">
                <div className="modal-header">
                    <h2 className="text-xl font-bold text-slate-800" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add New Stock Item</h2>
                    <button onClick={onClose} className="icon-btn"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body space-y-4 p-6" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Item Name</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem'}} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Office Paper A4" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Category</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem'}} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
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
                            <input required type="number" min="0" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem'}} value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                        </div>
                        <div className="flex-1" style={{ flex: 1 }}>
                            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Unit Type</label>
                            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem'}} value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                                <option value="Pieces">Pieces</option>
                                <option value="Reams">Reams</option>
                                <option value="Units">Units</option>
                                <option value="Cartridges">Cartridges</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>Price per Unit (₹)</label>
                        <input required type="number" min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem'}} value={formData.pricePerUnit} onChange={e => setFormData({...formData, pricePerUnit: e.target.value})} />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-2" style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-gray-600 text-sm" style={{ color: '#4B5563', fontSize: '0.875rem' }}>Total Value:</span>
                            <span className="font-bold text-gray-800" style={{ fontWeight: 700, color: '#1F2937' }}>₹{new Intl.NumberFormat('en-IN').format(totalValue)}</span>
                        </div>
                        <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-gray-600 text-sm" style={{ color: '#4B5563', fontSize: '0.875rem' }}>Status:</span>
                            <span className={\`stock-status status-\${status.toLowerCase().replace(' ', '-')}\`}>{status}</span>
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
`;
content = content.replace("const Stock = () => {", modalCode);

// 3. hooks and queryClient in Stock
const stockHooks = `const Stock = () => {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);
`;
content = content.replace("const Stock = () => {\n", stockHooks + '\n');

// 4. Mutation hook
const queryDef = `        // Keep previous data while fetching new data (smooth UX during search)
        placeholderData: (previousData) => previousData,
    });

    const addMutation = useMutation({
        mutationFn: (newItem) => addStockItemMock(newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.list({ search: searchQuery }) });
            queryClient.invalidateQueries({ queryKey: queryKeys.stock.stats() });
            setIsAddModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    });

    const handleAddItem = async (newItem) => {
        await addMutation.mutateAsync(newItem);
    };`;
content = content.replace(`        // Keep previous data while fetching new data (smooth UX during search)
        placeholderData: (previousData) => previousData,
    });`, queryDef);

// 5. Update header button
content = content.replace(
    `<button className="btn-primary">`,
    `<button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>`
);

// 6. Update Render elements (Modal and Toast)
content = content.replace(
    `<div className="dashboard-header" style={{ justifyContent: 'flex-end' }}>`,
    `<AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} />
            
            {showToast && (
                <div className="toast-notification animate-slide-up">
                    <CheckCircle2 size={20} className="text-green-500" style={{ color: '#10B981' }} />
                    <span>Item added successfully</span>
                </div>
            )}
            
            <div className="dashboard-header" style={{ justifyContent: 'flex-end' }}>`
);

// 7. Update row appearance animation CSS
content = content.replace(
    `.stock-item-row {
                    display: grid;`,
    `.stock-item-row {
                    display: grid;
                    animation: fadeInRow 0.3s ease-out;`
);

// 8. Add extra CSS block
const extraCss = `
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

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes fadeInRow { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                
                .status-critical { background: #FEE2E2; color: #991B1B; }`;

// Injecting into CSS literal
let finalContent = content.substring(0, content.lastIndexOf('</style>'));
finalContent += extraCss + '\n            `}</style>\n        </>\n    );\n};\n\nexport default Stock;\n';

fs.writeFileSync(path, finalContent);
console.log('Done replacement');
