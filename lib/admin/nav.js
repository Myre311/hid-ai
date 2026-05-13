/**
 * Source unique de vérité pour la nav admin.
 * Stocke uniquement des strings (sérialisables) — les icônes sont résolues
 * côté Server Component et côté Client Component via un ICON_MAP local.
 *
 * Pourquoi ? On ne peut pas passer un composant React (function) d'un Server
 * Component à un Client Component dans Next.js App Router prod. Avant ce fix,
 * la layout admin passait `Icon: LayoutGrid` en prop → crash 500 en prod.
 */
export const ADMIN_NAV = [
  { href: "/admin",             label: "Vue d'ensemble", iconName: "LayoutGrid" },
  { href: "/admin/talents",     label: "Talents",        iconName: "Users" },
  { href: "/admin/entreprises", label: "Entreprises",    iconName: "Building2" },
  { href: "/admin/messages",    label: "Messages",       iconName: "Mail" },
  { href: "/admin/admins",      label: "Admins",         iconName: "ShieldCheck" },
  { href: "/admin/audit",       label: "Audit",          iconName: "History" },
  { href: "/admin/exports",     label: "Exports",        iconName: "Download" },
];
