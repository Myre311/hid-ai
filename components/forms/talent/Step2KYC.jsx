"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileCheck2, X, AlertCircle } from "lucide-react";
import { FormFieldRadio } from "@/components/forms/shared/FormFieldRadio";
import { FormFieldText } from "@/components/forms/shared/FormFieldText";
import { cn } from "@/lib/utils/cn";

const DOC_TYPES = [
  { value: "cni", label: "Carte nationale d'identité" },
  { value: "passeport", label: "Passeport" },
  { value: "permis", label: "Permis de conduire" },
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function FileUpload({ label, required, value, onChange, error, accept }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Generate preview when value (file) changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    if (value.type?.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [value]);

  const handle = (file) => {
    setLocalError(null);
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setLocalError("Fichier trop lourd (max 5 MB)");
      return;
    }
    onChange(file);
  };

  const remove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-foreground/70">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </span>
      <div
        className={cn(
          "rounded-md border border-dashed bg-[#1A1A1A] p-4 flex items-center gap-4 transition-colors",
          (error || localError) ? "border-red-400/60" : "border-white/15"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Aperçu"
            className="h-16 w-16 object-cover rounded border border-white/10"
          />
        ) : value ? (
          <div className="h-16 w-16 rounded bg-surface-elevated border border-white/10 flex items-center justify-center">
            <FileCheck2 className="h-6 w-6 text-accent" />
          </div>
        ) : (
          <div className="h-16 w-16 rounded bg-surface-elevated border border-white/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-foreground/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <p className="text-sm text-foreground truncate">{value.name}</p>
              <p className="text-xs text-foreground/50">
                {(value.size / 1024).toFixed(0)} KB
              </p>
            </>
          ) : (
            <p className="text-xs text-foreground/50">
              JPG, PNG, PDF · max 5 MB
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? "image/*,.pdf"}
          onChange={(e) => handle(e.target.files?.[0] ?? null)}
          className="sr-only"
          id={`file-${label}`}
        />
        {value ? (
          <button
            type="button"
            onClick={remove}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/5"
            aria-label="Retirer le fichier"
          >
            <X className="h-4 w-4 text-foreground/70" />
          </button>
        ) : (
          <label
            htmlFor={`file-${label}`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-white/5 border border-white/15 text-xs text-foreground/85 hover:bg-white/10 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" /> Choisir
          </label>
        )}
      </div>
      {(error || localError) && (
        <p className="text-xs text-red-400">{error || localError}</p>
      )}
    </div>
  );
}

export function TalentStep2KYC({ data, errors, update }) {
  const set = (k, v) => update({ ...data, [k]: v });
  const docType = data.doc_type;
  const versoNeeded = docType === "cni" || docType === "permis";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="t-h3">Vérification d&rsquo;identité</h3>
        <p className="text-sm text-foreground/60">
          Pour garantir l&rsquo;intégrité de la marketplace et la traçabilité.
        </p>
      </div>

      <FormFieldRadio
        label="Document d'identité"
        name="doc_type"
        required
        options={DOC_TYPES}
        value={data.doc_type}
        onChange={(v) => set("doc_type", v)}
        error={errors.doc_type}
      />

      <div className="rounded-md border border-amber-400/30 bg-amber-400/5 p-3 flex gap-2 text-xs text-amber-200/85">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          Vos documents sont prévisualisés en local pour cette V1 et ne quittent
          pas votre navigateur. Connecté à un service KYC réel à la mise en
          production.
        </span>
      </div>

      {docType && (
        <div className="flex flex-col gap-4">
          <FileUpload
            label="Recto pièce d'identité"
            required
            value={data.doc_recto}
            onChange={(f) => set("doc_recto", f)}
            error={errors.doc_recto}
          />
          {versoNeeded && (
            <FileUpload
              label="Verso pièce d'identité"
              required
              value={data.doc_verso}
              onChange={(f) => set("doc_verso", f)}
              error={errors.doc_verso}
            />
          )}
          <FileUpload
            label="Selfie tenant la pièce d'identité"
            required
            value={data.selfie}
            onChange={(f) => set("selfie", f)}
            error={errors.selfie}
          />
        </div>
      )}

      <FormFieldText
        label="Antécédents techniques (optionnel)"
        name="antecedents"
        textarea
        rows={4}
        maxLength={500}
        placeholder="Décrivez brièvement votre parcours et vos expériences en IA, traitement de données, ou domaines connexes (optionnel)"
        value={data.antecedents}
        onChange={(v) => set("antecedents", v)}
      />
    </div>
  );
}

export function validateTalentStep2(data) {
  const e = {};
  if (!data.doc_type) e.doc_type = "Type de document requis";
  if (!data.doc_recto) e.doc_recto = "Recto requis";
  if ((data.doc_type === "cni" || data.doc_type === "permis") && !data.doc_verso)
    e.doc_verso = "Verso requis";
  if (!data.selfie) e.selfie = "Selfie requis";
  return e;
}
