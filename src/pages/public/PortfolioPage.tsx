import React, { useEffect, useState } from 'react';
import { PortfolioProject } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Sparkles, ArrowRight, Layout, Server, Clapperboard } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'CRM' | 'WEB'>('ALL');

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

  const filteredProjects = projects.filter(p => {
    if (filter === 'CRM') return (p.services_used || []).some(s => s.toLowerCase().includes('crm') || s.toLowerCase().includes('portal') || s.toLowerCase().includes('erp'));
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    return true;
  });

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
          Featured enterprise web platforms, specialized industry CRM systems, and custom SaaS solutions.
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS */}
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
            filter === 'ALL' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All Work ({projects.length})
        </button>
        <button
          onClick={() => setFilter('CRM')}
          className={`px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            filter === 'CRM' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Server className="w-3.5 h-3.5" /> CRM & SaaS Platforms
        </button>
        <button
          onClick={() => setFilter('WEB')}
          className={`px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            filter === 'WEB' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Web Applications
        </button>
      </div>

      {/* 3. WORK SHOWCASE GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
            {filter === 'CRM' ? 'Enterprise CRM & SaaS Systems' : filter === 'WEB' ? 'Web Application Case Studies' : 'Complete Project Portfolio'}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredProjects.length} Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xl backdrop-blur">
              <div>
                {/* Media Thumbnail Container */}
                <div className="h-60 relative overflow-hidden bg-zinc-950">
                  <img
                    src={proj.featured_image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
                  />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  
                  {/* Client Tag */}
                  <span className="hidden sm:inline-block absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700 backdrop-blur">
                    {proj.client}
                  </span>

                  {/* Type Badge */}
                  <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-black rounded-full font-mono">
                    LIVE HOSTED ↗
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {/* Mobile-only client and category indicator */}
                  <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                    <span>{proj.client}</span>
                    <span className="text-zinc-500 uppercase">{proj.industry || 'Web Platform'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{proj.description}</p>

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
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" /> Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : proj.live_url ? (
                  <Link
                    to={proj.live_url}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" /> View Platform Overview <ExternalLink className="w-3.5 h-3.5" />
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
          ))}
        </div>
      </div>

      {/* 4. STUDIO / PARTNER PRODUCTION FOOTER BANNER */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Clapperboard className="w-4 h-4" /> Creative Studio Network
          </div>
          <h4 className="text-xl font-bold text-white font-display">
            Looking for Cinema, Commercial Films & Video Production?
          </h4>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Explore works produced in creative alliance with our official video partners including Ekraahee Films and Dapflix.
          </p>
        </div>
        <Link
          to="/partners"
          className="shrink-0 px-6 py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all border border-zinc-700 flex items-center gap-2"
        >
          Explore Partner Showcase <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
