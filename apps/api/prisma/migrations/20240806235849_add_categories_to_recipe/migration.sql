-- CreateEnum
CREATE TYPE "RecipeCategory" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'DESSERT', 'SNACK', 'DRINK');

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "categories" TEXT[];
