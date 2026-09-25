import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { LightDotCursor } from './components/common/LightDotCursor';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { PortfolioPage } from './pages/public/PortfolioPage';
import { PortfolioDetailPage } from './pages/public/PortfolioDetailPage';
import { CaseStudiesPage } from './pages/public/CaseStudiesPage';
import { CaseStudyDetailPage } from './pages/public/CaseStudyDetailPage';
import { ResourcesPage, ResourceDetailPage } from './pages/public/ResourcesPage';
import { ContactPage, QuoteRequestPage } from './pages/public/ContactPage';
import { ProductTrialPage } from './pages/public/ProductTrialPage';
import { CareersPage } from './pages/public/CareersPage';
import { ConsultationBookingPage } from './pages/public/ConsultationBookingPage';
import { DocumentGeneratorPage } from './pages/public/DocumentGeneratorPage';
import { EventRegistrationPage } from './pages/public/EventRegistrationPage';
import { SponsorRegistrationPage } from './pages/public/SponsorRegistrationPage';
import { PartnerShowcasePage } from './pages/public/PartnerShowcasePage';
import { CreatorPortfolioPage } from './pages/public/CreatorPortfolioPage';
import { LegalPages } from './pages/public/LegalPages';

import { AdminLayout } from './components/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { Dashboard } from './pages/admin/Dashboard';
import { HomepageBuilder } from './pages/admin/HomepageBuilder';
import { LeadsCRM } from './pages/admin/LeadsCRM';
import { PipelineKanban } from './pages/admin/PipelineKanban';
import { FollowUps } from './pages/admin/FollowUps';
import { ServicesCMS } from './pages/admin/ServicesCMS';
import { TestimonialsCMS } from './pages/admin/TestimonialsCMS';
import { PortfolioCMS, CaseStudiesCMS } from './pages/admin/PortfolioCMS';
import { ProposalsInvoices } from './pages/admin/ProposalsInvoices';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { SiteSettingsAdmin, NavigationAdmin } from './pages/admin/SiteSettingsAdmin';
import { EventsAdmin } from './pages/admin/EventsAdmin';
import { CommunicationCenterAdmin } from './pages/admin/CommunicationCenterAdmin';
import { ReelMarketingAdmin } from './pages/admin/ReelMarketingAdmin';
import { UserManagementAdmin } from './pages/admin/UserManagementAdmin';
import { RolesPermissionsAdmin } from './pages/admin/RolesPermissionsAdmin';
import { DepartmentsAdmin } from './pages/admin/DepartmentsAdmin';
import { SecurityAuditAdmin } from './pages/admin/SecurityAuditAdmin';
import { InitialSetupAdmin } from './pages/admin/InitialSetupAdmin';
import { DocumentStudioAdmin } from './pages/admin/DocumentStudioAdmin';
import { DelegationAdmin } from './pages/admin/DelegationAdmin';
import { BlogCMS } from './pages/admin/BlogCMS';
import { InternalCommunicationAdmin } from './pages/admin/InternalCommunicationAdmin';
import { TalentPortfolioPage } from './pages/public/TalentPortfolioPage';
import { TalentProfilePage } from './pages/public/TalentProfilePage';
import { TalentDashboardPage } from './pages/talent/TalentDashboardPage';
import { TalentManagementAdmin } from './pages/admin/TalentManagementAdmin';

// ScrollToTop Component: Always scroll to top of page upon route or anchor button click
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <AudioProvider>
              <LightDotCursor />
              <ScrollToTop />
              <Routes>
              {/* PUBLIC WEBSITE ROUTES (NO LOGIN REQUIRED) */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="services/:slug" element={<ServiceDetailPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
                <Route path="partners" element={<PartnerShowcasePage />} />
                <Route path="partners/:partnerSlug" element={<PartnerShowcasePage />} />
                <Route path="case-studies" element={<CaseStudiesPage />} />
                <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="resources/:slug" element={<ResourceDetailPage />} />
                <Route path="blog" element={<ResourcesPage />} />
                <Route path="blog/:slug" element={<ResourceDetailPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="request-quote" element={<QuoteRequestPage />} />
                <Route path="free-trial" element={<ProductTrialPage />} />
                <Route path="trial" element={<ProductTrialPage />} />
                <Route path="product-trial" element={<ProductTrialPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="book-consultation" element={<ConsultationBookingPage />} />
                <Route path="book-call" element={<ConsultationBookingPage />} />
                <Route path="tools/document-generator" element={<DocumentGeneratorPage />} />
                <Route path="tools/document-generator/wizard" element={<DocumentGeneratorPage />} />
                <Route path="document-generator" element={<DocumentGeneratorPage />} />
                <Route path="event-registration" element={<EventRegistrationPage />} />
                <Route path="sponsor-registration" element={<SponsorRegistrationPage />} />
                <Route path="become-a-sponsor" element={<SponsorRegistrationPage />} />
                {/* MODEL & CREATOR SHOWCASE SYSTEM ROUTES */}
                <Route path="models" element={<TalentPortfolioPage defaultCategory="model" isModelFocused={true} defaultTitle="Elite Models & Fashion Roster" />} />
                <Route path="models/:id" element={<TalentProfilePage />} />
                <Route path="model/:id" element={<TalentProfilePage />} />
                <Route path="model-portfolio" element={<CreatorPortfolioPage />} />
                <Route path="talent-showcase" element={<CreatorPortfolioPage />} />
                <Route path="creator-portfolio" element={<CreatorPortfolioPage />} />
                <Route path="work-showcase" element={<CreatorPortfolioPage />} />
                
                {/* TALENT PORTFOLIO SYSTEM ROUTES */}
                <Route path="talent-portfolio" element={<TalentPortfolioPage />} />
                <Route path="talents" element={<TalentPortfolioPage />} />
                <Route path="talent" element={<TalentPortfolioPage />} />
                <Route path="talent/:id" element={<TalentProfilePage />} />
                <Route path="talent-dashboard" element={<TalentDashboardPage />} />
                <Route path="talent-login" element={<TalentDashboardPage defaultTab="login" />} />
                <Route path="talent-register" element={<TalentDashboardPage defaultTab="register" />} />
                
                <Route path="privacy-policy" element={<LegalPages />} />
                <Route path="terms-and-conditions" element={<LegalPages />} />
                <Route path="payment-terms" element={<LegalPages />} />
              </Route>

              {/* PUBLIC LOGIN ROUTES */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* DIRECT TALENT DASHBOARD & AUTH ROUTES */}
              <Route path="/talent-dashboard" element={<TalentDashboardPage />} />
              <Route path="/talent-login" element={<TalentDashboardPage defaultTab="login" />} />
              <Route path="/talent-register" element={<TalentDashboardPage defaultTab="register" />} />

              {/* MANDATORY AUTHENTICATED PRIVATE ADMIN & DASHBOARD ROUTES */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UserManagementAdmin />} />
                <Route path="roles" element={<RolesPermissionsAdmin />} />
                <Route path="departments" element={<DepartmentsAdmin />} />
                <Route path="security" element={<SecurityAuditAdmin />} />
                <Route path="setup" element={<InitialSetupAdmin />} />
                <Route path="homepage-builder" element={<HomepageBuilder />} />
                <Route path="events" element={<EventsAdmin />} />
                <Route path="delegation" element={<DelegationAdmin />} />
                <Route path="task-delegation" element={<DelegationAdmin />} />
                
                {/* TALENT MANAGEMENT ADMIN */}
                <Route path="talents" element={<TalentManagementAdmin />} />
                <Route path="talent-management" element={<TalentManagementAdmin />} />
                
                {/* LEADS & CRM ROUTES */}
                <Route path="leads" element={<LeadsCRM />} />
                <Route path="crm/leads" element={<LeadsCRM />} />
                <Route path="crm/leads/new" element={<LeadsCRM />} />
                <Route path="crm/leads/import" element={<LeadsCRM />} />
                <Route path="crm/leads/:id" element={<LeadsCRM />} />

                <Route path="pipeline" element={<PipelineKanban />} />
                <Route path="follow-ups" element={<FollowUps />} />
                <Route path="communication" element={<CommunicationCenterAdmin />} />
                <Route path="marketing/reels" element={<ReelMarketingAdmin />} />
                <Route path="campaigns" element={<ReelMarketingAdmin />} />

                {/* INDEPENDENT CONTENT CMS ROUTES */}
                <Route path="services" element={<ServicesCMS />} />
                <Route path="content/services" element={<ServicesCMS />} />
                <Route path="content/services/new" element={<ServicesCMS />} />
                <Route path="content/services/:id/edit" element={<ServicesCMS />} />

                <Route path="portfolio" element={<PortfolioCMS />} />
                <Route path="case-studies" element={<CaseStudiesCMS />} />

                <Route path="testimonials" element={<TestimonialsCMS />} />
                <Route path="content/testimonials" element={<TestimonialsCMS />} />
                <Route path="content/testimonials/new" element={<TestimonialsCMS />} />
                <Route path="content/testimonials/:id/edit" element={<TestimonialsCMS />} />

                <Route path="pages" element={<HomepageBuilder />} />
                <Route path="navigation" element={<NavigationAdmin />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="blog" element={<BlogCMS />} />
                <Route path="team-chat" element={<InternalCommunicationAdmin />} />
                <Route path="internal-communication" element={<InternalCommunicationAdmin />} />
                <Route path="proposals" element={<ProposalsInvoices />} />
                <Route path="invoices" element={<ProposalsInvoices />} />
                <Route path="payments" element={<ProposalsInvoices />} />
                <Route path="documents" element={<DocumentStudioAdmin />} />
                <Route path="documentation" element={<DocumentStudioAdmin />} />
                <Route path="clients" element={<LeadsCRM />} />
                <Route path="team" element={<Dashboard />} />
                <Route path="notifications" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<SiteSettingsAdmin />} />
              </Route>

              {/* FALLBACK CATCH-ALL ROUTE */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AudioProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
};
export default App;
