import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/Timeline";
import { B2BTriggerButton } from "@/components/forms/buttons/InscriptionTriggerButtons";

export const metadata = {
  title: "À propos",
  description:
    "HID AI — une plateforme d'infrastructure IA gérée depuis la France avec opérateurs en Côte d'Ivoire, Maroc et Congo Brazzaville.",
};

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pb-28 bg-background">
        <Container className="max-w-5xl">
          <h1 className="t-display">
            Une plateforme d&rsquo;infrastructure IA
          </h1>
        </Container>
      </section>

      {/* Société */}
      <Section className="bg-background">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              HID AI
            </p>
            <h2 className="t-h2-md">
              Une ingénierie française et une exécution internationale.
            </h2>
            <p className="t-lead">
              HID AI déploie une infrastructure de pointe pilotée depuis la
              France, s&rsquo;appuyant sur des centres d&rsquo;excellence
              stratégiques en Côte d&rsquo;Ivoire, au Maroc et au
              Congo-Brazzaville.
            </p>
          </div>
        </Container>
      </Section>

      {/* Notre vision (renamed from "Notre conviction", Hub mention removed) */}
      <Section className="bg-surface/40">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Notre vision
            </p>
            <h2 className="t-h2-md">
              Le talent est universel, l&rsquo;infrastructure pour le mobiliser
              est notre expertise.
            </h2>
            <p className="t-lead">
              HID AI déploie une infrastructure technologique là où le potentiel
              est le plus fort. Nous offrons aux laboratoires et entreprises
              tech une solution souveraine pour produire des actifs de données
              de haute précision à une échelle industrielle. En certifiant et
              en encadrant les meilleurs talents africains, nous garantissons
              une data éthique, sécurisée et d&rsquo;une fiabilité supérieure
              pour vos modèles les plus exigeants.
            </p>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section className="bg-background">
        <Container className="max-w-3xl flex flex-col gap-10">
          <h2 className="t-h2-md">
            Trois années de construction.
          </h2>
          <Timeline />
        </Container>
      </Section>

      {/* Contact */}
      <Section className="bg-background">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="t-h3">
            Travailler ensemble.
          </h2>
          <p className="text-base text-muted leading-relaxed">
            HID AI · Marseille · Contact@hid-ai.com
          </p>
          <B2BTriggerButton className="inline-flex items-center gap-2 mt-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
            Parler à notre équipe
            <ArrowRight className="h-4 w-4" />
          </B2BTriggerButton>
        </Container>
      </Section>
    </>
  );
}
