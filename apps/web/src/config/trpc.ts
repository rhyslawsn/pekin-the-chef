import { Router } from "@recipe-wiki/api";
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type TrpcInputs = inferRouterInputs<Router>;
export type TrpcOutputs = NonNullable<inferRouterOutputs<Router>>;

export const trpc = createTRPCReact<Router>();
