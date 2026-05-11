"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Animation discrète de confettis SVG pour la page d'activation.
 * Pas de dépendance externe.
 */
export function CompletionConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        rotate: Math.random() * 360,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        color:
          i % 4 === 0
            ? "#F4B41A"
            : i % 4 === 1
            ? "#C89530"
            : i % 4 === 2
            ? "#FAFAFA"
            : "#10B981",
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{
            y: typeof window !== "undefined" ? window.innerHeight + 40 : 800,
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          className="absolute block rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
