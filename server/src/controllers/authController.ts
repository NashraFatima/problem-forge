import { Request, Response } from "express";
import { authService } from "../services/authService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { type RegisterInput, type LoginInput } from "../validators/schemas.js";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as RegisterInput;

    const result = await authService.registerOrganization({
      email: data.email,
      password: data.password,
      name: data.contactPerson,
      organizationName: data.organizationName,
      industry: data.industry,
      website: data.website || undefined,
      description: data.description,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  }),

  loginOrganization: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as LoginInput;

    const result = await authService.organizationLogin(data);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }),

  loginAdmin: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as LoginInput;

    const result = await authService.adminLogin(data);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const result = await authService.getCurrentUser(userId);

    const responseData: any = {
      id: result.user._id.toString(),
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      avatar: result.user.avatar,
      createdAt: result.user.createdAt,
    };

    if (result.organization) {
      responseData.organization = {
        id: result.organization._id.toString(),
        name: result.organization.name,
        verified: result.organization.verified,
        industry: result.organization.industry,
      };
    }

    res.json({
      success: true,
      data: responseData,
    });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }),
};
