import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, Printer, Download, Sparkles, Plus, Trash2, CheckCircle2, 
  Building2, User, CreditCard, ShieldCheck, RefreshCw, Copy, 
  Palette, Eye, ArrowRight, Check, QrCode, FileSpreadsheet, Layers, 
  Receipt, ShoppingCart, Calculator, Briefcase, Calendar, Clock,
  Scale, FileCheck, PenTool, CheckSquare, Globe, Award, FileDown, Code
} from 'lucide-react';

export type DocumentType = 'INVOICE' | 'QUOTATION' | 'PO' | 'RECEIPT' | 'AGREEMENT' | 'FREELANCE';

export interface LineItem {
  id: string;
  description: string;
  hsn_sac: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // e.g. 18 for 18%
}

export interface ProfessionPreset {
  id: string;
  name: string;
  role: string;
  icon: string;
  category: string;
  scope: string;
  deliverables: string;
  ipClause: string;
  revisionLimit: number;
  warrantyDays: number;
  defaultFee: number;
  milestones: string;
}

export interface DurationPreset {
  id: string;
  label: string;
  days: number;
  type: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  desc: string;
  dot: string;
  accentBar: string;
  titleColor: string;
  subtextColor: string;
  borderColor: string;
  borderLight: string;
  badgeBg: string;
  cardBg: string;
  clauseNumberBg: string;
  highlightText: string;
  signatureBorder: string;
  tableHeaderBg: string;
  tableHeaderBorder: string;
  totalsBg: string;
  buttonBg: string;
}

export const DOCUMENT_THEMES: Record<string, ThemeConfig> = {
  modern_amber: {
    id: 'modern_amber',
    name: 'Modern Amber',
    desc: 'Warm executive gold & amber palette',
    dot: 'bg-amber-500',
    accentBar: 'bg-amber-500',
    titleColor: 'text-amber-700',
    subtextColor: 'text-amber-600',
    borderColor: 'border-amber-500',
    borderLight: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    cardBg: 'bg-amber-50/60 border-amber-200/80',
    clauseNumberBg: 'bg-amber-500 text-black',
    highlightText: 'text-amber-800',
    signatureBorder: 'border-amber-400',
    tableHeaderBg: 'bg-amber-100/80',
    tableHeaderBorder: 'border-amber-400',
    totalsBg: 'bg-amber-50 border-amber-300',
    buttonBg: 'bg-amber-400 text-black hover:bg-amber-300'
  },
  corporate_blue: {
    id: 'corporate_blue',
    name: 'Corporate Navy',
    desc: 'Trust, corporate & enterprise royal blue',
    dot: 'bg-blue-600',
    accentBar: 'bg-blue-600',
    titleColor: 'text-blue-700',
    subtextColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    borderLight: 'border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    cardBg: 'bg-blue-50/60 border-blue-200/80',
    clauseNumberBg: 'bg-blue-600 text-white',
    highlightText: 'text-blue-800',
    signatureBorder: 'border-blue-400',
    tableHeaderBg: 'bg-blue-100/80',
    tableHeaderBorder: 'border-blue-400',
    totalsBg: 'bg-blue-50 border-blue-300',
    buttonBg: 'bg-blue-600 text-white hover:bg-blue-500'
  },
  executive_emerald: {
    id: 'executive_emerald',
    name: 'Executive Emerald',
    desc: 'Prestige forest & emerald green palette',
    dot: 'bg-emerald-600',
    accentBar: 'bg-emerald-600',
    titleColor: 'text-emerald-700',
    subtextColor: 'text-emerald-600',
    borderColor: 'border-emerald-600',
    borderLight: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cardBg: 'bg-emerald-50/60 border-emerald-200/80',
    clauseNumberBg: 'bg-emerald-600 text-white',
    highlightText: 'text-emerald-800',
    signatureBorder: 'border-emerald-400',
    tableHeaderBg: 'bg-emerald-100/80',
    tableHeaderBorder: 'border-emerald-400',
    totalsBg: 'bg-emerald-50 border-emerald-300',
    buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-500'
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Clean',
    desc: 'Pure high-contrast monochrome black & slate',
    dot: 'bg-zinc-900',
    accentBar: 'bg-slate-900',
    titleColor: 'text-slate-950',
    subtextColor: 'text-slate-700',
    borderColor: 'border-slate-900',
    borderLight: 'border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
    cardBg: 'bg-slate-50 border-slate-200',
    clauseNumberBg: 'bg-slate-900 text-white',
    highlightText: 'text-slate-900',
    signatureBorder: 'border-slate-400',
    tableHeaderBg: 'bg-slate-100',
    tableHeaderBorder: 'border-slate-900',
    totalsBg: 'bg-slate-50 border-slate-300',
    buttonBg: 'bg-slate-900 text-white hover:bg-slate-800'
  },
  crimson_red: {
    id: 'crimson_red',
    name: 'Royal Crimson',
    desc: 'Bold crimson & ruby wine executive styling',
    dot: 'bg-rose-600',
    accentBar: 'bg-rose-600',
    titleColor: 'text-rose-700',
    subtextColor: 'text-rose-600',
    borderColor: 'border-rose-600',
    borderLight: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    cardBg: 'bg-rose-50/60 border-rose-200/80',
    clauseNumberBg: 'bg-rose-600 text-white',
    highlightText: 'text-rose-800',
    signatureBorder: 'border-rose-400',
    tableHeaderBg: 'bg-rose-100/80',
    tableHeaderBorder: 'border-rose-400',
    totalsBg: 'bg-rose-50 border-rose-300',
    buttonBg: 'bg-rose-600 text-white hover:bg-rose-500'
  },
  purple_violet: {
    id: 'purple_violet',
    name: 'Executive Indigo',
    desc: 'Deep indigo & violet luxury consultant styling',
    dot: 'bg-indigo-600',
    accentBar: 'bg-indigo-600',
    titleColor: 'text-indigo-700',
    subtextColor: 'text-indigo-600',
    borderColor: 'border-indigo-600',
    borderLight: 'border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    cardBg: 'bg-indigo-50/60 border-indigo-200/80',
    clauseNumberBg: 'bg-indigo-600 text-white',
    highlightText: 'text-indigo-800',
    signatureBorder: 'border-indigo-400',
    tableHeaderBg: 'bg-indigo-100/80',
    tableHeaderBorder: 'border-indigo-400',
    totalsBg: 'bg-indigo-50 border-indigo-300',
    buttonBg: 'bg-indigo-600 text-white hover:bg-indigo-500'
  }
};

export const PROFESSION_PRESETS: ProfessionPreset[] = [
  {
    id: 'software_dev',
    name: 'Software & Web Developer',
    role: 'Full-Stack Web & Software Engineering Specialist',
    icon: '💻',
    category: 'Engineering & Tech',
    scope: 'Design, develop, test, and deploy responsive web applications, RESTful API endpoints, secure database architectures, and administrative dashboard interfaces using modern frameworks (React / Next.js / TypeScript / Node.js).',
    deliverables: '1. Fully functional web application codebase committed to secure Git repository.\n2. Responsive desktop, tablet, and mobile UI/UX layouts.\n3. API integrations, database schema setup, and cloud CDN deployment.\n4. Administrative documentation, environment setup guides, and handover credentials.',
    ipClause: 'All custom source code, documentation, and digital assets developed specifically for this project shall transfer to the Client upon receipt of 100% full and final payment. Pre-existing open-source libraries remain under their respective public licenses.',
    revisionLimit: 3,
    warrantyDays: 30,
    defaultFee: 85000,
    milestones: '• 30% Advance Upon Signing of this Agreement\n• 40% On Staging Prototype Review & Core Features Approval\n• 30% Upon Production Deployment & Final Code Handover'
  },
  {
    id: 'video_editor',
    name: 'Video Editor & Motion Designer',
    role: 'Cinematic Video Editor & Motion Graphics Producer',
    icon: '🎬',
    category: 'Media & Production',
    scope: 'Editing raw cinematic video footage, audio sound design, color grading, visual rhythm timing, narrative pacing, and rendering in multi-platform resolutions (4K 16:9 master and 9:16 vertical reels).',
    deliverables: '1. Master 4K video exports in ProRes / high-bitrate H.264 format.\n2. Social media cutdowns (Reels / Shorts / TikTok 9:16 format).\n3. Motion graphics title cards, lower thirds, and synchronized subtitles.\n4. Audio enhancement, dialog de-noising, and licensed soundtrack mix.',
    ipClause: 'Client receives exclusive commercial broadcast rights to the final rendered video exports upon full settlement. Raw project files (Premiere / After Effects archives) remain creator property unless purchased via project file addendum.',
    revisionLimit: 2,
    warrantyDays: 14,
    defaultFee: 45000,
    milestones: '• 40% Advance on project kickoff & footage transfer\n• 30% Upon First Draft Review cut\n• 30% Upon Final 4K Master delivery'
  },
  {
    id: 'graphic_designer',
    name: 'UI/UX & Graphic Designer',
    role: 'Senior UI/UX & Brand Identity Designer',
    icon: '🎨',
    category: 'Design & Creative',
    scope: 'Creating visual brand identity assets, vector logos, comprehensive design system tokens, wireframes, and interactive clickable prototypes in Figma.',
    deliverables: '1. Vector logo package (SVG, AI, PNG, PDF formats).\n2. Figma design file with organized components and auto-layout.\n3. Typography, color palette, and brand design guidelines document.\n4. Production-ready asset exports for development handoff.',
    ipClause: 'Full ownership of final vector graphics and approved UI screens transfers to the Client upon final invoice settlement. Third-party font commercial licenses remain the responsibility of the Client.',
    revisionLimit: 3,
    warrantyDays: 14,
    defaultFee: 50000,
    milestones: '• 30% Advance on wireframe conceptualization\n• 40% On high-fidelity Figma prototype approval\n• 30% On final source asset release'
  },
  {
    id: 'digital_marketer',
    name: 'Digital Marketer & Ads Specialist',
    role: 'Performance Marketing & Paid Ads Strategist',
    icon: '📈',
    category: 'Growth & Marketing',
    scope: 'Configuring, executing, and scaling paid acquisition campaigns across Meta Ads Manager, Google Search/Display, conversion tracking pixel integration, and weekly analytics reporting.',
    deliverables: '1. Campaign structure setup with audience segment targeting.\n2. Ad creative copy variations and headline testing matrix.\n3. Conversion tracking and retargeting pixel setup.\n4. Bi-weekly ROAS, CPA, and attribution analytical reports.',
    ipClause: 'All advertising accounts and campaign creatives created for the Client remain the Client\'s property. Strategy playbooks and proprietary optimization formulas remain Service Provider IP.',
    revisionLimit: 2,
    warrantyDays: 15,
    defaultFee: 40000,
    milestones: '• 50% Advance at campaign setup kickoff\n• 50% At mid-month performance audit'
  },
  {
    id: 'content_writer',
    name: 'Content Writer & Copywriter',
    role: 'SEO Content Strategist & Technical Copywriter',
    icon: '✍️',
    category: 'Content & Editorial',
    scope: 'Researching, writing, and proofreading high-intent landing page copy, authoritative technical blog posts, SEO metadata, and marketing email communication sequences.',
    deliverables: '1. 100% original, human-written content passed through plagiarism verifications.\n2. Primary and secondary keyword integration with optimized H1-H4 heading hierarchy.\n3. Meta titles, descriptions, and URL slug recommendations.\n4. 2 iterative revision passes per deliverable batch.',
    ipClause: 'Exclusive worldwide copyright transfers to the Client immediately upon receipt of full payment for each deliverable batch.',
    revisionLimit: 2,
    warrantyDays: 7,
    defaultFee: 30000,
    milestones: '• 50% Advance upon outline approval\n• 50% Upon final approved draft delivery'
  },
  {
    id: 'real_estate',
    name: 'Real Estate Consultant & CRM Specialist',
    role: 'Real Estate Digital Solutions & CRM Consultant',
    icon: '🏢',
    category: 'Property & CRM',
    scope: 'Deploying automated real estate CRM pipelines, lead routing rules, WhatsApp notification bots, broker channel portal setups, and sales velocity reporting.',
    deliverables: '1. Configured real estate CRM with custom pipeline stages.\n2. Automated lead distribution and instant WhatsApp engagement triggers.\n3. Broker & inventory master tracking sheet setup.\n4. Team training and operational SOP manual.',
    ipClause: 'Client retains 100% ownership of all customer lead records, broker directories, and commercial transaction logs. CRM configuration scripts transfer upon handover.',
    revisionLimit: 2,
    warrantyDays: 30,
    defaultFee: 65000,
    milestones: '• 40% Advance on CRM environment setup\n• 30% On WhatsApp bot & lead pipeline integration\n• 30% On broker portal launch & team training'
  },
  {
    id: 'financial_advisor',
    name: 'Financial Consultant & Loan Advisory',
    role: 'Corporate Financial Advisor & Loan Consultant',
    icon: '🏦',
    category: 'Finance & Banking',
    scope: 'Preparing Detailed Project Reports (DPR), CMA data projections, balance sheet optimization advisory, government subsidy scheme compliance, and institutional banking liaison.',
    deliverables: '1. Comprehensive DPR report with financial ratios and payback metrics.\n2. CMA financial models for banking appraisal.\n3. Government subsidy application dossier.\n4. Bank representation and query resolution advisory.',
    ipClause: 'All financial data is treated under strict non-disclosure obligations. Loan sanctions and subsidy disbursement timelines remain subject to lending bank and ministry evaluation.',
    revisionLimit: 2,
    warrantyDays: 45,
    defaultFee: 75000,
    milestones: '• 40% Retainer upon engagement & financial audit\n• 40% Upon DPR & CMA dossier submission\n• 20% Upon bank appraisal presentation'
  },
  {
    id: 'event_manager',
    name: 'Event Organizer & Production Manager',
    role: 'Executive Event Director & Production Coordinator',
    icon: '🎪',
    category: 'Events & Staging',
    scope: 'Planning, vendor coordination, stage and audiovisual technical management, delegate registration, guest hospitality, and on-ground execution of corporate and private events.',
    deliverables: '1. Event blueprint, vendor run-sheet, and timeline schedule.\n2. Staging, lighting, sound, and AV technical orchestration.\n3. On-ground team management on event execution day.\n4. Post-event vendor financial reconciliation.',
    ipClause: 'A 50% non-refundable advance is required to lock vendor and date commitments. In the event of cancellation due to force majeure, unspent vendor advances shall be reconciled in good faith.',
    revisionLimit: 1,
    warrantyDays: 7,
    defaultFee: 95000,
    milestones: '• 50% Non-refundable advance upon booking date\n• 40% 7 days prior to event commencement\n• 10% Post-event settlement'
  },
  {
    id: 'general_consultant',
    name: 'General Freelancer & Consultant',
    role: 'Independent Professional Consultant & Specialist',
    icon: '💼',
    category: 'Consulting & Advisory',
    scope: 'Delivery of professional consulting, strategic advisory, operational milestone deliverables, and scheduled weekly reviews as mutually specified in project milestones.',
    deliverables: '1. Agreed sprint and milestone deliverables according to project schedule.\n2. Weekly progress summaries and status documentation.\n3. Final handover briefing session.',
    ipClause: 'Independent contractor relationship; no employer-employee, partnership, or agency relationship created. All project deliverables transfer to Client upon full payment.',
    revisionLimit: 2,
    warrantyDays: 15,
    defaultFee: 50000,
    milestones: '• 50% Advance upon contract signing\n• 50% Upon milestone completion and handover'
  }
];

export const DURATION_PRESETS: DurationPreset[] = [
  { id: '2_weeks', label: '2 Weeks (Sprint Deliverable)', days: 14, type: 'Sprint' },
  { id: '1_month', label: '1 Month (Project Milestone)', days: 30, type: 'Fixed Term' },
  { id: '3_months', label: '3 Months (Standard Quarter)', days: 90, type: 'Quarterly (Recommended)' },
  { id: '6_months', label: '6 Months (Bi-Annual Retainer)', days: 180, type: 'Retainer' },
  { id: '1_year', label: '1 Year (Annual Contract)', days: 365, type: 'Annual' },
  { id: 'milestone', label: 'Milestone-Based (Upon Sign-off)', days: 60, type: 'Milestones' },
  { id: 'monthly_retainer', label: 'Monthly Retainer (Auto-Renewable)', days: 30, type: 'Renewable Monthly' },
  { id: 'ongoing', label: 'Ongoing / Indefinite (Notice-Based)', days: 180, type: 'Notice-Based' }
];

export interface DocumentData {
  type: DocumentType;
  doc_number: string;
  issue_date: string;
  due_date: string;
  status: 'PAID' | 'PENDING' | 'DRAFT';
  currency_symbol: string;
  currency_code: string;

  // Sender / First Party Details
  sender_name: string;
  sender_company: string;
  sender_email: string;
  sender_phone: string;
  sender_address: string;
  sender_gstin: string;
  sender_pan: string;
  sender_logo_url: string;
  first_party_designation: string;

  // Client / Second Party Details
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_billing_address: string;
  client_shipping_address: string;
  client_gstin: string;
  second_party_designation: string;

  // Commercial Items (Invoices / Quotations / POs)
  items: LineItem[];
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  gst_type: 'intra_state' | 'inter_state';
  shipping_fee: number;

  // Banking Details & UPI
  bank_name: string;
  account_number: string;
  account_holder: string;
  ifsc_code: string;
  upi_id: string;
  show_qr_code: boolean;

  // Terms & Notes
  notes: string;
  terms: string;

  // Work Agreement & Contract Specifics
  profession_id: string;
  profession_title: string;
  duration_id: string;
  duration_label: string;
  start_date: string;
  end_date: string;
  work_mode: string;
  weekly_commitment: string;
  notice_period_days: number;
  scope_of_work: string;
  deliverables_text: string;
  total_fee: number;
  payment_milestone_notes: string;
  revision_limit: number;
  warranty_days: number;
  ip_clause: string;
  confidentiality_clause: string;
  termination_clause: string;
  governing_jurisdiction: string;

  // Theme
  theme: string;
}

const DEFAULT_DOCUMENT: DocumentData = {
  type: 'AGREEMENT',
  doc_number: 'AGR-2026-0842',
  issue_date: new Date().toISOString().split('T')[0],
  due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  status: 'PENDING',
  currency_symbol: '₹',
  currency_code: 'INR',

  sender_name: 'Accounts & Legal Desk',
  sender_company: 'Velametric Global Technologies Inc.',
  sender_email: 'billing@velametric.com',
  sender_phone: '+91 98765 43210',
  sender_address: 'Subhash Road, Dehradun, Uttarakhand 248001 & Regional Office: Uttarkashi',
  sender_gstin: '05AAAAA0000A1Z5',
  sender_pan: 'AAAAA0000A',
  sender_logo_url: '',
  first_party_designation: 'Managing Director / Authorized Signatory',

  client_name: 'Mr. Rohan Malhotra',
  client_company: 'Apex Heights & Real Estate Corp',
  client_email: 'rohan@apexheights.in',
  client_phone: '+91 98111 22334',
  client_billing_address: 'Suite 402, DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
  client_shipping_address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
  client_gstin: '06BBBBB1111B1Z9',
  second_party_designation: 'Director / Authorized Signatory',

  items: [
    {
      id: '1',
      description: 'Enterprise Real Estate CRM & Automated WhatsApp Lead Pipeline Engine',
      hsn_sac: '998314',
      quantity: 1,
      unit_price: 65000,
      tax_rate: 18
    },
    {
      id: '2',
      description: 'High-Performance React & Next.js Portal Setup with Sub-Second CDN Integration',
      hsn_sac: '998313',
      quantity: 1,
      unit_price: 35000,
      tax_rate: 18
    },
    {
      id: '3',
      description: 'Annual Cloud Infrastructure & Managed High-Availability SLA Support',
      hsn_sac: '998315',
      quantity: 12,
      unit_price: 2500,
      tax_rate: 18
    }
  ],

  discount_type: 'flat',
  discount_value: 5000,
  gst_type: 'inter_state',
  shipping_fee: 0,

  bank_name: 'HDFC Bank Ltd.',
  account_number: '50200098765432',
  account_holder: 'Velametric Global Technologies Inc.',
  ifsc_code: 'HDFC0001234',
  upi_id: 'velametric@hdfcbank',
  show_qr_code: true,

  notes: 'Thank you for choosing Velametric. All deliverables include our 99.9% uptime SLA and architecture warranty.',
  terms: '1. Payment is due within 15 days of invoice date.\n2. Invoices unpaid after 30 days are subject to a 1.5% monthly late fee.\n3. All IP and software repositories transfer upon final settlement.',

  // Agreement Presets
  profession_id: 'software_dev',
  profession_title: 'Full-Stack Web & Software Engineering Specialist',
  duration_id: '3_months',
  duration_label: '3 Months (Standard Project Quarter)',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
  work_mode: '100% Remote (Work From Home - WFH)',
  weekly_commitment: 'Milestone-Driven (Flexible Schedule)',
  notice_period_days: 15,
  scope_of_work: 'Design, develop, test, and deploy responsive web applications, RESTful API endpoints, secure database architectures, and administrative dashboard interfaces using modern frameworks (React / Next.js / TypeScript / Node.js).',
  deliverables_text: '1. Fully functional web application codebase committed to secure Git repository.\n2. Responsive desktop, tablet, and mobile UI/UX layouts.\n3. API integrations, database schema setup, and cloud CDN deployment.\n4. Administrative documentation, environment setup guides, and handover credentials.',
  total_fee: 85000,
  payment_milestone_notes: '• 30% Advance Upon Signing of this Agreement\n• 40% On Staging Prototype Review & Core Features Approval\n• 30% Upon Production Deployment & Final Code Handover',
  revision_limit: 3,
  warranty_days: 30,
  ip_clause: 'All custom source code, documentation, and digital assets developed specifically for this project shall transfer to the Client upon receipt of 100% full and final payment. Pre-existing open-source libraries remain under their respective public licenses.',
  confidentiality_clause: 'Both Parties agree to maintain strict confidentiality regarding all proprietary software, client trade secrets, commercial budgets, customer lists, and non-public data disclosed during the course of this engagement.',
  termination_clause: 'Either Party may terminate this Agreement by providing 15 days written notice via email. Upon termination, Client shall compensate Service Provider for all completed milestones and hours performed up to the termination effective date.',
  governing_jurisdiction: 'Courts of Dehradun, Uttarakhand & Delhi NCR, India',

  theme: 'modern_amber'
};

// Number to Words Converter (Indian Currency Format)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  const intPart = Math.floor(num);
  return inWords(intPart) + ' Only';
}

export const DocumentGeneratorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as DocumentType) || 'AGREEMENT';

  const [doc, setDoc] = useState<DocumentData>(() => {
    const saved = localStorage.getItem('VELAMETRIC_GENERATOR_DRAFT_V3');
    if (saved) {
      try {
        return { ...DEFAULT_DOCUMENT, ...JSON.parse(saved) };
      } catch (e) {
        return { ...DEFAULT_DOCUMENT, type: initialType };
      }
    }
    return { ...DEFAULT_DOCUMENT, type: initialType };
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'overview'>('editor');
  const [editorStep, setEditorStep] = useState<string>(() => {
    return initialType === 'AGREEMENT' || initialType === 'FREELANCE' ? 'profession_duration' : 'items';
  });

  // Active theme styling object
  const currentTheme = useMemo(() => {
    return DOCUMENT_THEMES[doc.theme] || DOCUMENT_THEMES.modern_amber;
  }, [doc.theme]);

  // Save to localStorage whenever doc changes
  useEffect(() => {
    localStorage.setItem('VELAMETRIC_GENERATOR_DRAFT_V3', JSON.stringify(doc));
  }, [doc]);

  const isAgreementMode = doc.type === 'AGREEMENT' || doc.type === 'FREELANCE';

  // Calculations for Invoices
  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    doc.items.forEach((item) => {
      const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
      subtotal += lineTotal;
      const taxAmount = (lineTotal * (item.tax_rate || 0)) / 100;
      totalTax += taxAmount;
    });

    let discountAmount = 0;
    if (doc.discount_type === 'percentage') {
      discountAmount = (subtotal * (doc.discount_value || 0)) / 100;
    } else {
      discountAmount = doc.discount_value || 0;
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const adjustedTax = subtotal > 0 ? (totalTax * (taxableAmount / subtotal)) : 0;

    const cgst = doc.gst_type === 'intra_state' ? adjustedTax / 2 : 0;
    const sgst = doc.gst_type === 'intra_state' ? adjustedTax / 2 : 0;
    const igst = doc.gst_type === 'inter_state' ? adjustedTax : 0;

    const grandTotal = Math.round(taxableAmount + adjustedTax + (doc.shipping_fee || 0));

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalTax: adjustedTax,
      grandTotal,
      grandTotalWords: numberToWords(grandTotal)
    };
  }, [doc]);

  // Line item handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Deliverable or Service Package',
      hsn_sac: '998314',
      quantity: 1,
      unit_price: 10000,
      tax_rate: 18
    };
    setDoc({ ...doc, items: [...doc.items, newItem] });
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, val: any) => {
    setDoc({
      ...doc,
      items: doc.items.map(item => item.id === id ? { ...item, [field]: val } : item)
    });
  };

  const handleRemoveItem = (id: string) => {
    if (doc.items.length <= 1) return;
    setDoc({ ...doc, items: doc.items.filter(item => item.id !== id) });
  };

  // Profession Selector Handler
  const handleSelectProfession = (presetId: string) => {
    const preset = PROFESSION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setDoc({
      ...doc,
      profession_id: preset.id,
      profession_title: preset.role,
      scope_of_work: preset.scope,
      deliverables_text: preset.deliverables,
      ip_clause: preset.ipClause,
      revision_limit: preset.revisionLimit,
      warranty_days: preset.warrantyDays,
      total_fee: preset.defaultFee,
      payment_milestone_notes: preset.milestones,
      items: [
        {
          id: '1',
          description: `${preset.role} - Professional Contract Milestones`,
          hsn_sac: '998314',
          quantity: 1,
          unit_price: preset.defaultFee,
          tax_rate: 18
        }
      ]
    });
  };

  // Duration Selector Handler
  const handleSelectDuration = (durationId: string) => {
    const duration = DURATION_PRESETS.find(d => d.id === durationId);
    if (!duration) return;

    const startDate = doc.start_date || new Date().toISOString().split('T')[0];
    const startTime = new Date(startDate).getTime();
    const calculatedEndTime = new Date(startTime + duration.days * 86400000).toISOString().split('T')[0];

    setDoc({
      ...doc,
      duration_id: duration.id,
      duration_label: duration.label,
      start_date: startDate,
      end_date: calculatedEndTime
    });
  };

  // Clean Isolated Print Action - Prints strictly the generated document alone with zero other text or pages
  const handlePrint = () => {
    const printElement = document.getElementById('printable-document-container');
    if (!printElement) {
      window.print();
      return;
    }

    const docTitle = `${doc.type}_${doc.doc_number}_${doc.sender_company.replace(/\s+/g, '_')}`;

    // Remove any previously created print iframe
    const oldFrame = document.getElementById('isolated-document-print-frame');
    if (oldFrame) {
      oldFrame.remove();
    }

    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'isolated-document-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    // Collect all stylesheets from the current page to preserve Tailwind classes and styles
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) {
      window.print();
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${styles}
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      width: 100% !important;
      min-height: 0 !important;
    }
    #printable-document-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: #ffffff !important;
      display: block !important;
    }
    .printable-document {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: #ffffff !important;
      min-height: 0 !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .no-print {
      display: none !important;
    }
    .agreement-section, .signature-block {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  </style>
</head>
<body>
  ${printElement.outerHTML}
</body>
</html>`);
    iframeDoc.close();

    // Give iframe time to parse styles and images
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Isolated print error, falling back:', err);
        window.print();
      }
    }, 450);
  };

  // Intercept Ctrl+P / Cmd+P to strictly print isolated document
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [doc]);

  // Clean Standalone HTML Document Download Action (strictly document only, zero extra text/buttons)
  const handleDownloadHTML = () => {
    const printElement = document.getElementById('printable-document-container');
    if (!printElement) return;

    const documentContent = printElement.outerHTML;
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML)
      .join('\n');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.type} - ${doc.doc_number}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  ${styles}
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background-color: #ffffff;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
    }
    #printable-document-container {
      width: 100%;
      max-width: 800px;
      background: #ffffff;
      box-shadow: none;
      border: none;
      margin: 0;
      padding: 0;
    }
    .printable-document {
      box-shadow: none !important;
      border: none !important;
    }
    @media print {
      body {
        padding: 0 !important;
      }
      #printable-document-container {
        border: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
      .agreement-section, .signature-block {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  ${documentContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.type}_${doc.doc_number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields to default demonstration template?')) {
      setDoc(DEFAULT_DOCUMENT);
      localStorage.removeItem('VELAMETRIC_GENERATOR_DRAFT_V3');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${doc.type}_${doc.doc_number}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getDocTypeTitle = () => {
    switch (doc.type) {
      case 'INVOICE': return 'TAX INVOICE';
      case 'QUOTATION': return 'FORMAL QUOTATION / ESTIMATE';
      case 'PO': return 'PURCHASE ORDER';
      case 'RECEIPT': return 'OFFICIAL PAYMENT RECEIPT';
      case 'AGREEMENT': return 'WORK & SERVICE AGREEMENT';
      case 'FREELANCE': return 'INDEPENDENT FREELANCER CONTRACT';
    }
  };

  // UPI QR Code URL
  const upiQrUrl = useMemo(() => {
    if (!doc.upi_id) return '';
    const note = encodeURIComponent(`${doc.type} ${doc.doc_number}`);
    const amount = isAgreementMode ? doc.total_fee : calculations.grandTotal;
    const upiUri = `upi://pay?pa=${doc.upi_id}&pn=${encodeURIComponent(doc.sender_company)}&am=${amount}&cu=INR&tn=${note}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}&color=0-0-0&bgcolor=255-255-255`;
  }, [doc.upi_id, doc.sender_company, doc.doc_number, doc.type, calculations.grandTotal, doc.total_fee, isAgreementMode]);

  // Steps to display in Wizard
  const wizardSteps = useMemo(() => {
    if (isAgreementMode) {
      return [
        { id: 'type', label: '1. Contract Info' },
        { id: 'parties', label: '2. Parties & Signatories' },
        { id: 'profession_duration', label: '3. Profession & Duration ⚡' },
        { id: 'clauses', label: '4. Scope & Legal Clauses' },
        { id: 'milestones', label: '5. Fees & Milestones' },
        { id: 'theme', label: '6. Styling & Colors 🎨' },
      ];
    }
    return [
      { id: 'type', label: '1. Doc Info' },
      { id: 'parties', label: '2. Parties' },
      { id: 'items', label: '3. Line Items' },
      { id: 'tax', label: '4. Taxes' },
      { id: 'payment', label: '5. Payment & QR' },
      { id: 'theme', label: '6. Styling & Colors 🎨' },
    ];
  }, [isAgreementMode]);

  // Switch type and auto-set appropriate step
  const handleTypeChange = (newType: DocumentType) => {
    const switchingToAgreement = newType === 'AGREEMENT' || newType === 'FREELANCE';
    const wasAgreement = doc.type === 'AGREEMENT' || doc.type === 'FREELANCE';
    
    setDoc({ ...doc, type: newType });

    if (switchingToAgreement && !wasAgreement) {
      setEditorStep('profession_duration');
    } else if (!switchingToAgreement && wasAgreement) {
      setEditorStep('items');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* 1. TOP TOOLBAR & TITLE (HIDDEN DURING PRINT) */}
      <div className="no-print border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl sticky top-16 sm:top-20 z-40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Title & Status */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-black font-extrabold shadow-md shadow-amber-400/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-tight">
                  Document & Agreement Studio
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Contracts & GST Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Generate GST Invoices, Quotes, POs, and Work Agreements tailored by Profession & Duration.
              </p>
            </div>
          </div>

          {/* Center Document Type Quick Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto max-w-full">
            {[
              { id: 'INVOICE', label: 'Tax Invoice' },
              { id: 'QUOTATION', label: 'Quotation' },
              { id: 'PO', label: 'Purchase Order' },
              { id: 'RECEIPT', label: 'Receipt' },
              { id: 'AGREEMENT', label: 'Work Agreement ⚡' },
              { id: 'FREELANCE', label: 'Freelancer Contract ⚡' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTypeChange(t.id as DocumentType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  doc.type === t.id
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 flex items-center gap-1.5 transform hover:scale-105"
              title="Print or Save clean document as A4 PDF (strictly document only)"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold font-mono transition-all flex items-center gap-1.5"
              title="Download standalone clean document file without any page wrappers"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" /> Download Document
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all text-xs font-mono flex items-center gap-1"
              title="Backup Raw Form Data (.JSON)"
            >
              <Code className="w-3.5 h-3.5" /> <span className="text-[10px] hidden md:inline">Backup</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800 transition-all"
              title="Reset to Demo Defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* VIEW TOGGLE TABS (EDITOR VS OVERVIEW) */}
        <div className="no-print flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'editor'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> Document Studio & Live Canvas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Templates & Legal Guide
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>{isAgreementMode ? 'Contract Consideration:' : 'Current Total:'}</span>
            <span className="text-amber-400 font-bold font-display text-sm">
              {doc.currency_symbol}
              {isAgreementMode
                ? doc.total_fee.toLocaleString('en-IN')
                : calculations.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {activeTab === 'overview' ? (
          
          /* OVERVIEW & TEMPLATES GUIDE TAB */
          <div className="no-print space-y-12 max-w-5xl mx-auto py-6">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                ENTERPRISE CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase">
                Work Agreements & Business Invoices in One Studio
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
                Built specifically for Indian & global professionals, agencies, and businesses. Generate legally robust Work Agreements by Profession & Duration, plus GST Tax Invoices with embedded UPI QR codes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                  ⚖️
                </div>
                <h3 className="text-lg font-bold text-white font-display">Profession-Specific Contracts</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tailored scopes and intellectual property clauses for Web/Software Dev, Video Production, UI/UX Design, Performance Marketing, Copywriting, Real Estate, and Financial Advisory.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center font-bold text-lg">
                  ⏰
                </div>
                <h3 className="text-lg font-bold text-white font-display">Custom Duration & WFH Terms</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Configure Sprint terms (2 Weeks), Standard Quarter (3 Months), Bi-Annual Retainers (6 Months), or Ongoing models with 100% Remote / WFH and notice periods.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <h3 className="text-lg font-bold text-white font-display">GST Math & UPI QR Payments</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Seamless switch to commercial invoices with Intra/Inter GST calculations, milestone payment schedule, and auto-generated scannable UPI QR codes.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white font-display">Ready to Draft Your Work Agreement or Invoice?</h4>
                <p className="text-xs text-zinc-400">Select your profession and duration to generate an executive A4 document in seconds.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="px-6 py-3 rounded-full bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-xl"
              >
                Open Studio Canvas →
              </button>
            </div>
          </div>

        ) : (

          /* SPLIT-SCREEN DOCUMENT STUDIO */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: WIZARD CONTROLS (NO-PRINT) */}
            <div className="no-print xl:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Wizard Sub-Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 text-xs font-mono">
                {wizardSteps.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setEditorStep(step.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      editorStep === step.id
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              {/* STEP 1: DOCUMENT INFO */}
              {editorStep === 'type' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Document Format
                      </label>
                      <select
                        value={doc.type}
                        onChange={(e) => handleTypeChange(e.target.value as DocumentType)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      >
                        <option value="AGREEMENT">Work & Service Agreement</option>
                        <option value="FREELANCE">Independent Freelancer Contract</option>
                        <option value="INVOICE">Tax Invoice (Commercial)</option>
                        <option value="QUOTATION">Quotation / Estimate</option>
                        <option value="PO">Purchase Order</option>
                        <option value="RECEIPT">Payment Receipt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Document / Ref #
                      </label>
                      <input
                        type="text"
                        value={doc.doc_number}
                        onChange={(e) => setDoc({ ...doc, doc_number: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Execution / Issue Date
                      </label>
                      <input
                        type="date"
                        value={doc.issue_date}
                        onChange={(e) => setDoc({ ...doc, issue_date: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        {isAgreementMode ? 'Expiry / Term Date' : 'Payment Due Date'}
                      </label>
                      <input
                        type="date"
                        value={isAgreementMode ? doc.end_date : doc.due_date}
                        onChange={(e) => {
                          if (isAgreementMode) {
                            setDoc({ ...doc, end_date: e.target.value });
                          } else {
                            setDoc({ ...doc, due_date: e.target.value });
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Document Status
                      </label>
                      <select
                        value={doc.status}
                        onChange={(e) => setDoc({ ...doc, status: e.target.value as any })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                      >
                        <option value="PENDING">{isAgreementMode ? 'Pending Execution / Sign' : 'Pending Payment'}</option>
                        <option value="PAID">{isAgreementMode ? 'Executed & Active' : 'Marked as Paid'}</option>
                        <option value="DRAFT">Draft Proposal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Currency Symbol & Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={doc.currency_symbol}
                          onChange={(e) => setDoc({ ...doc, currency_symbol: e.target.value })}
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-center text-white font-mono"
                        />
                        <input
                          type="text"
                          value={doc.currency_code}
                          onChange={(e) => setDoc({ ...doc, currency_code: e.target.value })}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {isAgreementMode && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Legal Jurisdiction / Governing Courts
                      </label>
                      <input
                        type="text"
                        value={doc.governing_jurisdiction}
                        onChange={(e) => setDoc({ ...doc, governing_jurisdiction: e.target.value })}
                        placeholder="e.g. Courts of Dehradun, Uttarakhand & Delhi NCR, India"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: PARTIES & SIGNATORIES */}
              {editorStep === 'parties' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-3 pb-4 border-b border-zinc-800">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      FIRST PARTY / SERVICE PROVIDER / YOUR BUSINESS
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Company / Freelancer Name</label>
                        <input
                          type="text"
                          value={doc.sender_company}
                          onChange={(e) => setDoc({ ...doc, sender_company: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Authorized Signatory Name</label>
                        <input
                          type="text"
                          value={doc.sender_name}
                          onChange={(e) => setDoc({ ...doc, sender_name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Signatory Designation</label>
                        <input
                          type="text"
                          value={doc.first_party_designation}
                          onChange={(e) => setDoc({ ...doc, first_party_designation: e.target.value })}
                          placeholder="e.g. Lead Consultant / Director"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">GSTIN / Tax ID</label>
                        <input
                          type="text"
                          value={doc.sender_gstin}
                          onChange={(e) => setDoc({ ...doc, sender_gstin: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={doc.sender_email}
                          onChange={(e) => setDoc({ ...doc, sender_email: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={doc.sender_phone}
                          onChange={(e) => setDoc({ ...doc, sender_phone: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Registered Address</label>
                      <input
                        type="text"
                        value={doc.sender_address}
                        onChange={(e) => setDoc({ ...doc, sender_address: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      SECOND PARTY / CLIENT / ENGAGING ENTITY
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client Entity / Company</label>
                        <input
                          type="text"
                          value={doc.client_company}
                          onChange={(e) => setDoc({ ...doc, client_company: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client Signatory Name</label>
                        <input
                          type="text"
                          value={doc.client_name}
                          onChange={(e) => setDoc({ ...doc, client_name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client Signatory Designation</label>
                        <input
                          type="text"
                          value={doc.second_party_designation}
                          onChange={(e) => setDoc({ ...doc, second_party_designation: e.target.value })}
                          placeholder="e.g. Managing Director / Partner"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client GSTIN / Tax ID</label>
                        <input
                          type="text"
                          value={doc.client_gstin}
                          onChange={(e) => setDoc({ ...doc, client_gstin: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client Email</label>
                        <input
                          type="email"
                          value={doc.client_email}
                          onChange={(e) => setDoc({ ...doc, client_email: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Client Phone</label>
                        <input
                          type="tel"
                          value={doc.client_phone}
                          onChange={(e) => setDoc({ ...doc, client_phone: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Client Official Address</label>
                      <input
                        type="text"
                        value={doc.client_billing_address}
                        onChange={(e) => setDoc({ ...doc, client_billing_address: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 (AGREEMENT MODE): PROFESSION & DURATION CONFIGURATOR */}
              {editorStep === 'profession_duration' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Profession Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> 1. Select Profession / Role
                      </span>
                      <span className="text-[10px] text-zinc-500">Auto-fills Scope & IP</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {PROFESSION_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectProfession(preset.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            doc.profession_id === preset.id
                              ? 'bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/40 text-white'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{preset.icon}</span>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                              <div className="text-[10px] text-zinc-500 font-mono truncate">{preset.category}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Profession Title Customization */}
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Contracted Role / Title</label>
                    <input
                      type="text"
                      value={doc.profession_title}
                      onChange={(e) => setDoc({ ...doc, profession_title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-medium"
                    />
                  </div>

                  {/* Duration Model Picker */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 2. Select Term & Duration
                      </span>
                      <span className="text-[10px] text-zinc-500">Auto-dates contract</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DURATION_PRESETS.map((dp) => (
                        <button
                          key={dp.id}
                          type="button"
                          onClick={() => handleSelectDuration(dp.id)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            doc.duration_id === dp.id
                              ? 'bg-cyan-400/10 border-cyan-400 text-cyan-300 font-bold ring-1 ring-cyan-400/30'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate">{dp.type}</div>
                          <div className="text-[9px] text-zinc-500 font-mono">{dp.days} Days</div>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">Contract Start Date</label>
                        <input
                          type="date"
                          value={doc.start_date}
                          onChange={(e) => setDoc({ ...doc, start_date: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">Contract End Date</label>
                        <input
                          type="date"
                          value={doc.end_date}
                          onChange={(e) => setDoc({ ...doc, end_date: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Mode & Commitment */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Work Arrangement</label>
                      <select
                        value={doc.work_mode}
                        onChange={(e) => setDoc({ ...doc, work_mode: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                      >
                        <option value="100% Remote (Work From Home - WFH)">100% Remote (WFH)</option>
                        <option value="Hybrid (Remote & On-Site Studio)">Hybrid (Remote & Studio)</option>
                        <option value="On-Site Client Premises">On-Site Client Premises</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Notice Period for Termination</label>
                      <select
                        value={doc.notice_period_days}
                        onChange={(e) => setDoc({ ...doc, notice_period_days: parseInt(e.target.value) || 15 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                      >
                        <option value="7">7 Days Notice</option>
                        <option value="15">15 Days Notice</option>
                        <option value="30">30 Days Notice</option>
                        <option value="60">60 Days Notice</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 (AGREEMENT MODE): SCOPE & LEGAL CLAUSES */}
              {editorStep === 'clauses' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      1. Scope of Work (Tailored to Profession)
                    </label>
                    <textarea
                      rows={3}
                      value={doc.scope_of_work}
                      onChange={(e) => setDoc({ ...doc, scope_of_work: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      2. Specific Deliverables (Numbered)
                    </label>
                    <textarea
                      rows={4}
                      value={doc.deliverables_text}
                      onChange={(e) => setDoc({ ...doc, deliverables_text: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      3. Intellectual Property (IP) Rights Clause
                    </label>
                    <textarea
                      rows={3}
                      value={doc.ip_clause}
                      onChange={(e) => setDoc({ ...doc, ip_clause: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Revision Rounds Limit
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={doc.revision_limit}
                        onChange={(e) => setDoc({ ...doc, revision_limit: parseInt(e.target.value) || 2 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Post-Delivery Warranty (Days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={doc.warranty_days}
                        onChange={(e) => setDoc({ ...doc, warranty_days: parseInt(e.target.value) || 14 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      4. Confidentiality & Non-Disclosure (NDA)
                    </label>
                    <textarea
                      rows={2}
                      value={doc.confidentiality_clause}
                      onChange={(e) => setDoc({ ...doc, confidentiality_clause: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5 (AGREEMENT MODE): FEES & MILESTONES */}
              {editorStep === 'milestones' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Total Agreement Consideration (Fee)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-bold font-mono">
                        {doc.currency_symbol}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={doc.total_fee}
                        onChange={(e) => setDoc({ ...doc, total_fee: parseFloat(e.target.value) || 0 })}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold font-mono text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Milestone Payment Schedule & Terms
                    </label>
                    <textarea
                      rows={4}
                      value={doc.payment_milestone_notes}
                      onChange={(e) => setDoc({ ...doc, payment_milestone_notes: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                      Standard Contract Clauses Included
                    </span>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Independent Contractor Status (No Employment / PF liability)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1.5% Monthly Late Payment Interest on Overdue Invoices</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Direct Electronic Wire & Scannable UPI Payment Remittance</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-zinc-800">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      Direct Remittance Bank Details
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={doc.bank_name}
                          onChange={(e) => setDoc({ ...doc, bank_name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Account #</label>
                        <input
                          type="text"
                          value={doc.account_number}
                          onChange={(e) => setDoc({ ...doc, account_number: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 (INVOICE MODE): LINE ITEMS */}
              {editorStep === 'items' && !isAgreementMode && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
                      Deliverables ({doc.items.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1 hover:bg-amber-300 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {doc.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                            #{index + 1}
                          </span>
                          {doc.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                              title="Remove Line Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={item.description}
                            placeholder="Item description or scope of work..."
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                          <div>
                            <label className="block text-[10px] text-zinc-500">HSN/SAC</label>
                            <input
                              type="text"
                              value={item.hsn_sac}
                              onChange={(e) => handleUpdateItem(item.id, 'hsn_sac', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500">Qty</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500">Unit Price</label>
                            <input
                              type="number"
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 text-right text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500">GST %</label>
                            <select
                              value={item.tax_rate}
                              onChange={(e) => handleUpdateItem(item.id, 'tax_rate', parseFloat(e.target.value) || 0)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 text-center text-white"
                            >
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 (INVOICE MODE): TAXES & DISCOUNTS */}
              {editorStep === 'tax' && !isAgreementMode && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      GST Tax Treatment
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDoc({ ...doc, gst_type: 'intra_state' })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          doc.gst_type === 'intra_state'
                            ? 'bg-amber-400/10 border-amber-400 text-white font-bold ring-1 ring-amber-400/30'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-0.5">Intra-State</div>
                        <div className="text-[10px] text-zinc-500">CGST (50%) + SGST (50%)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDoc({ ...doc, gst_type: 'inter_state' })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          doc.gst_type === 'inter_state'
                            ? 'bg-amber-400/10 border-amber-400 text-white font-bold ring-1 ring-amber-400/30'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-0.5">Inter-State</div>
                        <div className="text-[10px] text-zinc-500">IGST Integrated (100%)</div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Discount Type
                      </label>
                      <select
                        value={doc.discount_type}
                        onChange={(e) => setDoc({ ...doc, discount_type: e.target.value as any })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono"
                      >
                        <option value="flat">Fixed Flat Amount</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={doc.discount_value}
                        onChange={(e) => setDoc({ ...doc, discount_value: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Shipping / Logistics / Extra Fee
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={doc.shipping_fee}
                      onChange={(e) => setDoc({ ...doc, shipping_fee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5 (INVOICE MODE): PAYMENT & UPI */}
              {editorStep === 'payment' && !isAgreementMode && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      BANK WIRE DETAILS
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={doc.bank_name}
                          onChange={(e) => setDoc({ ...doc, bank_name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Account Holder</label>
                        <input
                          type="text"
                          value={doc.account_holder}
                          onChange={(e) => setDoc({ ...doc, account_holder: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={doc.account_number}
                          onChange={(e) => setDoc({ ...doc, account_number: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={doc.ifsc_code}
                          onChange={(e) => setDoc({ ...doc, ifsc_code: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      DYNAMIC UPI QR CODE
                    </span>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">UPI VPA / ID</label>
                      <input
                        type="text"
                        value={doc.upi_id}
                        placeholder="yourname@okhdfcbank"
                        onChange={(e) => setDoc({ ...doc, upi_id: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="show_qr"
                        checked={doc.show_qr_code}
                        onChange={(e) => setDoc({ ...doc, show_qr_code: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-400 bg-zinc-950 border-zinc-800 focus:ring-amber-400"
                      />
                      <label htmlFor="show_qr" className="text-xs text-zinc-300 select-none">
                        Render Scannable UPI QR code on document printout
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: STYLING & DYNAMIC COLOR THEMES */}
              {editorStep === 'theme' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-zinc-200 uppercase block">
                        Select Document Designer Palette
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">
                        Active: {currentTheme.name}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Instantly updates accents, borders, title headers, status badges, and signatures.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(DOCUMENT_THEMES).map((th) => {
                      const isSelected = doc.theme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setDoc({ ...doc, theme: th.id })}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative group ${
                            isSelected
                              ? 'bg-zinc-800/90 border-white text-white font-bold ring-2 ring-white/60 shadow-xl'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full ${th.dot} ring-2 ring-zinc-800 shadow-sm`} />
                              <span className="text-xs font-bold text-white">{th.name}</span>
                            </div>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 block leading-snug">{th.desc}</span>
                          <div className={`h-1 w-full ${th.accentBar} rounded-full mt-2 opacity-80 group-hover:opacity-100 transition-opacity`} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-zinc-800 space-y-2.5">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                    >
                      <Printer className="w-4 h-4" /> Print / Save as Clean A4 PDF →
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadHTML}
                      className="w-full py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all font-mono"
                    >
                      <FileDown className="w-4 h-4 text-emerald-400" /> Download Document (.HTML)
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Bottom Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-500 font-mono">
                  Real-time A4 preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadHTML}
                    className="px-3 py-2 rounded-xl bg-zinc-800 text-emerald-400 hover:bg-zinc-700 transition-all text-xs font-mono flex items-center gap-1.5"
                    title="Download Clean Document (.HTML)"
                  >
                    <FileDown className="w-3.5 h-3.5" /> Download (.HTML)
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-all shadow-lg"
                    title="Print or Save clean document as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE A4 PRINTABLE DOCUMENT CANVAS */}
            <div className="xl:col-span-7 flex flex-col items-center w-full">
              
              <div className="w-full max-w-[760px] flex items-center justify-between text-xs text-zinc-400 font-mono mb-2 px-1 no-print">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" /> Live Interactive Preview ({currentTheme.name})
                </span>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentTheme.dot}`} />
                  <span>A4 Document Sheet</span>
                </span>
              </div>

              {/* A4 CANVAS WRAPPER (ISOLATED BY ID FOR PRINT) */}
              <div 
                id="printable-document-container"
                className="w-full max-w-[760px] shadow-2xl rounded-2xl border border-zinc-800 bg-white text-slate-900"
              >
                
                {/* CONDITIONAL RENDERING: WORK AGREEMENT VS COMMERCIAL INVOICE */}
                {isAgreementMode ? (

                  /* ------------------------------------------------------------------ */
                  /* FORMAL WORK & SERVICE AGREEMENT CANVAS                             */
                  /* ------------------------------------------------------------------ */
                  <div className="printable-document p-6 sm:p-10 space-y-5 bg-white min-h-[1050px] flex flex-col justify-between text-slate-800 text-[11px] sm:text-xs leading-relaxed">
                    
                    <div>
                      {/* TOP ACCENT STRIPE */}
                      <div className={`h-1.5 w-full ${currentTheme.accentBar} rounded-t-sm mb-3`} />

                      {/* AGREEMENT TOP HEADER */}
                      <div className={`flex justify-between items-start pb-4 border-b-2 ${currentTheme.borderColor}`}>
                        <div>
                          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
                            {doc.sender_company}
                          </span>
                          <h2 className={`text-2xl sm:text-3xl font-black font-display tracking-tight mt-1 uppercase ${currentTheme.titleColor}`}>
                            {getDocTypeTitle()}
                          </h2>
                          <div className="text-[11px] text-slate-600 mt-1">
                            Profession: <strong className={currentTheme.titleColor}>{doc.profession_title}</strong> • Term: <strong className={currentTheme.titleColor}>{doc.duration_label}</strong>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs space-y-1">
                          <div className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${currentTheme.badgeBg} mb-1`}>
                            STATUS: {doc.status}
                          </div>
                          <div><span className="text-slate-500">AGREEMENT REF:</span> <strong className="text-slate-900">{doc.doc_number}</strong></div>
                          <div><span className="text-slate-500">DATE OF SIGNING:</span> <strong className="text-slate-900">{doc.issue_date}</strong></div>
                        </div>
                      </div>

                      {/* PREAMBLE & PARTIES SECTION */}
                      <div className="py-4 border-b border-slate-200 space-y-3">
                        <p className="text-slate-700 italic text-[11px]">
                          This Work & Service Agreement ("Agreement") is executed and entered into effective as of <strong>{doc.issue_date}</strong>, by and between:
                        </p>

                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border ${currentTheme.cardBg}`}>
                          <div>
                            <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                              FIRST PARTY (SERVICE PROVIDER / PROFESSIONAL)
                            </span>
                            <div className="font-bold text-slate-900 text-sm">{doc.sender_company}</div>
                            <div className="text-slate-700 text-[11px]">Rep. by: <strong>{doc.sender_name}</strong> ({doc.first_party_designation})</div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{doc.sender_address}</div>
                            <div className="text-slate-600 text-[11px]">Email: {doc.sender_email} • Tel: {doc.sender_phone}</div>
                            {doc.sender_gstin && <div className="font-mono text-[10px] text-slate-700 mt-0.5">GSTIN: {doc.sender_gstin}</div>}
                          </div>

                          <div>
                            <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                              SECOND PARTY (CLIENT / ENGAGING COMPANY)
                            </span>
                            <div className="font-bold text-slate-900 text-sm">{doc.client_company || doc.client_name}</div>
                            <div className="text-slate-700 text-[11px]">Rep. by: <strong>{doc.client_name}</strong> ({doc.second_party_designation})</div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{doc.client_billing_address}</div>
                            <div className="text-slate-600 text-[11px]">Email: {doc.client_email} • Tel: {doc.client_phone}</div>
                            {doc.client_gstin && <div className="font-mono text-[10px] text-slate-700 mt-0.5">Client GSTIN: {doc.client_gstin}</div>}
                          </div>
                        </div>
                      </div>

                      {/* NUMBERED LEGAL & COMMERCIAL CLAUSES */}
                      <div className="py-3 space-y-3.5">
                        
                        {/* CLAUSE 1: ENGAGEMENT & SCOPE */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            1. Engagement & Professional Scope of Work
                          </h3>
                          <p className="text-slate-700">
                            The Client hereby engages the Service Provider to perform professional services in the capacity of <strong>{doc.profession_title}</strong>. The Service Provider agrees to deliver the following services with reasonable professional care:
                          </p>
                          <div className={`p-2.5 rounded-lg border text-slate-800 ${currentTheme.cardBg}`}>
                            {doc.scope_of_work}
                          </div>
                        </div>

                        {/* CLAUSE 2: SPECIFIC DELIVERABLES */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            2. Specific Deliverables & Milestone Outputs
                          </h3>
                          <div className="whitespace-pre-line text-slate-700 pl-2 font-mono text-[11px]">
                            {doc.deliverables_text}
                          </div>
                        </div>

                        {/* CLAUSE 3: TERM, DURATION & WORK MODE */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            3. Term, Duration & Working Mode
                          </h3>
                          <p className="text-slate-700">
                            This Agreement shall commence on <strong>{doc.start_date}</strong> and remain in full force and effect until <strong>{doc.end_date}</strong> ({doc.duration_label}), unless terminated earlier pursuant to the terms herein.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 mt-1">
                            <div>• <strong>Work Arrangement:</strong> {doc.work_mode}</div>
                            <div>• <strong>Commitment:</strong> {doc.weekly_commitment}</div>
                          </div>
                        </div>

                        {/* CLAUSE 4: FEES, PAYMENT MILESTONES & LATE FEES */}
                        <div className="agreement-section space-y-1.5">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            4. Professional Consideration & Payment Schedule
                          </h3>
                          <p className="text-slate-700">
                            In full consideration for the satisfactory performance of services, Client shall pay the Service Provider a total fee of <strong className={currentTheme.titleColor}>{doc.currency_symbol}{doc.total_fee.toLocaleString('en-IN')}</strong> ({doc.currency_code} {numberToWords(doc.total_fee)}) plus applicable statutory taxes, payable according to the following milestones:
                          </p>
                          <div className={`p-2.5 rounded-lg border font-mono text-[11px] text-slate-800 whitespace-pre-line ${currentTheme.cardBg}`}>
                            {doc.payment_milestone_notes}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            * Invoices unpaid past 15 days of presentation shall incur late payment interest at the rate of 1.5% per month.
                          </p>
                        </div>

                        {/* CLAUSE 5: INTELLECTUAL PROPERTY & OWNERSHIP */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            5. Intellectual Property (IP) Rights & Deliverable Ownership
                          </h3>
                          <p className="text-slate-700">
                            {doc.ip_clause}
                          </p>
                        </div>

                        {/* CLAUSE 6: REVISIONS & BUG WARRANTY */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            6. Revisions, Quality Warranty & Acceptance
                          </h3>
                          <p className="text-slate-700">
                            The project fee includes up to <strong>{doc.revision_limit} iterative revision rounds</strong>. Following final deliverable handover, the Service Provider grants a <strong>{doc.warranty_days}-day warranty period</strong> to rectify any genuine defects or bugs directly related to the agreed specifications.
                          </p>
                        </div>

                        {/* CLAUSE 7: CONFIDENTIALITY & NON-DISCLOSURE */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            7. Confidentiality & Non-Disclosure (NDA)
                          </h3>
                          <p className="text-slate-700">
                            {doc.confidentiality_clause}
                          </p>
                        </div>

                        {/* CLAUSE 8: INDEPENDENT CONTRACTOR STATUS */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            8. Independent Contractor Status
                          </h3>
                          <p className="text-slate-700">
                            The relationship of Service Provider to Client is that of an independent professional contractor. Nothing herein shall be construed as creating an employer-employee, partnership, or agency relationship.
                          </p>
                        </div>

                        {/* CLAUSE 9: TERMINATION & DISPUTE RESOLUTION */}
                        <div className="agreement-section space-y-1">
                          <h3 className={`font-bold font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${currentTheme.titleColor}`}>
                            <span className={`w-1.5 h-3.5 rounded-full ${currentTheme.accentBar}`} />
                            9. Termination & Governing Jurisdiction
                          </h3>
                          <p className="text-slate-700">
                            Either Party may terminate this Agreement upon <strong>{doc.notice_period_days} days written notice</strong>. This Agreement shall be construed and governed in accordance with the laws of India, subject to the exclusive jurisdiction of the <strong>{doc.governing_jurisdiction}</strong>.
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* DUAL SIGNATORY EXECUTION BOXES */}
                    <div className="signature-block pt-5 border-t-2 border-slate-900">
                      <p className="text-[10px] text-slate-500 font-mono mb-3 text-center">
                        IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed by their authorized representatives:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* FIRST PARTY SIGNATURE */}
                        <div className={`p-4 rounded-xl border ${currentTheme.cardBg} space-y-3`}>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                            FOR FIRST PARTY (SERVICE PROVIDER)
                          </span>
                          <div className={`pt-8 border-b-2 border-dashed ${currentTheme.signatureBorder}`} />
                          <div className="space-y-0.5 text-[11px]">
                            <div>Authorized Signatory: <strong className="text-slate-900">{doc.sender_name}</strong></div>
                            <div>Designation: <span className="text-slate-700">{doc.first_party_designation}</span></div>
                            <div>Entity: <span className="text-slate-700">{doc.sender_company}</span></div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">Date: {doc.issue_date} • Seal / Signature</div>
                          </div>
                        </div>

                        {/* SECOND PARTY SIGNATURE */}
                        <div className={`p-4 rounded-xl border ${currentTheme.cardBg} space-y-3`}>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                            ACCEPTED & AGREED FOR CLIENT
                          </span>
                          <div className={`pt-8 border-b-2 border-dashed ${currentTheme.signatureBorder}`} />
                          <div className="space-y-0.5 text-[11px]">
                            <div>Authorized Signatory: <strong className="text-slate-900">{doc.client_name}</strong></div>
                            <div>Designation: <span className="text-slate-700">{doc.second_party_designation}</span></div>
                            <div>Entity: <span className="text-slate-700">{doc.client_company}</span></div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1">Date: _____________ • Seal / Signature</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4 text-[9px] text-slate-400 font-mono">
                        Generated securely via Velametric Global Document & Agreement Infrastructure • Ref: {doc.doc_number}
                      </div>
                    </div>

                  </div>

                ) : (

                  /* ------------------------------------------------------------------ */
                  /* COMMERCIAL TAX INVOICE / QUOTATION / PO / RECEIPT CANVAS          */
                  /* ------------------------------------------------------------------ */
                  <div className="printable-document p-6 sm:p-10 space-y-6 bg-white min-h-[1050px] flex flex-col justify-between text-slate-800 text-[11px] sm:text-xs">
                    
                    {/* TOP ACCENT STRIPE */}
                    <div>
                      <div className={`h-1.5 w-full ${currentTheme.accentBar} rounded-t-sm mb-3`} />

                      <div className={`flex justify-between items-start pb-5 border-b-2 ${currentTheme.borderColor}`}>
                        <div>
                          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
                            {doc.sender_company}
                          </span>
                          <h2 className={`text-3xl sm:text-4xl font-black font-display tracking-tight mt-1 uppercase ${currentTheme.titleColor}`}>
                            {getDocTypeTitle()}
                          </h2>
                          <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                            <div>{doc.sender_address}</div>
                            <div>Email: {doc.sender_email} • Tel: {doc.sender_phone}</div>
                            {doc.sender_gstin && (
                              <div className="font-mono font-bold text-slate-800">
                                GSTIN: {doc.sender_gstin} {doc.sender_pan && `• PAN: ${doc.sender_pan}`}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className={`inline-block px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${currentTheme.badgeBg}`}>
                            STATUS: {doc.status}
                          </div>
                          <div className="font-mono text-xs space-y-1">
                            <div>
                              <span className="text-slate-500">REF #:</span>{' '}
                              <strong className="text-slate-900 text-sm">{doc.doc_number}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500">ISSUE DATE:</span>{' '}
                              <strong className="text-slate-900">{doc.issue_date}</strong>
                            </div>
                            {doc.type === 'INVOICE' && (
                              <div>
                                <span className="text-slate-500">DUE DATE:</span>{' '}
                                <strong className="text-slate-900">{doc.due_date}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* BILLED TO / CLIENT SECTION */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 border-b border-slate-200">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                            BILLED TO (CLIENT)
                          </span>
                          <div className="font-bold text-slate-900 text-sm">{doc.client_company || doc.client_name}</div>
                          {doc.client_name && doc.client_company && (
                            <div className="text-slate-700">Attn: {doc.client_name}</div>
                          )}
                          <div className="text-slate-600 mt-1 leading-relaxed">
                            {doc.client_billing_address}
                          </div>
                          <div className="text-slate-600 mt-1">
                            {doc.client_email} {doc.client_phone && `• ${doc.client_phone}`}
                          </div>
                          {doc.client_gstin && (
                            <div className="font-mono font-bold text-slate-900 mt-1">
                              Client GSTIN: {doc.client_gstin}
                            </div>
                          )}
                        </div>

                        <div className="text-right flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                              PLACE OF SUPPLY / JURISDICTION
                            </span>
                            <div className="font-bold text-slate-800">
                              {doc.gst_type === 'intra_state' ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST Integrated)'}
                            </div>
                          </div>

                          {doc.show_qr_code && upiQrUrl && (
                            <div className="flex items-center justify-end gap-3 pt-2">
                              <div className="text-right">
                                <span className="text-[9px] font-mono uppercase text-slate-500 block">Scan to Pay via UPI</span>
                                <span className="text-[10px] font-mono font-bold text-slate-800">{doc.upi_id}</span>
                              </div>
                              <img
                                src={upiQrUrl}
                                alt="UPI QR Code"
                                className="w-16 h-16 border border-slate-300 rounded-lg p-1 bg-white"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ITEMS TABLE */}
                      <div className="py-5 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className={`border-b-2 ${currentTheme.tableHeaderBorder} ${currentTheme.tableHeaderBg} text-[10px] font-mono uppercase tracking-wider text-slate-700`}>
                              <th className="py-2.5 px-2 w-10">#</th>
                              <th className="py-2.5 px-2">Description & Deliverable</th>
                              <th className="py-2.5 px-2 text-center w-20">HSN/SAC</th>
                              <th className="py-2.5 px-2 text-center w-16">Qty</th>
                              <th className="py-2.5 px-2 text-right w-24">Rate ({doc.currency_symbol})</th>
                              <th className="py-2.5 px-2 text-center w-16">GST</th>
                              <th className="py-2.5 px-2 text-right w-28">Amount ({doc.currency_symbol})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {doc.items.map((item, idx) => {
                              const lineTotal = (item.quantity || 0) * (item.unit_price || 0);

                              return (
                                <tr key={item.id} className="text-xs">
                                  <td className="py-2.5 px-2 font-mono text-slate-400">{idx + 1}</td>
                                  <td className="py-2.5 px-2 pr-4 font-medium text-slate-900">
                                    {item.description}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono text-slate-600">{item.hsn_sac || '—'}</td>
                                  <td className="py-2.5 px-2 text-center font-mono text-slate-800">{item.quantity}</td>
                                  <td className="py-2.5 px-2 text-right font-mono text-slate-800">
                                    {(item.unit_price || 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono text-slate-600">{item.tax_rate}%</td>
                                  <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900">
                                    {lineTotal.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* TOTALS CALCULATION BREAKDOWN */}
                      <div className="grid grid-cols-12 gap-6 pt-4 border-t-2 border-slate-900">
                        
                        {/* Left: Amount in Words & Bank Details */}
                        <div className="col-span-7 space-y-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                              AMOUNT IN WORDS
                            </span>
                            <div className="font-bold text-slate-900 mt-0.5 capitalize italic">
                              {doc.currency_code} {calculations.grandTotalWords}
                            </div>
                          </div>

                          {doc.bank_name && (
                            <div className={`p-3.5 rounded-xl border space-y-1 text-[11px] font-mono ${currentTheme.cardBg}`}>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                                BANK WIRE & REMITTANCE DETAILS
                              </span>
                              <div>• Bank: <strong className="text-slate-900">{doc.bank_name}</strong></div>
                              <div>• Account Name: <strong className="text-slate-900">{doc.account_holder}</strong></div>
                              <div>• Account #: <strong className="text-slate-900">{doc.account_number}</strong></div>
                              <div>• IFSC / SWIFT: <strong className="text-slate-900">{doc.ifsc_code}</strong></div>
                              {doc.upi_id && <div>• UPI VPA: <strong className="text-slate-900">{doc.upi_id}</strong></div>}
                            </div>
                          )}
                        </div>

                        {/* Right: Subtotal, Taxes & Grand Total */}
                        <div className="col-span-5 space-y-2 text-right font-mono text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal:</span>
                            <span className="text-slate-900 font-bold">
                              {doc.currency_symbol}{calculations.subtotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {calculations.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-700">
                              <span>Discount:</span>
                              <span>-{doc.currency_symbol}{calculations.discountAmount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {doc.gst_type === 'intra_state' ? (
                            <>
                              <div className="flex justify-between text-slate-600">
                                <span>CGST (Central Tax):</span>
                                <span>{doc.currency_symbol}{calculations.cgst.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                <span>SGST (State Tax):</span>
                                <span>{doc.currency_symbol}{calculations.sgst.toLocaleString('en-IN')}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between text-slate-600">
                              <span>IGST (Integrated Tax):</span>
                              <span>{doc.currency_symbol}{calculations.igst.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {doc.shipping_fee > 0 && (
                            <div className="flex justify-between text-slate-600">
                              <span>Shipping / Extra:</span>
                              <span>{doc.currency_symbol}{doc.shipping_fee.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          <div className={`flex justify-between p-2 rounded-lg border-2 ${currentTheme.borderColor} ${currentTheme.totalsBg} text-sm font-black ${currentTheme.titleColor}`}>
                            <span>GRAND TOTAL:</span>
                            <span className="text-base font-display">
                              {doc.currency_symbol}{calculations.grandTotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DOCUMENT BOTTOM FOOTER */}
                    <div className="pt-6 border-t border-slate-200 mt-6">
                      <div className="grid grid-cols-2 gap-8 items-end">
                        <div className="space-y-1 text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800 uppercase font-mono text-[10px]">
                            Terms & Conditions:
                          </span>
                          <div className="whitespace-pre-line leading-relaxed">
                            {doc.terms}
                          </div>
                          {doc.notes && (
                            <div className="mt-2 text-slate-500 italic">
                              "{doc.notes}"
                            </div>
                          )}
                        </div>

                        <div className="text-right space-y-6">
                          <div className="font-mono text-[11px] text-slate-500">
                            For {doc.sender_company}
                          </div>
                          <div className={`pt-6 border-t-2 ${currentTheme.signatureBorder} inline-block min-w-[180px] text-center`}>
                            <span className="text-[10px] font-mono font-bold text-slate-800 uppercase block">
                              Authorized Signatory
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4 text-[10px] text-slate-400 font-mono">
                        Generated securely via Velametric Global Document Infrastructure • Ref: {doc.doc_number}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DocumentGeneratorPage;
