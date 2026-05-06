import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Tableau de bord" };

// Hardcoded placeholder until Supabase auth is wired.
// Once /api/auth/verify-otp creates a real session, switch to a server component
// that calls supabase.auth.getUser() + reads /profiles.
const MOCK_USER = {
  firstName: "Talent",
  branch: "specialist",
  completion: 60,
  phoneVerified: true,
  lastLogin: "il y a quelques secondes",
};

const NEXT_STEP = {
  specialist:
    "Le Flow Manager analyse votre profil. Vos premières missions arriveront prochainement.",
  engineer:
    "Votre évaluation par le Chatbot Gatekeeper sera disponible dans les prochains jours.",
  business:
    "Votre validation KYB est en cours. Notre équipe vous contactera sous 48h.",
};

const BRANCH_LABEL = {
  specialist: "AI Specialist",
  engineer: "AI Engineer",
  business: "Entreprise",
};

export default function DashboardPage() {
  const user = MOCK_USER;

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted">Tableau de bord</p>
        <h1 className="font-serif text-3xl md:text-5xl tracking-tighter leading-tight">
          Bienvenue, {user.firstName}.
        </h1>
      </header>

      <div className="grid md:grid-cols-3 gap-5">
        <Card padding="lg" className="md:col-span-2 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-widest text-muted-strong">
                Profil
              </p>
              <h2 className="font-serif text-2xl tracking-tight">
                {BRANCH_LABEL[user.branch]}
              </h2>
            </div>
            <Badge variant="accent">{user.completion}% complété</Badge>
          </div>
          <div className="h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${user.completion}%` }}
            />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Complétez votre profil pour débloquer l&rsquo;ensemble des
            fonctionnalités. Les sections manquantes accélèrent votre matching.
          </p>
        </Card>

        <Card padding="lg" className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-muted-strong">
            Sécurité
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            <span className="text-sm">Numéro vérifié</span>
          </div>
          <p className="text-sm text-muted">
            Dernière connexion : {user.lastLogin}
          </p>
        </Card>
      </div>

      <Card padding="lg" variant="elevated" className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-accent">
          Prochaine étape
        </p>
        <p className="font-serif text-xl md:text-2xl tracking-tight leading-snug max-w-3xl">
          {NEXT_STEP[user.branch]}
        </p>
      </Card>
    </div>
  );
}
