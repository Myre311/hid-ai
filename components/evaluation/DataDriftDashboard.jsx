import { AlertTriangle, CheckCircle2 } from "lucide-react";

/**
 * Dashboard data drift — tableau des features avec stats KS et statut.
 * Lecture seule : sert d'input visuel pour les questions de diagnostic.
 */
export function DataDriftDashboard({ features }) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
          Data Drift — production vs entraînement
        </p>
        <span className="text-[10px] text-foreground/40">
          Stat. de Kolmogorov-Smirnov
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-[0.14em] text-foreground/40">
            <tr className="border-b border-white/5">
              <th className="px-4 py-2 font-medium">Feature</th>
              <th className="px-4 py-2 font-medium">Référence</th>
              <th className="px-4 py-2 font-medium">Production</th>
              <th className="px-4 py-2 font-medium">KS</th>
              <th className="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => {
              const isAlert = f.status === "alert";
              return (
                <tr
                  key={f.id}
                  className={`border-b border-white/5 ${
                    isAlert ? "bg-amber-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-foreground/85">{f.name}</td>
                  <td className="px-4 py-2.5 text-foreground/65 font-mono text-xs">
                    {f.reference_mean}
                  </td>
                  <td className="px-4 py-2.5 text-foreground/65 font-mono text-xs">
                    {f.production_mean}
                  </td>
                  <td
                    className={`px-4 py-2.5 font-mono text-xs ${
                      isAlert ? "text-amber-400" : "text-foreground/65"
                    }`}
                  >
                    {f.ks.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5">
                    {isAlert ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Alerte
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
