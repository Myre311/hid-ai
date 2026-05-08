import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Bloc CTA dual réutilisable (pattern Scale AI).
 * variant: "primary" = fond accent jaune | "secondary" = fond surface sombre
 */
export function DualCTABlock({
  eyebrow,
  title,
  subtext,
  ctaLabel,
  ctaHref,
  variant = "secondary",
  className,
}) {
  const isPrimary = variant === "primary";

  return (
    <article
      className={cn(
        "flex flex-col gap-6 p-8 md:p-12 rounded-lg border transition-colors",
        isPrimary
          ? "bg-black border-white/25 text-foreground"
          : "bg-surface border-border hover:border-border-strong text-foreground",
        className
      )}
    >
      <p
        className={cn(
          "text-xs uppercase tracking-[0.2em]",
          isPrimary ? "text-background/70" : "text-muted"
        )}
      >
        {eyebrow}
      </p>
      <h3
        className={cn(
          "t-h3",
          isPrimary ? "text-background" : "text-foreground"
        )}
      >
        {title}
      </h3>
      {subtext && (
        <p
          className={cn(
            "text-base leading-relaxed max-w-md",
            isPrimary ? "text-background/85" : "text-muted"
          )}
        >
          {subtext}
        </p>
      )}
      <Link
        href={ctaHref}
        className={cn(
          "inline-flex items-center gap-2 mt-auto self-start h-11 rounded-md px-5 text-sm font-medium transition-colors",
          isPrimary
            ? "bg-background text-foreground hover:bg-foreground hover:text-background"
            : "bg-black text-foreground border border-white/25 hover:border-white/60 hover:bg-surface-elevated"
        )}
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
