import { EnterpriseUser, DepartmentRecord, UserSessionRecord, SecurityAuditRecord, CustomRoleDefinition } from '../types/database.types';

export const SYSTEM_ROLES_CONFIG: { role: string; title: string; description: string; badge: string }[] = [
  { role: 'SUPER_ADMIN', title: 'Super Admin', description: 'Full un-restricted system access across all panels, security, & identity controls', badge: 'SUPERADMIN' },
  { role: 'ADMIN', title: 'Business Administrator', description: 'Manages website content, services, portfolio, proposals, and team members', badge: 'ADMIN' },
  { role: 'SALES_MANAGER', title: 'Sales Manager', description: 'Manages sales pipelines, lead allocations, follow-up schedules, & revenue forecasts', badge: 'SALES' },
  { role: 'SALES_EXECUTIVE', title: 'Sales Executive', description: 'Manages assigned leads, calls, WhatsApp follow-ups, and proposal creation', badge: 'SALES' },
  { role: 'MARKETING_MANAGER', title: 'Marketing Lead', description: 'Manages Reel marketing campaigns, WhatsApp broadcasts, and lead acquisition', badge: 'MARKETING' },
  { role: 'CONTENT_MANAGER', title: 'Content Manager', description: 'Manages website pages, blog posts, media library, and testimonial approvals', badge: 'CONTENT' },
  { role: 'EVENT_MANAGER', title: 'Event Manager', description: 'Manages event registrations, contestant profiles, auditions, and sponsor applications', badge: 'EVENTS' },
  { role: 'FINANCE_MANAGER', title: 'Finance Lead', description: 'Manages quotations, invoice disbursements, payment logs, and subsidy loan advisory', badge: 'FINANCE' },
  { role: 'ACCOUNTANT', title: 'Accountant', description: 'Manages accounts receivables, transaction reconciliation, and client payment tracking', badge: 'FINANCE' },
  { role: 'HR_MANAGER', title: 'HR Manager', description: 'Manages staff profiles, department structures, and agent onboarding', badge: 'HR' },
  { role: 'SUPPORT', title: 'Customer Support Lead', description: 'Manages client inquiries, contact messages, and helpdesk tickets', badge: 'SUPPORT' },
  { role: 'VIEWER', title: 'Read-Only Viewer', description: 'Read-only visibility for analytics, reporting, and audit compliance', badge: 'VIEWER' }
];

let mockUsers: EnterpriseUser[] = [
  {
    id: 'usr-101',
    user_code: 'SUPERADMIN-001',
    first_name: 'Vikramaditya',
    last_name: 'Singh',
    email: 'superadmin@velametric.com',
    phone: '+91 9876543210',
    role: 'SUPER_ADMIN',
    role_title: 'Super Admin',
    department_id: 'dept-1',
    department_name: 'Executive Management',
    status: 'ACTIVE',
    mfa_enabled: true,
    mfa_enforced: true,
    require_password_change: false,
    last_login_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000 * 90).toISOString()
  },
  {
    id: 'usr-102',
    user_code: 'USR-000002',
    first_name: 'Anish',
    last_name: 'Kapoor',
    email: 'sales@velametric.com',
    phone: '+91 9876543211',
    role: 'SALES_MANAGER',
    role_title: 'Sales Manager',
    department_id: 'dept-2',
    department_name: 'Sales & Growth',
    status: 'ACTIVE',
    mfa_enabled: false,
    mfa_enforced: false,
    require_password_change: false,
    last_login_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    assigned_records: { leads_count: 23, deals_count: 8, followups_count: 12, tasks_count: 5 }
  },
  {
    id: 'usr-103',
    user_code: 'USR-000003',
    first_name: 'Meera',
    last_name: 'Rawat',
    email: 'events@velametric.com',
    phone: '+91 9876543212',
    role: 'EVENT_MANAGER',
    role_title: 'Event Manager',
    department_id: 'dept-5',
    department_name: 'Events & Culture',
    status: 'ACTIVE',
    mfa_enabled: false,
    mfa_enforced: false,
    require_password_change: false,
    last_login_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: 'usr-104',
    user_code: 'USR-000004',
    first_name: 'Rohan',
    last_name: 'Verma',
    email: 'support@velametric.com',
    phone: '+91 9876543213',
    role: 'SUPPORT',
    role_title: 'Customer Support',
    department_id: 'dept-7',
    department_name: 'Operations & Support',
    status: 'ACTIVE',
    mfa_enabled: false,
    mfa_enforced: false,
    require_password_change: false,
    last_login_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  }
];

let mockDepartments: DepartmentRecord[] = [
  { id: 'dept-1', name: 'Executive Management', description: 'C-Suite and executive leadership team.', manager_name: 'Vikramaditya Singh', members_count: 2, created_at: new Date().toISOString() },
  { id: 'dept-2', name: 'Sales & Growth', description: 'Lead generation, sales pipeline, and client acquisitions.', manager_name: 'Anish Kapoor', members_count: 5, created_at: new Date().toISOString() },
  { id: 'dept-3', name: 'Digital Marketing & Reels', description: 'Performance marketing, Reel campaigns, and SEO.', manager_name: 'Priya Mehta', members_count: 4, created_at: new Date().toISOString() },
  { id: 'dept-4', name: 'Web & App Engineering', description: 'Frontend, backend, database architecture, and hosting.', manager_name: 'Aditya Roy', members_count: 6, created_at: new Date().toISOString() },
  { id: 'dept-5', name: 'Events & Cultural Summits', description: 'Event planning, auditions, contestants, and sponsor relations.', manager_name: 'Meera Rawat', members_count: 3, created_at: new Date().toISOString() },
  { id: 'dept-6', name: 'Finance & Legal Consultancy', description: 'Quotations, invoices, government subsidy loans, and DPRs.', manager_name: 'Siddharth Nair', members_count: 3, created_at: new Date().toISOString() },
  { id: 'dept-7', name: 'Operations & Support', description: 'Client onboarding, helpdesk, and daily service operations.', manager_name: 'Rohan Verma', members_count: 4, created_at: new Date().toISOString() }
];

let mockSessions: UserSessionRecord[] = [
  { id: 'sess-1', user_id: 'usr-101', user_name: 'Vikramaditya Singh', ip_address: '103.211.54.12', browser: 'Chrome 122 (Windows 11)', device: 'Desktop PC', last_active: 'Active now', is_current: true },
  { id: 'sess-2', user_id: 'usr-102', user_name: 'Anish Kapoor', ip_address: '49.36.128.94', browser: 'Chrome Mobile (Android)', device: 'Mobile Phone', last_active: '15 mins ago', is_current: false }
];

let mockAuditLogs: SecurityAuditRecord[] = [
  { id: 'audit-1', user_id: 'usr-101', user_name: 'Vikramaditya Singh', user_role: 'SUPER_ADMIN', action: 'USER_CREATED', module: 'Users', details: 'Created user USR-000004 (Rohan Verma) with Support role', ip_address: '103.211.54.12', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'audit-2', user_id: 'usr-102', user_name: 'Anish Kapoor', user_role: 'SALES_MANAGER', action: 'CAMPAIGN_LAUNCHED', module: 'Marketing', details: 'Launched WhatsApp Reel Campaign "August Digital Growth"', ip_address: '49.36.128.94', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() }
];

export const authService = {
  // Get all users
  async getUsers(): Promise<EnterpriseUser[]> {
    return [...mockUsers];
  },

  // Add User
  async createUser(userPayload: Partial<EnterpriseUser>): Promise<EnterpriseUser> {
    const codeNum = mockUsers.length + 1;
    const userCode = userPayload.user_code || `USR-${String(codeNum).padStart(6, '0')}`;

    const newUser: EnterpriseUser = {
      first_name: '',
      last_name: '',
      email: '',
      role: 'VIEWER',
      status: 'ACTIVE',
      mfa_enabled: false,
      mfa_enforced: false,
      require_password_change: true,
      ...userPayload,
      id: `usr-${Date.now()}`,
      user_code: userCode,
      created_at: new Date().toISOString()
    };

    mockUsers.unshift(newUser);
    this.logSecurityAudit('USER_CREATED', 'Users', `Created user ${userCode} (${newUser.first_name} ${newUser.last_name})`);
    return newUser;
  },

  // Update user
  async updateUser(id: string, updates: Partial<EnterpriseUser>): Promise<EnterpriseUser> {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...updates };
      this.logSecurityAudit('USER_UPDATED', 'Users', `Updated user profile for ${mockUsers[idx].user_code}`);
      return { ...mockUsers[idx] };
    }
    throw new Error('User not found');
  },

  // Deactivate user with record re-assignment
  async deactivateUser(id: string, reassignToUserId?: string): Promise<boolean> {
    const u = mockUsers.find(x => x.id === id);
    if (u) {
      u.status = 'DEACTIVATED';
      const target = mockUsers.find(x => x.id === reassignToUserId);
      const targetName = target ? `${target.first_name} ${target.last_name}` : 'Unassigned Pool';
      this.logSecurityAudit('USER_DEACTIVATED', 'Users', `Deactivated ${u.user_code} and reassigned active leads/deals to ${targetName}`);
      return true;
    }
    return false;
  },

  // Force Logout User Sessions
  async forceLogoutUser(id: string): Promise<boolean> {
    const u = mockUsers.find(x => x.id === id);
    if (u) {
      mockSessions = mockSessions.filter(s => s.user_id !== id);
      this.logSecurityAudit('FORCE_LOGOUT', 'Security', `Revoked all active sessions for ${u.user_code}`);
      return true;
    }
    return false;
  },

  // Department Management
  async getDepartments(): Promise<DepartmentRecord[]> {
    return [...mockDepartments];
  },

  async createDepartment(dept: Partial<DepartmentRecord>): Promise<DepartmentRecord> {
    const newDept: DepartmentRecord = {
      id: `dept-${Date.now()}`,
      name: dept.name || 'New Department',
      description: dept.description || '',
      manager_name: dept.manager_name || 'Unassigned',
      members_count: 0,
      created_at: new Date().toISOString()
    };
    mockDepartments.push(newDept);
    return newDept;
  },

  // Sessions & Security Audit Logs
  async getActiveSessions(): Promise<UserSessionRecord[]> {
    return [...mockSessions];
  },

  async getSessions(): Promise<UserSessionRecord[]> {
    return [...mockSessions];
  },

  async revokeSession(id: string): Promise<boolean> {
    mockSessions = mockSessions.filter(s => s.id !== id);
    return true;
  },

  async getAuditLogs(): Promise<SecurityAuditRecord[]> {
    return [...mockAuditLogs];
  },

  logSecurityAudit(action: string, module: string, details: string) {
    mockAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      user_id: 'usr-101',
      user_name: 'Vikramaditya Singh',
      user_role: 'SUPER_ADMIN',
      action,
      module,
      details,
      ip_address: '103.211.54.12',
      timestamp: new Date().toISOString()
    });
  }
};
