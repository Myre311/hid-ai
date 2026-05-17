import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceTabs } from "@/components/shared/ServiceTabs";
import { ServiceContent } from "@/components/entreprises/ServiceContent";
import { B2BTriggerButton } from "@/components/forms/buttons/InscriptionTriggerButtons";

export const metadata = {
  title: "Pour les entreprises",
  description:
    "AI Data + Recrutement. Données d'entraînement à grande échelle et vivier d'AI Specialists et AI Engineers certifiés.",
};

const SERVICES = [
  {
    id: "data",
    label: "AI Data",
    content: (
      <ServiceContent
        subtitle="Données d'entraînement à grande échelle"
        description="Annotation spécialisée, RLHF, fine-tuning supervisé : vos pipelines de données sont pris en charge par des équipes certifiées, avec une conformité européenne garantie par défaut."
        subservices={[
          "Annotation (texte, image, audio, vidéo)",
          "RLHF (Reinforcement Learning from Human Feedback)",
          "Fine-tuning supervisé",
          "Validation et qualité (48 critères techniques et comportementaux)",
        ]}
      />
    ),
  },
  {
    id: "recrutement",
    label: "Recrutement",
    content: (
      <ServiceContent
        subtitle="Vivier de talents IA certifiés"
        description="Profils AI Specialists et AI Engineers rigoureusement évalués, matching prédictif basé sur votre brief et validation KYB sous 48h."
        subservices={[
          "AI Specialists (Annotation, Labellisation, RLHF)",
          "AI Engineers (NLP, Vision, Optimisation, Fine-tuning)",
          "Matching prédictif basé sur brief",
          "Validation KYB sous 48h",
        ]}
      />
    ),
  },
];

export default function EntreprisesPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 md:pb-20 bg-background">
        <Container className="flex flex-col gap-5 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Entreprises
          </p>
          <h1 className="t-h1">
            HID AI pour les entreprises
          </h1>
          <p className="t-lead max-w-2xl">
            Deux services pour vos besoins IA. AI Data, production de
            données d&rsquo;entraînement à grande échelle. Recrutement,
            accès direct à un vivier de talents certifiés.
          </p>
        </Container>
      </section>

      <Section className="bg-background">
        <Container>
          <ServiceTabs services={SERVICES} defaultId="data" />
        </Container>
      </Section>

      <Section className="bg-background">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="t-h2">
            Prêt à structurer vos pipelines de données ?
          </h2>
          <p className="t-lead max-w-xl">
            Démo, devis ou cadrage projet — un échange de 30 minutes pour
            identifier la meilleure approche pour votre besoin.
          </p>
          <B2BTriggerButton className="inline-flex items-center gap-2 mt-2 h-12 rounded-md bg-black border border-white/25 px-6 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
            Parler à notre équipe
            <ArrowRight className="h-4 w-4" />
          </B2BTriggerButton>
        </Container>
      </Section>
    </>
  );
}
