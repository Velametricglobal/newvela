import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Calendar, Sparkles, Laptop, MessageSquare } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductTrialForm, TrialProductId } from '../../components/public/ProductTrialForm';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || searchParams.get('subject') || 'Website & App Development';
  const initialMode = (searchParams.get('mode') === 'general' || searchParams.get('type') === 'general') ? 'general' : 'trial';

  const [formMode, setFormMode] = useState<'trial' | 'general'>(initialMode);
  const rawProduct = searchParams.get('product') || searchParams.get('p');
  const validProduct: TrialProductId = 
    rawProduct === 'education' || rawProduct === 'property-crm' || rawProduct === 'ecommerce' || rawProduct === 'custom-app' || rawProduct === 'news-portal'
      ? rawProduct
      : 'education';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: initialService,
    budget_range: '₹50,000–₹1 Lakh',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.email) return;

    setStatus('submitting');
    try {
      await leadService.createLead(formData);
      setStatus('success');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        service_interest: 'Website & App Development',
        budget_range: '₹50,000–₹1 Lakh',
        message: ''
      });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 border border-white/20 uppercase tracking-wider font-mono">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 font-display uppercase">
              Let's Discuss Your Project
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Have questions about our custom software development, digital growth marketing, media, video production, or financial consultancy offerings? Our team is available 24/7.
            </p>
          </div>

          {/* Interactive Calendar Booking Promo Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400/15 via-zinc-900 to-zinc-950 border border-amber-400/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-400 text-black font-extrabold uppercase">
                ⚡ 100% Free Call
              </span>
              <span className="text-xs text-amber-400 font-mono">Instant Confirmation</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Prefer a Live 1-on-1 Consultation?
              </h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Skip the back-and-forth emails. Pick a date and time slot on our interactive calendar to speak directly with our senior consultant.
              </p>
            </div>
            <Link
              to="/book-consultation"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/10 transform hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" /> Open Calendar & Book Call →
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase font-mono">Email Support</div>
                <div className="text-base font-bold text-white">hello@velametric.com</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase font-mono">Direct Line / WhatsApp</div>
                <div className="text-base font-bold text-white">+1 (800) 555-VELA</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-400 uppercase font-mono">Headquarters</div>
                <div className="text-base font-bold text-white">Dehradun, Uttarakhand & Regional Office: Joshiyara, Uttarkashi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column - Always top aligned */}
        <div id="contact-form-top" className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-zinc-950 p-1.5 border border-zinc-800">
            <button
              type="button"
              onClick={() => setFormMode('trial')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formMode === 'trial'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Product Free Trial & Demo (Dynamic)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormMode('general')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formMode === 'general'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Custom Project Inquiry / RFP</span>
            </button>
          </div>

          {formMode === 'trial' ? (
            <ProductTrialForm initialProductId={validProduct} />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 font-display">Send Us a Custom Project Inquiry</h2>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  Thank you! Your inquiry has been logged in our CRM. A sales manager will respond within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g. Anish"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g. Kapoor"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anish@company.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Apex Enterprise"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Service / Inquiry Interest *</label>
              <select
                value={formData.service_interest}
                onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Website & App Development">Website & App Development</option>
                <option value="Website & Real Estate CRM Platform">Website & Real Estate CRM Platform</option>
                <option value="Website & Institute of Distance Education CRM">Website & Institute of Distance Education CRM</option>
                <option value="E-Commerce Website with Integrated CRM">E-Commerce Website with Integrated CRM</option>
                <option value="Digital & Offline Marketing">Digital & Offline Marketing</option>
                <option value="Branding & Graphics">Branding & Graphics</option>
                <option value="Video Production & Reels">Video Production & Reels (Destiny, Dapflix, Ekraahee)</option>
                <option value="Media & PR">Media & PR</option>
                <option value="Government Subsidy Loan Advisory">Government Subsidy Loan Advisory (Up to 25% Refund)</option>
                <option value="Business Loans & Cash Credit">Business Loans & Cash Credit Facilities</option>
                <option value="General Inquiry">Other / General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Message & Specifications</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your requirements..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-full text-black font-extrabold bg-white hover:bg-zinc-200 shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {status === 'submitting' ? 'Submitting...' : 'Send Inquiry →'}
            </button>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export const QuoteRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Website & App Development';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    service_interest: initialService,
    budget_range: '₹50,000–₹1 Lakh',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await leadService.createLead(formData);
    setSubmitted(true);
  };

  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 text-amber-400 border border-white/20 uppercase tracking-wider font-mono">
          Custom Proposal Engine
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 font-display uppercase">
          Request a Custom Proposal
        </h1>
        <p className="text-zinc-400 text-xs sm:text-base">
          Fill out your project specifications to receive a tailored scope of work, timeline, and pricing breakdown.
        </p>
        <div className="mt-4">
          <Link
            to="/free-trial"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono hover:bg-amber-400/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Looking for ready software platforms? Start 14-Day Free Product Trial →</span>
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white font-display">Quote Request Received!</h2>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              Our team is preparing your customized proposal breakdown. You will receive an email confirmation shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-base sm:text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Estimated Budget</label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs"
                >
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
                  <option value="₹50,000–₹1 Lakh">₹50,000–₹1 Lakh</option>
                  <option value="₹1–5 Lakh">₹1–5 Lakh</option>
                  <option value="₹5 Lakh+">₹5 Lakh+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Selected Service / Interest *</label>
              <select
                value={formData.service_interest}
                onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Website & App Development">Website & App Development</option>
                <option value="Website & Real Estate CRM Platform">Website & Real Estate CRM Platform</option>
                <option value="Website & Institute of Distance Education CRM">Website & Institute of Distance Education CRM</option>
                <option value="E-Commerce Website with Integrated CRM">E-Commerce Website with Integrated CRM</option>
                <option value="Digital & Offline Marketing">Digital & Offline Marketing</option>
                <option value="Branding & Graphics">Branding & Graphics</option>
                <option value="Video Production & Reels">Video Production & Reels (Destiny, Dapflix, Ekraahee)</option>
                <option value="Media & PR">Media & PR</option>
                <option value="Government Subsidy Loan Advisory">Government Subsidy Loan Advisory (Up to 25% Refund)</option>
                <option value="Business Loans & Cash Credit">Business Loans & Cash Credit Facilities</option>
                <option value="General Inquiry">Other / General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Project Scope Details</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your requirements, timeline, or objectives..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-base sm:text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full text-black font-extrabold bg-white hover:bg-zinc-200 transition-all text-xs uppercase tracking-wider"
            >
              Generate Quote Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
