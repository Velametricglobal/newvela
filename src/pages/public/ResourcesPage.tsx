import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, ShieldCheck, Zap, Calendar, Clock, 
  ExternalLink, Phone, CheckCircle2, TrendingUp, Heart, 
  Share2, ArrowLeft, Star, Users, MapPin, Building, Sparkles
} from 'lucide-react';
import { blogService, BlogPost } from '../../services/blogService';

export interface ResourceArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featuredImage: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

export const ARTICLES: ResourceArticle[] = [
  {
    id: 'res-dhcs',
    slug: 'dhcs-growth-story-dehradun',
    title: 'From a Local Service to a Trusted Healthcare Brand: The DHCS Growth Story in Dehradun',
    subtitle: 'How Amit Rana transformed Doon Home Care Services from 2–3 monthly references into Uttarakhand’s premier 200+ patient inquiry medical lifeline.',
    excerpt: 'In the healthcare industry, a business is only as strong as the trust it commands. Discover the digital hospital blueprint that scaled DHCS to 200+ monthly high-intent inquiries.',
    category: 'Healthcare Growth & Digital Transformation',
    readTime: '6 min read',
    publishedDate: 'September 2026',
    author: {
      name: 'Velametric Editorial Desk',
      role: 'Healthcare Growth & Brand Engineering'
    },
    featuredImage: '/images/blog/dhcs_healthcare_hero.jpg',
    stats: [
      { label: 'Inquiries Scaled', value: '2-3 → 200+/mo' },
      { label: 'Total Interactions', value: '1,045+' },
      { label: 'Direct Emergency Calls', value: '596 Calls' },
      { label: 'Google Review Rating', value: '4.7★ (106 Reviews)' }
    ]
  },
  {
    id: 'res-1',
    slug: 'headless-cms-architecture-guide',
    title: 'The 2026 Enterprise Guide to Headless CMS & Supabase Architecture',
    subtitle: 'Decoupling frontend presentation from database layers to achieve sub-second load times.',
    excerpt: 'Learn how modern brands decouple content management from public presentation layers to achieve sub-second load times and rock-solid Row Level Security.',
    category: 'Engineering & Architecture',
    readTime: '8 min read',
    publishedDate: 'August 2026',
    author: {
      name: 'Core Systems Architect',
      role: 'Platform & Cloud Infrastructure'
    },
    featuredImage: '/images/services/service_web_dev.jpg',
    stats: [
      { label: 'Load Latency', value: '< 250ms' },
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'Security Standard', value: 'RLS Zero-Trust' }
    ]
  },
  {
    id: 'res-2',
    slug: 'government-loan-subsidy-playbook',
    title: 'Navigating Government Subsidy Loans & Capital Financing in 2026',
    subtitle: 'Step-by-step documentation audit roadmap for corporate debt financing and capital loan schemes.',
    excerpt: 'A comprehensive documentation roadmap for corporate debt financing, MSME capital subsidy schemes, and project report clearance in Uttarakhand and North India.',
    category: 'Financial Advisory & Subsidies',
    readTime: '12 min read',
    publishedDate: 'July 2026',
    author: {
      name: 'Senior Banking Advisor',
      role: 'Corporate Debt Advisory'
    },
    featuredImage: '/images/services/service_fin_advisory.jpg',
    stats: [
      { label: 'Subsidy Range', value: '15% – 35%' },
      { label: 'Avg Clearance', value: '45 Days' },
      { label: 'Sectors Covered', value: 'Mfg, Tech, Health' }
    ]
  }
];

export type BlogOrResourceArticle = ResourceArticle & Partial<BlogPost>;

export const ResourcesPage: React.FC = () => {
  const [allArticles, setAllArticles] = useState<BlogOrResourceArticle[]>(() => {
    const fromService = blogService.getArticles().filter(a => a.status === 'PUBLISHED');
    return fromService.length > 0 ? (fromService as BlogOrResourceArticle[]) : ARTICLES;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fromService = blogService.getArticles().filter(a => a.status === 'PUBLISHED');
      setAllArticles(fromService.length > 0 ? (fromService as BlogOrResourceArticle[]) : ARTICLES);
    };
    window.addEventListener('vela-blog-updated', handleUpdate);
    return () => window.removeEventListener('vela-blog-updated', handleUpdate);
  }, []);

  const featuredArticle = allArticles[0] || ARTICLES[0];
  const otherArticles = allArticles.slice(1);

  return (
    <div className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/25 text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Insights, Playbooks & Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight uppercase">
          Resources & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Insights</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          In-depth breakdowns, growth blueprints, and strategic technical playbooks from real-world transformations executed by Velametric.
        </p>
      </div>

      {/* Featured Headline Hero Blog Post */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900/90 border border-zinc-800 shadow-2xl hover:border-amber-400/50 transition-all duration-300 group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-black">
            <img 
              src={featuredArticle.featuredImage} 
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-lg">
              Featured Growth Story
            </span>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="text-amber-400 font-bold uppercase">{featuredArticle.category}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight group-hover:text-amber-400 transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-zinc-300 text-sm leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              {/* Stat Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {featuredArticle.stats?.slice(0, 2).map((s: { label: string; value: string }, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-lg font-black text-amber-400 font-display">{s.value}</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                <div className="font-bold text-white">{featuredArticle.author.name}</div>
                <div className="text-[10px] font-mono">{featuredArticle.publishedDate}</div>
              </div>

              <Link
                to={`/resources/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-amber-400/20"
              >
                Read Full Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Other Articles */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white font-display uppercase tracking-tight">
          More Technical Guides & Playbooks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherArticles.map((article) => (
            <div 
              key={article.id} 
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xl group"
            >
              <div className="h-56 relative overflow-hidden bg-zinc-950">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-amber-400 rounded-full border border-zinc-700 font-mono">
                  {article.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.publishedDate}</span>
                  </div>

                  <h4 className="text-xl font-bold text-white font-display group-hover:text-amber-400 transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">By {article.author.name}</span>
                  <Link
                    to={`/resources/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-transform"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ResourceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Look up article from blogService first, then fallback to ARTICLES
  const serviceArticle = slug ? blogService.getArticleBySlug(slug) : undefined;
  const article: BlogOrResourceArticle = (serviceArticle as any) || ARTICLES.find(a => a.slug === slug) || ARTICLES[0];
  const isDhcsStory = article.slug === 'dhcs-growth-story-dehradun';

  return (
    <article className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link to="/resources" className="hover:text-amber-400 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Resources
        </Link>
        <span>/</span>
        <span className="text-amber-400 uppercase truncate">{article.category}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" /> Client Growth Case Study & Healthcare Brand Architecture
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-[1.15]">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-zinc-300 leading-relaxed font-medium">
          {article.subtitle}
        </p>

        {/* Author & Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-y border-zinc-800 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold font-display text-sm">
              VM
            </div>
            <div>
              <div className="font-bold text-white text-sm">{article.author.name}</div>
              <div className="text-zinc-500">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-zinc-500" /> {article.publishedDate}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-500" /> {article.readTime}</span>
            {isDhcsStory && (
              <a
                href="https://doonhomecareservices.icu/?utm_source=gemini"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 flex items-center gap-1 font-bold"
              >
                Visit doonhomecareservices.icu <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Photo */}
      <div className="space-y-3">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl aspect-[16/9]">
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-zinc-500 font-mono text-center">
          Photo: Empathetic, dignified home nursing care and vital monitoring deployed to residential homes across Dehradun.
        </p>
      </div>

      {/* Highlights / Quick Stats Banner */}
      {article.stats && article.stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800">
          {article.stats.map((s: { label: string; value: string }, idx: number) => (
            <div key={idx} className="space-y-1 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">{s.value}</div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* The Full Story Content */}
      {isDhcsStory ? (
        <div className="space-y-12 text-zinc-300 text-base sm:text-lg leading-relaxed">
          {/* Intro */}
          <div className="space-y-6">
            <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
              In the healthcare industry, a business is only as strong as the trust it commands. When families in Dehradun face a medical emergency, look for elder care, or need an ICU setup at home, they aren’t just looking for a service provider—<span className="text-amber-400 font-bold">they are looking for a reliable lifeline</span>.
            </p>

            <p>
              When <strong>Amit Rana</strong>, the owner of <strong>DHCS (Doon Home Care Services)</strong>, first partnered with us in 2022, they were doing phenomenal ground-level work. However, like many specialized medical startups, their reach was constrained by traditional word-of-mouth. Operating with just <strong>2 to 3 clients per month</strong>, their incredible dedication to patient care wasn't reaching the broader community that desperately needed it.
            </p>

            <p>
              Here is the blueprint of how we partnered with Amit to transform DHCS from a local service provider into a recognized, trusted healthcare brand in Uttarakhand.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center font-display text-lg">
                1
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                Laying the Digital Foundation: The Website as a Digital Hospital
              </h2>
            </div>

            <p>
              Before a brand can scale, its storefront must reflect its quality. We built and optimized their digital home at{' '}
              <a 
                href="https://doonhomecareservices.icu/?utm_source=gemini" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 font-bold underline hover:text-amber-300 inline-flex items-center gap-1"
              >
                doonhomecareservices.icu <ExternalLink className="w-3.5 h-3.5" />
              </a>{' '}
              to serve as a 24/7 beacon for families in distress.
            </p>

            {/* In-content Photo 2: Home ICU Setup */}
            <div className="space-y-3 my-8">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl aspect-[16/9]">
                <img 
                  src="/images/blog/dhcs_home_icu_setup.jpg" 
                  alt="DHCS Home ICU Setup with Cardiac Monitors and Oxygen Concentrator"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-zinc-500 font-mono text-center">
                Photo: Clinical-grade home ICU and medical equipment setups deployed by DHCS for patients requiring critical care at home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-base">
                  <CheckCircle2 className="w-5 h-5" /> Clarity in Critical Moments
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  We structured their web presence around high-priority medical needs—ranging from critical care nursing and professional attendants to medical equipment rentals and home oxygen therapy.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-display text-base">
                  <Phone className="w-5 h-5" /> Frictionless Access & Instant Call
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Knowing that families search for home care under high-stress circumstances, we optimized the site for mobile devices and embedded instant "Click-to-Call" functionality so help was never more than a tap away.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center font-display text-lg">
                2
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                Dominating Local Search & Establishing Authority
              </h2>
            </div>

            <p>
              Trust in local healthcare is heavily driven by visibility and social proof. We took DHCS’s Google Business Profile and local search footprint to the next level:
            </p>

            <ul className="space-y-4">
              <li className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Targeted Regional SEO</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We optimized content around high-intent regional searches like <em>"critical care nursing in Dehradun"</em> and <em>"home health services in Uttarakhand,"</em> ensuring DHCS appeared right when families needed them most.
                  </p>
                </div>
              </li>

              <li className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Amplifying Reputation & Authentic Social Proof</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We implemented a systematic review-collection workflow, turning satisfied families into brand advocates. Today, when prospective clients look up DHCS on Google Maps, they are greeted by a wall of authentic 5-star testimonials detailing lives saved and stress relieved.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black font-black flex items-center justify-center font-display text-lg">
                3
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                Scaling the Pipeline: From 3 Clients to 200+ Monthly Inquiries
              </h2>
            </div>

            <p>
              The impact of this digital overhaul was profound. By building a robust online ecosystem, we broke the bottleneck of traditional networking:
            </p>

            {/* In-content Photo 3: Grateful family consultation */}
            <div className="space-y-3 my-8">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl aspect-[16/9]">
                <img 
                  src="/images/blog/dhcs_family_consultation.jpg" 
                  alt="Grateful family expressing relief and trust with home care healthcare supervisor"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-zinc-500 font-mono text-center">
                Photo: Genuine healthcare trust and family relief — turning patient care excellence into enduring community authority.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-400/30">
                <h4 className="text-lg font-bold text-amber-400 font-display mb-2">The Influx</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  DHCS scaled from a trickle of 2–3 client references per month to an average of more than <strong>200 high-intent inquiries every month</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-emerald-400/30">
                <h4 className="text-lg font-bold text-emerald-400 font-display mb-2">Exponential Profitability</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  This massive wave of inbound traffic translated directly into higher capacity utilization, steady active care contracts, and substantial financial growth for Amit and his team.
                </p>
              </div>
            </div>
          </div>

          {/* The Verdict */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-400/10 via-zinc-900 to-zinc-950 border-2 border-amber-400/40 space-y-4 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              The Verdict: A Brand Built on Care and Reach
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Transforming DHCS into a brand wasn't just about marketing tricks—it was about <span className="text-white font-semibold">amplifying true human empathy with modern digital infrastructure</span>. By bridging the gap between clinical excellence and digital accessibility, Amit Rana has positioned DHCS as the premier home healthcare partner in Dehradun.
            </p>
            <p className="text-amber-300 font-medium italic text-lg leading-relaxed pt-2">
              "When a family in Uttarakhand needs peace of mind late at night, they don't have to search in the dark anymore. They know DHCS is just a click away."
            </p>
          </div>

          {/* Interactive CTA Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-black border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-xl sm:text-2xl font-black text-white font-display">
                Ready to Turn Your Local Service into a Dominant Regional Brand?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Let’s engineer your digital infrastructure, high-intent local search visibility, and client conversion system.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/book-consultation"
                className="px-6 py-3.5 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 hover:scale-105"
              >
                Book Free Strategy Call
              </Link>
              <Link
                to="/case-studies/doon-home-care-services-dehradun"
                className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                View Analytics Data
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback / Dynamic Article Content Renderer */
        <div className="prose prose-invert max-w-none text-zinc-300 space-y-6">
          <p className="text-lg text-zinc-200 font-medium leading-relaxed bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
            {article.excerpt}
          </p>

          {(article as any).content ? (
            <div className="space-y-5 text-zinc-300 leading-relaxed text-sm sm:text-base">
              {((article as any).content as string).split('\n\n').map((para: string, i: number) => {
                if (para.startsWith('## ')) {
                  return <h2 key={i} className="text-2xl font-black text-white font-display pt-4 pb-1 border-b border-zinc-800">{para.replace('## ', '')}</h2>;
                }
                if (para.startsWith('# ')) {
                  return <h1 key={i} className="text-3xl font-black text-white font-display pt-6 pb-2 text-amber-400">{para.replace('# ', '')}</h1>;
                }
                if (para.startsWith('### ')) {
                  return <h3 key={i} className="text-xl font-bold text-amber-400 font-display pt-3">{para.replace('### ', '')}</h3>;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Strategic Architecture & System Blueprint</h2>
              <p>
                Velametric engineers enterprise-grade client portals, headless multi-tenant systems, and high-conversion business engines. Contact our consulting advisory team to access the complete whitepaper.
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
