"use client";

import { useEffect, useState } from "react";

/**
 * Affiche un score qui s'anime de 0 jusqu'à `value` en `duration` ms.
 * Easing : ease-out cubique pour finir doucement sur le chiffre cible.
 */
export function AnimatedScore({ value, duration = 1500, className = "" }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const target = Number(value) || 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={`tabular-nums ${className}`}>{displayed}</span>;
}
