import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors.js";

type RequestPart = "body" | "query" | "params";

export function validate<T>(schema: ZodSchema<T>, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[part]);
      req[part] = data as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};

        for (const issue of error.issues) {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        }

        next(new ValidationError("Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return validate(schema, "body");
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return validate(schema, "query");
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return validate(schema, "params");
}
