import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "organization")[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the attempted route
    const loginPath = location.pathname.startsWith("/admin")
      ? "/admin/login"
      : "/org/login";

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role as "admin" | "organization")
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
