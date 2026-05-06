import { Nav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { DualAudience } from "@/components/marketing/DualAudience";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TechStack } from "@/components/marketing/TechStack";
import { Coverage } from "@/components/marketing/Coverage";
import { Compliance } from "@/components/marketing/Compliance";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Footer } from "@/components/marketing/Footer";

export const metadata = {
  title: "L'infrastructure humaine de l'IA, depuis l'Afrique",
  description:
    "Hidea Solution connecte les meilleurs AI Specialists et AI Engineers du continent avec les laboratoires et entreprises qui construisent l'avenir de l'IA.",
};

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustedBy />
        <DualAudience />
        <HowItWorks />
        <TechStack />
        <Coverage />
        <Compliance />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
