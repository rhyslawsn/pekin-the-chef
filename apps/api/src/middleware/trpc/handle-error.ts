import { TRPCError } from "@trpc/server";

import { Context } from "../../context";
import { ApplicationError } from "../../errors/index";

const getTrpcErrorCodeFromStatus = (status: number) => {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 400) return "BAD_REQUEST";
  return "INTERNAL_SERVER_ERROR";
};

export const handleError = async (
  err: ApplicationError | any,
  _ctx: Context,
  procedure: string,
  _additional?: { [key: string]: any }
) => {
  console.error(err);

  const status = err.status || 500;

  const message = err?.meta?.cause ?? err?.message ?? "Something went wrong";

  if (status !== 404) {
    console.log("Error in procedure", procedure, message);
  }

  throw new TRPCError({
    code: getTrpcErrorCodeFromStatus(status),
    message,
    cause: err,
  });
};
