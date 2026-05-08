import { ShieldCheck, KeyRound, Lock, FileCheck2, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";

const ITEMS = [
  { Icon: ShieldCheck, label: "RGPD" },
  { Icon: KeyRound, label: "AES-256" },
  { Icon: Lock, label: "mTLS 1.3" },
  { Icon: FileCheck2, label: "Audit trail immuable" },
  { Icon: Award, label: "ISO-ready" },
];

export function ComplianceSection() {
  return (
    <section className="bg-surface/40 py-20 md:py-28">
      <Container className="flex flex-col gap-8 max-w-5xl">
        <h2 className="t-h2-md max-w-3xl">
          Conçu pour les exigences réglementaires les plus strictes.
        </h2>
        <ul className="flex flex-wrap gap-3">
          {ITEMS.map(({ Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground/90"
            >
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
