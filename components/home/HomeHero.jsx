import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroFloating3DLoader } from "@/components/3d/HeroFloating3DLoader";

/**
 * Hero principal — Scale AI style.
 * Triangle 3D animé en background, content layered au-dessus.
 */
export function HomeHero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-black pt-32 pb-20">
      {/* Background — radial accent (mobile dominant) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(244,180,26,0.18),transparent_55%)] md:bg-[radial-gradient(circle_at_75%_50%,rgba(244,180,26,0.12),transparent_45%)]"
      />

      {/* 3D triangle — right half on desktop, full bg behind text on mobile */}
      <HeroFloating3DLoader
        className="absolute inset-0 md:inset-y-0 md:right-0 md:left-1/2 md:w-1/2 md:h-full opacity-50 md:opacity-100"
      />

      {/* Bottom fade for smooth section hand-off */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"
      />

      <Container className="relative z-10 flex flex-col items-start gap-8 md:gap-10 max-w-5xl">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[1.02] text-balance text-foreground">
          L&rsquo;infrastructure humaine de l&rsquo;IA, depuis l&rsquo;Afrique.
        </h1>
        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
          HID AI relie les entreprises qui construisent l&rsquo;IA aux
          talents africains certifiés qui produisent leurs données
          d&rsquo;entraînement et opèrent leurs missions techniques.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/entreprises"
            className="inline-flex items-center gap-2 h-12 rounded-md bg-accent px-6 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
          >
            Pour les entreprises
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/talents"
            className="inline-flex items-center gap-2 h-12 rounded-md border border-foreground/20 bg-transparent px-6 text-sm font-medium text-foreground hover:border-foreground/40 hover:bg-foreground/5 transition-colors duration-200"
          >
            Pour les talents
          </Link>
        </div>
      </Container>
    </section>
  );
}
