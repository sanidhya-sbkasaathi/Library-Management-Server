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
  UserPlus,
  Trash2,
  Power,
  X,
  ShieldAlert,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const SettingsView: React.FC = () => {
  const adminUsers = serverStore.adminUsers;
  const [activeTab, setActiveTab] = useState<'admins' | 'plans' | 'security'>('admins');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Support Admin' | 'Finance Admin' | 'Auditor' | 'Compliance Lead'>('Support Admin');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleEnrollAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    serverStore.enrollAdmin({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
    });

    setActionMessage(`Successfully enrolled ${newName.trim()} as ${newRole}`);
    setTimeout(() => setActionMessage(null), 3000);
    setNewName('');
    setNewEmail('');
    setNewRole('Support Admin');
    setIsEnrollModalOpen(false);
  };

  const handleToggleStatus = (id: string, name: string) => {
    serverStore.toggleAdminStatus(id);
    setActionMessage(`Updated access status for ${name}`);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to revoke and delete admin credentials for ${name}?`)) {
      serverStore.deleteAdmin(id);
      setActionMessage(`Admin ${name} removed from system.`);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            System Settings & Control Plane
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal company administrator staff, commercial plan packaging, and cryptographic token policies
          </p>
        </div>

        {activeTab === 'admins' && (
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Enroll New Admin</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

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
          Administrator Users ({adminUsers.length})
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
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" /> Company Internal Management Team
                </h3>
                <p className="text-xs text-slate-500">
                  Staff authorized to issue licenses, provision customer databases, monitor tenants and handle support
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
                    <th className="pb-3 text-center font-semibold">Last Active</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span>{user.name}</span>
                          {user.email === 'sbkasaathilibrary@gmail.com' && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              ROOT SUPER ADMIN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">{user.email}</td>
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.role === 'Super Admin'
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 text-center text-slate-500">{user.lastActive}</td>
                      <td className="py-3 text-right">
                        {user.email !== 'sbkasaathilibrary@gmail.com' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(user.id, user.name)}
                              title={user.status === 'ACTIVE' ? 'Suspend Admin Access' : 'Activate Admin Access'}
                              className={`p-1.5 rounded-xl border transition ${
                                user.status === 'ACTIVE'
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(user.id, user.name)}
                              title="Revoke and Delete Admin"
                              className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enroll New Admin Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Enroll New Management Admin
                </h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollAdmin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@yourcompany.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Internal Role & Privilege Scope
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Super Admin">Super Admin (Full Root Authority)</option>
                  <option value="Support Admin">Support Admin (Organizations & Licenses)</option>
                  <option value="Finance Admin">Finance Admin (Billing & Plan Entitlements)</option>
                  <option value="Auditor">Auditor (Read-only Security Logs)</option>
                  <option value="Compliance Lead">Compliance Lead (Security Policies)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Enroll Admin
                </button>
              </div>
            </form>
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
