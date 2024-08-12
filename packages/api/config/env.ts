import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  APP_NAME: z.string(),
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  PORT: z.number(),
  DATABASE_URL: z.string().includes("mongodb"),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.number(),
  REDIS_PASSWORD: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: any;
    }
  }
}

const getValue = <T = string>(key: string, defaultValue: T): T => {
  if (key in process.env) return process.env[key];

  return defaultValue;
};

const common = {
  APP_NAME: getValue("APP_NAME", "tryhackme_chidi"),
  PORT: getValue("PORT", 3001),
  REDIS_HOST: getValue("REDIS_HOST", "localhost"),
  REDIS_PORT: getValue("REDIS_PORT", 6379),
  REDIS_PASSWORD: getValue("REDIS_PASSWORD", ""),
};

const development = {
  ...common,
  NODE_ENV: "development",
  DATABASE_URL: `mongodb://localhost:27017/${common.APP_NAME}`,
};

const production = {
  ...common,
  NODE_ENV: "production",
  DATABASE_URL: getValue("DATABASE_URL", undefined),
  REDIS_HOST: getValue("REDIS_HOST", undefined),
  REDIS_PORT: getValue("REDIS_PORT", undefined),
  REDIS_PASSWORD: getValue("REDIS_PASSWORD", undefined),
};

const test = {
  ...common,
  NODE_ENV: "test",
  DATABASE_URL: `mongodb://localhost:27017/${common.APP_NAME}_test`,
  PORT: getValue("PORT", 3002),
};

const config = {
  development,
  production,
  test,
};

const mode = getValue<keyof typeof config>("NODE_ENV", "development");

export const env = config[mode] as z.infer<typeof schema>;

export function parseEnv() {
  const parsed = schema.safeParse(env);

  if (parsed.success === false) {
    const parsedErrorString = getParsedErrorString(parsed.error);
    console.error(
      `❌ Invalid environment variables:`,
      `\n${parsedErrorString}`
    );
    throw new Error("Invalid environment variables");
  }
}

const getParsedErrorString = (parsed: z.ZodError) => {
  const errObj = parsed.flatten().fieldErrors;
  return Object.entries(errObj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
};
