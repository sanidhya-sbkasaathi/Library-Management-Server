import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
  Server,
} from 'lucide-react';
import { serverStore } from '../store/managementStore';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('sbkasaathilibrary@gmail.com');
  const [password, setPassword] = useState('library@1299');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await serverStore.login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#070c18] relative overflow-hidden font-sans p-4 sm:p-6 text-slate-100">
      {/* Dynamic Background Glowing Mesh */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border border-blue-400/30">
            <Server className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            SbKasaathi Control Plane
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Central Multi-Tenant Management Hub & Cryptographic Security Authority
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Quick Super Admin Credentials Helper */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Super Admin Credentials
              </span>
              <button
                type="button"
                onClick={() => handleQuickFill('sbkasaathilibrary@gmail.com', 'library@1299')}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
              <div>Email: <span className="text-white font-bold">sbkasaathilibrary@gmail.com</span></div>
              <div>Password: <span className="text-white font-bold">library@1299</span></div>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Pill */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Supabase Auth & Ed25519 Verified</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500">
          Library Management Server v3.2 • Single Sign-On Control Plane
        </div>
      </div>
    </div>
  );
};
