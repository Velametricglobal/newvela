import { Lead, LeadPriority } from '../types/database.types';
import { leadService } from './leadService';

export interface DelegatedTask {
  id: string;
  title: string;
  description: string;
  assigned_to: string; // user_code, e.g. 'SALES-001'
  assigned_name: string; // e.g. 'Rahul Sharma'
  assigned_role: string; // e.g. 'Sales Executive'
  department: string; // e.g. 'Sales & Growth'
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  due_date: string;
  category: 'LEAD_FOLLOWUP' | 'EVENT_LOGISTICS' | 'MARKETING_CAMPAIGN' | 'DOCUMENT_DRAFT' | 'OPERATIONS';
  linked_entity?: {
    type: 'LEAD' | 'EVENT' | 'DOCUMENT' | 'CLIENT';
    id: string;
    label: string;
  };
  delegated_by: string;
  created_at: string;
  completed_at?: string;
  admin_notes?: string;
}

export interface EmployeeProfile {
  user_code: string;
  full_name: string;
  email: string;
  role_title: string;
  department: string;
  avatar_color: string;
  active_leads_count: number;
  pending_tasks_count: number;
  capacity_status: 'AVAILABLE' | 'MODERATE' | 'HEAVY';
}

export interface AutoRoutingSettings {
  strategy: 'ROUND_ROBIN' | 'DEPARTMENT_MATCH' | 'MANUAL_APPROVAL';
  auto_notify_email: boolean;
  auto_notify_whatsapp: boolean;
  default_sales_agent: string;
  default_event_manager: string;
  default_marketing_lead: string;
  default_operations_staff: string;
  escalation_timeout_hours: number;
}

const DELEGATION_TASKS_KEY = 'VELA_DELEGATED_TASKS_STORE';
const AUTO_ROUTING_KEY = 'VELA_AUTO_ROUTING_SETTINGS';

export const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    user_code: 'SALES-001',
    full_name: 'Rahul Sharma',
    email: 'sales@example.com',
    role_title: 'Sales Executive',
    department: 'Sales & Growth',
    avatar_color: 'from-amber-500 to-orange-600',
    active_leads_count: 3,
    pending_tasks_count: 2,
    capacity_status: 'AVAILABLE'
  },
  {
    user_code: 'EVENT-001',
    full_name: 'Meera Rawat',
    email: 'event@example.com',
    role_title: 'Event Manager',
    department: 'Events & Culture',
    avatar_color: 'from-rose-500 to-red-600',
    active_leads_count: 2,
    pending_tasks_count: 1,
    capacity_status: 'AVAILABLE'
  },
  {
    user_code: 'MARKETING-001',
    full_name: 'Priya Mehta',
    email: 'marketing@example.com',
    role_title: 'Marketing Lead',
    department: 'Digital Marketing',
    avatar_color: 'from-purple-500 to-pink-600',
    active_leads_count: 4,
    pending_tasks_count: 3,
    capacity_status: 'MODERATE'
  },
  {
    user_code: 'VIEWER-001',
    full_name: 'Operations Staff',
    email: 'viewer@example.com',
    role_title: 'Operational Specialist',
    department: 'Operations & Execution',
    avatar_color: 'from-emerald-500 to-teal-600',
    active_leads_count: 1,
    pending_tasks_count: 2,
    capacity_status: 'AVAILABLE'
  }
];

export const INITIAL_DELEGATED_TASKS: DelegatedTask[] = [
  {
    id: 'task-101',
    title: 'Verify attendee roster for upcoming Dehradun Tech Expo',
    description: 'Call registered pass holders and confirm VIP stage access badges.',
    assigned_to: 'VIEWER-001',
    assigned_name: 'Operations Staff',
    assigned_role: 'Operational Specialist',
    department: 'Operations & Execution',
    priority: 'HIGH',
    status: 'PENDING',
    due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
    category: 'EVENT_LOGISTICS',
    linked_entity: { type: 'EVENT', id: 'evt-1', label: 'Dehradun Tech Expo' },
    delegated_by: 'SUPERADMIN-001',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-102',
    title: 'Follow up with Anish Kapoor on DPR Government Subsidy proposal',
    description: 'Confirm client has reviewed technical annexure and schedule closing Zoom call.',
    assigned_to: 'SALES-001',
    assigned_name: 'Rahul Sharma',
    assigned_role: 'Sales Executive',
    department: 'Sales & Growth',
    priority: 'URGENT',
    status: 'PENDING',
    due_date: new Date(Date.now() + 3600000 * 4).toISOString(),
    category: 'LEAD_FOLLOWUP',
    linked_entity: { type: 'LEAD', id: 'lead-1', label: 'Anish Kapoor (Apex Wealth)' },
    delegated_by: 'SUPERADMIN-001',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'task-103',
    title: 'Upload 4K teaser reels for North India Cultural Fest',
    description: 'Post 3 teaser clips to Dapflix Reels showcase with hashtags and pass link.',
    assigned_to: 'MARKETING-001',
    assigned_name: 'Priya Mehta',
    assigned_role: 'Marketing Lead',
    department: 'Digital Marketing',
    priority: 'HIGH',
    status: 'PENDING',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    category: 'MARKETING_CAMPAIGN',
    linked_entity: { type: 'EVENT', id: 'evt-2', label: 'North India Cultural Fest' },
    delegated_by: 'SUPERADMIN-001',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-104',
    title: 'Coordinate stage lighting and audio rider for Town Hall arena',
    description: 'Ensure line-array PA and automated beam lights are delivered before Thursday.',
    assigned_to: 'EVENT-001',
    assigned_name: 'Meera Rawat',
    assigned_role: 'Event Manager',
    department: 'Events & Culture',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    category: 'EVENT_LOGISTICS',
    linked_entity: { type: 'EVENT', id: 'evt-3', label: 'Town Hall Audition' },
    delegated_by: 'SUPERADMIN-001',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-105',
    title: 'Generate and disburse work agreement document for DHCS project',
    description: 'Use Document Studio wizard to output PDF agreement and archive in client folder.',
    assigned_to: 'VIEWER-001',
    assigned_name: 'Operations Staff',
    assigned_role: 'Operational Specialist',
    department: 'Operations & Execution',
    priority: 'NORMAL',
    status: 'COMPLETED',
    due_date: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'DOCUMENT_DRAFT',
    linked_entity: { type: 'DOCUMENT', id: 'doc-101', label: 'DHCS Work Agreement' },
    delegated_by: 'SUPERADMIN-001',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const delegationService = {
  getEmployees(): EmployeeProfile[] {
    return [...INITIAL_EMPLOYEES];
  },

  async getTasks(): Promise<DelegatedTask[]> {
    const saved = localStorage.getItem(DELEGATION_TASKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [...INITIAL_DELEGATED_TASKS];
  },

  async getTasksForEmployee(userCode: string): Promise<DelegatedTask[]> {
    const tasks = await this.getTasks();
    return tasks.filter(t => t.assigned_to === userCode);
  },

  async createTask(taskInput: Omit<DelegatedTask, 'id' | 'created_at'>): Promise<DelegatedTask> {
    const tasks = await this.getTasks();
    const newTask: DelegatedTask = {
      ...taskInput,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString()
    };

    tasks.unshift(newTask);
    localStorage.setItem(DELEGATION_TASKS_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('vela-delegated-task-updated', { detail: newTask }));
    return newTask;
  },

  async updateTaskStatus(taskId: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'): Promise<DelegatedTask> {
    const tasks = await this.getTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');

    tasks[idx].status = status;
    if (status === 'COMPLETED') {
      tasks[idx].completed_at = new Date().toISOString();
    }
    localStorage.setItem(DELEGATION_TASKS_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('vela-delegated-task-updated', { detail: tasks[idx] }));
    return tasks[idx];
  },

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(DELEGATION_TASKS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('vela-delegated-task-updated', { detail: { deletedId: taskId } }));
  },

  async assignLeadToEmployee(
    leadId: string,
    employeeCode: string,
    priority: LeadPriority = 'HIGH',
    adminNote?: string
  ): Promise<Lead> {
    const employee: EmployeeProfile = INITIAL_EMPLOYEES.find(e => e.user_code === employeeCode) || {
      user_code: employeeCode,
      full_name: employeeCode,
      email: `${employeeCode.toLowerCase()}@example.com`,
      role_title: 'Assigned Representative',
      department: 'Assigned Team',
      avatar_color: 'from-blue-500 to-indigo-600',
      active_leads_count: 0,
      pending_tasks_count: 0,
      capacity_status: 'AVAILABLE'
    };

    const leads = await leadService.getLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) throw new Error('Lead not found');

    leads[idx].assigned_to = employee.user_code;
    leads[idx].assigned_name = employee.full_name;
    leads[idx].priority = priority;
    leads[idx].updated_at = new Date().toISOString();

    leads[idx].activities = leads[idx].activities || [];
    leads[idx].activities.unshift({
      id: `act-${Date.now()}`,
      lead_id: leadId,
      activity_type: 'assignment',
      title: `Lead Assigned to ${employee.full_name} (${employee.user_code})`,
      details: adminNote || `Assigned via Admin Delegation Engine with ${priority} priority.`,
      notes: adminNote || `Assigned via Admin Delegation Engine with ${priority} priority.`,
      created_by: 'Super Admin',
      created_at: new Date().toISOString()
    });

    localStorage.setItem('VELAMETRIC_LEADS_STORE', JSON.stringify(leads));

    // Also auto-create a high-priority follow-up task for the assigned employee
    await this.createTask({
      title: `Connect with new lead: ${leads[idx].first_name} ${leads[idx].last_name || ''}`,
      description: `Inquiry interest: ${leads[idx].service_interest || 'Services'}. Budget: ${leads[idx].budget_range || 'N/A'}. Contact: ${leads[idx].phone || leads[idx].email}`,
      assigned_to: employee.user_code,
      assigned_name: employee.full_name,
      assigned_role: employee.role_title || 'Assigned Representative',
      department: employee.department || 'Operations',
      priority: priority === 'HIGH' ? 'URGENT' : 'NORMAL',
      status: 'PENDING',
      due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
      category: 'LEAD_FOLLOWUP',
      linked_entity: {
        type: 'LEAD',
        id: leads[idx].id,
        label: `${leads[idx].first_name} ${leads[idx].last_name || ''} (${leads[idx].lead_code})`
      },
      delegated_by: 'SUPERADMIN-001',
      admin_notes: adminNote
    });

    window.dispatchEvent(new CustomEvent('vela-lead-assigned', { detail: leads[idx] }));
    return leads[idx];
  },

  getAutoRoutingSettings(): AutoRoutingSettings {
    const saved = localStorage.getItem(AUTO_ROUTING_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      strategy: 'ROUND_ROBIN',
      auto_notify_email: true,
      auto_notify_whatsapp: true,
      default_sales_agent: 'SALES-001',
      default_event_manager: 'EVENT-001',
      default_marketing_lead: 'MARKETING-001',
      default_operations_staff: 'VIEWER-001',
      escalation_timeout_hours: 4
    };
  },

  saveAutoRoutingSettings(settings: AutoRoutingSettings): void {
    localStorage.setItem(AUTO_ROUTING_KEY, JSON.stringify(settings));
  }
};
