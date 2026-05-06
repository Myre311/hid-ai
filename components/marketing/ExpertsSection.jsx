import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

const PROFILES = [
  {
    role: "AI Specialist",
    tagline: "Annotation · Labellisation · RLHF",
    body: "Démarrez sans prérequis avancé. Le Flow Manager surveille la qualité de votre travail et débloque automatiquement les niveaux de mission.",
  },
  {
    role: "AI Engineer",
    tagline: "NLP · Vision · Optimisation",
    body: "Missions techniques certifiées par notre Chatbot Gatekeeper. Stack moderne, projets internationaux, rémunération à la mission.",
  },
];

const COMMITMENTS = [
  "Missions de laboratoires internationaux",
  "Versement Mobile Money sous 5 minutes",
  "Formation continue et peer review",
  "Aucun frais d’inscription",
];

export function ExpertsSection() {
  return (
    <Section id="experts" className="border-t border-border bg-surface/40">
      <Container className="flex flex-col gap-14 md:gap-20">
        {/* En-tête éditorial */}
        <Reveal>
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-end">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">Pour les experts</p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
                Une carrière <em className="italic">dans l&rsquo;IA</em>,<br />
                depuis le continent.
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
              Deux parcours selon votre profil. Pas de prérequis cachés.
              Missions réelles, validation par les pairs, et un système de
              progression qui récompense la qualité plutôt que le volume.
            </p>
          </div>
        </Reveal>

        {/* Deux profils en colonnes éditoriales */}
        <div className="grid md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-12 border-t border-border pt-14">
          {PROFILES.map((p, i) => (
            <Reveal key={p.role} delay={0.06 + i * 0.06}>
              <article className="flex flex-col gap-3 max-w-md">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-strong">
                  {p.tagline}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight">
                  {p.role}
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Engagements plateforme — liste compacte */}
        <Reveal delay={0.18}>
          <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-3 border-t border-border pt-10">
            {COMMITMENTS.map((c) => (
              <li
                key={c}
                className="flex items-baseline gap-3 text-sm md:text-base text-foreground/90"
              >
                <span className="text-accent">—</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTAs sobres */}
        <Reveal delay={0.26}>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/talents"
              className="inline-flex items-center gap-2 text-base font-medium text-foreground hover:gap-3 transition-all duration-200"
            >
              <span className="border-b border-foreground pb-0.5">
                Découvrir les parcours
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="text-base text-muted hover:text-foreground transition-colors"
            >
              S&rsquo;inscrire
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
