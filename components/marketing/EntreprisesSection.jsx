import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    title: "Matching prédictif sous 5 secondes",
    body: "Nos modèles internes pré-sélectionnent les profils correspondant à votre brief sur les 48 critères techniques et comportementaux.",
  },
  {
    title: "Scoring Chatbot Gatekeeper",
    body: "Chaque AI Engineer est évalué sur 5 dimensions techniques avant d'apparaître dans vos résultats.",
  },
  {
    title: "Anonymisation RGPD automatique",
    body: "Visages, plaques, NER : suppression à la volée par notre Data Gateway. Aucune donnée personnelle ne sort sans filtre.",
  },
  {
    title: "Dashboard BI temps réel",
    body: "Suivi des missions, qualité par annotateur, latence — données exportables, format ouvert.",
  },
];

export function EntreprisesSection() {
  return (
    <Section id="entreprises" className="border-t border-border">
      <Container className="flex flex-col gap-14 md:gap-20">
        {/* En-tête éditorial */}
        <Reveal>
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-end">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">Pour les entreprises</p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
                Un vivier <em className="italic">certifié</em>,<br />
                des livrables <em className="italic">auditables</em>.
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
              Vos projets d&rsquo;annotation, RLHF, fine-tuning et recrutement,
              exécutés par des talents évalués sur 48 critères. Une plateforme
              unifiée, conforme RGPD, intégrable à vos pipelines existants.
            </p>
          </div>
        </Reveal>

        {/* Grille éditoriale 2x2 — pas de cards, pas de gradient, juste typo */}
        <div className="grid md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-12 border-t border-border pt-14">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={0.06 + i * 0.06}>
              <article className="flex flex-col gap-3 max-w-md">
                <h3 className="text-lg md:text-xl font-medium tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTAs en bas, sobres */}
        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center gap-6 border-t border-border pt-10">
            <Link
              href="/entreprises"
              className="inline-flex items-center gap-2 text-base font-medium text-foreground hover:gap-3 transition-all duration-200"
            >
              <span className="border-b border-foreground pb-0.5">
                Découvrir l&rsquo;offre entreprises
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup?as=business"
              className="text-base text-muted hover:text-foreground transition-colors"
            >
              Demander une démo
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
