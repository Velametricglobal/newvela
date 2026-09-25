import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Star, MapPin, Users, Eye, Heart, Sparkles,
  ChevronRight, ArrowRight, BadgeCheck, Zap, Globe, Play,
  Crown, TrendingUp, Award, Instagram, Youtube, Send, X, CheckCircle2,
  Palette, Film, Sliders, LayoutTemplate, Printer, Download, Smartphone,
  Monitor, Check, Ruler, Layers, Sparkle, Camera, MessageSquare, Briefcase, Lock
} from 'lucide-react';
import { talentService } from '../../services/talentService';
import type {
  TalentProfile, TalentCategory, TalentFilter, PortfolioTemplateDefinition
} from '../../types/talent.types';
import {
  TALENT_CATEGORIES, CATEGORY_LABEL_MAP, TALENT_PORTFOLIO_TEMPLATES
} from '../../types/talent.types';

// ============================================================================
// PROPS INTERFACE
// ============================================================================
export interface TalentPortfolioPageProps {
  defaultCategory?: TalentCategory | 'all';
  defaultTitle?: string;
  isModelFocused?: boolean;
}

// ============================================================================
// COMP CARD (ZED CARD) MODAL COMPONENT
// ============================================================================
interface CompCardModalProps {
  talent: TalentProfile | null;
  onClose: () => void;
  onBook: (talent: TalentProfile) => void;
}

const CompCardModal: React.FC<CompCardModalProps> = ({ talent, onClose, onBook }) => {
  const [compCardSide, setCompCardSide] = useState<'front' | 'back'>('front');
  const navigate = useNavigate();

  if (!talent) return null;

  const measurements = talent.measurements || {
    height: "5'11\" / 180 cm",
    chest: '34"',
    waist: '24"',
    hips: '35"',
    shoeSize: '39 EU',
    eyeColor: 'Hazel',
    hairColor: 'Dark Brown'
  };

  const modelMedia = Array.isArray(talent.media) ? talent.media : [];
  const compCardPhotos = modelMedia.filter(m => m.type === 'image');
  const primaryHeadshot = talent.avatar || talent.coverImage;
  const polaroids = [
    compCardPhotos[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    compCardPhotos[1]?.url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    compCardPhotos[2]?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
    compCardPhotos[3]?.url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop',
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 font-black flex items-center justify-center text-xs font-mono">
              ZED
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Official Agency Composite Card
              </div>
              <h3 className="text-white font-black text-base">{talent.displayName} &bull; Comp Card</h3>
            </div>
          </div>

          {/* Side Switcher & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setCompCardSide('front')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  compCardSide === 'front' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Front Cover
              </button>
              <button
                onClick={() => setCompCardSide('back')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  compCardSide === 'back' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                4-Look Polaroids
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-colors"
              title="Print Comp Card"
            >
              <Printer size={16} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Comp Card Sheet Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-zinc-900 to-zinc-950">
          
          {compCardSide === 'front' ? (
            /* FRONT: Editorial Headshot + Title & Agency Logo */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="md:col-span-7 relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={primaryHeadshot}
                  alt={talent.displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="px-2.5 py-1 bg-amber-400 text-zinc-950 font-black text-xs rounded-lg uppercase tracking-wider">
                      VELAMETRIC ELITE
                    </span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-2">
                      {talent.stageName || talent.displayName}
                    </h2>
                    <p className="text-amber-300 text-xs font-mono">{talent.title}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="border-b border-zinc-800 pb-3 mb-4">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      VELAMETRIC MODEL MANAGEMENT
                    </div>
                    <div className="text-lg font-bold text-white uppercase">Physical Measurements</div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Height</span>
                      <span className="text-white font-black text-sm">{measurements.height || "5'11\""}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Bust / Chest</span>
                      <span className="text-white font-black text-sm">{measurements.chest || '34"'}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Waist</span>
                      <span className="text-white font-black text-sm">{measurements.waist || '24"'}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Hips</span>
                      <span className="text-white font-black text-sm">{measurements.hips || '35"'}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Shoe Size</span>
                      <span className="text-white font-black text-sm">{measurements.shoeSize || '8.5 US / 39 EU'}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Eyes & Hair</span>
                      <span className="text-white font-black text-sm">{measurements.eyeColor || 'Hazel'} &bull; {measurements.hairColor || 'Brown'}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                    <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                      <BadgeCheck size={14} /> Agency Verified Composite
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Measurements verified for Paris, Milan, New York, and Dubai casting submissions.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => { onClose(); onBook(talent); }}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
                  >
                    <Send size={13} /> Option / Book This Model
                  </button>
                  <button
                    onClick={() => { onClose(); navigate(`/talent/${talent.id}`); }}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors"
                  >
                    <span>View Full Public Portfolio & Video Reels</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* BACK: 4-Look Polaroid Casting Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div>
                  <h4 className="text-white font-black text-base uppercase">4-Look Digitals & Casting Polaroids</h4>
                  <p className="text-zinc-400 text-xs">Clean natural lighting casting slates and profile angles</p>
                </div>
                <span className="text-amber-400 text-xs font-mono font-bold">NATURAL LIGHT DIGITALS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {polaroids.map((url, idx) => {
                  const labels = ['Editorial Silhouette', '3/4 Headshot', 'Runway Motion', 'Full Length Slate'];
                  return (
                    <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-2 space-y-2">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 relative">
                        <img 
                          src={url} 
                          alt={`Polaroid ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'; }}
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-zinc-300 rounded-md">
                          0{idx + 1}
                        </span>
                      </div>
                      <div className="text-center pb-1">
                        <span className="text-xs font-bold text-white block truncate">{labels[idx]}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">Agency Polaroid</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Agency Representation & Contact */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 mt-4">
                <div>
                  <div className="text-white font-bold text-xs">{talent.displayName} &bull; Representation</div>
                  <div className="text-zinc-400 text-[11px]">Location: {talent.location} &bull; Direct Agency Booking</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onClose(); onBook(talent); }}
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase"
                  >
                    Send Casting Inquiry
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TEMPLATE LIVE PREVIEW MODAL COMPONENT
// ============================================================================
interface TemplatePreviewModalProps {
  template: PortfolioTemplateDefinition | null;
  onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const navigate = useNavigate();

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-zinc-950 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-zinc-950 rounded-xl font-black">
              <Palette size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-black text-lg">{template.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-extrabold uppercase">
                  {template.badge}
                </span>
              </div>
              <p className="text-zinc-400 text-xs">{template.tagline}</p>
            </div>
          </div>

          {/* Device Switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'desktop' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor size={14} /> <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'mobile' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone size={14} /> <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Workspace */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-zinc-900 to-zinc-950 flex flex-col items-center">
          
          {/* Mock Screen Container */}
          <div className={`transition-all duration-300 w-full ${
            deviceMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
          }`}>
            
            <div className="rounded-3xl border-4 border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
              
              {/* Device Frame Header */}
              <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span>velametric.global/talent/sample</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase">{template.layoutType}</span>
              </div>

              {/* Template Hero Mock */}
              <div className="relative p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-8 space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black uppercase">
                      {template.designStyle} Style &bull; {template.portfolioType}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {template.demoData.headline}
                    </h2>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {template.demoData.sampleBio}
                    </p>
                    
                    {/* Demo Stats */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="p-2.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-center">
                        <div className="text-amber-400 font-bold text-sm">{template.demoData.stat1.value}</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-mono">{template.demoData.stat1.label}</div>
                      </div>
                      <div className="p-2.5 bg-zinc-900/90 rounded-xl border border-zinc-800 text-center">
                        <div className="text-white font-bold text-sm">{template.demoData.stat2.value}</div>
                        <div className="text-[9px] text-zinc-500 uppercase font-mono">{template.demoData.stat2.label}</div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="w-full aspect-[3/4] object-cover rounded-2xl border-2 border-amber-400/40 shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Template Feature Highlights */}
              <div className="p-5 bg-zinc-900/60 border-t border-zinc-800/80 space-y-3">
                <div className="text-xs font-mono font-bold text-zinc-400 uppercase">Included Layout Features:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {template.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link
              to="/talent-register"
              onClick={onClose}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-400/25 transition-all"
            >
              <Zap size={14} /> Apply "{template.name}" To Your Portfolio
            </Link>
            <Link
              to="/talent-dashboard"
              onClick={onClose}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs border border-zinc-700 transition-colors"
            >
              Switch in Talent Dashboard Studio
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DIRECT CONTACT MODAL
// ============================================================================
const CardContactModal: React.FC<{
  talent: TalentProfile | null;
  onClose: () => void;
}> = ({ talent, onClose }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    company: '',
    projectType: 'Haute Couture Campaign',
    budget: '₹50,000 - ₹1,00,000',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!talent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      talentService.createInquiry({
        talentId: talent.id,
        talentName: talent.displayName,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        company: formData.company,
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img 
              src={talent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'} 
              alt={talent.displayName} 
              className="w-10 h-10 rounded-xl object-cover"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'; }}
            />
            <div>
              <h3 className="text-white font-bold text-base">Inquire with {talent.displayName}</h3>
              <p className="text-amber-400 text-xs font-mono">{talent.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={30} />
            </div>
            <h4 className="text-white font-bold text-lg">Opportunity Dispatched!</h4>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto">
              Your inquiry has been sent to {talent.displayName}'s private dashboard.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="px-5 py-2 bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@agency.com"
                  value={formData.senderEmail}
                  onChange={e => setFormData({ ...formData, senderEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Company / Project</label>
                <input
                  type="text"
                  placeholder="Vogue / Netflix"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Budget Range</label>
                <select
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                >
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Project Scope & Casting Details *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe shoot dates, location, deliverables, and usage rights..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white text-xs">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20"
              >
                <Send size={13} /> {isSubmitting ? 'Sending...' : 'Send Casting Opportunity'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TALENT CARD COMPONENT WITH MODEL SPECS & COMP-CARD QUICK VIEW
// ============================================================================
const TalentCard: React.FC<{
  talent: TalentProfile;
  onLike: (id: string) => void;
  onContact: (talent: TalentProfile) => void;
  onOpenCompCard: (talent: TalentProfile) => void;
}> = ({ talent, onLike, onContact, onOpenCompCard }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) { setLiked(true); onLike(talent.id); }
  };

  const catInfo = TALENT_CATEGORIES.find(c => c.value === talent.category);
  const isModel = talent.category === 'model';
  const measurements = talent.measurements;

  return (
    <div
      className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-amber-400/50 transition-all duration-500 cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-400/10 flex flex-col justify-between"
      onClick={() => navigate(`/talent/${talent.id}`)}
    >
      <div>
        {/* Cover Image & Media Preview */}
        <div className="relative h-56 overflow-hidden bg-zinc-950">
          <img
            src={talent.coverImage || talent.avatar}
            alt={talent.displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=400&fit=crop`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {talent.isFeatured && (
              <span className="px-2 py-0.5 bg-amber-400 text-zinc-950 text-[10px] font-black rounded-full flex items-center gap-1 shadow-md">
                <Crown size={10} /> FEATURED
              </span>
            )}
            {talent.isVerified && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md">
                <BadgeCheck size={10} /> VERIFIED
              </span>
            )}
          </div>

          {/* Availability */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              talent.isAvailable ? 'bg-emerald-500 text-white' : 'bg-zinc-800/90 text-zinc-400'
            }`}>
              {talent.isAvailable ? '● Available' : '● Booked'}
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={handleLike}
            className="absolute bottom-3 right-3 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-zinc-700 hover:border-rose-400 transition-all group/like"
          >
            <Heart size={14} className={liked ? 'text-rose-400 fill-rose-400' : 'text-zinc-400 group-hover/like:text-rose-400'} />
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="relative px-5 pb-3">
          <div className="flex items-end gap-3 -mt-9 mb-3">
            <img
              src={talent.avatar}
              alt={talent.displayName}
              className="w-16 h-16 rounded-2xl border-2 border-zinc-900 object-cover ring-2 ring-amber-400/30 group-hover:ring-amber-400 transition-all shadow-lg"
              onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face`; }}
            />
            <div className="flex-1 pb-1 truncate">
              <div className="flex items-center gap-1.5">
                <h3 className="text-white font-bold text-base leading-tight group-hover:text-amber-400 transition-colors truncate">
                  {talent.displayName}
                </h3>
                {talent.isVerified && <BadgeCheck size={14} className="text-blue-400 flex-shrink-0" />}
              </div>
              <p className="text-amber-400/90 text-xs font-mono font-medium mt-0.5">@{talent.handle}</p>
            </div>
          </div>

          {/* Category & Location */}
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2.5 py-0.5 bg-gradient-to-r ${catInfo?.color || 'from-zinc-600 to-zinc-700'} text-white text-[11px] font-bold rounded-full shadow-sm`}>
              {catInfo?.icon} {CATEGORY_LABEL_MAP[talent.category]}
            </span>
            <span className="text-zinc-400 text-xs flex items-center gap-1">
              <MapPin size={11} className="text-zinc-500" /> {talent.location}
            </span>
          </div>

          {/* Title & Tagline */}
          <p className="text-zinc-200 text-sm font-semibold mb-1 truncate">{talent.title}</p>
          <p className="text-zinc-400 text-xs line-clamp-2 mb-3 leading-relaxed">{talent.tagline || talent.bio}</p>

          {/* MODEL PHYSICAL SPECS QUICK BAR */}
          {measurements && (
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl mb-3 flex items-center justify-between text-[10px] font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">H: {measurements.height?.split('/')[0] || "5'11\""}</span>
                <span className="text-zinc-600">&bull;</span>
                <span>{measurements.chest || '33'}-{measurements.waist || '24'}-{measurements.hips || '35'}</span>
              </div>
              <span className="text-zinc-500">{measurements.shoeSize || '39 EU'}</span>
            </div>
          )}

          {/* Template Theme Badge & Metric Stats */}
          <div className="flex items-center justify-between py-2 border-t border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye size={12} className="text-zinc-500" />
                <span>{(talent.views || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-zinc-500" />
                <span>{(liked ? (talent.likes || 0) + 1 : (talent.likes || 0)).toLocaleString()}</span>
              </div>
            </div>

            {talent.followerCount && (
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Users size={12} />
                <span>{talent.followerCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-3 gap-1.5">
        <button
          className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/talent/${talent.id}`);
          }}
        >
          Portfolio <ArrowRight size={11} />
        </button>

        <button
          className="py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-amber-400 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCompCard(talent);
          }}
          title="View Model Comp Card / Zed Card"
        >
          <Camera size={11} /> Comp Card
        </button>

        <button
          className="py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-400/15"
          onClick={(e) => {
            e.stopPropagation();
            onContact(talent);
          }}
        >
          <Send size={11} /> Book
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TALENT & MODEL PORTFOLIO PAGE
// ============================================================================
export const TalentPortfolioPage: React.FC<TalentPortfolioPageProps> = ({
  defaultCategory = 'all',
  defaultTitle,
  isModelFocused = false
}) => {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [featured, setFeatured] = useState<TalentProfile[]>([]);
  const [filter, setFilter] = useState<TalentFilter>({ sortBy: 'featured' });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<TalentCategory | 'all'>(defaultCategory);
  const [activeModelSubtag, setActiveModelSubtag] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  
  // Modals & Template Previews
  const [selectedCompCardTalent, setSelectedCompCardTalent] = useState<TalentProfile | null>(null);
  const [contactingTalent, setContactingTalent] = useState<TalentProfile | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplateDefinition | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const all = talentService.getPublic();
    setFeatured(all.filter(t => t.isFeatured));
    setTalents(talentService.getPublic(filter));
  }, []);

  useEffect(() => {
    let results = talentService.getPublic({
      ...filter,
      search: search || undefined,
      category: activeCategory,
      isAvailable: availableOnly || undefined,
    });

    if (activeModelSubtag !== 'all') {
      results = results.filter(t => 
        t.subCategories?.some(sub => sub.toLowerCase().includes(activeModelSubtag.toLowerCase())) ||
        t.title.toLowerCase().includes(activeModelSubtag.toLowerCase()) ||
        t.tagline.toLowerCase().includes(activeModelSubtag.toLowerCase())
      );
    }

    setTalents(results);
  }, [filter, search, activeCategory, activeModelSubtag, availableOnly]);

  // Rotate featured spotlight
  useEffect(() => {
    if (!featured || featured.length <= 1) {
      setFeaturedIdx(0);
      return;
    }
    const t = setInterval(() => {
      setFeaturedIdx(i => (featured.length > 0 ? (i + 1) % featured.length : 0));
    }, 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  const handleLike = (id: string) => {
    talentService.toggleLike(id);
    setTalents(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };

  const stats = useMemo(() => talentService.getAdminStats(), []);

  const isModelMode = isModelFocused || activeCategory === 'model';

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-400 selection:text-zinc-950">
      
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          <div className="text-center mb-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-5">
              <Sparkles size={14} />
              {isModelMode ? 'VELAMETRIC MODEL DIRECTORY & CASTING ROSTER' : 'VELAMETRIC TALENT & MODEL ECOSYSTEM'}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-5">
              {isModelMode ? (
                <>
                  Discover & Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400">Elite Models</span>
                </>
              ) : (
                <>
                  Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Elite Talent</span> & Creators
                </>
              )}
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              {isModelMode ? (
                'Access verified international comp-cards, runway video showreels, physical measurements, and direct casting options for Paris, Milan, New York, and Dubai campaigns.'
              ) : (
                'Connect with world-class fashion models, screen actors, viral creators, athletes, and keynote speakers. 8 premade visual portfolio styles ready to explore.'
              )}
            </p>

            {/* Live Stats Counters */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
              {[
                { label: isModelMode ? 'Models Represented' : 'Talents & Models', value: talents.length + '+', icon: Users },
                { label: 'Agency Views', value: (stats.totalViews / 1000).toFixed(0) + 'K', icon: Eye },
                { label: 'Casting Inquiries', value: stats.totalInquiries + '+', icon: TrendingUp },
                { label: 'Curated Featured', value: stats.featured, icon: Crown },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-amber-400">{value}</div>
                  <div className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1 justify-center">
                    <Icon size={11} /> {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder={isModelMode ? 'Search models by name, runway, measurements, location...' : 'Search talents by name, skill, category, location...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-900/90 border border-zinc-700 focus:border-amber-400 rounded-2xl text-white placeholder-zinc-500 text-sm outline-none transition-all shadow-xl"
              />
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                to="/talent-register"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20"
              >
                <Zap size={15} /> Join as Model / Talent
              </Link>
              <Link
                to="/talent-login"
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white font-bold rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Lock size={14} className="text-amber-400" /> Talent Sign In
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById('templates-showcase-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-amber-400 font-bold rounded-xl transition-all text-xs flex items-center gap-1.5"
              >
                <Palette size={14} /> 8 Portfolio Templates
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* ── CATEGORY BAR ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => { setActiveCategory('all'); setActiveModelSubtag('all'); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-amber-400 text-zinc-950 shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-amber-400/40'
              }`}
            >
              ✨ All Talent Roster
            </button>
            {TALENT_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setActiveModelSubtag('all'); }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.value
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-amber-400/40'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* MODEL SPECIFIC SUB-CATEGORY CHIPS (when on models or model category) */}
          {isModelMode && (
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold shrink-0 px-2">
                MODEL STYLES:
              </span>
              {[
                { id: 'all', label: 'All Models' },
                { id: 'runway', label: 'Haute Couture & Runway' },
                { id: 'editorial', label: 'Editorial Magazine' },
                { id: 'commercial', label: 'Commercial & TVC' },
                { id: 'beauty', label: 'Beauty & Skincare' },
                { id: 'menswear', label: 'Menswear Runway' },
                { id: 'fine-art', label: 'Fine Art & High Fashion' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveModelSubtag(sub.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeModelSubtag === sub.id
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── FILTER & SORT CONTROLS ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
              <Filter size={15} /> <span>Filters</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-9 h-5 rounded-full transition-all relative ${availableOnly ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${availableOnly ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-zinc-300 text-xs font-semibold">Available Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filter.sortBy || 'featured'}
              onChange={e => setFilter(f => ({ ...f, sortBy: e.target.value as TalentFilter['sortBy'] }))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="featured">⭐ Featured First</option>
              <option value="popular">❤️ Most Popular</option>
              <option value="views">👁️ Most Viewed</option>
              <option value="newest">🆕 Newest</option>
            </select>

            <span className="text-zinc-500 text-xs font-mono">
              {talents.length} {talents.length === 1 ? 'Profile' : 'Profiles'} Found
            </span>
          </div>
        </div>

        {/* ── TALENT & MODEL ROSTER GRID ── */}
        {talents.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-white text-lg font-bold">No profiles matched your search</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-4">
              Try adjusting your keywords, subcategories, or clear filters.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActiveModelSubtag('all'); setAvailableOnly(false); }}
              className="px-5 py-2 bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {talents.map(talent => (
              <TalentCard
                key={talent.id}
                talent={talent}
                onLike={handleLike}
                onContact={t => setContactingTalent(t)}
                onOpenCompCard={t => setSelectedCompCardTalent(t)}
              />
            ))}
          </div>
        )}

        {/* ── 8 PREMADE TALENT & MODEL PORTFOLIO TEMPLATES SECTION ── */}
        <div id="templates-showcase-section" className="pt-10 space-y-6">
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <LayoutTemplate size={14} /> 8 SIGNATURE SHOWCASE TEMPLATES
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Choose Your Public <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Portfolio Design</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Every talent on Velametric can 1-click switch between 8 luxury responsive templates anytime from their dashboard.
              </p>
            </div>

            <Link
              to="/talent-dashboard"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Explore In Dashboard Studio</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TALENT_PORTFOLIO_TEMPLATES.map(tmpl => (
              <div
                key={tmpl.id}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-amber-400/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={tmpl.previewImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 font-mono text-[9px] font-bold uppercase border border-amber-400/30">
                      {tmpl.badge}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-zinc-900/90 text-white font-mono text-[9px] font-bold">
                      {tmpl.tier.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {tmpl.bestFor.slice(0, 3).map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 text-[10px] font-mono">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={12} /> Live Preview
                  </button>
                  <Link
                    to={`/talent-register?template=${tmpl.id}`}
                    className="py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1 shadow-md shadow-amber-400/15"
                  >
                    <Check size={12} /> Use Style
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DEDICATED TALENT ACCOUNT CTA BANNER ── */}
        <div className="relative p-px bg-gradient-to-r from-amber-400/40 via-amber-400 to-amber-400/40 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl p-8 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase">
                  <Sparkles size={13} /> MODEL & TALENT WORKSPACE
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  Ready to Showcase Your Portfolio to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Global Scouts?</span>
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                  Create your free talent account, get your permanent verified link <code className="text-amber-400 font-mono">/talent/your-handle</code>, generate downloadable digital comp cards, and receive direct casting offers.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/talent-register"
                    className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-xl shadow-amber-400/25 transition-all"
                  >
                    Register as Talent & Model
                  </Link>
                  <Link
                    to="/talent-login"
                    className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Sign In to Dashboard
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">PORTFOLIO BENEFITS</div>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Instant Digital Zed Comp Card generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>8 High-Fashion & Cinematic layout themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>4K Catwalk & Showreel video player</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Direct casting proposals in private dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODALS ── */}
      <CompCardModal
        talent={selectedCompCardTalent}
        onClose={() => setSelectedCompCardTalent(null)}
        onBook={t => { setSelectedCompCardTalent(null); setContactingTalent(t); }}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />

      <CardContactModal
        talent={contactingTalent}
        onClose={() => setContactingTalent(null)}
      />

    </div>
  );
};

export default TalentPortfolioPage;
