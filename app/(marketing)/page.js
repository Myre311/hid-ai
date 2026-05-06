import { Hero } from "@/components/marketing/Hero";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { EntreprisesSection } from "@/components/marketing/EntreprisesSection";
import { ExpertsSection } from "@/components/marketing/ExpertsSection";
import { Compliance } from "@/components/marketing/Compliance";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "L'infrastructure humaine de l'IA, depuis l'Afrique",
  description:
    "Hidea Solution connecte les meilleurs AI Specialists et AI Engineers du continent avec les laboratoires et entreprises qui construisent l'avenir de l'IA.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <EntreprisesSection />
      <ExpertsSection />
      <Compliance />
      <FinalCta />
    </>
  );
}
