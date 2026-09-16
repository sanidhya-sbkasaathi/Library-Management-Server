import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Laptop,
  AlertTriangle,
  Building2,
  FileCheck2,
  Database,
  UserPlus,
  History,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Server,
  CheckCircle2,
  ChevronRight,
  Plus,
  Copy,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { serverStore } from '../store/managementStore';

interface DashboardViewProps {
  onOpenCreateOrg: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenCreateOrg }) => {
  const organizations = serverStore.organizations;
  const licenses = serverStore.licenses;
  const devices = serverStore.devices;
  const auditLogs = serverStore.auditLogs;
  const isSchemaProvisioned = serverStore.isSchemaProvisioned;
  const dbError = serverStore.dbError;

  const [copiedSql, setCopiedSql] = useState(false);

  // Dynamic Metrics computed directly from real database records
  const totalOrgs = organizations.length;
  const activeLicenses = licenses.filter(l => l.status === 'ACTIVE').length;
  const totalDevices = devices.length;
  const expiringSoon = licenses.filter(l => {
    const d = parseInt(l.expiresAt);
    return !isNaN(d) ? d <= 30 : false;
  }).length;

  // Real Donut Chart Data computed dynamically from organizations
  const activeCount = organizations.filter(o => o.status === 'ACTIVE').length;
  const suspendedCount = organizations.filter(o => o.status === 'SUSPENDED').length;
  const expiredCount = organizations.filter(o => o.status === 'EXPIRED').length;
  const pendingCount = organizations.filter(o => o.status === 'PENDING').length;

  const orgDonutData = totalOrgs > 0 ? [
    { name: 'Active', value: activeCount, color: '#10b981', percent: `${((activeCount / totalOrgs) * 100).toFixed(1)}%` },
    { name: 'Suspended', value: suspendedCount, color: '#f59e0b', percent: `${((suspendedCount / totalOrgs) * 100).toFixed(1)}%` },
    { name: 'Expired', value: expiredCount, color: '#ef4444', percent: `${((expiredCount / totalOrgs) * 100).toFixed(1)}%` },
    { name: 'Pending', value: pendingCount, color: '#8b5cf6', percent: `${((pendingCount / totalOrgs) * 100).toFixed(1)}%` },
  ] : [
    { name: 'Active', value: 0, color: '#10b981', percent: '0%' },
    { name: 'Suspended', value: 0, color: '#f59e0b', percent: '0%' },
    { name: 'Expired', value: 0, color: '#ef4444', percent: '0%' },
    { name: 'Pending', value: 0, color: '#8b5cf6', percent: '0%' },
  ];

  // Real Device Bar Data computed dynamically from devices
  const devOnline = devices.filter(d => d.status === 'ONLINE').length;
  const devOffline = devices.filter(d => d.status === 'OFFLINE').length;
  const devProvisioning = devices.filter(d => d.status === 'PROVISIONING').length;
  const devError = devices.filter(d => d.status === 'ERROR').length;

  const deviceBarData = [
    { name: 'Online', count: devOnline, fill: '#10b981' },
    { name: 'Offline', count: devOffline, fill: '#3b82f6' },
    { name: 'Provisioning', count: devProvisioning, fill: '#8b5cf6' },
    { name: 'Error', count: devError, fill: '#ef4444' },
  ];

  const handleCopySchema = async () => {
    try {
      const res = await fetch('/supabase_schema.sql');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 4000);
    } catch (e) {
      alert('File located at: c:\\Users\\ashup\\OneDrive\\Desktop\\LIb_management\\supabase_schema.sql');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ⚠️ Supabase Schema Not Initialized Notice */}
      {!isSchemaProvisioned && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                  Supabase Database Schema Initialization Required
                </h3>
                <p className="text-xs text-amber-800/90 dark:text-amber-300 mt-1 leading-relaxed">
                  Connected to Supabase project <b className="font-mono">jsvevzzupajrgzxsmmyr</b>, but tables (<code className="font-mono bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">organizations</code>, <code className="font-mono bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">licenses</code>, etc.) have not been created yet in your cloud PostgreSQL database.
                </p>
                <div className="mt-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Run <b className="font-mono">supabase_schema.sql</b> in your Supabase SQL Editor to create all 13 multi-tenant tables and RLS policies.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleCopySchema}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? '✓ SQL Copied!' : 'Copy SQL Schema'}</span>
              </button>
              <a
                href={serverStore.getProjectRef() ? `https://supabase.com/dashboard/project/${serverStore.getProjectRef()}/sql` : "https://supabase.com/dashboard"}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 transition"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP ROW: WELCOME BANNER + SYSTEM ONLINE STATUS PILL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Welcome Banner matching Image 3 */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/60 dark:border-blue-500/20 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="absolute -right-6 -bottom-8 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-600/30 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 z-10 max-w-xl">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
              Welcome back,
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trivendra Shukla!
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Live Control Plane connected to Supabase PostgreSQL (<code className="font-mono text-[11px] text-blue-600 dark:text-blue-400">jsvevzzupajrgzxsmmyr</code>). Real-time telemetry from active multi-tenant library associations.
            </p>
          </div>

          {/* Metric Chips on Banner matching Image 3 - Dynamically bound */}
          <div className="flex flex-wrap items-center gap-3 pt-6 z-10">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
              <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">
                  {totalOrgs}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  Organizations
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">
                  {activeLicenses}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  Active Licenses
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
              <div className="w-7 h-7 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">
                  {totalDevices}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                  Devices
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Status Card matching Image 3 */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isSchemaProvisioned ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isSchemaProvisioned ? 'System Online' : 'Awaiting Schema'}
                </span>
              </div>
              <button
                onClick={() => serverStore.setTab('backend')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supabase Project: <code className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">jsvevzzupajrgzxsmmyr</code>
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Database Connection</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Connected</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Schema Provisioning</span>
              <span className={`font-semibold ${isSchemaProvisioned ? 'text-emerald-600' : 'text-amber-500'}`}>
                {isSchemaProvisioned ? 'v014 Active' : 'Run Schema SQL'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Real Records</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {totalOrgs} Orgs • {totalDevices} PCs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR KPI CARDS (Dynamically calculated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Organizations */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-600/50 transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              Live
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Total Organizations
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {totalOrgs}
            </span>
          </div>
        </div>

        {/* Active Licenses */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-600/50 transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              Live
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Active Licenses
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {activeLicenses}
            </span>
          </div>
        </div>

        {/* Devices */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-600/50 transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              Live
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Authorized Devices
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {totalDevices}
            </span>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-600/50 transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              30 Days
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Expiring Soon
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {expiringSoon}
            </span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: ORGANIZATION OVERVIEW DONUT + DEVICE STATUS BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Overview Donut */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Organization Overview
            </h3>
            <button
              onClick={() => serverStore.setTab('organizations')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            <div className="w-48 h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orgDonutData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={totalOrgs > 0 ? 3 : 0}
                    dataKey="value"
                  >
                    {orgDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {totalOrgs}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Total Organizations
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Active</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeCount} <span className="text-slate-400 font-normal">({totalOrgs > 0 ? `${((activeCount / totalOrgs) * 100).toFixed(0)}%` : '0%'})</span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">Suspended</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {suspendedCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-300">Expired</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {expiredCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600 dark:text-slate-300">Pending</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Status Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Device Status
            </h3>
            <button
              onClick={() => serverStore.setTab('devices')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="h-48 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceBarData} barSize={36}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {deviceBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. LOWER ROW: ORGANIZATIONS LIST + QUICK ACTIONS + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Real Organizations Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Customer Organizations
              </h3>
              <button
                onClick={() => serverStore.setTab('organizations')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All ({organizations.length})
              </button>
            </div>

            {organizations.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  No organizations registered in Supabase yet.
                </div>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Click "+ Create Organization" to register your first library organization, or run <b className="font-mono">supabase_schema.sql</b> to seed initial data.
                </p>
                <button
                  onClick={onOpenCreateOrg}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Organization</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="pb-3 font-semibold">Organization</th>
                      <th className="pb-3 font-semibold text-center">Active Users</th>
                      <th className="pb-3 font-semibold text-center">Devices</th>
                      <th className="pb-3 font-semibold">License Health</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {organizations.slice(0, 5).map(org => (
                      <tr
                        key={org.id}
                        onClick={() => serverStore.setTab('organizations', org.id)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        <td className="py-3.5 flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white block">
                              {org.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {org.orgId}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-center font-bold text-slate-700 dark:text-slate-300">
                          {org.activeUsers}
                        </td>
                        <td className="py-3.5 text-center font-bold text-slate-700 dark:text-slate-300">
                          {org.devices} / {org.maxDevices}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2 max-w-[140px]">
                            <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                              {org.licenseHealthPercent}%
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${org.licenseHealthPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-400 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions + Live Activity */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Quick Actions
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={onOpenCreateOrg}
                className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Create Org</span>
              </button>

              <button
                onClick={() => serverStore.setTab('licenses')}
                className="p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <FileCheck2 className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Licenses</span>
              </button>

              <button
                onClick={() => serverStore.setTab('devices')}
                className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <Laptop className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Devices</span>
              </button>

              <button
                onClick={() => serverStore.setTab('backend')}
                className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <Database className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Backend</span>
              </button>

              <button
                onClick={() => serverStore.setTab('roles')}
                className="p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Roles</span>
              </button>

              <button
                onClick={() => serverStore.setTab('audit')}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 transition group"
              >
                <History className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="text-[10px] font-bold text-center leading-tight">Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Real Live Audit Log Feed from Supabase */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Audit Activity
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Database Live
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No audit events recorded yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {auditLogs.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-white">
                          {item.organization}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.event} — {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
