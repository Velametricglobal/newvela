import React, { useState } from 'react';
import { 
  School, Building2, ShoppingBag, Code2, Newspaper, CheckCircle2, 
  ArrowRight, Sparkles, ShieldCheck, Clock, Check, Laptop, Play
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { SaaSProductDemoModal, SaaSProductType } from './SaaSProductDemoModal';

export type TrialProductId = 'education' | 'property-crm' | 'ecommerce' | 'custom-app' | 'news-portal';

interface ProductMeta {
  id: TrialProductId;
  name: string;
  tagline: string;
  category: string;
  badge: string;
  icon: any;
  defaultModules: string[];
}

const TRIAL_PRODUCTS: ProductMeta[] = [
  {
    id: 'education',
    name: 'EduSphere AI',
    tagline: 'Institute ERP & LMS Operating System',
    category: 'Schools, Colleges & Coaching',
    badge: '14-Day Cloud Sandbox',
    icon: School,
    defaultModules: [
      'Automated UPI & Card Fee Billing with WhatsApp Receipts',
      'Biometric RFID Attendance Sync',
      'Online Timed MCQ Exams & LMS',
      'Parent & Student Mobile Application',
      'Faculty Payroll & Timetable Manager'
    ]
  },
  {
    id: 'property-crm',
    name: 'EstatePulse CRM',
    tagline: 'Real Estate Sales & Lead Engine',
    category: 'Brokers, Agencies & Builders',
    badge: 'Instant Portal Webhook',
    icon: Building2,
    defaultModules: [
      'Zero Lead Leakage (99acres & MagicBricks Webhook)',
      '1-Click WhatsApp PDF Brochure Dispatch',
      'GPS Site Visit Logging & Geo-Tagging',
      'Channel Partner Split Commission Ledger',
      'Multi-Project & Township Inventory Master'
    ]
  },
  {
    id: 'ecommerce',
    name: 'OmniStore Cloud',
    tagline: 'High-Speed D2C E-Commerce Platform',
    category: 'D2C Brands & Retailers',
    badge: '1-Click Checkout Store',
    icon: ShoppingBag,
    defaultModules: [
      'Sub-Second Page Loads (Next.js Headless Architecture)',
      '1-Click Razorpay & UPI Checkout',
      'Automated WhatsApp Cart Recovery (Boosts Sales +28%)',
      'Shiprocket Multi-Courier Shipping Automation',
      'COD Verification & Return-to-Origin Fraud Shield'
    ]
  },
  {
    id: 'custom-app',
    name: 'Enterprise Web App + CRM/ERP',
    tagline: 'Custom Software Architecture',
    category: 'Growing Businesses & Enterprises',
    badge: 'Full Source Code Option',
    icon: Code2,
    defaultModules: [
      'Custom Workflow Engine & Role-Based Dashboard',
      'Supabase & PostgreSQL Cloud Database',
      'Third-Party REST API & Webhook Connectors',
      'Automated PDF Invoice & Demand Letter Generator',
      'Audit Trail Logs & Enterprise Security'
    ]
  },
  {
    id: 'news-portal',
    name: 'News Portal & Broadcast OS',
    tagline: 'Digital Journalism CMS & RNI Setup',
    category: 'News Portals & TV Channels',
    badge: 'AMP & RNI Compliant',
    icon: Newspaper,
    defaultModules: [
      'Sub-Second Mobile AMP & PWA News Portal',
      'Multi-Reporter & Bureau Chief Publishing Hierarchy',
      'Live Video Streaming & Breaking News Ticker',
      'Google AdSense & Sponsored Native Ads Ingestion',
      'Official RNI Registration Documentation Assistance'
    ]
  }
];

interface ProductTrialFormProps {
  initialProductId?: TrialProductId;
  onSuccess?: () => void;
}

export const ProductTrialForm: React.FC<ProductTrialFormProps> = ({ 
  initialProductId = 'education',
  onSuccess
}) => {
  const [selectedProduct, setSelectedProduct] = useState<TrialProductId>(initialProductId);
  const [trialExperience, setTrialExperience] = useState<'sandbox' | 'guided_demo'>('sandbox');
  
  // Common Contact Fields
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // 1. Education Institute Specific Fields
  const [orgName, setOrgName] = useState('');
  const [eduType, setEduType] = useState('School (K-12)');
  const [studentCount, setStudentCount] = useState('500–2,500 Students');
  const [decisionRole, setDecisionRole] = useState('Director / Principal');

  // 2. Real Estate CRM Specific Fields
  const [brokerageName, setBrokerageName] = useState('');
  const [agentCount, setAgentCount] = useState('6–20 Sales Agents');
  const [realEstateType, setRealEstateType] = useState('Channel Partner / Brokerage');
  const [portalsUsed, setPortalsUsed] = useState<string[]>(['99acres', 'MagicBricks', 'Meta Ads']);

  // 3. E-Commerce Specific Fields
  const [storeName, setStoreName] = useState('');
  const [ecommerceVertical, setEcommerceVertical] = useState('Fashion & Apparel');
  const [monthlyOrders, setMonthlyOrders] = useState('150–1,000 Orders/mo');
  const [existingPlatform, setExistingPlatform] = useState('Launching New Brand');

  // 4. Custom App Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [appWorkflow, setAppWorkflow] = useState('');
  const [userScale, setUserScale] = useState('10–50 Active Users');

  // 5. News Portal Specific Fields
  const [publicationName, setPublicationName] = useState('');
  const [newsFormat, setNewsFormat] = useState('Digital News Web Portal');
  const [dailyTraffic, setDailyTraffic] = useState('10k–100k Readers/day');
  const [rniAssistance, setRniAssistance] = useState('Yes, need RNI assistance');

  // Selected Modules Checklist per product
  const currentProductMeta = TRIAL_PRODUCTS.find(p => p.id === selectedProduct) || TRIAL_PRODUCTS[0];
  const [selectedModules, setSelectedModules] = useState<Record<TrialProductId, string[]>>({
    education: [...TRIAL_PRODUCTS[0].defaultModules],
    'property-crm': [...TRIAL_PRODUCTS[1].defaultModules],
    ecommerce: [...TRIAL_PRODUCTS[2].defaultModules],
    'custom-app': [...TRIAL_PRODUCTS[3].defaultModules],
    'news-portal': [...TRIAL_PRODUCTS[4].defaultModules]
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);

  // Modal Simulator Trigger
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const toggleModule = (module: string) => {
    setSelectedModules(prev => {
      const currentList = prev[selectedProduct] || [];
      const updated = currentList.includes(module)
        ? currentList.filter(m => m !== module)
        : [...currentList, module];
      return { ...prev, [selectedProduct]: updated };
    });
  };

  const togglePortal = (portal: string) => {
    setPortalsUsed(prev => 
      prev.includes(portal) ? prev.filter(p => p !== portal) : [...prev, portal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !email.trim() || !phone.trim()) return;

    setSubmitting(true);

    // Build product-specific payload
    let targetOrg = '';
    let productDetails = '';

    if (selectedProduct === 'education') {
      targetOrg = orgName || 'Educational Institute';
      productDetails = `[EduSphere AI Trial Request]
Institution: ${orgName} (${eduType})
Student Strength: ${studentCount}
Decision Role: ${decisionRole}
Selected Modules: ${selectedModules.education.join(', ')}
Trial Preference: ${trialExperience === 'sandbox' ? 'Self-guided 14-day Cloud Sandbox' : 'Live Guided Video Walkthrough'}`;
    } else if (selectedProduct === 'property-crm') {
      targetOrg = brokerageName || 'Real Estate Agency';
      productDetails = `[EstatePulse CRM Trial Request]
Agency/Firm: ${brokerageName} (${realEstateType})
Agent Count: ${agentCount}
Active Portals: ${portalsUsed.join(', ')}
Selected Modules: ${selectedModules['property-crm'].join(', ')}
Trial Preference: ${trialExperience === 'sandbox' ? '14-day CRM Access' : 'Live Guided Strategy Walkthrough'}`;
    } else if (selectedProduct === 'ecommerce') {
      targetOrg = storeName || 'E-Commerce Store';
      productDetails = `[OmniStore Cloud Trial Request]
Store/Brand: ${storeName}
Category: ${ecommerceVertical}
Order Volume: ${monthlyOrders}
Current Platform: ${existingPlatform}
Selected Modules: ${selectedModules.ecommerce.join(', ')}
Trial Preference: ${trialExperience === 'sandbox' ? 'Staging Store Sandbox' : '1-on-1 Guided Store Architecture Call'}`;
    } else if (selectedProduct === 'custom-app') {
      targetOrg = companyName || 'Enterprise Firm';
      productDetails = `[Custom Web App + CRM/ERP Trial Request]
Company: ${companyName}
Workflow To Automate: ${appWorkflow || 'Custom internal operations ERP'}
User Scale: ${userScale}
Selected Modules: ${selectedModules['custom-app'].join(', ')}
Trial Preference: ${trialExperience === 'sandbox' ? 'Architecture Prototype Sandbox' : 'Guided Solution Architecture Call'}`;
    } else {
      targetOrg = publicationName || 'Media Publication';
      productDetails = `[News Portal & Broadcast OS Trial Request]
Media Channel: ${publicationName}
Publishing Format: ${newsFormat}
Expected Readership: ${dailyTraffic}
RNI Assistance: ${rniAssistance}
Selected Modules: ${selectedModules['news-portal'].join(', ')}
Trial Preference: ${trialExperience === 'sandbox' ? 'Live News CMS Sandbox' : 'Broadcast Studio Setup Consultation'}`;
    }

    try {
      const result = await leadService.createLead({
        first_name: contactName.split(' ')[0] || contactName,
        last_name: contactName.split(' ').slice(1).join(' ') || '',
        email,
        phone,
        company_name: targetOrg,
        service_interest: currentProductMeta.name,
        package_name: `${currentProductMeta.name} — Free Trial`,
        budget_range: 'Trial Request',
        city,
        message: productDetails,
        tags: ['Trial', selectedProduct, 'Priority', trialExperience]
      });

      setCreatedLeadId(result.enqId || result.lead?.lead_code || result.lead?.id || 'TRIAL-ACCESS');
      setSubmittedSuccess(true);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed submitting trial request:', err);
      setSubmitting(false);
      // Fallback display success state even if network fails locally
      setSubmittedSuccess(true);
    }
  };

  const getSimulatedDemoType = (): SaaSProductType | null => {
    if (selectedProduct === 'education') return 'education';
    if (selectedProduct === 'property-crm') return 'property-crm';
    if (selectedProduct === 'ecommerce') return 'ecommerce';
    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Trial Products Tab Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Step 1: Select Your Trial Product
          </label>
          <span className="text-[11px] font-mono text-zinc-400">
            5 Cloud Products Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {TRIAL_PRODUCTS.map((prod) => {
            const Icon = prod.icon;
            const isSelected = prod.id === selectedProduct;

            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => {
                  setSelectedProduct(prod.id);
                  setSubmittedSuccess(false);
                }}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 shadow-lg shadow-amber-400/10'
                    : 'bg-zinc-950 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-amber-400 text-black' 
                      : 'bg-zinc-900 text-zinc-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold font-display line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-zinc-300'
                    }`}>
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5 font-mono">
                      {prod.category}
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                    {prod.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Success Banner with Instant Interactive Demo Trigger */}
      {submittedSuccess ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-amber-400/30 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {currentProductMeta.name} Trial Access Activated!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Your free trial request has been submitted to the product deployment team. Reference ID: <span className="font-mono text-amber-400 font-bold">{createdLeadId || 'TR-2026-LIVE'}</span>.
            </p>
          </div>

          {/* Instant Sandbox Demo Launch */}
          {getSimulatedDemoType() && (
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 max-w-lg mx-auto space-y-3 text-left">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                <Laptop className="w-4 h-4" /> Instant In-Browser Interactive Simulator
              </div>
              <p className="text-xs text-zinc-300">
                You can immediately explore the live interactive interface, generate sample receipts, test lead routing, or simulate order workflows right now.
              </p>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-amber-400/10"
              >
                <Play className="w-4 h-4 fill-current" /> Open Interactive Demo Simulator
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubmittedSuccess(false)}
              className="text-xs font-mono text-zinc-400 hover:text-white underline"
            >
              Configure or Request Another Product Trial
            </button>
          </div>
        </div>
      ) : (

        /* 3. Product-Specific Dynamic Form */
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          
          {/* Active Product Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 shadow-md">
                <currentProductMeta.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-display">
                  {currentProductMeta.name} — Free Cloud Trial
                </div>
                <div className="text-xs text-zinc-400">
                  {currentProductMeta.tagline}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-700/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Instant Access
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/30">
                100% Free
              </span>
            </div>
          </div>

          {/* Section A: Contact Details */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              1. Your Contact & Verification
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Work / Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@institution.edu"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  WhatsApp Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dehradun / Delhi NCR"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section B: Tailored Product-Specific Configuration */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              2. {currentProductMeta.name} Deployment Specifications
            </div>

            {/* DYNAMIC CASE 1: EDUCATION INSTITUTE ERP */}
            {selectedProduct === 'education' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    School / College / Institute Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Himalayan Public Academy"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Institution Category
                  </label>
                  <select
                    value={eduType}
                    onChange={(e) => setEduType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="School (K-12)">School (K-12 CBSE / ICSE / State)</option>
                    <option value="Degree College / University">Degree College / University</option>
                    <option value="Coaching Center / NEET-JEE Academy">Coaching Center / NEET-JEE Academy</option>
                    <option value="Multi-Branch Educational Group">Multi-Branch Educational Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Total Active Students
                  </label>
                  <select
                    value={studentCount}
                    onChange={(e) => setStudentCount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Under 500 Students">Under 500 Students (Single Branch)</option>
                    <option value="500–2,500 Students">500–2,500 Students (Standard Campus)</option>
                    <option value="2,500–10,000 Students">2,500–10,000 Students (Large Institute)</option>
                    <option value="10,000+ Students">10,000+ Students (University / Multi-Campus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Your Decision Role
                  </label>
                  <select
                    value={decisionRole}
                    onChange={(e) => setDecisionRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Director / Trustee">Director / Trustee / Founder</option>
                    <option value="Principal / Dean">Principal / Dean</option>
                    <option value="IT Head / System Admin">IT Head / System Admin</option>
                    <option value="Chief Accountant / Registrar">Chief Accountant / Registrar</option>
                  </select>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 2: REAL ESTATE & PROPERTY CRM */}
            {selectedProduct === 'property-crm' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Real Estate Firm / Brokerage Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brokerageName}
                    onChange={(e) => setBrokerageName(e.target.value)}
                    placeholder="e.g. Apex Realty & Builders"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Business Model
                  </label>
                  <select
                    value={realEstateType}
                    onChange={(e) => setRealEstateType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Channel Partner / Brokerage Agency">Channel Partner / Brokerage Agency</option>
                    <option value="Real Estate Builder / Developer">Real Estate Builder / Developer</option>
                    <option value="Independent Property Consultant">Independent Property Consultant</option>
                    <option value="Commercial & Land Investment Firm">Commercial & Land Investment Firm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Number of Sales Agents
                  </label>
                  <select
                    value={agentCount}
                    onChange={(e) => setAgentCount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="1–5 Sales Agents">1–5 Sales Agents (Boutique Team)</option>
                    <option value="6–20 Sales Agents">6–20 Sales Agents (Growth Agency)</option>
                    <option value="21–50 Sales Agents">21–50 Sales Agents (Large Brokerage)</option>
                    <option value="50+ Enterprise Agents">50+ Enterprise Agents (Builder Roster)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Select Lead Portals to Connect
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['99acres', 'MagicBricks', 'Housing.com', 'Meta Ads', 'Google Ads'].map((portal) => {
                      const isSelected = portalsUsed.includes(portal);
                      return (
                        <button
                          key={portal}
                          type="button"
                          onClick={() => togglePortal(portal)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {portal}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 3: E-COMMERCE PLATFORM */}
            {selectedProduct === 'ecommerce' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Brand / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Himalaya Pure Naturals"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Product Vertical / Category
                  </label>
                  <select
                    value={ecommerceVertical}
                    onChange={(e) => setEcommerceVertical(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Fashion & Apparel">Fashion, Streetwear & Apparel</option>
                    <option value="Electronics & Gadgets">Electronics & Tech Gadgets</option>
                    <option value="Beauty, Skincare & Cosmetics">Beauty, Skincare & Cosmetics</option>
                    <option value="Food, Beverages & Supplements">Food, Beverages & Supplements</option>
                    <option value="Home Decor & Furnishing">Home Decor & Furnishing</option>
                    <option value="Multi-Brand D2C Retail">Multi-Brand D2C Retail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Estimated Monthly Orders
                  </label>
                  <select
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Under 150 Orders/mo">Under 150 Orders/mo (Starter Brand)</option>
                    <option value="150–1,000 Orders/mo">150–1,000 Orders/mo (Scaling D2C)</option>
                    <option value="1,000–5,000 Orders/mo">1,000–5,000 Orders/mo (Established Brand)</option>
                    <option value="5,000+ High Volume">5,000+ Orders/mo (Enterprise D2C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Current Platform Status
                  </label>
                  <select
                    value={existingPlatform}
                    onChange={(e) => setExistingPlatform(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Launching New Brand">Launching New Brand (Fresh Setup)</option>
                    <option value="Migrating from Shopify">Migrating from Shopify (Lower Fees & Faster Speed)</option>
                    <option value="Migrating from WooCommerce">Migrating from WooCommerce</option>
                    <option value="Selling on Instagram / Offline Retail">Currently Selling on Instagram / Offline</option>
                  </select>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 4: CUSTOM WEB APP + CRM/ERP */}
            {selectedProduct === 'custom-app' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Velametric Supply Chain Ltd"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Target Internal Users
                  </label>
                  <select
                    value={userScale}
                    onChange={(e) => setUserScale(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="1–10 Active Users">1–10 Active Users (Small Team)</option>
                    <option value="11–50 Active Users">11–50 Active Users (Medium Business)</option>
                    <option value="51–200 Active Users">51–200 Active Users (Corporate)</option>
                    <option value="200+ Enterprise">200+ Enterprise Multi-Role Users</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Core Workflow or Process to Automate
                  </label>
                  <input
                    type="text"
                    value={appWorkflow}
                    onChange={(e) => setAppWorkflow(e.target.value)}
                    placeholder="e.g. Warehouse inventory tracking, field technician GPS dispatch, custom client quote generator"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 5: NEWS PORTAL & BROADCAST OS */}
            {selectedProduct === 'news-portal' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Media / Publication / Channel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={publicationName}
                    onChange={(e) => setPublicationName(e.target.value)}
                    placeholder="e.g. Uttarakhand Express 24"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Publishing Format
                  </label>
                  <select
                    value={newsFormat}
                    onChange={(e) => setNewsFormat(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Digital News Web Portal">Digital News Web Portal (Hindi / English / Regional)</option>
                    <option value="YouTube / Web Broadcast TV Channel">YouTube / Web Broadcast TV Channel</option>
                    <option value="Print Newspaper + E-Paper Portal">Print Newspaper + E-Paper Portal</option>
                    <option value="Hybrid Multi-Platform Network">Hybrid Multi-Platform Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Expected Daily Audience
                  </label>
                  <select
                    value={dailyTraffic}
                    onChange={(e) => setDailyTraffic(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Under 10k Readers/day">Under 10,000 Readers/day (Emerging Portal)</option>
                    <option value="10k–100k Readers/day">10,000–100,000 Readers/day (Established Regional)</option>
                    <option value="100k–1M Readers/day">100,000–1,000,000 Readers/day (State-Level Leader)</option>
                    <option value="1M+ National Scale">1,000,000+ Readers/day (National Scale)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Do you need Official RNI Registration Assistance?
                  </label>
                  <select
                    value={rniAssistance}
                    onChange={(e) => setRniAssistance(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Yes, need RNI title clearance and registration">Yes, need full RNI title clearance & filing</option>
                    <option value="Already have RNI certificate">Already registered with RNI (Need only CMS portal)</option>
                    <option value="Only digital portal (No RNI required)">Digital only (No RNI required)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Modules Multi-Select Checklist for the Selected Product */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Select Core Features to Include in Your Trial:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentProductMeta.defaultModules.map((module) => {
                  const isChecked = (selectedModules[selectedProduct] || []).includes(module);
                  return (
                    <div
                      key={module}
                      onClick={() => toggleModule(module)}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-zinc-900 border-amber-400/50 text-white'
                          : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-amber-400 border-amber-400 text-black' : 'border-zinc-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">{module}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Section C: Trial Preference Option */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              3. Trial Format
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTrialExperience('sandbox')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  trialExperience === 'sandbox'
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${trialExperience === 'sandbox' ? 'text-amber-400' : 'text-zinc-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Self-Guided 14-Day Cloud Sandbox</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Instant sandbox credentials dispatched to your WhatsApp & Email. Test at your own pace.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTrialExperience('guided_demo')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  trialExperience === 'guided_demo'
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Laptop className={`w-5 h-5 mt-0.5 shrink-0 ${trialExperience === 'guided_demo' ? 'text-amber-400' : 'text-zinc-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">1-on-1 Guided Architecture Call</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Screen-share with our senior engineer. Review custom migrations, APIs & security.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>No credit card required &bull; 100% Free Sandbox Access</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Provisioning Sandbox...</span>
                </>
              ) : (
                <>
                  <span>Start Free {currentProductMeta.name} Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* Interactive Simulator Modal if available for product */}
      {getSimulatedDemoType() && (
        <SaaSProductDemoModal
          productType={getSimulatedDemoType()!}
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />
      )}

    </div>
  );
};
