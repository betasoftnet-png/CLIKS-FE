import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../App.css';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`app-root ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Topbar onToggleSidebar={toggleSidebar} />
            <div className="app-body">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="main-content-area">
                    <div className="content-scrollable">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
