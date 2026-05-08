import Link from "next/link";
import { Logo } from "@/components/marketing/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-6 md:px-8 py-6 flex items-center justify-between border-b border-border">
        <Link
          href="/"
          className="text-foreground"
          aria-label="HID AI — accueil"
        >
          <Logo className="h-5 w-auto" />
        </Link>
        <Link
          href="/login"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Déjà un compte ?
        </Link>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
