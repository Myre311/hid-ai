import { PageHeader } from "@/components/marketing/PageHeader";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TechStack } from "@/components/marketing/TechStack";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "Plateforme",
  description:
    "Comment fonctionne HID AI : du brief à la rémunération, et les briques techniques qui font tourner la plateforme.",
};

export default function PlateformePage() {
  return (
    <>
      <PageHeader
        kicker="Plateforme"
        title="Une infrastructure pensée pour produire de la donnée d'entraînement de qualité."
        lead="Inscription, certification, mission, paiement : un parcours fluide pour les talents et les laboratoires, posé sur une infrastructure conforme et auditable."
      />
      <HowItWorks />
      <TechStack />
      <FinalCta />
    </>
  );
}
