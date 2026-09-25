import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';
import { crmService } from '../../services/crmService';
import { proposalInvoiceService } from '../../services/proposalInvoiceService';
import { delegationService, DelegatedTask } from '../../services/delegationService';
import { Lead, Deal, FollowUpTask, Invoice } from '../../types/database.types';
import {
  Users, DollarSign, Clock, TrendingUp, CheckCircle, ArrowRight, AlertTriangle,
  BarChart3, ShieldAlert, ShieldCheck, Activity, Target, Laptop, Globe, Calendar,
  Key, UserCheck, Video, MessageCircle, FileText, FolderKanban, Bell, FileCheck,
  Compass, Sparkles, CheckSquare, Layers, Star, CreditCard, Share2, BookOpen, Shield, Settings, Building2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardViewType, getDefaultDashboardForRole, ROLE_DASHBOARDS } from '../../config/roleDashboards';

export const Dashboard: React.FC = () => {
  const { formatAmount } = useCurrency();
  const { currentUser } = useAuth();
  const location = useLocation();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  // Active view layout (SALES, EVENT, MARKETING, EMPLOYEE, or ALL)
  const [activeView, setActiveView] = useState<DashboardViewType>(() => {
    return getDefaultDashboardForRole(currentUser?.role);
  });

  // Sync with role changes
  useEffect(() => {
    setActiveView(getDefaultDashboardForRole(currentUser?.role));
  }, [currentUser?.role]);

  // Listen to custom event when Super Admin toggles Master View Switcher in sidebar
  useEffect(() => {
    const handleViewChange = (e: CustomEvent<DashboardViewType>) => {
      setActiveView(e.detail);
    };
    window.addEventListener('vela-admin-view-change', handleViewChange as EventListener);
    return () => {
      window.removeEventListener('vela-admin-view-change', handleViewChange as EventListener);
    };
  }, []);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Employee delegated tasks state synchronized with delegationService
  const [delegatedTasks, setDelegatedTasks] = useState<DelegatedTask[]>([]);

  const loadDelegatedTasks = async () => {
    const userCode = currentUser?.user_code || 'VIEWER-001';
    const isSuper = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
    const allTasks = await delegationService.getTasks();
    if (isSuper) {
      setDelegatedTasks(allTasks);
    } else {
      const myTasks = allTasks.filter(t => t.assigned_to === userCode);
      setDelegatedTasks(myTasks);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await delegationService.updateTaskStatus(taskId, nextStatus);
    await loadDelegatedTasks();
  };

  useEffect(() => {
    loadDelegatedTasks();
    const handleUpdate = () => loadDelegatedTasks();
    window.addEventListener('vela-delegated-task-updated', handleUpdate);
    return () => {
      window.removeEventListener('vela-delegated-task-updated', handleUpdate);
    };
  }, [currentUser?.user_code, currentUser?.role]);

  useEffect(() => {
    leadService.getLeads().then(setLeads);
    crmService.getDeals().then(setDeals);
    crmService.getFollowUps().then(setFollowUps);
    proposalInvoiceService.getInvoices().then(setInvoices);
  }, []);

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const pendingInvoices = invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.total, 0);
  const openDealsValue = deals.filter(d => d.status === 'OPEN').reduce((sum, d) => sum + d.value, 0);
  const pendingFollowUps = followUps.filter(f => f.status === 'PENDING');

  // Resolved view to render
  const currentViewConfig = ROLE_DASHBOARDS[activeView] || ROLE_DASHBOARDS.SALES;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
              {currentViewConfig.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">ROLE-BASED WORKSPACE</span>
            {isSuperAdmin && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                SUPER ADMIN
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
            <span>{currentViewConfig.title}</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            {currentViewConfig.description}
          </p>
        </div>

        {/* Quick View Switcher Pills (Super Admin & Admin Only) */}
        {isSuperAdmin && (
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveView('SALES');
                localStorage.setItem('vela_admin_active_view', 'SALES');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeView === 'SALES' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>1. Sales</span>
            </button>

            <button
              onClick={() => {
                setActiveView('EVENT');
                localStorage.setItem('vela_admin_active_view', 'EVENT');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeView === 'EVENT' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>2. Event</span>
            </button>

            <button
              onClick={() => {
                setActiveView('MARKETING');
                localStorage.setItem('vela_admin_active_view', 'MARKETING');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeView === 'MARKETING' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3. Marketing</span>
            </button>

            <button
              onClick={() => {
                setActiveView('EMPLOYEE');
                localStorage.setItem('vela_admin_active_view', 'EMPLOYEE');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeView === 'EMPLOYEE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>4. Employee</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. SALES DASHBOARD VIEW (For SALES-001 & SALES-MANAGER-001) */}
      {/* ========================================================================= */}
      {activeView === 'SALES' && (
        <div className="space-y-6">

          {/* Sales KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Total Inquiries</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Users className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{leads.length}</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">↑ +18% inquiry inflow</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Pipeline Value</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{formatAmount(openDealsValue)}</div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">{deals.length} active deals in pipeline</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Settled Revenue</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><DollarSign className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{formatAmount(totalRevenue)}</div>
              <div className="text-[11px] text-amber-400 mt-2 font-medium">{formatAmount(pendingInvoices)} pending receivables</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Due Follow-ups</span>
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Clock className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{pendingFollowUps.length}</div>
              <div className="text-[11px] text-rose-400 mt-2 font-medium">Immediate call-backs required</div>
            </div>
          </div>

          {/* Sales Quick Action Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/leads"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Leads CRM
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/pipeline"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Sales Pipeline
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/proposals"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                New Proposal
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/invoices"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Tax Invoices
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Sales Tables: Recent Inquiries & Due Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white">Recent Sales Inquiries</h3>
                  <p className="text-xs text-slate-400">Captured from public landing pages & quote requests</p>
                </div>
                <Link to="/admin/leads" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                  View All Leads →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase bg-slate-950/60">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Service Interest</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leads.slice(0, 5).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">
                          {l.first_name} {l.last_name}
                          <span className="block text-[10px] text-slate-400 font-normal">{l.company_name}</span>
                        </td>
                        <td className="p-3 text-slate-300">{l.service_interest}</td>
                        <td className="p-3 text-slate-300 font-mono">{l.budget_range}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link to="/admin/leads" className="text-brand-400 hover:underline font-bold">Manage</Link>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          No inquiries recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-white">Actionable Follow-ups</h3>
                <Link to="/admin/follow-ups" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
                  All Tasks →
                </Link>
              </div>
              <div className="space-y-3">
                {pendingFollowUps.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{task.lead_name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{task.title}</p>
                    <div className="text-[10px] text-slate-500">Assigned: {task.assigned_to || 'Sales Team'}</div>
                  </div>
                ))}
                {pendingFollowUps.length === 0 && (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    All follow-up tasks are complete.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EVENT DASHBOARD VIEW (For EVENT-001) */}
      {/* ========================================================================= */}
      {activeView === 'EVENT' && (
        <div className="space-y-6">

          {/* Event KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Upcoming Events</span>
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Calendar className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">4</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">2 Auditions + 2 Galas</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Passes & Registrations</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Users className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">1,420</div>
              <div className="text-[11px] text-amber-400 mt-2 font-medium">85% venue capacity claimed</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Staging Packages</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Laptop className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">12</div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">Active in Services CMS catalog</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Production Media</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><FolderKanban className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">48</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Stage renders & show reels</div>
            </div>
          </div>

          {/* Event Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/events"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                Events, Auditions & Ticket Passes
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/media"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                Media Library & Production Assets
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Event Schedules & Staging Logistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                Upcoming Staged Events & Auditions
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Dehradun Music & Talent Audition 2026</div>
                    <div className="text-slate-400 text-[11px]">Town Hall Arena • 420 Passes Issued</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    NEXT WEEK
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">North India Corporate Excellence Summit</div>
                    <div className="text-slate-400 text-[11px]">Grand Regency Convention • 250 Delegates</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                    IN 2 WEEKS
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Uttarakhand Film Festival Staging & Lights</div>
                    <div className="text-slate-400 text-[11px]">Dapflix Outdoor Stage • Rider Verified</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                    PLANNING
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Technical Staging Readiness Checklist
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-200">Stage Truss & Automated Beam Lighting</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-200">Line Array PA & Sound Engineering Setup</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Tested
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-200">Audition Barcode Ticket Scanner App</span>
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Synced
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-200">VIP Celebrity Greenroom Hospitality Rider</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MARKETING DASHBOARD VIEW (For MARKETING-001) */}
      {/* ========================================================================= */}
      {activeView === 'MARKETING' && (
        <div className="space-y-6">

          {/* Marketing KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Campaigns</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Target className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">6</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">WhatsApp & Email broadcasts</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Reel Impressions</span>
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Video className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">84.5K</div>
              <div className="text-[11px] text-rose-400 mt-2 font-medium">Across Dapflix Reels studio</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Conversion Velocity</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">28.4%</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">Inquiry to client win rate</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Content & SEO Pages</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Layers className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">16</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Optimized service landings</div>
            </div>
          </div>

          {/* Marketing Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/campaigns"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Campaigns
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/marketing/reels"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                Reel Marketing
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/communication"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Broadcast Hub
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/blog"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Blog CMS
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/talents"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group col-span-2 sm:col-span-4"
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Talent Portfolio & Account Management
              </span>
              <span className="text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                Manage Directory <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Lead Channels & Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Lead Acquisition Sources
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-200 font-semibold">Direct Website Quote Form</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono">54% Share</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-200 font-semibold">Event & Audition Pass Registrations</span>
                  </div>
                  <span className="font-bold text-amber-400 font-mono">26% Share</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-rose-400" />
                    <span className="text-slate-200 font-semibold">Instagram Reels & Dapflix Video Teasers</span>
                  </div>
                  <span className="font-bold text-rose-400 font-mono">20% Share</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                Latest Content & Case Studies
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">DHCS Growth Story in Dehradun</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">PUBLISHED</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">From a Local Service to a Trusted Healthcare Brand</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Ekraahee Cultural Fest Production</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold">CASE STUDY</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">Multi-camera live streaming & automated attendee badges</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">Celebrity Management Showreel 2026</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] font-bold">REEL</span>
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-1">Top viral hooks for artist booking showcase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WORKING EMPLOYEE DASHBOARD VIEW (For VIEWER-001 / General Staff) */}
      {/* ========================================================================= */}
      {activeView === 'EMPLOYEE' && (
        <div className="space-y-6">

          {/* Employee Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">My Assignments</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckSquare className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {delegatedTasks.filter(t => t.status !== 'COMPLETED').length}
              </div>
              <div className="text-[11px] text-amber-400 mt-2 font-medium">Pending execution today</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Unread Alerts</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Bell className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">3</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">System updates & notices</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Team Channels</span>
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><MessageCircle className="w-4 h-4" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">4</div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">Internal chat & announcements</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Internal Staff Chat</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><MessageCircle className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">Active</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">Team messaging channels</div>
            </div>
          </div>

          {/* Employee Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/team-chat"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Internal Team Chat
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/notifications"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                Notifications
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/communication"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                Communication
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/media"
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-200 transition-all group"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-purple-400" />
                Assigned Media
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Interactive Checklist & Recent Communications */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    Assigned Task Action Checklist
                  </h4>
                  <p className="text-xs text-slate-400">Click to check off tasks delegated by Admin</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    {delegatedTasks.filter(t => t.status === 'COMPLETED').length} / {delegatedTasks.length} Done
                  </span>
                  {isSuperAdmin && (
                    <Link
                      to="/admin/delegation"
                      className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                    >
                      <UserCheck className="w-3 h-3" /> Console
                    </Link>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {delegatedTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No active tasks assigned to this account right now.
                  </div>
                ) : (
                  delegatedTasks.map((task) => {
                    const isDone = task.status === 'COMPLETED';
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTaskStatus(task.id, task.status)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isDone
                            ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded border-slate-700 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium text-slate-200 ${isDone ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              task.priority === 'URGENT'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : task.priority === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {task.priority}
                            </span>
                            {task.category && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                                {task.category.replace('_', ' ')}
                              </span>
                            )}
                            {task.linked_entity?.label && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 font-mono">
                                {task.linked_entity.type}: {task.linked_entity.label}
                              </span>
                            )}
                            {task.due_date && (
                              <span className="text-[10px] text-slate-500 font-mono">{task.due_date}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                Team Bulletin & Broadcasts
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Event Staging Rehearsal</span>
                    <span className="text-[9px] text-slate-500">2h ago</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Town Hall soundcheck starts at 3:00 PM tomorrow. Please bring your pass badges.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Q3 Client Invoicing Cycle</span>
                    <span className="text-[9px] text-slate-500">Yesterday</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">All pending client proposals must be dispatched before Friday end of business.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Document Studio Update</span>
                    <span className="text-[9px] text-slate-500">3d ago</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Automatic invoice & agreement generation is now live for all department personnel.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MASTER ADMIN COMMAND VIEW (For SUPERADMIN-001) */}
      {/* ========================================================================= */}
      {activeView === 'ADMIN_MASTER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Delegated Tasks</span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><UserCheck className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{delegatedTasks.length}</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">Assigned across departments</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">System Leads</span>
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400"><Users className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{leads.length}</div>
              <div className="text-[11px] text-brand-400 mt-2 font-medium">In CRM Database</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">IAM Security Status</span>
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><ShieldCheck className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-[11px] text-emerald-400 mt-2 font-medium">Strict RBAC Enforced</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Accounts</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Building2 className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">5 Core</div>
              <div className="text-[11px] text-blue-400 mt-2 font-medium">Enterprise role seats</div>
            </div>
          </div>

          {/* Quick Administration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              to="/admin/delegation"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 rounded-xl flex flex-col gap-2 text-xs font-bold text-amber-300 transition-all group"
            >
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Task & Lead Delegation</span>
            </Link>
            <Link
              to="/admin/users"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs font-bold text-slate-200 transition-all group"
            >
              <Users className="w-5 h-5 text-blue-400" />
              <span>User Directory</span>
            </Link>
            <Link
              to="/admin/roles"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs font-bold text-slate-200 transition-all group"
            >
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Roles & RBAC</span>
            </Link>
            <Link
              to="/admin/departments"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs font-bold text-slate-200 transition-all group"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Departments</span>
            </Link>
            <Link
              to="/admin/security"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs font-bold text-slate-200 transition-all group"
            >
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Security Audit</span>
            </Link>
            <Link
              to="/admin/settings"
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col gap-2 text-xs font-bold text-slate-200 transition-all group"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span>System Settings</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
export default Dashboard;
