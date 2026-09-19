// ============================================================================
// TYPE DEFINITIONS FOR VELAMETRIC ENTERPRISE PLATFORM
// ============================================================================

export type SystemRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'MARKETING_MANAGER'
  | 'CONTENT_MANAGER'
  | 'EVENT_MANAGER'
  | 'FINANCE_MANAGER'
  | 'ACCOUNTANT'
  | 'HR_MANAGER'
  | 'SUPPORT'
  | 'VIEWER'
  | string;

export type AgentRole = 'SUPER_ADMIN' | 'ADMIN' | 'SALES_AGENT' | 'SALES_MANAGER' | 'MARKETING_MANAGER' | 'EVENT_AGENT' | 'FINANCE_MANAGER' | 'SUPPORT_AGENT' | 'VIEWER';

export interface AgentUser {
  id: string;
  user_code: string;
  email: string;
  full_name: string;
  role: AgentRole | SystemRole;
  avatar_url?: string;
  department: string;
  permissions: string[];
  must_change_password?: boolean;
  is_initial_account?: boolean;
}

export interface InitialSetupAccount {
  role_title: string;
  user_code: string;
  email: string;
  role: SystemRole;
  department: string;
  temp_password?: string;
  created_at: string;
}

export type UserAccountStatus = 'ACTIVE' | 'PENDING_INVITATION' | 'SUSPENDED' | 'DEACTIVATED' | 'LOCKED';

export interface GranularPermission {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'send' | 'manage';
  label: string;
}

export interface CustomRoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_default: boolean;
  created_at: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  description: string;
  manager_user_id?: string;
  manager_name?: string;
  members_count: number;
  created_at: string;
}

export interface UserSessionRecord {
  id: string;
  user_id: string;
  user_name: string;
  ip_address: string;
  browser: string;
  device: string;
  last_active: string;
  is_current: boolean;
}

export interface EnterpriseUser {
  id: string;
  user_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: SystemRole;
  role_title?: string;
  department_id?: string;
  department_name?: string;
  manager_id?: string;
  manager_name?: string;
  status: UserAccountStatus;
  mfa_enabled: boolean;
  mfa_enforced: boolean;
  require_password_change: boolean;
  must_change_password?: boolean;
  last_login_at?: string;
  created_at: string;
  assigned_records?: {
    leads_count: number;
    deals_count: number;
    followups_count: number;
    tasks_count: number;
  };
}

export interface SecurityAuditRecord {
  id: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: SystemRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType =
  | 'hero'
  | 'hero_3d'
  | 'rich_text'
  | 'image'
  | 'video'
  | 'cta'
  | 'services'
  | 'portfolio'
  | 'case_study'
  | 'testimonials'
  | 'stats'
  | 'process'
  | 'industries'
  | 'contact'
  | 'newsletter'
  | 'custom_html'
  | 'video_reels';

export interface SectionVisibility {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  name: string;
  position: number;
  is_enabled: boolean;
  visibility: SectionVisibility;
  content: Record<string, any>;
  style: Record<string, any>;
  responsive: Record<string, any>;
  animation: Record<string, any>;
  background_settings: Record<string, any>;
  is_global_template?: boolean;
  template_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at?: string;
  seo_data?: Record<string, any>;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  sections?: PageSection[];
}

export interface PageVersion {
  id: string;
  page_id: string;
  version_number: number;
  content_snapshot: {
    page: Page;
    sections: PageSection[];
  };
  created_by?: string;
  published_at?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
}

export interface ThemeSettings {
  id?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSizeBase: string;
    fontWeightHeading: string;
  };
  buttons: {
    radius: string;
    padding: string;
    style: string;
    hoverEffect: string;
  };
  cards: {
    radius: string;
    shadow: string;
    border: string;
    hoverAnimation: string;
  };
  layout: {
    maxWidth: string;
    sectionSpacing: string;
    containerWidth: string;
  };
}

export interface BackgroundMusicTrack {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  source_type?: string;
  duration_seconds?: number;
  duration?: string;
  default_volume?: number;
  loop?: boolean;
  autoplay?: boolean;
  active?: boolean;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BackgroundMusicSettings {
  enabled: boolean;
  source_type: 'upload' | 'url' | 'synth';
  audio_url: string;
  track_title: string;
  artist_name?: string;
  default_volume: number;
  loop: boolean;
  autoplay: boolean;
  start_delay: number;
  fade_in_enabled: boolean;
  fade_in_duration: number;
  fade_out_enabled: boolean;
  fade_out_duration: number;
  remember_user_preference: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  target?: string;
  children?: NavigationItem[];
}

export interface SiteSettings {
  id?: string;
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  description?: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  google_maps_url?: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  analytics_ids: {
    google_analytics?: string;
    gtm?: string;
    meta_pixel?: string;
  };
  header_scripts?: string;
  footer_scripts?: string;
  background_music?: BackgroundMusicSettings;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
}

export type PackageTier = 'STARTUP' | 'GROWTH' | 'ENTERPRISE' | 'ORGANIZATION';
export type PriceDisplayType = 'FIXED' | 'STARTING_FROM' | 'PER_MONTH' | 'PER_PROJECT' | 'PER_CASE' | 'CUSTOM_QUOTE';
export type GstConfigType = 'EXCLUSIVE' | 'INCLUDED' | 'AS_PER_LAW';

export interface ServicePackage {
  id: string;
  service_id: string;
  tier: PackageTier;
  name: string;
  price: number;
  price_display_type: PriceDisplayType;
  currency: string;
  target_audience: string;
  badge?: string;
  inclusions: string[];
  exclusions?: string[];
  gst_setting?: GstConfigType;
  cta_text?: string;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sort_order?: number;
  is_contact_for_quote?: boolean;
}

export interface PriceAuditRecord {
  id: string;
  service_id: string;
  service_name: string;
  package_id: string;
  package_name: string;
  old_price_display: string;
  new_price_display: string;
  changed_by: string;
  timestamp: string;
}

export interface Service {
  id: string;
  category_id?: string;
  category_name?: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: string;
  cover_image?: string;
  gallery?: string[];
  benefits?: string[];
  process_steps?: { title: string; desc: string }[];
  packages?: ServicePackage[];
  is_featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sort_order: number;
  faqs?: { id?: string; question: string; answer: string }[];
  disclaimer?: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'MEETING' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface LeadActivity {
  id: string;
  lead_id: string;
  title?: string;
  type?: string;
  activity_type?: string;
  details?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company_name: string;
  designation?: string;
  avatar_url?: string;
  service_name?: string;
  type: 'TEXT' | 'VIDEO';
  video_url?: string;
  rating: number;
  quote: string;
  is_featured: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  sort_order: number;
  created_at: string;
}

export interface LeadImportLog {
  id: string;
  file_name: string;
  imported_by: string;
  imported_at: string;
  total_rows: number;
  imported_count: number;
  skipped_count: number;
  failed_count: number;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  error_report?: { row: number; reason: string }[];
}

export type LeadPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Lead {
  id: string;
  lead_code?: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  company_name?: string;
  service_interest?: string;
  package_name?: string;
  budget_range?: string;
  message?: string;
  status: LeadStatus;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  source_name?: string;
  campaign_name?: string;
  assigned_to?: string;
  assigned_name?: string;
  expected_value?: number;
  closing_date?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  activities?: LeadActivity[];
}

export interface PipelineStage {
  id: string;
  name: string;
  label?: string;
  order?: number;
  sort_order?: number;
  color?: string;
}

export interface Deal {
  id: string;
  lead_id?: string;
  lead_name?: string;
  title: string;
  value: number;
  stage?: string;
  stage_name?: string;
  stage_id?: string;
  status?: string;
  contact_name?: string;
  company_name?: string;
  assigned_to?: string;
  expected_close_date?: string;
  created_at: string;
}

export interface FollowUpTask {
  id: string;
  lead_id?: string;
  lead_name?: string;
  title: string;
  due_date: string;
  due_time?: string;
  type?: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING' | string;
  contact_name?: string;
  phone_email?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  assigned_to?: string;
  assigned_name?: string;
  completed_at?: string;
  notes?: string;
}

export interface PortfolioProject {
  id: string;
  title?: string;
  slug?: string;
  category?: string;
  project_type?: string;
  production_partner?: any;
  services_used?: string[];
  technologies?: string[];
  industry?: string;
  client_name?: string;
  client?: string;
  live_url?: string;
  cover_image?: string;
  featured_image?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string[] | string;
  gallery?: string[];
  video_reels?: VideoReel[];
  videos?: string[];
  instagram_url?: string;
  testimonial_author?: string;
  testimonial_quote?: string;
  completion_date?: string;
  status?: string;
  is_featured: boolean;
  created_at?: string;
}

export interface CaseStudy {
  id: string;
  title?: string;
  slug?: string;
  client_name?: string;
  client?: string;
  industry?: string;
  cover_image?: string;
  featured_image?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string[] | string;
  testimonial_quote?: string;
  testimonial_author?: string;
  testimonial_designation?: string;
  metrics?: { id?: string; case_study_id?: string; label: string; value: string; prefix?: string; suffix?: string }[];
  charts?: { title: string; image_url: string; subtitle?: string; type?: string }[];
  full_content?: string;
  status?: string;
  is_featured: boolean;
  created_at?: string;
}

export interface VideoReel {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  category?: string;
  partner_name?: string;
  views_count?: number | string;
  duration?: number | string;
  instagram_url?: string;
}

export interface ProductionPartner {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  long_bio?: string;
  logo_url: string;
  website_url: string;
  instagram_url?: string;
  phone?: string;
  email?: string;
  stats: {
    label: string;
    value: string;
  }[];
  capabilities: string[];
  equipment: string[];
}

export interface MediaAsset {
  id: string;
  filename?: string;
  file_name?: string;
  file_url?: string;
  url?: string;
  storage_path?: string;
  mime_type?: string;
  file_type?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | string;
  file_size?: number;
  size_bytes?: number;
  folder_name?: string;
  alt_text?: string;
  caption?: string;
  dimensions?: string;
  created_at: string;
}

export interface Client {
  id: string;
  name?: string;
  company_name: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  industry?: string;
  website?: string;
  total_spent?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export interface ProposalItem {
  id?: string;
  proposal_id?: string;
  name?: string;
  description?: string;
  qty?: number;
  quantity?: number;
  rate?: number;
  unit_price?: number;
  amount: number;
}

export interface Proposal {
  id: string;
  proposal_number: string;
  client_id: string;
  client_name?: string;
  title: string;
  description?: string;
  items?: ProposalItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  valid_until: string;
  created_at: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  name?: string;
  description?: string;
  qty?: number;
  quantity?: number;
  rate?: number;
  unit_price?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name?: string;
  items?: InvoiceItem[];
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amount_paid: number;
  status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number?: string;
  client_id?: string;
  client_name: string;
  amount: number;
  payment_method: 'UPI' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CASH' | 'Wire Transfer' | string;
  transaction_ref?: string;
  transaction_reference?: string;
  payment_date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'PAID' | string;
  created_at?: string;
}

// Communication & WhatsApp Marketing Types
export type CommunicationChannel = 'WHATSAPP' | 'EMAIL' | 'SMS' | 'CALL';
export type CallOutcome = 'ANSWERED' | 'NO_ANSWER' | 'BUSY' | 'WRONG_NUMBER' | 'CALLBACK_REQUESTED';

export interface CallLogPayload {
  contact_id?: string;
  contact_name: string;
  phone: string;
  outcome: CallOutcome;
  notes?: string;
  next_follow_up?: string;
}

export interface CommunicationActivity {
  id: string;
  lead_id?: string;
  contact_name: string;
  recipient_phone_email: string;
  channel: CommunicationChannel;
  direction: 'OUTBOUND' | 'INBOUND';
  mode: 'MANUAL' | 'AUTOMATED' | 'CAMPAIGN';
  message_body: string;
  sender_name: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  reel_id?: string;
  reel_title?: string;
  campaign_id?: string;
  template_name?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: CommunicationChannel;
  category: 'General' | 'Sales' | 'FollowUp' | 'Event' | 'Finance' | 'Payment';
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  header_text?: string;
  body_text: string;
  footer_text?: string;
  variables: string[];
  approval_status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  language: string;
}

export interface ReelAsset {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: string;
  tags: string[];
  cta_url?: string;
  campaign_count: number;
  created_at: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: CommunicationChannel;
  reel_id?: string;
  reel_title?: string;
  reel_url?: string;
  target_audience: 'ALL' | 'QUALIFIED_LEADS' | 'CLIENTS' | 'EVENT_PARTICIPANTS' | 'SPONSORS';
  message_template: string;
  scheduled_at?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'CANCELLED';
  recipients_count: number;
  opted_out_count: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  replies_count: number;
  leads_generated: number;
  deals_generated: number;
  revenue_attributed: number;
  created_by: string;
  created_at: string;
}

export interface ContactPreference {
  contact_id: string;
  contact_name: string;
  phone_email: string;
  whatsapp_opt_in: boolean;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  calls_opt_in: boolean;
  updated_at: string;
}
