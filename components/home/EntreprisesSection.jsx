import { ArrowRight, Database, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { B2BTriggerButton } from "@/components/forms/buttons/InscriptionTriggerButtons";

export function EntreprisesSection() {
  return (
    <Section id="entreprises" className="bg-background">
      <Container className="flex flex-col gap-12">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-end">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Entreprises
            </p>
            <h2 className="t-h2">
              HID AI pour les entreprises
            </h2>
          </div>
          <p className="t-lead max-w-xl">
Deux services pensés pour accélérer vos pipelines IA : la génération de données d&rsquo;entraînement à grande échelle, calibrée selon vos besoins, et un accès immédiat à un vivier de talents certifiés, disponibles pour renforcer vos équipes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <ServiceCard
            icon={Database}
            title="Services de traitement de données"
            description="Annotation spécialisée, RLHF, fine-tuning. Vos pipelines de données pris en charge par des équipes certifiées avec contrôle qualité sur 48 critères."
            highlight
          />
          <ServiceCard
            icon={Users}
            title="Mise en relation experts IA"
            description="Accès direct à un vivier d'AI Specialists et AI Engineers évalués. Matching adapté à vos besoins de mission ou recrutement permanent."
          />
        </div>

        <div>
          <B2BTriggerButton className="inline-flex items-center gap-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
            Réserver une démo
            <ArrowRight className="h-4 w-4" />
          </B2BTriggerButton>
        </div>
      </Container>
    </Section>
  );
}
