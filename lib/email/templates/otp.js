/**
 * Template e-mail du code de vérification HID AI (auth par email).
 * Reproduit la charte du site hid-ai.com : fond noir pur, accent doré,
 * eyebrow majuscule espacée, code monospace. Styles inline (Gmail / Outlook
 * / Apple Mail safe — les Google Fonts ne chargeant pas en email, on utilise
 * des stacks système qui approchent Plus Jakarta Sans / JetBrains Mono).
 *
 * @param {{ code: string, ttlMinutes?: number }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function otpEmailTemplate({ code, ttlMinutes = 5 }) {
  const safeCode = String(code).replace(/[^0-9]/g, "").slice(0, 6);
  const spaced = safeCode.split("").join(" "); // fine space entre chiffres

  const subject = `${safeCode} — Votre code de vérification HID AI`;

  // Tokens repris de app/globals.css
  const C = {
    bg: "#000000",
    surface: "#0a0a0c",
    elevated: "#131318",
    border: "#1f1f25",
    fg: "#fafafa",
    muted: "#a1a1aa",
    mutedStrong: "#71717a",
    accent: "#c89530",
  };
  const sans =
    "'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const monoFont = "'JetBrains Mono','SF Mono',Menlo,Consolas,monospace";

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:${C.bg};color:${C.fg};font-family:${sans};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:32px 36px 28px;border-bottom:1px solid ${C.border};">
              <div style="font-size:11px;color:${C.mutedStrong};text-transform:uppercase;letter-spacing:0.22em;margin-bottom:10px;">Vérification du compte</div>
              <div style="font-size:22px;font-weight:700;color:${C.fg};letter-spacing:-0.01em;">HID&nbsp;AI</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;">
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:${C.muted};">
                Voici votre code de vérification. Saisissez-le dans la page ouverte pour confirmer votre adresse e-mail.
              </p>
              <div style="text-align:center;background:${C.bg};border:1px solid ${C.border};border-radius:12px;padding:28px 16px;">
                <div style="font-family:${monoFont};font-size:38px;font-weight:700;letter-spacing:0.32em;color:${C.accent};">${spaced}</div>
              </div>
              <p style="margin:28px 0 0;font-size:13px;line-height:1.65;color:${C.mutedStrong};">
                Ce code expire dans <span style="color:${C.fg};font-weight:600;">${ttlMinutes} minutes</span>. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail — aucun compte ne sera créé.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;border-top:1px solid ${C.border};font-size:11px;line-height:1.7;color:${C.mutedStrong};">
              HID AI — <a href="https://hid-ai.com" style="color:${C.muted};text-decoration:none;">hid-ai.com</a><br/>
              E-mail automatique, merci de ne pas y répondre.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `HID AI — Vérification du compte

Votre code de vérification : ${safeCode}

Il expire dans ${ttlMinutes} minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.

hid-ai.com`;

  return { subject, html, text };
}
