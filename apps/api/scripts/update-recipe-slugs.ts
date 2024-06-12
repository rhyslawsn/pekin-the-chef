import { PrismaClient } from "@prisma/client";

const convertToSlug = (title: string) => {
  // Remove all characters except for letters, numbers and spaces
  const cleanedTitle = title.replace(/[^a-zA-Z0-9 ]/g, "");

  return cleanedTitle.toLowerCase().replace(/\s+/g, "-");
};

const main = async () => {
  const prisma = new PrismaClient();

  const recipes = await prisma.recipe.findMany();

  for (const recipe of recipes) {
    try {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: {
          slug: convertToSlug(recipe.title),
        },
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  }

  await prisma.$disconnect();
};

main();
