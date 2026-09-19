import React, { useEffect, useState } from 'react';
import {
  delegationService,
  DelegatedTask,
  EmployeeProfile,
  AutoRoutingSettings
} from '../../services/delegationService';
import { leadService } from '../../services/leadService';
import { Lead, LeadPriority, LeadStatus } from '../../types/database.types';
import {
  UserCheck, CheckSquare, Users, Clock, AlertCircle, Plus, Search,
  Filter, Calendar, ArrowRight, Shield, Bell, Send, CheckCircle2,
  Trash2, Sliders, Sparkles, Building2, Tag, ChevronRight, X
} from 'lucide-react';

export const DelegationAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'tasks' | 'workload' | 'rules'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<DelegatedTask[]>([]);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [routingSettings, setRoutingSettings] = useState<AutoRoutingSettings>(delegationService.getAutoRoutingSettings());

  // Search & Filter state
  const [leadSearch, setLeadSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [leadFilterAssignee, setLeadFilterAssignee] = useState<string>('ALL');
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('ALL');
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<string>('ALL');

  // Success Notification banner
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Task Modal State
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('SALES-001');
  const [newTaskPriority, setNewTaskPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'>('HIGH');
  const [newTaskCategory, setNewTaskCategory] = useState<DelegatedTask['category']>('LEAD_FOLLOWUP');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAdminNotes, setNewTaskAdminNotes] = useState('');

  // Quick Assign Lead Modal
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState('SALES-001');
  const [selectedLeadPriority, setSelectedLeadPriority] = useState<LeadPriority>('HIGH');
  const [leadAdminNote, setLeadAdminNote] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('vela-delegated-task-updated', handleUpdate);
    window.addEventListener('vela-lead-assigned', handleUpdate);
    return () => {
      window.removeEventListener('vela-delegated-task-updated', handleUpdate);
      window.removeEventListener('vela-lead-assigned', handleUpdate);
    };
  }, []);

  const loadData = async () => {
    const leadsData = await leadService.getLeads();
    const tasksData = await delegationService.getTasks();
    const emps = delegationService.getEmployees();

    // Recompute live stats for employees
    const updatedEmps = emps.map(emp => {
      const activeLeads = leadsData.filter(l => l.assigned_to === emp.user_code && l.status !== 'WON' && l.status !== 'LOST').length;
      const pendingTasks = tasksData.filter(t => t.assigned_to === emp.user_code && t.status !== 'COMPLETED').length;
      const totalLoad = activeLeads + pendingTasks;
      return {
        ...emp,
        active_leads_count: activeLeads,
        pending_tasks_count: pendingTasks,
        capacity_status: (totalLoad > 5 ? 'HEAVY' : totalLoad > 2 ? 'MODERATE' : 'AVAILABLE') as 'AVAILABLE' | 'MODERATE' | 'HEAVY'
      };
    });

    setLeads(leadsData);
    setTasks(tasksData);
    setEmployees(updatedEmps);
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Assign lead directly
  const handleConfirmLeadAssignment = async () => {
    if (!assigningLead) return;
    const emp = employees.find(e => e.user_code === selectedEmployeeCode);
    await delegationService.assignLeadToEmployee(
      assigningLead.id,
      selectedEmployeeCode,
      selectedLeadPriority,
      leadAdminNote
    );
    setAssigningLead(null);
    setLeadAdminNote('');
    showNotification(`Lead ${assigningLead.lead_code} successfully assigned to ${emp?.full_name || selectedEmployeeCode}!`);
    loadData();
  };

  // Quick inline re-assign from table dropdown
  const handleQuickLeadAssign = async (leadId: string, employeeCode: string) => {
    const emp = employees.find(e => e.user_code === employeeCode);
    await delegationService.assignLeadToEmployee(leadId, employeeCode, 'HIGH', 'Assigned directly via Leads Table.');
    showNotification(`Lead reassigned to ${emp?.full_name || employeeCode}.`);
    loadData();
  };

  // Create delegated task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const emp = employees.find(e => e.user_code === newTaskAssignee);
    await delegationService.createTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      assigned_to: newTaskAssignee,
      assigned_name: emp?.full_name || newTaskAssignee,
      assigned_role: emp?.role_title || 'Assigned Representative',
      department: emp?.department || 'Operations',
      priority: newTaskPriority,
      status: 'PENDING',
      due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : new Date(Date.now() + 86400000 * 2).toISOString(),
      category: newTaskCategory,
      delegated_by: 'SUPERADMIN-001',
      admin_notes: newTaskAdminNotes
    });

    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskAdminNotes('');
    showNotification(`Task assigned to ${emp?.full_name}!`);
    loadData();
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await delegationService.updateTaskStatus(taskId, nextStatus);
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await delegationService.deleteTask(taskId);
    showNotification('Delegated task removed.');
    loadData();
  };

  const handleSaveRoutingRules = (e: React.FormEvent) => {
    e.preventDefault();
    delegationService.saveAutoRoutingSettings(routingSettings);
    showNotification('Automated assignment & routing rules saved.');
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchSearch =
      `${l.first_name} ${l.last_name} ${l.company_name} ${l.service_interest} ${l.lead_code}`
        .toLowerCase()
        .includes(leadSearch.toLowerCase());
    const matchAssignee =
      leadFilterAssignee === 'ALL'
        ? true
        : leadFilterAssignee === 'UNASSIGNED'
        ? !l.assigned_to || l.assigned_to === 'user-1'
        : l.assigned_to === leadFilterAssignee;
    return matchSearch && matchAssignee;
  });

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    const matchSearch =
      `${t.title} ${t.description} ${t.assigned_name} ${t.department}`
        .toLowerCase()
        .includes(taskSearch.toLowerCase());
    const matchStatus = taskFilterStatus === 'ALL' ? true : t.status === taskFilterStatus;
    const matchAssignee = taskFilterAssignee === 'ALL' ? true : t.assigned_to === taskFilterAssignee;
    return matchSearch && matchStatus && matchAssignee;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Admin Command • Delegation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Task & Lead Assignment Console
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Empower administrators to seamlessly delegate CRM leads, allocate critical operational tasks, balance employee workloads, and automate routing sequences.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Delegate New Task
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Workload Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map(emp => (
          <div
            key={emp.user_code}
            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${emp.avatar_color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {emp.full_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-xs leading-tight">{emp.full_name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{emp.user_code}</div>
                </div>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${
                emp.capacity_status === 'AVAILABLE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : emp.capacity_status === 'MODERATE'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {emp.capacity_status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Leads</span>
                <span className="text-white font-bold font-mono text-sm">{emp.active_leads_count}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Open Tasks</span>
                <span className="text-brand-400 font-bold font-mono text-sm">{emp.pending_tasks_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'leads' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Assign Leads to Employees</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-white font-mono">
            {leads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'tasks' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Delegated Tasks Hub</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-white font-mono">
            {tasks.filter(t => t.status !== 'COMPLETED').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('workload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'workload' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Employee Workload Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'rules' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Auto-Routing Settings</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: ASSIGN LEADS TO EMPLOYEES */}
      {/* ===================================================================== */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search leads by name, company, code, or service..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={leadFilterAssignee}
                onChange={e => setLeadFilterAssignee(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="ALL">All Assignees</option>
                <option value="UNASSIGNED">Unassigned Only</option>
                {employees.map(emp => (
                  <option key={emp.user_code} value={emp.user_code}>
                    {emp.full_name} ({emp.user_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Lead / Client</th>
                    <th className="p-3.5">Service Interest</th>
                    <th className="p-3.5">Pipeline Status</th>
                    <th className="p-3.5">Current Assignee</th>
                    <th className="p-3.5">Quick Delegate Employee</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.map(lead => {
                    const assignedEmp = employees.find(e => e.user_code === lead.assigned_to);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white font-display">
                            {lead.first_name} {lead.last_name || ''}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {lead.company_name || 'Individual'} • <span className="font-mono text-amber-400">{lead.lead_code}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="text-slate-200 font-medium">{lead.service_interest}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">{lead.budget_range}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20">
                            {lead.status}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {assignedEmp ? (
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${assignedEmp.avatar_color} flex items-center justify-center text-white text-[9px] font-bold`}>
                                {assignedEmp.full_name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-200">{assignedEmp.full_name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono italic">Unassigned</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <select
                            value={lead.assigned_to || ''}
                            onChange={e => handleQuickLeadAssign(lead.id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 hover:border-brand-500 rounded-lg px-2.5 py-1 text-[11px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                          >
                            <option value="" disabled>Choose Employee...</option>
                            {employees.map(emp => (
                              <option key={emp.user_code} value={emp.user_code}>
                                {emp.full_name} ({emp.role_title})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setAssigningLead(lead);
                              setSelectedEmployeeCode(lead.assigned_to || 'SALES-001');
                              setSelectedLeadPriority(lead.priority || 'HIGH');
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Detailed Assign
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                        No leads match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: DELEGATED TASKS HUB */}
      {/* ===================================================================== */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search delegated tasks by title, assignee, or notes..."
                value={taskSearch}
                onChange={e => setTaskSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={taskFilterStatus}
                onChange={e => setTaskFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select
                value={taskFilterAssignee}
                onChange={e => setTaskFilterAssignee(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.user_code} value={emp.user_code}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isDone = task.status === 'COMPLETED';
              const assignedEmp = employees.find(e => e.user_code === task.assigned_to);

              return (
                <div
                  key={task.id}
                  className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDone
                      ? 'border-slate-800/40 bg-slate-950/40 opacity-70'
                      : 'border-slate-800 hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id, task.status)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-700 text-transparent hover:border-brand-500'
                      }`}
                      title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      ✓
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>

                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {task.category.replace('_', ' ')}
                        </span>

                        {task.linked_entity && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-300 font-mono">
                            {task.linked_entity.label}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm font-bold truncate ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                        <span>Delegated by: <strong className="text-slate-400">{task.delegated_by}</strong></span>
                        <span>•</span>
                        <span>Due: <strong className="text-slate-300">{new Date(task.due_date).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Assignee Pill & Delete */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    {assignedEmp && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${assignedEmp.avatar_color} flex items-center justify-center text-white text-[9px] font-bold`}>
                          {assignedEmp.full_name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white leading-tight">{assignedEmp.full_name}</div>
                          <div className="text-[9px] text-amber-400 font-mono">{assignedEmp.user_code}</div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No delegated tasks match your filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: EMPLOYEE WORKLOAD MATRIX */}
      {/* ===================================================================== */}
      {activeTab === 'workload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map(emp => {
            const empLeads = leads.filter(l => l.assigned_to === emp.user_code);
            const empTasks = tasks.filter(t => t.assigned_to === emp.user_code && t.status !== 'COMPLETED');

            return (
              <div key={emp.user_code} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${emp.avatar_color} flex items-center justify-center text-white font-bold text-base shadow-md`}>
                      {emp.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{emp.full_name}</h3>
                      <div className="text-xs text-amber-400 font-mono">{emp.role_title} • {emp.department}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{emp.user_code} ({emp.email})</div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border ${
                    emp.capacity_status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : emp.capacity_status === 'MODERATE'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {emp.capacity_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Leads</span>
                    <span className="text-lg font-black text-white">{empLeads.length}</span>
                    <p className="text-[10px] text-slate-500">Clients in deal pipeline</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Tasks</span>
                    <span className="text-lg font-black text-brand-400">{empTasks.length}</span>
                    <p className="text-[10px] text-slate-500">Action items assigned</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Recent Active Assignments</span>
                    <button
                      onClick={() => {
                        setNewTaskAssignee(emp.user_code);
                        setIsNewTaskModalOpen(true);
                      }}
                      className="text-brand-400 hover:text-brand-300 text-[11px] font-semibold"
                    >
                      + Assign Task
                    </button>
                  </div>

                  {empTasks.slice(0, 3).map(t => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="truncate flex-1 text-slate-300 pr-2">{t.title}</span>
                      <span className="text-[9px] font-mono text-rose-400 shrink-0">{t.priority}</span>
                    </div>
                  ))}

                  {empTasks.length === 0 && (
                    <div className="text-center py-3 text-slate-500 text-xs">
                      No pending tasks assigned to this employee.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: AUTOMATED ROUTING SETTINGS */}
      {/* ===================================================================== */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveRoutingRules} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 max-w-3xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-400" /> Automated Lead Distribution & Dispatch Rules
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure how newly captured website quotes, event passes, and inquiry forms are automatically assigned across employees.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Distribution Strategy</label>
              <select
                value={routingSettings.strategy}
                onChange={e => setRoutingSettings({ ...routingSettings, strategy: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-brand-500"
              >
                <option value="ROUND_ROBIN">Round-Robin (Fair Rotation Among Available Staff)</option>
                <option value="DEPARTMENT_MATCH">Department & Service Matching (Automated by Category)</option>
                <option value="MANUAL_APPROVAL">Strict Manual Approval (Super Admin Must Assign Each Lead)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Sales Lead Handler</label>
                <select
                  value={routingSettings.default_sales_agent}
                  onChange={e => setRoutingSettings({ ...routingSettings, default_sales_agent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="SALES-001">Rahul Sharma (SALES-001)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Event Pass Handler</label>
                <select
                  value={routingSettings.default_event_manager}
                  onChange={e => setRoutingSettings({ ...routingSettings, default_event_manager: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="EVENT-001">Meera Rawat (EVENT-001)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Marketing Campaign Handler</label>
                <select
                  value={routingSettings.default_marketing_lead}
                  onChange={e => setRoutingSettings({ ...routingSettings, default_marketing_lead: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="MARKETING-001">Priya Mehta (MARKETING-001)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Operations Staff Handler</label>
                <select
                  value={routingSettings.default_operations_staff}
                  onChange={e => setRoutingSettings({ ...routingSettings, default_operations_staff: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="VIEWER-001">Operations Staff (VIEWER-001)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={routingSettings.auto_notify_email}
                  onChange={e => setRoutingSettings({ ...routingSettings, auto_notify_email: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 border-slate-700 bg-slate-950"
                />
                <span className="text-xs text-slate-300 font-medium">Send automatic email notification to employee upon assignment</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={routingSettings.auto_notify_whatsapp}
                  onChange={e => setRoutingSettings({ ...routingSettings, auto_notify_whatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600 border-slate-700 bg-slate-950"
                />
                <span className="text-xs text-slate-300 font-medium">Send instant WhatsApp push notification to employee device</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-slate-200 transition-colors"
            >
              Save Routing Rules
            </button>
          </div>
        </form>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: DELEGATE NEW TASK */}
      {/* ===================================================================== */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Delegate New Task to Employee</h3>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up with Anish Kapoor on DPR proposal"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assignee Employee *</label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {employees.map(emp => (
                    <option key={emp.user_code} value={emp.user_code}>
                      {emp.full_name} ({emp.role_title} • {emp.user_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="URGENT">🚨 URGENT (Immediate Action)</option>
                    <option value="HIGH">⚡ HIGH (Today)</option>
                    <option value="NORMAL">📌 NORMAL (This Week)</option>
                    <option value="LOW">☕ LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="LEAD_FOLLOWUP">Lead Outreach & Call</option>
                    <option value="EVENT_LOGISTICS">Event Production & Staging</option>
                    <option value="MARKETING_CAMPAIGN">Campaign & Reel Asset</option>
                    <option value="DOCUMENT_DRAFT">Work Agreement / Invoice</option>
                    <option value="OPERATIONS">General Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Specific requirements or checklist for this employee..."
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
                >
                  Confirm & Delegate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: DETAILED LEAD ASSIGNMENT */}
      {/* ===================================================================== */}
      {assigningLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {assigningLead.lead_code}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Assign Lead: {assigningLead.first_name} {assigningLead.last_name || ''}
                </h3>
              </div>
              <button
                onClick={() => setAssigningLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300">
                <strong className="text-white">Service:</strong> {assigningLead.service_interest}
              </div>
              <div className="text-slate-300">
                <strong className="text-white">Company:</strong> {assigningLead.company_name || 'Individual'}
              </div>
              <div className="text-slate-300">
                <strong className="text-white">Contact:</strong> {assigningLead.phone || assigningLead.email}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign To Employee *</label>
                <select
                  value={selectedEmployeeCode}
                  onChange={e => setSelectedEmployeeCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {employees.map(emp => (
                    <option key={emp.user_code} value={emp.user_code}>
                      {emp.full_name} ({emp.role_title} • {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Lead Priority</label>
                <select
                  value={selectedLeadPriority}
                  onChange={e => setSelectedLeadPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="HIGH">🔥 High Priority (Immediate Follow-up)</option>
                  <option value="MEDIUM">⚡ Medium Priority</option>
                  <option value="LOW">Standard Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin Instructions for Employee</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Call client regarding DPR report and schedule closing call by Friday..."
                  value={leadAdminNote}
                  onChange={e => setLeadAdminNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssigningLead(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeadAssignment}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default DelegationAdmin;
