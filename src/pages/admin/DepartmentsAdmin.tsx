import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, ShieldCheck, UserCheck, Search } from 'lucide-react';
import { authService } from '../../services/authService';
import { DepartmentRecord } from '../../types/database.types';

export const DepartmentsAdmin: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await authService.getDepartments();
    setDepartments(data);
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;

    await authService.createDepartment({
      name: deptName,
      description: deptDesc,
      manager_name: managerName || 'Unassigned'
    });

    setShowAddModal(false);
    setDeptName('');
    setDeptDesc('');
    setManagerName('');
    fetchData();
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            <Building2 className="w-3.5 h-3.5" /> Organizational Structure
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Department Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create departments, assign division managers, and organize team members.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Create Department
        </button>
      </div>

      {/* DEPARTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5 text-brand-400" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                  {dept.members_count} Members
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white font-display">{dept.name}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{dept.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-mono">Manager:</span>
              <span className="text-amber-400 font-bold">{dept.manager_name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD DEPARTMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDept} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">Create New Department</h3>
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Media & Video Production"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department Description</label>
              <textarea
                rows={3}
                placeholder="Describe division functions..."
                value={deptDesc}
                onChange={(e) => setDeptDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Department Manager</label>
              <input
                type="text"
                placeholder="e.g. Meera Rawat"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
