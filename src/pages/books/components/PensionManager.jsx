import React, { useState } from 'react';
import { Target, Plus, Heart, IndianRupee, Clock, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PensionManager = ({ records = [], onAddPension, wallets = [], currencySymbol }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ provider: '', pension_number: '', monthly_amount: '', payment_date: '', is_family_pension: false, wallet_id: '' });

  const handleSave = () => {
    onAddPension(formData);
    setShowModal(false);
    setFormData({ provider: '', pension_number: '', monthly_amount: '', payment_date: '', is_family_pension: false, wallet_id: '' });
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '1.359rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.359rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.68rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={22} /></div>
          <div>
            <h3 style={{ fontSize: '0.997rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Pension Manager</h3>
            <p style={{ fontSize: '0.68rem', color: '#64748B', margin: 0 }}>Retirement benefit tracking & history</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#16A34A', border: 'none', color: 'white', padding: '0.544rem 1.087rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.77rem', cursor: 'pointer' }}>
          + Record Pension
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.77rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>DATE</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>PROVIDER</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>TYPE</th>
              <th style={{ padding: '0.906rem', color: '#64748B' }}>CREDITED AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2.719rem', textAlign: 'center', color: '#94A3B8' }}>No pension history available.</td></tr>
            ) : records.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.906rem', fontWeight: 600 }}>{r.payment_date}</td>
                <td style={{ padding: '0.906rem' }}>{r.provider}</td>
                <td style={{ padding: '0.906rem' }}>
                  <span style={{ fontSize: '0.589rem', fontWeight: 700, padding: '0.181rem 0.453rem', borderRadius: '4px', background: r.is_family_pension ? '#FDF2F8' : '#F0F9FF', color: r.is_family_pension ? '#BE185D' : '#0369A1' }}>
                    {r.is_family_pension ? 'Family' : 'Service'}
                  </span>
                </td>
                <td style={{ padding: '0.906rem', fontWeight: 900, color: '#059669' }}>{currencySymbol}{Number(r.monthly_amount).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '95%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '1.812rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.359rem', right: '1.359rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '0.453rem', cursor: 'pointer' }}><X size={20} /></button>
              <h2 style={{ fontSize: '1.133rem', fontWeight: 900, color: '#1E293B', marginBottom: '1.359rem' }}>Record Pension Payment</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.906rem' }}>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>PROVIDER NAME</label>
                  <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} placeholder="e.g. LIC / EPFO" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.906rem' }}>
                  <div>
                    <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>AMOUNT</label>
                    <input type="number" value={formData.monthly_amount} onChange={e => setFormData({...formData, monthly_amount: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>PAYMENT DATE</label>
                    <input type="date" value={formData.payment_date} onChange={e => setFormData({...formData, payment_date: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.634rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '0.363rem' }}>CREDIT TO WALLET</label>
                  <select value={formData.wallet_id} onChange={e => setFormData({...formData, wallet_id: e.target.value})} style={{ width: '100%', padding: '0.589rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white' }}>
                    <option value="">Select Wallet...</option>
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem', marginTop: '0.453rem' }}>
                  <input type="checkbox" id="family-pension" checked={formData.is_family_pension} onChange={e => setFormData({...formData, is_family_pension: e.target.checked})} />
                  <label htmlFor="family-pension" style={{ fontSize: '0.77rem', fontWeight: 600, color: '#475569' }}>This is a family pension</label>
                </div>
                <button onClick={handleSave} style={{ marginTop: '0.906rem', width: '100%', padding: '0.906rem', borderRadius: '12px', background: '#16A34A', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PensionManager;
