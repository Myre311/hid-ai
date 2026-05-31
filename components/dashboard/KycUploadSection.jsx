"use client";

import { useState } from "react";
import { ShieldCheck, Clock, AlertCircle } from "lucide-react";
import { TalentStep2KYC, validateTalentStep2 } from "@/components/forms/talent/Step2KYC";
import { compressImage } from "@/lib/utils/image-compress";

/**
 * Section KYC du dashboard talent. Réutilise le composant d'upload existant
 * (TalentStep2KYC). Le KYC déposé passe en "en cours de validation" ; l'admin
 * le valide → accès missions débloqué.
 *
 * @param {{ state: 'todo'|'pending'|'validated' }} props
 */
export function KycUploadSection({ state }) {
  const [data, setData] = useState({
    doc_type: "",
    doc_recto: null,
    doc_verso: null,
    selfie: null,
    antecedents: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(false);

  if (state === "validated") {
    return (
      <Banner
        Icon={ShieldCheck}
        tone="success"
        title="Dossier validé"
        text="Vos pièces d'identité ont été vérifiées. L'accès aux missions est débloqué."
      />
    );
  }

  if (state === "pending" || done) {
    return (
      <Banner
        Icon={Clock}
        tone="info"
        title="Dossier en cours de validation"
        text="Vos pièces ont bien été reçues. Notre équipe les vérifie — vous serez notifié dès validation. L'accès aux missions sera alors débloqué."
      />
    );
  }

  const submit = async () => {
    const e = validateTalentStep2(data);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setBusy(true);
    setErr(null);
    try {
      const [recto, verso, selfie] = await Promise.all([
        data.doc_recto instanceof File ? compressImage(data.doc_recto) : null,
        data.doc_verso instanceof File ? compressImage(data.doc_verso) : null,
        data.selfie instanceof File ? compressImage(data.selfie) : null,
      ]);
      const fd = new FormData();
      fd.append(
        "payload",
        JSON.stringify({
          doc_type: data.doc_type,
          antecedents: data.antecedents || null,
        })
      );
      if (recto) fd.append("doc_recto", recto);
      if (verso) fd.append("doc_verso", verso);
      if (selfie) fd.append("selfie", selfie);

      let res;
      try {
        res = await fetch("/api/profile/kyc", { method: "POST", body: fd });
      } catch (netErr) {
        // fetch n'a pas reçu de réponse — typiquement réseau coupé, timeout,
        // ou body trop gros qui fait crasher la requête. Message clair en FR.
        throw new Error(
          "Impossible d'envoyer vos pièces. Vérifiez votre connexion internet (4G/wifi stable), réduisez la taille des photos si possible, puis réessayez."
        );
      }
      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error(
          res.status === 413
            ? "Fichiers trop volumineux. Reprenez vos photos avec une qualité plus basse."
            : res.status >= 500
            ? "Notre serveur a rencontré un problème. Réessayez dans quelques minutes."
            : `Erreur HTTP ${res.status}`
        );
      }
      if (!res.ok) throw new Error(json.error || "Échec de l'envoi");
      setDone(true);
    } catch (e2) {
      setErr(e2.message || "Échec de l'envoi. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-lg border border-accent/30 bg-accent/5 p-5 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 text-accent flex-shrink-0">
          <AlertCircle className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Complétez votre dossier — pièces d&rsquo;identité
          </h2>
          <p className="text-xs text-foreground/60 mt-1">
            Requis pour accéder aux missions. Vos évaluations restent
            accessibles sans cela.
          </p>
        </div>
      </div>

      <TalentStep2KYC data={data} errors={errors} update={setData} />

      {err && <p className="text-sm text-danger">{err}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="self-start inline-flex items-center justify-center h-11 px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors"
      >
        {busy ? "Envoi…" : "Envoyer mes pièces"}
      </button>
    </section>
  );
}

function Banner({ Icon, tone, title, text }) {
  const tones = {
    success: "border-success/30 bg-success/5 text-success",
    info: "border-accent/30 bg-accent/5 text-accent",
  };
  return (
    <section className={`rounded-lg border p-5 flex items-start gap-3 ${tones[tone]}`}>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 flex-shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-foreground/65 mt-1 leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
