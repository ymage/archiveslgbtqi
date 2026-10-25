import { client } from "@/sanity/lib/server-client";
import { pagesSlugQuery } from "@/sanity/lib/queries";

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const baseUrl = siteURL;

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
  ];

  // Fetch your dynamic data
  // Replace these with your actual data fetching functions
  const pages = await client.fetch(pagesSlugQuery);

  const pagesRoutes = pages.map((page: { slug: any; _updatedAt: any }) => ({
    url: `${baseUrl}/${page?.slug || ""}`,
    lastModified: new Date(page?._updatedAt || Date.now()),
  }));

  return [...staticRoutes, ...pagesRoutes];
}
