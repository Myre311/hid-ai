import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,180,26,0.10),transparent_55%)]"
      />
      <Container className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
            Prêt à rejoindre l&rsquo;infrastructure humaine de l&rsquo;IA ?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-base md:text-lg text-muted max-w-xl">
            Inscription gratuite en moins de 5 minutes. Validation par notre
            équipe sous 48h pour les entreprises.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
            >
              Créer un compte talent
            </Link>
            <Link
              href="/signup?as=business"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-6 text-sm font-medium text-foreground hover:border-border-strong transition-colors duration-200"
            >
              Parler à notre équipe
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
