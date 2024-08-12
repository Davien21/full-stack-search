import { logFormat } from "@/utils/logging";

describe("Logging", () => {
  const originalEnv = process.env as any;

  beforeEach(() => {
    jest.resetModules(); // reset modules to ensure fresh load of env
    process.env = { ...originalEnv }; // allow mutation of process.env
  });

  describe("Formats", () => {
    it("should format correctly when an error string is passed", () => {
      const message = "Something went wrong";
      const logEntry = {
        level: "info",
        message,
        label: "TestApp",
        timestamp: "2024-08-08 12:34:56",
        stack: null,
      };

      const formattedMessage = logFormat.transform(logEntry);
      const index = Object.getOwnPropertySymbols(formattedMessage)[0];

      // Retrieve the actual formatted message using the symbol key
      const messageFromSymbol = (formattedMessage as any)[index];

      expect(messageFromSymbol).toBe(
        `2024-08-08 12:34:56\n[TestApp] info:\n${message}\n`
      );
    });

    it("should format correctly when an error obj is passed", () => {
      const message = "Something went wrong";
      const logEntry = {
        level: "info",
        message: { error: message },
        label: "TestApp",
        timestamp: "2024-08-08 12:34:56",
        stack: null,
      };

      const formattedMessage = logFormat.transform(logEntry);
      const index = Object.getOwnPropertySymbols(formattedMessage)[0];

      // Retrieve the actual formatted message using the symbol key
      const messageFromSymbol = (formattedMessage as any)[index];

      expect(messageFromSymbol).toBe(
        `2024-08-08 12:34:56\n[TestApp] info:\n${message}\n`
      );
    });

    it("should format correctly when obj without error prop is passed", () => {
      const message = "Something went wrong";
      const logEntry = {
        level: "info",
        message: { name: message },
        label: "TestApp",
        timestamp: "2024-08-08 12:34:56",
        stack: null,
      };

      const formattedMessage = logFormat.transform(logEntry);
      const index = Object.getOwnPropertySymbols(formattedMessage)[0];

      // Retrieve the actual formatted message using the symbol key
      const messageFromSymbol = (formattedMessage as any)[index];

      expect(messageFromSymbol).toBe(
        `2024-08-08 12:34:56\n[TestApp] info:\n${JSON.stringify({
          name: message,
        })}\n`
      );
    });
  });

  describe("Settings", () => {
    it("should return prod settings if on production", () => {
      const { json, label, timestamp, errors } = require("winston").format;
      process.env.NODE_ENV = "production";
      const { env } = require("@/config/env");
      const { getLogSetting } = require("@/utils/logging");

      const formatSetting = getLogSetting();

      expect(formatSetting).toEqual([
        label({ label: env.APP_NAME }),
        timestamp(),
        errors({ stack: true }),
        json(),
      ]);
    });

    it("should return dev settings if not on production", () => {
      const { label, timestamp, errors } = require("winston").format;
      process.env.NODE_ENV = "development";
      const { env } = require("@/config/env");
      const { getLogSetting, logFormat } = require("@/utils/logging");

      const formatSetting = getLogSetting();

      expect(formatSetting).toEqual([
        label({ label: env.APP_NAME }),
        timestamp(),
        errors({ stack: true }),
        logFormat,
      ]);
    });
  });
});
