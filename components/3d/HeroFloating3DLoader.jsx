"use client";

import dynamic from "next/dynamic";

const HeroFloating3D = dynamic(
  () => import("./HeroFloating3D").then((m) => m.HeroFloating3D),
  { ssr: false, loading: () => null }
);

export function HeroFloating3DLoader({ className }) {
  return <HeroFloating3D className={className} />;
}
