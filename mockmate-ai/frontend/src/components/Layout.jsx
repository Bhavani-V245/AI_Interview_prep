import React from 'react';
import Sidebar from './Sidebar';
import GlobalChatbot from './GlobalChatbot';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebarPaths = ['/', '/login'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);
  const [isCollapsed, setIsCollapsed] = React.useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  
  React.useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed(localStorage.getItem('sidebar_collapsed') === 'true');
    };
    window.addEventListener('sidebar-toggle', handleToggle);
    return () => window.removeEventListener('sidebar-toggle', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 relative overflow-hidden">
      <div className="aurora"></div>
      {showSidebar && <Sidebar />}
      <main className={`${showSidebar ? (isCollapsed ? 'pl-28' : 'pl-[18rem]') : ''} min-h-screen transition-all duration-300 relative z-10`}>
        {children}
      </main>
      {showSidebar && <GlobalChatbot />}
    </div>
  );
};

export default Layout;
