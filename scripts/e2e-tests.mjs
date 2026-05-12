/**
 * Tests end-to-end — flows happy path et intégrité des données.
 *
 * Complète scripts/security-tests.mjs (qui couvre les 5 scénarios sécu) avec
 * la vérification que les chemins métier marchent réellement de bout en bout :
 *
 *   S6.  Talent happy path  — Inscription → 8 tests à plein → finalize → score AI-Native
 *   S7.  B2B happy path     — POST inscription-b2b → 201 + reference + ligne en DB
 *   S8.  Complete-profile   — OTP → /api/auth/complete-profile → user_metadata persisté
 *   S9.  Contact form       — POST /api/contact → 200 + validation côté serveur
 *   S10. Admin redirect     — /dashboard côté admin → 307 /admin + zéro session fantôme
 *   S11. Contact persistence — POST /api/contact → ligne contact_messages tracée
 *                              (skip si migration 0005 pas appliquée)
 *
 * Usage :
 *   npm run dev    (ou un dev server actif sur http://localhost:3001)
 *   node scripts/e2e-tests.mjs    [--base=http://localhost:3001]
 *
 * Pré-requis : .env.local complet (Supabase URL / ANON_KEY / SERVICE_ROLE_KEY).
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ─── .env.local loader (sans dep) ──────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const raw = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  console.error("⚠️  .env.local introuvable — certains tests vont échouer.");
}

const argBase = process.argv.find((a) => a.startsWith("--base="));
const BASE = argBase ? argBase.slice(7) : (process.env.E2E_BASE || "http://localhost:3001");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
}

async function jfetch(jar, path, options = {}) {
  const headers = { ...(options.headers || {}), Cookie: jar.header() };
  const res = await fetch(BASE + path, { ...options, headers, redirect: "manual" });
  jar.put(res.headers.getSetCookie?.() || res.headers.get("set-cookie"));
  let body = null;
  try { body = await res.json(); } catch {}
  return { status: res.status, body, headers: res.headers };
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

/** Crée un Talent (inscription + OTP + start session). Retourne {jar, sessionId, userId, phone}. */
async function setupTalent(label) {
  const jar = new CookieJar();
  const phone = `+336${(Date.now() + Math.floor(Math.random() * 1000)).toString().slice(-8)}`;
  const email = `${label}-${Date.now()}@hid-e2e.local`;
  const payload = {
    prenom: label, nom: "E2E", email, telephone: phone,
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
  if (!r1.ok) throw new Error(`[${label}] inscription: ${r1.status}`);

  await jfetch(jar, "/api/auth/send-otp", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, branch: "specialist" }),
  });
  const r2 = await jfetch(jar, "/api/auth/verify-otp", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code: "000000", branch: "specialist" }),
  });
  if (r2.status !== 200) throw new Error(`[${label}] OTP: ${JSON.stringify(r2.body)}`);

  const r3 = await jfetch(jar, "/api/evaluation/start", { method: "POST" });
  if (r3.status !== 200 && r3.status !== 201) throw new Error(`[${label}] start`);

  const r4 = await jfetch(jar, "/api/evaluation/get-session");
  return {
    jar,
    sessionId: r4.body?.session?.id,
    userId: r4.body?.session?.user_id,
    phone,
    email,
  };
}

// ─── Bookkeeping ───────────────────────────────────────────────────────
const results = [];
function record(name, ok, details = "") {
  results.push({ name, ok, details });
  console.log(`${ok ? "✅" : "❌"} ${name}${details ? "  — " + details : ""}`);
}

// ─── S6 — Talent happy path ────────────────────────────────────────────
async function testTalentHappyPath() {
  console.log("\n— S6. Talent happy path — 8 tests réussis + finalize —");
  let user;
  try { user = await setupTalent("happy"); }
  catch (err) { record("S6. Setup", false, err.message); return; }

  // Patche tous les test_results en completed avec scores élevés (raccourci :
  // évite de réimplémenter les bonnes réponses des 8 tests, on teste juste
  // l'orchestration finalize → scoring AI-Native).
  const patch = await supabaseService(
    "PATCH",
    `test_results?session_id=eq.${user.sessionId}`,
    {
      body: JSON.stringify({
        status: "completed",
        score: 85,
        precision_rate: 0.85,
        time_spent_seconds: 1800,
        cases_processed: 50,
        raw_answers: {},
        completed_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
      }),
    }
  );
  if (!patch.ok) {
    record("S6a. Patch 8 tests completed (service-role)", false, `HTTP ${patch.status}`);
    return;
  }
  record("S6a. Patch 8 tests completed", true, "score=85 pour chaque");

  // Marque la session comme completed (prérequis de finalize)
  await supabaseService(
    "PATCH",
    `evaluation_sessions?id=eq.${user.sessionId}`,
    { body: JSON.stringify({ status: "completed", current_test_index: 7 }) }
  );

  const r = await jfetch(user.jar, "/api/evaluation/finalize", { method: "POST" });
  if (r.status !== 200) {
    record("S6b. POST /api/evaluation/finalize", false, `HTTP ${r.status} body=${JSON.stringify(r.body)}`);
    return;
  }
  record("S6b. POST /api/evaluation/finalize → 200", true);

  const score = r.body?.ai_native_score;
  // 85 × 5 (specialist avg) + 85 × 4 (engineer avg) = 425 + 340 = 765, + bonus 50+20 = 835
  const scoreOk = typeof score === "number" && score >= 600 && score <= 1000;
  record("S6c. ai_native_score calculé dans [600..1000]", scoreOk, `score=${score}`);

  const status = r.body?.session?.status;
  record("S6d. session.status='activated'", status === "activated", `status=${status}`);

  // Vérifie via service-role que la DB reflète bien l'état
  const verifyRes = await supabaseService(
    "GET",
    `evaluation_sessions?select=status,ai_native_score,activated_at&id=eq.${user.sessionId}`
  );
  const verifyRows = await verifyRes.json().catch(() => []);
  const row = Array.isArray(verifyRows) ? verifyRows[0] : null;
  record(
    "S6e. DB cohérente après finalize",
    row?.status === "activated" && row?.ai_native_score === score && Boolean(row?.activated_at),
    `db=${JSON.stringify(row)}`
  );
}

// ─── S7 — B2B inscription happy path ───────────────────────────────────
async function testB2bHappyPath() {
  console.log("\n— S7. B2B inscription happy path —");
  const payload = {
    raison_sociale: "Tech Innovate SARL",
    immatriculation: `RC-E2E-${Date.now()}`,
    pays: "Côte d'Ivoire",
    secteur: "industrie",
    signataire_prenom: "Marie",
    signataire_nom: "Kouassi",
    signataire_fonction: "DSI",
    signataire_email: `marie+${Date.now()}@e2e-tech.local`,
    signataire_tel: "+225 0700000001",
    volume: "500-1000",
    frequence: "mensuel",
    prestations: ["annotation", "fine-tuning"],
    typologies: ["texte", "image"],
    consent_rgpd: true,
  };
  const r = await fetch(BASE + "/api/inscription-b2b", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let body = null;
  try { body = await r.json(); } catch {}
  const ok = (r.status === 200 || r.status === 201) && body?.reference;
  record("S7a. POST inscription-b2b happy path → 200/201 + reference",
    ok, `HTTP ${r.status} ref=${body?.reference}`);
  if (!ok) return;

  // Verify DB row
  const ref = body.reference;
  const sel = await supabaseService(
    "GET",
    `inscriptions_b2b?select=raison_sociale,signataire_email,status,prestations&reference=eq.${encodeURIComponent(ref)}`
  );
  const rows = await sel.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  record(
    "S7b. Ligne persisée correctement en DB",
    row?.raison_sociale === payload.raison_sociale &&
      row?.signataire_email === payload.signataire_email &&
      Array.isArray(row?.prestations) && row.prestations.length === 2,
    `db=${JSON.stringify(row)}`
  );

  record(
    "S7c. Status initial='new'",
    row?.status === "new",
    `status=${row?.status}`
  );
}

// ─── S8 — Complete-profile (persistance user_metadata) ─────────────────
async function testCompleteProfile() {
  console.log("\n— S8. complete-profile — persistance user_metadata —");
  let user;
  try { user = await setupTalent("profile"); }
  catch (err) { record("S8. Setup", false, err.message); return; }

  const profile = {
    // Step 1
    firstName: "Profil",
    lastName: "Test",
    dob: "1990-01-01",
    country: "FR",
    city: "Lyon",
    // Step 2
    lastDiploma: "Master Informatique",
    institution: "Université de Lyon",
    graduationYear: 2018,
  };
  const r = await jfetch(user.jar, "/api/auth/complete-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch: "specialist", profile }),
  });
  if (r.status !== 200) {
    record("S8a. POST complete-profile → 200", false, `HTTP ${r.status} body=${JSON.stringify(r.body)}`);
    return;
  }
  record("S8a. POST complete-profile → 200", true, `completed_at=${r.body?.completed_at}`);

  // Verify user_metadata via service-role (admin API)
  const verify = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users/${user.userId}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE,
        Authorization: `Bearer ${SUPABASE_SERVICE}`,
      },
    }
  );
  const userRow = await verify.json().catch(() => null);
  const meta = userRow?.user_metadata || userRow?.raw_user_meta_data || {};
  record(
    "S8b. user_metadata.profile_completed=true",
    meta?.profile_completed === true,
    `meta keys=${Object.keys(meta).join(",")}`
  );
  record(
    "S8c. user_metadata.branch='specialist'",
    meta?.branch === "specialist",
    `branch=${meta?.branch}`
  );
  record(
    "S8d. user_metadata.profile contient les bons champs",
    meta?.profile?.firstName === "Profil" && meta?.profile?.city === "Lyon",
    `profile.firstName=${meta?.profile?.firstName}`
  );

  // Sans auth → 401
  const anon = await fetch(BASE + "/api/auth/complete-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch: "specialist", profile }),
  });
  record("S8e. POST sans auth → 401", anon.status === 401, `HTTP ${anon.status}`);
}

// ─── S9 — Contact form ─────────────────────────────────────────────────
async function testContactForm() {
  console.log("\n— S9. /api/contact — validation et envoi —");

  // Happy path
  const ok = await fetch(BASE + "/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "b2b",
      prenom: "Test",
      nom: "E2E",
      email: "test-e2e@example.com",
      sujet: "Test e2e",
      message: "Ce message test vérifie le bon fonctionnement de l'API contact.",
      consent_rgpd: true,
    }),
  });
  const okBody = await ok.json().catch(() => null);
  record("S9a. POST /api/contact happy path → 200 ok:true",
    ok.status === 200 && okBody?.ok === true, `HTTP ${ok.status} body=${JSON.stringify(okBody)}`);

  // Sans consent_rgpd → 400
  const noConsent = await fetch(BASE + "/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "b2b", prenom: "X", nom: "Y", email: "a@b.fr",
      sujet: "x", message: "Message minimum dix caractères.", consent_rgpd: false,
    }),
  });
  const nb = await noConsent.json().catch(() => null);
  record("S9b. Sans consent_rgpd → 400", noConsent.status === 400, `HTTP ${noConsent.status} ${nb?.error || ""}`);

  // Email invalide → 400
  const bad = await fetch(BASE + "/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "b2b", prenom: "X", nom: "Y", email: "not-an-email",
      sujet: "s", message: "Message minimum dix caractères.", consent_rgpd: true,
    }),
  });
  record("S9c. Email invalide → 400", bad.status === 400, `HTTP ${bad.status}`);

  // Honeypot rempli → 200 silencieux (spam piégé)
  const trap = await fetch(BASE + "/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "b2b", prenom: "Bot", nom: "Bot", email: "bot@bot.bot",
      sujet: "s", message: "Spam payload qui ne devrait jamais arriver.",
      consent_rgpd: true, website: "https://spammer.evil",
    }),
  });
  record("S9d. Honeypot rempli → 200 silencieux", trap.status === 200, `HTTP ${trap.status}`);
}

// ─── S11 — Contact persistence (DB) ────────────────────────────────────
async function testContactPersistence() {
  console.log("\n— S11. Contact form — persistance en DB —");

  // Sonde la table : si elle n'existe pas, skip avec un message clair
  const probe = await supabaseService("GET", "contact_messages?select=id&limit=1");
  if (probe.status === 404 || probe.status === 400) {
    record("S11. Migration 0005 appliquée ?", false,
      "SKIP — table contact_messages introuvable. Applique 0005_contact_messages.sql.");
    return;
  }

  const uniqueSubject = `e2e-${Date.now()}`;
  const r = await fetch(BASE + "/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "press",
      prenom: "E2E", nom: "Persist",
      email: "e2e-persist@example.com",
      telephone: "+33600000000",
      sujet: uniqueSubject,
      message: "Test de persistance en DB du message de contact (e2e).",
      consent_rgpd: true,
    }),
  });
  if (r.status !== 200) {
    record("S11a. POST /api/contact → 200", false, `HTTP ${r.status}`);
    return;
  }
  record("S11a. POST /api/contact → 200", true);

  const sel = await supabaseService(
    "GET",
    `contact_messages?select=type,prenom,nom,email,sujet,status,email_status,ip_address&sujet=eq.${encodeURIComponent(uniqueSubject)}`
  );
  const rows = await sel.json().catch(() => []);
  const row = Array.isArray(rows) ? rows[0] : null;
  record(
    "S11b. Ligne contact_messages créée",
    Boolean(row),
    `db=${JSON.stringify(row)?.slice(0, 200)}`
  );
  record("S11c. type='press' + status initial='new'",
    row?.type === "press" && row?.status === "new", `type=${row?.type} status=${row?.status}`);
  record("S11d. email_status ∈ {sent, skipped, failed}",
    ["sent", "skipped", "failed"].includes(row?.email_status),
    `email_status=${row?.email_status}`);
}

// ─── S10 — Admin redirect /dashboard → /admin ──────────────────────────
async function testAdminRedirect() {
  console.log("\n— S10. Admin /dashboard → /admin (zéro session fantôme) —");
  let user;
  try { user = await setupTalent("admin"); }
  catch (err) { record("S10. Setup", false, err.message); return; }

  // Promotion en admin via service-role
  const ins = await supabaseService("POST", "admin_users", {
    body: JSON.stringify({
      user_id: user.userId,
      email: user.email,
      role: "admin",
    }),
  });
  if (!ins.ok) {
    record("S10a. INSERT admin_users", false, `HTTP ${ins.status}`);
    return;
  }
  record("S10a. Promotion en admin", true);

  // Supprime la session pré-existante créée par /api/evaluation/start
  // (setupTalent l'a créée — on veut tester le scénario "1ère visite dashboard")
  await supabaseService(
    "DELETE",
    `evaluation_sessions?user_id=eq.${user.userId}`,
    { headers: { Prefer: "return=minimal" } }
  );

  // GET /dashboard en tant qu'admin → doit redirect vers /admin
  const r = await fetch(BASE + "/dashboard", {
    redirect: "manual",
    headers: { Cookie: user.jar.header() },
  });
  const loc = r.headers.get("location") || "";
  record(
    "S10b. GET /dashboard en admin → 307 /admin",
    r.status >= 300 && r.status < 400 && loc.endsWith("/admin"),
    `HTTP ${r.status} Location=${loc}`
  );

  // Vérifie qu'AUCUNE evaluation_session n'a été créée par cet appel
  const sel = await supabaseService(
    "GET",
    `evaluation_sessions?select=id&user_id=eq.${user.userId}`
  );
  const rows = await sel.json().catch(() => []);
  record(
    "S10c. Aucune session fantôme créée pour l'admin",
    Array.isArray(rows) && rows.length === 0,
    `sessions=${JSON.stringify(rows)}`
  );
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🧪 E2E tests — base=${BASE}\n`);

  try { await fetch(BASE + "/", { method: "HEAD" }); }
  catch { console.error(`💥 Dev server injoignable sur ${BASE}`); process.exit(2); }

  await testTalentHappyPath();
  await testB2bHappyPath();
  await testCompleteProfile();
  await testContactForm();
  await testAdminRedirect();
  await testContactPersistence();

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
