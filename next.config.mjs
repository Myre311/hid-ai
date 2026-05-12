import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sentry remplace l'instrumentation hook au build — pas besoin de l'opt-in
  experimental: { instrumentationHook: true },
  webpack(config) {
    // Silence du warning OpenTelemetry "Critical dependency" venu de Sentry/Prisma —
    // c'est cosmétique et documenté : https://github.com/getsentry/sentry-javascript/issues/12077
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@opentelemetry\/instrumentation/, message: /Critical dependency/ },
      { module: /@prisma\/instrumentation/, message: /Critical dependency/ },
    ];
    return config;
  },
};

// Sentry build config — n'a d'effet que si SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT
// sont fournis (sinon les source maps ne sont pas uploadées, mais l'app fonctionne).
const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  // Désactive l'upload si auth token absent — évite les errors de build sans creds
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
};

// Si pas de DSN, on retourne la config Next.js telle quelle (Sentry inerte).
const hasSentryDsn = Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);

export default hasSentryDsn
  ? withSentryConfig(nextConfig, sentryBuildOptions)
  : nextConfig;
