import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import {
  AppError,
  ValidationError,
  InternalServerError,
} from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { isProduction } from "../config/index.js";
import mongoose from "mongoose";

interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string>;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`Error processing request: ${req.method} ${req.path}`, err, {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    userId: req.user?._id?.toString(),
  });

  let statusCode = 500;
  let response: ErrorResponse = {
    success: false,
    message: "Internal server error",
  };

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response = {
      success: false,
      message: err.message,
      code: err.code,
    };

    if (err instanceof ValidationError) {
      response.errors = err.errors;
    }
  } else if (err instanceof ZodError) {
    statusCode = 422;
    const errors: Record<string, string> = {};

    for (const issue of err.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }

    response = {
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors,
    };
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    const errors: Record<string, string> = {};

    for (const [field, error] of Object.entries(err.errors)) {
      errors[field] = error.message;
    }

    response = {
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors,
    };
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    response = {
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      code: "INVALID_ID",
    };
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue || {})[0] || "field";
    response = {
      success: false,
      message: `Duplicate value for ${field}`,
      code: "DUPLICATE_KEY",
    };
  }

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
    code: "NOT_FOUND",
  });
}

export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
