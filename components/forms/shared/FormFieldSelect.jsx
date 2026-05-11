"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Select dark-mode. options = [{value, label}].
 */
export function FormFieldSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  hint,
  placeholder = "Sélectionner…",
}) {
  const id = `f-${name}`;
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground/70">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {hint && <span className="text-xs text-foreground/40">{hint}</span>}
      <select
        id={id}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={cn(
          "bg-[#1A1A1A] border rounded-md px-3 h-11 text-sm text-foreground",
          "focus:outline-none transition-colors duration-200",
          error
            ? "border-red-400/60 focus:border-red-400"
            : "border-white/10 focus:border-accent"
        )}
      >
        <option value="" className="bg-[#0A0A0B]">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
