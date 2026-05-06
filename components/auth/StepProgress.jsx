import { cn } from "@/lib/utils/cn";

/**
 * Tiny progress bar showing N steps with current index highlighted.
 * No labels — just a visual cue.
 */
export function StepProgress({ total, current }) {
  return (
    <div className="flex items-center gap-2 mb-10" aria-label={`Étape ${current + 1} sur ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-0.5 flex-1 rounded-full transition-colors duration-300",
            i <= current ? "bg-accent" : "bg-border"
          )}
        />
      ))}
    </div>
  );
}
