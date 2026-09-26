import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { 
  ChevronRight, ArrowRight, TrendingUp, Calendar, MapPin, 
  Sparkles, CheckCircle2, Star, ShieldCheck, ArrowLeft,
  BarChart3, LineChart, Search, Maximize2, X
} from 'lucide-react';

export const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    const loadDetail = () => {
      if (slug) {
        portfolioService.getCaseStudyBySlug(slug).then((res) => {
          setCs(res);
          setLoading(false);
        });
      }
    };

    loadDetail();

    window.addEventListener('velametric_portfolio_updated', loadDetail);
    window.addEventListener('storage', loadDetail);
    window.addEventListener('focus', loadDetail);

    return () => {
      window.removeEventListener('velametric_portfolio_updated', loadDetail);
      window.removeEventListener('storage', loadDetail);
      window.removeEventListener('focus', loadDetail);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Case Study Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">The requested client impact study does not exist or has been moved.</p>
        <Link 
          to="/case-studies" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Case Studies
        </Link>
      </div>
    );
  }

  const chartsList = cs.charts || [];
  const activeChart = chartsList[selectedChartIndex] || (chartsList.length > 0 ? chartsList[0] : null);

  return (
    <div className="py-16 sm:py-24 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Lightbox Modal for High-Res Chart View */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
              <div>
                <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  {zoomImage.title}
                </h4>
                {zoomImage.subtitle && (
                  <p className="text-xs text-amber-400 font-mono mt-0.5">{zoomImage.subtitle}</p>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => setZoomImage(null)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-zinc-950/80">
              <img 
                src={zoomImage.url} 
                alt={zoomImage.title} 
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-zinc-800"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>Verified Google Analytics & Business Profile Evidence</span>
              <button 
                type="button" 
                onClick={() => setZoomImage(null)}
                className="text-amber-400 hover:underline"
              >
                Press anywhere or click to close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 truncate max-w-xs">{cs.client}</span>
      </div>

      {/* Case Study Header Block */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> Client: {cs.client}
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-mono text-xs">
            Organic Local SEO Authority
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-[1.15]">
          {cs.title}
        </h1>

        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          Detailed breakdown of long-term local SEO optimization, mobile search capture, and sustained volumetric growth engineered by Velametric.
        </p>
      </div>

      {/* Featured Metric Cards Grid */}
      {cs.metrics && cs.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-900/80 border border-zinc-800/90 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          {cs.metrics.map((m) => (
            <div key={m.id} className="text-center p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60">
              <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
                {m.prefix}{m.value}{m.suffix}
              </div>
              <div className="text-xs font-semibold text-zinc-400 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Verified Google Analytics Charts Showcase Section */}
      {chartsList.length > 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" /> Authentic Google Business Verification
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                Visual Analytics & Live Search Data Proof
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
                {chartsList.length} Live Datasets
              </span>
            </div>
          </div>

          {/* Interactive Chart Selector Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {chartsList.map((ch, idx) => {
              const isSelected = idx === selectedChartIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedChartIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20'
                      : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 border-zinc-800'
                  }`}
                >
                  {ch.type === 'searches' ? <Search className="w-3.5 h-3.5" /> : ch.type === 'profile' ? <ShieldCheck className="w-3.5 h-3.5" /> : <LineChart className="w-3.5 h-3.5" />}
                  <span>{ch.title}</span>
                </button>
              );
            })}
          </div>

          {/* Displayed Chart with Zoom Trigger */}
          <div 
            onClick={() => {
              if (activeChart) {
                setZoomImage({
                  url: activeChart.image_url,
                  title: activeChart.title,
                  subtitle: activeChart.subtitle
                });
              }
            }}
            className="group/img rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative cursor-pointer hover:border-amber-400/60 transition-all"
          >
            <div className="relative p-3 sm:p-6 flex items-center justify-center min-h-[350px] sm:min-h-[480px]">
              <img 
                src={activeChart?.image_url || cs.featured_image} 
                alt={activeChart?.title || cs.title} 
                className="max-h-[500px] w-auto object-contain rounded-lg transform group-hover/img:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-amber-300 border border-zinc-700 text-xs font-mono flex items-center gap-1.5 opacity-90 group-hover/img:opacity-100 group-hover/img:bg-amber-400 group-hover/img:text-black transition-all">
                <Maximize2 className="w-4 h-4" /> Click to Expand Full View
              </div>
            </div>

            {activeChart && (
              <div className="p-4 sm:p-5 bg-zinc-900/90 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-white font-display">
                    {activeChart.title}
                  </div>
                  {activeChart.subtitle && (
                    <div className="text-xs text-amber-400 font-mono mt-0.5">
                      {activeChart.subtitle}
                    </div>
                  )}
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-700/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Google Business Verified
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deep-Dive Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10 text-zinc-300">
          
          {/* Section 1: The Objective */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> The Objective
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Target Scope & Market Challenge
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200">
              {cs.challenge}
            </p>
          </div>

          {/* Section 2: The Impact (Volumetric Growth) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" /> The Impact & Volumetric Growth
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Compounding Trajectory & Engagement Surges
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
              {cs.solution}
            </p>
          </div>

          {/* Section 3: Key Performance Metrics & Keywords */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" /> Key Performance Outcomes
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Measurable Organic Results & Keyword Mastery
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
              {cs.results}
            </p>
          </div>

        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Client Testimonial Card */}
          {cs.testimonial_quote && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-400/20 shadow-xl space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {"★".repeat(5)}
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                "{cs.testimonial_quote}"
              </p>
              {cs.testimonial_author && (
                <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-zinc-800/80">
                  {cs.testimonial_author}
                </div>
              )}
            </div>
          )}

          {/* In-Depth Blog Editorial Story Banner */}
          {cs.slug === 'doon-home-care-services-dehradun' && (
            <Link
              to="/blog/dhcs-growth-story-dehradun"
              className="p-6 rounded-3xl bg-gradient-to-br from-amber-400/10 via-zinc-900 to-black border border-amber-400/30 hover:border-amber-400 block transition-all group shadow-xl"
            >
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-amber-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Featured Growth Story
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-display mb-1">
                Read Full Story: From Local Service to Trusted Healthcare Brand
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                How Amit Rana scaled DHCS to 200+ monthly patient inquiries with dedicated photos and digital hospital blueprint.
              </p>
              <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Full Blog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}

          {/* Booking / CTA Box */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 text-center space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Ready to Dominate Your Local Market?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Schedule a strategy audit to unlock sustained volumetric organic growth for your business.
            </p>
            <div className="space-y-2 pt-2">
              <Link
                to="/book-consultation"
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider block transition-transform hover:scale-105"
              >
                Book Free Consultant Call
              </Link>
              <Link
                to="/request-quote"
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider block transition-colors border border-zinc-700/60"
              >
                Request Custom Proposal
              </Link>
            </div>
          </div>

          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors pl-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Case Studies
          </Link>

        </div>

      </div>

    </div>
  );
};
