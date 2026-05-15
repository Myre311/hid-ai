import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authEmailSchema } from "@/lib/utils/validation";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, RESEND_FROM } from "@/lib/email/resend";
import { otpEmailTemplate } from "@/lib/email/templates/otp";

const bodySchema = z.object({
  email: authEmailSchema,
  branch: z.string().optional(),
});

const RATE_LIMIT_WINDOW_MIN = 60;
const RATE_LIMIT_MAX = 5;
const OTP_TTL_SECONDS = 300;
const OTP_TTL_MINUTES = OTP_TTL_SECONDS / 60;

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  let json;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }
  const { email } = parsed.data;
  const isProd = process.env.NODE_ENV === "production";

  // En dev, on bypass entièrement la table otp_codes (qui peut ne pas exister)
  // et on accepte 000000 dans verify-otp.
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.log(
      `[send-otp DEV] OTP factice pour ${email} — utilisez 000000 pour bypass`
    );
    return NextResponse.json({ ok: true, devHint: "Use 000000 to bypass" });
  }

  const supabase = createServiceClient();

  // Rate limit : max RATE_LIMIT_MAX envois / heure / email
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabase
    .from("otp_codes")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  if (typeof count === "number" && count >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessayez dans 1 heure." },
      { status: 429 }
    );
  }

  // Invalide les codes actifs précédents pour cet email
  await supabase
    .from("otp_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("email", email)
    .is("consumed_at", null);

  const code = genCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

  const { error: insertErr } = await supabase
    .from("otp_codes")
    .insert({ email, code_hash: codeHash, expires_at: expiresAt });

  if (insertErr) {
    console.error("[send-otp] insert error", insertErr);
    return NextResponse.json(
      { error: "Erreur serveur, réessayez." },
      { status: 500 }
    );
  }

  try {
    const { subject, html, text } = otpEmailTemplate({
      code,
      ttlMinutes: OTP_TTL_MINUTES,
    });
    const resend = getResend();
    const { error: mailErr } = await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      subject,
      html,
      text,
    });
    if (mailErr) {
      console.error("[send-otp] resend error", mailErr);
      return NextResponse.json(
        { error: "Envoi de l'e-mail impossible, réessayez." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[send-otp] email error", err);
    return NextResponse.json(
      { error: "Envoi de l'e-mail impossible, réessayez." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
