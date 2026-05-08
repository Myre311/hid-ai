import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceTabs } from "@/components/shared/ServiceTabs";
import { TalentSignupForm } from "@/components/talents/TalentSignupForm";

export const metadata = {
  title: "Pour les talents",
  description:
    "AI Specialist ou AI Engineer — deux parcours, missions internationales, paiement Mobile Money sous 5 minutes.",
};

const SPECIALIST_SKILLS = ["Annotation", "Labellisation", "RLHF", "Computer Vision basique"];
const ENGINEER_SKILLS = ["NLP", "Computer Vision", "Fine-tuning", "MLOps", "Optimisation"];

const ROLE_TABS = [
  {
    id: "specialist",
    label: "AI Specialist",
    content: (
      <RoleContent
        subtitle="Annotation · Labellisation · RLHF"
        description="Démarrez sans prérequis technique avancé. Le Flow Manager IA surveille votre progression et débloque automatiquement les niveaux de mission au fil de votre montée en qualité."
        skills={SPECIALIST_SKILLS}
        ctaLabel="S'inscrire comme AI Specialist"
      />
    ),
  },
  {
    id: "engineer",
    label: "AI Engineer",
    content: (
      <RoleContent
        subtitle="NLP · Vision · Optimisation"
        description="Missions techniques avancées sur des projets de fine-tuning, de mise en production et d'optimisation. Validation de votre profil par le Chatbot Gatekeeper avant accès aux missions."
        skills={ENGINEER_SKILLS}
        ctaLabel="S'inscrire comme AI Engineer"
      />
    ),
  },
];

function RoleContent({ subtitle, description, skills, ctaLabel }) {
  return (
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-3xl md:text-4xl tracking-tighter leading-[1.05]">
          {subtitle}
        </h3>
        <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
          {description}
        </p>

        <ul className="flex flex-wrap gap-2 mt-2">
          {skills.map((s) => (
            <li
              key={s}
              className="inline-flex items-center text-xs px-3 h-8 rounded-full border border-accent/40 bg-accent-muted/30 text-accent"
            >
              {s}
            </li>
          ))}
        </ul>

        <a
          href="#inscription"
          className="inline-flex items-center gap-2 self-start mt-2 h-11 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[24rem] bg-surface border border-border rounded-lg flex items-center justify-center p-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-strong text-center">
          Illustration · à venir
        </span>
      </div>
    </div>
  );
}

export default function TalentsPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 md:pb-20 bg-background border-b border-border/40">
        <Container className="flex flex-col gap-5 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Pour les talents
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[1.05] text-balance">
            HID AI pour les talents
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl">
            {"{{TALENTS_HERO_TEXT}}"}
          </p>
        </Container>
      </section>

      <Section className="bg-background">
        <Container>
          <ServiceTabs services={ROLE_TABS} defaultId="specialist" />
        </Container>
      </Section>

      <Section id="inscription" className="bg-surface/40 border-t border-border/40">
        <Container className="max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
              Inscription.
            </h2>
            <p className="text-base text-muted leading-relaxed max-w-xl">
              Quelques informations pour démarrer votre profil. Notre équipe
              valide votre dossier sous 48 heures et vous transmet les
              premières étapes.
            </p>
          </div>
          <TalentSignupForm />
        </Container>
      </Section>

      <Section className="bg-background border-t border-border/40">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
            Une question avant de vous inscrire ?
          </h2>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
            Notre équipe peut vous éclairer sur le parcours, les missions
            disponibles ou les modalités de rémunération.
          </p>
          <Link
            href="mailto:contact@hidea-solution.fr"
            className="inline-flex items-center gap-2 mt-2 h-12 rounded-md bg-accent px-6 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
          >
            Parler à notre équipe
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </Section>
    </>
  );
}
