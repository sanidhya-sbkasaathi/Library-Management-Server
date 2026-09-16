import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Shield,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

interface HeaderProps {
  onSearchChange: (q: string) => void;
  searchQuery: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery, onToggleMobileMenu }) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const isDark = serverStore.isThemeDark;

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between z-10 shrink-0 transition-colors duration-200">
      {/* Mobile Hamburger Menu Button */}
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 mr-2 shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search Bar matching Image 3 */}
      <div className="flex-1 max-w-lg min-w-0">
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
      <div className="flex items-center gap-3 ml-6">
        {/* Supabase Cloud Live Sync Button */}
        <button
          onClick={() => serverStore.syncWithSupabase()}
          disabled={serverStore.isSyncingCloud}
          title="Supabase Cloud Live Status - Click to Synchronize"
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500/50 transition text-xs font-semibold cursor-pointer shadow-2xs"
        >
          <span className={`w-2 h-2 rounded-full ${serverStore.isSyncingCloud ? 'bg-blue-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-slate-700 dark:text-slate-300 hidden sm:inline">
            {serverStore.isSyncingCloud ? 'Syncing...' : 'Supabase Live'}
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md font-bold">
            {serverStore.organizations.length} Orgs
          </span>
        </button>

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
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            onClick={() => serverStore.setThemeMode('light')}
            title="Light Theme"
            className={`p-1.5 rounded-xl transition ${
              serverStore.themeMode === 'light'
                ? 'bg-white text-amber-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => serverStore.setThemeMode('system')}
            title="System Theme"
            className={`p-1.5 rounded-xl transition ${
              serverStore.themeMode === 'system'
                ? 'bg-white dark:bg-slate-700 text-blue-500 dark:text-blue-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => serverStore.setThemeMode('dark')}
            title="Dark Theme"
            className={`p-1.5 rounded-xl transition ${
              serverStore.themeMode === 'dark'
                ? 'bg-slate-900 text-cyan-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Profile matching active session */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {serverStore.currentUser?.name?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                {serverStore.currentUser?.name || 'Super Admin'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                {serverStore.currentUser?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-white block">
                  {serverStore.currentUser?.name || 'Super Admin'}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {serverStore.currentUser?.email || 'sbkasaathilibrary@gmail.com'}
                </span>
                <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                  {serverStore.currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <button
                onClick={() => {
                  serverStore.setTab('settings');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
              >
                <User className="w-3.5 h-3.5" />
                <span>Admin Profiles & Staff</span>
              </button>
              <button
                onClick={() => {
                  serverStore.setTab('audit');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Security Audit Logs</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    await serverStore.logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium transition text-left cursor-pointer"
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
