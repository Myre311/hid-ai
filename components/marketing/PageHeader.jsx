import { Container } from "@/components/ui/Container";
import { Reveal } from "./Reveal";

/**
 * PageHeader — minimal section header for routed pages.
 * Sober, no eyebrow uppercase, no decorative badges.
 */
export function PageHeader({ kicker, title, lead }) {
  return (
    <section className="relative pt-32 pb-12 md:pb-16 border-b border-border overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,180,26,0.06),transparent_55%)]"
      />
      <Container className="relative z-10 flex flex-col gap-5 max-w-4xl">
        {kicker && (
          <Reveal>
            <p className="text-sm text-muted">{kicker}</p>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tighter leading-[1.05] text-balance">
            {title}
          </h1>
        </Reveal>
        {lead && (
          <Reveal delay={0.12}>
            <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
              {lead}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
