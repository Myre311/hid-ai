/**
 * EmptyState — Server Component (no "use client")
 * Props: icon, title, description, cta, className
 */
export default function EmptyState({ icon, title, description, cta, className }) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center py-16 px-6 text-center" +
        (className ? " " + className : "")
      }
    >
      {icon && (
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-5">
          {icon}
        </div>
      )}
      {title && (
        <p className="text-xl font-medium text-foreground mb-2">{title}</p>
      )}
      {description && (
        <p className="text-foreground/55 max-w-md mb-6">{description}</p>
      )}
      {cta && cta}
    </div>
  );
}
