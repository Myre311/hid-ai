import { NextResponse } from "next/server";
import { getResend, RESEND_FROM } from "@/lib/email/resend";
import { contactTemplate } from "@/lib/email/templates/contact";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "contact@hidea-solution.fr";
const ALLOWED_TYPES = new Set(["talent", "b2b", "press", "career", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // Anti-spam : champ honeypot caché doit rester vide
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

  const html = contactTemplate({ prenom, nom, email, telephone, sujet, message, type });
  const subject = `[HID AI · ${type.toUpperCase()}] ${sujet}`;

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return NextResponse.json({ error: "Envoi impossible — réessayez plus tard." }, { status: 500 });
    }
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ error: "Envoi impossible — réessayez plus tard." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
