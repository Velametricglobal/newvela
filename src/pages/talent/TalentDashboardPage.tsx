import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User, LayoutDashboard, Film, Image as ImageIcon, Briefcase, Award,
  Sparkles, Sliders, CheckCircle2, AlertCircle, Eye, EyeOff, Heart, MessageSquare,
  Plus, Trash2, Edit3, Save, ExternalLink, Globe, Instagram, Youtube,
  TrendingUp, LogOut, ArrowRight, ArrowLeft, ShieldCheck, Clock, Check, RefreshCw,
  X, ChevronRight, Share2, Layers, DollarSign, BadgeCheck, Zap, Lock, Key,
  Palette, LayoutTemplate, CheckCheck, Smartphone, Monitor, Star, Crown, Mail
} from 'lucide-react';
import { talentService } from '../../services/talentService';
import type {
  TalentProfile, TalentCategory, TalentSkill, TalentExperience,
  TalentMedia, TalentPackage, TalentAchievement, TalentInquiry,
  PortfolioTemplateId, TalentPortfolioTheme, PortfolioTemplateDefinition
} from '../../types/talent.types';
import {
  TALENT_CATEGORIES, CATEGORY_LABEL_MAP, TALENT_PORTFOLIO_TEMPLATES
} from '../../types/talent.types';
import { TalentTemplateSelector } from '../../components/talent/TalentTemplateSelector';

export const TalentDashboardPage: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'overview' }) => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || defaultTab;
  const navigate = useNavigate();

  // Authentication State
  const [currentTalent, setCurrentTalent] = useState<TalentProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    initialTab === 'register' ? 'register' : 'login'
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Setup Onboarding Wizard State (7 Steps)
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState<Partial<TalentProfile>>({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    category: 'model',
    title: '',
    location: '',
    yearsOfExperience: 3,
    bio: '',
    portfolioTheme: {
      templateId: 'editorial-vogue',
      accentColor: 'gold',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: true,
      showShowreelFirst: false,
    }
  });

  // Register form state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    category: 'model' as TalentCategory,
    displayName: '',
    handle: '',
    location: '',
  });

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<string>(
    initialTab === 'login' || initialTab === 'register' ? 'overview' : initialTab
  );

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState<Partial<TalentProfile>>({});
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [inquiries, setInquiries] = useState<TalentInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<TalentInquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  // Modals for adding items
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 85 });

  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ role: '', company: '', type: 'Runway / Campaign', year: '2026', description: '' });

  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [newMedia, setNewMedia] = useState({
    title: '',
    category: 'editorial',
    type: 'image' as TalentMedia['type'],
    url: '',
    featured: false,
  });

  const [showAddPkgModal, setShowAddPkgModal] = useState(false);
  const [newPkg, setNewPkg] = useState({
    name: '',
    description: '',
    price: '2500',
    duration: '1 Day',
    revisions: 2,
    deliverables: '1 Full Day Shoot, 15 Edited High-Res Photos, Usage License',
    popular: false,
  });

  const [showAddAchModal, setShowAddAchModal] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', issuer: '', year: '2025', icon: '🏆' });

  // STRICT SESSION RESTORATION: Only restore if a verified session exists
  useEffect(() => {
    const talent = talentService.getCurrentTalent();
    if (talent) {
      setCurrentTalent(talent);
      setProfileForm(talent);
      setInquiries(talentService.getInquiries(talent.id));
    } else {
      setCurrentTalent(null);
    }
  }, []);

  // Update inquiries when current talent changes
  useEffect(() => {
    if (currentTalent) {
      setInquiries(talentService.getInquiries(currentTalent.id));
    }
  }, [currentTalent?.id]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both your Talent Login ID / Email and Password.');
      return;
    }
    const talent = talentService.login(loginEmail, loginPassword);
    if (talent) {
      setCurrentTalent(talent);
      setProfileForm(talent);
      setInquiries(talentService.getInquiries(talent.id));
      setActiveTab('overview');
    } else {
      setAuthError('Access Denied: Invalid Talent Login ID, Email, or Password. Please try again or register.');
    }
  };

  const handleDemoFill = (t: TalentProfile) => {
    const pass = t.password || (t.category === 'model' ? 'model123' : 'talent123');
    setLoginEmail(t.email);
    setLoginPassword(pass);
    setAuthError('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regData.email || !regData.firstName || !regData.password) {
      setAuthError('Please fill in First Name, Email Address, and Account Password.');
      return;
    }
    if (talentService.getByEmail(regData.email)) {
      setAuthError('An account with this email address already exists. Please sign in instead.');
      return;
    }
    const newProfile = talentService.register({
      firstName: regData.firstName,
      lastName: regData.lastName,
      email: regData.email,
      password: regData.password,
      category: regData.category,
      displayName: regData.displayName || `${regData.firstName} ${regData.lastName}`,
      handle: regData.handle || regData.email.split('@')[0],
    });
    if (regData.location) {
      talentService.update(newProfile.id, { location: regData.location });
    }
    const updated = talentService.getById(newProfile.id);
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
      setInquiries([]);
      setActiveTab('overview');
      setWizardData({
        ...updated,
        portfolioTheme: updated.portfolioTheme || {
          templateId: updated.category === 'model' ? 'editorial-vogue' : 'creative-pop',
          accentColor: 'gold',
          fontStyle: 'serif',
          heroLayout: 'magazine-split',
          galleryLayout: 'masonry',
          showMeasurements: !!updated.measurements,
          showShowreelFirst: false,
        }
      });
      setShowWizardModal(true);
      setWizardStep(1);
    }
  };

  const handleLogout = () => {
    talentService.logout();
    setCurrentTalent(null);
    setLoginEmail('');
    setLoginPassword('');
    setAuthMode('login');
  };

  const handleSaveProfile = () => {
    if (!currentTalent) return;
    const updated = talentService.update(currentTalent.id, profileForm);
    if (updated) {
      setCurrentTalent(updated);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    }
  };

  const handleApplyTemplate = (tmplId: PortfolioTemplateId) => {
    if (!currentTalent) return;
    const chosenTmpl = TALENT_PORTFOLIO_TEMPLATES.find(t => t.id === tmplId);
    if (!chosenTmpl) return;

    const newTheme: TalentPortfolioTheme = {
      templateId: tmplId,
      accentColor: chosenTmpl.accentColor,
      fontStyle: chosenTmpl.fontStyle,
      heroLayout: chosenTmpl.heroLayout,
      galleryLayout: chosenTmpl.galleryLayout,
      showMeasurements: !!currentTalent.measurements,
      showShowreelFirst: tmplId === 'cinema-noir' || tmplId === 'creative-pop',
      customHeading: chosenTmpl.tagline
    };
    const updated = talentService.updatePortfolioTheme(currentTalent.id, newTheme);
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    }
  };

  const handleLaunchWizard = (step: number = 1) => {
    if (currentTalent) {
      setWizardData({
        ...currentTalent,
      });
    }
    setWizardStep(step);
    setShowWizardModal(true);
  };

  const handleSubmitForReview = () => {
    if (!currentTalent) return;
    talentService.updateStatus(currentTalent.id, 'pending');
    const updated = talentService.getById(currentTalent.id);
    if (updated) setCurrentTalent(updated);
    alert('Your profile has been submitted to Velametric Talent Management for review and approval.');
  };

  const handleTogglePublish = () => {
    if (!currentTalent) return;
    const newStatus = currentTalent.status === 'active' || currentTalent.status === 'featured' ? 'suspended' : 'active';
    talentService.updateStatus(currentTalent.id, newStatus);
    const updated = talentService.getById(currentTalent.id);
    if (updated) setCurrentTalent(updated);
  };

  // ── Modals Submit Handlers ──────────────────────────────────────────────────
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTalent || !newSkill.name) return;
    const skillItem: TalentSkill = {
      id: `s_${Date.now()}`,
      name: newSkill.name,
      proficiency: newSkill.proficiency,
    };
    const updatedSkills = [...(currentTalent.skills || []), skillItem];
    const updated = talentService.update(currentTalent.id, { skills: updatedSkills });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
    setNewSkill({ name: '', proficiency: 85 });
    setShowAddSkillModal(false);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (!currentTalent) return;
    const updatedSkills = currentTalent.skills.filter(s => s.id !== skillId);
    const updated = talentService.update(currentTalent.id, { skills: updatedSkills });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTalent || !newExp.role) return;
    const expItem: TalentExperience = {
      id: `e_${Date.now()}`,
      ...newExp,
    };
    const updatedExp = [...(currentTalent.experience || []), expItem];
    const updated = talentService.update(currentTalent.id, { experience: updatedExp });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
    setNewExp({ role: '', company: '', type: 'Campaign', year: '2026', description: '' });
    setShowAddExpModal(false);
  };

  const handleDeleteExp = (expId: string) => {
    if (!currentTalent) return;
    const updatedExp = currentTalent.experience.filter(e => e.id !== expId);
    const updated = talentService.update(currentTalent.id, { experience: updatedExp });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTalent || !newMedia.url) return;
    const mediaItem: TalentMedia = {
      id: `m_${Date.now()}`,
      ...newMedia,
      uploadedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    const updatedMedia = [...(currentTalent.media || []), mediaItem];
    const updated = talentService.update(currentTalent.id, { media: updatedMedia });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
    setNewMedia({ title: '', category: 'editorial', type: 'image', url: '', featured: false });
    setShowAddMediaModal(false);
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (!currentTalent) return;
    const updatedMedia = currentTalent.media.filter(m => m.id !== mediaId);
    const updated = talentService.update(currentTalent.id, { media: updatedMedia });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTalent || !newPkg.name) return;
    const pkgItem: TalentPackage = {
      id: `p_${Date.now()}`,
      name: newPkg.name,
      description: newPkg.description,
      price: newPkg.price,
      currency: 'USD',
      duration: newPkg.duration,
      revisions: newPkg.revisions,
      popular: newPkg.popular,
      deliverables: newPkg.deliverables.split(',').map(s => s.trim()).filter(Boolean),
    };
    const updatedPkgs = [...(currentTalent.packages || []), pkgItem];
    const updated = talentService.update(currentTalent.id, { packages: updatedPkgs });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
    setNewPkg({ name: '', description: '', price: '2500', duration: '1 Day', revisions: 2, deliverables: '', popular: false });
    setShowAddPkgModal(false);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (!currentTalent) return;
    const updatedPkgs = currentTalent.packages.filter(p => p.id !== pkgId);
    const updated = talentService.update(currentTalent.id, { packages: updatedPkgs });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTalent || !newAch.title) return;
    const achItem: TalentAchievement = {
      id: `a_${Date.now()}`,
      ...newAch,
    };
    const updatedAch = [...(currentTalent.achievements || []), achItem];
    const updated = talentService.update(currentTalent.id, { achievements: updatedAch });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
    setNewAch({ title: '', issuer: '', year: '2025', icon: '🏆' });
    setShowAddAchModal(false);
  };

  const handleDeleteAchievement = (achId: string) => {
    if (!currentTalent) return;
    const updatedAch = currentTalent.achievements.filter(a => a.id !== achId);
    const updated = talentService.update(currentTalent.id, { achievements: updatedAch });
    if (updated) {
      setCurrentTalent(updated);
      setProfileForm(updated);
    }
  };

  const handleReplyInquiry = () => {
    if (!selectedInquiry) return;
    talentService.updateInquiryStatus(selectedInquiry.id, 'replied');
    setInquiries(talentService.getInquiries(currentTalent?.id));
    setSelectedInquiry(null);
    setReplyText('');
    alert('Reply sent to client.');
  };

  // ── If Not Logged In: Show Protected Talent Authentication Portal ───────────
  if (!currentTalent) {
    const seedList = talentService.getAll();
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Lock size={12} /> Protected Talent & Creator Portal
          </div>
          
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-lg shadow-lg shadow-amber-400/30">
              V
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              VELAMETRIC TALENT
            </h1>
          </div>

          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {authMode === 'login'
              ? 'Sign in with your private Talent ID or Email & Password to update your showcase, edit comp cards, and manage bookings.'
              : 'Register your talent profile to build your public showcase, configure custom themes, and get booked by luxury brands.'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-zinc-900/95 border border-zinc-800 backdrop-blur-2xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
            
            {/* Mode Tabs */}
            <div className="flex rounded-2xl bg-zinc-950 p-1 border border-zinc-800">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Talent Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Register New Profile
              </button>
            </div>

            {authError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertCircle size={15} className="shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 font-mono uppercase">
                    Talent ID / Email / Username *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. aria@models.com or aria_varma"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-300 font-mono uppercase">
                      Account Password *
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">Demo: talent123 / model123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter talent password..."
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                    >
                      {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 mt-2"
                >
                  <Lock size={13} />
                  <span>Authenticate & Open Studio →</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Elena"
                      value={regData.firstName}
                      onChange={e => setRegData({ ...regData, firstName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">Last Name</label>
                    <input
                      type="text"
                      placeholder="Rostova"
                      value={regData.lastName}
                      onChange={e => setRegData({ ...regData, lastName: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@agency.com"
                    value={regData.email}
                    onChange={e => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">Create Password *</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Choose a strong password..."
                      value={regData.password}
                      onChange={e => setRegData({ ...regData, password: e.target.value })}
                      className="w-full pl-3 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                    >
                      {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">Category</label>
                    <select
                      value={regData.category}
                      onChange={e => setRegData({ ...regData, category: e.target.value as TalentCategory })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-400 outline-none capitalize"
                    >
                      {TALENT_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono uppercase">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Paris / Dubai"
                      value={regData.location}
                      onChange={e => setRegData({ ...regData, location: e.target.value })}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 mt-2 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Create Account & Choose Template →</span>
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Autofill Helper */}
            <div className="pt-4 border-t border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                <span className="flex items-center gap-1.5"><Key size={11} /> Quick Demo Talent Accounts</span>
                <span className="text-zinc-500 font-normal">Click to Autofill</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {seedList.slice(0, 4).map(t => {
                  const pass = t.password || (t.category === 'model' ? 'model123' : 'talent123');
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleDemoFill(t)}
                      className="p-2.5 bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-400/40 rounded-2xl text-left transition-all group flex items-start gap-2.5"
                    >
                      <img src={t.avatar} alt={t.displayName} className="w-8 h-8 rounded-xl object-cover shrink-0 border border-zinc-800 group-hover:border-amber-400" />
                      <div className="truncate min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                          {t.displayName}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">
                          ID: {t.handle}
                        </div>
                        <div className="text-[9px] text-amber-400/90 font-mono">
                          Pass: {pass}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link to Staff / CRM Admin */}
            <div className="pt-2 text-center border-t border-zinc-800/60">
              <Link
                to="/login"
                className="text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                Internal Team Member? <span className="text-amber-400 font-bold underline">Staff & CRM Admin Login →</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Calculate Profile Completion %
  const calculateCompletion = () => {
    let score = 30; // base score for registration
    if (currentTalent.bio && currentTalent.bio.length > 20) score += 15;
    if (currentTalent.avatar) score += 10;
    if (currentTalent.coverImage) score += 10;
    if (currentTalent.skills && currentTalent.skills.length >= 3) score += 10;
    if (currentTalent.media && currentTalent.media.length >= 2) score += 15;
    if (currentTalent.experience && currentTalent.experience.length >= 1) score += 5;
    if (currentTalent.socialLinks && Object.keys(currentTalent.socialLinks).length >= 1) score += 5;
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();
  const catInfo = TALENT_CATEGORIES.find(c => c.value === currentTalent.category);

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 selection:bg-amber-400 selection:text-zinc-950 flex flex-col">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/talents" className="flex items-center gap-2 font-black text-lg text-white font-display">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black text-sm">
                V
              </span>
              <span className="hidden sm:inline">VELAMETRIC TALENT</span>
            </Link>
            <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              STUDIO PORTAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Profile Link */}
            <Link
              to={`/talent/${currentTalent.id}`}
              target="_blank"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={14} className="text-amber-400" />
              <span className="hidden sm:inline">View Public Profile</span>
            </Link>

            {/* Authenticated Talent Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <img
                src={currentTalent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentTalent.displayName}
                className="w-6 h-6 rounded-lg object-cover border border-amber-400/40"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-none">
                  {currentTalent.displayName}
                </span>
                <span className="text-[9px] text-amber-400 font-mono capitalize">
                  {currentTalent.category}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-rose-500/15 border border-zinc-800 hover:border-rose-500/40 text-zinc-300 hover:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Sign Out of Talent Account"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Status Strip & Actions ── */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Account Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentTalent.status === 'active' || currentTalent.status === 'featured'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : currentTalent.status === 'pending'
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                : 'bg-zinc-700 text-zinc-300'
            }`}>
              ● {currentTalent.status}
            </span>
            {currentTalent.isVerified && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <BadgeCheck size={11} /> Verified Badge
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isSavedToast && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <Check size={14} /> Changes Saved
              </span>
            )}
            <button
              onClick={handleSaveProfile}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Save size={13} /> Save Draft
            </button>
            {currentTalent.status !== 'active' && currentTalent.status !== 'featured' && (
              <button
                onClick={handleSubmitForReview}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-amber-400/20"
              >
                <Zap size={13} /> Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout (Sidebar + Content) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col md:flex-row gap-8">
        
        {/* ── Sidebar Navigation ── */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          {/* User Card */}
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentTalent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'}
                alt={currentTalent.displayName}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-400/40"
              />
              <div className="truncate">
                <h3 className="text-white font-bold text-sm truncate">{currentTalent.displayName}</h3>
                <p className="text-amber-400 text-xs font-mono font-medium truncate">@{currentTalent.handle}</p>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block capitalize">{currentTalent.category}</span>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium">Profile Completion</span>
                <span className="text-amber-400 font-bold font-mono">{completionPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              {completionPercent < 90 && (
                <p className="text-[10px] text-zinc-500 leading-tight">
                  💡 Tip: Upload a video showreel & 3 portfolio items to reach 95%.
                </p>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'templates', label: 'Design & Templates', icon: Palette, badge: '6 PRESETS' },
              { id: 'profile', label: 'My Profile Info', icon: User },
              { id: 'portfolio', label: 'Portfolio & Projects', icon: Layers, count: currentTalent.media?.length },
              { id: 'media', label: 'Media & Showreel', icon: Film },
              { id: 'skills', label: 'Skills & Proficiencies', icon: Sparkles, count: currentTalent.skills?.length },
              { id: 'experience', label: 'Experience & Milestones', icon: Briefcase, count: currentTalent.experience?.length },
              { id: 'achievements', label: 'Achievements & Awards', icon: Award, count: currentTalent.achievements?.length },
              { id: 'packages', label: 'Booking Packages', icon: DollarSign, count: currentTalent.packages?.length },
              { id: 'inquiries', label: 'Opportunities & Inquiries', icon: MessageSquare, count: inquiries.length, badge: 'HOT' },
              { id: 'settings', label: 'Settings & Security', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && !tab.count ? (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                      {tab.badge}
                    </span>
                  ) : null}
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Content View Area ── */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* ── Your Talent Showcase Header Card ── */}
              {(() => {
                const activeTmpl = TALENT_PORTFOLIO_TEMPLATES.find(
                  t => t.id === (currentTalent.portfolioTheme?.templateId || 'editorial-vogue')
                ) || TALENT_PORTFOLIO_TEMPLATES[0];

                return (
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl space-y-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      
                      {/* Left: Active Template Details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="relative group">
                          <img
                            src={activeTmpl.previewImage}
                            alt={activeTmpl.name}
                            className="w-24 h-20 sm:w-32 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/40 shadow-xl"
                          />
                          <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-amber-400 text-zinc-950 font-black text-[9px] font-mono uppercase rounded-full shadow-md">
                            ACTIVE THEME
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                              Your Talent Showcase
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Public Profile: Published
                            </span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-black text-white">
                            {activeTmpl.name}
                          </h3>

                          <p className="text-zinc-400 text-xs sm:text-sm">
                            Style: <strong className="text-zinc-200">{activeTmpl.designStyle}</strong> &bull; Layout: <strong className="text-zinc-200">{activeTmpl.layoutType}</strong> &bull; Profile Completion: <strong className="text-amber-400 font-mono">{completionPercent}%</strong>
                          </p>
                        </div>
                      </div>

                      {/* Right: Quick Showcase Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                        <button
                          onClick={() => setActiveTab('templates')}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Palette size={14} className="text-amber-400" />
                          <span>Change Template</span>
                        </button>

                        <button
                          onClick={() => handleLaunchWizard(1)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={14} />
                          <span>Setup Wizard</span>
                        </button>

                        <Link
                          to={`/talent/${currentTalent.id}`}
                          target="_blank"
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink size={14} />
                          <span>View Showcase</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center justify-between text-zinc-500 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Total Views</span>
                    <Eye size={16} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{currentTalent.views.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <TrendingUp size={11} /> +18% this month
                  </div>
                </div>

                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center justify-between text-zinc-500 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Profile Likes</span>
                    <Heart size={16} className="text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{currentTalent.likes.toLocaleString()}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">From agency scouting</div>
                </div>

                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center justify-between text-zinc-500 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Inquiries</span>
                    <MessageSquare size={16} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{inquiries.length}</div>
                  <div className="text-[11px] text-amber-400 mt-1 font-semibold">
                    {inquiries.filter(i => i.status === 'new').length} new opportunities
                  </div>
                </div>

                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl">
                  <div className="flex items-center justify-between text-zinc-500 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Estimated Reach</span>
                    <Globe size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{currentTalent.followerCount || '2.5M'}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Cross-platform total</div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Your Public Talent URL</h3>
                  <p className="text-zinc-400 text-xs font-mono">
                    {window.location.origin}/talent/{currentTalent.id}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/talent/${currentTalent.id}`);
                      alert('Public profile link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Share2 size={13} /> Copy Link
                  </button>
                  <Link
                    to={`/talent/${currentTalent.id}`}
                    target="_blank"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} /> Preview Live Page
                  </Link>
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-base">Recent Opportunities</h3>
                    <p className="text-zinc-400 text-xs">Direct booking requests from producers and brands</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    No client inquiries received yet. Once visitors browse your public portfolio, their requests will appear here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map(inq => (
                      <div
                        key={inq.id}
                        className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{inq.senderName}</span>
                            {inq.company && <span className="text-xs text-zinc-400">({inq.company})</span>}
                            <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md text-[10px] font-mono">
                              {inq.projectType}
                            </span>
                          </div>
                          <p className="text-zinc-300 text-xs mt-1 line-clamp-1">{inq.message}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedInquiry(inq); setActiveTab('inquiries'); }}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO DESIGN & SHOWCASE TEMPLATES (POWERED BY TALENT TEMPLATE SELECTOR) */}
          {activeTab === 'templates' && (
            <div className="space-y-8">
              <TalentTemplateSelector
                currentTalent={currentTalent}
                selectedTemplateId={currentTalent.portfolioTheme?.templateId || 'editorial-vogue'}
                onSelectTemplate={(tmplId) => handleApplyTemplate(tmplId)}
              />

              {/* Advanced Customizer Panel */}
              <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Fine-Tune Portfolio Visuals</h3>
                  <p className="text-zinc-400 text-xs">Customize accent colors, layout mode, and section visibility.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Accent Color Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                      Brand Accent Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'gold', name: 'Gold', color: 'bg-amber-400' },
                        { id: 'purple', name: 'Neon Purple', color: 'bg-fuchsia-500' },
                        { id: 'emerald', name: 'Emerald Volt', color: 'bg-emerald-400' },
                        { id: 'cyan', name: 'Sapphire Cyan', color: 'bg-cyan-400' },
                        { id: 'rose', name: 'Haute Rose', color: 'bg-rose-500' },
                        { id: 'slate', name: 'Platinum Slate', color: 'bg-zinc-400' },
                      ].map(c => {
                        const isSelected = (currentTalent.portfolioTheme?.accentColor || 'gold') === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              const updatedTheme: TalentPortfolioTheme = {
                                ...(currentTalent.portfolioTheme || {
                                  templateId: 'editorial-vogue',
                                  fontStyle: 'serif',
                                  heroLayout: 'magazine-split',
                                  galleryLayout: 'masonry',
                                  showMeasurements: true,
                                  showShowreelFirst: false,
                                }),
                                accentColor: c.id as any
                              };
                              const updated = talentService.updatePortfolioTheme(currentTalent.id, updatedTheme);
                              if (updated) {
                                setCurrentTalent(updated);
                                setProfileForm(updated);
                              }
                            }}
                            className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                              isSelected ? 'border-white bg-zinc-800 ring-2 ring-white/20' : 'border-zinc-800 bg-zinc-950'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${c.color}`} />
                            <span className="text-[10px] text-zinc-300">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gallery Layout Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                      Gallery Display Format
                    </label>
                    <select
                      value={currentTalent.portfolioTheme?.galleryLayout || 'masonry'}
                      onChange={e => {
                        const updatedTheme: TalentPortfolioTheme = {
                          ...(currentTalent.portfolioTheme || {
                            templateId: 'editorial-vogue',
                            accentColor: 'gold',
                            fontStyle: 'serif',
                            heroLayout: 'magazine-split',
                            showMeasurements: true,
                            showShowreelFirst: false,
                          }),
                          galleryLayout: e.target.value as any
                        };
                        const updated = talentService.updatePortfolioTheme(currentTalent.id, updatedTheme);
                        if (updated) {
                          setCurrentTalent(updated);
                          setProfileForm(updated);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs font-bold outline-none focus:border-amber-400"
                    >
                      <option value="masonry">Fluid Masonry Gallery (Recommended)</option>
                      <option value="grid">Structured 3-Column Grid</option>
                      <option value="featured">Featured Project Spotlight</option>
                    </select>
                  </div>

                  {/* Typography Style */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                      Typography Aesthetic
                    </label>
                    <select
                      value={currentTalent.portfolioTheme?.fontStyle || 'serif'}
                      onChange={e => {
                        const updatedTheme: TalentPortfolioTheme = {
                          ...(currentTalent.portfolioTheme || {
                            templateId: 'editorial-vogue',
                            accentColor: 'gold',
                            heroLayout: 'magazine-split',
                            galleryLayout: 'masonry',
                            showMeasurements: true,
                            showShowreelFirst: false,
                          }),
                          fontStyle: e.target.value as any
                        };
                        const updated = talentService.updatePortfolioTheme(currentTalent.id, updatedTheme);
                        if (updated) {
                          setCurrentTalent(updated);
                          setProfileForm(updated);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs font-bold outline-none focus:border-amber-400"
                    >
                      <option value="serif">Editorial Serif (High-Fashion / Playfair)</option>
                      <option value="sans">Clean Modern Sans (Contemporary / Bold)</option>
                      <option value="display">Theatrical Display (Impact / Cine-Title)</option>
                      <option value="mono">Technical Monospace (Minimalist Studio)</option>
                    </select>
                  </div>
                </div>

                {/* Save Toast Feedback */}
                {isSavedToast && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>Portfolio design saved and published to your public URL!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MY PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Profile Identity</h2>
                <p className="text-zinc-400 text-xs">Update your stage details, bio, and visual branding assets.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Display Name *</label>
                  <input
                    type="text"
                    value={profileForm.displayName || ''}
                    onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Stage / Professional Name</label>
                  <input
                    type="text"
                    value={profileForm.stageName || ''}
                    onChange={e => setProfileForm({ ...profileForm, stageName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Profile Handle (@username)</label>
                  <input
                    type="text"
                    value={profileForm.handle || ''}
                    onChange={e => setProfileForm({ ...profileForm, handle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Professional Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Haute Couture Model & Actor"
                    value={profileForm.title || ''}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Professional Tagline</label>
                <input
                  type="text"
                  placeholder="One sentence highlight summarizing your unique identity"
                  value={profileForm.tagline || ''}
                  onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Biography & Summary</label>
                <textarea
                  rows={4}
                  value={profileForm.bio || ''}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Location Base</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={profileForm.yearsOfExperience || 0}
                    onChange={e => setProfileForm({ ...profileForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Starting Day Rate (₹)</label>
                  <input
                    type="text"
                    placeholder="35000"
                    value={profileForm.dayRate || ''}
                    onChange={e => setProfileForm({ ...profileForm, dayRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={profileForm.avatar || ''}
                    onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cover Banner Image URL</label>
                  <input
                    type="text"
                    value={profileForm.coverImage || ''}
                    onChange={e => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-sm transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO & PROJECTS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Portfolio Gallery & Visual Showcase</h2>
                  <p className="text-zinc-400 text-xs">Add editorial photos, project covers, and external work links.</p>
                </div>
                <button
                  onClick={() => setShowAddMediaModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
                >
                  <Plus size={14} /> Add Media / Project
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTalent.media?.map(item => (
                  <div key={item.id} className="relative group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-md">
                    <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-400">{item.category}</span>
                          <h4 className="text-white font-bold text-sm">{item.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEDIA & SHOWREEL */}
          {activeTab === 'media' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Showreel & Video Master Media</h2>
                  <p className="text-zinc-400 text-xs">Configure your primary 4K showreel player and reel clips.</p>
                </div>
                <button
                  onClick={() => setShowAddMediaModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} /> Upload Reel / Video
                </button>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film size={16} className="text-amber-400" /> Featured Showreel Video Link
                </h3>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or direct MP4 URL"
                  value={currentTalent.media[0]?.url || ''}
                  onChange={e => {
                    const newMed = [...currentTalent.media];
                    if (newMed.length > 0) newMed[0].url = e.target.value;
                    talentService.update(currentTalent.id, { media: newMed });
                    setCurrentTalent({ ...currentTalent, media: newMed });
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
                <p className="text-[11px] text-zinc-500">
                  This video will appear with high priority in the top player section on your public profile page.
                </p>
              </div>
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Skills & Masteries</h2>
                  <p className="text-zinc-400 text-xs">Add professional skills and proficiency levels (0 - 100%).</p>
                </div>
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTalent.skills?.map(skill => (
                  <div key={skill.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-bold">{skill.name}</span>
                        <span className="text-amber-400 font-mono font-bold">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE & MILESTONES */}
          {activeTab === 'experience' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Experience & Career History</h2>
                  <p className="text-zinc-400 text-xs">Document your film projects, runway shows, and client collaborations.</p>
                </div>
                <button
                  onClick={() => setShowAddExpModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {currentTalent.experience?.map(exp => (
                  <div key={exp.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-base">{exp.role}</h4>
                        <span className="text-zinc-400 text-xs">at {exp.company}</span>
                        <span className="px-2 py-0.5 bg-zinc-800 text-amber-400 font-mono text-xs rounded-full">{exp.year}</span>
                      </div>
                      <p className="text-zinc-300 text-xs sm:text-sm mt-1">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Awards & Achievements</h2>
                  <p className="text-zinc-400 text-xs">Showcase trophies, festival nominations, and press milestones.</p>
                </div>
                <button
                  onClick={() => setShowAddAchModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
                >
                  <Plus size={14} /> Add Achievement
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTalent.achievements?.map(ach => (
                  <div key={ach.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ach.icon || '🏆'}</span>
                      <div>
                        <h4 className="text-white font-bold text-sm">{ach.title}</h4>
                        <p className="text-zinc-400 text-xs">{ach.issuer} &bull; {ach.year}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Booking Packages & Offerings</h2>
                  <p className="text-zinc-400 text-xs">Set clear deliverables and pricing tiers for prospective clients.</p>
                </div>
                <button
                  onClick={() => setShowAddPkgModal(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
                >
                  <Plus size={14} /> Create Package
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentTalent.packages?.map(pkg => (
                  <div key={pkg.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-bold text-base">{pkg.name}</h4>
                        <span className="text-amber-400 font-mono font-bold text-lg">${parseInt(pkg.price).toLocaleString()}</span>
                        <span className="text-zinc-500 text-xs font-mono"> / {pkg.duration}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-zinc-400 text-xs">{pkg.description}</p>
                    <div className="space-y-1">
                      {pkg.deliverables.map((d, i) => (
                        <div key={i} className="text-zinc-300 text-xs flex items-center gap-1.5">
                          <Check size={12} className="text-amber-400" /> {d}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES & OPPORTUNITIES */}
          {activeTab === 'inquiries' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Client Inquiries & Opportunities</h2>
                <p className="text-zinc-400 text-xs">Direct proposals submitted by agency scouts, producers, and brands.</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-sm">
                  No booking inquiries yet. Share your public profile link to receive opportunities.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        inq.status === 'new'
                          ? 'bg-zinc-950 border-amber-400/40 shadow-lg shadow-amber-400/5'
                          : 'bg-zinc-950/80 border-zinc-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-base">{inq.senderName}</span>
                          {inq.company && <span className="text-xs text-zinc-400 font-medium">({inq.company})</span>}
                          <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-mono font-bold rounded-md">
                            {inq.projectType}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'new' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {inq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-3">
                        <span>📧 {inq.senderEmail}</span>
                        {inq.senderPhone && <span>📞 {inq.senderPhone}</span>}
                        {inq.budget && <span>💰 Budget: <strong className="text-emerald-400">{inq.budget}</strong></span>}
                        <span>📅 {new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>

                      <p className="text-zinc-200 text-sm bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80 mb-3">
                        {inq.message}
                      </p>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            talentService.updateInquiryStatus(inq.id, inq.status === 'read' ? 'replied' : 'read');
                            setInquiries(talentService.getInquiries(currentTalent.id));
                          }}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl"
                        >
                          Mark as {inq.status === 'new' ? 'Read' : 'Replied'}
                        </button>
                        <a
                          href={`mailto:${inq.senderEmail}?subject=Re: ${inq.projectType} Opportunity - ${currentTalent.displayName}`}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black rounded-xl flex items-center gap-1.5"
                        >
                          <Mail size={13} /> Reply via Email
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Account & Visibility Settings</h2>
                <p className="text-zinc-400 text-xs">Manage visibility, availability toggles, and account credentials.</p>
              </div>

              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Public Profile Visibility</h4>
                    <p className="text-xs text-zinc-400">Show or hide your talent portfolio from the global discovery index</p>
                  </div>
                  <button
                    onClick={handleTogglePublish}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      currentTalent.status === 'active' || currentTalent.status === 'featured'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {currentTalent.status === 'active' || currentTalent.status === 'featured' ? 'Published (Live)' : 'Draft (Unpublished)'}
                  </button>
                </div>
              </div>

              <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Instant Availability</h4>
                    <p className="text-xs text-zinc-400">Indicate whether you are open for new bookings this month</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = talentService.update(currentTalent.id, { isAvailable: !currentTalent.isAvailable });
                      if (updated) setCurrentTalent(updated);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      currentTalent.isAvailable ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {currentTalent.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MODALS FOR ADDING ITEMS ── */}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Professional Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Runway Walking / Classical Vocals"
                  value={newSkill.name}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Proficiency ({newSkill.proficiency}%)</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={e => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-amber-400"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showAddExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Career Milestone</h3>
            <form onSubmit={handleAddExp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Lead Model / Keynote Speaker"
                    value={newExp.role}
                    onChange={e => setNewExp({ ...newExp, role: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Client / Project / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="Vogue / Netflix / Apple"
                    value={newExp.company}
                    onChange={e => setNewExp({ ...newExp, company: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Type / Category</label>
                  <input
                    type="text"
                    placeholder="Commercial Campaign / Film"
                    value={newExp.type}
                    onChange={e => setNewExp({ ...newExp, type: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={newExp.year}
                    onChange={e => setNewExp({ ...newExp, year: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Key highlights and scope of project..."
                  value={newExp.description}
                  onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Portfolio Media</h3>
            <form onSubmit={handleAddMedia} className="space-y-3.5">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Paris Fashion Week SS26 Shoot"
                  value={newMedia.title}
                  onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Media Type</label>
                  <select
                    value={newMedia.type}
                    onChange={e => setNewMedia({ ...newMedia, type: e.target.value as TalentMedia['type'] })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  >
                    <option value="image">Photo / Image</option>
                    <option value="video">Video Reel</option>
                    <option value="reel">Short Clip</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Category Tag</label>
                  <input
                    type="text"
                    placeholder="editorial"
                    value={newMedia.category}
                    onChange={e => setNewMedia({ ...newMedia, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Media URL (Image or Video)</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... or video link"
                  value={newMedia.url}
                  onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showAddPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Booking Package</h3>
            <form onSubmit={handleAddPackage} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Day Editorial Shoot"
                    value={newPkg.name}
                    onChange={e => setNewPkg({ ...newPkg, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Price ($ USD)</label>
                  <input
                    type="text"
                    required
                    placeholder="3500"
                    value={newPkg.price}
                    onChange={e => setNewPkg({ ...newPkg, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Duration / Turnaround</label>
                <input
                  type="text"
                  placeholder="1 Day / 48hr turnaround"
                  value={newPkg.duration}
                  onChange={e => setNewPkg({ ...newPkg, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Deliverables (comma-separated)</label>
                <input
                  type="text"
                  placeholder="8hr on-set shoot, 20 edited images, Full commercial rights"
                  value={newPkg.deliverables}
                  onChange={e => setNewPkg({ ...newPkg, deliverables: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newPkg.description}
                  onChange={e => setNewPkg({ ...newPkg, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPkgModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl text-xs"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 🌟 7-STEP ONBOARDING & SETUP WIZARD MODAL ── */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Wizard Header Bar */}
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-black text-sm">
                  {wizardStep}/7
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    Velametric Showcase Onboarding
                  </div>
                  <h3 className="text-white font-black text-base">
                    {wizardStep === 1 && 'Step 1: Account & Profile Essentials'}
                    {wizardStep === 2 && 'Step 2: Tell Us About Your Talent'}
                    {wizardStep === 3 && 'Step 3: Choose Your Showcase Style'}
                    {wizardStep === 4 && 'Step 4: Live Desktop & Mobile Preview'}
                    {wizardStep === 5 && 'Step 5: Confirm Template Selection'}
                    {wizardStep === 6 && 'Step 6: Customize Your Showcase Content'}
                    {wizardStep === 7 && 'Step 7: Publish Your Talent Showcase!'}
                  </h3>
                </div>
              </div>

              {/* Progress Steps Dots */}
              <div className="hidden md:flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(st => (
                  <div
                    key={st}
                    className={`w-3 h-3 rounded-full transition-all ${
                      st === wizardStep
                        ? 'bg-amber-400 ring-4 ring-amber-400/20 scale-110'
                        : st < wizardStep
                        ? 'bg-emerald-400'
                        : 'bg-zinc-800'
                    }`}
                    title={`Step ${st}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowWizardModal(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Wizard Step Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-black/40">
              
              {/* STEP 1: Basic Account & Photo */}
              {wizardStep === 1 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-white">Create Your Talent Profile</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      Let’s start with your professional stage name and public profile appearance.
                    </p>
                  </div>

                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-zinc-800">
                      <img
                        src={wizardData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                        alt="Profile"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg"
                      />
                      <div className="space-y-1.5 text-center sm:text-left flex-1">
                        <label className="block text-xs font-mono font-bold text-zinc-400 uppercase">
                          Profile Photo URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={wizardData.avatar || ''}
                          onChange={e => setWizardData({ ...wizardData, avatar: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Display / Stage Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sofia Reyes"
                          value={wizardData.displayName || ''}
                          onChange={e => setWizardData({ ...wizardData, displayName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Public Handle (@username)</label>
                        <input
                          type="text"
                          placeholder="e.g. sofia_reyes"
                          value={wizardData.handle || ''}
                          onChange={e => setWizardData({ ...wizardData, handle: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        placeholder="name@talent.com"
                        value={wizardData.email || ''}
                        onChange={e => setWizardData({ ...wizardData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Talent Category & Industry Specialization */}
              {wizardStep === 2 && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-white">Tell Us About Your Talent</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      Select your primary category and discipline so we can recommend the perfect showcase templates.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TALENT_CATEGORIES.slice(0, 8).map(cat => {
                      const isSelected = wizardData.category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, category: cat.value })}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <div className="text-2xl mb-1">{cat.icon}</div>
                          <div className="text-xs font-bold">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Professional Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. International Fashion Model / Film Actor"
                        value={wizardData.title || ''}
                        onChange={e => setWizardData({ ...wizardData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Base Location / City</label>
                      <input
                        type="text"
                        placeholder="e.g. Dubai, UAE / London, UK"
                        value={wizardData.location || ''}
                        onChange={e => setWizardData({ ...wizardData, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Choose Your Showcase Style (Embedded TalentTemplateSelector) */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <TalentTemplateSelector
                    currentTalent={wizardData}
                    selectedTemplateId={wizardData.portfolioTheme?.templateId || 'editorial-vogue'}
                    onSelectTemplate={(tmplId) => {
                      const tmpl = TALENT_PORTFOLIO_TEMPLATES.find(t => t.id === tmplId);
                      if (tmpl) {
                        setWizardData({
                          ...wizardData,
                          portfolioTheme: {
                            templateId: tmpl.id,
                            accentColor: tmpl.accentColor,
                            fontStyle: tmpl.fontStyle,
                            heroLayout: tmpl.heroLayout,
                            galleryLayout: tmpl.galleryLayout,
                            showMeasurements: true,
                            showShowreelFirst: tmpl.id === 'cinema-noir' || tmpl.id === 'creative-pop',
                            customHeading: tmpl.tagline
                          }
                        });
                        setWizardStep(4);
                      }
                    }}
                    isWizardStep={true}
                    onProceedNext={() => setWizardStep(4)}
                  />
                </div>
              )}

              {/* STEP 4: Live Desktop & Mobile Preview */}
              {wizardStep === 4 && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-white">Live Showcase Preview</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      Check how your profile looks in the chosen style on both desktop screens and mobile phones.
                    </p>
                  </div>

                  {(() => {
                    const activeTmpl = TALENT_PORTFOLIO_TEMPLATES.find(
                      t => t.id === (wizardData.portfolioTheme?.templateId || 'editorial-vogue')
                    ) || TALENT_PORTFOLIO_TEMPLATES[0];

                    return (
                      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                              {activeTmpl.badge}
                            </span>
                            <h3 className="text-xl font-bold text-white">{activeTmpl.name}</h3>
                          </div>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                            ✓ Ready for Customization
                          </span>
                        </div>

                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative">
                          <img
                            src={activeTmpl.previewImage}
                            alt={activeTmpl.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex items-end p-6">
                            <div className="space-y-1">
                              <h4 className="text-2xl font-black text-white">{wizardData.displayName || 'Your Name'}</h4>
                              <p className="text-amber-400 text-xs font-bold">{wizardData.title || activeTmpl.demoData.headline}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* STEP 5: Confirm Template Selection */}
              {wizardStep === 5 && (
                <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white">Template Selected ✓</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Your showcase layout has been locked into your profile. You can always change themes or customize colors later from your dashboard.
                    </p>
                  </div>
                  <button
                    onClick={() => setWizardStep(6)}
                    className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20"
                  >
                    Continue to Customize Details →
                  </button>
                </div>
              )}

              {/* STEP 6: Quick Content Customization */}
              {wizardStep === 6 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-white">Customize Your Showcase Details</h4>
                    <p className="text-zinc-400 text-xs sm:text-sm">
                      Add your biography, core disciplines, and day rate to start booking opportunities.
                    </p>
                  </div>

                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Biography & Creative Vision</label>
                      <textarea
                        rows={3}
                        placeholder="Tell clients and scouts about your career milestones and style..."
                        value={wizardData.bio || ''}
                        onChange={e => setWizardData({ ...wizardData, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Target Day Rate (INR ₹)</label>
                        <input
                          type="text"
                          placeholder="e.g. 35,000"
                          value={wizardData.dayRate || ''}
                          onChange={e => setWizardData({ ...wizardData, dayRate: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Total Followers / Reach</label>
                        <input
                          type="text"
                          placeholder="e.g. 500K / 2.1M"
                          value={wizardData.followerCount || ''}
                          onChange={e => setWizardData({ ...wizardData, followerCount: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-xs focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Final Review & Publish! */}
              {wizardStep === 7 && (
                <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in py-8">
                  <div className="w-20 h-20 bg-amber-400/20 border border-amber-400/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400 text-3xl shadow-xl">
                    🎉
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white">Your Showcase is Ready!</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Congratulations! Your professional Velametric Talent Showcase is live and ready to attract scouting opportunities.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (currentTalent) {
                          const updated = talentService.update(currentTalent.id, {
                            ...wizardData,
                            status: 'active'
                          });
                          if (updated) {
                            setCurrentTalent(updated);
                            setProfileForm(updated);
                          }
                        }
                        setShowWizardModal(false);
                      }}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Go to Dashboard
                    </button>

                    <Link
                      to={currentTalent ? `/talent/${currentTalent.id}` : '/talents'}
                      target="_blank"
                      onClick={() => setShowWizardModal(false)}
                      className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-400/25 flex items-center gap-2"
                    >
                      <ExternalLink size={14} /> View Live Showcase
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Wizard Navigation Footer */}
            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={13} /> Back
              </button>

              <div className="flex items-center gap-3">
                {wizardStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentTalent) {
                        talentService.update(currentTalent.id, wizardData);
                      }
                      setWizardStep(prev => Math.min(prev + 1, 7));
                    }}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentTalent) {
                        talentService.update(currentTalent.id, {
                          ...wizardData,
                          status: 'active'
                        });
                      }
                      setShowWizardModal(false);
                    }}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Complete & Publish ✓
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TalentDashboardPage;
