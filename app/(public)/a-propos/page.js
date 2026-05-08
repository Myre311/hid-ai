import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/Timeline";
import { MediaGallery } from "@/components/about/MediaGallery";

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
              Hidea Solution
            </p>
            <h2 className="t-h2-md">
              Une société française, des hubs africains.
            </h2>
            <p className="t-lead">
              HID AI est géré depuis la France avec des opérateurs en
              Côte d&rsquo;Ivoire, au Maroc et Congo Brazzaville.
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
              Le talent est partout. L&rsquo;infrastructure pour le mettre au
              travail, beaucoup moins.
            </h2>
            <p className="t-lead">
              HID AI construit cette infrastructure là où le talent émerge —
              pas où le capital se concentre. On ne vend pas de promesse de
              prospérité par l&rsquo;IA. On fournit aux laboratoires
              occidentaux la donnée d&rsquo;entraînement qu&rsquo;ils
              n&rsquo;arrivent pas à produire à coût raisonnable, et aux
              talents africains des missions, une certification et un paiement
              réel.
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

      {/* Médias */}
      <Section className="bg-surface/40">
        <Container className="max-w-5xl flex flex-col gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h2 className="t-h2-md">
              Sur le terrain.
            </h2>
            <p className="text-base text-muted leading-relaxed">
              Photos de formations, ateliers, et restitutions équipe. Vidéo
              institutionnelle à venir.
            </p>
          </div>
          <MediaGallery />
        </Container>
      </Section>

      {/* Contact */}
      <Section className="bg-background">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="t-h3">
            Travailler ensemble.
          </h2>
          <p className="text-base text-muted leading-relaxed">
            Hidea Solution · Paris · contact@hidea-solution.fr
          </p>
          <Link
            href="mailto:contact@hidea-solution.fr"
            className="inline-flex items-center gap-2 mt-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200"
          >
            Parler à notre équipe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </Section>
    </>
  );
}
