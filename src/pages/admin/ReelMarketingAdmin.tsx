import React, { useState, useEffect } from 'react';
import { Video, Play, Plus, Search, Filter, Megaphone, CheckCircle2, ShieldCheck, Sparkles, Send, Calendar, Users, DollarSign, Eye, ArrowRight } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { ReelAsset, MarketingCampaign } from '../../types/database.types';

export const ReelMarketingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'REEL_LIBRARY' | 'CREATE_CAMPAIGN'>('CAMPAIGNS');
  const [reels, setReels] = useState<ReelAsset[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [previewReel, setPreviewReel] = useState<ReelAsset | null>(null);

  // New Campaign Form State
  const [campaignName, setCampaignName] = useState('');
  const [targetAudience, setTargetAudience] = useState<MarketingCampaign['target_audience']>('QUALIFIED_LEADS');
  const [selectedReelId, setSelectedReelId] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('Hi {{first_name}}, discover our latest solutions! Watch the video reel: {{cta_link}}');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // New Reel Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelCategory, setNewReelCategory] = useState('Marketing');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-lights-42998-large.mp4');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const rData = await communicationService.getReelAssets();
    const cData = await communicationService.getCampaigns();
    setReels(rData);
    setCampaigns(cData);
    if (rData.length > 0) setSelectedReelId(rData[0].id);
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelTitle) return;

    await communicationService.addReelAsset({
      title: newReelTitle,
      description: 'Uploaded marketing promotional video reel.',
      video_url: newReelVideoUrl,
      thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      duration_seconds: 30,
      category: newReelCategory,
      tags: ['Promotional', newReelCategory],
      cta_url: '/portfolio'
    });

    setShowUploadModal(false);
    setNewReelTitle('');
    fetchData();
  };

  const handleLaunchCampaign = async () => {
    setIsLaunching(true);
    const chosenReel = reels.find(r => r.id === selectedReelId);

    await communicationService.createCampaign({
      name: campaignName || 'New Promotional Reel Campaign',
      channel: 'WHATSAPP',
      reel_id: selectedReelId,
      reel_title: chosenReel?.title,
      reel_url: chosenReel?.video_url,
      target_audience: targetAudience,
      message_template: campaignMessage,
      status: 'COMPLETED',
      recipients_count: 247,
      opted_out_count: 16,
      created_by: 'Active Agent'
    });

    setIsLaunching(false);
    setShowConfirmModal(false);
    setActiveTab('CAMPAIGNS');
    fetchData();
  };

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            <Megaphone className="w-3.5 h-3.5" /> WhatsApp & Video Reel Marketing Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Promotional Reel Campaigns & Library
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Upload promotional reels, segment targeted CRM audiences, execute bulk WhatsApp campaigns, and track ROI attribution.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'CAMPAIGNS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Campaign Performance ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('REEL_LIBRARY')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'REEL_LIBRARY' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reel Library ({reels.length})
          </button>
          <button
            onClick={() => setActiveTab('CREATE_CAMPAIGN')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'CREATE_CAMPAIGN' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            + Create New Campaign
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Total Campaign Reach <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">478</div>
          <div className="text-[11px] text-emerald-400 font-medium">Recipients Contacted</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Average Read Rate <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-display">84.0%</div>
          <div className="text-[11px] text-slate-400 font-medium">WhatsApp Engagement</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Leads Generated <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">30</div>
          <div className="text-[11px] text-amber-300 font-medium">Inbound Inquiries</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Attributed Revenue <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">₹7,70,000</div>
          <div className="text-[11px] text-slate-400 font-medium">Direct Marketing ROI</div>
        </div>
      </div>

      {/* TAB 1: CAMPAIGNS LIST & ANALYTICS */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white font-display">Active & Completed Reel Campaigns</h2>
            <button
              onClick={() => setActiveTab('CREATE_CAMPAIGN')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Reel Campaign
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.map(camp => (
              <div key={camp.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      ● {camp.status}
                    </span>
                    <h3 className="text-base font-extrabold text-white font-display mt-1">{camp.name}</h3>
                    <p className="text-slate-400 text-[11px] font-mono">Audience: {camp.target_audience} • Channel: {camp.channel}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>Launched: {new Date(camp.created_at).toLocaleDateString()}</div>
                    <div className="text-slate-300 font-bold">Created by: {camp.created_by}</div>
                  </div>
                </div>

                {camp.reel_title && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 font-bold text-xs">
                    🎬 Attached Reel: {camp.reel_title}
                  </div>
                )}

                {/* CAMPAIGN METRICS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-mono font-bold">Recipients / Sent</div>
                    <div className="text-base font-bold text-white font-display">{camp.recipients_count} / {camp.sent_count}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-mono font-bold">Delivered / Read</div>
                    <div className="text-base font-bold text-emerald-400 font-display">{camp.delivered_count} / {camp.read_count}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-mono font-bold">Inbound Replies</div>
                    <div className="text-base font-bold text-amber-400 font-display">{camp.replies_count}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-mono font-bold">Attributed Revenue</div>
                    <div className="text-base font-bold text-white font-display">₹{camp.revenue_attributed.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REEL LIBRARY */}
      {activeTab === 'REEL_LIBRARY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white font-display">CRM Promotional Reel Asset Library</h2>
              <p className="text-slate-400 text-xs">Upload, manage, and organize 9:16 vertical video reels for marketing campaigns.</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Bulk Upload Reels
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map(reel => (
              <div key={reel.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-56 rounded-xl overflow-hidden relative bg-black group cursor-pointer" onClick={() => setPreviewReel(reel)}>
                    <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-zinc-950/90 text-amber-400 font-extrabold text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-zinc-700">
                      {reel.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-white font-display">{reel.title}</h3>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{reel.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {reel.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-mono">Used in {reel.campaign_count} campaigns</span>
                  <button
                    onClick={() => {
                      setSelectedReelId(reel.id);
                      setActiveTab('CREATE_CAMPAIGN');
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Use in Campaign →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE NEW CAMPAIGN BUILDER */}
      {activeTab === 'CREATE_CAMPAIGN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-white font-display">Create Promotional Reel Campaign</h2>
            <p className="text-slate-400 text-xs">Segment your CRM audience, select a promotional reel, and craft a personalized message.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. September Digital Marketing Reel Launch"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Target CRM Audience Segment</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="QUALIFIED_LEADS">Qualified Leads (247 Recipients)</option>
                <option value="ALL">All Contact Database (478 Recipients)</option>
                <option value="CLIENTS">Existing Active Clients (85 Recipients)</option>
                <option value="EVENT_PARTICIPANTS">Event Participants & Contestants (108 Recipients)</option>
                <option value="SPONSORS">Corporate Sponsors & Partners (14 Recipients)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Select Promotional Reel</label>
              <select
                value={selectedReelId}
                onChange={(e) => setSelectedReelId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              >
                {reels.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.category} • {r.duration_seconds}s)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Campaign Message Content</label>
              <textarea
                rows={5}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Variables supported: {'{{first_name}}, {{service_name}}, {{event_name}}, {{cta_link}}'}</span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('CAMPAIGNS')}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider shadow-xl"
              >
                Review Campaign & Launch →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY CAMPAIGN CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-left">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold font-mono uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Mandatory Campaign Review
              </span>
              <h3 className="text-lg font-black text-white font-display mt-2">Confirm Campaign Launch</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div><span className="text-slate-400">Campaign Name:</span> <span className="text-white font-bold">{campaignName || 'Promotional Reel Launch'}</span></div>
              <div><span className="text-slate-400">Channel:</span> <span className="text-emerald-400 font-bold">WhatsApp Business API</span></div>
              <div><span className="text-slate-400">Target Segment:</span> <span className="text-amber-400 font-bold">{targetAudience}</span></div>
              <div><span className="text-slate-400">Estimated Recipients:</span> <span className="text-white font-bold">247 Contacts</span></div>
              <div><span className="text-slate-400">Excluded (Opted-Out):</span> <span className="text-rose-400 font-bold">16 Contacts</span></div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-300 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              Marketing Opt-In Rules Enforced. Opted-out contacts will be automatically skipped.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Go Back
              </button>
              <button
                onClick={handleLaunchCampaign}
                disabled={isLaunching}
                className="px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider"
              >
                {isLaunching ? 'Dispatching Campaign...' : 'Confirm & Launch Campaign 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REEL MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateReel} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">Bulk Upload Promotional Reel</h3>
            
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reel Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Uttarakhand Fashion Summit Highlights"
                value={newReelTitle}
                onChange={(e) => setNewReelTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={newReelCategory}
                onChange={(e) => setNewReelCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              >
                <option value="Marketing">Marketing</option>
                <option value="Website">Website Development</option>
                <option value="Events">Events & Pageants</option>
                <option value="Branding">Branding & Video</option>
                <option value="Finance">Financial Advisory</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold"
              >
                Upload Reel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REEL VIDEO PLAYER PREVIEW MODAL */}
      {previewReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4 text-center">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{previewReel.title}</h3>
              <button onClick={() => setPreviewReel(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
              <video
                src={previewReel.video_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
