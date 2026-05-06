import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Inscription & vérification",
    body: "OTP par SMS, sélection de branche (Specialist, Engineer ou Entreprise), profil complet en moins de 5 minutes.",
  },
  {
    n: "02",
    title: "Évaluation par notre IA",
    body: "Le Chatbot Gatekeeper évalue les Engineers sur 5 dimensions techniques. Le Flow Manager débloque automatiquement les niveaux des Specialists.",
  },
  {
    n: "03",
    title: "Missions & rémunération",
    body: "Matching automatique avec les besoins clients, paiement Mobile Money sous 5 minutes ou virement international SEPA/SWIFT.",
  },
];

export function HowItWorks() {
  return (
    <Section className="border-t border-border bg-surface/30">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <div className="flex flex-col gap-3 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">
              Comment ça marche
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05]">
              Du brief à la rémunération, en trois temps.
            </h2>
          </div>
        </Reveal>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Vertical connector for mobile */}
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 bottom-0 w-px bg-border md:hidden"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.08 + i * 0.08}>
              <div className="relative pl-16 md:pl-0">
                <div className="absolute md:static left-0 top-0 font-serif text-7xl text-muted-strong leading-none">
                  {s.n}
                </div>
                <div className="md:mt-8 flex flex-col gap-3">
                  <h3 className="text-xl md:text-2xl font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted leading-relaxed max-w-md">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
