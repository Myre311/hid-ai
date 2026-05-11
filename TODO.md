# TODO — Actions restantes côté HID AI

> Dernière mise à jour : 2026-05-11 — finition 100 % (bugs + Phase 2 + Phase 4).

## ✅ État global

- **Site marketing** : tous les `{{PLACEHOLDERS}}` ont été remplacés par du contenu réel — aucun placeholder textuel résiduel détecté par `grep -rn "{{[A-Z_]*}}"`.
- **Plateforme d'évaluation** : 8 tests, scoring AI-Native 0-1000, retry, finalisation, email.
- **Dashboard admin** : whitelist `admin_users`, exports CSV, filtres, drawer mobile.
- **UX polish** : skeletons, EmptyState, confettis per-test, animation cadenas, page transitions.
- **A11y** : aria-labels, focus visible, alt tags, SVG 3D décoratifs en `aria-hidden`.

## 🔴 Actions manuelles requises de Mark (l'orchestrateur ne peut pas le faire)

### 1. Migration `0004_admin.sql` à exécuter
Sans elle, le middleware bloque tout accès à `/admin/*`.

```sql
-- 1. Vérifier que la fonction set_updated_at existe (déjà créée par 0002)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Coller le contenu de supabase/migrations/0004_admin.sql et exécuter
```

### 2. Bootstrap admin (Mark / Lucien)
Après ton 1er login sur `/login` (code `000000` en dev) :

```sql
-- Récupérer l'UUID
SELECT id, email, phone FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Insérer comme super_admin
INSERT INTO public.admin_users (user_id, email, role)
VALUES ('<UUID>', 'mark@hidea-solution.fr', 'super_admin');
```

### 3. Configurer Resend pour les emails
- Compte sur https://resend.com
- Vérifier le domaine `hid-ai.com` (DNS records SPF + DKIM)
- Dans Vercel → Project Settings → Environment Variables :
  - `RESEND_API_KEY=re_xxx`
  - `RESEND_FROM_EMAIL=onboarding@hid-ai.com`
- Sans clé : le code log les envois sans planter (`lib/email/resend.js:12-23`).

### 4. Variables d'environnement Vercel
Copier toutes les vars `.env.local` dans Project Settings → Environment Variables :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_APP_URL=https://hid-ai.vercel.app`

### 5. Twilio en prod (optionnel)
Pour sortir du dev bypass (`code 000000`) :
- `SMS_PROVIDER=twilio`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### 6. Assets Computer Vision tracking (50 frames)
Le test 3/3 du Computer Vision utilise des **placeholders SVG** dans `public/evaluation/cv/tracking/frame-001.svg` à `frame-050.svg` (fond gris + rectangle accent + barre d'occlusion).

Action recommandée à terme : remplacer ces placeholders par une vraie séquence vidéo de surveillance urbaine (50 frames PNG/JPG), avec personne se déplaçant + occlusions partielles aux frames 15-25 et 35-40.

### 7. Décision Hub NEO (timeline 2025)
La timeline `/a-propos` mentionne "Lancement du Hub NEO" sur 2025. Le brief PDF demandait de cacher NEO sur `/infrastructure` (fait) mais l'avait sur la timeline. Confirmer si on garde ou retire.

## 🟡 Améliorations en V2

- Service KYC réel (Veriff / Onfido / Stripe Identity) pour vérification auto des pièces d'identité
- Calendly / Cal.com pour la prise de RDV B2B
- Contenu pédagogique réel pour les 3 modules de mini-formation Talent (étape 3)
- Audit Lighthouse cible > 90 sur toutes les pages clés
- Tests de sécurité documentés dans `SECURITY_TESTS.md` (à créer) :
  - User A ne voit pas les données de B (RLS)
  - POST direct sur test verrouillé → 403
  - Non-admin sur `/admin/*` → redirect
  - Injection SQL/XSS sur champs texte
  - Re-submit d'un test passé → 409

## 📜 Notes techniques

### Plateforme d'évaluation — points marquants

- **Linéarité** : test N+1 débloqué uniquement si test N ≥ `passing_score=60`.
- **Retry** : autorisé sur tests échoués, refusé (409) sur tests passés.
- **Mode dev** : code OTP `000000` mint une session Supabase via `admin.createUser` + magic link (`app/api/auth/verify-otp/route.js:14-15, 143-164`).
- **Computer Vision** : 4 sous-tests = bounding boxes IoU (40 pts) + attributs (15 pts) + polygone (15 pts) + object tracking 50 frames avec occlusions (30 pts).
- **NLP** : sentiment/urgence/catégorie (70 pts) + NER 5 phrases africaines (30 pts).
- **RLHF** : 10 paires dont 3 contextualisées OHADA / médecine / science.
- **Fine-tuning** : quiz 50 + JSONL OHADA 30 + courbe Perplexity 20.
- **MLOps** : quiz 50 + architecture pipeline **10 étapes** (annotation 100 specialists → kappa Cohen → ingestion → ... → deployment) + dashboard Data Drift 20.
- **RAG** : quiz 60 (dont question "-40 % hallucinations" chiffrée) + hybrid search 40.
