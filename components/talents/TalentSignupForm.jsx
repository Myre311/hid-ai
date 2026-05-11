"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useInscription } from "@/contexts/InscriptionContext";

const ROLES = [
  { value: "specialist", label: "AI Specialist" },
  { value: "engineer", label: "AI Engineer" },
];

const COUNTRIES = [
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Cameroun",
  "Congo Brazzaville",
  "Nigeria",
  "Bénin",
  "Togo",
  "France",
  "Autre",
];

export function TalentSignupForm() {
  const { openTalentForm } = useInscription();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "specialist",
    country: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail invalide";
    if (!form.role) e.role = "Métier requis";
    if (!form.country) e.country = "Pays requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Au clic, on ouvre le formulaire d'inscription complet (modal)
    // en pré-cochant le métier choisi ici.
    openTalentForm(form.role);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 p-6 md:p-8 rounded-lg bg-surface border border-border"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Nom · Prénom"
          required
          value={form.name}
          onChange={(v) => setField("name", v)}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          label="E-mail"
          required
          type="email"
          value={form.email}
          onChange={(v) => setField("email", v)}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <SelectField
          label="Métier ciblé"
          required
          value={form.role}
          onChange={(v) => setField("role", v)}
          error={errors.role}
          options={ROLES}
        />
        <SelectField
          label="Pays"
          required
          value={form.country}
          onChange={(v) => setField("country", v)}
          error={errors.country}
          options={COUNTRIES.map((c) => ({ value: c, label: c }))}
          placeholder="Sélectionner…"
        />
      </div>

      <Field
        label="Message (optionnel)"
        textarea
        value={form.message}
        onChange={(v) => setField("message", v)}
        placeholder="Quelques mots sur votre parcours et vos attentes."
      />

      <button
        type="submit"
        className="inline-flex items-center justify-center mt-2 h-11 px-5 rounded-md bg-black text-sm font-medium text-foreground border border-white/25 hover:border-white/60 hover:bg-surface-elevated transition-all duration-200"
      >
        Créer mon profil
      </button>

      <p className="text-xs text-muted">Validation par notre équipe sous 48h.</p>
    </form>
  );
}

function Field({ label, value, onChange, error, required, textarea, type = "text", placeholder, autoComplete }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.18em] text-muted">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      <Tag
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        rows={textarea ? 4 : undefined}
        className={cn(
          "bg-background border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-strong",
          "focus:outline-none transition-colors duration-200",
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-accent"
        )}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, error, required, options, placeholder = "Sélectionner…" }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.18em] text-muted">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-background border rounded-md px-3 h-11 text-sm text-foreground",
          "focus:outline-none transition-colors duration-200",
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-accent"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
