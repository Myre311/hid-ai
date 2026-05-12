import { NextResponse } from "next/server";
import { getResend, RESEND_FROM } from "@/lib/email/resend";
import { contactTemplate } from "@/lib/email/templates/contact";
import { createServiceClient } from "@/lib/supabase/server";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "contact@hidea-solution.fr";
const ALLOWED_TYPES = new Set(["talent", "b2b", "press", "career", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 *
 * 1. Valide le payload + honeypot anti-bot.
 * 2. INSERT dans `contact_messages` (status='pending') — la trace est persistée
 *    AVANT l'envoi, donc même si Resend tombe ou si la clé manque, le message
 *    n'est jamais perdu.
 * 3. Envoie via Resend.
 * 4. UPDATE de la ligne avec le statut d'envoi (sent / failed / skipped) +
 *    resend_id ou error.
 *
 * Le code est défensif : si la table `contact_messages` n'existe pas encore
 * (migration 0005 non appliquée), on log un warning et on continue avec
 * l'envoi email — pas de régression côté UX.
 */
export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const prenom = String(body?.prenom || "").trim();
  const nom = String(body?.nom || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const telephone = String(body?.telephone || "").trim();
  const sujet = String(body?.sujet || "").trim();
  const message = String(body?.message || "").trim();
  const type = ALLOWED_TYPES.has(body?.type) ? body.type : "other";
  const consent = Boolean(body?.consent_rgpd);
  const honeypot = String(body?.website || "").trim();

  // Anti-spam : honeypot rempli → 200 silencieux
  if (honeypot) return NextResponse.json({ ok: true }, { status: 200 });

  if (!prenom || prenom.length > 80) return NextResponse.json({ error: "Prénom invalide" }, { status: 400 });
  if (!nom || nom.length > 80) return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 200) return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });
  if (telephone && telephone.length > 40) return NextResponse.json({ error: "Téléphone invalide" }, { status: 400 });
  if (!sujet || sujet.length > 200) return NextResponse.json({ error: "Sujet invalide" }, { status: 400 });
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Message : 10 à 5000 caractères" }, { status: 400 });
  }
  if (!consent) return NextResponse.json({ error: "Consentement RGPD requis" }, { status: 400 });

  // Capture IP + UA pour traçabilité (utile contre spam et fraude)
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  // Persistance AVANT envoi — même si Resend échoue, le message reste tracé
  const service = createServiceClient();
  let messageRowId = null;
  try {
    const { data, error } = await service
      .from("contact_messages")
      .insert({
        type, prenom, nom, email, telephone: telephone || null,
        sujet, message,
        ip_address: ipAddress, user_agent: userAgent,
      })
      .select("id")
      .single();
    if (error) {
      // Probablement : migration 0005 pas encore appliquée. On loggue et on
      // continue avec l'envoi email pour ne pas casser l'UX.
      console.warn(
        "[contact] INSERT contact_messages échoué (migration 0005 appliquée ?):",
        error.message
      );
    } else {
      messageRowId = data?.id || null;
    }
  } catch (err) {
    console.warn("[contact] persistence error:", err?.message || err);
  }

  // Envoi Resend
  const html = contactTemplate({ prenom, nom, email, telephone, sujet, message, type });
  const subject = `[HID AI · ${type.toUpperCase()}] ${sujet}`;
  let emailStatus = "skipped"; // sent | failed | skipped (= pas de clé Resend)
  let resendId = null;
  let resendError = null;

  try {
    const resend = getResend();
    const { data: sendData, error: sendErr } = await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });
    if (sendErr) {
      emailStatus = "failed";
      resendError = sendErr.message || String(sendErr);
      console.error("[contact] resend error:", sendErr);
    } else if (sendData?.id === "stub-no-key") {
      emailStatus = "skipped";
    } else {
      emailStatus = "sent";
      resendId = sendData?.id || null;
    }
  } catch (err) {
    emailStatus = "failed";
    resendError = err?.message || String(err);
    console.error("[contact] unexpected error:", err);
  }

  // Mise à jour de la ligne avec le résultat d'envoi (si on a un id)
  if (messageRowId) {
    try {
      await service
        .from("contact_messages")
        .update({
          email_status: emailStatus,
          email_sent_at: emailStatus === "sent" ? new Date().toISOString() : null,
          resend_id: resendId,
          error: resendError,
        })
        .eq("id", messageRowId);
    } catch (err) {
      console.warn("[contact] UPDATE après envoi échoué:", err?.message || err);
    }
  }

  // L'API renvoie ok dans tous les cas où le message est arrivé jusqu'à nous
  // (persisté OU envoyé). On ne renvoie une erreur QUE si on a tout perdu.
  const persisted = Boolean(messageRowId);
  const sent = emailStatus === "sent";
  if (!persisted && !sent && emailStatus !== "skipped") {
    return NextResponse.json(
      { error: "Envoi impossible — réessayez plus tard." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
