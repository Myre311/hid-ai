/**
 * robots.txt auto-généré (Next.js App Router convention).
 * Bloque le crawl des routes privées (dashboard, admin, api).
 */
export default function robots() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://hid-ai.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api", "/signup/verify", "/signup/phone"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
