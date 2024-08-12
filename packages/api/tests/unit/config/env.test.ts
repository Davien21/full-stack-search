describe("Environment", () => {
  const originalEnv = process.env as any;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.resetModules(); // reset modules to ensure fresh load of env
    process.env = { ...originalEnv }; // allow mutation of process.env
  });

  afterEach(() => {
    process.env = originalEnv; // restore original process.env
  });

  describe("Configuration", () => {
    it("should call dot env config on load", () => {
      const dotenv = require("dotenv");
      const dotenvSpy = jest.spyOn(dotenv, "config");

      require("@/config/env");

      expect(dotenvSpy).toHaveBeenCalled();
    });

    it("should select development configuration by default", () => {
      delete process.env.NODE_ENV;

      const { env } = require("@/config/env");

      expect(env.NODE_ENV).toBe("development");
    });

    it("should only allow development, production or test as NODE_ENV", () => {
      process.env.NODE_ENV = "invalid";

      const { parseEnv } = require("@/config/env");

      expect(() => parseEnv()).toThrow("Invalid environment variables");
    });

    it("should allow overriding values via process.env", () => {
      process.env.NODE_ENV = "test";
      process.env.APP_NAME = "test_app";

      const { env } = require("@/config/env");
      expect(env.NODE_ENV).toBe("test");
      expect(env.APP_NAME).toBe("test_app");
    });

    it("should not include values that are not in the defined schema", () => {
      process.env.INVALID_KEY = "invalid_key";
      const { env } = require("@/config/env");
      expect(env.INVALID_KEY).toBeUndefined();
    });

    it("should make DB name = app name when in development mode", () => {
      process.env.NODE_ENV = "development";
      process.env.APP_NAME = "test_app";

      const { env } = require("@/config/env");
      expect(env.DATABASE_URL).toBe("mongodb://localhost:27017/test_app");
    });

    it(`should make DB name = app name + '_test' when in test mode`, () => {
      process.env.NODE_ENV = "test";
      process.env.APP_NAME = "chidi_app";

      const { env } = require("@/config/env");
      expect(env.DATABASE_URL).toBe("mongodb://localhost:27017/chidi_app_test");
    });
  });

  describe("Validation", () => {
    it("should throw an error for invalid environment variables", () => {
      process.env.NODE_ENV = "development";
      process.env.APP_NAME = "";
      process.env.PORT = "not-a-number";
      process.env.DATABASE_URL = "invalid-db-url";
      process.env.REDIS_PORT = "not-a-number";

      const { parseEnv } = require("@/config/env");

      expect(() => parseEnv()).toThrow("Invalid environment variables");
    });

    it("should not throw an error for valid environment variables", () => {
      process.env.NODE_ENV = "development";
      process.env.APP_NAME = "test_app";
      process.env.PORT = 3000;
      process.env.REDIS_PORT = 6379;

      const { parseEnv } = require("@/config/env");

      expect(() => parseEnv()).not.toThrow();
    });
  });
});
