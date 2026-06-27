import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Providers & Architecture
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Provider from './pages/Provider';
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import LegalTerms from './pages/LegalTerms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CategoryLandingPage from './pages/CategoryLandingPage';
import ServiceListing from './pages/ServiceListing';
import BookingPage from './pages/BookingPage';
import ProviderDetails from './pages/ProviderDetails';

// Protected Pages (Customers)
import UserDashboard from './pages/UserDashboard';
import ReviewPage from './pages/ReviewPage';
import LiveTracking from './pages/LiveTracking';
import BookingConfirmation from './pages/BookingConfirmation';
import ChatPage from './pages/ChatPage';
import AddressBook from './pages/AddressBook';
import InvoiceViewer from './pages/InvoiceViewer';
import NotificationsCenter from './pages/NotificationsCenter';
import SupportTickets from './pages/SupportTickets';

// Protected Pages (Providers)
import MyServicesManagement from './pages/MyServicesManagement';
import AddNewService from './pages/AddNewService';
import ProviderPanel from './pages/ProviderPanel';
import ProviderAvailability from './pages/ProviderAvailability';
import ProviderEarnings from './pages/ProviderEarnings';
import ProviderPortfolio from './pages/ProviderPortfolio';
import ProviderSubscription from './pages/ProviderSubscription';
import ProviderOnboardingStep1 from './pages/ProviderOnboardingStep1';
import ProviderOnboardingStep2 from './pages/ProviderOnboardingStep2';
import ProviderOnboardingStep3 from './pages/ProviderOnboardingStep3';
import VerificationStatus from './pages/VerificationStatus';

// Protected Pages (Admins)
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminCategories from './pages/AdminCategories';
import AdminReports from './pages/AdminReports';
import AdminVerificationQueue from './pages/AdminVerificationQueue';
import AdminVerificationDetail from './pages/AdminVerificationDetail';
import AdminSupport from './pages/AdminSupport';
import AdminUsers from './pages/AdminUsers';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), [pathname, search]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RoleProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-fixed">
                <Header />
                <div className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/booking-page" element={<BookingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/provider" element={<Provider />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/legal" element={<LegalTerms />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/provider-details" element={<ProviderDetails />} />
                    <Route path="/category" element={<CategoryLandingPage />} />
                    <Route path="/service-listing" element={<ServiceListing />} />

                    {/* Customer Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Customer', 'Admin']} />}>
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/review" element={<ReviewPage />} />
                      <Route path="/tracking" element={<LiveTracking />} />
                      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                      <Route path="/confirmation" element={<BookingConfirmation />} />
                      <Route path="/address-book" element={<AddressBook />} />
                      <Route path="/invoices" element={<InvoiceViewer />} />
                      <Route path="/notifications" element={<NotificationsCenter />} />
                      <Route path="/support" element={<SupportTickets />} />
                    </Route>

                    {/* Shared Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Customer', 'Provider', 'Admin']} />}>
                      <Route path="/chat" element={<ChatPage />} />
                    </Route>

                    {/* Provider Protected Routes (Approved Only) */}
                    <Route element={<ProtectedRoute allowedRoles={['Provider', 'Admin']} requireApprovedProvider />}>
                      <Route path="/provider-panel" element={<ProviderPanel />} />
                      <Route path="/my-services" element={<MyServicesManagement />} />
                      <Route path="/add-service" element={<AddNewService />} />
                      <Route path="/provider-earnings" element={<ProviderEarnings />} />
                      <Route path="/provider-availability" element={<ProviderAvailability />} />
                      <Route path="/provider-portfolio" element={<ProviderPortfolio />} />
                      <Route path="/provider-subscription" element={<ProviderSubscription />} />
                    </Route>
                    {/* Provider Onboarding (No approval required) */}
                    <Route element={<ProtectedRoute allowedRoles={['Provider', 'Admin']} />}>
                      <Route path="/onboarding-1" element={<ProviderOnboardingStep1 />} />
                      <Route path="/onboarding-2" element={<ProviderOnboardingStep2 />} />
                      <Route path="/onboarding-3" element={<ProviderOnboardingStep3 />} />
                      <Route path="/verification-status" element={<VerificationStatus />} />
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                      <Route path="/admin-dashboard" element={<AdminDashboard />} />
                      <Route path="/admin-analytics" element={<AdminAnalytics />} />
                      <Route path="/admin-categories" element={<AdminCategories />} />
                      <Route path="/admin-reports" element={<AdminReports />} />
                      <Route path="/admin-verification-queue" element={<AdminVerificationQueue />} />
                      <Route path="/admin-verification-detail" element={<AdminVerificationDetail />} />
                      <Route path="/admin/queue" element={<AdminVerificationQueue />} />
                      <Route path="/admin/detail" element={<AdminVerificationDetail />} />
                      <Route path="/admin-support" element={<AdminSupport />} />
                      <Route path="/admin-users" element={<AdminUsers />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </RoleProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
