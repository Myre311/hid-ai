/**
 * Twilio SMS provider. Implements the same contract as logging/africastalking
 * so the call-site doesn't care which one is active.
 *
 * Falls back to console.warn when env vars are missing — useful before
 * Twilio is wired up. Never crashes the request.
 */

let twilioClient = null;

async function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  if (twilioClient) return twilioClient;
  const mod = await import("twilio");
  const factory = mod.default || mod;
  twilioClient = factory(sid, token);
  return twilioClient;
}

export const twilioProvider = {
  name: "twilio",
  async sendSms({ to, body }) {
    const client = await getClient();
    const from = process.env.TWILIO_PHONE_NUMBER;

    if (!client || !from) {
      console.warn(`[sms:twilio:stub] to=${to} body=${body}`);
      return { id: `stub_${Date.now()}` };
    }

    const msg = await client.messages.create({ to, from, body });
    return { id: msg.sid };
  },
};
