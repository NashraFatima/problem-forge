import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { OrgLayout } from "@/layouts/OrgLayout";

// Public Pages
import HomePage from "@/pages/HomePage";
import ProblemsPage from "@/pages/public/ProblemsPage";
import ProblemDetailPage from "@/pages/public/ProblemDetailPage";

// Auth Pages
import OrgLoginPage from "@/pages/auth/OrgLoginPage";
import OrgRegisterPage from "@/pages/auth/OrgRegisterPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";

// Organization Pages
import OrgDashboard from "@/pages/org/OrgDashboard";
import OrgProblemsPage from "@/pages/org/OrgProblemsPage";
import SubmitProblemPage from "@/pages/org/SubmitProblemPage";
import OrgProfilePage from "@/pages/org/OrgProfilePage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProblemsPage from "@/pages/admin/AdminProblemsPage";
import AdminPendingPage from "@/pages/admin/AdminPendingPage";
import AdminOrganizationsPage from "@/pages/admin/AdminOrganizationsPage";
import AdminAuditPage from "@/pages/admin/AdminAuditPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<ProblemDetailPage />} />
            </Route>

            {/* Auth Routes (no layout) */}
            <Route path="/org/login" element={<OrgLoginPage />} />
            <Route path="/org/register" element={<OrgRegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Organization Routes */}
            <Route path="/org" element={<OrgLayout />}>
              <Route index element={<OrgDashboard />} />
              <Route path="problems" element={<OrgProblemsPage />} />
              <Route path="submit" element={<SubmitProblemPage />} />
              <Route path="profile" element={<OrgProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="problems" element={<AdminProblemsPage />} />
              <Route path="pending" element={<AdminPendingPage />} />
              <Route path="organizations" element={<AdminOrganizationsPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
