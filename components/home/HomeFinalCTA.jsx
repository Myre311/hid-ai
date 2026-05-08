import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DualCTABlock } from "@/components/shared/DualCTABlock";

export function HomeFinalCTA() {
  return (
    <Section className="bg-background border-t border-border/40">
      <Container>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <DualCTABlock
            eyebrow="Pour les entreprises"
            title="Accédez à un vivier d'AI Specialists certifiés."
            subtext="Briefs en moins de 5 minutes, validation KYB sous 48h, livraison conforme RGPD."
            ctaLabel="Réserver une démo"
            ctaHref="mailto:contact@hidea-solution.fr"
            variant="primary"
          />
          <DualCTABlock
            eyebrow="Pour les talents"
            title="Construisez une carrière dans l'IA."
            subtext="Missions internationales, paiement Mobile Money sous 5 minutes, formation continue."
            ctaLabel="S'inscrire"
            ctaHref="/talents"
            variant="secondary"
          />
        </div>
      </Container>
    </Section>
  );
}
