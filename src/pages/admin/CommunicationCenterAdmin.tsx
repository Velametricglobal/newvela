import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Mail, Phone, Clock, Search, Filter, Plus, CheckCircle2, 
  ShieldAlert, Sparkles, Send, FileText, Zap, ShieldCheck, Users, Bot, 
  Share2, Copy, ExternalLink, Play, Wand2, RefreshCw, AlertCircle, Check, 
  Layers, Megaphone, Calendar, ArrowRight, UserCheck
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { leadService } from '../../services/leadService';
import { CommunicationActivity, MessageTemplate, WhatsAppTemplate, CommunicationChannel, Lead } from '../../types/database.types';

export const CommunicationCenterAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEADS_MARKETING' | 'TIMELINE' | 'TEMPLATES' | 'AUTOMATIONS' | 'CONSENT'>('LEADS_MARKETING');
  const [activities, setActivities] = useState<CommunicationActivity[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>([]);
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  // Leads & Marketing Campaign State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadFilter, setLeadFilter] = useState<string>('ALL');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  
  // Message Generator State
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel>('WHATSAPP');
  const [selectedObjective, setSelectedObjective] = useState<'WELCOME' | 'FOLLOWUP' | 'PROPOSAL' | 'DEMO' | 'OFFER'>('WELCOME');
  const [selectedTone, setSelectedTone] = useState<'PROFESSIONAL' | 'CONSULTATIVE' | 'URGENT' | 'EXCLUSIVE'>('PROFESSIONAL');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Automated Batch Campaign State
  const [campaignSegment, setCampaignSegment] = useState<'ALL' | 'NEW' | 'QUALIFIED' | 'HIGH_PRIORITY'>('NEW');
  const [campaignTemplateType, setCampaignTemplateType] = useState<string>('WELCOME_SEQUENCE');
  const [isCampaignRunning, setIsCampaignRunning] = useState<boolean>(false);
  const [campaignProgress, setCampaignProgress] = useState<number>(0);
  const [campaignLogs, setCampaignLogs] = useState<{ time: string; text: string; lead: string }[]>([]);

  useEffect(() => {
    communicationService.getActivities().then(setActivities);
    communicationService.getTemplates().then(setTemplates);
    communicationService.getWhatsAppTemplates().then(setWaTemplates);
    
    // Load leads
    leadService.getLeads().then(data => {
      setLeads(data);
      if (data.length > 0 && !selectedLeadId) {
        setSelectedLeadId(data[0].id);
      }
    });
  }, []);

  // Filtered Leads list
  const filteredLeads = leads.filter(l => {
    const matchesFilter = 
      leadFilter === 'ALL' ? true :
      leadFilter === 'HIGH_PRIORITY' ? l.priority === 'HIGH' :
      l.status === leadFilter;
    
    const term = leadSearch.toLowerCase();
    const matchesSearch = 
      (l.first_name + ' ' + (l.last_name || '')).toLowerCase().includes(term) ||
      (l.company_name || '').toLowerCase().includes(term) ||
      (l.lead_code || '').toLowerCase().includes(term) ||
      (l.service_interest || '').toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Dynamic Message Generator Engine
  const generateMessageForLead = (lead: Lead | undefined, objective: string, tone: string, channel: CommunicationChannel) => {
    if (!lead) return;

    const firstName = lead.first_name || 'Valued Client';
    const company = lead.company_name ? ` at ${lead.company_name}` : '';
    const service = lead.service_interest || 'Enterprise Growth & Tech Solutions';
    const budget = lead.budget_range ? ` (Budget: ${lead.budget_range})` : '';

    let message = '';
    let subject = '';

    if (objective === 'WELCOME') {
      subject = `Welcome to Velametric — Fast-Tracking ${lead.service_interest || 'Your Project'}`;
      if (tone === 'PROFESSIONAL') {
        message = `Hello ${firstName}, thank you for connecting with Velametric Global regarding ${service}${company}. We have reviewed your initial inquiry and our principal solution architect is preparing a customized execution roadmap for your review. Would you be available for a brief 10-minute discovery call tomorrow?`;
      } else if (tone === 'CONSULTATIVE') {
        message = `Hi ${firstName}! Great to connect with you${company}. I was reviewing your interest in ${service}, and we have recently delivered a 310% ROI turnaround on a similar project. I would love to share those exact benchmark numbers with you. Let me know what time suits you best for a quick chat!`;
      } else if (tone === 'URGENT') {
        message = `Hi ${firstName}, regarding your priority inquiry for ${service}—our onboarding cycle for this month is filling up rapidly. We have reserved an initial architecture slot for ${company || 'your team'}. Please confirm if 3:00 PM today works for a fast walkthrough.`;
      } else {
        message = `Exclusive Welcome, ${firstName}! We are delighted to assist ${company || 'your business'} with ${service}. As a new enterprise partner, you receive priority access to our turnkey sprint roadmap and senior advisory panel. Let's schedule your kickoff!`;
      }
    } else if (objective === 'FOLLOWUP') {
      subject = `Following Up: Next Steps for ${company || service}`;
      if (tone === 'PROFESSIONAL') {
        message = `Dear ${firstName}, I am following up on our recent communication regarding ${service}${budget}. We want to ensure you have all the technical parameters and timeline estimates required for your decision. Please let us know if you'd like us to schedule a follow-up briefing.`;
      } else if (tone === 'CONSULTATIVE') {
        message = `Hi ${firstName}, hope your week is going great! Just checking in on ${company || 'your project'} and the ${service} requirements. Did you have any questions on the scope or implementation model we discussed? Happy to hop on a quick call anytime!`;
      } else if (tone === 'URGENT') {
        message = `Urgent Follow-up for ${firstName}: Our technical team needs your confirmation regarding ${service} to guarantee delivery timelines before the upcoming development cycle begins. Can you give us a quick 5 minutes today?`;
      } else {
        message = `Hi ${firstName}, we have an exclusive update regarding ${service}. We just finalized an accelerated delivery framework that fits your project scope perfectly. Let's connect today so you don't miss out.`;
      }
    } else if (objective === 'PROPOSAL') {
      subject = `Commercial Proposal & Scope Document: ${service}`;
      if (tone === 'PROFESSIONAL') {
        message = `Hello ${firstName}, your customized scope and commercial proposal for ${service} has been formulated by our executive team. It outlines complete sprint milestones, compliance architecture, and transparent deliverables${budget}. Please review and let us know your availability for a walkthrough.`;
      } else if (tone === 'CONSULTATIVE') {
        message = `Hi ${firstName}! Excited to share that we've tailored the exact proposal for ${company || 'your company'} regarding ${service}. We structured the phases specifically to maximize quick-win ROI. Have a look and let's hop on a call to review together!`;
      } else {
        message = `Hi ${firstName}, your finalized proposal for ${service} is ready for sign-off. We have locked in the preferential commercial rate for the next 48 hours. Let's get this approved so our engineering sprint can commence!`;
      }
    } else if (objective === 'DEMO') {
      subject = `Invitation: Live Interactive Demonstration for ${service}`;
      message = `Hello ${firstName}, we would like to invite you${company} to a personalized, private live walkthrough of our ${service} platform. We will demonstrate how leading enterprises in your sector deploy this infrastructure to accelerate revenue. Which day this week works best for your team?`;
    } else {
      subject = `Special Campaign Offer: Exclusive Advisory Sprint for ${company || firstName}`;
      message = `Special Announcement for ${firstName}! For a limited window this month, Velametric is offering complimentary strategic technical audits for high-growth partners exploring ${service}. We would be thrilled to extend this to ${company || 'your team'}. Reply YES to claim your private session.`;
    }

    // Add channel-specific formatting
    if (channel === 'WHATSAPP') {
      message = `${message}\n\n— *Velametric Enterprise Hub*\n_Reply STOP to opt out_`;
    }

    setGeneratedMessage(message);
    setEmailSubject(subject);
  };

  // Re-generate when lead, objective, tone or channel changes
  useEffect(() => {
    if (selectedLead) {
      generateMessageForLead(selectedLead, selectedObjective, selectedTone, selectedChannel);
    }
  }, [selectedLeadId, selectedObjective, selectedTone, selectedChannel]);

  // Direct WhatsApp Action
  const handleSendWhatsApp = async () => {
    if (!selectedLead) return;
    const rawPhone = selectedLead.whatsapp || selectedLead.phone || '';
    const cleanPhone = rawPhone.replace(/[^\d]/g, '');

    if (!cleanPhone) {
      alert('Selected lead has no valid phone or WhatsApp number registered.');
      return;
    }

    // 1. Open WhatsApp Web / App
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedMessage)}`;
    window.open(waUrl, '_blank');

    // 2. Log in Communication Activity Timeline
    const newActivity = await communicationService.sendMessage({
      lead_id: selectedLead.id,
      contact_name: `${selectedLead.first_name} ${selectedLead.last_name || ''}`.trim(),
      recipient: cleanPhone,
      channel: 'WHATSAPP',
      message_body: generatedMessage
    });

    setActivities(prev => [newActivity, ...prev]);
    setActionSuccessMsg(`WhatsApp launched & activity logged for ${selectedLead.first_name}!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Direct Email Action
  const handleSendEmail = async () => {
    if (!selectedLead || !selectedLead.email) {
      alert('Selected lead does not have an email address.');
      return;
    }

    const mailtoUrl = `mailto:${selectedLead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(generatedMessage)}`;
    window.open(mailtoUrl, '_blank');

    const newActivity = await communicationService.sendMessage({
      lead_id: selectedLead.id,
      contact_name: `${selectedLead.first_name} ${selectedLead.last_name || ''}`.trim(),
      recipient: selectedLead.email,
      channel: 'EMAIL',
      message_body: `[SUBJECT: ${emailSubject}]\n\n${generatedMessage}`
    });

    setActivities(prev => [newActivity, ...prev]);
    setActionSuccessMsg(`Email client opened & communication logged for ${selectedLead.first_name}!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Run Automated Batch Lead Campaign
  const handleRunAutomatedCampaign = async () => {
    // Target leads based on segment
    const targetLeads = leads.filter(l => {
      if (campaignSegment === 'ALL') return true;
      if (campaignSegment === 'NEW') return l.status === 'NEW';
      if (campaignSegment === 'QUALIFIED') return l.status === 'QUALIFIED';
      if (campaignSegment === 'HIGH_PRIORITY') return l.priority === 'HIGH';
      return true;
    });

    if (targetLeads.length === 0) {
      alert(`No leads found matching segment: ${campaignSegment}. Please adjust your filter.`);
      return;
    }

    setIsCampaignRunning(true);
    setCampaignProgress(0);
    setCampaignLogs([]);

    const total = targetLeads.length;
    const newLogs: { time: string; text: string; lead: string }[] = [];

    for (let i = 0; i < total; i++) {
      const l = targetLeads[i];
      await new Promise(res => setTimeout(res, 600)); // Simulate async dispatch cadence
      
      const pct = Math.round(((i + 1) / total) * 100);
      setCampaignProgress(pct);

      const msg = `Automated ${campaignTemplateType.replace('_', ' ')} dispatched via WhatsApp to ${l.first_name} (${l.phone || l.email})`;
      newLogs.unshift({
        time: new Date().toLocaleTimeString(),
        text: msg,
        lead: `${l.first_name} ${l.last_name || ''} [${l.company_name || 'Direct'}]`
      });
      setCampaignLogs([...newLogs]);

      // Log in communication service
      await communicationService.sendMessage({
        lead_id: l.id,
        contact_name: `${l.first_name} ${l.last_name || ''}`.trim(),
        recipient: l.phone || l.email,
        channel: 'WHATSAPP',
        message_body: `[Automated Campaign: ${campaignTemplateType}] Hello ${l.first_name}, connecting regarding your inquiry for ${l.service_interest || 'Enterprise Solutions'}. Our team is ready to accelerate your goals.`
      });
    }

    setIsCampaignRunning(false);
    communicationService.getActivities().then(setActivities);
    setActionSuccessMsg(`Automated Campaign executed successfully across ${total} leads!`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const filteredActivities = activities.filter(act => {
    if (channelFilter === 'ALL') return true;
    return act.channel === channelFilter;
  });

  return (
    <div className="space-y-8 text-xs text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <MessageCircle className="w-3.5 h-3.5" /> Omnichannel Marketing & Communication Hub
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase tracking-tight">
            Lead Messaging & Outreach Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Standard messaging, automated marketing campaigns, and lead-aware AI dynamic message generation.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('LEADS_MARKETING')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'LEADS_MARKETING' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
            Lead Campaigns & Messaging
          </button>
          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'TIMELINE' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Activity Timeline ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'TEMPLATES' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('AUTOMATIONS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'AUTOMATIONS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sequence Rules
          </button>
          <button
            onClick={() => setActiveTab('CONSENT')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'CONSENT' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Opt-in & Consent
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST ALERT */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400 font-bold text-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Active Leads Pool <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">{leads.length}</div>
          <div className="text-[11px] text-brand-400 font-medium">{leads.filter(l => l.status === 'NEW').length} New Uncontacted Leads</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Messages Sent Today <MessageCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">142</div>
          <div className="text-[11px] text-emerald-400 font-medium">98.2% Direct Delivery Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Automated Lead Campaigns <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">6</div>
          <div className="text-[11px] text-slate-400 font-medium">Active Drips & Sequences</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Marketing Opt-In Rate <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-display">94.8%</div>
          <div className="text-[11px] text-slate-400 font-medium">TRAI & WhatsApp Policy Verified</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB: LEAD CAMPAIGNS & DYNAMIC MESSAGING                                  */}
      {/* ========================================================================= */}
      {activeTab === 'LEADS_MARKETING' && (
        <div className="space-y-8">
          
          {/* TOP SPLIT: LEAD SELECTOR & DYNAMIC MESSAGE GENERATOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN (5 cols): Lead Selector & Lead Details Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-400" />
                  <h3 className="font-bold text-white text-sm uppercase font-display">1. Select Target Lead</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {filteredLeads.length} Available
                </span>
              </div>

              {/* Filters & Search */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={e => setLeadSearch(e.target.value)}
                    placeholder="Search lead by name, company, code..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['ALL', 'NEW', 'QUALIFIED', 'HIGH_PRIORITY'].map(f => (
                    <button
                      key={f}
                      onClick={() => setLeadFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        leadFilter === f 
                          ? 'bg-brand-600 text-white' 
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Lead Cards List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredLeads.map(l => {
                  const isSelected = l.id === selectedLead?.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeadId(l.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-brand-950/40 border-brand-500 text-white shadow-lg' 
                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-xs text-white">
                          {l.first_name} {l.last_name || ''}
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold uppercase border ${
                          l.status === 'NEW' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                          l.status === 'QUALIFIED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        🏢 {l.company_name || 'Individual Lead'} • {l.city || 'India'}
                      </div>
                      <div className="text-[10px] text-brand-300 font-mono mt-0.5 truncate">
                        🎯 {l.service_interest || 'Enterprise Solution'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 flex justify-between">
                        <span>{l.phone || l.whatsapp || 'No Phone'}</span>
                        <span className="text-amber-400 font-bold">{l.budget_range || 'Standard'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Selected Lead Metadata Preview */}
              {selectedLead && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-400 uppercase font-mono font-bold text-[10px]">Lead Context Parameters:</div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prospect:</span>
                    <span className="font-bold text-white">{selectedLead.first_name} {selectedLead.last_name} ({selectedLead.lead_code})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Company:</span>
                    <span className="font-bold text-white">{selectedLead.company_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service Goal:</span>
                    <span className="font-bold text-brand-400">{selectedLead.service_interest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Range:</span>
                    <span className="font-bold text-emerald-400">{selectedLead.budget_range || 'Not specified'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (7 cols): Lead-Aware AI Message Generator & Dispatcher */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm uppercase font-display">
                    2. Dynamic Message Generator According to Lead
                  </h3>
                </div>

                {/* Channel Selector */}
                <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSelectedChannel('WHATSAPP')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      selectedChannel === 'WHATSAPP' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-300" /> WhatsApp
                  </button>
                  <button
                    onClick={() => setSelectedChannel('EMAIL')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      selectedChannel === 'EMAIL' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3 text-brand-300" /> Email
                  </button>
                  <button
                    onClick={() => setSelectedChannel('SMS')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      selectedChannel === 'SMS' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3 h-3 text-amber-300" /> SMS
                  </button>
                </div>
              </div>

              {/* Generator Controls: Campaign Objective & Voice Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Campaign Objective:</label>
                  <select
                    value={selectedObjective}
                    onChange={e => setSelectedObjective(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="WELCOME">👋 Welcome & Solution Introduction</option>
                    <option value="FOLLOWUP">📞 Follow-up & Strategy Call Nudge</option>
                    <option value="PROPOSAL">📑 Custom Proposal Ready Notification</option>
                    <option value="DEMO">💻 Interactive Product Demo Invitation</option>
                    <option value="OFFER">🏷️ Special Promotional Audit / Offer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Communication Tone:</label>
                  <select
                    value={selectedTone}
                    onChange={e => setSelectedTone(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="PROFESSIONAL">👔 Professional & Executive</option>
                    <option value="CONSULTATIVE">🤝 Warm & Consultative Advisory</option>
                    <option value="URGENT">⚡ High Urgency & Fast-Track Slot</option>
                    <option value="EXCLUSIVE">💎 VIP Exclusive Enterprise Partner</option>
                  </select>
                </div>
              </div>

              {/* Subject (for Email) */}
              {selectedChannel === 'EMAIL' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Email Subject Line:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              )}

              {/* Generated Message Body (Editable) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Generated Personalized Copy:
                  </label>
                  <button
                    onClick={() => generateMessageForLead(selectedLead, selectedObjective, selectedTone, selectedChannel)}
                    className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={generatedMessage}
                  onChange={e => setGeneratedMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* ACTION BUTTONS: 1-Click WhatsApp, 1-Click Email, Copy */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedChannel === 'WHATSAPP' && (
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Direct WhatsApp
                  </button>
                )}

                {selectedChannel === 'EMAIL' && (
                  <button
                    onClick={handleSendEmail}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4" /> Launch Email Dispatch
                  </button>
                )}

                {selectedChannel === 'SMS' && (
                  <button
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold inline-flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4" /> Send Direct SMS
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedToast ? 'Copied to Clipboard!' : 'Copy Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: AUTOMATED MARKETING CAMPAIGN RUNNER FOR LEADS                  */}
          {/* ========================================================================= */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  <Zap className="w-3.5 h-3.5" /> Automated Lead Outreach Engine
                </div>
                <h3 className="text-lg font-bold text-white mt-1 font-display uppercase tracking-tight">
                  Automated Marketing Campaigns for Leads
                </h3>
                <p className="text-slate-400 text-xs">
                  Trigger 1-click scheduled and automated sequence dispatches to filtered lead segments.
                </p>
              </div>

              {/* Segment & Sequence Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block font-mono">Target Lead Segment:</label>
                  <select
                    value={campaignSegment}
                    onChange={e => setCampaignSegment(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="NEW">New Leads ({leads.filter(l => l.status === 'NEW').length})</option>
                    <option value="QUALIFIED">Qualified Leads ({leads.filter(l => l.status === 'QUALIFIED').length})</option>
                    <option value="HIGH_PRIORITY">High Priority ({leads.filter(l => l.priority === 'HIGH').length})</option>
                    <option value="ALL">All Leads Database ({leads.length})</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block font-mono">Campaign Cadence:</label>
                  <select
                    value={campaignTemplateType}
                    onChange={e => setCampaignTemplateType(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="WELCOME_SEQUENCE">Turnkey Welcome & Digital Brochure Drip</option>
                    <option value="24H_FOLLOWUP">24-Hour Strategy Call Booking Follow-up</option>
                    <option value="VIP_COMMERCIAL_OFFER">Quarter-End Preferred Commercial Discount</option>
                    <option value="CASE_STUDY_SHOWCASE">310% Client ROI Case Study Showcase</option>
                  </select>
                </div>

                <div className="pt-4 sm:pt-0">
                  <button
                    onClick={handleRunAutomatedCampaign}
                    disabled={isCampaignRunning}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${
                      isCampaignRunning
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-500/20 hover:scale-105'
                    }`}
                  >
                    {isCampaignRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                    {isCampaignRunning ? 'Dispatching...' : 'Launch Automated Campaign'}
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Progress Bar */}
            {isCampaignRunning && (
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 animate-fadeIn">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">Broadcasting automated sequence...</span>
                  <span className="text-white font-bold">{campaignProgress}% Completed</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${campaignProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Live Campaign Dispatch Log */}
            {campaignLogs.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Campaign Execution Logs ({campaignLogs.length} messages sent):
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {campaignLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓ SENT</span>
                        <span className="text-white">{log.lead}</span>
                        <span className="text-slate-400">— {log.text}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Cadence Blueprint Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs font-display">
                  <Zap className="w-3.5 h-3.5" /> 1. Immediate Lead Capture
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Triggers instantly when a lead registers via website forms or package quote calculators. Sends high-touch WhatsApp welcome.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono">Response Rate: 74%</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-brand-400 font-bold flex items-center gap-1.5 text-xs font-display">
                  <Clock className="w-3.5 h-3.5" /> 2. 24-Hour Strategy Nudge
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Checks if lead status is still 'NEW'. Dispatches calendar booking link for a discovery strategy call with the assigned sales manager.
                </p>
                <div className="text-[10px] text-brand-400 font-mono">Conversion: 41% Call Booked</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs font-display">
                  <Sparkles className="w-3.5 h-3.5" /> 3. Commercial Proposal Follow-up
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Dispatches when quotation document is generated. Sends client portal access link and payment milestone preview.
                </p>
                <div className="text-[10px] text-cyan-400 font-mono">Closing Acceleration: +2.8x</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: STANDARD MESSAGING TEMPLATES FOR LEADS                         */}
          {/* ========================================================================= */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white font-display uppercase tracking-tight">
                  Standard Messaging Library for Leads
                </h3>
                <p className="text-slate-400 text-xs">
                  Pre-approved high-converting outreach copy. Click "Apply to Generator" to customize with the active lead.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Standard Welcome & Solution Blueprint',
                  objective: 'WELCOME',
                  channel: 'WHATSAPP',
                  preview: 'Hello {{first_name}}, thank you for contacting Velametric regarding {{service_interest}}. Our solution architect is reviewing your specifications...',
                  badge: 'High Conversion'
                },
                {
                  title: 'Discovery Strategy Call Invitation',
                  objective: 'FOLLOWUP',
                  channel: 'EMAIL',
                  preview: 'Hi {{first_name}}, hope you are well. We would love to walk you through our recent case study benchmarks on {{service_interest}}...',
                  badge: 'Lead Nurture'
                },
                {
                  title: 'Custom Proposal Review & Milestone Schedule',
                  objective: 'PROPOSAL',
                  channel: 'WHATSAPP',
                  preview: 'Hello {{first_name}}, your commercial scope document for {{service_interest}} is ready. We have locked in preferential rates for 48 hours...',
                  badge: 'Closing'
                },
                {
                  title: 'Client ROI Case Study & Portfolio Showcase',
                  objective: 'DEMO',
                  channel: 'WHATSAPP',
                  preview: 'Hi {{first_name}}, see how similar businesses in your industry scaled their inbound pipeline by 310% with Velametric...',
                  badge: 'Showcase'
                }
              ].map((tpl, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{tpl.title}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      {tpl.badge}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                    {tpl.preview}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedObjective(tpl.objective as any);
                      setSelectedChannel(tpl.channel as any);
                      generateMessageForLead(selectedLead, tpl.objective, selectedTone, tpl.channel as any);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-brand-400 hover:text-brand-300 border border-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Apply & Personalize for {selectedLead?.first_name || 'Selected Lead'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: COMMUNICATION TIMELINE & HISTORY                                   */}
      {/* ========================================================================= */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white font-display">Communication Timeline & History</h2>

            <div className="flex items-center gap-2">
              {['ALL', 'WHATSAPP', 'EMAIL', 'SMS', 'CALL'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    channelFilter === ch ? 'bg-brand-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredActivities.map((act) => (
              <div key={act.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${
                      act.channel === 'WHATSAPP' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      act.channel === 'CALL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      'bg-brand-500/20 text-brand-300 border-brand-500/30'
                    }`}>
                      {act.channel}
                    </span>
                    <span className="font-bold text-white">{act.contact_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({act.recipient_phone_email})</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 rounded text-slate-400 border border-slate-800">
                      {act.mode}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {act.message_body}
                  </p>

                  {act.reel_title && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                      🎬 Attached Reel: {act.reel_title}
                    </div>
                  )}
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="text-[11px] text-slate-400">{new Date(act.created_at).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Sender: {act.sender_name}</div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✓ {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGE & WHATSAPP TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white font-display">WhatsApp Official Meta Business Templates</h2>
                <p className="text-slate-400 text-xs">Manage pre-approved WhatsApp Business API message templates.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create WhatsApp Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waTemplates.map(wa => (
                <div key={wa.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{wa.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      ● {wa.approval_status}
                    </span>
                  </div>
                  {wa.header_text && <div className="font-bold text-white text-xs">{wa.header_text}</div>}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed">
                    {wa.body_text}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Variables: {wa.variables.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATION SEQUENCES */}
      {activeTab === 'AUTOMATIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white font-display">Automated Follow-up Sequences & Rules</h2>
              <p className="text-slate-400 text-xs">Configure automated trigger-based communication workflows.</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {[
              { trigger: 'WHEN: New Website Enquiry Received', action: 'THEN: Send Immediate WhatsApp Welcome Template', wait: 'WAIT: 1 Day', follow: 'THEN: Create Follow-up Task for Sales Agent' },
              { trigger: 'WHEN: Event Registration Confirmed', action: 'THEN: Send WhatsApp Pass QR Code', wait: 'WAIT: 3 Days Before Event', follow: 'THEN: Send Venue Reminder Notification' }
            ].map((rule, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 font-mono">
                <div className="text-amber-400 font-bold">{rule.trigger}</div>
                <div className="text-white">{rule.action}</div>
                <div className="text-slate-400">{rule.wait}</div>
                <div className="text-emerald-400">{rule.follow}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONSENT & PREFERENCES */}
      {activeTab === 'CONSENT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white font-display">Marketing Consent & Opt-In Preferences</h2>
          <p className="text-slate-400 text-xs">Ensure strict compliance by respecting recipient opt-out choices.</p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold">✓ Automated Opt-Out Filter Active</div>
            <p className="text-slate-400 text-xs">
              Contacts who reply STOP or disable WhatsApp/Email opt-in are automatically excluded from bulk marketing campaigns.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
