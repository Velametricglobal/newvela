import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Search, Filter, Eye, Edit3, Trash2, CheckCircle2,
  Clock, Calendar, Sparkles, ExternalLink, ArrowRight, Tag, X, Image as ImageIcon,
  Check, FileText, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService, BlogPost } from '../../services/blogService';

export const BlogCMS: React.FC = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Editor Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Marketing & Outreach');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80');
  const [authorName, setAuthorName] = useState('Marketing Desk');
  const [authorRole, setAuthorRole] = useState('Content & Growth Specialist');
  const [tagsInput, setTagsInput] = useState('Growth, Marketing');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  useEffect(() => {
    loadArticles();
    const handleUpdate = () => loadArticles();
    window.addEventListener('vela-blog-updated', handleUpdate);
    return () => window.removeEventListener('vela-blog-updated', handleUpdate);
  }, []);

  const loadArticles = () => {
    setArticles(blogService.getArticles());
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  const openNewArticleModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setExcerpt('');
    setCategory('Marketing & Outreach');
    setContent('### Introduction\n\nWrite your blog insights here...\n\n### Key Strategy Points\n\n- Point 1\n- Point 2\n\n### Conclusion\n\nSummary of results.');
    setReadTime('5 min read');
    setFeaturedImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80');
    setAuthorName('Marketing Desk');
    setAuthorRole('Content Specialist');
    setTagsInput('Marketing, Growth, Strategy');
    setStatus('PUBLISHED');
    setIsModalOpen(true);
  };

  const openEditArticleModal = (art: BlogPost) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setSubtitle(art.subtitle || '');
    setExcerpt(art.excerpt || '');
    setCategory(art.category || 'Marketing & Outreach');
    setContent(art.content || '');
    setReadTime(art.readTime || '5 min read');
    setFeaturedImage(art.featuredImage || '');
    setAuthorName(art.author?.name || 'Author');
    setAuthorRole(art.author?.role || 'Contributor');
    setTagsInput(art.tags ? art.tags.join(', ') : '');
    setStatus(art.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('Please fill in title and slug.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      blogService.updateArticle(editingId, {
        title,
        slug,
        subtitle,
        excerpt,
        category,
        content,
        readTime,
        featuredImage,
        status,
        author: { name: authorName, role: authorRole },
        tags
      });
      showNotification(`Article "${title}" updated successfully!`);
    } else {
      blogService.createArticle({
        title,
        slug,
        subtitle,
        excerpt,
        category,
        content,
        readTime,
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        featuredImage,
        status,
        author: { name: authorName, role: authorRole },
        tags
      });
      showNotification(`Article "${title}" published successfully!`);
    }

    setIsModalOpen(false);
    loadArticles();
  };

  const handleDelete = (id: string, artTitle: string) => {
    if (confirm(`Are you sure you want to delete "${artTitle}"?`)) {
      blogService.deleteArticle(id);
      showNotification('Article deleted.');
      loadArticles();
    }
  };

  const handleTogglePublish = (art: BlogPost) => {
    const nextStatus = art.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    blogService.updateArticle(art.id, { status: nextStatus });
    showNotification(`Article status changed to ${nextStatus}.`);
    loadArticles();
  };

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  const filtered = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const totalPublished = articles.filter(a => a.status === 'PUBLISHED').length;
  const totalDrafts = articles.filter(a => a.status === 'DRAFT').length;
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              MARKETING & CONTENT CMS
            </span>
            <span className="text-xs text-slate-400 font-mono">SEO & KNOWLEDGE ENGINE</span>
          </div>
          <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Blog Publishing & Article Studio
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Create, publish, edit, and schedule high-ranking blog articles, case study stories, and industry guides. Live updates reflect instantly on the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/blog"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Globe className="w-4 h-4 text-brand-400" />
            View Live Blog
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <button
            onClick={openNewArticleModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Write & Publish Post
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Articles</div>
          <div className="text-2xl font-black text-white mt-1">{articles.length}</div>
          <div className="text-[10px] text-purple-400 font-mono mt-0.5">Across all categories</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-[11px] font-semibold uppercase">Published & Live</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalPublished}</div>
          <div className="text-[10px] text-emerald-500 font-mono mt-0.5">Visible to readers</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-[11px] font-semibold uppercase">Drafts & In-Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{totalDrafts}</div>
          <div className="text-[10px] text-amber-500 font-mono mt-0.5">Unpublished working copies</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-slate-400 text-[11px] font-semibold uppercase">Total Reader Views</div>
          <div className="text-2xl font-black text-brand-400 mt-1">{totalViews.toLocaleString()}</div>
          <div className="text-[10px] text-brand-400 font-mono mt-0.5">Aggregated readership</div>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, topic, or keyword..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-bold text-sm">No blog articles match your filters.</p>
            <button
              onClick={openNewArticleModal}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              + Create First Blog Post
            </button>
          </div>
        ) : (
          filtered.map((art) => (
            <div
              key={art.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all group shadow-md"
            >
              {/* Featured Image */}
              <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    art.status === 'PUBLISHED'
                      ? 'bg-emerald-500 text-black font-extrabold'
                      : 'bg-amber-500 text-black font-extrabold'
                  }`}>
                    {art.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-black/60 backdrop-blur text-white font-mono">
                    {art.readTime || '5 min'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">
                    {art.category}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mt-1 font-display">
                    {art.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{art.publishedDate}</span>
                  <span>{art.views} views</span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openEditArticleModal(art)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleTogglePublish(art)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      art.status === 'PUBLISHED'
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                    title={art.status === 'PUBLISHED' ? 'Revert to Draft' : 'Publish Article'}
                  >
                    {art.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  </button>

                  <Link
                    to={`/blog/${art.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Preview Live Article"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 uppercase">
                  {editingId ? 'EDIT POST' : 'NEW BLOG POST'}
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-1">
                  {editingId ? 'Edit Blog Article' : 'Compose & Publish New Article'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 5 Strategies to Scale Corporate Event Ticket Sales in 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. scale-corporate-event-ticket-sales"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Marketing & Outreach, Event Staging, Technology"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle / Key Takeaway</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Brief 1-sentence punchline summarizing the core value"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Excerpt (SEO Description)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short 2-3 sentence overview that appears on blog cards and Google search results"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article Content (Markdown Supported) *</label>
                <textarea
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full body of the article using headers (###), bullet points (-), and bold (**)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Author Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Events, Tickets, Growth, Dehradun"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publishing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="PUBLISHED" className="bg-slate-900 text-emerald-400">PUBLISHED (Live on Website)</option>
                    <option value="DRAFT" className="bg-slate-900 text-amber-400">DRAFT (Save as Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20"
                >
                  {editingId ? 'Save Changes' : 'Publish Article Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogCMS;
