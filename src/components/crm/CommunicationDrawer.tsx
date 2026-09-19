import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, Mail, Phone, Megaphone, Video, Play, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { CommunicationChannel, MessageTemplate, ReelAsset } from '../../types/database.types';

interface CommunicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  phone?: string;
  email?: string;
  contactId?: string;
  initialChannel?: CommunicationChannel;
  initialTab?: 'MESSAGE' | 'PROMOTE';
}

export const CommunicationDrawer: React.FC<CommunicationDrawerProps> = ({
  isOpen,
  onClose,
  contactName,
  phone = '+91 9876543210',
  email = 'contact@domain.com',
  contactId,
  initialChannel = 'WHATSAPP',
  initialTab = 'MESSAGE'
}) => {
  const [activeChannel, setActiveChannel] = useState<CommunicationChannel>(initialChannel);
  const [activeTab, setActiveTab] = useState<'MESSAGE' | 'PROMOTE'>(initialTab);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [reels, setReels] = useState<ReelAsset[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [selectedReel, setSelectedReel] = useState<ReelAsset | null>(null);
  const [messageBody, setMessageBody] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      communicationService.getTemplates().then(setTemplates);
      communicationService.getReelAssets().then(data => {
        setReels(data);
        if (data.length > 0) setSelectedReel(data[0]);
      });
      setIsSent(false);
      setMessageBody(`Hello ${contactName.split(' ')[0]}, thank you for reaching out to Velametric Global!`);
    }
  }, [isOpen, contactName]);

  useEffect(() => {
    setActiveChannel(initialChannel);
    setActiveTab(initialTab);
  }, [initialChannel, initialTab]);

  const handleTemplateSelect = (tpl: MessageTemplate) => {
    setSelectedTemplate(tpl);
    const personalized = communicationService.substituteVariables(tpl.content, {
      first_name: contactName.split(' ')[0],
      contact_name: contactName
    });
    setMessageBody(personalized);
  };

  const handleReelSelect = (reel: ReelAsset) => {
    setSelectedReel(reel);
    const msg = `Hi ${contactName.split(' ')[0]}, watch our latest video reel: ${reel.title}\n\nWatch here: ${reel.cta_url || 'https://velametric.com/portfolio'}`;
    setMessageBody(msg);
  };

  const handleSendMessage = async () => {
    setSending(true);
    await communicationService.sendMessage({
      lead_id: contactId,
      contact_name: contactName,
      recipient: activeChannel === 'EMAIL' ? email : phone,
      channel: activeChannel,
      message_body: messageBody,
      reel_id: activeTab === 'PROMOTE' ? selectedReel?.id : undefined,
      reel_title: activeTab === 'PROMOTE' ? selectedReel?.title : undefined
    });
    setSending(false);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl text-left text-xs text-slate-200">
        
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <MessageCircle className="w-3 h-3 text-brand-400" /> Direct Communication Panel
            </div>
            <h2 className="text-lg font-extrabold text-white mt-1 font-display">
              Contact {contactName}
            </h2>
            <div className="text-slate-400 text-[11px] font-mono">
              Phone: {phone} • Email: {email}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CHANNEL & MODE TABS */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          {/* Main Action Mode: Message vs Promote Reel */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('MESSAGE')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all text-xs inline-flex items-center justify-center gap-1.5 ${
                activeTab === 'MESSAGE' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> 1-on-1 Direct Message
            </button>
            <button
              onClick={() => setActiveTab('PROMOTE')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all text-xs inline-flex items-center justify-center gap-1.5 ${
                activeTab === 'PROMOTE' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" /> Promote Video Reel
            </button>
          </div>

          {/* Channel Selector */}
          <div className="flex gap-2">
            {[
              { id: 'WHATSAPP', label: '💬 WhatsApp Business', icon: MessageCircle, color: 'text-green-400 border-green-500/30' },
              { id: 'EMAIL', label: '✉ Email Direct', icon: Mail, color: 'text-brand-400 border-brand-500/30' },
              { id: 'SMS', label: '📱 Cellular SMS', icon: Phone, color: 'text-amber-400 border-amber-500/30' }
            ].map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id as CommunicationChannel)}
                className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-bold transition-all inline-flex items-center justify-center gap-1.5 ${
                  activeChannel === ch.id
                    ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isSent ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-white font-display">Message Dispatched!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Logged to CRM timeline for {contactName} via {activeChannel}.
              </p>
            </div>
          ) : (
            <>
              {/* TAB CONTENT 1: PROMOTE REEL SELECTOR */}
              {activeTab === 'PROMOTE' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                      <Video className="w-3.5 h-3.5" /> Attach Video Reel from Reel Library
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{reels.length} Reels Available</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {reels.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => handleReelSelect(reel)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                          selectedReel?.id === reel.id
                            ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="h-20 rounded-lg overflow-hidden relative bg-black">
                          <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>
                        <div className="font-bold text-white truncate text-[11px]">{reel.title}</div>
                        <div className="text-[10px] text-amber-400 font-mono">{reel.category} • {reel.duration_seconds}s</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TEMPLATE PICKER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300 text-xs">Quick Templates</label>
                  <span className="text-[10px] text-slate-400 font-mono">Variables Auto-Filled</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {templates.filter(t => t.channel === activeChannel || t.channel === 'WHATSAPP').map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => handleTemplateSelect(tpl)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                        selectedTemplate?.id === tpl.id
                          ? 'bg-brand-600 text-white border-brand-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE TEXTAREA */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 text-xs block">Message Content</label>
                <textarea
                  rows={6}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Type custom message..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-xs focus:outline-none focus:border-brand-500 font-sans leading-relaxed"
                />
              </div>

              {/* LIVE MESSAGE PREVIEW CARD */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Live Recipient Preview ({activeChannel})
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                  {messageBody}
                </div>
              </div>

              {/* OPTIONAL SCHEDULER */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 text-xs block">Schedule Dispatch (Optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
                />
              </div>
            </>
          )}
        </div>

        {/* DRAWER FOOTER */}
        {!isSent && (
          <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-between items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={sending || !messageBody.trim()}
              className="px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              {sending ? 'Dispatching...' : scheduledDate ? 'Schedule Message ⏰' : `Send via ${activeChannel} →`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
