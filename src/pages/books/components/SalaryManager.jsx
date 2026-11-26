import React, { useState } from 'react';
import { Briefcase, Plus, FileText, IndianRupee, Trash2, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SalaryManager = ({ records = [], onAddRecord, wallets = [], currencySymbol }) => {
  const [showModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '', employee_id: '', salary_date: '',
    basic_salary: '', hra: '', da: '', bonus: '', other_allowances: '',
    wallet_id: ''
  });

  const calculateGross = () => {
    return Number(formData.basic_salary || 0) + Number(formData.hra || 0) +
           Number(formData.da || 0) + Number(formData.bonus || 0) +
           Number(formData.other_allowances || 0);
  };

  const handleSave = () => {
    const gross = calculateGross();
    // Simplified Net for this demo, usually deductions would be here
    const net = gross;
    onAddRecord({ ...formData, gross_salary: gross, net_salary: net });
    setShowAddModal(false);
    setFormData({ company_name: '', employee_id: '', salary_date: '', basic_salary: '', hra: '', da: '', bonus: '', other_allowances: '', wallet_id: '' });
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '1.359rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={22} /></div>
          <div>
            <h3 style={{ fontSize: '0.997rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Salary Manager</h3>
            <p style={{ fontSize: '0.68rem', color: '#64748B', margin: 0 }}>Log and track your monthly earnings</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: '#1E40AF', border: 'none', color: 'white', padding: '0.544rem 1.087rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.77rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
          <Plus size={18} /> Add Salary
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>DATE</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>COMPANY</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>GROSS</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>NET CREDIT</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>SLIP</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2.719rem', textAlign: 'center', color: '#94A3B8' }}>No salary records logged yet.</td></tr>
            ) : records.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.906rem', fontWeight: 600 }}>{r.salary_date}</td>
                <td style={{ padding: '0.906rem' }}>{r.company_name}</td>
                <td style={{ padding: '0.906rem', fontWeight: 700 }}>{currencySymbol}{Number(r.gross_salary).toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.906rem', fontWeight: 800, color: '#059669' }}>{currencySymbol}{Number(r.net_salary).toLocaleString('en-IN')}</td>
                <td style={{ padding: '0.906rem' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#1E40AF', cursor: 'pointer' }}><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} style={{ width: '95%', maxWidth: '500px', background: '#fff', borderRadius: '16px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.359rem', right: '1.359rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '0.453rem', cursor: 'pointer' }}><X size={20} /></button>
              <h2 style={{ fontSize: '1.359rem', fontWeight: 900, color: '#1E293B', marginBottom: '1.359rem' }}>Record Salary</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.906rem', marginBottom: '0.906rem' }}>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>COMPANY NAME</label>
                  <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>SALARY DATE</label>
                  <input type="date" value={formData.salary_date} onChange={e => setFormData({...formData, salary_date: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.68rem', marginBottom: '0.906rem' }}>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>BASIC</label>
                  <input type="number" value={formData.basic_salary} onChange={e => setFormData({...formData, basic_salary: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>HRA</label>
                  <input type="number" value={formData.hra} onChange={e => setFormData({...formData, hra: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>BONUS</label>
                  <input type="number" value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.359rem' }}>
                <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>CREDIT TO WALLET</label>
                <select value={formData.wallet_id} onChange={e => setFormData({...formData, wallet_id: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}>
                  <option value="">Select Wallet...</option>
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              <div style={{ background: '#F8FAFC', padding: '0.906rem', borderRadius: '16px', marginBottom: '1.359rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#64748B' }}>Gross Total:</span>
                <span style={{ fontSize: '1.133rem', fontWeight: 900, color: '#1E293B' }}>{currencySymbol}{calculateGross().toLocaleString('en-IN')}</span>
              </div>

              <button onClick={handleSave} style={{ width: '100%', padding: '0.906rem', borderRadius: '12px', background: '#1E40AF', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                Confirm & Credit Wallet
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalaryManager;
