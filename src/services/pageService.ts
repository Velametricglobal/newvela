import { Page, PageSection, PageVersion, SectionType } from '../types/database.types';

const DRAFT_STORAGE_KEY = 'VELAMETRIC_BUILDER_DRAFT_HOME';
const PUBLISHED_STORAGE_KEY = 'VELAMETRIC_BUILDER_PUBLISHED_HOME';
const VERSIONS_STORAGE_KEY = 'VELAMETRIC_BUILDER_VERSIONS_HOME';

export const defaultHomeSections: PageSection[] = [
  // 1. HERO — FULL-SCREEN CINEMATIC EVENT VIDEO
  {
    id: 'sec-hero-1',
    page_id: 'page-home',
    section_type: 'hero_3d',
    name: '1. Cinematic Event Video Hero',
    position: 1,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'We Create. We Market. We Grow.',
      subheading: 'From digital experiences and marketing to media, video, finance and unforgettable events — we turn ideas into measurable impact.',
      video_source: 'youtube', // 'youtube' | 'upload' | 'image'
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      upload_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-lights-42998-large.mp4',
      poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
      autoplay: true,
      muted: true,
      loop: true,
      primaryCtaText: 'Start a Project',
      primaryCtaUrl: '/request-quote',
      secondaryCtaText: 'Explore Our Work',
      secondaryCtaUrl: '/portfolio',
      eventCtaText: 'Upcoming Events',
      eventCtaUrl: '#events',
      scrollIndicatorText: 'SCROLL TO EXPLORE'
    },
    style: { paddingTop: '0px', paddingBottom: '0px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 1, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.8 },
    background_settings: { type: 'video' }
  },

  // 2. QUICK INTRO / ABOUT US
  {
    id: 'sec-about-2',
    page_id: 'page-home',
    section_type: 'rich_text',
    name: '2. Quick Intro & About Us',
    position: 2,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'We Build Brands That Move Forward.',
      subheading: 'Velametric Global brings together Technology, Marketing, Creative Design, Media, Video Production, Financial Consultancy, and Mega Event Management under one seamless agency ecosystem.',
      primaryCtaText: 'Know More About Us',
      primaryCtaUrl: '/about',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Projects Completed', value: '350+' },
        { label: 'Clients Served', value: '180+' },
        { label: 'Campaigns Run', value: '500+' },
        { label: 'Events Organized', value: '45+' },
        { label: 'Years Experience', value: '10+' }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 2, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 3. SERVICES (WHAT WE DO - 6 CATEGORIES)
  {
    id: 'sec-services-3',
    page_id: 'page-home',
    section_type: 'services',
    name: '3. What We Do (Services)',
    position: 3,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'What We Do',
      subheading: 'End-to-end solutions for brands, businesses and organizations ready to grow.',
      categories: [
        {
          num: '01',
          name: 'Digital Strategy & Consulting',
          desc: 'Business audits, strategic brand roadmaps, market positioning, and full digital operations management.',
          slug: 'digital-strategy',
          items: ['Business Audit', 'Strategy Creation / Planning for Brand', 'Fully Digital Management Service'],
          count: 3
        },
        {
          num: '02',
          name: 'Creating Brand & Architecture',
          desc: 'Comprehensive brand architecture, iconic visual identity, bespoke logo design, and human-centric UI/UX design systems.',
          slug: 'brand-architecture',
          items: ['Branding', 'Logo Design', 'UI and UX Design'],
          count: 3
        },
        {
          num: '03',
          name: 'Software & Web Engineering',
          desc: 'Modern responsive web engineering, fully custom web applications + CRM/ERP, and high-converting Shopify store setups.',
          slug: 'software-engineering',
          items: ['Website Development', 'Fully Customize Web App + CRM', 'Shopify Store Setup'],
          count: 3
        },
        {
          num: '04',
          name: 'News Portal, Channel & RNI',
          desc: 'Full-featured digital journalism portals, broadcast studio architecture, and official RNI press compliance.',
          slug: 'news-portal-channel-rni',
          items: ['Digital News Portals', 'Broadcast Studio Setup', 'Official RNI Registration'],
          count: 3
        },
        {
          num: '05',
          name: 'Media & PR',
          desc: 'National wire press releases across 500+ news outlets, media relations, editorial features, and digital reputation.',
          slug: 'media-pr',
          items: ['National Wire Press Releases', 'Media Relations & Editorial', 'Digital PR & Reputation'],
          count: 3
        },
        {
          num: '06',
          name: 'Financial Consultancy',
          desc: 'Government subsidy loans (up to 25% refund), business credit, bank DPR project reports, and mortgage solutions.',
          slug: 'financial-consultancy',
          items: ['Govt Subsidy Loans (25% Refund)', 'Business & CC Loans', 'Project Finance (DPR)'],
          count: 3
        }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 3, tabletCols: 2, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 4. FEATURED PORTFOLIO / OUR WORK
  {
    id: 'sec-portfolio-4',
    page_id: 'page-home',
    section_type: 'portfolio',
    name: '4. Featured Work & Portfolio',
    position: 4,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'Work That Speaks For Us.',
      subheading: 'Explore our ready-to-deploy enterprise SaaS products, specialized industry CRMs, and custom software solutions.',
      tagline: 'Featured SaaS & Software Solutions',
      header_cta_text: 'Explore All Software Solutions',
      header_cta_url: '/services?cat=cat-saas',
      header_cta_open_new_tab: false,
      card1_title: 'Real Estate & Property Dealer CRM Platform',
      card1_client: 'PropTech SaaS Solution',
      card1_image: '/images/services/saas_property_crm.jpg',
      card1_button_text: 'VISIT LIVE DEMO',
      card1_url: 'https://navajowhite-ant-953565.hostingersite.com/',
      card1_open_new_tab: true,
      card2_title: 'Education Institute ERP & LMS Platform',
      card2_client: 'EdTech Cloud ERP',
      card2_image: '/images/services/saas_education_institute.jpg',
      card2_button_text: 'VISIT LIVE DEMO',
      card2_url: 'https://sienna-chimpanzee-129344.hostingersite.com/',
      card2_open_new_tab: true,
      card3_title: 'Modern D2C E-Commerce & Retail CRM',
      card3_client: 'Retail Commerce SaaS',
      card3_image: '/images/services/saas_ecommerce_website.jpg',
      card3_button_text: 'VISIT LIVE DEMO',
      card3_url: 'https://mediumvioletred-viper-351367.hostingersite.com/',
      card3_open_new_tab: true
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 3, tabletCols: 2, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 5. EVENTS SECTION
  {
    id: 'sec-events-5',
    page_id: 'page-home',
    section_type: 'custom_html',
    name: '5. Experience What We Create (Events)',
    position: 5,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'Experience What We Create.',
      subheading: 'Join Uttarakhand’s premier cultural mega-events, fashion pageants, rap battles, and music festivals.',
      featured_event: {
        title: 'Uttarakhand Mega Youth Fashion & Music Summit 2026',
        tagline: 'Where Culture Meets the Future',
        category: 'Fashion, Music & Youth Festival',
        date: '2026-10-15T18:00:00',
        venue: 'Arena Ground, Dehradun, Uttarakhand',
        organizers: 'Hemchandra Purohit (Velametric) & Destiny Productions',
        media_partners: 'Weekly Eye News & 52 Garh Samachar',
        expected_footfall: '5,000+ Youth & Trendsetters',
        digital_reach: '7M+ Monthly Social Reach (52 Garh) & 10,000 Weekly Print (Weekly Eye)',
        description: 'Where Culture Meets the Future. Featuring headline musical acts, state fashion pageants, underground rap battles, and interactive brand experience zones organized by Hemchandra Purohit (Velametric) & Destiny Productions.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        register_url: '/event-registration',
        sponsor_url: '/sponsor-registration'
      },
      upcoming_events: [
        { name: 'State Fashion Pageant & Modeling Championship', date: 'Oct 15, 2026', category: 'Fashion & Pageant', location: 'Arena Ground, Dehradun' },
        { name: 'Underground Rap Battle & Hip-Hop Cyphers', date: 'Oct 15, 2026', category: 'Rap & Music', location: 'Arena Ground, Dehradun' },
        { name: 'National Dance & Music Championship', date: 'Nov 20, 2026', category: 'Dance & Music', location: 'Dehradun' },
        { name: 'Corporate Leadership & FinTech Expo 2026', date: 'Dec 18, 2026', category: 'Corporate & Finance', location: 'Dehradun' }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 1, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 6. WHY CHOOSE US
  {
    id: 'sec-why-6',
    page_id: 'page-home',
    section_type: 'process',
    name: '6. Why Choose Us (Credibility Pillars)',
    position: 6,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'More Than a Service Provider.',
      subheading: 'Why leading brands and enterprises partner with Velametric Global.',
      pillars: [
        {
          num: '01',
          title: 'One Creative Ecosystem',
          desc: 'Technology, marketing, media, video production, financial advisory, and events all managed seamlessly under one roof.'
        },
        {
          num: '02',
          title: 'Strategy First',
          desc: 'We focus on clear business objectives and ROI metrics rather than simply delivering static assets.'
        },
        {
          num: '03',
          title: 'Creative + Technology',
          desc: 'Combining high-impact creative storytelling with modern high-performance software engineering.'
        },
        {
          num: '04',
          title: 'End-to-End Execution',
          desc: 'From initial strategy and DPR documentation to production, live launch, and automated CRM lead processing.'
        }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 2, tabletCols: 2, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 7. TESTIMONIAL VIDEOS
  {
    id: 'sec-video-testimonials-7',
    page_id: 'page-home',
    section_type: 'video_reels',
    name: '7. Video Testimonials',
    position: 7,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: "Don't Take Our Word For It.",
      subheading: 'Hear directly from the business leaders, founders, and partners we work with.',
      video_testimonials: [
        {
          id: 'vt-1',
          client_name: 'Vikramaditya Singh',
          designation: 'Managing Director',
          company: 'Apex Wealth Management',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
          quote: 'Velametric transformed our entire digital acquisition funnel and secured our ₹15 Cr government subsidy loan.'
        },
        {
          id: 'vt-2',
          client_name: 'Ananya Sharma',
          designation: 'Founder & CEO',
          company: 'Aura Living Real Estate',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
          quote: 'The real estate CRM and Destiny video commercial boosted our luxury villa sales by 310% in one quarter.'
        },
        {
          id: 'vt-3',
          client_name: 'Dr. Rajesh Verma',
          designation: 'Director of Admissions',
          company: 'EduNexus Distance Academy',
          youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
          quote: 'Enrolling 15,000+ distance education students became effortless with Velametric automated follow-up CRM.'
        }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 3, tabletCols: 2, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 8. TEXT TESTIMONIALS
  {
    id: 'sec-text-testimonials-8',
    page_id: 'page-home',
    section_type: 'testimonials',
    name: '8. Text Testimonials Carousel',
    position: 8,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'Trusted By People Who Believe In Growth.',
      subheading: 'What clients say about our technology, marketing, and financial consultancy.',
      testimonials: [
        {
          quote: 'Velametric delivered our e-commerce portal and integrated CRM ahead of schedule. Lead acquisition cost dropped by 62%.',
          client_name: 'Priya Joshi',
          company: 'Velametric Retail Global',
          rating: 5
        },
        {
          quote: 'From video reels produced by Dapflix to subsidy loan clearance, their multi-disciplinary team is unmatched.',
          client_name: 'Karan Malhotra',
          company: 'Himalayan Organics',
          rating: 5
        },
        {
          quote: 'The event management and PR campaign for our national summit exceeded all attendance expectations.',
          client_name: 'Meera Rawat',
          company: 'Uttarakhand Youth Forum',
          rating: 5
        }
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 3, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 9. ENQUIRY / REQUEST A QUOTE (HIGH-CONVERSION FORM)
  {
    id: 'sec-enquiry-9',
    page_id: 'page-home',
    section_type: 'contact',
    name: '9. Enquiry Form & CRM Lead Generator',
    position: 9,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: "Let's Build Something Great.",
      subheading: "Tell us what you're looking to build, promote, create or organize. Our team will get back to you.",
      services_list: [
        'Website & App Development',
        'Digital Marketing',
        'Offline Marketing',
        'Branding & Graphics',
        'Video Production',
        'Media & PR',
        'Financial Consultancy',
        'Event Organization',
        'Sponsorship',
        'Other'
      ],
      budget_options: [
        'Under ₹25,000',
        '₹25,000–₹50,000',
        '₹50,000–₹1 Lakh',
        '₹1–5 Lakh',
        '₹5 Lakh+',
        'Not Decided'
      ]
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 1, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 10. CONTACT US
  {
    id: 'sec-contact-10',
    page_id: 'page-home',
    section_type: 'newsletter',
    name: "10. Contact Us ('Let's Talk')",
    position: 10,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: "Let's Talk.",
      phone: '+91-8679766348',
      whatsapp: '+91-8679766348',
      email: 'hello@velametric.com',
      office_dehradun: 'Headquarters: Dehradun, Uttarakhand',
      office_uttarkashi: 'Regional Office: Joshiyara, Uttarkashi',
      working_hours: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
      map_url: 'https://maps.google.com'
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 2, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  },

  // 11. FINAL CTA
  {
    id: 'sec-cta-11',
    page_id: 'page-home',
    section_type: 'cta',
    name: '11. Final Call To Action Banner',
    position: 11,
    is_enabled: true,
    visibility: { desktop: true, tablet: true, mobile: true },
    content: {
      heading: 'Ready To Make Your Next Move?',
      subheading: "Let's turn your next idea into something people remember.",
      primaryCtaText: 'Start a Conversation',
      primaryCtaUrl: '/request-quote',
      secondaryCtaText: 'View Our Work',
      secondaryCtaUrl: '/portfolio'
    },
    style: { paddingTop: '96px', paddingBottom: '96px', backgroundColor: '#09090b' },
    responsive: { desktopCols: 1, tabletCols: 1, mobileCols: 1 },
    animation: { type: 'fade-up', duration: 0.6 },
    background_settings: { type: 'color' }
  }
];

// Helper functions for LocalStorage persistence
function getStoredPublishedSections(): PageSection[] {
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed reading published builder sections from storage:', e);
  }
  return defaultHomeSections;
}

function getStoredDraftSections(): PageSection[] {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed reading draft builder sections from storage:', e);
  }
  return getStoredPublishedSections();
}

function getStoredVersions(): PageVersion[] {
  try {
    const raw = localStorage.getItem(VERSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed reading builder versions from storage:', e);
  }
  return [];
}

export const pageService = {
  // PUBLIC FRONTEND METHOD: Retrieves the published sections rendered on the website
  async getPublishedPageBySlug(slug: string): Promise<Page | null> {
    const sections = getStoredPublishedSections();
    return {
      id: 'page-home',
      title: 'Velametric Global — We Create. We Market. We Grow.',
      slug: slug || 'home',
      status: 'PUBLISHED',
      sections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // ADMIN BUILDER METHOD: Retrieves working draft sections (or published fallback)
  async getPageBySlug(slug: string): Promise<Page | null> {
    const sections = getStoredDraftSections();
    return {
      id: 'page-home',
      title: 'Velametric Global — We Create. We Market. We Grow.',
      slug: slug || 'home',
      status: 'DRAFT',
      sections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Save working draft sections to persistent storage
  async savePageSections(pageId: string, sections: PageSection[]): Promise<Page> {
    const serialized = JSON.stringify(sections);
    localStorage.setItem(DRAFT_STORAGE_KEY, serialized);

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_page_draft_saved', { detail: { sections } }));
    }

    return {
      id: pageId,
      title: 'Velametric Global — We Create. We Market. We Grow.',
      slug: 'home',
      status: 'DRAFT',
      sections: JSON.parse(serialized),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Publish working draft live to website
  async publishPage(pageId: string, customSections?: PageSection[]): Promise<{ page: Page; version: PageVersion }> {
    const sectionsToPublish = customSections || getStoredDraftSections();
    const serialized = JSON.stringify(sectionsToPublish);

    // Save to published key AND sync draft key
    localStorage.setItem(PUBLISHED_STORAGE_KEY, serialized);
    localStorage.setItem(DRAFT_STORAGE_KEY, serialized);

    // Version management
    const versions = getStoredVersions();
    const versionNum = versions.filter(v => v.page_id === pageId).length + 1;
    const newVersion: PageVersion = {
      id: `ver-${Date.now()}`,
      page_id: pageId,
      version_number: versionNum,
      content_snapshot: {
        page: {
          id: pageId,
          title: 'Velametric Global',
          slug: 'home',
          status: 'PUBLISHED',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        sections: JSON.parse(serialized)
      },
      status: 'PUBLISHED',
      created_at: new Date().toISOString()
    };

    versions.unshift(newVersion);
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versions));

    // Dispatch global events for instant live re-rendering on public frontend
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_page_published', { detail: { sections: sectionsToPublish } }));
      window.dispatchEvent(new Event('storage'));
    }

    return {
      page: {
        id: pageId,
        title: 'Velametric Global',
        slug: 'home',
        status: 'PUBLISHED',
        published_at: new Date().toISOString(),
        sections: JSON.parse(serialized),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      version: newVersion
    };
  },

  async getPageVersions(pageId: string): Promise<PageVersion[]> {
    return getStoredVersions().filter(v => v.page_id === pageId);
  },

  async restoreVersion(versionId: string): Promise<Page> {
    const versions = getStoredVersions();
    const version = versions.find(v => v.id === versionId);
    if (!version) throw new Error('Version not found');

    const restoredSections = version.content_snapshot.sections;
    const serialized = JSON.stringify(restoredSections);

    localStorage.setItem(PUBLISHED_STORAGE_KEY, serialized);
    localStorage.setItem(DRAFT_STORAGE_KEY, serialized);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_page_published', { detail: { sections: restoredSections } }));
    }

    return {
      id: version.page_id,
      title: 'Velametric Global',
      slug: 'home',
      status: 'PUBLISHED',
      sections: restoredSections,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};
