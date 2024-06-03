import axios from "axios";
import https from "https";
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const agent = new https.Agent({
  rejectUnauthorized: false,
});
const instance = axios.create({
  headers: {
    "User-Agent": "*",
  },
  httpsAgent: agent,
});

const fetchPotentialMenuUrisFromTags = (menuTags, url) => {
  //   Filter out every tag except for img, a
  const filteredTags = menuTags.filter(
    (tag) => tag.includes("img") || tag.includes("a")
  );
  // Get the link from the src attribute from all the tags
  const dirtyLinks = filteredTags
    .map((tag) => {
      //   Grab the entire link from the src or href attributes from the tag
      const match = tag.match(/(?<=(href|src)=["'])([^"']+)(?=["'])/g);
      const isPotentialLink = match?.[1]?.startsWith("/");
      if (isPotentialLink) {
        return `${url}${match?.[1]}`;
      }
      const isAbsoluteLink = match?.[1]?.startsWith("http");
      return isAbsoluteLink ? match?.[1] : false;
    })
    .filter(Boolean)
    .filter((link) => {
      // Fetch the last component of the path
      const parts = link.split("/");
      const lastPart = parts[parts.length - 1];
      // Check if the last component is a file extension
      const includesValidExtension =
        lastPart.includes(".html") ||
        lastPart.includes(".pdf") ||
        lastPart.includes(".png") ||
        lastPart.includes(".jpg");

      // We still want to include the link if it doesn't have an file extension
      // This is because the link could be a page that contains the menu
      return includesValidExtension || !lastPart.includes(".");
    });
  const deduplicatedLinks: string[] = Array.from(new Set(dirtyLinks));
  const links = deduplicatedLinks.map((link) => {
    // Remove any query parameters from the link
    const parts = link.split("?");
    return parts[0];
  });

  return links;
};

const getBaseUrl = (url) => {
  const parts = url.split("/");
  return `${parts[0]}//${parts[2]}`;
};

const isHTML = (str) => {
  const dom = new JSDOM(str);
  const doc = dom.window.document;
  return Array.from(doc.body.childNodes).some(
    (node: any) => node.nodeType === 1
  );
};

const fetchTagsWithMenu = (html: string) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Search for elements containing 'menu' in attributes or content
  const allElements = document.querySelectorAll("*");
  const elementsWithMenu: any[] = Array.from(allElements).filter(
    (element: any) => {
      const hasAttributes = element.hasAttributes();
      const isContentHtml = isHTML(element.innerHTML);
      // Check if any attribute contains 'menu'
      if (hasAttributes && !isContentHtml) {
        return Array.from(element.attributes).some((attribute: any) =>
          attribute.value.toLowerCase().includes("menu")
        );
      }
      // Check if inner text is not HTML and includes 'menu'
      return (
        element?.innerHtml &&
        !isContentHtml &&
        element?.innerHtml?.toLowerCase()?.includes("menu")
      );
    }
  );
  return elementsWithMenu.map((element) => element.outerHTML);
};

const fetchMenusFromUrl = async (url) => {
  try {
    const response = await instance.get(url);
    const html = response.data;

    const menuTags = fetchTagsWithMenu(html);
    const baseUrl = getBaseUrl(url);
    const potentialMenuUris = fetchPotentialMenuUrisFromTags(menuTags, baseUrl);

    return potentialMenuUris;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  }
};

const fetchMenusFromPlace = async (place) => {
  const name = place.name;
  const url = place.url;
  const menuUrls = place.menuUrls;
  console.log(`Fetching menus for ${name}...`);

  let menuAssetUrls;
  if (!menuUrls.length) {
    menuAssetUrls = await fetchMenusFromUrl(url);
  }

  if (menuUrls.length > 0) {
    const promises = menuUrls.map(
      async (menuUrl) => await fetchMenusFromUrl(menuUrl)
    );
    menuAssetUrls = await Promise.all(promises);
  }

  place.menuAssetUrls = menuAssetUrls.flat();

  return place;
};

const main = async () => {
  //   Loop through places.csv and fetch menus from each url in the property menuUrls
  const rawPlaces = readFileSync("places.csv", "utf-8");
  const places = JSON.parse(rawPlaces);

  const nextPlace = await fetchMenusFromPlace(places[19]);

  const nextPlaces = places.map((place) => {
    if (place.website === nextPlace.website) {
      return nextPlace;
    }
    return place;
  });
  //   Write the menu urls to places.csv
  const csv = JSON.stringify(nextPlaces, null, 2);
  writeFileSync("places.csv", csv);
  console.log("Data has been written to places.csv");
};
main();
