import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { phoneSchema, otpSchema } from "@/lib/utils/validation";
import { createServiceClient, createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  branch: z.string().optional(),
});

const MAX_ATTEMPTS = 5;
const DEV_BYPASS_CODE = "000000";
const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Cherche une inscription_talent qui matche le téléphone, en essayant
 * plusieurs variantes (avec/sans "+", avec/sans espaces).
 */
async function findInscriptionByPhone(service, phone) {
  const noPlus = phone.replace(/^\+/, "");
  const variants = [
    phone,
    "+" + noPlus,
    noPlus,
    phone.replace(/\s+/g, ""),
  ];
  for (const p of variants) {
    const { data } = await service
      .from("inscriptions_talents")
      .select("id, email, prenom, nom, telephone")
      .eq("telephone", p)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }
  return null;
}

/**
 * Crée (ou trouve) un user Supabase Auth via Admin API, puis génère un
 * magic link et verify côté serveur pour mint une session avec cookies.
 * Renvoie true si une session a été créée.
 */
async function mintSessionForUser({ phone, email, metadata }) {
  const service = createServiceClient();

  // Trouver le user existant par email (auth.admin n'a pas de getByEmail direct
  // — on liste et on filtre côté serveur).
  let authUser = null;
  try {
    const { data: list } = await service.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    authUser = list?.users?.find(
      (u) =>
        (email && u.email === email) ||
        (phone && (u.phone === phone || u.phone === phone.replace(/^\+/, "")))
    );
  } catch {
    // ignored
  }

  // Créer si pas existant
  if (!authUser) {
    const createBody = email
      ? { email, email_confirm: true, user_metadata: metadata }
      : { phone: phone.replace(/^\+/, ""), phone_confirm: true, user_metadata: metadata };
    const { data: created, error: createErr } =
      await service.auth.admin.createUser(createBody);
    if (createErr) {
      return {
        ok: false,
        error: `createUser failed: ${createErr.message}`,
      };
    }
    authUser = created.user;
  }

  // Pour mint une session, on a besoin d'un email (les magic links Supabase
  // sont email-based). Si on n'a pas d'email, on en fabrique un local.
  let linkEmail = email || authUser?.email;
  if (!linkEmail) {
    linkEmail = `${phone.replace(/[^\d]/g, "")}@dev.hid-ai.local`;
    // Met à jour l'auth user pour avoir cet email factice
    await service.auth.admin.updateUserById(authUser.id, {
      email: linkEmail,
      email_confirm: true,
    });
  }

  // Generate magic link → on récupère le hashed_token pour verifyOtp côté ssr
  const { data: linkData, error: linkErr } =
    await service.auth.admin.generateLink({
      type: "magiclink",
      email: linkEmail,
    });
  if (linkErr) {
    return { ok: false, error: `generateLink failed: ${linkErr.message}` };
  }
  const tokenHash = linkData?.properties?.hashed_token;
  if (!tokenHash) {
    return { ok: false, error: "generateLink returned no token" };
  }

  // verifyOtp avec le SSR client → set les cookies de session sur la response
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

  const { phone, code } = parsed.data;
  const service = createServiceClient();

  // ─── DEV BYPASS ───────────────────────────────────────────────────────
  // En dev, "000000" mint directement une session sans Twilio ni OTP réel.
  if (!IS_PROD && code === DEV_BYPASS_CODE) {
    const inscription = await findInscriptionByPhone(service, phone);
    const result = await mintSessionForUser({
      phone,
      email: inscription?.email || null,
      metadata: {
        prenom: inscription?.prenom,
        nom: inscription?.nom,
        phone,
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
  // Latest active code for this phone
  const { data: row, error } = await service
    .from("otp_codes")
    .select("*")
    .eq("phone", phone)
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

  // Mint la session Supabase (même mécanisme qu'en dev — propre)
  const inscription = await findInscriptionByPhone(service, phone);
  const result = await mintSessionForUser({
    phone,
    email: inscription?.email || null,
    metadata: {
      prenom: inscription?.prenom,
      nom: inscription?.nom,
      phone,
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
