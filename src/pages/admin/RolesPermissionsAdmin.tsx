import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, XCircle, Plus, Edit2, Sparkles, Key, Check, Info } from 'lucide-react';
import { SYSTEM_ROLES_CONFIG } from '../../services/authService';
import { SystemRole } from '../../types/database.types';

interface PermissionModule {
  name: string;
  key: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'send')[];
}

const MODULES_LIST: PermissionModule[] = [
  { name: 'CRM Leads & Contacts', key: 'leads', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Sales Pipeline & Deals', key: 'deals', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Direct WhatsApp & Calling', key: 'communication', actions: ['view', 'create', 'send'] },
  { name: 'Promotional Reel Campaigns', key: 'campaigns', actions: ['view', 'create', 'approve', 'send'] },
  { name: 'Events & Auditions', key: 'events', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Website CMS & Builder', key: 'website', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Quotations & Invoices', key: 'finance', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
  { name: 'User Accounts & Roles', key: 'users', actions: ['view', 'create', 'edit', 'delete'] },
  { name: 'Security & System Settings', key: 'settings', actions: ['view', 'edit'] }
];

export const RolesPermissionsAdmin: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<SystemRole>('SALES_EXECUTIVE');
  const [customRoles, setCustomRoles] = useState<{ id: string; name: string; desc: string }[]>([
    { id: 'role-custom-1', name: 'Digital Marketing Executive', desc: 'Can create individual campaigns and view reels; cannot manage users or finance.' }
  ]);

  // Permission Matrix State (Module.Action -> Allowed)
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, boolean>>({
    'leads.view': true, 'leads.create': true, 'leads.edit': true, 'leads.delete': false,
    'deals.view': true, 'deals.create': true, 'deals.edit': true, 'deals.delete': false,
    'communication.view': true, 'communication.send': true,
    'campaigns.view': true, 'campaigns.create': false, 'campaigns.approve': false, 'campaigns.send': false,
    'finance.view': true, 'finance.create': false,
    'users.view': false, 'users.create': false
  });

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const togglePermission = (permKey: string) => {
    setPermissionMatrix((prev) => ({
      ...prev,
      [permKey]: !prev[permKey]
    }));
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    setCustomRoles((prev) => [
      ...prev,
      { id: `role-${Date.now()}`, name: newRoleName, desc: newRoleDesc || 'Custom enterprise role.' }
    ]);
    setNewRoleName('');
    setNewRoleDesc('');
    setShowCreateRoleModal(false);
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
            <Shield className="w-3.5 h-3.5" /> Granular Access Control
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Roles & Permission Matrix
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure system roles, custom enterprise roles, and backend record authorization rules across every platform module.
          </p>
        </div>

        <button
          onClick={() => setShowCreateRoleModal(true)}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-brand-600/30"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* ROLE SELECTOR CARDS */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white font-display">1. Select Role to View / Configure Matrix</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SYSTEM_ROLES_CONFIG.map((r) => (
            <button
              key={r.role}
              onClick={() => setSelectedRole(r.role)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === r.role
                  ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-white text-xs">{r.title}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{r.role}</div>
            </button>
          ))}

          {customRoles.map((cr) => (
            <button
              key={cr.id}
              onClick={() => setSelectedRole(cr.name)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedRole === cr.name
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-amber-400 text-xs">{cr.name}</div>
              <div className="text-[10px] text-amber-300/60 font-mono">CUSTOM ROLE</div>
            </button>
          ))}
        </div>
      </div>

      {/* PERMISSION MATRIX TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Active Scope</span>
            <h3 className="text-base font-extrabold text-white font-display">
              Permission Matrix for {SYSTEM_ROLES_CONFIG.find(r => r.role === selectedRole)?.title || selectedRole}
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Info className="w-3.5 h-3.5 text-brand-400" /> Backend RLS Enforced
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 border-b border-slate-800">Module / Resource</th>
                <th className="p-4 border-b border-slate-800 text-center">View</th>
                <th className="p-4 border-b border-slate-800 text-center">Create</th>
                <th className="p-4 border-b border-slate-800 text-center">Edit</th>
                <th className="p-4 border-b border-slate-800 text-center">Delete</th>
                <th className="p-4 border-b border-slate-800 text-center">Approve / Launch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {MODULES_LIST.map((mod) => (
                <tr key={mod.key} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white font-display">
                    {mod.name}
                  </td>
                  {['view', 'create', 'edit', 'delete', 'approve'].map((act) => {
                    const isSupported = mod.actions.includes(act as any);
                    const permKey = `${mod.key}.${act}`;
                    const isAllowed = selectedRole === 'SUPER_ADMIN' ? true : !!permissionMatrix[permKey];

                    if (!isSupported) {
                      return <td key={act} className="p-4 text-center text-slate-600 font-mono text-[10px]">N/A</td>;
                    }

                    return (
                      <td key={act} className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(permKey)}
                          disabled={selectedRole === 'SUPER_ADMIN'}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            isAllowed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 hover:text-slate-400'
                          }`}
                        >
                          {isAllowed ? <Check className="w-4 h-4" /> : '—'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE CUSTOM ROLE MODAL */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomRole} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">Create Custom Role</h3>
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Digital Marketing Executive"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Description</label>
              <textarea
                rows={3}
                placeholder="Describe role responsibilities and boundaries..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateRoleModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
              >
                Save Role & Matrix
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
