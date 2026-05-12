import { NextResponse } from "next/server";
import { z } from "zod";
import {
  branchSchema,
  profileStep1Schema,
  profileStep2Schema,
  profileStep3EngineerSchema,
  businessStep1Schema,
  businessStep2Schema,
  businessStep3Schema,
} from "@/lib/utils/validation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  branch: branchSchema,
  profile: z.record(z.any()),
});

export async function POST(request) {
  let json;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { branch, profile } = parsed.data;

  // Auth requise — l'utilisateur doit avoir terminé le flow OTP (/signup/verify)
  const userClient = createClient();
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Validation côté serveur du shape spécifique à la branche
  if (branch === "business") {
    const c1 = businessStep1Schema.safeParse(profile);
    const c2 = businessStep2Schema.safeParse(profile);
    const c3 = businessStep3Schema.safeParse(profile);
    if (!c1.success || !c2.success || !c3.success) {
      const issue =
        (c1.error || c2.error || c3.error)?.issues?.[0]?.message ??
        "Profil entreprise invalide";
      return NextResponse.json({ error: issue }, { status: 400 });
    }
  } else {
    const a = profileStep1Schema.safeParse(profile);
    const b = profileStep2Schema.safeParse(profile);
    if (!a.success || !b.success) {
      const issue =
        (a.error || b.error)?.issues?.[0]?.message ?? "Profil invalide";
      return NextResponse.json({ error: issue }, { status: 400 });
    }
    if (branch === "engineer") {
      const c = profileStep3EngineerSchema.safeParse(profile);
      if (!c.success) {
        return NextResponse.json(
          { error: c.error.issues[0]?.message ?? "Profil engineer invalide" },
          { status: 400 }
        );
      }
    }
  }

  // Persistance : on stocke le profil dans user_metadata via service-role
  // (l'utilisateur n'a pas la permission de modifier ses propres metadata
  // via supabase.auth.updateUser dans le contexte server cookies-only).
  const service = createServiceClient();
  const completedAt = new Date().toISOString();
  const { error: updateError } = await service.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      branch,
      profile,
      profile_completed: true,
      profile_completed_at: completedAt,
    },
  });

  if (updateError) {
    console.error("[complete-profile] updateUserById error:", updateError);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le profil — réessayez." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, completed_at: completedAt });
}
