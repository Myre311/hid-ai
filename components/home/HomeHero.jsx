import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";

const HeroFloating3D = dynamic(
  () => import("@/components/3d/HeroFloating3D").then((m) => m.HeroFloating3D),
  { ssr: false, loading: () => null }
);

/**
 * Hero principal — Scale AI style.
 * Triangle 3D animé en background, content layered au-dessus.
 */
export function HomeHero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-black pt-32 pb-20">
      {/* Background — 3D floating triangle */}
      <HeroFloating3D className="absolute inset-0 w-full h-full" />

      {/* Subtle radial accent — barely visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(244,180,26,0.06),transparent_55%)]"
      />

      <Container className="relative z-10 flex flex-col items-start gap-8 md:gap-10 max-w-5xl">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[1.02] text-balance text-foreground">
          {"{{HERO_HEADLINE}}"}
        </h1>
        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
          {"{{HERO_SUBTEXT}}"}
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
