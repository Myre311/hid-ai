"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormStepper } from "@/components/forms/shared/FormStepper";
import { FormNavigation } from "@/components/forms/shared/FormNavigation";
import { FormConfirmation } from "@/components/forms/shared/FormConfirmation";
import {
  B2BStep1Identification,
  validateB2BStep1,
} from "./Step1Identification";
import {
  B2BStep2Specifications,
  validateB2BStep2,
} from "./Step2Specifications";
import {
  B2BStep3PlanificationAudit,
  validateB2BStep3,
} from "./Step3PlanificationAudit";
import { B2BStep4Recap, validateB2BStep4 } from "./Step4Recap";
import { frenchDate } from "@/components/forms/shared/Calendar";

const STORAGE_KEY = "hidai_b2b_form";
const STEPS = ["Identification", "Spécifications", "Audit", "Récap"];

const INITIAL_DATA = {
  // Honeypot — DOIT rester vide. Si rempli, le serveur reject silencieusement.
  // Off-screen + aria-hidden + tabIndex=-1 pour les vrais humains, visible
  // pour les bots qui scannent le DOM.
  website_hp: "",
  // Step 1
  raison_sociale: "",
  immatriculation: "",
  pays: "",
  secteur: "",
  secteur_autre: "",
  site_web: "",
  signataire_prenom: "",
  signataire_nom: "",
  signataire_fonction: "",
  signataire_email: "",
  signataire_tel: "",
  // Step 2
  prestations: [],
  prestation_autre: "",
  typologies: [],
  volume: "",
  frequence: "",
  brief: "",
  // Step 3
  creneau: null,
  mode_rdv: "visio",
  langue: "fr",
  // Step 4
  consent_rgpd: false,
  consent_news: false,
};

const VALIDATORS = [
  validateB2BStep1,
  validateB2BStep2,
  validateB2BStep3,
  validateB2BStep4,
];

export function B2BForm({ onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(null); // { reference }
  const [hydrated, setHydrated] = useState(false);

  // Restore localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...INITIAL_DATA, ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  const validateCurrent = () => VALIDATORS[step](data);

  const goNext = async () => {
    const e = validateCurrent();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (step === STEPS.length - 1) {
      // Submit
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/inscription-b2b", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Erreur serveur");
        }
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setSubmitted({ reference: json.reference });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[B2BForm] submit error:", err);
        setSubmitError(
          err.message ||
            "La soumission a échoué. Vérifiez votre connexion et réessayez."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const goPrev = () => {
    if (step === 0) return;
    setErrors({});
    setStep((s) => s - 1);
  };

  if (submitted) {
    const cr = data.creneau;
    const dateStr = cr?.date
      ? `${frenchDate(new Date(cr.date + "T12:00"))} à ${cr.time}`
      : "—";
    return (
      <FormConfirmation
        title="Demande reçue"
        reference={submitted.reference}
        message={
          <>
            Votre dossier a été transmis à notre équipe. Vous recevrez une
            confirmation à <strong>{data.signataire_email}</strong> sous 24h,
            ainsi qu&rsquo;un email de confirmation pour votre RDV du{" "}
            <strong>{dateStr}</strong>.
          </>
        }
        actions={[
          { label: "Retour à l'accueil", href: "/", primary: true },
          { label: "Fermer", onClick: onClose },
        ]}
      />
    );
  }

  const update = setData;

  return (
    <div className="flex flex-col">
      {/* Honeypot anti-bot : invisible visuellement, accessible aux scanners */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="website_hp">Ne pas remplir</label>
        <input
          type="text"
          id="website_hp"
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          value={data.website_hp || ""}
          onChange={(e) => setData((d) => ({ ...d, website_hp: e.target.value }))}
        />
      </div>

      <FormStepper
        steps={STEPS}
        current={step}
        onStepClick={(i) => i < step && setStep(i)}
      />

      <div className="px-6 md:px-8 py-8 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <B2BStep1Identification
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 1 && (
              <B2BStep2Specifications
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 2 && (
              <B2BStep3PlanificationAudit
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 3 && (
              <B2BStep4Recap
                data={data}
                errors={errors}
                update={update}
                onEditStep={(i) => setStep(i)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <div className="rounded-md border border-red-400/40 bg-red-400/5 p-3 text-sm text-red-300">
            {submitError}
          </div>
        )}

        <FormNavigation
          onPrev={goPrev}
          onNext={goNext}
          canGoPrev={step > 0}
          canGoNext={true}
          isFinal={step === STEPS.length - 1}
          isSubmitting={submitting}
          nextLabel="Soumettre ma demande"
        />
      </div>
    </div>
  );
}
