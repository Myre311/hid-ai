import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

/**
 * Vue détaillée d'un service entreprise.
 * Layout 2 colonnes desktop (texte gauche, illustration droite), stack mobile.
 */
export function ServiceContent({
  subtitle,
  description,
  subservices,
  illustration,
  ctaLabel = "Demander une démo",
  ctaHref = "mailto:contact@hidea-solution.fr",
}) {
  return (
    <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
      <div className="flex flex-col gap-6">
        <h3 className="font-serif text-3xl md:text-4xl tracking-tighter leading-[1.05]">
          {subtitle}
        </h3>
        <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl">
          {description}
        </p>

        <ul className="flex flex-col gap-3 mt-2">
          {subservices.map((s) => (
            <li
              key={s}
              className="flex items-start gap-3 text-sm md:text-base text-foreground/90"
            >
              <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 self-start mt-2 h-11 rounded-md bg-accent px-5 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[24rem] bg-surface border border-border rounded-lg flex items-center justify-center p-8">
        {illustration ?? (
          <span className="text-xs uppercase tracking-[0.2em] text-muted-strong text-center">
            Illustration · à venir
          </span>
        )}
      </div>
    </div>
  );
}
