import { Request, Response } from "express";
import { adminService } from "../services/adminService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const adminController = {
  getDashboard: asyncHandler(async (_req: Request, res: Response) => {
    const dashboard = await adminService.getDashboardStats();

    res.json({
      success: true,
      data: dashboard,
    });
  }),

  getAuditLogs: asyncHandler(async (req: Request, res: Response) => {
    const filter = {
      action: req.query.action as any,
      targetType: req.query.targetType as any,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
    };
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await auditService.getLogs(filter, pagination);

    res.json({
      success: true,
      data: result,
    });
  }),

  getRecentActivity: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;

    const logs = await auditService.getRecentLogs(limit);

    res.json({
      success: true,
      data: logs,
    });
  }),
};
