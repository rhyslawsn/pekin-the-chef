import { PrismaClient } from "@prisma/client";

export const convertToUsername = (title: string) => {
  // Remove all characters except for letters, numbers
  const cleanedTitle = title.replace(/[^a-zA-Z0-9]/g, "");

  return cleanedTitle.toLowerCase();
};

const main = async () => {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany();

  for (const user of users) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          username: convertToUsername(`${user.firstName}${user.lastName}`),
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  await prisma.$disconnect();
};

main();
