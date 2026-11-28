import React, { useState } from 'react';
import { Target, Edit3, Check, X, AlertTriangle } from 'lucide-react';

const BudgetPlanner = ({
    budget = 0,
    currentMonthExpenses = 0,
    currentSpent,
    onUpdateBudget,
    currencySymbol = '₹'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleStartEditing = () => {
        setIsEditing(true);
        setEditValue(budget > 0 ? budget.toString() : '');
        setValidationError('');
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
        setEditValue('');
        setValidationError('');
    };

    const handleSaveBudget = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const trimmed = String(editValue).trim();

        if (trimmed === '') {
            setValidationError('Budget amount cannot be empty.');
            return;
        }

        const parsed = parseFloat(trimmed);
        if (isNaN(parsed)) {
            setValidationError('Please enter a valid numeric amount.');
            return;
        }

        if (parsed < 0) {
            setValidationError('Budget amount cannot be negative.');
            return;
        }

        setValidationError('');
        if (typeof onUpdateBudget === 'function') {
            onUpdateBudget(parsed);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveBudget(e);
        } else if (e.key === 'Escape') {
            handleCancelEditing();
        }
    };

    const spent = Math.max(0, Number(currentMonthExpenses ?? currentSpent ?? 0));
    const numericBudget = Math.max(0, Number(budget || 0));

    // Remaining Budget = Monthly Budget Limit - Current Month Expenses
    const remainingBudget = numericBudget - spent;

    // Usage Percentage calculation:
    // (Current Month Expenses / Monthly Budget Limit) * 100
    // Prevent division by zero, NaN, or Infinity
    let usagePercentage = 0;
    if (numericBudget > 0) {
        usagePercentage = Math.round((spent / numericBudget) * 100);
        if (!isFinite(usagePercentage) || isNaN(usagePercentage)) {
            usagePercentage = 0;
        }
    } else if (spent > 0) {
        usagePercentage = 100;
    }

    // Progress bar fill clamped between 0 and 100% inside container
    const clampedProgress = Math.min(100, Math.max(0, usagePercentage));

    // Progress bar color and warning state
    const isExceeded = numericBudget > 0 && spent > numericBudget;
    let progressColor = '#10B981'; // Green: Normal
    if (isExceeded || usagePercentage >= 100) {
        progressColor = '#EF4444'; // Red: Exceeded or 100%
    } else if (usagePercentage > 75) {
        progressColor = '#F59E0B'; // Amber: High usage
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.359rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: isExceeded ? '1px solid #FECACA' : '1px solid #E2E8F0',
            marginBottom: '1.359rem',
            transition: 'border-color 0.2s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.133rem' }}>
                <h3 style={{ fontSize: '0.997rem', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                    <Target size={20} style={{ color: '#7C3AED' }} /> Budget Planner
                </h3>
                {isExceeded && (
                    <div
                        data-testid="budget-exceeded-badge"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 800
                        }}
                    >
                        <AlertTriangle size={12} />
                        <span>Budget Exceeded</span>
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.359rem',
                alignItems: 'center'
            }}>
                {/* Monthly Limit Setup */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.227rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Monthly Budget Limit</span>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.227rem', marginTop: '0.227rem' }}>
                                <span style={{ fontSize: '1.087rem', fontWeight: 800, color: '#0F172A' }}>{currencySymbol}</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    autoFocus
                                    placeholder="Enter amount"
                                    value={editValue}
                                    onChange={e => {
                                        setEditValue(e.target.value);
                                        if (validationError) setValidationError('');
                                    }}
                                    onKeyDown={handleKeyDown}
                                    data-testid="budget-input"
                                    style={{
                                        width: '120px',
                                        padding: '0.317rem 0.453rem',
                                        borderRadius: '6px',
                                        border: validationError ? '1px solid #EF4444' : '1px solid #CBD5E1',
                                        fontSize: '0.861rem',
                                        fontWeight: 700,
                                        outline: 'none',
                                        background: '#F8FAFC'
                                    }}
                                />
                                <button
                                    onClick={handleSaveBudget}
                                    data-testid="budget-save-btn"
                                    title="Save Budget"
                                    style={{ border: 'none', background: '#10B981', color: 'white', borderRadius: '6px', padding: '0.317rem', cursor: 'pointer', display: 'flex' }}
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={handleCancelEditing}
                                    data-testid="budget-cancel-btn"
                                    title="Cancel"
                                    style={{ border: 'none', background: '#EF4444', color: 'white', borderRadius: '6px', padding: '0.317rem', cursor: 'pointer', display: 'flex' }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            {validationError && (
                                <span data-testid="budget-validation-error" style={{ fontSize: '0.65rem', color: '#EF4444', fontWeight: 600 }}>
                                    {validationError}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.453rem' }}>
                            <span data-testid="budget-amount-display" style={{ fontSize: '1.359rem', fontWeight: 850, color: '#0F172A' }}>
                                {currencySymbol}{numericBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <button 
                                onClick={handleStartEditing}
                                data-testid="budget-edit-btn"
                                title="Edit Monthly Budget Limit"
                                style={{ border: 'none', background: 'none', color: '#64748B', cursor: 'pointer', padding: '4px', display: 'flex' }}
                            >
                                <Edit3 size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Expenses and Remaining */}
                <div style={{ display: 'flex', gap: '1.812rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Expenses</span>
                        <span data-testid="budget-spent-display" style={{ fontSize: '1.178rem', fontWeight: 800, color: '#0F172A' }}>
                            {currencySymbol}{spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Remaining</span>
                        <span data-testid="budget-remaining-display" style={{ fontSize: '1.178rem', fontWeight: 800, color: remainingBudget < 0 ? '#EF4444' : '#10B981' }}>
                            {remainingBudget < 0 ? '-' : ''}{currencySymbol}{Math.abs(remainingBudget).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Progress Bar & Usage */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.453rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: '#475569' }}>
                        <span>Usage</span>
                        <span data-testid="budget-usage-display" style={{ color: isExceeded ? '#EF4444' : '#475569' }}>
                            {usagePercentage}%
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                            data-testid="budget-progress-bar"
                            style={{
                                width: `${clampedProgress}%`,
                                height: '100%',
                                background: progressColor,
                                borderRadius: '999px',
                                transition: 'width 0.3s ease'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPlanner;
