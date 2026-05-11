"use client";

import { createContext, useContext, useState } from "react";

const InscriptionContext = createContext(null);

/**
 * Manages the global modal state for inscription forms (B2B + Talent).
 * Use the hook `useInscription()` from any component to open/close.
 */
export function InscriptionProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    type: null, // "b2b" | "talent"
    presetMetier: null, // "specialist" | "engineer" | null
  });

  const openB2BForm = () =>
    setModal({ open: true, type: "b2b", presetMetier: null });

  const openTalentForm = (presetMetier = null) =>
    setModal({ open: true, type: "talent", presetMetier });

  const closeModal = () =>
    setModal({ open: false, type: null, presetMetier: null });

  return (
    <InscriptionContext.Provider
      value={{ modal, openB2BForm, openTalentForm, closeModal }}
    >
      {children}
    </InscriptionContext.Provider>
  );
}

export function useInscription() {
  const ctx = useContext(InscriptionContext);
  if (!ctx)
    throw new Error("useInscription must be used inside <InscriptionProvider>");
  return ctx;
}
