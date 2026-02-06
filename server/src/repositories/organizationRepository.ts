import { Types, FilterQuery } from "mongoose";
import { Organization, type IOrganization } from "../models/Organization.js";
import { type Industry } from "../config/constants.js";

export interface CreateOrganizationData {
  userId: Types.ObjectId;
  name: string;
  industry: Industry;
  contactPerson: string;
  contactEmail: string;
  description?: string;
  website?: string;
  logo?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  website?: string;
  industry?: Industry;
  contactPerson?: string;
  contactEmail?: string;
  logo?: string;
  verified?: boolean;
  isActive?: boolean;
}

export interface OrganizationFilter {
  verified?: boolean;
  isActive?: boolean;
  industry?: Industry;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export class OrganizationRepository {
  async create(data: CreateOrganizationData): Promise<IOrganization> {
    const organization = new Organization(data);
    return organization.save();
  }

  async findById(id: string | Types.ObjectId): Promise<IOrganization | null> {
    return Organization.findById(id);
  }

  async findByIdWithUser(
    id: string | Types.ObjectId,
  ): Promise<IOrganization | null> {
    return Organization.findById(id).populate("user", "-password");
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IOrganization | null> {
    return Organization.findByUserId(userId);
  }

  async findAll(
    filter: OrganizationFilter = {},
    pagination?: PaginationOptions,
  ): Promise<{ organizations: IOrganization[]; total: number }> {
    const query: FilterQuery<IOrganization> = {};

    if (filter.verified !== undefined) query.verified = filter.verified;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.industry) query.industry = filter.industry;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { contactPerson: { $regex: filter.search, $options: "i" } },
      ];
    }

    const total = await Organization.countDocuments(query);

    let queryBuilder = Organization.find(query);

    if (pagination) {
      const skip = (pagination.page - 1) * pagination.limit;
      const sortOrder = pagination.sortOrder === "asc" ? 1 : -1;

      queryBuilder = queryBuilder
        .sort({ [pagination.sortBy]: sortOrder })
        .skip(skip)
        .limit(pagination.limit);
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const organizations = await queryBuilder;

    return { organizations, total };
  }

  async update(
    id: string | Types.ObjectId,
    data: UpdateOrganizationData,
  ): Promise<IOrganization | null> {
    return Organization.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async verify(
    id: string | Types.ObjectId,
    verified: boolean,
  ): Promise<IOrganization | null> {
    return Organization.findByIdAndUpdate(
      id,
      { $set: { verified } },
      { new: true },
    );
  }

  async delete(id: string | Types.ObjectId): Promise<IOrganization | null> {
    return Organization.findByIdAndDelete(id);
  }

  async count(filter: OrganizationFilter = {}): Promise<number> {
    const query: FilterQuery<IOrganization> = {};

    if (filter.verified !== undefined) query.verified = filter.verified;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;

    return Organization.countDocuments(query);
  }

  async getStats(): Promise<{
    total: number;
    verified: number;
    unverified: number;
    byIndustry: Record<string, number>;
  }> {
    const [total, verified, byIndustry] = await Promise.all([
      Organization.countDocuments({ isActive: true }),
      Organization.countDocuments({ isActive: true, verified: true }),
      Organization.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$industry", count: { $sum: 1 } } },
      ]),
    ]);

    const industryStats: Record<string, number> = {};
    for (const item of byIndustry) {
      industryStats[item._id] = item.count;
    }

    return {
      total,
      verified,
      unverified: total - verified,
      byIndustry: industryStats,
    };
  }

  async countVerified(): Promise<number> {
    return Organization.countDocuments({ isActive: true, verified: true });
  }
}

export const organizationRepository = new OrganizationRepository();
