import { authInfoMiddleware } from "./middleware/trpc/auth-info";
import { permissionsMiddleware } from "./middleware/trpc/shield";
import { trpc } from "./trpc";

export const procedure = trpc.procedure
  .use(permissionsMiddleware)
  .use(authInfoMiddleware);
