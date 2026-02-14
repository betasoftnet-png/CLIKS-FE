import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    TrendingUp,
    Users,
    Gamepad2,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    Clock,
    Eye,
    MessageCircle,
    Share2,
    Heart,
    Bookmark,
    Search,
    Filter,
    PiggyBank,
    Briefcase,
    Bitcoin,
    LineChart,
    UserPlus,
    Trophy,
    MapPin,
    Video,
    Sparkles,
    Plus,
    Globe
} from 'lucide-react';
import '../App.css';

export default function Public() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 'news-feed';

    // News Feed Component
    const NewsFeed = () => (
        <section className="social-feed-section">
            <div className="social-container">
                {/* Left Column: Exclusives */}
                <div className="social-col-left">
                    <div className="flex flex-col gap-8 md:gap-12">
                        <div className="exclusive-item">
                            <h3>
                                <span className="exclusive-dot"></span>
                                <span className="exclusive-label">Exclusive</span>
                            </h3>
                            <a rel="noopener noreferrer" href="#" className="exclusive-link">Global markets rally as inflation data shows unexpected cooling.</a>
                            <p className="meta-text">47 minutes ago by
                                <a rel="noopener noreferrer" href="#" className="author-link">Sarah Jennings</a>
                            </p>
                        </div>
                        <div className="exclusive-item">
                            <h3>
                                <span className="exclusive-dot"></span>
                                <span className="exclusive-label">Exclusive</span>
                            </h3>
                            <a rel="noopener noreferrer" href="#" className="exclusive-link">New banking regulations set to reshape the fintech landscape in 2026.</a>
                            <p className="meta-text">2 hours ago by
                                <a rel="noopener noreferrer" href="#" className="author-link">Michael Chen</a>
                            </p>
                        </div>
                        <div className="exclusive-item">
                            <h3>
                                <span className="exclusive-dot"></span>
                                <span className="exclusive-label">Exclusive</span>
                            </h3>
                            <a rel="noopener noreferrer" href="#" className="exclusive-link">Cryptocurrency volatility continues to spark debate among EU regulators.</a>
                            <p className="meta-text">4 hours ago by
                                <a rel="noopener noreferrer" href="#" className="author-link">Elena Ross</a>
                            </p>
                        </div>
                    </div>
                    <div className="see-more-container">
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                        <a rel="noopener noreferrer" href="#" className="see-more-link">
                            <span className="exclusive-label">See more exclusives</span>
                            <svg viewBox="0 0 24 24" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="see-more-icon">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Main Column: Featured Image */}
                <div className="social-col-main" style={{ backgroundImage: "url('https://source.unsplash.com/random/239x319')" }}>
                    <span className="main-card-location">New York, USA</span>
                    <a className="main-card-overlay">
                        <span className="live-indicator">
                            <span className="live-dot-container">
                                <span className="live-ping"></span>
                            </span>
                            <span className="text-sm font-bold">Live</span>
                        </span>
                        <h1 rel="noopener noreferrer" href="#" className="main-title">Tech giants report record quarterly earnings, driving S&P 500 higher.</h1>
                    </a>
                </div>

                {/* Right Column: News List */}
                <div className="social-col-right">
                    <div className="tabs-header">
                        <button type="button" className="tab-btn active">Latest</button>
                        <button type="button" className="tab-btn">Popular</button>
                    </div>
                    <div className="news-list">
                        <div className="news-item">
                            <img alt="" className="news-thumb" src="https://source.unsplash.com/random/244x324" />
                            <div className="news-content">
                                <a rel="noopener noreferrer" href="#" className="news-title">Investment strategies for the post-pandemic economy.</a>
                                <p className="news-item-meta">5 minutes ago
                                    <a rel="noopener noreferrer" href="#" className="tag-link">Investing</a>
                                </p>
                            </div>
                        </div>
                        <div className="news-item">
                            <img alt="" className="news-thumb" src="https://source.unsplash.com/random/245x325" />
                            <div className="news-content">
                                <a rel="noopener noreferrer" href="#" className="news-title">Central banks signal potential rate cuts in the coming months.</a>
                                <p className="news-item-meta">14 minutes ago
                                    <a rel="noopener noreferrer" href="#" className="tag-link">Economy</a>
                                </p>
                            </div>
                        </div>
                        <div className="news-item">
                            <img alt="" className="news-thumb" src="https://source.unsplash.com/random/246x326" />
                            <div className="news-content">
                                <a rel="noopener noreferrer" href="#" className="news-title">Sustainable investing gains traction among millennial investors.</a>
                                <p className="news-item-meta">22 minutes ago
                                    <a rel="noopener noreferrer" href="#" className="tag-link">ESG</a>
                                </p>
                            </div>
                        </div>
                        <div className="news-item">
                            <img alt="" className="news-thumb" src="https://source.unsplash.com/random/247x327" />
                            <div className="news-content">
                                <a rel="noopener noreferrer" href="#" className="news-title">Understanding the impact of geopolitical shifts on currency markets.</a>
                                <p className="news-item-meta">37 minutes ago
                                    <a rel="noopener noreferrer" href="#" className="tag-link">Forex</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // Trading SIP Page
    const TradingSIP = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">SIP Investment</h1>
                    <p className="text-gray-600 mt-1">Systematic Investment Plans for steady wealth building</p>
                </div>
                <button className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#195BAC' }}>
                    Start New SIP
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Active SIPs', value: '12', icon: PiggyBank, color: 'blue' },
                    { label: 'Monthly Investment', value: '₹50K', icon: TrendingUp, color: 'green' },
                    { label: 'Total Returns', value: '+18.5%', icon: LineChart, color: 'purple' },
                    { label: 'Portfolio Value', value: '₹8.2L', icon: Briefcase, color: 'orange' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* SIP Plans */}
            <div className="grid grid-cols-3 gap-6">
                {['Conservative', 'Balanced', 'Aggressive'].map((plan) => (
                    <div key={plan} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{plan} Plan</h3>
                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Expected Returns</span>
                                <span className="font-semibold text-gray-800">12-15%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Risk Level</span>
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">Low</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Min. Investment</span>
                                <span className="font-semibold text-gray-800">₹500</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors">
                            Explore Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    // Trading Mutual Funds Page
    const TradingMutualFunds = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mutual Funds</h1>
                    <p className="text-gray-600 mt-1">Diversified investment opportunities curated for you</p>
                </div>
                <button className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#195BAC' }}>
                    Explore Funds
                </button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {['All Funds', 'Equity', 'Debt', 'Hybrid', 'Index Funds', 'Tax Saving'].map((cat) => (
                    <button key={cat} className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 whitespace-nowrap transition-colors">
                        {cat}
                    </button>
                ))}
            </div>

            {/* Top Performing Funds */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Top Performing Funds</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1">HDFC Top 100 Fund - Direct Growth</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-600">Equity • Large Cap</span>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded">★ 5 Star</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">1Y Returns</p>
                                        <p className="text-lg font-bold text-green-600">+24.8%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">3Y Returns</p>
                                        <p className="text-lg font-bold text-green-600">+18.2%</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#195BAC' }}>
                                        Invest Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Trading Crypto Page
    const TradingCrypto = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Cryptocurrency</h1>
                    <p className="text-gray-600 mt-1">Trade popular cryptocurrencies with real-time insights</p>
                </div>
            </div>

            {/* Market Overview */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Bitcoin className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm">Market Cap</p>
                            <p className="text-2xl font-bold">$2.1T</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-blue-100">24h Volume</span>
                        <span className="font-semibold">$98.5B</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-purple-100 text-sm">Bitcoin Dominance</p>
                            <p className="text-2xl font-bold">48.2%</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-purple-100">Active Coins</span>
                        <span className="font-semibold">10,234</span>
                    </div>
                </div>
            </div>

            {/* Crypto List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Top Cryptocurrencies</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">24h Change</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Market Cap</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { name: 'Bitcoin', symbol: 'BTC', price: '$43,250', change: '+2.5%', cap: '$845B', positive: true },
                                { name: 'Ethereum', symbol: 'ETH', price: '$2,280', change: '+1.8%', cap: '$274B', positive: true },
                                { name: 'Ripple', symbol: 'XRP', price: '$0.58', change: '-0.9%', cap: '$31B', positive: false },
                                { name: 'Cardano', symbol: 'ADA', price: '$0.42', change: '+3.2%', cap: '$14.8B', positive: true }
                            ].map((crypto, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                                {crypto.symbol[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{crypto.name}</p>
                                                <p className="text-sm text-gray-500">{crypto.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-800">{crypto.price}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-semibold ${crypto.positive ? 'text-green-600' : 'text-red-600'} `}>
                                            {crypto.change}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-700">{crypto.cap}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#195BAC' }}>
                                            Trade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Trading Bitcoin Page
    const TradingBitcoin = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <Bitcoin className="w-9 h-9 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Bitcoin Trading</h1>
                        <p className="text-gray-600 mt-1">Real-time BTC analysis and trading</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-3xl font-bold text-gray-800">$43,250.00</p>
                    <p className="text-green-600 font-semibold">+2.5% (24h)</p>
                </div>
            </div>

            {/* Trading Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <LineChart className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Trading Chart View</p>
                        <p className="text-sm text-gray-500 mt-1">Real-time price movements and technical indicators</p>
                    </div>
                </div>
            </div>

            {/* Trading Actions */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Buy Bitcoin</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 mb-2 block">Amount (USD)</label>
                            <input type="text" placeholder="0.00" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 mb-2 block">You'll receive (BTC)</label>
                            <input type="text" placeholder="0.00000000" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50" disabled />
                        </div>
                        <button className="w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                            Buy BTC
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sell Bitcoin</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 mb-2 block">Amount (BTC)</label>
                            <input type="text" placeholder="0.00000000" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 mb-2 block">You'll receive (USD)</label>
                            <input type="text" placeholder="0.00" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50" disabled />
                        </div>
                        <button className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
                            Sell BTC
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Trading Overall Page
    const TradingOverall = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Overall Trading Dashboard</h1>
                <p className="text-gray-600 mt-1">Complete overview of your trading portfolio</p>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Portfolio', value: '₹12.5L', change: '+12.5%', positive: true },
                    { label: 'Total Invested', value: '₹10.2L', change: 'All Time', positive: null },
                    { label: 'Current Value', value: '₹14.8L', change: '+45.1%', positive: true },
                    { label: 'Today\'s P&L', value: '+₹3,250', change: '+2.6%', positive: true }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.positive === true ? 'text-green-600' : stat.positive === false ? 'text-red-600' : 'text-gray-500'} `}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Asset Allocation */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Asset Allocation</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Mutual Funds', percentage: 45, color: 'blue', amount: '₹5.6L' },
                            { name: 'Stocks', percentage: 30, color: 'green', amount: '₹3.7L' },
                            { name: 'Crypto', percentage: 15, color: 'purple', amount: '₹1.9L' },
                            { name: 'SIP', percentage: 10, color: 'orange', amount: '₹1.2L' }
                        ].map((asset) => (
                            <div key={asset.name}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 font-medium">{asset.name}</span>
                                    <span className="text-gray-800 font-semibold">{asset.amount}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-${asset.color}-500 rounded-full`}
                                        style={{ width: `${asset.percentage}% ` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{asset.percentage}% of portfolio</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                        {[
                            { type: 'Buy', asset: 'Bitcoin', amount: '₹25,000', time: '2 hours ago', positive: false },
                            { type: 'Sell', asset: 'HDFC MF', amount: '₹12,500', time: '5 hours ago', positive: true },
                            { type: 'Buy', asset: 'TCS Stock', amount: '₹50,000', time: 'Yesterday', positive: false },
                            { type: 'SIP', asset: 'Index Fund', amount: '₹5,000', time: '2 days ago', positive: false }
                        ].map((txn, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${txn.positive ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center`}>
                                        <ArrowUpRight className={`w-5 h-5 ${txn.positive ? 'text-green-600 rotate-180' : 'text-blue-600'} `} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{txn.type} {txn.asset}</p>
                                        <p className="text-sm text-gray-500">{txn.time}</p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${txn.positive ? 'text-green-600' : 'text-gray-800'} `}>
                                    {txn.positive ? '+' : ''}{txn.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Investors Page
    const InvestorsPage = () => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '600px',
            textAlign: 'center',
            gap: '2rem',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            marginTop: '1rem'
        }}>
            <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #195BAC 0%, #3B82F6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 25px -5px rgba(25, 91, 172, 0.3)',
                marginBottom: '1rem'
            }}>
                <Briefcase size={48} color="white" strokeWidth={1.5} />
            </div>

            <div style={{ maxWidth: '640px' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#1E293B',
                    marginBottom: '1.25rem',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                }}>
                    Do you want to become a Investor?
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#64748B',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    Unlock exclusive access to premium high-growth investment opportunities, connect with industry leaders in our private network, and grow your portfolio with expert-led insights.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '3rem',
                width: '100%',
                maxWidth: '800px',
                margin: '1rem 0 3rem 0'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#EFF6FF',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#195BAC'
                    }}>
                        <TrendingUp size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: '700', color: '#1E293B', fontSize: '1.1rem', marginBottom: '0.25rem' }}>High Returns</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Access vetted deals with potential for exponential growth.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#F0FDF4',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A'
                    }}>
                        <Users size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: '700', color: '#1E293B', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Elite Network</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Connect with successful founders and fellow investors.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#FAF5FF',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9333EA'
                    }}>
                        <Sparkles size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: '700', color: '#1E293B', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Early Access</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Get in on the ground floor of the next big thing.</p>
                    </div>
                </div>
            </div>

            <button style={{
                background: '#195BAC',
                color: 'white',
                padding: '1.25rem 3.5rem',
                borderRadius: '99px',
                fontSize: '1.25rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(25, 91, 172, 0.3), 0 4px 6px -2px rgba(25, 91, 172, 0.1)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(25, 91, 172, 0.4), 0 10px 10px -5px rgba(25, 91, 172, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(25, 91, 172, 0.3), 0 4px 6px -2px rgba(25, 91, 172, 0.1)';
                }}
            >
                Start Investing Now
                <ArrowUpRight size={24} />
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94A3B8' }}>
                No hidden fees. Cancel anytime.
            </p>
        </div>
    );

    // Games Page
    const GamesPage = () => (
        <div style={{ padding: '0 0 2rem 0', fontFamily: "'Inter', sans-serif" }}>
            {/* Unique Header Banner */}
            <div style={{
                background: 'linear-gradient(120deg, #1e3a8a 0%, #3b82f6 100%)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                color: 'white',
                marginBottom: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(30, 58, 138, 0.3)'
            }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)',
                        marginBottom: '1rem',
                        display: 'inline-block'
                    }}>
                        Level 5 • Pro Gamer
                    </span>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
                        Ready to level up your <br /> Financial Skills?
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '2rem', maxWidth: '500px' }}>
                        Compete in real-time trading battles, solve complex puzzles, and climb the global leaderboards to win exclusive rewards.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{
                            background: 'white',
                            color: '#1e3a8a',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            Daily Challenge
                        </button>
                        <button style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            View Rewards
                        </button>
                    </div>
                </div>

                {/* Abstract Decorative elements */}
                <div style={{ position: 'relative', height: '200px', width: '300px' }}>
                    <Gamepad2 size={180} color="white" style={{ opacity: 0.1, position: 'absolute', right: '-20px', top: '-20px', transform: 'rotate(15deg)' }} />
                    <Trophy size={120} color="#fbbf24" style={{ position: 'absolute', right: '40px', bottom: '0', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Main Game Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Featured Games</h2>
                        <a href="#" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>View All</a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        {/* Large Featured Card */}
                        <div style={{
                            gridColumn: 'span 2',
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            display: 'flex',
                            gap: '2rem',
                            alignItems: 'center',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 20px rgba(109, 40, 217, 0.25)'
                            }}>
                                <TrendingUp size={60} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Now</span>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', margin: '0.5rem 0' }}>Ultimate Trading Simulator</h3>
                                <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.5' }}>Experience the thrill of the stock market without the risk. Trade with virtual currency and compete.</p>
                                <button style={{
                                    background: '#195BAC',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    Play Now <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {[
                            { title: 'Crypto Quiz', color: '#10b981', icon: Bitcoin, level: 'Beginner', bg: '#ecfdf5', text: '#059669' },
                            { title: 'Budget Master', color: '#f59e0b', icon: PiggyBank, level: 'Intermediate', bg: '#fffbeb', text: '#d97706' },
                            { title: 'Risk Analyst', color: '#ef4444', icon: LineChart, level: 'Advanced', bg: '#fef2f2', text: '#dc2626' },
                            { title: 'Market Puzzle', color: '#3b82f6', icon: Gamepad2, level: 'Fun', bg: '#eff6ff', text: '#2563eb' }
                        ].map((game, i) => (
                            <div key={i} style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '16px',
                                        background: game.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <game.icon size={28} color={game.text} />
                                    </div>
                                    <span style={{
                                        background: '#f3f4f6',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#4b5563'
                                    }}>
                                        {game.level}
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>{game.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>2.5k Players Online</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Leaderboard */}
                <div style={{ width: '340px' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        position: 'sticky',
                        top: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>Top Players</h3>
                            <button style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
                                This Week
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Aditya S', score: '9,850', rank: 1, avatar: 'AV' },
                                { name: 'Rahul K', score: '8,400', rank: 2, avatar: 'RK' },
                                { name: 'Sneha M', score: '7,200', rank: 3, avatar: 'SM' },
                                { name: 'Amit J', score: '6,900', rank: 4, avatar: 'AJ' },
                                { name: 'Priya R', score: '5,540', rank: 5, avatar: 'PR' }
                            ].map((player, index) => (
                                <div key={player.rank} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '12px', background: index === 0 ? '#f0f9ff' : 'transparent' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        color: index < 3 ? '#eab308' : '#9ca3af',
                                        fontSize: '0.9rem'
                                    }}>
                                        {player.rank}
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#e0e7ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#3730a3',
                                        fontWeight: '700',
                                        fontSize: '0.9rem'
                                    }}>
                                        {player.avatar}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{player.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{player.score} XP</p>
                                    </div>
                                    {index === 0 && <Trophy size={16} color="#eab308" />}
                                </div>
                            ))}
                        </div>

                        <button style={{
                            width: '100%',
                            marginTop: '1.5rem',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            background: 'white',
                            color: '#4b5563',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                            View Global Rankings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Meetup Page
    const MeetupPage = () => {
        const [filter, setFilter] = useState('All');

        const events = [
            {
                title: 'Stock Market Basics Masterclass',
                type: 'Offline',
                date: 'Mar 18, 2026',
                time: '10:00 AM',
                location: 'Downtown Conf. Center',
                attendees: [1, 2, 3, 4],
                gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
                icon: TrendingUp,
                price: 'Free'
            },
            {
                title: 'Crypto Trading Strategies Webinar',
                type: 'Online',
                date: 'Mar 22, 2026',
                time: '06:00 PM',
                location: 'Zoom Meeting',
                attendees: [1, 2, 3, 4, 5, 6],
                gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                icon: Bitcoin,
                price: '$29'
            },
            {
                title: 'Investment Planning Workshop',
                type: 'Offline',
                date: 'Mar 30, 2026',
                time: '02:00 PM',
                location: 'Grand Hotel, NYC',
                attendees: [1, 2, 3],
                gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                icon: PiggyBank,
                price: 'Free'
            },
            {
                title: 'DeFi & Web3 Future Summit',
                type: 'Online',
                date: 'Apr 05, 2026',
                time: '09:00 PM',
                location: 'Live Stream',
                attendees: [1, 2, 3, 4, 5],
                gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                icon: Globe,
                price: '$49'
            },
            {
                title: 'Real Estate Investing 101',
                type: 'Offline',
                date: 'Apr 12, 2026',
                time: '11:00 AM',
                location: 'Community Hall',
                attendees: [1, 2, 3, 4, 5, 6, 7],
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                icon: MapPin,
                price: 'Free'
            }
        ];

        return (
            <div className="space-y-8">
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                    borderRadius: '24px',
                    padding: '3rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 20px 25px -5px rgba(30, 58, 138, 0.25)'
                }}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '999px',
                            backdropFilter: 'blur(10px)',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            <Sparkles size={16} />
                            <span>Community Events</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>
                            Connect, Learn & <br /> Grow Together
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#93c5fd',
                            maxWidth: '480px',
                            lineHeight: 1.6
                        }}>
                            Join our exclusive finance meetups, workshops, and webinars to level up your investing game.
                        </p>
                    </div>

                    {/* Decorative Circle */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(30, 58, 138, 0) 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }} />

                    <button className="transition" style={{
                        position: 'relative',
                        zIndex: 10,
                        padding: '1rem 2rem',
                        background: 'white',
                        color: '#1e3a8a',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Plus size={20} />
                        Create Event
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', overflowX: 'auto' }}>
                    {['All Events', 'Upcoming', 'Workshops', 'Webinars', 'My Events'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className="transition"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '999px',
                                border: filter === tab ? 'none' : '1px solid #E5E7EB',
                                background: filter === tab ? '#195BAC' : 'white',
                                color: filter === tab ? 'white' : '#6B7280',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95rem'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="transition"
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                border: '1px solid #F3F4F6',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Graphic Header */}
                            <div style={{
                                height: '140px',
                                background: event.gradient,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}>
                                    <event.icon size={32} />
                                </div>

                                <span style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    padding: '0.25rem 0.75rem',
                                    background: 'white',
                                    color: '#1F2937',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {event.price}
                                </span>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        color: event.type === 'Online' ? '#9333EA' : '#2563EB',
                                        background: event.type === 'Online' ? '#F3E8FF' : '#DBEAFE',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px'
                                    }}>
                                        {event.type}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '500' }}>
                                        {event.date}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                    {event.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    <Clock size={16} />
                                    <span>{event.time}</span>
                                </div>

                                {/* Footer: Attendees & Button */}
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', paddingLeft: '8px' }}>
                                        {event.attendees.slice(0, 4).map((_, i) => (
                                            <div key={i} style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: '#E5E7EB',
                                                border: '2px solid white',
                                                marginLeft: '-8px'
                                            }} />
                                        ))}
                                        {event.attendees.length > 4 && (
                                            <div style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                background: '#F3F4F6',
                                                border: '2px solid white',
                                                marginLeft: '-8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                color: '#6B7280',
                                                fontWeight: '600'
                                            }}>
                                                +{event.attendees.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    <button className="transition" style={{
                                        padding: '0.5rem 1.25rem',
                                        border: '1px solid #195BAC',
                                        borderRadius: '8px',
                                        color: '#195BAC',
                                        background: 'transparent',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#195BAC';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#195BAC';
                                        }}
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render the appropriate page based on page URL param
    const renderPage = () => {
        if (page === 'news-feed') return <NewsFeed />;
        if (page === 'trading-sip') return <TradingSIP />;
        if (page === 'trading-mutual-funds') return <TradingMutualFunds />;
        if (page === 'trading-crypto') return <TradingCrypto />;
        if (page === 'trading-bitcoin') return <TradingBitcoin />;
        if (page === 'trading-overall') return <TradingOverall />;
        if (page === 'investors') return <InvestorsPage />;
        if (page === 'games') return <GamesPage />;
        if (page === 'meetup') return <MeetupPage />;
        return <NewsFeed />;
    };

    return (
        <>
            <div className="content-wrapper">
                {renderPage()}
            </div>
        </>
    );
}
