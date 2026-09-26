import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Globe, Award, Star, Eye, Heart, Share2,
  CheckCircle2, ArrowLeft, Send, ExternalLink, Play, Film, Image as ImageIcon,
  Sparkles, ShieldCheck, Instagram, Youtube, Twitter, Linkedin,
  ChevronRight, BadgeCheck, MessageSquare, Phone, Mail, Briefcase,
  Layers, Music, DollarSign, X, Check, ArrowRight, UserCheck, UserPlus, Crown,
  LayoutTemplate, Palette, Sliders, CheckCheck, ThumbsUp, Bookmark,
  LayoutGrid, Grid, Folder, Search, Filter, Sparkle, Camera, Printer, Download, Ruler, Smartphone, Monitor
} from 'lucide-react';
import { talentService } from '../../services/talentService';
import type {
  TalentProfile, TalentMedia, TalentPackage, PortfolioTemplateId,
  TalentPortfolioTheme, PortfolioTemplateDefinition
} from '../../types/talent.types';
import {
  TALENT_CATEGORIES, CATEGORY_LABEL_MAP, TALENT_PORTFOLIO_TEMPLATES
} from '../../types/talent.types';

// ── Contact / Opportunity Modal ──────────────────────────────────────────────
interface ContactModalProps {
  talent: TalentProfile;
  isOpen: boolean;
  onClose: () => void;
  accentColorClass?: string;
  defaultProjectTitle?: string;
}

const ContactTalentModal: React.FC<ContactModalProps> = ({ talent, isOpen, onClose, defaultProjectTitle }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    company: '',
    projectType: 'Brand Campaign',
    budget: '₹50,000 - ₹1,00,000',
    deadline: '',
    message: defaultProjectTitle ? `Hi ${talent.displayName},\n\nI came across your project "${defaultProjectTitle}" and would love to discuss a potential collaboration...` : '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultProjectTitle) {
      setFormData(prev => ({
        ...prev,
        message: `Hi ${talent.displayName},\n\nI was impressed by your work on "${defaultProjectTitle}" on Behance and would love to collaborate on a new project...`
      }));
    }
  }, [defaultProjectTitle, talent.displayName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      talentService.createInquiry({
        talentId: talent.id,
        talentName: talent.displayName,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        company: formData.company,
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message + (formData.deadline ? `\nTarget Deadline: ${formData.deadline}` : ''),
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={talent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'}
              alt={talent.displayName}
              className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
              onError={(e) => { e.currentTarget.src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop`; }}
            />
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Behance Talent Direct Inquire
              </div>
              <h3 className="text-white font-black text-lg">Work With {talent.displayName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Proposal Dispatched Successfully!</h4>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              Your opportunity proposal has been delivered directly to {talent.displayName}'s private dashboard. Their management will review and respond shortly.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.senderEmail}
                  onChange={e => setFormData({ ...formData, senderEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.senderPhone}
                  onChange={e => setFormData({ ...formData, senderPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Company / Agency Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vogue Studios / Netflix"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Project / Opportunity Type *</label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                >
                  <option value="Brand Campaign">Brand Campaign / Commercial</option>
                  <option value="Runway / Fashion Week">Runway / Fashion Week</option>
                  <option value="Feature Film / Series">Feature Film / Drama Series</option>
                  <option value="Keynote Speaking">Keynote Speaking / Moderation</option>
                  <option value="Influencer Collaboration">Social Collab / Viral Reel</option>
                  <option value="Live Event Performance">Live Event / Stage Performance</option>
                  <option value="Editorial Photo Shoot">Editorial Photo / Magazine Shoot</option>
                  <option value="Other Project">Custom Opportunity</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Estimated Budget Range</label>
                <select
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                >
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                  <option value="₹2,50,000+">₹2,50,000+ (High-End Campaign)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Target Production Date / Deadline</label>
              <input
                type="text"
                placeholder="e.g. Q4 2026 / Mid-November"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Project Brief & Details *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your project scope, deliverables, shoot locations, or specific requirements..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/50 text-zinc-950 font-black rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-amber-400/20"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={15} /> Send Opportunity
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Model Comp Card (Zed Card) Modal Component ───────────────────────────────
interface CompCardProfileModalProps {
  talent: TalentProfile;
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
}

const CompCardProfileModal: React.FC<CompCardProfileModalProps> = ({ talent, isOpen, onClose, onBook }) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  if (!isOpen) return null;

  const measurements = talent.measurements || {
    height: "5'11\" / 180 cm",
    chest: '33" / 84 cm',
    waist: '24" / 61 cm',
    hips: '35" / 89 cm',
    shoeSize: '8.5 US / 39 EU',
    eyeColor: 'Hazel',
    hairColor: 'Dark Brown',
    skinTone: 'Medium Olive'
  };

  const modelMedia = Array.isArray(talent.media) ? talent.media : [];
  const compPhotos = modelMedia.filter(m => m.type === 'image');
  const polaroids = [
    compPhotos[0]?.url || talent.coverImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    compPhotos[1]?.url || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    compPhotos[2]?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
    compPhotos[3]?.url || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop',
  ];

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

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setSide('front')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  side === 'front' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Front Cover
              </button>
              <button
                onClick={() => setSide('back')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  side === 'back' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                4-Look Polaroids
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-colors"
              title="Print / Save PDF"
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
          {side === 'front' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="md:col-span-7 relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={talent.avatar || talent.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop'}
                  alt={talent.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop'; }}
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

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Height</span>
                      <span className="text-white font-black text-sm">{measurements.height || "5'11\""}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Bust / Chest</span>
                      <span className="text-white font-black text-sm">{measurements.chest || '33"'}</span>
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
                      <span className="text-white font-black text-sm">{measurements.shoeSize || '39 EU'}</span>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 text-[10px] uppercase font-mono block">Eyes & Hair</span>
                      <span className="text-white font-black text-sm">{measurements.eyeColor || 'Hazel'} &bull; {measurements.hairColor || 'Dark'}</span>
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
                    onClick={() => { onClose(); onBook(); }}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
                  >
                    <Send size={13} /> Option / Book This Model
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop'; }}
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

              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 mt-4">
                <div>
                  <div className="text-white font-bold text-xs">{talent.displayName} &bull; Representation</div>
                  <div className="text-zinc-400 text-[11px]">Location: {talent.location} &bull; Direct Agency Booking</div>
                </div>
                <button
                  onClick={() => { onClose(); onBook(); }}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase"
                >
                  Send Casting Inquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Behance-Inspired Project Deep-View Modal ─────────────────────────────────
interface BehanceProjectModalProps {
  media: TalentMedia | null;
  talent: TalentProfile;
  onClose: () => void;
  onAppreciate: (mediaId: string) => void;
  onInquire: (projectTitle: string) => void;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const BehanceProjectModal: React.FC<BehanceProjectModalProps> = ({
  media, talent, onClose, onAppreciate, onInquire, accentBg, accentText, accentBorder
}) => {
  const [appreciated, setAppreciated] = useState(false);
  const [likesCount, setLikesCount] = useState(media?.likes || 42);

  useEffect(() => {
    if (media) {
      setLikesCount(media.likes || 42);
      setAppreciated(false);
    }
  }, [media]);

  if (!media) return null;

  const handleToggleAppreciate = () => {
    if (!appreciated) {
      setAppreciated(true);
      setLikesCount(prev => prev + 1);
      onAppreciate(media.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Behance Project Top Bar */}
        <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 truncate">
            <img
              src={talent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={talent.displayName}
              className="w-10 h-10 rounded-full object-cover border border-zinc-700"
            />
            <div className="truncate">
              <h3 className="text-white font-bold text-base truncate">{media.title}</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <span>By <span className="text-white font-semibold">{talent.displayName}</span></span>
                <span>&bull;</span>
                <span className="text-amber-400 capitalize">{media.category || 'Creative Work'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onInquire(media.title)}
              className="hidden sm:flex px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl items-center gap-1.5 transition-all shadow-md"
            >
              <Send size={13} /> Inquire Work
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Project Scrollable Presentation Canvas */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 space-y-8 no-scrollbar bg-black/40">
          
          {/* Main Media Showcase */}
          <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-2xl flex items-center justify-center">
            {media.type === 'video' || media.type === 'reel' ? (
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                {media.url.includes('youtube') || media.url.includes('youtu.be') ? (
                  <iframe
                    src={media.url.replace('watch?v=', 'embed/')}
                    title={media.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={media.url} controls autoPlay className="w-full h-full object-contain" />
                )}
              </div>
            ) : (
              <img
                src={media.url}
                alt={media.title}
                className="max-h-[70vh] w-full object-contain mx-auto"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'; }}
              />
            )}
          </div>

          {/* Project Details & Behance Interactive Bar */}
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Appreciation Big Button (Behance Style) */}
            <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-bold text-white mb-1">{media.title}</h4>
                <p className="text-zinc-400 text-xs">
                  Published in <span className="text-white capitalize">{media.category || 'Portfolio'}</span> &bull; {media.uploadedAt || '2026 Collection'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAppreciate}
                  className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-xl ${
                    appreciated
                      ? 'bg-blue-600 text-white shadow-blue-500/25 scale-105'
                      : 'bg-zinc-800 hover:bg-blue-600/20 text-zinc-200 hover:text-blue-400 border border-zinc-700'
                  }`}
                >
                  <ThumbsUp size={18} className={appreciated ? 'fill-white' : ''} />
                  <span>{appreciated ? 'Appreciated' : 'Appreciate'} ({likesCount})</span>
                </button>

                <button
                  onClick={() => onInquire(media.title)}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
                >
                  <Send size={15} /> Hire
                </button>
              </div>
            </div>

            {/* Project Specs & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Total Views</div>
                <div className="text-lg font-black text-white flex items-center gap-1.5 mt-1">
                  <Eye size={16} className="text-zinc-400" />
                  <span>{(media.views || 1200).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Project Category</div>
                <div className="text-lg font-black text-amber-400 capitalize mt-1">
                  {media.category || 'Editorial'}
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Creative Lead</div>
                <div className="text-base font-bold text-white truncate mt-1">
                  {talent.displayName}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Talent Profile Page Component (Behance Showcase Architecture) ───────
export const TalentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'about' | 'packages' | 'showreel' | 'compcard'>('work');
  const [activeMediaFilter, setActiveMediaFilter] = useState<string>('all');
  const [portfolioViewMode, setPortfolioViewMode] = useState<'grid' | 'masonry'>('grid');
  
  // Behance Social & Action States
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCompCardOpen, setIsCompCardOpen] = useState(false);
  const [inquiryProjectTitle, setInquiryProjectTitle] = useState<string>('');
  const [previewMedia, setPreviewMedia] = useState<TalentMedia | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCountNumber, setFollowerCountNumber] = useState(5400);
  const [isAppreciatedProfile, setIsAppreciatedProfile] = useState(false);
  const [profileLikesCount, setProfileLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Premade Template Design System
  const [activeTemplateId, setActiveTemplateId] = useState<PortfolioTemplateId>('editorial-vogue');
  const [designSavedToast, setDesignSavedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadProfile = () => {
      const profile = talentService.getById(id);
      if (profile) {
        setTalent(profile);
        setProfileLikesCount(profile.likes || 0);
        if (profile.portfolioTheme?.templateId) {
          setActiveTemplateId(profile.portfolioTheme.templateId);
        }
      }
    };

    loadProfile();
    talentService.incrementViews(id);

    window.addEventListener('velametric_talents_updated', loadProfile);
    window.addEventListener('storage', loadProfile);
    window.addEventListener('focus', loadProfile);

    return () => {
      window.removeEventListener('velametric_talents_updated', loadProfile);
      window.removeEventListener('storage', loadProfile);
      window.removeEventListener('focus', loadProfile);
    };
  }, [id]);

  if (!talent) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🎭</div>
        <h2 className="text-2xl font-bold text-white mb-2">Talent Profile Not Found</h2>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          The requested talent profile does not exist or may have been updated.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/talents"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl transition-all"
          >
            Explore Talent Directory
          </Link>
          <Link
            to="/talent-dashboard"
            className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-700 transition-all"
          >
            Talent Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Active Template Theme Configuration
  const activeTemplate = TALENT_PORTFOLIO_TEMPLATES.find(t => t.id === activeTemplateId) || TALENT_PORTFOLIO_TEMPLATES[0];
  const catInfo = TALENT_CATEGORIES.find(c => c.value === talent.category) || { value: talent.category, label: talent.category, icon: '⭐' };

  // Accent Colors & Tokens
  const accentColor = activeTemplate.accentColor;
  const accentText =
    accentColor === 'gold' || accentColor === 'amber' ? 'text-amber-400' :
    accentColor === 'purple' ? 'text-fuchsia-400' :
    accentColor === 'emerald' ? 'text-emerald-400' :
    accentColor === 'cyan' || accentColor === 'blue' ? 'text-cyan-400' :
    accentColor === 'indigo' ? 'text-indigo-400' :
    accentColor === 'slate' ? 'text-slate-300' :
    accentColor === 'rose' ? 'text-rose-400' :
    'text-amber-400';

  const accentBg =
    accentColor === 'gold' || accentColor === 'amber' ? 'bg-amber-400 text-zinc-950' :
    accentColor === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
    accentColor === 'emerald' ? 'bg-emerald-400 text-zinc-950' :
    accentColor === 'cyan' || accentColor === 'blue' ? 'bg-cyan-400 text-zinc-950' :
    accentColor === 'indigo' ? 'bg-indigo-600 text-white' :
    accentColor === 'slate' ? 'bg-zinc-800 text-white border border-zinc-700' :
    accentColor === 'rose' ? 'bg-rose-500 text-white' :
    'bg-amber-400 text-zinc-950';

  const accentBorder =
    accentColor === 'gold' || accentColor === 'amber' ? 'border-amber-400/40' :
    accentColor === 'purple' ? 'border-purple-400/40' :
    accentColor === 'emerald' ? 'border-emerald-400/40' :
    accentColor === 'cyan' || accentColor === 'blue' ? 'border-cyan-400/40' :
    accentColor === 'indigo' ? 'border-indigo-400/40' :
    accentColor === 'slate' ? 'border-zinc-700' :
    accentColor === 'rose' ? 'border-rose-400/40' :
    'border-amber-400/40';

  const accentGlow =
    accentColor === 'gold' || accentColor === 'amber' ? 'shadow-amber-400/20' :
    accentColor === 'purple' ? 'shadow-fuchsia-500/25' :
    accentColor === 'emerald' ? 'shadow-emerald-400/20' :
    accentColor === 'cyan' || accentColor === 'blue' ? 'shadow-cyan-400/20' :
    accentColor === 'indigo' ? 'shadow-indigo-500/25' :
    accentColor === 'slate' ? 'shadow-zinc-800/50' :
    accentColor === 'rose' ? 'shadow-rose-400/20' :
    'shadow-amber-400/20';

  const fontHeading =
    activeTemplate.fontStyle === 'serif' ? 'font-serif tracking-normal' :
    activeTemplate.fontStyle === 'display' ? 'font-display uppercase tracking-wider' :
    activeTemplate.fontStyle === 'mono' ? 'font-mono uppercase tracking-tight' :
    'font-sans font-black tracking-tight';

  const handleApplyTemplatePermanently = (tmplId: PortfolioTemplateId) => {
    const chosenTmpl = TALENT_PORTFOLIO_TEMPLATES.find(t => t.id === tmplId);
    if (!chosenTmpl) return;
    
    const updatedTheme: TalentPortfolioTheme = {
      templateId: tmplId,
      accentColor: chosenTmpl.accentColor,
      fontStyle: chosenTmpl.fontStyle,
      heroLayout: chosenTmpl.heroLayout,
      galleryLayout: chosenTmpl.galleryLayout,
      showMeasurements: !!talent.measurements,
      showShowreelFirst: tmplId === 'cinema-noir' || tmplId === 'creative-pop',
      customHeading: chosenTmpl.tagline,
    };

    talentService.updatePortfolioTheme(talent.id, updatedTheme);
    setActiveTemplateId(tmplId);
    setDesignSavedToast(true);
    setTimeout(() => setDesignSavedToast(false), 2500);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCountNumber(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const handleAppreciateProfile = () => {
    if (!isAppreciatedProfile) {
      setIsAppreciatedProfile(true);
      setProfileLikesCount(prev => prev + 1);
      talentService.toggleLike(talent.id);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenDirectInquiry = (projectTitle?: string) => {
    setInquiryProjectTitle(projectTitle || '');
    setIsContactOpen(true);
  };

  // Safe Media Filtering
  const mediaList = Array.isArray(talent.media) ? talent.media : [];
  const filteredMedia = mediaList.filter(item => {
    if (activeMediaFilter === 'all') return true;
    if (activeMediaFilter === 'photos') return item.type === 'image';
    if (activeMediaFilter === 'videos') return item.type === 'video' || item.type === 'reel';
    return item.category ? item.category.toLowerCase() === activeMediaFilter.toLowerCase() : true;
  });

  const skillsList = Array.isArray(talent.skills) ? talent.skills : [];
  const experienceList = Array.isArray(talent.experience) ? talent.experience : [];
  const packagesList = Array.isArray(talent.packages) ? talent.packages : [];
  const languagesList = Array.isArray(talent.languages) && talent.languages.length > 0 ? talent.languages : ['English'];
  const subCategoriesList = Array.isArray(talent.subCategories) ? talent.subCategories : [];
  const socialLinks = talent.socialLinks || {};

  // Extract unique categories for Behance project filter pills
  const availableCategories = Array.from(new Set(mediaList.map(m => m.category || 'General')));

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased">
      
      {/* ── BEHANCE HEADER & COVER HERO ────────────────────────────────────── */}
      <div className="relative">
        
        {/* Giant Panoramic Cover Image */}
        <div className="relative h-60 sm:h-80 md:h-96 w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
          <img
            src={talent.coverImage || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=600&fit=crop'}
            alt={talent.displayName}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=600&fit=crop'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          
          {/* Cover Badges & Breadcrumb */}
          <div className="absolute top-4 left-4 sm:left-8 flex items-center gap-2">
            <Link
              to="/talents"
              className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all border border-white/10"
            >
              <ArrowLeft size={13} /> Back to Directory
            </Link>
          </div>
        </div>

        {/* Behance Identity Overlap Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 sm:-mt-24 z-10">
          <div className="bg-zinc-900/95 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Creator Info: Avatar + Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative group">
                  <img
                    src={talent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                    alt={talent.displayName}
                    className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-zinc-950 shadow-2xl ring-2 ${accentBorder} group-hover:scale-105 transition-transform duration-300 bg-zinc-900`}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'; }}
                  />
                  {talent.isVerified && (
                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-blue-500 text-white rounded-xl border-2 border-zinc-950 shadow-lg" title="Behance Verified Pro Talent">
                      <BadgeCheck size={18} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${accentBg}`}>
                      {CATEGORY_LABEL_MAP[talent.category] || talent.category}
                    </span>
                    {talent.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center gap-1">
                        <Crown size={12} /> Curated Talent
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Available For Hire
                    </span>
                  </div>

                  <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white ${fontHeading}`}>
                    {talent.displayName}
                  </h1>

                  <p className={`text-base sm:text-lg font-bold ${accentText}`}>
                    {talent.title || 'Creative Professional'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-zinc-500" /> {talent.location || 'Global'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={13} className="text-zinc-500" /> {talent.yearsOfExperience ?? 0} Years Experience
                    </span>
                    <span className="flex items-center gap-1 text-zinc-500 font-mono">
                      behance.net/{talent.handle || 'creator'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Behance Primary Action Group */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                
                {/* Follow Button */}
                <button
                  onClick={handleFollow}
                  className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isFollowing
                      ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                  }`}
                >
                  {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                {/* Hire Me / Work With Talent */}
                <button
                  onClick={() => handleOpenDirectInquiry()}
                  className={`flex-1 sm:flex-none px-8 py-3.5 ${accentBg} font-black rounded-2xl transition-all shadow-xl ${accentGlow} flex items-center justify-center gap-2 text-xs transform hover:scale-[1.02]`}
                >
                  <Send size={15} /> Hire Me
                </button>

                {/* Model Zed Comp Card Button */}
                <button
                  onClick={() => setIsCompCardOpen(true)}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-zinc-950 hover:bg-zinc-800 border border-amber-400/40 text-amber-400 font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-lg hover:border-amber-400"
                  title="View Official Agency Zed Comp Card"
                >
                  <Camera size={15} />
                  <span>Zed Comp Card</span>
                </button>

                {/* Appreciate Profile Button */}
                <button
                  onClick={handleAppreciateProfile}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                    isAppreciatedProfile
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                      : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                  title="Appreciate Profile"
                >
                  <ThumbsUp size={16} className={isAppreciatedProfile ? 'fill-blue-400' : ''} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-3.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white rounded-2xl transition-all flex items-center justify-center"
                  title="Share Profile URL"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                </button>
              </div>
            </div>

            {/* Behance Statistics Bar */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-zinc-800/60">
                <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1.5">
                  <Eye size={16} className="text-zinc-500" />
                  <span>{(talent.views || 0).toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono mt-0.5">Project Views</div>
              </div>

              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-zinc-800/60">
                <div className="text-xl sm:text-2xl font-black text-blue-400 flex items-center justify-center gap-1.5">
                  <ThumbsUp size={16} className="text-blue-500 fill-blue-500/20" />
                  <span>{profileLikesCount.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono mt-0.5">Appreciations</div>
              </div>

              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-zinc-800/60">
                <div className={`text-xl sm:text-2xl font-black ${accentText}`}>
                  {followerCountNumber.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono mt-0.5">Followers</div>
              </div>

              <div className="p-3.5 bg-zinc-950/70 rounded-2xl border border-zinc-800/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  {talent.dayRate ? `₹${talent.dayRate}` : '₹25,000'}
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono mt-0.5">Daily Rate</div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {subCategoriesList.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-950 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 capitalize">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.instagram && (
                  <a href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800">
                    <Instagram size={14} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={`https://youtube.com/@${socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800">
                    <Youtube size={14} />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a href={`https://tiktok.com/@${socialLinks.tiktok}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800">
                    <Music size={14} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={`https://linkedin.com/in/${socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800">
                    <Linkedin size={14} />
                  </a>
                )}
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800">
                    <Globe size={14} />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BEHANCE TAB NAVIGATION BAR ─────────────────────────────────────── */}
      <div className="sticky top-12 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('work')}
                className={`px-4 sm:px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'work'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Folder size={15} />
                <span>Work / Projects</span>
                <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-[11px] font-mono text-zinc-300">
                  {mediaList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('showreel')}
                className={`px-4 sm:px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'showreel'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Film size={15} />
                <span>Showreel & Cinema</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 sm:px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Briefcase size={15} />
                <span>About & Experience</span>
              </button>

              <button
                onClick={() => setActiveTab('compcard')}
                className={`px-4 sm:px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'compcard'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Ruler size={15} />
                <span>Specs & Digitals</span>
              </button>

              {packagesList.length > 0 && (
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`px-4 sm:px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'packages'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <DollarSign size={15} />
                  <span>Services & Rates</span>
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded-full text-[11px] font-mono font-bold">
                    {packagesList.length}
                  </span>
                </button>
              )}
            </div>

            {/* Right side CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleOpenDirectInquiry()}
                className={`px-4 py-2 ${accentBg} font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5`}
              >
                <Send size={12} /> Direct Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── TAB 1: WORK / BEHANCE PORTFOLIO PROJECT GRID ──────────────────── */}
        {activeTab === 'work' && (
          <div className="space-y-8">
            
            {/* Filter & Layout Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              
              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                <button
                  onClick={() => setActiveMediaFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeMediaFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  All Projects ({mediaList.length})
                </button>

                <button
                  onClick={() => setActiveMediaFilter('photos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeMediaFilter === 'photos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Photos / Stills
                </button>

                <button
                  onClick={() => setActiveMediaFilter('videos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeMediaFilter === 'videos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Videos / Reels
                </button>

                {availableCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                      activeMediaFilter.toLowerCase() === cat.toLowerCase()
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
                <button
                  onClick={() => setPortfolioViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    portfolioViewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setPortfolioViewMode('masonry')}
                  className={`p-1.5 rounded-lg transition-all ${
                    portfolioViewMode === 'masonry' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Masonry Gallery View"
                >
                  <Grid size={15} />
                </button>
              </div>
            </div>

            {/* Behance Project Showcase Cards Grid */}
            {filteredMedia.length > 0 ? (
              <div className={`grid ${
                portfolioViewMode === 'masonry'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              }`}>
                {filteredMedia.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => setPreviewMedia(item)}
                    className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
                  >
                    {/* Project Cover */}
                    <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-zinc-950">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'; }}
                      />

                      {/* Video Indicator */}
                      {(item.type === 'video' || item.type === 'reel') && (
                        <div className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-md rounded-xl text-white">
                          <Play size={14} className="fill-white" />
                        </div>
                      )}

                      {/* Behance Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewMedia(item);
                            }}
                            className="p-2.5 bg-black/70 hover:bg-blue-600 rounded-xl text-white transition-colors"
                            title="Expand Project"
                          >
                            <ExternalLink size={15} />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase rounded-md">
                            {item.category || 'Creative Project'}
                          </span>
                          <h4 className="text-white font-bold text-lg leading-tight line-clamp-1">
                            {item.title || 'Untitled Showcase'}
                          </h4>
                          <p className="text-zinc-300 text-xs line-clamp-1">
                            By {talent.displayName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Bar (Behance Metrics) */}
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <h4 className="text-white font-bold text-sm truncate group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-zinc-500 capitalize">{item.category || 'Creative Work'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
                        <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                          <ThumbsUp size={12} /> {(item.likes || 48)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {(item.views || 1200).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800/60 space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto text-blue-400">
                  <Camera size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">No Projects in Selected Category</h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  {talent.displayName} has not published projects under this specific filter yet.
                </p>
                <button
                  onClick={() => setActiveMediaFilter('all')}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  View All Projects
                </button>
              </div>
            )}

          </div>
        )}

        {/* ── TAB 2: SHOWREEL & CINEMA ──────────────────────────────────────── */}
        {activeTab === 'showreel' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 bg-black border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-1">
                    <Film size={14} /> 4K Theatrical Showreel
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {talent.displayName} — Official 2026 Reel
                  </h2>
                </div>
                <button
                  onClick={() => handleOpenDirectInquiry('Showreel Casting')}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Direct Casting Call
                </button>
              </div>

              {/* 21:9 Widescreen Theatre Player */}
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 group">
                <img
                  src={talent.coverImage || (mediaList[0]?.url) || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200'}
                  alt={talent.displayName}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-between p-6">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-full">
                      4K UHD THEATRICAL CUT
                    </span>
                    <span className="px-3 py-1 bg-black/80 text-zinc-400 text-xs font-mono rounded-full">
                      Duration: 2m 45s
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-xl sm:text-2xl font-black">{talent.displayName}</h3>
                      <p className="text-zinc-300 text-xs sm:text-sm">{talent.tagline || 'Dramatic and commercial reel showcase'}</p>
                    </div>
                    <button
                      onClick={() => setPreviewMedia(mediaList[0] || {
                        id: 'm_reel_main',
                        type: 'image',
                        url: talent.coverImage || talent.avatar || '',
                        title: `${talent.displayName} Official Reel`,
                        category: 'cinema',
                        views: talent.views || 2500,
                        likes: talent.likes || 120,
                        uploadedAt: '2026'
                      })}
                      className="w-16 h-16 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 flex items-center justify-center shadow-2xl shadow-amber-400/50 hover:scale-110 transition-all"
                    >
                      <Play size={28} className="fill-zinc-950 translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: ABOUT & EXPERIENCE (Behance Split Sidebar Layout) ──────── */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Bio, Experience, Skills */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Biography Section */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
                    About The Creative
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-black text-white ${fontHeading}`}>
                    Biography & Creative Vision
                  </h2>
                </div>

                <p className="text-zinc-300 text-base leading-relaxed">
                  {talent.bio || `${talent.displayName} is an industry-leading talent specializing in ${talent.title || talent.category}. With extensive experience in high-end productions, campaigns, and creative collaborations.`}
                </p>

                {talent.tagline && (
                  <div className="p-5 bg-zinc-950/80 border border-blue-500/30 rounded-2xl">
                    <h4 className="text-xs font-mono font-bold uppercase text-blue-400 mb-1">
                      Creative Statement
                    </h4>
                    <p className="text-white text-base font-semibold italic">
                      "{talent.tagline}"
                    </p>
                  </div>
                )}
              </div>

              {/* Skills & Proficiency Meters */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Technical Proficiencies
                  </div>
                  <h3 className={`text-2xl font-black text-white ${fontHeading}`}>
                    Skills & Competencies
                  </h3>
                </div>

                {skillsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skillsList.map((skill) => (
                      <div key={skill.id} className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-white">{skill.name}</span>
                          <span className="text-blue-400 font-mono">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm">Skills list being curated.</p>
                )}
              </div>

              {/* Work Experience Timeline */}
              {experienceList.length > 0 && (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
                      Career History
                    </div>
                    <h3 className={`text-2xl font-black text-white ${fontHeading}`}>
                      Experience & Productions
                    </h3>
                  </div>

                  <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-0.5 before:bg-zinc-800">
                    {experienceList.map((exp) => (
                      <div key={exp.id} className="relative pl-8 sm:pl-10 space-y-1">
                        <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-zinc-950" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-400">{exp.year}</span>
                          <span className="text-zinc-600">&bull;</span>
                          <span className="text-xs font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                            {exp.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{exp.role} — <span className="text-blue-400">{exp.company}</span></h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 4 Cols: Behance Sidebar Credentials & Parameters */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quick Hire Sidebar Card */}
              <div className="p-6 bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-500/30 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Send size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">Book {talent.displayName}</h4>
                    <p className="text-zinc-400 text-xs">Direct Talent Management</p>
                  </div>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Available for editorial, brand campaigns, fashion weeks, and international productions.
                </p>
                <button
                  onClick={() => handleOpenDirectInquiry()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Send Project Inquiry
                </button>
              </div>

              {/* Physical Specifications / Parameters */}
              <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-4">
                <h4 className="text-white font-bold text-base flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400" />
                  <span>Profile Specifications</span>
                </h4>

                {talent.measurements ? (
                  <div className="space-y-2.5 text-xs">
                    {talent.measurements.height && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800">
                        <span className="text-zinc-400">Height</span>
                        <span className="text-white font-mono font-bold">{talent.measurements.height}</span>
                      </div>
                    )}
                    {talent.measurements.chest && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800">
                        <span className="text-zinc-400">Bust / Chest</span>
                        <span className="text-white font-mono font-bold">{talent.measurements.chest}</span>
                      </div>
                    )}
                    {talent.measurements.waist && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800">
                        <span className="text-zinc-400">Waist</span>
                        <span className="text-white font-mono font-bold">{talent.measurements.waist}</span>
                      </div>
                    )}
                    {talent.measurements.hips && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800">
                        <span className="text-zinc-400">Hips</span>
                        <span className="text-white font-mono font-bold">{talent.measurements.hips}</span>
                      </div>
                    )}
                    {talent.measurements.shoeSize && (
                      <div className="flex justify-between py-1.5 border-b border-zinc-800">
                        <span className="text-zinc-400">Shoe Size</span>
                        <span className="text-white font-mono font-bold">{talent.measurements.shoeSize}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-400">Experience Tier</span>
                      <span className="text-white font-bold uppercase">{talent.experienceLevel || 'Expert'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-400">Nationality</span>
                      <span className="text-white font-bold">{talent.nationality || 'International'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-3">
                <h4 className="text-white font-bold text-sm">Languages Spoken</h4>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-950 text-blue-400 text-xs font-mono font-bold rounded-xl border border-zinc-800 flex items-center gap-1.5">
                      <Globe size={12} /> {lang}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── TAB 4: SERVICES & PACKAGES ────────────────────────────────────── */}
        {activeTab === 'packages' && packagesList.length > 0 && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Transparent Engagement
              </div>
              <h2 className={`text-3xl sm:text-4xl font-black text-white ${fontHeading}`}>
                Commercial Booking Packages
              </h2>
              <p className="text-zinc-400 text-sm">
                Select a package or contact directly for custom production contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packagesList.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative p-6 sm:p-8 rounded-3xl bg-zinc-900 border ${
                    pkg.popular ? 'border-amber-400/60 shadow-amber-400/10' : 'border-zinc-800'
                  } space-y-6 flex flex-col justify-between shadow-xl`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-amber-400 text-zinc-950 text-[10px] font-mono font-black uppercase tracking-wider rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                      <p className="text-zinc-400 text-xs mt-1">{pkg.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400">₹{Number(pkg.price).toLocaleString('en-IN') || pkg.price}</span>
                      <span className="text-zinc-400 text-xs font-mono">/ {pkg.duration}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      {(pkg.deliverables || []).map((del, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check size={13} className="text-emerald-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDirectInquiry(pkg.name)}
                    className={`w-full py-3 ${pkg.popular ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300' : 'bg-zinc-800 hover:bg-zinc-700 text-white'} font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5`}
                  >
                    <Send size={13} /> Book Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: SPECS & DIGITALS / COMP CARD VIEW ───────────────────────── */}
        {activeTab === 'compcard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <div>
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                  OFFICIAL AGENCY COMPOSITE & DIGITALS
                </div>
                <h2 className={`text-2xl sm:text-3xl font-black text-white ${fontHeading}`}>
                  {talent.displayName} &bull; Model Specifications
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Verified casting statistics, body measurements, and raw unretouched polaroids.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompCardOpen(true)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-400/20"
                >
                  <Printer size={14} /> View / Print Zed Card
                </button>
                <button
                  onClick={() => handleOpenDirectInquiry('Direct Casting Call')}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 flex items-center gap-1.5"
                >
                  <Send size={13} /> Option Model
                </button>
              </div>
            </div>

            {/* Measurements Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { label: 'Height', val: talent.measurements?.height || "5'11\"" },
                { label: 'Bust / Chest', val: talent.measurements?.chest || '33"' },
                { label: 'Waist', val: talent.measurements?.waist || '24"' },
                { label: 'Hips', val: talent.measurements?.hips || '35"' },
                { label: 'Shoes', val: talent.measurements?.shoeSize || '39 EU' },
                { label: 'Eyes', val: talent.measurements?.eyeColor || 'Hazel' },
                { label: 'Hair', val: talent.measurements?.hairColor || 'Dark' },
                { label: 'Skin Tone', val: talent.measurements?.skinTone || 'Medium' },
              ].map((spec, i) => (
                <div key={i} className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">{spec.label}</span>
                  <span className="text-sm font-black text-white mt-1 block">{spec.val}</span>
                </div>
              ))}
            </div>

            {/* Raw Casting Polaroids Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera size={16} className="text-amber-400" />
                  <span>Unretouched Casting Polaroids & Digitals</span>
                </h3>
                <span className="text-zinc-500 text-xs font-mono">NATURAL LIGHT 4-ANGLE SLATE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(mediaList.length > 0 ? mediaList.slice(0, 4) : [
                  { id: '1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', title: 'Editorial Silhouette' },
                  { id: '2', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop', title: '3/4 Portrait' },
                  { id: '3', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', title: 'Runway Stride' },
                  { id: '4', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop', title: 'Full Length Slate' },
                ]).map((pic, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-2.5 space-y-2">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 relative group">
                      <img src={pic.url} alt={`Digital ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-zinc-950 text-xs font-bold rounded-lg shadow-lg">
                          Inspect Digital
                        </span>
                      </div>
                    </div>
                    <div className="text-center pb-1">
                      <span className="text-xs font-bold text-white block truncate">{pic.title || `Slate 0${idx + 1}`}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono">Clean Lighting Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Behance Project Detail Modal ────────────────────────────────────── */}
      <BehanceProjectModal
        media={previewMedia}
        talent={talent}
        onClose={() => setPreviewMedia(null)}
        onAppreciate={(mediaId) => {
          talentService.toggleLike(talent.id);
        }}
        onInquire={(title) => {
          setPreviewMedia(null);
          handleOpenDirectInquiry(title);
        }}
        accentBg={accentBg}
        accentText={accentText}
        accentBorder={accentBorder}
      />

      {/* ── Contact / Opportunity Modal ────────────────────────────────────── */}
      <ContactTalentModal
        talent={talent}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultProjectTitle={inquiryProjectTitle}
      />

      {/* ── Model Comp Card (Zed Card) Modal ─────────────────────────────────── */}
      <CompCardProfileModal
        talent={talent}
        isOpen={isCompCardOpen}
        onClose={() => setIsCompCardOpen(false)}
        onBook={() => handleOpenDirectInquiry('Comp Card Booking')}
      />

    </div>
  );
};
