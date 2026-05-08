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

### Formulaire d'inscription Talents (HID-003)
Le form `/talents` log les données et affiche un toast. Pas de back-end. À brancher vers Supabase ou un endpoint API dédié dans une prochaine itération.

### Boutons "Réserver une démo" / "Parler à notre équipe"
Pointent actuellement vers `/contact` (à créer si pas encore en place) ou vers `mailto:`. Décision : pour cette itération, lien vers `mailto:contact@hidea-solution.fr`.
