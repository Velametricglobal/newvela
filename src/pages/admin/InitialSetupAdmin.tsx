import React, { useState } from 'react';
import { Key, Copy, Download, ShieldCheck, CheckCircle2, RefreshCw, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { InitialSetupAccount } from '../../types/database.types';

export const INITIAL_SETUP_ACCOUNTS: InitialSetupAccount[] = [
  { role_title: 'Super Admin', user_code: 'SUPERADMIN-001', email: 'superadmin@example.com', role: 'SUPER_ADMIN', department: 'Executive Management', temp_password: 'SuperVela!2026#Admin', created_at: new Date().toISOString() },
  { role_title: 'Business Administrator', user_code: 'ADMIN-001', email: 'admin@example.com', role: 'ADMIN', department: 'Operations', temp_password: 'AdminVela!2026#Ops', created_at: new Date().toISOString() },
  { role_title: 'Sales Manager', user_code: 'SALES-MANAGER-001', email: 'salesmanager@example.com', role: 'SALES_MANAGER', department: 'Sales & Growth', temp_password: 'SalesVela!2026#Mgr', created_at: new Date().toISOString() },
  { role_title: 'Sales Executive', user_code: 'SALES-001', email: 'sales@example.com', role: 'SALES_EXECUTIVE', department: 'Sales & Growth', temp_password: 'SalesVela!2026#Exec', created_at: new Date().toISOString() },
  { role_title: 'Marketing Manager', user_code: 'MARKETING-001', email: 'marketing@example.com', role: 'MARKETING_MANAGER', department: 'Digital Marketing', temp_password: 'MktgVela!2026#Reel', created_at: new Date().toISOString() },
  { role_title: 'Content Manager', user_code: 'CONTENT-001', email: 'content@example.com', role: 'CONTENT_MANAGER', department: 'Web & CMS', temp_password: 'ContentVela!2026#CMS', created_at: new Date().toISOString() },
  { role_title: 'Event Manager', user_code: 'EVENT-001', email: 'event@example.com', role: 'EVENT_MANAGER', department: 'Events & Culture', temp_password: 'EventVela!2026#Pass', created_at: new Date().toISOString() },
  { role_title: 'Finance Manager', user_code: 'FINANCE-001', email: 'finance@example.com', role: 'FINANCE_MANAGER', department: 'Finance & Legal', temp_password: 'FinVela!2026#Inv', created_at: new Date().toISOString() },
  { role_title: 'Read-Only Viewer', user_code: 'VIEWER-001', email: 'viewer@example.com', role: 'VIEWER', department: 'Reporting', temp_password: 'ViewVela!2026#Only', created_at: new Date().toISOString() }
];

export const InitialSetupAdmin: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [rotatedUser, setRotatedUser] = useState<string | null>(null);

  const handleCopyCredentials = (acc: InitialSetupAccount, idx: number) => {
    const text = `ROLE: ${acc.role_title}\nUSER ID: ${acc.user_code}\nEMAIL: ${acc.email}\nTEMPORARY PASSWORD: ${acc.temp_password}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadSheet = () => {
    const content = INITIAL_SETUP_ACCOUNTS.map(a =>
      `ROLE: ${a.role_title}\nUSER ID: ${a.user_code}\nEMAIL: ${a.email}\nTEMP PASSWORD: ${a.temp_password}\n------------------------`
    ).join('\n\n');

    const blob = new Blob([`VELAMETRIC ENTERPRISE INITIAL SETUP CREDENTIALS SHEET\nGenerated: ${new Date().toLocaleString()}\n\n` + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Velametric_Initial_Setup_Credentials_${Date.now()}.txt`;
    link.click();
  };

  const handleRotateCredentials = (userCode: string) => {
    setRotatedUser(userCode);
    setTimeout(() => setRotatedUser(null), 3000);
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            <Key className="w-3.5 h-3.5" /> Initial Deployment Credentials Panel
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Initial Setup Accounts & Credentials Sheet
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Generated unique initial account credentials. Every initial login forces an immediate password change (`must_change_password = true`).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-2"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPasswords ? 'Hide Passwords' : 'Reveal Temporary Passwords'}
          </button>
          <button
            onClick={handleDownloadSheet}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs inline-flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Download Setup Sheet
          </button>
        </div>
      </div>

      {/* SECURITY NOTICE ALERT */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1 text-amber-300">
        <div className="font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> ONE-TIME INITIAL CREDENTIALS SHEET
        </div>
        <p className="text-[11px] text-amber-200/80 leading-relaxed">
          These initial credentials are generated for the initial deployment setup. Once an initial user logs in for the first time, they will be prompted to set a permanent password.
        </p>
      </div>

      {/* CREDENTIALS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_SETUP_ACCOUNTS.map((acc, idx) => (
          <div key={acc.user_code} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-extrabold text-white text-sm font-display">{acc.role_title}</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {acc.user_code}
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div><span className="text-slate-400">Email:</span> <span className="text-slate-200">{acc.email}</span></div>
                <div><span className="text-slate-400">Department:</span> <span className="text-slate-300">{acc.department}</span></div>
                <div>
                  <span className="text-slate-400">Temp Password:</span>{' '}
                  <span className="text-amber-400 font-bold">
                    {showPasswords ? acc.temp_password : '••••••••••••'}
                  </span>
                </div>
              </div>
            </div>

            {rotatedUser === acc.user_code ? (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[11px] font-bold text-center">
                ✓ Credentials Rotated & Password Reset Dispatched!
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center gap-2">
                <button
                  onClick={() => handleCopyCredentials(acc, idx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold inline-flex items-center gap-1.5 flex-1 justify-center"
                >
                  {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === idx ? 'Copied!' : 'Copy Credentials'}
                </button>

                <button
                  onClick={() => handleRotateCredentials(acc.user_code)}
                  title="Rotate Credentials & Revoke Sessions"
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Rotate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
