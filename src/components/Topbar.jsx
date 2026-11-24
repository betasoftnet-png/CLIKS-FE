import React, { useState, useEffect, useRef } from 'react';
import { Wallet, BookOpen, Users, Bell, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import '../App.css';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context';
import logoPng from '../assets/logo_new.png'; // Final branding

import { ProfileDropdown } from './ProfileDropdown';
import SearchBox from './SearchBox';
import { pitchesService } from '../services/pitchesService';

const Topbar = ({ onToggleSidebar, onToggleAudit, onToggleToolbar, isToolbarOpen, isSidebarOpen, onOpenCalculator }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const storedFinProPlan = user?.active_subscriptions?.fin_pro?.plan || user?.finpro_plan;
    const [hasActiveFinPro, setHasActiveFinPro] = useState(Boolean(storedFinProPlan));
    const notificationsRef = useRef(null);

    useEffect(() => {
        setHasActiveFinPro(Boolean(storedFinProPlan));
    }, [user, storedFinProPlan]);

    useEffect(() => {
        const handleFinProActivation = () => {
            if (user) setHasActiveFinPro(true);
        };
        window.addEventListener('finpro:subscription-activated', handleFinProActivation);
        return () => window.removeEventListener('finpro:subscription-activated', handleFinProActivation);
    }, [user]);

    const {
        data: notifications = [],
        isLoading: areNotificationsLoading,
        isError: notificationsFailed,
        refetch: refetchNotifications
    } = useQuery({
        queryKey: ['user-notifications'],
        queryFn: async () => {
            const result = await pitchesService.getNotifications();
            if (!Array.isArray(result)) {
                throw new Error('Unexpected notifications response');
            }
            return result;
        },
        enabled: !!user,
        staleTime: 30_000
    });

    const unreadNotificationCount = notifications.filter(notification => !notification.is_read).length;

    useEffect(() => {
        if (!isNotificationsOpen) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!notificationsRef.current?.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsNotificationsOpen(false);
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isNotificationsOpen]);

    const toggleMenu = () => {
        setIsNavOpen(prev => !prev);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsNavOpen(false);
    };

    const handleHamburgerClick = () => {
        if (onToggleSidebar) {
            onToggleSidebar();
            return;
        }
        toggleMenu();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Books', url: '/books/dashboard', icon: BookOpen, activeBase: '/books' },
        { name: 'Payments', url: '/payments/people', icon: Wallet, activeBase: '/payments' },
        { name: 'Social', url: '/social', icon: Users, activeBase: '/social' },
    ];

    return (
        <header className="topbar" style={{ paddingRight: '14px' }}>
            {/* Left: Branding / App Switcher */}
            <div className="topbar-left">
                {/* ... existing logo code ... */}
                <div
                    className="logo-area"
                    onClick={onToggleSidebar}
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle Sidebar"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onToggleSidebar();
                        }
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    title="Toggle Sidebar"
                >
                    <div className="brand-logo-small" style={{ backgroundColor: '#f0fdf4', padding: '2px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <img src={logoPng} alt="CLIKS Logo" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                        CLIKS
                    </span>
                </div>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
                className={`hamburger ${(typeof isSidebarOpen === 'boolean' ? isSidebarOpen : isNavOpen) ? 'active' : ''}`}
                onClick={handleHamburgerClick}
                aria-label={typeof isSidebarOpen === 'boolean' ? 'Toggle sidebar' : 'Menu'}
                aria-expanded={typeof isSidebarOpen === 'boolean' ? isSidebarOpen : isNavOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Center: Navigation (New Lamp Style) */}
            <div className={`top-nav-links ${isNavOpen ? 'active' : ''}`} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = item.name === 'Payments'
                            ? (location.pathname.startsWith('/finance') || location.pathname.startsWith('/payments') || location.pathname === '/')
                            : (item.name === 'Books'
                                ? (location.pathname.startsWith('/books') || location.pathname.startsWith('/ca'))
                                : (item.activeBase
                                    ? (location.pathname.startsWith(item.activeBase) || (item.name === 'Social' && location.pathname.startsWith('/public')))
                                    : (item.url ? (location.pathname === item.url || (item.url !== '/home' && location.pathname.startsWith(item.url))) : false)));

                        return (
                            <NavLink
                                key={item.name}
                                to={item.url}
                                aria-label={item.name}
                                className={({ isActive }) => `top-nav-link ${isActive || isItemActive ? 'active' : ''}`}
                                style={({ isActive }) => {
                                    const active = isActive || isItemActive;
                                    return {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 20px',
                                        borderRadius: '999px',
                                        border: 'none',
                                        background: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                        color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    };
                                }}
                                onMouseEnter={(e) => {
                                    if (!isItemActive) e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isItemActive) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                                }}
                            >
                                <span className="hidden md:inline">{item.name}</span>
                                <span className="md:hidden">
                                    <Icon size={18} />
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Right Group */}
            <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingRight: '0px' }}>

                {/* Search bar — global search */}
                <SearchBox onOpenCalculator={onOpenCalculator} />

                {/* Notifications */}
                <div ref={notificationsRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                        type="button"
                        onClick={() => setIsNotificationsOpen(open => !open)}
                        title="Notifications"
                        aria-label="Notifications"
                        aria-haspopup="dialog"
                        aria-expanded={isNotificationsOpen}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '44px',
                            height: '38px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <Bell size={18} />
                        {unreadNotificationCount > 0 && (
                            <span
                                aria-label={`${unreadNotificationCount} unread notifications`}
                                style={{
                                    position: 'absolute',
                                    top: '3px',
                                    right: '3px',
                                    minWidth: '16px',
                                    height: '16px',
                                    padding: '0 2px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#EF4444',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    border: '2px solid #135029',
                                }}
                            >
                                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div
                            role="dialog"
                            aria-label="Notifications"
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                right: 0,
                                width: '340px',
                                maxWidth: 'calc(100vw - 24px)',
                                maxHeight: 'min(60vh, 480px)',
                                overflowY: 'auto',
                                background: '#FFFFFF',
                                color: '#0F172A',
                                border: '1px solid #E2E8F0',
                                borderRadius: '14px',
                                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
                                zIndex: 100,
                            }}
                        >
                            <div style={{
                                padding: '14px 16px',
                                borderBottom: '1px solid #E2E8F0',
                                fontWeight: 700,
                                fontSize: '15px',
                            }}>
                                Notifications
                            </div>
                            {!user ? (
                                <p style={{ margin: 0, padding: '18px 16px', color: '#64748B', fontSize: '14px' }}>
                                    Sign in to view notifications.
                                </p>
                            ) : areNotificationsLoading ? (
                                <p role="status" style={{ margin: 0, padding: '18px 16px', color: '#64748B', fontSize: '14px' }}>
                                    Loading notifications...
                                </p>
                            ) : notificationsFailed ? (
                                <div style={{ padding: '16px' }}>
                                    <p role="alert" style={{ margin: '0 0 12px', color: '#B91C1C', fontSize: '14px' }}>
                                        Notifications couldn’t be loaded.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => refetchNotifications()}
                                        style={{
                                            border: 0,
                                            borderRadius: '8px',
                                            background: '#E8F5EC',
                                            color: '#135029',
                                            padding: '8px 12px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : notifications.length === 0 ? (
                                <p style={{ margin: 0, padding: '18px 16px', color: '#64748B', fontSize: '14px' }}>
                                    You’re all caught up.
                                </p>
                            ) : (
                                notifications.map((notification, index) => {
                                    const title = [notification.title, notification.message, notification.content]
                                        .find(value => typeof value === 'string' && value.trim())
                                        || 'New notification';
                                    return (
                                        <div
                                            key={notification.id ?? index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                padding: '13px 16px',
                                                borderBottom: index < notifications.length - 1 ? '1px solid #F1F5F9' : 'none',
                                            }}
                                        >
                                            {!notification.is_read && (
                                                <span
                                                    aria-label="Unread"
                                                    style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        marginTop: '5px',
                                                        flexShrink: 0,
                                                        borderRadius: '50%',
                                                        background: '#16A34A',
                                                    }}
                                                />
                                            )}
                                            <span style={{ fontSize: '14px', lineHeight: 1.45 }}>{title}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {hasActiveFinPro && (
                    <button
                        type="button"
                        aria-label="FIN-PRO"
                        title="Open FIN-PRO"
                        onClick={() => navigate('/ca')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            height: '38px',
                            padding: '0 14px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <Briefcase size={18} />
                        <span>FIN-PRO</span>
                    </button>
                )}

                {/* Profile dropdown */}
                <ProfileDropdown
                    onAccount={() => navigate('/books/profile')}
                    onSettings={() => navigate('/books/settings')}
                    onFAQ={() => navigate('/books/faq')}
                    onLogout={handleLogout}
                />

                {/* Sub-flexbox to align divider and sliders button exactly to the 72px right sidebar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: '4px' }}>
                    {/* Vertical divider */}
                    <div style={{
                        width: '1px',
                        height: '28px',
                        background: 'rgba(255,255,255,0.18)',
                        flexShrink: 0,
                    }} />

                    {/* Sliders / filter icon — far right, toggles the quick-access toolbar */}
                    <button
                        onClick={onToggleToolbar}
                        title={isToolbarOpen ? 'Close Toolbar' : 'Open Toolbar'}
                        aria-pressed={isToolbarOpen}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '11px',
                            backgroundColor: isToolbarOpen ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                            if (!isToolbarOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isToolbarOpen
                                ? 'rgba(255, 255, 255, 0.25)'
                                : 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <img src="/bit_tool.png" alt="" aria-hidden="true"
                            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
