import { z } from "zod";
import { procedure } from "../../../procedure";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../../config/prisma.config";

const schema = z.object({
  username: z.string(),
  slug: z.string(),
});

export const getRecipe = procedure.input(schema).query(async ({ input }) => {
  try {
    const author = await prisma.user.findUnique({
      where: { username: input.username },
    });
    if (!author) {
      throw new TRPCError({ message: "Author not found", code: "NOT_FOUND" });
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        slug_authorId: {
          slug: input.slug,
          authorId: author?.id,
        },
      },
      include: { author: true },
    });
    if (!recipe) {
      throw new TRPCError({ message: "Recipe not found", code: "NOT_FOUND" });
    }
    return recipe;
  } catch (error) {
    throw new TRPCError({ message: error, code: "INTERNAL_SERVER_ERROR" });
  }
});
