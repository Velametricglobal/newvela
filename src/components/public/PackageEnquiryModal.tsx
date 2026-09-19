import React, { useState } from 'react';
import { ServicePackage, Service } from '../../types/database.types';
import { leadService } from '../../services/leadService';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Send, CheckCircle2, ShieldCheck, Sparkles, Building2, Phone, Mail, User, FileText } from 'lucide-react';

interface PackageEnquiryModalProps {
  service: Service;
  packageItem: ServicePackage;
  isOpen: boolean;
  onClose: () => void;
}

export const PackageEnquiryModal: React.FC<PackageEnquiryModalProps> = ({
  service,
  packageItem,
  isOpen,
  onClose
}) => {
  const { formatAmount, activeConfig } = useCurrency();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    budget_range: packageItem.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : formatAmount(packageItem.price),
    message: '',
    preferred_contact: 'WHATSAPP'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnqId, setSubmittedEnqId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await leadService.createLead({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company_name,
        service_interest: `${service.name} — ${packageItem.name} (${packageItem.tier})`,
        budget_range: formData.budget_range,
        message: `[Package Enquiry - ${packageItem.tier}]\nRequirement: ${formData.message}\nPreferred Contact: ${formData.preferred_contact}`,
        source_name: 'Website Package System'
      });

      setSubmittedEnqId(result.enqId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedEnqId ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">Inquiry & Quotation Request Submitted!</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Your inquiry reference number is <span className="font-mono font-bold text-amber-400">{submittedEnqId}</span>. A senior account strategist from Velametric will contact you via {formData.preferred_contact.toLowerCase()} shortly.
            </p>
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-left text-xs space-y-1 font-mono">
              <div className="text-zinc-400"><span className="text-zinc-500">Service:</span> {service.name}</div>
              <div className="text-zinc-400"><span className="text-zinc-500">Package:</span> {packageItem.name} ({packageItem.tier})</div>
              <div className="text-zinc-400"><span className="text-zinc-500">Pricing:</span> {packageItem.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : formatAmount(packageItem.price)}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all"
            >
              Done / Return to Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                {packageItem.tier} PACKAGE ENQUIRY
              </span>
              <h3 className="text-2xl font-bold text-white mt-2 font-display">{packageItem.name}</h3>
              <div className="text-xs text-zinc-400 mt-1">
                {service.name} • <span className="font-bold text-amber-400">{packageItem.price_display_type === 'CUSTOM_QUOTE' ? 'Contact Us for a Quotation' : `${formatAmount(packageItem.price)} starting`}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">First Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="vikram@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phone Number / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Company / Organization Name</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="e.g. Velametric Enterprises Ltd."
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Requirement Notes & Scope Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe your project goals, location, or specific features required..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Confidential & Direct Sales CRM Routing
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting Inquiry...' : packageItem.tier === 'ORGANIZATION' ? 'Request a Quotation' : 'Get Started'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
