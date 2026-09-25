import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductTrialForm, TrialProductId } from '../../components/public/ProductTrialForm';
import { Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Laptop, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react';

export const ProductTrialPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawProduct = searchParams.get('product') || searchParams.get('type') || searchParams.get('p');
  
  const validProduct: TrialProductId = 
    rawProduct === 'education' || rawProduct === 'property-crm' || rawProduct === 'ecommerce' || rawProduct === 'custom-app' || rawProduct === 'news-portal'
      ? rawProduct
      : 'education';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/services" className="hover:text-white transition-colors">Products & Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400">Interactive Product Trial</span>
      </div>

      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> 14-Day Free Cloud Sandbox & Live Demos
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display uppercase leading-[1.15]">
          Start Your Free Product Trial
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          Select any of our ready-to-deploy software products below. The form dynamically adapts to your specific industry, campus size, brokerage team, or e-commerce catalog to provision the exact sandbox environment you need.
        </p>
      </div>

      {/* Main Dynamic Form Container */}
      <ProductTrialForm initialProductId={validProduct} />

      {/* Bottom Trust & Assurance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Zero Commitment &bull; No Credit Card Required</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <Laptop className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Instant Cloud Sandbox & In-Browser Interactive Simulator</span>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <Phone className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Priority WhatsApp Onboarding & Technical Support</span>
        </div>
      </div>

    </div>
  );
};
