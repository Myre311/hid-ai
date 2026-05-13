import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Building2,
  Download,
  LogOut,
  AlertTriangle,
  Eye,
  Mail,
  ShieldCheck,
  History,
} from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Logo } from "@/components/marketing/Logo";
import AdminMobileDrawer from "@/components/admin/AdminMobileDrawer";
import { ADMIN_NAV } from "@/lib/admin/nav";

export const metadata = { title: "Admin · HID AI" };

// Résolution locale des icônes — interdit de passer des composants React
// (functions) d'un Server Component à un Client Component.
const ICONS = { LayoutGrid, Users, Building2, Mail, Download, ShieldCheck, History };

export default async function AdminLayout({ children }) {
  const userClient = createClient();
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const service = createServiceClient();
  const { data: adminRow } = await service
    .from("admin_users")
    .select("email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  // Le middleware a déjà gated cette page, mais en plus on affiche
  // un fallback élégant si la requête arrive ici sans admin valide.
  if (!adminRow) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center flex flex-col gap-4">
          <span className="inline-flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-red-500/15 border border-red-400">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </span>
          <h1 className="t-h3">Accès refusé</h1>
          <p className="t-body">
            Votre compte n&rsquo;a pas les permissions admin. Contactez un
            super-administrateur pour être ajouté à la whitelist.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors self-center"
          >
            Retour à mon dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMobileDrawer navItems={ADMIN_NAV} />
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-white/10 bg-surface/40 px-5 py-7 sticky top-0 h-screen">
        <Link href="/" className="text-foreground mb-2" aria-label="HID AI">
          <Logo className="h-5 w-auto" />
        </Link>
        <p className="text-[10px] uppercase tracking-[0.22em] text-accent mb-8">
          Admin
        </p>
        <nav className="flex-1 flex flex-col gap-1">
          {ADMIN_NAV.map((n) => {
            const Icon = ICONS[n.iconName];
            return (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex items-center gap-3 px-3 h-10 rounded-md text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-foreground/55 hover:text-foreground transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Vue site public
          </Link>
          <span className="text-xs text-foreground/55 truncate mt-2" title={adminRow.email}>
            {adminRow.email}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            {adminRow.role}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs text-foreground/55 hover:text-foreground transition-colors mt-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 md:px-8 py-8 md:py-12">{children}</main>
      </div>
    </div>
  );
}
