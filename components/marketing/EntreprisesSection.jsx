import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Lock,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const POINTS = [
  { Icon: Zap, label: "Matching prédictif en moins de 5 secondes" },
  { Icon: ShieldCheck, label: "Scoring vérifié par notre Chatbot Gatekeeper" },
  { Icon: Lock, label: "Anonymisation RGPD automatique" },
  { Icon: BarChart3, label: "Dashboard BI temps réel" },
];

const STATS = [
  { value: "48", label: "Critères techniques évalués" },
  { value: "5s", label: "Temps de matching" },
  { value: "48h", label: "Validation KYB" },
];

export function EntreprisesSection() {
  return (
    <Section id="entreprises" className="border-t border-border">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Texte — gauche */}
          <Reveal>
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted">Pour les entreprises</p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
                Accédez à un vivier certifié.
              </h2>
              <p className="text-base md:text-lg text-muted max-w-xl leading-relaxed">
                Vos projets d&rsquo;annotation, RLHF, fine-tuning ou
                recrutement, exécutés par des talents évalués sur 48 critères
                techniques et comportementaux.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {POINTS.map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-start gap-3 text-sm md:text-base text-foreground/90"
                  >
                    <Icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/entreprises"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
                >
                  Découvrir l&rsquo;offre
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup?as=business"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-5 text-sm font-medium text-foreground hover:border-border-strong transition-colors duration-200"
                >
                  Demander une démo
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Visuel — droite : carte stats */}
          <Reveal delay={0.1}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 bg-[radial-gradient(circle_at_70%_30%,rgba(244,180,26,0.08),transparent_60%)] pointer-events-none"
              />
              <div className="relative bg-surface border border-border rounded-lg p-8 md:p-10 flex flex-col gap-8">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-strong">
                  Engagement plateforme
                </p>
                <div className="grid grid-cols-3 gap-6">
                  {STATS.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <div className="font-serif text-4xl md:text-5xl tracking-tighter text-accent leading-none">
                        {s.value}
                      </div>
                      <div className="text-xs text-muted leading-snug">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-6 flex flex-col gap-2">
                  <p className="text-sm font-medium">
                    Annotation · RLHF · Fine-tuning · Recrutement
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    Une plateforme unifiée pour vos missions de production de
                    données et vos campagnes de recrutement spécialisées.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
