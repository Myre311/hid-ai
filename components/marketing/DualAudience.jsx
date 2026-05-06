import Link from "next/link";
import { Zap, ShieldCheck, Lock, BarChart3, Globe, Smartphone, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

export function DualAudience() {
  return (
    <Section id="plateforme">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-3 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">
              Deux faces, une plateforme
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-tighter leading-[1.05]">
              Construite pour les laboratoires comme pour les talents.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <Reveal delay={0.08}>
            <AudienceCard
              id="entreprises"
              tag="ENTERPRISE"
              title="Accédez à un vivier certifié."
              features={[
                { Icon: Zap, label: "Matching prédictif en moins de 5 secondes" },
                { Icon: ShieldCheck, label: "Scoring vérifié par notre Chatbot Gatekeeper" },
                { Icon: Lock, label: "Anonymisation RGPD automatique" },
                { Icon: BarChart3, label: "Dashboard BI temps réel" },
              ]}
              cta={{ label: "Demander une démo", href: "/signup?as=business" }}
            />
          </Reveal>
          <Reveal delay={0.16}>
            <AudienceCard
              id="talents"
              tag="TALENTS"
              title="Construisez une carrière dans l’IA."
              features={[
                { Icon: Globe, label: "Missions de laboratoires internationaux" },
                { Icon: Smartphone, label: "Versement Mobile Money en moins de 5 minutes" },
                { Icon: TrendingUp, label: "Progression débloquée par le Flow Manager IA" },
                { Icon: Users, label: "Formation continue et peer review" },
              ]}
              cta={{ label: "S’inscrire gratuitement", href: "/signup" }}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function AudienceCard({ id, tag, title, features, cta }) {
  return (
    <article
      id={id}
      className="group flex flex-col gap-7 bg-surface border border-border rounded-lg p-8 md:p-10 transition-all duration-300 hover:border-border-strong hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.22em] text-accent">{tag}</span>
        <h3 className="font-serif text-2xl md:text-3xl tracking-tight leading-tight">
          {title}
        </h3>
      </div>

      <ul className="flex flex-col gap-4">
        {features.map(({ Icon, label }) => (
          <li key={label} className="flex items-start gap-3 text-sm md:text-base text-foreground/90">
            <Icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <Link
        href={cta.href}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all duration-200 mt-auto"
      >
        {cta.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
