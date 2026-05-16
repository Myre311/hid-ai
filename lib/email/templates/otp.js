/**
 * Template e-mail du code de vérification HID AI (auth par email).
 *
 * Thème SOMBRE bulletproof, aligné sur la charte du site hid-ai.com.
 * Les emails tout-noir cassent souvent sur Gmail quand le fond n'est posé
 * qu'en CSS : ici on double chaque fond avec l'attribut HTML `bgcolor=`
 * (respecté par Gmail/Outlook là où `style="background"` est strippé),
 * couleurs explicites haut contraste, table unique. Logo blanc PNG hébergé.
 * Pas d'image SVG ni de Google Font (bloqués par les clients mail).
 *
 * @param {{ code: string, ttlMinutes?: number }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function otpEmailTemplate({ code, ttlMinutes = 5 }) {
  const safeCode = String(code).replace(/[^0-9]/g, "").slice(0, 6);

  const subject = `${safeCode} — Votre code de vérification HID AI`;

  // Tokens repris de app/globals.css
  const C = {
    bg: "#000000", // fond hors carte
    card: "#0a0a0c", // surface carte
    elevated: "#131318", // panneau code
    border: "#1f1f25",
    fg: "#fafafa", // titres / chiffres
    body: "#a1a1aa", // texte courant
    muted: "#71717a", // labels / footer
    accent: "#c89530", // doré HID AI
  };
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const monoFont = "'SF Mono',SFMono-Regular,Menlo,Consolas,'Courier New',monospace";

  const html = `<!doctype html>
<html lang="fr">
  <body bgcolor="${C.bg}" style="margin:0;padding:0;background:${C.bg};color:${C.fg};font-family:${sans};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Votre code HID AI : ${safeCode} — valide ${ttlMinutes} minutes.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg};">
      <tr><td align="center" bgcolor="${C.bg}" style="background:${C.bg};padding:44px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="max-width:600px;width:100%;background:${C.card};border:1px solid ${C.border};border-radius:14px;">
          <!-- Barre d'accent dorée -->
          <tr><td height="4" bgcolor="${C.accent}" style="height:4px;background:${C.accent};line-height:4px;font-size:0;border-radius:14px 14px 0 0;">&nbsp;</td></tr>

          <!-- Header logo blanc -->
          <tr>
            <td bgcolor="${C.card}" style="background:${C.card};padding:34px 40px 28px;border-bottom:1px solid ${C.border};">
              <img src="https://hid-ai.com/brand/hid-ai-email-logo-white.png" alt="HID AI" width="158" height="45" style="display:block;border:0;outline:none;text-decoration:none;height:45px;width:158px;" />
              <div style="margin-top:16px;font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:0.22em;">Vérification du compte</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="${C.card}" style="background:${C.card};padding:36px 40px;">
              <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;color:${C.fg};line-height:1.3;">Votre code de vérification</h1>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:${C.body};">
                Saisissez ce code dans la page d'inscription ou de connexion ouverte pour confirmer votre adresse e-mail.
              </p>

              <!-- Bloc code -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td align="center" bgcolor="${C.elevated}" style="background:${C.elevated};border:1px solid ${C.border};border-radius:10px;padding:28px 12px;">
                  <div style="font-family:${monoFont};font-size:40px;font-weight:700;letter-spacing:0.28em;color:${C.fg};white-space:nowrap;">${safeCode}</div>
                  <div style="margin-top:14px;font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:0.18em;">Expire dans ${ttlMinutes} minutes</div>
                </td></tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;line-height:1.65;color:${C.muted};">
                Vous n'êtes pas à l'origine de cette demande&nbsp;? Ignorez cet e-mail — aucun compte ne sera créé.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="${C.card}" style="background:${C.card};padding:22px 40px;border-top:1px solid ${C.border};border-radius:0 0 14px 14px;">
              <div style="font-size:12px;color:${C.body};font-weight:600;">HID&middot;AI</div>
              <div style="margin-top:6px;font-size:11px;line-height:1.7;color:${C.muted};">
                © 2026 HID AI — opéré par Major Exchanges SAS<br/>
                <a href="https://hid-ai.com" style="color:${C.muted};text-decoration:underline;">hid-ai.com</a> · e-mail automatique, merci de ne pas y répondre
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
