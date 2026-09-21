import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortfolioProject } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { 
  ChevronRight, 
  ExternalLink, 
  Globe, 
  Quote, 
  Film, 
  ArrowRight,
  Camera,
  Calendar,
  Award,
  Users,
  Heart,
  Flag,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  CheckCircle2,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
import { DapflixCinemaSlider } from '../../components/public/DapflixCinemaSlider';

interface EventPhotoItem {
  id: string;
  src: string;
  title: string;
  category: string;
  bannerText: string;
  caption: string;
  highlights: string;
}

const EVENT_PHOTOS_DATA: EventPhotoItem[] = [
  {
    id: 'ep-1',
    src: '/images/events/corruption_free_doon_marathon_start.jpg',
    title: 'The 14-Kilometer Unity Marathon Starting Grid',
    category: 'December 25, 2018 • Athletics & Youth Endurance',
    bannerText: 'CHEST BIBS: "OK INDIA PRESENTS — CORRUPTION FREE DOON"',
    caption: 'A headline attraction of the event was a high-energy 14 km marathon designed to promote health, physical endurance, and active community participation. Hundreds of runners of all ages united under the banner of a healthier, cleaner lifestyle, turning the marathon into a moving symbol of collective perseverance against substance abuse.',
    highlights: 'Hundreds of Athletes • 14 KM Unity Course'
  },
  {
    id: 'ep-2',
    src: '/images/events/corruption_free_doon_trophies.jpg',
    title: 'Awards & Recognition Ceremony — Golden Globe Trophies',
    category: 'December 25, 2018 • Honors & Recognition',
    bannerText: 'PLAQUE: "OK INDIA — CORRUPTION FREE DOON — DATE: 25 DECEMBER"',
    caption: 'To honor community champions, change-makers, and top-performing athletes, a formal awards ceremony was conducted. Bespoke Golden Globe trophies and certificates were distributed to marathon winners and individuals who made exceptional contributions toward social welfare and positive community development.',
    highlights: '40+ Golden Globe Awards • Official OK India & Wellmetrics Plaque'
  },
  {
    id: 'ep-3',
    src: '/images/events/corruption_free_doon_folk_dance.jpg',
    title: 'Cultural Showcase & Garhwali Folk Performances',
    category: 'December 25, 2018 • Regional Cultural Heritage',
    bannerText: 'BANNER: "WELCOME OK INDIA HALF MARATHON CORRUPTION FREE DOON"',
    caption: 'The event celebrated the rich heritage of the region through vibrant traditional Garhwali folk dances, musical performances, and theatrical acts. These cultural segments not only engaged the audience deeply but also reinforced local pride and unity while delivering socially impactful messages.',
    highlights: 'Authentic Pahadi Attire • Cultural Heritage Choreography'
  },
  {
    id: 'ep-4',
    src: '/images/events/corruption_free_doon_vip_arena.jpg',
    title: 'Social Advocacy Campaign & VIP Stadium Assembly',
    category: 'December 25, 2018 • Civic Engagement & Dignitaries',
    bannerText: 'SEATING AREA: "CORRUPTION FREE DOON CIVIC PLEDGE ASSEMBLY"',
    caption: 'Throughout the venue, interactive sessions and displays emphasized the core mission of the campaign: eradicating drug dependency and rooting out corruption. Attendees and leaders pledged their support to build a transparent, progressive, and resilient Uttarakhand for future generations.',
    highlights: 'Public Anti-Drug Pledges • VIP Protocol & Assembly'
  },
  {
    id: 'ep-5',
    src: '/images/events/corruption_free_doon_organizers_troupe.jpg',
    title: 'Organizing Committee & Cultural Troupe Felicitation',
    category: 'December 25, 2018 • Campaign Leadership',
    bannerText: 'COMMITTEE: "OK INDIA MEDIA PARTNER & WELLMETRICS"',
    caption: 'OK India Media Partner and Wellmetrics core organizers, logistics directors, and traditional folk artists gathered together on the field following the conclusion of this historic campaign.',
    highlights: 'OK India & Wellmetrics Team • Complete Turnkey Execution'
  }
];

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<EventPhotoItem | null>(null);

  useEffect(() => {
    if (slug) {
      portfolioService.getProjectBySlug(slug).then(proj => {
        setProject(proj);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <Link to="/portfolio" className="text-white font-bold underline">Return to Portfolio</Link>
      </div>
    );
  }

  const isVideoProduction = project.project_type === 'video_production' || project.slug?.includes('ekraahee');
  const isEventProject = project.category === 'events' || project.project_type === 'events' || project.slug?.includes('uttarakhand') || project.slug?.includes('marathon');

  // Specific check for the Drug-Free & Corruption-Free campaign
  const isDrugFreeMarathon = project.slug?.includes('drug-free') || project.slug?.includes('corruption-free') || project.id === 'proj-event-cfd-marathon';

  return (
    <div className="py-16 max-w-[1280px] mx-auto px-6 font-sans space-y-12 selection:bg-amber-400 selection:text-black">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
        <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/portfolio" className="hover:text-white transition-colors">Events & Production</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-200 truncate max-w-[280px] sm:max-w-md">{project.title}</span>
      </div>

      {/* ========================================================================= */}
      {/* IF THIS IS THE DRUG-FREE & CORRUPTION-FREE UTTARAKHAND CAMPAIGN PAGE      */}
      {/* ========================================================================= */}
      {isDrugFreeMarathon ? (
        <div className="space-y-12">
          {/* 1. Header Banner & Executive Badges */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" /> Event Date: December 25, 2018
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-red-400" /> Organizers: OK India Media Partner & Wellmetrics
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-zinc-900 text-emerald-400 border border-zinc-800 uppercase tracking-wider">
                <Flag className="w-3.5 h-3.5" /> "Drug-Free Uttarakhand" & "Corruption-Free Uttarakhand"
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display leading-[1.1] tracking-tight">
                Drug-Free & Corruption-Free Uttarakhand Campaign
              </h1>
              <p className="text-amber-400 font-mono text-sm sm:text-base font-bold uppercase tracking-wider">
                14-Kilometer Unity Marathon • Traditional Cultural Showcase • Golden Globe Awards Ceremony
              </p>
            </div>

            {/* Executive Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-amber-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> Executive Summary
                </div>
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
                  On <strong>December 25, 2018</strong>, <strong>OK India Media Partner</strong> and <strong>Wellmetrics</strong> successfully hosted a landmark community-driven event dedicated to fostering social change and youth empowerment in Uttarakhand. Anchored by the powerful vision of a <strong>Drug-Free and Corruption-Free Uttarakhand</strong>, the initiative brought together community members, athletes, artists, and leaders through a dynamic blend of sports, cultural showcases, and civic recognition.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Interactive On-Ground Photo Gallery */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.12)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-wider mb-1.5">
                  <Camera className="w-3.5 h-3.5" /> Event Photo Gallery & On-Ground Documentation
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Live Event Archive (December 25, 2018)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 mr-2">
                  {activePhotoIndex + 1} / {EVENT_PHOTOS_DATA.length}
                </span>
                <button
                  onClick={() => setActivePhotoIndex(prev => (prev > 0 ? prev - 1 : EVENT_PHOTOS_DATA.length - 1))}
                  className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-zinc-700"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePhotoIndex(prev => (prev < EVENT_PHOTOS_DATA.length - 1 ? prev + 1 : 0))}
                  className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all border border-zinc-700"
                  title="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Featured Photo Spotlight */}
            {(() => {
              const currentPhoto = EVENT_PHOTOS_DATA[activePhotoIndex];
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 relative group rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl">
                    <div 
                      className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative cursor-pointer"
                      onClick={() => setLightboxPhoto(currentPhoto)}
                    >
                      <img
                        src={currentPhoto.src}
                        alt={currentPhoto.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxPhoto(currentPhoto);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-black text-white text-xs font-mono font-bold backdrop-blur-md border border-white/20 transition-all shadow-lg"
                        >
                          <Maximize2 className="w-3.5 h-3.5" /> Fullscreen ↗
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-amber-400">
                          <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{currentPhoto.bannerText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                        {currentPhoto.category}
                      </span>
                      <h4 className="text-xl font-bold text-white font-display leading-tight">
                        {currentPhoto.title}
                      </h4>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {currentPhoto.caption}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        Photo Highlights
                      </div>
                      <div className="text-xs font-bold text-zinc-200">
                        {currentPhoto.highlights}
                      </div>
                    </div>

                    <button
                      onClick={() => setLightboxPhoto(currentPhoto)}
                      className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/20"
                    >
                      <Maximize2 className="w-4 h-4" /> View High-Res Image
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 5-Photo Thumbnail Track */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
              {EVENT_PHOTOS_DATA.map((photo, idx) => {
                const isSelected = idx === activePhotoIndex;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all text-left group ${
                      isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-102' : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
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

          {/* 3. Key Highlights & Activities (4 Pillars) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" /> Core Campaign Structure
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                Key Highlights & Activities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: 14-Kilometer Unity Marathon */}
              <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Flag className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    The 14-Kilometer Unity Marathon
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    A headline attraction of the event was a high-energy 14 km marathon designed to promote health, physical endurance, and active community participation. Hundreds of runners of all ages united under the banner of a healthier, cleaner lifestyle, turning the marathon into a moving symbol of collective perseverance against substance abuse.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <span>Distance: 14 KM Unity Run</span>
                  <span>Athletes: Hundreds of Runners</span>
                </div>
              </div>

              {/* Card 2: Cultural Showcase & Performances */}
              <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl hover:border-pink-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Cultural Showcase & Performances
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    The event celebrated the rich heritage of the region through vibrant traditional folk dances, musical performances, and theatrical acts. These cultural segments not only engaged the audience deeply but also reinforced local pride and unity while delivering socially impactful messages.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-pink-400 font-bold">
                  <span>Uttarakhand Heritage</span>
                  <span>Authentic Garhwali Attire & Troupe</span>
                </div>
              </div>

              {/* Card 3: Awards & Recognition Ceremony */}
              <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl hover:border-yellow-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Awards & Recognition Ceremony
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    To honor community champions, change-makers, and top-performing athletes, a formal awards ceremony was conducted. Trophies and certificates were distributed to marathon winners and individuals who made exceptional contributions toward social welfare and positive community development.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-yellow-400 font-bold">
                  <span>Golden Globe Championship Awards</span>
                  <span>Engraved Date: Dec 25, 2018</span>
                </div>
              </div>

              {/* Card 4: Social Advocacy Campaign */}
              <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Social Advocacy Campaign
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Throughout the venue, interactive sessions and displays emphasized the core mission of the campaign: eradicating drug dependency and rooting out corruption. Attendees pledged their support to build a transparent, progressive, and resilient Uttarakhand for future generations.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>"Drug-Free & Corruption-Free"</span>
                  <span>Community Pledges & Civic Action</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Impact & Legacy */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/40 shadow-2xl relative">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> Impact & Legacy
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                An Unforgettable Platform for Community Action
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                The December 25, 2018 event served as a powerful catalyst for social awareness, successfully engaging youth and local leaders alike. By combining athletic endurance with cultural expression, <strong>OK India Media Partner</strong> and <strong>Wellmetrics</strong> created an unforgettable platform that continues to inspire community action and positive advocacy in the region.
              </p>
            </div>
          </div>

          {/* 5. Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-amber-400 font-display">14 KM</div>
              <div className="text-xs font-mono text-zinc-400 uppercase">Unity Marathon Distance</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-white font-display">Hundreds</div>
              <div className="text-xs font-mono text-zinc-400 uppercase">Runners of All Ages</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-amber-400 font-display">40+</div>
              <div className="text-xs font-mono text-zinc-400 uppercase">Golden Globe Trophies</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-display">100%</div>
              <div className="text-xs font-mono text-zinc-400 uppercase">Civic Advocacy Pledges</div>
            </div>
          </div>

          {/* 6. Testimonial */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl relative">
            <Quote className="w-12 h-12 text-zinc-800 absolute top-6 right-8" />
            <p className="text-lg sm:text-xl font-medium text-white italic mb-4 leading-relaxed">
              "{project.testimonial_quote}"
            </p>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              — {project.testimonial_author}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD PROJECT DETAIL VIEW (For Web, CRM, Video Projects)               */
        /* ========================================================================= */
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-zinc-900 text-amber-400 border border-zinc-800 uppercase tracking-wider">
                Client: {project.client}
              </span>
              {project.live_url && (
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono">
                  ● Live Hosted Site
                </span>
              )}
              {isVideoProduction && (
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/40 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" /> Cinema & Video Production Showcase
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
              {project.title}
            </h1>

            <p className="text-zinc-300 text-lg max-w-3xl leading-relaxed">
              {project.description}
            </p>

            {project.live_url && (
              <div className="pt-4">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-2xl"
                >
                  <Globe className="w-4 h-4 text-emerald-600" /> Visit Live Hosted Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {isVideoProduction ? (
            <div className="py-2">
              {project.slug?.includes('dapflix') || project.production_partner === 'Dapflix' ? (
                <DapflixCinemaSlider />
              ) : (
                <EkraaheeCinemaSlider />
              )}
            </div>
          ) : (
            <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img src={project.featured_image} alt={project.title} className="w-full h-[480px] object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
              <h3 className="text-lg font-extrabold text-rose-400 font-display uppercase tracking-wider">The Challenge</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">{project.challenge}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
              <h3 className="text-lg font-extrabold text-amber-400 font-display uppercase tracking-wider">Our Solution</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">{project.solution}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-3">
              <h3 className="text-lg font-extrabold text-emerald-400 font-display uppercase tracking-wider">Measurable Results</h3>
              <p className="text-zinc-300 text-xs leading-relaxed">{project.results}</p>
            </div>
          </div>

          {project.testimonial_quote && (
            <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl relative">
              <Quote className="w-12 h-12 text-zinc-800 absolute top-6 right-8" />
              <p className="text-xl sm:text-2xl font-medium text-white italic mb-6 leading-relaxed">
                "{project.testimonial_quote}"
              </p>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">— {project.testimonial_author}</div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="w-full max-w-5xl bg-zinc-900 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
                  {lightboxPhoto.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {lightboxPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[62vh] p-2">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                className="max-h-[60vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-2xl"
              />
            </div>

            <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
                  <Tag className="w-3.5 h-3.5" /> {lightboxPhoto.bannerText}
                </div>
                <span className="text-xs font-mono text-zinc-400 font-bold">
                  {lightboxPhoto.highlights}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation CTA */}
      <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Work Portfolio
        </Link>
        <Link
          to="/request-quote"
          className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
        >
          Plan Your Next Event <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
