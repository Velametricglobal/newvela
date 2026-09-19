import React, { useState } from 'react';
import { Lead, LeadStatus } from '../../types/database.types';
import { leadService } from '../../services/leadService';
import { X, User, Phone, Mail, Building2, AlertTriangle, CheckCircle2, Save, Sparkles, ExternalLink } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
  onSelectExisting?: (leadId: string) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSelectExisting
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company_name: '',
    service_interest: 'Website Development',
    package_name: 'Startup Website',
    source_name: 'Manual',
    status: 'NEW',
    priority: 'MEDIUM',
    assigned_name: 'Sales Manager',
    expected_value: 0,
    closing_date: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    website: '',
    notes: '',
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedDuplicate, setDetectedDuplicate] = useState<Lead | null>(null);

  if (!isOpen) return null;

  const handleCheckDuplicatesAndSave = async (force: boolean = false) => {
    if (!formData.first_name && !formData.company_name) {
      alert('Please enter a First Name or Company Name.');
      return;
    }
    if (formData.email && !formData.email.includes('@')) {
      alert('Please enter a valid Email Address.');
      return;
    }

    if (!force) {
      const dup = await leadService.checkDuplicateLead(formData.phone, formData.email, formData.whatsapp);
      if (dup) {
        setDetectedDuplicate(dup);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { lead } = await leadService.createLead(formData);
      onSuccess(lead);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <User className="w-3.5 h-3.5" /> CRM MANUAL LEAD ENTRY
            </div>
            <h3 className="text-xl font-bold text-white font-display">Add New Lead</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Lead Detection Warning */}
        {detectedDuplicate && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" /> Possible Duplicate Lead Detected!
            </div>
            <p className="text-xs text-slate-300">
              A lead with matching contact details already exists:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-amber-400 font-bold">{detectedDuplicate.lead_code} • {detectedDuplicate.first_name} {detectedDuplicate.last_name}</div>
              <div className="text-slate-400">Company: {detectedDuplicate.company_name || 'N/A'}</div>
              <div className="text-slate-400">Phone: {detectedDuplicate.phone} | Email: {detectedDuplicate.email}</div>
              <div className="text-emerald-400">Status: {detectedDuplicate.status}</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  if (onSelectExisting) onSelectExisting(detectedDuplicate.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5"
              >
                View Existing Lead <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCheckDuplicatesAndSave(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs shadow-lg"
              >
                Create Lead Anyway
              </button>
            </div>
          </div>
        )}

        {/* Lead Entry Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleCheckDuplicatesAndSave(false); }} className="space-y-6 text-xs">
          
          {/* 1. BASIC INFO */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider border-b border-slate-800/80 pb-1">
              1. Basic Contact Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Company / Organization Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Enterprises Ltd."
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. LEAD & SERVICE INFO */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider border-b border-slate-800/80 pb-1">
              2. Service Interest & Pipeline Parameters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Service Interested In</label>
                <select
                  value={formData.service_interest}
                  onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="Website Development">Website Development</option>
                  <option value="Web Applications">Web Applications</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Offline Marketing">Offline Marketing</option>
                  <option value="Branding & Graphics">Branding & Graphics</option>
                  <option value="Video Production">Video Production</option>
                  <option value="Media & PR">Media & PR</option>
                  <option value="Government Subsidy Loans">Government Subsidy Loans</option>
                  <option value="Business Loans & CC">Business Loans & CC</option>
                  <option value="Personal Loans">Personal Loans</option>
                  <option value="Home Loans">Home Loans</option>
                  <option value="Event Management">Event Management</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Lead Source</label>
                <select
                  value={formData.source_name}
                  onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="Manual">Manual Entry</option>
                  <option value="Website">Website Form</option>
                  <option value="WhatsApp">WhatsApp Inbound</option>
                  <option value="Phone">Phone Call</option>
                  <option value="Facebook">Facebook Ads</option>
                  <option value="Instagram">Instagram Ads</option>
                  <option value="Google">Google Search</option>
                  <option value="Referral">Client Referral</option>
                  <option value="Event">Event Registration</option>
                  <option value="CSV Import">CSV Import</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Lead Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="MEETING">MEETING</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Assigned Salesperson</label>
                <input
                  type="text"
                  value={formData.assigned_name}
                  onChange={(e) => setFormData({ ...formData, assigned_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Expected Deal Value (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.expected_value || ''}
                  onChange={(e) => setFormData({ ...formData, expected_value: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 3. ADDITIONAL DETAILS */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider border-b border-slate-800/80 pb-1">
              3. Location & Additional Notes
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">State</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Website</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Internal Sales Notes</label>
              <textarea
                rows={2}
                placeholder="Initial requirement summary, budget expectations, or follow-up notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Lead Entry
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
