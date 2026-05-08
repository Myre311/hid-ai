import { cn } from "@/lib/utils/cn";

/**
 * Carte service — sobre, dark, hover lift discret.
 * highlight=true → bordure accent jaune + slight tinted bg
 */
export function ServiceCard({ icon: Icon, title, description, highlight = false, className }) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 p-7 md:p-8 rounded-lg border transition-all duration-300",
        highlight
          ? "bg-accent-muted/40 border-accent/40"
          : "bg-surface border-border hover:border-border-strong hover:-translate-y-0.5",
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md",
            highlight ? "bg-accent/20 text-accent" : "bg-surface-elevated text-accent"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h3 className="t-h3">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted leading-relaxed">
        {description}
      </p>
    </article>
  );
}
