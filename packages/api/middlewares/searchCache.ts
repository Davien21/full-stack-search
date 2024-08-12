import { NextFunction, Request, Response } from "express";
import { successResponse } from "@/utils/response";
import logger from "@/config/logger";
import redisClient from "@/config/redis";
import { getSearchCacheKey } from "@/utils/helpers";

export default async function searchCacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const term = req.params.term;
  const cacheKey = getSearchCacheKey(term);

  try {
    const cachedResults = await redisClient.get(cacheKey);
    if (!cachedResults) return next();

    res.send(
      successResponse(
        "Search results retrieved from cache",
        JSON.parse(cachedResults)
      )
    );
  } catch (error: any) {
    // if Redis fails, log the error and proceed
    if (error.message) logger.error(`Error accessing Redis:\n${error.message}`);

    next();
  }
}
