import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SystemsCarousel } from "@/components/infrastructure/SystemsCarousel";
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
      <section className="relative pt-32 pb-20 md:pb-28 bg-background">
        <Container className="max-w-5xl">
          <h1 className="t-display">
            HID AI conçues pour produire de la donnée d&rsquo;entraînement à
            grande échelle
          </h1>
        </Container>
      </section>

      {/* Systèmes — carousel horizontal */}
      <SystemsCarousel />

      {/* Carte du monde */}
      <Section className="bg-surface/40">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-3xl">
            <h2 className="font-sans text-3xl md:text-4xl tracking-tight leading-[1.05]">
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
