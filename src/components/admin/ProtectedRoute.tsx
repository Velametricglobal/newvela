import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Key, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated, isPathAllowed, completePasswordChange } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [changedSuccess, setChangedSuccess] = useState(false);

  // 1. Mandatory Login Guard: If not authenticated, redirect to /login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. Forced Password Change on First Login
  if (currentUser.must_change_password && !changedSuccess) {
    const handlePasswordChangeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }

      completePasswordChange(newPassword);
      setChangedSuccess(true);
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-left">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white font-display uppercase">First Login: Password Setup</h2>
            <p className="text-slate-400 text-xs">
              Welcome, <span className="text-white font-bold">{currentUser.full_name}</span> ({currentUser.user_code}). For security compliance, please set your permanent password.
            </p>
          </div>

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-bold mb-1">New Permanent Password *</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                placeholder="Re-enter password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg"
            >
              Save Password & Continue →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Permission Guard: Check if active user role is authorized for current path
  const currentPathAllowed = isPathAllowed(location.pathname);

  if (!currentPathAllowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <Shield className="w-16 h-16 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">403 — Access Denied</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your current user role <span className="text-amber-400 font-bold font-mono">({currentUser.role})</span> does not have authorization to view this module.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
            >
              Go to My Permitted Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
