import { PageHeader } from "@/components/marketing/PageHeader";
import { TechStack } from "@/components/marketing/TechStack";
import { Coverage } from "@/components/marketing/Coverage";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "Recherche",
  description:
    "Les briques technologiques de HID AI : Flow Manager IA, Chatbot Gatekeeper, Data Gateway sécurisé, Hub paiement multimodal — et notre couverture africaine.",
};

export default function RecherchePage() {
  return (
    <>
      <PageHeader
        kicker="Recherche & infrastructure"
        title="Quatre briques différenciantes, conçues pour produire de la donnée d'entraînement à grande échelle."
        lead="Nos systèmes internes sont pensés pour la conformité, l'auditabilité et la rapidité. Vue d'ensemble de l'architecture et de la couverture."
      />
      <TechStack />
      <Coverage />
      <FinalCta />
    </>
  );
}
