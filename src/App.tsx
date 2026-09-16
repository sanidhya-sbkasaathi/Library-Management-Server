import React, { useState, useEffect } from 'react';
import { serverStore } from './store/managementStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { OrganizationsView } from './components/OrganizationsView';
import { LicensesView } from './components/LicensesView';
import { DevicesView } from './components/DevicesView';
import { BackendView } from './components/BackendView';
import { RolesView } from './components/RolesView';
import { AuditView } from './components/AuditView';
import { SettingsView } from './components/SettingsView';
import { CreateOrgModal } from './components/CreateOrgModal';

export function App() {
  const [, setTick] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = serverStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const currentTab = serverStore.activeTab;

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onOpenCreateOrg={() => setIsCreateModalOpen(true)} />;
      case 'organizations':
        return <OrganizationsView onOpenCreateOrg={() => setIsCreateModalOpen(true)} />;
      case 'licenses':
        return <LicensesView />;
      case 'devices':
        return <DevicesView />;
      case 'backend':
        return <BackendView />;
      case 'roles':
        return <RolesView />;
      case 'audit':
        return <AuditView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenCreateOrg={() => setIsCreateModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f4f9] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200 select-none">
      {/* 1. Left Sidebar Navigation matching Image 3 */}
      <Sidebar
        activeTab={currentTab}
        onSelectTab={tab => {
          serverStore.setTab(tab);
          setMobileSidebarOpen(false);
        }}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Center Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header matching Image 3 */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={q => setSearchQuery(q)}
          onToggleMobileMenu={() => setMobileSidebarOpen(prev => !prev)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveScreen()}

            {/* Footer matching Image 3 */}
            <footer className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 gap-2">
              <div>
                © 2026 Your Company. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <a href="#privacy" className="hover:underline">Privacy</a>
                <a href="#terms" className="hover:underline">Terms</a>
                <a href="#support" className="hover:underline">Support</a>
                <span className="font-mono">v1.0.0</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CreateOrgModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default App;
