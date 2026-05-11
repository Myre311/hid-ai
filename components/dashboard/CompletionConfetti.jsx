"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

const ACCENT_PALETTE = ["#F4B41A", "#C89530", "#FAFAFA", "#10B981"];

/**
 * Salve de confettis canvas-confetti.
 * Trois tirs successifs depuis les côtés gauche, droit puis centre,
 * pour un effet plus dense qu'une simple pluie SVG.
 */
export function CompletionConfetti() {
  useEffect(() => {
    const end = Date.now() + 1200;

    const shoot = (originX) => {
      confetti({
        particleCount: 80,
        spread: 65,
        startVelocity: 55,
        ticks: 200,
        origin: { x: originX, y: 0.6 },
        colors: ACCENT_PALETTE,
        scalar: 0.95,
      });
    };

    shoot(0.1);
    shoot(0.9);

    const id = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(id);
        return;
      }
      confetti({
        particleCount: 30,
        startVelocity: 35,
        spread: 90,
        origin: {
          x: 0.5,
          y: 0.3,
        },
        colors: ACCENT_PALETTE,
        scalar: 0.85,
      });
    }, 250);

    return () => clearInterval(id);
  }, []);

  return null;
}
