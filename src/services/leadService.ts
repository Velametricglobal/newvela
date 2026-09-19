import { Lead, LeadStatus, LeadActivity, LeadImportLog } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LEADS_STORAGE_KEY = 'VELAMETRIC_LEADS_STORE';
const IMPORT_LOGS_STORAGE_KEY = 'VELAMETRIC_LEAD_IMPORT_LOGS';

let leadCounter = 124;

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    lead_code: 'LEAD-000124',
    first_name: 'Anish',
    last_name: 'Kapoor',
    email: 'anish@apexwealth.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    company_name: 'Apex Wealth Management',
    service_interest: 'Government Subsidy Loans Consultancy',
    package_name: 'Enterprise Consultancy Case',
    budget_range: '₹5 Lakh+',
    message: 'Looking for DPR documentation and government subsidy loan guidance for our $2M manufacturing expansion.',
    status: 'QUALIFIED',
    priority: 'HIGH',
    source_name: 'Website Package System',
    campaign_name: 'Search Ads',
    assigned_to: 'user-1',
    assigned_name: 'Sales Manager',
    expected_value: 12000,
    closing_date: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    website: 'https://apexwealth.com',
    notes: 'High intent prospect. Requires DPR report by Friday.',
    tags: ['Subsidy', 'DPR', 'Priority'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    activities: [
      {
        id: 'act-1',
        lead_id: 'lead-1',
        activity_type: 'form_submission',
        title: 'Package Enquiry Submitted [ENQ-2026-00041]',
        details: 'Submitted Website Package System inquiry for Enterprise Consultancy Case.',
        notes: 'Submitted Website Package System inquiry for Enterprise Consultancy Case.',
        created_by: 'System',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'lead-2',
    lead_code: 'LEAD-000123',
    first_name: 'Priya',
    last_name: 'Reddy',
    email: 'priya@elevatelabs.io',
    phone: '+91 98123 45678',
    whatsapp: '+91 98123 45678',
    company_name: 'Elevate Digital Labs',
    service_interest: 'Digital Marketing',
    package_name: 'Enterprise Digital Marketing',
    budget_range: '₹35,000 / Month',
    message: 'We need monthly social media management, 8 viral reels, and lead-generation ads.',
    status: 'PROPOSAL',
    priority: 'HIGH',
    source_name: 'Instagram Ad',
    assigned_to: 'user-2',
    assigned_name: 'Rahul Sharma (Sales)',
    expected_value: 34999,
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    notes: 'Sent formal proposal PDF over WhatsApp.',
    tags: ['Marketing', 'Reels', 'Social'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    activities: [
      {
        id: 'act-2',
        lead_id: 'lead-2',
        activity_type: 'stage_change',
        title: 'Status Updated to PROPOSAL',
        details: 'Proposal document sent to client.',
        created_by: 'Rahul Sharma',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ]
  }
];

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [...INITIAL_LEADS];
  },

  async getLeadById(id: string): Promise<Lead | null> {
    const leads = await this.getLeads();
    const found = leads.find(l => l.id === id || l.lead_code === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async checkDuplicateLead(phone?: string, email?: string, whatsapp?: string): Promise<Lead | null> {
    const leads = await this.getLeads();
    const p = phone?.replace(/[^0-9]/g, '');
    const w = whatsapp?.replace(/[^0-9]/g, '');
    const e = email?.trim().toLowerCase();

    for (const lead of leads) {
      if (e && lead.email?.trim().toLowerCase() === e) return lead;
      if (p && p.length >= 8 && lead.phone?.replace(/[^0-9]/g, '').includes(p)) return lead;
      if (w && w.length >= 8 && lead.whatsapp?.replace(/[^0-9]/g, '').includes(w)) return lead;
    }
    return null;
  },

  async createLead(leadData: Partial<Lead>): Promise<{ lead: Lead; enqId: string }> {
    const leads = await this.getLeads();
    leadCounter += 1;
    const leadCode = `LEAD-${String(leadCounter).padStart(6, '0')}`;

    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      lead_code: leadCode,
      first_name: leadData.first_name || 'Prospect',
      last_name: leadData.last_name || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      whatsapp: leadData.whatsapp || leadData.phone || '',
      company_name: leadData.company_name || '',
      service_interest: leadData.service_interest || 'Website Development',
      package_name: leadData.package_name || '',
      budget_range: leadData.budget_range || 'Standard',
      message: leadData.message || '',
      status: leadData.status || 'NEW',
      priority: leadData.priority || 'MEDIUM',
      source_name: leadData.source_name || 'Manual Entry',
      campaign_name: leadData.campaign_name || '',
      assigned_to: leadData.assigned_to || '',
      assigned_name: leadData.assigned_name || 'Sales Team',
      expected_value: leadData.expected_value || 0,
      closing_date: leadData.closing_date || '',
      city: leadData.city || '',
      state: leadData.state || '',
      country: leadData.country || 'India',
      website: leadData.website || '',
      notes: leadData.notes || '',
      tags: leadData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          lead_id: `lead-${Date.now()}`,
          activity_type: 'creation',
          title: `Lead Created [${leadCode}]`,
          details: `Source: ${leadData.source_name || 'Manual'}, Service: ${leadData.service_interest || 'N/A'}`,
          notes: `Source: ${leadData.source_name || 'Manual'}, Service: ${leadData.service_interest || 'N/A'}`,
          created_by: 'System',
          created_at: new Date().toISOString()
        }
      ]
    };

    leads.unshift(newLead);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('leads').insert({
          name: `${newLead.first_name} ${newLead.last_name}`.trim(),
          email: newLead.email,
          phone: newLead.phone,
          whatsapp: newLead.whatsapp,
          company_name: newLead.company_name,
          source: newLead.source_name || 'Website Inquiry',
          service_interest: newLead.service_interest,
          status: newLead.status,
          priority: newLead.priority,
          notes: newLead.message || newLead.notes
        });
      } catch (err) {
        console.warn('Supabase lead insert error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_leads_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return { lead: JSON.parse(JSON.stringify(newLead)), enqId: leadCode };
  },

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    const leads = await this.getLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) throw new Error('Lead not found');

    leads[idx].status = status;
    leads[idx].updated_at = new Date().toISOString();
    leads[idx].activities = leads[idx].activities || [];
    leads[idx].activities.unshift({
      id: `act-${Date.now()}`,
      lead_id: leadId,
      activity_type: 'stage_change',
      title: `Status updated to ${status}`,
      details: `Status updated to ${status}`,
      notes: `Status updated to ${status}`,
      created_by: 'Sales Representative',
      created_at: new Date().toISOString()
    });

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    return JSON.parse(JSON.stringify(leads[idx]));
  },

  async addLeadNote(leadId: string, noteText: string): Promise<Lead> {
    const leads = await this.getLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) throw new Error('Lead not found');

    leads[idx].activities = leads[idx].activities || [];
    leads[idx].activities.unshift({
      id: `act-${Date.now()}`,
      lead_id: leadId,
      activity_type: 'note',
      title: 'Sales Note Added',
      details: noteText,
      notes: noteText,
      created_by: 'Sales Representative',
      created_at: new Date().toISOString()
    });

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    return JSON.parse(JSON.stringify(leads[idx]));
  },

  async importLeadsFromCSV({
    fileName,
    rows,
    columnMapping,
    duplicateHandling = 'SKIP',
    defaultAssignee = 'UNASSIGNED',
    importedBy = 'Super Admin'
  }: {
    fileName: string;
    rows: Record<string, string>[];
    columnMapping: Record<string, string>;
    duplicateHandling: 'SKIP' | 'UPDATE' | 'CREATE';
    defaultAssignee: string;
    importedBy?: string;
  }): Promise<{ importedCount: number; skippedCount: number; failedCount: number; errors: { row: number; reason: string }[] }> {
    const existingLeads = await this.getLeads();
    let importedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors: { row: number; reason: string }[] = [];

    const getMappedVal = (row: Record<string, string>, fieldKey: string) => {
      const csvCol = columnMapping[fieldKey];
      if (!csvCol || !row[csvCol]) return '';
      return String(row[csvCol]).trim();
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // 1-indexed including header

      const firstName = getMappedVal(row, 'first_name') || getMappedVal(row, 'name') || getMappedVal(row, 'full_name');
      const lastName = getMappedVal(row, 'last_name');
      const email = getMappedVal(row, 'email');
      const phone = getMappedVal(row, 'phone') || getMappedVal(row, 'mobile') || getMappedVal(row, 'whatsapp');
      const company = getMappedVal(row, 'company') || getMappedVal(row, 'business');
      const service = getMappedVal(row, 'service') || 'Website Development';
      const source = getMappedVal(row, 'source') || 'CSV Import';
      const statusRaw = getMappedVal(row, 'status') || 'NEW';
      const notes = getMappedVal(row, 'notes');
      const budget = getMappedVal(row, 'budget');

      // Validation
      if (!firstName && !company) {
        failedCount++;
        errors.push({ row: rowNum, reason: 'Missing Name and Company' });
        continue;
      }

      if (email && !email.includes('@')) {
        failedCount++;
        errors.push({ row: rowNum, reason: `Invalid email format (${email})` });
        continue;
      }

      // Check duplicates
      const dup = existingLeads.find(l => 
        (email && l.email?.toLowerCase() === email.toLowerCase()) ||
        (phone && phone.length >= 8 && l.phone?.replace(/[^0-9]/g, '').includes(phone.replace(/[^0-9]/g, '')))
      );

      if (dup) {
        if (duplicateHandling === 'SKIP') {
          skippedCount++;
          continue;
        } else if (duplicateHandling === 'UPDATE') {
          dup.company_name = company || dup.company_name;
          dup.service_interest = service || dup.service_interest;
          dup.updated_at = new Date().toISOString();
          importedCount++;
          continue;
        }
      }

      // Create Lead
      leadCounter++;
      const code = `LEAD-${String(leadCounter).padStart(6, '0')}`;
      const newLead: Lead = {
        id: `lead-${Date.now()}-${i}`,
        lead_code: code,
        first_name: firstName || 'Contact',
        last_name: lastName || '',
        email: email || '',
        phone: phone || '',
        whatsapp: phone || '',
        company_name: company || '',
        service_interest: service,
        budget_range: budget || 'Standard',
        message: notes || 'Imported via CSV file.',
        status: (statusRaw.toUpperCase() as LeadStatus) || 'NEW',
        source_name: source || 'CSV Import',
        assigned_name: defaultAssignee === 'UNASSIGNED' ? 'Unassigned' : defaultAssignee,
        notes: `Imported from ${fileName}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        activities: [
          {
            id: `act-${Date.now()}-${i}`,
            lead_id: `lead-${Date.now()}-${i}`,
            activity_type: 'csv_import',
            title: `Lead Imported from CSV [${fileName}]`,
            details: `Imported by ${importedBy}`,
            created_by: importedBy,
            created_at: new Date().toISOString()
          }
        ]
      };

      existingLeads.unshift(newLead);
      importedCount++;
    }

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existingLeads));

    // Log Import Session Audit Log
    const importLog: LeadImportLog = {
      id: `import-${Date.now()}`,
      file_name: fileName,
      imported_by: importedBy,
      imported_at: new Date().toISOString(),
      total_rows: rows.length,
      imported_count: importedCount,
      skipped_count: skippedCount,
      failed_count: failedCount,
      status: failedCount === 0 ? 'COMPLETED' : importedCount > 0 ? 'PARTIAL' : 'FAILED',
      error_report: errors
    };

    const logs = await this.getImportLogs();
    logs.unshift(importLog);
    localStorage.setItem(IMPORT_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));

    return { importedCount, skippedCount, failedCount, errors };
  },

  async getImportLogs(): Promise<LeadImportLog[]> {
    const saved = localStorage.getItem(IMPORT_LOGS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'import-demo-1',
        file_name: 'Velametric_Inbound_Leads_Aug2026.csv',
        imported_by: 'Super Admin',
        imported_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        total_rows: 45,
        imported_count: 42,
        skipped_count: 3,
        failed_count: 0,
        status: 'COMPLETED',
        error_report: []
      }
    ];
  },

  generateCSVTemplate(): string {
    return `first_name,last_name,company,phone,whatsapp,email,service,package,source,status,priority,assigned_to,budget,notes
Rahul,Sharma,Apex Enterprise,+919876543210,+919876543210,rahul@apex.com,Website Development,Enterprise Website,CSV Import,NEW,HIGH,Sales Manager,₹59999,"High priority inquiry"
Pooja,Patel,Global Retail Ltd,+919812345678,+919812345678,pooja@globalretail.in,Digital Marketing,Enterprise Digital Marketing,Facebook Ads,QUALIFIED,MEDIUM,Sales Team,₹34999,"Interested in reels campaign"`;
  }
};
