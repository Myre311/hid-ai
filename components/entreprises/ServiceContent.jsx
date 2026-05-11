import { ArrowRight, Check, ShieldCheck, KeyRound, Lock, FileCheck2, Award } from "lucide-react";
import { B2BTriggerButton } from "@/components/forms/buttons/InscriptionTriggerButtons";

const COMPLIANCE_ITEMS = [
  { Icon: ShieldCheck, label: "RGPD" },
  { Icon: KeyRound, label: "AES-256" },
  { Icon: Lock, label: "mTLS 1.3" },
  { Icon: FileCheck2, label: "Audit trail immuable" },
  { Icon: Award, label: "ISO-ready" },
];

/**
 * Vue détaillée d'un service entreprise.
 * Inclut : titre + desc + sous-services + illustration + bloc KYB + bandeau Compliance.
 * KYB et Compliance sont DUPLIQUÉS dans chaque tab (AI Data + Recrutement) selon brief client.
 */
export function ServiceContent({
  subtitle,
  description,
  subservices = [],
  ctaLabel = "Réserver une démo",
}) {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {/* 1. Détail service */}
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
        <div className="flex flex-col gap-6">
          <h3 className="t-h3">
            {subtitle}
          </h3>
          <p className="t-lead max-w-xl">
            {description}
          </p>

          {subservices.length > 0 && (
            <ul className="flex flex-col gap-3 mt-2">
              {subservices.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm md:text-base text-foreground/90"
                >
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}

          <B2BTriggerButton className="inline-flex items-center gap-2 self-start mt-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </B2BTriggerButton>
        </div>

        {/* Illustration descriptive — placeholder en attendant client */}
        <div className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[24rem] bg-surface border border-border rounded-lg flex items-center justify-center p-8">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-strong text-center">
            Illustration · à venir
          </span>
        </div>
      </div>

      {/* 2. Bloc KYB — dupliqué dans chaque tab */}
      <div className="flex flex-col items-start gap-6 max-w-3xl p-8 md:p-10 rounded-lg bg-surface/40 border border-border/50">
        <h4 className="t-h3">
          Validation KYB sous 48 heures.
        </h4>
        <p className="text-base text-muted leading-relaxed">
          Création de compte, dépôt de votre numéro d&rsquo;enregistrement,
          vérification manuelle par notre équipe puis activation de votre
          espace projet. Vous recevez votre accès en moins de deux jours
          ouvrés.
        </p>
        <B2BTriggerButton className="inline-flex items-center gap-2 h-11 rounded-md bg-black border border-white/25 px-5 text-sm font-medium text-foreground hover:border-white/60 hover:bg-surface-elevated transition-all duration-200">
          Démarrer l&rsquo;onboarding entreprise
          <ArrowRight className="h-4 w-4" />
        </B2BTriggerButton>
      </div>

      {/* 3. Bandeau Compliance — dupliqué dans chaque tab */}
      <div className="flex flex-col gap-6 max-w-5xl">
        <h4 className="t-h3 max-w-3xl">
          Conçu pour les exigences réglementaires les plus strictes.
        </h4>
        <ul className="flex flex-wrap gap-3">
          {COMPLIANCE_ITEMS.map(({ Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground/90"
            >
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
