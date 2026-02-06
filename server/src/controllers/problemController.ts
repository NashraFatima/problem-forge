import { Request, Response } from "express";
import { problemService } from "../services/problemService.js";
import { organizationRepository } from "../repositories/organizationRepository.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";
import {
  type CreateProblemInput,
  type UpdateProblemInput,
  type ReviewProblemInput,
  type FeatureProblemInput,
  type ProblemFilterInput,
  type PaginationInput,
} from "../validators/schemas.js";

export const problemController = {
  getPublicProblems: asyncHandler(async (req: Request, res: Response) => {
    const filter = req.query as unknown as ProblemFilterInput;
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const result = await problemService.getPublicProblems(filter, pagination);

    res.json({
      success: true,
      data: result,
    });
  }),

  getPublicProblemById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const problem = await problemService.getPublicProblemById(id);

    res.json({
      success: true,
      data: problem,
    });
  }),

  getFeaturedProblems: asyncHandler(async (_req: Request, res: Response) => {
    const problems = await problemService.getFeaturedProblems();

    res.json({
      success: true,
      data: problems,
    });
  }),

  getRecentProblems: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 6;
    const problems = await problemService.getRecentProblems(limit);

    res.json({
      success: true,
      data: problems,
    });
  }),

  getMyProblems: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const organization = await organizationRepository.findByUserId(userId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const problems = await problemService.getOrganizationProblems(
      organization._id.toString(),
    );

    res.json({
      success: true,
      data: problems,
    });
  }),

  createProblem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const data = req.body as CreateProblemInput;

    const organization = await organizationRepository.findByUserId(userId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const problem = await problemService.createProblem(
      organization._id.toString(),
      data,
    );

    res.status(201).json({
      success: true,
      message: "Problem submitted successfully",
      data: problem,
    });
  }),

  updateProblem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { id } = req.params;
    const data = req.body as UpdateProblemInput;

    const organization = await organizationRepository.findByUserId(userId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const problem = await problemService.updateProblem(
      id,
      organization._id.toString(),
      data,
    );

    res.json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    });
  }),

  deleteProblem: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const organization = await organizationRepository.findByUserId(userId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    await problemService.deleteProblem(id, organization._id.toString());

    res.json({
      success: true,
      message: "Problem deleted successfully",
    });
  }),

  getAllProblems: asyncHandler(async (req: Request, res: Response) => {
    const filter = req.query as unknown as ProblemFilterInput;
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    };

    const result = await problemService.getAllProblems(filter, pagination);

    res.json({
      success: true,
      data: result,
    });
  }),

  getPendingProblems: asyncHandler(async (_req: Request, res: Response) => {
    const problems = await problemService.getPendingProblems();

    res.json({
      success: true,
      data: problems,
    });
  }),

  getProblemById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const problem = await problemService.getProblemById(id);

    res.json({
      success: true,
      data: problem,
    });
  }),

  reviewProblem: asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!._id.toString();
    const { id } = req.params;
    const data = req.body as ReviewProblemInput;

    const problem = await problemService.reviewProblem(
      id,
      adminId,
      data.status,
      data.adminNotes,
    );

    res.json({
      success: true,
      message: `Problem ${data.status} successfully`,
      data: problem,
    });
  }),

  setFeatured: asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user!._id.toString();
    const { id } = req.params;
    const data = req.body as FeatureProblemInput;

    const problem = await problemService.setFeatured(
      id,
      adminId,
      data.featured,
    );

    res.json({
      success: true,
      message: data.featured
        ? "Problem featured successfully"
        : "Problem unfeatured successfully",
      data: problem,
    });
  }),

  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await problemService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  }),

  getPublicStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await problemService.getPublicStats();

    res.json({
      success: true,
      data: stats,
    });
  }),
};
