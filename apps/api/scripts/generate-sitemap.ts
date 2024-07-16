import { config } from "dotenv";
import { prisma } from "../src/config/prisma.config";
import fs from "fs";
import path from "path";

config();

const currentDate = new Date().toISOString().split("T")[0];

// Generate the sitemap XML
const generateSitemap = (urls: string[]): string => {
  const newUrls = urls.map((url) => {
    return `
            <url>
                <loc>${url}</loc>
                <lastmod>${currentDate}</lastmod>
                <changefreq>monthly</changefreq>
            </url>
        `;
  });

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${newUrls.join("")}
    </urlset>
    `;
};

const main = async () => {
  const recipes = await prisma.recipe.findMany({
    select: { slug: true, author: true },
  });
  const urls = recipes.map((recipe) => {
    return `https://pekinthechef.com/${recipe.author.username}/${recipe.slug}`;
  });
  const sitemap = generateSitemap(urls);

  // Save file to data directory
  fs.writeFileSync(
    path.join(__dirname, `../data/sitemaps/sitemap-${currentDate}.xml`),
    sitemap
  );
};

main();
