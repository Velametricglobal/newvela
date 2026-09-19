import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AgentRole } from '../../types/database.types';
import { CurrencySelector } from '../common/CurrencySelector';
import {
  ROLE_DASHBOARDS,
  SUPER_ADMIN_CORE_ITEMS,
  DashboardViewType,
  getDefaultDashboardForRole,
  DashboardNavItem
} from '../../config/roleDashboards';
import {
  Menu, X, ChevronRight, ChevronDown, LogOut, Shield,
  Compass, Eye, SlidersHorizontal, Check
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, switchRoleDemo, isPathAllowed } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Check if active user has Super Admin or Admin privileges
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  // Active working dashboard view (SALES, EVENT, MARKETING, EMPLOYEE, or ALL)
  const [activeDashboardView, setActiveDashboardView] = useState<DashboardViewType>(() => {
    return getDefaultDashboardForRole(currentUser?.role);
  });

  // Whenever user role changes (e.g. via demo switcher), update default dashboard
  useEffect(() => {
    const defaultView = getDefaultDashboardForRole(currentUser?.role);
    setActiveDashboardView(defaultView);
  }, [currentUser?.role]);

  // Handler for Super Admin switching view mode
  const handleSwitchDashboardView = (view: DashboardViewType) => {
    setActiveDashboardView(view);
    localStorage.setItem('vela_admin_active_view', view);
    // Dispatch window event so components like Dashboard can update synchronously
    window.dispatchEvent(new CustomEvent('vela-admin-view-change', { detail: view }));
  };

  // Resolve current active dashboard config
  const currentDashboard = ROLE_DASHBOARDS[activeDashboardView] || ROLE_DASHBOARDS.SALES;

  // Items to render for the active dashboard (filtered by user's permission)
  const activeDashboardItems: DashboardNavItem[] = currentDashboard.items.filter(item => isPathAllowed(item.path));

  // Core administrative items (strictly for SUPER_ADMIN & ADMIN)
  const coreAdminItems = isSuperAdmin
    ? SUPER_ADMIN_CORE_ITEMS.filter(item => isPathAllowed(item.path))
    : [];

  const currentPathAllowed = isPathAllowed(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-brand-500 selection:text-white">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* MOBILE OFF-CANVAS SLIDE-OUT DRAWER */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <Link
            to="/admin/dashboard"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-glow-brand">
              V
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block leading-tight">
                VELAMETRIC
              </span>
              <span className="text-[10px] text-brand-400 font-mono tracking-widest uppercase">Admin Command</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile User Profile & Role Switcher */}
        {currentUser && (
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/90 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser.full_name}</div>
                <div className="text-[10px] text-amber-400 font-mono truncate">{currentUser.department} ({currentUser.user_code})</div>
              </div>
            </div>

            {/* Mobile Master View Switcher (Super Admin only) */}
            {isSuperAdmin && (
              <div className="pt-2 border-t border-slate-800/80">
                <label className="text-[9px] uppercase font-bold text-brand-400 flex items-center gap-1.5 mb-1">
                  <Compass className="w-3 h-3" /> Master View Switcher:
                </label>
                <select
                  value={activeDashboardView}
                  onChange={(e) => handleSwitchDashboardView(e.target.value as DashboardViewType)}
                  className="w-full bg-brand-950/40 border border-brand-500/40 rounded-lg px-2 py-1.5 text-xs text-amber-300 font-bold focus:outline-none"
                >
                  <option value="SALES">💼 1. Sales Dashboard</option>
                  <option value="EVENT">🎟️ 2. Event Dashboard</option>
                  <option value="MARKETING">📣 3. Marketing Dashboard</option>
                  <option value="EMPLOYEE">🛠️ 4. Employee Dashboard</option>
                  <option value="ADMIN_MASTER">👑 5. Master Admin Command</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Active Dashboard Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {currentDashboard.title}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {currentDashboard.badge}
              </span>
            </div>

            <div className="space-y-1">
              {activeDashboardItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-glow-brand font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Super Admin Persistent Core Settings (Mobile) - Only in ADMIN_MASTER view */}
          {isSuperAdmin && activeDashboardView === 'ADMIN_MASTER' && (
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Core Admin & Settings
                </span>
                <span className="text-[8px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                  SUPER
                </span>
              </div>
              <div className="space-y-1">
                {coreAdminItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white font-bold border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <ItemIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Drawer Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={() => {
              setMobileDrawerOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* DESKTOP ISOLATED WORKING DASHBOARD SIDEBAR */}
      <aside className={`hidden lg:flex ${collapsed ? 'w-20' : 'w-72'} bg-slate-900/95 border-r border-slate-800 flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen z-40`}>
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-glow-brand shrink-0">
              V
            </div>
            {!collapsed && (
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block leading-tight">
                  VELAMETRIC
                </span>
                <span className="text-[9px] text-brand-400 font-mono tracking-widest uppercase">Admin Command</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar collapse"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* ACTIVE AGENT PROFILE & DEMO ROLE SWITCHER */}
        {currentUser && (
          <div className="p-3 border-b border-slate-800 bg-slate-950/80">
            {!collapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{currentUser.full_name}</div>
                    <div className="text-[10px] text-amber-400 font-mono truncate">{currentUser.department} ({currentUser.user_code})</div>
                  </div>
                </div>

                {/* SUPER ADMIN MASTER VIEW SWITCHER */}
                {isSuperAdmin && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="text-[9px] uppercase font-extrabold text-amber-400 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3 h-3 text-brand-400" />
                        Master View Switcher
                      </span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">RBAC</span>
                    </label>
                    <div className="relative">
                      <select
                        value={activeDashboardView}
                        onChange={(e) => handleSwitchDashboardView(e.target.value as DashboardViewType)}
                        className="w-full bg-slate-900 border border-amber-500/40 hover:border-amber-400 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm transition-all"
                      >
                        <option value="SALES">💼 1. Sales Dashboard</option>
                        <option value="EVENT">🎟️ 2. Event Dashboard</option>
                        <option value="MARKETING">📣 3. Marketing Dashboard</option>
                        <option value="EMPLOYEE">🛠️ 4. Employee Dashboard</option>
                        <option value="ADMIN_MASTER">👑 5. Master Admin Command</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2" title={`${currentUser.full_name} (${currentUser.role})`}>
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                  {currentUser.full_name.charAt(0)}
                </div>
                {isSuperAdmin && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Super Admin Mode Active" />
                )}
              </div>
            )}
          </div>
        )}

        {/* ACTIVE WORKING DASHBOARD NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          
          {/* Current Dashboard Section Header */}
          {!collapsed ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentDashboard.colorAccent}`} />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {currentDashboard.title}
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {currentDashboard.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-1">
                {currentDashboard.focus}
              </p>
            </div>
          ) : (
            <div className="text-center py-1">
              <span className="text-[8px] font-bold text-brand-400 uppercase font-mono">
                {activeDashboardView}
              </span>
            </div>
          )}

          {/* Active Dashboard Items */}
          <div className="space-y-1">
            {activeDashboardItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'));

              if (collapsed) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative group flex items-center justify-center w-12 h-10 mx-auto rounded-xl transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-glow-brand'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={item.label}
                  >
                    <ItemIcon className="w-4 h-4" />
                    {item.badge && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-bold shadow-sm shadow-brand-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* PERSISTENT CORE ADMINISTRATION & SETTINGS - STRICTLY ONLY IN ADMIN_MASTER VIEW */}
          {isSuperAdmin && activeDashboardView === 'ADMIN_MASTER' && (
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
              {!collapsed ? (
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-amber-400" />
                    Core Admin & Settings
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                    SUPER
                  </span>
                </div>
              ) : (
                <div className="border-t border-slate-800 pt-2 text-center">
                  <Shield className="w-4 h-4 text-amber-400 mx-auto" />
                </div>
              )}

              <div className="space-y-0.5">
                {coreAdminItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

                  if (collapsed) {
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`relative group flex items-center justify-center w-12 h-9 mx-auto rounded-xl transition-all ${
                          isActive
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                        title={item.label}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white font-bold border border-slate-700/80 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <ItemIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between bg-slate-900/70 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-2.5 text-xs truncate">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Velametric icon pill on mobile */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-glow-brand lg:hidden shrink-0">
              V
            </div>

            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400 hidden sm:inline">Admin</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="font-bold text-brand-400 truncate">
                {currentDashboard.title}
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-slate-200 uppercase tracking-wider font-mono text-[11px] truncate">
                {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Super Admin Quick Settings Button */}
            {isSuperAdmin && (
              <button
                onClick={() => handleSwitchDashboardView('ADMIN_MASTER')}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  activeDashboardView === 'ADMIN_MASTER'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Switch to Master Admin Command"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin Settings</span>
              </button>
            )}

            {/* Quick Currency Selector Pill */}
            <CurrencySelector compact />

            <Link
              to="/"
              target="_blank"
              className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span className="hidden sm:inline">Preview Website</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* CONTEXTUAL WORKSPACE TABS (Quick horizontal tab bar for active dashboard tools) */}
        {activeDashboardItems.length > 1 && (
          <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-6 py-2 backdrop-blur sticky top-16 z-20 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-max gap-4">
              {/* Active Dashboard Pill */}
              <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
                  {currentDashboard.shortTitle}
                </span>
              </div>

              {/* Sub-Tool Switcher Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {activeDashboardItems.map((item) => {
                  const SubIcon = item.icon;
                  const isItemActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isItemActive
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                      }`}
                    >
                      <SubIcon className={`w-3.5 h-3.5 ${isItemActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                          isItemActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Route Content OR Permission Guard */}
        <div className="p-3.5 sm:p-6 md:p-8 flex-1 pb-24 lg:pb-8">
          {currentPathAllowed ? (
            <Outlet />
          ) : (
            <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <Shield className="w-16 h-16 text-rose-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white font-display">Restricted Access</h2>
              <p className="text-xs text-slate-400">
                Your current role <span className="text-amber-400 font-bold font-mono">({currentUser?.role})</span> does not have authorization to view this module.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Return to Authorized Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE BOTTOM QUICK NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around text-[10px] font-bold text-slate-400 shadow-2xl">
          <Link
            to="/admin/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              location.pathname === '/admin/dashboard' ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          {activeDashboardItems.slice(1, 4).map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                  isActive ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </nav>
      </main>

    </div>
  );
};
export default AdminLayout;
