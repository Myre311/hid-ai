import Link from "next/link";
import { Zap, ShieldCheck, Lock, BarChart3, Workflow, FileCheck2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { Compliance } from "@/components/marketing/Compliance";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "Pour les entreprises",
  description:
    "Recrutez des AI Specialists et AI Engineers certifiés. Lancez des projets d'annotation, RLHF ou recrutement avec une couverture RGPD complète.",
};

const VALUE_PROPS = [
  {
    Icon: Zap,
    title: "Matching prédictif en moins de 5 secondes",
    body: "Nos modèles internes pré-sélectionnent les profils correspondant à votre brief sur les 48 critères techniques et comportementaux.",
  },
  {
    Icon: ShieldCheck,
    title: "Scoring Chatbot Gatekeeper",
    body: "Chaque AI Engineer est évalué sur 5 dimensions : correction, propreté du code, complexité algorithmique, communication, temps de résolution.",
  },
  {
    Icon: Lock,
    title: "Anonymisation RGPD automatique",
    body: "Visages, plaques, NER : suppression à la volée par notre Data Gateway. Aucune donnée personnelle ne quitte le tunnel sans être passée par le filtre.",
  },
  {
    Icon: BarChart3,
    title: "Dashboard BI temps réel",
    body: "Suivi des missions, qualité par annotateur, taux de retravail, latence — données disponibles en temps réel et exportables.",
  },
  {
    Icon: Workflow,
    title: "Intégration API ou batch",
    body: "Branchez vos pipelines existants via API REST documentée, ou exportez les livrables en S3-compatible / SFTP pour les workflows traditionnels.",
  },
  {
    Icon: FileCheck2,
    title: "Audit trail immuable",
    body: "Chaque opération de la plateforme est loggée et signée — utile pour les revues internes, les audits clients et les exigences ISO.",
  },
];

export default function EntreprisesPage() {
  return (
    <>
      <PageHeader
        kicker="Pour les entreprises"
        title="Accédez à un vivier d'AI Specialists et AI Engineers certifiés."
        lead="Vos projets d'annotation, RLHF, fine-tuning ou recrutement, exécutés par des talents évalués sur 48 critères techniques et comportementaux."
      />

      <Section>
        <Container className="flex flex-col gap-10">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
              Six garanties opérationnelles.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {VALUE_PROPS.map((p, i) => (
              <Reveal key={p.title} delay={0.06 + i * 0.06}>
                <article className="bg-surface border border-border rounded-lg p-7 md:p-8 h-full transition-colors duration-300 hover:border-border-strong">
                  <p.Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 text-lg md:text-xl font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
                    {p.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
              Validation KYB sous 48 heures.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-base text-muted leading-relaxed">
              Création de compte, dépôt de votre numéro d&rsquo;enregistrement,
              vérification manuelle par notre équipe puis activation de votre
              espace projet. Vous recevez votre accès en moins de deux jours
              ouvrés.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/signup?as=business"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
            >
              Démarrer l&rsquo;onboarding entreprise
            </Link>
          </Reveal>
        </Container>
      </Section>

      <Compliance />
      <FinalCta />
    </>
  );
}
