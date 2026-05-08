import Link from "next/link";
import { Globe, Smartphone, TrendingUp, Users, Sparkles, Code2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "Pour les talents",
  description:
    "AI Specialist ou AI Engineer : missions internationales, paiement Mobile Money sous 5 minutes, progression continue.",
};

const PERKS = [
  {
    Icon: Globe,
    title: "Missions de laboratoires internationaux",
    body: "Annotation, RLHF, vision par ordinateur, NLP — pour des clients en Europe et en Amérique du Nord, sur des sujets de pointe.",
  },
  {
    Icon: Smartphone,
    title: "Versement Mobile Money en moins de 5 minutes",
    body: "Orange Money, MTN MoMo, Wave, Airtel Money — virement immédiat dès validation de la tâche, sans frais de change cachés.",
  },
  {
    Icon: TrendingUp,
    title: "Progression débloquée par le Flow Manager IA",
    body: "Vos performances sont surveillées en continu. Plus la qualité monte, plus le système débloque des niveaux de mission mieux rémunérés.",
  },
  {
    Icon: Users,
    title: "Formation continue & peer review",
    body: "Sessions hebdomadaires en ligne, mentorat par d'autres certifiés, accès à une bibliothèque interne de cas annotés et corrigés.",
  },
];

export default function TalentsPage() {
  return (
    <>
      <PageHeader
        kicker="Pour les talents"
        title="Construisez une carrière dans l'IA, sans quitter le continent."
        lead="Deux parcours possibles, en fonction de votre profil. Pas de prérequis cachés. Pas de frais d'inscription."
      />

      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <Reveal>
              <article className="bg-surface border border-border rounded-lg p-8 md:p-10 h-full">
                <Sparkles className="h-7 w-7 text-accent" aria-hidden="true" />
                <h2 className="mt-5 font-serif text-2xl md:text-3xl tracking-tight">
                  AI Specialist
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Annotation · Labellisation · RLHF
                </p>
                <p className="mt-5 text-sm md:text-base text-muted leading-relaxed">
                  Démarrez sans prérequis technique avancé. Le Flow Manager IA
                  surveille votre progression et débloque automatiquement les
                  niveaux de mission au fil de votre montée en qualité.
                </p>
                <Link
                  href="/signup"
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
                >
                  S&rsquo;inscrire comme Specialist
                </Link>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="bg-surface border border-border rounded-lg p-8 md:p-10 h-full">
                <Code2 className="h-7 w-7 text-accent" aria-hidden="true" />
                <h2 className="mt-5 font-serif text-2xl md:text-3xl tracking-tight">
                  AI Engineer
                </h2>
                <p className="mt-2 text-sm text-muted">
                  NLP · Vision · Optimisation
                </p>
                <p className="mt-5 text-sm md:text-base text-muted leading-relaxed">
                  Missions techniques avancées sur des projets de fine-tuning,
                  de mise en production et d&rsquo;optimisation. Validation de
                  votre profil par le Chatbot Gatekeeper avant l&rsquo;accès aux
                  missions.
                </p>
                <Link
                  href="/signup"
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
                >
                  S&rsquo;inscrire comme Engineer
                </Link>
              </article>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <Container>
          <Reveal>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
              Quatre raisons concrètes de rejoindre.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 mt-10">
            {PERKS.map((p, i) => (
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

      <FinalCta />
    </>
  );
}
