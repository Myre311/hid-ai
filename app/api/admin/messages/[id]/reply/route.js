import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";
import { getResend, RESEND_FROM } from "@/lib/email/resend";

/**
 * POST /api/admin/messages/[id]/reply
 * Body : { message: string }
 *
 * Envoie un email de réponse via Resend, marque le message comme 'answered'
 * et stocke le contenu de la réponse pour traçabilité.
 */
export async function POST(request, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { service, user } = guard;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const message = String(body?.message || "").trim();
  if (message.length < 10 || message.length > 10000) {
    return NextResponse.json(
      { error: "La réponse doit faire entre 10 et 10000 caractères." },
      { status: 400 }
    );
  }

  const { data: contactMsg } = await service
    .from("contact_messages")
    .select("id, prenom, nom, email, sujet, message, type")
    .eq("id", params.id)
    .maybeSingle();

  if (!contactMsg) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  // Compose l'email de réponse
  const replyHtml = buildReplyHtml({
    contactMsg,
    replyMessage: message,
    adminName: user.email,
  });
  const subject = `Re: ${contactMsg.sujet}`;

  let sendResult = { ok: false, id: null, error: null };
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: contactMsg.email,
      replyTo: user.email,
      subject,
      html: replyHtml,
    });
    if (error) sendResult.error = error.message || String(error);
    else { sendResult.ok = true; sendResult.id = data?.id; }
  } catch (err) {
    sendResult.error = err?.message || String(err);
  }

  if (!sendResult.ok) {
    return NextResponse.json(
      { error: `Envoi impossible : ${sendResult.error}` },
      { status: 500 }
    );
  }

  // Marque le message comme answered + stocke la réponse
  await service
    .from("contact_messages")
    .update({
      status: "answered",
      reply_message: message,
      replied_at: new Date().toISOString(),
      replied_by: user.id,
    })
    .eq("id", params.id);

  await logAdminAction({
    service,
    admin: { id: user.id, email: user.email },
    action: "message.reply",
    targetType: "message",
    targetId: contactMsg.id,
    targetLabel: `${contactMsg.email} — ${contactMsg.sujet}`,
    metadata: { resend_id: sendResult.id, length: message.length },
  });

  return NextResponse.json({ ok: true, resend_id: sendResult.id });
}

function buildReplyHtml({ contactMsg, replyMessage, adminName }) {
  const esc = (s) => String(s || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#0a0a0a;color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#111114;border:1px solid #1f1f25;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:24px 28px;border-bottom:1px solid #1f1f25;">
            <div style="font-size:11px;color:#c89530;text-transform:uppercase;letter-spacing:0.18em;margin-bottom:8px;">HID AI · Réponse</div>
            <h1 style="margin:0;font-size:20px;font-weight:600;color:#fafafa;">Bonjour ${esc(contactMsg.prenom)},</h1>
          </td></tr>
          <tr><td style="padding:24px 28px;">
            <div style="font-size:14px;line-height:1.65;color:#fafafa;white-space:pre-wrap;">${esc(replyMessage)}</div>
            <hr style="border:none;border-top:1px solid #1f1f25;margin:24px 0;"/>
            <div style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;margin-bottom:8px;">Votre message du ${new Date().toLocaleDateString("fr-FR")}</div>
            <div style="font-size:12px;color:#a1a1aa;background:#0a0a0a;border:1px solid #1f1f25;border-radius:6px;padding:14px;line-height:1.55;white-space:pre-wrap;">${esc(contactMsg.message)}</div>
          </td></tr>
          <tr><td style="padding:16px 28px;border-top:1px solid #1f1f25;font-size:11px;color:#71717a;">
            Hidea Solution · ${esc(adminName)}<br/>
            <a href="https://hid-ai.com" style="color:#a1a1aa;text-decoration:none;">hid-ai.com</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}
