import { HomeHero } from "@/components/home/HomeHero";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { EntreprisesSection } from "@/components/home/EntreprisesSection";
import { TalentsSection } from "@/components/home/TalentsSection";
import { LeadersTrustBar } from "@/components/home/LeadersTrustBar";
import { CertificationsBadges } from "@/components/shared/CertificationsBadges";
import { RoleSection } from "@/components/home/RoleSection";
import { HomeFinalCTA } from "@/components/home/HomeFinalCTA";

export const metadata = {
  title: "Annotation de données IA premium par des talents africains certifiés",
  description:
    "Plateforme d'annotation pour l'IA : computer vision, NLP, RLHF, audio, vidéo. AI Specialists et AI Engineers africains certifiés. Qualité gold-standard, livrables JSON/CSV. Audit gratuit en 24h.",
  keywords: [
    "annotation données IA",
    "data labeling",
    "RLHF",
    "computer vision",
    "NLP",
    "AI Specialists",
    "AI Engineers",
    "Afrique",
    "fine-tuning",
    "data annotation Africa",
  ],
  alternates: {
    canonical: "https://www.hid-ai.com/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "HID AI",
    url: "https://www.hid-ai.com/",
    title: "HID AI — Annotation de données IA premium par des talents africains certifiés",
    description:
      "Plateforme d'annotation pour l'IA : computer vision, NLP, RLHF, audio, vidéo. AI Specialists et AI Engineers africains certifiés. Qualité gold-standard, audit gratuit en 24h.",
    images: [
      {
        url: "/brand/hid-ai-email-header.png",
        width: 1200,
        height: 630,
        alt: "HID AI — Annotation IA et talents africains certifiés",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HID AI — Annotation de données IA premium",
    description:
      "Computer vision, NLP, RLHF, audio, vidéo. Talents africains certifiés. Audit gratuit en 24h.",
    images: ["/brand/hid-ai-email-header.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PartnersMarquee />
      <EntreprisesSection />
      <TalentsSection />
      <LeadersTrustBar />
      <CertificationsBadges />
      <RoleSection />
      <HomeFinalCTA />
    </>
  );
}
