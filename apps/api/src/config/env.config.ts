import { config } from "dotenv";
import { z } from "zod";

config();

type ENVS = "dev" | "stg" | "prd";

const rawAppEnv = process.env.APP_ENV;

if (rawAppEnv && !rawAppEnv.includes(rawAppEnv as ENVS)) {
  throw new Error("Invalid APP_ENV. Please select one of: dev, stg, prd");
}

const envVariables = z.object({
  APP_ENV: z.string(),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string(),
  PORT: z.string(),
  PUBLIC_DIR: z.string(),
  SUPABASE_API_KEY: z.string(),
  SUPABASE_URL: z.string(),
  VISITOR_SECRET: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
});

export const ENV = envVariables.parse(process.env);

if (ENV.DATABASE_URL.indexOf("pool_timeout=0") === -1) {
  console.warn(
    "\x1b[31mPool timeout not set to 0 on the Postgres connection string - Importing rates will cause issues\x1b[0m"
  );
}
