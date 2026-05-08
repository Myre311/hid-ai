import { Container } from "@/components/ui/Container";

const ITEMS = [
  { label: "RGPD" },
  { label: "ISO 27001" },
  { label: "AICPA SOC 2" },
  { label: "AES-256" },
  { label: "mTLS 1.3" },
];

/**
 * Bandeau de certifications, monochrome blanc sur fond noir.
 * Texte uppercase tracking large + grille de logos.
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

        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 border border-foreground/15 rounded-md">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                <span className="text-xs md:text-sm tracking-[0.18em] uppercase font-medium">
                  {item.label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
