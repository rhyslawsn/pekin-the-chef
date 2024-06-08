import { User } from "@prisma/client";
import { prisma } from "../../config/prisma.config";
import { middleware } from "../../trpc";

export const authInfoMiddleware = middleware(async ({ next, ctx }) => {
  let user: User;

  // Get latest user
  if (ctx?.user?.id) {
    user = await prisma.user.findUnique({ where: { id: ctx.user.id } });
  }

  return next({
    ctx: { user },
  });
});
