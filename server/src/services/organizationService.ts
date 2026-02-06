import { Types } from "mongoose";
import {
  organizationRepository,
  type UpdateOrganizationData,
  type OrganizationFilter,
} from "../repositories/organizationRepository.js";
import { auditLogRepository } from "../repositories/auditLogRepository.js";
import { problemRepository } from "../repositories/problemRepository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { type IOrganization } from "../models/Organization.js";
import { logger } from "../utils/logger.js";

export interface PaginationInput {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function transformOrganization(org: IOrganization): any {
  return {
    id: org._id.toString(),
    name: org.name,
    logo: org.logo,
    description: org.description,
    website: org.website,
    industry: org.industry,
    contactPerson: org.contactPerson,
    contactEmail: org.contactEmail,
    verified: org.verified,
    isActive: org.isActive,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
  };
}

export class OrganizationService {
  async getOrganizations(
    filter: OrganizationFilter,
    pagination: PaginationInput,
  ): Promise<{
    organizations: ReturnType<typeof transformOrganization>[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { organizations, total } = await organizationRepository.findAll(
      filter,
      {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy || "createdAt",
        sortOrder: pagination.sortOrder || "desc",
      },
    );

    return {
      organizations: organizations.map(transformOrganization),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getOrganizationById(
    id: string,
  ): Promise<ReturnType<typeof transformOrganization>> {
    const organization = await organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    return transformOrganization(organization);
  }

  async getOrganizationByUserId(
    userId: string,
  ): Promise<ReturnType<typeof transformOrganization>> {
    const organization = await organizationRepository.findByUserId(userId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    return transformOrganization(organization);
  }

  async updateOrganization(
    organizationId: string,
    userId: string,
    data: UpdateOrganizationData,
  ): Promise<ReturnType<typeof transformOrganization>> {
    const organization = await organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    if (organization.userId.toString() !== userId) {
      throw new ForbiddenError("You can only update your own organization");
    }

    const updated = await organizationRepository.update(organizationId, data);

    if (!updated) {
      throw new NotFoundError("Organization not found");
    }

    logger.info("Organization updated", {
      organizationId,
      userId,
    });

    return transformOrganization(updated);
  }

  async verifyOrganization(
    organizationId: string,
    adminId: string,
    verified: boolean,
  ): Promise<ReturnType<typeof transformOrganization>> {
    const organization = await organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const updated = await organizationRepository.verify(
      organizationId,
      verified,
    );

    if (!updated) {
      throw new NotFoundError("Organization not found");
    }

    await auditLogRepository.create({
      adminId: new Types.ObjectId(adminId),
      action: verified ? "VERIFY_ORGANIZATION" : "SUSPEND_ORGANIZATION",
      targetType: "organization",
      targetId: updated._id,
      details: `${verified ? "Verified" : "Unverified"} organization: ${updated.name}`,
    });

    logger.info("Organization verification status updated", {
      organizationId,
      adminId,
      verified,
    });

    return transformOrganization(updated);
  }

  async getOrganizationDashboard(organizationId: string): Promise<{
    organization: ReturnType<typeof transformOrganization>;
    stats: {
      totalProblems: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    recentProblems: any[];
  }> {
    const organization = await organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const problems = await problemRepository.findByOrganization(organizationId);

    const stats = {
      totalProblems: problems.length,
      pending: problems.filter((p) => p.status === "pending").length,
      approved: problems.filter((p) => p.status === "approved").length,
      rejected: problems.filter((p) => p.status === "rejected").length,
    };

    const recentProblems = problems.slice(0, 5).map((p) => ({
      id: p._id.toString(),
      title: p.title,
      track: p.track,
      category: p.category,
      status: p.status,
      createdAt: p.createdAt,
    }));

    return {
      organization: transformOrganization(organization),
      stats,
      recentProblems,
    };
  }

  async getStats(): Promise<{
    total: number;
    verified: number;
    unverified: number;
    byIndustry: Record<string, number>;
  }> {
    return organizationRepository.getStats();
  }
}

export const organizationService = new OrganizationService();
