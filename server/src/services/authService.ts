import { Types } from "mongoose";
import {
  userRepository,
  type CreateUserData,
} from "../repositories/userRepository.js";
import {
  organizationRepository,
  type CreateOrganizationData,
} from "../repositories/organizationRepository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../utils/errors.js";
import { type IUser } from "../models/User.js";
import { type IOrganization } from "../models/Organization.js";
import { type Industry } from "../config/constants.js";
import { logger } from "../utils/logger.js";

export interface RegisterOrganizationInput {
  email: string;
  password: string;
  name: string;
  organizationName: string;
  industry: Industry;
  website?: string;
  description?: string;
  contactPerson: string;
  contactEmail: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  organization?: {
    id: string;
    name: string;
    verified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  async registerOrganization(
    input: RegisterOrganizationInput,
  ): Promise<AuthResponse> {
    const existingUser = await userRepository.exists(input.email);
    if (existingUser) {
      throw new ConflictError("Email already registered", "EMAIL_EXISTS");
    }

    const user = await userRepository.create({
      email: input.email,
      password: input.password,
      name: input.name,
      role: "organization",
    });

    const organization = await organizationRepository.create({
      userId: user._id,
      name: input.organizationName,
      industry: input.industry,
      website: input.website || undefined,
      description: input.description,
      contactPerson: input.contactPerson,
      contactEmail: input.contactEmail,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRepository.updateLastLogin(user._id);

    logger.info("Organization registered", {
      userId: user._id.toString(),
      organizationId: organization._id.toString(),
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      organization: {
        id: organization._id.toString(),
        name: organization.name,
        verified: organization.verified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(input: LoginInput, expectedRole?: string): Promise<AuthResponse> {
    const user = await userRepository.findByEmailWithPassword(input.email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials", "INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        "Account is deactivated",
        "ACCOUNT_DEACTIVATED",
      );
    }

    const isPasswordValid = await user.comparePassword(input.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials", "INVALID_CREDENTIALS");
    }

    if (expectedRole && user.role !== expectedRole) {
      throw new UnauthorizedError(
        "Invalid credentials for this login type",
        "INVALID_LOGIN_TYPE",
      );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRepository.updateLastLogin(user._id);

    let organization: IOrganization | null = null;
    if (user.role === "organization") {
      organization = await organizationRepository.findByUserId(user._id);
    }

    logger.info("User logged in", {
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      organization: organization
        ? {
            id: organization._id.toString(),
            name: organization.name,
            verified: organization.verified,
          }
        : undefined,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async adminLogin(input: LoginInput): Promise<AuthResponse> {
    return this.login(input, "admin");
  }

  async organizationLogin(input: LoginInput): Promise<AuthResponse> {
    return this.login(input, "organization");
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = verifyToken(token);
      const user = await userRepository.findById(payload.userId);

      if (!user) {
        throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
      }

      if (!user.isActive) {
        throw new UnauthorizedError(
          "Account is deactivated",
          "ACCOUNT_DEACTIVATED",
        );
      }

      const accessToken = generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedError(
        "Invalid refresh token",
        "INVALID_REFRESH_TOKEN",
      );
    }
  }

  async getCurrentUser(userId: string): Promise<{
    user: IUser;
    organization?: IOrganization;
  }> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    let organization: IOrganization | null = null;
    if (user.role === "organization") {
      organization = await organizationRepository.findByUserId(user._id);
    }

    return {
      user,
      organization: organization || undefined,
    };
  }
}

export const authService = new AuthService();
