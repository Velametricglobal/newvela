import React from 'react';
import {
  LayoutDashboard, Users, UserCheck, GitPullRequest, Clock,
  Laptop, FolderKanban, FileText, Star, Layers, Layout, Image as ImageIcon,
  BookOpen, Target, FileSpreadsheet, CreditCard, DollarSign, ShieldAlert,
  Bell, Settings, Calendar, Shield, MessageCircle, Video, Building2, Key, FileCheck
} from 'lucide-react';
import { AgentRole } from '../types/database.types';

export type DashboardViewType = 'SALES' | 'EVENT' | 'MARKETING' | 'EMPLOYEE' | 'ADMIN_MASTER';

export interface DashboardNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

export interface RoleDashboardConfig {
  id: DashboardViewType;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  focus: string;
  colorAccent: string;
  items: DashboardNavItem[];
}

export const ROLE_DASHBOARDS: Record<DashboardViewType, RoleDashboardConfig> = {
  ADMIN_MASTER: {
    id: 'ADMIN_MASTER',
    title: 'Master Admin Command',
    shortTitle: 'Core Admin',
    badge: 'SUPER',
    description: 'System-wide governance, IAM permissions, user directory, and delegation controls',
    focus: 'Governance, Security & Core Admin Settings',
    colorAccent: 'from-amber-400 to-yellow-600',
    items: [
      { label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Talent Management', path: '/admin/talents', icon: Star, badge: 'TALENT' },
      { label: 'Task & Lead Delegation', path: '/admin/delegation', icon: UserCheck, badge: 'AUTO' },
      { label: 'User Directory', path: '/admin/users', icon: Users, badge: 'IAM' },
      { label: 'Roles & Permissions', path: '/admin/roles', icon: Shield, badge: 'RBAC' },
      { label: 'Departments', path: '/admin/departments', icon: Building2 },
      { label: 'Initial Setup Sheet', path: '/admin/setup', icon: Key, badge: 'SETUP' },
      { label: 'Security & IAM Audit', path: '/admin/security', icon: ShieldAlert },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
    ]
  },
  SALES: {
    id: 'SALES',
    title: 'Sales Dashboard',
    shortTitle: 'Sales Hub',
    badge: 'REVENUE',
    description: 'Revenue, pipeline tracking, and client billing workspace',
    focus: 'Revenue, Pipeline & Client Billing',
    colorAccent: 'from-amber-500 to-orange-600',
    items: [
      { label: 'Dashboard (Sales KPIs)', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Leads CRM', path: '/admin/leads', icon: Users },
      { label: 'Sales Pipeline', path: '/admin/pipeline', icon: GitPullRequest, badge: 'KANBAN' },
      { label: 'Follow-ups', path: '/admin/follow-ups', icon: Clock },
      { label: 'Clients', path: '/admin/clients', icon: UserCheck },
      { label: 'Proposals', path: '/admin/proposals', icon: FileSpreadsheet },
      { label: 'Invoices', path: '/admin/invoices', icon: CreditCard },
      { label: 'Payments', path: '/admin/payments', icon: DollarSign },
    ]
  },
  EVENT: {
    id: 'EVENT',
    title: 'Event Dashboard',
    shortTitle: 'Event Hub',
    badge: 'EVENTS',
    description: 'Event logistics, ticketing, and service execution',
    focus: 'Event Logistics & Production',
    colorAccent: 'from-rose-500 to-red-600',
    items: [
      { label: 'Dashboard (Event KPIs)', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Talent Management', path: '/admin/talents', icon: Star, badge: 'TALENT' },
      { label: 'Events & Auditions', path: '/admin/events', icon: Calendar, badge: 'HOT' },
      { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    ]
  },
  MARKETING: {
    id: 'MARKETING',
    title: 'Marketing Dashboard',
    shortTitle: 'Marketing Hub',
    badge: 'GROWTH',
    description: 'Content creation, audience outreach, and lead generation',
    focus: 'Content, Outreach & Lead Gen',
    colorAccent: 'from-purple-500 to-pink-600',
    items: [
      { label: 'Dashboard (Campaign ROI)', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Talent Management', path: '/admin/talents', icon: Star, badge: 'TALENT' },
      { label: 'Campaigns', path: '/admin/campaigns', icon: Target },
      { label: 'Reel Marketing', path: '/admin/marketing/reels', icon: Video, badge: 'REELS' },
      { label: 'Communication Hub', path: '/admin/communication', icon: MessageCircle, badge: 'LEADS' },
      { label: 'Blog Publishing CMS', path: '/admin/blog', icon: BookOpen, badge: 'CMS' },
      { label: 'Pages', path: '/admin/pages', icon: Layers },
      { label: 'Case Studies', path: '/admin/case-studies', icon: FileText },
      { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
    ]
  },
  EMPLOYEE: {
    id: 'EMPLOYEE',
    title: 'Working Employee Dashboard',
    shortTitle: 'Tasks Hub',
    badge: 'TASKS',
    description: 'Day-to-day task execution, internal communication and notifications',
    focus: 'Day-to-Day Execution & Staff Assignments',
    colorAccent: 'from-emerald-500 to-teal-600',
    items: [
      { label: 'Dashboard (My Assignments)', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Internal Team Chat', path: '/admin/team-chat', icon: MessageCircle, badge: 'STAFF' },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Assigned Media', path: '/admin/media', icon: ImageIcon },
    ]
  }
};

export const SUPER_ADMIN_CORE_ITEMS: DashboardNavItem[] = [
  { label: 'Talent Management', path: '/admin/talents', icon: Star, badge: 'TALENT' },
  { label: 'Task & Lead Delegation', path: '/admin/delegation', icon: UserCheck, badge: 'AUTO' },
  { label: 'User Directory', path: '/admin/users', icon: Users, badge: 'IAM' },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: Shield, badge: 'RBAC' },
  { label: 'Departments', path: '/admin/departments', icon: Building2 },
  { label: 'Initial Setup Sheet', path: '/admin/setup', icon: Key, badge: 'SETUP' },
  { label: 'Security & IAM Audit', path: '/admin/security', icon: ShieldAlert },
  { label: 'System Settings', path: '/admin/settings', icon: Settings },
];

/**
 * Returns the default dashboard view for a given role
 */
export function getDefaultDashboardForRole(role?: string): DashboardViewType {
  if (!role) return 'SALES';
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    // If super admin previously selected a view, keep it, otherwise default to SALES
    const saved = localStorage.getItem('vela_admin_active_view') as DashboardViewType;
    if (saved && (saved === 'SALES' || saved === 'EVENT' || saved === 'MARKETING' || saved === 'EMPLOYEE' || saved === 'ADMIN_MASTER')) {
      return saved;
    }
    return 'SALES';
  }
  if (role === 'SALES_AGENT' || role === 'SALES_MANAGER' || role === 'SALES_EXECUTIVE' || role === 'FINANCE_MANAGER' || role === 'ACCOUNTANT') {
    return 'SALES';
  }
  if (role === 'EVENT_AGENT' || role === 'EVENT_MANAGER') {
    return 'EVENT';
  }
  if (role === 'MARKETING_MANAGER' || role === 'CONTENT_MANAGER') {
    return 'MARKETING';
  }
  if (role === 'VIEWER' || role === 'SUPPORT_AGENT' || role === 'SUPPORT') {
    return 'EMPLOYEE';
  }
  return 'SALES';
}
