import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const PARTNERS = [
  { name: "ATELIER" },
  { name: "NEXUS" },
  { name: "LATTICE" },
  { name: "PRISM" },
  { name: "AXIOM" },
  { name: "VERTEX" },
];

export function TrustedBy() {
  return (
    <Section size="sm" className="border-t border-border">
      <Container>
        <Reveal>
          <p className="text-center text-sm text-muted mb-10">
            Construit pour les exigences des leaders de l&rsquo;IA
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-10 items-center justify-items-center">
            {PARTNERS.map((p) => (
              <PartnerLogo key={p.name} name={p.name} />
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function PartnerLogo({ name }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-muted-strong/70 hover:text-muted transition-colors duration-200 select-none"
      aria-label={name}
    >
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border border-current" />
      <span className="text-sm tracking-[0.18em] font-medium">{name}</span>
    </span>
  );
}
