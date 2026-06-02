#!/usr/bin/env node
/**
 * Bulk finalize : pour chaque session non activée dont tous les tests sont
 * `completed`, calcule l'ai_native_score via la formule officielle et marque
 * la session `status = 'activated'`.
 *
 * Usage : node scripts/bulk-finalize-sessions.mjs [--dry-run]
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { calculateAiNativeScore } from "../lib/evaluation/aiNativeScore.js";

if (typeof globalThis.WebSocket === "undefined") globalThis.WebSocket = ws;

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const raw = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {}

const DRY = process.argv.includes("--dry-run");
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { params: { eventsPerSecond: 0 } },
    global: { headers: { "X-Client-Info": "bulk-finalize-script" } },
  }
);

// 1) Liste les sessions candidates
const { data: sessions } = await sb
  .from("evaluation_sessions")
  .select("id, user_id, status, ai_native_score, inscription_talent_id")
  .neq("status", "activated");

console.log(`Sessions candidates: ${sessions.length}`);

let activated = 0;
let skipped = 0;
let errors = 0;

for (const s of sessions) {
  // Charge les tests
  const { data: tests } = await sb
    .from("test_results")
    .select("*")
    .eq("session_id", s.id)
    .order("test_order");

  const all = tests || [];
  const expected = all.length; // peut être 4 (specialist) ou 8 (engineer)
  const completed = all.filter((t) => t.status === "completed").length;

  if (expected !== 4 && expected !== 8) {
    console.log(`  ⏭️  ${s.id.slice(0, 8)} : ${expected} tests (ni 4 ni 8) — skip`);
    skipped++;
    continue;
  }
  if (completed !== expected) {
    console.log(`  ⏭️  ${s.id.slice(0, 8)} : ${completed}/${expected} completed — skip`);
    skipped++;
    continue;
  }

  // Calcul score
  let score;
  try {
    score = calculateAiNativeScore(all);
  } catch (e) {
    console.log(`  ❌ ${s.id.slice(0, 8)} : score error: ${e.message}`);
    errors++;
    continue;
  }

  if (DRY) {
    console.log(`  🧪 [DRY] ${s.id.slice(0, 8)} : ${completed}/${expected} → score=${score}`);
    activated++;
    continue;
  }

  const { error } = await sb
    .from("evaluation_sessions")
    .update({
      status: "activated",
      ai_native_score: score,
      activated_at: new Date().toISOString(),
    })
    .eq("id", s.id);

  if (error) {
    console.log(`  ❌ ${s.id.slice(0, 8)} : UPDATE error: ${error.message}`);
    errors++;
  } else {
    console.log(`  ✅ ${s.id.slice(0, 8)} : activée, score=${score}`);
    activated++;
  }
}

console.log(`\n📊 ${activated} activées, ${skipped} skip, ${errors} erreurs${DRY ? " (DRY RUN)" : ""}`);
