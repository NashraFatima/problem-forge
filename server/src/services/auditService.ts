import {
  auditLogRepository,
  type AuditLogFilter,
} from "../repositories/auditLogRepository.js";
import { type IAuditLog } from "../models/AuditLog.js";

function transformAuditLog(log: IAuditLog): any {
  const logWithVirtuals = log as any;
  const admin = logWithVirtuals.admin;
  return {
    id: log._id.toString(),
    adminId: log.adminId.toString(),
    adminName: admin?.name || "Unknown",
    adminEmail: admin?.email,
    action: log.action,
    targetType: log.targetType,
    targetId: log.targetId.toString(),
    details: log.details,
    metadata: log.metadata,
    createdAt: log.createdAt,
  };
}

export class AuditService {
  async getLogs(
    filter: AuditLogFilter,
    pagination: { page: number; limit: number },
  ): Promise<{
    logs: ReturnType<typeof transformAuditLog>[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { logs, total } = await auditLogRepository.findAll(
      filter,
      pagination,
    );

    return {
      logs: logs.map(transformAuditLog),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getRecentLogs(
    limit = 10,
  ): Promise<ReturnType<typeof transformAuditLog>[]> {
    const logs = await auditLogRepository.getRecentLogs(limit);
    return logs.map(transformAuditLog);
  }

  async getLogsByTarget(
    targetType: "problem" | "organization" | "user",
    targetId: string,
  ): Promise<ReturnType<typeof transformAuditLog>[]> {
    const logs = await auditLogRepository.findByTarget(targetType, targetId);
    return logs.map(transformAuditLog);
  }
}

export const auditService = new AuditService();
