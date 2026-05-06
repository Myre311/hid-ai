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
import { createClient } from "@/lib/supabase/server";

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
  const supabase = createClient();

  // Auth requirement — uncomment once Supabase Auth is wired
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Validate branch-specific shape
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

  // TODO: persist via supabase.from('profiles').upsert(...) once auth is wired.
  // For the bootstrap iteration we accept the payload and respond ok, so the
  // client can route to /dashboard. Real persistence will be added in the
  // sprint that wires Supabase Auth + RLS.
  return NextResponse.json({ ok: true });
}
