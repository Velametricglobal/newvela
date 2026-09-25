import React, { useEffect, useState, useRef } from 'react';
import { Service, ServiceCategory, ServicePackage } from '../../types/database.types';
import { serviceService } from '../../services/serviceService';
import { Link, useSearchParams } from 'react-router-dom';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { PackageEnquiryModal } from '../../components/public/PackageEnquiryModal';
import { SaaSProductDemoModal, SaaSProductType } from '../../components/public/SaaSProductDemoModal';
import { useCurrency } from '../../context/CurrencyContext';
import { 
  Laptop, ChevronRight, ChevronLeft, CheckCircle2, Search, Sparkles, ArrowRight, 
  HelpCircle, Check, X, LayoutGrid, Code2, Megaphone, Palette, 
  Video, Newspaper, Landmark, Calendar, SlidersHorizontal, Layers,
  Maximize2, Play, Compass
} from 'lucide-react';

// Public Services & SaaS Products Catalog Page
export const ServicesPage: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || searchParams.get('category');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>(catParam || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Horizontal Category Scroll Container Ref & State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Package Enquiry Modal State
  const [activeEnquiry, setActiveEnquiry] = useState<{ service: Service; packageItem: ServicePackage } | null>(null);

  // Full-Size Photo Modal State
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Interactive SaaS Product Demo State
  const [activeDemo, setActiveDemo] = useState<{ type: SaaSProductType; service?: Service } | null>(null);

  useEffect(() => {
    const loadServices = () => {
      serviceService.getCategories().then(setCategories);
      serviceService.getServices().then(setServices);
    };

    loadServices();

    window.addEventListener('velametric_services_updated', loadServices);
    window.addEventListener('storage', loadServices);
    window.addEventListener('focus', loadServices);

    return () => {
      window.removeEventListener('velametric_services_updated', loadServices);
      window.removeEventListener('storage', loadServices);
      window.removeEventListener('focus', loadServices);
    };
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCat(catParam);
    }
  }, [catParam]);

  // Calculate scrollability for navigation arrows
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories, services]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollability, 300);
    }
  };

  // Automatically scroll selected category pill into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setTimeout(checkScrollability, 300);
    }
  }, [selectedCat]);

  // Helper function to map category icon dynamically
  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes('all')) return LayoutGrid;
    if (s.includes('strategy') || s.includes('consulting') || s.includes('audit')) return Compass;
    if (s.includes('brand') || s.includes('architecture') || s.includes('graphic') || s.includes('logo')) return Palette;
    if (s.includes('software') || s.includes('engineering') || s.includes('dev') || s.includes('web') || s.includes('saas')) return Code2;
    if (s.includes('news') || s.includes('portal') || s.includes('channel') || s.includes('rni')) return Newspaper;
    if (s.includes('pr') || s.includes('media')) return Megaphone;
    if (s.includes('fin') || s.includes('consultancy') || s.includes('loan') || s.includes('credit')) return Landmark;
    if (s.includes('event')) return Calendar;
    return Layers;
  };

  // Calculate service counts per category with intelligent matching across seeds and db
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return services.length;
    const cat = categories.find(c => c.id === catId || c.slug === catId);
    if (cat && (cat.slug === 'software-engineering' || cat.name?.toLowerCase().includes('software'))) {
      const allowedSlugs = ['website-development', 'custom-web-app-crm-erp', 'shopify-store-setup'];
      return services.filter(s => 
        allowedSlugs.includes(s.slug) || 
        s.name.toLowerCase() === 'website development' || 
        s.name.toLowerCase().includes('fully customize web app + crm') || 
        s.name.toLowerCase() === 'shopify store setup'
      ).length;
    }
    return services.filter(s => {
      if (s.category_id === catId) return true;
      if (cat && s.category_id === cat.id) return true;
      if (cat && s.category_id === cat.slug) return true;
      if (cat && s.category_name && cat.name && s.category_name.toLowerCase().trim() === cat.name.toLowerCase().trim()) return true;
      return false;
    }).length;
  };

  // Filter out duplicate or empty 0-count categories to avoid cluttered buttons
  const visibleCategories = categories.filter(c => getCategoryCount(c.id) > 0 || selectedCat === c.id || selectedCat === c.slug);

  const filteredServices = services.filter(s => {
    const matchedCategoryObj = categories.find(c => c.id === selectedCat || c.slug === selectedCat);
    
    let matchesCat = false;
    if (selectedCat === 'all') {
      matchesCat = true;
    } else if (matchedCategoryObj && (matchedCategoryObj.slug === 'software-engineering' || matchedCategoryObj.name?.toLowerCase().includes('software'))) {
      const allowedSlugs = ['website-development', 'custom-web-app-crm-erp', 'shopify-store-setup'];
      matchesCat = allowedSlugs.includes(s.slug) || 
        s.name.toLowerCase() === 'website development' || 
        s.name.toLowerCase().includes('fully customize web app + crm') || 
        s.name.toLowerCase() === 'shopify store setup';
    } else {
      matchesCat = Boolean(
        s.category_id === selectedCat || 
        (matchedCategoryObj && s.category_id === matchedCategoryObj.id) ||
        (matchedCategoryObj && s.category_name && matchedCategoryObj.name && s.category_name.toLowerCase().trim() === matchedCategoryObj.name.toLowerCase().trim())
      );
    }

    const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) || s.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeCategoryObj = categories.find(c => c.id === selectedCat || c.slug === selectedCat);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Title Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/5">
          <Sparkles className="w-3.5 h-3.5" /> OUR PRODUCTS & SERVICES — PACKAGE & PRICING SYSTEM
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
          Transparent Packages & Custom Pricing
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Standardized <span className="text-white font-bold">Startup</span>, <span className="text-amber-400 font-bold">Enterprise</span>, and <span className="text-amber-300 font-bold">Organization</span> tiers designed for Indian startups, growing businesses, and institutions.
        </p>
      </div>

      {/* ULTRA-CLEAN & ORGANIZED CATEGORY FILTER CONTROL PANEL */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Top Control Bar: Search Input & Currency Switcher */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Live Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search services, marketing, loans, web apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white p-0.5 rounded-full hover:bg-zinc-800 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Status Info & Currency Selector Pill */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Showing <span className="text-amber-400 font-bold">{filteredServices.length}</span> of {services.length} offerings
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/90 px-4 py-2 rounded-2xl border border-zinc-800/90 shadow-sm">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase font-mono tracking-wider">Currency:</span>
              <CurrencySelector compact />
            </div>
          </div>
        </div>

        {/* Subtle Glowing Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* ORGANIZED CATEGORY NAVIGATION PILLS (BEAUTIFUL HORIZONTAL SCROLL WITH NAVIGATION CONTROLS) */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> Filter by Category:
            </span>
            <div className="flex items-center gap-3">
              {selectedCat !== 'all' && (
                <button 
                  onClick={() => setSelectedCat('all')} 
                  className="text-amber-400 hover:text-amber-300 hover:underline text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Reset Filter ({services.length})
                </button>
              )}
              <span className="text-[10px] text-zinc-500 hidden sm:inline-block">
                Scroll horizontally or use arrows
              </span>
            </div>
          </div>

          {/* Smooth Scrollable Carousel Track with Floating Controls & Edge Fades */}
          <div className="relative group/scroll">
            {/* Left Scroll Arrow Button */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-6 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="pointer-events-auto p-2 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center -ml-1"
                  title="Scroll Left"
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            )}

            {/* Right Scroll Arrow Button */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-6 bg-gradient-to-l from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="pointer-events-auto p-2 rounded-full bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center -mr-1"
                  title="Scroll Right"
                  aria-label="Scroll categories right"
                >
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            )}

            {/* Single Row Horizontal Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollability}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-1 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* All Offerings Category Pill */}
              {(() => {
                const Icon = getCategoryIcon('all');
                const isSelected = selectedCat === 'all';
                const count = getCategoryCount('all');
                return (
                  <button
                    key="cat-all"
                    data-selected={isSelected}
                    onClick={() => setSelectedCat('all')}
                    className={`group relative flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md shrink-0 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : 'bg-zinc-950/90 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                    <span>All Offerings</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })()}

              {/* Dynamic Active Categories (Only categories with offerings) */}
              {visibleCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug || cat.name);
                const isSelected = selectedCat === cat.id || selectedCat === cat.slug;
                const count = getCategoryCount(cat.id);

                return (
                  <button
                    key={cat.id}
                    data-selected={isSelected}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`group relative flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md shrink-0 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20 scale-[1.02]'
                        : 'bg-zinc-950/90 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                    <span>{cat.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Category Detail Banner */}
        {activeCategoryObj && (
          <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Viewing Category: <strong className="text-white font-display">{activeCategoryObj.name}</strong></span>
              {activeCategoryObj.description && (
                <span className="hidden md:inline text-zinc-500">— {activeCategoryObj.description}</span>
              )}
            </div>
            <span className="text-amber-400 font-bold">{getCategoryCount(activeCategoryObj.id)} Service Packages</span>
          </div>
        )}
      </div>

      {/* Services List & Package Cards */}
      <div className="space-y-16">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">No Offerings Found</h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              We couldn't find any products or services matching "{searchQuery}". Try searching for keywords like "website", "marketing", "subsidy", or "reels".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCat('all'); }} 
              className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-lg inline-flex items-center gap-1.5"
            >
              Reset All Search Filters
            </button>
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div key={srv.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-8 space-y-8 backdrop-blur-xl shadow-2xl">
              {/* Full Size Service Photo Showcase Banner */}
              {srv.cover_image && (
                <div 
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl relative group cursor-pointer"
                  onClick={() => setPreviewImage({ url: srv.cover_image!, title: srv.name })}
                >
                  <img 
                    src={srv.cover_image} 
                    alt={srv.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  {/* Cinematic dark gradients for contrast and text clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent hidden sm:block" />

                  {/* Top floating badge & full size preview button */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 right-4 sm:right-6 flex justify-between items-center pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest font-mono bg-zinc-950/85 border border-amber-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      {srv.category_name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage({ url: srv.cover_image!, title: srv.name });
                      }}
                      className="pointer-events-auto px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group-hover:border-amber-500/50"
                      title="View Full Resolution Photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline font-mono text-[11px]">FULL SIZE</span>
                    </button>
                  </div>

                  {/* Bottom overlay: title, description & Details CTA */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-none">
                    <div className="space-y-2 max-w-2xl">
                      <h2 className="text-2xl sm:text-4xl font-black text-white font-display drop-shadow-xl tracking-tight">
                        {srv.name}
                      </h2>
                      <p className="text-zinc-200 text-xs sm:text-sm md:text-base leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-none">
                        {srv.short_description}
                      </p>
                    </div>
                    <div className="pointer-events-auto w-full sm:w-auto flex flex-col sm:flex-row gap-2.5">
                      {/* Interactive SaaS Demo Trigger */}
                      {(srv.slug.includes('education') || srv.slug.includes('property') || srv.slug.includes('ecommerce') || srv.category_id === 'cat-saas') && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const demoType = srv.slug.includes('education') ? 'education' : srv.slug.includes('property') ? 'property-crm' : 'ecommerce';
                            setActiveDemo({ type: demoType, service: srv });
                          }}
                          className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-black" /> Launch Live Demo
                        </button>
                      )}
                      <Link
                        to={`/services/${srv.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95"
                      >
                        Full Details & Inclusions <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback Header if no photo exists */}
              {!srv.cover_image && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-800 pb-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full inline-block">
                      {srv.category_name}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">{srv.name}</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">{srv.short_description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {(srv.slug.includes('education') || srv.slug.includes('property') || srv.slug.includes('ecommerce') || srv.category_id === 'cat-saas') && (
                      <button
                        type="button"
                        onClick={() => {
                          const demoType = srv.slug.includes('education') ? 'education' : srv.slug.includes('property') ? 'property-crm' : 'ecommerce';
                          setActiveDemo({ type: demoType, service: srv });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-black" /> Launch Live Demo
                      </button>
                    )}
                    <Link
                      to={`/services/${srv.slug}`}
                      className="w-full md:w-auto justify-center px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md"
                    >
                      Full Details & Inclusions <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Package Tiers Grid: Starter, Growth, Enterprise Custom */}
              {srv.packages && srv.packages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {srv.packages.map((pkg, idx) => {
                    const isCustomQuote = pkg.price_display_type === 'CUSTOM_QUOTE' || Number(pkg.price) === 0 || (pkg as any).is_contact_for_quote || pkg.tier === 'ORGANIZATION';
                    const isFeatured = pkg.badge === 'Most Popular' || pkg.tier === 'GROWTH' || (srv.packages && srv.packages.length === 3 && idx === 1);

                    return (
                      <div
                        key={pkg.id}
                        className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                          isFeatured
                            ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 border-2 border-amber-500/50 shadow-2xl md:scale-[1.02] z-10'
                            : isCustomQuote
                            ? 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800 hover:border-amber-400/40 shadow-xl'
                            : 'bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        {/* Package Badge */}
                        {pkg.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider font-mono shadow-lg">
                            {pkg.badge}
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Header & Target Audience */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                              {pkg.tier}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-0.5 font-display">{pkg.name}</h3>
                            <p className="text-[11px] text-amber-400/90 font-medium mt-1">{pkg.target_audience}</p>
                          </div>

                          {/* Price Tag */}
                          <div className="py-3 border-y border-zinc-800/80">
                            {isCustomQuote ? (
                              <div>
                                <div className="text-2xl sm:text-3xl font-black text-white font-display">Custom Plan</div>
                                <div className="text-[11px] text-amber-400 font-semibold font-mono">Contact for Custom Quote</div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-3xl font-black text-white font-display">
                                  {formatAmount(pkg.price)}
                                </div>
                                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                  {pkg.price_display_type === 'PER_MONTH' && 'Starting at / Month'}
                                  {pkg.price_display_type === 'PER_PROJECT' && 'Starting at / Project'}
                                  {pkg.price_display_type === 'PER_CASE' && 'Starting at / Case'}
                                  {pkg.price_display_type === 'STARTING_FROM' && 'Starting Price'}
                                  {pkg.price_display_type === 'FIXED' && 'Fixed Price Package'}
                                  {!pkg.price_display_type && 'Starting Price'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Inclusions List */}
                          <div>
                            <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">Key Inclusions:</div>
                            <ul className="space-y-2">
                              {pkg.inclusions.slice(0, 7).map((inc, idxInc) => (
                                <li key={idxInc} className="flex items-start gap-2 text-xs text-zinc-300">
                                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span>{inc}</span>
                                </li>
                              ))}
                              {pkg.inclusions.length > 7 && (
                                <li className="text-[10px] text-amber-400 font-semibold font-mono pt-1">
                                  + {pkg.inclusions.length - 7} more inclusions (view full details)
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Exclusions Brief */}
                          {pkg.exclusions && pkg.exclusions.length > 0 && (
                            <div className="pt-2 border-t border-zinc-800/60">
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Excludes:</div>
                              <div className="text-[11px] text-zinc-400 italic line-clamp-2">
                                {pkg.exclusions.slice(0, 3).join(', ')}...
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-2">
                          <button
                            onClick={() => setActiveEnquiry({ service: srv, packageItem: pkg })}
                            className={`w-full py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                              isFeatured
                                ? 'bg-amber-400 hover:bg-amber-300 text-black'
                                : isCustomQuote
                                ? 'bg-amber-400/90 hover:bg-amber-300 text-black'
                                : 'bg-white hover:bg-zinc-200 text-black'
                            }`}
                          >
                            {pkg.cta_text || (isCustomQuote ? 'Contact for Custom Plan' : 'Get Started')} <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/services/${srv.slug}`}
                            className="w-full py-2 text-center text-[11px] font-bold text-zinc-400 hover:text-white block transition-colors"
                          >
                            View Details & Comparison
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Service Disclaimer */}
              {srv.disclaimer && (
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{srv.disclaimer}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Package Enquiry & Quotation Modal */}
      {activeEnquiry && (
        <PackageEnquiryModal
          service={activeEnquiry.service}
          packageItem={activeEnquiry.packageItem}
          isOpen={!!activeEnquiry}
          onClose={() => setActiveEnquiry(null)}
        />
      )}

      {/* Full-Size Photo Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex justify-between items-center border-b border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-white font-bold text-sm sm:text-base font-display">{previewImage.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full-Size Image Container */}
            <div className="w-full max-h-[75vh] sm:max-h-[80vh] overflow-auto flex items-center justify-center bg-black/90 p-2 sm:p-4">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-400">High Resolution Service Photo</span>
              <a 
                href={previewImage.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                Open Original Image <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SaaS Product Demo Sandbox Modal */}
      {activeDemo && (
        <SaaSProductDemoModal
          productType={activeDemo.type}
          isOpen={!!activeDemo}
          onClose={() => setActiveDemo(null)}
          onOrderPackage={() => {
            if (activeDemo.service && activeDemo.service.packages && activeDemo.service.packages.length > 0) {
              const bestPkg = activeDemo.service.packages.find(p => p.badge === 'Most Popular') || activeDemo.service.packages[0];
              setActiveEnquiry({
                service: activeDemo.service,
                packageItem: bestPkg
              });
            }
          }}
        />
      )}
    </div>
  );
};
