// Keep at the app/ root: under the (next) route group, Next 16.4.3 does not build /robots.txt (it falls through to [slug] and 404s).
const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/utils/", "/studio/", "/api/"],
      },
    ],
    host: siteURL,
    sitemap: `${siteURL}/sitemap.xml`,
  };
}
