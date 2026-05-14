import { Container } from "@/components/ui/Container";

/**
 * Bandeau de conformité : texte réglementaire seul, pas de logos.
 */
export function CertificationsBadges() {
  return (
    <section className="bg-background py-20 md:py-28">
      <Container className="flex flex-col items-center max-w-4xl">
        <p className="text-center text-[11px] md:text-xs uppercase tracking-[0.22em] text-foreground/60 leading-relaxed max-w-3xl">
          L&rsquo;infrastructure et les opérations de notre plate-forme cloud
          sont certifiées conformes aux normes et cadres de meilleures
          pratiques de l&rsquo;industrie
        </p>
      </Container>
    </section>
  );
}
