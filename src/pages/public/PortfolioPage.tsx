import React, { useEffect, useState } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { DapflixReelsShowcase } from '../../components/public/DapflixReelsShowcase';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
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
  Play,
  X,
  Instagram, 
  Video, 
  Clapperboard, 
  Tv,
  Youtube,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Award,
  Users,
  Tag
} from 'lucide-react';

const getYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export interface EventGalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: string;
  bannerText: string;
  caption: string;
  highlights: string;
}

export const EVENT_GALLERY_PHOTOS: EventGalleryPhoto[] = [
  {
    id: 'eg-1',
    src: '/images/events/corruption_free_doon_trophies.jpg',
    title: 'Golden Globe Championship Trophies & Awards',
    category: 'Podium Honors & Felicitation',
    bannerText: 'PLAQUE: "OK INDIA — CORRUPTION FREE DOON — DATE: 25 DECEMBER"',
    caption: 'Bespoke Golden Globe trophies adorned with red ribbons, polished gold finish, and engraved presentation plaques honoring marathon champions and civic leaders.',
    highlights: '40+ Golden Globe Awards • Official OK India Media Plaque'
  },
  {
    id: 'eg-2',
    src: '/images/events/corruption_free_doon_marathon_start.jpg',
    title: 'Marathon Starting Line & Runners Assembly',
    category: 'Mega Race Logistics',
    bannerText: 'CHEST BIBS: "OK INDIA PRESENTS — CORRUPTION FREE DOON"',
    caption: 'Over 2,500 youth athletes, university students, and community marathoners lined up with official printed chest numbers at the starting grid.',
    highlights: '2,500+ Athletes • State-Level Marathon Coordination'
  },
  {
    id: 'eg-3',
    src: '/images/events/corruption_free_doon_folk_dance.jpg',
    title: 'Garhwali Traditional Folk Dance Arena',
    category: 'Uttarakhand Cultural Heritage',
    bannerText: 'BANNER: "WELCOME OK INDIA HALF MARATHON CORRUPTION FREE DOON"',
    caption: 'Vibrant cultural ensemble in authentic Garhwali attire (yellow kurtas, red pahadi topis, pink-blue dresses, and traditional silver jewelry) performing for the stadium audience.',
    highlights: 'Live Cultural Heritage • Authentic Pahadi Folk Choreography'
  },
  {
    id: 'eg-4',
    src: '/images/events/corruption_free_doon_vip_arena.jpg',
    title: 'Stadium VIP Pavilion & Civic Dignitary Dais',
    category: 'Civic Protocol & Crowd Operations',
    bannerText: 'SEATING AREA: "CORRUPTION FREE DOON STADIUM ASSEMBLY"',
    caption: 'Prominent civic figures, coaches, community leaders, and hundreds of runners seated across the field carpet during the formal event inauguration and civic integrity address.',
    highlights: 'VIP Protocol Seating • Grandfield Assembly'
  },
  {
    id: 'eg-5',
    src: '/images/events/corruption_free_doon_organizers_troupe.jpg',
    title: 'Cultural Troupe & Production Team Felicitation',
    category: 'Organizing Committee & Artists',
    bannerText: 'STAGE CREW: "OK INDIA EVENT COMMITTEE & FOLK ARTISTS"',
    caption: 'Event organizers, logistics leads, and the traditional Garhwali cultural dance troupe gathered together on the field following the grand ceremony.',
    highlights: 'Folk Artists & Organizers • Complete Event Execution'
  }
];

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'NEWS' | 'CRM' | 'EVENTS'>('ALL');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<'BOTH' | 'DAPFLIX' | 'EKRAAHEE'>('BOTH');
  const [activeEventPhotoIndex, setActiveEventPhotoIndex] = useState<number>(0);
  const [eventPhotoModal, setEventPhotoModal] = useState<EventGalleryPhoto | null>(null);

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
          Explore our client deliverables structured across Interactive Video & Reels Production, High-Traffic News Portals, Specialized CRM & SaaS Platforms, and Live Events.
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
          <Film className="w-3.5 h-3.5 text-purple-300" /> 1. Video Production ({videoCount})
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

      {/* 3. DYNAMIC CINEMA & REELS CONSOLE PLAYERS (When Video or All is active) */}
      {(filter === 'VIDEO' || filter === 'ALL') && (
        <div className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1.5">
                <Clapperboard className="w-4 h-4" /> Official Cinema & Video Production Studios
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
                Video Production & Cinema Portfolios
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Explore our dual production ecosystem: <span className="text-red-400 font-bold">Ekraahee Films</span> (broadcast TVCs, 4K YouTube commercial films & arena events) and <span className="text-pink-400 font-bold">DAPFLIX</span> (viral social reels & kinetic editing).
              </p>
            </div>

            {/* Studio Selection Switcher */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 self-start md:self-auto shrink-0 shadow-xl flex-wrap">
              <button
                onClick={() => setSelectedStudio('EKRAAHEE')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  selectedStudio === 'EKRAAHEE'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 font-black scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" /> 1. Ekraahee YouTube Cinema
              </button>

              <button
                onClick={() => setSelectedStudio('DAPFLIX')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  selectedStudio === 'DAPFLIX'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-pink-500/20 scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" /> 2. DAPFLIX Reels
              </button>

              <button
                onClick={() => setSelectedStudio('BOTH')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  selectedStudio === 'BOTH'
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Both Studios
              </button>
            </div>
          </div>

          {/* Render The Chosen Interactive Player(s) */}
          <div className="space-y-10">
            {/* 1. Ekraahee Films YouTube Cinema Stage (FIRST) */}
            {(selectedStudio === 'EKRAAHEE' || selectedStudio === 'BOTH') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                      Studio 01: Ekraahee Films — 4K YouTube Commercial Cinema Showcase
                    </span>
                  </div>
                  <a
                    href="https://www.youtube.com/@EkRaaheefilms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" /> @EkRaaheefilms on YouTube ↗
                  </a>
                </div>

                <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-4 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur">
                  <EkraaheeCinemaSlider hideHeader={true} showFullLink={true} />
                </div>
              </div>
            )}

            {/* 2. DAPFLIX Interactive Reel Console (SECOND) */}
            {(selectedStudio === 'DAPFLIX' || selectedStudio === 'BOTH') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">
                      Studio 02: DAPFLIX — Viral Social Reels & Visual Timeline Console
                    </span>
                  </div>
                  <a
                    href="https://www.instagram.com/dapflix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-zinc-400 hover:text-pink-400 flex items-center gap-1 transition-colors"
                  >
                    @dapflix on Instagram ↗
                  </a>
                </div>

                <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-4 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur">
                  <DapflixReelsShowcase hideHeader={true} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. NEWS WEBSITES SPOTLIGHT (When News filter is active) */}
      {filter === 'NEWS' && (
        <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-red-500/30 overflow-hidden shadow-2xl backdrop-blur p-6 sm:p-10 space-y-8">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Editorial Info & Live Links */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-red-950/80 text-red-400 border border-red-800/50 backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Regional News Networks
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
                High-Volume Digital News Portals
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Velametric engineers high-throughput digital journalism platforms, automated editorial CMS workflows, AMP-accelerated mobile portals, and interactive digital e-papers serving millions of daily readers across Uttarakhand and North India.
              </p>

              {/* High-Impact Stat Chips */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                  <div className="text-lg sm:text-2xl font-black text-red-500 font-mono">9.8M+</div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Reader Surges</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                  <div className="text-lg sm:text-2xl font-black text-white font-mono">&lt;0.8s</div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">AMP Mobile Speed</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center">
                  <div className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">99.99%</div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Live Uptime</div>
                </div>
              </div>

              {/* 3 Live Client Portal Links */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-red-500" /> Live Production Media Deployments:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href="https://lokjanexpress.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all shadow-lg hover:scale-105"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" /> 1. lokjanexpress.com ↗
                  </a>
                  <a
                    href="https://gangakhabar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all shadow-lg hover:scale-105"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" /> 2. gangakhabar.com ↗
                  </a>
                  <a
                    href="https://52garhsamachar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-bold hover:border-red-500 hover:text-red-400 transition-all shadow-lg hover:scale-105"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500" /> 3. 52garhsamachar.com ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: High-Tech Featured Image Mockup Display */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-700/80 shadow-[0_0_50px_rgba(239,68,68,0.25)] group">
                <img
                  src="/images/services/news_portal_featured.jpg"
                  alt="Live Breaking News Media Portal & Editorial CMS"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Live Floating Status Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-white uppercase">Real-Time Editorial Engine</span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">Cloudflare Edge CDN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4C. ON-GROUND EVENT PHOTO GALLERY SPOTLIGHT (Active when Events tab is selected) */}
      {filter === 'EVENTS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.12)] space-y-6 animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" /> Live On-Ground Event Photo Gallery
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                OK India Half Marathon — On-Ground Event Production Gallery
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
                All photographs below were captured live from our flagship mega event: <strong className="text-amber-300">OK India Half Marathon (Corruption Free Doon)</strong> — encompassing starting grid wave releases for 2,500+ runners, authentic Garhwali cultural dance performance, stadium VIP dais, and Golden Globe awards felicitation.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-mono text-zinc-400 mr-2">
                {activeEventPhotoIndex + 1} / {EVENT_GALLERY_PHOTOS.length}
              </span>
              <button
                onClick={() => setActiveEventPhotoIndex((prev) => (prev > 0 ? prev - 1 : EVENT_GALLERY_PHOTOS.length - 1))}
                className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-zinc-700"
                title="Previous Photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveEventPhotoIndex((prev) => (prev < EVENT_GALLERY_PHOTOS.length - 1 ? prev + 1 : 0))}
                className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-zinc-700"
                title="Next Photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Featured Photo Spotlight */}
          {(() => {
            const activePhoto = EVENT_GALLERY_PHOTOS[activeEventPhotoIndex];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Main Visual Frame */}
                <div className="lg:col-span-8 relative group rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl">
                  <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative cursor-pointer" onClick={() => setEventPhotoModal(activePhoto)}>
                    <img
                      src={activePhoto.src}
                      alt={activePhoto.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Click to Enlarge Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEventPhotoModal(activePhoto);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black text-white text-xs font-mono font-bold backdrop-blur-md border border-white/20 transition-all shadow-lg"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen ↗
                      </button>
                    </div>

                    {/* Banner readout bar on image bottom */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-md">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-amber-400">
                        <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{activePhoto.bannerText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Information & Breakdown */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                      {activePhoto.category}
                    </span>
                    <h4 className="text-xl font-bold text-white font-display leading-tight">
                      {activePhoto.title}
                    </h4>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {activePhoto.caption}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Event Highlights
                    </div>
                    <div className="text-xs font-bold text-zinc-200">
                      {activePhoto.highlights}
                    </div>
                  </div>

                  <button
                    onClick={() => setEventPhotoModal(activePhoto)}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/20"
                  >
                    <Maximize2 className="w-4 h-4" /> View High-Res Image
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Thumbnail Strip (5 images) */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
            {EVENT_GALLERY_PHOTOS.map((photo, idx) => {
              const isCurrent = idx === activeEventPhotoIndex;
              return (
                <button
                  key={photo.id}
                  onClick={() => setActiveEventPhotoIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all text-left group ${
                    isCurrent ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-102' : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                  }`}
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <span className="hidden md:block absolute bottom-1.5 left-2 right-2 text-[9px] font-bold text-white truncate font-mono">
                    {idx + 1}. {photo.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. WORK SHOWCASE CARDS GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
            {filter === 'VIDEO' ? 'Video Production & Commercial Deliverables' :
             filter === 'NEWS' ? 'Live News Websites & Media Portals' :
             filter === 'CRM' ? 'Enterprise CRM & SaaS Systems' :
             filter === 'EVENTS' ? 'Live Events & Arena Production' :
             'Complete Work Portfolio & Case Studies'}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredProjects.length} Projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            const isVideo = proj.category === 'video_production' || proj.project_type === 'video_production';
            const isNews = proj.category === 'news_website';
            const isEvent = proj.category === 'events' || proj.project_type === 'events';
            const hasReels = proj.video_reels && proj.video_reels.length > 0;

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

                    {/* Type / Category Badge */}
                    {isNews ? (
                      <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-red-600 text-white rounded-full font-mono items-center gap-1 shadow-lg">
                        <Newspaper className="w-3 h-3" /> NEWS PORTAL ↗
                      </span>
                    ) : isVideo ? (
                      <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-purple-500 text-white rounded-full font-mono items-center gap-1 shadow-lg">
                        <Video className="w-3 h-3" /> VIDEO REELS ↗
                      </span>
                    ) : isEvent ? (
                      <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-amber-400 text-black rounded-full font-mono items-center gap-1 shadow-lg">
                        <Calendar className="w-3 h-3" /> EVENT CINEMA ↗
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-emerald-400 text-black rounded-full font-mono items-center gap-1 shadow-lg">
                        <Server className="w-3 h-3" /> LIVE HOSTED ↗
                      </span>
                    )}

                    {/* Central Play Button Overlay for video projects */}
                    {(isVideo || (hasReels && isEvent)) && (
                      <div className="hidden sm:flex absolute inset-0 items-center justify-center">
                        <button
                          onClick={() => {
                            if (proj.video_reels && proj.video_reels.length > 0) {
                              setActiveReelModal(proj.video_reels[0]);
                            } else if (proj.instagram_url) {
                              window.open(proj.instagram_url, '_blank');
                            }
                          }}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-110 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all shadow-2xl group/play"
                          title="Play Featured Video"
                        >
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    {/* Mobile-only client and category indicator */}
                    <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                      <span>{proj.client}</span>
                      <span className="text-zinc-400 uppercase">
                        {isNews ? 'News Website' : isVideo ? 'Video Reels' : isEvent ? 'Live Event' : 'CRM & SaaS'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Embedded Reels Strip */}
                    {hasReels && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between font-mono">
                          <span className="flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-amber-400" />
                            {proj.client === 'Ekraahee Films' ? 'YouTube Client Films (Click to Play)' : 'Featured Video Reels'}
                          </span>
                          {proj.client === 'Ekraahee Films' && (
                            <span className="text-[9px] font-bold text-red-400 flex items-center gap-1 font-mono">
                              <Youtube className="w-3 h-3" /> YouTube 4K
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {proj.video_reels!.map((reel) => (
                            <div
                              key={reel.id}
                              onClick={() => setActiveReelModal(reel)}
                              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 cursor-pointer flex items-center gap-2 group/reel transition-all hover:bg-zinc-900"
                            >
                              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 relative bg-zinc-900 shadow-md">
                                <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover group-hover/reel:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-3.5 h-3.5 text-white fill-white group-hover/reel:text-amber-400 group-hover/reel:fill-amber-400" />
                                </div>
                              </div>
                              <div className="truncate">
                                <div className="text-[10px] font-bold text-white truncate group-hover/reel:text-amber-400 transition-colors">
                                  {reel.title}
                                </div>
                                <div className="text-[9px] text-zinc-500 font-mono">
                                  {reel.views_count} Views
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Embedded Event Photo Gallery Strip */}
                    {isEvent && proj.gallery && proj.gallery.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between font-mono">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <Camera className="w-3.5 h-3.5" />
                            On-Ground Photos ({proj.gallery.length})
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">Click to enlarge</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {proj.gallery.slice(0, 4).map((imgUrl, gIdx) => (
                            <div
                              key={gIdx}
                              onClick={() => {
                                const matched = EVENT_GALLERY_PHOTOS.find(p => p.src === imgUrl) || {
                                  id: `custom-${gIdx}`,
                                  src: imgUrl,
                                  title: proj.title || 'Event Gallery Showcase',
                                  category: 'On-Ground Event Documentation',
                                  bannerText: 'OK INDIA EVENT ARCHIVE',
                                  caption: proj.description || 'On-ground live event documentation.',
                                  highlights: proj.client || 'Live Event Execution'
                                };
                                setEventPhotoModal(matched);
                              }}
                              className="aspect-square rounded-lg overflow-hidden border border-zinc-800 hover:border-amber-400 cursor-pointer relative group/thumb transition-all bg-zinc-950 shadow-md"
                              title="Click to view photo"
                            >
                              <img src={imgUrl} alt={`${proj.title} photo ${gIdx + 1}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/0 flex items-center justify-center transition-colors">
                                <Maximize2 className="w-3 h-3 text-white/70 group-hover/thumb:text-amber-400 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services / Tags for non-reel or secondary display */}
                    {(!hasReels || isNews || !isVideo) && proj.services_used && proj.services_used.length > 0 && (
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
                  {isVideo && (proj.client === 'Ekraahee Films' || proj.youtube_url) ? (
                    <div className="space-y-2">
                      <a
                        href={proj.youtube_url || "https://www.youtube.com/@EkRaaheefilms"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-600/25"
                      >
                        <Youtube className="w-4 h-4" /> Watch on YouTube (@EkRaaheefilms) ↗
                      </a>
                      {proj.instagram_url && (
                        <a
                          href={proj.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px] font-bold tracking-wider transition-all"
                        >
                          <Instagram className="w-3.5 h-3.5 text-pink-400" /> Ekraahee on Instagram ↗
                        </a>
                      )}
                    </div>
                  ) : isVideo && proj.instagram_url ? (
                    <a
                      href={proj.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-pink-500/10"
                    >
                      <Instagram className="w-4 h-4" /> OUR WORK ↗
                    </a>
                  ) : isNews && proj.live_url ? (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs uppercase tracking-wider hover:from-red-500 hover:to-amber-500 transition-all shadow-xl shadow-red-600/20"
                    >
                      <Globe className="w-4 h-4" /> Visit Live News Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : isEvent && proj.gallery && proj.gallery.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const firstMatched = EVENT_GALLERY_PHOTOS.find(p => p.src === proj.gallery![0]) || {
                          id: 'event-modal-first',
                          src: proj.gallery![0],
                          title: proj.title || 'Event Gallery Showcase',
                          category: 'Event Documentation',
                          bannerText: 'OK INDIA EVENT BANNER',
                          caption: proj.description || 'Live on-ground event documentation.',
                          highlights: proj.client || 'Live Event Execution'
                        };
                        setEventPhotoModal(firstMatched);
                      }}
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-amber-500/20"
                    >
                      <Camera className="w-4 h-4" /> View On-Ground Photos ({proj.gallery.length}) ↗
                    </button>
                  ) : isEvent && proj.instagram_url ? (
                    <a
                      href={proj.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-amber-500/20"
                    >
                      <Instagram className="w-4 h-4" /> OUR WORK ↗
                    </a>
                  ) : proj.live_url ? (
                    <a
                      href={proj.live_url}
                      target={proj.live_url.startsWith('http') ? "_blank" : undefined}
                      rel={proj.live_url.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl shadow-white/10"
                    >
                      <Server className="w-4 h-4 text-emerald-600" /> {proj.live_url.startsWith('http') ? 'Visit Live Demo' : 'Explore Platform Overview'} <ExternalLink className="w-3.5 h-3.5" />
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
            );
          })}
        </div>
      </div>

      {/* 6. INTERACTIVE EMBEDDED VIDEO MODAL PLAYER */}
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
                  {activeReelModal.partner_name || 'Production Partner'} • {activeReelModal.category || 'Cinema Showcase'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {activeReelModal.title}
                </h3>
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
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <a
                    href={activeReelModal.video_url || activeReelModal.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </a>
                  <p className="text-xs text-white font-bold">Watch Video on External Channel ↗</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6B. EVENT ON-GROUND PHOTO LIGHTBOX MODAL */}
      {eventPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setEventPhotoModal(null)}
        >
          <div
            className="w-full max-w-5xl bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
                  {eventPhotoModal.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {eventPhotoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setEventPhotoModal(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image Display */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[62vh] p-2">
              <img
                src={eventPhotoModal.src}
                alt={eventPhotoModal.title}
                className="max-h-[60vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-2xl"
              />
            </div>

            {/* Modal Bottom Metadata & Banner Analysis */}
            <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
                  <Tag className="w-3.5 h-3.5" /> {eventPhotoModal.bannerText}
                </div>
                <span className="text-xs font-mono text-zinc-400 font-bold">
                  {eventPhotoModal.highlights}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {eventPhotoModal.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. STUDIO & PARTNER FOOTER BANNER */}
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
