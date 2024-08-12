import Redis from "ioredis";
import { env } from "./env";
import logger from "./logger";

// create Redis client instance

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: 2,
});

export default redisClient;
