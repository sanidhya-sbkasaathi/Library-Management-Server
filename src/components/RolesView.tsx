import React, { useState } from 'react';
import {
  Users2,
  Key,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Plus,
  Lock,
  Building2,
  UserCheck,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const RolesView: React.FC = () => {
  const credentials = serverStore.credentials;
  const organizations = serverStore.organizations;
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '');
  const [selectedRole, setSelectedRole] = useState('Librarian');
  const [assignedEmail, setAssignedEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 5 System Roles definitions matching Screen 10
  const systemRoles = [
    {
      title: 'Super Admin',
      desc: 'Full library owner control, subscription management, and staff invitation rights.',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Owner / Principal',
      permissions: ['All Modules', 'Financial Ledger', 'Staff Onboarding', 'Settings', 'License Mgmt'],
    },
    {
      title: 'Librarian',
      desc: 'Operational library control, seat allocation, student admissions, and overdue fees.',
      color: 'from-blue-500 to-cyan-600',
      badge: 'Operations',
      permissions: ['Admissions', 'Seat Allocation', 'Attendance Check', 'Collect Fees', 'Reports'],
    },
    {
      title: 'Assistant',
      desc: 'Daily floor operations, attendance turnstiles, locker issuance, and complaints.',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Floor Staff',
      permissions: ['QR Attendance', 'Locker Allocation', 'Visitor Log', 'View Seats'],
    },
    {
      title: 'Receptionist',
      desc: 'Front desk reception, visitor check-in, initial enquiry intake, and receipt print.',
      color: 'from-amber-500 to-orange-600',
      badge: 'Front Desk',
      permissions: ['Student Intake', 'Fee Receipt Print', 'Visitor Entry', 'QR Scan'],
    },
    {
      title: 'Viewer',
      desc: 'Read-only access for auditors, inspectors, and monitoring committees.',
      color: 'from-slate-500 to-slate-700',
      badge: 'Read Only',
      permissions: ['View Dashboard', 'View Occupancy', 'Export Summaries'],
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cred = await serverStore.generateRoleCredential(
      selectedOrgId,
      selectedRole,
      assignedEmail.trim() || undefined
    );
    setGeneratedCode(cred.code);
    setAssignedEmail('');
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-purple-600" />
            Roles & Onboarding Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predefined system roles, granular RBAC permissions, and short-lived one-time activation credentials
          </p>
        </div>
      </div>

      {/* 1. Five System Roles Cards (Screen 10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {systemRoles.map((role, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-600/50 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {role.badge}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {role.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {role.desc}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Permissions
              </span>
              <div className="space-y-1">
                {role.permissions.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. One-Time Role Activation Generator (Screen 12 & Blueprint 19) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Generate Role Activation Credential
              </h3>
              <p className="text-xs text-slate-500">
                One-time, short-lived (12-24h), revocable onboarding tokens for library staff
              </p>
            </div>
          </div>
        </div>

        {generatedCode && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
                Generated One-Time Activation Token
              </span>
              <div className="font-mono text-lg font-extrabold text-purple-900 dark:text-purple-200">
                {generatedCode}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Staff member will enter this code on desktop to create their password via Supabase Auth.
              </p>
            </div>
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        )}

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-semibold">Target Organization</label>
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
            <label className="block text-slate-500 mb-1 font-semibold">System Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Librarian">Librarian</option>
              <option value="Assistant">Assistant</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-semibold">Assignee Email (Optional)</label>
            <input
              type="email"
              placeholder="e.g. staff@abclibrary.in"
              value={assignedEmail}
              onChange={e => setAssignedEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Credential</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Onboarding Credentials History Table (Screen 13) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Issued Activation Credentials & Invitations
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Activation Code</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Organization</th>
                <th className="pb-3 font-semibold">Assignee</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 text-right font-semibold">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {credentials.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {c.code}
                  </td>
                  <td className="py-3 font-bold text-slate-800 dark:text-white">
                    {c.role}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {c.orgName}
                  </td>
                  <td className="py-3 text-slate-500">
                    {c.assignedToEmail || 'Unassigned (Open Link)'}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'USED'
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : c.status === 'UNUSED'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-500">
                    {c.expiresAt}
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
