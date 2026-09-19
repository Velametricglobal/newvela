-- ============================================================================
-- VELA SEED DATA
-- ============================================================================

-- Roles
INSERT INTO public.roles (name, description) VALUES
('SUPER_ADMIN', 'Full system access'),
('ADMIN', 'Administrative access'),
('SALES_MANAGER', 'Sales team supervisor'),
('SALES_EXECUTIVE', 'Sales lead handler'),
('CONTENT_MANAGER', 'CMS and website manager'),
('FINANCE', 'Invoices and payments manager')
ON CONFLICT (name) DO NOTHING;

-- Pipeline Stages
INSERT INTO public.pipeline_stages (name, label, sort_order, color) VALUES
('NEW', 'New Inquiries', 1, '#3b82f6'),
('CONTACTED', 'Contacted', 2, '#8b5cf6'),
('QUALIFIED', 'Qualified', 3, '#06b6d4'),
('MEETING', 'Meeting Scheduled', 4, '#f59e0b'),
('PROPOSAL', 'Proposal Sent', 5, '#ec4899'),
('NEGOTIATION', 'In Negotiation', 6, '#eab308'),
('WON', 'Closed Won', 7, '#10b981'),
('LOST', 'Closed Lost', 8, '#ef4444')
ON CONFLICT (name) DO NOTHING;

-- Service Categories
INSERT INTO public.service_categories (name, slug, description, icon, sort_order) VALUES
('Website & App Development', 'website-app-development', 'Custom modern web applications, SaaS products, and native mobile apps.', 'Code', 1),
('Marketing', 'marketing', 'Data-driven digital and omnichannel marketing strategies.', 'TrendingUp', 2),
('Branding & Graphics', 'branding-graphics', 'Complete brand identity, UI/UX, and graphic visual systems.', 'Palette', 3),
('Video Production', 'video-production', 'High-end commercial videography, 3D animation, and corporate films.', 'Video', 4),
('Media & PR', 'media-pr', 'Strategic press releases, media relations, and brand reputation management.', 'Globe', 5),
('Financial Consultancy', 'financial-consultancy', 'Capital raising, corporate loans, and government subsidy advisory.', 'DollarSign', 6)
ON CONFLICT (name) DO NOTHING;

-- Services
INSERT INTO public.services (name, slug, short_description, full_description, icon, is_featured, status, sort_order) VALUES
('Custom Web Application Development', 'web-app-development', 'High-performance React/Next.js and enterprise web platforms engineered for scale.', 'We build bespoke, lightning-fast web applications with modern architectures, resilient APIs, and seamless database design.', 'Laptop', true, 'PUBLISHED', 1),
('Digital Marketing & Growth', 'digital-marketing', 'ROI-focused SEO, PPC campaign management, and conversion rate optimization.', 'Accelerate your revenue pipeline with target campaign architecture, audience segmentation, and organic search dominant positioning.', 'Zap', true, 'PUBLISHED', 2),
('Offline Marketing & Brand Activation', 'offline-marketing', 'Impactful physical branding, event activations, and print media distribution.', 'Connect with audiences in the real world through premium visual installations, billboards, collateral design, and high-touch events.', 'Megaphone', false, 'PUBLISHED', 3),
('Government Subsidy Loans', 'government-subsidy-loans', 'End-to-end guidance for securing government subsidies, schemes, and low-interest capital.', 'Navigate complex government financial programs with ease. We handle application preparation, compliance audit, and loan disbursement.', 'ShieldCheck', true, 'PUBLISHED', 4),
('Business Loans & Cash Credit', 'business-loans-cash-credit', 'Tailored working capital financing and revolving credit facilities for expanding enterprises.', 'Secure competitive business credit lines to support supply chain, expansion, payroll, and strategic acquisitions.', 'Briefcase', true, 'PUBLISHED', 5),
('Personal & Home Loans', 'personal-home-loans', 'Hassle-free loan processing with preferred interest rates from top banking partners.', 'Seamless mortgage and personal credit advisory designed around your liquidity requirements.', 'Home', false, 'PUBLISHED', 6)
ON CONFLICT (slug) DO NOTHING;

-- Lead Sources
INSERT INTO public.lead_sources (name) VALUES
('Website Inquiry Form'),
('Direct Quote Request'),
('Google Search (Organic)'),
('LinkedIn Ad Campaign'),
('Referral'),
('WhatsApp Business')
ON CONFLICT (name) DO NOTHING;

-- Industries
INSERT INTO public.industries (name, slug, icon, description) VALUES
('Education & EdTech', 'education', 'Graduation', 'Digital learning platforms, university portals, and LMS integration.'),
('Real Estate & Architecture', 'real-estate', 'Building', 'PropTech, virtual 3D tours, and luxury listing platforms.'),
('Healthcare & Pharma', 'healthcare', 'Activity', 'HIPAA-compliant telemedicine, patient portals, and lab analytics.'),
('Manufacturing & Logistics', 'manufacturing', 'Truck', 'Smart factory dashboards, inventory tracking, and supply chain ERP.'),
('Retail & E-Commerce', 'retail', 'ShoppingBag', 'High-conversion storefronts, headless commerce, and payment integration.'),
('Hospitality & Tourism', 'hospitality', 'Coffee', 'Booking engines, resort apps, and guest experience systems.'),
('Finance & FinTech', 'finance', 'Landmark', 'Secure banking portals, loan origination systems, and wealth advisory.')
ON CONFLICT (slug) DO NOTHING;

-- Portfolio Projects
INSERT INTO public.portfolio_projects (title, slug, client, description, challenge, solution, results, is_featured, status, sort_order) VALUES
('Apex FinTech Platform Redesign', 'apex-fintech-platform', 'Apex Global Wealth', 'Comprehensive digital transformation of Apex Banking portal serving 250,000 active investors.', 'Legacy tech stack caused high bounce rates and 4.2-second page load latencies.', 'Re-architected client dashboard using React, Tailwind CSS, and resilient API gateways.', 'Achieved 820ms page load speed, 45% increase in user retention, and $12M incremental deposits in Q1.', true, 'PUBLISHED', 1),
('Aura Luxury Real Estate Portal', 'aura-luxury-real-estate', 'Aura Living', '3D interactive web showcase with dynamic floorplan customizer and instant visit scheduling.', 'High drop-off rate on property detail pages due to static low-resolution image galleries.', 'Built WebGL 3D property walkthrough builder and instant WhatsApp inquiry integration.', 'Generated 140+ qualified leads in first 30 days and reduced cost per lead by 62%.', true, 'PUBLISHED', 2)
ON CONFLICT (slug) DO NOTHING;

-- Case Studies & Metrics
INSERT INTO public.case_studies (title, slug, client, challenge, solution, results, is_featured, status) VALUES
('Scaling EdTech Revenue by 310%', 'scaling-edtech-revenue', 'EduNexus Online', 'EduNexus struggled with low course checkout conversions and fragmented student data.', 'Implemented headless CMS content delivery, automated lead follow-up sequences, and streamlined checkout.', 'Course enrollments tripled within 6 months while lowering acquisition cost by 40%.', true, 'PUBLISHED')
ON CONFLICT (slug) DO NOTHING;
