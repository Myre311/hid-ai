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
import {
  TalentStep3MiniFormation,
  validateTalentStep3,
} from "./Step3MiniFormation";
import {
  TalentStep4EvaluationTechnique,
  validateTalentStep4,
} from "./Step4EvaluationTechnique";
import { TalentStep5Activation, validateTalentStep5 } from "./Step5Activation";

// Le KYC (pièces d'identité) n'est plus collecté ici : il se fait dans le
// dashboard talent (section Profil), et conditionne l'accès aux missions.
const STORAGE_KEY = "hidai_talent_form";
const STEPS = [
  "Identification",
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
  // Step 2 — Pré-qualif.
  modules: { ecosysteme: "a_demarrer", securite: "a_demarrer", orientation: "a_demarrer" },
  // Step 3 — Évaluation
  domaine: "",
  prerequis: [],
  // Step 4 — Activation
  consent_cgu: false,
  consent_rgpd: false,
  consent_ethique: false,
  consent_news: false,
};

const VALIDATORS = [
  validateTalentStep1,
  validateTalentStep3,
  validateTalentStep4,
  validateTalentStep5,
];

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
        }));
      }
    } catch {}
    setHydrated(true);
  }, [presetMetier]);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
        const res = await fetch("/api/inscription-talent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        let json;
        try {
          json = await res.json();
        } catch {
          const text = await res.text().catch(() => "");
          throw new Error(text?.slice(0, 200) || `Erreur HTTP ${res.status}`);
        }
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
                Un lien d&rsquo;accès à votre <strong>tableau de bord</strong>{" "}
                pour démarrer votre évaluation technique dès maintenant
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
              <TalentStep3MiniFormation
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 2 && (
              <TalentStep4EvaluationTechnique
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 3 && (
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
