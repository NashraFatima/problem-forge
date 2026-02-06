import { Types, FilterQuery } from "mongoose";
import {
  ProblemStatement,
  type IProblemStatement,
} from "../models/ProblemStatement.js";
import {
  type Track,
  type DifficultyLevel,
  type ProblemStatus,
  type Industry,
} from "../config/constants.js";

export interface CreateProblemData {
  organizationId: Types.ObjectId;
  title: string;
  description: string;
  track: Track;
  category: string;
  industry: Industry;
  expectedOutcome: string;
  techStack?: string[];
  difficulty: DifficultyLevel;
  datasets?: string;
  apiLinks?: string;
  referenceLinks?: string[];
  ndaRequired?: boolean;
  mentorsProvided?: boolean;
  contactPerson: string;
  contactEmail: string;
}

export interface UpdateProblemData {
  title?: string;
  description?: string;
  track?: Track;
  category?: string;
  industry?: Industry;
  expectedOutcome?: string;
  techStack?: string[];
  difficulty?: DifficultyLevel;
  datasets?: string;
  apiLinks?: string;
  referenceLinks?: string[];
  ndaRequired?: boolean;
  mentorsProvided?: boolean;
  contactPerson?: string;
  contactEmail?: string;
}

export interface ReviewProblemData {
  status: ProblemStatus;
  adminNotes?: string;
  reviewedBy: Types.ObjectId;
}

export interface ProblemFilter {
  search?: string;
  track?: Track;
  category?: string;
  difficulty?: DifficultyLevel;
  status?: ProblemStatus;
  featured?: boolean;
  organizationId?: string | Types.ObjectId;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export class ProblemRepository {
  async create(data: CreateProblemData): Promise<IProblemStatement> {
    const problem = new ProblemStatement(data);
    return problem.save();
  }

  async findById(
    id: string | Types.ObjectId,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findById(id);
  }

  async findByIdWithOrg(
    id: string | Types.ObjectId,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findById(id).populate("organization");
  }

  async findByIdPublic(
    id: string | Types.ObjectId,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findOne({
      _id: id,
      status: "approved",
    }).populate("organization");
  }

  async findAll(
    filter: ProblemFilter = {},
    pagination?: PaginationOptions,
  ): Promise<{ problems: IProblemStatement[]; total: number }> {
    const query: FilterQuery<IProblemStatement> = {};

    if (filter.search) {
      query.$text = { $search: filter.search };
    }
    if (filter.track) query.track = filter.track;
    if (filter.category) query.category = filter.category;
    if (filter.difficulty) query.difficulty = filter.difficulty;
    if (filter.status) query.status = filter.status;
    if (filter.featured !== undefined) query.featured = filter.featured;
    if (filter.organizationId) query.organizationId = filter.organizationId;

    const total = await ProblemStatement.countDocuments(query);

    let queryBuilder = ProblemStatement.find(query).populate("organization");

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

    const problems = await queryBuilder;

    return { problems, total };
  }

  async findApproved(
    filter: Omit<ProblemFilter, "status"> = {},
    pagination?: PaginationOptions,
  ): Promise<{ problems: IProblemStatement[]; total: number }> {
    return this.findAll({ ...filter, status: "approved" }, pagination);
  }

  async findPending(): Promise<IProblemStatement[]> {
    return ProblemStatement.findPending();
  }

  async findByOrganization(
    organizationId: string | Types.ObjectId,
  ): Promise<IProblemStatement[]> {
    return ProblemStatement.findByOrganization(organizationId);
  }

  async findFeatured(): Promise<IProblemStatement[]> {
    return ProblemStatement.findFeatured();
  }

  async findRecent(limit = 6): Promise<IProblemStatement[]> {
    return ProblemStatement.findRecent(limit);
  }

  async update(
    id: string | Types.ObjectId,
    data: UpdateProblemData,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findByIdAndUpdate(
      id,
      { $set: { ...data, updatedAt: new Date() } },
      { new: true, runValidators: true },
    );
  }

  async review(
    id: string | Types.ObjectId,
    data: ReviewProblemData,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findByIdAndUpdate(
      id,
      {
        $set: {
          status: data.status,
          adminNotes: data.adminNotes,
          reviewedBy: data.reviewedBy,
          reviewedAt: new Date(),
        },
      },
      { new: true },
    );
  }

  async setFeatured(
    id: string | Types.ObjectId,
    featured: boolean,
  ): Promise<IProblemStatement | null> {
    return ProblemStatement.findByIdAndUpdate(
      id,
      { $set: { featured } },
      { new: true },
    );
  }

  async delete(id: string | Types.ObjectId): Promise<IProblemStatement | null> {
    return ProblemStatement.findByIdAndDelete(id);
  }

  async count(filter: ProblemFilter = {}): Promise<number> {
    const query: FilterQuery<IProblemStatement> = {};

    if (filter.status) query.status = filter.status;
    if (filter.track) query.track = filter.track;
    if (filter.organizationId) query.organizationId = filter.organizationId;
    if (filter.featured !== undefined) query.featured = filter.featured;

    return ProblemStatement.countDocuments(query);
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
    const [
      total,
      pending,
      approved,
      rejected,
      featured,
      byTrack,
      byDifficulty,
    ] = await Promise.all([
      ProblemStatement.countDocuments(),
      ProblemStatement.countDocuments({ status: "pending" }),
      ProblemStatement.countDocuments({ status: "approved" }),
      ProblemStatement.countDocuments({ status: "rejected" }),
      ProblemStatement.countDocuments({ featured: true, status: "approved" }),
      ProblemStatement.aggregate([
        { $group: { _id: "$track", count: { $sum: 1 } } },
      ]),
      ProblemStatement.aggregate([
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
    ]);

    const trackStats: Record<string, number> = {};
    for (const item of byTrack) {
      trackStats[item._id] = item.count;
    }

    const difficultyStats: Record<string, number> = {};
    for (const item of byDifficulty) {
      difficultyStats[item._id] = item.count;
    }

    return {
      total,
      pending,
      approved,
      rejected,
      featured,
      byTrack: trackStats,
      byDifficulty: difficultyStats,
    };
  }

  async getUniqueCategories(): Promise<string[]> {
    const categories = await ProblemStatement.distinct("category", {
      status: "approved",
    });
    return categories;
  }
}

export const problemRepository = new ProblemRepository();
