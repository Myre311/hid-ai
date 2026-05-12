/**
 * Sentry — config Node (API routes, Server Components, server actions).
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    // Filtre les en-têtes sensibles côté server
    beforeSend(event) {
      const req = event.request;
      if (req?.cookies) req.cookies = "[Filtered]";
      if (req?.headers?.authorization) req.headers.authorization = "[Filtered]";
      if (req?.headers?.cookie) req.headers.cookie = "[Filtered]";
      return event;
    },
  });
}
