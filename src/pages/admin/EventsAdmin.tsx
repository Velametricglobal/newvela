import React, { useState } from 'react';
import { Calendar, Users, CheckCircle2, Clock, Video, Award, Search, Filter, Download, Plus, Sparkles, ExternalLink, Mail, Phone, ShieldCheck, Trash2 } from 'lucide-react';

interface ParticipantRegistration {
  id: string;
  reg_id: string;
  participant_name: string;
  email: string;
  phone: string;
  city: string;
  event_category: string;
  entry_type: string;
  team_name?: string;
  team_size?: string;
  portfolio_url?: string;
  tshirt_size: string;
  experience_level: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN';
  created_at: string;
}

const mockRegistrations: ParticipantRegistration[] = [
  {
    id: 'reg-108',
    reg_id: 'EVT-REG-2026-00108',
    participant_name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 9876543210',
    city: 'Dehradun',
    event_category: 'Fashion Pageant & Modeling Contest',
    entry_type: 'Solo Participant',
    tshirt_size: 'M',
    experience_level: 'Intermediate',
    portfolio_url: 'https://instagram.com/reel/demo123',
    status: 'APPROVED',
    created_at: '2026-08-28T14:30:00Z'
  },
  {
    id: 'reg-107',
    reg_id: 'EVT-REG-2026-00107',
    participant_name: 'Aanya Verma',
    email: 'aanya.verma@domain.com',
    phone: '+91 9876543211',
    city: 'Uttarkashi',
    event_category: 'National Dance Championship',
    entry_type: 'Team / Group Entry',
    team_name: 'Himalayan Rockers Crew',
    team_size: '6 Members',
    tshirt_size: 'L',
    experience_level: 'Professional',
    portfolio_url: 'https://youtube.com/watch?v=demo456',
    status: 'PENDING',
    created_at: '2026-08-28T11:15:00Z'
  },
  {
    id: 'reg-106',
    reg_id: 'EVT-REG-2026-00106',
    participant_name: 'Karan Mehra',
    email: 'karan.rap@domain.com',
    phone: '+91 9876543212',
    city: 'Rishikesh',
    event_category: 'Himalayan Rap Battle & Hip-Hop League',
    entry_type: 'Solo Participant',
    tshirt_size: 'XL',
    experience_level: 'Intermediate',
    portfolio_url: 'https://instagram.com/reel/rap789',
    status: 'APPROVED',
    created_at: '2026-08-27T18:45:00Z'
  },
  {
    id: 'reg-105',
    reg_id: 'EVT-REG-2026-00105',
    participant_name: 'Priya Joshi',
    email: 'priya.j@domain.com',
    phone: '+91 9876543213',
    city: 'Haridwar',
    event_category: 'Live Music & Band Showcase',
    entry_type: 'Team / Group Entry',
    team_name: 'Echoes of Garhwal',
    team_size: '4 Members',
    tshirt_size: 'M',
    experience_level: 'Professional',
    portfolio_url: 'https://youtube.com/watch?v=music101',
    status: 'CHECKED_IN',
    created_at: '2026-08-26T09:20:00Z'
  }
];

export const EventsAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PARTICIPANTS' | 'EVENTS_LIST' | 'SPONSORS'>('PARTICIPANTS');
  const [registrations, setRegistrations] = useState<ParticipantRegistration[]>(mockRegistrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Action handlers
  const handleUpdateStatus = (id: string, newStatus: ParticipantRegistration['status']) => {
    setRegistrations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch =
      reg.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.reg_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.team_name && reg.team_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || reg.event_category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Calendar className="w-3.5 h-3.5" /> Backend Event Command Center
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2 font-display uppercase">
            Events & Participant Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage contestant registrations, audition video reviews, ticket passes, live schedule countdowns, and sponsor partnerships.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('PARTICIPANTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PARTICIPANTS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Contestant Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('EVENTS_LIST')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'EVENTS_LIST' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Events & Schedule
          </button>
          <button
            onClick={() => setActiveTab('SPONSORS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SPONSORS' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sponsors & Partners
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Total Contestants <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">108</div>
          <div className="text-[11px] text-emerald-400 font-medium">↑ +14 new registrations today</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Approved Pass Holders <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-display">64</div>
          <div className="text-[11px] text-slate-400 font-medium">Audition pass issued</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Pending Auditions <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-display">38</div>
          <div className="text-[11px] text-amber-300 font-medium">Video reel review required</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            Event Pass Revenue <Award className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">₹1,85,000</div>
          <div className="text-[11px] text-slate-400 font-medium">Entry fee collections</div>
        </div>
      </div>

      {/* TAB 1: PARTICIPANTS TABLE */}
      {activeTab === 'PARTICIPANTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search participant, ID, city, team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Fashion Pageant & Modeling Contest">Fashion Pageant</option>
                <option value="National Dance Championship">Dance Championship</option>
                <option value="Himalayan Rap Battle & Hip-Hop League">Rap Battle</option>
                <option value="Live Music & Band Showcase">Live Music</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CHECKED_IN">Checked-In</option>
              </select>

              <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-2">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Registration ID</th>
                  <th className="p-3.5">Participant</th>
                  <th className="p-3.5">Category & Entry</th>
                  <th className="p-3.5">City</th>
                  <th className="p-3.5">Audition Reel</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{reg.reg_id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{reg.participant_name}</div>
                      <div className="text-[11px] text-slate-400">{reg.phone} | {reg.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{reg.event_category}</div>
                      <div className="text-[11px] text-brand-400 font-mono">
                        {reg.entry_type} {reg.team_name ? `(${reg.team_name})` : ''}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{reg.city}</td>
                    <td className="p-3.5">
                      {reg.portfolio_url ? (
                        <a
                          href={reg.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/30 transition-all"
                        >
                          <Video className="w-3 h-3" /> Watch Reel ↗
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No link</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono border ${
                        reg.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        reg.status === 'CHECKED_IN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {reg.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(reg.id, 'APPROVED')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition-all"
                        >
                          Approve Pass
                        </button>
                      )}
                      {reg.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(reg.id, 'CHECKED_IN')}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 transition-all"
                        >
                          Mark Checked-In
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${reg.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(reg.participant_name)},%20your%20registration%20(${reg.reg_id})%20for%20the%20${encodeURIComponent(reg.event_category)}%20has%20been%20approved!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        WhatsApp 💬
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE EVENTS LIST & SCHEDULE */}
      {activeTab === 'EVENTS_LIST' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white font-display">Active Live Events List</h2>
            <button className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="h-40 rounded-xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80" alt="Event" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-rose-500 text-black font-extrabold text-[10px] uppercase font-mono px-2.5 py-1 rounded-full">
                  LIVE REGISTRATION
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">Uttarakhand Mega Youth Fashion & Music Summit 2026</h3>
                <p className="text-slate-400 text-xs mt-1">Venue: Arena Ground, Dehradun | Date: Oct 15, 2026</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                <span className="text-emerald-400 font-bold">108 Registrations Logged</span>
                <button className="text-brand-400 hover:underline font-bold">Edit Details ✏️</button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 opacity-75">
              <div className="h-40 rounded-xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80" alt="Event" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-amber-500 text-black font-extrabold text-[10px] uppercase font-mono px-2.5 py-1 rounded-full">
                  UPCOMING DEC 2026
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">Himalayan Rap Battle & Hip-Hop League</h3>
                <p className="text-slate-400 text-xs mt-1">Venue: Uttarkashi Open Stadium | Date: Dec 05, 2026</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-bold">Auditions Open Oct 1</span>
                <button className="text-brand-400 hover:underline font-bold">Edit Details ✏️</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SPONSORS & BRAND PARTNERS */}
      {activeTab === 'SPONSORS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white font-display">Event Sponsorship & Brand Inquiries</h2>
          <p className="text-slate-400 text-xs">Corporate brands inquiring for title sponsorship, booth stalls, and banner partnerships.</p>

          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3.5">Sponsor Brand</th>
                  <th className="p-3.5">Contact Person</th>
                  <th className="p-3.5">Budget Tier</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">Himalayan Beverage Corp</td>
                  <td className="p-3.5">Vikram Rathore (+91 9812345678)</td>
                  <td className="p-3.5 font-mono text-amber-400">Title Sponsor (₹5,000,000)</td>
                  <td className="p-3.5"><span className="text-emerald-400 font-bold">Proposal Sent</span></td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">Aura Apparel Group</td>
                  <td className="p-3.5">Neha Kapoor (+91 9898765432)</td>
                  <td className="p-3.5 font-mono text-amber-400">Fashion Partner (₹2,500,000)</td>
                  <td className="p-3.5"><span className="text-amber-400 font-bold">Negotiating</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
