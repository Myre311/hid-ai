/**
 * Carte de contexte affichée en haut de chaque test d'évaluation.
 * Aligne le test avec le scénario business correspondant au brief PDF.
 */
export function ContextCard({ title, children }) {
  return (
    <aside
      className="rounded-lg border border-accent/30 bg-accent/5 p-5 mb-6 flex flex-col gap-2"
      aria-label="Scénario du test"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-accent">
        Scénario
      </p>
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <div className="text-sm text-foreground/75 leading-relaxed">
        {children}
      </div>
    </aside>
  );
}
