import { cn } from "@/lib/utils/cn";

export function Container({ className, children, ...props }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
