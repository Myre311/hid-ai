import Link from "next/link";
import { Container } from "@/components/ui/Container";

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.339 18.337V9.998H5.668v8.339H8.34Zm-1.336-9.49a1.547 1.547 0 1 0 0-3.094 1.547 1.547 0 0 0 0 3.094Zm11.336 9.49v-4.81c0-2.502-1.336-3.673-3.115-3.673-1.435 0-2.078.79-2.434 1.346V9.998h-2.671c.035.752 0 8.339 0 8.339h2.671v-4.658c0-.24.018-.48.088-.652.193-.481.633-.978 1.371-.978.967 0 1.354.738 1.354 1.82v4.468h2.736Z"/>
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"/>
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}


const COLUMNS = [
  {
    title: "Plateforme",
    links: [
      { label: "Pour les talents", href: "/#talents" },
      { label: "Pour les entreprises", href: "/#entreprises" },
      { label: "Comment ça marche", href: "/#how-it-works" },
      { label: "Sécurité", href: "/security" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Recherche", href: "/research" },
      { label: "Blog", href: "/blog" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Société",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Carrières", href: "/careers" },
      { label: "Presse", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/legal" },
      { label: "CGU", href: "/terms" },
      { label: "Politique de confidentialité", href: "/privacy" },
      { label: "RGPD", href: "/gdpr" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-10">
      <Container>
        {/* Desktop: 4-column grid. Mobile: native <details> accordions. */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-12">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-strong">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-foreground transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="md:hidden flex flex-col">
          {COLUMNS.map((col) => (
            <details
              key={col.title}
              className="group border-b border-border [&_svg]:open:rotate-45"
            >
              <summary className="flex items-center justify-between cursor-pointer py-4 list-none">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-strong">
                  {col.title}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4 text-muted transition-transform duration-200"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </summary>
              <ul className="flex flex-col gap-2 pb-4">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-foreground transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-muted">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-tight text-foreground">
              <span className="text-foreground">HID</span>
              <span className="text-accent ml-1">AI</span>
            </span>
            <span>© 2026 Hidea Solution. Tous droits réservés.</span>
          </div>
          <div className="text-center text-xs">
            Lucien Odzali · +33 6 27 67 89 31 · contact@hidea-solution.fr
          </div>
          <div className="flex items-center gap-4 md:justify-end">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-foreground transition-colors duration-200"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
