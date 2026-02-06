import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./database/connection.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import http from "http";

let server: http.Server;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    logger.info("Database connected successfully");

    const app = createApp();

    server = app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`, {
        environment: config.env,
        port: config.port,
      });
      logger.info(`API available at http://localhost:${config.port}/api`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await disconnectDatabase();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown", error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error(
          "Could not close connections in time, forcefully shutting down",
        );
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
