import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the00sversion.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/order-confirmation"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
