import * as TRPC from "@trpc/server";

import { Context } from "./context";

export const trpc = TRPC.initTRPC.context<Context>().create();
export const middleware = trpc.middleware;
