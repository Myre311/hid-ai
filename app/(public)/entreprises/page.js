import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceTabs } from "@/components/shared/ServiceTabs";
import { ServiceContent } from "@/components/entreprises/ServiceContent";
import { CertificationsBadges } from "@/components/shared/CertificationsBadges";

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
        description="Annotation spécialisée, RLHF, fine-tuning supervisé. Vos pipelines de données pris en charge par des équipes certifiées sur 48 critères techniques et comportementaux. Conformité européenne par défaut."
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
        description="Profils AI Specialists et AI Engineers évalués sur 48 critères techniques et comportementaux. Matching prédictif basé sur votre brief, validation KYB sous 48h."
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
      <section className="relative pt-32 pb-16 md:pb-20 bg-background border-b border-border/40">
        <Container className="flex flex-col gap-5 max-w-4xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Pour les entreprises
          </p>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[1.05] text-balance">
            HID AI pour les entreprises
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl">
            {"{{ENTREPRISES_HERO_TEXT}}"}
          </p>
        </Container>
      </section>

      <Section className="bg-background">
        <Container>
          <ServiceTabs services={SERVICES} defaultId="data" />
        </Container>
      </Section>

      <Section className="bg-surface/40 border-t border-border/40">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
            Validation KYB sous 48 heures.
          </h2>
          <p className="text-base text-muted leading-relaxed">
            Création de compte, dépôt de votre numéro d&rsquo;enregistrement,
            vérification manuelle par notre équipe puis activation de votre
            espace projet. Vous recevez votre accès en moins de deux jours
            ouvrés.
          </p>
          <Link
            href="/signup?as=business"
            className="inline-flex items-center gap-2 h-11 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
          >
            Démarrer l&rsquo;onboarding entreprise
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </Section>

      <CertificationsBadges />

      <Section className="bg-background border-t border-border/40">
        <Container className="flex flex-col items-start gap-6 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
            Prêt à structurer vos pipelines de données ?
          </h2>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
            Démo, devis ou cadrage projet — un échange de 30 minutes pour
            identifier la meilleure approche pour votre besoin.
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
