import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, INITIAL_SETUP_AGENT_USERS } from '../../context/AuthContext';
import { AgentRole } from '../../types/database.types';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, UserCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput.trim() || !password.trim()) {
      setError('Please enter both your User ID / Email and Password.');
      return;
    }

    setLoading(true);

    const result = await login(loginInput, password);
    setLoading(false);

    if (result.success && result.defaultPath) {
      navigate(result.defaultPath);
    } else {
      setError(result.error || 'Invalid credentials. Access Denied.');
    }
  };

  const handleFillCredentials = (userCode: string) => {
    const acc = INITIAL_SETUP_AGENT_USERS[userCode];
    if (acc) {
      setLoginInput(acc.user_code);
      setPassword(acc.password[0]);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-7 shadow-2xl backdrop-blur relative z-10 text-left">
        
        {/* BRAND LOGO & HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-2xl shadow-glow-brand mx-auto">
            V
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-display tracking-tight uppercase">
              VELAMETRIC GLOBAL
            </h1>
            <p className="text-slate-400 text-xs mt-1">Protected Enterprise Dashboard Login</p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold text-xs leading-relaxed flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">User ID OR Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. SUPERADMIN-001 or superadmin@example.com"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Account Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-slate-400 font-medium cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-brand-500" />
              Remember device
            </label>
            <a href="#forgot" onClick={() => alert('Password reset verification has been dispatched to your email.')} className="text-brand-400 font-bold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-glow-brand transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In To Dashboard →'}
          </button>
        </form>

        {/* QUICK CREDENTIAL SELECTOR FOR FIRST-TIME USERS */}
        <div className="pt-5 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
            <span className="flex items-center gap-1.5"><Key className="w-3 h-3" /> Select Initial Account Credentials</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleFillCredentials('SUPERADMIN-001')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
            >
              <div className="font-bold text-white">👑 Super Admin</div>
              <div className="text-[10px] text-amber-400 font-mono">SUPERADMIN-001</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('SALES-MANAGER-001')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
            >
              <div className="font-bold text-white">💼 Sales Manager</div>
              <div className="text-[10px] text-amber-400 font-mono">SALES-MANAGER-001</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('EVENT-001')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
            >
              <div className="font-bold text-white">🎟️ Event Manager</div>
              <div className="text-[10px] text-amber-400 font-mono">EVENT-001</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('FINANCE-001')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
            >
              <div className="font-bold text-white">💰 Finance Manager</div>
              <div className="text-[10px] text-amber-400 font-mono">FINANCE-001</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
