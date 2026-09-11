import React, { useState } from 'react';
import {
  Laptop,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const DevicesView: React.FC = () => {
  const devices = serverStore.devices;
  const organizations = serverStore.organizations;
  const [search, setSearch] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '');
  const [isRegistering, setIsRegistering] = useState(false);

  const filtered = devices.filter(
    d =>
      d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.orgName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    serverStore.registerDevice(selectedOrgId, newDeviceName.trim());
    setNewDeviceName('');
    setIsRegistering(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-cyan-500" />
            Device Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authorized client computers, hardware fingerprints, heartbeat tracking, and remote deactivation
          </p>
        </div>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Device</span>
        </button>
      </div>

      {/* Register Device Box */}
      {isRegistering && (
        <form
          onSubmit={handleRegisterDevice}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs animate-in zoom-in-95"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Register New Hardware Device
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-1">Organization</label>
              <select
                value={selectedOrgId}
                onChange={e => setSelectedOrgId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.orgId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Device Name / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Front Gate Turnstile PC"
                value={newDeviceName}
                onChange={e => setNewDeviceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20"
            >
              Authorize & Sign Token
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search devices by Device ID, Name, or Library..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Devices Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5 font-semibold">Device ID</th>
                <th className="py-3 px-4 font-semibold">Device Name</th>
                <th className="py-3 px-4 font-semibold">Organization</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Hardware Fingerprint</th>
                <th className="py-3 px-4 font-semibold">Last Heartbeat</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(dev => (
                <tr key={dev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {dev.deviceId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                    {dev.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {dev.orgName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        dev.status === 'ONLINE'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : dev.status === 'PROVISIONING'
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {dev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {dev.hardwareFingerprint}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {dev.lastSeen}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {dev.status === 'ONLINE' ? (
                      <button
                        onClick={() => serverStore.deactivateDevice(dev.deviceId)}
                        className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Inactive</span>
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
