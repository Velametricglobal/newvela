import React, { useEffect, useState } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Sparkles, Video, Play, Instagram, ArrowRight, Film, X } from 'lucide-react';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
import { DapflixCinemaSlider } from '../../components/public/DapflixCinemaSlider';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WEB' | 'VIDEO'>('ALL');
  const [activePartner, setActivePartner] = useState<'ekraahee' | 'dapflix'>('ekraahee');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);

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
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    if (filter === 'VIDEO') return p.project_type === 'video_production' || p.production_partner;
    return true;
  });

  const getYouTubeId = (urlStr: string) => {
    if (!urlStr) return '';
    if (urlStr.includes('v=')) return urlStr.split('v=')[1]?.split('&')[0];
    if (urlStr.includes('youtu.be/')) return urlStr.split('youtu.be/')[1]?.split('?')[0];
    if (urlStr.includes('embed/')) return urlStr.split('embed/')[1]?.split('?')[0];
    return '';
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
          Featured web platforms, specialized industry CRM systems, and commercial cinema productions.
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
          onClick={() => setFilter('WEB')}
          className={`px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
            filter === 'WEB' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Web & CRM Builds
        </button>
        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
            filter === 'VIDEO'
              ? 'bg-amber-400 text-black font-extrabold shadow-2xl shadow-amber-400/30 scale-105 border border-amber-300'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Film className="w-3.5 h-3.5" /> Video Production & Cinema
        </button>
      </div>

      {/* 2.5. CINEMATIC VIDEO PRODUCTION SHOWCASE SLIDER (PARTNER TABS) */}
      {(filter === 'ALL' || filter === 'VIDEO') && (
        <div className="pt-2 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-400" /> Featured Studio Partner:
              </span>
              <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                <button
                  onClick={() => setActivePartner('ekraahee')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePartner === 'ekraahee'
                      ? 'bg-amber-400 text-black shadow-md font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Ekraahee Films
                </button>
                <button
                  onClick={() => setActivePartner('dapflix')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePartner === 'dapflix'
                      ? 'bg-amber-400 text-black shadow-md font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  DAPFLIX Films
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link
                to={activePartner === 'dapflix' ? '/partners/dapflix' : '/partners/ekraahee-films'}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
              >
                Open {activePartner === 'dapflix' ? 'DAPFLIX' : 'Ekraahee Films'} Dedicated Showcase <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {activePartner === 'dapflix' ? (
            <DapflixCinemaSlider />
          ) : (
            <EkraaheeCinemaSlider />
          )}
        </div>
      )}

      {/* 3. WORK SHOWCASE GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
            {filter === 'VIDEO' ? 'All Video & Cinema Deliverables' : filter === 'WEB' ? 'Web & Custom CRM Case Studies' : 'Complete Project Portfolio'}
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
                
                {/* Client Tag - hidden on mobile so image is clear */}
                <span className="hidden sm:inline-block absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700 backdrop-blur">
                  {proj.client}
                </span>

                {/* Type Badge - hidden on mobile */}
                {proj.project_type === 'video_production' ? (
                  <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-purple-500 text-white rounded-full font-mono items-center gap-1">
                    <Video className="w-3 h-3" /> VIDEO REELS
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-black rounded-full font-mono">
                    LIVE HOSTED ↗
                  </span>
                )}

                {/* Video Play Button Overlay - hidden on mobile */}
                {proj.project_type === 'video_production' && (
                  <div className="hidden sm:flex absolute inset-0 items-center justify-center">
                    <a
                      href={proj.instagram_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </a>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                {/* Mobile-only client and category indicator (outside/below image) */}
                <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                  <span>{proj.client}</span>
                  <span className="text-zinc-500 uppercase">{proj.project_type === 'video_production' ? 'Video Reels' : 'Web Project'}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{proj.description}</p>

                {/* Reels Strip */}
                {proj.video_reels && proj.video_reels.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1 font-mono">
                      <Film className="w-3 h-3 text-amber-400" /> Featured Video Reels
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {proj.video_reels.map((reel) => (
                        <div
                          key={reel.id}
                          onClick={() => setActiveReelModal(reel)}
                          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center gap-2 group/reel"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 relative bg-zinc-900">
                            <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                          <div className="truncate">
                            <div className="text-[10px] font-bold text-white truncate group-hover/reel:text-amber-400">{reel.title}</div>
                            <div className="text-[9px] text-zinc-500 font-mono">{reel.views_count} Views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-6 pt-0 space-y-3">
              {proj.project_type === 'video_production' && proj.instagram_url ? (
                <a
                  href={proj.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl"
                >
                  <Instagram className="w-4 h-4" /> Our Work ↗
                </a>
              ) : proj.live_url ? (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl"
                >
                  <Globe className="w-4 h-4 text-emerald-600" /> Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
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

      {/* Reel / Video Modal Overlay */}
      {activeReelModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveReelModal(null)}
        >
          <div 
            className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
                  {activeReelModal.partner_name || 'Ekraahee Films'} • {activeReelModal.category || 'Cinema Production'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">{activeReelModal.title}</h3>
              </div>
              <button 
                onClick={() => setActiveReelModal(null)} 
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getYouTubeId(activeReelModal.video_url) ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(activeReelModal.video_url)}?autoplay=1&rel=0`}
                  title={activeReelModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : activeReelModal.video_url?.includes('.mp4') ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
                <video
                  src={activeReelModal.video_url}
                  poster={activeReelModal.thumbnail_url}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-72 rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-950">
                <img src={activeReelModal.thumbnail_url} alt={activeReelModal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <a
                    href={activeReelModal.video_url || activeReelModal.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </a>
                  <p className="text-xs text-white font-bold">Watch Video on External Channel</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
