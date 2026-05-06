"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ delay = 0, y = 16, duration = 0.55, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ delayStep = 0.08, initialDelay = 0, className, children }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <>
      {items.map((child, i) => (
        <Reveal key={i} delay={initialDelay + i * delayStep} className={className}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
