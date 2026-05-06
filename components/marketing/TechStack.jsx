import { Workflow, MessageSquareCode, Lock, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const BRICKS = [
  {
    Icon: Workflow,
    title: "Flow Manager IA",
    body: "Agent de progression automatisée qui surveille les performances des Specialists en continu et débloque les niveaux selon un score composite calculé toutes les 10 minutes.",
  },
  {
    Icon: MessageSquareCode,
    title: "Chatbot Gatekeeper",
    body: "Évaluation technique multidimensionnelle des AI Engineers : correction, propreté du code, complexité algorithmique, communication, temps de résolution.",
  },
  {
    Icon: Lock,
    title: "Data Gateway sécurisé",
    body: "Tunneling chiffré mTLS, anonymisation automatique RGPD (visages, plaques, NER), audit trail immuable, contrôle d’accès granulaire par projet.",
  },
  {
    Icon: Wallet,
    title: "Hub paiement multimodal",
    body: "Orange Money · MTN MoMo · Wave · Airtel Money · SEPA · SWIFT. Versement sous 5 minutes après validation de tâche.",
  },
];

export function TechStack() {
  return (
    <Section id="recherche">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-3 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">Technologie</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05]">
              Quatre briques différenciantes.
            </h2>
            <p className="text-base text-muted max-w-2xl leading-relaxed">
              Une infrastructure pensée pour la conformité européenne, la
              transparence et la rapidité d&rsquo;exécution.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {BRICKS.map((b, i) => (
            <Reveal key={b.title} delay={0.08 + i * 0.08}>
              <article className="bg-surface border border-border rounded-lg p-7 md:p-8 h-full transition-all duration-300 hover:border-border-strong">
                <b.Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-lg md:text-xl font-medium tracking-tight">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
                  {b.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
