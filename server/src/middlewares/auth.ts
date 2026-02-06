import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { verifyToken, type TokenPayload } from "../utils/jwt.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";
import { User, type IUser } from "../models/User.js";
import { type UserRole } from "../config/constants.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: TokenPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided", "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError(
        "Invalid token format",
        "INVALID_TOKEN_FORMAT",
      );
    }

    const payload = verifyToken(token);
    req.tokenPayload = payload;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError("Invalid or expired token", "INVALID_TOKEN"));
    }
  }
}

export function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.tokenPayload) {
    return next(new UnauthorizedError("Authentication required"));
  }

  User.findById(req.tokenPayload.userId)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("User not found", "USER_NOT_FOUND"));
      }

      if (!user.isActive) {
        return next(
          new ForbiddenError("Account is deactivated", "ACCOUNT_DEACTIVATED"),
        );
      }

      req.user = user;
      next();
    })
    .catch((error) => next(error));
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    attachUser(req, res, next);
  });
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new ForbiddenError(
          "You do not have permission to access this resource",
        ),
      );
    }

    next();
  };
}

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  authenticate(req, res, (err) => {
    if (err) {
      return next();
    }
    attachUser(req, res, (attachErr) => {
      if (attachErr) {
        return next();
      }
      next();
    });
  });
}
