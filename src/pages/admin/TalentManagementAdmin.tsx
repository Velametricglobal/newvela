import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Star, Eye, MessageSquare, Search, Filter, ShieldCheck,
  CheckCircle2, XCircle, AlertCircle, Sparkles, ExternalLink,
  Edit, Trash2, Crown, BadgeCheck, Check, X, RefreshCw, Send,
  Layers, Globe, MapPin, ChevronRight, Phone, Mail, Award, Film, Palette, Heart
} from 'lucide-react';
import { talentService } from '../../services/talentService';
import type { TalentProfile, TalentCategory, TalentStatus, TalentInquiry } from '../../types/talent.types';
import { TALENT_CATEGORIES, CATEGORY_LABEL_MAP, TALENT_PORTFOLIO_TEMPLATES } from '../../types/talent.types';

export const TalentManagementAdmin: React.FC = () => {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [inquiries, setInquiries] = useState<TalentInquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TalentStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TalentCategory | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Selected talent for viewing / editing / reviewing
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [reviewModalTalent, setReviewModalTalent] = useState<TalentProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'talents' | 'inquiries'>('talents');

  // Load data
  const loadData = () => {
    setTalents(talentService.getAll());
    setInquiries(talentService.getInquiries());
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => talentService.getAdminStats(), [talents]);

  // Filtered talent list
  const filteredTalents = useMemo(() => {
    return talents.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (verifiedFilter === 'verified' && !t.isVerified) return false;
      if (verifiedFilter === 'unverified' && t.isVerified) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.displayName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.handle.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [talents, statusFilter, categoryFilter, verifiedFilter, search]);

  // Actions
  const handleApprove = (id: string) => {
    talentService.updateStatus(id, 'active');
    loadData();
    if (reviewModalTalent?.id === id) setReviewModalTalent(null);
  };

  const handleReject = () => {
    if (!selectedTalent) return;
    talentService.updateStatus(selectedTalent.id, 'rejected', rejectReason);
    loadData();
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedTalent(null);
    if (reviewModalTalent?.id === selectedTalent.id) setReviewModalTalent(null);
  };

  const handleToggleVerified = (id: string) => {
    talentService.toggleVerified(id);
    loadData();
  };

  const handleToggleFeatured = (id: string) => {
    talentService.toggleFeatured(id);
    loadData();
  };

  const handleToggleSuspend = (id: string, currentStatus: TalentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    talentService.updateStatus(id, newStatus);
    loadData();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete talent account "${name}"?`)) {
      talentService.delete(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-amber-400 selection:text-zinc-950">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-xs font-semibold mb-2">
            <Sparkles size={13} /> VELAMETRIC TALENT GOVERNANCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Talent Portfolio & Account Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review submissions, grant verification badges, spotlight featured artists, and manage incoming opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/talents"
            target="_blank"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <ExternalLink size={14} className="text-amber-400" />
            <span>Public Directory</span>
          </Link>

          <Link
            to="/talent-dashboard"
            target="_blank"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
          >
            <Users size={14} /> Open Talent Portal
          </Link>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">Total Talents</div>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Registered accounts</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-emerald-400 font-mono uppercase tracking-wider">Active & Live</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.active}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Publicly visible</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-amber-400 font-mono uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.pending}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Requires approval</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-yellow-400 font-mono uppercase tracking-wider">Featured</div>
          <div className="text-2xl font-black text-yellow-400 mt-1">{stats.featured}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Top spotlight</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-blue-400 font-mono uppercase tracking-wider">Total Views</div>
          <div className="text-2xl font-black text-white mt-1">{(stats.totalViews / 1000).toFixed(1)}K</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Public impressions</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[11px] text-rose-400 font-mono uppercase tracking-wider">Inquiries</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalInquiries}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Brand opportunities</div>
        </div>
      </div>

      {/* ── Sub-navigation Tabs ── */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('talents')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'talents'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users size={16} /> Talents Directory ({talents.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare size={16} /> All Client Inquiries ({inquiries.length})
        </button>
      </div>

      {/* ── TAB: TALENTS LIST ── */}
      {activeTab === 'talents' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search talent by name, email, handle, location, skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as TalentStatus | 'all')}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">Status: All</option>
              <option value="active">Active / Approved</option>
              <option value="pending">Pending Review</option>
              <option value="featured">Featured Spotlight</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as TalentCategory | 'all')}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">Category: All</option>
              {TALENT_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {/* Verified Filter */}
            <select
              value={verifiedFilter}
              onChange={e => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">Badge: All</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified</option>
            </select>

            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); setVerifiedFilter('all'); }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Talents Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Talent Profile</th>
                    <th className="px-4 py-3.5">Category & Title</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Badges</th>
                    <th className="px-4 py-3.5">Metrics</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTalents.map(t => {
                    const cat = TALENT_CATEGORIES.find(c => c.value === t.category);
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Avatar + Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={t.avatar}
                              alt={t.displayName}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'; }}
                            />
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                {t.displayName}
                                {t.isVerified && <BadgeCheck size={14} className="text-blue-400" />}
                              </div>
                              <div className="text-amber-400 font-mono text-[11px]">@{t.handle}</div>
                              <div className="text-slate-500 text-[10px]">{t.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Title */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700 inline-flex items-center">
                              {CATEGORY_LABEL_MAP[t.category]}
                            </span>
                            <div className="text-slate-300 font-medium truncate max-w-[180px]">{t.title}</div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'active' || t.status === 'featured'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : t.status === 'pending'
                              ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                              : t.status === 'suspended'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            ● {t.status}
                          </span>
                        </td>

                        {/* Badges Toggles */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleVerified(t.id)}
                              title={t.isVerified ? 'Remove Verified Badge' : 'Grant Verified Badge'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                t.isVerified
                                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <BadgeCheck size={15} />
                            </button>
                            <button
                              onClick={() => handleToggleFeatured(t.id)}
                              title={t.isFeatured ? 'Unfeature Talent' : 'Promote to Spotlight'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                t.isFeatured
                                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <Crown size={15} />
                            </button>
                          </div>
                        </td>

                        {/* Metrics */}
                        <td className="px-4 py-4">
                          <div className="space-y-0.5 text-[11px]">
                            <div className="text-white font-mono font-bold flex items-center gap-1">
                              <Eye size={11} className="text-slate-500" /> {t.views.toLocaleString()}
                            </div>
                            <div className="text-rose-400 font-mono flex items-center gap-1">
                              <Heart size={11} /> {t.likes}
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              {t.inquiries} inquiries
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-500" />
                            <span>{t.location}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {t.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(t.id)}
                                title="Approve Profile"
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg text-[11px] transition-all flex items-center gap-1"
                              >
                                <Check size={12} /> Approve
                              </button>
                            )}

                            <button
                              onClick={() => setReviewModalTalent(t)}
                              title="Review Complete Profile"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            >
                              <Eye size={14} />
                            </button>

                            <Link
                              to={`/talent/${t.id}`}
                              target="_blank"
                              title="View Public Profile Page"
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg transition-colors"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <button
                              onClick={() => handleToggleSuspend(t.id, t.status)}
                              title={t.status === 'suspended' ? 'Reactivate Profile' : 'Suspend Profile'}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                t.status === 'suspended'
                                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'
                              }`}
                            >
                              <XCircle size={14} />
                            </button>

                            <button
                              onClick={() => handleDelete(t.id, t.displayName)}
                              title="Delete Talent"
                              className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredTalents.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No talent profiles match your current search and filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: INQUIRIES CENTRAL HUB ── */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div>
              <h3 className="text-white font-bold text-lg">Central Opportunity & Booking Pipeline</h3>
              <p className="text-slate-400 text-xs">All project proposals and audition inquiries across every talent profile.</p>
            </div>

            <div className="space-y-3">
              {inquiries.map(inq => (
                <div
                  key={inq.id}
                  className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{inq.senderName}</span>
                      {inq.company && <span className="text-xs text-slate-400">({inq.company})</span>}
                      <span className="text-slate-500 text-xs">&rarr;</span>
                      <span className="text-amber-400 font-bold text-xs">{inq.talentName}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-md">
                        {inq.projectType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>📧 {inq.senderEmail}</span>
                      {inq.budget && <span>💰 {inq.budget}</span>}
                      <span>📅 {new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-slate-300 text-xs pt-1 max-w-2xl">{inq.message}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inq.status === 'new' ? 'bg-amber-400 text-zinc-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {inq.status}
                    </span>
                    <a
                      href={`mailto:${inq.senderEmail}?subject=Re: Inquiry for ${inq.talentName}`}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl flex items-center gap-1"
                    >
                      <Mail size={12} /> Contact Scout
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEW TALENT PROFILE MODAL ── */}
      {reviewModalTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={reviewModalTalent.avatar} alt={reviewModalTalent.displayName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-white font-bold text-lg">{reviewModalTalent.displayName}</h3>
                  <p className="text-amber-400 text-xs font-mono">@{reviewModalTalent.handle} &bull; {reviewModalTalent.title}</p>
                </div>
              </div>
              <button onClick={() => setReviewModalTalent(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-300">
              <div>
                <h4 className="font-bold text-white mb-1">Biography</h4>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">{reviewModalTalent.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 font-mono text-[10px] uppercase">Category</div>
                  <div className="text-white font-bold capitalize mt-0.5">{reviewModalTalent.category}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 font-mono text-[10px] uppercase">Location & Exp</div>
                  <div className="text-white font-bold mt-0.5 truncate">{reviewModalTalent.location} ({reviewModalTalent.yearsOfExperience}y)</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-500 font-mono text-[10px] uppercase">Design Preset</div>
                  <div className="text-amber-400 font-bold mt-0.5 flex items-center gap-1">
                    <Palette size={12} />
                    <span>
                      {TALENT_PORTFOLIO_TEMPLATES.find(t => t.id === reviewModalTalent.portfolioTheme?.templateId)?.name || 'Editorial Vogue'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Skills ({reviewModalTalent.skills.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {reviewModalTalent.skills.map(s => (
                    <span key={s.id} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg font-mono">
                      {s.name} ({s.proficiency}%)
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Portfolio Items ({reviewModalTalent.media.length})</h4>
                <div className="grid grid-cols-3 gap-2">
                  {reviewModalTalent.media.slice(0, 3).map(m => (
                    <img key={m.id} src={m.url} alt={m.title} className="w-full h-24 object-cover rounded-xl border border-slate-800" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => { setSelectedTalent(reviewModalTalent); setShowRejectModal(true); }}
                className="px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl font-bold"
              >
                Reject / Request Changes
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setReviewModalTalent(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApprove(reviewModalTalent.id)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl"
                >
                  Approve Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT REASON MODAL ── */}
      {showRejectModal && selectedTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Reject Profile & Provide Feedback</h3>
            <p className="text-slate-400 text-xs">
              Provide constructive guidelines for {selectedTalent.displayName} explaining why their profile requires modification.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Please upload higher-resolution editorial photos and add your showreel link..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none resize-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentManagementAdmin;
