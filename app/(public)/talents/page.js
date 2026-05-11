import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceTabs } from "@/components/shared/ServiceTabs";
import { ComplianceSection } from "@/components/home/ComplianceSection";
import {
  B2BTriggerButton,
  TalentTriggerButton,
} from "@/components/forms/buttons/InscriptionTriggerButtons";

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
        ctaLabel="S'inscrire comme Specialist"
        metierKey="specialist"
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
        ctaLabel="S'inscrire comme Engineer"
        metierKey="engineer"
      />
    ),
  },
];

function RoleContent({ subtitle, description, skills, ctaLabel, metierKey }) {
  return (
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
      <div className="flex flex-col gap-6">
        <h3 className="font-sans text-3xl md:text-4xl tracking-tight leading-[1.05]">
          {subtitle}
        </h3>
        <p className="t-lead max-w-xl">
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

        <TalentTriggerButton
          presetMetier={metierKey}
          className="inline-flex items-center gap-2 self-start mt-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </TalentTriggerButton>
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
      <section className="relative pt-32 pb-16 md:pb-20 bg-background">
        <Container className="flex flex-col gap-5 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Pour les talents
          </p>
          <h1 className="t-h1">
            HID AI pour les talents
          </h1>
          <p className="t-lead max-w-2xl">
            Deux métiers sur la plateforme. AI Specialist pour démarrer sans
            prérequis avancé. AI Engineer pour les missions techniques.
            Mission après mission, votre profil monte en niveau.
          </p>
        </Container>
      </section>

      <Section className="bg-background">
        <Container>
          <ServiceTabs services={ROLE_TABS} defaultId="specialist" />
        </Container>
      </Section>

      <ComplianceSection />

      <Section className="bg-background">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="t-h2">
            Prêt à rejoindre l&rsquo;infrastructure humaine de l&rsquo;IA ?
          </h2>
          <p className="t-lead max-w-xl">
            Notre équipe peut vous éclairer sur le parcours, les missions
            disponibles ou les modalités de rémunération.
          </p>
          <TalentTriggerButton className="inline-flex items-center gap-2 mt-2 h-12 rounded-md bg-black border border-white/25 px-6 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
            Parler à notre équipe
            <ArrowRight className="h-4 w-4" />
          </TalentTriggerButton>
        </Container>
      </Section>
    </>
  );
}
