import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
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
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
