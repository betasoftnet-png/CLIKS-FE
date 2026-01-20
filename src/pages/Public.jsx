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
    Sparkles
} from 'lucide-react';
import '../App.css';

export default function Public() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 'news-feed';

    // News Feed Component
    const NewsFeed = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
                        Social & Public
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                        Stay updated with the latest financial news and trends
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: '#9CA3AF'
                        }} />
                        <input
                            type="text"
                            placeholder="Search news..."
                            style={{
                                paddingLeft: '2.75rem',
                                paddingRight: '1rem',
                                paddingTop: '0.625rem',
                                paddingBottom: '0.625rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '10px',
                                fontSize: '0.95rem',
                                outline: 'none',
                                width: '280px',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#195BAC';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(25, 91, 172, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <button style={{
                        padding: '0.625rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F9FAFB';
                            e.currentTarget.style.borderColor = '#195BAC';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                        }}
                    >
                        <Filter style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                    </button>
                </div>
            </div>

            {/* Trending Topics */}
            <div style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #BAE6FD',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #195BAC 0%, #1E40AF 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px rgba(25, 91, 172, 0.2)'
                    }}>
                        <Sparkles style={{ width: '22px', height: '22px', color: 'white' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0C4A6E' }}>
                        Trending Today
                    </h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {['Bitcoin Rally', 'Stock Market Update', 'Crypto News', 'Tech Stocks', 'Fed Meeting'].map((tag) => (
                        <span
                            key={tag}
                            style={{
                                padding: '0.625rem 1.25rem',
                                background: 'white',
                                borderRadius: '9999px',
                                fontSize: '0.9rem',
                                color: '#1F2937',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '1px solid #E0F2FE',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#195BAC';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#1F2937';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* News Threads */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                    { author: 'Analyst', initial: 'A', time: '2 hours ago', category: 'Finance', title: 'Market Analysis: Tech Stocks Show Strong Performance in Q4', content: 'Technology stocks continued their upward trend as investors reacted positively to strong earnings and optimistic forward guidance. Analysts suggest the momentum may continue into the next quarter based on sector-wide indicators.', likes: 245, comments: 42, status: 'Trending', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', statusBg: '#ECFDF5', statusColor: '#059669', borderColor: '#DBEAFE' },
                    { author: 'Crypto Expert', initial: 'C', time: '5 hours ago', category: 'Crypto', title: 'Bitcoin Reaches New Milestone Amid Institutional Interest', content: 'Bitcoin surged past key resistance levels as major institutional investors increased their positions. Market analysts point to growing mainstream adoption and regulatory clarity as key drivers of the recent rally.', likes: 189, comments: 67, status: 'Hot', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', statusBg: '#FEF2F2', statusColor: '#DC2626', borderColor: '#FED7AA' },
                    { author: 'Investment Guru', initial: 'I', time: '1 day ago', category: 'Investment', title: 'Top 5 Mutual Funds for Long-Term Wealth Creation in 2026', content: 'Financial advisors share their picks for the best performing mutual funds this year. These funds have shown consistent returns and low expense ratios, making them ideal for long-term investors seeking steady growth.', likes: 412, comments: 89, status: 'Popular', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', statusBg: '#F3E8FF', statusColor: '#9333EA', borderColor: '#D1FAE5' }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: `2px solid ${item.borderColor}`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            padding: '1.5rem',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {/* Left: Author / Meta */}
                            <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: item.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '1.25rem',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}>
                                        {item.initial}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.95rem' }}>{item.author}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{item.time}</span>
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontSize: '0.75rem',
                                    padding: '0.375rem 0.75rem',
                                    background: '#DBEAFE',
                                    color: '#1E40AF',
                                    borderRadius: '9999px',
                                    width: 'fit-content',
                                    fontWeight: '600'
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            {/* Center: Content */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: '#111827',
                                    marginBottom: '0.75rem',
                                    lineHeight: '1.5',
                                    transition: 'color 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                                >
                                    {item.title}
                                </h3>
                                <p style={{
                                    color: '#6B7280',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    marginBottom: '1rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {item.content}
                                </p>

                                {/* Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: 'auto' }}>
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#6B7280',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#FEE2E2';
                                            e.currentTarget.style.color = '#EF4444';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#6B7280';
                                        }}
                                    >
                                        <Heart size={18} />
                                        <span style={{ fontWeight: '600' }}>{item.likes}</span>
                                    </button>
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#6B7280',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#DBEAFE';
                                            e.currentTarget.style.color = '#2563EB';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#6B7280';
                                        }}
                                    >
                                        <MessageCircle size={18} />
                                        <span style={{ fontWeight: '600' }}>{item.comments}</span>
                                    </button>
                                    <button style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#6B7280',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#D1FAE5';
                                            e.currentTarget.style.color = '#059669';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#6B7280';
                                        }}
                                    >
                                        <Share2 size={18} />
                                        <span style={{ fontWeight: '600' }}>Share</span>
                                    </button>
                                    <button style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#9CA3AF',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#F3F4F6';
                                            e.currentTarget.style.color = '#195BAC';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = '#9CA3AF';
                                        }}
                                    >
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Right: Context / Status */}
                            <div style={{ width: '160px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.5rem 1rem',
                                    background: item.statusBg,
                                    color: item.statusColor,
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    {item.status}
                                </span>
                                <div style={{ display: 'flex', marginLeft: '-0.5rem' }}>
                                    {[1, 2, 3].map((u) => (
                                        <div key={u} style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)',
                                            border: '3px solid white',
                                            marginLeft: '-8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
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
                        <div className={`w - 12 h - 12 bg - ${stat.color} -50 rounded - lg flex items - center justify - center mb - 3`}>
                            <stat.icon className={`w - 6 h - 6 text - ${stat.color} -600`} />
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
                                        <span className={`font - semibold ${crypto.positive ? 'text-green-600' : 'text-red-600'} `}>
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
                        <p className={`text - sm font - medium ${stat.positive === true ? 'text-green-600' : stat.positive === false ? 'text-red-600' : 'text-gray-500'} `}>
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
                                        className={`h - full bg - ${asset.color} -500 rounded - full`}
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
                                    <div className={`w - 10 h - 10 rounded - lg ${txn.positive ? 'bg-green-100' : 'bg-blue-100'} flex items - center justify - center`}>
                                        <ArrowUpRight className={`w - 5 h - 5 ${txn.positive ? 'text-green-600 rotate-180' : 'text-blue-600'} `} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{txn.type} {txn.asset}</p>
                                        <p className="text-sm text-gray-500">{txn.time}</p>
                                    </div>
                                </div>
                                <p className={`font - semibold ${txn.positive ? 'text-green-600' : 'text-gray-800'} `}>
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Investors Network</h1>
                    <p className="text-gray-600 mt-1">Connect with experienced investors and learn from the community</p>
                </div>
                <button className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2" style={{ backgroundColor: '#195BAC' }}>
                    <UserPlus className="w-5 h-5" />
                    Follow Investor
                </button>
            </div>

            {/* Featured Investors */}
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                    JD
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">John Doe</h3>
                                    <p className="text-sm text-gray-500">@johndoe</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                Pro
                            </span>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-gray-600 mb-4">
                            Long-term equity investor focused on value stocks and steady growth.
                        </p>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Followers</p>
                                <p className="font-semibold text-gray-800">12.4K</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Avg Returns</p>
                                <p className="font-semibold text-green-600">+18%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-semibold text-gray-800">8Y</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: '#195BAC' }}>
                                Follow
                            </button>
                            <button className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Games Page
    const GamesPage = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Games & Challenges</h1>
                <p className="text-gray-600 mt-1">Learn finance through interactive games and competitions</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {[
                    { title: 'Stock Market Quiz', desc: 'Test your market knowledge', tag: 'Quiz' },
                    { title: 'Trading Simulator', desc: 'Practice trading without risk', tag: 'Simulator' },
                    { title: 'Finance Puzzle', desc: 'Solve real finance scenarios', tag: 'Puzzle' }
                ].map((game) => (
                    <div key={game.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{game.tag}</span>
                            <Gamepad2 className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{game.desc}</p>
                        <button className="w-full py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#195BAC' }}>
                            Play Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Leaderboard</h2>
                <div className="space-y-3">
                    {['Adhi', 'Rahul', 'Sneha', 'Amit'].map((name, idx) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                                    {idx + 1}
                                </span>
                                <span className="font-medium text-gray-800">{name}</span>
                            </div>
                            <span className="text-gray-600">Score: {1200 - idx * 120}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Meetup Page
    const MeetupPage = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Meetups & Events</h1>
                    <p className="text-gray-600 mt-1">Join finance meetups, workshops, and webinars</p>
                </div>
                <button className="px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: '#195BAC' }}>
                    Create Event
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {[
                    { title: 'Stock Market Basics', type: 'Offline', date: 'Mar 18, 2026' },
                    { title: 'Crypto Trading Webinar', type: 'Online', date: 'Mar 22, 2026' },
                    { title: 'Investment Planning Workshop', type: 'Offline', date: 'Mar 30, 2026' }
                ].map((event) => (
                    <div key={event.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            {event.type === 'Online' ? (
                                <Video className="w-5 h-5 text-purple-600" />
                            ) : (
                                <MapPin className="w-5 h-5 text-blue-600" />
                            )}
                            <span className="text-sm text-gray-600">{event.type}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                        </div>
                        <button className="w-full py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

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
