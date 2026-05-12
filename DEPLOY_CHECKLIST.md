# Deploy checklist — HID AI

> Tout ce qui ne peut pas être fait depuis le code et qui dépend d'une action manuelle (DB Supabase, Vercel, Resend, Twilio, Sentry). Suis dans l'ordre — chaque étape débloque la suivante.

## ✅ État au 12 mai 2026

Côté **code** : tout est prêt. Cinq pages légales, contact, cookie banner, Sentry scaffold, sitemap/robots/OG image, 50 frames CV tracking réalistes, quiz Talent Step 3, complete-profile persiste désormais dans `user_metadata`. Tests sécurité 13/13 ✅.

Côté **infrastructure** : 6 étapes ci-dessous.

---

## 1. Supabase — migration `0004_admin.sql`

**Pourquoi** : sans la table `admin_users`, le middleware bloque tout accès à `/admin/*`.

**Action** : Supabase Dashboard → SQL Editor → coller :

```sql
-- Migration 0004 — Dashboard admin
create table if not exists public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text not null unique,
  role        text not null default 'admin'
                check (role in ('admin', 'super_admin')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_admin_users_user_id on public.admin_users (user_id);

alter table public.admin_users enable row level security;

drop policy if exists "admin_select_self" on public.admin_users;
create policy "admin_select_self"
  on public.admin_users for select
  using (auth.uid() = user_id);

drop policy if exists "super_admin_all" on public.admin_users;
create policy "super_admin_all"
  on public.admin_users for all
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role = 'super_admin'
    )
  );
```

**Vérification** : `select count(*) from public.admin_users;` → renvoie `0` (table créée, vide).

---

## 2. Supabase — Bootstrap super_admin

**Pourquoi** : tant qu'aucune ligne n'est dans `admin_users`, **personne** ne peut accéder à `/admin/*`.

**Action** :
1. Connecte-toi une fois sur https://hid-ai.com/login (ou local) pour créer ton compte `auth.users`.
2. Dans Supabase SQL Editor :

```sql
-- 1. Récupère ton UUID
select id, email, phone from auth.users
where email = 'mark@hidea-solution.fr' or phone like '+33627678931';

-- 2. Insère-toi comme super_admin (remplace <UUID>)
insert into public.admin_users (user_id, email, role)
values ('<UUID>', 'mark@hidea-solution.fr', 'super_admin');

-- Optionnel : Lucien aussi
-- insert into public.admin_users (user_id, email, role) values ('<UUID-LUCIEN>', 'lucien@hidea-solution.fr', 'super_admin');
```

**Vérification** : navigue sur `/admin` connecté → tu vois le dashboard, pas la redirect.

---

## 3. Vercel — Variables d'environnement

**Action** : Vercel Dashboard → Project → Settings → Environment Variables. Ajoute en **Production + Preview + Development** :

| Variable | Valeur | Critique ? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (copier depuis `.env.local`) | 🔴 oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem | 🔴 oui |
| `SUPABASE_SERVICE_ROLE_KEY` | idem **— Secret, sensible** | 🔴 oui |
| `NEXT_PUBLIC_APP_URL` | `https://hid-ai.com` (ou `https://hid-ai.vercel.app`) | 🔴 oui (emails + OG) |
| `RESEND_API_KEY` | `re_xxx` (étape 4) | 🟧 sinon emails muets |
| `RESEND_FROM_EMAIL` | `noreply@hid-ai.com` | 🟧 idem |
| `CONTACT_TO_EMAIL` | `contact@hidea-solution.fr` (ou autre) | 🟨 sinon défaut OK |
| `SMS_PROVIDER` | `twilio` en prod | 🟧 sinon dev bypass `000000` |
| `TWILIO_ACCOUNT_SID` | (étape 5) | 🟧 |
| `TWILIO_AUTH_TOKEN` | (étape 5) | 🟧 |
| `TWILIO_PHONE_NUMBER` | (étape 5) | 🟧 |
| `NEXT_PUBLIC_SENTRY_DSN` | (étape 6) | 🟨 sinon Sentry inerte |
| `SENTRY_DSN` | (étape 6) | 🟨 |
| `SENTRY_ORG` | (étape 6) | 🟨 source maps uniquement |
| `SENTRY_PROJECT` | (étape 6) | 🟨 |
| `SENTRY_AUTH_TOKEN` | (étape 6) **— Secret** | 🟨 |
| `NEXT_PUBLIC_SOCIAL_LINKEDIN` | URL réelle du compte HID AI | 🟩 sinon icône cachée |
| `NEXT_PUBLIC_SOCIAL_X` | idem | 🟩 |
| `NEXT_PUBLIC_SOCIAL_GITHUB` | idem | 🟩 |

**Note `NODE_ENV`** : ne pas le définir manuellement, Vercel le force à `production` en prod. C'est ce qui désactive automatiquement le dev bypass OTP `000000` (`app/api/auth/verify-otp/route.js:142`).

---

## 4. Resend — Configurer le domaine `hid-ai.com`

**Pourquoi** : sans ça, les emails de contact + activation talent ne partent pas (le code log "RESEND_API_KEY missing" sans crasher — `lib/email/resend.js:12-23`).

**Action** :
1. Créer un compte gratuit sur https://resend.com
2. Domains → Add domain `hid-ai.com`
3. Resend te donne 3-4 enregistrements DNS à ajouter chez ton registrar :
   - `MX` (priority 10) → `feedback-smtp.eu-west-1.amazonses.com`
   - `TXT` SPF → `v=spf1 include:amazonses.com ~all`
   - `TXT` DKIM → fourni par Resend (long)
   - `TXT` DMARC (optionnel) → `v=DMARC1; p=none;`
4. Click "Verify DNS" jusqu'au statut **Verified** (parfois 1-30 min de propagation).
5. API Keys → Create API Key → copie dans Vercel (`RESEND_API_KEY`).
6. Vercel : `RESEND_FROM_EMAIL=noreply@hid-ai.com` (ou `onboarding@hid-ai.com`).

**Test** : envoie un message via `/contact` → reçu sur `CONTACT_TO_EMAIL`.

---

## 5. Twilio — SMS OTP en production

**Pourquoi** : tant que `SMS_PROVIDER` n'est pas `twilio`, les utilisateurs en prod peuvent se logger avec `000000`. **Attention** : ce dev bypass est gardé par `!IS_PROD` côté code donc il ne tirera PAS en prod Vercel — mais en prod sans Twilio, **aucun OTP n'est envoyé**, donc personne ne peut se logger.

**Action** :
1. https://twilio.com — créer un compte (crédit gratuit pour tester).
2. Buy a phone number (Twilio Phone Number) avec capacité SMS → coût ~1 USD/mois.
3. Dans Console → Account Info :
   - Account SID
   - Auth Token
4. Pousser dans Vercel :
   - `SMS_PROVIDER=twilio`
   - `TWILIO_ACCOUNT_SID=AC…`
   - `TWILIO_AUTH_TOKEN=…`
   - `TWILIO_PHONE_NUMBER=+33…` (ou tout numéro Twilio acheté)

**Test** : `/signup/phone` avec ton vrai numéro → reçois le SMS.

**Coût** : ~0.04 € par SMS France, plus pour Afrique.

---

## 6. Sentry — Error tracking

**Pourquoi** : sans Sentry, un bug en prod = invisible jusqu'à plainte utilisateur.

**Action** :
1. https://sentry.io — créer un compte (free tier : 5k events/mois).
2. Create Project → Platform "Next.js" → Project name `hid-ai`.
3. Sentry te donne un **DSN** au format `https://abc@oXXX.ingest.sentry.io/123`.
4. Vercel :
   - `NEXT_PUBLIC_SENTRY_DSN=<le DSN>` (client + browser)
   - `SENTRY_DSN=<le même>` (server)
   - `SENTRY_ORG=<ton org slug>` (pour upload source maps)
   - `SENTRY_PROJECT=hid-ai`
   - `SENTRY_AUTH_TOKEN=<token créé dans Sentry → Settings → Auth Tokens>` (Scope `project:releases`)

**Sans ces vars** : Sentry est inerte mais l'app fonctionne (la config est gardée par `if (DSN)` dans `sentry.*.config.js`).

**Test** : ajouter temporairement `throw new Error("sentry-test")` dans une page → reload → l'erreur apparaît dans Sentry sous 1 min.

---

## Optionnel V2

### KYC réel (Veriff / Onfido / Stripe Identity)

Actuellement : upload de photo de pièce d'identité stocké dans Supabase Storage sans vérification. Pour démarrer en pilote → OK. Pour grande échelle → vérification automatique nécessaire.

**Reco** : Stripe Identity ($1.50 par vérif, intégration la plus simple — JS SDK + un webhook).

### Backups Supabase

- Free tier Supabase = backup quotidien rétention 7 jours.
- Pro tier ($25/mois) = 14 jours + PITR.
- Recommandation : passer en Pro avant ouverture publique.

### Analytics

Si tu veux ajouter Plausible / GA :
- Plausible (recommandé, RGPD-friendly, no cookies) → script dans `app/layout.js`.
- GA4 → seulement si consentement `analytics` accordé (lire via `useConsent()` côté client, ou `getConsentServer()` côté SSR).

---

## Smoke tests post-déploiement

À jouer après chaque déploiement :

```bash
# 1. Pages publiques
for path in / /a-propos /entreprises /talents /infrastructure /contact /legal /terms /privacy /gdpr /sitemap.xml /robots.txt; do
  echo "$path → $(curl -s -o /dev/null -w '%{http_code}' https://hid-ai.com$path)"
done

# 2. Tests de sécurité (5 scénarios)
SECURITY_TESTS_BASE=https://hid-ai.com node scripts/security-tests.mjs

# 3. Envoi contact (Resend)
curl -X POST https://hid-ai.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"type":"b2b","prenom":"Test","nom":"Smoke","email":"test@test.fr","sujet":"Test prod","message":"Smoke test post-déploiement, à supprimer.","consent_rgpd":true}'
# → {"ok":true}, et tu reçois l'email sur CONTACT_TO_EMAIL
```

## Mentions légales — données à remplacer

Les pages `/legal` et `/privacy` contiennent encore 4 placeholders `[à confirmer]` :

- **Forme juridique** (SAS / SARL / SASU ?)
- **Adresse postale complète** du siège
- **N° RCS / SIREN**
- **N° TVA intracommunautaire**

→ remplacer dans `app/(public)/legal/page.js` et `app/(public)/privacy/page.js` quand les infos officielles sont confirmées.
