import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "50+", label: "Talents en cours de certification" },
  { value: "10", label: "Marchés africains couverts" },
  { value: "<5min", label: "Versement Mobile Money" },
  { value: "RGPD", label: "Conformité européenne" },
];

export function Hero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col justify-end pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background — subtle dot grid + radial accent */}
      <div aria-hidden="true" className="absolute inset-0 hid-grid opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,180,26,0.10),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <Container className="relative z-10 flex flex-col gap-8 md:gap-10">
        <Reveal>
          <Badge variant="accent" pulse>
            Hub NEO Bonoua · Lancement pilote 2026
          </Badge>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[1.02] max-w-5xl text-balance">
            L&rsquo;infrastructure humaine de l&rsquo;IA, depuis l&rsquo;Afrique.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
            Hidea Solution connecte les meilleurs AI Specialists et AI Engineers
            du continent avec les laboratoires et entreprises qui construisent
            l&rsquo;avenir de l&rsquo;intelligence artificielle.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
            >
              Rejoindre comme talent
            </Link>
            <Link
              href="/signup?as=business"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-6 text-sm font-medium text-foreground hover:border-border-strong transition-colors duration-200"
            >
              Pour les entreprises
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-8 mt-12 pt-8 border-t border-border max-w-4xl">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="font-serif text-3xl md:text-4xl tracking-tighter text-foreground">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-muted leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
