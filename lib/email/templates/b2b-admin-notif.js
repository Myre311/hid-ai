/**
 * Email #2 — Admin : notification interne pour une nouvelle inscription B2B.
 *
 * @param {{ reference: string, raisonSociale: string, secteur: string,
 *           volume: string, signataire: string, signaireEmail: string,
 *           adminUrl: string }} params
 * @returns {{ subject: string, html: string, text: string }}
 */
export function b2bAdminNotifTemplate({
  reference,
  raisonSociale,
  secteur,
  volume,
  signataire,
  signaireEmail,
  adminUrl,
}) {
  const subject = `[B2B] Nouvelle inscription : ${raisonSociale} [${reference}]`;

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

  const rows = [
    ["Référence",     reference],
    ["Entreprise",    raisonSociale],
    ["Secteur",       secteur],
    ["Volume estimé", volume],
    ["Signataire",    signataire],
    ["Email contact", signaireEmail],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:${C.muted};width:140px;white-space:nowrap;">${label}</td>
        <td style="padding:8px 12px;font-size:13px;color:${C.ink};font-weight:500;">${value}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8"/><title>${subject}</title></head>
  <body style="margin:0;padding:0;background:${C.page};font-family:${sans};-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Nouvelle inscription B2B de ${raisonSociale} — à traiter.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:${C.card};border:1px solid ${C.line};border-radius:14px;">
          <tr><td height="4" bgcolor="${C.accent}"
                  style="height:4px;background:${C.accent};line-height:4px;font-size:0;border-radius:14px 14px 0 0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:34px 40px 36px;">
              <div style="font-size:11px;color:${C.muted};text-transform:uppercase;letter-spacing:0.22em;margin-bottom:14px;">Admin — Nouvelle inscription</div>
              <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;color:${C.ink};line-height:1.3;">
                Nouvelle inscription B2B à valider
              </h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:${C.body};">
                Une nouvelle entreprise a soumis une demande de partenariat. Accédez à l'interface admin pour traiter le dossier.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fafaf7;border:1px solid ${C.line};border-radius:10px;border-collapse:collapse;overflow:hidden;">
                ${tableRows}
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="border-radius:8px;background:${C.accent};">
                    <a href="${adminUrl}"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;border-radius:8px;">
                      Voir le dossier dans l'admin
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 40px;border-top:1px solid ${C.line};">
              <div style="font-size:11px;line-height:1.7;color:${C.muted};">
                Email interne HID AI — ne pas transférer. © 2026 HID AI
              </div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `[HID AI ADMIN] Nouvelle inscription B2B

Référence     : ${reference}
Entreprise    : ${raisonSociale}
Secteur       : ${secteur}
Volume estimé : ${volume}
Signataire    : ${signataire}
Email contact : ${signaireEmail}

Voir le dossier : ${adminUrl}

Email interne HID AI — ne pas transférer. © 2026 HID AI`;

  return { subject, html, text };
}
