import { Container } from "@/components/ui/Container";

/**
 * Layout partagé pour les pages légales (/legal, /terms, /privacy, /gdpr).
 *
 * Props :
 *  - title           : titre principal (h1)
 *  - eyebrow         : sur-titre (ex. "Mentions légales")
 *  - lastUpdated     : string ISO ou format libre — affiché sous le hero
 *  - sections        : [{ id, title, content (JSX) }] — rendues + TOC sticky desktop
 *
 * Le contenu d'une section utilise les utilitaires Tailwind classiques
 * (`p`, `ul`, `li`…). Le LegalLayout applique un `.legal-prose` qui force
 * un style lisible (espacement, taille, contraste muted) cohérent sur les 4 pages.
 */
export function LegalLayout({ title, eyebrow, lastUpdated, sections = [] }) {
  return (
    <>
      <section className="relative pt-32 pb-12 md:pb-16 bg-background">
        <Container className="max-w-5xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">
            {eyebrow}
          </p>
          <h1 className="t-h1">{title}</h1>
          {lastUpdated && (
            <p className="t-small text-muted mt-6">
              Dernière mise à jour : {lastUpdated}
            </p>
          )}
        </Container>
      </section>

      <section className="pb-32">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
            {/* TOC desktop */}
            <aside className="hidden lg:block">
              <nav
                aria-label="Sommaire"
                className="sticky top-28 flex flex-col gap-2"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-strong mb-2">
                  Sommaire
                </p>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs text-muted hover:text-foreground transition-colors py-1 border-l border-border pl-3 hover:border-accent"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* TOC mobile */}
            <details className="lg:hidden border border-border rounded-md mb-6">
              <summary className="cursor-pointer py-3 px-4 text-xs uppercase tracking-[0.22em] text-muted-strong list-none flex items-center justify-between">
                Sommaire
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-muted" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ul className="flex flex-col gap-1 px-4 pb-4">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block py-1.5 text-sm text-muted hover:text-foreground"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            <article className="legal-prose flex flex-col gap-14">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 flex flex-col gap-4">
                  <h2 className="t-h2-md">{s.title}</h2>
                  <div className="flex flex-col gap-4 text-base text-foreground/85 leading-relaxed">
                    {s.content}
                  </div>
                </section>
              ))}

              <hr className="border-border mt-4" />
              <p className="t-small text-muted">
                Pour toute question concernant ce document, contactez-nous à
                {" "}
                <a href="mailto:contact@hidea-solution.fr" className="text-foreground underline underline-offset-4 hover:text-accent">
                  contact@hidea-solution.fr
                </a>
                .
              </p>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Petits helpers pour la mise en page des sections légales. */
export function LP({ children }) {
  return <p>{children}</p>;
}

export function LUL({ children }) {
  return <ul className="list-disc pl-5 flex flex-col gap-1.5">{children}</ul>;
}

export function LDL({ children }) {
  return <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">{children}</dl>;
}

export function LDLRow({ term, value }) {
  return (
    <>
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-strong pt-1">{term}</dt>
      <dd className="text-foreground/85">{value}</dd>
    </>
  );
}
