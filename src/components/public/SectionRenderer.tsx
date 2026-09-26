import React, { useState, useEffect } from 'react';
import { PageSection, Service, PortfolioProject, CaseStudy, VideoReel } from '../../types/database.types';
import { leadService } from '../../services/leadService';
import { useSiteSettings } from '../../services/settingsService';
import {
  Sparkles, ArrowRight, Play, CheckCircle2, Calculator, Building, Award, Users,
  Globe, Laptop, Video, Film, Instagram, ChevronDown, MapPin, Phone, Mail, Clock, Send,
  HelpCircle, Megaphone, Calendar, CreditCard, ShieldCheck, Newspaper, Camera, ExternalLink, Star,
  Compass, Palette, Code2, Landmark, Tv, Layers, Clapperboard, Youtube
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EkraaheeCinemaSlider } from './EkraaheeCinemaSlider';
import { DapflixReelsShowcase } from './DapflixReelsShowcase';
import { DapflixCinemaSlider } from './DapflixCinemaSlider';

interface SectionRendererProps {
  section: PageSection;
  services?: Service[];
  projects?: PortfolioProject[];
  caseStudies?: CaseStudy[];
  onFormSubmit?: (data: any) => void;
}

// Helper to extract YouTube video embed URL
const getYouTubeEmbedUrl = (urlStr: string) => {
  if (!urlStr) return '';
  let videoId = '';
  if (urlStr.includes('v=')) {
    videoId = urlStr.split('v=')[1]?.split('&')[0];
  } else if (urlStr.includes('youtu.be/')) {
    videoId = urlStr.split('youtu.be/')[1]?.split('?')[0];
  } else if (urlStr.includes('embed/')) {
    videoId = urlStr.split('embed/')[1]?.split('?')[0];
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&enablejsapi=1` : '';
};

// Universal Smart Link component that dynamically routes internal vs external links and open_in_new_tab
interface SmartLinkProps {
  to?: string;
  href?: string;
  openInNewTab?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SmartLink: React.FC<SmartLinkProps> = ({ to, href, openInNewTab, className, children }) => {
  const targetUrl = to || href || '#';
  const isExternal = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:');

  if (isExternal || openInNewTab) {
    return (
      <a
        href={targetUrl}
        target={openInNewTab !== false ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={targetUrl} className={className}>
      {children}
    </Link>
  );
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, services = [], projects = [], caseStudies = [] }) => {
  const siteSettings = useSiteSettings();
  const content = section.content || {};

  // Form State for Enquiry Section
  const [enquiryForm, setEnquiryForm] = useState({
    first_name: '',
    company_name: '',
    phone: '',
    email: '',
    service_interest: 'Website & App Development',
    budget_range: '₹50,000–₹1 Lakh',
    message: '',
    preferred_contact: 'Phone',
    consent: true
  });
  const [enquiryStatus, setEnquiryStatus] = useState<{ submitted: boolean; enqId?: string }>({ submitted: false });

  // Modal State for Video Testimonials
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);

  // Video Production Studio Switcher State
  const [selectedStudio, setSelectedStudio] = useState<'EKRAAHEE' | 'DAPFLIX'>('EKRAAHEE');
  const [dapflixMode, setDapflixMode] = useState<'REELS' | 'CINEMA'>('REELS');

  // Event Countdown Clock State
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, mins: 30, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (!prev) return { days: 45, hours: 12, mins: 30, secs: 15 };
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        const newMins = prev.mins > 0 ? prev.mins - 1 : 59;
        const newHours = prev.mins === 0 ? (prev.hours > 0 ? prev.hours - 1 : 23) : prev.hours;
        const newDays = (prev.mins === 0 && prev.hours === 0) ? (prev.days > 0 ? prev.days - 1 : 0) : prev.days;
        return { days: newDays, hours: newHours, mins: newMins, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.first_name || !enquiryForm.email || !enquiryForm.phone) return;
    const { enqId } = await leadService.createLead(enquiryForm);
    setEnquiryStatus({ submitted: true, enqId });
  };

  // 1. HERO — FULL-SCREEN CINEMATIC EVENT VIDEO
  if (section.section_type === 'hero_3d' || section.id.includes('hero')) {
    const videoSource = content.video_source || 'youtube';
    const youtubeEmbed = getYouTubeEmbedUrl(content.youtube_url || '');

    return (
      <section className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-4 sm:px-6 py-16">
        {/* VIDEO BACKGROUND LAYER */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {videoSource === 'youtube' && youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title="Hero Cinematic Event Video"
              className="w-full h-full scale-[1.5] sm:scale-[1.35] pointer-events-none object-cover opacity-60 transition-opacity duration-1000"
              allow="autoplay; muted; loop; encrypted-media"
            />
          ) : videoSource === 'upload' && content.upload_video_url ? (
            <video
              src={content.upload_video_url}
              poster={content.poster_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src={content.poster_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80'}
              alt="Hero Poster"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          {/* Dark Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/50" />
        </div>

        {/* HERO CONTENT OVERLAY */}
        <div className="relative z-10 max-w-[1280px] mx-auto text-center space-y-6 sm:space-y-8 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-white/10 backdrop-blur-md text-amber-400 border border-white/20">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Velametric Global Business & Media Engine
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white font-display uppercase leading-tight sm:leading-[1.02] max-w-5xl mx-auto break-words">
            {content.heading || 'We Create. We Market. We Grow.'}
          </h1>

          <p className="text-xs sm:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed px-2">
            {content.subheading || 'From digital experiences and marketing to media, video, finance and unforgettable events — we turn ideas into measurable impact.'}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <SmartLink
              to={content.primaryCtaUrl || '/request-quote'}
              openInNewTab={content.primaryCtaOpenNewTab}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold text-black bg-white hover:bg-zinc-200 transition-all transform active:scale-95 shadow-2xl text-center"
            >
              {content.primaryCtaText || 'Start a Project'}
            </SmartLink>
            <SmartLink
              to={content.secondaryCtaUrl || '/portfolio'}
              openInNewTab={content.secondaryCtaOpenNewTab}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 backdrop-blur transition-all text-center"
            >
              {content.secondaryCtaText || 'Explore Our Work'}
            </SmartLink>
            {content.eventCtaText && (
              <SmartLink
                to={content.eventCtaUrl || '/event-registration'}
                openInNewTab={content.eventCtaOpenNewTab}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/40 backdrop-blur hover:bg-amber-500/30 transition-all text-center"
              >
                {content.eventCtaText}
              </SmartLink>
            )}
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
          <span>{content.scrollIndicatorText || 'SCROLL TO EXPLORE'}</span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-amber-400" />
        </div>
      </section>
    );
  }

  // 2. QUICK INTRO / ABOUT US
  if (section.id.includes('about') || section.name.includes('About')) {
    return (
      <section className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
              {content.heading || 'We Build Brands That Move Forward.'}
            </h2>
            <p className="text-zinc-300 text-xs sm:text-lg leading-relaxed">
              {content.subheading || 'Velametric Global brings together Technology, Marketing, Creative Design, Media, Video Production, Financial Consultancy, and Mega Event Management under one seamless agency ecosystem.'}
            </p>

            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4 border-t border-zinc-800">
                {content.stats.map((st: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3 sm:p-4 rounded-2xl">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-display">{st.value}</div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">{st.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 sm:pt-4">
              <SmartLink
                to={content.primaryCtaUrl || '/about'}
                openInNewTab={content.primaryCtaOpenNewTab}
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all shadow-xl"
              >
                {content.primaryCtaText || 'Know More About Us'} <ArrowRight className="w-4 h-4" />
              </SmartLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative">
              <img
                src={content.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'}
                alt="About Visual"
                className="w-full h-64 sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. SERVICES (WHAT WE DO - 6 CORE MENU CATEGORIES)
  if (section.section_type === 'services' || section.id.includes('services')) {
    const DEFAULT_MENU_CATEGORIES = [
      {
        num: '01',
        name: 'Digital Strategy & Consulting',
        desc: 'Business audits, strategic brand roadmaps, market positioning, and full digital operations management.',
        slug: 'digital-strategy',
        items: ['Business Audit', 'Strategy Creation / Planning for Brand', 'Fully Digital Management Service'],
        count: 3
      },
      {
        num: '02',
        name: 'Creating Brand & Architecture',
        desc: 'Comprehensive brand architecture, iconic visual identity, bespoke logo design, and human-centric UI/UX design systems.',
        slug: 'brand-architecture',
        items: ['Branding', 'Logo Design', 'UI and UX Design'],
        count: 3
      },
      {
        num: '03',
        name: 'Software & Web Engineering',
        desc: 'Modern responsive web engineering, fully custom web applications + CRM/ERP, and high-converting Shopify store setups.',
        slug: 'software-engineering',
        items: ['Website Development', 'Fully Customize Web App + CRM', 'Shopify Store Setup'],
        count: 3
      },
      {
        num: '04',
        name: 'News Portal, Channel & RNI',
        desc: 'Full-featured digital journalism portals, broadcast studio architecture, and official RNI press compliance.',
        slug: 'news-portal-channel-rni',
        items: ['Digital News Portals', 'Broadcast Studio Setup', 'Official RNI Registration'],
        count: 3
      },
      {
        num: '05',
        name: 'Media & PR',
        desc: 'National wire press releases across 500+ news outlets, media relations, editorial features, and digital reputation.',
        slug: 'media-pr',
        items: ['National Wire Press Releases', 'Media Relations & Editorial', 'Digital PR & Reputation'],
        count: 3
      },
      {
        num: '06',
        name: 'Financial Consultancy',
        desc: 'Government subsidy loans (up to 25% refund), business credit, bank DPR project reports, and mortgage solutions.',
        slug: 'financial-consultancy',
        items: ['Govt Subsidy Loans (25% Refund)', 'Business & CC Loans', 'Project Finance (DPR)'],
        count: 3
      }
    ];

    const getIconForCategory = (name: string, num: string) => {
      const n = (name || '').toLowerCase();
      if (n.includes('strategy') || n.includes('consulting') || num === '01') return Compass;
      if (n.includes('brand') || n.includes('architecture') || num === '02') return Palette;
      if (n.includes('software') || n.includes('engineering') || n.includes('dev') || num === '03') return Code2;
      if (n.includes('news') || n.includes('channel') || n.includes('rni') || num === '04') return Tv;
      if (n.includes('pr') || n.includes('media') || num === '05') return Megaphone;
      if (n.includes('finan') || n.includes('subsidy') || n.includes('loan') || num === '06') return Landmark;
      return Sparkles;
    };

    // Use configured menu categories
    const displayCategories = (content.categories && content.categories.length > 0 && content.categories[0]?.name?.includes('Digital Strategy'))
      ? content.categories
      : DEFAULT_MENU_CATEGORIES;

    return (
      <section className="py-20 sm:py-32 bg-zinc-950 border-b border-zinc-800/80 relative overflow-hidden">
        {/* Subtle Background Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-amber-500/10 via-brand-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/5">
              <Sparkles className="w-3.5 h-3.5" /> Capabilities & Offerings
            </span>
            <h2 className="text-3xl sm:text-6xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'What We Do'}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {content.subheading || 'End-to-end solutions for brands, businesses and organizations ready to grow.'}
            </p>
          </div>

          {/* 3x2 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayCategories.map((cat: any, idx: number) => {
              const IconComp = getIconForCategory(cat.name, cat.num);

              return (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-zinc-800/80 hover:border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] flex flex-col justify-between backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon Container + Offerings Badge + Stylized Number */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-amber-400 font-mono text-[11px] font-bold">
                          {cat.items?.length || 3} Offerings
                        </span>
                        <span className="text-3xl sm:text-4xl font-black font-display text-zinc-800 group-hover:text-amber-400/40 transition-colors select-none font-mono">
                          {cat.num}
                        </span>
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-2">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Tag Pills (Sub-Categories) */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cat.items?.map((item: string, i: number) => (
                        <Link
                          key={i}
                          to={`/services?category=${cat.slug}`}
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-zinc-950/90 text-zinc-300 border border-zinc-800/90 hover:border-amber-400/50 hover:text-amber-300 hover:bg-zinc-900 transition-all font-mono shadow-sm"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-zinc-800/80">
                    <SmartLink
                      to={`/services?category=${cat.slug}`}
                      openInNewTab={content.primaryCtaOpenNewTab}
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-zinc-300 group-hover:text-amber-400 transition-colors font-mono tracking-wider"
                    >
                      <span>Explore Category & Services</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </SmartLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 4. FEATURED VIDEO PRODUCTION SHOWCASE / OUR WORK SCREEN
  if (section.section_type === 'portfolio' || section.id.includes('portfolio') || section.name.toLowerCase().includes('portfolio') || section.name.toLowerCase().includes('work')) {
    const headerCtaText = content.header_cta_text || 'Explore All Work (4 Categories)';
    const headerCtaUrl = content.header_cta_url || '/portfolio';
    const headerOpenNewTab = content.header_cta_open_new_tab || false;

    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-10">
          {/* Header & Studio Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                <Clapperboard className="w-4 h-4" /> Official Cinema & Video Production Studios
              </div>
              <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
                {content.heading || 'Work That Speaks For Us.'}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Explore our dual production ecosystem: <span className="text-amber-400 font-bold">Ekraahee Films</span> (broadcast TVCs, 4K YouTube commercial films & arena events) and <span className="text-white font-bold">DAPFLIX</span> (viral social reels & kinetic editing).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              {/* Studio Selection Switcher - One Unified Active Slider */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <button
                  type="button"
                  onClick={() => setSelectedStudio('EKRAAHEE')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    selectedStudio === 'EKRAAHEE'
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30 font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> 1. Ekraahee YouTube Cinema
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudio('DAPFLIX')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    selectedStudio === 'DAPFLIX'
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30 font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> 2. DAPFLIX Reels
                </button>
              </div>

              <SmartLink
                to={headerCtaUrl}
                openInNewTab={headerOpenNewTab}
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400 hover:text-amber-300 hover:underline transition-colors shrink-0"
              >
                {headerCtaText} <ArrowRight className="w-4 h-4" />
              </SmartLink>
            </div>
          </div>

          {/* Interactive Cinema Showcase Screen (Only One Active) */}
          <div className="space-y-4">
            {selectedStudio === 'EKRAAHEE' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      Studio 01: Ekraahee Films — 4K YouTube Commercial Cinema Showcase
                    </span>
                  </div>
                  <a
                    href="https://www.youtube.com/@EkRaaheefilms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" /> @EkRaaheefilms on YouTube ↗
                  </a>
                </div>

                <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-4 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur">
                  <EkraaheeCinemaSlider hideHeader={true} showFullLink={true} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      Studio 02: DAPFLIX — {dapflixMode === 'REELS' ? 'Viral Social Reels & Visual Timeline' : '4K Cinema Commercial Films'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Sub-mode switcher inside DAPFLIX */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setDapflixMode('REELS')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          dapflixMode === 'REELS'
                            ? 'bg-amber-400 text-black font-black shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Instagram className="w-3 h-3" /> Viral Reels (9:16)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDapflixMode('CINEMA')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          dapflixMode === 'CINEMA'
                            ? 'bg-amber-400 text-black font-black shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Film className="w-3 h-3" /> 4K Cinema (16:9)
                      </button>
                    </div>

                    <a
                      href="https://www.instagram.com/dapflix/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-zinc-400 hover:text-amber-400 flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Instagram className="w-3.5 h-3.5 text-amber-400" /> @dapflix ↗
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-4 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur">
                  {dapflixMode === 'REELS' ? (
                    <DapflixReelsShowcase hideHeader={true} />
                  ) : (
                    <DapflixCinemaSlider hideHeader={true} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Category Gateway to Full Portfolio */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                Also Explore Other Ecosystem Deliverables
              </div>
              <div className="text-sm font-semibold text-white">
                📰 3 High-Volume News Portals • 💻 5 Enterprise CRM & SaaS Engines • 🏃 Civic Marathons & Events
              </div>
            </div>
            <Link
              to="/portfolio"
              className="px-6 py-3 rounded-full bg-white hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 shrink-0"
            >
              <Layers className="w-4 h-4" /> Explore All Work & Case Studies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 5. EVENTS SECTION WITH MOBILE COUNTDOWN WIDGET
  if (section.id.includes('events')) {
    const featEvent = content.featured_event || {};
    return (
      <section id="events" className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Live Cultural & Business Summits
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'Experience What We Create.'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Join our mega cultural events, fashion pageants, music festivals, and corporate summits.'}
            </p>
          </div>

          {/* Featured Event Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono">
                  <Calendar className="w-3 h-3" /> Mega Cultural Festival
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-zinc-800 text-zinc-300 font-mono">
                  Arena Ground, Dehradun
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-4xl font-black text-white font-display uppercase leading-tight">
                  {featEvent.title || 'Uttarakhand Mega Youth Fashion & Music Summit 2026'}
                </h3>
                <p className="text-xs sm:text-sm font-bold italic text-amber-400 font-display">
                  "Where Culture Meets the Future"
                </p>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {featEvent.description || 'Featuring headline musical acts, state fashion pageants, underground rap battles, and interactive brand experience zones organized by Hemchandra Purohit (Velametric) & Destiny Productions.'}
              </p>
              
              {/* ORGANIZERS & MEDIA PARTNERS PILL */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                  <div className="text-zinc-400 text-[11px]">
                    👑 <strong className="text-white">Presented & Organized by:</strong> <span className="text-amber-300">Hemchandra Purohit (Velametric) & Destiny Productions</span>
                  </div>
                  <div className="text-zinc-400 text-[11px]">
                    📰 <strong className="text-white">Official Media Partners:</strong> <span className="text-amber-300">Weekly Eye News & 52 Garh Samachar</span> (7M+ Digital Reach)
                  </div>
                </div>
              </div>

              {/* EVENT HIGHLIGHT TAGS */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">👥 5,000+ Attendees</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">👗 State Fashion Pageant</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">🎤 Underground Rap Battles</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">🎸 Main Stage Concerts</span>
              </div>

              {/* Mobile Responsive Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-1">
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.days}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Days</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.hours}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Hours</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.mins}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Mins</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.secs}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Secs</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <SmartLink
                  to={featEvent.register_url || '/event-registration'}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all text-center shadow-xl"
                >
                  Register as Participant
                </SmartLink>
                <SmartLink
                  to={featEvent.sponsor_url || '/sponsor-registration'}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-zinc-950 hover:bg-zinc-800 border border-amber-400/40 transition-all text-center"
                >
                  View Sponsorship Proposal & Tiers →
                </SmartLink>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative h-64 sm:h-[460px]">
              <img src={featEvent.image} alt={featEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Arena Ground, Dehradun
                </div>
                <div className="text-zinc-400 text-[11px]">
                  5,000+ Attendees • 7M+ Digital Reach • 10,000 4-State Print Circulation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 6. WHY CHOOSE US (CREDIBILITY PILLARS)
  if (section.id.includes('why') || section.name.includes('Why Choose Us')) {
    const pillars = content.pillars || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Proven Performance
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'More Than a Service Provider.'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Why leading brands and enterprises partner with Velametric Global.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((pil: any, idx: number) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-10 rounded-3xl space-y-3 sm:space-y-4 hover:border-zinc-700 transition-all shadow-xl">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">{pil.num}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display">{pil.title}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{pil.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 7. TESTIMONIAL VIDEOS
  if (section.section_type === 'video_reels' || section.id.includes('video-testimonials')) {
    const vTestimonials = content.video_testimonials || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Client Video Reviews
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || "Don't Take Our Word For It."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Hear directly from the business leaders, founders, and partners we work with.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {vTestimonials.map((vt: any) => (
              <div key={vt.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl hover:border-zinc-700 transition-all group">
                <div className="h-48 sm:h-56 relative overflow-hidden bg-zinc-950 cursor-pointer" onClick={() => setActiveVideoModal(vt)}>
                  <img src={vt.thumbnail} alt={vt.client_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <p className="text-zinc-300 text-xs italic">"{vt.quote}"</p>
                  <div>
                    <div className="text-sm font-bold text-white font-display">{vt.client_name}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{vt.designation}, {vt.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Modal Popup */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-display">{activeVideoModal.client_name} — {activeVideoModal.company}</h3>
                  <p className="text-xs text-zinc-400">{activeVideoModal.designation}</p>
                </div>
                <button onClick={() => setActiveVideoModal(null)} className="text-zinc-400 hover:text-white text-lg font-bold">✕</button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800">
                <iframe
                  src={getYouTubeEmbedUrl(activeVideoModal.youtube_url)}
                  title="Client Testimonial Video"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // 8. TEXT TESTIMONIALS
  if (section.section_type === 'testimonials' || section.id.includes('text-testimonials')) {
    const testimonials = content.testimonials || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'Trusted By People Who Believe In Growth.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t: any, idx: number) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-sm font-bold text-white font-display">{t.client_name}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 9. ENQUIRY / REQUEST A QUOTE (CRM INTEGRATED FORM)
  if (section.id.includes('enquiry') || section.name.includes('Enquiry')) {
    return (
      <section id="enquiry" className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-14 rounded-3xl shadow-2xl space-y-6 sm:space-y-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                Start a Conversation
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
                {content.heading || "Let's Build Something Great."}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">
                {content.subheading || "Tell us what you're looking to build, promote, create or organize. Our team will get back to you."}
              </p>
            </div>

            {enquiryStatus.submitted ? (
              <div className="bg-amber-400/10 border border-amber-400/30 p-6 sm:p-8 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-400 text-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Thank You! Enquiry Received</h3>
                <p className="text-zinc-300 text-xs max-w-md mx-auto">
                  We've received your enquiry. Your tracking ID is <span className="text-amber-400 font-mono font-bold">{enquiryStatus.enqId}</span>. Our sales team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setEnquiryStatus({ submitted: false })}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 sm:space-y-6 text-base sm:text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Kapoor"
                      value={enquiryForm.first_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, first_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Enterprise"
                      value={enquiryForm.company_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, company_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="anish@company.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Interested Service *</label>
                    <select
                      value={enquiryForm.service_interest}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, service_interest: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {content.services_list?.map((s: string, i: number) => (
                        <option key={i} value={s} className="bg-zinc-900 text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Estimated Budget Range</label>
                    <select
                      value={enquiryForm.budget_range}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, budget_range: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {content.budget_options?.map((b: string, i: number) => (
                        <option key={i} value={b} className="bg-zinc-900 text-white">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Project Requirement Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project, objectives, campaign goals, or event specifications..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={enquiryForm.consent}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, consent: e.target.checked })}
                      className="accent-white"
                    />
                    <label htmlFor="consent" className="text-zinc-400 text-[11px]">
                      I agree to the Privacy Policy & Terms.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl text-center"
                  >
                    Send Enquiry →
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    );
  }

  // 10. CONTACT US
  if (section.id.includes('contact') || section.name.includes('Contact')) {
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Direct Contact
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || "Let's Talk."}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-xs font-mono">
              <a 
                href={`tel:${content.phone || siteSettings.contact_phone || '+918679766348'}`}
                className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-amber-400/50 transition-all block"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-zinc-400 text-[10px]">Phone Support</div>
                  <div className="text-white font-bold">{content.phone || siteSettings.contact_phone || '+91-8679766348'}</div>
                </div>
              </a>

              <a 
                href={`https://wa.me/${(content.whatsapp || siteSettings.contact_whatsapp || siteSettings.contact_phone || '+918679766348').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${siteSettings.company_name || 'Velametric'}, I would like to connect with your team.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 transition-all block"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                <div>
                  <div className="text-emerald-400 text-[10px] font-bold">Direct WhatsApp Chat</div>
                  <div className="text-white font-bold">{content.whatsapp || siteSettings.contact_whatsapp || siteSettings.contact_phone || '+91-8679766348'}</div>
                </div>
              </a>

              <a 
                href={`mailto:${content.email || siteSettings.contact_email || 'hello@velametric.com'}`}
                className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-amber-400/50 transition-all block"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-zinc-400 text-[10px]">Email Address</div>
                  <div className="text-white font-bold">{content.email || siteSettings.contact_email || 'hello@velametric.com'}</div>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-zinc-400 text-[10px]">Headquarters & Offices</div>
                  <div className="text-white font-bold">{content.office_dehradun || siteSettings.contact_address || 'Dehradun Headquarters & Joshiyara, Uttarkashi Regional Office'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 h-64 sm:h-[380px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74618210356!2d78.009183!3d30.316494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888b5%3A0x76707323605e542!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              title="Dehradun Map"
              className="w-full h-full border-0 grayscale opacity-80 invert"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    );
  }

  // 11. FINAL CTA BANNER
  return (
    <section className="py-16 sm:py-28 bg-zinc-950 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8">
        <h2 className="text-3xl sm:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
          {content.heading || 'Ready To Make Your Next Move?'}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-lg max-w-2xl mx-auto">
          {content.subheading || "Let's turn your next idea into something people remember."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
          <SmartLink
            to={content.primaryCtaUrl || '/request-quote'}
            openInNewTab={content.primaryCtaOpenNewTab}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl text-center"
          >
            {content.primaryCtaText || 'Start a Conversation'}
          </SmartLink>
          <SmartLink
            to={content.secondaryCtaUrl || '/portfolio'}
            openInNewTab={content.secondaryCtaOpenNewTab}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-all text-center"
          >
            {content.secondaryCtaText || 'View Our Work'}
          </SmartLink>
        </div>
      </div>
    </section>
  );
};
