import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Service, ServicePackage } from '../../types/database.types';
import { serviceService } from '../../services/serviceService';
import { useSiteSettings } from '../../services/settingsService';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { PackageEnquiryModal } from '../../components/public/PackageEnquiryModal';
import { SaaSProductDemoModal, SaaSProductType } from '../../components/public/SaaSProductDemoModal';
import { useCurrency } from '../../context/CurrencyContext';
import { Laptop, ArrowRight, CheckCircle2, HelpCircle, ChevronRight, Check, X, ShieldCheck, Sparkles, MessageCircle, Phone, FileText, Maximize2, Play } from 'lucide-react';
import { EkraaheeCinemaSlider } from '../../components/public/EkraaheeCinemaSlider';
import { DapflixCinemaSlider } from '../../components/public/DapflixCinemaSlider';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const siteSettings = useSiteSettings();
  const { formatAmount } = useCurrency();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Enquiry Modal State
  const [activeEnquiryPkg, setActiveEnquiryPkg] = useState<ServicePackage | null>(null);
  
  // Full-Size Photo Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // SaaS Demo Modal State
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Production Partner Toggle State
  const [selectedPartner, setSelectedPartner] = useState<'ekraahee' | 'dapflix'>('ekraahee');

  useEffect(() => {
    if (!slug) return;
    const loadService = () => {
      serviceService.getServiceBySlug(slug).then(srv => {
        setService(srv);
        setLoading(false);
      });
    };

    loadService();

    window.addEventListener('velametric_services_updated', loadService);
    window.addEventListener('storage', loadService);
    window.addEventListener('focus', loadService);

    return () => {
      window.removeEventListener('velametric_services_updated', loadService);
      window.removeEventListener('storage', loadService);
      window.removeEventListener('focus', loadService);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Service Not Found</h2>
        <Link to="/services" className="text-amber-400 font-semibold underline">Return to Products & Services</Link>
      </div>
    );
  }

  const startupPkg = service.packages?.find(p => p.tier === 'STARTUP') || service.packages?.[0];
  const enterprisePkg = service.packages?.find(p => p.tier === 'GROWTH' || p.badge === 'Most Popular') || service.packages?.[1] || service.packages?.[0];
  const orgPkg = service.packages?.find(p => p.tier === 'ORGANIZATION' || p.price_display_type === 'CUSTOM_QUOTE' || p.price === 0) || service.packages?.[2];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Breadcrumb & Currency Switcher Bar */}
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link to="/services" className="hover:text-white font-semibold">Products & Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold">{service.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono hidden sm:inline">Pricing Currency:</span>
          <CurrencySelector compact />
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 rounded-3xl backdrop-blur-xl">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono">
            {service.category_name || 'Enterprise Solution'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-display">
            {service.name}
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            {service.full_description || service.short_description}
          </p>

          {service.benefits && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            {(service.slug.includes('education') || service.slug.includes('property') || service.slug.includes('ecommerce') || service.category_id === 'cat-saas') && (
              <button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-black" /> Launch Interactive Demo
              </button>
            )}
            <button
              onClick={() => {
                if (enterprisePkg) setActiveEnquiryPkg(enterprisePkg);
                else if (startupPkg) setActiveEnquiryPkg(startupPkg);
              }}
              className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
            >
              Get Started / Order Package <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${(siteSettings?.contact_whatsapp || siteSettings?.contact_phone || '+918679766348').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${siteSettings?.company_name || 'Velametric'}, I would like to enquire about the ${service.name} package.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-xl"
            >
              <MessageCircle className="w-4 h-4" /> Instant WhatsApp Inquiry
            </a>
          </div>
        </div>

        <div 
          className="lg:col-span-5 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative group cursor-pointer"
          onClick={() => setIsPhotoModalOpen(true)}
        >
          <img 
            src={service.cover_image} 
            alt={service.name} 
            className="w-full h-80 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPhotoModalOpen(true);
            }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group-hover:border-amber-500/50"
            title="View Full Size Photo"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">FULL SIZE</span>
          </button>
        </div>
      </div>

      {/* Package Pricing Tiers */}
      {service.packages && service.packages.length > 0 && (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">SELECT YOUR PACKAGE TIER</span>
            <h2 className="text-3xl font-bold text-white font-display">Standardized Package Pricing</h2>
            <p className="text-zinc-400 text-xs sm:text-sm">Transparent starting packages for Indian startups, growing companies, and large organizations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.packages.map((pkg, idx) => {
              const isCustomQuote = pkg.price_display_type === 'CUSTOM_QUOTE' || Number(pkg.price) === 0 || (pkg as any).is_contact_for_quote || pkg.tier === 'ORGANIZATION';
              const isFeatured = pkg.badge === 'Most Popular' || pkg.tier === 'GROWTH' || (service.packages && service.packages.length === 3 && idx === 1);

              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 border-2 border-amber-500/50 shadow-2xl scale-105 z-10'
                      : isCustomQuote
                      ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 hover:border-amber-400/40 shadow-xl'
                      : 'bg-zinc-900/80 border border-zinc-800'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-wider font-mono shadow-lg">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                        {pkg.tier}
                      </span>
                      <h3 className="text-2xl font-bold text-white font-display">{pkg.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold mt-1">{pkg.target_audience}</p>
                    </div>

                    <div className="py-4 border-y border-zinc-800">
                      {isCustomQuote ? (
                        <div>
                          <div className="text-3xl font-black text-white font-display">Custom Plan</div>
                          <div className="text-xs text-amber-400 font-semibold font-mono mt-1">Contact for Custom Quote</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl font-black text-white font-display">
                            {formatAmount(pkg.price)}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono mt-1">
                            {pkg.price_display_type === 'PER_MONTH' && 'Starting at / Month'}
                            {pkg.price_display_type === 'PER_PROJECT' && 'Starting at / Project'}
                            {pkg.price_display_type === 'PER_CASE' && 'Starting at / Case'}
                            {pkg.price_display_type === 'STARTING_FROM' && 'Starting Price'}
                            {pkg.price_display_type === 'FIXED' && 'Fixed Price Package'}
                            {!pkg.price_display_type && 'Starting Price'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* What's Included */}
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">What's Included:</div>
                      <ul className="space-y-2.5">
                        {pkg.inclusions.map((inc, idxInc) => (
                          <li key={idxInc} className="flex items-start gap-2.5 text-xs text-zinc-300">
                            <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Excluded */}
                    {pkg.exclusions && pkg.exclusions.length > 0 && (
                      <div className="pt-4 border-t border-zinc-800">
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">What's Excluded:</div>
                        <ul className="space-y-1.5">
                          {pkg.exclusions.map((exc, idxExc) => (
                            <li key={idxExc} className="flex items-start gap-2 text-xs text-zinc-400 italic">
                              <X className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 mt-8 border-t border-zinc-800">
                    <button
                      onClick={() => setActiveEnquiryPkg(pkg)}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                        isFeatured
                          ? 'bg-amber-400 hover:bg-amber-300 text-black'
                          : isCustomQuote
                          ? 'bg-amber-400/90 hover:bg-amber-300 text-black'
                          : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {pkg.cta_text || (isCustomQuote ? 'Contact for Custom Plan' : 'Get Started')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Package Comparison Table */}
      {startupPkg && enterprisePkg && orgPkg && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">PACKAGE COMPARISON</span>
            <h3 className="text-2xl font-bold text-white font-display">Side-by-Side Feature Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-4">Feature / Parameter</th>
                  <th className="p-4 text-center">STARTUP</th>
                  <th className="p-4 text-center text-amber-400">ENTERPRISE (POPULAR)</th>
                  <th className="p-4 text-center text-zinc-300">ORGANIZATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="p-4 font-bold text-white">Starting Price</td>
                  <td className="p-4 text-center font-bold text-white">{formatAmount(startupPkg.price)}</td>
                  <td className="p-4 text-center font-bold text-amber-400">{formatAmount(enterprisePkg.price)}</td>
                  <td className="p-4 text-center font-bold text-amber-400">Custom Quotation</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Target Audience</td>
                  <td className="p-4 text-center text-zinc-400">{startupPkg.target_audience}</td>
                  <td className="p-4 text-center text-zinc-300 font-semibold">{enterprisePkg.target_audience}</td>
                  <td className="p-4 text-center text-zinc-300">{orgPkg.target_audience}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Features Scope</td>
                  <td className="p-4 text-center text-zinc-400">Essential Scope</td>
                  <td className="p-4 text-center text-amber-300 font-bold">Advanced Custom Scope</td>
                  <td className="p-4 text-center text-zinc-300 font-bold">Full Enterprise Architecture</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Technical Support</td>
                  <td className="p-4 text-center text-zinc-400">1 Month Basic Support</td>
                  <td className="p-4 text-center text-amber-300 font-semibold">3 Months Dedicated Support</td>
                  <td className="p-4 text-center text-zinc-300 font-bold">24/7 Dedicated SLA Support</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Action CTA</td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(startupPkg)} className="px-4 py-1.5 rounded-xl bg-white text-black font-bold text-[11px]">
                      Get Started
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(enterprisePkg)} className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-bold text-[11px]">
                      Get Started
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(orgPkg)} className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px]">
                      Request Quote
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution Process Steps */}
      {service.process_steps && service.process_steps.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">DELIVERY METHODOLOGY</span>
            <h3 className="text-2xl font-bold text-white font-display">6-Step Execution Process</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process_steps.map((step, idx) => (
              <div key={idx} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2 relative">
                <span className="text-2xl font-black text-amber-400 font-mono opacity-40">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-white font-display">{step.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cinema Video Production Showcase for Video Production Service */}
      {service.slug.includes('video') && (
        <div className="pt-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">VERIFIED STUDIO PARTNERS</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">Our Production Studios in Action</h3>
            <p className="text-xs sm:text-sm text-zinc-400">Explore real client TVCs, 4K aerial cinema, flagship launches, and arena broadcasts produced with our specialized studios.</p>
          </div>

          {/* Dual Studio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 hover:border-amber-400/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono">
                    High-End TVC & Luxury Cinema
                  </span>
                  <img src="/images/partners/ekraahee_films_logo.png" alt="Ekraahee Films" className="h-6 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-white font-display">Ekraahee Films</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Specializing in TV commercials, luxury brand films, multi-camera tech arenas, and Arri/RED master quality color science.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-300">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">100+ Projects</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">4K HDR</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">Arri/RED Cine</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
                <button
                  onClick={() => setSelectedPartner('ekraahee')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPartner === 'ekraahee' ? 'bg-amber-400 text-black font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  View Showcase Below
                </button>
                <Link to="/partners/ekraahee-films" className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                  Dedicated Page <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 hover:border-amber-400/50 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/30 font-mono">
                    Commercials & 4K Drone Cinema
                  </span>
                  <img src="/images/partners/dapflix_logo.png" alt="DAPFLIX Films" className="h-6 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-white font-display">DAPFLIX Films & Production</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "We make videos that people want." Specializing in commercial films, brand storytelling, music videos, and 4K aerial drone expeditions.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-300">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">1,850+ Videos</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">130+ TVCs</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">4K Drones</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
                <button
                  onClick={() => setSelectedPartner('dapflix')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPartner === 'dapflix' ? 'bg-amber-400 text-black font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  View Showcase Below
                </button>
                <Link to="/partners/dapflix" className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                  Dedicated Page <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Active Cinema Stage */}
          <div className="pt-4">
            {selectedPartner === 'dapflix' ? (
              <DapflixCinemaSlider />
            ) : (
              <EkraaheeCinemaSlider />
            )}
          </div>
        </div>
      )}

      {/* Service Disclaimer */}
      {service.disclaimer && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white">Important Service Disclaimer:</div>
            <div>{service.disclaimer}</div>
          </div>
        </div>
      )}

      {/* Interactive Package Enquiry Modal */}
      {activeEnquiryPkg && (
        <PackageEnquiryModal
          service={service}
          packageItem={activeEnquiryPkg}
          isOpen={!!activeEnquiryPkg}
          onClose={() => setActiveEnquiryPkg(null)}
        />
      )}

      {/* Full-Size Photo Lightbox Modal */}
      {isPhotoModalOpen && service.cover_image && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex justify-between items-center border-b border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-white font-bold text-sm sm:text-base font-display">{service.name}</h3>
              </div>
              <button 
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full-Size Image Container */}
            <div className="w-full max-h-[75vh] sm:max-h-[80vh] overflow-auto flex items-center justify-center bg-black/90 p-2 sm:p-4">
              <img 
                src={service.cover_image} 
                alt={service.name} 
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-400">High Resolution Service Photo</span>
              <a 
                href={service.cover_image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                Open Original Image <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SaaS Product Demo Sandbox Modal */}
      {isDemoOpen && (
        <SaaSProductDemoModal
          productType={
            service.slug.includes('education') 
              ? 'education' 
              : service.slug.includes('property') 
              ? 'property-crm' 
              : 'ecommerce'
          }
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
          onOrderPackage={() => {
            if (enterprisePkg) setActiveEnquiryPkg(enterprisePkg);
            else if (startupPkg) setActiveEnquiryPkg(startupPkg);
          }}
        />
      )}
    </div>
  );
};
