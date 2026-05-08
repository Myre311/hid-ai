import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroLogoAnimation } from "@/components/3d/HeroLogoAnimation";

/**
 * Hero principal — grid 2-cols sur desktop pour que le texte ne se confonde
 * jamais avec l'animation logo. Stack mobile (logo discret en arrière-plan).
 */
export function HomeHero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-black pt-32 pb-20">
      {/* Background gradient very subtle — only on the right half on desktop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:bg-[radial-gradient(circle_at_78%_50%,rgba(244,180,26,0.10),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden bg-[radial-gradient(circle_at_70%_30%,rgba(244,180,26,0.18),transparent_60%)]"
      />

      {/* Mobile-only background logo (very faint, behind text) */}
      <HeroLogoAnimation
        className="absolute inset-0 opacity-15 md:hidden"
      />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"
      />

      <Container className="relative z-10">
        <div className="grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-16 items-center">
          {/* Text column */}
          <div className="flex flex-col items-start gap-7 md:gap-9 max-w-2xl">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.02] text-balance text-foreground">
              L&rsquo;infrastructure humaine de l&rsquo;IA, depuis l&rsquo;Afrique.
            </h1>
            <p className="text-base md:text-lg text-muted leading-relaxed">
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
          </div>

          {/* Logo column — desktop only, owns its space */}
          <div className="hidden md:block aspect-square w-full">
            <HeroLogoAnimation className="w-full h-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
