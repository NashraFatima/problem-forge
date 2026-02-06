import { Request, Response } from "express";
import { organizationService } from "../services/organizationService.js";
import { organizationRepository } from "../repositories/organizationRepository.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { NotFoundError } from "../utils/errors.js";
import {
  type UpdateOrganizationInput,
  type VerifyOrganizationInput,
} from "../validators/schemas.js";
import { type Industry } from "../config/constants.js";

export const organizationController = {
  getOrganizations: asyncHandler(async (req: Request, res: Response) => {
    const filter = {
      verified:
        req.query.verified === "true"
          ? true
          : req.query.verified === "false"
            ? false
            : undefined,
      industry: req.query.industry as Industry | undefined,
      search: req.query.search as string | undefined,
    };
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const result = await organizationService.getOrganizations(
      filter,
      pagination,
    );

    res.json({
      success: true,
      data: result,
    });
  }),

  getOrganizationById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const organization = await organizationService.getOrganizationById(id);

    res.json({
      success: true,
      data: organization,
    });
  }),

  getMyOrganization: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const organization =
      await organizationService.getOrganizationByUserId(userId);

    res.json({
      success: true,
      data: organization,
    });
  }),

  updateMyOrganization: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const data = req.body as UpdateOrganizationInput;

    const org = await organizationRepository.findByUserId(userId);

    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    const organization = await organizationService.updateOrganization(
      org._id.toString(),
      userId,
      data,
    );

    res.json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  }),

  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const org = await organizationRepository.findByUserId(userId);

    if (!org) {
      throw new NotFoundError("Organization not found");
    }

    const dashboard = await organizationService.getOrganizationDashboard(
      org._id.toString(),
    );

    res.json({
      success: true,
      data: dashboard,
    });
  }),

  verifyOrganization: asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!._id.toString();
    const { id } = req.params;
    const data = req.body as VerifyOrganizationInput;

    const organization = await organizationService.verifyOrganization(
      id,
      adminId,
      data.verified,
    );

    res.json({
      success: true,
      message: data.verified
        ? "Organization verified successfully"
        : "Organization unverified",
      data: organization,
    });
  }),

  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await organizationService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  }),
};
