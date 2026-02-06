export const SOFTWARE_CATEGORIES = [
  "HealthTech, BioTech & MedTech",
  "EdTech & Smart Learning",
  "AI, Generative AI, Agentic AI & Intelligent Automation",
  "Cybersecurity, Blockchain & Digital Trust",
  "FinTech & Digital Economy",
  "ClimateTech, AgriTech & Sustainability",
  "Smart Cities, Mobility & Infrastructure",
] as const;

export const HARDWARE_CATEGORIES = [
  "IoT & Smart Devices",
  "Robotics & Automation",
  "Embedded Systems & Edge Computing",
  "Smart Energy & Green Hardware",
  "Healthcare & Assistive Hardware",
] as const;

export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Energy",
  "Agriculture",
  "Transportation",
  "Government",
  "Non-Profit",
  "Research",
  "Other",
] as const;

export const TRACKS = ["software", "hardware"] as const;
export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
export const PROBLEM_STATUSES = ["pending", "approved", "rejected"] as const;
export const USER_ROLES = ["admin", "organization", "public"] as const;
export const AUDIT_ACTIONS = [
  "APPROVE_PROBLEM",
  "REJECT_PROBLEM",
  "FEATURE_PROBLEM",
  "UNFEATURE_PROBLEM",
  "VERIFY_ORGANIZATION",
  "SUSPEND_ORGANIZATION",
  "CREATE_PROBLEM",
  "UPDATE_PROBLEM",
  "DELETE_PROBLEM",
] as const;

export type SoftwareCategory = (typeof SOFTWARE_CATEGORIES)[number];
export type HardwareCategory = (typeof HARDWARE_CATEGORIES)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type Track = (typeof TRACKS)[number];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
