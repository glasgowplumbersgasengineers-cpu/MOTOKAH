import { Component, lazy, Suspense, useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "monospace" }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{(this.state.error as Error).message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{(this.state.error as Error).stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { AnimatePresence, motion } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { WishlistProvider } from "@/hooks/useWishlist";
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import BottomNav from "@/components/BottomNav";
import { usePageTracking } from "@/hooks/usePageTracking";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const Index = lazy(() => import("./pages/Index.tsx"));
const ListingDetail = lazy(() => import("./pages/ListingDetail.tsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const SellCar = lazy(() => import("./pages/SellCar.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));
const Messages = lazy(() => import("./pages/Messages.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const HowItWorks = lazy(() => import("./pages/HowItWorks.tsx"));
const Safety = lazy(() => import("./pages/Safety.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Careers = lazy(() => import("./pages/Careers.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const DealerDirectory = lazy(() => import("./pages/DealerDirectory.tsx"));
const DealerProfilePage = lazy(() => import("./pages/DealerProfile.tsx"));
const BecomeDealer = lazy(() => import("./pages/BecomeDealer.tsx"));
const DealerDashboard = lazy(() => import("./pages/DealerDashboard.tsx"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview.tsx"));
const AdminListings = lazy(() => import("./pages/admin/AdminListings.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.tsx"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog.tsx"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts.tsx"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter.tsx"));
const AdminDealers = lazy(() => import("./pages/admin/AdminDealers.tsx"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent.tsx"));
const DutyCalculator = lazy(() => import("./pages/DutyCalculator.tsx"));
const DealerLeads = lazy(() => import("./pages/DealerLeads.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const CityLandingPage = lazy(() => import("./pages/CityLandingPage.tsx"));
const CountryLandingPage = lazy(() => import("./pages/CountryLandingPage.tsx"));
const Welcome = lazy(() => import("./pages/Welcome.tsx"));
const Stationery = lazy(() => import("./pages/Stationery.tsx"));
const InstagramShowroom = lazy(() => import("./pages/InstagramShowroom.tsx"));
const PromoVideo = lazy(() => import("./pages/PromoVideo.tsx"));
const ModelLandingPage = lazy(() => import("./pages/ModelLandingPage.tsx"));
const BrandCentre = lazy(() => import("./pages/BrandCentre.tsx"));

function RouteLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  usePageTracking();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{ minHeight: "100vh" }}
        className="overflow-x-hidden"
      >
        <Suspense fallback={<RouteLoader />}>
        <Routes location={location}>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/" element={<Index />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cars" element={<Navigate to="/search" replace />} />
              <Route path="/listings" element={<Navigate to="/search" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/post-ad" element={<Navigate to="/sell" replace />} />
              <Route path="/sell" element={<SellCar />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/stationery" element={<Stationery />} />
              <Route path="/dealers" element={<DealerDirectory />} />
              <Route path="/dealer/:id" element={<DealerProfilePage />} />
              <Route path="/become-dealer" element={<ProtectedRoute><BecomeDealer /></ProtectedRoute>} />
              <Route path="/dealer-dashboard" element={<ProtectedRoute><DealerDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="dealers" element={<AdminDealers />} />
                <Route path="content" element={<AdminContent />} />
              </Route>
              <Route path="/content" element={<ProtectedRoute><div className="min-h-screen bg-background p-4 md:p-8 max-w-5xl mx-auto"><AdminContent /></div></ProtectedRoute>} />
              <Route path="/marketing-plan" element={<Navigate to="/" replace />} />
              <Route path="/duty-calculator" element={<DutyCalculator />} />
              <Route path="/dealer-leads" element={<DealerLeads />} />
              <Route path="/city/:slug" element={<CityLandingPage />} />
              <Route path="/country/:slug" element={<CountryLandingPage />} />
              <Route path="/showroom/:username" element={<InstagramShowroom />} />
              <Route path="/promo" element={<PromoVideo />} />
              <Route path="/brand-centre" element={<BrandCentre />} />
              <Route path="/cars/:make/:model" element={<ModelLandingPage />} />
              <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <LocationProvider>
              <CurrencyProvider>
              <AuthProvider>
                <WishlistProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <PWAInstallBanner />
                    <BrowserRouter>
                      <BottomNav />
                      <AnimatedRoutes />
                    </BrowserRouter>
                  </TooltipProvider>
                </WishlistProvider>
              </AuthProvider>
              </CurrencyProvider>
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
