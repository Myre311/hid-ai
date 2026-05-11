"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Calendrier statique : génère les N prochains jours ouvrés et propose des créneaux.
 * Sélection d'UN seul créneau (combinaison date + time).
 *
 * Props:
 *  - value: { date: "YYYY-MM-DD", time: "HH:MM" } | null
 *  - onChange(value)
 *  - daysAhead: nombre de jours ouvrés à proposer (défaut 14)
 *  - slots: array d'horaires ["09:00", "09:30", …] — défaut = 30min entre 9-12h et 14-18h
 */
const DEFAULT_SLOTS_30 = (() => {
  const out = [];
  for (let h = 9; h < 12; h++) out.push(`${pad(h)}:00`, `${pad(h)}:30`);
  for (let h = 14; h < 18; h++) out.push(`${pad(h)}:00`, `${pad(h)}:30`);
  return out;
})();

const DEFAULT_SLOTS_90 = (() => {
  // Créneaux de 90 min, 9-18h
  const out = [];
  for (let h = 9; h <= 16; h += 2) {
    if (h === 12 || h === 14) continue; // pause déjeuner
    out.push(`${pad(h)}:00`);
  }
  return out;
})();

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildBusinessDays(count) {
  const days = [];
  let d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // commencer demain
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function frenchDate(d) {
  const dn = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const mn = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  return `${dn[d.getDay()]} ${d.getDate()} ${mn[d.getMonth()]}`;
}

export function Calendar({
  value,
  onChange,
  daysAhead = 14,
  slots,
  slotDurationLabel = "30 min",
}) {
  const days = useMemo(() => buildBusinessDays(daysAhead), [daysAhead]);
  const slotList = slots ?? DEFAULT_SLOTS_30;

  const selectedDate = value?.date ?? null;
  const selectedTime = value?.time ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Day picker */}
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/50 mb-3">
          Choisissez un jour
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth">
          {days.map((d) => {
            const iso = isoDate(d);
            const active = selectedDate === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onChange({ date: iso, time: null })}
                className={cn(
                  "flex-shrink-0 px-4 py-3 rounded-md text-xs flex flex-col items-center gap-1 border transition-all min-w-[88px]",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-white/10 bg-[#1A1A1A] text-foreground/75 hover:border-white/30 hover:text-foreground"
                )}
              >
                <span className="text-foreground/60 text-[10px] uppercase tracking-wider">
                  {frenchDate(d).split(" ")[0]}
                </span>
                <span className="text-base font-medium">{d.getDate()}</span>
                <span className="text-[10px] text-foreground/50">
                  {frenchDate(d).split(" ")[2]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/50 mb-3">
            Créneaux disponibles · {slotDurationLabel}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {slotList.map((time) => {
              const active = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onChange({ date: selectedDate, time })}
                  className={cn(
                    "h-10 rounded-md text-sm border transition-all",
                    active
                      ? "border-accent bg-accent text-background"
                      : "border-white/10 bg-[#1A1A1A] text-foreground/85 hover:border-white/30"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { DEFAULT_SLOTS_30, DEFAULT_SLOTS_90, frenchDate };
