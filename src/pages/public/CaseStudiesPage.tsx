import React, { useEffect, useState } from 'react';
import { CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, TrendingUp, Phone, Eye, Smartphone, Search, 
  Star, MapPin, ArrowRight, Calendar, Sparkles, CheckCircle2, 
  ShieldCheck, Maximize2, X, BarChart3, LineChart
} from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track active chart index per case study { [caseStudyId]: number }
  const [activeChartIndices, setActiveChartIndices] = useState<Record<string, number>>({});
  
  // Lightbox Zoom Modal State
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    const loadCaseStudies = () => {
      portfolioService.getCaseStudies().then((res) => {
        setCaseStudies(res);
        // Initialize active chart index to 0 for each case study
        const initialIndices: Record<string, number> = {};
        res.forEach(cs => {
          initialIndices[cs.id] = 0;
        });
        setActiveChartIndices(initialIndices);
        setLoading(false);
      });
    };

    loadCaseStudies();

    window.addEventListener('velametric_portfolio_updated', loadCaseStudies);
    window.addEventListener('storage', loadCaseStudies);
    window.addEventListener('focus', loadCaseStudies);

    return () => {
      window.removeEventListener('velametric_portfolio_updated', loadCaseStudies);
      window.removeEventListener('storage', loadCaseStudies);
      window.removeEventListener('focus', loadCaseStudies);
    };
  }, []);

  const handleSelectChart = (caseStudyId: string, chartIndex: number) => {
    setActiveChartIndices(prev => ({
      ...prev,
      [caseStudyId]: chartIndex
    }));
  };

  return (
    <div className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      
      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white font-display">
                  {zoomImage.title}
                </h4>
                {zoomImage.subtitle && (
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    {zoomImage.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-zinc-950 rounded-2xl p-2 sm:p-4 border border-zinc-800/80">
              <img 
                src={zoomImage.url} 
                alt={zoomImage.title} 
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl" 
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
              <span className="flex items-center gap-1.5 text-amber-400">
                <ShieldCheck className="w-4 h-4" /> Official Google Business Profile Data
              </span>
              <span>Click outside or press X to close</span>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Proven Client Impact & Volumetric Growth</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-[1.15]">
          Transforming Local Search into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Sustained Revenue</span>
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
          We do not just aim for temporary traffic spikes; we partner with businesses for years to build dominant, unshakeable local market authority. When our clients trust us with their digital presence, the results speak for themselves: sustained volumetric growth, massive increases in organic visibility, and a consistent pipeline of high-quality leads.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Multi-Year Client Partnerships
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> 100% Organic Local Intent
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Google Map Pack Dominance
          </span>
        </div>
      </div>

      {/* Case Studies Detailed Cards */}
      <div className="space-y-12 sm:space-y-16">
        {caseStudies.map((cs, idx) => {
          const currentChartIndex = activeChartIndices[cs.id] || 0;
          const chartsList = cs.charts || [];
          const activeChart = chartsList[currentChartIndex] || null;

          return (
            <div 
              key={cs.id}
              className="bg-zinc-900/70 border border-zinc-800/90 hover:border-zinc-700/90 transition-all rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden group"
            >
              {/* Subtle Ambient Background Gradient */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
                
                {/* Left Content Column */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Client Badge & Meta */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border border-zinc-700/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {cs.client}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      CASE STUDY #{idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                    {cs.title}
                  </h2>

                  {/* Objective Section */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1.5">
                      THE OBJECTIVE
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                      {cs.challenge}
                    </p>
                  </div>

                  {/* Impact & Volumetric Growth Breakdown */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                      THE IMPACT (VOLUMETRIC GROWTH)
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {cs.solution}
                    </p>
                  </div>

                  {/* Key Performance Metrics Grid */}
                  {cs.metrics && cs.metrics.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                        KEY PERFORMANCE METRICS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/90 border border-zinc-800/90 p-4 rounded-2xl">
                        {cs.metrics.map((m) => (
                          <div key={m.id} className="text-center p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                            <div className="text-lg sm:text-2xl font-black text-amber-400 font-mono">
                              {m.prefix}{m.value}{m.suffix}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-zinc-400 font-medium mt-0.5 line-clamp-1">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results Highlights */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      PERFORMANCE OUTCOMES
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-amber-400/5 border border-amber-400/15 p-4 rounded-2xl">
                      {cs.results}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3.5">
                    <Link
                      to={`/case-studies/${cs.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-md"
                    >
                      Read In-Depth Analysis <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/book-consultation"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors border border-zinc-700/60"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Book Strategy Call
                    </Link>
                  </div>
                </div>

                {/* Right Visual & Interactive Charts Column */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Chart Switcher Navigation Tabs */}
                  {chartsList.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                          VERIFIED GOOGLE ANALYTICS PROOF
                        </span>
                        <span className="text-[11px] text-amber-400 font-medium">
                          {chartsList.length} Verified Charts
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {chartsList.map((ch, chIdx) => {
                          const isSelected = chIdx === currentChartIndex;
                          return (
                            <button
                              key={chIdx}
                              type="button"
                              onClick={() => handleSelectChart(cs.id, chIdx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                isSelected
                                  ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20'
                                  : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 border-zinc-800'
                              }`}
                            >
                              {ch.type === 'searches' ? <Search className="w-3.5 h-3.5" /> : ch.type === 'profile' ? <ShieldCheck className="w-3.5 h-3.5" /> : <LineChart className="w-3.5 h-3.5" />}
                              <span className="truncate max-w-[170px] sm:max-w-none">
                                {ch.type === 'interactions' ? '1. Volumetric Curve' : ch.type === 'searches' ? '2. Searches & Devices' : '3. Google Profile'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Active Chart Display Box with Click-to-Zoom */}
                  <div 
                    onClick={() => {
                      const imgToZoom = activeChart?.image_url || cs.featured_image || '/images/services/service_digital_mktg.jpg';
                      setZoomImage({
                        url: imgToZoom,
                        title: activeChart?.title || cs.title || 'Chart Analysis',
                        subtitle: activeChart?.subtitle
                      });
                    }}
                    className="group/img rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl relative cursor-pointer hover:border-amber-400/60 transition-all"
                  >
                    <div className="relative">
                      <img 
                        src={activeChart?.image_url || cs.featured_image || '/images/services/service_digital_mktg.jpg'} 
                        alt={activeChart?.title || cs.title} 
                        className="w-full h-72 sm:h-96 object-contain bg-zinc-950 p-2 transform group-hover/img:scale-[1.02] transition-transform duration-300" 
                      />

                      {/* Click To Zoom Overlay Badge */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 border border-zinc-700 text-[11px] font-mono flex items-center gap-1 opacity-90 group-hover/img:opacity-100 group-hover/img:bg-amber-400 group-hover/img:text-black transition-all">
                        <Maximize2 className="w-3.5 h-3.5" /> Click to Zoom
                      </div>
                    </div>

                    {/* Chart Description Strip */}
                    {activeChart && (
                      <div className="p-3.5 bg-zinc-900/95 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate font-display">
                            {activeChart.title}
                          </div>
                          {activeChart.subtitle && (
                            <div className="text-[11px] text-amber-400 font-mono truncate mt-0.5">
                              {activeChart.subtitle}
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                          Google Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Client Testimonial Quote */}
                  {cs.testimonial_quote && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {"★".repeat(5)}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                        "{cs.testimonial_quote}"
                      </p>
                      {cs.testimonial_author && (
                        <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/60">
                          &mdash; {cs.testimonial_author}
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion CTA Banner */}
      <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase">
          <TrendingUp className="w-3.5 h-3.5" /> Start Your Local Dominance Journey
        </div>

        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display max-w-2xl mx-auto">
          Ready to experience this kind of sustained growth and a continuous surge in organic leads?
        </h3>

        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Connect with our team today to discuss a long-term local SEO strategy tailored to dominate your specific market and turn map searches into revenue.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/book-consultation"
            className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl shadow-amber-400/20 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Free Strategy Call
          </Link>
          <Link
            to="/request-quote"
            className="px-7 py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-extrabold uppercase tracking-wider transition-all border border-zinc-700/80 flex items-center gap-2"
          >
            Get Custom Proposal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
