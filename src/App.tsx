import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

// Public
import HomePage from "@/pages/HomePage";
import ProblemsPage from "@/pages/public/ProblemsPage";
import ProblemDetailPage from "@/pages/public/ProblemDetailPage";

// Auth
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import OrgLoginPage from "@/pages/auth/OrgLoginPage";
import OrgRegisterPage from "@/pages/auth/OrgRegisterPage";

// Admin Pages
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProblemsPage from "@/pages/admin/AdminProblemsPage";
import AdminPendingPage from "@/pages/admin/AdminPendingPage";
import AdminOrganizationsPage from "@/pages/admin/AdminOrganizationsPage";
import AdminAuditPage from "@/pages/admin/AdminAuditPage";

// Org Pages
import { OrgLayout } from "@/layouts/OrgLayout";
import OrgDashboard from "@/pages/org/OrgDashboard";
import OrgProblemsPage from "@/pages/org/OrgProblemsPage";
import OrgProfilePage from "@/pages/org/OrgProfilePage";
import SubmitProblemPage from "@/pages/org/SubmitProblemPage";

// 404
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:id" element={<ProblemDetailPage />} />

            {/* Auth */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/org/login" element={<OrgLoginPage />} />
            <Route path="/org/register" element={<OrgRegisterPage />} />

            {/* Admin (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="problems" element={<AdminProblemsPage />} />
              <Route path="pending" element={<AdminPendingPage />} />
              <Route
                path="organizations"
                element={<AdminOrganizationsPage />}
              />
              <Route path="audit" element={<AdminAuditPage />} />
            </Route>

            {/* Organization (Protected) */}
            <Route
              path="/org"
              element={
                <ProtectedRoute allowedRoles={["organization"]}>
                  <OrgLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OrgDashboard />} />
              <Route path="problems" element={<OrgProblemsPage />} />
              <Route path="profile" element={<OrgProfilePage />} />
              <Route path="submit" element={<SubmitProblemPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
