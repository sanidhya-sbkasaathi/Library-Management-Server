import React, { useState } from 'react';
import {
  Settings,
  Users,
  ShieldCheck,
  Key,
  Database,
  Lock,
  CheckCircle2,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const SettingsView: React.FC = () => {
  const adminUsers = serverStore.adminUsers;
  const [activeTab, setActiveTab] = useState<'admins' | 'plans' | 'security'>('admins');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          System Settings & Control Plane
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Internal company administrator staff, commercial plan packaging, and cryptographic token policies
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-2xl font-bold transition ${
            activeTab === 'admins'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Administrator Users (Company Staff)
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-2xl font-bold transition ${
            activeTab === 'plans'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Commercial Plans & Entitlements
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-2xl font-bold transition ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Security & Cryptographic Keys
        </button>
      </div>

      {/* Tab 1: Administrator Users (Screen 15) */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Company Internal Management Team
                </h3>
                <p className="text-xs text-slate-500">
                  Staff authorized to issue licenses, provision customer databases, and manage tenant organizations
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="pb-3 font-semibold">Staff Member</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Internal Role</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 text-right font-semibold">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td className="py-3 text-slate-500">{user.email}</td>
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {user.role}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-500">{user.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Plans & Entitlements (Screen 16) */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Basic Plan
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹1,499 <span className="text-xs text-slate-400 font-normal">/ month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">✓ Maximum 3 Desktop PCs</li>
              <li className="flex items-center gap-2">✓ Up to 400 Registered Students</li>
              <li className="flex items-center gap-2">✓ 5 GB Encrypted Cloud Storage</li>
              <li className="flex items-center gap-2">✓ Offline SQLite Persistence</li>
              <li className="flex items-center gap-2">✓ Standard Email Support</li>
            </ul>
          </div>

          {/* Professional Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-500/80 shadow-lg space-y-4 relative">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase">
              Popular
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              Professional Plan
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹2,999 <span className="text-xs text-slate-400 font-normal">/ month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">✓ Maximum 5 Desktop PCs</li>
              <li className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">✓ Up to 1,000 Registered Students</li>
              <li className="flex items-center gap-2">✓ 10 GB Encrypted Cloud Storage</li>
              <li className="flex items-center gap-2">✓ Offline Sync Engine + Conflicts</li>
              <li className="flex items-center gap-2">✓ Turnstile Scanner & Thermal Receipts</li>
              <li className="flex items-center gap-2">✓ Priority WhatsApp / Call Support</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
              Enterprise Plan
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹6,999 <span className="text-xs text-slate-400 font-normal">/ month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">✓ 10+ Desktop PCs (Branch Multi-PC)</li>
              <li className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">✓ Up to 3,000 Students</li>
              <li className="flex items-center gap-2">✓ 25+ GB Cloud Document Storage</li>
              <li className="flex items-center gap-2">✓ Dedicated Multi-Branch RLS Isolation</li>
              <li className="flex items-center gap-2">✓ Custom SMS & WhatsApp Automation</li>
              <li className="flex items-center gap-2">✓ 24/7 Dedicated Account Manager</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Cryptography (Screen 17 & Blueprint 40) */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Cryptographic Policy & Hardware Enclave
              </h3>
              <p className="text-xs text-slate-500">
                Security parameters for client activation signatures, tokens, and offline trust
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400">Token Signing Protocol</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                Ed25519 Asymmetric Server Signature
              </span>
              <p className="text-[11px] text-slate-500">
                Private key remains strictly on Management Server. Desktop client holds only the public verification key.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400">Maximum Offline Grace Period</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                30 Days Local Operation
              </span>
              <p className="text-[11px] text-slate-500">
                Authorized computers can operate completely offline for 30 consecutive days before requiring heartbeat refresh.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400">Tenant Isolation Layer</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                PostgreSQL Kernel RLS (Zero Leaks)
              </span>
              <p className="text-[11px] text-slate-500">
                Supabase JWT session claims automatically filter every SQL query to association_id = auth.jwt()-&gt;&gt;'assoc_id'.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400">Tamper Detection</span>
              <span className="font-bold text-slate-800 dark:text-white block">
                Hardware Machine Fingerprint Bound
              </span>
              <p className="text-[11px] text-slate-500">
                Device tokens are cryptographically locked to Motherboard Serial + CPU ID + MAC address.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
