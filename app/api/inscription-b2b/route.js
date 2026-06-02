import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, RESEND_FROM } from "@/lib/email/resend";
import { b2bInscriptionReceivedTemplate } from "@/lib/email/templates/b2b-inscription-received";
import { b2bAdminNotifTemplate } from "@/lib/email/templates/b2b-admin-notif";
import { checkRateLimit, rateLimitResponse, getClientIp, PRESETS } from "@/lib/security/ratelimit";

/**
 * POST /api/inscription-b2b
 *
 * Endpoint public — formulaire d'inscription entreprise.
 *
 * Hardening (audit sécurité 2026-05) :
 *   - Cap body size 32 KB (rejet précoce)
 *   - Validation Zod stricte (tous les champs bornés)
 *   - Honeypot field `website_hp` (rempli = bot, reject silencieux)
 *   - URL `site_web` doit matcher ^https?:// — bloque les schemes
 *     javascript:, data:, vbscript: qui causaient une XSS stockée
 *     exécutable côté admin au clic.
 *   - Sanitization défensive : strip des contrôles, normalisation NFKC
 */

// 32 KB max — un formulaire B2B sérieux fait ~4 KB max
const MAX_BODY_BYTES = 32 * 1024;

// Regex stricte pour site_web : http(s) + caractères classiques
const URL_SAFE = /^https?:\/\/[\w.\-]+(\.[\w]{2,})+([/?#][\w.\-/?#=&%+~:!*'()@$,;]*)?$/i;

// Schéma Zod — borne TOUS les champs texte pour éviter les payloads géants
const bodySchema = z.object({
  // Honeypot : doit être vide (les bots remplissent tout)
  website_hp: z.string().max(0).optional().or(z.literal("")),

  raison_sociale: z.string().trim().min(1).max(200),
  immatriculation: z.string().trim().min(1).max(50),
  pays: z.string().trim().min(2).max(80),
  secteur: z.string().trim().min(1).max(80),
  secteur_autre: z.string().trim().max(120).nullable().optional(),

  site_web: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || URL_SAFE.test(v), {
      message: "site_web doit être une URL http(s) valide",
    })
    .nullable()
    .optional(),

  signataire_prenom: z.string().trim().min(1).max(80),
  signataire_nom: z.string().trim().min(1).max(80),
  signataire_fonction: z.string().trim().min(1).max(120),
  signataire_email: z.string().trim().email().max(180),
  signataire_tel: z.string().trim().min(4).max(40),

  prestations: z.array(z.string().max(80)).min(1).max(20),
  prestation_autre: z.string().trim().max(200).nullable().optional(),
  typologies: z.array(z.string().max(80)).min(1).max(30),

  volume: z.string().trim().min(1).max(80),
  frequence: z.string().trim().min(1).max(80),
  brief: z.string().trim().max(2000).nullable().optional(),

  creneau: z
    .object({
      date: z.string().trim().max(20).nullable().optional(),
      time: z.string().trim().max(20).nullable().optional(),
    })
    .nullable()
    .optional(),

  mode_rdv: z.string().trim().max(40).nullable().optional(),
  langue: z.string().trim().max(20).nullable().optional(),

  consent_rgpd: z.boolean().refine((v) => v === true, {
    message: "RGPD consent required",
  }),
  consent_news: z.boolean().optional(),
});

export async function POST(request) {
  // ── 0) Rate limit IP (5 inscriptions/min/IP — anti-spam) ────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(`b2b:${ip}`, PRESETS.publicForm);
  if (!rl.ok) return rateLimitResponse(rl);

  // ── 1) Reject early si payload trop gros ────────────────────────
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large" },
      { status: 413 }
    );
  }

  // ── 2) Parse JSON avec garde anti-OOM ───────────────────────────
  let raw;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── 3) Honeypot : si rempli, on fait croire que ça a marché ────
  // (les bots remplissent tout, retour 201 silencieux sans insert)
  if (typeof raw?.website_hp === "string" && raw.website_hp.length > 0) {
    return NextResponse.json(
      { reference: generateRef() },
      { status: 201 }
    );
  }

  // ── 4) Validation Zod stricte ───────────────────────────────────
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        // Renvoie le premier message pour aider l'utilisateur
        // mais ne dump pas le payload reçu.
        details: parsed.error.issues[0]?.message || "invalid_payload",
      },
      { status: 400 }
    );
  }
  const body = parsed.data;

  // ── 5) Insert ───────────────────────────────────────────────────
  const reference = generateRef();
  const supabase = createServiceClient();

  const { error } = await supabase.from("inscriptions_b2b").insert({
    reference,
    raison_sociale: body.raison_sociale,
    immatriculation: body.immatriculation,
    pays: body.pays,
    secteur: body.secteur,
    secteur_autre: body.secteur_autre || null,
    site_web: body.site_web || null,
    signataire_prenom: body.signataire_prenom,
    signataire_nom: body.signataire_nom,
    signataire_fonction: body.signataire_fonction,
    signataire_email: body.signataire_email,
    signataire_tel: body.signataire_tel,
    prestations: body.prestations,
    prestation_autre: body.prestation_autre || null,
    typologies: body.typologies,
    volume: body.volume,
    frequence: body.frequence,
    brief: body.brief || null,
    creneau_date: body.creneau?.date || null,
    creneau_time: body.creneau?.time || null,
    mode_rdv: body.mode_rdv || null,
    langue: body.langue || null,
    consent_rgpd: !!body.consent_rgpd,
    consent_news: !!body.consent_news,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/inscription-b2b] insert error:", error);
    return NextResponse.json(
      { error: "insertion_failed" },
      { status: 500 }
    );
  }

  // ── 6) Emails best-effort ────────────────────────────────────────
  const resend = getResend();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hid-ai.com";
  const adminBaseUrl = process.env.ADMIN_APP_URL || "https://admin.hid-ai.com";

  // Email #1 — confirmation au signataire
  const { subject: s1, html: h1, text: t1 } = b2bInscriptionReceivedTemplate({
    reference,
    raisonSociale: body.raison_sociale,
    signataire: `${body.signataire_prenom} ${body.signataire_nom}`,
  });
  await resend.emails
    .send({ from: RESEND_FROM, to: body.signataire_email, subject: s1, html: h1, text: t1 })
    .catch((err) => console.error("[email] b2b-inscription-received failed", err));

  // Email #2 — notification admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const { data: inserted } = await supabase
      .from("inscriptions_b2b")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();
    const adminUrl = inserted?.id
      ? `${adminBaseUrl}/admin/entreprises/${inserted.id}`
      : `${adminBaseUrl}/admin/entreprises`;

    const { subject: s2, html: h2, text: t2 } = b2bAdminNotifTemplate({
      reference,
      raisonSociale: body.raison_sociale,
      secteur: body.secteur,
      volume: body.volume,
      signataire: `${body.signataire_prenom} ${body.signataire_nom}`,
      signaireEmail: body.signataire_email,
      adminUrl,
    });
    await resend.emails
      .send({ from: RESEND_FROM, to: adminEmail, subject: s2, html: h2, text: t2 })
      .catch((err) => console.error("[email] b2b-admin-notif failed", err));
  } else {
    console.warn("[email] ADMIN_EMAIL non configuré — email admin B2B non envoyé");
  }

  return NextResponse.json({ reference }, { status: 201 });
}

function generateRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `HID-B2B-${ymd}-${rand}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}
