import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Bug, 
  Globe, 
  History, 
  Settings, 
  User,
  Shield
} from 'lucide-react';
import { cn } from '../utils/cn';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center justify-between px-6 py-4 transition-all duration-200 group relative",
      isActive 
        ? "bg-primary text-background" 
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    )}
  >
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5" />
      <span className="font-bold text-[11px] uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className={cn(
      "w-1.5 h-1.5 rounded-full bg-white transition-opacity",
      "opacity-0",
      "group-[.active]:opacity-100"
    )} />
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="h-screen bg-[#0d121f] flex flex-col z-20 w-[280px]">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="text-background w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter text-white">VIGILCORE</h1>
      </div>

      <nav className="flex-1 mt-4">
        <NavItem to="/" icon={Shield} label="Dashboard" />
        <NavItem to="/home" icon={HomeIcon} label="Welcome" />
        <NavItem to="/malware" icon={Bug} label="Malware Scan" />
        <NavItem to="/network" icon={Globe} label="Network Scan" />
        <NavItem to="/history" icon={History} label="History" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>
    </aside>
  );
};

export default Sidebar;
