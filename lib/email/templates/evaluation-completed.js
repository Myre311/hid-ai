/**
 * Template HTML inline pour l'email d'activation post-évaluation.
 * Style inline pour compatibilité Gmail/Outlook/Apple Mail.
 */
import { TESTS } from "@/lib/evaluation/tests";
import { aiNativeLevel, aiNativeMaxScore, aiNativeBreakdown } from "@/lib/evaluation/aiNativeScore";

export function evaluationCompletedTemplate({
  firstName = "Talent",
  metier = "specialist",
  aiNativeScore = 0,
  testResults = [],
  dashboardUrl = "https://hid-ai.vercel.app/dashboard",
  reference = "",
}) {
  const maxScore = aiNativeMaxScore(testResults);
  const level = aiNativeLevel(aiNativeScore, maxScore);
  const breakdown = aiNativeBreakdown(testResults);
  const metierLabel = metier === "engineer" ? "AI Engineer" : "AI Specialist";

  const testRows = TESTS.map((t) => {
    const result = testResults.find((r) => r.test_slug === t.slug);
    const score = result?.score ?? "—";
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1f1f25;font-size:13px;color:#fafafa;">
          <span style="color:#71717a;display:inline-block;width:32px;font-family:monospace;">${String(t.order + 1).padStart(2, "0")}</span>
          ${t.title}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #1f1f25;font-size:13px;color:#fafafa;text-align:right;font-family:monospace;">
          ${score} / 100
        </td>
      </tr>`;
  }).join("");

  const subject = `Profil activé — bienvenue dans l'écosystème HID AI`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;color:#fafafa;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

          <!-- Header / Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:22px;font-weight:600;letter-spacing:0.1em;color:#fafafa;text-transform:uppercase;">
                    HID <span style="color:#c89530;">AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero block -->
          <tr>
            <td style="padding:48px 32px;background:linear-gradient(180deg,#0a0a0c 0%,#000000 100%);border:1px solid #1f1f25;border-radius:12px;">
              <p style="margin:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#c89530;">
                Profil activé
              </p>
              <h1 style="margin:0 0 16px 0;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:28px;line-height:1.2;font-weight:600;color:#fafafa;">
                Bienvenue dans l'écosystème HID AI, ${firstName}.
              </h1>
              <p style="margin:0 0 32px 0;font-size:15px;line-height:1.6;color:#a1a1aa;">
                Votre profil <strong style="color:#fafafa;">${metierLabel}</strong>
                est désormais activé. Vous êtes officiellement référencé dans
                notre vivier de talents IA — vos premières missions arrivent.
              </p>

              <!-- Score -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0d0d10;border:1px solid #c89530;border-radius:8px;padding:24px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px 0;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#c89530;">
                      AI-Native Score
                    </p>
                    <p style="margin:0;font-size:48px;line-height:1;font-weight:600;color:#fafafa;">
                      ${aiNativeScore} <span style="font-size:18px;color:#71717a;">/ ${maxScore}</span>
                    </p>
                    <p style="margin:8px 0 0 0;font-size:13px;color:#c89530;">
                      ${metierLabel} · ${level.label}
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;border-top:1px solid #1f1f25;padding-top:14px;">
                      <tr>
                        <td style="font-size:11px;color:#a1a1aa;padding-right:8px;">
                          Compétence (épreuves)
                        </td>
                        <td style="font-size:12px;color:#fafafa;text-align:right;font-family:monospace;">
                          ${breakdown.competence_pts} / 100
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:11px;color:#a1a1aa;padding-top:6px;">
                          Rigueur (rythme)
                        </td>
                        <td style="font-size:12px;color:#fafafa;text-align:right;font-family:monospace;padding-top:6px;">
                          ${breakdown.time_pts} / 100
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Test breakdown -->
              <p style="margin:0 0 12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#71717a;">
                Détail des 8 tests
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:32px;background-color:#0d0d10;border-radius:8px;border:1px solid #1f1f25;">
                ${testRows}
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#fafafa;border-radius:6px;padding:0;">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:14px 28px;font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:500;color:#000000;text-decoration:none;letter-spacing:0.02em;">
                      Accéder à mon espace →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 16px 0 16px;">
              <p style="margin:0 0 8px 0;font-size:11px;color:#52525b;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
                Référence : ${reference}
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;line-height:1.6;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
                HID AI · Hidea Solution · L'infrastructure humaine de l'IA<br>
                contact@hidea-solution.fr · Cet email est généré automatiquement après votre évaluation.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Bienvenue dans l'écosystème HID AI, ${firstName}.

Votre profil ${metierLabel} est désormais activé.

AI-Native Score : ${aiNativeScore} / ${maxScore} (${metierLabel} · ${level.label})
  • Compétence (épreuves) : ${breakdown.competence_pts} / 100
  • Rigueur (rythme)      : ${breakdown.time_pts} / 100

Détail des 8 tests :
${TESTS.map((t) => {
  const result = testResults.find((r) => r.test_slug === t.slug);
  return `  ${String(t.order + 1).padStart(2, "0")}. ${t.title} — ${result?.score ?? "—"} / 100`;
}).join("\n")}

Accéder à votre espace : ${dashboardUrl}

Référence : ${reference}
HID AI · Hidea Solution
`;

  return { subject, html, text };
}
