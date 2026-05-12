/**
 * Next.js instrumentation hook — chargé automatiquement par le runtime.
 * Choisit la bonne config Sentry selon l'environnement d'exécution.
 *
 * Documentation : https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
