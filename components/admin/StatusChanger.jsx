"use client";

import { useState } from "react";

const OPTIONS = [
  { value: "new", label: "Nouveau" },
  { value: "contacted", label: "Contacté" },
  { value: "demo_scheduled", label: "Démo planifiée" },
  { value: "won", label: "Converti" },
  { value: "lost", label: "Perdu" },
];

export function StatusChanger({ id, currentStatus }) {
  const [value, setValue] = useState(currentStatus);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const save = async (newStatus) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/b2b/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setValue(newStatus);
        setSavedAt(new Date());
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 items-end">
      <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        Statut
      </span>
      <select
        value={value}
        onChange={(e) => save(e.target.value)}
        disabled={busy}
        className="bg-[#1A1A1A] border border-accent/40 rounded-md px-3 h-10 text-sm text-foreground focus:outline-none focus:border-accent disabled:opacity-50"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0A0A0B]">
            {o.label}
          </option>
        ))}
      </select>
      {savedAt && (
        <span className="text-[10px] text-success">
          Enregistré à {savedAt.toLocaleTimeString("fr-FR")}
        </span>
      )}
    </div>
  );
}
