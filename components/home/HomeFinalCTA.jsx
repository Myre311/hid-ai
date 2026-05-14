import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DualCTABlock } from "@/components/shared/DualCTABlock";
import {
  B2BTriggerButton,
  TalentTriggerButton,
} from "@/components/forms/buttons/InscriptionTriggerButtons";

export function HomeFinalCTA() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <DualCTABlock
            eyebrow="Pour les entreprises"
            title="Accédez à un vivier d'AI Specialists certifiés."
            subtext="Briefs en moins de 5 minutes, validation KYB sous 48h, livraison conforme RGPD."
            variant="primary"
            ctaSlot={
              <B2BTriggerButton className="inline-flex items-center gap-2 mt-auto self-start h-11 rounded-md px-5 text-sm font-medium transition-colors bg-background text-foreground hover:bg-foreground hover:text-background">
                Réserver une démo
                <ArrowRight className="h-4 w-4" />
              </B2BTriggerButton>
            }
          />
          <DualCTABlock
            eyebrow="Pour les talents"
            title="Construisez une carrière dans l'IA."
            subtext="Missions internationales, CV basée sur scoring dynamique, formation continue."
            variant="secondary"
            ctaSlot={
              <TalentTriggerButton className="inline-flex items-center gap-2 mt-auto self-start h-11 rounded-md px-5 text-sm font-medium transition-colors bg-black text-foreground border border-white/25 hover:border-white/60 hover:bg-surface-elevated">
                S&rsquo;inscrire
                <ArrowRight className="h-4 w-4" />
              </TalentTriggerButton>
            }
          />
        </div>
      </Container>
    </Section>
  );
}
