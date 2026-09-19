import React, { useEffect, useState } from 'react';
import { Proposal, Invoice, Payment } from '../../types/database.types';
import { proposalInvoiceService } from '../../services/proposalInvoiceService';
import { FileSpreadsheet, CreditCard, DollarSign, Plus, CheckCircle2 } from 'lucide-react';

import { CurrencySelector } from '../../components/common/CurrencySelector';
import { useCurrency } from '../../context/CurrencyContext';

export const ProposalsInvoices: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    proposalInvoiceService.getProposals().then(setProposals);
    proposalInvoiceService.getInvoices().then(setInvoices);
    proposalInvoiceService.getPayments().then(setPayments);
  }, []);

  const handleRecordPayment = async (inv: Invoice) => {
    await proposalInvoiceService.recordPayment(inv.id, inv.total - inv.amount_paid, 'Wire Transfer');
    proposalInvoiceService.getInvoices().then(setInvoices);
    proposalInvoiceService.getPayments().then(setPayments);
  };

  return (
    <div className="space-y-8">
      {/* Financial & Billing Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Proposals, Billing Invoices & Payments</h2>
          <p className="text-slate-400 text-xs mt-1">Manage client proposals, itemized billing invoices, and financial receivables.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Billing Currency:</span>
          <CurrencySelector compact />
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-brand-400" /> Active Proposals
          </h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase">
            <tr>
              <th className="p-3">Proposal #</th>
              <th className="p-3">Client</th>
              <th className="p-3">Title</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {proposals.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-white">{p.proposal_number}</td>
                <td className="p-3 text-slate-300">{p.client_name}</td>
                <td className="p-3 text-slate-300">{p.title}</td>
                <td className="p-3 font-bold text-brand-400">{formatAmount(p.total)}</td>
                <td className="p-3 font-semibold text-amber-400">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoices & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" /> Invoices
          </h3>
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">{inv.invoice_number} — {inv.client_name}</div>
                  <div className="text-[11px] text-slate-400">Total: {formatAmount(inv.total)} (Paid: {formatAmount(inv.amount_paid)})</div>
                </div>
                {inv.status !== 'PAID' ? (
                  <button
                    onClick={() => handleRecordPayment(inv)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Mark Paid
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-400" /> Recent Payment Ledger
          </h3>
          <div className="space-y-3">
            {payments.map(pmt => (
              <div key={pmt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">{pmt.client_name}</div>
                  <div className="text-[10px] text-slate-400">{pmt.payment_method} • Ref: {pmt.transaction_reference}</div>
                </div>
                <div className="text-xs font-bold text-emerald-400">+{formatAmount(pmt.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
