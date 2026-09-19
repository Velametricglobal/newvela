import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Send, 
  ExternalLink, 
  Sparkles, 
  Instagram, 
  Flame, 
  Music, 
  Film, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCw,
  RotateCcw,
  Smartphone,
  Monitor
} from 'lucide-react';

export interface DapflixInstagramReel {
  id: string;
  instagramUrl: string;
  videoUrl: string;
  posterUrl: string;
  title: string;
  category: string;
  views: string;
  likes: string;
  comments: string;
  caption: string;
  audioTrack: string;
  hashtags: string[];
}

export const DAPFLIX_INSTAGRAM_REELS: DapflixInstagramReel[] = [
  {
    id: 'reel-1',
    instagramUrl: 'https://www.instagram.com/reel/DdVe1xLSdXB/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Explore Ancient Mahasu Devta Temple, Hanol',
    category: 'Heritage & Temple Cinema',
    views: '86.4K',
    likes: '8.1K',
    comments: '412',
    caption: 'Hidden in the beautiful hills of Jaunsar-Bawar, Hanol is home to the revered Mahasu Devta Temple — where 9th-century Kath-Kuni wood craftsmanship meets eternal faith. 🏔️🙏',
    audioTrack: 'Sacred Flute of Devbhoomi • dapflix',
    hashtags: ['#mahasudevta', '#hanol', '#jagda', '#uttarakhandtourism', '#dapflix']
  },
  {
    id: 'reel-2',
    instagramUrl: 'https://www.instagram.com/reel/Dcn1aRggAJH/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Hanol & Jagda Mahotsav — Discover North Expedition',
    category: 'Expedition & Drone Cinema',
    views: '142K',
    likes: '14.5K',
    comments: '710',
    caption: 'Travel with Discover North Adventure. Experience the culture, feel the devotion at the annual Jagda festival amidst the majestic Tons River valley. 🏔️✨',
    audioTrack: 'Highland Folk Symphony • dapflix drone series',
    hashtags: ['#charbhaimahasu', '#jaunsarbawar', '#discovernorth', '#dapflix']
  },
  {
    id: 'reel-3',
    instagramUrl: 'https://www.instagram.com/reel/Dbfj-RgBqNs/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/02/33.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Achari (Dadi Maa Khendi) — 1halfstrugglers',
    category: 'Folk Fusion & Music Cinema',
    views: '98.5K',
    likes: '11.2K',
    comments: '580',
    caption: 'Official release of "Achari" — inspired by rich Himalayan folklore, traditions, and the proud spirit of Devbhoomi Uttarakhand. ❤️🏔️',
    audioTrack: 'Achari (Dadi Maa Khendi) • 1halfstrugglers × dapflix',
    hashtags: ['#achari', '#folklore', '#devbhoomi', '#musicvideo', '#dapflix']
  },
  {
    id: 'reel-4',
    instagramUrl: 'https://www.instagram.com/reel/DbDsHASSajx/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/AQN6qG8rwAJbhnu2yYkyKThtZcu00393c2jRDpiOpM3lwGtAM3n6jqxc8soOiE9xTMHhCPDToZo849qCOASX3UIj9_xb-K2TAxunY0s.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Mansi & Swapnil — Retro Love Story',
    category: 'Wedding Reel',
    views: '48.5K',
    likes: '4.2K',
    comments: '218',
    caption: 'Mansi & Swapnil 💛✨ Rewinding to a love story that feels straight out of a classic. Turning silent glances and golden hour laughter into eternal cinema.',
    audioTrack: 'Original Audio - dapflix • Retro Romance',
    hashtags: ['#retrolove', '#weddingphotography', '#bestweddingphotographer', '#dapflix']
  },
  {
    id: 'reel-5',
    instagramUrl: 'https://www.instagram.com/reel/DXHM6NXkk7J/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/02/DAPFLIX-FILMS-CAFE-ON-THE-WAVES-UKI.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Deependra & Aastha — Quiet Beginning Pre-Wedding',
    category: 'Pre-Wedding Cinema',
    views: '73.1K',
    likes: '8.2K',
    comments: '394',
    caption: 'A quiet beginning to a forever kind of love. In her smile, he found peace… in his presence, she found home. ❤️🫶🏻',
    audioTrack: 'Soft Acoustic Harmony • dapflix studio',
    hashtags: ['#prewedding', '#weddingphotography', '#coupleshoot', '#cinematicwedding', '#dapflix']
  },
  {
    id: 'reel-6',
    instagramUrl: 'https://www.instagram.com/reel/DXBYXdvkkWP/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/02/33.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Pahadi Culture Heritage & Style Drone Visuals',
    category: 'Culture & Heritage',
    views: '110K',
    likes: '13.9K',
    comments: '780',
    caption: 'Grace in every step, tradition in every thread ✨ Celebrating the essence of Pahadi culture — where heritage meets style and every look tells a story of the majestic Himalayas. 🏔️🔥',
    audioTrack: 'Folk Fusion Beats • dapflix devbhoomi reel',
    hashtags: ['#kartavya', '#youthfest', '#uttarakhandtourism', '#culture', '#dapflix']
  },
  {
    id: 'reel-7',
    instagramUrl: 'https://www.instagram.com/reel/DWqMlwAEhi2/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/AQN6qG8rwAJbhnu2yYkyKThtZcu00393c2jRDpiOpM3lwGtAM3n6jqxc8soOiE9xTMHhCPDToZo849qCOASX3UIj9_xb-K2TAxunY0s.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Star Night With Deepak Chauhan Mountain Beats',
    category: 'Live Concert & Fest',
    views: '58.3K',
    likes: '5.9K',
    comments: '290',
    caption: 'A magical Star Night filled with rhythm, culture, and mountain vibes with Deepak Chauhan. An unforgettable evening where every note echoed the soul of Himachal. 🌌🎶',
    audioTrack: 'Himachali Folk Acoustic • dapflix',
    hashtags: ['#dapflix', '#fest', '#youthfest', '#kartavya', '#mountainmusic']
  },
  {
    id: 'reel-8',
    instagramUrl: 'https://www.instagram.com/reel/DWnkk4IEs-4/',
    videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
    posterUrl: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
    title: 'Dev Doli Milan Mahotsav Sacred Energies Reel',
    category: 'Devbhoomi Tradition',
    views: '84.2K',
    likes: '10.4K',
    comments: '512',
    caption: 'A divine celebration of culture, faith, and tradition ✨ The Dev Doli Milan Mahotsav in Uttarkashi brought together sacred energies, vibrant rituals, and the true spirit of Devbhoomi. 🙏🔥',
    audioTrack: 'Dev Doli Sacred Chants × Drone Symphony',
    hashtags: ['#uttarakhandtourism', '#devdolimilan', '#uttarkashi', '#kartavya', '#dapflix']
  }
];

interface DapflixReelsShowcaseProps {
  title?: string;
  subtitle?: string;
  hideHeader?: boolean;
}

export const DapflixReelsShowcase: React.FC<DapflixReelsShowcaseProps> = ({
  title = 'DAPFLIX Instagram Reels Slider',
  subtitle = 'Swipe through viral Instagram reels in an interactive rotatable smartphone screen slider.',
  hideHeader = false
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [videoRotation, setVideoRotation] = useState<number>(0);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeReel = DAPFLIX_INSTAGRAM_REELS[activeReelIndex];

  // Auto-play when switching active reel
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Video auto-playback caught:', err);
        setIsPlaying(false);
      });
    }
  }, [activeReelIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Play error:', err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleOrientation = () => {
    setIsLandscape(prevLandscape => {
      const nextLandscape = !prevLandscape;
      // In landscape (camera notch on the left), -90deg rotation keeps the video right side up
      setVideoRotation(nextLandscape ? -90 : 0);
      return nextLandscape;
    });
  };

  const rotateVideoStep = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Step by -90deg so user can adjust or flip
    setVideoRotation(prev => {
      const next = prev - 90;
      return next <= -360 ? 0 : next;
    });
  };

  const isRotatedQuarter = Math.abs(videoRotation) % 180 !== 0;
  const videoStyle: React.CSSProperties = {
    transform: `rotate(${videoRotation}deg)`,
    width: isRotatedQuarter
      ? (isLandscape ? '56.25%' : '177.78%')
      : '100%',
    height: isRotatedQuarter
      ? (isLandscape ? '177.78%' : '56.25%')
      : '100%',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), width 0.7s ease, height 0.7s ease',
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedReels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (e: React.MouseEvent, reel: DapflixInstagramReel) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reel.instagramUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      window.open(reel.instagramUrl, '_blank');
    }
  };

  const nextReel = () => {
    setActiveReelIndex((prev) => (prev + 1) % DAPFLIX_INSTAGRAM_REELS.length);
  };

  const prevReel = () => {
    setActiveReelIndex((prev) => (prev - 1 + DAPFLIX_INSTAGRAM_REELS.length) % DAPFLIX_INSTAGRAM_REELS.length);
  };

  return (
    <div className="space-y-8">
      {/* 1. INSTAGRAM PROFILE CARD & INTRO */}
      {!hideHeader && (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-zinc-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-xl shrink-0">
                <div className="p-1 rounded-full bg-zinc-950">
                  <img
                    src="https://dapflix.com/wp-content/uploads/sb-instagram-feed-images/dapflix.webp"
                    alt="@dapflix on Instagram"
                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/partners/dapflix_logo.png";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
                    @dapflix
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-black" title="Verified Creator">
                      ✓
                    </span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
                    Instagram Creator
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium max-w-xl leading-relaxed">
                  🎥 Video Editing | VFX | Photography • 🚁 Drone Shoots | Commercial | Events • 💍 Weddings & Pre-Weddings • 🎬 Cinematics & Viral Reels
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Film className="w-3.5 h-3.5 text-amber-400" /> 1,850+ Reels & Videos
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Eye className="w-3.5 h-3.5 text-pink-400" /> 100K+ Reel Reach
                  </span>
                  <span className="text-zinc-500 font-mono">📍 Uttarkashi & Dehradun</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://www.instagram.com/dapflix/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all hover:scale-105"
              >
                <Instagram className="w-4 h-4" /> Follow @dapflix ↗
              </a>
              <Link
                to="/request-quote"
                className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Film className="w-3.5 h-3.5" /> Book Reel Shoot
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. CENTERED REEL SCREEN SLIDER (NO GALLERY - FULL SCREEN SLIDER WITH ROTATION) */}
      <div className="w-full flex flex-col items-center justify-center space-y-6">
        {/* Top Control Ribbon: Navigation, Rotation, and Orientation Indicator */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-md">
          {/* Left: Reel Counter and Category */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              Reel {activeReelIndex + 1} of {DAPFLIX_INSTAGRAM_REELS.length}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
              {activeReel.category}
            </span>
          </div>

          {/* Right: THE ROTATION BUTTON + SLIDER ARROWS */}
          <div className="flex items-center gap-3">
            {/* THE ROTATION BUTTON */}
            <button
              onClick={toggleOrientation}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-95 border ${
                isLandscape
                  ? 'bg-amber-400 text-black border-amber-300 shadow-amber-400/20'
                  : 'bg-zinc-900 hover:bg-zinc-850 text-white border-zinc-700 hover:border-amber-400/50'
              }`}
              title={isLandscape ? "Rotate Frame & Video to Vertical (9:16 Portrait)" : "Rotate Frame & Video to Horizontal (16:9 Landscape)"}
            >
              <RotateCw className={`w-4 h-4 transition-transform duration-700 ${isLandscape ? '-rotate-90 text-black' : 'text-amber-400'}`} />
              <span>{isLandscape ? 'Landscape (16:9) • Rotate to 9:16' : 'Rotate Screen & Video (Landscape)'}</span>
            </button>

            {/* Previous & Next Slider Arrows */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
              <button
                onClick={prevReel}
                className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                title="Previous Reel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextReel}
                className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                title="Next Reel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. THE INTERACTIVE ROTATABLE SCREEN (SLIDER STAGE) */}
        <div className="relative w-full flex items-center justify-center">
          {/* Floating Outer Slide Navigation Arrows on Large Screens */}
          <button
            onClick={prevReel}
            className="hidden md:flex absolute left-4 lg:left-8 z-40 w-12 h-12 rounded-full bg-zinc-900/90 hover:bg-amber-400 text-white hover:text-black border border-zinc-700 hover:border-amber-300 shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Previous Reel"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextReel}
            className="hidden md:flex absolute right-4 lg:right-8 z-40 w-12 h-12 rounded-full bg-zinc-900/90 hover:bg-amber-400 text-white hover:text-black border border-zinc-700 hover:border-amber-300 shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Next Reel"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* THE DEVICE SCREEN CHASSIS (SMOOTHLY MORPHS ON ROTATION) */}
          <div 
            className={`relative overflow-hidden bg-black transition-all duration-700 ease-in-out group/screen ${
              isLandscape
                ? 'w-full max-w-4xl sm:max-w-5xl aspect-video rounded-[36px] border-[6px] border-zinc-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] ring-1 ring-white/10'
                : 'w-full max-w-[360px] sm:max-w-[390px] aspect-[9/16] rounded-[48px] border-[8px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-1 ring-white/15'
            }`}
          >
            {/* Dynamic Island Pill (top when portrait, side when landscape) */}
            <div className={`absolute ${
              isLandscape 
                ? 'left-3 top-1/2 -translate-y-1/2 w-4 h-20 flex-col' 
                : 'top-2.5 inset-x-0 mx-auto w-24 h-5 flex-row'
            } bg-black rounded-full z-40 flex items-center justify-between px-2.5 py-1 shadow-md pointer-events-none`}>
              <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-800/80" />
            </div>

            {/* The Active Reel Video Container (Rotates Video with Frame) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10">
              {/* Ambient Blurred Glow Backdrop (Rotates with Video) */}
              <video
                src={activeReel.videoUrl}
                style={videoStyle}
                className="absolute object-cover blur-3xl opacity-30 scale-125 pointer-events-none max-w-none max-h-none"
                aria-hidden="true"
              />

              {/* The Active Reel Video */}
              <video
                ref={videoRef}
                src={activeReel.videoUrl}
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                onClick={togglePlay}
                style={videoStyle}
                className="object-cover cursor-pointer relative z-10 max-w-none max-h-none"
              />
            </div>

            {/* Center Big Play/Pause Button When Paused - hidden on mobile so screen is clear */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="hidden sm:flex absolute inset-0 bg-black/40 backdrop-blur-[1px] items-center justify-center cursor-pointer z-30 transition-opacity"
              >
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/95 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-8 sm:w-9 h-8 sm:h-9 fill-black ml-1" />
                </div>
              </div>
            )}

            {/* TOP BAR: Instagram Header, Audio Mute, and IN-SCREEN ROTATION BUTTON - hidden on mobile */}
            <div className={`hidden sm:flex absolute ${
              isLandscape ? 'top-4 px-6' : 'top-8 px-4'
            } inset-x-0 items-center justify-between z-30 pointer-events-none`}>
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/15 flex items-center gap-1 shadow-md">
                  <Instagram className="w-3 h-3 text-pink-400" /> Reels
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-400 border border-white/15 hidden sm:inline shadow-md font-mono">
                  {isLandscape ? '16:9 Landscape' : '9:16 Vertical'}
                </span>
              </div>

              {/* Action Buttons: ROTATE SCREEN & VIDEO + ANGLE STEP + AUDIO MUTE */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* ROTATION BUTTON ON SCREEN */}
                <button
                  onClick={toggleOrientation}
                  className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-amber-400 hover:text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-90 flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-wider"
                  title={isLandscape ? "Rotate Frame & Video to Portrait (9:16)" : "Rotate Frame & Video to Landscape (16:9)"}
                >
                  <RotateCw className={`w-3.5 h-3.5 transition-transform duration-700 ${isLandscape ? '-rotate-90 text-white' : 'text-amber-400'}`} />
                  <span>Rotate Video</span>
                </button>

                {/* Direct 90-degree step angle button */}
                <button
                  onClick={rotateVideoStep}
                  className="px-2.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 border border-zinc-700 backdrop-blur-md shadow-lg text-[10px] font-mono font-bold transition-transform active:scale-90"
                  title="Rotate or flip video orientation by 90°"
                >
                  {videoRotation === 0 ? '0°' : `${videoRotation}°`} ⟳
                </button>

                {/* Sound Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-90"
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-zinc-300" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE ENGAGEMENT ACTION RAIL - hidden on mobile */}
            <div className={`hidden sm:flex absolute right-3 ${
              isLandscape ? 'bottom-8' : 'bottom-24'
            } flex-col items-center gap-3.5 z-30 pointer-events-auto`}>
              {/* Like Button */}
              <button
                onClick={(e) => toggleLike(e, activeReel.id)}
                className="flex flex-col items-center gap-1 group/like"
              >
                <div className={`p-2.5 rounded-full backdrop-blur-md border shadow-lg transition-transform active:scale-125 ${
                  likedReels[activeReel.id]
                    ? 'bg-rose-600/90 text-white border-rose-500'
                    : 'bg-black/70 text-white border-white/20 group-hover/like:bg-black/90'
                }`}>
                  <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${likedReels[activeReel.id] ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow font-mono">
                  {likedReels[activeReel.id] ? 'Liked' : activeReel.likes}
                </span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-lg">
                  <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow font-mono">
                  {activeReel.comments}
                </span>
              </div>

              {/* Share / Copy Link */}
              <button
                onClick={(e) => handleShare(e, activeReel)}
                className="flex flex-col items-center gap-1"
                title="Share Reel"
              >
                <div className="p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-110 transition-transform">
                  <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold text-white drop-shadow font-mono">
                  {copiedLink ? 'Copied' : 'Share'}
                </span>
              </button>

              {/* Direct Open in Instagram */}
              <a
                href={activeReel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1"
                title="Watch on Instagram"
              >
                <div className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white shadow-lg hover:scale-110 transition-transform">
                  <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-[9px] font-black text-amber-300 drop-shadow uppercase font-mono">
                  IG ↗
                </span>
              </a>

              {/* Spinning Disc Audio Indicator */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-950 border-2 border-white/30 flex items-center justify-center animate-[spin_6s_linear_infinite] shadow-lg">
                <Music className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* BOTTOM INFO OVERLAY: Handle, Caption, Audio Badge - hidden on mobile */}
            <div className={`hidden sm:block absolute inset-x-0 bottom-0 p-4 ${
              isLandscape ? 'pt-8' : 'pt-14'
            } bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none`}>
              <div className={`space-y-1.5 pointer-events-auto ${isLandscape ? 'max-w-2xl pr-20' : 'pr-14'}`}>
                {/* Profile Pill */}
                <div className="flex items-center gap-2">
                  <img
                    src="https://dapflix.com/wp-content/uploads/sb-instagram-feed-images/dapflix.webp"
                    alt="@dapflix"
                    className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/images/partners/dapflix_logo.png";
                    }}
                  />
                  <a
                    href="https://www.instagram.com/dapflix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-black text-white hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    dapflix
                    <span className="text-sky-400 text-[10px]">✓</span>
                  </a>
                  <a
                    href="https://www.instagram.com/dapflix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 hover:bg-white text-white hover:text-black border border-white/40 transition-colors"
                  >
                    Follow
                  </a>
                </div>

                {/* Caption Snippet */}
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-snug line-clamp-2">
                  {activeReel.caption}
                </p>

                {/* Hashtags & Audio Track */}
                <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-mono pt-0.5">
                  <div className="text-amber-300 font-semibold truncate max-w-[200px]">
                    {activeReel.hashtags.slice(0, 2).join(' ')}
                  </div>
                  <span className="text-zinc-600">•</span>
                  <div className="flex items-center gap-1 text-zinc-400 truncate">
                    <Music className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{activeReel.audioTrack}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SLIDER PAGINATION & REEL TITLE FOOTER */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
              Active Reel Title:
            </span>
            <h4 className="text-sm font-extrabold text-white font-display">
              {activeReel.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-pink-400" /> {activeReel.views} Views
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> {activeReel.likes} Likes
              </span>
            </div>
          </div>

          {/* Dot Pagination Selector & Direct Link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Clickable Dots for All 8 Reels */}
            <div className="flex items-center gap-1.5">
              {DAPFLIX_INSTAGRAM_REELS.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => setActiveReelIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeReelIndex
                      ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/30'
                      : 'w-2.5 bg-zinc-800 hover:bg-zinc-600'
                  }`}
                  title={`Go to Reel ${idx + 1}: ${reel.title}`}
                />
              ))}
            </div>

            <a
              href={activeReel.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 font-extrabold text-xs tracking-wider uppercase transition-colors"
            >
              Watch on Instagram <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
