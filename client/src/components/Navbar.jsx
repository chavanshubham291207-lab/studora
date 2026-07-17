import React from 'react';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass-panel border-b border-white/10 z-20 px-6 flex items-center justify-between">
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/40 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Floating AI Helper quick link */}
      <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-800/30 px-3 py-1.5 rounded-full text-xs text-violet-300 font-semibold animate-pulse-glow">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ask AI anything in the sidebar tools</span>
      </div>

      {/* Action items */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/40 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt="avatar" 
              className="w-8 h-8 rounded-full bg-violet-900/30 border border-violet-500/20"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">{user.name}</span>
              <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
