import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../../config/prisma.config";
import { procedure } from "../../../procedure";

const schema = z
  .object({
    authorId: z.number().optional(),
  })
  .optional();

export const getRecipes = procedure.input(schema).query(async ({ input }) => {
  try {
    const recipe = await prisma.recipe.findMany({
      where: { authorId: input?.authorId },
    });
    if (!recipe) {
      throw new TRPCError({ message: "Recipes not found", code: "NOT_FOUND" });
    }
    return recipe;
  } catch (error) {
    throw new TRPCError({ message: error, code: "INTERNAL_SERVER_ERROR" });
  }
});
