import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ChevronRight,
  ExternalLink,
  Laptop,
  Users,
  HardDrive,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';
import { Organization } from '../types/serverTypes';

interface OrganizationsViewProps {
  onOpenCreateOrg: () => void;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({ onOpenCreateOrg }) => {
  const organizations = serverStore.organizations;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const filtered = organizations.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.orgId.toLowerCase().includes(search.toLowerCase()) ||
      org.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Organizations & Libraries
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer libraries, multi-tenant schemas, license bindings, and device quotas
          </p>
        </div>

        <button
          onClick={onOpenCreateOrg}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Organization</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by library name, Org ID, or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses ({organizations.length})</option>
            <option value="ACTIVE">Active ({organizations.filter(o => o.status === 'ACTIVE').length})</option>
            <option value="SUSPENDED">Suspended ({organizations.filter(o => o.status === 'SUSPENDED').length})</option>
            <option value="EXPIRED">Expired ({organizations.filter(o => o.status === 'EXPIRED').length})</option>
            <option value="PENDING">Pending ({organizations.filter(o => o.status === 'PENDING').length})</option>
          </select>
        </div>
      </div>

      {/* Organizations Table (Screen 3) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5 font-semibold">Library / Organization</th>
                <th className="py-3 px-4 font-semibold">Org ID</th>
                <th className="py-3 px-4 font-semibold">Plan</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Devices</th>
                <th className="py-3 px-4 font-semibold text-center">Active Users</th>
                <th className="py-3 px-4 font-semibold">License Expiry</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(org => (
                <tr
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {org.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {org.ownerName} • {org.district}, {org.state}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {org.orgId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                      {org.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        org.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : org.status === 'SUSPENDED'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : org.status === 'PENDING'
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {org.devices} / {org.maxDevices}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {org.activeUsers}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {org.expiryDate}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedOrg(org);
                      }}
                      className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Details Drawer (Screen 5) */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {selectedOrg.name}
                  </h2>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                    {selectedOrg.orgId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block">License</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                  {selectedOrg.plan}
                </span>
                <span className="text-[10px] text-emerald-600 mt-1 block">Expires: {selectedOrg.expiryDate}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block">Active Devices</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                  {selectedOrg.devices} / {selectedOrg.maxDevices}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">Hardware quota</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block">Backend</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">
                  Connected
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">DB {selectedOrg.databaseVersion}</span>
              </div>
            </div>

            {/* Contact & Association Info */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-white">Contact & Location</h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Contact:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedOrg.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedOrg.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedOrg.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedOrg.district}, {selectedOrg.state}</span>
                </div>
              </div>
            </div>

            {/* Enabled Modules */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 dark:text-white">Feature Entitlements</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedOrg.modules.map(m => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[10px] border border-blue-100 dark:border-blue-500/20"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 text-xs">
              <button
                onClick={() => {
                  serverStore.renewLicense(selectedOrg.licenseId);
                  setSelectedOrg(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-sm"
              >
                Renew License (+1 Yr)
              </button>
              <button
                onClick={() => {
                  serverStore.suspendLicense(selectedOrg.licenseId);
                  setSelectedOrg(null);
                }}
                className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-xl transition border border-amber-300 dark:border-amber-500/30"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
