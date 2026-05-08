import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const SPECIALIST_SKILLS = ["Annotation", "Labellisation", "RLHF", "Computer Vision"];
const ENGINEER_SKILLS = ["NLP", "Vision", "Optimisation", "Fine-tuning", "MLOps"];

export function TalentsSection() {
  return (
    <Section id="talents" className="bg-surface/30 border-t border-border/40">
      <Container className="flex flex-col gap-12">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16 items-end">
          <h2 className="t-h2">
            HID AI pour les talents
          </h2>
          <p className="t-lead max-w-xl">
Deux parcours selon votre profil : AI Specialist pour l&rsquo;annotation et le RLHF, AI Engineer pour les missions techniques avancées. Sans frais d&rsquo;inscription, paiement Mobile Money sous 5 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          <ProfileBlock
            role="AI Specialist"
            tagline="Annotation · Labellisation · RLHF"
            skills={SPECIALIST_SKILLS}
          />
          <ProfileBlock
            role="AI Engineer"
            tagline="NLP · Vision · Optimisation · MLOps"
            skills={ENGINEER_SKILLS}
          />
        </div>

        <div>
          <Link
            href="/talents"
            className="inline-flex items-center gap-2 h-11 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
          >
            Inscription
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function ProfileBlock({ role, tagline, skills }) {
  return (
    <article className="flex flex-col gap-5 p-7 md:p-8 rounded-lg bg-surface border border-border hover:border-border-strong transition-colors duration-300">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{tagline}</p>
        <h3 className="t-h3">{role}</h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s}
            className="inline-flex items-center text-xs px-3 h-7 rounded-full border border-border bg-surface-elevated text-foreground/85"
          >
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}
