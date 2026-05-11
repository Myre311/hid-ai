"use client";

import { useInscription } from "@/contexts/InscriptionContext";

/**
 * Boutons-trigger réutilisables pour ouvrir les modals d'inscription.
 * Permet de garder les pages/sections en server components tout en ouvrant
 * le modal géré par InscriptionContext (client-side).
 */

export function B2BTriggerButton({
  children,
  className,
  ariaLabel,
  type = "button",
  ...rest
}) {
  const { openB2BForm } = useInscription();
  return (
    <button
      type={type}
      onClick={openB2BForm}
      aria-label={ariaLabel}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}

export function TalentTriggerButton({
  children,
  className,
  presetMetier = null,
  ariaLabel,
  type = "button",
  ...rest
}) {
  const { openTalentForm } = useInscription();
  return (
    <button
      type={type}
      onClick={() => openTalentForm(presetMetier ?? null)}
      aria-label={ariaLabel}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
