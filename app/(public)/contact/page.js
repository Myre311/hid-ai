import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact · HID AI",
  description: "Contactez l'équipe HID AI — partenariats B2B, inscription Talent, presse, carrière.",
};

const INFO = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contact@hidea-solution.fr",
    href: "mailto:contact@hidea-solution.fr",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+33 6 27 67 89 31",
    href: "tel:+33627678931",
  },
  {
    icon: MapPin,
    label: "Siège",
    value: "France",
    sub: "Opérateurs en Côte d'Ivoire, Maroc, Congo Brazzaville",
  },
  {
    icon: Clock,
    label: "Délai de réponse",
    value: "Sous 48h ouvrées",
    sub: "Lundi au vendredi · 9h-18h CET",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 md:pb-16 bg-background">
        <Container className="max-w-5xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted mb-4">
            Nous contacter
          </p>
          <h1 className="t-h1">Parlons de votre projet.</h1>
          <p className="t-lead text-muted mt-6 max-w-2xl">
            Que vous cherchiez à entraîner un modèle, à rejoindre HID AI en tant que
            spécialiste, ou simplement à comprendre comment nous travaillons — on vous
            répond sous 48h.
          </p>
        </Container>
      </section>

      <Section className="pb-32 pt-0" size="sm">
        <Container className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            <div>
              <ContactForm />
            </div>

            <aside className="flex flex-col gap-6 lg:border-l lg:border-border lg:pl-12">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-strong">
                Coordonnées
              </p>

              <ul className="flex flex-col gap-5">
                {INFO.map((item) => {
                  const Icon = item.icon;
                  const Content = (
                    <>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface-elevated text-accent flex-shrink-0">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-strong">
                          {item.label}
                        </span>
                        <span className="text-sm text-foreground mt-0.5">
                          {item.value}
                        </span>
                        {item.sub && (
                          <span className="text-xs text-muted mt-1 leading-relaxed">
                            {item.sub}
                          </span>
                        )}
                      </div>
                    </>
                  );

                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="flex items-start gap-3 hover:text-accent transition-colors"
                        >
                          {Content}
                        </a>
                      ) : (
                        <div className="flex items-start gap-3">{Content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <hr className="border-border" />

              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-strong">
                  Vous cherchez plutôt à…
                </p>
                <ul className="flex flex-col gap-2 text-sm">
                  <li>
                    <a href="/entreprises" className="text-muted hover:text-foreground underline underline-offset-4">
                      Démarrer un projet B2B →
                    </a>
                  </li>
                  <li>
                    <a href="/talents" className="text-muted hover:text-foreground underline underline-offset-4">
                      Vous inscrire comme Talent →
                    </a>
                  </li>
                  <li>
                    <a href="/a-propos" className="text-muted hover:text-foreground underline underline-offset-4">
                      En savoir plus sur HID AI →
                    </a>
                  </li>
                  <li>
                    <a href="/gdpr" className="text-muted hover:text-foreground underline underline-offset-4">
                      Exercer un droit RGPD →
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
