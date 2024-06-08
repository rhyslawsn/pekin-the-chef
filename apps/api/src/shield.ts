import { TRPCError } from "@trpc/server";
import { allow, deny, shield } from "trpc-shield";

import { Context } from "./context";

export const webPermissions = shield<Context>(
  {
    query: {
      getRecipe: allow,
      getRecipes: allow,
    },
    mutation: {},
  },
  {
    fallbackRule: deny,
    fallbackError: new TRPCError({
      code: "FORBIDDEN",
      message: "You are not allowed to access this resource",
    }),
  }
);
