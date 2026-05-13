import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { AdminsManager } from "@/components/admin/AdminsManager";

export const metadata = { title: "Admin · Gestion des admins" };
export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const userClient = createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) redirect("/login?next=/admin/admins");

  const service = createServiceClient();
  const { data: me } = await service
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSuper = me?.role === "super_admin";

  const { data: admins } = await service
    .from("admin_users")
    .select("id, user_id, email, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
          Gestion · {admins?.length || 0} admin(s)
        </p>
        <h1 className="t-h2-md">Administrateurs</h1>
        <p className="text-sm text-foreground/60">
          Liste de la whitelist <code className="text-xs bg-black/40 px-1 py-0.5 rounded">admin_users</code>.
          {!isSuper && " Lecture seule (super-admin requis pour modifier)."}
        </p>
      </header>

      <AdminsManager admins={admins || []} canEdit={isSuper} currentUserId={user.id} />
    </div>
  );
}
