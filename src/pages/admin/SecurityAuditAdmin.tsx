import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Key, LogOut, FileText, AlertTriangle, CheckCircle2, Globe, Clock, Shield } from 'lucide-react';
import { authService } from '../../services/authService';
import { UserSessionRecord, SecurityAuditRecord } from '../../types/database.types';

export const SecurityAuditAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AUDIT_LOGS' | 'SESSIONS' | 'SECURITY_POLICIES'>('AUDIT_LOGS');
  const [sessions, setSessions] = useState<UserSessionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditRecord[]>([]);

  // Policy Toggles State
  const [mfaEnforcedSuperAdmin, setMfaEnforcedSuperAdmin] = useState(true);
  const [mfaEnforcedFinance, setMfaEnforcedFinance] = useState(true);
  const [allowUserIdLogin, setAllowUserIdLogin] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const sData = await authService.getSessions();
    const aData = await authService.getAuditLogs();
    setSessions(sData);
    setAuditLogs(aData);
  };

  const handleRevokeSession = async (sessionId: string) => {
    await authService.revokeSession(sessionId);
    fetchData();
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> Security & Audit Command Center
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Security Controls, Sessions & Audit Logs
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Monitor active user sessions, enforce MFA policies, and inspect append-only security audit logs.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'AUDIT_LOGS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('SESSIONS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'SESSIONS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('SECURITY_POLICIES')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'SECURITY_POLICIES' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Password & MFA Policy
          </button>
        </div>
      </div>

      {/* TAB 1: AUDIT LOGS TABLE */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white font-display">System Security Audit Trail</h2>
              <p className="text-slate-400 text-xs">Append-only audit logs recording user activity, role changes, and record updates.</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              ✓ Immutable Append-Only Storage
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.user_name}</span>
                    <span className="text-[10px] text-amber-400 font-mono">({log.user_role})</span>
                    <span className="text-[10px] text-slate-500 font-mono">• Module: {log.module}</span>
                  </div>
                  <p className="text-slate-300 text-xs font-mono">{log.details}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  <div>{new Date(log.timestamp).toLocaleString()}</div>
                  <div className="text-slate-500">IP: {log.ip_address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SESSIONS */}
      {activeTab === 'SESSIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white font-display">Active User Sessions</h2>
              <p className="text-slate-400 text-xs">Monitor and forcibly invalidate active login tokens across devices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div key={sess.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{sess.user_name}</span>
                  {sess.is_current ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ● Current Session
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400">
                      Active Session
                    </span>
                  )}
                </div>

                <div className="text-slate-400 text-xs font-mono space-y-1">
                  <div>Browser: <span className="text-slate-200">{sess.browser}</span></div>
                  <div>IP Address: <span className="text-slate-200">{sess.ip_address}</span></div>
                  <div>Last Active: <span className="text-amber-400 font-bold">{sess.last_active}</span></div>
                </div>

                {!sess.is_current && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Revoke Session
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & MFA POLICIES */}
      {activeTab === 'SECURITY_POLICIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-white font-display">Password Policy & MFA Enforcement</h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Enforce MFA for Super Admin & Executives</div>
                <div className="text-slate-400 text-xs">Requires TOTP Authenticator app on login for Super Admin users.</div>
              </div>
              <input
                type="checkbox"
                checked={mfaEnforcedSuperAdmin}
                onChange={(e) => setMfaEnforcedSuperAdmin(e.target.checked)}
                className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Enforce MFA for Finance Managers</div>
                <div className="text-slate-400 text-xs">Requires 2FA verification before creating or editing invoices and payments.</div>
              </div>
              <input
                type="checkbox"
                checked={mfaEnforcedFinance}
                onChange={(e) => setMfaEnforcedFinance(e.target.checked)}
                className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Allow Login via User ID (USR-000001)</div>
                <div className="text-slate-400 text-xs">Users can log in using either their registered Email OR User ID.</div>
              </div>
              <input
                type="checkbox"
                checked={allowUserIdLogin}
                onChange={(e) => setAllowUserIdLogin(e.target.checked)}
                className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
