import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SystemsGrid } from "@/components/infrastructure/SystemsGrid";
import { WorldMap } from "@/components/infrastructure/WorldMap";

export const metadata = {
  title: "Infrastructure",
  description:
    "L'infrastructure HID AI conçue pour produire de la donnée d'entraînement à grande échelle. Conformité européenne, transparence, qualité.",
};

export default function InfrastructurePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pb-28 bg-background border-b border-border/40">
        <Container className="max-w-5xl">
          <h1 className="t-display">
            HID AI conçues pour produire de la donnée d&rsquo;entraînement à
            grande échelle.
          </h1>
        </Container>
      </section>

      {/* Systèmes */}
      <Section className="bg-background">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-3 max-w-3xl">
            <h2 className="t-h2-md">
              Les systèmes HID AI
            </h2>
            <p className="t-lead">
              Une infrastructure pensée pour la conformité européenne, la
              transparence et la qualité des données traitées.
            </p>
          </div>

          <SystemsGrid />
        </Container>
      </Section>

      {/* Carte du monde */}
      <Section className="bg-surface/40 border-t border-border/40">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-[1.05]">
              Une présence en Europe et en Afrique.
            </h2>
            <p className="text-base text-muted leading-relaxed">
              Direction depuis la France, opérations sur trois pays africains.
            </p>
          </div>

          <WorldMap />
        </Container>
      </Section>
    </>
  );
}
