import { NextFunction, Request, Response } from "express";

import searchCacheMiddleware from "@/middlewares/searchCache";
import { successResponse } from "@/utils/response";
import logger from "@/config/logger";
import redisClient from "@/config/redis";
import { getSearchCacheKey } from "@/utils/helpers";

const cachedData = ["result1", "result2"];

async function setup(term: string) {
  const errorloggerSpy = jest.spyOn(logger, "error");
  errorloggerSpy.mockImplementation(() => {});

  const req = { params: { term } };
  const res = {
    send: jest.fn(),
  };
  const next = jest.fn();

  await searchCacheMiddleware(
    req as Request & { params: { term: string } },
    res as Response & { send: jest.Mock },
    next as NextFunction
  );

  return { req, res, next, errorloggerSpy };
}

describe("Search Cache Middleware", () => {
  it("should call next if cache is missing", async () => {
    const redisClientSpy = jest.spyOn(redisClient, "get");

    redisClientSpy.mockImplementation(async () => null);

    const { next } = await setup("test");

    expect(redisClientSpy).toHaveBeenCalledWith(getSearchCacheKey("test"));
    expect(next).toHaveBeenCalled();
  });

  it("should send cached results if cache is hit", async () => {
    const redisClientSpy = jest.spyOn(redisClient, "get");

    redisClientSpy.mockImplementation(async () => {
      return JSON.stringify(cachedData);
    });

    const { res, next } = await setup("test");

    expect(redisClientSpy).toHaveBeenCalledWith(getSearchCacheKey("test"));
    expect(res.send).toHaveBeenCalledWith(
      successResponse("Search results retrieved from cache", cachedData)
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should log an error and call next if Redis fails", async () => {
    const error = new Error("Redis error");

    const redisClientSpy = jest.spyOn(redisClient, "get");
    redisClientSpy.mockRejectedValueOnce(error);

    const { next, errorloggerSpy } = await setup("test");

    expect(redisClientSpy).toHaveBeenCalledWith(getSearchCacheKey("test"));
    expect(errorloggerSpy).toHaveBeenCalledWith(
      `Error accessing Redis:\n${error.message}`
    );
    expect(next).toHaveBeenCalled();
  });
});
