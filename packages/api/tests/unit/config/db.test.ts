import mongoose from "mongoose";
import { env } from "@/config/env";
import logger from "@/config/logger";
import { openDBConnection } from "@/config/db";

describe("Database Connection", () => {
  const dbUrl = env.DATABASE_URL;

  it("should log an info message when connection is successful", async () => {
    const infoLoggerSpy = jest.spyOn(logger, "info");
    const connectionSpy = jest.spyOn(mongoose, "connect");

    await openDBConnection();

    expect(connectionSpy).toHaveBeenCalledWith(dbUrl, {});
    expect(infoLoggerSpy).toHaveBeenCalledWith(`Connected to ${dbUrl}`);
  });

  it("should log an error message when connection fails", async () => {
    const errMessage = "Connection error";

    const errorConnectionSpy = jest.spyOn(mongoose, "connect");
    errorConnectionSpy.mockRejectedValueOnce(new Error(errMessage));

    const errorLoggerSpy = jest.spyOn(logger, "error");

    await openDBConnection();

    expect(errorLoggerSpy).toHaveBeenCalledWith(errMessage);
  });
});
