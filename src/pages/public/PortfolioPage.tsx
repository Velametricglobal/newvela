import React, { useEffect, useState } from 'react';
import { PortfolioProject } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Film, 
  Newspaper, 
  Server, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'NEWS' | 'CRM' | 'EVENTS'>('ALL');

  useEffect(() => {
    const loadProjects = () => {
      portfolioService.getProjects().then(setProjects);
    };

    loadProjects();

    window.addEventListener('velametric_portfolio_updated', loadProjects);
    window.addEventListener('storage', loadProjects);
    window.addEventListener('focus', loadProjects);

    return () => {
      window.removeEventListener('velametric_portfolio_updated', loadProjects);
      window.removeEventListener('storage', loadProjects);
      window.removeEventListener('focus', loadProjects);
    };
  }, []);

  const videoCount = projects.filter(p => p.category === 'video_production' || p.project_type === 'video_production').length;
  const newsCount = projects.filter(p => p.category === 'news_website').length;
  const crmCount = projects.filter(p => p.category === 'crm_saas' || (p.services_used || []).some(s => s.toLowerCase().includes('crm') || s.toLowerCase().includes('erp'))).length;
  const eventsCount = projects.filter(p => p.category === 'events' || p.project_type === 'events').length;

  const filteredProjects = projects.filter(p => {
    if (filter === 'VIDEO') return p.category === 'video_production' || p.project_type === 'video_production';
    if (filter === 'NEWS') return p.category === 'news_website';
    if (filter === 'CRM') return p.category === 'crm_saas' || (p.services_used || []).some(s => s.toLowerCase().includes('crm') || s.toLowerCase().includes('erp'));
    if (filter === 'EVENTS') return p.category === 'events' || p.project_type === 'events';
    return true;
  });

  const getCategoryMeta = (cat?: string, pType?: string) => {
    if (cat === 'news_website') {
      return {
        label: 'News Website',
        badgeBg: 'bg-red-500 text-white',
        icon: Newspaper,
        actionText: 'Visit Live News Site',
        actionStyle: 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-500/20'
      };
    }
    if (cat === 'video_production' || pType === 'video_production') {
      return {
        label: 'Video Production',
        badgeBg: 'bg-purple-500 text-white',
        icon: Film,
        actionText: 'Watch Video Showcase',
        actionStyle: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white shadow-purple-500/20'
      };
    }
    if (cat === 'events' || pType === 'events') {
      return {
        label: 'Live Events',
        badgeBg: 'bg-amber-400 text-black',
        icon: Calendar,
        actionText: 'Explore Event Highlights',
        actionStyle: 'bg-amber-400 hover:bg-amber-300 text-black font-black shadow-amber-400/20'
      };
    }
    return {
      label: 'CRM & SaaS',
      badgeBg: 'bg-emerald-400 text-black',
      icon: Server,
      actionText: 'Visit Live Demo',
      actionStyle: 'bg-white hover:bg-zinc-200 text-black shadow-white/20'
    };
  };

  return (
    <div className="py-20 max-w-[1320px] mx-auto px-6 font-sans space-y-16 selection:bg-amber-400 selection:text-black">
      
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-zinc-900 text-amber-400 border border-zinc-800 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5" /> Velametric Global Showcase
        </div>

        <h1 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tight font-display">
          OUR WORK
        </h1>

        <p className="text-zinc-400 text-base sm:text-xl leading-relaxed">
          Explore our client deliverables structured across Video Production, News Portals, Specialized CRM & SaaS Platforms, and Live Events.
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS */}
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'ALL' 
              ? 'bg-white text-black shadow-2xl scale-105' 
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> All Work ({projects.length})
        </button>

        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'VIDEO' 
              ? 'bg-purple-500 text-white shadow-2xl scale-105' 
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-purple-400" /> 1. Video Production ({videoCount})
        </button>

        <button
          onClick={() => setFilter('NEWS')}
          className={`px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'NEWS' 
              ? 'bg-red-600 text-white shadow-2xl scale-105' 
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-red-400" /> 2. News Websites ({newsCount})
        </button>

        <button
          onClick={() => setFilter('CRM')}
          className={`px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'CRM' 
              ? 'bg-emerald-400 text-black shadow-2xl scale-105' 
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" /> 3. CRM & SaaS Platforms ({crmCount})
        </button>

        <button
          onClick={() => setFilter('EVENTS')}
          className={`px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'EVENTS' 
              ? 'bg-amber-400 text-black shadow-2xl scale-105' 
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" /> 4. Events ({eventsCount})
        </button>
      </div>

      {/* 3. NEWS WEBSITES QUICK HIGHLIGHT BANNER (When News is active or in All) */}
      {filter === 'NEWS' && (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-red-500/30 backdrop-blur space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
            <Newspaper className="w-4 h-4" /> Featured Regional Media & News Portals
          </div>
          <p className="text-zinc-300 text-sm">
            Velametric engineers high-throughput news publishing systems, automated editorial CMS workflows, and AMP-accelerated mobile portals delivering breaking coverage for millions of daily readers:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://lokjanexpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" /> 1. lokjanexpress.com ↗
            </a>
            <a
              href="https://gangakhabar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" /> 2. gangakhabar.com ↗
            </a>
            <a
              href="https://52garhsamachar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-red-500" /> 3. 52garhsamachar.com ↗
            </a>
          </div>
        </div>
      )}

      {/* 4. WORK SHOWCASE GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
            {filter === 'VIDEO' ? '1. Video Production & Cinema Showcases' :
             filter === 'NEWS' ? '2. Live News Websites & Media Portals' :
             filter === 'CRM' ? '3. Enterprise CRM & SaaS Systems' :
             filter === 'EVENTS' ? '4. Live Events & Arena Production' :
             'Complete Work Portfolio'}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredProjects.length} Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            const meta = getCategoryMeta(proj.category, proj.project_type);
            const CategoryIcon = meta.icon;

            return (
              <div 
                key={proj.id} 
                className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xl backdrop-blur"
              >
                <div>
                  {/* Media Thumbnail Container */}
                  <div className="h-60 relative overflow-hidden bg-zinc-950">
                    <img
                      src={proj.featured_image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
                    />
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    
                    {/* Client Tag */}
                    <span className="hidden sm:inline-block absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700 backdrop-blur">
                      {proj.client}
                    </span>

                    {/* Category Badge */}
                    <span className={`hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 rounded-full font-mono items-center gap-1.5 shadow-lg ${meta.badgeBg}`}>
                      <CategoryIcon className="w-3 h-3" /> {meta.label.toUpperCase()} ↗
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    {/* Mobile category indicator */}
                    <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                      <span>{proj.client}</span>
                      <span className="text-zinc-400 uppercase">{meta.label}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Services / Tags */}
                    {proj.services_used && proj.services_used.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.services_used.slice(0, 3).map((srv, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 space-y-3">
                  {proj.live_url && proj.live_url.startsWith('http') ? (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl ${meta.actionStyle}`}
                    >
                      <Globe className="w-4 h-4" /> {meta.actionText} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : proj.live_url ? (
                    <Link
                      to={proj.live_url}
                      className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl ${meta.actionStyle}`}
                    >
                      <CategoryIcon className="w-4 h-4" /> {meta.actionText} <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : null}

                  <div className="text-center">
                    <Link
                      to={`/portfolio/${proj.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-bold transition-colors"
                    >
                      View Full Case Study <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DEDICATED PARTNERS & STUDIO FOOTER BANNER */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Full-Spectrum Creative & Digital Services
          </div>
          <h4 className="text-xl font-bold text-white font-display">
            Need Commercial Video Production or Custom Event Tech?
          </h4>
          <p className="text-zinc-400 text-sm max-w-2xl">
            From high-converting news portals and enterprise CRM platforms to broadcast TVCs with Ekraahee Films and Dapflix, we build end-to-end digital solutions.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/partners"
            className="px-6 py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all border border-zinc-700 flex items-center gap-2"
          >
            Studio Partners <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/request-quote"
            className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            Start Your Project <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
