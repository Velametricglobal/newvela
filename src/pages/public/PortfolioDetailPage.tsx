import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortfolioProject } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { ChevronRight, ExternalLink, Globe, Quote, ShieldCheck, Film, ArrowRight } from 'lucide-react';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
import { DapflixCinemaSlider } from '../../components/public/DapflixCinemaSlider';

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="py-16 max-w-[1280px] mx-auto px-6 font-sans space-y-12 selection:bg-amber-400 selection:text-black">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
        <Link to="/portfolio" className="hover:text-white">Portfolio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-200">{project.title}</span>
      </div>

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

        {/* Live URL Action Button */}
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

      {/* Main Showcase Stage: Cinema Slider for Video Projects OR Static Cover for Web */}
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

      {/* Challenge vs Solution vs Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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

      {/* Client Quote */}
      {project.testimonial_quote && (
        <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl relative mb-16">
          <Quote className="w-12 h-12 text-zinc-800 absolute top-6 right-8" />
          <p className="text-xl sm:text-2xl font-medium text-white italic mb-6 leading-relaxed">
            "{project.testimonial_quote}"
          </p>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">— {project.testimonial_author}</div>
        </div>
      )}
    </div>
  );
};
