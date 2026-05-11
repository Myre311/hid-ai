"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormStepper } from "@/components/forms/shared/FormStepper";
import { FormNavigation } from "@/components/forms/shared/FormNavigation";
import { FormConfirmation } from "@/components/forms/shared/FormConfirmation";
import {
  TalentStep1Identification,
  validateTalentStep1,
} from "./Step1Identification";
import { TalentStep2KYC, validateTalentStep2 } from "./Step2KYC";
import {
  TalentStep3MiniFormation,
  validateTalentStep3,
} from "./Step3MiniFormation";
import {
  TalentStep4EvaluationTechnique,
  validateTalentStep4,
} from "./Step4EvaluationTechnique";
import { TalentStep5Activation, validateTalentStep5 } from "./Step5Activation";
import { frenchDate } from "@/components/forms/shared/Calendar";

const STORAGE_KEY = "hidai_talent_form";
const STEPS = [
  "Identification",
  "Vérif. KYC",
  "Pré-qualif.",
  "Évaluation",
  "Activation",
];

const INITIAL_DATA = {
  // Step 1
  prenom: "",
  nom: "",
  date_naissance: "",
  email: "",
  telephone: "",
  pays: "Côte d'Ivoire",
  ville: "",
  metier: "",
  niveau_etudes: "",
  competences: [],
  // Step 2 (files NOT serializable in localStorage — handled separately)
  doc_type: "",
  doc_recto: null,
  doc_verso: null,
  selfie: null,
  antecedents: "",
  // Step 3
  modules: { ecosysteme: "a_demarrer", securite: "a_demarrer", orientation: "a_demarrer" },
  // Step 4
  domaine: "",
  creneau_test: null,
  prerequis: [],
  // Step 5
  consent_cgu: false,
  consent_rgpd: false,
  consent_ethique: false,
  consent_news: false,
};

const VALIDATORS = [
  validateTalentStep1,
  validateTalentStep2,
  validateTalentStep3,
  validateTalentStep4,
  validateTalentStep5,
];

// Filter file fields out before localStorage serialization (File is not JSON-serializable)
const FILE_KEYS = ["doc_recto", "doc_verso", "selfie"];

export function TalentForm({ presetMetier = null, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    ...INITIAL_DATA,
    metier: presetMetier ?? INITIAL_DATA.metier,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({
          ...INITIAL_DATA,
          ...parsed,
          metier: presetMetier ?? parsed.metier ?? "",
          // re-init file fields (browsers can't restore File from JSON)
          doc_recto: null,
          doc_verso: null,
          selfie: null,
        }));
      }
    } catch {}
    setHydrated(true);
  }, [presetMetier]);

  // Persist on every change (excluding file objects)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const serializable = { ...data };
      FILE_KEYS.forEach((k) => delete serializable[k]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch {}
  }, [data, hydrated]);

  const goNext = async () => {
    const e = VALIDATORS[step](data);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (step === STEPS.length - 1) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        // Le serveur attend un FormData multipart : payload JSON + fichiers
        const payload = { ...data };
        FILE_KEYS.forEach((k) => delete payload[k]);

        const fd = new FormData();
        fd.append("payload", JSON.stringify(payload));
        if (data.doc_recto instanceof File) fd.append("doc_recto", data.doc_recto);
        if (data.doc_verso instanceof File) fd.append("doc_verso", data.doc_verso);
        if (data.selfie instanceof File) fd.append("selfie", data.selfie);

        const res = await fetch("/api/inscription-talent", {
          method: "POST",
          body: fd,
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
        console.error("[TalentForm] submit error:", err);
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
    const cr = data.creneau_test;
    const dateStr = cr?.date
      ? `${frenchDate(new Date(cr.date + "T12:00"))} à ${cr.time}`
      : "—";
    const metierLabel = data.metier === "specialist" ? "AI Specialist" : "AI Engineer";
    return (
      <FormConfirmation
        title="Bienvenue dans l'écosystème HID AI"
        reference={submitted.reference}
        message={
          <>
            Bonjour <strong>{data.prenom}</strong>, votre profil{" "}
            <strong>{metierLabel}</strong> est en cours d&rsquo;activation. Vous
            recevrez à <strong>{data.email}</strong> :
            <ul className="list-disc list-inside mt-3 text-left text-sm space-y-1">
              <li>Une confirmation d&rsquo;inscription</li>
              <li>
                Un email de convocation pour votre évaluation technique du{" "}
                <strong>{dateStr}</strong>
              </li>
              <li>L&rsquo;accès à votre espace personnel après validation finale</li>
            </ul>
          </>
        }
        actions={[
          {
            label: "Démarrer mon évaluation",
            href: "/signup?next=/dashboard",
            primary: true,
          },
          { label: "Retour à l'accueil", href: "/" },
        ]}
      />
    );
  }

  const update = setData;

  return (
    <div className="flex flex-col">
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
              <TalentStep1Identification
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 1 && (
              <TalentStep2KYC data={data} errors={errors} update={update} />
            )}
            {step === 2 && (
              <TalentStep3MiniFormation
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 3 && (
              <TalentStep4EvaluationTechnique
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 4 && (
              <TalentStep5Activation
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
          nextLabel="Activer mon profil"
        />
      </div>
    </div>
  );
}
