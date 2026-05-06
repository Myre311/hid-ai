import { ShieldCheck, KeyRound, Lock, FileCheck2, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "./Reveal";

const ITEMS = [
  { Icon: ShieldCheck, label: "RGPD" },
  { Icon: KeyRound, label: "AES-256" },
  { Icon: Lock, label: "mTLS 1.3" },
  { Icon: FileCheck2, label: "Audit trail immuable" },
  { Icon: Award, label: "ISO-ready" },
];

export function Compliance() {
  return (
    <section className="bg-surface border-y border-border py-16">
      <Container className="flex flex-col gap-8">
        <Reveal>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight max-w-3xl">
            Conçu pour les exigences réglementaires les plus strictes.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="flex flex-wrap gap-3">
            {ITEMS.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground/90"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
