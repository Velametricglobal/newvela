import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, Film, Eye, ExternalLink, Maximize2, Award, Clock, ArrowRight } from 'lucide-react';

export interface CinemaVideo {
  id: string;
  youtubeId: string;
  title: string;
  client: string;
  category: string;
  duration: string;
  views: string;
  description: string;
  aspectRatio?: '16:9' | '9:16';
  badge?: string;
}

export const EKRAAHEE_VIDEOS: CinemaVideo[] = [
  {
    id: 'ek-1',
    youtubeId: 'WPKQbHTa2pc',
    title: 'Pottery Barn Flagship Store Launch',
    client: 'Pottery Barn',
    category: 'Luxury Retail & Architectural Launch Film',
    duration: '0:42',
    views: '1.2M+',
    description: 'High-elegance architectural walkthrough and grand store launch event film featuring bespoke lighting, fluid gimbal cinematography, and VIP atmosphere capture.',
    aspectRatio: '16:9',
    badge: 'Flagship Launch'
  },
  {
    id: 'ek-2',
    youtubeId: 'wVPxaWhOwjA',
    title: 'Podcast with Qualcomm for 91mobiles',
    client: 'Qualcomm × 91mobiles',
    category: 'Broadcast Studio & Multi-Cam Tech Talk',
    duration: '1:15',
    views: '850K+',
    description: 'High-end studio production with multi-camera synchronized switching, studio key lighting, crystal-clear acoustic isolation, and executive tech interview pacing.',
    aspectRatio: '16:9',
    badge: 'Studio Multi-Cam'
  },
  {
    id: 'ek-3',
    youtubeId: '8qYlKs-dRVc',
    title: 'IGA Awards 2025 for 91mobiles',
    client: '91mobiles / IGA 2025',
    category: 'Grand Arena & Live Event Stage Cinema',
    duration: '0:58',
    views: '1.5M+',
    description: 'Electrifying Indian Gaming Awards arena production with massive stage lighting design, dynamic crowd reactions, live trophy stage reveals, and cinematic sound design.',
    aspectRatio: '16:9',
    badge: 'Arena Event'
  },
  {
    id: 'ek-4',
    youtubeId: 'SaQQgPmnAVU',
    title: 'Kinza Lemon Soda Drink Commercial',
    client: 'Kinza Beverage',
    category: 'High-Speed Beverage TVC & Product Shoot',
    duration: '0:30',
    views: '2.1M+',
    description: 'Sensory macro commercial with high-speed phantom liquid splash dynamics, crisp carbonation close-ups, vibrant neon color grading, and commercial broadcast finish.',
    aspectRatio: '16:9',
    badge: 'Commercial TVC'
  },
  {
    id: 'ek-5',
    youtubeId: 'RQWwFpQfQig',
    title: 'Bharat Loan Performance UGC Video Ad',
    client: 'Bharat Loan',
    category: 'FinTech Performance Ad & Growth UGC',
    duration: '0:45',
    views: '3.4M+',
    description: 'High-converting performance marketing asset with viral opening hooks, mobile-first framing, intuitive app interface callouts, and conversion-optimized pacing.',
    aspectRatio: '16:9',
    badge: 'Performance UGC'
  }
];

interface EkraaheeCinemaSliderProps {
  title?: string;
  subtitle?: string;
  showPartnerHeader?: boolean;
  hideHeader?: boolean;
  showFullLink?: boolean;
}

export const EkraaheeCinemaSlider: React.FC<EkraaheeCinemaSliderProps> = ({
  title = 'Featured Video Production Showcase',
  subtitle = 'Crafted in collaboration with our official cinema & video production partner Ekraahee Films.',
  showPartnerHeader = true,
  hideHeader,
  showFullLink = true
}) => {
  const isHeaderVisible = hideHeader !== undefined ? !hideHeader : showPartnerHeader;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeVideo = EKRAAHEE_VIDEOS[currentIndex];

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % EKRAAHEE_VIDEOS.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + EKRAAHEE_VIDEOS.length) % EKRAAHEE_VIDEOS.length);
  };

  const handleSelectVideo = (idx: number) => {
    setIsPlaying(false);
    setCurrentIndex(idx);
  };

  // Auto-advance preview if user is not actively watching
  useEffect(() => {
    if (isPlaying || isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EKRAAHEE_VIDEOS.length);
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isHovered]);

  return (
    <div
      className="w-full space-y-8 font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. OFFICIAL PRODUCTION PARTNER BANNER */}
      {isHeaderVisible && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/90 p-6 sm:p-8 shadow-2xl">
          {/* Subtle Ambient Yellow Neon Glow */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Film Perforation Mockup on Top Rim */}
          <div className="flex justify-between items-center gap-2 pb-5 border-b border-zinc-800/80 opacity-60">
            <div className="flex gap-1.5 overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-3 h-2 rounded-[2px] bg-zinc-800 border border-zinc-700/50" />
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 shrink-0">
              <Film className="w-3.5 h-3.5" /> 35MM CINEMA PRODUCTION OS
            </div>
            <div className="flex gap-1.5 overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-3 h-2 rounded-[2px] bg-zinc-800 border border-zinc-700/50" />
              ))}
            </div>
          </div>

          {/* Partner Spotlight Core */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Official Ekraahee Films Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border-2 border-amber-400/80 p-2 shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center group hover:scale-105 transition-transform">
                <img
                  src="/images/partners/ekraahee_films_logo.png"
                  alt="Ekraahee Films Logo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  <Award className="w-3 h-3 text-amber-400" /> Official Production Partner
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white font-display tracking-tight uppercase">
                  Ekraahee Films <span className="text-amber-400">×</span> Velametric
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  Broadcast-grade cinematography, high-fashion storytelling, live arena broadcasts, and viral commercial TVCs produced with Arri/RED cinema standards.
                </p>
              </div>
            </div>

            {/* Quick Specs / Trust Counter */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-2xl">
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">100+</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Projects</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-white font-display">4K HDR</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Master Quality</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">250+</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Films Shipped</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE MAIN WIDESCREEN CINEMA STAGE (16:9 RATIO) */}
      <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] group/stage">
        {/* Top Overlay Badge Bar - hidden on mobile */}
        <div className="hidden sm:flex absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-20 justify-between items-center pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-black shadow-lg shadow-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {activeVideo.badge}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-950/90 text-zinc-300 border border-zinc-700/80 backdrop-blur-md">
              {activeVideo.client}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-zinc-950/90 text-amber-400 border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {activeVideo.duration}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-zinc-950/90 text-zinc-400 border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> {activeVideo.views}
            </span>
          </div>
        </div>

        {/* Video Player Display Area (16:9 Widescreen) */}
        <div className="relative w-full aspect-video max-h-[640px] bg-zinc-950 flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            /* Active Live Embedded YouTube Player */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={activeVideo.title}
              className="w-full h-full border-0 animate-in fade-in duration-300"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* High-Res Cinema Poster / Thumbnail Stage with Play Button */
            <div
              onClick={() => setIsPlaying(true)}
              className="w-full h-full relative cursor-pointer group/play overflow-hidden"
            >
              <img
                src={`https://i.ytimg.com/vi/${activeVideo.youtubeId}/maxresdefault.jpg`}
                onError={(e) => {
                  // Fallback to hqdefault if maxresdefault is unavailable
                  (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`;
                }}
                alt={activeVideo.title}
                className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-700 opacity-100"
              />

              {/* Cinema Vignette Gradients - hidden on mobile for clarity */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              <div className="hidden sm:block absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />

              {/* Glowing Cinema Play Button - hidden on mobile */}
              <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
                <div className="relative group-hover/play:scale-110 transition-transform duration-300">
                  {/* Expanding Pulsing Ring */}
                  <div className="absolute -inset-4 rounded-full bg-amber-400/30 blur-md animate-ping pointer-events-none" />
                  
                  {/* Main Play Circle */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)] border-4 border-amber-300">
                    <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-black ml-1.5 transition-transform group-hover/play:scale-105" />
                  </div>
                </div>
              </div>

              {/* Bottom Cinema Title Overlay - hidden on mobile */}
              <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 space-y-2 pointer-events-none">
                <div className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  {activeVideo.category}
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight drop-shadow-md">
                  {activeVideo.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed line-clamp-2 drop-shadow">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Carousel Prev & Next Controls - hidden on mobile */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-950/80 hover:bg-amber-400 text-white hover:text-black border border-zinc-700/80 hover:border-amber-300 items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 transform hover:scale-110"
          title="Previous Film"
          aria-label="Previous Film"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-950/80 hover:bg-amber-400 text-white hover:text-black border border-zinc-700/80 hover:border-amber-300 items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-200 transform hover:scale-110"
          title="Next Film"
          aria-label="Next Film"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Slide Counter Indicator - hidden on mobile */}
        <div className="hidden sm:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-xs font-mono font-bold text-amber-400 backdrop-blur-md">
          <span className="text-white">0{currentIndex + 1}</span> / 0{EKRAAHEE_VIDEOS.length}
        </div>
      </div>

      {/* Mobile Controls & Info Bar (Cleanly placed OUTSIDE/BELOW the video) */}
      <div className="flex sm:hidden items-center justify-between gap-2 px-1 pt-1 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 active:scale-95 flex items-center justify-center"
            title="Previous Video"
            aria-label="Previous Video"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 active:scale-95 flex items-center justify-center"
            title="Next Video"
            aria-label="Next Video"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-amber-400 font-bold">
            0{currentIndex + 1} / 0{EKRAAHEE_VIDEOS.length}
          </span>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">{activeVideo.badge}</div>
          <div className="text-xs font-bold text-zinc-300 truncate max-w-[180px]">{activeVideo.client}</div>
        </div>
      </div>

      {/* 3. FILMSTRIP THUMBNAIL TRACK (CLICK TO SWITCH VIDEO) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            <Film className="w-3.5 h-3.5 text-amber-400" /> Select Film to Play ({EKRAAHEE_VIDEOS.length} Projects)
          </div>
          <a
            href="https://www.youtube.com/@EkRaaheefilms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Visit Ekraahee Films YouTube Channel <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {EKRAAHEE_VIDEOS.map((video, idx) => {
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(idx)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between p-2.5 bg-zinc-900/90 border ${
                  isCurrent
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.02]'
                    : 'border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900'
                }`}
              >
                {/* Thumbnail Preview with Live Active Indicator */}
                <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-black">
                  <img
                    src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isCurrent ? 'scale-105 opacity-100' : 'opacity-90 sm:opacity-70 group-hover:opacity-100'
                    }`}
                  />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Active Play/Playing Icon - hidden on mobile */}
                  <div className="hidden sm:flex absolute inset-0 items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      isCurrent
                        ? 'bg-amber-400 text-black scale-105 shadow-md shadow-amber-400/50'
                        : 'bg-black/60 text-white border border-white/30'
                    }`}>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag - hidden on mobile */}
                  <span className="hidden sm:inline-block absolute bottom-1.5 right-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                    {video.duration}
                  </span>
                </div>

                {/* Metadata */}
                <div className="pt-2 space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 truncate">
                    {video.client}
                  </div>
                  <div className="text-xs font-bold text-white truncate font-display leading-snug">
                    {video.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DEDICATED PARTNER PAGE LINK */}
      {showFullLink && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Ekraahee Films Cinema Portal</h4>
              <p className="text-xs text-zinc-400">View complete studio story, Arri/RED equipment, and broadcast credentials.</p>
            </div>
          </div>

          <Link
            to="/partners/ekraahee-films"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shrink-0 shadow-lg"
          >
            Open Dedicated Ekraahee Page <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
