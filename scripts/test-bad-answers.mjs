/**
 * Test négatif : pour chaque test, on soumet de mauvaises réponses
 * et on vérifie :
 *  1. Le score est bas (< 30/100 attendu sur la plupart, < 50 sur ceux où
 *     même un mauvais candidat peut grappiller des points par chance).
 *  2. Le test est marqué `passed: false`.
 *  3. Le test suivant n'est PAS débloqué (`unlockedNext: false`).
 *
 * Usage :  node scripts/test-bad-answers.mjs
 */

const BASE = "http://localhost:3001";
const phone = `+336${Date.now().toString().slice(-8)}`; // unique
const email = `bad-${Date.now()}@hid-e2e.local`;

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }
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
  header() {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }
}

const jar = new CookieJar();

async function jfetch(path, options = {}) {
  const headers = { ...(options.headers || {}), Cookie: jar.header() };
  const res = await fetch(BASE + path, { ...options, headers, redirect: "manual" });
  jar.put(res.headers.getSetCookie?.() || res.headers.get("set-cookie"));
  let body;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body };
}

// ─── Setup : inscription + session ─────────────────────────────────────
async function setupSession() {
  // Inscription
  const payload = {
    prenom: "Bad", nom: "Candidate", email, telephone: phone,
    date_naissance: "2000-01-01", pays: "France", ville: "Paris",
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
  if (!r1.ok) throw new Error("Inscription failed");

  // OTP bypass
  await jfetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, branch: "specialist" }),
  });
  const r2 = await jfetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code: "000000", branch: "specialist" }),
  });
  if (r2.status !== 200) throw new Error("OTP bypass failed: " + JSON.stringify(r2.body));

  // Start session
  const r3 = await jfetch("/api/evaluation/start", { method: "POST" });
  if (r3.status !== 200 && r3.status !== 201) throw new Error("Start failed");
}

// ─── Submission helper ─────────────────────────────────────────────────
async function submit(slug, raw_answers) {
  return jfetch("/api/evaluation/submit-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_slug: slug, raw_answers, time_spent_seconds: 100 }),
  });
}

// ─── Mauvaises réponses par test ───────────────────────────────────────
const BAD_INPUTS = {
  "computer-vision": { boxes: {} },
  "nlp-sentiment": {
    answers: Array.from({ length: 15 }, (_, i) => ({
      id: `s-${String(i + 1).padStart(2, "0")}`,
      sentiment: "neutre", urgence: "basse", categorie: "commercial",
    })),
  },
  "rlhf": {
    answers: Array.from({ length: 10 }, (_, i) => ({
      id: `r-${String(i + 1).padStart(2, "0")}`,
      choice: "A", justification: "test",
    })),
  },
  "data-cleaning": { rows: {} },
  "nlp-finetuning": {
    quiz: Array.from({ length: 10 }, (_, i) => ({ id: `q-${String(i + 1).padStart(2, "0")}`, choice: "A" })),
    jsonl: ["not json", "still not json", "{", "{{}}", ""],
  },
  "vision-edge": {
    quiz: Array.from({ length: 10 }, (_, i) => ({ id: `q-${String(i + 1).padStart(2, "0")}`, choice: "A" })),
    calc: { size_mb: 999, fps: 999, justification: "" },
  },
  "mlops": {
    quiz: Array.from({ length: 10 }, (_, i) => ({ id: `q-${String(i + 1).padStart(2, "0")}`, choice: "A" })),
    architecture_order: ["deployment", "registry", "evaluation", "training", "features", "validation", "versioning", "ingestion"],
  },
  "rag": {
    quiz: Array.from({ length: 10 }, (_, i) => ({ id: `q-${String(i + 1).padStart(2, "0")}`, choice: "A" })),
    hybrid_weight: 0,
  },
};

const EXPECTED_BAD_MAX = 50; // tous les tests doivent retourner score <= 50 avec mauvaises réponses
let allPassed = true;
let reachedSlugs = [];

async function main() {
  console.log("\n🧪 Test NÉGATIF — mauvaises réponses\n");
  console.log(`Phone: ${phone}\n`);

  await setupSession();
  console.log("✅ Setup OK\n");

  const slugs = Object.keys(BAD_INPUTS);
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const r = await submit(slug, BAD_INPUTS[slug]);
    if (r.status === 403 && r.body?.error?.includes("locked")) {
      // Le test n'est pas débloqué (parce que le précédent a échoué)
      console.log(`🔒 [${slug}] verrouillé (test précédent non validé) — comportement attendu ✅`);
      break;
    }
    if (r.status !== 200) {
      console.log(`❌ [${slug}] HTTP ${r.status}: ${JSON.stringify(r.body)}`);
      allPassed = false;
      break;
    }
    const { score, passed, unlockedNext } = r.body.result;
    reachedSlugs.push(slug);
    const scoreOk = score <= EXPECTED_BAD_MAX;
    const failedOk = passed === false;
    const lockedOk = unlockedNext === false;
    const ok = scoreOk && failedOk && lockedOk;
    if (!ok) allPassed = false;
    console.log(
      `${ok ? "✅" : "❌"} [${slug}] score=${score} passed=${passed} unlockedNext=${unlockedNext}` +
      `${!scoreOk ? " — SCORE TROP HAUT (>50)" : ""}` +
      `${!failedOk ? " — passed devrait être false" : ""}` +
      `${!lockedOk ? " — unlockedNext devrait être false" : ""}`
    );
  }

  // Vérification : seul le 1er test devrait avoir été soumis (les autres restent locked)
  if (reachedSlugs.length > 1) {
    console.log(
      `\n⚠️  ${reachedSlugs.length} tests ont été soumis — normalement après le 1er échec, ` +
      `le suivant devrait être locked. Le 2e test n'aurait pas dû être atteint.`
    );
    allPassed = false;
  }

  console.log(`\n${allPassed ? "🎉 Tous les checks OK" : "💥 Échec — score(s) ou flag(s) incohérent(s)"}\n`);
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("\n💥 Erreur inattendue :", err.message);
  process.exit(1);
});
