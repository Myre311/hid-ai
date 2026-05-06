import Link from "next/link";
import { Sparkles, Code2, ArrowRight, Globe, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

export function ExpertsSection() {
  return (
    <Section id="experts" className="border-t border-border bg-surface/30">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Visuel — gauche : deux cards profil */}
          <Reveal>
            <div className="order-2 md:order-1 grid gap-4">
              <ProfileCard
                Icon={Sparkles}
                role="AI Specialist"
                tagline="Annotation · Labellisation · RLHF"
                body="Démarrez sans prérequis avancé. Le Flow Manager surveille votre progression et débloque les niveaux."
              />
              <ProfileCard
                Icon={Code2}
                role="AI Engineer"
                tagline="NLP · Vision · Optimisation"
                body="Missions techniques certifiées par notre Chatbot Gatekeeper. Stack moderne, projets internationaux."
              />
            </div>
          </Reveal>

          {/* Texte — droite */}
          <Reveal delay={0.1}>
            <div className="order-1 md:order-2 flex flex-col gap-6">
              <p className="text-sm text-muted">Pour les experts</p>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
                Construisez une carrière dans l&rsquo;IA.
              </h2>
              <p className="text-base md:text-lg text-muted max-w-xl leading-relaxed">
                Deux parcours selon votre profil. Pas de frais
                d&rsquo;inscription, pas de prérequis cachés. Missions de
                laboratoires internationaux, paiement Mobile Money en moins
                de 5 minutes.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                <li className="flex items-start gap-3 text-sm md:text-base text-foreground/90">
                  <Globe className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Missions de laboratoires internationaux</span>
                </li>
                <li className="flex items-start gap-3 text-sm md:text-base text-foreground/90">
                  <Smartphone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Versement Mobile Money sous 5 minutes</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/talents"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
                >
                  Découvrir les parcours
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-5 text-sm font-medium text-foreground hover:border-border-strong transition-colors duration-200"
                >
                  S&rsquo;inscrire
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function ProfileCard({ Icon, role, tagline, body }) {
  return (
    <article className="bg-surface border border-border rounded-lg p-6 md:p-7 transition-colors duration-300 hover:border-border-strong">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted border border-accent/30 flex-shrink-0">
          <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-serif text-xl md:text-2xl tracking-tight">
            {role}
          </h3>
          <p className="text-xs text-muted">{tagline}</p>
          <p className="text-sm text-muted/90 leading-relaxed mt-2">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}
