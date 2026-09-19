import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Calendar, MapPin, CheckCircle2, User, Users, Video, Award, Sparkles, Send, ArrowRight } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

let evtRegCounter = 108;

export const EventRegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Fashion Pageant & Modeling Contest';

  const [formData, setFormData] = useState({
    participant_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    age: '',
    gender: 'Female',
    city: 'Dehradun',
    state: 'Uttarakhand',
    event_category: initialCategory,
    entry_type: 'Solo Participant', // 'Solo Participant' | 'Team / Group Entry'
    team_name: '',
    team_size: '1',
    portfolio_url: '',
    tshirt_size: 'M',
    experience_level: 'Amateur / Beginner',
    message: '',
    terms_consent: true
  });

  const [regStatus, setRegStatus] = useState<{ submitted: boolean; regId?: string }>({ submitted: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.participant_name || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    evtRegCounter += 1;
    const year = new Date().getFullYear();
    const regId = `EVT-REG-${year}-${String(evtRegCounter).padStart(5, '0')}`;

    // Create lead record for CRM processing
    await leadService.createLead({
      first_name: formData.participant_name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.team_name ? `Team: ${formData.team_name}` : 'Individual Participant',
      service_interest: `Event Reg: ${formData.event_category}`,
      budget_range: 'Event Entry',
      message: `Category: ${formData.event_category}, Entry: ${formData.entry_type}, City: ${formData.city}, Portfolio: ${formData.portfolio_url || 'N/A'}, Notes: ${formData.message}`,
      source_name: 'Event Registration Form'
    });

    setIsSubmitting(false);
    setRegStatus({ submitted: true, regId });
  };

  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* HEADER BANNER */}
      <div className="text-center space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
          <Calendar className="w-3.5 h-3.5" /> Official Event Participant Entry 2026
        </div>
        <h1 className="text-3xl sm:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
          Register For Upcoming Events
        </h1>
        <p className="text-zinc-400 text-xs sm:text-base max-w-2xl mx-auto">
          Participate in Uttarakhand’s premier fashion pageants, dance championships, rap battles, music festivals, and corporate summits powered by Velametric & Destiny Productions.
        </p>
      </div>

      {/* REGISTRATION FORM CONTAINER */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl space-y-8">
        
        {regStatus.submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-xl">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase">Registration Confirmed!</h2>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto">
                Your participant registration pass has been generated. Your registration ID is:
              </p>
              <div className="text-amber-400 font-mono text-xl sm:text-2xl font-black tracking-widest bg-zinc-950 py-3 px-6 rounded-2xl border border-zinc-800 inline-block mt-2">
                {regStatus.regId}
              </div>
            </div>

            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              Our event coordination team will contact you via Phone / WhatsApp within 24 hours with audition dates, venue guidelines, and timing details.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setRegStatus({ submitted: false })}
                className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl"
              >
                Register Another Participant
              </button>
              <Link
                to="/portfolio"
                className="px-8 py-3.5 rounded-full bg-zinc-950 text-white font-extrabold text-xs uppercase tracking-wider border border-zinc-800 hover:bg-zinc-800 transition-all"
              >
                Explore Video Reels & Shows
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-base sm:text-xs">
            
            {/* SECTION 1: PARTICIPANT IDENTITY */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-2">
                <User className="w-4 h-4" /> 1. Participant Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.participant_name}
                    onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Age *</label>
                  <input
                    type="number"
                    required
                    min="12"
                    max="60"
                    placeholder="e.g. 22"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dehradun / Uttarkashi / Rishikesh"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: EVENT SELECTION & PARTICIPATION TYPE */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Award className="w-4 h-4" /> 2. Event & Category Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Target Event Category *</label>
                  <select
                    value={formData.event_category}
                    onChange={(e) => setFormData({ ...formData, event_category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Fashion Pageant & Modeling Contest">Fashion Pageant & Modeling Contest</option>
                    <option value="National Dance Championship">National Dance Championship</option>
                    <option value="Himalayan Rap Battle & Hip-Hop League">Himalayan Rap Battle & Hip-Hop League</option>
                    <option value="Live Music & Band Showcase">Live Music & Band Showcase</option>
                    <option value="Youth Cultural & Performing Arts">Youth Cultural & Performing Arts Showcase</option>
                    <option value="Corporate Leadership & FinTech Summit">Corporate Leadership & FinTech Summit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Entry Format *</label>
                  <select
                    value={formData.entry_type}
                    onChange={(e) => setFormData({ ...formData, entry_type: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Solo Participant">Solo / Individual Entry</option>
                    <option value="Team / Group Entry">Team / Group Entry</option>
                  </select>
                </div>

                {formData.entry_type === 'Team / Group Entry' && (
                  <>
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-2 text-xs">Team / Crew Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Himalayan Rockers"
                        value={formData.team_name}
                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-2 text-xs">Total Members</label>
                      <input
                        type="number"
                        min="2"
                        max="30"
                        value={formData.team_size}
                        onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">Performance Level</label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Amateur / Beginner">Amateur / Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Professional / Semi-Pro">Professional / Semi-Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2 text-xs">T-Shirt / Merch Size</label>
                  <select
                    value={formData.tshirt_size}
                    onChange={(e) => setFormData({ ...formData, tshirt_size: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: PORTFOLIO & AUDITION LINK */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Video className="w-4 h-4" /> 3. Audition Video / Reel Portfolio
              </h3>

              <div>
                <label className="block text-zinc-300 font-semibold mb-2 text-xs">Instagram Reel / YouTube / Drive Link</label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/reel/... or YouTube video link"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-2 text-xs">Additional Information / Bio Notes</label>
                <textarea
                  rows={3}
                  placeholder="Mention previous awards, dance styles, rap achievements, or special requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* CONSENT & SUBMIT */}
            <div className="pt-4 space-y-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="evtConsent"
                  checked={formData.terms_consent}
                  onChange={(e) => setFormData({ ...formData, terms_consent: e.target.checked })}
                  className="accent-white"
                />
                <label htmlFor="evtConsent" className="text-zinc-400 text-[11px]">
                  I declare that the information provided is accurate and agree to the Event Guidelines & Rules.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full text-black font-extrabold bg-white hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing Registration...' : 'Complete Event Registration →'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
