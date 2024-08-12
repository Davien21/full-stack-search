import "express-async-errors";

import logger from "@/config/logger";
import { openDBConnection } from "@/config/db";
import { parseEnv, env } from "@/config/env";
import redisClient from "@/config/redis";
import { appRouter } from "@/config/routing";

parseEnv();

const PORT = env.PORT;

await openDBConnection();

redisClient.on("connect", () => {
  logger.info("Redis connection was successful");
});

redisClient.on("error", (error) => {
  logger.error(`Redis connection error: ${error.message}`);
});

redisClient.on("close", () => {
  logger.info("Redis connection was closed");
});

appRouter.listen(PORT, () => {
  logger.info(`API Server Started at ${PORT} in ${env.NODE_ENV} mode`);
});
