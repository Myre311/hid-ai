"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const TYPES = [
  { value: "b2b", label: "Demande B2B / partenariat" },
  { value: "talent", label: "Inscription Talent" },
  { value: "press", label: "Presse / média" },
  { value: "career", label: "Carrière" },
  { value: "other", label: "Autre" },
];

const initialForm = {
  type: "b2b",
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  sujet: "",
  message: "",
  consent_rgpd: false,
  website: "", // honeypot
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(body?.error || "Erreur inattendue");
        return;
      }
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Connexion impossible — réessayez plus tard.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent/40 bg-accent/5 p-8 flex flex-col items-start gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h3 className="t-h3 text-foreground mb-2">Message envoyé</h3>
          <p className="t-body text-muted">
            Merci, nous vous répondons sous 48h ouvrées à l'adresse fournie.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="t-small text-accent hover:text-accent-hover underline underline-offset-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — invisible aux humains, piège à bots */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0 pointer-events-none"
      />

      <Field label="Type de demande" required>
        <select
          value={form.type}
          onChange={update("type")}
          className={inputCls}
          required
        >
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Prénom" required>
          <input type="text" value={form.prenom} onChange={update("prenom")} className={inputCls} required maxLength={80} autoComplete="given-name" />
        </Field>
        <Field label="Nom" required>
          <input type="text" value={form.nom} onChange={update("nom")} className={inputCls} required maxLength={80} autoComplete="family-name" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="E-mail" required>
          <input type="email" value={form.email} onChange={update("email")} className={inputCls} required maxLength={200} autoComplete="email" />
        </Field>
        <Field label="Téléphone" hint="Optionnel">
          <input type="tel" value={form.telephone} onChange={update("telephone")} className={inputCls} maxLength={40} autoComplete="tel" />
        </Field>
      </div>

      <Field label="Sujet" required>
        <input type="text" value={form.sujet} onChange={update("sujet")} className={inputCls} required maxLength={200} placeholder="Ex. Demande de devis annotation NLP" />
      </Field>

      <Field label="Message" required hint={`${form.message.length}/5000`}>
        <textarea
          value={form.message}
          onChange={update("message")}
          className={cn(inputCls, "min-h-[160px] resize-y leading-relaxed")}
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-muted cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.consent_rgpd}
          onChange={update("consent_rgpd")}
          className="mt-1 h-4 w-4 rounded border-border bg-surface text-accent focus:ring-accent"
          required
        />
        <span>
          J'accepte que mes données soient traitées par Hidea Solution afin de répondre à
          ma demande, conformément à la{" "}
          <a href="/privacy" className="text-foreground underline underline-offset-4 hover:text-accent">
            politique de confidentialité
          </a>.
        </span>
      </label>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-foreground">
          <AlertCircle className="h-4 w-4 mt-0.5 text-danger flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium transition-colors",
          "bg-accent text-background hover:bg-accent-hover",
          "disabled:opacity-50 disabled:cursor-not-allowed self-start"
        )}
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-colors";

function Field({ label, required, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-strong">
        <span>
          {label} {required && <span className="text-accent">*</span>}
        </span>
        {hint && <span className="text-muted normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
