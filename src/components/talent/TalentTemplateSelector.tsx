import React, { useState, useMemo } from 'react';
import {
  Sparkles, Check, Eye, Smartphone, Monitor, Search, Filter,
  Star, ChevronRight, X, ArrowLeft, ArrowRight, CheckCircle2,
  Crown, Play, Film, Image as ImageIcon, Briefcase, MapPin,
  ExternalLink, Globe, Instagram, Youtube, Award, Sliders,
  ThumbsUp, ShieldCheck, Zap, Lock, Palette, CheckCheck
} from 'lucide-react';
import type {
  TalentProfile, PortfolioTemplateId, PortfolioTemplateDefinition,
  TemplatePrimaryGroup, TemplateDesignStyle, TemplatePortfolioType
} from '../../types/talent.types';
import {
  TALENT_PORTFOLIO_TEMPLATES, TALENT_CATEGORIES, CATEGORY_LABEL_MAP
} from '../../types/talent.types';

// ── Props Interface ──────────────────────────────────────────────────────────
export interface TalentTemplateSelectorProps {
  currentTalent?: Partial<TalentProfile> | null;
  selectedTemplateId?: PortfolioTemplateId;
  onSelectTemplate: (templateId: PortfolioTemplateId) => void;
  onCancel?: () => void;
  isWizardStep?: boolean;
  onProceedNext?: () => void;
}

// ── Smart Category Group Mapping ─────────────────────────────────────────────
const GROUP_OPTIONS: { id: TemplatePrimaryGroup | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Showcase Styles', icon: '✨' },
  { id: 'entertainment', label: 'Entertainment & Screen', icon: '🎭' },
  { id: 'creative', label: 'Creative, Arts & Media', icon: '🎨' },
  { id: 'professional', label: 'Executive & Speaking', icon: '💼' },
  { id: 'digital-tech', label: 'Digital, Tech & Design', icon: '💻' },
];

const STYLE_OPTIONS: (TemplateDesignStyle | 'All')[] = [
  'All', 'Editorial', 'Cinematic', 'Creative', 'Minimal', 'Professional', 'Bold'
];

const TYPE_OPTIONS: (TemplatePortfolioType | 'All')[] = [
  'All', 'Profile-focused', 'Video-focused', 'Gallery-focused', 'Resume/CV-focused', 'Social-media-focused', 'Personal-brand-focused'
];

export const TalentTemplateSelector: React.FC<TalentTemplateSelectorProps> = ({
  currentTalent,
  selectedTemplateId = 'editorial-vogue',
  onSelectTemplate,
  onCancel,
  isWizardStep = false,
  onProceedNext
}) => {
  // Filters & State
  const [activeGroup, setActiveGroup] = useState<TemplatePrimaryGroup | 'all'>('all');
  const [activeStyle, setActiveStyle] = useState<TemplateDesignStyle | 'All'>('All');
  const [activeType, setActiveType] = useState<TemplatePortfolioType | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection & Confirmation State
  const [chosenTemplateId, setChosenTemplateId] = useState<PortfolioTemplateId>(selectedTemplateId);
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplateDefinition | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [confirmModalTmpl, setConfirmModalTmpl] = useState<PortfolioTemplateDefinition | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Derive Talent Category for Recommendations
  const talentCategory = currentTalent?.category || 'model';

  // Smart Recommendation Match Score Engine
  const getMatchScore = (template: PortfolioTemplateDefinition): { score: number; isRecommended: boolean; reason: string } => {
    let score = 70;
    const catLabel = CATEGORY_LABEL_MAP[talentCategory as keyof typeof CATEGORY_LABEL_MAP] || talentCategory;

    if (template.bestFor.some(b => b.toLowerCase() === catLabel.toLowerCase() || b.toLowerCase() === talentCategory.toLowerCase())) {
      score += 25;
    }
    if (template.professions.some(p => p.toLowerCase().includes(catLabel.toLowerCase()) || (currentTalent?.title && p.toLowerCase().includes(currentTalent.title.toLowerCase())))) {
      score += 10;
    }
    if (template.isFeatured) score += 5;

    const isRecommended = score >= 85;
    const reason = `Optimized for ${catLabel} & visual media presentation`;

    return { score: Math.min(score, 99), isRecommended, reason };
  };

  // Filter & Sort Templates
  const filteredTemplates = useMemo(() => {
    return TALENT_PORTFOLIO_TEMPLATES.filter(tmpl => {
      // Group Filter
      if (activeGroup !== 'all' && tmpl.primaryGroup !== activeGroup) return false;
      // Style Filter
      if (activeStyle !== 'All' && tmpl.designStyle !== activeStyle) return false;
      // Type Filter
      if (activeType !== 'All' && tmpl.portfolioType !== activeType) return false;
      // Tier Filter
      if (tierFilter !== 'all' && tmpl.tier !== tierFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tmpl.name.toLowerCase().includes(q);
        const matchTag = tmpl.tagline.toLowerCase().includes(q);
        const matchBest = tmpl.bestFor.some(b => b.toLowerCase().includes(q));
        const matchProf = tmpl.professions.some(p => p.toLowerCase().includes(q));
        if (!matchName && !matchTag && !matchBest && !matchProf) return false;
      }
      return true;
    });
  }, [activeGroup, activeStyle, activeType, tierFilter, searchQuery]);

  // Split into Recommended vs Explore All
  const recommendedList = useMemo(() => {
    return filteredTemplates.filter(t => getMatchScore(t).isRecommended);
  }, [filteredTemplates, talentCategory]);

  const exploreList = useMemo(() => {
    return filteredTemplates.filter(t => !getMatchScore(t).isRecommended);
  }, [filteredTemplates, talentCategory]);

  // Handle Template Confirmation
  const handleApplyTemplate = (tmpl: PortfolioTemplateDefinition) => {
    setChosenTemplateId(tmpl.id);
    onSelectTemplate(tmpl.id);
    setConfirmModalTmpl(null);
    setPreviewTemplate(null);
    setSuccessToast(`Template "${tmpl.name}" applied successfully!`);
    setTimeout(() => {
      setSuccessToast(null);
      if (isWizardStep && onProceedNext) {
        onProceedNext();
      }
    }, 1200);
  };

  return (
    <div className="space-y-8">
      
      {/* ── Success Toast ── */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-6 py-3.5 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-top duration-200">
          <CheckCheck size={20} />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Header Banner ── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold rounded-full">
              <Sparkles size={13} />
              <span>Velametric Showcase Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Choose Your Talent Showcase Style
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Select a signature portfolio design that matches your talent, personality, and career goals. You can change your template anytime without losing your profile content.
            </p>
          </div>

          {currentTalent && (
            <div className="flex items-center gap-3 p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl shrink-0">
              <img
                src={currentTalent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={currentTalent.displayName || 'Creator'}
                className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
              />
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[140px]">
                  {currentTalent.displayName || 'Your Profile'}
                </div>
                <div className="text-[11px] text-amber-400 capitalize font-mono">
                  {currentTalent.category || 'Creative'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Category & Filter Bar ── */}
      <div className="space-y-4">
        {/* Primary Industry Group Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {GROUP_OPTIONS.map(grp => (
            <button
              key={grp.id}
              onClick={() => setActiveGroup(grp.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeGroup === grp.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 scale-[1.02]'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{grp.icon}</span>
              <span>{grp.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Search + Style + Type + Tier */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search templates (e.g. Actor, Cinematic, Minimal, Photo)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Design Style Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={activeStyle}
              onChange={e => setActiveStyle(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-blue-500 capitalize"
            >
              {STYLE_OPTIONS.map(st => (
                <option key={st} value={st}>Style: {st}</option>
              ))}
            </select>
          </div>

          {/* Portfolio Type Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={activeType}
              onChange={e => setActiveType(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-blue-500 capitalize"
            >
              {TYPE_OPTIONS.map(tp => (
                <option key={tp} value={tp}>Focus: {tp}</option>
              ))}
            </select>
          </div>

          {/* Tier Buttons */}
          <div className="lg:col-span-2 flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setTierFilter('all')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                tierFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTierFilter('free')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                tierFilter === 'free' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setTierFilter('pro')}
              className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                tierFilter === 'pro' ? 'bg-amber-400 text-zinc-950 font-black' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              PRO
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: RECOMMENDED FOR YOU (If Any) ── */}
      {recommendedList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Recommended for You</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 rounded-full">
                  ★ Tailored for {CATEGORY_LABEL_MAP[talentCategory as keyof typeof CATEGORY_LABEL_MAP] || talentCategory}
                </span>
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {recommendedList.length} Top Matches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedList.map(tmpl => {
              const isCurrent = chosenTemplateId === tmpl.id;
              const match = getMatchScore(tmpl);
              return (
                <div
                  key={tmpl.id}
                  className={`group relative bg-zinc-900/90 border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                    isCurrent
                      ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-blue-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Top Recommended Ribbon */}
                  <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                      <Star size={11} className="fill-zinc-950" /> {match.score}% MATCH
                    </span>
                    {tmpl.tier === 'pro' ? (
                      <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-mono font-black uppercase rounded-full shadow-md flex items-center gap-1">
                        <Crown size={11} /> PRO
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-500 text-zinc-950 text-[10px] font-mono font-black uppercase rounded-full shadow-md">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Active Selected Stamp */}
                  {isCurrent && (
                    <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1">
                      <CheckCircle2 size={12} /> ACTIVE
                    </div>
                  )}

                  {/* Card Visual Preview Thumbnail */}
                  <div
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="relative aspect-[16/10] overflow-hidden bg-zinc-950 cursor-pointer"
                  >
                    <img
                      src={tmpl.previewImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <button className="px-5 py-2.5 bg-white text-zinc-950 font-black text-xs rounded-xl shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                        <Eye size={15} /> Preview Template
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        {tmpl.badge}
                      </span>
                      <h4 className="text-white font-black text-lg truncate">{tmpl.name}</h4>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">
                        {tmpl.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Best For:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {tmpl.bestFor.map((b, i) => (
                            <span key={i} className="px-2 py-0.5 bg-zinc-950 text-zinc-300 text-[10px] font-semibold rounded-lg border border-zinc-800">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star size={12} className="fill-amber-400" /> {tmpl.rating} ({tmpl.reviewsCount})
                        </span>
                        <span className="capitalize text-zinc-400">{tmpl.designStyle} Style</span>
                      </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPreviewTemplate(tmpl)}
                        className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye size={13} /> Preview
                      </button>
                      <button
                        onClick={() => setConfirmModalTmpl(tmpl)}
                        className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/15'
                        }`}
                      >
                        {isCurrent ? 'Current' : 'Use Template'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 2: EXPLORE ALL TEMPLATES ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Explore All Templates</span>
            <span className="text-xs font-mono font-normal text-zinc-400">
              ({filteredTemplates.length} Available)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(tmpl => {
            const isCurrent = chosenTemplateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                className={`group relative bg-zinc-900/90 border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-blue-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
                  {tmpl.tier === 'pro' ? (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-mono font-black uppercase rounded-full shadow-md flex items-center gap-1">
                      <Crown size={11} /> PRO
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-500 text-zinc-950 text-[10px] font-mono font-black uppercase rounded-full shadow-md">
                      FREE
                    </span>
                  )}
                  <span className="px-2.5 py-1 bg-zinc-950/80 backdrop-blur-md text-zinc-300 text-[10px] font-mono rounded-full border border-zinc-700">
                    {tmpl.designStyle}
                  </span>
                </div>

                {isCurrent && (
                  <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1">
                    <CheckCircle2 size={12} /> ACTIVE
                  </div>
                )}

                {/* Card Visual Preview Thumbnail */}
                <div
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="relative aspect-[16/10] overflow-hidden bg-zinc-950 cursor-pointer"
                >
                  <img
                    src={tmpl.previewImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button className="px-5 py-2.5 bg-white text-zinc-950 font-black text-xs rounded-xl shadow-2xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                      <Eye size={15} /> Preview Template
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                      {tmpl.badge}
                    </span>
                    <h4 className="text-white font-black text-lg truncate">{tmpl.name}</h4>
                  </div>
                </div>

                {/* Body Specs */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Target Professions:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {tmpl.professions.slice(0, 3).map((p, i) => (
                          <span key={i} className="px-2 py-0.5 bg-zinc-950 text-zinc-300 text-[10px] font-semibold rounded-lg border border-zinc-800">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star size={12} className="fill-amber-400" /> {tmpl.rating} ({tmpl.reviewsCount})
                      </span>
                      <span className="text-zinc-400 font-mono text-[10px] uppercase">{tmpl.layoutType}</span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} /> Preview
                    </button>
                    <button
                      onClick={() => setConfirmModalTmpl(tmpl)}
                      className={`py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/15'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Use Template'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── INTERACTIVE LIVE PREVIEW MODAL (DESKTOP & MOBILE FRAMES) ── */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl max-h-[94vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Top Control Bar */}
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft size={15} /> Back to Templates
                </button>
                <div className="hidden sm:block">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {previewTemplate.badge}
                  </span>
                  <h3 className="text-white font-black text-base">{previewTemplate.name}</h3>
                </div>
              </div>

              {/* Desktop vs Mobile Toggle */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    previewDevice === 'desktop'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor size={14} />
                  <span>Desktop Preview</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    previewDevice === 'mobile'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Mobile Preview</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApplyTemplate(previewTemplate)}
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
                >
                  <Check size={14} /> Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Live Presentation Canvas */}
            <div className="flex-1 overflow-y-auto bg-zinc-950/90 p-4 sm:p-8 flex justify-center items-start">
              
              {/* Dynamic Device Wrapper */}
              <div className={`transition-all duration-300 w-full ${
                previewDevice === 'mobile'
                  ? 'max-w-sm bg-black border-[8px] border-zinc-800 rounded-[44px] shadow-2xl p-4 overflow-hidden ring-1 ring-zinc-700 my-4'
                  : 'max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl'
              }`}>
                
                {/* Simulated Showcase Content (Binding Live Talent Data OR Demo Defaults) */}
                <div className="space-y-6 text-slate-100 antialiased font-sans">
                  
                  {/* Hero Panoramic Cover */}
                  <div className="relative h-44 sm:h-64 w-full bg-zinc-900 overflow-hidden">
                    <img
                      src={currentTalent?.coverImage || previewTemplate.previewImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  </div>

                  {/* Header Identity Card */}
                  <div className="px-4 sm:px-8 relative -mt-16 sm:-mt-20 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div className="flex items-end gap-3.5">
                        <img
                          src={currentTalent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                          alt={currentTalent?.displayName || 'Creator'}
                          className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-4 border-zinc-950 shadow-2xl ring-2 ring-blue-500/50"
                        />
                        <div className="space-y-1 pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">
                              {previewTemplate.name}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                              ● Available
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                            {currentTalent?.displayName || 'Alex Morgan'}
                          </h2>
                          <p className="text-xs sm:text-sm text-zinc-300 font-bold">
                            {currentTalent?.title || previewTemplate.demoData.headline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
                          Follow
                        </button>
                        <button className="flex-1 sm:flex-none px-5 py-2 bg-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-md">
                          Hire Me
                        </button>
                      </div>
                    </div>

                    {/* Stats Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800 text-center">
                      <div className="p-2 bg-zinc-900/60 rounded-xl">
                        <div className="text-base font-black text-white">{previewTemplate.demoData.stat1.value}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">{previewTemplate.demoData.stat1.label}</div>
                      </div>
                      <div className="p-2 bg-zinc-900/60 rounded-xl">
                        <div className="text-base font-black text-blue-400">{previewTemplate.demoData.stat2.value}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">{previewTemplate.demoData.stat2.label}</div>
                      </div>
                      <div className="p-2 bg-zinc-900/60 rounded-xl">
                        <div className="text-base font-black text-amber-400">
                          {currentTalent?.dayRate ? `₹${currentTalent.dayRate}/day` : '₹25,000/day'}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">Day Rate</div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        About & Biography
                      </h4>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {currentTalent?.bio || previewTemplate.demoData.sampleBio}
                      </p>
                    </div>

                    {/* Specialties / Tags */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Core Disciplines
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {previewTemplate.demoData.specialties.map((sp, i) => (
                          <span key={i} className="px-2.5 py-1 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800">
                            ⚡ {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Showcase Media Grid */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white">Featured Portfolio Showcase</h4>
                        <span className="text-[11px] text-zinc-500 font-mono">Curated Collection</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(currentTalent?.media && currentTalent.media.length > 0
                          ? currentTalent.media.slice(0, 3)
                          : [
                              { id: '1', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600', title: 'Editorial Spread' },
                              { id: '2', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', title: 'Commercial Campaign' },
                              { id: '3', url: 'https://images.unsplash.com/photo-1529139574466-a303027614a8?w=600', title: 'Lookbook Shoot' },
                            ]
                        ).map((m: any, idx: number) => (
                          <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                            <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                              <span className="text-white text-[11px] font-bold truncate">{m.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Bottom CTA */}
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2 my-4">
                      <h4 className="text-white font-bold text-sm">Ready to Collaborate?</h4>
                      <p className="text-zinc-400 text-xs">Direct booking requests dispatched instantly.</p>
                      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md">
                        Send Project Brief
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold transition-colors"
              >
                ← Back to Gallery
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  Style: <strong className="text-white">{previewTemplate.name}</strong> ({previewTemplate.layoutType})
                </span>
                <button
                  onClick={() => handleApplyTemplate(previewTemplate)}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
                >
                  <Check size={14} /> Use This Template
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {confirmModalTmpl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <Palette size={26} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white">Use {confirmModalTmpl.name}?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                This template design will be applied to your public Talent Showcase. All your profile information, media, videos, packages, and skills are preserved safely and can be changed anytime.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center gap-3">
              <img
                src={confirmModalTmpl.previewImage}
                alt={confirmModalTmpl.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{confirmModalTmpl.name}</div>
                <div className="text-[11px] text-amber-400 capitalize">{confirmModalTmpl.designStyle} &bull; {confirmModalTmpl.layoutType}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalTmpl(null)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(confirmModalTmpl)}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-400/20"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
