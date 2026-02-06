const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  errors?: Record<string, string>;
}

class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    errors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

function getAuthToken(): string | null {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  try {
    const parsed = JSON.parse(auth);
    return parsed.tokens?.accessToken || null;
  } catch {
    return null;
  }
}

function setAuthData(data: AuthResponse): void {
  localStorage.setItem("auth", JSON.stringify(data));
}

function clearAuthData(): void {
  localStorage.removeItem("auth");
}

function getAuthData(): AuthResponse | null {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  try {
    return JSON.parse(auth);
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data: ApiResponse<T>;

  try {
    data = await response.json();
  } catch {
    throw new ApiError("Network error", response.status);
  }

  if (!response.ok || !data.success) {
    if (response.status === 401) {
      clearAuthData();
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    throw new ApiError(
      data.message || "An error occurred",
      response.status,
      data.code,
      data.errors,
    );
  }

  return data.data as T;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: "admin" | "organization" | "public";
  avatar?: string;
  createdAt?: string;
  organization?: {
    id: string;
    name: string;
    verified: boolean;
    industry?: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserData;
  organization?: {
    id: string;
    name: string;
    verified: boolean;
  };
  tokens: AuthTokens;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  industry: string;
  website?: string;
  description?: string;
  contactPerson: string;
  contactEmail: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry: string;
  contactPerson: string;
  contactEmail: string;
  verified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  track: "software" | "hardware";
  category: string;
  industry: string;
  expectedOutcome: string;
  techStack?: string[];
  difficulty: "easy" | "medium" | "hard";
  datasets?: string;
  apiLinks?: string;
  referenceLinks?: string[];
  ndaRequired: boolean;
  mentorsProvided: boolean;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  featured: boolean;
  contactPerson: string;
  contactEmail: string;
  organization: {
    id: string;
    name: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  track: "software" | "hardware";
  category: string;
  industry: string;
  expectedOutcome: string;
  techStack?: string[];
  difficulty: "easy" | "medium" | "hard";
  datasets?: string;
  apiLinks?: string;
  referenceLinks?: string[];
  ndaRequired?: boolean;
  mentorsProvided?: boolean;
  contactPerson: string;
  contactEmail: string;
}

export interface PaginatedResponse<T> {
  problems?: T[];
  organizations?: T[];
  logs?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProblemFilters {
  search?: string;
  track?: "software" | "hardware";
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  page?: number;
  limit?: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
  action: string;
  targetType: "problem" | "organization" | "user";
  targetId: string;
  details: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardStats {
  problems: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    featured: number;
  };
  organizations: {
    total: number;
    verified: number;
    unverified: number;
  };
  recentActivity: Array<{
    id: string;
    adminName: string;
    action: string;
    targetType: string;
    details: string;
    createdAt: string;
  }>;
}

export interface OrgDashboard {
  organization: Organization;
  stats: {
    totalProblems: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  recentProblems: Array<{
    id: string;
    title: string;
    track: string;
    category: string;
    status: string;
    createdAt: string;
  }>;
}

export const api = {
  auth: {
    register: (data: RegisterInput) =>
      request<AuthResponse>("/auth/register", { method: "POST", body: data }),

    loginOrganization: (data: LoginInput) =>
      request<AuthResponse>("/auth/login/organization", {
        method: "POST",
        body: data,
      }),

    loginAdmin: (data: LoginInput) =>
      request<AuthResponse>("/auth/login/admin", {
        method: "POST",
        body: data,
      }),

    me: () => request<UserData>("/auth/me"),

    logout: () => request<void>("/auth/logout", { method: "POST" }),

    refresh: (refreshToken: string) =>
      request<{ accessToken: string }>("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      }),
  },

  problems: {
    list: async (filters: ProblemFilters = {}): Promise<ProblemStatement[]> => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.track) params.set("track", filters.track);
      if (filters.category) params.set("category", filters.category);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      const query = params.toString();
      const response = await request<PaginatedResponse<ProblemStatement>>(
        `/problems${query ? `?${query}` : ""}`,
      );
      return response.problems ?? [];
    },

    getById: (id: string) => request<ProblemStatement>(`/problems/${id}`),

    getFeatured: () => request<ProblemStatement[]>("/problems/featured"),

    getRecent: (limit = 6) =>
      request<ProblemStatement[]>(`/problems/recent?limit=${limit}`),

    getPublicStats: () =>
      request<{
        totalProblems: number;
        totalOrganizations: number;
        totalCategories: number;
        byTrack: Record<string, number>;
      }>("/problems/stats/public"),
  },

  org: {
    getDashboard: async () => {
      const data = await request<OrgDashboard>("/org/dashboard");
      return {
        organization: data.organization,
        totalProblems: data.stats?.totalProblems ?? 0,
        pendingProblems: data.stats?.pending ?? 0,
        approvedProblems: data.stats?.approved ?? 0,
        rejectedProblems: data.stats?.rejected ?? 0,
        recentProblems: data.recentProblems ?? [],
      };
    },

    getProfile: () => request<Organization>("/org/profile"),

    updateProfile: (data: Partial<Organization>) =>
      request<Organization>("/org/profile", { method: "PUT", body: data }),

    getProblems: () => request<ProblemStatement[]>("/org/problems"),

    createProblem: (data: CreateProblemInput) =>
      request<ProblemStatement>("/org/problems", {
        method: "POST",
        body: data,
      }),

    updateProblem: (id: string, data: Partial<CreateProblemInput>) =>
      request<ProblemStatement>(`/org/problems/${id}`, {
        method: "PUT",
        body: data,
      }),

    deleteProblem: (id: string) =>
      request<void>(`/org/problems/${id}`, { method: "DELETE" }),
  },

  admin: {
    getDashboard: async () => {
      const stats = await request<DashboardStats>("/admin/dashboard");
      return {
        totalProblems: stats.problems?.total ?? 0,
        pendingProblems: stats.problems?.pending ?? 0,
        approvedProblems: stats.problems?.approved ?? 0,
        rejectedProblems: stats.problems?.rejected ?? 0,
        featuredProblems: stats.problems?.featured ?? 0,
        totalOrganizations: stats.organizations?.total ?? 0,
        verifiedOrganizations: stats.organizations?.verified ?? 0,
      };
    },

    getProblems: async (
      filters: ProblemFilters & { status?: string } = {},
    ): Promise<ProblemStatement[]> => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.track) params.set("track", filters.track);
      if (filters.status) params.set("status", filters.status);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      const query = params.toString();
      const response = await request<PaginatedResponse<ProblemStatement>>(
        `/admin/problems${query ? `?${query}` : ""}`,
      );
      return response.problems ?? [];
    },

    getPendingProblems: () =>
      request<ProblemStatement[]>("/admin/problems/pending"),

    getProblemById: (id: string) =>
      request<ProblemStatement>(`/admin/problems/${id}`),

    reviewProblem: (
      id: string,
      status: "approved" | "rejected",
      adminNotes?: string,
    ) =>
      request<ProblemStatement>(`/admin/problems/${id}/review`, {
        method: "POST",
        body: { status, adminNotes },
      }),

    setFeatured: (id: string, featured: boolean) =>
      request<ProblemStatement>(`/admin/problems/${id}/feature`, {
        method: "POST",
        body: { featured },
      }),

    getOrganizations: (
      filters: { verified?: boolean; page?: number; limit?: number } = {},
    ) => {
      const params = new URLSearchParams();
      if (filters.verified !== undefined)
        params.set("verified", String(filters.verified));
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      const query = params.toString();
      return request<PaginatedResponse<Organization>>(
        `/admin/organizations${query ? `?${query}` : ""}`,
      );
    },

    getOrganizationById: (id: string) =>
      request<Organization>(`/admin/organizations/${id}`),

    verifyOrganization: (id: string, verified: boolean) =>
      request<Organization>(`/admin/organizations/${id}/verify`, {
        method: "POST",
        body: { verified },
      }),

    getAuditLogs: async (
      filters: { page?: number; limit?: number } = {},
    ): Promise<AuditLog[]> => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      const query = params.toString();
      const response = await request<PaginatedResponse<AuditLog>>(
        `/admin/audit${query ? `?${query}` : ""}`,
      );
      return response.logs ?? [];
    },

    getRecentActivity: (limit = 10) =>
      request<AuditLog[]>(`/admin/activity?limit=${limit}`),
  },
};

export { ApiError, setAuthData, clearAuthData, getAuthData, getAuthToken };
