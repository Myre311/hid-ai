/**
 * Tests de sécurité — couverture des 5 scénarios documentés dans SECURITY_TESTS.md.
 *
 *   S1. RLS isolation  — User B ne peut pas lire les données de User A.
 *   S2. Test verrouillé — POST /api/evaluation/submit-test sur un test `locked` → 403.
 *   S3. Garde admin    — page /admin/* et API /api/admin/* exigent admin_users.
 *   S4. Injection      — XSS / SQL inline dans champs texte (inscription-b2b) sont
 *                        stockés littéralement, jamais exécutés.
 *   S5. Re-submit 409  — soumettre un test déjà passé renvoie 409 (no retry).
 *
 * Usage :
 *   1. Lance le dev server :  npm run dev  (par défaut http://localhost:3001)
 *   2. node scripts/security-tests.mjs    [--base=http://localhost:3001]
 *
 * Pré-requis : .env.local complet (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY /
 * SUPABASE_SERVICE_ROLE_KEY). Le script charge .env.local sans dépendance.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ─── .env.local loader (zéro dépendance) ───────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  console.error(`⚠️  Impossible de lire ${envPath} — les tests qui touchent Supabase échoueront.`);
}

const argBase = process.argv.find((a) => a.startsWith("--base="));
const BASE = argBase ? argBase.slice(7) : (process.env.SECURITY_TESTS_BASE || "http://localhost:3001");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Helpers ───────────────────────────────────────────────────────────
class CookieJar {
  constructor() { this.cookies = new Map(); }
  put(setCookieHeader) {
    if (!setCookieHeader) return;
    const raw = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    for (const c of raw) {
      const [pair] = c.split(";");
      const eq = pair.indexOf("=");
      if (eq < 0) continue;
      this.cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
    }
  }
  header() { return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; "); }
  /**
   * Extrait l'access_token Supabase depuis le cookie `sb-<ref>-auth-token[.N]`.
   * @supabase/ssr 0.10 stocke un base64 ou plusieurs chunks `sb-…-auth-token.0/.1`.
   */
  accessToken() {
    const chunks = [...this.cookies.entries()]
      .filter(([k]) => /^sb-.+-auth-token(\.\d+)?$/.test(k))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => decodeURIComponent(v));
    if (chunks.length === 0) return null;
    let joined = chunks.join("");
    if (joined.startsWith("base64-")) {
      try { joined = Buffer.from(joined.slice(7), "base64").toString("utf8"); }
      catch { return null; }
    }
    try {
      const parsed = JSON.parse(joined);
      return parsed.access_token || parsed?.currentSession?.access_token || null;
    } catch { return null; }
  }
}

async function jfetch(jar, path, options = {}) {
  const headers = { ...(options.headers || {}), Cookie: jar.header() };
  const res = await fetch(BASE + path, { ...options, headers, redirect: "manual" });
  jar.put(res.headers.getSetCookie?.() || res.headers.get("set-cookie"));
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body, headers: res.headers };
}

/** Inscrit un talent + complete OTP bypass + crée une session. Retourne le jar + user_id. */
async function setupTalent(label) {
  const jar = new CookieJar();
  const phone = `+336${(Date.now() + Math.floor(Math.random() * 1000)).toString().slice(-8)}`;
  const email = `${label}-${Date.now()}@hid-sec.local`;

  const payload = {
    prenom: label, nom: "Sec", email, telephone: phone,
    date_naissance: "1995-06-15", pays: "France", ville: "Paris",
    metier: "specialist", niveau_etudes: "bac+3", competences: [],
    doc_type: "passeport",
    modules: { ecosysteme: "valide", securite: "valide", orientation: "valide" },
    domaine: "annotation",
    creneau_test: { date: "2026-05-20", time: "10:00" },
    prerequis: ["internet", "webcam", "calme", "camera"],
    consent_cgu: true, consent_rgpd: true, consent_ethique: true,
  };
  const fd = new FormData();
  fd.append("payload", JSON.stringify(payload));
  const blob = new Blob([Uint8Array.from([0x89, 0x50])], { type: "image/png" });
  fd.append("doc_recto", blob, "r.png");
  fd.append("selfie", blob, "s.png");
  const r1 = await fetch(BASE + "/api/inscription-talent", { method: "POST", body: fd });
  if (!r1.ok) throw new Error(`[${label}] inscription failed: ${r1.status}`);

  await jfetch(jar, "/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, branch: "specialist" }),
  });
  const r2 = await jfetch(jar, "/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code: "000000", branch: "specialist" }),
  });
  if (r2.status !== 200) throw new Error(`[${label}] OTP failed: ${JSON.stringify(r2.body)}`);

  const r3 = await jfetch(jar, "/api/evaluation/start", { method: "POST" });
  if (r3.status !== 200 && r3.status !== 201) throw new Error(`[${label}] start failed`);

  const r4 = await jfetch(jar, "/api/evaluation/get-session");
  const sessionId = r4.body?.session?.id;
  const userId = r4.body?.session?.user_id;
  if (!sessionId) throw new Error(`[${label}] no session id`);

  return { jar, sessionId, userId, phone };
}

/** Direct Supabase REST query as a given JWT — bypassable only by RLS policies. */
async function supabaseSelectAs(token, table, query = "select=*") {
  if (!token || !SUPABASE_URL || !SUPABASE_ANON) return { status: 0, rows: null };
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${token}`,
    },
  });
  let rows = null;
  try { rows = await r.json(); } catch {}
  return { status: r.status, rows };
}

async function supabaseService(method, path, init = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE) throw new Error("Missing Supabase service creds");
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE,
      Authorization: `Bearer ${SUPABASE_SERVICE}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
}

// ─── Test results bookkeeping ──────────────────────────────────────────
const results = [];
function record(name, ok, details = "") {
  results.push({ name, ok, details });
  console.log(`${ok ? "✅" : "❌"} ${name}${details ? "  — " + details : ""}`);
}

// ─── S1 — RLS isolation ────────────────────────────────────────────────
async function testRlsIsolation() {
  console.log("\n— S1. RLS isolation (User B ne lit pas les données de User A) —");
  let userA, userB;
  try {
    userA = await setupTalent("usrA");
    userB = await setupTalent("usrB");
  } catch (err) {
    record("S1. Setup deux users", false, err.message);
    return;
  }
  record("S1. Setup deux users distincts", userA.userId !== userB.userId,
    `A=${userA.userId?.slice(0, 8)} B=${userB.userId?.slice(0, 8)}`);

  // Récupère le JWT de B
  const tokenB = userB.jar.accessToken();
  if (!tokenB) {
    record("S1. Extraction du JWT de B", false, "cookie sb-…-auth-token introuvable");
    return;
  }

  // 1) B ne doit voir que SA propre evaluation_session
  const sessions = await supabaseSelectAs(tokenB, "evaluation_sessions", "select=id,user_id");
  if (sessions.status !== 200) {
    record("S1a. SELECT evaluation_sessions as B", false, `HTTP ${sessions.status}: ${JSON.stringify(sessions.rows)}`);
  } else {
    const ids = (sessions.rows || []).map((r) => r.user_id);
    const onlyB = ids.length > 0 && ids.every((id) => id === userB.userId);
    record("S1a. SELECT evaluation_sessions as B", onlyB,
      `${sessions.rows.length} rows, user_ids unique=${[...new Set(ids)].length}`);
  }

  // 2) B essaie explicitement de lire la session de A par id → doit retourner []
  const targeted = await supabaseSelectAs(
    tokenB, "evaluation_sessions",
    `select=id,user_id&id=eq.${userA.sessionId}`
  );
  const blocked = Array.isArray(targeted.rows) && targeted.rows.length === 0;
  record("S1b. SELECT session de A par id (en tant que B)", blocked,
    `HTTP ${targeted.status}, rows=${JSON.stringify(targeted.rows)}`);

  // 3) test_results : B ne voit aucun résultat de A
  const tr = await supabaseSelectAs(tokenB, "test_results", "select=id,session_id");
  if (tr.status !== 200) {
    record("S1c. SELECT test_results as B", false, `HTTP ${tr.status}`);
  } else {
    const fromA = (tr.rows || []).some((r) => r.session_id === userA.sessionId);
    record("S1c. SELECT test_results as B (aucun de A)", !fromA, `${tr.rows.length} rows`);
  }
}

// ─── S2 — Test verrouillé → 403 ────────────────────────────────────────
async function testLockedReturns403() {
  console.log("\n— S2. POST /api/evaluation/submit-test sur test verrouillé → 403 —");
  let user;
  try {
    user = await setupTalent("locked");
  } catch (err) {
    record("S2. Setup", false, err.message);
    return;
  }
  // 'rag' = test_order 7, locked au démarrage (seul 'computer-vision' = order 0 est available)
  const r = await jfetch(user.jar, "/api/evaluation/submit-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_slug: "rag", raw_answers: {}, time_spent_seconds: 1 }),
  });
  const ok = r.status === 403 && /lock/i.test(r.body?.error || "");
  record("S2. Submit 'rag' (locked) → 403", ok, `HTTP ${r.status} body=${JSON.stringify(r.body)}`);
}

// ─── S3 — Garde /admin/* + /api/admin/* ────────────────────────────────
async function testAdminGuards() {
  console.log("\n— S3. Garde admin (page + API) —");

  // 3a. Anon GET /admin/entreprises → 307 vers /login
  const anonRes = await fetch(BASE + "/admin/entreprises", { redirect: "manual" });
  const anonLoc = anonRes.headers.get("location") || "";
  const okAnon = anonRes.status >= 300 && anonRes.status < 400 && anonLoc.includes("/login");
  record("S3a. /admin/entreprises sans auth → redirect /login", okAnon, `HTTP ${anonRes.status}, Location=${anonLoc}`);

  // 3b. Authenticated non-admin GET /admin/entreprises → 307 vers /?error=admin-required
  let user;
  try { user = await setupTalent("nonadm"); }
  catch (err) { record("S3b. Setup non-admin", false, err.message); return; }
  const nonAdminRes = await fetch(BASE + "/admin/entreprises", {
    redirect: "manual",
    headers: { Cookie: user.jar.header() },
  });
  const nonAdminLoc = nonAdminRes.headers.get("location") || "";
  const okNonAdm = nonAdminRes.status >= 300 && nonAdminRes.status < 400 && nonAdminLoc.includes("admin-required");
  record("S3b. /admin/* en tant que non-admin → redirect ?error=admin-required",
    okNonAdm, `HTTP ${nonAdminRes.status}, Location=${nonAdminLoc}`);

  // 3c. /api/admin/b2b/<fake-uuid> en non-admin → 403
  const apiNonAdm = await jfetch(user.jar, "/api/admin/b2b/00000000-0000-0000-0000-000000000000", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "won" }),
  });
  record("S3c. PATCH /api/admin/b2b/:id en non-admin → 403",
    apiNonAdm.status === 403, `HTTP ${apiNonAdm.status} body=${JSON.stringify(apiNonAdm.body)}`);

  // 3d. Idem sans auth → 401
  const apiAnon = await fetch(BASE + "/api/admin/b2b/00000000-0000-0000-0000-000000000000", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "won" }),
  });
  record("S3d. PATCH /api/admin/b2b/:id sans auth → 401",
    apiAnon.status === 401, `HTTP ${apiAnon.status}`);
}

// ─── S4 — SQL / XSS injection ─────────────────────────────────────────
async function testInjection() {
  console.log("\n— S4. Injection SQL / XSS sur champs texte (inscription-b2b) —");

  const evilName = `<script>alert('xss')</script>'); DROP TABLE inscriptions_b2b; --`;
  const payload = {
    raison_sociale: evilName,
    immatriculation: "RC-XX-INJECT-001",
    pays: "Côte d'Ivoire",
    secteur: "industrie",
    signataire_prenom: "Eve",
    signataire_nom: "Tester",
    signataire_fonction: "RH",
    signataire_email: `eve+${Date.now()}@hid-sec.local`,
    signataire_tel: "+225 0700000000",
    volume: "100-500",
    frequence: "ponctuel",
    prestations: ["annotation"],
    typologies: ["texte"],
    consent_rgpd: true,
  };
  const r = await fetch(BASE + "/api/inscription-b2b", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let body = null;
  try { body = await r.json(); } catch {}
  record("S4a. POST inscription-b2b avec payload malicieux → 200/201",
    r.status === 200 || r.status === 201, `HTTP ${r.status} body=${JSON.stringify(body)?.slice(0, 120)}`);
  const ref = body?.reference;
  if (!ref) { record("S4. Pas de référence retournée", false, "skip suite"); return; }

  // Service role : la ligne existe avec raison_sociale stockée VERBATIM
  const sel = await supabaseService(
    "GET",
    `inscriptions_b2b?select=raison_sociale,reference&reference=eq.${encodeURIComponent(ref)}`,
  );
  let rows = null; try { rows = await sel.json(); } catch {}
  const stored = rows?.[0]?.raison_sociale;
  record("S4b. Payload stocké verbatim (string non exécutée)",
    stored === evilName,
    `stored=${JSON.stringify(stored)?.slice(0, 80)} expected=${JSON.stringify(evilName)?.slice(0, 80)}`);

  // La table existe toujours (count > 0)
  const cnt = await supabaseService(
    "GET", "inscriptions_b2b?select=id&limit=1",
    { headers: { Prefer: "count=exact" } },
  );
  const total = Number((cnt.headers.get("content-range") || "0-0/0").split("/")[1]) || 0;
  record("S4c. Table inscriptions_b2b non droppée", total > 0, `count=${total}`);
}

// ─── S5 — Re-submit d'un test passé → 409 ──────────────────────────────
async function testResubmitConflict() {
  console.log("\n— S5. Re-submit d'un test passé → 409 —");
  let user;
  try { user = await setupTalent("resub"); }
  catch (err) { record("S5. Setup", false, err.message); return; }

  // Patche directement test_results (service role) : test 'computer-vision' = completed + score 100.
  // C'est plus déterministe que de jouer le scoring réel.
  const patch = await supabaseService(
    "PATCH",
    `test_results?session_id=eq.${user.sessionId}&test_slug=eq.computer-vision`,
    { body: JSON.stringify({ status: "completed", score: 100, completed_at: new Date().toISOString() }) },
  );
  if (!patch.ok) {
    record("S5. PATCH service-role pour marquer test passé", false, `HTTP ${patch.status}`);
    return;
  }

  const r = await jfetch(user.jar, "/api/evaluation/submit-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_slug: "computer-vision", raw_answers: { boxes: {} }, time_spent_seconds: 5 }),
  });
  const ok = r.status === 409 && /already passed/i.test(r.body?.error || "");
  record("S5. Re-submit test passé → 409", ok, `HTTP ${r.status} body=${JSON.stringify(r.body)}`);
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔒 Security tests — base=${BASE}\n`);
  if (!SUPABASE_URL) console.log("⚠️  NEXT_PUBLIC_SUPABASE_URL manquant — S1/S4/S5 partiels.\n");

  // Sanity ping
  try { await fetch(BASE + "/", { method: "HEAD" }); }
  catch { console.error(`💥 Dev server injoignable sur ${BASE}. Lance "npm run dev" d'abord.`); process.exit(2); }

  await testRlsIsolation();
  await testLockedReturns403();
  await testAdminGuards();
  await testInjection();
  await testResubmitConflict();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Résultat : ${results.length - failed.length}/${results.length} OK`);
  if (failed.length) {
    console.log(`\nÉchecs :`);
    for (const f of failed) console.log(`  ❌ ${f.name} — ${f.details}`);
  }
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("\n💥 Erreur inattendue :", err);
  process.exit(1);
});
