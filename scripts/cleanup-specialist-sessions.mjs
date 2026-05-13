/**
 * Cleanup one-shot : retire les 4 tests engineer des sessions qui ont 8 tests
 * alors que le candidat a metier='specialist' dans son inscription.
 *
 * Conséquence d'un bug d'ancienne version où le match email auth ↔ inscription
 * était case-sensitive — le code retombait sur le fallback metier='engineer'
 * et insérait 8 tests au lieu de 4.
 *
 * Filtres de sécurité :
 *  - Ne touche QUE les test_results test_category='engineer'
 *  - Ne supprime QUE les lignes status='locked' (= pas commencées)
 *  - Vérifie que l'inscription liée (par email case-insensitive) a bien metier='specialist'
 *
 * Usage : node scripts/cleanup-specialist-sessions.mjs
 */

import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function rest(method, path, init = {}) {
  const r = await fetch(`${SUPA}/rest/v1/${path}`, {
    method,
    headers: { ...headers, ...(init.headers || {}) },
    body: init.body,
  });
  return r;
}

async function adminAuth(method, path) {
  const r = await fetch(`${SUPA}/auth/v1/admin/${path}`, {
    method,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  return r;
}

console.log("🧹 Cleanup sessions Specialist avec 8 tests\n");

// 1. Liste toutes les sessions actives + leur user_id
const sessRes = await rest("GET", "evaluation_sessions?select=id,user_id&status=in.(pending,in_progress,completed)");
const sessions = await sessRes.json();
console.log(`Trouvé ${sessions.length} sessions actives`);

// 2. Liste tous les users auth
const usersRes = await adminAuth("GET", "users?per_page=1000");
const users = (await usersRes.json()).users || [];
const userById = new Map(users.map((u) => [u.id, u]));

// 3. Liste toutes les inscriptions talents avec metier
const inscRes = await rest("GET", "inscriptions_talents?select=email,metier");
const inscriptions = await inscRes.json();
const metierByEmail = new Map(
  inscriptions.map((i) => [(i.email || "").toLowerCase(), i.metier])
);

let cleaned = 0;
let skipped = 0;

for (const s of sessions) {
  const u = userById.get(s.user_id);
  if (!u || !u.email) { skipped++; continue; }
  const metier = metierByEmail.get(u.email.toLowerCase());
  if (metier !== "specialist") { skipped++; continue; }

  // Vérifie nombre de tests + état des engineer
  const trRes = await rest("GET", `test_results?select=id,test_category,status&session_id=eq.${s.id}`);
  const tests = await trRes.json();
  if (!Array.isArray(tests) || tests.length !== 8) { skipped++; continue; }

  const engineerTests = tests.filter((t) => t.test_category === "engineer");
  const allLocked = engineerTests.every((t) => t.status === "locked");
  if (!allLocked || engineerTests.length !== 4) {
    console.log(`  ⏭️  session ${s.id.slice(0, 8)} (${u.email}) : tests engineer non tous locked, skip`);
    skipped++;
    continue;
  }

  // Delete les 4 engineer locked
  const delRes = await rest(
    "DELETE",
    `test_results?session_id=eq.${s.id}&test_category=eq.engineer&status=eq.locked`,
    { headers: { Prefer: "return=minimal" } }
  );
  if (delRes.ok) {
    cleaned++;
    console.log(`  ✅ ${u.email} : 4 tests engineer supprimés (session ${s.id.slice(0, 8)})`);
  } else {
    skipped++;
    console.log(`  ❌ ${u.email} : erreur ${delRes.status}`);
  }
}

console.log(`\n${cleaned} sessions nettoyées · ${skipped} skipped`);
