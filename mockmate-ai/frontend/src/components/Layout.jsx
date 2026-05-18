import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebarPaths = ['/', '/login'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {showSidebar && <Sidebar />}
      <main className={`${showSidebar ? 'pl-64' : ''} min-h-screen transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
