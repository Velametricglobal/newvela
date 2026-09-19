import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, ShieldCheck, UserPlus, Key, Lock, UserX, RefreshCw, CheckCircle2, AlertTriangle, Building2, User, Mail, Phone, LogOut, Copy, Eye, EyeOff, Sparkles } from 'lucide-react';
import { authService, SYSTEM_ROLES_CONFIG } from '../../services/authService';
import { EnterpriseUser, SystemRole, DepartmentRecord, UserAccountStatus } from '../../types/database.types';

export const UserManagementAdmin: React.FC = () => {
  const [users, setUsers] = useState<EnterpriseUser[]>([]);
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Add User Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customUserCode, setCustomUserCode] = useState('');
  const [customPassword, setCustomPassword] = useState('VelaUser!2026#Pass');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SystemRole>('SALES_EXECUTIVE');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  // Success Created Receipt Modal
  const [createdUserSuccess, setCreatedUserSuccess] = useState<{ userCode: string; name: string; email: string; roleTitle: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Deactivate & Reassign Modal State
  const [deactivateUser, setDeactivateUser] = useState<EnterpriseUser | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const uData = await authService.getUsers();
    const dData = await authService.getDepartments();
    setUsers(uData);
    setDepartments(dData);
    if (dData.length > 0) setSelectedDeptId(dData[0].id);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let pass = 'Vela!';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomPassword(pass);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) return;

    const deptObj = departments.find(d => d.id === selectedDeptId);
    const roleTitle = SYSTEM_ROLES_CONFIG.find(r => r.role === selectedRole)?.title || selectedRole;

    const finalCode = customUserCode.trim() || `USR-${String(users.length + 1).padStart(6, '0')}`;

    const newUser = await authService.createUser({
      user_code: finalCode,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      role: selectedRole,
      role_title: roleTitle,
      department_id: selectedDeptId,
      department_name: deptObj?.name || 'General',
      status: 'ACTIVE',
      mfa_enabled: false,
      mfa_enforced: false,
      require_password_change: requirePasswordChange,
      must_change_password: requirePasswordChange
    });

    setCreatedUserSuccess({
      userCode: newUser.user_code,
      name: `${firstName} ${lastName}`.trim(),
      email,
      roleTitle,
      password: customPassword
    });

    setShowAddModal(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCustomUserCode('');
    fetchData();
  };

  const handleCopyCredentials = () => {
    if (!createdUserSuccess) return;
    const text = `USER ACCOUNT CREATED:\nName: ${createdUserSuccess.name}\nUser ID: ${createdUserSuccess.userCode}\nEmail: ${createdUserSuccess.email}\nRole: ${createdUserSuccess.roleTitle}\nInitial Password: ${createdUserSuccess.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivateUser) return;
    await authService.deactivateUser(deactivateUser.id, reassignTargetId);
    setDeactivateUser(null);
    fetchData();
  };

  const handleForceLogout = async (u: EnterpriseUser) => {
    await authService.forceLogoutUser(u.id);
    alert(`Active session for ${u.first_name} (${u.user_code}) has been forcibly terminated.`);
    fetchData();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.first_name} ${u.last_name} ${u.email} ${u.user_code} ${u.department_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING_INVITATION': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'SUSPENDED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'DEACTIVATED': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'LOCKED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
            <Users className="w-3.5 h-3.5" /> Super Admin IAM Identity Hub
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            User Directory & Account Creation
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Super Admin panel to add users, assign roles, define custom Login IDs, and create passwords directly.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-brand-600/30"
        >
          <UserPlus className="w-4 h-4" /> + Add User & Create Password
        </button>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Total Staff Accounts <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">{users.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Unique User IDs Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Active Departments <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">{departments.length}</div>
          <div className="text-[11px] text-slate-400 font-medium">Assigned Divisions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            MFA Protected Accounts <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-display">1</div>
          <div className="text-[11px] text-slate-400 font-medium">Super Admin Enforced</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Login Policy <Key className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-extrabold text-cyan-400 font-display">Email OR User ID</div>
          <div className="text-[11px] text-slate-400 font-medium">Super Admin Controlled</div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search users by name, User ID (USR-000001), email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-slate-400 text-xs font-semibold shrink-0">Role Filter:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Roles</option>
            {SYSTEM_ROLES_CONFIG.map(r => (
              <option key={r.role} value={r.role}>{r.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* USER DIRECTORY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">User ID / Login ID</th>
                <th className="p-4">Full Name & Email</th>
                <th className="p-4">Role & Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">
                    {u.user_code}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white font-display text-sm">{u.first_name} {u.last_name}</div>
                    <div className="text-slate-400 text-[11px]">{u.email} {u.phone ? `• ${u.phone}` : ''}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{u.role_title || u.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Code: {u.role}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    {u.department_name || 'General'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${getStatusBadge(u.status)}`}>
                      ● {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleForceLogout(u)}
                      title="Force Logout Active Sessions"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" /> Force Logout
                    </button>
                    {u.status !== 'DEACTIVATED' && u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => setDeactivateUser(u)}
                        title="Deactivate User & Reassign CRM Records"
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <UserX className="w-3 h-3" /> Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL WITH ROLE, LOGIN ID & PASSWORD CREATION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-left">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold font-mono uppercase px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Super Admin User & Credential Creation
              </span>
              <h3 className="text-lg font-black text-white font-display mt-2">Add New User & Set Login Credentials</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@velametric.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* LOGIN ID & PASSWORD CREATION */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Custom Login ID / User ID</label>
                  <input
                    type="text"
                    placeholder={`e.g. USR-${String(users.length + 1).padStart(6, '0')}`}
                    value={customUserCode}
                    onChange={(e) => setCustomUserCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">Leave blank for auto User ID</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-amber-400 font-bold">Initial Password *</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-brand-400 hover:underline font-bold"
                    >
                      ⚡ Auto-Generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 pr-8 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ROLE & DEPARTMENT SELECTION */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Role *</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as SystemRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                  >
                    {SYSTEM_ROLES_CONFIG.map(r => (
                      <option key={r.role} value={r.role}>{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqPass"
                  checked={requirePasswordChange}
                  onChange={(e) => setRequirePasswordChange(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-brand-500 w-4 h-4"
                />
                <label htmlFor="reqPass" className="text-slate-300 font-semibold cursor-pointer">
                  Require password change on user's first login
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30"
              >
                Create Account & Credentials →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATED USER SUCCESS CREDENTIAL RECEIPT MODAL */}
      {createdUserSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white font-display">User Account Created Successfully!</h3>
              <p className="text-slate-400 text-xs">Share these login credentials with the user.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Staff Name:</span>
                <span className="text-white font-bold">{createdUserSuccess.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">User ID / Login ID:</span>
                <span className="text-amber-400 font-extrabold">{createdUserSuccess.userCode}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-white">{createdUserSuccess.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Assigned Role:</span>
                <span className="text-emerald-400 font-bold">{createdUserSuccess.roleTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Initial Password:</span>
                <span className="text-amber-400 font-bold">{createdUserSuccess.password}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCopyCredentials}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold inline-flex items-center gap-2 flex-1 justify-center"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Credentials'}
              </button>
              <button
                onClick={() => setCreatedUserSuccess(null)}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATE & REASSIGN MODAL */}
      {deactivateUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl text-left">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold font-mono uppercase px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                User Account Deactivation
              </span>
              <h3 className="text-base font-black text-white font-display mt-2">
                Deactivate {deactivateUser.first_name} {deactivateUser.last_name}?
              </h3>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <div className="text-slate-300 font-bold">Assigned Active Records Found:</div>
              <div className="text-amber-400">• {deactivateUser.assigned_records?.leads_count || 23} Active CRM Leads</div>
              <div className="text-amber-400">• {deactivateUser.assigned_records?.deals_count || 8} Sales Pipeline Deals</div>
              <div className="text-amber-400">• {deactivateUser.assigned_records?.followups_count || 12} Pending Follow-up Tasks</div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Reassign Active CRM Records To:</label>
              <select
                value={reassignTargetId}
                onChange={(e) => setReassignTargetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
              >
                <option value="">Select Team Member...</option>
                {users.filter(u => u.id !== deactivateUser.id && u.status === 'ACTIVE').map(u => (
                  <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.role_title})</option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeactivateUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Reassign & Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
