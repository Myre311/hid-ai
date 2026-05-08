"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/marketing/Logo";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/entreprises", label: "Entreprises" },
  { href: "/talents", label: "Talents" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/a-propos", label: "À propos" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-[rgba(10,10,11,0.8)] backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-foreground hover:text-foreground/90 transition-colors"
            aria-label="HID AI — accueil"
          >
            <Logo className="h-5 md:h-6 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted hover:text-foreground transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" as="a">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-background hover:bg-accent-hover hover:shadow-glow-accent transition-all duration-200"
            >
              Commencer
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-surface"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </Container>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden bg-surface-elevated transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="text-foreground"
            onClick={() => setOpen(false)}
            aria-label="HID AI — accueil"
          >
            <Logo className="h-5 w-auto" />
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-surface"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 pt-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-3 border-b border-border text-foreground"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface text-sm font-medium text-foreground"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent text-sm font-medium text-background"
            >
              Commencer
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
