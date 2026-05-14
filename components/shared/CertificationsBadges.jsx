import { Container } from "@/components/ui/Container";

const ITEMS = [
  { label: "SOC 2",       sublabel: "Type II" },
  { label: "ISO 27001",   sublabel: "Certified" },
  { label: "HIPAA",       sublabel: "Healthcare Ready" },
  { label: "RGPD / GDPR", sublabel: "EU Compliant" },
  { label: "AES-256",     sublabel: "At Rest" },
  { label: "TLS",         sublabel: "In Transit" },
];

/**
 * Bandeau de certifications, texte seul (pas de logos).
 */
export function CertificationsBadges() {
  return (
    <section className="bg-background py-24 md:py-32">
      <Container className="flex flex-col items-center gap-12 max-w-4xl">
        <p className="text-center text-[11px] md:text-xs uppercase tracking-[0.22em] text-foreground/60 leading-relaxed max-w-3xl">
          L&rsquo;infrastructure et les opérations de notre plate-forme cloud
          sont certifiées conformes aux normes et cadres de meilleures
          pratiques de l&rsquo;industrie suivants
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-8 w-full place-items-center">
          {ITEMS.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-sm md:text-base tracking-[0.14em] uppercase font-semibold text-foreground/90">
                {item.label}
              </span>
              <span className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-foreground/50">
                {item.sublabel}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
