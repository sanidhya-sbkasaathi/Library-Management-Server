import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Copy,
  Key,
  FileCheck2,
  ShieldCheck,
  Laptop,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';
import { PlanTier } from '../types/serverTypes';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [plan, setPlan] = useState<PlanTier>('Professional');
  const [durationYears, setDurationYears] = useState(1);
  const [maxDevices, setMaxDevices] = useState(5);
  const [maxStaff, setMaxStaff] = useState(20);
  const [maxStudents, setMaxStudents] = useState(1000);
  const [storageLimitGb, setStorageLimitGb] = useState(10);
  const [createdResult, setCreatedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [modules, setModules] = useState([
    'Student Management',
    'Seat Management',
    'Attendance',
    'Fees',
    'Expenses',
    'Reports',
    'Staff',
    'Locker',
    'Visitor',
    'Documents',
  ]);

  if (!isOpen) return null;

  const toggleModule = (mod: string) => {
    if (modules.includes(mod)) {
      setModules(modules.filter(m => m !== mod));
    } else {
      setModules([...modules, mod]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!name.trim() || !ownerName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await serverStore.createOrganization({
        name: name.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        state,
        district,
        plan,
        durationYears,
        maxDevices,
        maxStaff,
        maxStudents,
        storageLimitGb,
        modules,
      });

      if (res.success) {
        setCreatedResult(res);
      } else {
        setErrorMessage(res.error || 'Failed to create organization. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while creating the organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySignedCredential = () => {
    if (createdResult?.signedEnvelope) {
      navigator.clipboard.writeText(JSON.stringify(createdResult.signedEnvelope, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const copySummary = () => {
    if (createdResult) {
      navigator.clipboard.writeText(
        `=== LIBRARY OWNER DIGITAL ONBOARDING CERTIFICATE ===\n` +
        `Organization: ${createdResult.org.name} (${createdResult.org.orgId})\n` +
        `Library ID: ${createdResult.org.orgId}\n` +
        `License ID: ${createdResult.license.licenseId}\n` +
        `Owner Secret: ${createdResult.ownerSecret || 'None'}\n` +
        `One-Time Activation Code: ${createdResult.initialCredential?.code}\n` +
        `Algorithm: Ed25519\n` +
        `Digital Signature (64B): ${createdResult.signedEnvelope?.signature}\n\n` +
        `SIGNED CREDENTIAL ENVELOPE (Paste into Library App):\n` +
        JSON.stringify(createdResult.signedEnvelope, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Create New Library Organization
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ed25519 Digitally Signed Provisioning Authority (Screen 4 & Infographic Flow)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {createdResult ? (
            /* Success Card with Cryptographic Digital Certificate */
            <div className="space-y-5 py-2 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ed25519 Signed Organization Provisioned!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Signed with Management Server Private Key 🔐. Client Library App verifies offline using Public Key 🔓.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Library ID (Immutable)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {createdResult.org.orgId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">License ID</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {createdResult.license.licenseId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Owner Setup Secret</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {createdResult.ownerSecret}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Digital Signature (Ed25519)</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-[10px] truncate max-w-[280px]">
                    {createdResult.signedEnvelope?.signature}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Device Limit: {createdResult.org.maxDevices} PCs</span>
                  <span>Certificate Version: v1 (management-v1)</span>
                </div>
              </div>

              {/* Signed Envelope Raw Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Signed Credential Envelope (Paste in Library App Onboarding):
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Canonical JSON + 64B Ed25519 Sig
                  </span>
                </div>
                <textarea
                  readOnly
                  rows={5}
                  value={JSON.stringify(createdResult.signedEnvelope, null, 2)}
                  className="w-full font-mono text-[11px] p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 select-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={copySignedCredential}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Signed Credential JSON'}</span>
                </button>
                <button
                  onClick={copySummary}
                  className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition flex items-center justify-center gap-1.5"
                >
                  <span>Copy All Details</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-2xl transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Library / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC Reading Library"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Plan & Entitlements */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <span className="font-bold text-slate-800 dark:text-white block">
                  License & Plan Configuration
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Subscription Plan</label>
                    <select
                      value={plan}
                      onChange={e => setPlan(e.target.value as PlanTier)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-white"
                    >
                      <option value="Basic">Basic (3 PCs, 400 Students)</option>
                      <option value="Professional">Professional (5 PCs, 1000 Students)</option>
                      <option value="Enterprise">Enterprise (10+ PCs, 2500+ Students)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">License Duration</label>
                    <select
                      value={durationYears}
                      onChange={e => setDurationYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-white"
                    >
                      <option value={1}>1 Year License</option>
                      <option value={2}>2 Years License</option>
                      <option value={3}>3 Years License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">Maximum PCs</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={maxDevices}
                      onChange={e => setMaxDevices(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Module Entitlements */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">
                  Enabled Modules
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Student Management',
                    'Seat Management',
                    'Attendance',
                    'Fees',
                    'Expenses',
                    'Reports',
                    'Staff',
                    'Locker',
                    'Visitor',
                    'Documents',
                  ].map(mod => (
                    <label
                      key={mod}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={modules.includes(mod)}
                        onChange={() => toggleModule(mod)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {mod}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Provisioning Organization...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Create Organization & License</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
