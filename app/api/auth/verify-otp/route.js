import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authEmailSchema, otpSchema } from "@/lib/utils/validation";
import { createServiceClient, createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: authEmailSchema,
  code: otpSchema,
  branch: z.string().optional(),
});

const MAX_ATTEMPTS = 5;
const DEV_BYPASS_CODE = "000000";
const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Cherche la dernière inscription_talent associée à un email (match exact,
 * normalisé lowercase comme à l'inscription).
 */
async function findInscriptionByEmail(service, email) {
  const { data } = await service
    .from("inscriptions_talents")
    .select("id, email, prenom, nom, telephone")
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data || null;
}

/**
 * Crée (ou retrouve) le user Supabase Auth via Admin API par email, génère
 * un magic link et le vérifie côté serveur pour mint une session (cookies).
 */
async function mintSessionForEmail({ email, metadata }) {
  const service = createServiceClient();

  let authUser = null;
  try {
    const { data: list } = await service.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    authUser = list?.users?.find((u) => u.email === email);
  } catch {
    // ignored
  }

  if (!authUser) {
    const { data: created, error: createErr } =
      await service.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: metadata,
      });
    if (createErr) {
      return { ok: false, error: `createUser failed: ${createErr.message}` };
    }
    authUser = created.user;
  }

  const { data: linkData, error: linkErr } =
    await service.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
  if (linkErr) {
    return { ok: false, error: `generateLink failed: ${linkErr.message}` };
  }
  const tokenHash = linkData?.properties?.hashed_token;
  if (!tokenHash) {
    return { ok: false, error: "generateLink returned no token" };
  }

  const ssr = createClient();
  const { error: verifyErr } = await ssr.auth.verifyOtp({
    type: "magiclink",
    token_hash: tokenHash,
  });
  if (verifyErr) {
    return { ok: false, error: `verifyOtp failed: ${verifyErr.message}` };
  }

  return { ok: true };
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

  const { email, code } = parsed.data;
  const service = createServiceClient();

  // ─── DEV BYPASS ───────────────────────────────────────────────────────
  // En dev, "000000" mint directement une session sans email ni OTP réel.
  if (!IS_PROD && code === DEV_BYPASS_CODE) {
    const inscription = await findInscriptionByEmail(service, email);
    const result = await mintSessionForEmail({
      email,
      metadata: {
        prenom: inscription?.prenom,
        nom: inscription?.nom,
        email,
        inscription_talent_id: inscription?.id,
      },
    });
    if (!result.ok) {
      // eslint-disable-next-line no-console
      console.error("[verify-otp dev-bypass]", result.error);
      return NextResponse.json(
        { error: `Dev bypass failed: ${result.error}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, devBypass: true });
  }

  // ─── FLOW NORMAL ──────────────────────────────────────────────────────
  const { data: row, error } = await service
    .from("otp_codes")
    .select("*")
    .eq("email", email)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ error: "Aucun code en cours." }, { status: 400 });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Code expiré." }, { status: 400 });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Trop de tentatives, demandez un nouveau code." },
      { status: 429 }
    );
  }

  const matches = await bcrypt.compare(code, row.code_hash);
  if (!matches) {
    await service
      .from("otp_codes")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    return NextResponse.json({ error: "Code invalide." }, { status: 400 });
  }

  await service
    .from("otp_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", row.id);

  const inscription = await findInscriptionByEmail(service, email);
  const result = await mintSessionForEmail({
    email,
    metadata: {
      prenom: inscription?.prenom,
      nom: inscription?.nom,
      email,
      inscription_talent_id: inscription?.id,
    },
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: `Session mint failed: ${result.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
