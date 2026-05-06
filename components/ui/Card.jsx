import { cn } from "@/lib/utils/cn";

export function Card({
  variant = "default",
  className,
  padding = "lg",
  as: Tag = "div",
  ...props
}) {
  const padded = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  }[padding];

  const variantClass =
    variant === "elevated"
      ? "bg-surface-elevated border border-border"
      : "bg-surface border border-border";

  return (
    <Tag
      className={cn(
        "rounded-lg transition-colors duration-300",
        variantClass,
        padded,
        className
      )}
      {...props}
    />
  );
}
