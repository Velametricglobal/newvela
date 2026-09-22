import { PortfolioProject, CaseStudy, ProductionPartner } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

let localProjects: PortfolioProject[] = [
  // 1. VIDEO PRODUCTION
  {
    id: 'proj-video-1',
    title: 'Ekraahee Films — Commercial Video & Cinema Production Showcase',
    slug: 'ekraahee-films-showcase',
    category: 'video_production',
    project_type: 'video_production',
    client: 'Ekraahee Films',
    live_url: 'https://www.instagram.com/ekraaheefilms/',
    description: 'High-impact commercial films, luxury retail launches, multi-camera studio podcasts, live arena events, and high-converting performance UGC produced by Ekraahee Films.',
    challenge: 'Delivering broadcast-grade Arri/RED 4K cinema visuals and rapid-turnaround luxury commercial edits under strict production windows.',
    solution: 'Engineered a specialized camera workflow utilizing Arri Alexa Mini LF, anamorphic prime lenses, and DaVinci HDR studio color grading.',
    results: 'Over 15 Million cumulative campaign views and official commercial broadcast placements across national TV and digital platforms.',
    featured_image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
    ],
    videos: ['https://www.instagram.com/ekraaheefilms/'],
    completion_date: '2026-08-15',
    testimonial_quote: 'Collaborating with Velametric allows our cinema productions to integrate directly with scalable digital marketing and conversion funnels.',
    testimonial_author: 'Director of Cinematography, Ekraahee Films',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Commercial TVCs', 'Luxury Brand Films', 'Multi-Cam Podcasts', 'HDR Color Grading'],
    technologies: ['Arri Alexa Mini LF', 'RED V-Raptor 8K', 'Cooke Anamorphic Lenses'],
    industry: 'Cinema & Commercial Video',
    instagram_url: 'https://www.instagram.com/ekraaheefilms/',
    youtube_url: 'https://www.youtube.com/@EkRaaheefilms',
    video_reels: [
      {
        id: 'reel-ef1',
        title: 'Pottery Barn Flagship Store Launch',
        video_url: 'https://www.youtube.com/watch?v=WPKQbHTa2pc',
        thumbnail_url: 'https://i.ytimg.com/vi/WPKQbHTa2pc/hqdefault.jpg',
        partner_name: 'Ekraahee Films',
        category: 'Luxury Store Launch',
        views_count: '1.2M+',
        duration: '0:42'
      },
      {
        id: 'reel-ef2',
        title: 'Podcast with Qualcomm for 91mobiles',
        video_url: 'https://www.youtube.com/watch?v=wVPxaWhOwjA',
        thumbnail_url: 'https://i.ytimg.com/vi/wVPxaWhOwjA/hqdefault.jpg',
        partner_name: 'Ekraahee Films',
        category: 'Studio Tech Talk',
        views_count: '850K+',
        duration: '1:15'
      },
      {
        id: 'reel-ef3',
        title: 'IGA Awards 2025 for 91mobiles',
        video_url: 'https://www.youtube.com/watch?v=8qYlKs-dRVc',
        thumbnail_url: 'https://i.ytimg.com/vi/8qYlKs-dRVc/hqdefault.jpg',
        partner_name: 'Ekraahee Films',
        category: 'Arena Stage Event',
        views_count: '1.5M+',
        duration: '0:58'
      },
      {
        id: 'reel-ef4',
        title: 'Kinza Lemon Soda Drink Commercial',
        video_url: 'https://youtu.be/SaQQgPmnAVU',
        thumbnail_url: 'https://i.ytimg.com/vi/SaQQgPmnAVU/hqdefault.jpg',
        partner_name: 'Ekraahee Films',
        category: 'Beverage TVC',
        views_count: '2.1M+',
        duration: '0:30'
      },
      {
        id: 'reel-ef5',
        title: 'Bharat Loan Performance UGC Video Ad',
        video_url: 'https://youtu.be/RQWwFpQfQig',
        thumbnail_url: 'https://i.ytimg.com/vi/RQWwFpQfQig/hqdefault.jpg',
        partner_name: 'Ekraahee Films',
        category: 'FinTech Growth UGC',
        views_count: '3.4M+',
        duration: '0:45'
      }
    ]
  },
  {
    id: 'proj-video-2',
    title: 'Dapflix — Music Videos & Creative Visual Storytelling',
    slug: 'dapflix-production-showcase',
    category: 'video_production',
    project_type: 'video_production',
    client: 'DAPFLIX Films',
    live_url: 'https://dapflix.com/portfolio/',
    description: 'Dynamic commercial films, brand storytelling, high-energy music videos, 4K aerial drone cinema, and viral social content produced by Dapflix.',
    challenge: 'Optimizing visual pacing and dynamic sound design for maximum audience retention across viral vertical and wide-screen channels.',
    solution: 'Utilized high-framerate Sony FX systems, dynamic gimbal camera work, custom cinematic soundscapes, and stylized color LUTs.',
    results: 'Reached #1 trending rank across social music launches with over 8.5 Million cumulative cross-platform views.',
    featured_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    videos: ['https://dapflix.com/portfolio/'],
    completion_date: '2026-08-20',
    testimonial_quote: 'Dapflix turns brand stories into cinematic movements that capture youth culture and drive unmatched organic engagement.',
    testimonial_author: 'Founder & Lead Director, DAPFLIX Films',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Music Videos', 'Viral Social Reels', '4K Aerial Drone Cinematography', 'VFX'],
    technologies: ['Sony FX Cinema Systems', 'DJI Mavic 3 Cine 5.1K', 'DaVinci Resolve Studio'],
    industry: 'Music & Creative Media',
    instagram_url: 'https://www.instagram.com/dapflix/',
    video_reels: [
      {
        id: 'reel-dp1',
        title: 'Cafe On The Waves, UKI — Commercial Brand Film',
        video_url: 'https://dapflix.com/wp-content/uploads/2025/02/DAPFLIX-FILMS-CAFE-ON-THE-WAVES-UKI.mp4',
        thumbnail_url: 'https://dapflix.com/wp-content/uploads/2025/02/IMG_3337.jpg',
        partner_name: 'Dapflix',
        category: 'Hospitality Commercial',
        views_count: '450K+',
        duration: '02:14'
      },
      {
        id: 'reel-dp2',
        title: 'Uttarkashi × Dapflix — Aerial Drone & Tourism Cinema',
        video_url: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
        thumbnail_url: 'https://dapflix.com/wp-content/uploads/2025/02/counter-img3.jpg',
        partner_name: 'Dapflix',
        category: 'Tourism & Aerial Cinema',
        views_count: '820K+',
        duration: '01:48'
      },
      {
        id: 'reel-dp3',
        title: 'Urban Fashion & Music Visual Reel (Cut 33)',
        video_url: 'https://dapflix.com/wp-content/uploads/2025/02/33.mp4',
        thumbnail_url: 'https://dapflix.com/wp-content/uploads/2025/02/counter-img2.jpg',
        partner_name: 'Dapflix',
        category: 'Music Video & TVC',
        views_count: '640K+',
        duration: '00:45'
      },
      {
        id: 'reel-dp4',
        title: 'Mansi & Swapnil — Retro Love Wedding Reel',
        video_url: 'https://dapflix.com/wp-content/uploads/2025/03/AQN6qG8rwAJbhnu2yYkyKThtZcu00393c2jRDpiOpM3lwGtAM3n6jqxc8soOiE9xTMHhCPDToZo849qCOASX3UIj9_xb-K2TAxunY0s.mp4',
        thumbnail_url: 'https://dapflix.com/wp-content/uploads/2025/02/counter-img4.jpg',
        partner_name: 'Dapflix',
        category: 'Instagram Wedding Reel',
        instagram_url: 'https://www.instagram.com/reel/DbDsHASSajx/',
        views_count: '48.5K',
        duration: '00:40'
      }
    ]
  },

  // 2. NEWS WEBSITES
  {
    id: 'proj-news-lokjan',
    title: 'Lokjan Express — Leading Digital News & Current Affairs Network',
    slug: 'lokjan-express-news-portal',
    category: 'news_website',
    project_type: 'web_app',
    client: 'Lokjan Express Media Network',
    live_url: 'https://lokjanexpress.com/',
    description: 'High-performance Hindi digital news publishing platform featuring instant breaking news tickers, automated editorial workflow, regional beat reporting, and high-volume reader scale.',
    challenge: 'Handling massive concurrent reader surges during national and regional elections without server latency spikes or ad monetization degradation.',
    solution: 'Architected an ultra-fast edge-cached news platform with automated Google AMP integration, lazy-loaded multimedia feeds, and targeted responsive ad zones.',
    results: 'Delivers over 500,000 monthly reader page views with 99.99% uptime and sub-second mobile page loads.',
    featured_image: '/images/services/news_portal_lokjan.jpg',
    gallery: ['/images/services/news_portal_lokjan.jpg', '/images/services/news_portal_featured.jpg'],
    videos: [],
    completion_date: '2026-08-28',
    testimonial_quote: 'Lokjan Express operates at lightning speed even during election night surges. Our reader engagement and ad revenue have never been higher.',
    testimonial_author: 'Managing Editor, Lokjan Express',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['News Portal Development', 'Editorial CMS', 'AMP & Mobile Speed', 'AdSense Monetization'],
    technologies: ['Next.js', 'WordPress Headless', 'Cloudflare Edge CDN', 'Redis Cache'],
    industry: 'Digital News & Media'
  },
  {
    id: 'proj-news-gangakhabar',
    title: 'Ganga Khabar — Regional News & Cultural Digital Gazette',
    slug: 'ganga-khabar-news-portal',
    category: 'news_website',
    project_type: 'web_app',
    client: 'Ganga Khabar Digital Gazette',
    live_url: 'https://gangakhabar.com/',
    description: 'Comprehensive regional news publication delivering verified community journalism, cultural archives, state political analyses, and real-time social media news syndication.',
    challenge: 'Expanding digital readership in Tier-2 and Tier-3 hill regions with inconsistent network bandwidth and unoptimized social sharing.',
    solution: 'Implemented lightweight progressive web layouts with automated OpenGraph preview generation, instant WhatsApp sharing buttons, and local cached offline reading.',
    results: 'Over 340% increase in social referral traffic and 68% boost in average time spent per news article.',
    featured_image: '/images/services/news_portal_gangakhabar.jpg',
    gallery: ['/images/services/news_portal_gangakhabar.jpg', '/images/services/news_portal_featured.jpg'],
    videos: [],
    completion_date: '2026-09-02',
    testimonial_quote: 'Ganga Khabar became the primary digital daily source for thousands across Uttarakhand thanks to Velametric’s flawless mobile optimization.',
    testimonial_author: 'Chief Editor, Ganga Khabar',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Regional News Website', 'Social Syndication', 'Mobile Optimization', 'Local SEO'],
    technologies: ['React', 'Headless WordPress', 'Varnish Cache', 'Tailwind CSS'],
    industry: 'Regional Media & Journalism'
  },
  {
    id: 'proj-news-52garh',
    title: '52 Garh Samachar — Independent Investigative Journalism Portal',
    slug: '52-garh-samachar-news-portal',
    category: 'news_website',
    project_type: 'web_app',
    client: '52 Garh Samachar Network',
    live_url: 'https://52garhsamachar.com/',
    description: 'Authoritative regional journalism platform delivering in-depth investigative reports, citizen journalism tip line, live video updates, and daily digital e-paper editions.',
    challenge: 'Streamlining daily multi-edition PDF e-paper publishing and protecting editorial journalists with encrypted reporting avenues.',
    solution: 'Deployed an interactive SVG-mapped digital e-paper reader, citizen whistleblowing submission system, and automated multi-channel social push alerts.',
    results: 'Over 50,000 daily digital e-paper readers and 99.98% delivery reliability across Uttarakhand and North India.',
    featured_image: '/images/services/news_portal_52garh.jpg',
    gallery: ['/images/services/news_portal_52garh.jpg', '/images/services/news_portal_featured.jpg'],
    videos: [],
    completion_date: '2026-09-05',
    testimonial_quote: 'Our readers love the intuitive e-paper reader and breaking alerts. It gives our independent journalism real institutional authority.',
    testimonial_author: 'Director of Editorial, 52 Garh Samachar',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Digital E-Paper Portal', 'Investigative News CMS', 'Push Alert Engine', 'Media Storage'],
    technologies: ['Next.js', 'Digital E-Paper Reader', 'PostgreSQL', 'Cloudflare R2'],
    industry: 'News & Investigative Media'
  },

  // 3. CRM & SAAS PLATFORMS
  {
    id: 'proj-velametric-booking-crm',
    title: 'Booking Engine & Hospitality CRM — Homestays, Hotels & Tour Operators',
    slug: 'booking-engine-hospitality-crm',
    category: 'crm_saas',
    client: 'Velametric Hospitality & Travel Tech (Hotels, Homestays & Tour Operators)',
    live_url: 'https://global-trek-hub.pages.dev/',
    admin_url: 'https://global-trek-hub.pages.dev/admin.html',
    project_type: 'web_app',
    description: 'A high-converting direct-booking engine and hospitality CRM engineered to eliminate 18–25% OTA commissions. Features real-time inventory slots, instant WhatsApp voucher dispatch, Supabase cloud CRM sync, 1-click police/forest checkpoint manifest generator, and mobile host administration.',
    challenge: 'Property hosts and tour operators lose 18% to 25% of top-line revenue to OTA aggregators, waste hours on manual entry for police/forest permits, and suffer low inquiry conversion rates over traditional email.',
    solution: 'Engineered a direct guest booking workflow with 25% advance / full UPI payment flexibility, automated WhatsApp digital pass delivery, real-time Supabase cloud sync, and 1-click PDF/CSV export for tourist checkpoint manifests.',
    results: '0% middleman commission on direct reservations, 98% message open rate via WhatsApp automation, and automated guest manifest compliance within 30 seconds.',
    featured_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [],
    completion_date: '2026-09-19',
    testimonial_quote: 'Switching to Velametric’s direct booking engine saved us tens of thousands in OTA commissions each month. Trekkers and hotel guests love the instant WhatsApp passes, and the 1-click police manifest export is a lifesaver.',
    testimonial_author: 'Jagvir Rana & Manish Rana, Operations Directors — Himalayan Hospitality & Expeditions',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Booking Engine Development', 'Hospitality CRM Platform', 'WhatsApp Voucher Dispatch', '1-Click Police/Forest Manifest', 'Supabase Cloud Sync'],
    technologies: ['Velametric Hospitality Core', 'Supabase Realtime DB', 'Cloudflare Pages Edge', 'WhatsApp Business API', 'Tailwind CSS'],
    industry: 'Hospitality & Travel Tech'
  },
  {
    id: 'proj-velametric-hotel-crm',
    title: 'Hotel Pinathiya Paradise — Alpine Resort Website & Central Reservation System (CRS / CRM SaaS)',
    slug: 'hotel-pinathiya-paradise-booking-crm-saas',
    category: 'crm_saas',
    client: 'Hotel Pinathiya Paradise (Purola, Uttarakhand)',
    live_url: 'https://hotel-pinathiya-paradise.pages.dev',
    admin_url: 'https://hotel-pinathiya-paradise.pages.dev/admin.html',
    project_type: 'web_app',
    description: 'An all-in-one luxury alpine resort website, interactive multi-step guest booking engine, and cloud Central Reservation System (CRS / CRM SaaS). Features real-time room inventory management, contactless Aadhaar ID document verification, automated WhatsApp booking dispatch, dining POS management, and payment reconciliation.',
    challenge: 'Managing high-peak seasonal bookings for Himalayan treks (Kedarkantha & Har Ki Dun) without double-booking rooms, eliminating manual guest check-in bottlenecks, and securing guest identification in remote hill stations.',
    solution: 'Engineered a lightweight edge-hosted CRS backend on Cloudflare Pages with zero-latency guest booking engine, instant WhatsApp voucher dispatch, and a comprehensive Host Admin CRM console featuring room assignment, payment tracking, and guest Aadhaar document verification.',
    results: 'Direct booking commission savings of over 18%, 100% real-time room inventory synchronization, and sub-60-second contactless guest check-in.',
    featured_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    videos: [],
    completion_date: '2026-09-18',
    testimonial_quote: 'The Central Reservation System and instant WhatsApp booking dispatch streamlined our entire hotel operation. We get direct bookings with zero OTA commissions and manage check-ins effortlessly.',
    testimonial_author: 'Deepak Chand Ramola, Managing Host — Hotel Pinathiya Paradise',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: ['Hotel Booking Engine', 'Central Reservation System (CRS)', 'Guest CRM & Document Vault', 'WhatsApp Booking Dispatch', 'Cloudflare Pages Edge'],
    technologies: ['JavaScript', 'Node.js REST API', 'Cloudflare Pages Edge', 'JSON Database', 'Tailwind CSS'],
    industry: 'Hospitality & Hotel Tech'
  },
  {
    id: 'proj-velametric-1',
    title: 'Real Estate & Property Dealer CRM Platform',
    slug: 'real-estate-property-dealer-crm',
    category: 'crm_saas',
    client: 'PropTech SaaS Solution',
    live_url: 'https://navajowhite-ant-953565.hostingersite.com/',
    project_type: 'web_app',
    description: 'An all-in-one real estate website and CRM system featuring interactive 3D property listings, automated agent lead assignment, and instant visit scheduling.',
    challenge: 'High drop-off rate on luxury property detail pages and fragmented lead tracking across property agents.',
    solution: 'Built a custom PropTech website with interactive WebGL floorplan previews and direct routing to the Velametric Real Estate CRM pipeline.',
    results: 'Generated 140+ qualified buyer inquiries in 30 days and reduced cost per lead acquisition by 62%.',
    featured_image: '/images/services/saas_property_crm.jpg',
    gallery: ['/images/services/saas_property_crm.jpg'],
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
    category: 'crm_saas',
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
    category: 'crm_saas',
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
  {
    id: 'proj-velametric-4',
    title: 'FinTech Subsidy & Debt Advisory Portal',
    slug: 'fintech-subsidy-debt-advisory',
    category: 'crm_saas',
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

  // 4. EVENTS
  {
    id: 'proj-event-cfd-marathon',
    title: 'Drug-Free & Corruption-Free Uttarakhand Campaign — 14-Kilometer Unity Marathon',
    slug: 'drug-free-corruption-free-uttarakhand-marathon',
    category: 'events',
    project_type: 'events',
    client: 'OK India Media Partner & Wellmetrics',
    live_url: '/portfolio/drug-free-corruption-free-uttarakhand-marathon',
    description: 'On December 25, 2018, OK India Media Partner and Wellmetrics successfully hosted a landmark community-driven event dedicated to fostering social change and youth empowerment in Uttarakhand. Anchored by the powerful vision of a Drug-Free and Corruption-Free Uttarakhand, the initiative brought together community members, athletes, artists, and leaders through a dynamic blend of sports, cultural showcases, and civic recognition.',
    challenge: 'A headline attraction of the event was a high-energy 14 km marathon designed to promote health, physical endurance, and active community participation. Mobilizing hundreds of runners of all ages across Dehradun against substance abuse required comprehensive race coordination, starting wave releases, checkpoint safety, and VIP protocol.',
    solution: 'Wellmetrics and OK India orchestrated a multi-dimensional civic platform: official printed chest bibs, starting grid logistics, line-array audio reinforcement, authentic Garhwali traditional folk dances celebrating regional pride, and a formal awards recognition ceremony featuring bespoke Golden Globe championship trophies.',
    results: 'Hundreds of runners united under the banner of a healthier, cleaner lifestyle; 40+ Golden Globe championship awards and certificates presented to top athletes and social champions; high-impact public pledges eradicating drug dependency and rooting out corruption.',
    featured_image: '/images/events/corruption_free_doon_marathon_start.jpg',
    gallery: [
      '/images/events/corruption_free_doon_marathon_start.jpg',
      '/images/events/corruption_free_doon_trophies.jpg',
      '/images/events/corruption_free_doon_folk_dance.jpg',
      '/images/events/corruption_free_doon_vip_arena.jpg',
      '/images/events/corruption_free_doon_organizers_troupe.jpg'
    ],
    videos: [],
    completion_date: '2018-12-25',
    testimonial_quote: 'By combining athletic endurance with cultural expression, OK India Media Partner and Wellmetrics created an unforgettable platform that continues to inspire community action and positive advocacy in the region.',
    testimonial_author: 'Organizing Committee, OK India & Wellmetrics Campaign',
    is_featured: true,
    status: 'PUBLISHED',
    services_used: [
      '14-Kilometer Unity Marathon Operations',
      'Traditional Cultural Showcase & Garhwali Folk Dance',
      'Awards & Recognition Ceremony (Golden Globe Trophies)',
      'Social Advocacy Campaign & Public Pledges',
      'Media Broadcast & Press Syndication'
    ],
    technologies: [
      'Digital Race Coordination',
      'High-Output Line-Array PA',
      'Precision Metal Trophy Casting',
      'Broadcast Media Production'
    ],
    industry: 'Sports, Culture & Civic Social Change'
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
  },
  {
    id: 'cs-drug-free-corruption-free-uttarakhand',
    title: 'Drug-Free & Corruption-Free Uttarakhand Campaign — 14-Kilometer Unity Marathon',
    slug: 'drug-free-corruption-free-uttarakhand-marathon',
    client: 'OK India Media Partner & Wellmetrics',
    challenge: 'Mobilizing hundreds of runners of all ages across Uttarakhand under the powerful vision of "Drug-Free Uttarakhand" and "Corruption-Free Uttarakhand", coordinating route marshaling, wave releases, and starting grid safety cordons for a high-energy 14-kilometer marathon.',
    solution: 'Wellmetrics and OK India Media Partner hosted a landmark community-driven event combining the 14 km Unity Marathon with authentic traditional Garhwali cultural showcases, live stadium audio reinforcement, and a prestigious awards recognition ceremony honoring athletes and social change-makers.',
    results: 'Hundreds of runners united under the banner of a healthier, cleaner lifestyle; 40+ Golden Globe championship trophies and certificates awarded; interactive anti-drug and anti-corruption pledges creating an enduring platform that continues to inspire positive community action.',
    featured_image: '/images/events/corruption_free_doon_marathon_start.jpg',
    testimonial_quote: 'By combining athletic endurance with cultural expression, OK India Media Partner and Wellmetrics created an unforgettable platform that continues to inspire community action and positive advocacy in the region.',
    testimonial_author: 'Organizing Committee, OK India & Wellmetrics',
    is_featured: true,
    status: 'PUBLISHED',
    metrics: [
      { id: 'm-dfu-1', case_study_id: 'cs-drug-free-corruption-free-uttarakhand', value: '14', prefix: '', suffix: ' KM', label: 'Unity Marathon Distance' },
      { id: 'm-dfu-2', case_study_id: 'cs-drug-free-corruption-free-uttarakhand', value: '2,500', prefix: '', suffix: '+', label: 'Athletes & Attendees' },
      { id: 'm-dfu-3', case_study_id: 'cs-drug-free-corruption-free-uttarakhand', value: '40', prefix: '', suffix: '+', label: 'Golden Globe Trophies' },
      { id: 'm-dfu-4', case_study_id: 'cs-drug-free-corruption-free-uttarakhand', value: '100', prefix: '', suffix: '%', label: 'Civic Pledges Signed' }
    ],
    charts: [
      {
        title: 'Starting Grid & Marathon Assembly',
        subtitle: '14-Kilometer Unity Marathon • Chest Bibs "OK India Presents — Corruption Free Doon"',
        image_url: '/images/events/corruption_free_doon_marathon_start.jpg',
        type: 'searches'
      },
      {
        title: 'Golden Globe Championship Trophies',
        subtitle: 'Engraved Date: December 25, 2018 • Honoring Top Athletes and Civic Champions',
        image_url: '/images/events/corruption_free_doon_trophies.jpg',
        type: 'interactions'
      },
      {
        title: 'Traditional Garhwali Cultural Showcase',
        subtitle: 'Authentic Folk Dancers & Traditional Pahadi Attire in Front of Event Banner',
        image_url: '/images/events/corruption_free_doon_folk_dance.jpg',
        type: 'profile'
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
              admin_url: p.admin_url || localMatch?.admin_url,
              project_type: localMatch?.project_type || p.category || 'web_app',
              category: localMatch?.category || p.category || 'crm_saas',
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
              youtube_url: localMatch?.youtube_url || (localMatch?.client === 'Ekraahee Films' ? 'https://www.youtube.com/@EkRaaheefilms' : undefined),
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
          return merged.filter(p => 
            p.id !== 'proj-event-destiny' && 
            p.id !== 'proj-event-conclave' && 
            p.slug !== 'destiny-productions-arena-events' && 
            p.slug !== 'global-leadership-conclave-event'
          );
        }
      } catch (e) {
        console.warn('Supabase portfolio_projects query failed, falling back to local:', e);
      }
    }
    return localProjects.filter(p => 
      p.id !== 'proj-event-destiny' && 
      p.id !== 'proj-event-conclave' && 
      p.slug !== 'destiny-productions-arena-events' && 
      p.slug !== 'global-leadership-conclave-event'
    );
  },

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    const projects = await this.getProjects();
    let p = projects.find(item => item.slug === slug);
    if (!p) {
      if (
        slug === 'drug-free-corruption-free-uttarakhand-marathon' ||
        slug === 'corruption-free-doon-half-marathon' ||
        slug === 'ok-india-half-marathon-corruption-free-doon'
      ) {
        p = projects.find(item => item.id === 'proj-event-cfd-marathon');
      }
    }
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
