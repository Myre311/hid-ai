import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { InscriptionProvider } from "@/contexts/InscriptionContext";
import { InscriptionModal } from "@/components/modals/InscriptionModal";
import { ConsentProvider } from "@/components/consent/ConsentContext";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { CookiePreferencesDialog } from "@/components/consent/CookiePreferencesDialog";
import { getConsentServer } from "@/lib/consent/server";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "HID AI — Annotation de données IA premium par des talents africains certifiés",
    template: "%s · HID AI",
  },
  description:
    "Plateforme d'annotation pour l'IA : computer vision, NLP, RLHF, audio, vidéo. AI Specialists et AI Engineers africains certifiés. Qualité gold-standard, livrables JSON/CSV. Audit gratuit en 24h.",
  applicationName: "HID AI",
  authors: [{ name: "Major Exchanges SAS" }],
  keywords: [
    "annotation données IA",
    "data labeling",
    "RLHF",
    "computer vision",
    "NLP",
    "AI Specialists",
    "AI Engineers",
    "fine-tuning",
    "data annotation Africa",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "HID AI",
    title: "HID AI — Annotation IA premium par des talents africains certifiés",
    description:
      "Computer vision, NLP, RLHF, audio, vidéo. AI Specialists et AI Engineers certifiés. Qualité gold-standard, audit gratuit en 24h.",
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
    title: "HID AI — Annotation IA premium",
    description:
      "Computer vision, NLP, RLHF, audio, vidéo. Talents africains certifiés.",
    images: ["/brand/hid-ai-email-header.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const initialConsent = getConsentServer();
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${mono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ConsentProvider initial={initialConsent}>
          <InscriptionProvider>
            {children}
            <InscriptionModal />
          </InscriptionProvider>
          <CookieBanner />
          <CookiePreferencesDialog />
        </ConsentProvider>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#FAFAFA",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
