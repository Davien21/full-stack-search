import mongoose from "mongoose";
import { env } from "@/config/env";
import logger from "@/config/logger";

const db = env.DATABASE_URL;

export const openDBConnection = async () => {
  try {
    await mongoose.connect(db, {});
    logger.info(`Connected to ${db}`);
  } catch (err: any) {
    logger.error(err.message);
  }
};
