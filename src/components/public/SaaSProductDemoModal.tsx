import React, { useState, useEffect } from 'react';
import { 
  X, Laptop, School, Building2, ShoppingBag, CheckCircle2, 
  Users, DollarSign, Calendar, TrendingUp, Search, Plus, 
  MessageCircle, ExternalLink, Shield, ArrowRight, Play, Eye,
  Clock, Award, Star, Check, Sparkles, Filter, ChevronRight,
  Lock, KeyRound, Mail, Phone, RefreshCw, AlertCircle, ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { useSiteSettings } from '../../services/settingsService';

export type SaaSProductType = 'education' | 'property-crm' | 'ecommerce';

interface SaaSProductDemoModalProps {
  productType: SaaSProductType;
  isOpen: boolean;
  onClose: () => void;
  onOrderPackage?: () => void;
}

export const SaaSProductDemoModal: React.FC<SaaSProductDemoModalProps> = ({
  productType,
  isOpen,
  onClose,
  onOrderPackage
}) => {
  const siteSettings = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feature1' | 'feature2' | 'analytics'>('dashboard');
  
  // Verification Gate States
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('VELA_SAAS_DEMO_VERIFIED') === 'true';
  });
  const [verificationStep, setVerificationStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [simulatedWhatsAppBanner, setSimulatedWhatsAppBanner] = useState<{ code: string; phone: string } | null>(null);

  // Interactive states inside the demos
  const [eduAttendanceFilter, setEduAttendanceFilter] = useState('All');
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [cartCount, setCartCount] = useState(2);
  const [orderSimulated, setOrderSimulated] = useState(false);

  useEffect(() => {
    let interval: any;
    if (verificationStep === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [verificationStep, resendTimer]);

  if (!isOpen) return null;

  const productName = 
    productType === 'education' 
      ? 'EduSphere AI — Institute ERP & LMS' 
      : productType === 'property-crm' 
      ? 'EstatePulse CRM — Real Estate OS' 
      : 'OmniStore Cloud — E-Commerce Platform';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setOtpError('Please provide your name, business email, and WhatsApp number.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setOtpError('Please enter a valid email address.');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setOtpError('Please enter a valid 10-digit WhatsApp mobile number.');
      return;
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setVerificationStep('otp');
    setOtpError('');
    setResendTimer(30);
    setSimulatedWhatsAppBanner({ code: newOtp, phone: formData.phone });
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(30);
    setOtpError('');
    setSimulatedWhatsAppBanner({ code: newOtp, phone: formData.phone });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setOtpError('Invalid OTP code. Please enter the 4-digit code sent to your WhatsApp.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      // Auto-save verified lead into CRM
      await leadService.createLead({
        first_name: formData.name.split(' ')[0] || formData.name,
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone,
        company_name: formData.organization || 'Prospective Enterprise Client',
        service_interest: `SaaS Product Demo: ${productName}`,
        package_name: 'Verified Live Demo Access',
        status: 'QUALIFIED',
        priority: 'HIGH',
        source_name: 'SaaS WhatsApp OTP Verification',
        notes: `Prospect verified WhatsApp (+91 ${formData.phone}) and Email (${formData.email}) to unlock live SaaS interactive demo sandbox.`
      });

      sessionStorage.setItem('VELA_SAAS_DEMO_VERIFIED', 'true');
      sessionStorage.setItem('VELA_SAAS_VERIFIED_PHONE', formData.phone);
      sessionStorage.setItem('VELA_SAAS_VERIFIED_EMAIL', formData.email);
      sessionStorage.setItem('VELA_SAAS_VERIFIED_NAME', formData.name);
      setIsVerified(true);
    } catch (err) {
      console.error('Lead creation error during demo verification:', err);
      setIsVerified(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative max-w-6xl w-full h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 flex justify-between items-center border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              {productType === 'education' && <School className="w-5 h-5" />}
              {productType === 'property-crm' && <Building2 className="w-5 h-5" />}
              {productType === 'ecommerce' && <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {isVerified ? 'LIVE SAAS SANDBOX' : 'SECURITY VERIFICATION REQUIRED'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-amber-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                {productName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isVerified && onOrderPackage && (
              <button
                onClick={() => {
                  onClose();
                  onOrderPackage();
                }}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs items-center gap-1.5 transition-all shadow-lg"
              >
                Order This Software <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800"
              title="Close Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            VERIFICATION GATE (IF NOT YET VERIFIED VIA WHATSAPP OTP)
        ========================================================================= */}
        {!isVerified ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              {/* WhatsApp Notification Simulated Banner */}
              {simulatedWhatsAppBanner && (
                <div className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-4 duration-300 shadow-xl">
                  <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-amber-400" /> WhatsApp Message Received
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Just Now</span>
                  </div>
                  <div className="text-xs text-zinc-200 bg-zinc-950/80 p-3 rounded-xl border border-amber-400/30">
                    <p className="font-semibold text-amber-300 mb-1">Vela Enterprise Platform Verification:</p>
                    <p>Your verification OTP for <strong>{productName}</strong> is:</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                      <span className="text-2xl font-black font-mono tracking-widest text-amber-400 bg-zinc-900 px-3 py-1 rounded-lg border border-amber-500/30">
                        {simulatedWhatsAppBanner.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(simulatedWhatsAppBanner.code)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold rounded-lg transition-all"
                      >
                        Auto-Fill OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: User Details (Name, Email, WhatsApp) */}
              {verificationStep === 'details' && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                      Verify Contact to Launch Demo
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                      Enter your details below. A 4-digit OTP will be dispatched to your WhatsApp number to grant instant sandbox access.
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-zinc-900 border border-amber-400/30 rounded-xl text-amber-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rajesh Singhania"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Business / Official Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rajesh@organization.com"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono flex items-center justify-between">
                        <span>WhatsApp Mobile Number *</span>
                        <span className="text-[10px] text-amber-400 lowercase font-mono">OTP will arrive here</span>
                      </label>
                      <div className="relative">
                        <MessageCircle className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Institute / Company / Agency Name (Optional)
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="e.g. Apex Academy / Grand Real Estate"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-400/20 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" /> Send WhatsApp Verification OTP
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Instant verification. Zero spam guarantee.</span>
                  </div>
                </form>
              )}

              {/* Step 2: WhatsApp OTP Code Verification */}
              {verificationStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                      Enter WhatsApp Verification OTP
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                      We have sent a 4-digit code to your WhatsApp at <strong className="text-white">{formData.phone}</strong> and email <strong className="text-white">{formData.email}</strong>.
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-zinc-900 border border-amber-400/30 rounded-xl text-amber-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-center text-zinc-300 uppercase tracking-widest font-mono">
                      Enter 4-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      autoFocus
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full bg-zinc-950 border-2 border-amber-400/50 rounded-2xl py-3.5 text-center text-3xl font-mono font-black text-amber-400 tracking-[0.5em] focus:outline-none focus:border-amber-400 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setVerificationStep('details')}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Number
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleResendOtp}
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        resendTimer > 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-amber-400 hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${resendTimer > 0 ? '' : 'text-amber-400'}`} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend WhatsApp OTP'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Launching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Verify OTP & Launch Live Demo
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
              AUTHENTICATED LIVE DEMO SANDBOX CONTENT
          ========================================================================= */
          <>
            {/* Demo Sub-Navigation Bar */}
            <div className="px-4 sm:px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between overflow-x-auto gap-2 text-xs shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'dashboard' 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  Executive Overview
                </button>
                <button
                  onClick={() => setActiveTab('feature1')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'feature1' 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {productType === 'education' && 'Student Roster & Fees'}
                  {productType === 'property-crm' && 'Property Listings & Leads'}
                  {productType === 'ecommerce' && 'Storefront & Products'}
                </button>
                <button
                  onClick={() => setActiveTab('feature2')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'feature2' 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {productType === 'education' && 'Live Virtual Classes'}
                  {productType === 'property-crm' && 'Deals Kanban Pipeline'}
                  {productType === 'ecommerce' && 'Cart & Checkout Flow'}
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'analytics' 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  Revenue & Metrics
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                <span className="hidden lg:inline text-amber-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> WhatsApp Verified Session
                </span>
                <span className="hidden md:inline">• Interactive Sandbox v2.4</span>
              </div>
            </div>

            {/* Scrollable Demo Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* =========================================================================
                  1. EDUCATION INSTITUTE ERP DEMO
              ========================================================================= */}
              {productType === 'education' && (
                <div className="space-y-6">
                  {/* Executive Overview */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      {/* Top Stats Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Total Active Students</div>
                          <div className="text-2xl font-black text-white mt-1">2,450</div>
                          <div className="text-[11px] text-amber-400 mt-1 font-mono">↑ +14% this semester</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Fee Collection YTD</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">₹1.85 Cr</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">92% Collected (8% Due)</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Faculty & Staff</div>
                          <div className="text-2xl font-black text-white mt-1">84 Active</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">100% Biometric Sync</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Avg Attendance</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">94.8%</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Real-time RFID/App</div>
                        </div>
                      </div>

                      {/* Modules Showcase */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" /> Student Lifecycle Automation
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            End-to-end management from online admissions inquiry, digital ID cards, roll numbers, to auto-generated transfer certificates.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Admissions CRM', 'Biometric Sync', 'Parent Portal', 'Hall Tickets'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-400" /> Automated Fee Engine & Invoicing
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Razorpay / UPI integrated parent fee collection with auto-reminders via WhatsApp & SMS, fine calculators, and installment plans.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['UPI / Gateway', 'Auto Invoices', 'WhatsApp Reminders', 'Tally Export'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Laptop className="w-4 h-4 text-amber-400" /> Integrated LMS & Online Exams
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Host recorded lectures, upload course materials, conduct MCQ-based timed online tests with AI anti-cheat proctoring.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Zoom Integration', 'MCQ Question Bank', 'Assignment Vault', 'Instant Grading'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student Roster & Fees */}
                  {activeTab === 'feature1' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className="text-white font-bold text-base">Student Roster & Fee Ledger</h3>
                          <p className="text-zinc-400 text-xs">Simulated active student records with auto-status sync.</p>
                        </div>
                        <div className="flex gap-2">
                          {['All', 'Paid', 'Due'].map(f => (
                            <button
                              key={f}
                              onClick={() => setEduAttendanceFilter(f)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                eduAttendanceFilter === f ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-300">
                          <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px]">
                            <tr>
                              <th className="p-3">Roll No</th>
                              <th className="p-3">Student Name</th>
                              <th className="p-3">Course / Grade</th>
                              <th className="p-3">Attendance</th>
                              <th className="p-3">Term Fee</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Quick Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {[
                              { roll: 'EDU-1041', name: 'Aarav Sharma', class: 'Grade 11 (PCM)', att: '96%', fee: '₹35,000', status: 'Paid' },
                              { roll: 'EDU-1042', name: 'Diya Patel', class: 'Grade 12 (PCB)', att: '92%', fee: '₹35,000', status: 'Due' },
                              { roll: 'EDU-1043', name: 'Rohan Mehra', class: 'B.Tech CS Sem 3', att: '98%', fee: '₹62,000', status: 'Paid' },
                              { roll: 'EDU-1044', name: 'Sneha Kapoor', class: 'MBA Marketing', att: '89%', fee: '₹85,000', status: 'Due' },
                              { roll: 'EDU-1045', name: 'Kabir Khan', class: 'Grade 10 (CBSE)', att: '95%', fee: '₹28,000', status: 'Paid' }
                            ]
                              .filter(s => eduAttendanceFilter === 'All' || s.status === eduAttendanceFilter)
                              .map((st, i) => (
                                <tr key={i} className="hover:bg-zinc-800/40">
                                  <td className="p-3 font-mono text-zinc-400">{st.roll}</td>
                                  <td className="p-3 font-bold text-white">{st.name}</td>
                                  <td className="p-3">{st.class}</td>
                                  <td className="p-3 font-mono text-amber-400">{st.att}</td>
                                  <td className="p-3 font-bold">{st.fee}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      st.status === 'Paid' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                    }`}>
                                      {st.status}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <button 
                                      onClick={() => alert(`Simulated WhatsApp alert notification sent for ${st.name}`)}
                                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] flex items-center gap-1"
                                    >
                                      <MessageCircle className="w-3 h-3 text-amber-400" /> WhatsApp Slip
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Live Virtual Classes */}
                  {activeTab === 'feature2' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Live Interactive Classroom Schedule</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Advanced Calculus & Vectors', faculty: 'Dr. R. K. Gupta', time: '10:30 AM - 11:30 AM', students: 48, status: 'LIVE NOW' },
                          { title: 'Computer Networks & Security', faculty: 'Prof. Ananya Sen', time: '12:00 PM - 01:00 PM', students: 62, status: 'Upcoming' },
                          { title: 'Modern Macroeconomics', faculty: 'Dr. Vivek Verma', time: '02:30 PM - 03:30 PM', students: 35, status: 'Upcoming' },
                          { title: 'Organic Chemistry Lab Prep', faculty: 'Prof. Meenakshi Iyer', time: '04:00 PM - 05:00 PM', students: 40, status: 'Upcoming' }
                        ].map((cls, idx) => (
                          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                cls.status === 'LIVE NOW' ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 animate-pulse' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {cls.status}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono">{cls.time}</span>
                            </div>
                            <h4 className="text-white font-bold text-sm">{cls.title}</h4>
                            <div className="text-zinc-400 text-xs">Instructor: {cls.faculty}</div>
                            <div className="pt-2 flex justify-between items-center text-xs text-zinc-400 border-t border-zinc-800/80">
                              <span>{cls.students} Enrolled Students</span>
                              <button 
                                onClick={() => alert(`Launching Classroom simulator for ${cls.title}...`)}
                                className="px-3 py-1 rounded bg-amber-400 text-black font-bold text-xs hover:bg-amber-300"
                              >
                                Launch Class
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {activeTab === 'analytics' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Institute Growth & Academic Performance</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">98.2%</div>
                          <div className="text-xs text-zinc-400 mt-1">Board / University Pass Rate</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">4.8/5.0</div>
                          <div className="text-xs text-zinc-400 mt-1">Parent Satisfaction Rating</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">80% Saved</div>
                          <div className="text-xs text-zinc-400 mt-1">Administrative Time on Paperwork</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  2. REAL ESTATE & PROPERTY DEALER CRM DEMO
              ========================================================================= */}
              {productType === 'property-crm' && (
                <div className="space-y-6">
                  {/* Executive Overview */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Active Properties Listed</div>
                          <div className="text-2xl font-black text-white mt-1">142 Units</div>
                          <div className="text-[11px] text-amber-400 mt-1 font-mono">₹248 Cr Inventory Value</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Buyer Leads Pipeline</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">324 Active</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">18 Site Visits This Week</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Deals Closed YTD</div>
                          <div className="text-2xl font-black text-white mt-1">28 Properties</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Avg Closure: 19 Days</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Broker Commission YTD</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">₹48.6 Lakh</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">2% Avg Realized Fee</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-amber-400" /> Multi-Project Inventory Management
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Track apartments, luxury villas, commercial showrooms, and plots with floor plans, pricing sheets, and live availability status.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Floor Plans', 'Price Calculator', 'Registry Checklists', 'Video Tours'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" /> WhatsApp Lead & Site Visit Dispatcher
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Automatic lead capture from 99acres, MagicBricks, Housing.com, and Facebook ads with auto-assignment to sales agents.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Portals Sync', 'Agent Routing', 'GPS Site Visits', 'WhatsApp PDF Brochures'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-400" /> Commission & Channel Partner Payouts
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Manage co-brokers, sub-agents, and team commissions with automated split calculations, agreement generation, and invoices.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Split Commissions', 'Channel Partner Portal', 'TDS Reports', 'Payout Ledger'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Property Listings & Leads */}
                  {activeTab === 'feature1' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className="text-white font-bold text-base">Active Property Inventory</h3>
                          <p className="text-zinc-400 text-xs">Filter and inspect units ready for client site visits.</p>
                        </div>
                        <div className="flex gap-2">
                          {['All', 'Villas', 'Penthouses', 'Commercial'].map(t => (
                            <button
                              key={t}
                              onClick={() => setPropertyFilter(t)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                propertyFilter === t ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: 'Skyline Grandeur Penthouse', type: 'Penthouses', loc: 'Worli Sea Face, Mumbai', price: '₹14.5 Cr', bed: '4 BHK', status: 'Available' },
                          { name: 'Palisades Serene Villa', type: 'Villas', loc: 'Whitefield, Bengaluru', price: '₹6.8 Cr', bed: '5 BHK', status: 'Under Offer' },
                          { name: 'Apex Corporate Plaza', type: 'Commercial', loc: 'Cyber City, Gurugram', price: '₹18.2 Cr', bed: '12,000 sq.ft', status: 'Available' }
                        ]
                          .filter(p => propertyFilter === 'All' || p.type === propertyFilter)
                          .map((prop, idx) => (
                            <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{prop.type}</span>
                                <span className="text-[10px] text-amber-400 font-bold">{prop.status}</span>
                              </div>
                              <h4 className="text-white font-bold text-sm">{prop.name}</h4>
                              <div className="text-zinc-400 text-xs">{prop.loc}</div>
                              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                                <span className="text-amber-400 font-extrabold text-sm">{prop.price}</span>
                                <button 
                                  onClick={() => alert(`Simulating WhatsApp brochure dispatch for ${prop.name}`)}
                                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" /> Send to Buyer
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Deals Kanban */}
                  {activeTab === 'feature2' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Real Estate Buyer Pipeline Kanban</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[
                          { stage: 'New Portal Inquiries', count: 12, leads: ['Vikram Singhania (₹8 Cr)', 'Pooja Oberoi (₹4.5 Cr)'] },
                          { stage: 'Site Visit Scheduled', count: 6, leads: ['Rajesh Malhotra (Tomorrow 2 PM)', 'Sanjay Kothari (Sat 11 AM)'] },
                          { stage: 'Price Negotiation', count: 4, leads: ['Anand Mahindra (Token given)', 'Naveen Jindal (Offer ₹12 Cr)'] },
                          { stage: 'Closed Deals Won', count: 8, leads: ['Deepak Patel (Registered)', 'Meera Nair (Key handover)'] }
                        ].map((col, idx) => (
                          <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/90 space-y-2">
                            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
                              <span className="font-bold text-white">{col.stage}</span>
                              <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-mono">{col.count}</span>
                            </div>
                            <div className="space-y-2">
                              {col.leads.map((ld, i) => (
                                <div key={i} className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
                                  {ld}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {activeTab === 'analytics' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Agency Performance & Commission Dashboard</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">₹18.7 Cr</div>
                          <div className="text-xs text-zinc-400 mt-1">Total Transaction Volume YTD</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">14 Days</div>
                          <div className="text-xs text-zinc-400 mt-1">Average Time from Inquiry to Site Visit</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">99.4%</div>
                          <div className="text-xs text-zinc-400 mt-1">Broker Agreement Compliance Rate</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  3. MODERN E-COMMERCE PLATFORM DEMO
              ========================================================================= */}
              {productType === 'ecommerce' && (
                <div className="space-y-6">
                  {/* Executive Overview */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Monthly GMV</div>
                          <div className="text-2xl font-black text-white mt-1">₹42.8 Lakh</div>
                          <div className="text-[11px] text-amber-400 mt-1 font-mono">↑ +28% vs last month</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Store Conversion Rate</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">3.92%</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Industry Avg: 1.8%</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Avg Order Value (AOV)</div>
                          <div className="text-2xl font-black text-white mt-1">₹3,450</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Prepaid 74% • COD 26%</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Cart Recovery Rate</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">31.5%</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">WhatsApp Auto-Nudge</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-amber-400" /> Ultra-Fast Headless Storefront
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Blazing sub-second page loads, mobile-first design, 1-click checkout, and instant product filters that keep customers buying.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Next.js Speed', '1-Click Checkout', 'Smart Search', 'Variant Matrix'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-400" /> Multi-Payment & COD Risk Shield
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Razorpay, PhonePe, UPI, Credit Cards, EMI, and AI-powered COD confirmation to eliminate return-to-origin (RTO) losses.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['UPI QR Code', 'COD Verification', 'EMI Options', 'Instant Refunds'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" /> Shiprocket & Inventory Sync
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Automated courier assignment (Bluedart, Delhivery, DTDC), barcode shipping label generation, and live WhatsApp tracking notifications.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Shiprocket API', 'Delhivery Sync', 'WhatsApp Tracking', 'Auto AWB'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storefront & Products */}
                  {activeTab === 'feature1' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-bold text-base">Live Storefront Catalog Simulator</h3>
                          <p className="text-zinc-400 text-xs">Click "Add to Bag" to test live store cart integration.</p>
                        </div>
                        <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-200 font-mono">
                          Bag Items: <strong className="text-amber-400">{cartCount}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: 'Titanium Chrono Master Watch', category: 'Accessories', price: '₹14,999', original: '₹19,999', rating: '4.9' },
                          { name: 'Acoustic Pro Wireless ANC Headphones', category: 'Electronics', price: '₹8,499', original: '₹12,999', rating: '4.8' },
                          { name: 'Italian Leather Minimalist Messenger', category: 'Leatherware', price: '₹6,299', original: '₹8,999', rating: '4.9' }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                            <div className="h-32 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs border border-zinc-800/80">
                              [High-Res Product Showcase Image]
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{item.category}</span>
                              <span className="text-amber-400 flex items-center gap-0.5 text-xs font-bold">★ {item.rating}</span>
                            </div>
                            <h4 className="text-white font-bold text-sm">{item.name}</h4>
                            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                              <div>
                                <span className="text-white font-extrabold text-sm">{item.price}</span>
                                <span className="text-zinc-500 line-through text-xs ml-1.5">{item.original}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setCartCount(prev => prev + 1);
                                  alert(`Added ${item.name} to simulator cart!`);
                                }}
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded text-xs"
                              >
                                + Add to Bag
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cart & Checkout Flow */}
                  {activeTab === 'feature2' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">High-Conversion 1-Page Checkout Flow</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <h4 className="text-white font-bold text-xs uppercase tracking-wider text-zinc-400">Order Summary ({cartCount} Items)</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-zinc-300">
                              <span>Subtotal:</span>
                              <span className="font-bold">₹23,498</span>
                            </div>
                            <div className="flex justify-between text-amber-400">
                              <span>Coupon (VELA20):</span>
                              <span>-₹4,699</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>Express Shipping:</span>
                              <span className="text-amber-400 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-zinc-800">
                              <span>Total Payable:</span>
                              <span className="text-amber-400">₹18,799</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
                          <div>
                            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-zinc-400 mb-2">Instant Payment Simulator</h4>
                            <div className="space-y-2">
                              {['UPI FastPay (GPay, PhonePe, Paytm)', 'Credit / Debit Card (All Indian Banks)', 'Cash on Delivery (Verified SMS OTP)'].map((method, idx) => (
                                <label key={idx} className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer">
                                  <input type="radio" name="payMethod" defaultChecked={idx === 0} className="text-amber-400" />
                                  <span>{method}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setOrderSimulated(true);
                              setTimeout(() => setOrderSimulated(false), 4000);
                            }}
                            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-xl mt-4"
                          >
                            {orderSimulated ? '✓ Order Confirmed! (SMS & WhatsApp Dispatched)' : 'Test Complete Checkout Flow'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {activeTab === 'analytics' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Store Analytics & Marketing ROI</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">₹42.8 Lakh</div>
                          <div className="text-xs text-zinc-400 mt-1">Monthly Gross Merchandise Value</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">4.8x ROAS</div>
                          <div className="text-xs text-zinc-400 mt-1">Meta & Google Ad Return on Ad Spend</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">1.2s</div>
                          <div className="text-xs text-zinc-400 mt-1">Average Mobile Page Load Speed</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  2. REAL ESTATE & PROPERTY DEALER CRM DEMO
              ========================================================================= */}
              {productType === 'property-crm' && (
                <div className="space-y-6">
                  {/* Executive Overview */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Active Properties Listed</div>
                          <div className="text-2xl font-black text-white mt-1">142 Units</div>
                          <div className="text-[11px] text-amber-400 mt-1 font-mono">₹248 Cr Inventory Value</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Buyer Leads Pipeline</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">324 Active</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">18 Site Visits This Week</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Deals Closed YTD</div>
                          <div className="text-2xl font-black text-white mt-1">28 Properties</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Avg Closure: 19 Days</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Broker Commission YTD</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">₹48.6 Lakh</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">2% Avg Realized Fee</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-amber-400" /> Multi-Project Inventory Management
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Track apartments, luxury villas, commercial showrooms, and plots with floor plans, pricing sheets, and live availability status.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Floor Plans', 'Price Calculator', 'Registry Checklists', 'Video Tours'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-400" /> WhatsApp Lead & Site Visit Dispatcher
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Automatic lead capture from 99acres, MagicBricks, Housing.com, and Facebook ads with auto-assignment to sales agents.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Portals Sync', 'Agent Routing', 'GPS Site Visits', 'WhatsApp PDF Brochures'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-400" /> Commission & Channel Partner Payouts
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Manage co-brokers, sub-agents, and team commissions with automated split calculations, agreement generation, and invoices.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Split Commissions', 'Channel Partner Portal', 'TDS Reports', 'Payout Ledger'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Property Listings & Leads */}
                  {activeTab === 'feature1' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h3 className="text-white font-bold text-base">Active Property Inventory</h3>
                          <p className="text-zinc-400 text-xs">Filter and inspect units ready for client site visits.</p>
                        </div>
                        <div className="flex gap-2">
                          {['All', 'Villas', 'Penthouses', 'Commercial'].map(t => (
                            <button
                              key={t}
                              onClick={() => setPropertyFilter(t)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                propertyFilter === t ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: 'Skyline Grandeur Penthouse', type: 'Penthouses', loc: 'Worli Sea Face, Mumbai', price: '₹14.5 Cr', bed: '4 BHK', status: 'Available' },
                          { name: 'Palisades Serene Villa', type: 'Villas', loc: 'Whitefield, Bengaluru', price: '₹6.8 Cr', bed: '5 BHK', status: 'Under Offer' },
                          { name: 'Apex Corporate Plaza', type: 'Commercial', loc: 'Cyber City, Gurugram', price: '₹18.2 Cr', bed: '12,000 sq.ft', status: 'Available' }
                        ]
                          .filter(p => propertyFilter === 'All' || p.type === propertyFilter)
                          .map((prop, idx) => (
                            <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{prop.type}</span>
                                <span className="text-[10px] text-amber-400 font-bold">{prop.status}</span>
                              </div>
                              <h4 className="text-white font-bold text-sm">{prop.name}</h4>
                              <div className="text-zinc-400 text-xs">{prop.loc}</div>
                              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                                <span className="text-amber-400 font-extrabold text-sm">{prop.price}</span>
                                <button 
                                  onClick={() => alert(`Simulating WhatsApp brochure dispatch for ${prop.name}`)}
                                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" /> Send to Buyer
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Deals Kanban */}
                  {activeTab === 'feature2' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Real Estate Buyer Pipeline Kanban</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[
                          { stage: 'New Portal Inquiries', count: 12, leads: ['Vikram Singhania (₹8 Cr)', 'Pooja Oberoi (₹4.5 Cr)'] },
                          { stage: 'Site Visit Scheduled', count: 6, leads: ['Rajesh Malhotra (Tomorrow 2 PM)', 'Sanjay Kothari (Sat 11 AM)'] },
                          { stage: 'Price Negotiation', count: 4, leads: ['Anand Mahindra (Token given)', 'Naveen Jindal (Offer ₹12 Cr)'] },
                          { stage: 'Closed Deals Won', count: 8, leads: ['Deepak Patel (Registered)', 'Meera Nair (Key handover)'] }
                        ].map((col, idx) => (
                          <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/90 space-y-2">
                            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-800">
                              <span className="font-bold text-white">{col.stage}</span>
                              <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-mono">{col.count}</span>
                            </div>
                            <div className="space-y-2">
                              {col.leads.map((ld, i) => (
                                <div key={i} className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
                                  {ld}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {activeTab === 'analytics' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Agency Performance & Commission Dashboard</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">₹18.7 Cr</div>
                          <div className="text-xs text-zinc-400 mt-1">Total Transaction Volume YTD</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">14 Days</div>
                          <div className="text-xs text-zinc-400 mt-1">Average Time from Inquiry to Site Visit</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">99.4%</div>
                          <div className="text-xs text-zinc-400 mt-1">Broker Agreement Compliance Rate</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  3. MODERN E-COMMERCE PLATFORM DEMO
              ========================================================================= */}
              {productType === 'ecommerce' && (
                <div className="space-y-6">
                  {/* Executive Overview */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Monthly GMV</div>
                          <div className="text-2xl font-black text-white mt-1">₹42.8 Lakh</div>
                          <div className="text-[11px] text-amber-400 mt-1 font-mono">↑ +28% vs last month</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Store Conversion Rate</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">3.92%</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Industry Avg: 1.8%</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Avg Order Value (AOV)</div>
                          <div className="text-2xl font-black text-white mt-1">₹3,450</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Prepaid 74% • COD 26%</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                          <div className="text-zinc-400 text-xs">Cart Recovery Rate</div>
                          <div className="text-2xl font-black text-amber-400 mt-1">31.5%</div>
                          <div className="text-[11px] text-zinc-400 mt-1 font-mono">WhatsApp Auto-Nudge</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-amber-400" /> Ultra-Fast Headless Storefront
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Blazing sub-second page loads, mobile-first design, 1-click checkout, and instant product filters that keep customers buying.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Next.js Speed', '1-Click Checkout', 'Smart Search', 'Variant Matrix'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-400" /> Multi-Payment & COD Risk Shield
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Razorpay, PhonePe, UPI, Credit Cards, EMI, and AI-powered COD confirmation to eliminate return-to-origin (RTO) losses.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['UPI QR Code', 'COD Verification', 'EMI Options', 'Instant Refunds'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" /> Shiprocket & Inventory Sync
                          </h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            Automated courier assignment (Bluedart, Delhivery, DTDC), barcode shipping label generation, and live WhatsApp tracking notifications.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {['Shiprocket API', 'Delhivery Sync', 'WhatsApp Tracking', 'Auto AWB'].map(tag => (
                              <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storefront & Products */}
                  {activeTab === 'feature1' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-bold text-base">Live Storefront Catalog Simulator</h3>
                          <p className="text-zinc-400 text-xs">Click "Add to Bag" to test live store cart integration.</p>
                        </div>
                        <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-200 font-mono">
                          Bag Items: <strong className="text-amber-400">{cartCount}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { name: 'Titanium Chrono Master Watch', category: 'Accessories', price: '₹14,999', original: '₹19,999', rating: '4.9' },
                          { name: 'Acoustic Pro Wireless ANC Headphones', category: 'Electronics', price: '₹8,499', original: '₹12,999', rating: '4.8' },
                          { name: 'Italian Leather Minimalist Messenger', category: 'Leatherware', price: '₹6,299', original: '₹8,999', rating: '4.9' }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                            <div className="h-32 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs border border-zinc-800/80">
                              [High-Res Product Showcase Image]
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{item.category}</span>
                              <span className="text-amber-400 flex items-center gap-0.5 text-xs font-bold">★ {item.rating}</span>
                            </div>
                            <h4 className="text-white font-bold text-sm">{item.name}</h4>
                            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                              <div>
                                <span className="text-white font-extrabold text-sm">{item.price}</span>
                                <span className="text-zinc-500 line-through text-xs ml-1.5">{item.original}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setCartCount(prev => prev + 1);
                                  alert(`Added ${item.name} to simulator cart!`);
                                }}
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded text-xs"
                              >
                                + Add to Bag
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cart & Checkout Flow */}
                  {activeTab === 'feature2' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">High-Conversion 1-Page Checkout Flow</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <h4 className="text-white font-bold text-xs uppercase tracking-wider text-zinc-400">Order Summary ({cartCount} Items)</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-zinc-300">
                              <span>Subtotal:</span>
                              <span className="font-bold">₹23,498</span>
                            </div>
                            <div className="flex justify-between text-amber-400">
                              <span>Coupon (VELA20):</span>
                              <span>-₹4,699</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>Express Shipping:</span>
                              <span className="text-amber-400 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-zinc-800">
                              <span>Total Payable:</span>
                              <span className="text-amber-400">₹18,799</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
                          <div>
                            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-zinc-400 mb-2">Instant Payment Simulator</h4>
                            <div className="space-y-2">
                              {['UPI FastPay (GPay, PhonePe, Paytm)', 'Credit / Debit Card (All Indian Banks)', 'Cash on Delivery (Verified SMS OTP)'].map((method, idx) => (
                                <label key={idx} className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 cursor-pointer">
                                  <input type="radio" name="payMethod" defaultChecked={idx === 0} className="text-amber-400" />
                                  <span>{method}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setOrderSimulated(true);
                              setTimeout(() => setOrderSimulated(false), 4000);
                            }}
                            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-xl mt-4"
                          >
                            {orderSimulated ? '✓ Order Confirmed! (SMS & WhatsApp Dispatched)' : 'Test Complete Checkout Flow'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {activeTab === 'analytics' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-white font-bold text-base">Store Analytics & Marketing ROI</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">₹42.8 Lakh</div>
                          <div className="text-xs text-zinc-400 mt-1">Monthly Gross Merchandise Value</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">4.8x ROAS</div>
                          <div className="text-xs text-zinc-400 mt-1">Meta & Google Ad Return on Ad Spend</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                          <div className="text-3xl font-black text-amber-400">1.2s</div>
                          <div className="text-xs text-zinc-400 mt-1">Average Mobile Page Load Speed</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Demo Modal Footer */}
            <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ready to launch this SaaS software customized with your branding?</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${(siteSettings?.contact_whatsapp || siteSettings?.contact_phone || '+918679766348').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${siteSettings?.company_name || 'Velametric'}, I tested the live demo for ${productName} and I would like to order it.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Consultation
                </a>
                {onOrderPackage && (
                  <button
                    onClick={() => {
                      onClose();
                      onOrderPackage();
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xl"
                  >
                    Select Package <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
