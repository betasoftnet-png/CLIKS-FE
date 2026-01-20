import React, { useState } from 'react';
import { User, QrCode, Wallet } from 'lucide-react';
import '../App.css';

import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeMenu();
    }

    return (
        <header className="topbar">
            {/* Left: Branding / App Switcher */}
            <div className="topbar-left">
                <div
                    className="logo-area"
                    onClick={onToggleSidebar}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    title="Toggle Sidebar"
                >
                    <div className="brand-logo-small">
                        <Wallet size={18} color="white" />
                    </div>
                    <span style={{ color: '#195BAC', fontSize: '1.25rem', fontWeight: '700' }}>
                        Books & Finance
                    </span>
                </div>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
                className={`hamburger ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Center: Navigation */}
            <nav className={`top-nav-links ${isOpen ? 'active' : ''}`}>
                <button
                    className={`nav-link ${isActive('/home')}`}
                    onClick={() => handleNavigation('/home')}
                >
                    Home
                </button>
                <button
                    className={`nav-link ${isActive('/books')}`}
                    onClick={() => handleNavigation('/books')}
                >
                    Books
                </button>
                <button
                    className={`nav-link ${isActive('/finance')}`}
                    onClick={() => handleNavigation('/finance')}
                >
                    Finance
                </button>
                <button
                    className={`nav-link ${isActive('/public')}`}
                    onClick={() => handleNavigation('/public')}
                >
                    Social & Public
                </button>
            </nav>

            {/* Right: Actions & Profile */}
            <div className="topbar-right">
                <button className="icon-btn" title="Scan QR">
                    <QrCode size={20} />
                </button>

                <div
                    className="user-profile topbar-profile"
                    onClick={() => handleNavigation('/books/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="avatar">
                        <User size={18} />
                    </div>
                    <span className="username">Aditya .s</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
