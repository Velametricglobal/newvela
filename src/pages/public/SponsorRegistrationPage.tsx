import React, { useState } from 'react';
import { ShieldCheck, Award, Sparkles, Building2, CheckCircle2, Star, Calendar, Mail, Phone, ArrowRight, Download, Share2 } from 'lucide-react';
import { leadService } from '../../services/leadService';

export const SponsorRegistrationPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sponsorId, setSponsorId] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    brand_name: '',
    industry: 'Technology & IT',
    contact_name: '',
    designation: '',
    email: '',
    phone: '',
    website: '',
    event_interest: 'Uttarakhand Mega Youth Fashion & Music Summit 2026',
    sponsorship_tier: 'Title Sponsor (₹10L - ₹50L)',
    budget_range: '₹5,00,000 - ₹15,00,000',
    deliverables: ['Main Stage Branding & Backdrop Logo', 'On-Site Stall / Experience Booth', 'Digital Promotional Video Reels'],
    custom_notes: ''
  });

  const handleDeliverableToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.deliverables.includes(item);
      if (exists) {
        return { ...prev, deliverables: prev.deliverables.filter((d) => d !== item) };
      } else {
        return { ...prev, deliverables: [...prev.deliverables, item] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedId = `SPON-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await leadService.createLead({
        first_name: formData.contact_name,
        last_name: `(${formData.designation || 'Sponsor'})`,
        email: formData.email,
        phone: formData.phone,
        company_name: `${formData.company_name} [Brand: ${formData.brand_name || formData.company_name}]`,
        service_interest: `Event Sponsorship: ${formData.sponsorship_tier}`,
        budget_range: formData.budget_range,
        message: `Sponsorship Request ID: ${generatedId}\nEvent: ${formData.event_interest}\nTier: ${formData.sponsorship_tier}\nDeliverables: ${formData.deliverables.join(', ')}\nNotes: ${formData.custom_notes}`,
        source_name: 'Sponsor Portal Form',
        campaign_name: 'Corporate Sponsorship Drive 2026'
      });
    } catch (err) {
      console.error(err);
    }

    setSponsorId(generatedId);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black py-12 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        
        {/* PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
            <Award className="w-4 h-4 text-amber-400" /> Official Corporate Sponsorship Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
            Become a Brand & Event Sponsor
          </h1>
          <p className="text-zinc-400 text-xs sm:text-base leading-relaxed">
            Partner with Velametric Global & Destiny Productions across mega youth summits, fashion pageants, music festivals, and corporate conclaves. Amplify your brand visibility to thousands of engaged attendees.
          </p>
        </div>

        {/* SPONSORSHIP BENEFIT HIGHLIGHT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center">
            <div className="text-3xl font-black text-amber-400 font-display">25,000+</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Live On-Site Footfall</div>
            <p className="text-zinc-400 text-xs">Direct brand exposure to youth, business leaders, and corporate delegates.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center">
            <div className="text-3xl font-black text-amber-400 font-display">5M+ Impression</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Digital & Reel Reach</div>
            <p className="text-zinc-400 text-xs">Viral 9:16 Instagram video reels, YouTube live streaming, and press PR releases.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center">
            <div className="text-3xl font-black text-amber-400 font-display">VIP Booths</div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Exclusive Lounge & Stalls</div>
            <p className="text-zinc-400 text-xs">Dedicated brand activation stalls, product sampling, and executive networking.</p>
          </div>
        </div>

        {/* SUBMISSION CONFIRMATION OR FORM */}
        {submitted ? (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-glow-amber">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold font-mono text-amber-400 uppercase tracking-widest">
                Sponsorship Application Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
                Thank You, {formData.company_name}!
              </h2>
              <p className="text-zinc-300 text-xs max-w-md mx-auto leading-relaxed">
                Your corporate sponsorship proposal has been generated. Our executive brand partnerships manager will review your submission and connect within 24 hours.
              </p>
            </div>

            {/* SPONSOR PASS RECEIPT CARD */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-3 font-mono text-xs max-w-md mx-auto">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Sponsor Pass ID:</span>
                <span className="text-amber-400 font-bold">{sponsorId}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Target Event:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{formData.event_interest}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Selected Tier:</span>
                <span className="text-emerald-400 font-bold">{formData.sponsorship_tier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Contact Officer:</span>
                <span className="text-white font-bold">{formData.contact_name} ({formData.phone})</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Sponsorship Pass
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto space-y-8">
            <div className="border-b border-zinc-800 pb-6 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase">
                Sponsor Registration & Proposal Request Form
              </h2>
              <p className="text-zinc-400 text-xs">
                Fill out your company details to receive our official Sponsorship Pitch Deck and Brand Engagement Docket.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* COMPANY DETAILS SECTION */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> 1. Company & Brand Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Company Registered Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Technologies Pvt Ltd"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Brand / Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Pay / Apex Energy"
                      value={formData.brand_name}
                      onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Industry / Industry Sector</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Technology & IT">Technology & IT</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="FMCG & Beverages">FMCG & Beverages</option>
                      <option value="Real Estate & Infrastructure">Real Estate & Infrastructure</option>
                      <option value="Education & Universities">Education & Universities</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Other">Other Category</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Company Website URL</label>
                    <input
                      type="url"
                      placeholder="https://company.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* CONTACT PERSON SECTION */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" /> 2. Authorized Representative Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Contact Representative Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Singh"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Marketing Director / CMO"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* EVENT & TIER SELECTION SECTION */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4" /> 3. Sponsorship Scope & Target Event
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Target Event / Summit *</label>
                    <select
                      value={formData.event_interest}
                      onChange={(e) => setFormData({ ...formData, event_interest: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value="Uttarakhand Mega Youth Fashion & Music Summit 2026">Uttarakhand Mega Youth Fashion & Music Summit 2026</option>
                      <option value="National Dance & Music Championship 2026">National Dance & Music Championship 2026</option>
                      <option value="Himalayan Rap Battle & Hip-Hop League">Himalayan Rap Battle & Hip-Hop League</option>
                      <option value="Corporate Leadership & FinTech Expo 2026">Corporate Leadership & FinTech Expo 2026</option>
                      <option value="All Annual Events & Strategic Brand Partnership">All Annual Events & Strategic Brand Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Sponsorship Category / Tier *</label>
                    <select
                      value={formData.sponsorship_tier}
                      onChange={(e) => setFormData({ ...formData, sponsorship_tier: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value="Title Sponsor (₹10L - ₹50L)">👑 Title Sponsor (₹10L - ₹50L)</option>
                      <option value="Powered By Co-Sponsor (₹5L - ₹10L)">🥇 Powered By Co-Sponsor (₹5L - ₹10L)</option>
                      <option value="Gold Partner (₹2.5L - ₹5L)">🥈 Gold Partner (₹2.5L - ₹5L)</option>
                      <option value="Silver / Stall Partner (₹1L - ₹2.5L)">🥉 Silver / Stall Partner (₹1L - ₹2.5L)</option>
                      <option value="Media & Beverage Partner (In-Kind)">🎁 Media & Beverage Partner (In-Kind)</option>
                    </select>
                  </div>
                </div>

                {/* DESIRED DELIVERABLES CHECKBOXES */}
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2">Requested Brand Deliverables & Perks</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Main Stage Branding & Backdrop Logo',
                      'On-Site Stall / Experience Booth',
                      'Digital Promotional Video Reels',
                      'VIP Passes & Executive Lounge Access',
                      'Certificate of Appreciation & Memento',
                      'Press Release & News Media Mention'
                    ].map((item) => {
                      const checked = formData.deliverables.includes(item);
                      return (
                        <div
                          key={item}
                          onClick={() => handleDeliverableToggle(item)}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                            checked
                              ? 'bg-amber-500/10 border-amber-400 text-white font-bold'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${checked ? 'bg-amber-400 text-black' : 'border border-zinc-700'}`}>
                            {checked ? '✓' : ''}
                          </div>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Additional Notes / Custom Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific sponsorship requirements or brand guidelines..."
                    value={formData.custom_notes}
                    onChange={(e) => setFormData({ ...formData, custom_notes: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs shadow-glow-amber transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Sponsorship Proposal Request →'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
