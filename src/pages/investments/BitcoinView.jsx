import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentsService } from '../../services';
import { ArrowUpRight, TrendingUp, BarChart3 } from 'lucide-react';

const BitcoinView = () => {
    const [buyAmount, setBuyAmount] = useState('');
    const [sellAmount, setSellAmount] = useState('');

    // Fetch Bitcoin Holdings
    const { data: btcInfo = {}, isLoading } = useQuery({
        queryKey: ['investments-bitcoin'],
        queryFn: async () => {
            const data = await investmentsService.getInvestments();
            const btc = data.find(i => i.symbol === 'BTC' || i.name.toLowerCase() === 'bitcoin');
            return btc || { price: 43250, amount: 0, day_change: '+2.5%' };
        }
    });

    const btcPrice = parseFloat(btcInfo.price || 43250);
    const btcReceived = buyAmount ? (parseFloat(buyAmount) / btcPrice).toFixed(8) : '0.00000000';
    const usdReceived = sellAmount ? (parseFloat(sellAmount) * btcPrice).toLocaleString() : '0';

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #DCF2E4', borderTopColor: '#F59E0B', borderRadius: '50%' }} />
            </div>
        );
    }

    return (
        <div className="view-fade-in">
            <div className="btc-header-row">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bitcoin Trading</h1>
                    <p className="inv-view-subtitle">Real-time BTC analysis and trading</p>
                </div>
                <div className="btc-price-box">
                    <div className="btc-curr-price">
                        <span className="btc-price-label">Current Price</span>
                        <span className="btc-price-val">${btcPrice.toLocaleString()}</span>
                    </div>
                    <span className="btc-change-badge">
                        <ArrowUpRight size={14} /> {btcInfo.day_change || '+2.5%'}
                    </span>
                </div>
            </div>

            <div className="btc-chart-card">
                <div className="btc-chart-header">
                    <h3 className="inv-section-title" style={{ margin: 0 }}>Trading Chart</h3>
                    <div className="btc-chart-tabs">
                        {['1H', '1D', '1W', '1M', '1Y'].map(t => (
                            <button key={t} className={`btc-chart-tab ${t === '1D' ? 'active' : ''}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="btc-chart-area">
                    <svg viewBox="0 0 800 200" className="btc-chart-svg">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1B6B3A" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#1B6B3A" stopOpacity="0.02" />
                            </linearGradient>
                        </defs>
                        <path d="M0,160 Q50,140 100,120 T200,100 T300,80 T400,90 T500,60 T600,70 T700,40 L800,50 L800,200 L0,200 Z" fill="url(#chartGrad)" />
                        <path d="M0,160 Q50,140 100,120 T200,100 T300,80 T400,90 T500,60 T600,70 T700,40 L800,50" fill="none" stroke="#1B6B3A" strokeWidth="2.5" />
                    </svg>
                    <div className="btc-chart-overlay">
                        <BarChart3 size={40} />
                        <p>Real-time price movements and technical indicators</p>
                    </div>
                </div>
            </div>

            <div className="btc-trade-grid">
                <div className="btc-trade-panel buy">
                    <div className="btc-trade-panel-header">
                        <TrendingUp size={20} />
                        <h4>Buy Bitcoin</h4>
                    </div>
                    <div className="btc-trade-field">
                        <label className="btc-field-label">Amount (USD)</label>
                        <div className="btc-input-wrap">
                            <span className="btc-input-prefix">$</span>
                            <input type="number" placeholder="0.00" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} className="btc-input" />
                        </div>
                    </div>
                    <div className="btc-trade-field">
                        <label className="btc-field-label">You'll receive (BTC)</label>
                        <div className="btc-calc-val">₿ {btcReceived}</div>
                    </div>
                    <button className="btc-action-btn buy-btn">Buy BTC</button>
                </div>

                <div className="btc-trade-panel sell">
                    <div className="btc-trade-panel-header sell-header">
                        <TrendingUp size={20} style={{ transform: 'rotate(180deg)' }} />
                        <h4>Sell Bitcoin</h4>
                    </div>
                    <div className="btc-trade-field">
                        <label className="btc-field-label">Amount (BTC)</label>
                        <div className="btc-input-wrap">
                            <span className="btc-input-prefix">₿</span>
                            <input type="number" placeholder="0.00000000" value={sellAmount} onChange={e => setSellAmount(e.target.value)} className="btc-input" />
                        </div>
                    </div>
                    <div className="btc-trade-field">
                        <label className="btc-field-label">You'll receive (USD)</label>
                        <div className="btc-calc-val">$ {usdReceived}</div>
                    </div>
                    <button className="btc-action-btn sell-btn">Sell BTC</button>
                </div>
            </div>

            <style>{`
                .btc-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.359rem; flex-wrap: wrap; gap: 0.906rem; }
                .btc-price-box { display: flex; align-items: center; gap: 0.906rem; background: white; padding: 0.68rem 1.133rem; border-radius: 14px; border: 1px solid var(--border-color); }
                .btc-curr-price { display: flex; flex-direction: column; }
                .btc-price-label { font-size: 0.68rem; color: var(--text-muted); font-weight: 500; }
                .btc-price-val { font-size: 1.269rem; font-weight: 700; color: var(--text-main); }
                .btc-change-badge { display: flex; align-items: center; gap: 0.181rem; padding: 0.272rem 0.544rem; border-radius: 8px; background: #DCFCE7; color: #16A34A; font-weight: 700; font-size: 0.77rem; }

                .btc-chart-card { background: white; border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 1.359rem; overflow: hidden; }
                .btc-chart-header { display: flex; justify-content: space-between; align-items: center; padding: 1.133rem 1.359rem; border-bottom: 1px solid var(--border-color); }
                .btc-chart-tabs { display: flex; gap: 0.317rem; }
                .btc-chart-tab { padding: 0.272rem 0.634rem; border-radius: 6px; border: none; background: #F0FDF4; color: var(--text-muted); font-size: 0.725rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .btc-chart-tab.active { background: var(--primary); color: white; }
                .btc-chart-area { position: relative; height: 220px; padding: 0.906rem; }
                .btc-chart-svg { width: 100%; height: 100%; }
                .btc-chart-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.5; pointer-events: none; }
                .btc-chart-overlay p { font-size: 0.77rem; margin-top: 0.453rem; }

                .btc-trade-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.133rem; }
                .btc-trade-panel { background: white; border-radius: 16px; padding: 1.359rem; border: 1px solid var(--border-color); }
                .btc-trade-panel-header { display: flex; align-items: center; gap: 0.544rem; margin-bottom: 1.133rem; color: #16A34A; }
                .btc-trade-panel-header h4 { font-size: 0.952rem; font-weight: 600; color: var(--text-main); }
                .btc-trade-panel-header.sell-header { color: #DC2626; }
                .btc-trade-field { margin-bottom: 0.906rem; }
                .btc-field-label { display: block; font-size: 0.725rem; font-weight: 500; color: var(--text-muted); margin-bottom: 0.363rem; }
                .btc-input-wrap { position: relative; }
                .btc-input-prefix { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 600; }
                .btc-input { width: 100%; padding: 0.68rem 0.906rem 0.68rem 1.812rem; border: 1px solid var(--border-color); border-radius: 10px; font-size: 0.861rem; outline: none; transition: border 0.2s; background: #F8FAFC; }
                .btc-input:focus { border-color: var(--primary); background: white; }
                .btc-calc-val { padding: 0.589rem 0.906rem; background: #F0FDF4; border-radius: 10px; font-weight: 600; color: var(--text-main); font-size: 0.861rem; }
                .btc-action-btn { width: 100%; padding: 0.68rem; border: none; border-radius: 10px; font-weight: 600; font-size: 0.816rem; cursor: pointer; transition: all 0.2s; margin-top: 0.453rem; }
                .buy-btn { background: #16A34A; color: white; }
                .buy-btn:hover { background: #15803D; }
                .sell-btn { background: #DC2626; color: white; }
                .sell-btn:hover { background: #B91C1C; }

                @media (max-width: 768px) { .btc-trade-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default BitcoinView;
