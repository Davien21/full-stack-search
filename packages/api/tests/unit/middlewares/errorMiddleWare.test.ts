import { NextFunction, Request, Response } from "express";
import mongoose, { MongooseError } from "mongoose";

import logger from "@/config/logger";
import { errorResponse } from "@/utils/response";
import errorMiddleware from "@/middlewares/error";

async function setup(error: any) {
  const errorloggerSpy = jest.spyOn(logger, "error");
  errorloggerSpy.mockImplementation(() => {});

  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const next = jest.fn();

  errorMiddleware(
    error as any,
    req as Request,
    res as Response & { status: jest.Mock; send: jest.Mock },
    next as NextFunction
  );

  return { req, res, next, error, errorloggerSpy };
}

describe("Error Middleware", () => {
  it("should accept strings and log the error", async () => {
    const { errorloggerSpy } = await setup("Unknown error");

    expect(errorloggerSpy).toHaveBeenCalled();
  });

  it("should accept any object with message prop and log the error", async () => {
    const { errorloggerSpy } = await setup(new Error("Unknown error"));

    expect(errorloggerSpy).toHaveBeenCalled();
  });

  it('should return Unexpected response format if error is neither string nor object with "message" prop', async () => {
    const error = { name: "UnknownError" };
    const { res } = await setup(error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Unexpected response format",
      data: null,
      success: false,
    });
  });

  it("should send specific status and message for operational errors", async () => {
    const message = "Operational error";
    const { res } = await setup({
      statusCode: 400,
      message,
      isOperational: true,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(errorResponse(message));
  });

  it("should handle mongoose validation errors", async () => {
    const message = "Name is required";
    const error = new MongooseError(message);

    const validationError = new mongoose.Error.ValidationError(error);
    validationError.errors = {
      name: new mongoose.Error.ValidatorError({
        message,
        path: "name",
        value: "",
        reason: "Name cannot be empty.",
      }),
    };

    const { res } = await setup(validationError);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(errorResponse(message));
  });

  it("should handle specific error names", async () => {
    const message = "Syntax error";
    const { res } = await setup({ name: "SyntaxError", message });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(errorResponse(message));
  });

  it("should send 500 for other errors", async () => {
    const message = "Some other error";

    const { res } = await setup({ name: "OtherError", message });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(errorResponse(message));
  });
});
