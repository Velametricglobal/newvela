import React, { useEffect, useState } from 'react';
import { Testimonial } from '../../types/database.types';
import { testimonialService } from '../../services/testimonialService';
import { Star, Plus, Edit3, Trash2, Video, FileText, CheckCircle2, Search, Sparkles, X, Save, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TestimonialsCMS: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'TEXT' | 'VIDEO'>('ALL');
  const [filterRating, setFilterRating] = useState<number>(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const data = await testimonialService.getTestimonials();
    setTestimonials(data);
  };

  const handleSave = async () => {
    if (!editingTestimonial?.client_name) return;
    await testimonialService.saveTestimonial(editingTestimonial);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await testimonialService.deleteTestimonial(id);
      fetchTestimonials();
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = !searchQuery || t.client_name.toLowerCase().includes(searchQuery.toLowerCase()) || t.company_name.toLowerCase().includes(searchQuery.toLowerCase()) || t.quote.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesRating = filterRating === 0 || t.rating === filterRating;
    return matchesSearch && matchesType && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/admin/dashboard" className="hover:text-white">Admin</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-400">Content</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 font-bold">Testimonials CMS</span>
      </div>

      {/* Main Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <Star className="w-3.5 h-3.5" /> TESTIMONIALS CMS MODULE
          </div>
          <h2 className="text-xl font-bold text-white mt-1 font-display">Client Testimonials & Video Reviews</h2>
          <p className="text-slate-400 text-xs mt-1">Manage text reviews, client video testimonials, ratings, and featured homepage showcases.</p>
        </div>

        <button
          onClick={() => setEditingTestimonial({
            client_name: '',
            company_name: '',
            designation: 'Managing Director',
            service_name: 'Website & App Development',
            type: 'TEXT',
            rating: 5,
            quote: '',
            is_featured: true,
            status: 'PUBLISHED',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          })}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search client, company, or review text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end font-mono">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('TEXT')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'TEXT' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Text
            </button>
            <button
              onClick={() => setFilterType('VIDEO')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'VIDEO' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Video
            </button>
          </div>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-bold focus:outline-none"
          >
            <option value={0}>All Ratings</option>
            <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
            <option value={4}>4 Stars ⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t) => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={t.avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{t.client_name}</h3>
                    <p className="text-[11px] text-amber-400 font-semibold">{t.company_name} • {t.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => setEditingTestimonial(t)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-black text-slate-300 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Star Rating & Type */}
              <div className="flex items-center justify-between text-xs border-y border-slate-800/80 py-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${t.type === 'VIDEO' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'}`}>
                  {t.type === 'VIDEO' ? '📹 Video Review' : '📝 Text Review'}
                </span>
              </div>

              {/* Quote Content */}
              <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">"{t.quote}"</p>
              
              <div className="text-[11px] text-slate-400 font-mono">
                Service: <span className="text-slate-200">{t.service_name}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">{t.is_featured ? '⭐ Featured' : 'Standard'}</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">TESTIMONIAL EDITOR</span>
                <h3 className="text-lg font-bold text-white font-display">Save Testimonial Entry</h3>
              </div>
              <button onClick={() => setEditingTestimonial(null)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.client_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.company_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Designation</label>
                  <input
                    type="text"
                    value={editingTestimonial.designation || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Service Name</label>
                  <input
                    type="text"
                    value={editingTestimonial.service_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, service_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Review Type</label>
                  <select
                    value={editingTestimonial.type || 'TEXT'}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, type: e.target.value as 'TEXT' | 'VIDEO' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  >
                    <option value="TEXT">Text Review</option>
                    <option value="VIDEO">Video Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Rating Stars</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  >
                    <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                    <option value={3}>3 Stars ⭐⭐⭐</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={editingTestimonial.status || 'PUBLISHED'}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {editingTestimonial.type === 'VIDEO' && (
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Video URL (YouTube / Vimeo / MP4)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={editingTestimonial.video_url || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, video_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Profile Photo / Avatar Image URL</label>
                <input
                  type="url"
                  value={editingTestimonial.avatar_url || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Testimonial Quote / Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-featured"
                  checked={editingTestimonial.is_featured ?? true}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, is_featured: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="chk-featured" className="text-slate-300 font-semibold cursor-pointer">
                  Feature on Public Homepage Showcase
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button onClick={() => setEditingTestimonial(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg">
                <Save className="w-4 h-4" /> Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
