/**
 * SmsProvider — abstract interface so we can switch from Twilio to
 * Africa's Talking (or another) without touching call sites.
 */
export const smsProvider = await getSmsProvider();

async function getSmsProvider() {
  const provider = (process.env.SMS_PROVIDER || "twilio").toLowerCase();
  switch (provider) {
    case "twilio": {
      const { twilioProvider } = await import("./twilio");
      return twilioProvider;
    }
    default:
      return loggingProvider;
  }
}

const loggingProvider = {
  name: "logging",
  async sendSms({ to, body }) {
    console.warn(`[sms:logging] to=${to} body=${body}`);
    return { id: `log_${Date.now()}` };
  },
};
