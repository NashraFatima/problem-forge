import { config, isProduction } from "../config/index.js";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  const configLevel = (config.logLevel || "info") as LogLevel;
  return LOG_LEVELS[level] >= LOG_LEVELS[configLevel];
}

function formatMessage(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";

  if (isProduction) {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }

  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

function sanitizeMeta(
  meta?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!meta) return undefined;

  const sensitiveFields = ["password", "token", "secret", "authorization"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeMeta(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, sanitizeMeta(meta)));
    }
  },

  info(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, sanitizeMeta(meta)));
    }
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, sanitizeMeta(meta)));
    }
  },

  error(
    message: string,
    error?: Error | unknown,
    meta?: Record<string, unknown>,
  ): void {
    if (shouldLog("error")) {
      const errorMeta =
        error instanceof Error
          ? {
              errorMessage: error.message,
              stack: isProduction ? undefined : error.stack,
            }
          : { error };
      console.error(
        formatMessage("error", message, {
          ...sanitizeMeta(meta),
          ...errorMeta,
        }),
      );
    }
  },
};
