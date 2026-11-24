import React, { useState, useEffect, useRef } from 'react';
import AuditorSidebar from '../components/AuditorSidebar';
import Topbar from '../components/Topbar';
import '../App.css';

const AuditorLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const wasMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            if (wasMobileRef.current && !isMobile) {
                setIsSidebarOpen(true);
            }
            wasMobileRef.current = isMobile;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`app-root select-none ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="app-body">
                <AuditorSidebar isOpen={isSidebarOpen} />
                <div className="main-content-area">
                    <div className="content-scrollable" style={{ padding: '2rem' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditorLayout;
