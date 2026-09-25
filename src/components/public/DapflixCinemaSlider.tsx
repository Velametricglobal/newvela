import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  Eye,
  ExternalLink,
  Award,
  Clock,
  ArrowRight,
  Phone,
  Instagram,
  Video,
  RotateCw
} from 'lucide-react';

export interface DapflixVideoItem {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  duration: string;
  video_url: string;
  poster_url: string;
  badge: string;
  description: string;
  key_highlights: string[];
  aspectRatio?: '16:9' | '9:16' | '4:5' | 'auto';
  instagram_url?: string;
  views?: string;
}

export const DAPFLIX_VIDEOS: DapflixVideoItem[] = [
  {
    id: 'dp-1',
    title: 'Mahasu Devta Temple, Hanol — Ancient Heritage Film',
    subtitle: 'Kath-Kuni Architecture & Sacred Himalayan Devotion 4K',
    client: 'Jaunsar-Bawar Cultural Heritage',
    category: 'Ancient Heritage Cinema',
    duration: '01:45',
    video_url: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
    poster_url: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    badge: 'ANCIENT HERITAGE 4K',
    description: 'Explore the Ancient Mahasu Devta Temple, Hanol 🔱 — Hidden in the beautiful hills of Jaunsar-Bawar, Uttarakhand. A place where faith, history and centuries-old traditions come together.',
    key_highlights: ['Kath-Kuni Wood Craft', 'Tons River Himalayan Sweeps', 'Living Spiritual Heritage'],
    aspectRatio: '16:9',
    instagram_url: 'https://www.instagram.com/reel/DdVe1xLSdXB/',
    views: '1.1K+'
  },
  {
    id: 'dp-3',
    title: 'Achari (Dadi Maa Khendi) — Official Folk Music Cinema',
    subtitle: 'Contemporary Music Video & Devbhoomi Cultural Narrative',
    client: '1halfstrugglers × DAPFLIX',
    category: 'Folk Fusion & Music Cinema',
    duration: '01:30',
    video_url: 'https://dapflix.com/wp-content/uploads/2025/02/33.mp4',
    poster_url: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    badge: 'MUSIC VIDEO 4K',
    description: 'Welcome to the official release of "Achari". Inspired by the rich folklore, traditions, and cultural heritage of Uttarakhand — a tribute to our roots and the spirit of Devbhoomi.',
    key_highlights: ['Cinematic Beat Sync', 'Folklore Visual Narrative', 'Color Grade Master Visuals'],
    aspectRatio: '16:9',
    instagram_url: 'https://www.instagram.com/reel/Dbfj-RgBqNs/',
    views: '796'
  },
  {
    id: 'dp-4',
    title: 'Mansi & Swapnil — Retro Love Story Wedding Cinema',
    subtitle: 'Grand Heritage Wedding Film & Timeless Aesthetics',
    client: 'Mansi & Swapnil',
    category: 'Wedding Cinema',
    duration: '01:15',
    video_url: 'https://dapflix.com/wp-content/uploads/2025/03/AQN6qG8rwAJbhnu2yYkyKThtZcu00393c2jRDpiOpM3lwGtAM3n6jqxc8soOiE9xTMHhCPDToZo849qCOASX3UIj9_xb-K2TAxunY0s.mp4',
    poster_url: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    badge: 'RETRO WEDDING CINEMA',
    description: 'Mansi & Swapnil 💛✨🌃 — Rewinding to a love story that feels straight out of a classic. #retrolove #weddingphotography',
    key_highlights: ['Golden Hour Cine Glow', 'Vintage Retro Colorgrade', 'Emotional Candid Moments'],
    aspectRatio: '16:9',
    instagram_url: 'https://www.instagram.com/reel/DbDsHASSajx/',
    views: '172'
  },
  {
    id: 'dp-5',
    title: 'Deependra & Aastha — Quiet Beginning Pre-Wedding Cinema',
    subtitle: 'Riverside Romance & Serene Mountain Pre-Wedding Film',
    client: 'Deependra & Aastha',
    category: 'Pre-Wedding Cinema',
    duration: '01:40',
    video_url: 'https://dapflix.com/wp-content/uploads/2025/02/DAPFLIX-FILMS-CAFE-ON-THE-WAVES-UKI.mp4',
    poster_url: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    badge: 'PRE-WEDDING CINEMA',
    description: 'A quiet beginning to a forever kind of love. ❤️🫶🏻 As Deependra looked at Aastha, it wasn\'t just a moment — it was a promise waiting to unfold.',
    key_highlights: ['Riverside Cine Lighting', 'Soft Ambient Soundscape', 'Heartfelt Narrative'],
    aspectRatio: '16:9',
    instagram_url: 'https://www.instagram.com/reel/DXHM6NXkk7J/',
    views: '383'
  }
];

interface DapflixCinemaSliderProps {
  hideHeader?: boolean;
  showFullLink?: boolean;
}

export const DapflixCinemaSlider: React.FC<DapflixCinemaSliderProps> = ({
  hideHeader = false,
  showFullLink = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoRotation, setVideoRotation] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeVideo = DAPFLIX_VIDEOS[currentIndex] || DAPFLIX_VIDEOS[0] || {};

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % DAPFLIX_VIDEOS.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + DAPFLIX_VIDEOS.length) % DAPFLIX_VIDEOS.length);
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
      setCurrentIndex((prev) => (prev + 1) % DAPFLIX_VIDEOS.length);
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isHovered]);

  // When switching slide while playing, pause and reset
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setVideoRotation(0);
  }, [currentIndex]);

  const rotateVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoRotation(prev => {
      const next = prev - 90;
      return next <= -360 ? 0 : next;
    });
  };

  const videoTransformStyle: React.CSSProperties = {
    transform: `rotate(${videoRotation}deg)`,
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div
      className="w-full space-y-8 font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. OFFICIAL PRODUCTION PARTNER BANNER */}
      {!hideHeader && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/90 p-6 sm:p-8 shadow-2xl">
          {/* Subtle Ambient Glow */}
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
              <Film className="w-3.5 h-3.5" /> DAPFLIX CINEMA PRODUCTION OS
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
              {/* Official DAPFLIX Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border-2 border-amber-400/80 p-2 shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center group hover:scale-105 transition-transform">
                <img
                  src="/images/partners/dapflix_logo.png"
                  alt="DAPFLIX Films Logo"
                  className="w-full h-full object-contain drop-shadow"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  <Award className="w-3 h-3 text-amber-400" /> Official Production Partner
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white font-display tracking-tight uppercase">
                  DAPFLIX <span className="text-amber-400">×</span> Velametric
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                  "We make videos that people want." Commercial films, brand storytelling, music videos, and 4K aerial drone cinematography.
                </p>
              </div>
            </div>

            {/* Quick Specs / Trust Counter */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-2xl">
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">1,850+</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Videos</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-white font-display">4K HDR</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Master Quality</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">130+</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">TVCs</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE MAIN WIDESCREEN CINEMA STAGE (16:9 RATIO) */}
      <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] group/stage">
        {/* Top Overlay Badge Bar - hidden on mobile so screen is clear */}
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
            {activeVideo.views && (
              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-zinc-950/90 text-zinc-400 border border-zinc-800 backdrop-blur-md flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {activeVideo.views}
              </span>
            )}
          </div>
        </div>

        {/* Video Player Display Area (16:9 Widescreen) */}
        <div className="relative w-full aspect-video max-h-[640px] bg-zinc-950 flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            /* Active Live Video Player */
            <video
              ref={videoRef}
              src={activeVideo.video_url}
              className="w-full h-full object-contain border-0"
              autoPlay
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }}
              style={{ ...videoTransformStyle, cursor: 'default' }}
            />
          ) : (
            /* High-Res Cinema Poster / Thumbnail Stage with Play Button */
            <div
              onClick={() => setIsPlaying(true)}
              className="w-full h-full relative cursor-pointer group/play overflow-hidden"
            >
              {/* Poster Image — full 100% opacity for maximum clarity */}
              <video
                src={activeVideo.video_url}
                poster={activeVideo.poster_url}
                preload="metadata"
                className="w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-700 opacity-100 pointer-events-none"
                style={videoTransformStyle}
                muted
                playsInline
              />

              {/* Cinema Vignette Gradients - hidden on mobile for crystal clear image */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              <div className="hidden sm:block absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />

              {/* Glowing Cinema Play Button - hidden on mobile so screen is 100% clean video */}
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
          <span className="text-white">0{currentIndex + 1}</span> / 0{DAPFLIX_VIDEOS.length}
        </div>

        {/* Instagram Link, Rotate Button — Bottom Left - hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 items-center gap-2">
          {activeVideo.instagram_url && (
            <a
              href={activeVideo.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] uppercase flex items-center gap-1 shadow-md transition-all backdrop-blur-md"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram ↗
            </a>
          )}
          <button
            onClick={rotateVideo}
            className="px-3 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 text-amber-400 hover:text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all shadow-xl hover:scale-105 flex items-center gap-1.5 text-[10px] font-mono font-bold"
            title="Rotate Video"
          >
            <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${videoRotation !== 0 ? 'text-white' : 'text-amber-400'}`} style={{ transform: `rotate(${Math.abs(videoRotation)}deg)` }} />
            <span>{Math.abs(videoRotation)}° Rotate</span>
          </button>
        </div>
      </div>

      {/* Mobile Controls & Info Bar (Cleanly placed OUTSIDE/BELOW the video so video is 100% clear with zero overlays) */}
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
            0{currentIndex + 1} / 0{DAPFLIX_VIDEOS.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeVideo.instagram_url && (
            <a
              href={activeVideo.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] uppercase flex items-center gap-1 shadow"
            >
              <Instagram className="w-3 h-3" /> Instagram ↗
            </a>
          )}
          <button
            onClick={rotateVideo}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900 border border-amber-400/40 text-amber-400 font-mono font-bold text-[10px] flex items-center gap-1 active:scale-95"
            title="Rotate Video"
          >
            <RotateCw className="w-3 h-3" /> {Math.abs(videoRotation)}°
          </button>
        </div>
      </div>

      {/* 3. FILMSTRIP THUMBNAIL TRACK (CLICK TO SWITCH VIDEO) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
            <Film className="w-3.5 h-3.5 text-amber-400" /> Select Film to Play ({DAPFLIX_VIDEOS.length} Projects)
          </div>
          <a
            href="https://www.instagram.com/dapflix/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Visit DAPFLIX Instagram <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {DAPFLIX_VIDEOS.map((video, idx) => {
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
                  <video
                    src={video.video_url}
                    poster={video.poster_url}
                    preload="metadata"
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-transform duration-500 pointer-events-none ${
                      isCurrent ? 'scale-105 opacity-100' : 'opacity-90 sm:opacity-75'
                    }`}
                  />
                  {/* Subtle gradient on desktop only */}
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
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated DAPFLIX Production Portal</h4>
              <p className="text-xs text-zinc-400">View complete studio story, drone gear list, and cinema deliverables.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl"
            >
              <Video className="w-4 h-4" /> Request Studio Shoot
            </Link>

            <Link
              to="/partners/dapflix"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shrink-0 shadow-lg"
            >
              Open Dedicated DAPFLIX Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
