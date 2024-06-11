import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const FIRST_NAME = "Papa Johns";
const LAST_NAME = "";
const EMAIL = "placeholder+1@recipewiki.com";

const createAuthor = async () => {
  const prisma = new PrismaClient();
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_API_KEY || ""
  );
  try {
    // Create Supabase user
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: process.env.PLACEHOLDER_PASSWORD || "",
    });

    if (error) throw error;

    const newAuthor = await prisma.user.create({
      data: {
        firstName: FIRST_NAME,
        lastName: LAST_NAME,
        email: EMAIL,
        supabaseUserId: data?.user?.id || "",
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
