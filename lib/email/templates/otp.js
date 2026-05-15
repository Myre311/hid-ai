/**
 * Template e-mail du code de vérification HID AI (auth par email).
 * Styles inline (compatibles Gmail / Outlook / Apple Mail).
 *
 * @param {{ code: string, ttlMinutes?: number }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function otpEmailTemplate({ code, ttlMinutes = 5 }) {
  const safeCode = String(code).replace(/[^0-9]/g, "").slice(0, 6);
  const spaced = safeCode.split("").join(" ");

  const subject = `${safeCode} — Votre code de vérification HID AI`;

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#0a0a0a;color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #1f1f25;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #1f1f25;">
              <div style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:8px;">Vérification du compte</div>
              <h1 style="margin:0;font-size:20px;font-weight:600;color:#fafafa;">HID&nbsp;AI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#d4d4d8;">
                Voici votre code de vérification. Saisissez-le dans la page ouverte pour confirmer votre adresse e-mail.
              </p>
              <div style="margin:0 auto;text-align:center;background:#0a0a0a;border:1px solid #2a2a32;border-radius:10px;padding:24px;">
                <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:36px;font-weight:700;letter-spacing:0.35em;color:#c89530;">${spaced}</div>
              </div>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#a1a1aa;">
                Ce code est valide pendant <strong style="color:#fafafa;">${ttlMinutes} minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail — aucun compte ne sera créé.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;border-top:1px solid #1f1f25;font-size:11px;color:#71717a;">
              HID AI — <a href="https://hid-ai.com" style="color:#a1a1aa;text-decoration:none;">hid-ai.com</a><br/>
              E-mail automatique, merci de ne pas y répondre.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `HID AI — Code de vérification

Votre code : ${safeCode}

Valide ${ttlMinutes} minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.

hid-ai.com`;

  return { subject, html, text };
}
