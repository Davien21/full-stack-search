import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  APP_NAME: z.string(),
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  PORT: z.union([z.string(), z.number()]).transform((val) => {
    return typeof val === "number" ? val : parseInt(val, 10);
  }),
  DATABASE_URL: z.string().includes("mongodb"),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.union([z.string(), z.number()]).transform((val) => {
    return typeof val === "number" ? val : parseInt(val, 10);
  }),
  REDIS_PASSWORD: z.string(),
  TYPESENSE_HOST: z.string(),
  TYPESENSE_PORT: z.union([z.string(), z.number()]).transform((val) => {
    return typeof val === "number" ? val : parseInt(val, 10);
  }),
  TYPESENSE_PROTOCOL: z.enum(["http", "https"] as const),
  TYPESENSE_ADMIN_API_KEY: z.string(),
});

export default schema;

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
  TYPESENSE_PORT: getValue("TYPESENSE_PORT", 8108),
  TYPESENSE_HOST: getValue("TYPESENSE_HOST", "localhost"),
  TYPESENSE_PROTOCOL: getValue("TYPESENSE_PROTOCOL", "http"),
  TYPESENSE_ADMIN_API_KEY: getValue("TYPESENSE_ADMIN_API_KEY", "xyz"),
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
