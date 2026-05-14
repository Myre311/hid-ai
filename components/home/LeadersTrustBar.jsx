import { Container } from "@/components/ui/Container";

const LEADERS = [
  { name: "RGPD" },
  { name: "ISO 27001" },
  { name: "AICPA SOC 2" },
  { name: "AES-256" },
  { name: "MTLS 1.3" },
];

/**
 * Section "Construit pour les exigences des leaders de l'IA".
 * Bandeau horizontal scrollable manuellement (pas d'auto-scroll).
 */
export function LeadersTrustBar() {
  return (
    <section
      className="bg-background py-20 md:py-28"
      aria-label="Construit pour les exigences des leaders de l'IA"
    >
      <Container className="flex flex-col gap-10 max-w-5xl">
        <div className="flex flex-col gap-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Trust
          </p>
          <h2 className="t-h2-md">
            Construit pour les exigences des leaders de l&rsquo;IA.
          </h2>
        </div>

        <div className="relative -mx-4 md:mx-0">
          <div
            className="hid-trust-scroll flex gap-8 md:gap-14 overflow-x-auto pb-3 px-4 md:px-0 scroll-smooth snap-x snap-proximity [touch-action:pan-x]"
          >
            {LEADERS.map((l) => (
              <LeaderPastille key={l.name} name={l.name} />
            ))}
            {/* Spacer pour permettre le scroll complet jusqu'au dernier item */}
            <div className="flex-shrink-0 w-4 md:w-0" aria-hidden="true" />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </Container>
    </section>
  );
}

function LeaderPastille({ name }) {
  return (
    <span
      aria-label={name}
      className="snap-start inline-flex items-center gap-3 px-2 h-12 text-foreground/80 hover:text-foreground transition-colors duration-200 select-none whitespace-nowrap flex-shrink-0"
    >
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-current" />
      <span className="text-xs md:text-sm tracking-[0.22em] font-medium">{name}</span>
    </span>
  );
}
