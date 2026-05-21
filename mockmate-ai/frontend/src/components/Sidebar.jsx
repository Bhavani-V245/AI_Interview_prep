import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic, 
  Code2, 
  FileSearch, 
  BarChart3, 
  LogOut,
  BrainCircuit,
  Trophy,
  Keyboard,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  const { theme, toggleTheme } = useTheme();

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar_collapsed', String(nextState));
    window.dispatchEvent(new Event('sidebar-toggle'));
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <MessageSquare size={20} />, label: 'AI Interview', path: '/interview' },
    { icon: <Mic size={20} />, label: 'Voice Mode', path: '/voice-interview' },
    { icon: <Code2 size={20} />, label: 'Coding Round', path: '/coding' },
    { icon: <BookOpen size={20} />, label: 'Coding Practice', path: '/coding-practice' },
    { icon: <Users size={20} />, label: 'Group Discussion', path: '/gd' },
    { icon: <FileSearch size={20} />, label: 'Resume Analyzer', path: '/resume' },
    { icon: <Trophy size={20} />, label: 'Aptitude Quiz', path: '/quiz' },
    { icon: <Keyboard size={20} />, label: 'Typing Test', path: '/typing' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className={`h-[calc(100vh-2rem)] my-4 ml-4 glass border-white/10 rounded-3xl flex flex-col fixed left-0 top-0 z-50 shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 flex items-center justify-between border-b border-white/5`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold vibrant-text truncate">MockMate AI</h1>
          </div>
        )}
        {isCollapsed && (
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] mx-auto shrink-0">
            <BrainCircuit className="text-white" size={20} />
          </div>
        )}
        <button 
          onClick={toggleCollapse}
          className={`p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/5 shadow-md shrink-0 ${isCollapsed ? 'absolute -right-3 top-20 bg-[#0f0b29] rounded-full' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'neon-glass-active' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            <div className="transition-colors group-hover:text-purple-300 shrink-0">
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="font-semibold tracking-wide truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={toggleTheme}
          title={isCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
          className={`flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-500/10 rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark' ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
          {!isCollapsed && (
            <span className="font-semibold tracking-wide truncate">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              localStorage.removeItem('user');
              window.location.href = '/';
            }
          }}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold tracking-wide truncate">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
