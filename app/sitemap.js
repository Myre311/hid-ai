/**
 * Sitemap XML auto-généré (Next.js App Router convention).
 * Exposé à /sitemap.xml et référencé par Google/Bing pour le crawl.
 */

const ROUTES_STATIC = [
  { path: "", priority: 1.0, freq: "weekly" },
  { path: "/a-propos", priority: 0.8, freq: "monthly" },
  { path: "/entreprises", priority: 0.9, freq: "monthly" },
  { path: "/talents", priority: 0.9, freq: "monthly" },
  { path: "/infrastructure", priority: 0.7, freq: "monthly" },
  { path: "/contact", priority: 0.6, freq: "yearly" },
  { path: "/legal", priority: 0.3, freq: "yearly" },
  { path: "/terms", priority: 0.3, freq: "yearly" },
  { path: "/privacy", priority: 0.3, freq: "yearly" },
  { path: "/gdpr", priority: 0.3, freq: "yearly" },
];

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://hid-ai.com";
  const now = new Date().toISOString();
  return ROUTES_STATIC.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
