import React from 'react';
import { useLocation } from 'react-router-dom';

export const LegalPages: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Terms and Conditions';
  if (path.includes('privacy')) title = 'Privacy Policy';
  if (path.includes('payment')) title = 'Payment Terms & Billing Policy';

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">{title}</h1>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
        <p className="text-base text-slate-400">Effective Date: January 1, 2026</p>
        <h2 className="text-xl font-bold text-white">1. Introduction & Agreement</h2>
        <p>This document governs your access to and use of the Vela Enterprise platform, APIs, CRM software, and public services.</p>
        <h2 className="text-xl font-bold text-white">2. Data Security & RLS Compliance</h2>
        <p>All database records are protected by strict PostgreSQL Row Level Security (RLS) policies. Client data and financial records are accessible exclusively to authorized accounts.</p>
        <h2 className="text-xl font-bold text-white">3. Payment & Billing Terms</h2>
        <p>Invoices issued via the proposal engine are subject to strict payment schedules. Standard payment terms require 50% milestone deposit upon project commencement.</p>
      </div>
    </div>
  );
};
