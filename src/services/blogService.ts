export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  content: string;
  readTime: string;
  publishedDate: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featuredImage: string;
  tags: string[];
  stats?: { label: string; value: string }[];
  views: number;
  created_at: string;
  updated_at: string;
}

const BLOG_STORAGE_KEY = 'VELAMETRIC_BLOG_POSTS_STORE';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-dhcs',
    slug: 'dhcs-growth-story-dehradun',
    title: 'From a Local Service to a Trusted Healthcare Brand: The DHCS Growth Story in Dehradun',
    subtitle: 'How Amit Rana transformed Doon Home Care Services from 2–3 monthly references into Uttarakhand’s premier 200+ patient inquiry medical lifeline.',
    excerpt: 'In the healthcare industry, a business is only as strong as the trust it commands. Discover the digital hospital blueprint that scaled DHCS to 200+ monthly high-intent inquiries.',
    category: 'Healthcare Growth & Brand Engineering',
    content: `In the healthcare industry, a business is only as strong as the trust it commands. While e-commerce brands can survive on impulse purchases and flash discounts, a family seeking elderly ICU nursing or ventilator patient support makes decisions rooted in urgency, emotional vulnerability, and uncompromising expectations of safety.

When Amit Rana, founder of Doon Home Care Services (DHCS), approached Velametric, his company possessed exemplary medical integrity: registered nurses, certified critical-care attendants, modern oxygen concentrators, and cardiac monitors ready for deployment across Dehradun, Rishikesh, and Haridwar. 

Yet, like countless specialized healthcare providers, their digital footprint was fragmented. Relying primarily on hospital word-of-mouth and manual WhatsApp exchanges, DHCS was securing 2–3 patient admissions per month—a tiny fraction of Uttarakhand's rapidly expanding demand for home-based clinical care.

### The 4 Core Growth Bottlenecks Identified

1. **Information Friction During Medical Emergencies**: Families navigating hospital discharge don't want generic contact forms. They need immediate transparent packages, certified nurse profiles, and one-tap WhatsApp doctor-consultation links.
2. **Missing Local Search Authority (Local SEO)**: Search queries like *"ICU setup at home in Dehradun"* or *"Male attendant for paralysis patient Rajpur Road"* were directing high-intent callers to third-party aggregators rather than DHCS directly.
3. **No Direct Verified Patient Testimonial Hub**: Prospective families had no central repository to review video reviews from local doctors and verified resident families.
4. **Manual Invoicing & Agreement Overhead**: Patient service contracts and advance equipment deposits were recorded on physical registers, slowing down same-day ICU installations.

### The Velametric Growth & Tech Blueprint

Velametric engineered an end-to-end digital transformation for DHCS:
- **Zero-Friction Emergency Landing Portal**: Built an ultra-fast, mobile-first web app with click-to-call emergency dispatch, live equipment inventory tracker, and automated service booking wizard.
- **Micro-Targeted Hyperlocal SEO**: Structured metadata and schema markup for 45+ medical specialties across Dehradun, Mussoorie, and Haridwar, driving DHCS to Position #1 on Google Maps and Local Pack.
- **WhatsApp Direct Care Integration**: Integrated WhatsApp Business API webhooks, ensuring patient families received certified attendant credentials and pricing breakdowns within 90 seconds.
- **Automated Digital Documentation Studio**: Integrated instant medical agreement creation, digital indemnity signatures, and invoice generation, cutting patient onboarding from 4 hours to 8 minutes.

### Verified 90-Day Results
- **Monthly Inquiries**: Scaled from 2–3 inquiries/month to **200+ verified high-intent family requests**.
- **Direct Emergency Calls**: Over **596 direct hospital-to-home emergency calls** logged in Q3.
- **Google Reviews**: Grew to **4.7★ across 106 verified Uttarakhand patient families**.
- **Revenue Growth**: Scaled monthly home care operational run-rate by **740%**.`,
    readTime: '6 min read',
    publishedDate: 'September 2026',
    status: 'PUBLISHED',
    author: {
      name: 'Velametric Editorial Desk',
      role: 'Healthcare Growth & Digital Transformation'
    },
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Healthcare', 'Local SEO', 'Case Study', 'Dehradun'],
    views: 1420,
    created_at: '2026-09-01T10:00:00.000Z',
    updated_at: '2026-09-18T14:30:00.000Z'
  },
  {
    id: 'blog-2',
    slug: 'headless-cms-architecture-guide',
    title: 'The 2026 Enterprise Guide to Headless CMS & Supabase Architecture',
    subtitle: 'Decoupling frontend presentation from database layers to achieve sub-second load times.',
    excerpt: 'Learn how modern brands decouple content management from public presentation layers to achieve sub-second load times and rock-solid Row Level Security.',
    category: 'Engineering & Architecture',
    content: `Modern web architecture has permanently transitioned away from legacy monolithic CMS systems. By decoupling presentation from backend storage, modern businesses achieve:
- **Instant Page Rendering**: Pre-rendered static pages combined with edge caching ensure sub-100ms Largest Contentful Paint (LCP).
- **Hardened Security Boundaries**: Row Level Security (RLS) ensures sensitive client leads and financial proposals are completely isolated from public assets.
- **Omnichannel Content Distribution**: A single content repository powers web, native mobile apps, and customer portals simultaneously without duplicative data entry.`,
    readTime: '8 min read',
    publishedDate: 'August 2026',
    status: 'PUBLISHED',
    author: {
      name: 'Priya Patel',
      role: 'Lead Systems Architect'
    },
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Headless CMS', 'Next.js', 'Vite'],
    views: 980,
    created_at: '2026-08-15T12:00:00.000Z',
    updated_at: '2026-08-20T09:15:00.000Z'
  },
  {
    id: 'blog-3',
    slug: 'ai-lead-generation-whatsapp-automation',
    title: 'Automating Real-Time Lead Engagement via WhatsApp Business API',
    subtitle: 'Why the first 5 minutes dictate 80% of client conversion rates in service industries.',
    excerpt: 'Service businesses lose 70% of potential high-ticket deals by responding hours later. Here is how automated WhatsApp CRM sequences convert traffic instantly.',
    category: 'Marketing & Outreach',
    content: `Speed to lead is the single most critical variable determining client conversion in service and event enterprises. When an inquiry is submitted online:
- Responding within 5 minutes results in a **21x increase in qualification likelihood**.
- WhatsApp open rates consistently exceed **96%**, compared to 18-22% for standard email campaigns.
- Integrating automated template triggers allows instant quotation dispatch and consultation scheduling directly on the user's mobile screen.`,
    readTime: '5 min read',
    publishedDate: 'September 2026',
    status: 'PUBLISHED',
    author: {
      name: 'Amit Verma',
      role: 'Growth Marketing Director'
    },
    featuredImage: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    tags: ['WhatsApp CRM', 'Lead Generation', 'Automation', 'Sales Velocity'],
    views: 1250,
    created_at: '2026-09-10T14:00:00.000Z',
    updated_at: '2026-09-15T11:20:00.000Z'
  }
];

export const blogService = {
  getArticles(): BlogPost[] {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
      return INITIAL_BLOG_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  },

  getArticleBySlug(slug: string): BlogPost | undefined {
    return this.getArticles().find(a => a.slug === slug);
  },

  getArticleById(id: string): BlogPost | undefined {
    return this.getArticles().find(a => a.id === id);
  },

  createArticle(article: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>): BlogPost {
    const articles = this.getArticles();
    const newArticle: BlogPost = {
      ...article,
      id: `blog-${Date.now()}`,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    articles.unshift(newArticle);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent('vela-blog-updated', { detail: newArticle }));
    return newArticle;
  },

  updateArticle(id: string, updates: Partial<BlogPost>): BlogPost {
    const articles = this.getArticles();
    const idx = articles.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Article not found');
    articles[idx] = {
      ...articles[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent('vela-blog-updated', { detail: articles[idx] }));
    return articles[idx];
  },

  deleteArticle(id: string): boolean {
    const articles = this.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('vela-blog-updated', { detail: { id, deleted: true } }));
    return true;
  }
};
