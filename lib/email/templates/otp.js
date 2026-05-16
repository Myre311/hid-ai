/**
 * Template e-mail du code de vérification HID AI (auth par email).
 *
 * Reproduit la charte du site hid-ai.com (app/globals.css) : fond noir pur,
 * accent doré, barre d'accent signature, eyebrow majuscule espacée, titre
 * serif (clin d'œil à Instrument Serif du site), code monospace doré, footer
 * brandé avec l'entité légale. 100 % CSS inline — pas d'image/SVG/Google Font
 * (bloqués par Gmail/Outlook), donc rendu identique sur tous les clients.
 *
 * @param {{ code: string, ttlMinutes?: number }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function otpEmailTemplate({ code, ttlMinutes = 5 }) {
  const safeCode = String(code).replace(/[^0-9]/g, "").slice(0, 6);
  const spaced = safeCode.split("").join(" ");

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
  const serif = "'Instrument Serif',Georgia,'Times New Roman',serif";
  const monoFont = "'JetBrains Mono','SF Mono',Menlo,Consolas,monospace";

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${C.bg};color:${C.fg};font-family:${sans};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Votre code HID AI : ${safeCode} — valide ${ttlMinutes} minutes.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:44px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
          <!-- Barre d'accent signature -->
          <tr><td style="height:3px;background:${C.accent};line-height:3px;font-size:0;">&nbsp;</td></tr>

          <!-- Header / wordmark -->
          <tr>
            <td style="padding:36px 40px 26px;border-bottom:1px solid ${C.border};">
              <div style="font-size:23px;font-weight:700;color:${C.fg};letter-spacing:-0.01em;">HID<span style="color:${C.accent};">&middot;</span>AI</div>
              <div style="margin-top:12px;font-size:11px;color:${C.mutedStrong};text-transform:uppercase;letter-spacing:0.24em;">Vérification du compte</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 14px;font-family:${serif};font-size:27px;font-weight:400;color:${C.fg};line-height:1.25;">Votre code de vérification</h1>
              <p style="margin:0 0 30px;font-size:15px;line-height:1.65;color:${C.muted};">
                Saisissez ce code dans la page d'inscription ou de connexion ouverte pour confirmer votre adresse e-mail.
              </p>

              <!-- Bloc code -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background:${C.bg};border:1px solid rgba(200,149,48,0.30);border-radius:12px;padding:30px 16px;">
                  <div style="font-family:${monoFont};font-size:40px;font-weight:700;letter-spacing:0.34em;color:${C.accent};">${spaced}</div>
                  <div style="margin-top:14px;font-size:11px;color:${C.mutedStrong};text-transform:uppercase;letter-spacing:0.2em;">Expire dans ${ttlMinutes} minutes</div>
                </td></tr>
              </table>

              <p style="margin:30px 0 0;font-size:13px;line-height:1.65;color:${C.mutedStrong};">
                Vous n'êtes pas à l'origine de cette demande&nbsp;? Ignorez simplement cet e-mail — aucun compte ne sera créé et aucune action n'est requise.
              </p>
            </td>
          </tr>

          <!-- Footer brandé -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${C.border};">
              <div style="font-size:12px;color:${C.muted};font-weight:600;">HID&middot;AI</div>
              <div style="margin-top:6px;font-size:11px;line-height:1.7;color:${C.mutedStrong};">
                © 2026 HID AI — opéré par Major Exchanges SAS<br/>
                <a href="https://hid-ai.com" style="color:${C.mutedStrong};text-decoration:none;border-bottom:1px solid ${C.border};">hid-ai.com</a> · e-mail automatique, merci de ne pas y répondre
              </div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `HID·AI — Vérification du compte

Votre code de vérification : ${safeCode}

Saisissez-le dans la page ouverte pour confirmer votre adresse e-mail.
Il expire dans ${ttlMinutes} minutes.

Vous n'êtes pas à l'origine de cette demande ? Ignorez cet e-mail, aucun compte ne sera créé.

© 2026 HID AI — opéré par Major Exchanges SAS
hid-ai.com`;

  return { subject, html, text };
}
