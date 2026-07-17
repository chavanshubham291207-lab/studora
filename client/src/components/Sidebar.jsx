import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Code, GraduationCap, Briefcase, FolderOpen, 
  Terminal, Calendar, Sparkles, FileText, MessageSquare, 
  User, Shield, Calculator, CheckSquare, Clock, Search, LogOut, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/hackathons", label: "Hackathons", icon: Code },
    { to: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { to: "/jobs", label: "Jobs & Internships", icon: Briefcase },
    { to: "/certifications", label: "Free Certifications", icon: Award },
    { to: "/resources", label: "Study Resources", icon: FolderOpen },
    { to: "/contests", label: "Contest Tracker", icon: Terminal },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/ai-assistant", label: "AI Study Hub", icon: Sparkles, highlight: true },
    { to: "/resume-builder", label: "Resume Builder", icon: FileText },
    { to: "/community", label: "Community Forum", icon: MessageSquare },
    { to: "/cgpa-calculator", label: "CGPA Calculator", icon: Calculator },
    { to: "/attendance", label: "Attendance Tracker", icon: CheckSquare },
    { to: "/timetable", label: "Timetable Planner", icon: Clock },
    { to: "/analyzers", label: "Profile Reviews", icon: Search },
    { to: "/profile", label: "Profile", icon: User }
  ];

  if (user && user.role === 'admin') {
    links.push({ to: "/admin", label: "Admin Panel", icon: Shield });
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 glass-panel border-r border-white/10 flex flex-col transition-transform duration-300 transform lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center font-display font-extrabold text-base text-white">
            S
          </span>
          <span className="font-display font-extrabold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Studora
          </span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl font-display text-sm font-semibold transition-all group ${
                  isActive 
                    ? link.highlight 
                      ? 'bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-violet-400 border border-violet-500/20'
                      : 'bg-violet-600 text-white shadow-[0_4px_12px_rgba(139,92,246,0.25)]'
                    : link.highlight
                      ? 'text-violet-400 hover:bg-violet-950/20 border border-transparent hover:border-violet-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-display text-sm font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
