import {
  BadRequestError,
  InternalServerError,
  UnAuthorizedError,
  ForbiddenError,
  NotFoundError,
  DuplicateError,
  AppError,
} from "@/config/errors";
import { env } from "@/config/env";

const { APP_NAME } = env;

describe("Custom Error Classes", () => {
  it("should create an instance of AppError with the correct properties", () => {
    const message = "Generic error";
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    assertAppError({ error, message, statusCode, ErrorClass: AppError });
  });

  it("should create an instance of BadRequestError with the correct properties", () => {
    const message = "Bad Request";
    const statusCode = 400;

    const error = new BadRequestError();

    assertAppError({ error, message, statusCode, ErrorClass: BadRequestError });
  });

  it("should create an instance of DuplicateError with the correct properties", () => {
    const message = "Duplicate already exists";
    const statusCode = 409;
    const error = new DuplicateError();

    assertAppError({ error, message, statusCode, ErrorClass: DuplicateError });
  });

  it("should create an instance of InternalServerError with the correct properties", () => {
    const message = "Something went wrong.";
    const statusCode = 500;
    const error = new InternalServerError();

    assertAppError({
      error,
      message,
      statusCode,
      ErrorClass: InternalServerError,
    });
  });

  it("should create an instance of UnAuthorizedError with the correct properties", () => {
    const message = "Unauthorized Access";
    const statusCode = 401;
    const error = new UnAuthorizedError();

    assertAppError({
      error,
      message,
      statusCode,
      ErrorClass: UnAuthorizedError,
    });
  });

  it("should create an instance of ForbiddenError with the correct properties", () => {
    const message = "Forbidden Request";
    const statusCode = 403;
    const error = new ForbiddenError();

    assertAppError({ error, message, statusCode, ErrorClass: ForbiddenError });
  });

  it("should create an instance of NotFoundError with the correct properties", () => {
    const message = "Resource not found";
    const statusCode = 404;
    const error = new NotFoundError();

    assertAppError({ error, message, statusCode, ErrorClass: NotFoundError });
  });
});

const assertAppError = ({
  error,
  message,
  statusCode,
  ErrorClass,
}: {
  error: AppError;
  message: string;
  statusCode: number;
  ErrorClass: typeof AppError;
}) => {
  // check if we can do custom error messages
  const customMessage = "Custom error message";
  const customError = new ErrorClass(customMessage);

  expect(customError.message).toBe(customMessage);

  expect(error).toBeInstanceOf(ErrorClass);
  expect(error.message).toBe(message);
  expect(error.statusCode).toBe(statusCode);
  expect(error.isOperational).toBe(true);
  expect(error.date).toBeInstanceOf(Date);
  expect(error.name).toBe(`${APP_NAME}_Error`);
  expect(error.stack).toBeDefined();
};
