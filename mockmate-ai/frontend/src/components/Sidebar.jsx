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
    <div className="w-64 h-screen glass-dark border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-gradient">MockMate AI</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
