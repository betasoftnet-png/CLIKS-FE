import React from 'react';
import { PiggyBank, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancePage = () => {
    const navigate = useNavigate();

    return (
        <div className="content-wrapper">
            <div style={{ padding: '1.812rem 0 0.906rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.586rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Finance</h1>
                    <p style={{ color: '#64748B', marginTop: '0.363rem', fontSize: '0.861rem' }}>
                        Track your income, fixed costs, and daily spending in one place.
                    </p>
                </div>
            </div>

            <div style={{
                marginTop: '1.812rem',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '3.625rem 1.812rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '22px',
                    background: '#F0FDF4',
                    color: '#1B6B3A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.359rem',
                    boxShadow: '0 8px 20px rgba(27, 107, 58, 0.12)'
                }}>
                    <PiggyBank size={36} />
                </div>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.363rem',
                    padding: '0.317rem 0.77rem',
                    background: '#FEF3C7',
                    color: '#D97706',
                    borderRadius: '50px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.906rem'
                }}>
                    <Clock size={14} /> Under Construction
                </div>

                <h2 style={{ fontSize: '1.359rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>
                    Finance Section Maintenance
                </h2>

                <p style={{ fontSize: '0.861rem', color: '#64748B', marginTop: '0.68rem', maxWidth: '440px', lineHeight: 1.6 }}>
                    This section has been reorganized. Please visit the Accounting module from the left menu to view your financial tools and dashboards.
                </p>

                <button
                    onClick={() => navigate('/books/accounting')}
                    style={{
                        marginTop: '1.812rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.453rem',
                        padding: '0.68rem 1.586rem',
                        background: '#1B6B3A',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '0.816rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(27, 107, 58, 0.2)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Go to Accounting
                </button>
            </div>
        </div>
    );
};

export default FinancePage;
