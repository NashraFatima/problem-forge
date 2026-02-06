import { Types } from "mongoose";
import {
  problemRepository,
  type CreateProblemData,
  type UpdateProblemData,
  type ProblemFilter,
} from "../repositories/problemRepository.js";
import { organizationRepository } from "../repositories/organizationRepository.js";
import { auditLogRepository } from "../repositories/auditLogRepository.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../utils/errors.js";
import { type IProblemStatement } from "../models/ProblemStatement.js";
import { type AuditAction } from "../config/constants.js";
import { logger } from "../utils/logger.js";

export interface PaginationInput {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProblemListResponse {
  problems: Array<{
    id: string;
    title: string;
    description: string;
    track: string;
    category: string;
    industry: string;
    difficulty: string;
    status: string;
    featured: boolean;
    ndaRequired: boolean;
    mentorsProvided: boolean;
    organization: {
      id: string;
      name: string;
      logo?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function transformProblem(problem: IProblemStatement): any {
  const problemWithVirtuals = problem as any;
  const org = problemWithVirtuals.organization;
  return {
    id: problem._id.toString(),
    title: problem.title,
    description: problem.description,
    track: problem.track,
    category: problem.category,
    industry: problem.industry,
    expectedOutcome: problem.expectedOutcome,
    techStack: problem.techStack,
    difficulty: problem.difficulty,
    datasets: problem.datasets,
    apiLinks: problem.apiLinks,
    referenceLinks: problem.referenceLinks,
    ndaRequired: problem.ndaRequired,
    mentorsProvided: problem.mentorsProvided,
    status: problem.status,
    adminNotes: problem.adminNotes,
    featured: problem.featured,
    contactPerson: problem.contactPerson,
    contactEmail: problem.contactEmail,
    organization: org
      ? {
          id: org._id?.toString() || org.toString(),
          name: org.name || "Unknown",
          logo: org.logo,
        }
      : null,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
  };
}

export class ProblemService {
  async getPublicProblems(
    filter: Omit<ProblemFilter, "status">,
    pagination: PaginationInput,
  ): Promise<ProblemListResponse> {
    const { problems, total } = await problemRepository.findApproved(filter, {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy || "createdAt",
      sortOrder: pagination.sortOrder || "desc",
    });

    return {
      problems: problems.map(transformProblem),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getPublicProblemById(
    id: string,
  ): Promise<ReturnType<typeof transformProblem>> {
    const problem = await problemRepository.findByIdPublic(id);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    return transformProblem(problem);
  }

  async getFeaturedProblems(): Promise<ReturnType<typeof transformProblem>[]> {
    const problems = await problemRepository.findFeatured();
    return problems.map(transformProblem);
  }

  async getRecentProblems(
    limit = 6,
  ): Promise<ReturnType<typeof transformProblem>[]> {
    const problems = await problemRepository.findRecent(limit);
    return problems.map(transformProblem);
  }

  async getOrganizationProblems(
    organizationId: string,
  ): Promise<ReturnType<typeof transformProblem>[]> {
    const problems = await problemRepository.findByOrganization(organizationId);
    return problems.map(transformProblem);
  }

  async createProblem(
    organizationId: string,
    data: Omit<CreateProblemData, "organizationId">,
  ): Promise<ReturnType<typeof transformProblem>> {
    const organization = await organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const problem = await problemRepository.create({
      ...data,
      organizationId: new Types.ObjectId(organizationId),
    });

    await problem.populate("organization");

    logger.info("Problem created", {
      problemId: problem._id.toString(),
      organizationId,
    });

    return transformProblem(problem);
  }

  async updateProblem(
    problemId: string,
    organizationId: string,
    data: UpdateProblemData,
  ): Promise<ReturnType<typeof transformProblem>> {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    if (problem.organizationId.toString() !== organizationId) {
      throw new ForbiddenError("You can only update your own problems");
    }

    if (problem.status === "approved") {
      throw new BadRequestError(
        "Cannot update approved problems. Please contact admin.",
      );
    }

    const updated = await problemRepository.update(problemId, data);

    if (!updated) {
      throw new NotFoundError("Problem not found");
    }

    await updated.populate("organization");

    logger.info("Problem updated", {
      problemId,
      organizationId,
    });

    return transformProblem(updated);
  }

  async deleteProblem(
    problemId: string,
    organizationId: string,
  ): Promise<void> {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    if (problem.organizationId.toString() !== organizationId) {
      throw new ForbiddenError("You can only delete your own problems");
    }

    await problemRepository.delete(problemId);

    logger.info("Problem deleted", {
      problemId,
      organizationId,
    });
  }

  async getAllProblems(
    filter: ProblemFilter,
    pagination: PaginationInput,
  ): Promise<ProblemListResponse> {
    const { problems, total } = await problemRepository.findAll(filter, {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy || "createdAt",
      sortOrder: pagination.sortOrder || "desc",
    });

    return {
      problems: problems.map(transformProblem),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getPendingProblems(): Promise<ReturnType<typeof transformProblem>[]> {
    const problems = await problemRepository.findPending();
    return problems.map(transformProblem);
  }

  async getProblemById(
    id: string,
  ): Promise<ReturnType<typeof transformProblem>> {
    const problem = await problemRepository.findByIdWithOrg(id);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    return transformProblem(problem);
  }

  async reviewProblem(
    problemId: string,
    adminId: string,
    status: "approved" | "rejected",
    adminNotes?: string,
  ): Promise<ReturnType<typeof transformProblem>> {
    const problem = await problemRepository.findByIdWithOrg(problemId);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    const updated = await problemRepository.review(problemId, {
      status,
      adminNotes,
      reviewedBy: new Types.ObjectId(adminId),
    });

    if (!updated) {
      throw new NotFoundError("Problem not found");
    }

    const action: AuditAction =
      status === "approved" ? "APPROVE_PROBLEM" : "REJECT_PROBLEM";
    await auditLogRepository.create({
      adminId: new Types.ObjectId(adminId),
      action,
      targetType: "problem",
      targetId: updated._id,
      details: `${status === "approved" ? "Approved" : "Rejected"} problem: ${updated.title}`,
      metadata: { adminNotes },
    });

    await updated.populate("organization");

    logger.info("Problem reviewed", {
      problemId,
      adminId,
      status,
    });

    return transformProblem(updated);
  }

  async setFeatured(
    problemId: string,
    adminId: string,
    featured: boolean,
  ): Promise<ReturnType<typeof transformProblem>> {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    if (problem.status !== "approved") {
      throw new BadRequestError("Only approved problems can be featured");
    }

    const updated = await problemRepository.setFeatured(problemId, featured);

    if (!updated) {
      throw new NotFoundError("Problem not found");
    }

    const action: AuditAction = featured
      ? "FEATURE_PROBLEM"
      : "UNFEATURE_PROBLEM";
    await auditLogRepository.create({
      adminId: new Types.ObjectId(adminId),
      action,
      targetType: "problem",
      targetId: updated._id,
      details: `${featured ? "Featured" : "Unfeatured"} problem: ${updated.title}`,
    });

    await updated.populate("organization");

    logger.info("Problem feature status updated", {
      problemId,
      adminId,
      featured,
    });

    return transformProblem(updated);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    featured: number;
    byTrack: Record<string, number>;
    byDifficulty: Record<string, number>;
  }> {
    return problemRepository.getStats();
  }

  async getPublicStats(): Promise<{
    totalProblems: number;
    totalOrganizations: number;
    totalCategories: number;
    byTrack: Record<string, number>;
  }> {
    const problemStats = await problemRepository.getStats();
    const orgCount = await organizationRepository.countVerified();

    // Count unique categories from approved problems
    const categories = await problemRepository.getUniqueCategories();

    return {
      totalProblems: problemStats.approved,
      totalOrganizations: orgCount,
      totalCategories: categories.length,
      byTrack: problemStats.byTrack,
    };
  }
}

export const problemService = new ProblemService();
