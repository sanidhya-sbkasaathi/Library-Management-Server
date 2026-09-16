import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Copy,
  CheckCircle2,
  Download,
  X,
  Lock,
  Building2,
  Calendar,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { Organization } from '../types/serverTypes';
import { serverCrypto, SignedCredentialEnvelope, OwnerCredentialPayload } from '../utils/serverCrypto';

interface ViewPayloadModalProps {
  isOpen: boolean;
  org: Organization | null;
  onClose: () => void;
}

export const ViewPayloadModal: React.FC<ViewPayloadModalProps> = ({ isOpen, org, onClose }) => {
  const [envelope, setEnvelope] = useState<SignedCredentialEnvelope<OwnerCredentialPayload> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && org) {
      setIsLoading(true);
      // Check if we already have a cached envelope for this organization in localStorage
      const cacheKey = `mgmt_cert_envelope_${org.orgId}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          setEnvelope(JSON.parse(cached));
          setIsLoading(false);
          return;
        } catch {
          // generate fresh
        }
      }

      // Generate authentic signed envelope using Ed25519 private key
      serverCrypto
        .issueOwnerCredential({
          libraryId: org.orgId,
          ownerName: org.ownerName,
          ownerEmail: org.email,
          plan: org.plan || 'Professional',
          durationYears: 1,
        })
        .then(env => {
          setEnvelope(env);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(env));
          } catch {
            // ignore
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, org]);

  if (!isOpen || !org) return null;

  const jsonString = envelope ? JSON.stringify(envelope, null, 2) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${org.orgId}_Owner_Credential.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Digital Certificate & Credential Payload
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold">
                  Ed25519 Signed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organization: <span className="font-semibold text-slate-800 dark:text-slate-200">{org.name}</span> ({org.orgId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Key className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p>Generating cryptographically signed certificate envelope...</p>
            </div>
          ) : (
            <>
              {/* Summary Metadata Card */}
              {envelope && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Credential ID</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white truncate block text-[11px]">
                      {envelope.payload.credential_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Library ID</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 truncate block text-[11px]">
                      {envelope.payload.library_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Owner Name</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block text-[11px]">
                      {envelope.payload.owner_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Plan & Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block text-[11px]">
                      {envelope.payload.plan} • {envelope.payload.status}
                    </span>
                  </div>
                </div>
              )}

              {/* JSON Code Inspector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                    <FileCode className="w-4 h-4 text-blue-500" />
                    Signed Credential Envelope (JSON)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Paste this envelope into the Library Owner App to authenticate.
                  </span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-64 select-text leading-relaxed">
                    {jsonString}
                  </pre>
                </div>
              </div>

              {/* Signature Verification Details */}
              {envelope && (
                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cryptographic Signature Proof</span>
                  </div>
                  <div className="font-mono text-[10px] break-all text-slate-500 dark:text-slate-400">
                    Signature (Hex): {envelope.signature}
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Algorithm: Ed25519 (RFC 8032)</span>
                    <span>Key ID: {envelope.key_id}</span>
                    <span>Expires: {envelope.payload.expires_at}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payload JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
