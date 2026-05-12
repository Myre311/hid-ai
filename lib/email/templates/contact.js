/**
 * Template HTML d'e-mail pour les messages de contact entrants.
 * Style inline (Gmail/Outlook safe).
 */
export function contactTemplate({ prenom, nom, email, telephone, sujet, message, type }) {
  const escape = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const typeLabel = {
    "talent": "Inscription Talent",
    "b2b": "Demande B2B",
    "press": "Presse / Média",
    "career": "Carrière",
    "other": "Autre",
  }[type] || "Général";

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#0a0a0a;color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #1f1f25;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #1f1f25;">
              <div style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;margin-bottom:8px;">${escape(typeLabel)}</div>
              <h1 style="margin:0;font-size:20px;font-weight:600;color:#fafafa;">Nouveau message — HID AI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;width:120px;vertical-align:top;">De</td>
                  <td style="padding:4px 0;font-size:14px;color:#fafafa;">${escape(prenom)} ${escape(nom)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;vertical-align:top;">E-mail</td>
                  <td style="padding:4px 0;font-size:14px;color:#fafafa;"><a href="mailto:${escape(email)}" style="color:#fafafa;text-decoration:underline;">${escape(email)}</a></td>
                </tr>
                ${telephone ? `<tr>
                  <td style="padding:4px 0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;vertical-align:top;">Téléphone</td>
                  <td style="padding:4px 0;font-size:14px;color:#fafafa;">${escape(telephone)}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:4px 0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.18em;vertical-align:top;">Sujet</td>
                  <td style="padding:4px 0;font-size:14px;color:#fafafa;">${escape(sujet)}</td>
                </tr>
              </table>

              <div style="margin-top:24px;padding:16px;background:#0a0a0a;border:1px solid #1f1f25;border-radius:8px;font-size:14px;line-height:1.6;color:#fafafa;white-space:pre-wrap;">${escape(message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #1f1f25;font-size:11px;color:#71717a;">
              Reçu via le formulaire de contact de <a href="https://hid-ai.com" style="color:#a1a1aa;text-decoration:none;">hid-ai.com</a>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
