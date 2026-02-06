import { problemRepository } from "../repositories/problemRepository.js";
import { organizationRepository } from "../repositories/organizationRepository.js";
import { auditLogRepository } from "../repositories/auditLogRepository.js";

export class AdminService {
  async getDashboardStats(): Promise<{
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
    recentActivity: any[];
  }> {
    const [problemStats, orgStats, recentLogs] = await Promise.all([
      problemRepository.getStats(),
      organizationRepository.getStats(),
      auditLogRepository.getRecentLogs(10),
    ]);

    return {
      problems: {
        total: problemStats.total,
        pending: problemStats.pending,
        approved: problemStats.approved,
        rejected: problemStats.rejected,
        featured: problemStats.featured,
      },
      organizations: {
        total: orgStats.total,
        verified: orgStats.verified,
        unverified: orgStats.unverified,
      },
      recentActivity: recentLogs.map((log) => {
        const logWithVirtuals = log as any;
        const admin = logWithVirtuals.admin;
        return {
          id: log._id.toString(),
          adminName: admin?.name || "Unknown",
          action: log.action,
          targetType: log.targetType,
          details: log.details,
          createdAt: log.createdAt,
        };
      }),
    };
  }
}

export const adminService = new AdminService();
