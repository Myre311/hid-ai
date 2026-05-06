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
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05] max-w-3xl">
            Du brief à la rémunération, en trois temps.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.08 + i * 0.08}>
              <div className="flex flex-col gap-3 md:gap-4">
                <span className="font-serif text-5xl md:text-7xl text-muted-strong leading-none">
                  {s.n}
                </span>
                <h3 className="mt-3 md:mt-6 text-xl md:text-2xl font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed max-w-md">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
