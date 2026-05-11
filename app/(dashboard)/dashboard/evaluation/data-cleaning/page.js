"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Copy } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { DATA_CLEANING_DATA } from "@/lib/evaluation/data/data-cleaning-data";
import { cn } from "@/lib/utils/cn";

const TEST = getTestBySlug("data-cleaning");

export default function DataCleaningPage() {
  // rows : { rowId: { date, email_kept_or_invalid, name, marked_duplicate, marked_invalid_email } }
  const [rows, setRows] = useState({});

  const setField = (rowId, field, val) =>
    setRows((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: val },
    }));

  const processed = useMemo(
    () =>
      Object.values(rows).filter((r) => {
        const hasDate = (r?.date ?? "").trim().length > 0;
        const hasName = (r?.name ?? "").trim().length > 0;
        return (
          hasDate ||
          hasName ||
          r?.marked_duplicate ||
          r?.marked_invalid_email
        );
      }).length,
    [rows]
  );

  const canSubmit = processed >= 15; // au moins 15/20 lignes touchées

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({ rows })}
      casesProcessed={processed}
      totalCases={DATA_CLEANING_DATA.dirty.length}
    >
      <ContextCard title="Nettoyage d'une base de données scrapée">
        <p>
          Vous recevez une base extraite par scraping web : 20 lignes clients
          avec dates aux formats incohérents (US/FR mélangés), emails invalides,
          doublons et fautes de frappe. <strong>Mission</strong> : nettoyer
          chaque ligne et marquer les anomalies pour produire un dataset propre,
          injectable dans un pipeline d&rsquo;entraînement.
        </p>
      </ContextCard>

      <div className="flex flex-col gap-5">
        <div className="rounded-md border border-amber-400/30 bg-amber-400/5 p-3 flex gap-2 text-xs text-amber-200/85">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Corrigez la date (format <strong>YYYY-MM-DD</strong>), normalisez le
            nom, cochez les doublons et marquez les emails invalides.
          </span>
        </div>

        {/* Mobile cards — visible uniquement sous md */}
        <div className="md:hidden flex flex-col gap-3">
          {DATA_CLEANING_DATA.dirty.map((row, i) => {
            const r = rows[row.id] || {};
            return (
              <div
                key={row.id}
                className={cn(
                  "rounded-lg border border-white/10 p-4 flex flex-col gap-3",
                  i % 2 === 0 ? "bg-surface/40" : "bg-surface/20"
                )}
              >
                <div className="text-xs text-foreground/40 font-mono">
                  Ligne {i + 1}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/40">
                    Date brute
                  </span>
                  <span className="text-xs text-foreground/55 font-mono">
                    {row.date_raw}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/40">
                    Date corrigée (YYYY-MM-DD)
                  </span>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={r.date ?? ""}
                    onChange={(e) => setField(row.id, "date", e.target.value)}
                    className="bg-[#1A1A1A] border border-white/10 rounded px-2 h-9 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent w-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/40">
                    Email
                  </span>
                  <span className="text-xs text-foreground/70 font-mono break-all">
                    {row.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/40">
                    Nom corrigé
                  </span>
                  <input
                    type="text"
                    placeholder={row.name}
                    value={r.name ?? ""}
                    onChange={(e) => setField(row.id, "name", e.target.value)}
                    className="bg-[#1A1A1A] border border-white/10 rounded px-2 h-9 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent w-full"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!r.marked_invalid_email}
                      onChange={(e) =>
                        setField(row.id, "marked_invalid_email", e.target.checked)
                      }
                      className="accent-accent h-4 w-4"
                    />
                    Email invalide
                  </label>
                  <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!r.marked_duplicate}
                      onChange={(e) =>
                        setField(row.id, "marked_duplicate", e.target.checked)
                      }
                      className="accent-accent h-4 w-4"
                    />
                    Doublon
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table — masquée sous md */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="text-xs uppercase tracking-[0.14em] text-foreground/40">
                <th className="text-left pb-2 pl-2">#</th>
                <th className="text-left pb-2">Date brute</th>
                <th className="text-left pb-2">Date corrigée</th>
                <th className="text-left pb-2">Email</th>
                <th className="text-center pb-2">Email invalide</th>
                <th className="text-left pb-2">Nom corrigé</th>
                <th className="text-center pb-2">Doublon</th>
              </tr>
            </thead>
            <tbody>
              {DATA_CLEANING_DATA.dirty.map((row, i) => {
                const r = rows[row.id] || {};
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-t border-white/5",
                      i % 2 === 0 ? "bg-surface/40" : ""
                    )}
                  >
                    <td className="py-2 pl-2 text-xs text-foreground/40 font-mono">
                      {i + 1}
                    </td>
                    <td className="py-2 pr-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground/55 font-mono">
                        {row.date_raw}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={r.date ?? ""}
                        onChange={(e) => setField(row.id, "date", e.target.value)}
                        className="bg-[#1A1A1A] border border-white/10 rounded px-2 h-8 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent w-28"
                      />
                    </td>
                    <td className="py-2 pr-3 text-xs text-foreground/70 font-mono truncate max-w-[180px]">
                      {row.email}
                    </td>
                    <td className="py-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!r.marked_invalid_email}
                        onChange={(e) =>
                          setField(row.id, "marked_invalid_email", e.target.checked)
                        }
                        className="accent-accent"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="text"
                        placeholder={row.name}
                        value={r.name ?? ""}
                        onChange={(e) => setField(row.id, "name", e.target.value)}
                        className="bg-[#1A1A1A] border border-white/10 rounded px-2 h-8 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent w-32"
                      />
                    </td>
                    <td className="py-2 text-center">
                      <input
                        type="checkbox"
                        checked={!!r.marked_duplicate}
                        onChange={(e) =>
                          setField(row.id, "marked_duplicate", e.target.checked)
                        }
                        className="accent-accent"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TestLayout>
  );
}
