import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Key,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const LicensesView: React.FC = () => {
  const licenses = serverStore.licenses;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = licenses.filter(lic => {
    const matchesSearch =
      lic.licenseId.toLowerCase().includes(search.toLowerCase()) ||
      lic.orgName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || lic.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            License Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Issued software licenses, hardware machine allowances, renewal schedules, and revocation policies
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by License ID or Library name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-semibold">Filter:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Licenses ({licenses.length})</option>
            <option value="ACTIVE">Active ({licenses.filter(l => l.status === 'ACTIVE').length})</option>
            <option value="SUSPENDED">Suspended ({licenses.filter(l => l.status === 'SUSPENDED').length})</option>
            <option value="EXPIRED">Expired ({licenses.filter(l => l.status === 'EXPIRED').length})</option>
          </select>
        </div>
      </div>

      {/* Licenses Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5 font-semibold">License ID</th>
                <th className="py-3 px-4 font-semibold">Organization</th>
                <th className="py-3 px-4 font-semibold">Plan</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Devices (Used / Max)</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(lic => (
                <tr key={lic.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {lic.licenseId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                    {lic.orgName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      {lic.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        lic.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {lic.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {lic.currentDevices} / {lic.maxDevices} PCs
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {lic.expiresAt}
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => serverStore.renewLicense(lic.licenseId)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold transition"
                    >
                      Renew
                    </button>
                    {lic.status === 'ACTIVE' ? (
                      <button
                        onClick={() => serverStore.suspendLicense(lic.licenseId)}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold transition"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => serverStore.renewLicense(lic.licenseId)}
                        className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold transition"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
