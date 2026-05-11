import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { phoneSchema } from "@/lib/utils/validation";
import { createServiceClient } from "@/lib/supabase/server";
import { smsProvider } from "@/lib/sms/provider";

const bodySchema = z.object({
  phone: phoneSchema,
  branch: z.string().optional(),
});

const RATE_LIMIT_WINDOW_MIN = 60;
const RATE_LIMIT_MAX = 3;
const OTP_TTL_SECONDS = 300;

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
  const { phone } = parsed.data;
  const isProd = process.env.NODE_ENV === "production";

  // En dev, on bypass entièrement la table otp_codes (qui peut ne pas exister)
  // et on accepte 000000 dans verify-otp.
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.log(
      `[send-otp DEV] OTP factice pour ${phone} — utilisez 000000 pour bypass`
    );
    return NextResponse.json({ ok: true, devHint: "Use 000000 to bypass" });
  }

  const supabase = createServiceClient();

  // Rate limit: max 3 envois / heure / numéro
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabase
    .from("otp_codes")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", since);

  if (typeof count === "number" && count >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessayez dans 1 heure." },
      { status: 429 }
    );
  }

  // Invalidate previous active codes
  await supabase
    .from("otp_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("phone", phone)
    .is("consumed_at", null);

  const code = genCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

  const { error: insertErr } = await supabase
    .from("otp_codes")
    .insert({ phone, code_hash: codeHash, expires_at: expiresAt });

  if (insertErr) {
    console.error("[send-otp] insert error", insertErr);
    return NextResponse.json(
      { error: "Erreur serveur, réessayez." },
      { status: 500 }
    );
  }

  try {
    await smsProvider.sendSms({
      to: phone,
      body: `HID AI · Votre code de vérification : ${code}. Valide 5 minutes.`,
    });
  } catch (err) {
    console.error("[send-otp] sms error", err);
    // Don't leak provider errors to client
  }

  // En dev, signaler dans la console serveur le code généré + le bypass possible.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(
      `[send-otp DEV] code généré pour ${phone}: ${code} — ou utilisez 000000 pour bypass`
    );
    return NextResponse.json({ ok: true, devHint: "Use 000000 to bypass" });
  }

  return NextResponse.json({ ok: true });
}
