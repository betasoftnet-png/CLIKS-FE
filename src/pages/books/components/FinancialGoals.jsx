import React, { useState } from 'react';
import { Target, Plus, Trash2, Edit2, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FinancialGoals = ({ goals = [], onCreate, onUpdate, onDelete, currencySymbol, onToast }) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target_amount: '', current_savings: '', target_date: '', category: 'Emergency Fund' });
  const [editingId, setEditingId] = useState(null);
  const [targetError, setTargetError] = useState('');

  // Quick Deposit modal state
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState('');

  const categories = ['Emergency Fund', 'Retirement', "Children's Education", 'Vacation', 'House Purchase', 'Vehicle Purchase', 'Other'];

  const handleSave = () => {
    if (!newGoal.name) return;
    const targetNum = Number(newGoal.target_amount);
    if (!newGoal.target_amount || isNaN(targetNum) || targetNum <= 0) {
      setTargetError('Target amount cannot be negative or zero');
      return;
    }

    const payload = {
      ...newGoal,
      target_amount: targetNum,
      current_savings: Number(newGoal.current_savings || 0)
    };

    if (editingId) {
      onUpdate(editingId, payload);
      setEditingId(null);
    } else {
      onCreate(payload);
    }
    setNewGoal({ name: '', target_amount: '', current_savings: '', target_date: '', category: 'Emergency Fund' });
    setTargetError('');
    setShowAddGoal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this goal?')) {
      onDelete(id);
    }
  };

  const handleEdit = (g) => {
    setNewGoal({
        name: g.name,
        target_amount: g.target_amount,
        current_savings: g.current_savings,
        target_date: g.target_date,
        category: g.category
    });
    setEditingId(g.id);
    setTargetError('');
    setShowAddGoal(true);
  };

  const openDepositModal = (goal) => {
    setDepositGoal(goal);
    setDepositAmount('');
    setDepositError('');
  };

  const handleDepositSubmit = () => {
    if (!depositGoal) return;
    const remainingGoalAmount = Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0));
    const amt = Number(depositAmount);
    if (!depositAmount || isNaN(amt) || amt <= 0) {
      setDepositError('Please enter a valid deposit amount greater than 0');
      return;
    }
    if (amt > remainingGoalAmount) {
      setDepositError(`Amount cannot exceed remaining goal of ${currencySymbol}${remainingGoalAmount.toLocaleString('en-IN')}`);
      return;
    }

    const updatedSavings = Number(depositGoal.current_savings || 0) + amt;
    onUpdate(depositGoal.id, {
      ...depositGoal,
      current_savings: updatedSavings
    });
    setDepositGoal(null);
    setDepositAmount('');
    setDepositError('');
    if (onToast) onToast('Funds allocated successfully!');
  };

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={22} /></div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>Financial Goals</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Track your long-term milestones</p>
          </div>
        </div>
        <button
          onClick={() => { setShowAddGoal(true); setEditingId(null); setNewGoal({ name: '', target_amount: '', current_savings: '', target_date: '', category: 'Emergency Fund' }); setTargetError(''); }}
          style={{ background: '#F5F3FF', border: 'none', color: '#7C3AED', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}
          title="Add New Goal"
        >
          <Plus size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', color: '#94A3B8', fontSize: '0.875rem' }}>
            No goals defined. Start planning today!
          </div>
        ) : goals.map(g => {
          const targetAmt = Number(g.target_amount) || 1;
          const currentSav = Number(g.current_savings) || 0;
          const progress = Math.min(100, (currentSav / targetAmt) * 100);
          return (
            <div key={g.id} style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: '0 0 2px 0' }}>{g.name}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase' }}>{g.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => openDepositModal(g)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: '#EDE9FE',
                      color: '#6D28D9',
                      border: 'none',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Quick Deposit into Goal"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    + Add Money
                  </button>
                  <button onClick={() => handleEdit(g)} style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: '4px' }} title="Edit Goal"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(g.id)} style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', padding: '4px' }} title="Delete Goal"><Trash2 size={14} /></button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
                <span>{currencySymbol}{currentSav.toLocaleString('en-IN')} <span style={{ fontWeight: 500, color: '#94A3B8' }}>saved</span></span>
                <span>{currencySymbol}{targetAmt.toLocaleString('en-IN')} <span style={{ fontWeight: 500, color: '#94A3B8' }}>goal</span></span>
              </div>

              <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)', borderRadius: '999px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{progress.toFixed(1)}% Complete</span>
                {g.target_date && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Target: {g.target_date}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK DEPOSIT MODAL */}
      <AnimatePresence>
        {depositGoal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '90%', maxWidth: '420px', background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
              <button onClick={() => setDepositGoal(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}><X size={20} /></button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem' }}>+ Add Money to Goal</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>{depositGoal.name} • <span style={{ color: '#7C3AED', fontWeight: 600 }}>{depositGoal.category}</span></p>

              <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.4rem' }}>
                  <span>Current Saved:</span>
                  <strong style={{ color: '#1E293B' }}>{currencySymbol}{Number(depositGoal.current_savings || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.4rem' }}>
                  <span>Goal Target:</span>
                  <strong style={{ color: '#1E293B' }}>{currencySymbol}{Number(depositGoal.target_amount).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#7C3AED', fontWeight: 700, borderTop: '1px dashed #E2E8F0', paddingTop: '0.4rem' }}>
                  <span>Remaining Needed:</span>
                  <strong>{currencySymbol}{Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0)).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>DEPOSIT AMOUNT ({currencySymbol})</label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0))}
                  value={depositAmount}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') e.preventDefault();
                  }}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.includes('-')) val = val.replace(/-/g, '');
                    const maxRem = Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0));
                    if (Number(val) > maxRem) {
                      setDepositError(`Amount cannot exceed remaining goal of ${currencySymbol}${maxRem.toLocaleString('en-IN')}`);
                    } else {
                      setDepositError('');
                    }
                    setDepositAmount(val);
                  }}
                  placeholder="Enter amount to add"
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: depositError ? '1.5px solid #EF4444' : '1px solid #E2E8F0', outline: 'none', fontSize: '1rem', fontWeight: 700 }}
                />
                {depositError && (
                  <p style={{ color: '#EF4444', fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>{depositError}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {[500, 1000, 5000].map(quickAmt => {
                  const maxRem = Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0));
                  if (quickAmt > maxRem && maxRem > 0) return null;
                  return (
                    <button
                      key={quickAmt}
                      type="button"
                      onClick={() => {
                        setDepositAmount(String(quickAmt));
                        setDepositError('');
                      }}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        borderRadius: '8px',
                        border: '1px solid #DDD6FE',
                        background: '#F5F3FF',
                        color: '#7C3AED',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      +{currencySymbol}{quickAmt.toLocaleString('en-IN')}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    const maxRem = Math.max(0, Number(depositGoal.target_amount) - Number(depositGoal.current_savings || 0));
                    setDepositAmount(String(maxRem));
                    setDepositError('');
                  }}
                  style={{
                    flex: 1.2,
                    padding: '0.4rem',
                    borderRadius: '8px',
                    border: '1px solid #DDD6FE',
                    background: '#EDE9FE',
                    color: '#6D28D9',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Fill Remaining
                </button>
              </div>

              <button
                onClick={handleDepositSubmit}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#7C3AED', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Add to Goal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW / EDIT GOAL MODAL */}
      <AnimatePresence>
        {showAddGoal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '90%', maxWidth: '400px', background: '#fff', borderRadius: '24px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
              <button onClick={() => setShowAddGoal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}><X size={20} /></button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '1.5rem' }}>{editingId ? 'Edit Goal' : 'New Goal'}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>GOAL NAME</label>
                  <input type="text" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} placeholder="e.g. New Car" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>CATEGORY</label>
                  <select value={newGoal.category} onChange={e => setNewGoal({...newGoal, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>TARGET ({currencySymbol})</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newGoal.target_amount} 
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={e => {
                        let val = e.target.value;
                        if (val.includes('-')) val = val.replace(/-/g, '');
                        setNewGoal({...newGoal, target_amount: val});
                        if (val !== '' && Number(val) <= 0) {
                          setTargetError('Target amount cannot be negative or zero');
                        } else {
                          setTargetError('');
                        }
                      }} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: targetError ? '1.5px solid #EF4444' : '1px solid #E2E8F0', outline: 'none' }} 
                      placeholder="0" 
                    />
                    {targetError && (
                      <p style={{ color: '#EF4444', fontSize: '0.72rem', marginTop: '0.35rem', fontWeight: 600, margin: '0.35rem 0 0 0' }}>
                        {targetError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>SAVED ({currencySymbol})</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newGoal.current_savings} 
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') e.preventDefault();
                      }}
                      onChange={e => {
                        let val = e.target.value;
                        if (val.includes('-')) val = val.replace(/-/g, '');
                        setNewGoal({...newGoal, current_savings: val});
                      }} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} 
                      placeholder="0" 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.4rem' }}>TARGET DATE</label>
                  <input type="date" value={newGoal.target_date} onChange={e => setNewGoal({...newGoal, target_date: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }} />
                </div>
                <button onClick={handleSave} style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: '#7C3AED', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  {editingId ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialGoals;

