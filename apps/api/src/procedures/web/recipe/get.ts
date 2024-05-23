import { z } from "zod";
import { procedure } from "../../../trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../../config/prisma.config";

const schema = z.object({
  id: z.number(),
});

export const getRecipe = procedure.input(schema).query(async ({ input }) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!recipe) {
      throw new TRPCError({ message: "Recipe not found", code: "NOT_FOUND" });
    }
    return recipe;
  } catch (error) {
    throw new TRPCError({ message: error, code: "INTERNAL_SERVER_ERROR" });
  }
});
