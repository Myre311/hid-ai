"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, User, Settings, Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/Badge";

const NAV = [
  { href: "/dashboard", label: "Vue d'ensemble", Icon: LayoutGrid },
  { href: "/dashboard/profile", label: "Mon profil", Icon: User },
  { href: "/dashboard/settings", label: "Paramètres", Icon: Settings },
];

const BRANCH_LABEL = {
  specialist: "AI Specialist",
  engineer: "AI Engineer",
  business: "Entreprise",
};

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const branch = useAuthStore((s) => s.branch);
  const profileDraft = useAuthStore((s) => s.profileDraft);
  const businessDraft = useAuthStore((s) => s.businessDraft);

  const displayName =
    profileDraft?.firstName ||
    businessDraft?.companyName ||
    "Talent";
  const branchLabel = branch ? BRANCH_LABEL[branch] : null;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-border bg-surface/40 px-5 py-7 sticky top-0 h-screen">
        <Link href="/" className="font-medium tracking-tight mb-10">
          <span className="text-foreground">HID</span>
          <span className="text-accent ml-1">AI</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavItem key={n.href} href={n.href} Icon={n.Icon} label={n.label} />
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden bg-surface-elevated transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link
            href="/"
            className="font-medium tracking-tight"
            onClick={() => setOpen(false)}
          >
            <span className="text-foreground">HID</span>
            <span className="text-accent ml-1">AI</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-surface"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-2 pt-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavItem
              key={n.href}
              href={n.href}
              Icon={n.Icon}
              label={n.label}
              onClick={() => setOpen(false)}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="inline-flex items-center gap-3 px-3 h-11 rounded-md text-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 md:px-8 border-b border-border flex items-center gap-3">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-surface"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="md:hidden font-medium tracking-tight">
            <span className="text-foreground">HID</span>
            <span className="text-accent ml-1">AI</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-foreground/90 truncate max-w-[160px]">
              {displayName}
            </span>
            {branchLabel && (
              <Badge variant="accent" className="hidden sm:inline-flex">
                {branchLabel}
              </Badge>
            )}
            <button
              type="button"
              onClick={logout}
              aria-label="Se déconnecter"
              className="inline-flex items-center justify-center h-10 w-10 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-8 py-8 md:py-12">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, label, Icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex items-center gap-3 px-3 h-11 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
