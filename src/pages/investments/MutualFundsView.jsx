import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentsService } from '../../services';
import { Star, ArrowUpRight, TrendingUp, Filter } from 'lucide-react';

const MutualFundsView = () => {
    const [activeFilter, setActiveFilter] = useState('All Funds');
    const filters = ['All Funds', 'Equity', 'Debt', 'Hybrid', 'Index Funds', 'Tax Saving'];

    // Fetch mutual funds
    const { data: funds = [], isLoading } = useQuery({
        queryKey: ['investments-mutual-funds'],
        queryFn: async () => {
            const data = await investmentsService.getInvestments();
            return data.filter(i => i.type === 'Mutual Fund').map(i => ({
                id: i.id,
                name: i.name,
                category: i.category || 'Equity – Large Cap',
                rating: i.rating || 5,
                y1: i.y1_returns || '+24.8%',
                y3: i.y3_returns || '+18.2%',
                nav: `₹${parseFloat(i.amount).toLocaleString()}`
            }));
        }
    });

    const renderStars = (count) => (
        <div className="mf-stars">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill={i < count ? '#F59E0B' : 'none'} color={i < count ? '#F59E0B' : '#D1D5DB'} />
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px' }}>
                <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid #DCF2E4', borderTopColor: '#1B6B3A', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="view-fade-in">
            <div className="inv-view-header">
                <h2 className="inv-view-title">Mutual Funds</h2>
                <p className="inv-view-subtitle">Diversified investment opportunities curated for you</p>
            </div>

            <div className="mf-filters">
                {filters.map(f => (
                    <button
                        key={f}
                        className={`mf-filter-tab ${activeFilter === f ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="mf-section-header">
                <h3 className="inv-section-title" style={{ margin: 0 }}>Top Performing Funds</h3>
                <button className="mf-filter-btn"><Filter size={16} /> Sort & Filter</button>
            </div>

            <div className="mf-list">
                {funds.map((fund, i) => (
                    <div key={i} className="mf-card">
                        <div className="mf-card-left">
                            <div className="mf-card-icon">
                                <TrendingUp size={20} />
                            </div>
                            <div className="mf-card-info">
                                <h4 className="mf-fund-name">{fund.name}</h4>
                                <div className="mf-fund-meta">
                                    <span className="mf-fund-cat">{fund.category}</span>
                                    {renderStars(fund.rating)}
                                </div>
                            </div>
                        </div>
                        <div className="mf-card-middle">
                            <div className="mf-perf">
                                <span className="mf-perf-label">1Y Returns</span>
                                <span className="mf-perf-value green">{fund.y1}</span>
                            </div>
                            <div className="mf-perf">
                                <span className="mf-perf-label">3Y Returns</span>
                                <span className="mf-perf-value">{fund.y3}</span>
                            </div>
                            <div className="mf-perf">
                                <span className="mf-perf-label">NAV</span>
                                <span className="mf-perf-value nav">{fund.nav}</span>
                            </div>
                        </div>
                        <button className="mf-invest-btn">
                            Invest Now <ArrowUpRight size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .mf-filters {
                    display: flex; gap: 0.453rem; margin-bottom: 1.359rem; flex-wrap: wrap;
                }
                .mf-filter-tab {
                    padding: 0.408rem 0.906rem; border-radius: 99px; border: 1px solid var(--border-color);
                    background: white; font-size: 0.77rem; font-weight: 500; color: var(--text-muted);
                    cursor: pointer; transition: all 0.2s;
                }
                .mf-filter-tab:hover { border-color: var(--primary); color: var(--primary); }
                .mf-filter-tab.active {
                    background: var(--primary); color: white; border-color: var(--primary);
                }
                .mf-section-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.906rem;
                }
                .mf-filter-btn {
                    display: flex; align-items: center; gap: 0.363rem; padding: 0.363rem 0.68rem;
                    border-radius: 8px; border: 1px solid var(--border-color); background: white;
                    font-size: 0.725rem; color: var(--text-muted); cursor: pointer; transition: all 0.2s;
                }
                .mf-filter-btn:hover { border-color: var(--primary); color: var(--primary); }

                .mf-list { display: flex; flex-direction: column; gap: 0.68rem; }
                .mf-card {
                    display: flex; align-items: center; justify-content: space-between;
                    background: white; border-radius: 14px; padding: 1.133rem 1.359rem;
                    border: 1px solid var(--border-color); box-shadow: 0 1px 3px rgba(0,0,0,0.03);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .mf-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                .mf-card-left { display: flex; align-items: center; gap: 0.906rem; flex: 1; min-width: 0; }
                .mf-card-icon {
                    width: 44px; height: 44px; border-radius: 12px; background: #F0FDF4; color: var(--primary);
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .mf-card-info { min-width: 0; }
                .mf-fund-name { font-weight: 600; font-size: 0.816rem; color: var(--text-main); margin-bottom: 0.272rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px; }
                .mf-fund-meta { display: flex; align-items: center; gap: 0.68rem; }
                .mf-fund-cat { font-size: 0.68rem; color: var(--text-muted); background: #F0FDF4; padding: 0.091rem 0.453rem; border-radius: 4px; }
                .mf-stars { display: flex; gap: 1px; }

                .mf-card-middle { display: flex; gap: 1.812rem; align-items: center; margin: 0 1.359rem; }
                .mf-perf { display: flex; flex-direction: column; align-items: center; }
                .mf-perf-label { font-size: 0.634rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.136rem; }
                .mf-perf-value { font-weight: 700; font-size: 0.816rem; color: var(--text-main); }
                .mf-perf-value.green { color: #16A34A; }
                .mf-perf-value.nav { color: var(--text-muted); font-weight: 500; font-size: 0.77rem; }

                .mf-invest-btn {
                    padding: 0.498rem 1.042rem; background: var(--primary); color: white; border: none;
                    border-radius: 10px; font-weight: 600; font-size: 0.725rem; cursor: pointer;
                    display: flex; align-items: center; gap: 0.317rem; white-space: nowrap; transition: background 0.2s;
                }
                .mf-invest-btn:hover { background: var(--primary-hover); }

                @media (max-width: 900px) {
                    .mf-card { flex-direction: column; align-items: flex-start; gap: 0.906rem; }
                    .mf-card-middle { margin: 0; gap: 1.359rem; }
                    .mf-invest-btn { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default MutualFundsView;
