import { NextFunction, Request, Response } from "express";
import validateById from "@/middlewares/validateById";
import { BadRequestError } from "@/config/errors";
import mongoose from "mongoose";

function setup(id: string) {
  const req = { params: { id } };
  const res = {};
  const next = jest.fn();

  return { req, res, next };
}

describe("validate By Id Middleware", () => {
  it("should call next if id is valid", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const { req, res, next } = setup(id);

    const middleware = validateById();

    await middleware(
      req as Request & { params: { id: string } },
      res as Response,
      next as NextFunction
    );

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw BadRequestError if id is invalid", async () => {
    const id = "invalid-id";

    const { req, res, next } = setup(id);

    const middleware = validateById();

    try {
      await middleware(
        req as Request & { params: { id: string } },
        res as Response,
        next as NextFunction
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe("Invalid id");
    }

    expect(next).not.toHaveBeenCalled();
  });

  it("should use custom error message if provided", async () => {
    const id = "invalid-id";

    const { req, res, next } = setup(id);

    const customErrorMessage = "Custom error message";

    const middleware = validateById(customErrorMessage);

    try {
      await middleware(
        req as Request & { params: { id: string } },
        res as Response,
        next as NextFunction
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe(customErrorMessage);
    }

    expect(next).not.toHaveBeenCalled();
  });
});
