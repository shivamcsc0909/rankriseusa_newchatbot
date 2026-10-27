import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import { SkeletonPage } from '@/components/ui/SkeletonModel';

import HomePage from './pages/HomePage';

const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PricingPage = lazy(() => import('./pages/Pricing'));
const FreeAuditPage = lazy(() => import('./pages/FreeAuditPage'));
const CustomPlanPage = lazy(() => import('@/pages/CustomPlanPage'));
const Costcalculatorpage = lazy(() => import('@/pages/Costcalculatorpage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const RefundCancellationPage = lazy(() => import('@/pages/RefundCancellationPage'));
const DisclaimerPage = lazy(() => import('@/pages/DisclaimerPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const CookiesPolicyPage = lazy(() => import('@/pages/CookiesPolicyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
// const ChatWidget = lazy(() => import('@/chat').then((m) => ({ default: m.ChatWidget })));
const AdminApp = lazy(() => import('@/admin/AdminApp'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppChrome({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full relative">
      <ScrollProgress />
      <Navigation />
      <main className="overflow-x-hidden max-w-full relative">{children}</main>
      <Footer />
      {/* Custom Chatbot commented out - Using Tawk.to Live Chat */}
      {/* <Suspense fallback={null}>
        <ChatWidget />
      </Suspense> */}
    </div>
  );
}

export default function App() {
  const [isLoading] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppChrome>
          <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>
          <Suspense fallback={<SkeletonPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/free-audit" element={<FreeAuditPage />} />
              <Route path="/custom-plan" element={<CustomPlanPage />} />
              <Route path="/cost-calculator" element={<Costcalculatorpage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/refund-cancellation" element={<RefundCancellationPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppChrome>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}
