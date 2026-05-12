/**
 * Sentry — config navigateur.
 *
 * Activé uniquement si NEXT_PUBLIC_SENTRY_DSN est défini.
 * Voir https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    // Performance tracing — 10% en prod, 100% en dev/preview.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Session replay : 0% par défaut (RGPD-sensible). Activable plus tard.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    debug: false,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    // Filtre les erreurs trop bruyantes (extensions navigateur, etc.)
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
    ],
    // Scrubbing : ne pas envoyer les valeurs des cookies / tokens
    beforeSend(event) {
      if (event.request?.cookies) event.request.cookies = "[Filtered]";
      if (event.request?.headers?.authorization) event.request.headers.authorization = "[Filtered]";
      return event;
    },
  });
}
