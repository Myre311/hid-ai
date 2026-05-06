import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  default:
    "bg-surface-elevated text-muted border border-border",
  accent:
    "bg-accent-muted text-accent border border-accent/30",
  success:
    "bg-success/10 text-success border border-success/30",
  danger:
    "bg-danger/10 text-danger border border-danger/30",
};

export function Badge({
  variant = "default",
  className,
  children,
  pulse = false,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-tight",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-40 hid-pulse" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
