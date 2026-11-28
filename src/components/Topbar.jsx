import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Wallet, BookOpen, Users, Bell, Briefcase, Check } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import '../App.css';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context';
import logoPng from '../assets/logo_new.png'; // Final branding

import { ProfileDropdown } from './ProfileDropdown';
import SearchBox from './SearchBox';
import { pitchesService } from '../services/pitchesService';
import { caService } from '../services/caService';

const formatNotificationTime = (timestamp) => {
    if (!timestamp) return '';
    try {
        const d = new Date(timestamp);
        if (Number.isNaN(d.getTime())) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[d.getMonth()];
        const day = d.getDate();
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        const formattedHours = hours ? hours.toString().padStart(2, '0') : '12';
        return `${month} ${day} · ${formattedHours}:${minutes} ${ampm}`;
    } catch {
        return '';
    }
};

const Topbar = ({ onToggleSidebar, onToggleAudit, onToggleToolbar, isToolbarOpen, isSidebarOpen, onOpenCalculator }) => {
    const { logout, user, token: authToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);

    // Safely parse user.active_subscriptions if stored as JSON string
    const userSubs = React.useMemo(() => {
        if (!user?.active_subscriptions) return {};
        if (typeof user.active_subscriptions === 'string') {
            try {
                return JSON.parse(user.active_subscriptions);
            } catch {
                return {};
            }
        }
        return user.active_subscriptions;
    }, [user?.active_subscriptions]);

    const storedFinProPlan = userSubs?.fin_pro?.plan || user?.finpro_plan || user?.ca_plan;
    const isUserFinProActive = Boolean(
        storedFinProPlan ||
        userSubs?.fin_pro?.active === true ||
        userSubs?.fin_pro?.status === 'active' ||
        userSubs?.fin_pro?.status === 'ACTIVE'
    );

    // Read notification tracking with user-scoped persistence
    const userReadStorageKey = `cliks_read_notifications_${user?.id || user?._id || 'guest'}`;

    const [localReadIds, setLocalReadIds] = useState(() => {
        try {
            const saved = localStorage.getItem(`cliks_read_notifications_${user?.id || user?._id || 'guest'}`);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Keep localStorage in sync whenever user switches
    useEffect(() => {
        try {
            const saved = localStorage.getItem(userReadStorageKey);
            setLocalReadIds(saved ? JSON.parse(saved) : []);
        } catch {
            setLocalReadIds([]);
        }
    }, [userReadStorageKey]);

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

    const isNotificationRead = useCallback((notification) => {
        if (!notification) return false;
        if (notification.is_read || notification.read) return true;
        const id = notification.id ?? notification._id;
        return id != null && localReadIds.includes(String(id));
    }, [localReadIds]);

    const unreadNotificationCount = useMemo(() => {
        return notifications.filter(notification => !isNotificationRead(notification)).length;
    }, [notifications, isNotificationRead]);

    const [markingReadIds, setMarkingReadIds] = useState([]);

    const handleMarkAsRead = async (notification, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const id = notification.id ?? notification._id;
        if (id == null) return;
        const strId = String(id);
        if (isNotificationRead(notification) || markingReadIds.includes(strId)) return;

        setMarkingReadIds(prev => [...prev, strId]);

        // Optimistically update local read state and persistence
        setLocalReadIds(prev => {
            const next = Array.from(new Set([...prev, strId]));
            try {
                localStorage.setItem(userReadStorageKey, JSON.stringify(next));
            } catch {
                // Ignore storage write issues
            }
            return next;
        });

        // Also update React Query cache if available
        queryClient.setQueryData(['user-notifications'], (oldData) => {
            if (!Array.isArray(oldData)) return oldData;
            return oldData.map(item => {
                const itemId = item.id ?? item._id;
                if (String(itemId) === strId) {
                    return { ...item, is_read: true, read: true };
                }
                return item;
            });
        });

        // Call backend API if available
        try {
            if (typeof pitchesService.markNotificationRead === 'function') {
                await pitchesService.markNotificationRead(id);
            } else if (typeof caService.markNotificationRead === 'function') {
                await caService.markNotificationRead(id);
            }
        } catch {
            // Keep local persistence intact so UI stays responsive and consistent
        } finally {
            setMarkingReadIds(prev => prev.filter(item => item !== strId));
        }
    };

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

    // Auth token and query enablement
    const token = typeof window !== 'undefined'
        ? (localStorage.getItem('books_auth_token') || localStorage.getItem('bnx_auth_token') || authToken)
        : authToken;
    const isQueryEnabled = Boolean(user || token);

    // ICAI Verification / FIN-PRO Status Query
    const { data: icaiVerification } = useQuery({
        queryKey: ['icaiVerification'],
        queryFn: async () => {
            try {
                return await caService.getIcaiVerification();
            } catch (e) {
                return null;
            }
        },
        enabled: isQueryEnabled,
        staleTime: 30000,
        refetchInterval: (query) => {
            // Once verified, avoid polling; otherwise poll every 15s to detect admin approval in real-time
            const status = query.state.data?.status;
            return status === 'VERIFIED' ? false : 15000;
        },
        refetchOnWindowFocus: true
    });

    // Explicit FIN-PRO subscription query from backend API
    const { data: finproSubData } = useQuery({
        queryKey: ['finproSubscription'],
        queryFn: async () => {
            try {
                return await caService.getFinproSubscription();
            } catch (e) {
                return null;
            }
        },
        enabled: isQueryEnabled,
        staleTime: 30000,
        refetchOnWindowFocus: true
    });

    const icaiPayload = icaiVerification?.data || icaiVerification;
    const finproPayload = finproSubData?.data || finproSubData;

    const isFinProVerified = React.useMemo(() => {
        const vStatus = String(icaiPayload?.status || user?.ca_verification_status || '').toUpperCase();
        const isVer =
            icaiPayload?.isVerified === true ||
            user?.is_finpro_verified === true ||
            user?.is_ca === 1 ||
            user?.is_ca === true ||
            user?.role === 'ca';
        return vStatus === 'VERIFIED' || isVer;
    }, [icaiPayload, user]);

    const isFinProSubActive = React.useMemo(() => {
        const hasIcaiSub = Boolean(
            icaiPayload?.isSubscribed === true ||
            icaiPayload?.subscription?.status === 'ACTIVE' ||
            icaiPayload?.subscription?.status === 'active' ||
            icaiPayload?.subscription?.plan_name ||
            icaiPayload?.plan ||
            icaiPayload?.active_plan
        );
        const hasFinproApiSub = Boolean(
            finproPayload?.active === true ||
            finproPayload?.subscription?.status === 'ACTIVE' ||
            finproPayload?.subscription?.status === 'active' ||
            finproPayload?.subscription?.plan_name
        );
        return isUserFinProActive || hasIcaiSub || hasFinproApiSub;
    }, [isUserFinProActive, icaiPayload, finproPayload]);

    const [hasActiveFinPro, setHasActiveFinPro] = useState(isFinProSubActive);

    useEffect(() => {
        setHasActiveFinPro(isFinProSubActive);
    }, [isFinProSubActive]);

    useEffect(() => {
        const handleFinProActivation = () => {
            if (user) {
                setHasActiveFinPro(true);
                queryClient.invalidateQueries({ queryKey: ['icaiVerification'] });
                queryClient.invalidateQueries({ queryKey: ['finproSubscription'] });
                queryClient.invalidateQueries({ queryKey: ['icaiVerificationStatus'] });
            }
        };
        window.addEventListener('finpro:subscription-activated', handleFinProActivation);
        return () => window.removeEventListener('finpro:subscription-activated', handleFinProActivation);
    }, [user, queryClient]);

    const hasFinProCached = typeof window !== 'undefined' && localStorage.getItem('cliks_finpro_verified') === 'true';

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isFinProVerified || isFinProSubActive || hasActiveFinPro) {
            localStorage.setItem('cliks_finpro_verified', 'true');
        } else {
            localStorage.removeItem('cliks_finpro_verified');
        }
    }, [isFinProVerified, isFinProSubActive, hasActiveFinPro]);

    const showFinProBadge = React.useMemo(() => {
        return Boolean(user) && (
            isFinProVerified ||
            isFinProSubActive ||
            hasActiveFinPro ||
            hasFinProCached
        );
    }, [user, isFinProVerified, isFinProSubActive, hasActiveFinPro, hasFinProCached]);

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
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    title="Toggle Sidebar"
                >
                    <div className="brand-logo-small" style={{ backgroundColor: 'var(--accent-tint)', padding: '2px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                        <img src={logoPng} alt="CLIKS Logo" style={{ height: '75%', width: '75%', objectFit: 'contain' }} />
                    </div>
                    <span className="topbar-brand-text" style={{ color: '#ffffff', fontSize: '1.042rem', fontWeight: '700', letterSpacing: '0.4px' }}>
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
            <div className={`top-nav-links ${isNavOpen ? 'active' : ''}`}>
                <div className="top-nav-lamp-container" data-tour="topbar-workspaces">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = item.name === 'Payments'
                            ? (location.pathname.startsWith('/finance') || location.pathname.startsWith('/payments') || location.pathname === '/')
                            : (item.name === 'Books'
                                ? (location.pathname.startsWith('/books') || location.pathname.startsWith('/ca') || location.pathname.startsWith('/customization'))
                                : (item.activeBase
                                    ? (location.pathname.startsWith(item.activeBase) || (item.name === 'Social' && location.pathname.startsWith('/public')))
                                    : (item.url ? (location.pathname === item.url || (item.url !== '/home' && location.pathname.startsWith(item.url))) : false)));

                        return (
                            <NavLink
                                key={item.name}
                                to={item.url}
                                aria-label={item.name}
                                data-tour={`topbar-nav-${item.name.toLowerCase()}`}
                                className={({ isActive }) => `top-nav-link ${isActive || isItemActive ? 'active' : ''}`}
                                style={({ isActive }) => {
                                    const active = isActive || isItemActive;
                                    return {
                                        background: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                        color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
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
            <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.589rem', paddingRight: '0px' }}>

                {/* Search bar — global search */}
                <SearchBox onOpenCalculator={onOpenCalculator} />

                {/* Notifications */}
                <div ref={notificationsRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                        type="button"
                        data-tour="topbar-notifications"
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
                                    border: '2px solid var(--accent-topbar)',
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
                            className="topbar-notifications-dropdown"
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                right: 0,
                                width: '380px',
                                maxWidth: 'calc(100vw - 24px)',
                                maxHeight: 'min(75vh, 520px)',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'var(--bg-card, #FFFFFF)',
                                color: 'var(--text-primary, #0F172A)',
                                border: '1px solid var(--border-color, #E2E8F0)',
                                borderRadius: '16px',
                                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.16)',
                                zIndex: 100,
                                overflow: 'hidden'
                            }}
                        >
                            <div data-tour="notification-panel-heading" style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--border-color, #E2E8F0)',
                                fontWeight: 750,
                                fontSize: '16px',
                                color: 'var(--text-primary, #0F172A)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'var(--bg-card, #FFFFFF)'
                            }}>
                                <span>Notifications</span>
                                {unreadNotificationCount > 0 && (
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#2563EB',
                                        background: '#EFF6FF',
                                        padding: '2px 8px',
                                        borderRadius: '999px'
                                    }}>
                                        {unreadNotificationCount} unread
                                    </span>
                                )}
                            </div>
                            <div style={{
                                padding: '14px 16px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                maxHeight: 'min(60vh, 440px)'
                            }}>
                                {!user ? (
                                    <p style={{ margin: 0, padding: '18px 0', color: 'var(--text-secondary, #64748B)', fontSize: '14px', textAlign: 'center' }}>
                                        Sign in to view notifications.
                                    </p>
                                ) : areNotificationsLoading ? (
                                    <p role="status" style={{ margin: 0, padding: '18px 0', color: 'var(--text-secondary, #64748B)', fontSize: '14px', textAlign: 'center' }}>
                                        Loading notifications...
                                    </p>
                                ) : notificationsFailed ? (
                                    <div style={{ padding: '12px 0', textAlign: 'center' }}>
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
                                    <p style={{ margin: 0, padding: '24px 0', color: 'var(--text-secondary, #64748B)', fontSize: '14px', textAlign: 'center' }}>
                                        You’re all caught up.
                                    </p>
                                ) : (
                                    notifications.map((notification, index) => {
                                        const message = [notification.message, notification.title, notification.content]
                                            .find(value => typeof value === 'string' && value.trim())
                                            || 'New notification';
                                        const read = isNotificationRead(notification);
                                        const timeStr = formatNotificationTime(
                                            notification.created_at ||
                                            notification.createdAt ||
                                            notification.timestamp ||
                                            notification.date
                                        );
                                        const notifId = notification.id ?? notification._id ?? index;
                                        const isMarking = markingReadIds.includes(String(notifId));

                                        return (
                                            <div
                                                key={notifId}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    padding: '14px 16px',
                                                    background: 'var(--bg-card, #FFFFFF)',
                                                    border: read
                                                        ? '1px solid var(--border-color, #E2E8F0)'
                                                        : '1px solid rgba(37, 99, 235, 0.25)',
                                                    borderRadius: '12px',
                                                    boxShadow: read
                                                        ? 'none'
                                                        : '0 2px 8px rgba(37, 99, 235, 0.04)',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {/* Notification Message */}
                                                <div style={{
                                                    fontSize: '13.5px',
                                                    fontWeight: 500,
                                                    lineHeight: 1.45,
                                                    color: 'var(--text-primary, #1E293B)',
                                                    marginBottom: '10px',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    {message}
                                                </div>

                                                {/* Date & Time + Mark as read Action */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '12px',
                                                    marginTop: 'auto'
                                                }}>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        color: 'var(--text-secondary, #64748B)'
                                                    }}>
                                                        {timeStr}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={read || isMarking}
                                                        onClick={(e) => handleMarkAsRead(notification, e)}
                                                        title={read ? 'Already read' : 'Mark as read'}
                                                        aria-label={read ? 'Read' : 'Mark as read'}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            padding: '2px 4px',
                                                            fontSize: '12.5px',
                                                            fontWeight: 600,
                                                            cursor: read ? 'default' : 'pointer',
                                                            color: read ? '#94A3B8' : '#2563EB',
                                                            transition: 'color 0.15s ease',
                                                            outline: 'none',
                                                            opacity: isMarking ? 0.6 : 1
                                                        }}
                                                    >
                                                        <Check size={14} color={read ? '#94A3B8' : '#2563EB'} strokeWidth={2.5} />
                                                        <span>{read ? 'Read' : 'Mark as read'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* FIN-PRO Badge (Displayed for eligible / ICAI-verified FIN-PRO members) */}
                {showFinProBadge && (
                    <button
                        onClick={() => handleNavigation('/ca')}
                        title="FIN-PRO Audit & Practice Hub"
                        className="topbar-finpro-btn"
                        data-tour="topbar-finpro"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            height: '36px',
                            borderRadius: '999px',
                            backgroundColor: location.pathname.startsWith('/ca') ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                            border: location.pathname.startsWith('/ca') ? '1.5px solid #60A5FA' : '1px solid rgba(255, 255, 255, 0.25)',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: '750',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            whiteSpace: 'nowrap',
                            boxShadow: location.pathname.startsWith('/ca') ? '0 0 14px rgba(96, 165, 250, 0.45)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = location.pathname.startsWith('/ca') ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Briefcase size={16} color={location.pathname.startsWith('/ca') ? '#93C5FD' : '#FFFFFF'} style={{ flexShrink: 0 }} />
                        <span className="topbar-finpro-text">FIN-PRO</span>
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
                        data-tour="topbar-toolbar-toggle"
                        onClick={(e) => {
                            window.dispatchEvent(new CustomEvent('cliks:bit-toggle-click'));
                            if (onToggleToolbar) onToggleToolbar(e);
                        }}
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
