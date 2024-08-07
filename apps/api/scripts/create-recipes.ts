import { readFileSync } from "fs";
import { PrismaClient, RecipeCategory } from "@prisma/client";
import { config } from "dotenv";
import { convertToSlug } from "./update-recipe-slugs";
import OpenAI from "openai";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

const openai = new OpenAI();

config();

const AUTHOR_ID = 14;

const requestIndexing = async (url: string) => {
  // Define the scope and the URL to be indexed
  const SCOPES = ["https://www.googleapis.com/auth/indexing"];

  // Create a JWT client with the service account credentials
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: "./recipe-wiki-424823-ea961f67d429.json", // Your credentials file path
  });

  const authClient = (await auth.getClient()) as JWT;

  // Define the request body
  const requestBody = {
    url: url,
    type: "URL_UPDATED",
  };

  // Set up the request
  const indexing = google.indexing({ version: "v3", auth: authClient });

  try {
    // Submit the request
    const response = await indexing.urlNotifications.publish({
      requestBody,
    });
    console.log("Indexing request submitted:", response.data);
  } catch (error) {
    console.error("Error submitting indexing request:", error);
  }
};

const inCents = (price: number) => {
  return price * 100;
};

// Use chatGPT to generate recipe ingredients and instructions
const generateRecipe = async (
  title: string,
  _price: number,
  description: string
) => {
  const prompt = `I'm going to give you a title and description of a menu item. Generate a list of ingredients (including measurements) and directions (exclude step number) as an array of strings. Example: ["Chicken", "ingredient 1", "ingredient 2", "Au Jus", "ingredient 1", "ingredient 2"]
\n\n
If the recipe has different sections, include those as labels in the ingredients and directions. As an example, I would expect you to return the format like this: [ "Chicken", "step 1", "step 2", "Au Jus", "Step 1", "Step 2"].
\n\n
Only return ingredients and directions in a json object.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = response?.choices?.[0]?.message?.content || "";
    const parsedResult = JSON.parse(result);

    console.log(`Generated ${title}:`);
    console.log(`Ingredients:`, parsedResult?.ingredients?.length);
    console.log(`Directions:`, parsedResult?.directions?.length);

    return parsedResult;
  } catch (error) {
    console.error("Error generating recipe:", error);
  }
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
      const generatedRecipe = await generateRecipe(
        recipe.title,
        recipe.price,
        recipe.description
      );
      const ingredients = generatedRecipe.ingredients;
      const directions = generatedRecipe.directions;

      const slug = convertToSlug(recipe.title);

      const createdRecipe = await prisma.recipe.create({
        data: {
          ...recipe,
          ingredients,
          directions,
          slug,
          categories: [RecipeCategory.DINNER],
          price: inCents(recipe.price),
          author: { connect: { id: AUTHOR_ID } },
        },
        select: {
          author: { select: { username: true } },
        },
      });

      await requestIndexing(
        `https://pekinthechef.com/${createdRecipe.author.username}/${slug}`
      );
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  }

  await prisma.$disconnect();
};

main();
