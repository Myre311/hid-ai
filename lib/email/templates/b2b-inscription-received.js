/**
 * Email #1 — Entreprise : confirmation de réception d'une inscription B2B.
 *
 * @param {{ reference: string, raisonSociale: string, signataire: string }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function b2bInscriptionReceivedTemplate({ reference, raisonSociale, signataire }) {
  const subject = `Demande reçue [${reference}] — HID AI`;

  const C = {
    page:   "#f4f4f5",
    card:   "#ffffff",
    ink:    "#0a0a0a",
    body:   "#52525b",
    muted:  "#71717a",
    line:   "#e4e4e7",
    accent: "#b07d1f",
  };
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  const html = `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"/><title>${subject}</title></head>
  <body style="margin:0;padding:0;background:${C.page};font-family:${sans};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Référence ${reference} — nous vous recontactons sous 24h ouvrées.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:${C.card};border:1px solid ${C.line};border-radius:14px;">
          <tr><td height="4" bgcolor="${C.accent}"
                  style="height:4px;background:${C.accent};line-height:4px;font-size:0;border-radius:14px 14px 0 0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:0;font-size:0;line-height:0;">
              <img src="https://hid-ai.com/brand/hid-ai-email-header.png" alt="HID AI"
                   width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:34px 40px 36px;">
              <div style="font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:0.22em;margin-bottom:14px;">Inscription B2B</div>
              <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;color:${C.ink};line-height:1.3;">
                Votre demande a bien été reçue
              </h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:${C.body};">
                Bonjour ${signataire},<br/><br/>
                Nous avons bien reçu la demande de partenariat de <strong>${raisonSociale}</strong>.
                Notre équipe commerciale vous recontactera dans les <strong>24 heures ouvrées</strong>.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fafaf7;border:1px solid ${C.line};border-radius:10px;padding:20px 24px;">
                    <div style="font-size:12px;color:${C.muted};text-transform:uppercase;letter-spacing:0.15em;margin-bottom:6px;">Votre référence dossier</div>
                    <div style="font-size:22px;font-weight:700;color:${C.ink};letter-spacing:0.05em;">${reference}</div>
                    <div style="margin-top:6px;font-size:12px;color:${C.muted};">Conservez cette référence pour tout échange avec notre équipe.</div>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.65;color:${C.muted};">
                Des questions ? Contactez-nous à <a href="mailto:commercial@hid-ai.com" style="color:${C.accent};">commercial@hid-ai.com</a> en indiquant votre référence.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px;border-top:1px solid ${C.line};">
              <div style="font-size:12px;color:${C.body};font-weight:600;">HID&middot;AI</div>
              <div style="margin-top:6px;font-size:11px;line-height:1.7;color:${C.muted};">
                © 2026 HID AI — opéré par Major Exchanges SAS<br/>
                <a href="https://hid-ai.com/privacy" style="color:${C.muted};text-decoration:underline;">Confidentialité</a>
                &nbsp;&middot;&nbsp;
                <a href="https://hid-ai.com/unsubscribe" style="color:${C.muted};text-decoration:underline;">Se désabonner</a>
                &nbsp;&middot;&nbsp; e-mail automatique, merci de ne pas y répondre
              </div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `HID·AI — Inscription B2B reçue

Bonjour ${signataire},

Nous avons bien reçu la demande de partenariat de ${raisonSociale}.
Votre référence dossier : ${reference}

Notre équipe commerciale vous recontactera dans les 24 heures ouvrées.

Questions ? commercial@hid-ai.com (mentionnez votre référence)

© 2026 HID AI — hid-ai.com/privacy · hid-ai.com/unsubscribe`;

  return { subject, html, text };
}
