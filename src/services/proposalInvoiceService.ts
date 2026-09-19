import { Client, Proposal, Invoice, Payment } from '../types/database.types';

let localClients: Client[] = [
  {
    id: 'cli-1',
    company_name: 'Nexus Group Intl',
    industry: 'Technology & SaaS',
    website: 'https://nexusgroup.example.com',
    primary_contact_name: 'Alexander Wright',
    primary_contact_email: 'a.wright@nexusgroup.com',
    primary_contact_phone: '+1 (555) 234-5678',
    billing_address: '100 Innovation Way, Suite 400, San Francisco, CA 94105',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'cli-2',
    company_name: 'Apogee Health Inc',
    industry: 'Healthcare & Pharma',
    website: 'https://apogeehealth.example.com',
    primary_contact_name: 'Elena Rostova',
    primary_contact_email: 'elena@apogeehealth.io',
    primary_contact_phone: '+1 (555) 987-6543',
    billing_address: '500 BioTech Parkway, Cambridge, MA 02142',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  }
];

let localProposals: Proposal[] = [
  {
    id: 'prop-1',
    proposal_number: 'PROP-2026-004',
    client_id: 'cli-2',
    client_name: 'Apogee Health Inc',
    title: 'Government Subsidy Loan Advisory & Compliance',
    description: 'Comprehensive financial structuring, documentation preparation, and subsidy claim processing.',
    subtotal: 35000,
    tax: 3500,
    discount: 0,
    total: 38500,
    status: 'SENT',
    valid_until: '2026-09-30',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      { id: 'pi-1', proposal_id: 'prop-1', description: 'Financial Subsidy Audit & Structuring', quantity: 1, unit_price: 20000, amount: 20000 },
      { id: 'pi-2', proposal_id: 'prop-1', description: 'Bank & Government Liaison Representation', quantity: 1, unit_price: 15000, amount: 15000 }
    ]
  }
];

let localInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-2026-101',
    client_id: 'cli-1',
    client_name: 'Nexus Group Intl',
    issue_date: '2026-08-01',
    due_date: '2026-08-15',
    subtotal: 25000,
    tax: 2500,
    discount: 0,
    total: 27500,
    amount_paid: 27500,
    status: 'PAID',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    items: [
      { id: 'ii-1', invoice_id: 'inv-1', description: 'Web Application Phase 1 Milestone', quantity: 1, unit_price: 25000, amount: 25000 }
    ]
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-2026-102',
    client_id: 'cli-1',
    client_name: 'Nexus Group Intl',
    issue_date: '2026-08-20',
    due_date: '2026-09-05',
    subtotal: 20000,
    tax: 2000,
    discount: 0,
    total: 22000,
    amount_paid: 0,
    status: 'SENT',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    items: [
      { id: 'ii-2', invoice_id: 'inv-2', description: 'Web Application Phase 2 Final Delivery', quantity: 1, unit_price: 20000, amount: 20000 }
    ]
  }
];

let localPayments: Payment[] = [
  {
    id: 'pmt-1',
    invoice_id: 'inv-1',
    invoice_number: 'INV-2026-101',
    client_id: 'cli-1',
    client_name: 'Nexus Group Intl',
    amount: 27500,
    payment_method: 'Wire Transfer',
    transaction_reference: 'WIRE-8947201948',
    payment_date: '2026-08-10',
    status: 'PAID',
    created_at: new Date(Date.now() - 86400000 * 18).toISOString()
  }
];

export const proposalInvoiceService = {
  async getClients(): Promise<Client[]> {
    return [...localClients];
  },

  async getProposals(): Promise<Proposal[]> {
    return [...localProposals];
  },

  async getInvoices(): Promise<Invoice[]> {
    return [...localInvoices];
  },

  async getPayments(): Promise<Payment[]> {
    return [...localPayments];
  },

  async createProposal(proposalData: Partial<Proposal>): Promise<Proposal> {
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      proposal_number: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      client_id: proposalData.client_id || 'cli-1',
      client_name: proposalData.client_name || 'Client',
      title: proposalData.title || 'Service Proposal',
      description: proposalData.description || '',
      subtotal: proposalData.subtotal || 0,
      tax: proposalData.tax || 0,
      discount: proposalData.discount || 0,
      total: proposalData.total || 0,
      status: 'DRAFT',
      valid_until: proposalData.valid_until || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      items: proposalData.items || [],
      created_at: new Date().toISOString()
    };
    localProposals.unshift(newProp);
    return JSON.parse(JSON.stringify(newProp));
  },

  async recordPayment(invoiceId: string, amount: number, paymentMethod: string, transactionRef?: string): Promise<Payment> {
    const invIdx = localInvoices.findIndex(i => i.id === invoiceId);
    if (invIdx === -1) throw new Error('Invoice not found');

    const inv = localInvoices[invIdx];
    inv.amount_paid = (inv.amount_paid || 0) + amount;
    if (inv.amount_paid >= inv.total) {
      inv.status = 'PAID';
    } else {
      inv.status = 'PARTIALLY_PAID';
    }

    const newPayment: Payment = {
      id: `pmt-${Date.now()}`,
      invoice_id: invoiceId,
      invoice_number: inv.invoice_number,
      client_id: inv.client_id,
      client_name: inv.client_name || 'Client',
      amount,
      payment_method: paymentMethod,
      transaction_reference: transactionRef || `TXN-${Math.floor(Math.random() * 1000000)}`,
      payment_date: new Date().toISOString().split('T')[0],
      status: 'PAID',
      created_at: new Date().toISOString()
    };

    localPayments.unshift(newPayment);
    return JSON.parse(JSON.stringify(newPayment));
  }
};
