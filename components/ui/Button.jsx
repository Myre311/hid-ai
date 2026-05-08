"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  primary:
    "bg-black text-foreground border border-white/25 hover:border-white/60 hover:bg-surface-elevated border border-accent",
  secondary:
    "bg-surface text-foreground border border-border hover:border-border-strong hover:bg-surface-elevated",
  ghost:
    "bg-transparent text-foreground border border-border hover:border-border-strong",
  danger:
    "bg-danger text-foreground border border-danger hover:opacity-90",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    type = "button",
    className,
    disabled,
    loading,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight",
        "transition-all duration-200 ease-out-expo",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
});
