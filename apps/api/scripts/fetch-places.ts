import axios from "axios";
import { writeFileSync } from "fs";
import { config } from "dotenv";
import xml2js from "xml2js";

config();

const MENU_KEYWORDS = [
  "menu",
  "dinner",
  "lunch",
  "breakfast",
  "drink",
  "happy",
  "features",
];

const doesUrlIncludeMenuKeyword = (url) =>
  MENU_KEYWORDS.some((keyword) => url.includes(keyword));

const getBaseUrl = (url) => {
  const parts = url.split("/");
  return `${parts[0]}//${parts[2]}`;
};

// Function to fetch and parse the sitemap
const fetchSitemap = async (url) => {
  try {
    const response = await axios.get(url);
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const doesUrlsetExist = !!result.urlset;

    if (!doesUrlsetExist) {
      const doesSitemapIndexExist = !!result.sitemapindex;

      // Should almost never happen
      if (!doesSitemapIndexExist) return [];

      const sitemapUrls: string[] = result.sitemapindex.sitemap.map(
        (sitemapEntry) => sitemapEntry.loc
      );

      console.log("Found sitemap index, fetching sitemaps:", sitemapUrls);

      const sitemapPromises = sitemapUrls.flatMap(fetchSitemap);
      const sitemaps = await Promise.all(sitemapPromises);
      return sitemaps.flat();
    }

    return result.urlset.url.map((urlEntry) => urlEntry.loc);
  } catch (error) {
    console.error("Error fetching or parsing sitemap:", error);
    return [];
  }
};

const fetchMenuUrls = async (url) => {
  try {
    const baseUrl = getBaseUrl(url);

    const urls = await fetchSitemap(`${baseUrl}/sitemap.xml`);
    const menuUrls = urls.filter((url) => doesUrlIncludeMenuKeyword(url));

    console.log("Found menu URLs:", menuUrls);

    return menuUrls;
  } catch (error) {
    console.error("Error fetching or parsing sitemap:", error);
    return [];
  }
};

// Function to fetch data from Google Maps Places API
const fetchDataFromGoogleMaps = async (url: string, keywords: string[]) => {
  const encodedKeywords = encodeURIComponent(keywords.join(" "));
  const fullUrl = `${url}?key=${process.env.GOOGLE_MAPS_API_KEY}&query=${encodedKeywords}`;

  try {
    const response = await axios.get(fullUrl);
    const placesPromises = response.data.results.map(async (place: any) => {
      // Fetch the place details
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAPS_API_KEY}&place_id=${place.place_id}&fields=name,website`;
      const detailsResponse = await axios.get(detailsUrl);
      const details = detailsResponse.data.result;

      const menuUrls = await fetchMenuUrls(details.website);

      return {
        name: place.name,
        website: details.website,
        menuUrls,
        address: place.formatted_address,
        icon: place.icon,
      };
    });
    const places = await Promise.all(placesPromises);
    const csv = JSON.stringify(places, null, 2);
    writeFileSync("places.csv", csv);
    console.log("Data has been written to places.csv");
  } catch (error) {
    console.error("Error fetching data from Google Maps:", error);
  }
};

// Usage
const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const keywords = ["restaurants", "Victoria, BC"];

fetchDataFromGoogleMaps(url, keywords);
// fetchMenuUrls("https://10acres.ca/");
