import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SiteSettings, Service, ServiceCategory } from '../../types/database.types';
import { settingsService } from '../../services/settingsService';
import { serviceService } from '../../services/serviceService';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';
import { 
  Laptop, Phone, Mail, ArrowRight, ChevronDown, ChevronRight, Menu, X, User, Video, 
  MessageSquare, Send, Sparkles, Code2, Megaphone, Palette, Newspaper, Landmark, 
  Calendar, School, Building2, ShoppingBag, Layers, ArrowUpRight,
  Building, Briefcase, BookOpen, ShieldCheck, FileText,
  Compass, LineChart, PenTool, Layout, Cpu, Tv, Users, Shield, Award, FileSpreadsheet, Home, Globe, Film, Camera
} from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isImportantLinksOpen, setIsImportantLinksOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileImportantLinksOpen, setMobileImportantLinksOpen] = useState(false);
  const [mobileOpenCatId, setMobileOpenCatId] = useState<string | null>(null);
  const [headerMouse, setHeaderMouse] = useState<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });

  useEffect(() => {
    const loadData = () => {
      settingsService.getSiteSettings().then(setSiteSettings);
      serviceService.getCategories().then((cats) => {
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategoryId(prev => (prev && cats.some(c => c.id === prev)) ? prev : cats[0].id);
        }
      });
      serviceService.getServices().then(setServices);
    };

    loadData();

    window.addEventListener('velametric_services_updated', loadData);
    window.addEventListener('velametric_settings_updated', loadData);
    window.addEventListener('storage', loadData);
    window.addEventListener('focus', loadData);

    return () => {
      window.removeEventListener('velametric_services_updated', loadData);
      window.removeEventListener('velametric_settings_updated', loadData);
      window.removeEventListener('storage', loadData);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  // Helper function to map category icon dynamically
  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes('strategy') || s.includes('consulting') || s.includes('audit')) return Compass;
    if (s.includes('brand') || s.includes('architecture') || s.includes('graphic') || s.includes('logo')) return Palette;
    if (s.includes('software') || s.includes('engineering') || s.includes('dev') || s.includes('web') || s.includes('saas')) return Code2;
    if (s.includes('news') || s.includes('channel') || s.includes('rni') || s.includes('portal')) return Newspaper;
    if (s.includes('pr') || s.includes('media')) return Megaphone;
    if (s.includes('financial') || s.includes('fin') || s.includes('loan') || s.includes('credit')) return Landmark;
    if (s.includes('event')) return Calendar;
    return Layers;
  };

  // Helper function to map service icon dynamically
  const getServiceIcon = (srv: Service) => {
    const s = (srv.slug + ' ' + srv.name + ' ' + (srv.category_name || '')).toLowerCase();
    if (s.includes('audit') || s.includes('analysis')) return LineChart;
    if (s.includes('strategy') || s.includes('planning')) return Compass;
    if (s.includes('full digital') || s.includes('digital management') || s.includes('operations')) return Cpu;
    if (s.includes('logo')) return PenTool;
    if (s.includes('ui') || s.includes('ux') || s.includes('design')) return Layout;
    if (s.includes('branding') || s.includes('brand identity')) return Palette;
    if (s.includes('shopify') || s.includes('store') || s.includes('ecommerce')) return ShoppingBag;
    if (s.includes('website development') || s.includes('web development')) return Globe;
    if (s.includes('customized web app') || s.includes('crm') || s.includes('erp') || s.includes('software')) return Laptop;
    if (s.includes('studio') || s.includes('channel') || s.includes('broadcast')) return Tv;
    if (s.includes('rni') || s.includes('compliance')) return ShieldCheck;
    if (s.includes('news portal') || s.includes('newspaper')) return Newspaper;
    if (s.includes('press release') || s.includes('wire')) return Send;
    if (s.includes('media relations') || s.includes('editorial') || s.includes('pr')) return Users;
    if (s.includes('reputation') || s.includes('orm')) return Award;
    if (s.includes('subsidy') || s.includes('refund')) return Landmark;
    if (s.includes('business loan') || s.includes('cash credit') || s.includes('working capital')) return Briefcase;
    if (s.includes('dpr') || s.includes('project finance')) return FileSpreadsheet;
    if (s.includes('home loan') || s.includes('personal loan') || s.includes('mortgage')) return Home;
    if (s.includes('school') || s.includes('college') || s.includes('education')) return School;
    if (s.includes('property') || s.includes('real estate')) return Building2;
    return Sparkles;
  };

  // Filter services belonging to a category
  const getServicesForCategory = (cat: ServiceCategory) => {
    // Software & Web Engineering: strictly ONLY the 3 designated services
    if (cat.slug === 'software-engineering' || cat.name?.toLowerCase().includes('software')) {
      const allowedSlugs = ['website-development', 'custom-web-app-crm-erp', 'shopify-store-setup'];
      return services.filter(s => 
        allowedSlugs.includes(s.slug) || 
        s.name.toLowerCase() === 'website development' || 
        s.name.toLowerCase().includes('fully customize web app + crm') || 
        s.name.toLowerCase() === 'shopify store setup'
      );
    }

    return services.filter(s => 
      s.category_id === cat.id || 
      s.category_id === cat.slug || 
      (s.category_name && cat.name && s.category_name.toLowerCase().trim() === cat.name.toLowerCase().trim())
    );
  };

  const getServiceBadge = (srv: Service) => {
    const s = (srv.slug + ' ' + srv.name).toLowerCase();
    if (s.includes('subsidy')) return { text: 'Up to 25% Refund', color: 'bg-amber-400/20 text-amber-300 border-amber-400/40' };
    if (s.includes('crm') || s.includes('erp') || s.includes('custom-web-app')) return { text: 'Custom Architecture', color: 'bg-amber-400/15 text-amber-300 border-amber-400/30' };
    if (s.includes('shopify')) return { text: 'E-Commerce', color: 'bg-zinc-800 text-white border-zinc-700' };
    if (s.includes('rni')) return { text: 'Govt Reg', color: 'bg-amber-400/15 text-amber-300 border-amber-400/30' };
    if (s.includes('wire') || s.includes('press')) return { text: '500+ Outlets', color: 'bg-white/10 text-white border-white/20' };
    if (s.includes('audit')) return { text: '360° Audit', color: 'bg-amber-400/15 text-amber-300 border-amber-400/30' };
    if (s.includes('logo') || s.includes('branding')) return { text: 'Brand Identity', color: 'bg-zinc-800 text-amber-300 border-zinc-700' };
    if (s.includes('ui') || s.includes('ux')) return { text: 'Figma System', color: 'bg-white/10 text-white border-white/20' };
    if (s.includes('business-loan') || s.includes('cash-credit')) return { text: 'Fast Sanction', color: 'bg-amber-400/20 text-amber-300 border-amber-400/40' };
    if (s.includes('personal-home-loans')) return { text: 'Lowest ROI', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (s.includes('studio') || s.includes('channel')) return { text: 'Broadcast Setup', color: 'bg-white/10 text-white border-white/20' };
    if (s.includes('digital-management')) return { text: 'End-to-End', color: 'bg-amber-400/15 text-amber-300 border-amber-400/30' };
    return null;
  };

  const currentCategory = categories.find(c => c.id === activeCategoryId) || categories[0] || null;
  const currentCategoryServices = currentCategory ? getServicesForCategory(currentCategory) : [];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black font-sans pb-24 lg:pb-0 relative">
      {/* Background Slow Music Player */}
      <BackgroundMusicPlayer />

      {/* Squarespace-Style Ultra-Clean Header */}
      <header
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHeaderMouse({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
          });
        }}
        onMouseLeave={() => setHeaderMouse(prev => ({ ...prev, active: false }))}
        className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60 relative"
      >
        {/* In-Header Cursor Spotlight Beam (Sits strictly at z-10 BEHIND all header text, logo & navigation) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
          {headerMouse.active && (
            <>
              {/* Wide soft ambient luminous bloom */}
              <div
                className="absolute w-[450px] h-[220px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200"
                style={{
                  left: `${headerMouse.x}px`,
                  top: `${headerMouse.y}px`,
                  background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.12) 35%, rgba(245, 158, 11, 0.03) 60%, transparent 80%)',
                  filter: 'blur(16px)',
                }}
              />

              {/* Focused high-intensity highlight beam illuminating behind active text & buttons */}
              <div
                className="absolute w-48 h-24 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150"
                style={{
                  left: `${headerMouse.x}px`,
                  top: `${headerMouse.y}px`,
                  background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.28) 0%, rgba(251, 191, 36, 0.4) 40%, rgba(245, 158, 11, 0) 75%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Sleek bottom-edge metallic light tracker beam */}
              <div
                className="absolute bottom-0 h-[1.5px] w-52 -translate-x-1/2 pointer-events-none transition-all duration-75"
                style={{
                  left: `${headerMouse.x}px`,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.9) 50%, transparent 100%)',
                  boxShadow: '0 0 12px 2px rgba(245, 158, 11, 0.7)',
                }}
              />
            </>
          )}
        </div>

        {/* Header Content Container (Sits strictly at z-20 IN FRONT of the light) */}
        <div className="relative z-20 max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 xl:gap-6">
          
          {/* Velametric Signature Logo with Spotlight Backglow */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-sm shadow-md shadow-amber-400/25 group-hover:scale-105 group-hover:shadow-amber-400/50 transition-all duration-300">
              V
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white font-display uppercase transition-all duration-200 group-hover:text-amber-300 group-hover:drop-shadow-[0_0_16px_rgba(251,191,36,0.7)]">
              VELAMETRIC
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Products & Services Dropdown with Category & Sub-Category Organization */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                to="/services"
                className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900/80 px-2.5 xl:px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap"
              >
                <span>Products & Services</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </Link>

              {/* Desktop Organized Two-Pane Category & Sub-Category Mega Menu */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[880px] xl:w-[940px] max-w-[95vw] bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Top Brand Banner */}
                  <div className="px-6 py-2.5 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        VELAMETRIC SERVICE DIRECTORY &bull; {categories.length} ENTERPRISE CATEGORIES &bull; {services.length} SERVICES
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to="/free-trial"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" /> Start Free Trial <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        to="/services"
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        All Services <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Two-Pane Mega Menu (Categories on Left & Sub-Categories on Right) */}
                  <div className="flex divide-x divide-zinc-800/70 min-h-[420px]">
                    
                    {/* Left Pane: Categories List */}
                    <div className="w-[310px] shrink-0 bg-zinc-950/90 p-3 space-y-1 overflow-y-auto max-h-[460px]">
                      <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                        CATEGORIES
                      </div>
                      {categories.map((cat) => {
                        const CatIcon = getCategoryIcon(cat.slug || cat.name);
                        const count = getServicesForCategory(cat).length;
                        const isActive = (cat.id === (currentCategory?.id || 'cat-saas'));

                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveCategoryId(cat.id)}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                              isActive
                                ? 'bg-amber-400/15 text-white border border-amber-400/30 shadow-lg shadow-amber-500/5'
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                                isActive ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20' : 'bg-zinc-800/80 text-zinc-300 group-hover:bg-zinc-700 group-hover:text-white'
                              }`}>
                                <CatIcon className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <div className={`text-xs font-bold font-display truncate transition-colors ${
                                  isActive ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                                }`}>
                                  {cat.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 truncate">
                                  {cat.description || 'Enterprise solutions'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                                isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {count}
                              </span>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                                isActive ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Pane: Sub-Categories / Services under Selected Category */}
                    <div className="flex-1 p-5 flex flex-col justify-between bg-zinc-900/90">
                      <div>
                        {/* Active Category Header */}
                        {currentCategory && (
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                                  {currentCategory.name}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                                  {currentCategoryServices.length} Sub-Services
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                {currentCategory.description}
                              </p>
                            </div>
                            <Link
                              to={`/services?cat=${currentCategory.id}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700/50 transition-all shrink-0"
                            >
                              Explore Category <ArrowUpRight className="w-3 h-3 text-amber-400" />
                            </Link>
                          </div>
                        )}

                        {/* Sub-Services Grid */}
                        <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                          {currentCategoryServices.map((srv) => {
                            const SrvIcon = getServiceIcon(srv);
                            const badge = getServiceBadge(srv);

                            return (
                              <Link
                                key={srv.id}
                                to={`/services/${srv.slug}`}
                                onClick={() => setIsMegaMenuOpen(false)}
                                className="p-3 rounded-2xl bg-zinc-950/90 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-start gap-3 group relative"
                              >
                                <div className="p-2.5 rounded-xl bg-zinc-800/90 text-white shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-all">
                                  <SrvIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors font-display line-clamp-1">
                                      {srv.name}
                                    </span>
                                    {badge && (
                                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border font-mono uppercase shrink-0 ${badge.color}`}>
                                        {badge.text}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                                    {srv.short_description}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}

                          {currentCategoryServices.length === 0 && (
                            <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">
                              No services found under this category.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Strip */}
                      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between bg-zinc-950/90 -mx-5 -mb-5 px-5 py-3">
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Need a custom-tailored solution or specific SLA architecture?</span>
                        </div>
                        <Link
                          to="/request-quote"
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="text-[11px] font-extrabold text-black bg-white hover:bg-zinc-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all transform hover:scale-105"
                        >
                          Get Custom Proposal <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/portfolio"
              className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900/80 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              Our Work
            </Link>
            <Link
              to="/talents"
              className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900/80 px-2.5 xl:px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Talent Portfolio</span>
            </Link>
            <Link
              to="/case-studies"
              className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900/80 px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              Case Studies
            </Link>
            {/* Important Links Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsImportantLinksOpen(true)}
              onMouseLeave={() => setIsImportantLinksOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsImportantLinksOpen(!isImportantLinksOpen)}
                className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900/80 px-2.5 xl:px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap"
              >
                <span>Important Links</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isImportantLinksOpen ? 'rotate-180 text-amber-400' : ''}`} />
              </button>

              {/* Important Links Dropdown Menu */}
              {isImportantLinksOpen && (
                <div className="absolute top-full right-0 w-[380px] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/about"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                        About Us
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Our journey, leadership, creative studio network & global vision
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/careers"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                          Careers & WFH
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          FRESHERS WELCOME
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        100% remote project-based contracts & student opportunities
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/resources"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                        Resources & Insights
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Technical guides, agency playbooks & industry growth research
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/talents"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                          Talent Portfolio & Discovery
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          ELITE TALENT
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Discover & hire verified actors, models, singers, creators & athletes
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/models"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                          Elite Models & Runway Directory
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          MODELS
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Discover top runway models, comp cards, measurements & 8 portfolio templates
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/talent-showcase"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                          Model & Influencer Showcase
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          4 TEMPLATES
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Create custom comp-card & video portfolio profile with 4 presets
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                        Contact & Support
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Reach our consulting managers, client desk & studio partners
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/privacy-policy"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                        Legal & Compliance
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Privacy policy, client data security & service terms
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/document-generator"
                    onClick={() => setIsImportantLinksOpen(false)}
                    className="p-3 rounded-2xl hover:bg-zinc-900/90 transition-all flex items-start gap-3.5 group border-t border-zinc-800/40"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-950/30 border border-amber-400/40 text-amber-300 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                          Document Generator
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 font-mono text-[9px] font-extrabold uppercase tracking-wider">
                          FREE TOOL
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-snug">
                        Generate invoices, NDA, agreements, quotes & receipts
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            <Link
              to="/document-generator"
              className="text-xs font-bold text-amber-300 hover:text-black hover:bg-amber-400 transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 hover:border-amber-300 shadow-sm whitespace-nowrap hover:scale-105"
              title="Launch Document Generator"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Doc Generator</span>
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap hover:scale-105"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Log In</span>
            </Link>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-zinc-950 bg-white hover:bg-amber-400 hover:text-zinc-950 transition-all duration-200 transform hover:scale-105 shadow-md shadow-white/5 hover:shadow-amber-400/20 whitespace-nowrap active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right Bar: Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Sits at z-20 in front of the light) */}
        {isMobileMenuOpen && (
          <div className="relative z-20 lg:hidden bg-zinc-900 border-b border-zinc-800 p-5 space-y-3 text-xs font-bold uppercase tracking-wider max-h-[80vh] overflow-y-auto shadow-2xl">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white py-2 border-b border-zinc-800/60">
              Home
            </Link>

            {/* Products & Services Collapsible in Mobile Drawer */}
            <div className="border-b border-zinc-800/60 pb-2">
              <div className="flex items-center justify-between py-2 text-white">
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Products & Services
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  aria-label="Toggle services list"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pl-2 pr-1 py-2 space-y-2 bg-zinc-950/70 rounded-2xl mb-1 border border-zinc-800/60">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 pt-1 font-bold">
                    CATEGORIES & SUB-SERVICES
                  </div>
                  
                  {categories.map((cat) => {
                    const CatIcon = getCategoryIcon(cat.slug || cat.name);
                    const catServices = getServicesForCategory(cat);
                    const isExpanded = mobileOpenCatId === cat.id;

                    return (
                      <div key={cat.id} className="border border-zinc-800/50 rounded-xl overflow-hidden bg-zinc-900/40">
                        <button
                          type="button"
                          onClick={() => setMobileOpenCatId(isExpanded ? null : cat.id)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400 shrink-0">
                              <CatIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-200">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              {catServices.length}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-400' : ''}`} />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="pl-5 pr-3 py-2 space-y-2 bg-zinc-950/90 border-t border-zinc-800/40">
                            {catServices.map((srv) => (
                              <Link
                                key={srv.id}
                                to={`/services/${srv.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-1.5 text-xs text-zinc-300 hover:text-amber-400 transition-colors"
                              >
                                <div className="font-semibold text-white hover:text-amber-400 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                  <span>{srv.name}</span>
                                </div>
                                <div className="text-[10px] text-zinc-400 line-clamp-1 pl-3 mt-0.5">
                                  {srv.short_description}
                                </div>
                              </Link>
                            ))}
                            <Link
                              to={`/services?cat=${cat.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="inline-block text-[11px] text-amber-400 font-bold uppercase tracking-wider pt-1 hover:underline"
                            >
                              Explore {cat.name} →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-all mt-2"
                  >
                    View Complete Pricing Catalog & All Services →
                  </Link>
                </div>
              )}
            </div>

            <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="block text-white py-2 border-b border-zinc-800/60">
              Our Work
            </Link>
            <Link to="/talents" onClick={() => setIsMobileMenuOpen(false)} className="block text-amber-400 font-bold py-2 border-b border-zinc-800/60 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Talent Portfolio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold uppercase">
                FEATURED
              </span>
            </Link>
            <Link to="/case-studies" onClick={() => setIsMobileMenuOpen(false)} className="block text-white py-2 border-b border-zinc-800/60">
              Case Studies
            </Link>
            {/* Mobile Important Links Accordion */}
            <div className="border-b border-zinc-800/60">
              <div className="flex items-center justify-between py-2">
                <button
                  type="button"
                  onClick={() => setMobileImportantLinksOpen(!mobileImportantLinksOpen)}
                  className="flex items-center justify-between w-full text-left text-white font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" /> Important Links
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${mobileImportantLinksOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
              </div>

              {mobileImportantLinksOpen && (
                <div className="p-2 space-y-1 bg-zinc-950/90 rounded-2xl mb-2 border border-zinc-800/80">
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">About Us</div>
                      <div className="text-xs text-zinc-400 leading-tight">Our journey, leadership, creative studio network & global vision</div>
                    </div>
                  </Link>

                  <Link
                    to="/careers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white">Careers & WFH</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-extrabold uppercase">
                          FRESHERS WELCOME
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 leading-tight">100% remote project-based contracts & student opportunities</div>
                    </div>
                  </Link>

                  <Link
                    to="/resources"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Resources & Insights</div>
                      <div className="text-xs text-zinc-400 leading-tight">Technical guides, agency playbooks & industry growth research</div>
                    </div>
                  </Link>

                  <Link
                    to="/models"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white">Elite Models & Casting</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-extrabold uppercase">
                          MODELS
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 leading-tight">Runway models, comp cards, digitals & 8 templates</div>
                    </div>
                  </Link>

                  <Link
                    to="/talent-showcase"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white">Model & Influencer Showcase</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-extrabold uppercase">
                          4 TEMPLATES
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 leading-tight">Make custom comp-card & video portfolio profile</div>
                    </div>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Contact & Support</div>
                      <div className="text-xs text-zinc-400 leading-tight">Reach our consulting managers, client desk & studio partners</div>
                    </div>
                  </Link>

                  <Link
                    to="/privacy-policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-zinc-900/80 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Legal & Compliance</div>
                      <div className="text-xs text-zinc-400 leading-tight">Privacy policy, client data security & service terms</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/document-generator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-amber-950/30 border border-amber-400/30 text-amber-300 font-bold text-sm hover:bg-amber-400/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Document Generator
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                FREE TOOL
              </span>
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-amber-400 py-2 border-b border-zinc-800/60 font-mono">
              Log In (Agent Portal)
            </Link>
            <div className="pt-2">
              <Link
                to="/request-quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-block w-full text-center py-3.5 rounded-full bg-white text-black font-extrabold shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* STICKY MOBILE ACTION BAR (CALL | WHATSAPP | ENQUIRE) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 border-t border-zinc-800 backdrop-blur-xl px-4 py-2.5 flex items-center justify-around text-[10px] font-bold uppercase tracking-wider text-zinc-300">
        <a href="tel:+919876543210" className="flex items-center gap-1.5 py-1 text-white">
          <Phone className="w-3.5 h-3.5 text-amber-400" /> Call
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 py-1 text-amber-400">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> WhatsApp
        </a>
        <Link to="/login" className="flex items-center gap-1.5 py-1 text-amber-400 font-extrabold">
          <User className="w-3.5 h-3.5 text-amber-400" /> Log In
        </Link>
        <Link to="/request-quote" className="flex items-center gap-1.5 py-1 px-4 rounded-full bg-white text-black font-extrabold">
          <Send className="w-3 h-3 text-black" /> Enquire
        </Link>
      </div>

      {/* FLOATING BOOK CONSULTANT CALL BUTTON (BOTTOM LEFT) */}
      <div className="fixed bottom-16 lg:bottom-6 left-4 sm:left-6 z-40 no-print">
        <Link
          to="/book-consultation"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold shadow-lg shadow-amber-400/20 transition-all duration-200 hover:scale-105"
          title="Book a Consultation Call"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Call</span>
        </Link>
      </div>

      {/* Squarespace-Inspired Editorial Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 text-xs pt-16 sm:pt-20 pb-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          
          {/* Big Signature Brand Header */}
          <div className="border-b border-zinc-800 pb-12 mb-12 sm:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tighter font-display uppercase">
                VELAMETRIC
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mt-3">
                Everything to build your website, run your CRM, manage financial loan advisory, and produce high-impact video reels with Destiny, Dapflix & Ekraahee Films.
              </p>
            </div>
            <Link
              to="/free-trial"
              className="px-8 py-4 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
            >
              Start Free Product Trial
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 mb-12 sm:mb-16">
            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Products</h4>
              <ul className="space-y-3 font-medium">
                <li><Link to="/talents" className="hover:text-amber-400 transition-colors flex items-center gap-1"><span>Talent Directory</span> <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">PRO</span></Link></li>
                <li><Link to="/talent-dashboard" className="hover:text-amber-400 transition-colors">Talent Dashboard</Link></li>
                <li><Link to="/services/web-app-development" className="hover:text-white transition-colors">Website Builder</Link></li>
                <li><Link to="/services/digital-marketing" className="hover:text-white transition-colors">Commerce Tools</Link></li>
                <li><Link to="/services/government-subsidy-loans" className="hover:text-white transition-colors">Financial Advisory</Link></li>
                <li><Link to="/services/video-production-and-events" className="hover:text-white transition-colors">Video & Events</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Production Partners</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="https://www.instagram.com/destiny_in_productions/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Destiny Productions ↗</a></li>
                <li><a href="https://www.instagram.com/dapflix/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Dapflix ↗</a></li>
                <li><a href="https://www.instagram.com/ekraaheefilms/?hl=en#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Ekraahee Films ↗</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Resources</h4>
              <ul className="space-y-3 font-medium">
                <li><Link to="/resources" className="hover:text-white transition-colors">Resource Center</Link></li>
                <li>
                  <Link to="/free-trial" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>Product Free Trial</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">14 Days</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tools/document-generator" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>Document Generator</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Free</span>
                  </Link>
                </li>
                <li><Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Help & Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-3 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">About Velametric</Link></li>
                <li>
                  <Link to="/careers" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>Careers</span>
                    <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">We're Hiring</span>
                  </Link>
                </li>
                <li><Link to="/login" className="hover:text-white transition-colors">Log In (Agent Portal)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Legal</h4>
              <ul className="space-y-3 font-medium">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/payment-terms" className="hover:text-white transition-colors">Security & SLA</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Velametric Inc. All rights reserved.</p>
            <p className="mt-4 sm:mt-0 font-mono text-[11px]">Sub-Second Performance & Video Production Infrastructure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
