import { HomeHero } from "@/components/home/HomeHero";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { EntreprisesSection } from "@/components/home/EntreprisesSection";
import { TalentsSection } from "@/components/home/TalentsSection";
import { ComplianceSection } from "@/components/home/ComplianceSection";
import { CertificationsBadges } from "@/components/shared/CertificationsBadges";
import { RoleSection } from "@/components/home/RoleSection";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata = {
  title: "L'infrastructure humaine de l'IA, depuis l'Afrique",
  description:
    "Hidea Solution opère HID AI : plateforme d'infrastructure IA reliant entreprises et talents africains certifiés.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PartnersMarquee />
      <EntreprisesSection />
      <TalentsSection />
      <ComplianceSection />
      <CertificationsBadges />
      <RoleSection />
      <HomeFinalCTA />
    </>
  );
}
