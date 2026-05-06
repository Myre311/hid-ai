import { cn } from "@/lib/utils/cn";

export function Section({
  as: Tag = "section",
  className,
  size = "default",
  children,
  ...props
}) {
  const padding = {
    sm: "py-12 md:py-16",
    default: "py-24 md:py-32",
    lg: "py-32 md:py-40",
  }[size];

  return (
    <Tag className={cn(padding, "relative", className)} {...props}>
      {children}
    </Tag>
  );
}
