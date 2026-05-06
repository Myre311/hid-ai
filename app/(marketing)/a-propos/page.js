import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { Compliance } from "@/components/marketing/Compliance";

export const metadata = {
  title: "À propos",
  description:
    "Hidea Solution est une société française qui opère HID AI depuis ses hubs africains, à commencer par NEO Bonoua en Côte d'Ivoire.",
};

const TIMELINE = [
  {
    year: "2024",
    body: "Premiers cadrages méthodologiques et brevets internes sur l'évaluation multidimensionnelle des AI Engineers.",
  },
  {
    year: "2025",
    body: "Construction du hub pilote NEO Bonoua, recrutement des premiers conseillers et formateurs.",
  },
  {
    year: "2026",
    body: "Lancement du pilote, certification des 50 premiers talents, ouverture de l'inscription publique.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        kicker="Hidea Solution"
        title="Une société française, des hubs africains."
        lead="HID AI est opéré par Hidea Solution, basée à Paris, avec des équipes terrain à Bonoua, Abidjan, Casablanca, Brazzaville et Pointe-Noire."
      />

      <Section>
        <Container className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-5xl">
          <Reveal>
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
                Notre conviction.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                Le talent est partout. L&rsquo;infrastructure pour le mettre au
                travail, beaucoup moins. HID AI construit cette infrastructure
                là où le talent émerge — pas où le capital se concentre.
              </p>
              <p className="text-base text-muted leading-relaxed">
                On ne vend pas de promesse de prospérité par l&rsquo;IA. On
                fournit aux laboratoires occidentaux la donnée d&rsquo;entraînement
                qu&rsquo;ils n&rsquo;arrivent pas à produire à coût raisonnable, et
                aux talents africains des missions, une certification et un
                paiement réel.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tighter leading-tight">
                Le hub pilote.
              </h2>
              <p className="text-base text-muted leading-relaxed">
                NEO Bonoua, Côte d&rsquo;Ivoire. 50 talents en cours de
                certification, accompagnés par une équipe de conseillers
                franco-ivoiriens.
              </p>
              <p className="text-base text-muted leading-relaxed">
                Une fois le pilote stabilisé (Q3 2026), ouverture progressive
                des hubs d&rsquo;Abidjan, Casablanca, Brazzaville et
                Pointe-Noire.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <Container className="max-w-3xl">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05]">
              Trois années de construction.
            </h2>
          </Reveal>
          <ul className="mt-12 flex flex-col gap-10">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={0.06 + i * 0.06}>
                <li className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-6 items-baseline">
                  <span className="font-serif text-3xl md:text-4xl tracking-tight text-accent">
                    {t.year}
                  </span>
                  <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                    {t.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Compliance />

      <Section>
        <Container className="flex flex-col items-start gap-5 max-w-3xl">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tighter">
              Travailler ensemble.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-base text-muted leading-relaxed">
              Hidea Solution · 6 rue de la Paix, 75002 Paris · Lucien Odzali ·
              +33 6 27 67 89 31 · contact@hidea-solution.fr
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
            >
              Créer un compte
            </Link>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
