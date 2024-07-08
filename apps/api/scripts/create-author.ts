import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { convertToUsername } from "./update-usernames";

config();

const FIRST_NAME = "Earls Kitchen + Bar - Victoria";
const LAST_NAME = "";

const createAuthor = async () => {
  const prisma = new PrismaClient();
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_API_KEY || ""
  );
  try {
    // Create Supabase user
    const username = convertToUsername(`${FIRST_NAME}${LAST_NAME}`);
    const email = `${username}@pekinthechef.com`;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: process.env.PLACEHOLDER_PASSWORD || "",
    });

    if (error) throw error;

    const newAuthor = await prisma.user.create({
      data: {
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
        email,
        supabaseUserId: data?.user?.id || "",
        username,
      },
    });
    console.log("Author created:", newAuthor);
  } catch (error) {
    console.error("Error creating author:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAuthor();
