import { PortfolioProject, CaseStudy, ProductionPartner } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

let localProjects: PortfolioProject[] = [
  // 1. WEB & APP PLATFORMS WITH CRM (SAAS PRODUCTS)
  {
    id: 'proj-velametric-1',
    title: 'Real Estate & Property Dealer CRM Platform',
    slug: 'real-estate-property-dealer-crm',
    client: 'PropTech SaaS Solution',
    live_url: 'https://navajowhite-ant-953565.hostingersite.com/',
    project_type: 'web_app',
    description: 'An all-in-one real estate website and CRM system featuring interactive 3D property listings, automated agent lead assignment, and instant visit scheduling.',
    challenge: 'High drop-off rate on luxury property detail pages and fragmented lead tracking across property agents.',
    solution: 'Built a custom PropTech website with interactive WebGL floorplan previews and direct routing to the Velametric Real Estate CRM pipeline.',
    results: 'Generated 140+ qualified buyer inquiries in 30 days and reduced cost per lead acquisition by 62%.',
    featured_image: '/images/services/saas_property_crm.jpg',
    gallery: [
      '/images/services/saas_property_crm.jpg'
    ],
    videos: [],
    completion_date: '2026-08-01',
    testimonial_quote: 'The real estate CRM and automated agent lead assignment transformed our luxury property sales completely.',
    testimonial_author: 'Managing Director, Velametric Real Estate Group',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Website Development', 'Real Estate CRM', '3D Property Showcases'],
    technologies: ['Velametric PropTech Engine', 'React', 'Three.js', 'PostgreSQL'],
    industry: 'Real Estate & PropTech'
  },
  {
    id: 'proj-velametric-2',
    title: 'Education Institute ERP & LMS Platform',
    slug: 'education-institute-erp-lms',
    client: 'EdTech Cloud ERP',
    live_url: 'https://sienna-chimpanzee-129344.hostingersite.com/',
    project_type: 'web_app',
    description: 'A comprehensive distance learning portal and student enrollment CRM designed for university distance education institutes.',
    challenge: 'EduNexus faced unoptimized course enrollment funnels, slow admission processing, and fragmented student communication.',
    solution: 'Integrated a headless CMS course catalog with automated admission lead follow-up email sequences and student portal integration.',
    results: 'Over 15,000 active distance students enrolled within 6 months while lowering student acquisition cost by 40%.',
    featured_image: '/images/services/saas_education_institute.jpg',
    gallery: ['/images/services/saas_education_institute.jpg'],
    videos: [],
    completion_date: '2026-08-10',
    testimonial_quote: 'Our distance education course enrollments tripled within two quarters thanks to automated student follow-up pipelines.',
    testimonial_author: 'Dean of Admissions, Institute of Distance Education',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Website Development', 'Distance Education CRM', 'Student Portal'],
    technologies: ['Velametric EdTech LMS Engine', 'React', 'Supabase Realtime'],
    industry: 'Education & EdTech'
  },
  {
    id: 'proj-velametric-3',
    title: 'Modern D2C E-Commerce & Retail CRM',
    slug: 'ecommerce-website-platform',
    client: 'Retail Commerce SaaS',
    live_url: 'https://mediumvioletred-viper-351367.hostingersite.com/',
    project_type: 'web_app',
    description: 'A high-conversion e-commerce storefront with integrated customer CRM, order tracking, abandoned cart follow-up automation, and payment gateways.',
    challenge: 'High abandoned cart rates and lack of customer lifetime value (LTV) tracking across online sales channels.',
    solution: 'Launched headless e-commerce storefront linked directly to customer purchase CRM and automated WhatsApp/email recovery tasks.',
    results: '310% increase in repeat customer orders and 100% multi-channel sales attribution.',
    featured_image: '/images/services/saas_ecommerce_website.jpg',
    gallery: ['/images/services/saas_ecommerce_website.jpg'],
    videos: [],
    completion_date: '2026-08-20',
    testimonial_quote: 'The integrated e-commerce CRM allowed us to automate abandoned cart recoveries and track customer retention effortlessly.',
    testimonial_author: 'VP of E-Commerce, Velametric Retail',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['E-Commerce Storefront', 'Customer CRM', 'Payment Gateways'],
    technologies: ['Velametric Commerce Engine', 'React', 'Supabase'],
    industry: 'Retail & E-Commerce'
  },

  // 2. ENTERPRISE FINTECH, HEALTHCARE & MEDIA WEB PLATFORMS
  {
    id: 'proj-velametric-4',
    title: 'FinTech Subsidy & Debt Advisory Portal',
    slug: 'fintech-subsidy-debt-advisory',
    client: 'Apex Financial Advisory',
    live_url: '/request-quote',
    project_type: 'web_app',
    description: 'An automated financial consultancy portal with instant government subsidy eligibility calculations, DPR documentation generator, and multi-bank loan application tracking.',
    challenge: 'Long manual lead evaluation cycles for corporate subsidy applications and lack of secure document exchange with banking syndicates.',
    solution: 'Engineered an automated subsidy eligibility wizard with real-time DPR document generation and encrypted client audit vaults.',
    results: 'Accelerated loan application approval times by 55% and facilitated over ₹45 Crores in subsidized capital approvals.',
    featured_image: '/images/services/service_govt_subsidy.jpg',
    gallery: ['/images/services/service_govt_subsidy.jpg', '/images/services/service_business_loans.jpg'],
    videos: [],
    completion_date: '2026-08-25',
    testimonial_quote: 'The automated DPR and subsidy calculation portal revolutionized our client onboarding and bank syndication pipelines.',
    testimonial_author: 'Senior Partner, Apex Financial Advisory',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['FinTech Portal', 'Subsidy Engine', 'DPR Document Generator'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL Engine'],
    industry: 'Finance & Banking'
  },
  {
    id: 'proj-velametric-5',
    title: 'Doon Healthcare & Telemedicine Hub',
    slug: 'doon-healthcare-telemedicine-hub',
    client: 'Doon Home Care Services (DHCS)',
    live_url: '/case-studies/doon-home-care-services-dehradun',
    project_type: 'web_app',
    description: 'A comprehensive patient intake system, automated caregiver assignment dashboard, and 24/7 urgent emergency medical dispatch portal.',
    challenge: 'High inbound patient emergency calls with manual paper-based caregiver scheduling and lack of live patient vitals tracking.',
    solution: 'Designed a cloud-native healthcare portal with immediate Google profile synchronization, live nurse dispatching, and patient records.',
    results: 'Scaled patient inquiry volume from 2-3 per month to over 200+ monthly high-intent inquiries with 100% caregiver dispatch compliance.',
    featured_image: '/images/blog/dhcs_healthcare_hero.jpg',
    gallery: ['/images/blog/dhcs_healthcare_hero.jpg', '/images/blog/dhcs_home_icu_setup.jpg'],
    videos: [],
    completion_date: '2026-09-01',
    testimonial_quote: 'Velametric built the digital foundation that turned our local service into Uttarakhand’s premier home healthcare provider.',
    testimonial_author: 'Director of Healthcare, Doon Home Care Services',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Healthcare Portal', 'Patient CRM', 'Staff Dispatch Engine'],
    technologies: ['React', 'Supabase Realtime', 'Tailwind CSS'],
    industry: 'Healthcare & Telemedicine'
  },
  {
    id: 'proj-velametric-6',
    title: 'Digital Media & Multi-Channel News CMS',
    slug: 'news-media-publishing-cms',
    client: 'National News Wire Network',
    live_url: '/request-quote',
    project_type: 'web_app',
    description: 'A high-traffic news publishing portal with automated RNI compliance archiving, live breaking news tickers, and targeted advertisement slot monetization.',
    challenge: 'Massive concurrent reader spikes during regional elections causing high server latencies and unoptimized ad yields.',
    solution: 'Architected a decoupled headless editorial CMS with edge-cached SSR rendering, dynamic paywall gating, and automated syndication feeds.',
    results: 'Handled over 1.8M concurrent readers with sub-500ms global latency and increased programmatic ad yield by 84%.',
    featured_image: '/images/services/service_media_pr.jpg',
    gallery: ['/images/services/service_media_pr.jpg', '/images/services/service_video_prod.jpg'],
    videos: [],
    completion_date: '2026-09-10',
    testimonial_quote: 'The news CMS architecture effortlessly handles million-reader surges while keeping our editorial newsroom fast and synchronized.',
    testimonial_author: 'Editor-in-Chief, National News Wire',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['News CMS', 'Editorial Workflow', 'Ad Monetization Engine'],
    technologies: ['React', 'Next.js Edge Runtime', 'PostgreSQL'],
    industry: 'Media & Publishing'
  }
];

let localCaseStudies: CaseStudy[] = [
  {
    id: 'cs-doon-home-care',
    title: 'Doon Home Care Services (Dehradun) — Cementing Local Medical Search Authority',
    slug: 'doon-home-care-services-dehradun',
    client: 'Doon Home Care Services (Dehradun)',
    challenge: 'Cement absolute local authority for high-intent medical searches in a highly competitive regional market.',
    solution: 'Through sustained optimization, we drove a significant volumetric surge in customer engagement. Starting from a steady baseline in April 2026, profile interactions climbed to a peak of 197 in July. Over the measured period, the profile generated an impressive 1,045 total customer interactions while maintaining a stellar 4.7-star reputation across 106 reviews.',
    results: 'Organic Lead Generation: Drove 596 direct organic calls from the profile, maintaining peak volumes of over 120 calls per month during the summer. Search Dominance: Captured 8,748 total views, with 77% (6,746 views) originating directly from mobile Google Search. Keyword Mastery: Secured top visibility for high-converting, exact-match keywords, including "home care services dehradun" (328 searches) and "home care job dehradun" (137 searches).',
    featured_image: '/images/services/service_digital_mktg.jpg',
    testimonial_quote: 'Velametric turned our Google Business Profile into our primary channel for patient inquiries. Over 590 direct phone calls in just a few months speak for themselves.',
    testimonial_author: 'Director of Operations, Doon Home Care Services',
    is_featured: true,
    status: 'PUBLISHED',
    metrics: [
      { id: 'm-dhcs-1', case_study_id: 'cs-doon-home-care', value: '596', prefix: '', suffix: ' Calls', label: 'Direct Organic Calls' },
      { id: 'm-dhcs-2', case_study_id: 'cs-doon-home-care', value: '8,748', prefix: '', suffix: ' Views', label: 'Total Search Views' },
      { id: 'm-dhcs-3', case_study_id: 'cs-doon-home-care', value: '77', prefix: '', suffix: '%', label: 'Mobile Google Search' },
      { id: 'm-dhcs-4', case_study_id: 'cs-doon-home-care', value: '1,045', prefix: '', suffix: ' Int.', label: 'Total Interactions' }
    ],
    charts: [
      {
        title: 'Profile Interactions (Apr 2026 – Sept 2026)',
        subtitle: '1,045 Total Interactions • Peak 197 in July 2026',
        image_url: '/images/case-studies/doon_interactions_chart.png',
        type: 'interactions'
      },
      {
        title: 'Platform Breakdown & Top Search Queries',
        subtitle: '8,748 Total Views • 77% Mobile Google Search • #1 Keyword Rankings',
        image_url: '/images/case-studies/doon_platform_searches_chart.png',
        type: 'searches'
      },
      {
        title: 'Google Business Profile Live Proof',
        subtitle: '4.7★ Rating across 106 Google Reviews • Dehradun',
        image_url: '/images/case-studies/doon_google_profile.png',
        type: 'profile'
      }
    ]
  },
  {
    id: 'cs-dhcs-meerut',
    title: 'DHCS Nursing Home Care (Meerut) — Compounding Digital Growth in a New Territory',
    slug: 'dhcs-nursing-home-care-meerut',
    client: 'DHCS Nursing Home Care (Meerut)',
    challenge: 'Rapidly scale a new geographical footprint and build local market trust from the ground up.',
    solution: 'This profile is a textbook example of compounding digital growth. From a baseline of just 60 interactions in April 2026, our strategy delivered strict, unbroken month-over-month volumetric growth, culminating in a peak of 106 interactions by August. The profile successfully generated 413 total interactions and established early market trust with a 4.6-star rating.',
    results: 'Targeted Visibility: Accumulated 4,289 total views by successfully intercepting broad, high-value local intent searches. Mobile-First Discovery: Captured the on-the-go audience effortlessly, with 73% (3,119 views) of traffic driven by mobile search. Category Domination: Ranked prominently for critical industry terms like "health care meerut" (173 searches) and "home care services meerut" (138 searches).',
    featured_image: '/images/services/service_web_dev.jpg',
    testimonial_quote: 'Expanding into Meerut was made seamless with Velametric local SEO. We achieved month-over-month compounding growth without spending heavily on paid ads.',
    testimonial_author: 'Managing Partner, DHCS Nursing Home Care',
    is_featured: true,
    status: 'PUBLISHED',
    metrics: [
      { id: 'm-meerut-1', case_study_id: 'cs-dhcs-meerut', value: '4,289', prefix: '', suffix: ' Views', label: 'Targeted Profile Views' },
      { id: 'm-meerut-2', case_study_id: 'cs-dhcs-meerut', value: '73', prefix: '', suffix: '%', label: 'Mobile Search Share' },
      { id: 'm-meerut-3', case_study_id: 'cs-dhcs-meerut', value: '413', prefix: '', suffix: ' Int.', label: 'Total Interactions' },
      { id: 'm-meerut-4', case_study_id: 'cs-dhcs-meerut', value: '4.6', prefix: '', suffix: '★', label: 'Market Trust Rating' }
    ],
    charts: [
      {
        title: 'Compounding Volumetric Growth (Apr 2026 – Sept 2026)',
        subtitle: '413 Total Interactions • Baseline 60 to Peak 106 in August 2026',
        image_url: '/images/case-studies/meerut_interactions_chart.png',
        type: 'interactions'
      },
      {
        title: 'Google Business Profile Live Proof',
        subtitle: '4.6★ Rating across 9 Google Reviews • Meerut',
        image_url: '/images/case-studies/meerut_google_profile.png',
        type: 'profile'
      }
    ]
  },
  {
    id: 'cs-vrindavan-studio',
    title: 'Vrindavan Photo Studio (Dehradun) — Hyper-Local "Near Me" Dominance & Peak Bookings',
    slug: 'vrindavan-photo-studio-dehradun',
    client: 'Vrindavan Photo Studio (Dehradun)',
    challenge: 'Capture hyper-local, proximity-based search traffic to drive direct footfall and immediate bookings for a creative service.',
    solution: 'By optimizing for immediate local intent, we transformed this profile into a lead-generation engine. The business experienced a sharp volumetric spike mid-summer, climbing from a baseline of roughly 80 interactions in April to nearly 150 by July. In total, the studio secured 631 valuable customer interactions across the measured timeline.',
    results: '"Near Me" Optimization: Mastered hyper-local discovery, driving a massive 751 exact-match searches for "photo studio near me" and 447 searches for "photo". Massive Exposure: Achieved an outstanding 8,440 total profile views, ensuring absolute visibility in the highly competitive local map pack. Conversion Readiness: Leveraged mobile accessibility to drive 72% (6,068) of all views, putting the studio right in the hands of ready-to-book customers exactly when they needed a photographer.',
    featured_image: '/images/case-studies/vrindavan_interactions_chart.png',
    testimonial_quote: 'We dominated "photo studio near me" across Dehradun. The sudden spike in customers walking in directly mentioning Google Maps was incredible.',
    testimonial_author: 'Studio Head, Vrindavan Photo Studio',
    is_featured: true,
    status: 'PUBLISHED',
    metrics: [
      { id: 'm-vrindavan-1', case_study_id: 'cs-vrindavan-studio', value: '8,440', prefix: '', suffix: ' Views', label: 'Total Profile Views' },
      { id: 'm-vrindavan-2', case_study_id: 'cs-vrindavan-studio', value: '751', prefix: '', suffix: ' Searches', label: '"Photo Studio Near Me"' },
      { id: 'm-vrindavan-3', case_study_id: 'cs-vrindavan-studio', value: '631', prefix: '', suffix: ' Int.', label: 'Total Interactions' },
      { id: 'm-vrindavan-4', case_study_id: 'cs-vrindavan-studio', value: '72', prefix: '', suffix: '%', label: 'Mobile Conversion' }
    ],
    charts: [
      {
        title: 'Volumetric Interaction Surge (Apr 2026 – Sept 2026)',
        subtitle: '631 Total Customer Interactions • Peaked at ~150 in July 2026',
        image_url: '/images/case-studies/vrindavan_interactions_chart.png',
        type: 'interactions'
      },
      {
        title: 'Device & Search Breakdown (8,440 Profile Views)',
        subtitle: '72% Mobile Search (6,068) • 751 Searches for "photo studio near me"',
        image_url: '/images/case-studies/vrindavan_platform_searches_chart.png',
        type: 'searches'
      }
    ]
  }
];

export const portfolioService = {
  async getProjects(): Promise<PortfolioProject[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const supabaseProjects = data.map((p: any) => {
            const localMatch = localProjects.find(lp => lp.id === p.id || lp.slug === p.slug);
            return {
              id: p.id,
              title: p.title,
              slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              client: p.client_name || localMatch?.client || 'Velametric Client',
              live_url: p.project_url || localMatch?.live_url || '',
              project_type: localMatch?.project_type || p.category || 'web_app',
              production_partner: localMatch?.production_partner,
              video_reels: localMatch?.video_reels || [],
              description: p.short_description || p.description || localMatch?.description || '',
              challenge: p.challenge || localMatch?.challenge || 'Scaling performance and user conversion for modern market leaders.',
              solution: p.solution || p.description || localMatch?.solution || 'Delivered a resilient digital architecture with clean UI/UX.',
              results: p.results || localMatch?.results || 'Achieved measurable engagement growth and high-performing lead conversion.',
              featured_image: p.featured_image || localMatch?.featured_image || '/images/services/saas_property_crm.jpg',
              gallery: Array.isArray(p.gallery_images) ? p.gallery_images : (localMatch?.gallery || (p.featured_image ? [p.featured_image] : [])),
              videos: p.video_url ? [p.video_url] : (localMatch?.videos || []),
              instagram_url: localMatch?.instagram_url,
              completion_date: p.created_at ? p.created_at.split('T')[0] : (localMatch?.completion_date || '2026-08-01'),
              is_featured: p.is_featured ?? (localMatch?.is_featured ?? true),
              status: p.status === 'completed' ? 'PUBLISHED' : (p.status || 'PUBLISHED'),
              services_used: Array.isArray(p.technologies) ? p.technologies : (localMatch?.services_used || ['Website Development', 'CRM Platform']),
              technologies: Array.isArray(p.technologies) ? p.technologies : (localMatch?.technologies || ['React', 'Tailwind CSS', 'Supabase']),
              industry: p.category || localMatch?.industry || 'Technology'
            };
          });

          // Merge any local projects not yet in Supabase (such as Ekraahee Films cinema production showcase)
          const merged: PortfolioProject[] = [...supabaseProjects];
          for (const lp of localProjects) {
            if (!merged.some(sp => sp.slug === lp.slug || sp.id === lp.id)) {
              merged.push(lp);
            }
          }
          return merged;
        }
      } catch (e) {
        console.warn('Supabase portfolio_projects query failed, falling back to local:', e);
      }
    }
    return [...localProjects];
  },

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    const projects = await this.getProjects();
    let p = projects.find(item => item.slug === slug);
    if (!p) {
      p = localProjects.find(item => item.slug === slug);
    }
    return p ? JSON.parse(JSON.stringify(p)) : null;
  },

  async getCaseStudies(): Promise<CaseStudy[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            title: c.title,
            slug: c.slug || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            client: c.client_name || c.client || 'Client Name',
            challenge: c.challenge || '',
            solution: c.solution || '',
            results: c.results || '',
            featured_image: c.banner_image || c.featured_image || '/images/services/service_digital_mktg.jpg',
            testimonial_quote: c.testimonial_quote,
            testimonial_author: c.testimonial_author,
            is_featured: c.is_featured ?? true,
            status: c.status || 'PUBLISHED',
            metrics: Array.isArray(c.metrics) ? c.metrics : [],
            charts: Array.isArray(c.charts) && c.charts.length > 0 ? c.charts : (
              c.slug === 'doon-home-care-services-dehradun' ? [
                {
                  title: 'Profile Interactions (Apr 2026 – Sept 2026)',
                  subtitle: '1,045 Total Interactions • Peak 197 in July 2026',
                  image_url: '/images/case-studies/doon_interactions_chart.png',
                  type: 'interactions'
                },
                {
                  title: 'Platform Breakdown & Top Search Queries',
                  subtitle: '8,748 Total Views • 77% Mobile Google Search • #1 Keyword Rankings',
                  image_url: '/images/case-studies/doon_platform_searches_chart.png',
                  type: 'searches'
                },
                {
                  title: 'Google Business Profile Live Proof',
                  subtitle: '4.7★ Rating across 106 Google Reviews • Dehradun',
                  image_url: '/images/case-studies/doon_google_profile.png',
                  type: 'profile'
                }
              ] : c.slug === 'dhcs-nursing-home-care-meerut' ? [
                {
                  title: 'Compounding Volumetric Growth (Apr 2026 – Sept 2026)',
                  subtitle: '413 Total Interactions • Baseline 60 to Peak 106 in August 2026',
                  image_url: '/images/case-studies/meerut_interactions_chart.png',
                  type: 'interactions'
                },
                {
                  title: 'Google Business Profile Live Proof',
                  subtitle: '4.6★ Rating across 9 Google Reviews • Meerut',
                  image_url: '/images/case-studies/meerut_google_profile.png',
                  type: 'profile'
                }
              ] : []
            )
          }));
        }
      } catch (e) {
        console.warn('Supabase case_studies query failed, falling back to local:', e);
      }
    }
    return [...localCaseStudies];
  },

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    const list = await this.getCaseStudies();
    const cs = list.find(item => item.slug === slug);
    return cs ? JSON.parse(JSON.stringify(cs)) : null;
  },

  async saveProject(project: Partial<PortfolioProject>): Promise<PortfolioProject> {
    if (project.id) {
      const idx = localProjects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        localProjects[idx] = { ...localProjects[idx], ...project } as PortfolioProject;
      }
    } else {
      const newProj: PortfolioProject = {
        id: `proj-${Date.now()}`,
        title: project.title || 'New Project',
        slug: project.slug || `project-${Date.now()}`,
        client: project.client || 'Client Name',
        live_url: project.live_url || '',
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        results: project.results || '',
        featured_image: project.featured_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        gallery: project.gallery || [],
        videos: project.videos || [],
        completion_date: project.completion_date || new Date().toISOString().split('T')[0],
        is_featured: project.is_featured ?? false,
        status: project.status || 'PUBLISHED',
        ...project
      };
      localProjects.push(newProj);
    }

    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id || '');
        await supabase.from('portfolio_projects').upsert({
          ...(isUuid ? { id: project.id } : {}),
          title: project.title,
          slug: project.slug,
          client_name: project.client,
          project_url: project.live_url,
          featured_image: project.featured_image,
          description: project.description,
          is_featured: project.is_featured ?? true,
          status: 'completed'
        });
      } catch (err) {
        console.warn('Supabase portfolio upsert error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_portfolio_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return JSON.parse(JSON.stringify(project));
  },

  async saveCaseStudy(cs: Partial<CaseStudy>): Promise<CaseStudy> {
    if (cs.id) {
      const idx = localCaseStudies.findIndex(item => item.id === cs.id);
      if (idx !== -1) {
        localCaseStudies[idx] = { ...localCaseStudies[idx], ...cs } as CaseStudy;
      }
    } else {
      const newCS: CaseStudy = {
        id: `cs-${Date.now()}`,
        title: cs.title || 'New Case Study',
        slug: cs.slug || `case-study-${Date.now()}`,
        client: cs.client || 'Client',
        challenge: cs.challenge || '',
        solution: cs.solution || '',
        results: cs.results || '',
        featured_image: cs.featured_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        is_featured: cs.is_featured ?? false,
        status: cs.status || 'PUBLISHED',
        ...cs
      };
      localCaseStudies.push(newCS);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_portfolio_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return JSON.parse(JSON.stringify(cs));
  },

  getPartners(): ProductionPartner[] {
    return [...PRODUCTION_PARTNERS];
  },

  getPartnerBySlug(slug: string): ProductionPartner | null {
    if (!slug) return null;
    const normalized = slug.toLowerCase().trim();
    return PRODUCTION_PARTNERS.find(p => 
      p.slug === normalized || 
      p.id === normalized || 
      p.name.toLowerCase().includes(normalized) ||
      (normalized === 'dapflix-production-showcase' && p.slug === 'dapflix') ||
      (normalized === 'ekraaheefilms-production-showcase' && p.slug === 'ekraahee-films')
    ) || null;
  }
};

export const PRODUCTION_PARTNERS: ProductionPartner[] = [
  {
    id: 'partner-ekraahee',
    name: 'Ekraahee Films',
    slug: 'ekraahee-films',
    tagline: 'Broadcast-Grade Cinematography & High-Fashion Storytelling',
    description: 'Specializing in TV commercials, luxury brand films, tech arena live broadcasts, and Arri/RED master quality video production.',
    long_bio: 'Ekraahee Films is an elite film production house delivering cinematic storytelling for global brands, fashion icons, and enterprise leaders. Armed with Arri and RED cinema cameras, master prime lenses, and international color science, Ekraahee crafts visuals that dominate digital and television broadcasts.',
    logo_url: '/images/partners/ekraahee_films_logo.png',
    website_url: 'https://ekraaheefilms.com/',
    instagram_url: 'https://www.instagram.com/ekraaheefilms/',
    stats: [
      { label: 'Commercial Projects', value: '100+' },
      { label: 'Master Quality', value: '4K HDR' },
      { label: 'Films Shipped', value: '250+' },
      { label: 'Global Reach', value: '100M+' }
    ],
    capabilities: [
      'Commercial TVCs & Broadcast Ads',
      'High-Fashion & Luxury Brand Films',
      'Multi-Cam Tech Talk & Podcast Studios',
      'Arena Stage Events & Award Shows',
      'Arri / RED Color Science & HDR Mastering'
    ],
    equipment: ['Arri Alexa Mini LF', 'RED V-Raptor 8K', 'Cooke Anamorphic Lenses', 'Techno-Crane & Steadicam Rigs']
  },
  {
    id: 'partner-dapflix',
    name: 'DAPFLIX Films & Production House',
    slug: 'dapflix',
    tagline: 'We make videos that people want • Creative Films Studio',
    description: 'Specializing in commercial films, brand storytelling, corporate videos, music videos, 4K drone cinematography, and cinematic productions.',
    long_bio: 'At DAPFLIX we bring ideas to life through powerful storytelling and high-quality cinematography. Our expert team specializes in commercial films, brand storytelling, corporate videos, social media content, and cinematic productions that leave a lasting impact. With a result-driven approach, we craft visually stunning videos that engage audiences, enhance brand identity, and drive conversions.',
    logo_url: '/images/partners/dapflix_logo.png',
    website_url: 'https://dapflix.com/portfolio/',
    instagram_url: 'https://www.instagram.com/dapflix/',
    stats: [
      { label: 'Creative Videos', value: '1,850+' },
      { label: 'TVC Visuals', value: '130+' },
      { label: 'Music Videos', value: '58+' },
      { label: 'Short Films', value: '10+' }
    ],
    capabilities: [
      'Commercial Films & Brand TVCs',
      '4K Ultra-HD Drone & Aerial Cinematography',
      'Music Videos & Creative Visuals',
      'Tourism & Mountain Documentaries',
      'Post-Production, Color Grading & VFX'
    ],
    equipment: ['Sony FX Cinema Systems', 'DJI Mavic 3 Cine 5.1K Drones', 'Gimbal Stabilizers', 'DaVinci Resolve Studio Post Suite']
  }
];
