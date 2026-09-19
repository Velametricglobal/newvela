import { Service, ServiceCategory, ServicePackage, PriceAuditRecord } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUDIT_STORAGE_KEY = 'VELAMETRIC_PRICE_AUDIT_LOGS';
const SERVICES_STORAGE_KEY = 'VELAMETRIC_SERVICES_STORE';

export const INITIAL_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-digital-strategy', name: 'Digital Strategy & Consulting', slug: 'digital-strategy', description: 'Business Audits, Brand Strategy & Full Digital Operations', sort_order: 1 },
  { id: 'cat-brand-architecture', name: 'Creating Brand & Architecture', slug: 'brand-architecture', description: 'Brand Identity, Logo Design & UI/UX Experience Design', sort_order: 2 },
  { id: 'cat-software-engineering', name: 'Software & Web Engineering', slug: 'software-engineering', description: 'Websites, Custom Web Apps + CRM/ERP, Shopify Stores & Cloud Platforms', sort_order: 3 },
  { id: 'cat-news-channel-rni', name: 'News Portal, Channel & RNI', slug: 'news-portal-channel-rni', description: 'Digital News Portals, Broadcast Studio Setup & Official RNI Press Registration', sort_order: 4 },
  { id: 'cat-media-pr', name: 'Media & PR', slug: 'media-pr', description: 'National Press Releases, Media Relations & Digital Reputation Management', sort_order: 5 },
  { id: 'cat-financial-consultancy', name: 'Financial Consultancy', slug: 'financial-consultancy', description: 'Government Subsidy Loans (Up to 25% Refund), Business Credit, DPR & Mortgages', sort_order: 6 }
];

export const INITIAL_SERVICES: Service[] = [
  // SAAS PRODUCT 1: EDUCATION INSTITUTE ERP & LMS
  {
    id: 'srv-saas-education',
    category_id: 'cat-saas',
    category_name: 'SaaS Products & Software Solutions',
    name: 'Education Institute ERP & LMS',
    slug: 'education-institute-erp-lms',
    short_description: 'All-in-one cloud ERP & LMS for schools, coaching centers, and colleges. Student roster, fee automation, biometric attendance & online exam proctoring.',
    full_description: 'A complete, unified school and college management operating system. Automate admission inquiries, student fee invoicing via UPI/Razorpay with automated WhatsApp receipts, faculty payroll, online video lectures, and parent mobile portals.',
    icon: 'School',
    cover_image: '/images/services/saas_education_institute.jpg',
    gallery: ['/images/services/saas_education_institute.jpg'],
    benefits: [
      'Automated UPI & Card fee collection with instant WhatsApp receipts',
      'Smart student & faculty biometric RFID attendance synchronization',
      'Complete online LMS with timed MCQ tests and anti-cheat proctoring',
      'Dedicated Parent & Student Mobile App with live performance tracking'
    ],
    process_steps: [
      { title: '1. Institute Onboarding & Data Migration', desc: 'Import past student records, fee structures, and timetable schedules.' },
      { title: '2. Payment Gateway & Biometric Setup', desc: 'Connect UPI/Razorpay and configure RFID/biometric machine APIs.' },
      { title: '3. Faculty & Staff Training', desc: 'Conduct live training workshops for teachers, accountants, and administrators.' },
      { title: '4. Go-Live & Parent App Launch', desc: 'Deploy white-label domain and onboard students and parents.' }
    ],
    disclaimer: 'Prices shown include initial cloud setup and onboarding. Cloud hosting, high-volume SMS gateway, and custom hardware integrations are billed transparently as per usage.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 1,
    packages: [
      {
        id: 'pkg-saas-edu-starter',
        service_id: 'srv-saas-education',
        tier: 'STARTUP',
        name: 'Single Campus / Starter ERP',
        price: 39999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Coaching Institutes & Single-Branch Schools',
        inclusions: [
          'Up to 500 active students',
          'Student admissions & digital ID cards',
          'Automated fee collection via UPI/Card',
          'WhatsApp fee receipts & reminders',
          'Attendance tracking system',
          'Exam report card generator',
          'Admin & Accountant dashboard roles',
          'Standard email & chat support'
        ]
      },
      {
        id: 'pkg-saas-edu-growth',
        service_id: 'srv-saas-education',
        tier: 'GROWTH',
        name: 'Growth Academy & College ERP',
        price: 79999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        badge: 'Most Popular',
        target_audience: 'Best for: Large Schools, Colleges & Multi-Branch Academies',
        inclusions: [
          'Up to 2,500 active students',
          'Everything in Starter ERP included',
          'Integrated LMS & recorded video vault',
          'Timed online MCQ examination engine',
          'Biometric RFID attendance machine sync',
          'Dedicated Android & iOS Mobile App',
          'Faculty payroll & leave management',
          'Priority WhatsApp & phone SLA support'
        ]
      },
      {
        id: 'pkg-saas-edu-enterprise',
        service_id: 'srv-saas-education',
        tier: 'ORGANIZATION',
        name: 'University / Multi-Campus Enterprise',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        is_contact_for_quote: true,
        target_audience: 'Best for: Universities, Group of Institutions & State Networks',
        inclusions: [
          'Unlimited student & faculty licenses',
          'Multi-campus unified executive control',
          'Dedicated cloud database & isolated VPC',
          'Custom university ERP module engineering',
          'AI-powered student drop-out prediction',
          'White-label institutional domain & apps',
          'Dedicated on-site technical deployment',
          '24/7 dedicated account engineer'
        ]
      }
    ]
  },

  // SAAS PRODUCT 2: REAL ESTATE & PROPERTY DEALER CRM
  {
    id: 'srv-saas-property-crm',
    category_id: 'cat-saas',
    category_name: 'SaaS Products & Software Solutions',
    name: 'Real Estate & Property Dealer CRM',
    slug: 'real-estate-property-dealer-crm',
    short_description: 'Enterprise real estate sales engine for brokers and builders. Multi-project inventory, 99acres lead auto-routing, site visit tracking & split commission payouts.',
    full_description: 'Engineered specifically for Indian real estate builders, channel partners, and property brokers. Automatically consolidate leads from 99acres, Magicbricks, Facebook and Google Ads, schedule site visits via GPS, and dispatch branded PDF brochures on WhatsApp with a single click.',
    icon: 'Building2',
    cover_image: '/images/services/saas_property_crm.jpg',
    gallery: ['/images/services/saas_property_crm.jpg'],
    benefits: [
      'Zero lead leakage: Instant auto-sync from 99acres, MagicBricks & Ads',
      'One-click WhatsApp brochure & floor plan dispatch with tracking',
      'Broker & channel partner commission calculator with split payouts',
      'GPS-enabled site visit logging and buyer deal stage Kanban'
    ],
    process_steps: [
      { title: '1. Lead Portal Integration', desc: 'Connect 99acres, MagicBricks, Meta Ads, and website inquiry forms.' },
      { title: '2. Inventory & Property Ingestion', desc: 'Upload properties, configurations, floor plans, and pricing matrix.' },
      { title: '3. Agent Roster & Commission Rules', desc: 'Configure agent roles, team lead hierarchies, and incentive structures.' },
      { title: '4. Pipeline Activation & WhatsApp Setup', desc: 'Activate WhatsApp Business API for instant brochure dispatches.' }
    ],
    disclaimer: 'Prices shown cover core CRM licensing, portal webhooks, and deployment. Official WhatsApp Business API messaging credits are billed at Meta standard rates.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 2,
    packages: [
      {
        id: 'pkg-saas-prop-starter',
        service_id: 'srv-saas-property-crm',
        tier: 'STARTUP',
        name: 'Starter Broker CRM',
        price: 34999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Independent Property Consultants & Boutique Brokerages',
        inclusions: [
          'Up to 5 sales agent logins',
          'Up to 100 active property listings',
          'Buyer lead pipeline Kanban board',
          'One-click WhatsApp brochure sharing',
          'Site visit scheduling calendar',
          'Basic portal CSV lead import',
          'Mobile browser optimized dashboard',
          'Standard customer support'
        ]
      },
      {
        id: 'pkg-saas-prop-growth',
        service_id: 'srv-saas-property-crm',
        tier: 'GROWTH',
        name: 'Growth Agency & Builder CRM',
        price: 69999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        badge: 'Most Popular',
        target_audience: 'Best for: Fast-Scaling Real Estate Agencies & Channel Partners',
        inclusions: [
          'Up to 25 sales agent logins',
          'Unlimited property listings & floor plans',
          'Direct API sync for 99acres & MagicBricks',
          'Meta & Google Ads instant lead webhook',
          'Channel partner & sub-broker commission ledger',
          'GPS site visit geo-tagging & call logging',
          'Automated WhatsApp follow-up sequences',
          'Dedicated account manager assistance'
        ]
      },
      {
        id: 'pkg-saas-prop-enterprise',
        service_id: 'srv-saas-property-crm',
        tier: 'ORGANIZATION',
        name: 'Enterprise Builder / Mega Agency',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        is_contact_for_quote: true,
        target_audience: 'Best for: Top Real Estate Developers, Mega Channel Partners & REITs',
        inclusions: [
          'Unlimited agent & broker logins',
          'Multi-project & township inventory master',
          'Customer booking & demand letter generator',
          'Builder ERP & payment milestone sync',
          'Dedicated white-labeled mobile applications',
          'Custom lead scoring & conversion algorithms',
          'Full API access & private cloud hosting',
          '24/7 dedicated enterprise support'
        ]
      }
    ]
  },

  // SAAS PRODUCT 3: MODERN E-COMMERCE PLATFORM & WEBSITE
  {
    id: 'srv-saas-ecommerce',
    category_id: 'cat-saas',
    category_name: 'SaaS Products & Software Solutions',
    name: 'Modern E-Commerce Platform & Website',
    slug: 'ecommerce-website-platform',
    short_description: 'High-conversion D2C e-commerce platform with sub-second page loads, 1-click checkout, Shiprocket shipping automation, and abandoned cart WhatsApp recovery.',
    full_description: 'Launch a blazing fast online brand store that beats Shopify in performance and conversions. Includes integrated Razorpay/PhonePe payment gateways, AI-powered COD fraud detection, multi-courier shipping sync via Shiprocket, and automatic WhatsApp cart recovery.',
    icon: 'ShoppingBag',
    cover_image: '/images/services/saas_ecommerce_website.jpg',
    gallery: ['/images/services/saas_ecommerce_website.jpg'],
    benefits: [
      'Sub-second page speeds with Next.js headless storefront architecture',
      'Integrated Razorpay, PhonePe, Cards, EMI & automated COD verification',
      'Automated courier booking with Shiprocket, Delhivery & Bluedart',
      'Automated WhatsApp abandoned cart recovery nudges (boost sales +28%)'
    ],
    process_steps: [
      { title: '1. Brand Store Design & Catalog Import', desc: 'Craft high-converting UX layouts and bulk upload product SKUs.' },
      { title: '2. Payment Gateways & Logistics Setup', desc: 'Integrate UPI/Razorpay, Shiprocket AWB creation, and COD rules.' },
      { title: '3. Conversion & Recovery Automations', desc: 'Configure abandoned cart WhatsApp alerts and discount coupons.' },
      { title: '4. Speed Optimization & Launch', desc: 'Achieve 95+ Google PageSpeed score and launch marketing tracking pixels.' }
    ],
    disclaimer: 'Prices shown include custom storefront deployment and integrations. Gateway transaction fees (typically ~1.9%) and courier shipping charges are paid directly to respective providers.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 3,
    packages: [
      {
        id: 'pkg-saas-ecom-starter',
        service_id: 'srv-saas-ecommerce',
        tier: 'STARTUP',
        name: 'Starter Brand Store',
        price: 44999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Emerging D2C Brands & Retailers Going Online',
        inclusions: [
          'Up to 150 product SKUs',
          'Mobile-first high conversion storefront',
          'Razorpay & UPI payment gateway integration',
          'Shiprocket automated shipping sync',
          'Order tracking for buyers',
          'Discount coupon & promo code engine',
          'Basic Google & Meta pixel tracking',
          'Standard technical support'
        ]
      },
      {
        id: 'pkg-saas-ecom-growth',
        service_id: 'srv-saas-ecommerce',
        tier: 'GROWTH',
        name: 'Scale Brand / D2C Engine',
        price: 89999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        badge: 'Most Popular',
        target_audience: 'Best for: High-Growth D2C Brands Doing 500+ Orders/Month',
        inclusions: [
          'Unlimited product SKUs & categories',
          'Sub-second headless page speed architecture',
          '1-Click express checkout flow',
          'WhatsApp automated abandoned cart recovery bot',
          'AI-powered COD fraud risk detection',
          'Customer reviews & photo testimonial engine',
          'Multi-warehouse inventory routing',
          'Priority support & monthly conversion tuning'
        ]
      },
      {
        id: 'pkg-saas-ecom-enterprise',
        service_id: 'srv-saas-ecommerce',
        tier: 'ORGANIZATION',
        name: 'Enterprise Multi-Store / Marketplace',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        is_contact_for_quote: true,
        target_audience: 'Best for: Multi-Vendor Marketplaces, Omni-Channel Brands & High-Volume Retailers',
        inclusions: [
          'Multi-vendor merchant seller portals',
          'B2B wholesale pricing & tier structures',
          'Custom warehouse ERP & WMS integrations',
          'International multi-currency & duties support',
          'Dedicated AWS/Cloud autoscaling cluster',
          'Custom mobile applications (iOS & Android)',
          'Complete custom checkout & loyalty points system',
          '24/7 dedicated engineering and SLA uptime'
        ]
      }
    ]
  },
  // 1. WEBSITE DEVELOPMENT
  {
    id: 'srv-web-dev',
    category_id: 'cat-dev',
    category_name: 'Website & App Development',
    name: 'Website Development',
    slug: 'website-development',
    short_description: 'High-performance React & Next.js websites built with modern UI/UX, SEO optimization, and instant WhatsApp integration.',
    full_description: 'We build fast, responsive, and conversion-optimized websites tailored for market leaders. Every website comes with an intuitive admin builder interface, SEO setup, and instant lead capture routing.',
    icon: 'Laptop',
    cover_image: '/images/services/service_web_dev.jpg',
    gallery: ['/images/services/service_web_dev.jpg'],
    benefits: ['Sub-second load times & Google Core Web Vitals optimization', 'Modern responsive UI/UX designed for mobile conversions', 'Built-in SEO structure, meta tags & sitemap generator', 'Integrated WhatsApp button, call triggers & lead capture forms'],
    process_steps: [
      { title: '1. Consultation & Wireframe', desc: 'Define page structure, copy hierarchy, and CTA placement.' },
      { title: '2. UI/UX Design & Build', desc: 'Develop responsive React layout and animated visual assets.' },
      { title: '3. CMS & Form Integration', desc: 'Connect inquiry forms directly to CRM pipeline routing.' },
      { title: '4. Testing & Launch', desc: 'Deploy SSL, perform speed tuning, and submit Google Console sitemaps.' }
    ],
    disclaimer: 'Prices shown are starting rates based on standard scope. Domain, hosting, paid plugins, custom assets, and applicable GST are extra unless otherwise specified.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 1,
    packages: [
      {
        id: 'pkg-web-startup',
        service_id: 'srv-web-dev',
        tier: 'STARTUP',
        name: 'Startup Website',
        price: 24999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Startups & Small Businesses',
        inclusions: [
          'Up to 5 pages (Home, About, Services, Contact, Gallery)',
          'Responsive website (Mobile, Tablet, Desktop)',
          'Modern UI/UX design',
          'Basic enquiry form',
          'WhatsApp instant chat button',
          'Direct Call button',
          'Google Maps integration',
          'Basic SEO setup & meta tags',
          'Social media links integration',
          'SSL security configuration',
          'Basic speed optimization',
          '1 month basic technical support'
        ],
        exclusions: [
          'Domain registration',
          'Premium hosting subscription',
          'Paid third-party plugins',
          'Advanced custom web app features',
          'E-commerce & payment gateways',
          'Paid third-party APIs',
          'Professional photography or video',
          'Applicable GST taxes'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-web-ent',
        service_id: 'srv-web-dev',
        tier: 'GROWTH',
        name: 'Enterprise Website',
        price: 59999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Growing & Established Businesses',
        badge: 'Most Popular',
        inclusions: [
          'Up to 12 pages',
          'Premium custom UI/UX design',
          'Responsive mobile-first layout',
          'Headless CMS integration',
          'Admin panel access',
          'Dynamic services catalog',
          'Portfolio & case study showcases',
          'Client testimonials module',
          'Blog / News publishing system',
          'Contact & lead capture management',
          'WhatsApp & CRM pipeline integration',
          'Advanced SEO foundation & meta tags',
          'Google Analytics & Search Console setup',
          'Performance & speed optimization',
          '3 months dedicated support'
        ],
        exclusions: [
          'Domain and server hosting charges',
          'Paid third-party APIs',
          'Stock asset licensing fees',
          'Custom SaaS architecture',
          'Large-scale multi-vendor e-commerce',
          'Third-party software subscriptions',
          'Photography/videography shoots',
          'Applicable GST taxes'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-web-org',
        service_id: 'srv-web-dev',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Custom enterprise architecture & tailored plan',
        inclusions: [
          'Custom architecture for Corporates, Universities & Institutions',
          'Advanced multi-user CMS',
          'Multi-language localization support',
          'Multi-location regional structure',
          'Custom web portals & API integrations',
          'Advanced CRM synchronization',
          'Custom analytics & executive dashboards',
          'Enterprise SEO & security audit',
          'Cloud infrastructure setup (AWS / GCP)',
          'Dedicated account manager & SLA support'
        ],
        exclusions: [
          'Scope, timeline, and final quotation provided based on requirements'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 2. WEB APPLICATION & APP DEVELOPMENT
  {
    id: 'srv-web-app',
    category_id: 'cat-dev',
    category_name: 'Website & App Development',
    name: 'Web Application & App Development',
    slug: 'web-application-development',
    short_description: 'Custom SaaS platforms, customer portals, database engines, and full-stack web applications.',
    full_description: 'We design and engineer scalable web applications built with PostgreSQL, authentication rules, role-based dashboards, and REST/GraphQL API connections.',
    icon: 'Laptop',
    cover_image: '/images/services/service_web_dev.jpg',
    disclaimer: 'Prices shown are starting rates based on standard scope. Server hosting, cloud infrastructure, third-party APIs, and applicable GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 2,
    packages: [
      {
        id: 'pkg-app-startup',
        service_id: 'srv-web-app',
        tier: 'STARTUP',
        name: 'Startup Web App',
        price: 79999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Early Stage Web Apps & MVP Launch',
        inclusions: [
          'Full-stack business web application',
          'Responsive user interface',
          'User authentication & login system',
          'Database architecture & schema',
          'Admin control dashboard',
          'Basic CRM data management',
          'Basic REST API integration',
          'Deployment & cloud setup support',
          '1 month technical support'
        ],
        exclusions: [
          'Complex third-party API licensing',
          'High-volume cloud server charges',
          'Advanced AI / ML models',
          'Native iOS/Android apps',
          'Paid third-party services',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-app-ent',
        service_id: 'srv-web-app',
        tier: 'GROWTH',
        name: 'Growth Web Platform',
        price: 199999,
        price_display_type: 'STARTING_FROM',
        currency: 'INR',
        target_audience: 'Best for: Scaling Companies & Enterprise Platforms',
        badge: 'Most Popular',
        inclusions: [
          'Custom full-stack web application',
          'Advanced multi-panel admin control',
          'Authentication & session security',
          'Role-based access control (RBAC)',
          'Scalable relational database architecture',
          'Third-party API & webhook integrations',
          'CRM, deal pipelines & automated reports',
          'Real-time notifications & activity logs',
          'Advanced validation forms',
          'Production deployment & SSL security',
          '3 months dedicated support'
        ],
        exclusions: [
          'High-scale cloud infrastructure fees',
          'Major subscription-based APIs',
          'Custom mobile applications (unless in scope)',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-app-org',
        service_id: 'srv-web-app',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Enterprise Portals, ERP, SaaS & Custom AI Platforms',
        inclusions: [
          'Custom SaaS platforms & ERP systems',
          'Multi-tenant enterprise architecture',
          'Mobile application engineering (iOS & Android)',
          'Government & institutional portals',
          'AI / LLM workflow integrations',
          'High-availability microservice ecosystem',
          'Dedicated DevOps & SLA support'
        ],
        exclusions: [
          'Scope, timeline, and final quotation based on technical assessment'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 3. DIGITAL MARKETING
  {
    id: 'srv-digi-mktg',
    category_id: 'cat-mktg',
    category_name: 'Marketing (Digital & Offline)',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    short_description: 'Social media management, viral reel production, SEO ranking, and lead generation campaigns.',
    full_description: 'Accelerate brand visibility with targeted digital marketing campaigns linked to lead capture pipelines and real-time CRM performance analytics.',
    icon: 'Megaphone',
    cover_image: '/images/services/service_digital_mktg.jpg',
    disclaimer: 'Ad spend budgets (Meta / Google Ads), influencer fees, and GST are extra and billed separately.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 3,
    packages: [
      {
        id: 'pkg-mktg-startup',
        service_id: 'srv-digi-mktg',
        tier: 'STARTUP',
        name: 'Startup Digital Marketing',
        price: 19999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Startups & Local Brands',
        inclusions: [
          'Social media growth strategy',
          'Up to 12 custom social posts per month',
          '4 high-converting short reels',
          'Copywriting & hashtag research',
          'Monthly content calendar approval',
          'Basic page SEO optimization',
          'Google Business Profile setup & management',
          'Monthly analytics performance report'
        ],
        exclusions: [
          'Paid advertisement budget',
          'Influencer collaboration fees',
          'On-location video shoots',
          'Printing / physical marketing',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-mktg-ent',
        service_id: 'srv-digi-mktg',
        tier: 'GROWTH',
        name: 'Growth Digital Scale',
        price: 44999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Growing Brands & E-Commerce',
        badge: 'Most Popular',
        inclusions: [
          'Complete social media management',
          'Up to 24 creative posts per month',
          '8 viral short reels',
          'Comprehensive content strategy',
          'Search Engine Optimization (SEO)',
          'Google Business Profile optimization',
          '2 monthly SEO blog articles',
          'Inbound lead generation strategy',
          'Meta & Google paid ad management',
          'Competitor analysis & conversion tuning',
          'Monthly strategy review meeting'
        ],
        exclusions: [
          'Ad spend budget (billed directly to client ad account)',
          'Influencer charges',
          'Production expenses',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-mktg-org',
        service_id: 'srv-digi-mktg',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: National Brands, Omni-channel Domination & High Ad Spend',
        inclusions: [
          'Multi-platform campaign orchestration',
          'High ad-spend scaling (₹10L+ monthly management)',
          'Multi-location regional targeting',
          'Custom lead-capture funnel engineering',
          'Dedicated digital marketing strategist',
          'Brand reputation monitoring',
          'Omnichannel media campaigns'
        ],
        exclusions: [
          'Ad spend budget billed separately'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 4. OFFLINE MARKETING
  {
    id: 'srv-offline-mktg',
    category_id: 'cat-mktg',
    category_name: 'Marketing (Digital & Offline)',
    name: 'Offline Marketing',
    slug: 'offline-marketing',
    short_description: 'Print marketing, local brand activations, BTL activities, and outdoor campaign strategy.',
    full_description: 'Drive high-impact local visibility with offline campaign planning, creative collateral design, print coordination, and regional brand activations.',
    icon: 'Megaphone',
    cover_image: '/images/services/service_offline_mktg.jpg',
    disclaimer: 'Media buying, printing production, outdoor hoarding rentals, and venue fees are extra.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 4,
    packages: [
      {
        id: 'pkg-off-startup',
        service_id: 'srv-offline-mktg',
        tier: 'STARTUP',
        name: 'Local Launch Activation',
        price: 29999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Local Brand Launches',
        inclusions: [
          'Campaign strategy & planning',
          'Local marketing roadmap',
          'Flyer, banner & poster designs',
          'Promotional material preparation',
          'Local campaign coordination',
          'Post-campaign summary report'
        ],
        exclusions: [
          'Printing production charges',
          'Outdoor hoarding rentals',
          'Newspaper / Radio ad costs',
          'Venue charges & travel',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-off-ent',
        service_id: 'srv-offline-mktg',
        tier: 'GROWTH',
        name: 'Regional Domination Campaign',
        price: 89999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Regional Brand Activations',
        badge: 'Most Popular',
        inclusions: [
          '360-degree campaign strategy',
          'Creative collateral development',
          'High-res print & billboard designs',
          'Outdoor marketing planning',
          'Local activation coordination',
          'Promotional material management',
          'Regional media coordination',
          'Comprehensive performance report'
        ],
        exclusions: [
          'Media buying & space rentals',
          'Print manufacturing costs',
          'Celebrity / influencer fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-off-org',
        service_id: 'srv-offline-mktg',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: State-wide & National Activations & Turnkey Roadshows',
        inclusions: [
          'State-wide & multi-city campaigns',
          'Large outdoor billboard networks',
          'Institutional & corporate activations',
          'Event promotions & sponsorships',
          'Integrated online + offline campaigns'
        ],
        exclusions: [
          'Quotation provided based on media plan'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 5. BRANDING & GRAPHICS
  {
    id: 'srv-branding',
    category_id: 'cat-brand',
    category_name: 'Branding & Graphics',
    name: 'Branding & Graphics',
    slug: 'branding-and-graphics',
    short_description: 'Complete brand identity design, logos, brand books, typography systems, and social kits.',
    full_description: 'Craft an unforgettable brand identity. We design logos, color systems, brand guidelines, business stationery, and social media creative kits.',
    icon: 'Sparkles',
    cover_image: '/images/services/service_branding.jpg',
    disclaimer: 'Printing, packaging manufacturing, trademark registration, and GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 5,
    packages: [
      {
        id: 'pkg-brand-startup',
        service_id: 'srv-branding',
        tier: 'STARTUP',
        name: 'Brand Essentials',
        price: 24999,
        price_display_type: 'FIXED',
        currency: 'INR',
        target_audience: 'Best for: New Brand Identities',
        inclusions: [
          'Primary logo design & variations',
          'Brand color palette definition',
          'Typography selection',
          'Basic brand style sheet',
          'Business card design',
          'Letterhead & envelope design',
          'Social media profile kit',
          '5 social media launch creatives'
        ],
        exclusions: [
          'Printing production',
          'Packaging design',
          'Brand photography',
          'Trademark / legal fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-brand-ent',
        service_id: 'srv-branding',
        tier: 'GROWTH',
        name: 'Complete Corporate Identity',
        price: 64999,
        price_display_type: 'FIXED',
        currency: 'INR',
        target_audience: 'Best for: Complete Rebranding & Scale',
        badge: 'Most Popular',
        inclusions: [
          'Professional brand logo suite',
          'Complete visual identity system',
          'Brand color & gradient guide',
          'Typography hierarchy',
          'Comprehensive brand book & guidelines',
          'Business stationery design',
          'Complete social media creative kit',
          'Pitch deck & presentation template',
          '15 social media creatives',
          'Brand positioning strategy'
        ],
        exclusions: [
          'Physical print production',
          'Packaging manufacturing',
          'Trademark registration fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-brand-org',
        service_id: 'srv-branding',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Corporate Conglomerates, Packaging & Global Design Systems',
        inclusions: [
          'Full corporate identity & rebranding',
          'Multi-brand architecture guidelines',
          'Complete product packaging design systems',
          'Environmental & retail space branding',
          'Global brand governance manuals'
        ],
        exclusions: [
          'Quotation based on project scope'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 6. VIDEO PRODUCTION
  {
    id: 'srv-video-prod',
    category_id: 'cat-vid',
    category_name: 'Video Production',
    name: 'Video Production',
    slug: 'video-production',
    short_description: 'Cinematic commercial films, viral Instagram reels, music videos, and event cinema.',
    full_description: 'In partnership with Destiny Productions, Dapflix, and Ekraahee Films, we produce broadcast-grade commercial video films and high-impact social media reels.',
    icon: 'Video',
    cover_image: '/images/services/service_video_prod.jpg',
    disclaimer: 'Actor fees, premium locations, drone permits, travel, and GST are extra unless specified.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 6,
    packages: [
      {
        id: 'pkg-vid-startup',
        service_id: 'srv-video-prod',
        tier: 'STARTUP',
        name: 'Brand Commercial Reel',
        price: 29999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Brand Commercials & Social Reels',
        inclusions: [
          'Concept & script guidance',
          '1 shoot session with camera crew',
          'Professional lighting & audio setup',
          'Video editing & cuts',
          'Background music track',
          'Basic motion graphics & title cards',
          '1 final video delivered',
          'Optimized for Instagram reels & YouTube'
        ],
        exclusions: [
          'Actors / models fees',
          'Location rental charges',
          'Drone aerial cinematography',
          'Voice-over artist charges',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-vid-ent',
        service_id: 'srv-video-prod',
        tier: 'GROWTH',
        name: '4K Commercial Cinema',
        price: 74999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: High-Impact Commercials & Reels',
        badge: 'Most Popular',
        inclusions: [
          'Creative concept & scriptwriting',
          'Pre-production planning & storyboard',
          '4K RED / Arri camera shoot session',
          'Professional cinema lighting grid',
          'Post-production editing & color grading',
          'VFX & motion graphics titles',
          'Professional voice-over coordination',
          'Multiple social media formats (9:16, 16:9)',
          'Up to 2 revision rounds'
        ],
        exclusions: [
          'Celebrity fees & premium location fees',
          'Drone permits',
          'Stock asset licensing',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-vid-org',
        service_id: 'srv-video-prod',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: National TVCs, Documentaries, Music Videos & Festival Cinema',
        inclusions: [
          'Commercial TVC & ad films',
          'Corporate documentary cinema',
          'Music video productions',
          'Multi-day event cinema coverage',
          'In partnership with Destiny, Dapflix & Ekraahee'
        ],
        exclusions: [
          'Production scope breakdown'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 7. MEDIA & PR
  {
    id: 'srv-media-pr',
    category_id: 'cat-pr',
    category_name: 'Media & PR',
    name: 'Media & PR Strategy',
    slug: 'media-and-pr',
    short_description: 'Press release distribution, digital PR campaigns, media publications, and brand authority.',
    full_description: 'Build brand credibility with strategic media press releases, digital PR placements, and interview features across major news outlets.',
    icon: 'Megaphone',
    cover_image: '/images/services/service_media_pr.jpg',
    disclaimer: 'Paid media distribution fees and event press charges are extra.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 7,
    packages: [
      {
        id: 'pkg-pr-startup',
        service_id: 'srv-media-pr',
        tier: 'STARTUP',
        name: 'Startup Digital PR',
        price: 19999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Digital PR & Press Releases',
        inclusions: [
          'PR strategy & media positioning',
          '1 press release draft per month',
          'Basic media list coordination',
          'Digital PR outreach',
          'Monthly media coverage report'
        ],
        exclusions: [
          'Paid guaranteed publication fees',
          'Event press conference costs',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-pr-ent',
        service_id: 'srv-media-pr',
        tier: 'GROWTH',
        name: 'National Media PR',
        price: 49999,
        price_display_type: 'PER_MONTH',
        currency: 'INR',
        target_audience: 'Best for: Regional & National Media Outreach',
        badge: 'Most Popular',
        inclusions: [
          'Comprehensive PR & media roadmap',
          'Multiple press releases per month',
          'Regional & national media outreach',
          'Executive interview coordination',
          'Digital PR & authority backlinks',
          'Reputation monitoring & monthly report'
        ],
        exclusions: [
          'Paid media portal fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-pr-org',
        service_id: 'srv-media-pr',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Crisis Management, Corporate Reputation & State PR',
        inclusions: [
          'Crisis management & corporate PR',
          'State & national press conferences',
          'Government & institutional PR campaigns'
        ],
        exclusions: [
          'Scope based on media plan'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 8. GOVERNMENT SUBSIDY LOANS
  {
    id: 'srv-subsidy-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Government Subsidy Loans Consultancy',
    slug: 'government-subsidy-loans',
    short_description: 'Consultancy for claiming up to 25% capital subsidy refunds on business expansion loans.',
    full_description: 'Our financial advisory team prepares detailed project reports (DPR), handles bank sanction guidance, and assists with government capital subsidy scheme claims.',
    icon: 'Calculator',
    cover_image: '/images/services/service_govt_subsidy.jpg',
    disclaimer: 'Financial services are subject to eligibility, lender policies and applicable government regulations. Approval, subsidy, interest rate or funding is not guaranteed.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 8,
    packages: [
      {
        id: 'pkg-sub-startup',
        service_id: 'srv-subsidy-loans',
        tier: 'STARTUP',
        name: 'Eligibility & Assessment',
        price: 9999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Micro & Small Units (PMEGP / Mudra)',
        inclusions: [
          'Initial financial consultation',
          'Government subsidy scheme identification',
          'Detailed project eligibility assessment',
          'Document checklist & gap verification',
          'Basic financial model consultation',
          'Application filing portal guidance'
        ],
        exclusions: [
          'Government nodal application fees',
          'Bank processing charges',
          'CA audit & certification charges',
          'Guaranteed loan approval or subsidy',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-sub-ent',
        service_id: 'srv-subsidy-loans',
        tier: 'GROWTH',
        name: 'Comprehensive DPR & Sanction Guidance',
        price: 29999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Manufacturing & Processing Units (Up to 25% Capital Subsidy)',
        badge: 'Most Popular',
        inclusions: [
          'Full Detailed Project Report (DPR) preparation',
          'CMA data & multi-year financial projections',
          'Bank liaison & query resolution support',
          'Nodal agency subsidy filing assistance',
          'Inspection & document audit readiness',
          'Subsidy release follow-up guidance'
        ],
        exclusions: [
          'Bank / Government filing fees',
          'CA audit charges',
          'Guarantee of loan approval or subsidy',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-sub-org',
        service_id: 'srv-subsidy-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Mega Industrial Projects, PLI Schemes & SEZs (> ₹25 Cr)',
        inclusions: [
          'Turnkey project finance structuring (> ₹25 Cr)',
          'State & Central industrial incentive packages',
          'Consortium banking & credit syndicate advisory',
          'Greenfield / brownfield plant setup advisory',
          'Dedicated senior financial consultant'
        ],
        exclusions: [
          'All approvals subject to bank & government policies'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 9. BUSINESS LOANS & CASH CREDIT (CC)
  {
    id: 'srv-business-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Business Loans & Cash Credit (CC)',
    slug: 'business-loans-cash-credit',
    short_description: 'Working capital financing, Cash Credit (CC) limits, machinery loans, and debt capital.',
    full_description: 'We structure business loan applications, evaluate working capital needs, prepare financial projections, and guide bank credit committee reviews.',
    icon: 'Calculator',
    cover_image: '/images/services/service_business_loans.jpg',
    disclaimer: 'Financial services are subject to eligibility, lender policies and applicable regulations. Approval or funding is not guaranteed.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 9,
    packages: [
      {
        id: 'pkg-biz-startup',
        service_id: 'srv-business-loans',
        tier: 'STARTUP',
        name: 'Working Capital Assessment',
        price: 9999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Unsecured Business Loans & Credit Lines',
        inclusions: [
          'Credit profile & banking history assessment',
          'Working capital requirement calculation',
          'Multi-lender loan product comparison',
          'Complete documentation checklist',
          'Digital loan application submission guidance'
        ],
        exclusions: [
          'Bank / NBFC processing fees',
          'Legal verification charges',
          'Guarantee of loan approval',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-biz-ent',
        service_id: 'srv-business-loans',
        tier: 'GROWTH',
        name: 'Cash Credit (CC) & Term Loan Structuring',
        price: 34999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Secured Working Capital (₹50L to ₹10Cr)',
        badge: 'Most Popular',
        inclusions: [
          'Comprehensive CMA data preparation',
          'Audited balance sheet review & restructuring',
          'Stock statement & debtor ratio optimization',
          'Bank credit committee presentation file',
          'Collateral valuation & legal vetting liaison',
          'Sanction letter terms negotiation support'
        ],
        exclusions: [
          'Bank processing charges',
          'Legal / accounting fees',
          'Guarantee of loan approval',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-biz-org',
        service_id: 'srv-business-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Corporate Debt, LC, Bank Guarantees & Syndication',
        inclusions: [
          'Consortium & multiple banking arrangement structuring',
          'Project finance & machinery import debt',
          'Trade finance: LC, BG & Buyer credit lines',
          'Debt restructuring & interest rate optimization',
          'Direct engagement with senior bank executives'
        ],
        exclusions: [
          'Approval subject to lender credit committee'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 10. PERSONAL LOANS
  {
    id: 'srv-personal-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Personal Loans Consultancy',
    slug: 'personal-loans-consultancy',
    short_description: 'Eligibility assessment, documentation checklist, and application guidance for personal credit.',
    full_description: 'Professional guidance for personal credit evaluation, interest rate comparisons, and bank documentation filing.',
    icon: 'Calculator',
    cover_image: '/images/services/service_home_loans.jpg',
    disclaimer: 'All lending decisions, interest rates, and loan approvals remain solely with respective banks and NBFC lenders.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 10,
    packages: [
      {
        id: 'pkg-per-startup',
        service_id: 'srv-personal-loans',
        tier: 'STARTUP',
        name: 'Credit Assessment & Rate Finder',
        price: 2999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Individual Eligibility Assessment',
        inclusions: [
          'Initial requirement evaluation',
          'Basic CIBIL & eligibility guidance',
          'Document checklist',
          'Application submission guidance'
        ],
        exclusions: [
          'Lender processing fees',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-per-ent',
        service_id: 'srv-personal-loans',
        tier: 'GROWTH',
        name: 'Priority Processing & Documentation',
        price: 7999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Priority Processing & Documentation',
        badge: 'Most Popular',
        inclusions: [
          'Detailed credit profile evaluation',
          'Multi-bank product comparison',
          'Complete documentation support',
          'Priority application guidance'
        ],
        exclusions: [
          'Bank processing charges',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-per-org',
        service_id: 'srv-personal-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Executive Credit Advisory & HNI Borrowers',
        inclusions: [
          'Customized high-volume corporate executive consultancy',
          'Private wealth & customized credit lines'
        ],
        exclusions: [
          'All decisions remain with lenders'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 11. HOME LOANS
  {
    id: 'srv-home-loans',
    category_id: 'cat-fin',
    category_name: 'Financial Consultancy',
    name: 'Home Loans Consultancy',
    slug: 'home-loans-consultancy',
    short_description: 'Property loan eligibility assessment, interest rate comparison, and balance transfer guidance.',
    full_description: 'Guiding home buyers through mortgage options, property title checks, documentation submission, and bank balance transfer options.',
    icon: 'Calculator',
    cover_image: '/images/services/service_home_loans.jpg',
    disclaimer: 'Property verification, stamp duty, valuation charges, and final approval remain subject to lender policies.',
    is_featured: false,
    status: 'PUBLISHED',
    sort_order: 11,
    packages: [
      {
        id: 'pkg-home-startup',
        service_id: 'srv-home-loans',
        tier: 'STARTUP',
        name: 'Credit Assessment & Rate Finder',
        price: 2999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: First-Time Home Buyers',
        inclusions: [
          'CIBIL score analysis & improvement advisory',
          'Income & obligation eligibility calculation',
          'Top 10 bank interest rate comparison',
          'Document readiness verification',
          'Application submission assistance'
        ],
        exclusions: [
          'Bank valuation charges',
          'Legal title search fees',
          'Stamp duty & registration',
          'Approval guarantee',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-home-ent',
        service_id: 'srv-home-loans',
        tier: 'GROWTH',
        name: 'Prime Home Loan & Balance Transfer',
        price: 7999,
        price_display_type: 'PER_CASE',
        currency: 'INR',
        target_audience: 'Best for: Property Purchase & Rate Transfer (Save Lakhs)',
        badge: 'Most Popular',
        inclusions: [
          'Legal & technical property vetting coordination',
          'Balance transfer ROI calculation & fee waiver',
          'Top-up loan structuring with lowest interest rates',
          'End-to-end doorstep document processing',
          'Fast-track sanction file tracking',
          'Disbursement & registry assistance'
        ],
        exclusions: [
          'Bank processing & legal fees',
          'Property valuation fees',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-home-org',
        service_id: 'srv-home-loans',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: HNI Portfolios, Commercial Property & NRI Real Estate Loans',
        inclusions: [
          'Commercial property & multi-unit mortgage',
          'NRI home loans with power-of-attorney support',
          'Loan against property (LAP) up to ₹50 Crores',
          'Private banking & wealth management desk',
          'Dedicated priority relationship manager'
        ],
        exclusions: [
          'Quotation based on project financing scope'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  },

  // 12. EVENT ORGANIZATION & MANAGEMENT
  {
    id: 'srv-events-mgmt',
    category_id: 'cat-event',
    category_name: 'Event Organization & Management',
    name: 'Event Organization & Management',
    slug: 'event-organization-and-management',
    short_description: 'Corporate events, concerts, fashion shows, college fests, and brand activation management.',
    full_description: 'We plan and execute memorable events with complete staging, vendor management, artist coordination, photography, and live production.',
    icon: 'Sparkles',
    cover_image: '/images/services/service_events.jpg',
    disclaimer: 'Venue rental, artist fees, sound/lighting production, catering, security, and GST are extra.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 12,
    packages: [
      {
        id: 'pkg-evt-startup',
        service_id: 'srv-events-mgmt',
        tier: 'STARTUP',
        name: 'Corporate Seminar & Gala',
        price: 74999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Up to 200 Guests & Corporate Meets',
        inclusions: [
          'Event flow & scheduling coordination',
          'Stage backdrop & registration booth design',
          'Sound, projection & lighting coordination',
          'Guest registration desk management',
          'Professional event photography',
          'On-site day-of operations team'
        ],
        exclusions: [
          'Venue rental charges',
          'Artist / celebrity fees',
          'Sound & lighting equipment hire',
          'Catering & security',
          'Travel & accommodation',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 1
      },
      {
        id: 'pkg-evt-ent',
        service_id: 'srv-events-mgmt',
        tier: 'GROWTH',
        name: 'National Summit & Awards Night',
        price: 199999,
        price_display_type: 'PER_PROJECT',
        currency: 'INR',
        target_audience: 'Best for: Up to 1,000 Delegates & Flagship Summits',
        badge: 'Most Popular',
        inclusions: [
          'End-to-end turnkey summit management',
          'VIP & keynote speaker hospitality logistics',
          'Custom 3D stage design & LED wall visuals',
          'Live multicam broadcast & web streaming',
          'Sponsor booth fabrication & branding',
          'Artist, emcee & entertainment curation',
          'Post-event media release & highlight reel'
        ],
        exclusions: [
          'Venue lease fees',
          'Artist performance fees',
          'Catering & hospitality',
          'Applicable GST'
        ],
        gst_setting: 'EXCLUSIVE',
        cta_text: 'Get Started',
        status: 'PUBLISHED',
        sort_order: 2
      },
      {
        id: 'pkg-evt-org',
        service_id: 'srv-events-mgmt',
        tier: 'ENTERPRISE',
        name: 'Enterprise Custom Plan',
        price: 0,
        price_display_type: 'CUSTOM_QUOTE',
        currency: 'INR',
        target_audience: 'Designed for: Mega Global Expos, Government Conclaves & Stadium Concerts',
        inclusions: [
          'Multi-day international summit with 5,000+ delegates',
          'Diplomatic / VIP protocol & security escort',
          'Custom pavilion fabrication & expo engineering',
          'Global satellite link & hybrid VR streaming',
          'Comprehensive city-wide transit & hotel liaison',
          '24/7 summit operations command center'
        ],
        exclusions: [
          'Scope & quotation based on audience size, location, and technical rider'
        ],
        gst_setting: 'AS_PER_LAW',
        cta_text: 'Contact for Custom Plan',
        status: 'PUBLISHED',
        sort_order: 3
      }
    ]
  }
];

export const serviceService = {
  async getCategories(): Promise<ServiceCategory[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: c.description || '',
            icon: c.icon || '',
            sort_order: c.display_order || c.sort_order || 1
          }));
        }
      } catch (e) {
        console.warn('Supabase service_categories query failed, falling back:', e);
      }
    }
    return [...INITIAL_SERVICE_CATEGORIES];
  },

  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*, service_packages(*)')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const supabaseServices = data.map((s: any) => {
            const matchedCat = INITIAL_SERVICE_CATEGORIES.find(c => 
              c.id === s.category_id || c.slug === s.category_id
            );
            return {
              id: s.id,
              category_id: s.category_id,
              category_name: matchedCat ? matchedCat.name : (s.category_name || 'Software & Web Engineering'),
              name: s.name,
              slug: s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              short_description: s.short_description || s.description || '',
              full_description: s.full_description || s.description || '',
              icon: s.icon || 'Laptop',
              cover_image: s.image_url || '/images/services/service_web_dev.jpg',
              gallery: Array.isArray(s.gallery) ? s.gallery : (s.image_url ? [s.image_url] : []),
              benefits: Array.isArray(s.features) ? s.features : (s.benefits || []),
              process_steps: s.process_steps || [
                { title: '1. Discovery & Strategy', desc: 'Define goals, target audience, and scope of work.' },
                { title: '2. Architecture & Design', desc: 'Develop modern responsive solutions and assets.' },
                { title: '3. Testing & Integration', desc: 'Verify quality, cross-platform performance, and routing.' },
                { title: '4. Delivery & Growth', desc: 'Deploy live and monitor ongoing conversion rates.' }
              ],
              disclaimer: s.disclaimer || 'Prices shown are starting rates based on standard scope.',
              is_featured: s.is_featured ?? true,
              status: s.is_published !== false ? 'PUBLISHED' : 'DRAFT',
              sort_order: s.display_order || s.sort_order || 1,
            packages: (s.service_packages && s.service_packages.length > 0)
              ? s.service_packages
                  .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
                  .map((p: any, pIdx: number) => {
                    const isCustomQuote = p.is_contact_for_quote || Number(p.price) === 0 || p.price_display_type === 'CUSTOM_QUOTE';
                    const tier = p.tier || (p.display_order === 1 ? 'STARTUP' : p.display_order === 2 ? 'GROWTH' : 'ENTERPRISE');
                    return {
                      id: p.id,
                      service_id: s.id,
                      tier,
                      name: p.name,
                      price: Number(p.price) || 0,
                      price_display_type: isCustomQuote ? 'CUSTOM_QUOTE' : (p.price_display_type || 'STARTING_FROM'),
                      currency: p.currency || 'INR',
                      target_audience: p.description || p.target_audience || (isCustomQuote ? 'Designed for: Custom enterprise architecture & scale' : 'Best for startups and growing businesses'),
                      badge: p.display_order === 2 || pIdx === 1 ? 'Most Popular' : undefined,
                      inclusions: Array.isArray(p.features) && p.features.length > 0 ? p.features : ['Customized Architecture', 'Responsive UI/UX', 'SEO Optimization', 'Dedicated Support'],
                      exclusions: Array.isArray(p.exclusions) ? p.exclusions : ['Applicable GST taxes'],
                      gst_setting: p.gst_setting || 'AS_PER_LAW',
                      cta_text: isCustomQuote ? 'Contact for Custom Plan' : (p.cta_text || 'Get Started'),
                      status: p.is_active !== false ? 'PUBLISHED' : 'DRAFT',
                      sort_order: p.display_order || (pIdx + 1)
                    };
                  })
              : [
                  {
                    id: `pkg-${s.id}-starter`,
                    service_id: s.id,
                    tier: 'STARTUP',
                    name: `${s.name} Starter`,
                    price: Number(s.base_price) || 24999,
                    price_display_type: 'STARTING_FROM',
                    currency: 'INR',
                    target_audience: 'Best for startups and early-stage companies',
                    inclusions: Array.isArray(s.features) && s.features.length > 0 ? s.features.slice(0, 5) : ['Essential Architecture', 'Responsive Mobile-Ready UI', 'SEO Structure', '1 Month Support'],
                    exclusions: ['Custom enterprise integrations', 'Applicable GST taxes'],
                    gst_setting: 'AS_PER_LAW',
                    cta_text: 'Get Started',
                    status: 'PUBLISHED',
                    sort_order: 1
                  },
                  {
                    id: `pkg-${s.id}-growth`,
                    service_id: s.id,
                    tier: 'GROWTH',
                    name: `${s.name} Growth`,
                    price: (Number(s.base_price) || 24999) * 2.5,
                    price_display_type: 'STARTING_FROM',
                    currency: 'INR',
                    target_audience: 'Best for scaling businesses needing high performance',
                    badge: 'Most Popular',
                    inclusions: Array.isArray(s.features) && s.features.length > 0 ? s.features : ['Full Turnkey Solution', 'Advanced Integration & CRM Sync', 'Speed Tuning & Security', '3 Months Dedicated Support'],
                    exclusions: ['Third-party premium licensing', 'Applicable GST taxes'],
                    gst_setting: 'AS_PER_LAW',
                    cta_text: 'Get Started',
                    status: 'PUBLISHED',
                    sort_order: 2
                  },
                  {
                    id: `pkg-${s.id}-enterprise`,
                    service_id: s.id,
                    tier: 'ENTERPRISE',
                    name: `${s.name} Enterprise Custom`,
                    price: 0,
                    price_display_type: 'CUSTOM_QUOTE',
                    currency: 'INR',
                    target_audience: 'Designed for large organizations & tailored custom plans',
                    inclusions: ['Bespoke enterprise architecture & workflows', 'Dedicated solution architect & 24/7 SLA', 'Custom multi-platform integration', 'Priority security compliance audit'],
                    exclusions: ['Final quote tailored based on requirements'],
                    gst_setting: 'AS_PER_LAW',
                    cta_text: 'Contact for Custom Plan',
                    status: 'PUBLISHED',
                    sort_order: 3
                  }
                ]
            };
          });

          // Return exactly the curated services from Supabase
          return supabaseServices as Service[];
        }
      } catch (e) {
        console.warn('Supabase services query failed, falling back to local storage:', e);
      }
    }

    const saved = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [...INITIAL_SERVICES];
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await this.getServices();
    const s = services.find(item => item.slug === slug);
    return s ? JSON.parse(JSON.stringify(s)) : null;
  },

  async saveService(serviceData: Partial<Service>, changedBy: string = 'Super Admin'): Promise<Service> {
    const services = await this.getServices();
    let updatedService: Service;

    if (serviceData.id) {
      const idx = services.findIndex(s => s.id === serviceData.id);
      if (idx !== -1) {
        const oldService = services[idx];
        if (serviceData.packages && oldService.packages) {
          serviceData.packages.forEach(newPkg => {
            const oldPkg = oldService.packages?.find(p => p.id === newPkg.id);
            if (oldPkg && (oldPkg.price !== newPkg.price || oldPkg.price_display_type !== newPkg.price_display_type)) {
              this.logPriceAudit({
                id: `audit-${Date.now()}-${Math.random()}`,
                service_id: oldService.id,
                service_name: oldService.name,
                package_id: newPkg.id,
                package_name: newPkg.name,
                old_price_display: oldPkg.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : `₹${oldPkg.price.toLocaleString()}`,
                new_price_display: newPkg.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : `₹${newPkg.price.toLocaleString()}`,
                changed_by: changedBy,
                timestamp: new Date().toISOString()
              });
            }
          });
        }

        services[idx] = { ...services[idx], ...serviceData } as Service;
        updatedService = services[idx];
      } else {
        updatedService = serviceData as Service;
        services.push(updatedService);
      }
    } else {
      updatedService = {
        id: `srv-${Date.now()}`,
        name: serviceData.name || 'New Service',
        slug: serviceData.slug || `service-${Date.now()}`,
        short_description: serviceData.short_description || '',
        full_description: serviceData.full_description || '',
        icon: serviceData.icon || 'Laptop',
        cover_image: serviceData.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        is_featured: serviceData.is_featured ?? false,
        status: serviceData.status || 'PUBLISHED',
        sort_order: services.length + 1,
        ...serviceData
      } as Service;
      services.push(updatedService);
    }

    // Save locally
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));

    // Also sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updatedService.id);
        await supabase.from('services').upsert({
          ...(isUuid ? { id: updatedService.id } : {}),
          name: updatedService.name,
          slug: updatedService.slug,
          short_description: updatedService.short_description,
          full_description: updatedService.full_description,
          icon: updatedService.icon,
          image_url: updatedService.cover_image,
          is_published: updatedService.status === 'PUBLISHED',
          is_active: true
        });
      } catch (err) {
        console.warn('Supabase service upsert error:', err);
      }
    }

    // Global live event broadcast across tabs/components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_services_updated', { detail: { service: updatedService } }));
      window.dispatchEvent(new Event('storage'));
    }

    return JSON.parse(JSON.stringify(updatedService));
  },

  async deleteService(id: string): Promise<boolean> {
    let services = await this.getServices();
    services = services.filter(s => s.id !== id);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase service delete error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_services_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return true;
  },

  async logPriceAudit(record: PriceAuditRecord): Promise<void> {
    const logs = await this.getPriceAuditLogs();
    logs.unshift(record);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  },

  async getPriceAuditLogs(): Promise<PriceAuditRecord[]> {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'audit-initial',
        service_id: 'srv-web-dev',
        service_name: 'Website Development',
        package_id: 'pkg-web-ent',
        package_name: 'Enterprise Website',
        old_price_display: '₹49,999',
        new_price_display: '₹59,999',
        changed_by: 'Super Admin',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }
};
