import { ENVS } from "@recipe-wiki/types";

const rawAppEnv = import.meta.env.VITE_APP_ENV;

if (rawAppEnv && !rawAppEnv.includes(rawAppEnv as ENVS)) {
  throw new Error("Invalid APP_ENV. Please select one of: dev, stg, prd");
}

const APP_ENV = rawAppEnv as ENVS;
if (!APP_ENV) throw new Error("APP_ENV not set");

const { VITE_FRONTEND_URL: FRONTEND_URL } = import.meta.env;

export const ENV = {
  APP_ENV,
  FRONTEND_URL,
};
