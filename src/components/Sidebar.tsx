import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  Laptop,
  Database,
  Users2,
  History,
  Settings,
  ShieldCheck,
  ArrowRight,
  Server,
  Layers,
  X,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'licenses', label: 'Licenses', icon: FileCheck2 },
    { id: 'devices', label: 'Devices', icon: Laptop },
    { id: 'backend', label: 'Backend', icon: Database },
    { id: 'roles', label: 'Roles & Onboarding', icon: Users2 },
    { id: 'audit', label: 'Audit & Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      <div className="p-5 space-y-6">
        {/* Brand Logo matching Image 3 */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                YOUR COMPANY
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Management Portal
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card matching Image 3 */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-cyan-500/10 dark:from-indigo-900/40 dark:via-blue-900/20 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-500/30 text-xs space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Server className="w-4 h-4" />
            <span>Powering Your Libraries</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Secure • Scalable • Multi-Tenant PostgreSQL Cloud Platform.
          </p>
          <button
            onClick={() => {
              onSelectTab('backend');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-bold rounded-xl text-[11px] shadow-sm hover:shadow transition flex items-center justify-center gap-1.5 border border-indigo-100 dark:border-slate-700"
          >
            <span>View System Health</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex-col justify-between shrink-0 select-none z-20 transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
