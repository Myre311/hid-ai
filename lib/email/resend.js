import { Resend } from "resend";

/**
 * Singleton client Resend.
 * Si RESEND_API_KEY n'est pas configurée, retourne un stub qui logge
 * sans planter (utile en dev local sans clé).
 */
let _client = null;

export function getResend() {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    _client = {
      emails: {
        async send(payload) {
          // eslint-disable-next-line no-console
          console.warn(
            "[resend] RESEND_API_KEY missing — email NOT sent. Would have sent:",
            { to: payload.to, subject: payload.subject }
          );
          return { data: { id: "stub-no-key" }, error: null };
        },
      },
    };
    return _client;
  }
  _client = new Resend(key);
  return _client;
}

export const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || "onboarding@hid-ai.com";
