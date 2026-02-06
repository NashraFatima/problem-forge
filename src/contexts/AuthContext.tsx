import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  api,
  type UserData,
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
  setAuthData,
  clearAuthData,
  getAuthData,
} from "@/lib/api";

type UserRole = "admin" | "organization" | "public";

interface AuthContextType {
  user: UserData | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  organization: AuthResponse["organization"] | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [organization, setOrganization] = useState<
    AuthResponse["organization"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const role: UserRole = user?.role || "public";
  const isAuthenticated = !!user && role !== "public";

  const initializeAuth = useCallback(async () => {
    const storedAuth = getAuthData();

    if (storedAuth?.tokens?.accessToken) {
      try {
        const userData = await api.auth.me();
        setUser(userData);
        setOrganization(userData.organization || null);
      } catch {
        clearAuthData();
        setUser(null);
        setOrganization(null);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setOrganization(null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (
    email: string,
    password: string,
    loginRole: UserRole,
  ) => {
    const credentials: LoginInput = { email, password };

    let response: AuthResponse;

    if (loginRole === "admin") {
      response = await api.auth.loginAdmin(credentials);
    } else {
      response = await api.auth.loginOrganization(credentials);
    }

    setAuthData(response);
    setUser(response.user);
    setOrganization(response.organization || null);
  };

  const register = async (data: RegisterInput) => {
    const response = await api.auth.register(data);

    setAuthData(response);
    setUser(response.user);
    setOrganization(response.organization || null);
  };

  const logout = () => {
    api.auth.logout().catch(() => {});
    clearAuthData();
    setUser(null);
    setOrganization(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.me();
      setUser(userData);
      setOrganization(userData.organization || null);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        organization,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
