// Types for the hackathon portal

export type UserRole = 'admin' | 'organization' | 'student' | 'public';

export type Track = 'software' | 'hardware';

export type ProblemStatus = 'pending' | 'approved' | 'rejected';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry: string;
  contactPerson: string;
  contactEmail: string;
  verified: boolean;
  createdAt: Date;
}

export interface ProblemStatement {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  
  // Core fields
  title: string;
  description: string;
  track: Track;
  category: string;
  industry: string;
  
  // Details
  expectedOutcome: string;
  techStack?: string[];
  difficulty: DifficultyLevel;
  
  // Resources
  datasets?: string;
  apiLinks?: string;
  referenceLinks?: string[];
  
  // Options
  ndaRequired: boolean;
  mentorsProvided: boolean;
  
  // Status
  status: ProblemStatus;
  adminNotes?: string;
  featured: boolean;
  
  // Metadata
  contactPerson: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'problem' | 'organization' | 'user';
  targetId: string;
  details: string;
  createdAt: Date;
}

// Categories
export const SOFTWARE_CATEGORIES = [
  'HealthTech, BioTech & MedTech',
  'EdTech & Smart Learning',
  'AI, Generative AI, Agentic AI & Intelligent Automation',
  'Cybersecurity, Blockchain & Digital Trust',
  'FinTech & Digital Economy',
  'ClimateTech, AgriTech & Sustainability',
  'Smart Cities, Mobility & Infrastructure',
] as const;

export const HARDWARE_CATEGORIES = [
  'IoT & Smart Devices',
  'Robotics & Automation',
  'Embedded Systems & Edge Computing',
  'Smart Energy & Green Hardware',
  'Healthcare & Assistive Hardware',
] as const;

export type SoftwareCategory = typeof SOFTWARE_CATEGORIES[number];
export type HardwareCategory = typeof HARDWARE_CATEGORIES[number];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Energy',
  'Agriculture',
  'Transportation',
  'Government',
  'Non-Profit',
  'Research',
  'Other',
] as const;

export type Industry = typeof INDUSTRIES[number];
