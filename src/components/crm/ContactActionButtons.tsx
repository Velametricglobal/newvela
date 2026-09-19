import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Megaphone, CheckCircle2, Clock, X } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { CallOutcome } from '../../types/database.types';

interface ContactActionButtonsProps {
  contactName: string;
  phone?: string;
  email?: string;
  contactId?: string;
  serviceInterest?: string;
  companyName?: string;
  onOpenMessageDrawer?: (params: { contactName: string; phone?: string; email?: string; contactId?: string; initialChannel?: 'WHATSAPP' | 'EMAIL' | 'SMS'; initialTab?: 'MESSAGE' | 'PROMOTE' }) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ContactActionButtons: React.FC<ContactActionButtonsProps> = ({
  contactName,
  phone = '+91 9876543210',
  email,
  contactId,
  serviceInterest,
  companyName,
  onOpenMessageDrawer,
  size = 'md'
}) => {
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [callOutcome, setCallOutcome] = useState<CallOutcome>('ANSWERED');
  const [callNotes, setCallNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [callLogged, setCallLogged] = useState(false);

  const normalizedPhone = communicationService.normalizePhone(phone);

  const handleCallClick = () => {
    // Open native tel link
    window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
    // Open Log Call Modal Prompt
    setShowCallLogModal(true);
  };

  const handleSaveCallLog = async () => {
    await communicationService.logCall({
      contact_id: contactId,
      contact_name: contactName,
      phone,
      outcome: callOutcome,
      notes: callNotes,
      next_follow_up: nextFollowUp
    });
    setCallLogged(true);
    setTimeout(() => {
      setShowCallLogModal(false);
      setCallLogged(false);
      setCallNotes('');
    }, 1200);
  };

  const handleWhatsAppClick = () => {
    const waUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(`Hello ${contactName}, thank you for connecting with Velametric Global.`)}`;
    window.open(waUrl, '_blank');
  };

  const buttonSizeClass =
    size === 'sm' ? 'px-2 py-1 text-[10px] rounded-md gap-1' :
    size === 'lg' ? 'px-4 py-2 text-xs rounded-xl gap-2 font-bold' :
    'px-2.5 py-1.5 text-[11px] rounded-lg gap-1.5 font-bold';

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {/* 📞 CALL BUTTON */}
      <button
        onClick={handleCallClick}
        title={`Call ${contactName} (${phone})`}
        className={`bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-semibold inline-flex items-center ${buttonSizeClass}`}
      >
        <Phone className="w-3 h-3 shrink-0" /> Call
      </button>

      {/* 💬 WHATSAPP BUTTON */}
      <button
        onClick={handleWhatsAppClick}
        title={`WhatsApp ${contactName} (${phone})`}
        className={`bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 transition-all font-semibold inline-flex items-center ${buttonSizeClass}`}
      >
        <MessageCircle className="w-3 h-3 shrink-0 text-green-400" /> WhatsApp
      </button>

      {/* ✉ MESSAGE BUTTON */}
      <button
        onClick={() => onOpenMessageDrawer && onOpenMessageDrawer({ contactName, phone, email, contactId, initialChannel: 'WHATSAPP', initialTab: 'MESSAGE' })}
        title={`Send Message to ${contactName}`}
        className={`bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 transition-all font-semibold inline-flex items-center ${buttonSizeClass}`}
      >
        <Mail className="w-3 h-3 shrink-0 text-brand-400" /> Message
      </button>

      {/* 📣 PROMOTE BUTTON */}
      <button
        onClick={() => onOpenMessageDrawer && onOpenMessageDrawer({ contactName, phone, email, contactId, initialChannel: 'WHATSAPP', initialTab: 'PROMOTE' })}
        title={`Promote Reel to ${contactName}`}
        className={`bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all font-semibold inline-flex items-center ${buttonSizeClass}`}
      >
        <Megaphone className="w-3 h-3 shrink-0 text-amber-400" /> Promote
      </button>

      {/* POST-CALL LOG PROMPT MODAL */}
      {showCallLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Log Call Activity</h3>
                <p className="text-xs text-slate-400">{contactName} ({phone})</p>
              </div>
              <button onClick={() => setShowCallLogModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {callLogged ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Call Activity Logged!</h4>
                <p className="text-xs text-slate-400">Added to lead timeline.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Call Outcome</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { outcome: 'ANSWERED', label: '✓ Answered' },
                      { outcome: 'NO_ANSWER', label: '✕ No Answer' },
                      { outcome: 'BUSY', label: '⏳ Busy' },
                      { outcome: 'CALLBACK_REQUESTED', label: '📞 Callback Requested' }
                    ].map((opt) => (
                      <button
                        key={opt.outcome}
                        type="button"
                        onClick={() => setCallOutcome(opt.outcome as CallOutcome)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                          callOutcome === opt.outcome
                            ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Call Notes / Discussion Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Enter call notes or discussion summary..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Next Follow-up Date (Optional)</label>
                  <input
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCallLogModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Skip Logging
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCallLog}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow-brand"
                  >
                    Save Call Log →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
