import { z } from "zod";
import {
  TRACKS,
  SOFTWARE_CATEGORIES,
  HARDWARE_CATEGORIES,
  INDUSTRIES,
  DIFFICULTY_LEVELS,
  PROBLEM_STATUSES,
  USER_ROLES,
} from "../config/constants.js";

const ALL_CATEGORIES = [
  ...SOFTWARE_CATEGORIES,
  ...HARDWARE_CATEGORIES,
] as const;

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(200),
  industry: z.enum(INDUSTRIES, {
    errorMap: () => ({ message: "Invalid industry" }),
  }),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  contactPerson: z
    .string()
    .min(2, "Contact person name must be at least 2 characters")
    .max(100),
  contactEmail: z.string().email("Invalid contact email"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
  track: z.enum(TRACKS, { errorMap: () => ({ message: "Invalid track" }) }),
  category: z.enum(ALL_CATEGORIES, {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  industry: z.enum(INDUSTRIES, {
    errorMap: () => ({ message: "Invalid industry" }),
  }),
  expectedOutcome: z
    .string()
    .min(20, "Expected outcome must be at least 20 characters")
    .max(2000, "Expected outcome cannot exceed 2000 characters"),
  techStack: z.array(z.string()).optional().default([]),
  difficulty: z.enum(DIFFICULTY_LEVELS, {
    errorMap: () => ({ message: "Invalid difficulty level" }),
  }),
  datasets: z.string().max(1000).optional(),
  apiLinks: z.string().max(1000).optional(),
  referenceLinks: z.array(z.string().url("Invalid URL")).optional().default([]),
  ndaRequired: z.boolean().optional().default(false),
  mentorsProvided: z.boolean().optional().default(false),
  contactPerson: z.string().min(2).max(100),
  contactEmail: z.string().email("Invalid contact email"),
});

export const updateProblemSchema = createProblemSchema.partial();

export const reviewProblemSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  adminNotes: z.string().max(1000).optional(),
});

export const featureProblemSchema = z.object({
  featured: z.boolean(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.enum(INDUSTRIES).optional(),
  contactPerson: z.string().min(2).max(100).optional(),
  contactEmail: z.string().email().optional(),
  logo: z.string().optional(),
});

export const verifyOrganizationSchema = z.object({
  verified: z.boolean(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const problemFilterSchema = z.object({
  search: z.string().optional(),
  track: z.enum(TRACKS).optional(),
  category: z.string().optional(),
  difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
  status: z.enum(PROBLEM_STATUSES).optional(),
  featured: z.coerce.boolean().optional(),
  organizationId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;
export type ReviewProblemInput = z.infer<typeof reviewProblemSchema>;
export type FeatureProblemInput = z.infer<typeof featureProblemSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type VerifyOrganizationInput = z.infer<typeof verifyOrganizationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ProblemFilterInput = z.infer<typeof problemFilterSchema>;
