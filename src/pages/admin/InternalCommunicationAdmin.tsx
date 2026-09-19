import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, Send, Users, Hash, Shield, Bell, CheckCheck, Clock,
  Search, Paperclip, Smile, AlertCircle, Sparkles, Filter, Pin, Plus, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { delegationService, EmployeeProfile } from '../../services/delegationService';

interface ChatMessage {
  id: string;
  sender_code: string;
  sender_name: string;
  sender_role: string;
  department: string;
  avatar_color: string;
  channel_id: string; // 'general' | 'operations' | 'urgent' | 'events' or direct 'dm-USER_CODE'
  content: string;
  is_urgent?: boolean;
  is_pinned?: boolean;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user_codes
  created_at: string;
}

const CHANNELS = [
  { id: 'general', name: 'general-announcements', label: 'General Announcements', desc: 'Company-wide notices, milestone updates, and broadcasts', icon: Hash },
  { id: 'operations', name: 'operations-tasks', label: 'Operations & Execution', desc: 'Daily task coordination, project deliverables, and checklists', icon: Hash },
  { id: 'urgent', name: 'urgent-escalations', label: 'Urgent Escalations', desc: 'High-priority leads, emergency hospital calls, client blockers', icon: AlertCircle, badge: 'HOT' },
  { id: 'events', name: 'event-coordination', label: 'Event Staging & Logistics', desc: 'Venue riders, soundcheck schedules, pass validation', icon: Hash },
];

const STORAGE_KEY = 'VELAMETRIC_INTERNAL_MESSAGES_STORE';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender_code: 'SUPERADMIN-001',
    sender_name: 'Super Admin',
    sender_role: 'Platform Owner',
    department: 'Executive Governance',
    avatar_color: 'from-amber-500 to-yellow-600',
    channel_id: 'general',
    content: 'Welcome everyone to the unified internal team workspace. All department task assignments and priority updates are synced here.',
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'msg-2',
    sender_code: 'SALES-001',
    sender_name: 'Rahul Sharma',
    sender_role: 'Sales Executive',
    department: 'Sales & Growth',
    avatar_color: 'from-amber-500 to-orange-600',
    channel_id: 'operations',
    content: 'Just closed the DHCS Phase 2 medical agreement with Amit Rana. Invoicing has been submitted to client billing.',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'msg-3',
    sender_code: 'EVENT-001',
    sender_name: 'Priya Patel',
    sender_role: 'Event Manager',
    department: 'Event Logistics',
    avatar_color: 'from-rose-500 to-red-600',
    channel_id: 'events',
    content: 'Town Hall soundcheck for Dehradun Tech Expo is locked in for 3:00 PM tomorrow. Pass badges have been dispatched to attendees.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'msg-4',
    sender_code: 'MARKETING-001',
    sender_name: 'Amit Verma',
    sender_role: 'Marketing Director',
    department: 'Marketing & Outreach',
    avatar_color: 'from-purple-500 to-pink-600',
    channel_id: 'urgent',
    content: 'Incoming high-ticket quote request for luxury resort staging from Mussoorie. Priority tagged as HIGH.',
    is_urgent: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'msg-5',
    sender_code: 'VIEWER-001',
    sender_name: 'Neha Gupta',
    sender_role: 'Operations Associate',
    department: 'Operations & Execution',
    avatar_color: 'from-emerald-500 to-teal-600',
    channel_id: 'operations',
    content: 'Checked off all 5 morning assigned tasks in the Employee Action Checklist. Ready for next allocations.',
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

export const InternalCommunicationAdmin: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTarget, setActiveTarget] = useState<{ type: 'CHANNEL' | 'DM'; id: string; name: string }>({
    type: 'CHANNEL',
    id: 'general',
    name: '#general-announcements'
  });
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('vela-chat-updated', handleUpdate);
    return () => window.removeEventListener('vela-chat-updated', handleUpdate);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTarget]);

  const loadData = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
      setMessages(INITIAL_MESSAGES);
    } else {
      try {
        setMessages(JSON.parse(raw));
      } catch {
        setMessages(INITIAL_MESSAGES);
      }
    }
    setEmployees(delegationService.getEmployees());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentUserId = currentUser?.user_code || 'STAFF-001';
  const currentUserName = currentUser?.full_name || 'Staff Member';
  const currentUserRole = currentUser?.role || 'EMPLOYEE';
  const currentDept = currentUser?.department || 'Operations';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    let targetChannelId = activeTarget.id;
    if (activeTarget.type === 'DM') {
      // canonical DM id between 2 users
      const sorted = [currentUserId, activeTarget.id].sort();
      targetChannelId = `dm-${sorted[0]}-${sorted[1]}`;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_code: currentUserId,
      sender_name: currentUserName,
      sender_role: currentUserRole,
      department: currentDept,
      avatar_color: 'from-emerald-500 to-teal-600',
      channel_id: targetChannelId,
      content: inputContent.trim(),
      is_urgent: isUrgent,
      created_at: new Date().toISOString()
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vela-chat-updated', { detail: newMsg }));

    setInputContent('');
    setIsUrgent(false);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    const updated = messages.map(msg => {
      if (msg.id !== msgId) return msg;
      const reactions = { ...(msg.reactions || {}) };
      const users = reactions[emoji] || [];
      if (users.includes(currentUserId)) {
        reactions[emoji] = users.filter(u => u !== currentUserId);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...users, currentUserId];
      }
      return { ...msg, reactions };
    });

    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('vela-chat-updated'));
  };

  // Resolve messages for current view
  let activeFilterId = activeTarget.id;
  if (activeTarget.type === 'DM') {
    const sorted = [currentUserId, activeTarget.id].sort();
    activeFilterId = `dm-${sorted[0]}-${sorted[1]}`;
  }

  const currentMessages = messages.filter(m => {
    const matchesTarget = m.channel_id === activeFilterId;
    const matchesSearch = !search || m.content.toLowerCase().includes(search.toLowerCase()) || m.sender_name.toLowerCase().includes(search.toLowerCase());
    return matchesTarget && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* SIDEBAR: CHANNELS & DIRECT MESSAGES */}
      <div className="w-full md:w-72 lg:w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white font-display">
              <MessageCircle className="w-4 h-4 text-brand-400" />
              <span>Internal Staff Chat</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Staff & Department Hub</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chat messages..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Channels & DM Lists */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs no-scrollbar">
          
          {/* Department Channels */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5 flex items-center justify-between">
              <span>Department Channels</span>
              <span className="text-[9px] text-brand-400 font-mono">4</span>
            </div>
            <div className="space-y-1">
              {CHANNELS.map(ch => {
                const Icon = ch.icon;
                const isActive = activeTarget.type === 'CHANNEL' && activeTarget.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveTarget({ type: 'CHANNEL', id: ch.id, name: `#${ch.name}` })}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {ch.badge && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                        {ch.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Staff Messages */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5 flex items-center justify-between">
              <span>Direct Staff Chat</span>
              <span className="text-[9px] text-emerald-400 font-mono">{employees.length}</span>
            </div>
            <div className="space-y-1">
              {employees.map(emp => {
                const isMe = emp.user_code === currentUserId;
                const isActive = activeTarget.type === 'DM' && activeTarget.id === emp.user_code;
                return (
                  <button
                    key={emp.user_code}
                    onClick={() => setActiveTarget({ type: 'DM', id: emp.user_code, name: `@${emp.full_name}` })}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {emp.full_name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="truncate font-semibold text-slate-200 flex items-center gap-1">
                          <span>{emp.full_name}</span>
                          {isMe && <span className="text-[9px] text-slate-500">(You)</span>}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono truncate">{emp.department}</div>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current User Pill Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUserName.charAt(0)}
            </div>
            <div className="truncate text-xs">
              <div className="font-bold text-white truncate">{currentUserName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{currentUserId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CHAT CONVERSATION AREA */}
      <div className="flex-1 flex flex-col bg-slate-900 min-w-0">
        
        {/* Chat Stream Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold text-sm">
              {activeTarget.type === 'CHANNEL' ? '#' : '@'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>{activeTarget.name}</span>
                {activeTarget.type === 'CHANNEL' && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">Channel</span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {activeTarget.type === 'CHANNEL'
                  ? CHANNELS.find(c => c.id === activeTarget.id)?.desc
                  : 'Direct staff communication thread'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {currentMessages.length} Messages
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {currentMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-400" />
              <p className="font-medium">No messages in {activeTarget.name} yet.</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Start the conversation below.</p>
            </div>
          ) : (
            currentMessages.map(msg => {
              const isMe = msg.sender_code === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Sender Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {msg.sender_name.charAt(0)}
                  </div>

                  {/* Message Body */}
                  <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span className="font-bold text-slate-200">{msg.sender_name}</span>
                      <span className="text-[9px] text-slate-500">{msg.department}</span>
                      <span className="text-[9px] text-slate-600">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-md ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : msg.is_urgent
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-100 rounded-tl-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.is_urgent && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-300 mb-1">
                          <AlertCircle className="w-3 h-3" /> URGENT ESCALATION
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Reactions Bar */}
                    <div className={`flex items-center gap-1 pt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {msg.reactions && Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center gap-1 ${
                            users.includes(currentUserId)
                              ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[9px] font-bold">{users.length}</span>
                        </button>
                      ))}

                      {/* Quick Reaction Triggers */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-1">
                        {['👍', '✅', '🔥'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80">
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder={`Message ${activeTarget.name}...`}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium"
              />

              <button
                type="button"
                onClick={() => setIsUrgent(!isUrgent)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                  isUrgent
                    ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title="Mark as Urgent"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Urgent</span>
              </button>

              <button
                type="submit"
                disabled={!inputContent.trim()}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-500/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default InternalCommunicationAdmin;
