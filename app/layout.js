import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { InscriptionProvider } from "@/contexts/InscriptionContext";
import { InscriptionModal } from "@/components/modals/InscriptionModal";

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
    default: "HID AI — L'infrastructure humaine de l'IA, depuis l'Afrique",
    template: "%s · HID AI",
  },
  description:
    "Hidea Solution connecte les meilleurs AI Specialists et AI Engineers du continent avec les laboratoires et entreprises qui construisent l'avenir de l'intelligence artificielle.",
  applicationName: "HID AI",
  authors: [{ name: "Hidea Solution" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "HID AI",
    title: "HID AI — L'infrastructure humaine de l'IA",
    description:
      "Plateforme africaine d'AI Specialists et AI Engineers certifiés.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${mono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <InscriptionProvider>
          {children}
          <InscriptionModal />
        </InscriptionProvider>
      </body>
    </html>
  );
}
