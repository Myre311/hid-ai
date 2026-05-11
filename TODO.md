# TODO — Placeholders & open items

## Placeholders à remplir

Tous les `{{NOM_DU_PLACEHOLDER}}` du code doivent être remplacés par le client. Liste centralisée :

### Page Accueil (HID-001)
- `{{HERO_HEADLINE}}` — phrase d'accroche XXL serif sur le hero
- `{{HERO_SUBTEXT}}` — sous-texte court sous le hero, résumé services
- `{{ENTREPRISES_INTRO}}` — 2-3 lignes d'intro section "HID AI pour les entreprises"
- `{{TALENTS_INTRO}}` — 2-3 lignes d'intro section "HID AI pour les talents"
- `{{NOTRE_ROLE_TEXT}}` — texte de la section "Notre rôle" décrivant le travail des équipes

### Page Entreprises (HID-002)
- `{{ENTREPRISES_HERO_TEXT}}` — résumé des deux services (AI Data + Recrutement)

### Page Talents (HID-003)
- `{{TALENTS_HERO_TEXT}}` — résumé des deux métiers (AI Specialist + AI Engineer)

### Logos & médias
- Logos partenaires définitifs (carousel home) — placeholders SVG génériques en attendant
- Logos certifications réels (RGPD, ISO, AICPA SOC) en blanc monochrome — placeholders SVG en attendant
- Photos formation et vidéo (HID-005 médias) — `bg-gray-900` placeholders en attendant

## Incohérences à clarifier avec le client

### NEO mention en timeline 2025 (HID-005)
Le brief demande explicitement de masquer Hub NEO sur Infrastructure et "Notre vision", mais demande aussi la mention "Lancement du Hub NEO" sur la timeline 2025 de À propos. Mention conservée pour cette itération comme demandé, **flag** pour clarification ultérieure.

## Backend / intégrations à brancher

### Formulaires d'inscription B2B + Talent — Setup Supabase

**État** : branchés sur Supabase (✅ tables `inscriptions_b2b` + `inscriptions_talents`, bucket Storage `kyc-documents` pour les pièces d'identité). API routes `POST /api/inscription-b2b` et `POST /api/inscription-talent`.

#### Setup requis (une fois)

1. **Variables d'environnement** dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

2. **Exécuter la migration** `supabase/migrations/0002_inscriptions.sql` :
   - Aller sur https://supabase.com/dashboard → projet HID AI → SQL Editor
   - Coller le contenu du fichier → Run

3. **Vérifier le bucket Storage** :
   - Dashboard → Storage → vérifier que `kyc-documents` existe (créé par la migration)
   - Il doit être **privé** (toggle "Public bucket" off)

#### À développer en V2

- **Email transactionnel** (Resend / Postmark) après chaque insertion : confirmation candidat + notification équipe
- **Dashboard admin** : pages Next.js privées avec RLS adapté pour lister/filtrer/exporter les inscriptions
- **Signed URLs** pour les fichiers KYC depuis le dashboard (révocation auto après 1h)

### Service KYC réel pour le formulaire Talent
L'étape 2 du `TalentForm` stocke actuellement les pièces d'identité dans Supabase Storage privé, mais sans vérification automatisée. À brancher en V2 :

- **Veriff** ou **Onfido** ou **Stripe Identity** pour la vérification automatisée
- Validation IA + revue manuelle si flag de risque
- Workflow : status `kyc_pending` → `validated` ou `rejected`

### Calendrier de prise de RDV (B2B + Talent)
Les composants `Calendar` génèrent des créneaux statiques côté client (14 jours ouvrés × créneaux 30/90 min). Connecter à :

- **Calendly** (lien d'intégration via embed) ou **Cal.com** (open source)
- Synchronisation avec les agendas Google Calendar de l'équipe
- Email de confirmation avec lien visio (Google Meet / Zoom auto-généré)

### Contenu pédagogique des 3 modules (Talent — Étape 3)
Les 3 modules de mini-formation (Maîtrise écosystème HID AI, Sécurité données, Orientation compétences) sont actuellement validés par un simple bouton "Marquer comme validé". À produire :

- Contenu pédagogique réel (vidéos courtes ou pages interactives)
- QCM final pour valider la compréhension
- Tracking de progression par utilisateur

### Plateforme de test technique (Talent — Étape 4)
L'évaluation technique est actuellement réduite à la sélection d'un créneau. À développer :

- Plateforme dédiée d'exercices (Annotation/Labellisation, RLHF, Fine-tuning supervisé)
- Activation caméra + Chatbot Gatekeeper pour anti-triche
- Score d'IA-Native calculé selon la persévérance et la précision
- Restitution automatique au candidat

### Boutons existants
Tous les CTAs B2B et Talent sont désormais branchés sur les modals d'inscription via le contexte React `InscriptionContext`. Plus aucun lien `mailto:` ou `/signup` redirigeant vers une vraie URL — le flow se fait dans la modal.
