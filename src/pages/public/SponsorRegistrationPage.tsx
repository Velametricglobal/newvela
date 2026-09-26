import React, { useState } from 'react';
import { 
  ShieldCheck, Award, Sparkles, Building2, CheckCircle2, Star, Calendar, Mail, Phone, 
  ArrowRight, Download, Share2, MapPin, Users, Globe, Newspaper, Flame, Eye, Music, 
  Crown, Zap, Mic2, Shirt, MessageCircle, FileText, Check
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { useSiteSettings } from '../../services/settingsService';

export const SponsorRegistrationPage: React.FC = () => {
  const siteSettings = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sponsorId, setSponsorId] = useState('');
  const [copiedProposal, setCopiedProposal] = useState(false);

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
    sponsorship_tier: 'Title Sponsor (Exclusive Partner)',
    budget_range: '₹10,00,000 - ₹25,00,000',
    deliverables: [
      'Main Stage Branding & Naming Rights', 
      'On-Site Experience Booth at Arena Ground', 
      'Weekly Eye News & 52 Garh Samachar Media Features',
      'Viral 9:16 Instagram Video Reels & Digital Spotlight'
    ],
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

  const handleCopyProposal = () => {
    const proposalText = `# UTTARAKHAND MEGA YOUTH FASHION & MUSIC SUMMIT 2026
"Where Culture Meets the Future"
Presented & Organized by: Hemchandra Purohit (Velametric) & Destiny Productions
Official Media Partners: Weekly Eye News & 52 Garh Samachar

1. EVENT SCALE & CORE ATTRACTIONS
• Expected Footfall: 5,000+ Attendees (Ages 16-35)
• Location: Arena Ground, Dehradun, Uttarakhand
• Highlights: Main Stage Concerts, State Fashion Pageant, Underground Rap Battles, Brand Experience Zones

2. MEDIA & PR POWERHOUSE
• Weekly Eye News: 10,000 weekly print copies across 4 States (UK, UP, Delhi, MH) reaching top bureaucrats & ministers
• 52 Garh Samachar: 7 Million+ monthly social reach on Instagram & 100k+ web visitors

3. SPONSORSHIP TIERS
• Title Sponsor (Exclusive Partner): Full naming rights, front-page media PR, prime main stage logo & central stall
• Co-Sponsor / Powered-By Partner: Secondary screens, editorial coverage, sampling stall & VIP stakeholder access
• Zone / Stage Partner (Fashion, Rap Battle, or Chill Zone): Complete zone naming, targeted youth interaction & dedicated reels

4. SPONSOR ROI
• Dual-Market Dominance (Ministers & Bureaucrats + 7M+ Digital Youth)
• 4K Video Assets & Influencer Content Generation
• Direct Sales & 5,000+ In-Person Lead Interactions`;

    navigator.clipboard.writeText(proposalText);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 3000);
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
        service_interest: `Summit Sponsorship: ${formData.sponsorship_tier}`,
        budget_range: formData.budget_range,
        message: `Sponsorship Request ID: ${generatedId}\nEvent: ${formData.event_interest}\nTier: ${formData.sponsorship_tier}\nDeliverables: ${formData.deliverables.join(', ')}\nNotes: ${formData.custom_notes}`,
        source_name: 'Sponsor Portal Form',
        campaign_name: 'Uttarakhand Mega Youth Summit 2026'
      });
    } catch (err) {
      console.error(err);
    }

    setSponsorId(generatedId);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = (siteSettings?.contact_whatsapp || siteSettings?.contact_phone || '+918679766348').replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-black py-12 sm:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-16">
        
        {/* HERO SPONSORSHIP BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Official Sponsorship Proposal & Docket
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
              UTTARAKHAND MEGA YOUTH <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                FASHION & MUSIC SUMMIT 2026
              </span>
            </h1>
            <p className="text-base sm:text-xl font-bold italic text-zinc-300 font-display">
              "Where Culture Meets the Future"
            </p>
          </div>

          {/* ORGANIZERS & MEDIA PARTNERS CREDITS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
            <div className="px-4 py-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">Presented & Organized by:</span>
              <span className="text-white font-bold">Hemchandra Purohit (Velametric) & Destiny Productions</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-2">
              <Newspaper className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-300">Official Media Partners:</span>
              <span className="text-amber-400 font-bold">Weekly Eye News & 52 Garh Samachar</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#register-sponsor"
              className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2"
            >
              Apply for Sponsorship <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyProposal}
              className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              {copiedProposal ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              {copiedProposal ? 'Proposal Copied!' : 'Copy Proposal Text'}
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Hemchandra Purohit & Destiny Productions Team, I am interested in exploring Title/Co-Sponsorship for the Uttarakhand Mega Youth Fashion & Music Summit 2026.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Direct WhatsApp Desk
            </a>
          </div>
        </div>

        {/* 1. SCALE & CORE ATTRACTIONS STATS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Section 01 • Scale & Demographics
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Unrivaled Youth & Regional Footprint
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center hover:border-amber-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white font-display">5,000+</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Attendees</div>
              <p className="text-zinc-400 text-xs">Passionate Gen-Z & Millennials (Ages 16–35, College Students & Professionals).</p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center hover:border-amber-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white font-display">Arena Ground</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Dehradun, Uttarakhand</div>
              <p className="text-zinc-400 text-xs">Sprawling mega venue engineered for high-energy concerts, runways & stalls.</p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center hover:border-amber-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white font-display">7M+ Monthly</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">52 Garh Social Reach</div>
              <p className="text-zinc-400 text-xs">Massive Instagram viral reels power & 100,000+ monthly web visitors.</p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl space-y-2 text-center hover:border-amber-400/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white font-display">10,000 Print</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Weekly Eye 4-State Reach</div>
              <p className="text-zinc-400 text-xs">Delivered to ministers, bureaucrats & top decision-makers in UK, UP, Delhi, MH.</p>
            </div>
          </div>
        </div>

        {/* 2. UNMATCHED MEDIA & PR POWERHOUSE CARDS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Section 02 • Media Powerhouse
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Dual-Market Media & PR Dominance
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Sponsoring brands gain direct visibility into the corridors of administrative power as well as the pulse of youth digital culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WEEKLY EYE NEWS */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-display">Weekly Eye News</h3>
                    <p className="text-xs text-blue-400 font-mono">Elite Institutional & Multi-State Reach</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 font-mono">
                  4 States
                </span>
              </div>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>10,000 Weekly Copies:</strong> Circulated across Uttarakhand, Uttar Pradesh, Delhi NCR, and Maharashtra.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>High-Value Institutional Placement:</strong> Reaches directly into the homes and offices of top bureaucrats, key government ministers, and premier administrative decision-makers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Executive PR Coverage:</strong> Co-branded editorial coverage and official press release features for event sponsors.</span>
                </div>
              </div>
            </div>

            {/* 52 GARH SAMACHAR */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-display">52 Garh Samachar</h3>
                    <p className="text-xs text-pink-400 font-mono">Mass Digital & Youth Viral Network</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 font-mono">
                  7M+ Monthly
                </span>
              </div>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>7 Million+ Monthly Social Reach:</strong> Dominant Instagram reel engagement capturing the absolute pulse of Uttarakhand's youth.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>100,000+ Monthly Web Visitors:</strong> High digital recall, real-time portal updates, and continuous online sponsor highlights.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Influencer & Video Amplification:</strong> Dedicated 9:16 vertical video packages highlighting sponsor activations to millions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOUR CORE EVENT ATTRACTIONS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Section 03 • The Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              4 Mega Experiential Zones
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">1. Main Stage Concerts</h3>
              <p className="text-zinc-400 text-xs">Headline performances by prominent regional and national musical acts drawing thousands of cheering fans.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">2. State Fashion Pageant</h3>
              <p className="text-zinc-400 text-xs">High-fashion runway showcase featuring top models, celebrity jury members, and emerging designer lines.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                <Mic2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">3. Underground Rap Battles</h3>
              <p className="text-zinc-400 text-xs">High-voltage hip-hop cyphers and lyrical showdowns capturing massive youth and college engagement.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display uppercase">4. Brand Experience Zones</h3>
              <p className="text-zinc-400 text-xs">Interactive pop-up arenas, live product sampling stalls, gaming zones, and direct consumer engagement.</p>
            </div>
          </div>
        </div>

        {/* 4. SPONSORSHIP TIERS & BRAND BENEFITS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Section 04 • Sponsorship Packages
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Sponsorship Tiers & Deliverables
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* TIER 1: TITLE SPONSOR */}
            <div className="bg-gradient-to-b from-amber-400/15 via-zinc-900 to-zinc-950 border-2 border-amber-400 p-6 sm:p-8 rounded-3xl space-y-6 relative flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black font-mono flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> Exclusive Partner
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">Tier 1</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white font-display uppercase">Title Sponsor</h3>
                  <p className="text-xs text-amber-300 font-mono mt-1">Official Event Naming Privileges</p>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Naming Rights:</strong> "[Brand] presents Uttarakhand Mega Youth Fashion & Music Summit 2026, organized by Velametric & Destiny Productions".</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Prime On-Ground Presence:</strong> Maximum logo prominence on main stage backdrop, entrance arches, VIP passes & wristbands.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Elite Media PR Features:</strong> Co-branded front-page coverage in Weekly Eye News (bureaucratic reach) & 52 Garh (7M+ digital network).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Central Exhibition Stall:</strong> Large-format premium brand activation booth at Arena Ground.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Dedicated Social Spotlight:</strong> Dedicated promotional video campaigns across all organizer and media partner channels.</span>
                  </div>
                </div>
              </div>

              <a
                href="#register-sponsor"
                onClick={() => setFormData(p => ({ ...formData, sponsorship_tier: 'Title Sponsor (Exclusive Partner)' }))}
                className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider text-center block transition-all shadow-xl"
              >
                Select Title Sponsor Tier
              </a>
            </div>

            {/* TIER 2: CO-SPONSOR */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-amber-400 font-mono flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Powered-By
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400">Tier 2</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white font-display uppercase">Co-Sponsor</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Powered-By Strategic Partner</p>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Branding Prominence:</strong> Logo placement on secondary stage screens, side banners, and digital marketing materials.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Media Inclusion:</strong> Featured brand mentions and editorial PR coverage by Weekly Eye News & 52 Garh Samachar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>On-Ground Presence:</strong> Standard high-traffic exhibition and sampling booth at Arena Ground.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Corporate Perks:</strong> Exclusive VIP passes and backstage access for corporate executives.</span>
                  </div>
                </div>
              </div>

              <a
                href="#register-sponsor"
                onClick={() => setFormData(p => ({ ...formData, sponsorship_tier: 'Co-Sponsor / Powered-By Partner' }))}
                className="w-full py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
              >
                Select Co-Sponsor Tier
              </a>
            </div>

            {/* TIER 3: ZONE / STAGE PARTNER */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-300 font-mono flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> Targeted Activation
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-400">Tier 3</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white font-display uppercase">Zone / Stage Partner</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Fashion, Rap Arena, or Experience Zone</p>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Exclusive Zone Naming:</strong> Complete naming over a specific area (e.g., "[Your Brand] Rap Arena" or "[Your Brand] Fashion Runway").</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Niche Youth Engagement:</strong> Direct touchpoint with hip-hop fans, fashionistas, or gaming enthusiasts.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Reel & Signage Placement:</strong> Featured on zone-specific banners, digital reels, and photo backdrops.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Sampling & Direct Sales:</strong> Dedicated product showcase stall inside your named arena.</span>
                  </div>
                </div>
              </div>

              <a
                href="#register-sponsor"
                onClick={() => setFormData(p => ({ ...formData, sponsorship_tier: 'Zone / Stage Partner (Fashion, Rap Battle, or Chill Zone)' }))}
                className="w-full py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
              >
                Select Zone Partner Tier
              </a>
            </div>
          </div>
        </div>

        {/* 5. WHY PARTNER WITH US (SPONSOR ROI) */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-10 rounded-3xl space-y-6">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              Section 05 • High-Impact ROI
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white font-display uppercase">
              Why Partner With Us? (Proven Sponsor Returns)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <div className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" /> 1. Dual-Market Dominance
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Reach both high-level policy makers/bureaucrats (via Weekly Eye’s multi-state circulation) and the massive digital youth wave (via 52 Garh’s 7M+ monthly reach).
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 2. Content Generation
              </div>
              <p className="text-zinc-400 leading-relaxed">
                High-quality 4K video assets, professional photographs, and influencer-backed reels generated during the summit for your brand's year-round marketing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4" /> 3. Direct Sales & Qualified Leads
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Face-to-face interaction with 5,000+ high-intent consumers and institutional attendees ready to sample, purchase, and experience your offerings.
              </p>
            </div>
          </div>
        </div>

        {/* 6. SPONSORSHIP APPLICATION FORM */}
        <div id="register-sponsor" className="scroll-mt-12">
          {submitted ? (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-amber-400 text-black rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-xl">
                ✓
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold font-mono text-amber-400 uppercase tracking-widest">
                  Sponsorship Docket Generated
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
                  Thank You, {formData.company_name}!
                </h2>
                <p className="text-zinc-300 text-xs max-w-md mx-auto leading-relaxed">
                  Your corporate sponsorship proposal has been generated. Hemchandra Purohit and the Destiny Productions partnerships desk will review your submission and connect within 24 hours.
                </p>
              </div>

              {/* SPONSOR PASS RECEIPT CARD */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-3 font-mono text-xs max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Sponsor Pass ID:</span>
                  <span className="text-amber-400 font-bold">{sponsorId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Target Summit:</span>
                  <span className="text-white font-bold truncate max-w-[200px]">{formData.event_interest}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Selected Tier:</span>
                  <span className="text-amber-400 font-bold">{formData.sponsorship_tier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Representative:</span>
                  <span className="text-white font-bold">{formData.contact_name} ({formData.phone})</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Sponsorship Pass
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Hemchandra Purohit, I submitted Sponsorship Application ${sponsorId} for ${formData.company_name} under tier: ${formData.sponsorship_tier}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Confirm on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto space-y-8">
              <div className="border-b border-zinc-800 pb-6 space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono">
                  Sponsorship Registration & Docket Request
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white font-display uppercase">
                  Reserve Your Sponsorship Tier
                </h2>
                <p className="text-zinc-400 text-xs">
                  Fill out your corporate details to lock in your brand's presence across Uttarakhand's premier youth summit.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {/* 1. COMPANY DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> 1. Company & Brand Details
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
                      <label className="block text-zinc-300 font-semibold mb-1">Brand / Product Line Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Pay / Apex Energy"
                        value={formData.brand_name}
                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">Industry / Sector</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Technology & IT">Technology & IT / SaaS</option>
                        <option value="Finance & Banking">Finance & Banking / FinTech</option>
                        <option value="Fashion & Apparel">Fashion, Lifestyle & Apparel</option>
                        <option value="FMCG & Beverages">FMCG, Food & Beverages</option>
                        <option value="Real Estate & Infrastructure">Real Estate & Infrastructure</option>
                        <option value="Education & Universities">Education, EdTech & Universities</option>
                        <option value="Automotive & Mobility">Automotive & EV Mobility</option>
                        <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                        <option value="Other">Other Sector</option>
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

                {/* 2. REPRESENTATIVE CONTACT */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4" /> 2. Authorized Representative Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">Representative Full Name *</label>
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
                        placeholder="e.g. CMO / Head of Brand Marketing"
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

                {/* 3. TARGET EVENT & TIER SELECTION */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h3 className="text-sm font-bold text-amber-400 font-display uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4" /> 3. Target Event & Sponsorship Tier
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">Target Summit / Event *</label>
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
                      <label className="block text-zinc-300 font-semibold mb-1">Requested Sponsorship Tier *</label>
                      <select
                        value={formData.sponsorship_tier}
                        onChange={(e) => setFormData({ ...formData, sponsorship_tier: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                      >
                        <option value="Title Sponsor (Exclusive Partner)">👑 Title Sponsor (Exclusive Partner)</option>
                        <option value="Co-Sponsor / Powered-By Partner">🥇 Co-Sponsor / Powered-By Partner</option>
                        <option value="Zone / Stage Partner (Fashion Runway)">🥈 Fashion Runway Stage Partner</option>
                        <option value="Zone / Stage Partner (Rap Battle Arena)">🥉 Underground Rap Battle Arena Partner</option>
                        <option value="Brand Experience Stall Partner">⛺ Brand Experience Stall Partner</option>
                        <option value="Official Media / Beverage Partner">🎁 Media & Beverage In-Kind Partner</option>
                      </select>
                    </div>
                  </div>

                  {/* DESIRED DELIVERABLES CHECKBOXES */}
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-2">Requested Deliverables & Brand Perks</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Main Stage Branding & Naming Rights',
                        'On-Site Experience Booth at Arena Ground',
                        'Weekly Eye News & 52 Garh Samachar Media Features',
                        'Viral 9:16 Instagram Video Reels & Digital Spotlight',
                        'VIP Executive Passes & Backstage Access',
                        'Direct Product Sampling & On-Ground Sales Rights'
                      ].map((item) => {
                        const checked = formData.deliverables.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => handleDeliverableToggle(item)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                              checked
                                ? 'bg-amber-400/10 border-amber-400 text-white font-bold'
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
                    <label className="block text-zinc-300 font-semibold mb-1">Custom Brand Notes / Specific Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Specify any custom activation ideas, product sampling requirements, or executive expectations..."
                      value={formData.custom_notes}
                      onChange={(e) => setFormData({ ...formData, custom_notes: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* SUBMIT ACTION */}
                <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-zinc-400 text-[11px] font-mono">
                    ⚡ Directed to Hemchandra Purohit & Destiny Productions Desk
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Sponsorship Proposal Request →'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
