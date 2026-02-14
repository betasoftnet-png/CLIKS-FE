import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    ArrowLeftRight,
    ShoppingCart,
    Calendar,
    Target,
    Bell,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import '../../App.css';

const FinancialPlan = () => {
    const navigate = useNavigate();
    const [isCalendarOpen, setCalendarOpen] = useState(true); // Default open or closed? User said "opens up only when...", so default false usually. But image shows it open. Let's start false to match 'opens up'.

    const planItems = [
        {
            title: 'Budget',
            description: 'Set and manage your monthly budgets',
            icon: DollarSign,
            path: '/books/plan/budget',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            title: 'Income',
            description: 'Track your various income sources',
            icon: ArrowLeftRight,
            path: '/books/plan/income',
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-100'
        },
        {
            title: 'Expense',
            description: 'Monitor your daily spending',
            icon: ShoppingCart,
            path: '/books/plan/expense',
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-100'
        },
        {
            title: 'Financial Calendar',
            description: 'View upcoming payments and events',
            icon: Calendar,
            path: '/books/plan/calendar',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            title: 'Savings & Goals',
            description: 'Track progress towards financial goals',
            icon: Target,
            path: '/books/plan/goals',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            title: 'Reminders',
            description: 'Manage payment due dates and alerts',
            icon: Bell,
            path: '/books/plan/reminders',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-100'
        },
        {
            title: 'Analysis',
            description: 'Deep dive into your financial health',
            icon: BarChart3,
            path: '/books/plan/analysis',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        }
    ];

    // Filter out 'Financial Calendar' for the grid
    const gridItems = planItems.filter((item) => item.title !== 'Financial Calendar');

    return (
        <div className="page-fade-in content-wrapper pt-6">
            <div className="mb-8">

                <p className="text-muted mt-2">Manage your financial strategies and tracking in one place.</p>
            </div>

            <div className="flex-row-layout">
                {/* Left Side: Tiles Grid */}
                <div className="tiles-section">
                    {gridItems.map((item, index) => {
                        if (item.title === 'Budget') {
                            return (
                                <div key={index} className="budget-chart-card" onClick={() => navigate(item.path)}>
                                    <div className="chart-header">
                                        <h3 className="chart-title">Daily Spending</h3>
                                        <p className="chart-subtitle">Weekly breakdown</p>
                                    </div>

                                    <div className="chart-area">
                                        {/* Y-Axis */}
                                        <div className="chart-y-axis">
                                            <span>30</span>
                                            <span>20</span>
                                            <span>10</span>
                                            <span>0</span>
                                        </div>

                                        {/* Chart Content */}
                                        <div className="chart-bars-container">
                                            {/* Goal Line */}
                                            <div className="goal-line">
                                                <span className="goal-label">GOAL</span>
                                            </div>

                                            {/* Bars */}
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                                const heights = [45, 50, 65, 45, 35, 45, 40]; // Approximate percentages
                                                const isWednesday = day === 'W' && i === 2;
                                                return (
                                                    <div key={i} className={`chart-col ${isWednesday ? 'active-col' : ''}`}>
                                                        {isWednesday && (
                                                            <div className="chart-tooltip">
                                                                <div className="tooltip-row"><span>Goal:</span> <span className="font-bold">16</span></div>
                                                                <div className="tooltip-row"><span>Spent:</span> <span className="font-bold">19</span></div>
                                                                <div className="tooltip-arrow"></div>
                                                            </div>
                                                        )}
                                                        <div className="bar-wrapper">
                                                            <div
                                                                className="chart-bar"
                                                                style={{ height: `${heights[i]}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`day-label ${isWednesday ? 'text-dark' : ''}`}>{day}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`tile-card`}
                                style={{
                                    borderColor: item.border.includes('blue') ? '#DBEAFE' : item.border.includes('green') ? '#DCFCE7' : item.border.includes('red') ? '#FEE2E2' : item.border.includes('purple') ? '#F3E8FF' : item.border.includes('emerald') ? '#ECFDF5' : item.border.includes('orange') ? '#FFEDD5' : '#E0E7FF'
                                }}
                            >
                                <div className="tile-content-wrapper">
                                    <div className={`tile-icon-box ${item.bg.replace('bg-', 'bg-color-')}`}>
                                        <item.icon className={`tile-icon ${item.color}`} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="tile-title">
                                            {item.title}
                                        </h3>
                                        <p className="tile-desc">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="tile-footer-link">
                                    Open <ArrowRight size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Redesigned Calendar Widget */}
                <div className="calendar-section">
                    <div className="calendar-container">
                        {/* Top Trigger Bar */}
                        <div
                            className="calendar-trigger"
                            onClick={() => setCalendarOpen(!isCalendarOpen)}
                        >
                            <div className="trigger-icon">
                                <Calendar size={20} />
                            </div>
                            <div className="trigger-content">
                                <span className="trigger-label">Select a day</span>
                                <span className="trigger-date">27.09.2021</span>
                            </div>
                            <div className="trigger-arrow">
                                {isCalendarOpen ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                )}
                            </div>
                        </div>

                        {/* Calendar Card Dropdown */}
                        {isCalendarOpen && (
                            <div className="calendar-widget-card">
                                <div className="widget-header">
                                    <h3>July 2019</h3>
                                    <div className="widget-nav">
                                        <button className="nav-icon-btn">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        </button>
                                        <button className="nav-icon-btn">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="widget-weekdays">
                                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                                </div>

                                <div className="widget-grid">
                                    {/* Week 1 */}
                                    <span className="day-text muted">1</span>
                                    <span className="day-text muted">2</span>
                                    <span className="day-text muted">3</span>
                                    <span className="day-text muted">4</span>
                                    <span className="day-text muted">5</span>
                                    <span className="day-text muted">6</span>
                                    <span className="day-text muted">7</span>

                                    {/* Week 2 */}
                                    <span className="day-text muted">8</span>
                                    <span className="day-text muted">9</span>
                                    <span className="day-text muted">10</span>
                                    <span className="day-text muted">11</span>
                                    <span className="day-text muted">12</span>
                                    <span className="day-text muted">13</span>
                                    <span className="day-text muted">14</span>

                                    {/* Week 3 */}
                                    <span className="day-text muted">15</span>
                                    <span className="day-text muted">16</span>
                                    <span className="day-text muted">17</span>
                                    <span className="day-text muted">18</span>
                                    <span className="day-text muted">19</span>
                                    <span className="day-text muted">20</span>
                                    <span className="day-text muted">21</span>

                                    {/* Week 4 - Active Selection */}
                                    <span className="day-text font-bold text-dark">22</span>
                                    <span className="day-text font-bold text-dark">23</span>
                                    <span className="day-text font-bold text-dark">24</span>
                                    <span className="day-text font-bold text-dark">25</span>
                                    <span className="day-text active-light">26</span>
                                    <span className="day-text active-solid">27</span>
                                    <span className="day-text font-bold text-dark">28</span>

                                    <span className="day-text font-bold text-dark">29</span>
                                    <span className="day-text font-bold text-dark">30</span>
                                </div>

                                <div className="widget-actions">
                                    <button className="btn-remove" onClick={() => setCalendarOpen(false)}>Remove</button>
                                    <button className="btn-done" onClick={() => setCalendarOpen(false)}>Done</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .page-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                /* Layout */
                .content-wrapper { padding-top: 1.5rem; max-width: 1600px; margin: 0 auto; padding-left: 2rem; padding-right: 2rem; }
                .flex-row-layout { display: flex; gap: 3rem; flex-wrap: wrap; align-items: flex-start; }
                
                @media (min-width: 1200px) {
                    .flex-row-layout { flex-wrap: nowrap; }
                }

                /* Tiles Section */
                .tiles-section {
                    flex: 1;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                    align-content: start;
                }

                .tile-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 180px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .tile-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border-color: #3B82F6 !important; }
                
                .tile-icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                
                .bg-color-blue-50 { background-color: #EFF6FF; }
                .bg-color-green-50 { background-color: #F0FDF4; }
                .bg-color-red-50 { background-color: #FEF2F2; }
                .bg-color-purple-50 { background-color: #FAF5FF; }
                .bg-color-emerald-50 { background-color: #ECFDF5; }
                .bg-color-orange-50 { background-color: #FFF7ED; }
                .bg-color-indigo-50 { background-color: #EEF2FF; }

                .text-blue-600 { color: #2563EB; }
                .text-green-600 { color: #16A34A; }
                .text-red-600 { color: #DC2626; }
                .text-purple-600 { color: #9333EA; }
                .text-emerald-600 { color: #059669; }
                .text-orange-600 { color: #EA580C; }
                .text-indigo-600 { color: #4F46E5; }

                .tile-title { font-size: 1.1rem; font-weight: 600; color: #1E293B; margin-bottom: 0.25rem; }
                .tile-desc { font-size: 0.9rem; color: #64748B; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .tile-footer-link { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #94A3B8; margin-top: 1rem; }
                .tile-card:hover .tile-footer-link { color: #2563EB; }

                /* Reformatted Calendar Section */
                .calendar-section { width: 100%; margin-top: 0; }
                @media (min-width: 1200px) { .calendar-section { width: 340px; flex-shrink: 0; margin-top: -10px; } }

                .calendar-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                /* Trigger Bar */
                .calendar-trigger {
                    background: white;
                    border: 2px solid #3B82F6; /* Blue border as shown */
                    border-radius: 16px;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
                }
                
                .trigger-icon { color: #94A3B8; display: flex; }
                
                .trigger-content { flex: 1; display: flex; flex-direction: column; }
                .trigger-label { color: #3B82F6; font-size: 0.8rem; font-weight: 600; }
                .trigger-date { color: #1E293B; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.02em; }
                
                .trigger-arrow { color: #64748B; }

                /* Widget Card */
                .calendar-widget-card {
                    background: white;
                    border-radius: 24px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1);
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .widget-header h3 { font-size: 1.25rem; font-weight: 700; margin: 0; color: #0F172A; }
                
                .widget-nav { display: flex; gap: 1rem; }
                .nav-icon-btn { border: none; background: transparent; cursor: pointer; color: #1E293B; padding: 4px; transition: color 0.2s; }
                .nav-icon-btn:hover { color: #3B82F6; }

                .widget-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    margin-bottom: 1rem;
                    text-align: center;
                }
                .widget-weekdays span { font-weight: 700; font-size: 0.85rem; color: #1E293B; }

                .widget-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    row-gap: 1.25rem; /* More spacing vertically */
                    column-gap: 0.25rem;
                    margin-bottom: 2rem;
                    place-items: center;
                }

                .day-text {
                    font-size: 0.95rem;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .day-text.muted { color: #94A3B8; font-weight: 400; }
                .day-text.text-dark { color: #334155; }
                
                .day-text.active-light {
                    color: #3B82F6;
                    background: #EFF6FF; /* Light blue bg */
                    font-weight: 600;
                }

                .day-text.active-solid {
                    background: #2563EB; /* Solid blue */
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
                }

                .widget-actions {
                    display: flex;
                    gap: 1rem;
                }
                
                .btn-remove {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 99px;
                    border: none;
                    background: #94A3B8; /* Grey */
                    color: white;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .btn-remove:hover { opacity: 0.9; }

                .btn-done {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 99px;
                    border: none;
                    background: #2563EB; /* Blue */
                    color: white;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                }
                .btn-done:hover { transform: translateY(-1px); }

                /* Budget Chart Custom Tile */
                .budget-chart-card {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    min-height: 240px; /* Slightly taller for chart */
                }
                .budget-chart-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border-color: #3B82F6; }

                .chart-header { margin-bottom: 1.5rem; }
                .chart-title { font-size: 1.1rem; font-weight: 700; color: #1E293B; margin: 0; }
                .chart-subtitle { font-size: 0.85rem; color: #94A3B8; margin-top: 0.25rem; }

                .chart-area {
                    flex: 1;
                    display: flex;
                    gap: 0.75rem;
                }

                .chart-y-axis {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-bottom: 24px; /* Align with bars bottom */
                    font-size: 0.75rem;
                    color: #CBD5E1;
                    font-weight: 500;
                    text-align: right;
                }

                .chart-bars-container {
                    flex: 1;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding-top: 10px; /* Space for tooltip overlap */
                }

                .goal-line {
                    position: absolute;
                    top: 45%; /* Approx goal level */
                    left: 0;
                    right: 0;
                    border-top: 2px solid #6366F1; /* Indigo line */
                    z-index: 10;
                    pointer-events: none;
                }
                .goal-label {
                    position: absolute;
                    right: 0;
                    top: -18px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #6366F1;
                    text-transform: uppercase;
                }

                .chart-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                    width: 100%;
                }
                .chart-col.active-col {
                    background: linear-gradient(to bottom, transparent, #EFF6FF);
                    border-radius: 8px;
                    padding-top: 0; /* Keep relative layout */
                }

                .bar-wrapper {
                    height: 120px; /* Fixed chart height area */
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    position: relative;
                    z-index: 5;
                }

                .chart-bar {
                    width: 8px;
                    background: #6366F1; /* Indigo bars */
                    border-radius: 4px 4px 0 0;
                    transition: height 0.5s ease-out;
                }
                .active-col .chart-bar { background: #4F46E5; width: 10px; } /* Highlighted bar style */

                .day-label { font-size: 0.75rem; color: #94A3B8; font-weight: 500; }
                .day-label.text-dark { color: #1E293B; font-weight: 700; }

                /* Tooltip */
                .chart-tooltip {
                    position: absolute;
                    bottom: 110%; /* Above the bar */
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1E293B;
                    color: white;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    width: max-content;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    z-index: 20;
                    animation: fadeIn 0.3s;
                }
                .tooltip-row { font-size: 0.75rem; display: flex; gap: 0.5rem; justify-content: space-between; }
                .tooltip-arrow {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                    width: 8px;
                    height: 8px;
                    background: #1E293B;
                }
            `}</style>
        </div>
    );
};

export default FinancialPlan;
