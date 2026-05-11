/**
 * CSV utilities — RFC 4180 minimal mais robuste.
 */

export function csvEscape(value) {
  if (value == null) return "";
  let s = String(value);
  // Si la valeur contient un délimiteur, retour ligne, ou guillemets, on quote
  // et on échappe les guillemets internes en les doublant.
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    s = `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => csvEscape(typeof c.value === "function" ? c.value(r) : r[c.value]))
      .join(",")
  );
  // BOM UTF-8 pour qu'Excel ouvre correctement les accents.
  return "﻿" + [header, ...lines].join("\n");
}

export function csvHeaders(filename) {
  return {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  };
}
