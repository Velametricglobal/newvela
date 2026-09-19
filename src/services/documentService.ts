export type AdminDocumentType = 
  | 'APPOINTMENT_LETTER' 
  | 'WORK_AGREEMENT' 
  | 'INVOICE' 
  | 'LEDGER' 
  | 'QUOTATION' 
  | 'PROPOSAL';

export type DocumentStatus = 
  | 'DRAFT' 
  | 'SHARED_INTERNAL' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'SENT_TO_CLIENT' 
  | 'SIGNED';

export type SharingPermission = 'VIEW' | 'EDIT' | 'APPROVE';

export interface SharedEmployee {
  userCode: string;
  userName: string;
  email: string;
  role: string;
  department: string;
  permission: SharingPermission;
  sharedAt: string;
  notes?: string;
  status?: 'PENDING' | 'VIEWED' | 'APPROVED';
}

export interface DocumentLineItem {
  id: string;
  description: string;
  hsn_sac?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'INVOICE' | 'PAYMENT' | 'CREDIT_NOTE' | 'OPENING_BALANCE';
  referenceNumber: string;
  description: string;
  debit: number; // Invoiced/Billed amount
  credit: number; // Received/Paid amount
  balance: number; // Running balance
}

export interface AppointmentLetterPayload {
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  reportingManager: string;
  annualCtc: number;
  monthlyFixed: number;
  probationMonths: number;
  workLocation: string;
  dutiesAndResponsibilities: string;
  benefitsSummary: string;
  noticePeriodDays: number;
}

export interface WorkAgreementPayload {
  projectTitle: string;
  effectiveDate: string;
  completionDate: string;
  scopeOfWork: string;
  milestones: string;
  paymentTerms: string;
  intellectualPropertyClause: string;
  terminationClause: string;
  jurisdictionCity: string;
}

export interface FinancialBillingPayload {
  referenceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  lineItems: DocumentLineItem[];
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
    upiId?: string;
  };
  notesAndTerms: string;
}

export interface ClientLedgerPayload {
  statementPeriodStart: string;
  statementPeriodEnd: string;
  openingBalance: number;
  totalDebits: number;
  totalCredits: number;
  netOutstanding: number;
  entries: LedgerEntry[];
  closingNotes: string;
}

export interface ProposalPayload {
  proposalTitle: string;
  validUntil: string;
  executiveSummary: string;
  scopeAndDeliverables: string;
  strategicApproach: string;
  commercialSchedule: DocumentLineItem[];
  totalInvestment: number;
  deliverablesTimeline: string;
  clientAcceptanceTerms: string;
}

export interface AdminDocumentRecord {
  id: string;
  documentNumber: string;
  type: AdminDocumentType;
  title: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    userCode: string;
    userName: string;
  };
  client: {
    id?: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    taxGstin?: string;
    serviceCategory?: string;
  };
  sharedEmployees: SharedEmployee[];
  appointmentDetails?: AppointmentLetterPayload;
  agreementDetails?: WorkAgreementPayload;
  financialDetails?: FinancialBillingPayload;
  ledgerDetails?: ClientLedgerPayload;
  proposalDetails?: ProposalPayload;
}

const STORAGE_KEY = 'vela_admin_documents_v1';

const INITIAL_SEED_DOCUMENTS: AdminDocumentRecord[] = [
  {
    id: 'doc-seed-1',
    documentNumber: 'AGR-2026-001',
    type: 'WORK_AGREEMENT',
    title: 'Master Service Agreement - Healthcare SaaS & Campaign Staging',
    status: 'SIGNED',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdBy: {
      userCode: 'SUPERADMIN-001',
      userName: 'Vikramaditya Singh'
    },
    client: {
      id: 'cli-2',
      companyName: 'Apogee Health Inc',
      contactName: 'Elena Rostova',
      email: 'elena@apogeehealth.io',
      phone: '+1 (555) 987-6543',
      address: '500 BioTech Parkway, Cambridge, MA 02142',
      taxGstin: 'US-EIN-94-3829102',
      serviceCategory: 'Healthcare Brand Growth & Patient Ingestion'
    },
    sharedEmployees: [
      {
        userCode: 'SALES-MANAGER-001',
        userName: 'Anish Kapoor',
        email: 'salesmanager@example.com',
        role: 'SALES_MANAGER',
        department: 'Sales & Growth',
        permission: 'VIEW',
        sharedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
        notes: 'Handover complete. Execution phase in progress.',
        status: 'VIEWED'
      },
      {
        userCode: 'FINANCE-001',
        userName: 'Siddharth Nair',
        email: 'finance@example.com',
        role: 'FINANCE_MANAGER',
        department: 'Finance & Legal',
        permission: 'APPROVE',
        sharedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
        notes: 'Approved billing milestones.',
        status: 'APPROVED'
      }
    ],
    agreementDetails: {
      projectTitle: 'Healthcare Digital Transformation & Growth Blueprint',
      effectiveDate: '2026-09-01',
      completionDate: '2027-08-31',
      scopeOfWork: 'Comprehensive brand repositioning, patient conversion web systems, HIPAA-compliant patient consultation workflows, and Dapflix medical storytelling videos.',
      milestones: 'Phase 1: Brand & Web Infrastructure (Weeks 1-4)\nPhase 2: Local Campaign & Reel Staging (Weeks 5-8)\nPhase 3: Automated Patient CRM & Telemetry (Ongoing)',
      paymentTerms: '40% advance upon agreement signing, 30% upon infrastructure delivery, 30% upon campaign launch.',
      intellectualPropertyClause: 'All custom software code, landing pages, and creative video media produced shall transfer 100% ownership to Client upon final settlement of invoices.',
      terminationClause: 'Either party may terminate this agreement by providing thirty (30) days written notice.',
      jurisdictionCity: 'New Delhi / Dehradun'
    }
  },
  {
    id: 'doc-seed-2',
    documentNumber: 'INV-2026-084',
    type: 'INVOICE',
    title: 'Tax Invoice - Corporate Event Staging & Media Production',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    createdBy: {
      userCode: 'FINANCE-001',
      userName: 'Siddharth Nair'
    },
    client: {
      id: 'cli-1',
      companyName: 'Nexus Group Intl',
      contactName: 'Alexander Wright',
      email: 'a.wright@nexusgroup.com',
      phone: '+1 (555) 234-5678',
      address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
      taxGstin: 'GSTIN07AAACN1234F1Z5',
      serviceCategory: 'Corporate Event Production & Artist Management'
    },
    sharedEmployees: [
      {
        userCode: 'EVENT-001',
        userName: 'Meera Rawat',
        email: 'event@example.com',
        role: 'EVENT_MANAGER',
        department: 'Events & Culture',
        permission: 'VIEW',
        sharedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        notes: 'Please verify staging rider costs match invoice items.'
      }
    ],
    financialDetails: {
      referenceNumber: 'INV-2026-084',
      issueDate: '2026-09-12',
      dueDate: '2026-09-26',
      subtotal: 125000,
      taxRate: 18,
      taxAmount: 22500,
      discountAmount: 5000,
      totalAmount: 142500,
      currency: 'INR',
      lineItems: [
        {
          id: 'li-1',
          description: 'Artist Hospitality, Live Staging & Audio-Visual Rigging',
          hsn_sac: '9996',
          quantity: 1,
          unit_price: 85000,
          tax_rate: 18,
          amount: 85000
        },
        {
          id: 'li-2',
          description: '4K Multi-cam Live Recording & Post-Production Reels',
          hsn_sac: '9983',
          quantity: 1,
          unit_price: 40000,
          tax_rate: 18,
          amount: 40000
        }
      ],
      bankDetails: {
        bankName: 'HDFC Bank Ltd',
        accountNumber: '50200084920193',
        ifscCode: 'HDFC0001234',
        accountHolder: 'Velametric Business Solutions Private Limited',
        upiId: 'velametric@hdfcbank'
      },
      notesAndTerms: 'Payment due within 14 calendar days. Interest @ 18% p.a. charged on delayed payments.'
    }
  },
  {
    id: 'doc-seed-3',
    documentNumber: 'APPT-2026-018',
    type: 'APPOINTMENT_LETTER',
    title: 'Executive Appointment Letter - Senior Creative Director',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdBy: {
      userCode: 'SUPERADMIN-001',
      userName: 'Vikramaditya Singh'
    },
    client: {
      companyName: 'Velametric Global Media Studio',
      contactName: 'Kunal Singhania',
      email: 'kunal.singhania@example.com',
      phone: '+91 98765 43210',
      address: 'Velametric Tech Tower, Cyber City, Gurgaon, HR 122002'
    },
    sharedEmployees: [
      {
        userCode: 'ADMIN-001',
        userName: 'Business Administrator',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: 'Operations',
        permission: 'VIEW',
        sharedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        notes: 'Added to HR onboarding records.'
      }
    ],
    appointmentDetails: {
      employeeName: 'Kunal Singhania',
      designation: 'Senior Creative Director - Media & Production',
      department: 'Creative & Event Staging',
      joiningDate: '2026-10-01',
      reportingManager: 'Vikramaditya Singh (Managing Director)',
      annualCtc: 1800000,
      monthlyFixed: 150000,
      probationMonths: 3,
      workLocation: 'Hybrid (Gurgaon Studio / Client Locations)',
      dutiesAndResponsibilities: 'Lead production design for premium corporate and music events, direct celebrity shoots, oversee creative video editing teams, and maintain aesthetic benchmarks.',
      benefitsSummary: 'Comprehensive Family Medical Insurance (INR 10,00,000), Annual Performance Bonus up to 20%, Project Revenue Incentives.',
      noticePeriodDays: 60
    }
  },
  {
    id: 'doc-seed-4',
    documentNumber: 'LED-2026-004',
    type: 'LEDGER',
    title: 'Statement of Account / Financial Ledger - Nexus Group',
    status: 'SENT_TO_CLIENT',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: {
      userCode: 'FINANCE-001',
      userName: 'Siddharth Nair'
    },
    client: {
      id: 'cli-1',
      companyName: 'Nexus Group Intl',
      contactName: 'Alexander Wright',
      email: 'a.wright@nexusgroup.com',
      phone: '+1 (555) 234-5678',
      address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
      taxGstin: 'GSTIN07AAACN1234F1Z5'
    },
    sharedEmployees: [
      {
        userCode: 'SALES-001',
        userName: 'Rahul Sharma',
        email: 'sales@example.com',
        role: 'SALES_EXECUTIVE',
        department: 'Sales & Growth',
        permission: 'VIEW',
        sharedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: 'Shared with client account manager for quarterly reconciliation.'
      }
    ],
    ledgerDetails: {
      statementPeriodStart: '2026-07-01',
      statementPeriodEnd: '2026-09-18',
      openingBalance: 0,
      totalDebits: 267500,
      totalCredits: 125000,
      netOutstanding: 142500,
      entries: [
        {
          id: 'le-1',
          date: '2026-07-01',
          type: 'OPENING_BALANCE',
          referenceNumber: 'BAL-FWD',
          description: 'Opening Balance for FY 2026-27',
          debit: 0,
          credit: 0,
          balance: 0
        },
        {
          id: 'le-2',
          date: '2026-07-15',
          type: 'INVOICE',
          referenceNumber: 'INV-2026-042',
          description: 'Branding & Social Campaign Launch (July Billing)',
          debit: 125000,
          credit: 0,
          balance: 125000
        },
        {
          id: 'le-3',
          date: '2026-08-05',
          type: 'PAYMENT',
          referenceNumber: 'TXN-HDFC-9912',
          description: 'Wire Payment Received via RTGS against INV-2026-042',
          debit: 0,
          credit: 125000,
          balance: 0
        },
        {
          id: 'le-4',
          date: '2026-09-12',
          type: 'INVOICE',
          referenceNumber: 'INV-2026-084',
          description: 'Corporate Event Staging & Media Production (September)',
          debit: 142500,
          credit: 0,
          balance: 142500
        }
      ],
      closingNotes: 'Current balance of INR 142,500 is due on or before 26-Sep-2026. Bank account details are included on the reverse.'
    }
  },
  {
    id: 'doc-seed-5',
    documentNumber: 'QUO-2026-092',
    type: 'QUOTATION',
    title: 'Formal Commercial Quotation - Annual Dapflix Reels Studio Package',
    status: 'SENT_TO_CLIENT',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdBy: {
      userCode: 'SALES-MANAGER-001',
      userName: 'Anish Kapoor'
    },
    client: {
      id: 'cli-2',
      companyName: 'Apogee Health Inc',
      contactName: 'Elena Rostova',
      email: 'elena@apogeehealth.io',
      phone: '+1 (555) 987-6543',
      address: '500 BioTech Parkway, Cambridge, MA 02142',
      serviceCategory: 'Social Reels & Video Production'
    },
    sharedEmployees: [
      {
        userCode: 'MARKETING-001',
        userName: 'Priya Mehta',
        email: 'marketing@example.com',
        role: 'MARKETING_MANAGER',
        department: 'Digital Marketing',
        permission: 'EDIT',
        sharedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        notes: 'Priya, please review the video quota allocation.'
      }
    ],
    financialDetails: {
      referenceNumber: 'QUO-2026-092',
      issueDate: '2026-09-17',
      dueDate: '2026-10-01',
      subtotal: 90000,
      taxRate: 18,
      taxAmount: 16200,
      discountAmount: 10000,
      totalAmount: 96200,
      currency: 'INR',
      lineItems: [
        {
          id: 'qli-1',
          description: 'Dapflix Monthly Reel Package (12 Cinematic 4K Viral Reels/mo)',
          hsn_sac: '9983',
          quantity: 1,
          unit_price: 60000,
          tax_rate: 18,
          amount: 60000
        },
        {
          id: 'qli-2',
          description: 'Scripting, Teleprompter & On-site Studio Lighting Setup',
          hsn_sac: '9983',
          quantity: 1,
          unit_price: 30000,
          tax_rate: 18,
          amount: 30000
        }
      ],
      bankDetails: {
        bankName: 'HDFC Bank Ltd',
        accountNumber: '50200084920193',
        ifscCode: 'HDFC0001234',
        accountHolder: 'Velametric Business Solutions Private Limited'
      },
      notesAndTerms: 'Quotation valid for 15 days from issuance. 50% advance required upon confirmation.'
    }
  },
  {
    id: 'doc-seed-6',
    documentNumber: 'PROP-2026-108',
    type: 'PROPOSAL',
    title: 'Strategic Partnership Proposal - Complete Event & Marketing Retainer',
    status: 'DRAFT',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      userCode: 'SUPERADMIN-001',
      userName: 'Vikramaditya Singh'
    },
    client: {
      companyName: 'Doon Heritage Healthcare (DHCS)',
      contactName: 'Amit Rana',
      email: 'care@dhcshealth.in',
      phone: '+91 94120 55555',
      address: 'Rajpur Road, Dehradun, UK 248001',
      serviceCategory: 'Healthcare Brand Growth & ICU Staging'
    },
    sharedEmployees: [
      {
        userCode: 'SALES-MANAGER-001',
        userName: 'Anish Kapoor',
        email: 'salesmanager@example.com',
        role: 'SALES_MANAGER',
        department: 'Sales & Growth',
        permission: 'EDIT',
        sharedAt: new Date().toISOString(),
        notes: 'Finalizing pricing milestone breakdown with Amit.'
      }
    ],
    proposalDetails: {
      proposalTitle: 'From Local Service to Trusted Healthcare Brand: The 12-Month Expansion',
      validUntil: '2026-10-15',
      executiveSummary: 'Transforming Doon Home Care Services from an unorganized regional service provider into Uttarakhand’s most trusted home ICU and elder care brand through digital foundation, cinematic patient testimonials, and high-conversion marketing.',
      scopeAndDeliverables: '1. Brand Overhaul: Modern responsive digital hospital web portal with 24/7 instant booking.\n2. Storytelling Studio: 8 cinematic patient documentary case study films.\n3. Search Domination: Local SEO and Google Maps verification across Dehradun, Rishikesh & Haridwar.\n4. Integrated CRM: Real-time patient dispatch, nurse scheduling & billing.',
      strategicApproach: 'Phase 1: Foundation (Days 1-30) - Launch digital portal.\nPhase 2: Trust-Building (Days 31-90) - Video storytelling & doctor interviews.\nPhase 3: Scale (Days 91-365) - Paid performance engine & 24/7 helpline.',
      commercialSchedule: [
        {
          id: 'prop-item-1',
          description: 'Digital Infrastructure & Patient Booking Portal',
          quantity: 1,
          unit_price: 150000,
          tax_rate: 18,
          amount: 150000
        },
        {
          id: 'prop-item-2',
          description: 'Cinematic Patient Care Storytelling & Testimonials (8 Films)',
          quantity: 1,
          unit_price: 200000,
          tax_rate: 18,
          amount: 200000
        },
        {
          id: 'prop-item-3',
          description: 'Annual Dedicated Lead Generation & Patient Acquisition Retainer',
          quantity: 1,
          unit_price: 180000,
          tax_rate: 18,
          amount: 180000
        }
      ],
      totalInvestment: 530000,
      deliverablesTimeline: '12 Months comprehensive retainer beginning October 2026.',
      clientAcceptanceTerms: 'Upon acceptance, initial commitment deposit of INR 1,50,000 shall initiate Phase 1 immediately.'
    }
  }
];

export const documentService = {
  getDocuments: async (): Promise<AdminDocumentRecord[]> => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DOCUMENTS));
      return INITIAL_SEED_DOCUMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEED_DOCUMENTS;
    }
  },

  getDocumentById: async (id: string): Promise<AdminDocumentRecord | null> => {
    const docs = await documentService.getDocuments();
    return docs.find(d => d.id === id) || null;
  },

  createDocument: async (docData: Omit<AdminDocumentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminDocumentRecord> => {
    const docs = await documentService.getDocuments();
    const newDoc: AdminDocumentRecord = {
      ...docData,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sharedEmployees: docData.sharedEmployees || []
    };
    const updated = [newDoc, ...docs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newDoc;
  },

  updateDocument: async (id: string, updates: Partial<AdminDocumentRecord>): Promise<AdminDocumentRecord | null> => {
    const docs = await documentService.getDocuments();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return null;

    const updatedDoc: AdminDocumentRecord = {
      ...docs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    docs[index] = updatedDoc;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    return updatedDoc;
  },

  deleteDocument: async (id: string): Promise<boolean> => {
    const docs = await documentService.getDocuments();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  shareDocumentWithEmployee: async (docId: string, share: SharedEmployee): Promise<AdminDocumentRecord | null> => {
    const doc = await documentService.getDocumentById(docId);
    if (!doc) return null;

    // Filter out existing share for the same user code to prevent duplicate entries
    const existing = doc.sharedEmployees.filter(s => s.userCode !== share.userCode);
    const updatedShares = [...existing, share];

    return documentService.updateDocument(docId, {
      sharedEmployees: updatedShares,
      status: doc.status === 'DRAFT' ? 'SHARED_INTERNAL' : doc.status
    });
  }
};
