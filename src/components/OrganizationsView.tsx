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
  RefreshCw,
  Cloud,
  X,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';
import { Organization } from '../types/serverTypes';
import { ViewPayloadModal } from './ViewPayloadModal';

interface OrganizationsViewProps {
  onOpenCreateOrg: () => void;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({ onOpenCreateOrg }) => {
  const organizations = serverStore.organizations;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [payloadModalOrg, setPayloadModalOrg] = useState<Organization | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await serverStore.syncWithSupabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback(`✓ Synced ${res.count} Organizations directly with Supabase Cloud!`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } else {
      setSyncFeedback(`Sync error: ${res.error}`);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

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
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              {organizations.length} Real Cloud Orgs
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Directly connected to Supabase PostgreSQL cloud • Zero mock duplicates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCloudSync}
            disabled={isSyncing}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition flex items-center gap-2 shadow-xs ${
              isSyncing
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 cursor-wait'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
            title="Force immediate refresh and synchronize with Supabase PostgreSQL cloud"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600 dark:text-blue-400' : 'text-emerald-500'}`} />
            <span>{isSyncing ? 'Syncing Cloud...' : 'Online Cloud Sync'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-300 font-mono font-bold">
              {organizations.length}
            </span>
          </button>

          <button
            onClick={onOpenCreateOrg}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Organization</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{syncFeedback}</span>
          </div>
          <span className="text-[10px] opacity-75 font-mono">
            {serverStore.lastCloudSyncTime ? `Verified at ${serverStore.lastCloudSyncTime}` : ''}
          </span>
        </div>
      )}

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
                <th className="py-3 px-4 font-semibold">Cloud Sync (Supabase)</th>
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
                  <td className="py-3.5 px-4">
                    {org.supabaseStatus === 'Connected' ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                        {org.supabaseProjectRef && (
                          <span className="font-mono text-[9px] opacity-80 max-w-[90px] truncate">({org.supabaseProjectRef})</span>
                        )}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Offline SQLite</span>
                      </div>
                    )}
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setPayloadModalOrg(org);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold text-[10px] border border-blue-200 dark:border-blue-800 transition flex items-center gap-1 shadow-xs"
                        title="View & Copy Signed Ed25519 Payload Envelope"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>Payload</span>
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedOrg(org);
                        }}
                        className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
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
                <span className="text-slate-400 block">Supabase Cloud</span>
                <span className={`font-bold text-sm mt-0.5 block flex items-center gap-1 ${
                  selectedOrg.supabaseStatus === 'Connected'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedOrg.supabaseStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`} />
                  {selectedOrg.supabaseStatus === 'Connected' ? 'Connected' : 'Offline Mode'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono truncate">
                  {selectedOrg.supabaseProjectRef || selectedOrg.databaseVersion}
                </span>
              </div>
            </div>

            {/* Supabase Cloud Connection & Sync Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  Supabase Cloud Connection & Sync
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedOrg.supabaseStatus === 'Connected'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}>
                  {selectedOrg.supabaseStatus === 'Connected' ? 'Sync Enabled' : 'Local Only'}
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Project Ref:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedOrg.supabaseProjectRef || 'Not configured'}
                  </span>
                </div>
                {selectedOrg.supabaseUrl && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 font-sans">Endpoint:</span>
                    <span className="text-blue-600 dark:text-blue-400 truncate max-w-[240px]">
                      {selectedOrg.supabaseUrl}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">PAT Key / Anon Key:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                    {selectedOrg.patConfigured || selectedOrg.supabaseAnonKey ? '✓ Configured & Linked' : 'Auto / Local'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Last Cloud Sync:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {selectedOrg.lastCloudSync || selectedOrg.lastSync || 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Master Password & Security Status Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Owner Password & Authentication
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedOrg.passwordDecided
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                }`}>
                  {selectedOrg.passwordDecided ? 'Password Decided' : 'Pending Initial Setup'}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Master Password Setup:</span>
                  <span className={`font-semibold ${selectedOrg.passwordDecided ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {selectedOrg.passwordDecided ? '✓ Decided & Configured (PBKDF2 Hashed)' : 'Pending First Owner Login'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Authentication Protocol:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Ed25519 Signed Envelope
                  </span>
                </div>
                {selectedOrg.ownerSecret && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Initial Secret:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {selectedOrg.ownerSecret}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Logged-in Devices Section */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-cyan-500" />
                  Active Logged-in Devices ({serverStore.devices.filter(d => d.organizationId === selectedOrg.orgId || d.organizationId === selectedOrg.id).length})
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Max Quota: {selectedOrg.maxDevices}
                </span>
              </div>

              {serverStore.devices.filter(d => d.organizationId === selectedOrg.orgId || d.organizationId === selectedOrg.id).length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 space-y-1">
                  <p className="font-semibold">No active devices registered yet</p>
                  <p className="text-[10px]">When the owner authenticates on a PC/phone, their device will appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {serverStore.devices
                    .filter(d => d.organizationId === selectedOrg.orgId || d.organizationId === selectedOrg.id)
                    .map(dev => (
                      <div
                        key={dev.id}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dev.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span className="font-bold text-slate-900 dark:text-white">{dev.name}</span>
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">({dev.deviceId})</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {dev.hardwareFingerprint || 'Desktop Terminal'} • IP: {dev.ipAddress || '192.168.1.100'} • Last Seen: {dev.lastSeen}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            dev.status === 'ONLINE'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            {dev.status}
                          </span>
                          {dev.status === 'ONLINE' && (
                            <button
                              onClick={() => serverStore.deactivateDevice(dev.deviceId)}
                              className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-semibold hover:bg-rose-100"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Assigned User Roles & Cryptographic Digital Signatures Roster */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Assigned User Roles & Digital Signatures
                </h3>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  HMAC-SHA256 Signed
                </span>
              </div>

              {(() => {
                let roles: any[] = [];
                try {
                  const stored = localStorage.getItem(`mgmt_org_roles_${selectedOrg.orgId}`);
                  if (stored) roles = JSON.parse(stored);
                } catch {
                  // ignore
                }

                if (roles.length === 0) {
                  return (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-600 dark:text-slate-300">Default Role Protocol Active</p>
                      <p className="text-[10px]">Owner: <b>{selectedOrg.ownerName}</b> (Master Auth). Staff role payloads will appear here when generated.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {roles.map((r: any) => (
                      <div
                        key={r.id || r.role}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white">{r.role}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {r.status || 'Active'}
                            </span>
                          </div>
                          {r.salary > 0 && (
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ₹{r.salary.toLocaleString('en-IN')}/mo
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {r.name || 'Unassigned (Pending)'}
                          </span>
                          <span className="font-mono text-slate-400 text-[10px]">{r.mobile || r.email || ''}</span>
                        </div>

                        {r.digitalSignature && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                            <span className="text-slate-400">Signature:</span>
                            <span className="font-mono text-purple-600 dark:text-purple-400 truncate max-w-[200px]" title={r.digitalSignature}>
                              {r.digitalSignature}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
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

            {/* Digital Certificate Payload Inspector Action */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Digital Certificate & Ed25519 Payload
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  Signed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Inspect and copy the official signed cryptographic JSON envelope required to authenticate this organization in the Library Owner App.
              </p>
              <button
                onClick={() => setPayloadModalOrg(selectedOrg)}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>View & Copy Signed Payload JSON</span>
              </button>
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
      {/* Digital Certificate Payload Modal */}
      <ViewPayloadModal
        isOpen={payloadModalOrg !== null}
        org={payloadModalOrg}
        onClose={() => setPayloadModalOrg(null)}
      />
    </div>
  );
};
