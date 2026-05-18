import React from 'react';
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
  Keyboard
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <MessageSquare size={20} />, label: 'AI Interview', path: '/interview' },
    { icon: <Mic size={20} />, label: 'Voice Mode', path: '/voice-interview' },
    { icon: <Code2 size={20} />, label: 'Coding Round', path: '/coding' },
    { icon: <FileSearch size={20} />, label: 'Resume Analyzer', path: '/resume' },
    { icon: <Trophy size={20} />, label: 'Aptitude Quiz', path: '/quiz' },
    { icon: <Keyboard size={20} />, label: 'Typing Test', path: '/typing' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-64 h-[calc(100vh-2rem)] my-4 ml-4 glass border-white/10 rounded-3xl flex flex-col fixed left-0 top-0 z-50 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold vibrant-text">MockMate AI</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'neon-glass-active' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className={({ isActive }) => isActive ? "text-purple-300" : ""}>
              {item.icon}
            </div>
            <span className="font-semibold tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-2xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
