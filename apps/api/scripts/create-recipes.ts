import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const AUTHOR_ID = 2;

const inCents = (price: number) => {
  return price * 100;
};

const main = async () => {
  const prisma = new PrismaClient();

  // Load the partial-recipes.json file
  const filePath = "./partial-recipes.json";
  const fileContent = readFileSync(filePath, "utf-8");

  // Parse the file content as JSON
  const recipes = JSON.parse(fileContent);

  for (const recipe of recipes) {
    try {
      await prisma.recipe.create({
        data: {
          title: recipe.title,
          description: recipe.description,
          price: inCents(recipe.price),
          author: { connect: { id: AUTHOR_ID } },
        },
      });
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  }

  await prisma.$disconnect();
};

main();
