import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Calculator,
    Contact,
    Keyboard,
    StickyNote,
    CloudSun,
    Edit,
    Sliders,
    Check,
    Plus,
    X,
    Command
} from 'lucide-react';
import { CalcPopover } from './common/CalcPopover';
import ContactPanel from './ContactPanel';
import NotesPanel from './NotesPanel';
import CalendarPanel from './CalendarPanel';
import WeatherPanel from './WeatherPanel';
import ProductLauncher from './ProductLauncher';

/* ─── Docked Panel Wrapper (Header with title and close button) ─── */
const DockedPanelWrapper = ({ title, onClose, children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Header */}
            <div style={{
                height: '52px',
                padding: '0 1rem',
                borderBottom: '1px solid #99DBC3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
                flexShrink: 0
            }}>
                <span style={{ fontWeight: '750', fontSize: '0.85rem', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </span>
                <button
                    onClick={onClose}
                    style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <X size={16} />
                </button>
            </div>
            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {children}
            </div>
        </div>
    );
};

/* ─── Inline Calculator Panel ─────────────────────────────────────── */
const CalcPanel = ({ onClose }) => {
    return (
        <div className="calc-panel" style={{ position: 'relative', top: 0, right: 0, width: '100%', height: '100%', border: 'none' }}>
            <CalcPopover autoOpen onPanelClose={onClose} />
        </div>
    );
};

/* ─── Right Sidebar (Matching cliks-bus-fe) ────────────────────────── */
const RightSidebar = ({
    isVisible = false,
    isCalcOpen = false,
    onCalcToggle,
    onCalcClose,
    onToolbarClose,
    isLauncherOpen = false,
    onLauncherToggle,
    onLauncherClose,
    isContactOpen = false,
    onContactToggle,
    onContactClose,
    isNotesOpen = false,
    onNotesToggle,
    onNotesClose,
    isCalendarOpen = false,
    onCalendarToggle,
    onCalendarClose
}) => {
    const navigate = useNavigate();

    // Pinned tools persistence
    const [pinnedTools, setPinnedTools] = useState(() => {
        const saved = localStorage.getItem('cliks_pinned_tools');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return ['Calendar', 'Calculator', 'Contact', 'Notes'];
    });

    const [isEditingAccess, setIsEditingAccess] = useState(false);
    const [internalPanel, setInternalPanel] = useState(null);

    // Sync active panel between parent props and internal selection
    const activePanel = isLauncherOpen
        ? 'Beta Products'
        : (isCalcOpen
            ? 'Calculator'
            : (isContactOpen
                ? 'Contact'
                : (isNotesOpen
                    ? 'Notes'
                    : (isCalendarOpen
                        ? 'Calendar'
                        : internalPanel))));

    const closeAllPanels = () => {
        setInternalPanel(null);
        if (onCalcClose) onCalcClose();
        if (onLauncherClose) onLauncherClose();
        if (onContactClose) onContactClose();
        if (onNotesClose) onNotesClose();
        if (onCalendarClose) onCalendarClose();
    };

    useEffect(() => {
        localStorage.setItem('cliks_pinned_tools', JSON.stringify(pinnedTools));
    }, [pinnedTools]);

    // Close panels when toolbar is hidden
    useEffect(() => {
        if (!isVisible) {
            closeAllPanels();
        }
    }, [isVisible]);

    // Escape key closes open drawer panel
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape' && activePanel) {
                closeAllPanels();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [activePanel]);

    const handleToolClick = (toolName) => {
        if (activePanel === toolName) {
            closeAllPanels();
            return;
        }

        // Close other panels first
        closeAllPanels();

        if (toolName === 'Calculator') {
            if (onCalcToggle) onCalcToggle();
            else setInternalPanel('Calculator');
        } else if (toolName === 'Beta Products') {
            if (onLauncherToggle) onLauncherToggle();
            else setInternalPanel('Beta Products');
        } else if (toolName === 'Contact') {
            if (onContactToggle) onContactToggle();
            else setInternalPanel('Contact');
        } else if (toolName === 'Notes') {
            if (onNotesToggle) onNotesToggle();
            else setInternalPanel('Notes');
        } else if (toolName === 'Calendar') {
            if (onCalendarToggle) onCalendarToggle();
            else setInternalPanel('Calendar');
        } else {
            setInternalPanel(toolName);
        }
    };

    const allAvailableTools = [
        { name: 'Calendar', icon: Calendar, color: '#F59E0B', bg: '#FEF3C7', action: () => handleToolClick('Calendar') },
        { name: 'Calculator', icon: Calculator, color: '#10B981', bg: '#ECFDF5', action: () => handleToolClick('Calculator') },
        { name: 'Contact', icon: Contact, color: '#3B82F6', bg: '#EFF6FF', action: () => handleToolClick('Contact') },
        { name: 'Keyboard', icon: Keyboard, color: '#8B5CF6', bg: '#F5F3FF', action: () => handleToolClick('Keyboard') },
        { name: 'Notes', icon: StickyNote, color: '#EC4899', bg: '#FDF2F8', action: () => handleToolClick('Notes') },
        { name: 'Weather', icon: CloudSun, color: '#06B6D4', bg: '#ECFEFF', action: () => handleToolClick('Weather') }
    ];

    const toggleToolPin = (toolName) => {
        setPinnedTools(prev => {
            if (prev.includes(toolName)) {
                if (prev.length === 1) return prev; // Keep at least one tool
                return prev.filter(name => name !== toolName);
            } else {
                return [...prev, toolName];
            }
        });
    };

    const isLauncherActive = activePanel === 'Beta Products';

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Fixed Right Toolbar (64px) */}
                    <motion.div
                        key="right-toolbar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                        style={{
                            position: 'fixed',
                            top: '64px',
                            right: 0,
                            height: 'calc(100vh - 64px)',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2005,
                            width: '64px',
                            fontFamily: "'Inter', sans-serif",
                            borderLeft: '1px solid #99DBC3'
                        }}
                    >
                        {/* Toolbar Body Container */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '20px',
                            paddingTop: '8px'
                        }}>
                            {/* Scrollable Tool List */}
                            <div className="access-tools-scroll" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                flex: 1,
                                overflowY: 'auto',
                                width: '100%',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none'
                            }}>
                                <style>{`
                                    .access-tools-scroll::-webkit-scrollbar { display: none; }
                                `}</style>

                                {/* Blue B Logo Button */}
                                <button
                                    onClick={() => handleToolClick('Beta Products')}
                                    title="Beta Products Launcher"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        backgroundColor: isLauncherActive ? '#DCF2E4' : '#FFFFFF',
                                        border: isLauncherActive ? '1.5px solid #1B6B3A' : '1.5px solid #CBD5E1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        outline: 'none',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.borderColor = isLauncherActive ? '#1B6B3A' : '#94A3B8';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.borderColor = isLauncherActive ? '#1B6B3A' : '#CBD5E1';
                                    }}
                                >
                                    <img src="/beta_logo.png" alt="Beta Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                                </button>

                                {/* Horizontal Separator */}
                                <div style={{ width: '38px', height: '1px', backgroundColor: '#E2E8F0', margin: '-4px 0', opacity: 0.8, flexShrink: 0 }} />

                                {/* Dynamic Tools List */}
                                {isEditingAccess ? (
                                    <>
                                        <div style={{ fontSize: '9px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', textAlign: 'center' }}>
                                            Edit Pins
                                        </div>
                                        {allAvailableTools.map((tool, idx) => {
                                            const Icon = tool.icon;
                                            const isPinned = pinnedTools.includes(tool.name);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => toggleToolPin(tool.name)}
                                                    title={`${isPinned ? 'Unpin' : 'Pin'} ${tool.name}`}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '12px',
                                                        backgroundColor: isPinned ? tool.bg : '#F8FAFC',
                                                        border: isPinned ? `2px solid ${tool.color}` : '1.5px dashed #CBD5E1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: isPinned ? tool.color : '#94A3B8',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        outline: 'none',
                                                        flexShrink: 0,
                                                        position: 'relative',
                                                        opacity: isPinned ? 1 : 0.6
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                                >
                                                    <Icon size={18} />
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setIsEditingAccess(false)}
                                            title="Done Editing"
                                            style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '12px',
                                                backgroundColor: '#10B981',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#FFFFFF',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                outline: 'none',
                                                flexShrink: 0,
                                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                                                marginTop: '4px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <Check size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {allAvailableTools.filter(t => pinnedTools.includes(t.name)).map((tool, idx) => {
                                            const Icon = tool.icon;
                                            const isActive = activePanel === tool.name;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={tool.action}
                                                    title={tool.name}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '12px',
                                                        backgroundColor: isActive ? '#DCF2E4' : tool.bg,
                                                        border: isActive ? `2px solid ${tool.color}` : 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: tool.color,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        outline: 'none',
                                                        flexShrink: 0
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                                >
                                                    <Icon size={18} />
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setIsEditingAccess(true)}
                                            title="Add/Edit Icons"
                                            style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '12px',
                                                backgroundColor: 'transparent',
                                                border: '1.5px dashed #CBD5E1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#94a3b8',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                outline: 'none',
                                                flexShrink: 0
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Bottom Area: Edit & Settings */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                paddingTop: '16px',
                                width: '100%',
                                flexShrink: 0
                            }}>
                                {/* Horizontal Separator */}
                                <div style={{ width: '24px', height: '1px', backgroundColor: '#E2E8F0', margin: '0 0 4px 0', opacity: 0.8, flexShrink: 0 }} />

                                <button
                                    onClick={() => setIsEditingAccess(!isEditingAccess)}
                                    title="Edit Access Kit"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748B',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => navigate('/books/settings')}
                                    title="Settings / Customization"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748B',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        outline: 'none'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Sliders size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Docked Drawer Panel (Slides in to the left of the 64px toolbar) */}
                    {activePanel && (
                        <motion.div
                            key="docked-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            style={{
                                position: 'fixed',
                                top: '64px',
                                right: '64px',
                                height: 'calc(100vh - 64px)',
                                width: '400px',
                                maxWidth: 'calc(100vw - 64px)',
                                backgroundColor: '#FFFFFF',
                                borderLeft: '1px solid #99DBC3',
                                boxShadow: '-6px 0 25px rgba(0, 0, 0, 0.08)',
                                zIndex: 2004,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}
                        >
                            {activePanel === 'Calculator' && (
                                <CalcPanel onClose={closeAllPanels} />
                            )}
                            {activePanel === 'Beta Products' && (
                                <ProductLauncher onClose={closeAllPanels} />
                            )}
                            {activePanel === 'Calendar' && (
                                <DockedPanelWrapper title="Calendar" onClose={closeAllPanels}>
                                    <CalendarPanel />
                                </DockedPanelWrapper>
                            )}
                            {activePanel === 'Contact' && (
                                <DockedPanelWrapper title="Global Contacts" onClose={closeAllPanels}>
                                    <ContactPanel onClose={closeAllPanels} />
                                </DockedPanelWrapper>
                            )}
                            {activePanel === 'Notes' && (
                                <DockedPanelWrapper title="Notes" onClose={closeAllPanels}>
                                    <NotesPanel onClose={closeAllPanels} />
                                </DockedPanelWrapper>
                            )}
                            {activePanel === 'Weather' && (
                                <DockedPanelWrapper title="Weather" onClose={closeAllPanels}>
                                    <WeatherPanel />
                                </DockedPanelWrapper>
                            )}
                            {activePanel === 'Keyboard' && (
                                <DockedPanelWrapper title="Keyboard Shortcuts" onClose={closeAllPanels}>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B6B3A', fontWeight: '800', fontSize: '0.95rem' }}>
                                            <Command size={18} /> Quick Navigation Shortcuts
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                            {[
                                                { key: 'Esc', desc: 'Close any open drawer or popover' },
                                                { key: 'Enter', desc: 'Confirm modal or dialog action' },
                                                { key: 'Tab', desc: 'Cycle through inputs and buttons' },
                                                { key: 'Ctrl / Cmd + K', desc: 'Open global search focus' }
                                            ].map((sc, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                                    <span style={{ color: '#475569', fontWeight: '500' }}>{sc.desc}</span>
                                                    <kbd style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.75rem', color: '#1E293B', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{sc.key}</kbd>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </DockedPanelWrapper>
                            )}
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default RightSidebar;
