-- ============================================================================
-- VELA ENTERPRISE BACKEND SCHEMA (PostgreSQL + Supabase RLS & Triggers)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. AUTH & USER ROLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT REFERENCES public.roles(name) DEFAULT 'SALES_EXECUTIVE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    UNIQUE(module, action)
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ----------------------------------------------------------------------------
-- 2. SITE & THEME SETTINGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT DEFAULT 'Vela Enterprise',
    logo_url TEXT,
    favicon_url TEXT,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_whatsapp TEXT,
    contact_address TEXT,
    google_maps_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    analytics_ids JSONB DEFAULT '{}'::jsonb,
    header_scripts TEXT,
    footer_scripts TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    default_title TEXT,
    default_description TEXT,
    default_og_image TEXT,
    robots_txt TEXT DEFAULT 'User-agent: *\nAllow: /',
    sitemap_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    colors JSONB DEFAULT '{
      "primary": "#4f6bf6",
      "secondary": "#0f172a",
      "accent": "#f59e0b",
      "background": "#090d16",
      "surface": "#141e33",
      "text": "#f8fafc",
      "muted": "#94a3b8",
      "border": "#1e293b"
    }'::jsonb,
    typography JSONB DEFAULT '{
      "headingFont": "Outfit",
      "bodyFont": "Plus Jakarta Sans",
      "fontSizeBase": "16px",
      "fontWeightHeading": "700"
    }'::jsonb,
    buttons JSONB DEFAULT '{
      "radius": "8px",
      "padding": "12px 24px",
      "style": "gradient",
      "hoverEffect": "glow"
    }'::jsonb,
    cards JSONB DEFAULT '{
      "radius": "16px",
      "shadow": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      "border": "1px solid rgba(255, 255, 255, 0.1)"
    }'::jsonb,
    layout JSONB DEFAULT '{
      "maxWidth": "1280px",
      "sectionSpacing": "96px",
      "containerWidth": "90%"
    }'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.navigation_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT UNIQUE NOT NULL, -- header, footer, mobile
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    mega_menu_data JSONB DEFAULT NULL
);

-- ----------------------------------------------------------------------------
-- 3. CMS & PAGE BUILDER ENGINE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    published_at TIMESTAMPTZ,
    seo_data JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- hero, hero_3d, rich_text, image, video, cta, services, portfolio, case_study, testimonials, stats, process, industries, contact, custom_html
    name TEXT NOT NULL,
    position INT DEFAULT 0,
    is_enabled BOOLEAN DEFAULT TRUE,
    visibility JSONB DEFAULT '{"desktop": true, "tablet": true, "mobile": true}'::jsonb,
    content JSONB DEFAULT '{}'::jsonb,
    style JSONB DEFAULT '{}'::jsonb,
    responsive JSONB DEFAULT '{}'::jsonb,
    animation JSONB DEFAULT '{}'::jsonb,
    background_settings JSONB DEFAULT '{}'::jsonb,
    is_global_template BOOLEAN DEFAULT FALSE,
    template_name TEXT,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content_snapshot JSONB NOT NULL, -- JSON snapshot of page + all sections
    created_by UUID REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ,
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. SERVICES CMS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    icon TEXT,
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    process_steps JSONB DEFAULT '[]'::jsonb,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PUBLISHED',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.service_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- ----------------------------------------------------------------------------
-- 5. PORTFOLIO & CASE STUDIES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client TEXT,
    description TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    featured_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    completion_date DATE,
    testimonial_quote TEXT,
    testimonial_author TEXT,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PUBLISHED',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_services (
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, service_id)
);

CREATE TABLE IF NOT EXISTS public.project_industries (
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, industry_id)
);

CREATE TABLE IF NOT EXISTS public.project_technologies (
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, technology_id)
);

CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client TEXT NOT NULL,
    industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
    challenge TEXT NOT NULL,
    objectives TEXT,
    strategy TEXT,
    solution TEXT NOT NULL,
    results TEXT NOT NULL,
    featured_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    testimonial_quote TEXT,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.case_study_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    prefix TEXT,
    suffix TEXT,
    label TEXT NOT NULL,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 6. MEDIA LIBRARY
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    dimensions TEXT,
    alt_text TEXT,
    caption TEXT,
    folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. LEAD GENERATION & CRM
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    service_interest TEXT,
    budget_range TEXT,
    message TEXT,
    status TEXT DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST
    source_id UUID REFERENCES public.lead_sources(id) ON DELETE SET NULL,
    campaign_name TEXT,
    utm_data JSONB DEFAULT '{}'::jsonb,
    form_submission_data JSONB DEFAULT '{}'::jsonb,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- form_submission, call, email, whatsapp, meeting, note, stage_change, assignment, proposal, invoice
    title TEXT NOT NULL,
    details TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. SALES PIPELINE & DEALS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- NEW, CONTACTED, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST
    label TEXT NOT NULL,
    sort_order INT NOT NULL,
    color TEXT DEFAULT '#4f6bf6'
);

CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.pipeline_stages(id) ON DELETE RESTRICT,
    value NUMERIC(12,2) DEFAULT 0.00,
    expected_close_date DATE,
    assigned_to UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'OPEN', -- OPEN, WON, LOST
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. FOLLOW-UP AUTOMATION ENGINE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.follow_up_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follow_up_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_id UUID REFERENCES public.follow_up_sequences(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    delay_days INT DEFAULT 1,
    action_type TEXT NOT NULL, -- email, phone_task, whatsapp_task, meeting_reminder
    subject TEXT,
    body_template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    step_id UUID REFERENCES public.follow_up_steps(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    assigned_to UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, SKIPPED, CANCELLED
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. CLIENTS, PROPOSALS, INVOICES & PAYMENTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    primary_contact_name TEXT,
    primary_contact_email TEXT NOT NULL,
    primary_contact_phone TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    total NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, SENT, VIEWED, ACCEPTED, REJECTED, EXPIRED
    valid_until DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price NUMERIC(12,2) DEFAULT 0.00,
    amount NUMERIC(12,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax NUMERIC(12,2) DEFAULT 0.00,
    discount NUMERIC(12,2) DEFAULT 0.00,
    total NUMERIC(12,2) DEFAULT 0.00,
    amount_paid NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, SENT, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price NUMERIC(12,2) DEFAULT 0.00,
    amount NUMERIC(12,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL, -- Bank Transfer, UPI, Credit Card, Cash, Cheque
    transaction_reference TEXT,
    payment_date DATE NOT NULL,
    status TEXT DEFAULT 'PAID', -- PENDING, PROCESSING, PAID, FAILED, REFUNDED
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. BLOG & CONTENT CMS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id),
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, PUBLISHED, ARCHIVED
    published_at TIMESTAMPTZ,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    company TEXT,
    designation TEXT,
    photo TEXT,
    company_logo TEXT,
    rating INT DEFAULT 5,
    testimonial TEXT NOT NULL,
    video_url TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE
);

-- ----------------------------------------------------------------------------
-- 12. AUDIT LOGS & NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_followup_tasks_due ON public.follow_up_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Public READ access for published content
CREATE POLICY "Public Read Pages" ON public.pages FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read Sections" ON public.page_sections FOR SELECT USING (is_enabled = TRUE);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read Portfolio" ON public.portfolio_projects FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public Read Case Studies" ON public.case_studies FOR SELECT USING (status = 'PUBLISHED');

-- Public INSERT for Leads
CREATE POLICY "Public Insert Leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Authenticated Admin full access
CREATE POLICY "Admin Full Pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Sections" ON public.page_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Portfolio" ON public.portfolio_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Deals" ON public.deals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Invoices" ON public.invoices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Payments" ON public.payments FOR ALL USING (auth.role() = 'authenticated');
