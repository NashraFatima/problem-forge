import { Types, FilterQuery } from "mongoose";
import { AuditLog, type IAuditLog } from "../models/AuditLog.js";
import { type AuditAction } from "../config/constants.js";

export interface CreateAuditLogData {
  adminId: Types.ObjectId;
  action: AuditAction;
  targetType: "problem" | "organization" | "user";
  targetId: Types.ObjectId;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilter {
  adminId?: string | Types.ObjectId;
  action?: AuditAction;
  targetType?: "problem" | "organization" | "user";
  targetId?: string | Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export class AuditLogRepository {
  async create(data: CreateAuditLogData): Promise<IAuditLog> {
    return AuditLog.log(data);
  }

  async findById(id: string | Types.ObjectId): Promise<IAuditLog | null> {
    return AuditLog.findById(id).populate("admin", "name email");
  }

  async findAll(
    filter: AuditLogFilter = {},
    pagination?: PaginationOptions,
  ): Promise<{ logs: IAuditLog[]; total: number }> {
    const query: FilterQuery<IAuditLog> = {};

    if (filter.adminId) query.adminId = filter.adminId;
    if (filter.action) query.action = filter.action;
    if (filter.targetType) query.targetType = filter.targetType;
    if (filter.targetId) query.targetId = filter.targetId;
    if (filter.startDate || filter.endDate) {
      query.createdAt = {};
      if (filter.startDate) query.createdAt.$gte = filter.startDate;
      if (filter.endDate) query.createdAt.$lte = filter.endDate;
    }

    const total = await AuditLog.countDocuments(query);

    let queryBuilder = AuditLog.find(query)
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    if (pagination) {
      const skip = (pagination.page - 1) * pagination.limit;
      queryBuilder = queryBuilder.skip(skip).limit(pagination.limit);
    }

    const logs = await queryBuilder;

    return { logs, total };
  }

  async findByAdmin(adminId: string | Types.ObjectId): Promise<IAuditLog[]> {
    return AuditLog.findByAdmin(adminId);
  }

  async findByTarget(
    targetType: "problem" | "organization" | "user",
    targetId: string | Types.ObjectId,
  ): Promise<IAuditLog[]> {
    return AuditLog.findByTarget(targetType, targetId);
  }

  async getRecentLogs(limit = 10): Promise<IAuditLog[]> {
    return AuditLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async count(filter: AuditLogFilter = {}): Promise<number> {
    const query: FilterQuery<IAuditLog> = {};

    if (filter.adminId) query.adminId = filter.adminId;
    if (filter.action) query.action = filter.action;

    return AuditLog.countDocuments(query);
  }
}

export const auditLogRepository = new AuditLogRepository();
