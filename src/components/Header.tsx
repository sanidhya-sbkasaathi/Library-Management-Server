import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  User,
  LogOut,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

interface HeaderProps {
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const isDark = serverStore.isThemeDark;

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between z-10 shrink-0 transition-colors duration-200">
      {/* Search Bar matching Image 3 */}
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search organizations, licenses, devices, users..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-12 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition shadow-inner"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Action Icons: Notification, Theme Toggle, User Profile */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification Bell with Badge 3 */}
        <button
          title="Notifications"
          className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
            3
          </span>
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => serverStore.toggleTheme()}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Profile matching Image 3: Trivendra Shukla, Super Admin */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              TS
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                Trivendra Shukla
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white block">Trivendra Shukla</span>
                <span className="text-[11px] text-slate-400 block">trivendra@yourcompany.com</span>
              </div>
              <button
                onClick={() => {
                  serverStore.setTab('settings');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Admin Profile & 2FA</span>
              </button>
              <button
                onClick={() => {
                  serverStore.setTab('audit');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Security Audit Logs</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
