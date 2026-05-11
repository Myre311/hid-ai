"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Input texte (text, email, tel, url, date) ou textarea — dark-mode.
 * Props: label, name, value, onChange (e => string), error, required, type,
 * placeholder, hint, autoComplete, textarea, rows, max, min.
 */
export function FormFieldText({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  textarea = false,
  rows = 4,
  max,
  min,
  maxLength,
  pattern,
  inputMode,
}) {
  const Tag = textarea ? "textarea" : "input";
  const id = `f-${name}`;

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground/70">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {hint && <span className="text-xs text-foreground/40">{hint}</span>}
      <Tag
        id={id}
        name={name}
        type={textarea ? undefined : type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        rows={textarea ? rows : undefined}
        max={max}
        min={min}
        maxLength={maxLength}
        pattern={pattern}
        inputMode={inputMode}
        aria-invalid={!!error}
        className={cn(
          "bg-[#1A1A1A] border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30",
          "focus:outline-none transition-colors duration-200",
          error
            ? "border-red-400/60 focus:border-red-400"
            : "border-white/10 focus:border-accent"
        )}
      />
      {textarea && maxLength && (
        <span className="text-[10px] text-foreground/40 text-right">
          {(value ?? "").length} / {maxLength}
        </span>
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
