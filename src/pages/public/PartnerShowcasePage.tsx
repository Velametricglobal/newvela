import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { portfolioService } from '../../services/portfolioService';
import { ProductionPartner } from '../../types/database.types';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
import { DapflixCinemaSlider } from '../../components/public/DapflixCinemaSlider';
import { 
  Award, 
  CheckCircle2, 
  Globe, 
  Instagram, 
  Film, 
  Video, 
  Camera, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  Share2, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

export const PartnerShowcasePage: React.FC = () => {
  const { partnerSlug } = useParams<{ partnerSlug: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<ProductionPartner | null>(null);
  const [allPartners, setAllPartners] = useState<ProductionPartner[]>([]);

  useEffect(() => {
    const partners = portfolioService.getPartners();
    setAllPartners(partners);

    if (partnerSlug) {
      const resolved = portfolioService.getPartnerBySlug(partnerSlug);
      setPartner(resolved);
    } else if (partners.length > 0) {
      setPartner(partners[0]);
    }
  }, [partnerSlug]);

  if (!partner) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-black text-white font-display">Partner Profile Not Found</h2>
        <p className="text-zinc-400 text-sm">
          Please select one of our verified video production studio partners:
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {allPartners.map((p) => (
            <Link
              key={p.id}
              to={`/partners/${p.slug}`}
              className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:border-amber-400 transition-all flex items-center gap-3"
            >
              <img src={p.logo_url} alt={p.name} className="h-6 w-auto object-contain" />
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const isDapflix = partner.slug === 'dapflix';
  const isEkraahee = partner.slug === 'ekraahee-films';

  return (
    <div className="py-16 max-w-[1280px] mx-auto px-6 font-sans space-y-16 selection:bg-amber-400 selection:text-black">
      {/* 1. BREADCRUMB & PARTNER SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link to="/services/video-production" className="hover:text-white transition-colors">Video Production</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-amber-400 font-bold">{partner.name}</span>
        </div>

        {/* Quick Partner Toggle Tabs */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl self-start sm:self-auto backdrop-blur-md">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 px-3 hidden md:inline">
            Studio Partners:
          </span>
          {allPartners.map((p) => {
            const active = p.slug === partner.slug;
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/partners/${p.slug}`)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PARTNER HERO HEADER */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-black border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-black shadow-lg flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" /> Verified Production Partner
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Global Broadcast SLA Tier 1
                </span>
              </div>

              <div className="flex items-center gap-5 pt-2">
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl shrink-0">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-10 sm:h-14 w-auto object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
                    {partner.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-amber-400 font-bold tracking-wide mt-1">
                    {partner.tagline}
                  </p>
                </div>
              </div>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed pt-2">
                {partner.long_bio || partner.description}
              </p>
            </div>

            {/* Studio Showcase & Commission Card */}
            <div className="lg:w-80 shrink-0 bg-zinc-950/90 border border-zinc-800 p-6 rounded-3xl space-y-5 shadow-2xl backdrop-blur-md">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>Studio Credentials</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="space-y-3">
                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="truncate">Official Studio Website ↗</span>
                  </a>
                )}

                {partner.instagram_url && (
                  <a
                    href={partner.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-400 shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <span>Follow on Instagram ↗</span>
                  </a>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to="/request-quote"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl"
                >
                  Commission This Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Partner Stats Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
            {partner.stats.map((st, i) => (
              <div key={i} className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-850">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                  {st.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono mt-1">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DEDICATED CINEMA STAGE & VIDEO PLAYER */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
              {isDapflix ? 'Official Instagram Reels & Cinema Showcase' : 'Interactive Cinema Showcase'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              {isDapflix ? 'DAPFLIX Instagram Reels & Cinema Work' : `Featured Video Deliverables by ${partner.name}`}
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {isDapflix 
              ? 'Watch in authentic 9:16 phone reel frame or switch to 16:9 cinema'
              : 'Click any filmstrip card to load video in 16:9 master player'}
          </div>
        </div>

        {/* Dynamic Studio Cinema Player */}
        {isDapflix ? (
          <DapflixCinemaSlider hideHeader={true} showFullLink={false} />
        ) : (
          <EkraaheeCinemaSlider hideHeader={true} showFullLink={false} />
        )}
      </div>

      {/* 4. STUDIO CAPABILITIES & GEAR ARSENAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Capabilities Card */}
        <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Specialized Capabilities</h3>
              <p className="text-xs text-zinc-400">Production standards tailored for broadcast and digital viral reach.</p>
            </div>
          </div>

          <div className="space-y-3">
            {partner.capabilities.map((cap, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-850">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-200 font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Cinema Rigs Card */}
        <div className="p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Equipment & Camera Arsenal</h3>
              <p className="text-xs text-zinc-400">Master cine-rigs, 4K drones, and post-production grade suites.</p>
            </div>
          </div>

          <div className="space-y-3">
            {partner.equipment.map((eq, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-850">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-zinc-200 font-medium">{eq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PRODUCTION PROCESS WORKFLOW */}
      <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
            End-To-End Delivery
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
            How {partner.name} Delivers Cinema Masterpieces
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Structured 4-phase cinematic workflow ensuring timely delivery and stunning creative execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Creative Storyboard', desc: 'Concept scriptwriting, mood-boarding, talent casting, and scene-by-scene framing.' },
            { step: '02', title: 'Principal Shooting', desc: 'On-location or studio shooting with certified cine-cameras, 4K drones, and lighting rigs.' },
            { step: '03', title: 'Post & Color Grading', desc: 'Precision editing, Hollywood color science, visual effects, and customized audio scores.' },
            { step: '04', title: 'Broadcast Delivery', desc: 'Final 4K HDR master exports tailored for TV broadcast, YouTube, and viral vertical reels.' }
          ].map((st, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative">
              <span className="text-3xl font-black text-zinc-800 font-display block">
                {st.step}
              </span>
              <h4 className="text-base font-bold text-white">{st.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BOTTOM CTA BAR */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full font-mono">
            Direct Studio Booking
          </span>
          <h3 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
            Ready to produce your next film with {partner.name}?
          </h3>
          <p className="text-sm font-semibold text-black/80">
            Schedule a creative consultation, review location dates, and lock in your production budget today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/request-quote"
            className="px-8 py-4 rounded-full bg-black text-white font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-900 transition-all text-center shadow-xl"
          >
            Request Studio Quote
          </Link>
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-white/30 backdrop-blur-md border border-black/20 text-black font-black text-xs uppercase tracking-wider hover:bg-white/50 transition-all text-center"
          >
            Visit Studio Site ↗
          </a>
        </div>
      </div>
    </div>
  );
};
