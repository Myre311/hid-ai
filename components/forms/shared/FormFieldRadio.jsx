"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Radio group avec deux variantes : "list" (radios classiques) et "cards" (cards visuelles).
 *
 * options = [{ value, label, description?, icon? (lucide React) }]
 */
export function FormFieldRadio({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  hint,
  variant = "list", // "list" | "cards"
  cols = 2, // nb colonnes pour cards (md+)
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-foreground/70 mb-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </legend>
      {hint && <p className="text-xs text-foreground/40">{hint}</p>}

      {variant === "cards" ? (
        <div
          className={cn(
            "grid gap-3 mt-1",
            cols === 2 && "md:grid-cols-2",
            cols === 3 && "md:grid-cols-3"
          )}
        >
          {options.map((o) => {
            const Icon = o.icon;
            const checked = value === o.value;
            return (
              <label
                key={o.value}
                className={cn(
                  "relative flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all border",
                  checked
                    ? "border-accent bg-accent/5"
                    : "border-white/10 bg-[#1A1A1A] hover:border-white/30"
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={checked}
                  onChange={() => onChange(o.value)}
                  className="sr-only"
                />
                {Icon && (
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 mt-0.5",
                      checked ? "text-accent" : "text-foreground/60"
                    )}
                    aria-hidden="true"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {o.label}
                  </span>
                  {o.description && (
                    <span className="text-xs text-foreground/55">
                      {o.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-1">
          {options.map((o) => {
            const checked = value === o.value;
            return (
              <label
                key={o.value}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors border",
                  checked
                    ? "border-accent/60 bg-accent/5"
                    : "border-white/10 bg-[#1A1A1A] hover:border-white/25"
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={checked}
                  onChange={() => onChange(o.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                    checked ? "border-accent" : "border-white/30"
                  )}
                >
                  {checked && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </span>
                <span className="text-sm text-foreground">{o.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {error && <span className="text-xs text-red-400">{error}</span>}
    </fieldset>
  );
}
