"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef(function Input(
  { label, error, hint, className, id: providedId, ...props },
  ref
) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-widest text-muted font-medium"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(
          "h-11 px-3.5 rounded-md bg-surface text-foreground placeholder:text-muted-strong",
          "border border-border focus:border-accent focus:outline-none",
          "transition-colors duration-200",
          error && "border-danger focus:border-danger",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
