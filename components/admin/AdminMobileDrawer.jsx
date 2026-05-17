"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutGrid, Users, Building2, Mail, Download, ShieldCheck, History } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin/nav";

// Résolution locale des icônes — Server Component ne peut pas nous passer
// un composant React, donc on map le `iconName` (string) ici.
const ICONS = { LayoutGrid, Users, Building2, Mail, Download, ShieldCheck, History };

export default function AdminMobileDrawer({ navItems = ADMIN_NAV }) {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    setOpen(false);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
    } catch {
      // on force la redirection quoi qu'il arrive
    }
    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="md:hidden fixed top-3 left-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface border border-white/10 text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#0A0A0B] border-r border-white/10 flex flex-col px-5 py-7 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="self-end mb-6 inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = ICONS[item.iconName];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-md text-foreground/85 hover:bg-white/5 hover:text-foreground transition-colors text-sm"
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion — bloc distinct épinglé en bas, visible sur mobile */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <button
            type="button"
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2.5 h-12 rounded-md border border-white/15 bg-surface text-sm font-medium text-foreground hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}
