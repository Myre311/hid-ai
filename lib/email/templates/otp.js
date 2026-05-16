/**
 * Template e-mail du code de vérification HID AI (auth par email).
 *
 * Design CLAIR volontaire : un email tout-noir est la 1re cause d'emails
 * "blancs/vides" sur Gmail (Gmail strippe/force les couleurs en dark design).
 * Fond blanc + texte foncé + accent doré HID AI = rendu fiable et identique
 * sur Gmail, Outlook, Apple Mail. 100 % CSS inline, table unique, pas
 * d'image/SVG/Google Font (tous bloqués par les clients mail).
 *
 * @param {{ code: string, ttlMinutes?: number }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function otpEmailTemplate({ code, ttlMinutes = 5 }) {
  const safeCode = String(code).replace(/[^0-9]/g, "").slice(0, 6);

  const subject = `${safeCode} — Votre code de vérification HID AI`;

  const C = {
    page: "#f4f4f5", // gris très clair (zinc-100) — fond hors carte
    card: "#ffffff",
    ink: "#0a0a0a", // texte principal quasi-noir
    body: "#52525b", // texte secondaire (zinc-600)
    muted: "#71717a", // labels / footer (zinc-500)
    line: "#e4e4e7", // bordures (zinc-200)
    accent: "#b07d1f", // doré HID AI assombri pour contraste AA sur blanc
    codeBg: "#fafaf7", // panneau code légèrement chaud
  };
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const monoFont = "'SF Mono',SFMono-Regular,Menlo,Consolas,'Courier New',monospace";

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background:${C.page};color:${C.ink};font-family:${sans};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Votre code HID AI : ${safeCode} — valide ${ttlMinutes} minutes.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border:1px solid ${C.line};border-radius:14px;">
          <!-- Barre d'accent signature -->
          <tr><td style="height:4px;background:${C.accent};line-height:4px;font-size:0;border-radius:14px 14px 0 0;">&nbsp;</td></tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid ${C.line};">
              <div style="font-size:22px;font-weight:700;color:${C.ink};letter-spacing:-0.01em;">HID<span style="color:${C.accent};">&middot;</span>AI</div>
              <div style="margin-top:10px;font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:0.22em;">Vérification du compte</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;color:${C.ink};line-height:1.3;">Votre code de vérification</h1>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:${C.body};">
                Saisissez ce code dans la page d'inscription ou de connexion ouverte pour confirmer votre adresse e-mail.
              </p>

              <!-- Bloc code -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background:${C.codeBg};border:1px solid ${C.line};border-radius:10px;padding:28px 12px;">
                  <div style="font-family:${monoFont};font-size:40px;font-weight:700;letter-spacing:0.28em;color:${C.ink};white-space:nowrap;">${safeCode}</div>
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
            <td style="padding:22px 40px;border-top:1px solid ${C.line};">
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
