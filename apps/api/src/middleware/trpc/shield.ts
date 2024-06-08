import { allow, deny, shield } from "trpc-shield";

import { Context } from "../../context";
import { middleware } from "../../trpc";

const permissions = shield<Context>(
  {
    query: {
      getRecipe: allow,
      getRecipes: allow,
    },
    mutation: {},
    subscription: {},
  },
  { fallbackRule: deny }
);

export const permissionsMiddleware = middleware(permissions);
