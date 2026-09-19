import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  documentService,
  AdminDocumentRecord,
  AdminDocumentType,
  DocumentStatus,
  SharedEmployee,
  SharingPermission,
  DocumentLineItem,
  LedgerEntry
} from '../../services/documentService';
import { proposalInvoiceService } from '../../services/proposalInvoiceService';
import { leadService } from '../../services/leadService';
import { INITIAL_SETUP_AGENT_USERS } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Client, Lead } from '../../types/database.types';
import {
  FileText, Plus, Printer, Share2, Eye, Trash2, Edit3, CheckCircle2,
  Clock, AlertCircle, Building2, User, Mail, Phone, MapPin, Calendar,
  DollarSign, Shield, FileSpreadsheet, CreditCard, ChevronRight, Search,
  Filter, Copy, Check, Sparkles, Send, ArrowLeft, ArrowRight, Download,
  Layers, Award, Briefcase, ExternalLink, RefreshCw, X, ShieldCheck
} from 'lucide-react';

const DOCUMENT_TYPE_LABELS: Record<AdminDocumentType, { label: string; icon: any; color: string; badge: string }> = {
  APPOINTMENT_LETTER: { label: 'Appointment Letter', icon: Briefcase, color: 'from-blue-500 to-indigo-600', badge: 'HR & IAM' },
  WORK_AGREEMENT: { label: 'Work Agreement', icon: FileText, color: 'from-purple-500 to-pink-600', badge: 'LEGAL & SLA' },
  INVOICE: { label: 'Tax Invoice', icon: CreditCard, color: 'from-emerald-500 to-teal-600', badge: 'COMMERCIAL' },
  LEDGER: { label: 'Statement / Ledger', icon: Layers, color: 'from-amber-500 to-orange-600', badge: 'FINANCE' },
  QUOTATION: { label: 'Quotation / Estimate', icon: FileSpreadsheet, color: 'from-cyan-500 to-blue-600', badge: 'SALES' },
  PROPOSAL: { label: 'Project Proposal', icon: Award, color: 'from-rose-500 to-red-600', badge: 'STRATEGY' }
};

export const DocumentStudioAdmin: React.FC = () => {
  const { currentUser } = useAuth();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Documents state
  const [documents, setDocuments] = useState<AdminDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Clients & Leads state for database auto-population
  const [dbClients, setDbClients] = useState<Client[]>([]);
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);

  // UI View Modes: 'LIST' | 'CREATE' | 'PREVIEW'
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'PREVIEW'>('LIST');
  const [selectedDocument, setSelectedDocument] = useState<AdminDocumentRecord | null>(null);

  // Filter state in LIST mode
  const [filterType, setFilterType] = useState<AdminDocumentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'ALL'>('ALL');

  // Employee sharing modal state
  const [shareModalDoc, setShareModalDoc] = useState<AdminDocumentRecord | null>(null);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState('SALES-001');
  const [selectedPermission, setSelectedPermission] = useState<SharingPermission>('VIEW');
  const [shareNotes, setShareNotes] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State in CREATE mode
  const [formType, setFormType] = useState<AdminDocumentType>('WORK_AGREEMENT');
  const [formTitle, setFormTitle] = useState('');
  const [selectedDbSource, setSelectedDbSource] = useState<string>(''); // 'client:id' or 'lead:id'
  
  // Client details fields
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientTaxGstin, setClientTaxGstin] = useState('');
  const [clientServiceCategory, setClientServiceCategory] = useState('');

  // Specific form states: Appointment Letter
  const [apptDesignation, setApptDesignation] = useState('Creative Lead & Producer');
  const [apptDepartment, setApptDepartment] = useState('Media Production');
  const [apptJoiningDate, setApptJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [apptReportingManager, setApptReportingManager] = useState('Vikramaditya Singh (Managing Director)');
  const [apptAnnualCtc, setApptAnnualCtc] = useState(1200000);
  const [apptProbationMonths, setApptProbationMonths] = useState(3);
  const [apptWorkLocation, setApptWorkLocation] = useState('Velametric Studios / Client Location');
  const [apptDuties, setApptDuties] = useState('Lead production planning, manage client creative deliverables, oversee video editing pipelines, and ensure quality benchmarks.');
  const [apptBenefits, setApptBenefits] = useState('Comprehensive Health Insurance, Project Incentives, 24 Annual Paid Leaves.');

  // Specific form states: Work Agreement
  const [agrEffectiveDate, setAgrEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [agrCompletionDate, setAgrCompletionDate] = useState(new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0]);
  const [agrScope, setAgrScope] = useState('Complete event staging, production planning, audio-visual rigging, and digital promotional video reel creation.');
  const [agrMilestones, setAgrMilestones] = useState('1. Initial Conceptualization & Technical Riders (Day 1-15)\n2. Staging Execution & Live Coverage (Day 16-45)\n3. Post-Event Master Delivery & Wrap-up (Day 46-90)');
  const [agrPaymentTerms, setAgrPaymentTerms] = useState('50% advance upon contract signing, 30% on staging delivery, 20% upon final sign-off.');
  const [agrJurisdiction, setAgrJurisdiction] = useState('New Delhi / Dehradun');

  // Specific form states: Line Items for Invoice / Quotation / Proposal
  const [lineItems, setLineItems] = useState<DocumentLineItem[]>([
    {
      id: 'li-1',
      description: 'Professional Event Management & Celebrity Artist Coordination',
      hsn_sac: '9996',
      quantity: 1,
      unit_price: 150000,
      tax_rate: 18,
      amount: 150000
    },
    {
      id: 'li-2',
      description: 'Dapflix 4K Multi-cam Reel Production & Live Video Streaming',
      hsn_sac: '9983',
      quantity: 1,
      unit_price: 75000,
      tax_rate: 18,
      amount: 75000
    }
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [discountAmount, setDiscountAmount] = useState(10000);
  const [invoiceDueDate, setInvoiceDueDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);

  // Specific form states: Ledger
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([
    {
      id: 'le-init',
      date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
      type: 'OPENING_BALANCE',
      referenceNumber: 'OPN-BAL',
      description: 'Opening Balance for FY 2026-27',
      debit: 0,
      credit: 0,
      balance: 0
    },
    {
      id: 'le-inv1',
      date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
      type: 'INVOICE',
      referenceNumber: 'INV-2026-001',
      description: 'Brand Launch & Event Staging Invoice',
      debit: 200000,
      credit: 0,
      balance: 200000
    },
    {
      id: 'le-pay1',
      date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      type: 'PAYMENT',
      referenceNumber: 'TXN-BANK-8821',
      description: 'Wire Transfer Settlement Received',
      debit: 0,
      credit: 100000,
      balance: 100000
    }
  ]);

  // Specific form states: Proposal
  const [proposalPitch, setProposalPitch] = useState('Accelerate brand growth and market visibility through high-impact live events, celebrity endorsements, and short-form viral storytelling reels.');
  const [proposalTimeline, setProposalTimeline] = useState('6-Month structured expansion blueprint beginning next month.');

  // Load documents, clients, and leads on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [docs, clients, leads] = await Promise.all([
      documentService.getDocuments(),
      proposalInvoiceService.getClients(),
      leadService.getLeads()
    ]);
    setDocuments(docs);
    setDbClients(clients);
    setDbLeads(leads);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Database auto-populate handler: when admin selects a client or lead from dropdown
  const handleAutoPopulateFromDb = (sourceKey: string) => {
    setSelectedDbSource(sourceKey);
    if (!sourceKey) return;

    const [type, id] = sourceKey.split(':');
    if (type === 'client') {
      const client = dbClients.find(c => c.id === id);
      if (client) {
        setClientCompanyName(client.company_name || '');
        setClientContactName(client.primary_contact_name || '');
        setClientEmail(client.primary_contact_email || '');
        setClientPhone(client.primary_contact_phone || '');
        setClientAddress(client.billing_address || '');
        setClientServiceCategory(client.industry || 'Professional Services');
        setClientTaxGstin('GSTIN' + Math.random().toString(36).substr(2, 9).toUpperCase());
        showToast(`✨ Auto-populated client data for ${client.company_name}!`);
      }
    } else if (type === 'lead') {
      const lead = dbLeads.find(l => l.id === id);
      if (lead) {
        setClientCompanyName(lead.company_name || `${lead.first_name} ${lead.last_name}`);
        setClientContactName(`${lead.first_name} ${lead.last_name}`);
        setClientEmail(lead.email || '');
        setClientPhone(lead.phone || '');
        setClientAddress(lead.country || 'Corporate HQ');
        setClientServiceCategory(lead.service_interest || 'Brand Growth');
        setClientTaxGstin('GSTIN' + Math.random().toString(36).substr(2, 9).toUpperCase());
        showToast(`✨ Auto-populated lead details for ${lead.first_name} ${lead.last_name}!`);
      }
    }
  };

  // Calculations for line items
  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [lineItems]);

  const taxAmount = useMemo(() => {
    return Math.round((subtotal * taxRate) / 100);
  }, [subtotal, taxRate]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal + taxAmount - discountAmount);
  }, [subtotal, taxAmount, discountAmount]);

  // Calculations for Ledger
  const ledgerTotals = useMemo(() => {
    let debits = 0;
    let credits = 0;
    let running = 0;
    const computedEntries = ledgerEntries.map(e => {
      debits += e.debit;
      credits += e.credit;
      running = running + e.debit - e.credit;
      return { ...e, balance: running };
    });
    return {
      entries: computedEntries,
      totalDebits: debits,
      totalCredits: credits,
      netOutstanding: running
    };
  }, [ledgerEntries]);

  // Add line item
  const handleAddLineItem = () => {
    const newItem: DocumentLineItem = {
      id: `li-${Date.now()}`,
      description: 'Additional Service / Deliverable Milestone',
      hsn_sac: '9983',
      quantity: 1,
      unit_price: 25000,
      tax_rate: taxRate,
      amount: 25000
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof DocumentLineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          updated.amount = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Add ledger entry
  const handleAddLedgerEntry = () => {
    const newEntry: LedgerEntry = {
      id: `le-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'INVOICE',
      referenceNumber: `INV-2026-0${ledgerEntries.length + 1}`,
      description: 'Service Billing Fee',
      debit: 50000,
      credit: 0,
      balance: 0
    };
    setLedgerEntries([...ledgerEntries, newEntry]);
  };

  const handleRemoveLedgerEntry = (id: string) => {
    if (ledgerEntries.length > 1) {
      setLedgerEntries(ledgerEntries.filter(e => e.id !== id));
    }
  };

  // Reset form with preset based on document type
  const handleSelectDocType = (type: AdminDocumentType) => {
    setFormType(type);
    const prefixMap: Record<AdminDocumentType, string> = {
      APPOINTMENT_LETTER: 'Executive Appointment Letter',
      WORK_AGREEMENT: 'Master Commercial Services Agreement',
      INVOICE: 'Tax Invoice - Professional Services',
      LEDGER: 'Statement of Account / Financial Ledger',
      QUOTATION: 'Formal Commercial Quotation & Scope Estimate',
      PROPOSAL: 'Comprehensive Strategic Partnership Proposal'
    };
    setFormTitle(`${prefixMap[type]} - ${clientCompanyName || 'New Client'}`);
  };

  // Save new document
  const handleSaveDocument = async () => {
    if (!clientCompanyName.trim()) {
      showToast('⚠️ Please provide or select a Client / Company Name');
      return;
    }

    const typePrefixes: Record<AdminDocumentType, string> = {
      APPOINTMENT_LETTER: 'APPT',
      WORK_AGREEMENT: 'AGR',
      INVOICE: 'INV',
      LEDGER: 'LED',
      QUOTATION: 'QUO',
      PROPOSAL: 'PROP'
    };

    const docNumber = `${typePrefixes[formType]}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: Omit<AdminDocumentRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      documentNumber: docNumber,
      type: formType,
      title: formTitle || `${DOCUMENT_TYPE_LABELS[formType].label} - ${clientCompanyName}`,
      status: 'DRAFT',
      createdBy: {
        userCode: currentUser?.user_code || 'ADMIN-001',
        userName: currentUser?.full_name || 'Admin User'
      },
      client: {
        companyName: clientCompanyName,
        contactName: clientContactName,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        taxGstin: clientTaxGstin,
        serviceCategory: clientServiceCategory
      },
      sharedEmployees: [],
      // Type specific payloads
      appointmentDetails: formType === 'APPOINTMENT_LETTER' ? {
        employeeName: clientContactName || 'Candidate Name',
        designation: apptDesignation,
        department: apptDepartment,
        joiningDate: apptJoiningDate,
        reportingManager: apptReportingManager,
        annualCtc: apptAnnualCtc,
        monthlyFixed: Math.round(apptAnnualCtc / 12),
        probationMonths: apptProbationMonths,
        workLocation: apptWorkLocation,
        dutiesAndResponsibilities: apptDuties,
        benefitsSummary: apptBenefits,
        noticePeriodDays: 60
      } : undefined,

      agreementDetails: formType === 'WORK_AGREEMENT' ? {
        projectTitle: formTitle,
        effectiveDate: agrEffectiveDate,
        completionDate: agrCompletionDate,
        scopeOfWork: agrScope,
        milestones: agrMilestones,
        paymentTerms: agrPaymentTerms,
        intellectualPropertyClause: 'All creative deliverables and software assets shall transfer to Client upon full payment settlement.',
        terminationClause: 'Thirty (30) days written notice required by either party.',
        jurisdictionCity: agrJurisdiction
      } : undefined,

      financialDetails: (formType === 'INVOICE' || formType === 'QUOTATION') ? {
        referenceNumber: docNumber,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: invoiceDueDate,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        totalAmount,
        currency: 'INR',
        lineItems,
        bankDetails: {
          bankName: 'HDFC Bank Ltd',
          accountNumber: '50200084920193',
          ifscCode: 'HDFC0001234',
          accountHolder: 'Velametric Business Solutions Private Limited',
          upiId: 'velametric@hdfcbank'
        },
        notesAndTerms: 'Payment due within invoice terms. Bank transfer details listed on invoice.'
      } : undefined,

      ledgerDetails: formType === 'LEDGER' ? {
        statementPeriodStart: ledgerEntries[0]?.date || '2026-07-01',
        statementPeriodEnd: new Date().toISOString().split('T')[0],
        openingBalance: 0,
        totalDebits: ledgerTotals.totalDebits,
        totalCredits: ledgerTotals.totalCredits,
        netOutstanding: ledgerTotals.netOutstanding,
        entries: ledgerTotals.entries,
        closingNotes: 'Current balance due as per agreed billing contract terms.'
      } : undefined,

      proposalDetails: formType === 'PROPOSAL' ? {
        proposalTitle: formTitle,
        validUntil: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        executiveSummary: proposalPitch,
        scopeAndDeliverables: agrScope,
        strategicApproach: 'Multi-phased rollout focusing on rapid audience acquisition, brand trust, and revenue acceleration.',
        commercialSchedule: lineItems,
        totalInvestment: totalAmount,
        deliverablesTimeline: proposalTimeline,
        clientAcceptanceTerms: 'Acceptance confirmed upon signature and initial retainer deposit.'
      } : undefined
    };

    const created = await documentService.createDocument(newRecord);
    await loadData();
    setSelectedDocument(created);
    setViewMode('PREVIEW');
    showToast(`✅ ${DOCUMENT_TYPE_LABELS[formType].label} (${docNumber}) created and saved!`);
  };

  // Employee sharing submission
  const handleConfirmShareWithEmployee = async () => {
    if (!shareModalDoc) return;
    const targetAgent = INITIAL_SETUP_AGENT_USERS[selectedEmployeeCode];
    if (!targetAgent) return;

    const sharePayload: SharedEmployee = {
      userCode: targetAgent.user_code,
      userName: targetAgent.full_name,
      email: targetAgent.email,
      role: targetAgent.role,
      department: targetAgent.department,
      permission: selectedPermission,
      sharedAt: new Date().toISOString(),
      notes: shareNotes || 'Assigned for team review and execution.',
      status: 'PENDING'
    };

    await documentService.shareDocumentWithEmployee(shareModalDoc.id, sharePayload);
    await loadData();

    // If currently previewing this document, update the preview object
    if (selectedDocument?.id === shareModalDoc.id) {
      const updated = await documentService.getDocumentById(shareModalDoc.id);
      setSelectedDocument(updated);
    }

    setShareModalDoc(null);
    setShareNotes('');
    showToast(`👥 Document shared successfully with ${targetAgent.full_name}!`);
  };

  // Copy internal link
  const handleCopyLink = (docId: string) => {
    const link = `${window.location.origin}/admin/documents?docId=${docId}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
    showToast('📋 Internal share link copied to clipboard!');
  };

  // Print Clean Document Only
  const handlePrintDocument = () => {
    window.print();
  };

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesType = filterType === 'ALL' || doc.type === filterType;
      const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
      const matchesSearch = !searchQuery.trim() ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client.contactName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [documents, filterType, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-brand-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: REPOSITORY LIST VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'LIST' && (
        <div className="space-y-6">
          {/* Top Banner Header */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MODULE 04 • COMMERCIAL & LEGAL
                </span>
                <span className="text-xs text-slate-400 font-mono">AUTOMATED DOCUMENT STUDIO</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">Client Documentation & Contracts Center</h2>
              <p className="text-slate-400 text-xs mt-1">
                Auto-generate Appointment Letters, Work Agreements, Invoices, Ledgers, Quotations, and Proposals with database auto-fill and employee sharing.
              </p>
            </div>

            <button
              onClick={() => {
                handleSelectDocType('WORK_AGREEMENT');
                setViewMode('CREATE');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Document</span>
            </button>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Created</span>
              <div className="text-2xl font-black text-white mt-1">{documents.length}</div>
              <span className="text-[10px] text-slate-400">Across all 6 pillars</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Agreements & Proposals</span>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {documents.filter(d => d.type === 'WORK_AGREEMENT' || d.type === 'PROPOSAL').length}
              </div>
              <span className="text-[10px] text-purple-300/70">Client contracts</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Invoices & Ledgers</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {documents.filter(d => d.type === 'INVOICE' || d.type === 'LEDGER').length}
              </div>
              <span className="text-[10px] text-emerald-300/70">Financial statements</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Shared with Team</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {documents.filter(d => d.sharedEmployees && d.sharedEmployees.length > 0).length}
              </div>
              <span className="text-[10px] text-amber-300/70">Internal handovers</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Document Type Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    filterType === 'ALL'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Types ({documents.length})
                </button>
                {(Object.keys(DOCUMENT_TYPE_LABELS) as AdminDocumentType[]).map(t => {
                  const meta = DOCUMENT_TYPE_LABELS[t];
                  const count = documents.filter(d => d.type === t).length;
                  return (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        filterType === t
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by client, title, #"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => {
              const meta = DOCUMENT_TYPE_LABELS[doc.type];
              const DocIcon = meta.icon;

              return (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl"
                >
                  <div>
                    {/* Header line: Type & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${meta.color} flex items-center justify-center text-white shadow-sm`}>
                          <DocIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block leading-tight">
                            {doc.documentNumber}
                          </span>
                          <span className="text-xs font-bold text-white block">
                            {meta.label}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        doc.status === 'SIGNED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        doc.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        doc.status === 'SENT_TO_CLIENT' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        doc.status === 'SHARED_INTERNAL' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-brand-300 transition-colors">
                      {doc.title}
                    </h3>

                    {/* Client & Author Details */}
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1.5 mb-3 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span className="truncate">{doc.client.companyName}</span>
                        {doc.financialDetails?.totalAmount && (
                          <span className="text-emerald-400 font-bold font-mono">
                            {formatAmount(doc.financialDetails.totalAmount)}
                          </span>
                        )}
                        {doc.appointmentDetails?.annualCtc && (
                          <span className="text-purple-400 font-bold font-mono">
                            {formatAmount(doc.appointmentDetails.annualCtc)}/yr
                          </span>
                        )}
                        {doc.ledgerDetails?.netOutstanding !== undefined && (
                          <span className="text-amber-400 font-bold font-mono">
                            Bal: {formatAmount(doc.ledgerDetails.netOutstanding)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{doc.client.contactName || 'No contact specified'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60 flex items-center justify-between">
                        <span>Created by {doc.createdBy.userName}</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Shared Employees Pills */}
                    {doc.sharedEmployees && doc.sharedEmployees.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-amber-400" /> Shared with Team ({doc.sharedEmployees.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doc.sharedEmployees.map((emp, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300 font-medium flex items-center gap-1"
                              title={`${emp.userName} (${emp.permission}) - ${emp.notes || 'No notes'}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {emp.userName.split(' ')[0]}
                              <span className="text-[9px] text-amber-400 font-mono">({emp.permission})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedDocument(doc);
                        setViewMode('PREVIEW');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>

                    <button
                      onClick={() => setShareModalDoc(doc)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-slate-700 transition-colors"
                      title="Share with Team / Employee"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopyLink(doc.id)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      title="Copy Internal Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm(`Delete document ${doc.documentNumber}?`)) {
                          await documentService.deleteDocument(doc.id);
                          loadData();
                          showToast(`🗑️ Document ${doc.documentNumber} deleted.`);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No documents found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No documents match your current filter or search criteria. Click below to create your first client document.
                </p>
                <button
                  onClick={() => {
                    handleSelectDocType('WORK_AGREEMENT');
                    setViewMode('CREATE');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Create New Document
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE CREATOR & DATABASE AUTO-POPULATOR */}
      {/* ========================================================================= */}
      {viewMode === 'CREATE' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Top Return Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('LIST')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Document Repository</span>
            </button>

            <span className="text-xs font-mono text-amber-400 font-bold">
              STEP 1: CHOOSE TYPE & AUTO-FILL CLIENT
            </span>
          </div>

          {/* Step 1: Document Type Cards */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Select Document Pillar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(DOCUMENT_TYPE_LABELS) as AdminDocumentType[]).map((t) => {
                const meta = DOCUMENT_TYPE_LABELS[t];
                const DocIcon = meta.icon;
                const isSelected = formType === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectDocType(t)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${meta.color} flex items-center justify-center text-white`}>
                        <DocIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {meta.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{meta.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Database Connection (Auto-populate Client Details) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Connect Client & Auto-Populate from Database
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select an existing Client or CRM Lead to instantly extract contact details, address, and service interest.
                </p>
              </div>

              {/* Database selector dropdown */}
              <div className="w-full sm:w-72">
                <select
                  value={selectedDbSource}
                  onChange={(e) => handleAutoPopulateFromDb(e.target.value)}
                  className="w-full bg-slate-950 border border-brand-500/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="">⚡ Select from Database...</option>
                  <optgroup label="🏢 Active Clients">
                    {dbClients.map(c => (
                      <option key={`client:${c.id}`} value={`client:${c.id}`}>
                        {c.company_name} ({c.primary_contact_name})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="👥 CRM Leads">
                    {dbLeads.map(l => (
                      <option key={`lead:${l.id}`} value={`lead:${l.id}`}>
                        {l.first_name} {l.last_name} - {l.company_name || l.service_interest}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Client Input Fields (Auto-filled or editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  placeholder="e.g. Apogee Health Inc"
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={clientContactName}
                  onChange={(e) => setClientContactName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. elena@apogeehealth.io"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone / Mobile</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tax ID / GSTIN / EIN</label>
                <input
                  type="text"
                  placeholder="GSTIN07AAACN1234F1Z5"
                  value={clientTaxGstin}
                  onChange={(e) => setClientTaxGstin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Service / Industry Category</label>
                <input
                  type="text"
                  placeholder="e.g. Event Management / Production"
                  value={clientServiceCategory}
                  onChange={(e) => setClientServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official Billing Address</label>
                <input
                  type="text"
                  placeholder="Suite 400, Innovation Boulevard, Boston, MA 02142"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Document-Specific Customizer */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              Document Content & Terms Customizer ({DOCUMENT_TYPE_LABELS[formType].label})
            </h3>

            {/* Document Title */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Document Subject / Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* CONDITIONAL SUB-FORM: 1. APPOINTMENT LETTER */}
            {formType === 'APPOINTMENT_LETTER' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Official Designation</label>
                    <input
                      type="text"
                      value={apptDesignation}
                      onChange={(e) => setApptDesignation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Department</label>
                    <input
                      type="text"
                      value={apptDepartment}
                      onChange={(e) => setApptDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={apptJoiningDate}
                      onChange={(e) => setApptJoiningDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Annual CTC (INR / USD)</label>
                    <input
                      type="number"
                      value={apptAnnualCtc}
                      onChange={(e) => setApptAnnualCtc(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reporting Manager</label>
                    <input
                      type="text"
                      value={apptReportingManager}
                      onChange={(e) => setApptReportingManager(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Probation Period (Months)</label>
                    <input
                      type="number"
                      value={apptProbationMonths}
                      onChange={(e) => setApptProbationMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Core Duties & Deliverables</label>
                  <textarea
                    rows={3}
                    value={apptDuties}
                    onChange={(e) => setApptDuties(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL SUB-FORM: 2. WORK AGREEMENT */}
            {formType === 'WORK_AGREEMENT' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Effective Start Date</label>
                    <input
                      type="date"
                      value={agrEffectiveDate}
                      onChange={(e) => setAgrEffectiveDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Completion / Target Date</label>
                    <input
                      type="date"
                      value={agrCompletionDate}
                      onChange={(e) => setAgrCompletionDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Comprehensive Scope of Work</label>
                  <textarea
                    rows={3}
                    value={agrScope}
                    onChange={(e) => setAgrScope(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Milestones & Phase Breakdown</label>
                  <textarea
                    rows={3}
                    value={agrMilestones}
                    onChange={(e) => setAgrMilestones(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Commercial Payment Terms</label>
                    <input
                      type="text"
                      value={agrPaymentTerms}
                      onChange={(e) => setAgrPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Legal Jurisdiction City</label>
                    <input
                      type="text"
                      value={agrJurisdiction}
                      onChange={(e) => setAgrJurisdiction(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL SUB-FORM: 3. INVOICE / 5. QUOTATION / 6. PROPOSAL (LINE ITEMS) */}
            {(formType === 'INVOICE' || formType === 'QUOTATION' || formType === 'PROPOSAL') && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Itemized Deliverables & Commercial Pricing</span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 items-center">
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          placeholder="Description / Service Deliverable"
                          value={item.description}
                          onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="text"
                          placeholder="HSN/SAC"
                          value={item.hsn_sac || ''}
                          onChange={(e) => handleUpdateLineItem(item.id, 'hsn_sac', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-400 font-mono"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.unit_price}
                          onChange={(e) => handleUpdateLineItem(item.id, 'unit_price', Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-emerald-400 font-mono"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tax Rate</span>
                      <select
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value={0}>0% (Tax Exempt)</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% Standard GST</option>
                        <option value={28}>28% Luxury GST</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Discount</span>
                      <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(Number(e.target.value))}
                        className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-slate-400 text-[11px]">Subtotal: {formatAmount(subtotal)}</div>
                    <div className="text-slate-400 text-[11px]">Tax ({taxRate}%): {formatAmount(taxAmount)}</div>
                    <div className="text-base font-black text-emerald-400 font-display">
                      Total: {formatAmount(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL SUB-FORM: 4. STATEMENT OF ACCOUNT / LEDGER */}
            {formType === 'LEDGER' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Date-wise Transaction Entries</span>
                  <button
                    type="button"
                    onClick={handleAddLedgerEntry}
                    className="flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Entry</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {ledgerTotals.entries.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-12 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 items-center text-xs">
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => {
                            setLedgerEntries(ledgerEntries.map(it => it.id === entry.id ? { ...it, date: e.target.value } : it));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-300 font-mono"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <select
                          value={entry.type}
                          onChange={(e) => {
                            setLedgerEntries(ledgerEntries.map(it => it.id === entry.id ? { ...it, type: e.target.value as any } : it));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-300 font-bold"
                        >
                          <option value="INVOICE">INVOICE</option>
                          <option value="PAYMENT">PAYMENT</option>
                          <option value="CREDIT_NOTE">CREDIT NOTE</option>
                          <option value="OPENING_BALANCE">OPENING BAL</option>
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Description / Particulars"
                          value={entry.description}
                          onChange={(e) => {
                            setLedgerEntries(ledgerEntries.map(it => it.id === entry.id ? { ...it, description: e.target.value } : it));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Debit (+)"
                          value={entry.debit}
                          onChange={(e) => {
                            setLedgerEntries(ledgerEntries.map(it => it.id === entry.id ? { ...it, debit: Number(e.target.value) } : it));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-rose-400 font-mono"
                          title="Debit (Amount Billed)"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-1">
                        <input
                          type="number"
                          placeholder="Credit (-)"
                          value={entry.credit}
                          onChange={(e) => {
                            setLedgerEntries(ledgerEntries.map(it => it.id === entry.id ? { ...it, credit: Number(e.target.value) } : it));
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-emerald-400 font-mono"
                          title="Credit (Payment Received)"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveLedgerEntry(entry.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ledger Summary */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Total Debits: {formatAmount(ledgerTotals.totalDebits)}</span>
                    <span className="text-slate-400 text-[11px] block">Total Credits: {formatAmount(ledgerTotals.totalCredits)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Closing Net Outstanding</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {formatAmount(ledgerTotals.netOutstanding)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setViewMode('LIST')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDocument}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-brand-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate & Preview Document</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: OFFICIAL DOCUMENT PREVIEW & STRICT CLEAN PRINT */}
      {/* ========================================================================= */}
      {viewMode === 'PREVIEW' && selectedDocument && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Control Bar (Hidden on Print) */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 print:hidden">
            <button
              onClick={() => setViewMode('LIST')}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareModalDoc(selectedDocument)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Team</span>
              </button>

              <button
                onClick={() => handleCopyLink(selectedDocument.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={handlePrintDocument}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>

          {/* PRINT NOTICE BANNER (Hidden on Print) */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl text-xs flex items-center justify-between print:hidden">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Strict Clean Print Guarantee: Clicking "Print / Download PDF" prints <strong>only</strong> the official legal document below. All admin panels, navigation, and buttons are automatically excluded.
            </span>
          </div>

          {/* THE OFFICIAL PRINTABLE DOCUMENT CONTAINER */}
          {/* id="printable-document" with standard letterhead styling */}
          <div
            id="printable-document"
            className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-12 space-y-8 border border-slate-200 font-sans print:p-0 print:border-none print:shadow-none"
          >
            {/* Document Letterhead Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center font-display">
                    V
                  </div>
                  <span className="font-extrabold text-xl tracking-wider uppercase font-display text-slate-900">
                    VELAMETRIC
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-bold">Velametric Business Solutions Pvt. Ltd.</p>
                  <p>Cyber City Tech Zone, Gurgaon / Rajpur Road, Dehradun</p>
                  <p>Email: legal@velametric.com | Web: www.velametric.com</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                  OFFICIAL BUSINESS RECORD
                </span>
                <div className="text-lg font-black font-mono text-slate-900">
                  {selectedDocument.documentNumber}
                </div>
                <div className="text-xs text-slate-500">
                  Date: {new Date(selectedDocument.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300 mt-1">
                  {DOCUMENT_TYPE_LABELS[selectedDocument.type].label}
                </span>
              </div>
            </div>

            {/* Document Subject Title */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight">
                {selectedDocument.title}
              </h1>
            </div>

            {/* Recipient / Client Party Information Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  ISSUED TO (CLIENT / RECIPIENT)
                </span>
                <p className="font-bold text-slate-900 text-sm">{selectedDocument.client.companyName}</p>
                {selectedDocument.client.contactName && (
                  <p className="text-slate-700 font-medium">Attn: {selectedDocument.client.contactName}</p>
                )}
                {selectedDocument.client.address && (
                  <p className="text-slate-600 mt-1">{selectedDocument.client.address}</p>
                )}
              </div>

              <div className="sm:text-right space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  COMMUNICATION & TAX DETAILS
                </span>
                <p className="text-slate-700">Email: {selectedDocument.client.email || 'N/A'}</p>
                <p className="text-slate-700">Phone: {selectedDocument.client.phone || 'N/A'}</p>
                {selectedDocument.client.taxGstin && (
                  <p className="text-slate-800 font-mono font-bold">Tax ID / GST: {selectedDocument.client.taxGstin}</p>
                )}
              </div>
            </div>

            {/* SPECIFIC VIEW RENDERER BASED ON DOCUMENT TYPE */}

            {/* 1. APPOINTMENT LETTER VIEW */}
            {selectedDocument.type === 'APPOINTMENT_LETTER' && selectedDocument.appointmentDetails && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  Dear <strong>{selectedDocument.appointmentDetails.employeeName}</strong>,
                </p>
                <p>
                  We are delighted to offer you the full-time position of <strong>{selectedDocument.appointmentDetails.designation}</strong> in the <strong>{selectedDocument.appointmentDetails.department}</strong> department at Velametric, effective from your joining date of <strong>{selectedDocument.appointmentDetails.joiningDate}</strong>.
                </p>

                <div className="border border-slate-200 rounded-xl overflow-hidden my-4">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 bg-slate-50 font-bold w-1/3">Annual Cost to Company (CTC)</td>
                        <td className="p-2.5 font-bold font-mono text-slate-900">{formatAmount(selectedDocument.appointmentDetails.annualCtc)}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-slate-50 font-bold">Monthly Fixed Compensation</td>
                        <td className="p-2.5 font-bold font-mono text-slate-900">{formatAmount(selectedDocument.appointmentDetails.monthlyFixed)}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-slate-50 font-bold">Reporting Manager</td>
                        <td className="p-2.5">{selectedDocument.appointmentDetails.reportingManager}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-slate-50 font-bold">Work Location</td>
                        <td className="p-2.5">{selectedDocument.appointmentDetails.workLocation}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-slate-50 font-bold">Probation Period</td>
                        <td className="p-2.5">{selectedDocument.appointmentDetails.probationMonths} Months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Key Duties & Responsibilities:</h4>
                  <p className="whitespace-pre-line text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedDocument.appointmentDetails.dutiesAndResponsibilities}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Benefits & Policies:</h4>
                  <p className="text-slate-600">
                    {selectedDocument.appointmentDetails.benefitsSummary}
                  </p>
                </div>
              </div>
            )}

            {/* 2. WORK AGREEMENT VIEW */}
            {selectedDocument.type === 'WORK_AGREEMENT' && selectedDocument.agreementDetails && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  This Professional Service Contract & Work Agreement is entered into between <strong>Velametric Business Solutions Pvt Ltd</strong> and <strong>{selectedDocument.client.companyName}</strong>, effective from <strong>{selectedDocument.agreementDetails.effectiveDate}</strong> until <strong>{selectedDocument.agreementDetails.completionDate}</strong>.
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs">1. Scope of Work & Deliverables</h4>
                    <p className="whitespace-pre-line text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1">
                      {selectedDocument.agreementDetails.scopeOfWork}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs">2. Execution Milestones & Delivery Schedule</h4>
                    <p className="whitespace-pre-line text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1">
                      {selectedDocument.agreementDetails.milestones}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs">3. Commercial Payment Terms</h4>
                    <p className="text-slate-600 mt-1">
                      {selectedDocument.agreementDetails.paymentTerms}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs">4. Intellectual Property & Transfer</h4>
                    <p className="text-slate-600 mt-1">
                      {selectedDocument.agreementDetails.intellectualPropertyClause}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs">5. Termination & Jurisdiction</h4>
                    <p className="text-slate-600 mt-1">
                      {selectedDocument.agreementDetails.terminationClause} This agreement shall be governed under the jurisdiction of courts in {selectedDocument.agreementDetails.jurisdictionCity}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAX INVOICE & 5. QUOTATION VIEW */}
            {(selectedDocument.type === 'INVOICE' || selectedDocument.type === 'QUOTATION') && selectedDocument.financialDetails && (
              <div className="space-y-6 text-xs">
                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Description of Services</th>
                        <th className="p-3">HSN/SAC</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Rate</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedDocument.financialDetails.lineItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-3 text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                          <td className="p-3 font-mono text-slate-600">{item.hsn_sac || '9983'}</td>
                          <td className="p-3 text-center font-mono">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">{formatAmount(item.unit_price)}</td>
                          <td className="p-3 text-right font-bold font-mono text-slate-900">{formatAmount(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Bank Payment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 space-y-1.5">
                    <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                      BANK PAYMENT SETTLEMENT DETAILS
                    </h4>
                    <p><strong>Bank Name:</strong> {selectedDocument.financialDetails.bankDetails.bankName}</p>
                    <p><strong>A/C No:</strong> <span className="font-mono font-bold">{selectedDocument.financialDetails.bankDetails.accountNumber}</span></p>
                    <p><strong>IFSC Code:</strong> <span className="font-mono font-bold">{selectedDocument.financialDetails.bankDetails.ifscCode}</span></p>
                    <p><strong>Beneficiary:</strong> {selectedDocument.financialDetails.bankDetails.accountHolder}</p>
                    {selectedDocument.financialDetails.bankDetails.upiId && (
                      <p><strong>UPI ID:</strong> <span className="font-mono">{selectedDocument.financialDetails.bankDetails.upiId}</span></p>
                    )}
                  </div>

                  <div className="space-y-2 text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">{formatAmount(selectedDocument.financialDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST / Tax ({selectedDocument.financialDetails.taxRate}%):</span>
                      <span className="font-mono">{formatAmount(selectedDocument.financialDetails.taxAmount)}</span>
                    </div>
                    {selectedDocument.financialDetails.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Commercial Discount:</span>
                        <span className="font-mono">-{formatAmount(selectedDocument.financialDetails.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                      <span>Total Invoice Amount:</span>
                      <span className="font-mono">{formatAmount(selectedDocument.financialDetails.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STATEMENT OF ACCOUNT / LEDGER VIEW */}
            {selectedDocument.type === 'LEDGER' && selectedDocument.ledgerDetails && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                  <span>Statement Period: <strong>{selectedDocument.ledgerDetails.statementPeriodStart}</strong> to <strong>{selectedDocument.ledgerDetails.statementPeriodEnd}</strong></span>
                  <span className="font-mono font-bold text-slate-900">Currency: INR</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Reference #</th>
                        <th className="p-2.5">Particulars / Description</th>
                        <th className="p-2.5 text-right">Debit (INR)</th>
                        <th className="p-2.5 text-right">Credit (INR)</th>
                        <th className="p-2.5 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {selectedDocument.ledgerDetails.entries.map((ent) => (
                        <tr key={ent.id}>
                          <td className="p-2.5 text-slate-600">{ent.date}</td>
                          <td className="p-2.5 font-bold text-slate-900">{ent.referenceNumber}</td>
                          <td className="p-2.5 font-sans text-slate-700">{ent.description}</td>
                          <td className="p-2.5 text-right text-rose-600 font-bold">{ent.debit ? formatAmount(ent.debit) : '-'}</td>
                          <td className="p-2.5 text-right text-emerald-600 font-bold">{ent.credit ? formatAmount(ent.credit) : '-'}</td>
                          <td className="p-2.5 text-right font-black text-slate-900">{formatAmount(ent.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-300 font-bold text-sm">
                  <span>NET OUTSTANDING CLOSING BALANCE:</span>
                  <span className="font-mono font-black text-lg text-slate-900">
                    {formatAmount(selectedDocument.ledgerDetails.netOutstanding)}
                  </span>
                </div>
              </div>
            )}

            {/* 6. PROPOSAL VIEW */}
            {selectedDocument.type === 'PROPOSAL' && selectedDocument.proposalDetails && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Executive Summary</h4>
                  <p className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedDocument.proposalDetails.executiveSummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Strategic Approach & Roadmap</h4>
                  <p className="text-slate-600">
                    {selectedDocument.proposalDetails.strategicApproach}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Commercial Investment Summary</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden my-2">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-2.5">Milestone Deliverable</th>
                          <th className="p-2.5 text-right">Investment Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedDocument.proposalDetails.commercialSchedule.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-semibold text-slate-900">{item.description}</td>
                            <td className="p-2.5 text-right font-mono font-bold">{formatAmount(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-right font-bold text-sm text-slate-900">
                    Total Proposed Investment: {formatAmount(selectedDocument.proposalDetails.totalInvestment)}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Acceptance & Validity Terms</h4>
                  <p className="text-slate-600">
                    {selectedDocument.proposalDetails.clientAcceptanceTerms} Proposal valid until {selectedDocument.proposalDetails.validUntil}.
                  </p>
                </div>
              </div>
            )}

            {/* Official Signatures & Seal Block */}
            <div className="pt-12 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-8">
                  FOR VELAMETRIC BUSINESS SOLUTIONS PVT. LTD.
                </span>
                <div className="border-t border-slate-400 pt-2 w-48">
                  <p className="font-bold text-slate-900">Authorized Signatory</p>
                  <p className="text-[11px] text-slate-500">Corporate & Legal Seal</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-8">
                  ACCEPTED & CONFIRMED BY (CLIENT)
                </span>
                <div className="border-t border-slate-400 pt-2 w-48 text-right">
                  <p className="font-bold text-slate-900">{selectedDocument.client.contactName || 'Authorized Client Signatory'}</p>
                  <p className="text-[11px] text-slate-500">{selectedDocument.client.companyName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMPLOYEE SHARING & TEAM HANDOVER MODAL */}
      {/* ========================================================================= */}
      {shareModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Share Document with Employee / Team</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{shareModalDoc.documentNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setShareModalDoc(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document summary pill */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Document Title</span>
              <div className="font-bold text-white truncate">{shareModalDoc.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Client: {shareModalDoc.client.companyName}</div>
            </div>

            {/* Employee Selection from Directory */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Select Team Member from IAM Directory:
                </label>
                <select
                  value={selectedEmployeeCode}
                  onChange={(e) => setSelectedEmployeeCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {Object.values(INITIAL_SETUP_AGENT_USERS).map((user) => (
                    <option key={user.user_code} value={user.user_code}>
                      {user.full_name} ({user.department} • {user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Permission Level */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Access & Action Permission:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'VIEW', label: 'Can View', desc: 'Read-only access' },
                    { id: 'EDIT', label: 'Can Edit', desc: 'Modify terms & lines' },
                    { id: 'APPROVE', label: 'Sign-off', desc: 'Needs approval' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPermission(p.id as SharingPermission)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedPermission === p.id
                          ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.label}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Internal Handover Instructions / Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please verify staging riders before dispatching to client."
                  value={shareNotes}
                  onChange={(e) => setShareNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleCopyLink(shareModalDoc.id)}
                className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccess ? 'Copied!' : 'Copy Direct Link'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShareModalDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmShareWithEmployee}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign & Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DocumentStudioAdmin;
