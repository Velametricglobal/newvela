import {
  CommunicationActivity, MessageTemplate, WhatsAppTemplate, CallLogPayload,
  ReelAsset, MarketingCampaign, ContactPreference, CommunicationChannel
} from '../types/database.types';

// Mock Initial Communication Timeline Data
let mockActivities: CommunicationActivity[] = [
  {
    id: 'comm-101',
    lead_id: 'lead-1',
    contact_name: 'Rahul Sharma',
    recipient_phone_email: '+91 9876543210',
    channel: 'WHATSAPP',
    direction: 'OUTBOUND',
    mode: 'MANUAL',
    message_body: 'Hello Rahul, thank you for your enquiry regarding Website & App Development. Our technical team is preparing your custom proposal.',
    sender_name: 'Anish Kapoor (Sales Lead)',
    status: 'READ',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'comm-102',
    lead_id: 'lead-1',
    contact_name: 'Rahul Sharma',
    recipient_phone_email: '+91 9876543210',
    channel: 'CALL',
    direction: 'OUTBOUND',
    mode: 'MANUAL',
    message_body: 'Call Outcome: ANSWERED — Discussed custom e-commerce scope & budget range. Follow-up demo set for tomorrow.',
    sender_name: 'Anish Kapoor (Sales Lead)',
    status: 'DELIVERED',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'comm-103',
    lead_id: 'reg-108',
    contact_name: 'Aanya Verma',
    recipient_phone_email: '+91 9876543211',
    channel: 'WHATSAPP',
    direction: 'OUTBOUND',
    mode: 'CAMPAIGN',
    message_body: 'Hi Aanya! Your registration EVT-REG-2026-00108 for Uttarakhand Mega Youth Fashion & Music Summit is confirmed.',
    sender_name: 'Meera Rawat (Event Manager)',
    status: 'DELIVERED',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let mockTemplates: MessageTemplate[] = [
  {
    id: 'tpl-1',
    name: 'New Inquiry Welcome (WhatsApp)',
    channel: 'WHATSAPP',
    category: 'Sales',
    content: 'Hello {{first_name}}, thank you for your enquiry regarding {{service_name}}. Our team would be happy to discuss your requirements.',
    variables: ['first_name', 'service_name'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'tpl-2',
    name: 'Event Pass Confirmation',
    channel: 'WHATSAPP',
    category: 'Event',
    content: 'Hi {{first_name}}! Your registration pass for {{event_name}} is confirmed. Event Date: {{event_date}}. Venue: {{venue_name}}.',
    variables: ['first_name', 'event_name', 'event_date', 'venue_name'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'tpl-3',
    name: 'Proposal Sent Follow-up',
    channel: 'EMAIL',
    category: 'FollowUp',
    subject: 'Your Custom Proposal for {{service_name}}',
    content: 'Hi {{first_name}}, we have sent your proposal #{{quotation_number}} for {{service_name}}. Let us know if you have any questions.',
    variables: ['first_name', 'service_name', 'quotation_number'],
    is_active: true,
    created_at: new Date().toISOString()
  }
];

let mockWhatsAppOfficialTemplates: WhatsAppTemplate[] = [
  {
    id: 'wa-tpl-101',
    name: 'velametric_welcome_lead_v2',
    category: 'MARKETING',
    header_text: 'Welcome to Velametric Global',
    body_text: 'Hello {{1}}, thank you for requesting a proposal for {{2}}. Our solution architecture team has assigned {{3}} as your dedicated manager.',
    footer_text: 'Reply STOP to opt out.',
    variables: ['first_name', 'service_name', 'salesperson_name'],
    approval_status: 'APPROVED',
    language: 'en'
  },
  {
    id: 'wa-tpl-102',
    name: 'velametric_event_pass_passcode',
    category: 'UTILITY',
    header_text: 'Official Event Participant Pass',
    body_text: 'Hi {{1}}, your pass ID for {{2}} is {{3}}. Please show this QR pass at the venue entrance.',
    footer_text: 'Destiny & Velametric Events',
    variables: ['first_name', 'event_name', 'pass_id'],
    approval_status: 'APPROVED',
    language: 'en'
  }
];

let mockReels: ReelAsset[] = [
  {
    id: 'reel-1',
    title: 'Digital Marketing & Lead Growth Showcase',
    description: 'High-impact 9:16 promotional reel showing 310% lead ROI growth for luxury real estate clients.',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-lights-42998-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 30,
    category: 'Marketing',
    tags: ['Reel', 'DigitalMarketing', 'Growth'],
    cta_url: '/services/digital-marketing',
    campaign_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'reel-2',
    title: 'Uttarakhand Mega Music Summit Teaser 2026',
    description: 'Cinematic teaser reel featuring rap battles, fashion pageants, and live music performances.',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-lights-42998-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    duration_seconds: 45,
    category: 'Events',
    tags: ['MusicFestival', 'FashionPageant', 'Events'],
    cta_url: '/event-registration',
    campaign_count: 5,
    created_at: new Date().toISOString()
  }
];

let mockCampaigns: MarketingCampaign[] = [
  {
    id: 'camp-101',
    name: 'August Digital Growth Promotional Reel Campaign',
    channel: 'WHATSAPP',
    reel_id: 'reel-1',
    reel_title: 'Digital Marketing & Lead Growth Showcase',
    reel_url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-lights-42998-large.mp4',
    target_audience: 'QUALIFIED_LEADS',
    message_template: 'Hi {{first_name}}, discover our latest digital marketing solutions and see how we can help your business grow. Watch the reel: {{cta_link}}',
    status: 'COMPLETED',
    recipients_count: 247,
    opted_out_count: 16,
    sent_count: 231,
    delivered_count: 228,
    read_count: 194,
    replies_count: 42,
    leads_generated: 18,
    deals_generated: 5,
    revenue_attributed: 450000,
    created_by: 'Anish Kapoor',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const communicationService = {
  // Normalize Phone Number for WhatsApp & Telephony
  normalizePhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) return `91${digits}`; // Add India country code by default
    return digits;
  },

  // Variable Interpolation Engine
  substituteVariables(templateText: string, context: Record<string, any>): string {
    let result = templateText;
    const defaultMap: Record<string, string> = {
      first_name: context.first_name || context.contact_name?.split(' ')[0] || 'Valued Client',
      last_name: context.last_name || '',
      company_name: context.company_name || 'Your Enterprise',
      service_name: context.service_interest || 'Web & Marketing Services',
      event_name: context.event_name || 'Uttarakhand Mega Youth Fashion & Music Summit 2026',
      event_date: context.event_date || 'October 15, 2026',
      venue_name: context.venue_name || 'Arena Ground, Dehradun',
      salesperson_name: context.salesperson_name || 'Velametric Growth Team',
      quotation_number: context.quotation_number || 'QUO-2026-88',
      invoice_number: context.invoice_number || 'INV-2026-104',
      amount: context.amount || '₹50,000',
      cta_link: context.cta_link || 'https://velametric.com/portfolio'
    };

    Object.keys(defaultMap).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      result = result.replace(regex, defaultMap[key]);
    });

    return result;
  },

  // Get Communication Timeline
  async getActivities(leadId?: string): Promise<CommunicationActivity[]> {
    if (leadId) {
      return mockActivities.filter(a => a.lead_id === leadId);
    }
    return [...mockActivities];
  },

  // Log Phone Call & Activity
  async logCall(payload: CallLogPayload): Promise<CommunicationActivity> {
    const newActivity: CommunicationActivity = {
      id: `comm-${Date.now()}`,
      lead_id: payload.contact_id,
      contact_name: payload.contact_name,
      recipient_phone_email: payload.phone,
      channel: 'CALL',
      direction: 'OUTBOUND',
      mode: 'MANUAL',
      message_body: `Call Outcome: ${payload.outcome} — ${payload.notes || 'No call notes entered.'} ${payload.next_follow_up ? `(Next Follow-up: ${payload.next_follow_up})` : ''}`,
      sender_name: 'Active Agent',
      status: 'DELIVERED',
      created_at: new Date().toISOString()
    };

    mockActivities.unshift(newActivity);
    return newActivity;
  },

  // Send Direct Message (WhatsApp, Email, SMS)
  async sendMessage(params: {
    lead_id?: string;
    contact_name: string;
    recipient: string;
    channel: CommunicationChannel;
    message_body: string;
    reel_id?: string;
    reel_title?: string;
  }): Promise<CommunicationActivity> {
    const newActivity: CommunicationActivity = {
      id: `comm-${Date.now()}`,
      lead_id: params.lead_id,
      contact_name: params.contact_name,
      recipient_phone_email: params.recipient,
      channel: params.channel,
      direction: 'OUTBOUND',
      mode: 'MANUAL',
      message_body: params.message_body,
      sender_name: 'Active Agent',
      status: 'SENT',
      reel_id: params.reel_id,
      reel_title: params.reel_title,
      created_at: new Date().toISOString()
    };

    mockActivities.unshift(newActivity);
    return newActivity;
  },

  // Get Templates
  async getTemplates(): Promise<MessageTemplate[]> {
    return [...mockTemplates];
  },

  async saveTemplate(tpl: Omit<MessageTemplate, 'id' | 'created_at'>): Promise<MessageTemplate> {
    const newTpl: MessageTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    mockTemplates.unshift(newTpl);
    return newTpl;
  },

  // Get Official WhatsApp Business Templates
  async getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
    return [...mockWhatsAppOfficialTemplates];
  },

  // Get Reel Library
  async getReelAssets(): Promise<ReelAsset[]> {
    return [...mockReels];
  },

  async addReelAsset(reel: Omit<ReelAsset, 'id' | 'created_at' | 'campaign_count'>): Promise<ReelAsset> {
    const newReel: ReelAsset = {
      ...reel,
      id: `reel-${Date.now()}`,
      campaign_count: 0,
      created_at: new Date().toISOString()
    };
    mockReels.unshift(newReel);
    return newReel;
  },

  // Get Campaigns
  async getCampaigns(): Promise<MarketingCampaign[]> {
    return [...mockCampaigns];
  },

  async createCampaign(camp: Omit<MarketingCampaign, 'id' | 'created_at' | 'sent_count' | 'delivered_count' | 'read_count' | 'replies_count' | 'leads_generated' | 'deals_generated' | 'revenue_attributed'>): Promise<MarketingCampaign> {
    const newCamp: MarketingCampaign = {
      ...camp,
      id: `camp-${Date.now()}`,
      sent_count: camp.recipients_count,
      delivered_count: Math.floor(camp.recipients_count * 0.96),
      read_count: Math.floor(camp.recipients_count * 0.82),
      replies_count: Math.floor(camp.recipients_count * 0.18),
      leads_generated: 12,
      deals_generated: 3,
      revenue_attributed: 320000,
      created_at: new Date().toISOString()
    };

    mockCampaigns.unshift(newCamp);
    return newCamp;
  }
};
