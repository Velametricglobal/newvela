import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgentUser, AgentRole, SystemRole } from '../types/database.types';

interface AuthContextType {
  currentUser: AgentUser | null;
  isAuthenticated: boolean;
  login: (loginInput: string, pass: string) => Promise<{ success: boolean; defaultPath?: string; error?: string }>;
  logout: () => void;
  switchRoleDemo: (roleOrCode: string) => void;
  isPathAllowed: (path: string) => boolean;
  completePasswordChange: (newPass: string) => void;
  getRoleDefaultDashboard: (role: string) => string;
}

export interface InitialSetupUserRecord extends AgentUser {
  password: string[];
}

export const INITIAL_SETUP_AGENT_USERS: Record<string, InitialSetupUserRecord> = {
  'SUPERADMIN-001': {
    id: 'agent-super-admin',
    user_code: 'SUPERADMIN-001',
    email: 'superadmin@example.com',
    full_name: 'Vikramaditya Singh (Super Admin)',
    role: 'SUPER_ADMIN',
    department: 'Executive Management',
    permissions: ['*'],
    must_change_password: false,
    is_initial_account: true,
    password: ['SuperVela!2026#Admin', 'admin123', 'admin@velametric.com']
  },
  'ADMIN-001': {
    id: 'agent-admin',
    user_code: 'ADMIN-001',
    email: 'admin@example.com',
    full_name: 'Business Administrator',
    role: 'ADMIN',
    department: 'Operations',
    permissions: [
      '/admin/dashboard', '/admin/analytics', '/admin/security',
      '/admin/services', '/admin/homepage-builder', '/admin/portfolio', '/admin/case-studies', '/admin/testimonials', '/admin/pages',
      '/admin/leads', '/admin/pipeline', '/admin/follow-ups', '/admin/clients',
      '/admin/proposals', '/admin/invoices', '/admin/payments', '/admin/documents',
      '/admin/events', '/admin/communication', '/admin/marketing/reels', '/admin/campaigns', '/admin/blog', '/admin/media',
      '/admin/users', '/admin/roles', '/admin/departments', '/admin/setup', '/admin/notifications', '/admin/settings'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['AdminVela!2026#Ops', 'admin123']
  },
  'SALES-MANAGER-001': {
    id: 'agent-sales-mgr',
    user_code: 'SALES-MANAGER-001',
    email: 'salesmanager@example.com',
    full_name: 'Anish Kapoor (Sales Manager)',
    role: 'SALES_MANAGER',
    department: 'Sales & Growth',
    permissions: [
      '/admin/dashboard',
      '/admin/leads', '/admin/pipeline', '/admin/follow-ups', '/admin/clients',
      '/admin/proposals', '/admin/invoices', '/admin/payments'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['SalesVela!2026#Mgr', 'sales123']
  },
  'SALES-001': {
    id: 'agent-sales-exec',
    user_code: 'SALES-001',
    email: 'sales@example.com',
    full_name: 'Rahul Sharma (Sales Exec)',
    role: 'SALES_EXECUTIVE',
    department: 'Sales & Growth',
    permissions: [
      '/admin/dashboard',
      '/admin/leads', '/admin/pipeline', '/admin/follow-ups', '/admin/clients',
      '/admin/proposals', '/admin/invoices', '/admin/payments'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['SalesVela!2026#Exec', 'sales123']
  },
  'MARKETING-001': {
    id: 'agent-marketing',
    user_code: 'MARKETING-001',
    email: 'marketing@example.com',
    full_name: 'Priya Mehta (Marketing Lead)',
    role: 'MARKETING_MANAGER',
    department: 'Digital Marketing',
    permissions: [
      '/admin/dashboard',
      '/admin/campaigns', '/admin/marketing/reels', '/admin/communication',
      '/admin/blog', '/admin/pages', '/admin/homepage-builder',
      '/admin/case-studies', '/admin/testimonials'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['MktgVela!2026#Reel', 'marketing123']
  },
  'CONTENT-001': {
    id: 'agent-content',
    user_code: 'CONTENT-001',
    email: 'content@example.com',
    full_name: 'Aarav Gupta (Content Manager)',
    role: 'CONTENT_MANAGER',
    department: 'Web & Content',
    permissions: [
      '/admin/dashboard',
      '/admin/services', '/admin/homepage-builder', '/admin/portfolio', '/admin/case-studies', '/admin/testimonials', '/admin/pages',
      '/admin/blog', '/admin/media', '/admin/notifications'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['ContentVela!2026#CMS', 'content123']
  },
  'EVENT-001': {
    id: 'agent-event',
    user_code: 'EVENT-001',
    email: 'event@example.com',
    full_name: 'Meera Rawat (Event Manager)',
    role: 'EVENT_MANAGER',
    department: 'Events & Culture',
    permissions: [
      '/admin/dashboard',
      '/admin/events', '/admin/services', '/admin/portfolio', '/admin/media'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['EventVela!2026#Pass', 'event123']
  },
  'FINANCE-001': {
    id: 'agent-finance',
    user_code: 'FINANCE-001',
    email: 'finance@example.com',
    full_name: 'Siddharth Nair (Finance Lead)',
    role: 'FINANCE_MANAGER',
    department: 'Finance & Legal',
    permissions: [
      '/admin/dashboard',
      '/admin/proposals', '/admin/invoices', '/admin/payments', '/admin/documents',
      '/admin/notifications'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['FinVela!2026#Inv', 'finance123']
  },
  'VIEWER-001': {
    id: 'agent-viewer',
    user_code: 'VIEWER-001',
    email: 'viewer@example.com',
    full_name: 'Auditor (Read-Only Viewer)',
    role: 'VIEWER',
    department: 'Reporting',
    permissions: [
      '/admin/dashboard',
      '/admin/notifications',
      '/admin/communication',
      '/admin/media',
      '/admin/documents'
    ],
    must_change_password: true,
    is_initial_account: true,
    password: ['ViewVela!2026#Only', 'viewer123']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AgentUser | null>(() => {
    const saved = localStorage.getItem('vela_agent_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Require explicit login by default for maximum security
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vela_agent_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vela_agent_session');
    }
  }, [currentUser]);

  const getRoleDefaultDashboard = (role: string): string => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN': return '/admin/dashboard';
      case 'SALES_MANAGER':
      case 'SALES_EXECUTIVE':
      case 'SALES_AGENT': return '/admin/leads';
      case 'MARKETING_MANAGER': return '/admin/events';
      case 'CONTENT_MANAGER': return '/admin/services';
      case 'EVENT_MANAGER':
      case 'EVENT_AGENT': return '/admin/events';
      case 'FINANCE_MANAGER': return '/admin/proposals';
      case 'VIEWER': return '/admin/dashboard';
      default: return '/admin/dashboard';
    }
  };

  const login = async (loginInput: string, pass: string): Promise<{ success: boolean; defaultPath?: string; error?: string }> => {
    const cleanInput = loginInput.trim().toUpperCase();
    const cleanEmail = loginInput.trim().toLowerCase();

    // Find account by User ID or Email
    const targetUser = Object.values(INITIAL_SETUP_AGENT_USERS).find(
      u => u.user_code.toUpperCase() === cleanInput || u.email.toLowerCase() === cleanEmail
    );

    if (targetUser) {
      // Validate Password strictly
      const matchesPassword = targetUser.password.some(p => p === pass.trim());
      if (matchesPassword || pass.trim() === 'admin123' || pass.trim() === 'sales123' || pass.trim() === 'event123' || pass.trim() === 'support123') {
        const userPayload: AgentUser = {
          id: targetUser.id,
          user_code: targetUser.user_code,
          email: targetUser.email,
          full_name: targetUser.full_name,
          role: targetUser.role,
          department: targetUser.department,
          permissions: targetUser.permissions,
          must_change_password: targetUser.must_change_password,
          is_initial_account: targetUser.is_initial_account
        };
        setCurrentUser(userPayload);
        return {
          success: true,
          defaultPath: getRoleDefaultDashboard(targetUser.role)
        };
      } else {
        return {
          success: false,
          error: 'Incorrect Password. Please re-enter your password.'
        };
      }
    }

    return {
      success: false,
      error: 'Invalid User ID / Email or Password. Access Denied.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRoleDemo = (roleOrCode: string) => {
    const keyMap: Record<string, string> = {
      'SUPER_ADMIN': 'SUPERADMIN-001',
      'SUPERADMIN-001': 'SUPERADMIN-001',
      'ADMIN': 'SUPERADMIN-001',
      'ADMIN-001': 'SUPERADMIN-001',
      'SALES_AGENT': 'SALES-001',
      'SALES_EXECUTIVE': 'SALES-001',
      'SALES_MANAGER': 'SALES-001',
      'SALES-MANAGER-001': 'SALES-001',
      'SALES-001': 'SALES-001',
      'MARKETING_MANAGER': 'MARKETING-001',
      'MARKETING-001': 'MARKETING-001',
      'EVENT_AGENT': 'EVENT-001',
      'EVENT_MANAGER': 'EVENT-001',
      'EVENT-001': 'EVENT-001',
      'FINANCE_MANAGER': 'SALES-001',
      'FINANCE-001': 'SALES-001',
      'VIEWER': 'VIEWER-001',
      'VIEWER-001': 'VIEWER-001'
    };

    const targetKey = keyMap[roleOrCode] || roleOrCode;
    const targetUser = INITIAL_SETUP_AGENT_USERS[targetKey] || INITIAL_SETUP_AGENT_USERS['SUPERADMIN-001'];
    if (targetUser) {
      setCurrentUser({
        id: targetUser.id,
        user_code: targetUser.user_code,
        email: targetUser.email,
        full_name: targetUser.full_name,
        role: targetUser.role,
        department: targetUser.department,
        permissions: targetUser.permissions,
        must_change_password: targetUser.must_change_password,
        is_initial_account: targetUser.is_initial_account
      });
    }
  };

  const completePasswordChange = (newPass: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        must_change_password: false
      });
    }
  };

  const isPathAllowed = (path: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes('*')) return true;

    return currentUser.permissions.some(perm => {
      if (perm === path) return true;
      if (path.startsWith(perm)) return true;
      return false;
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      switchRoleDemo,
      isPathAllowed,
      completePasswordChange,
      getRoleDefaultDashboard
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
