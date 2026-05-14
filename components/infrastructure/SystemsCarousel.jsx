"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useRef } from "react";
import {
  FlowManagerIcon,
  ChatbotGatekeeperIcon,
  DataGatewayIcon,
  MatchingIcon,
  ScoringIcon,
} from "@/components/infrastructure/SystemsIcons";

const SYSTEMS = [
  {
    category: "Surveillance",
    title: "Flow Manager AI",
    description:
      "Surveille la performance des AI Specialists et des AI Engineers et calcule les points toutes les 10 minutes.",
    Icon: FlowManagerIcon,
  },
  {
    category: "Évaluation",
    title: "Chatbot Gatekeeper",
    description:
      "Évalue en temps réel avec la caméra activée pour éviter la tricherie.",
    Icon: ChatbotGatekeeperIcon,
  },
  {
    category: "Sécurité",
    title: "Data Gateway sécurisé",
    description:
      "Pipeline de données chiffré, conforme RGPD, audit trail immuable.",
    Icon: DataGatewayIcon,
  },
  {
    category: "Matching",
    title: "Algorithme de matching",
    description:
      "Mise en relation prédictive entre talents certifiés et missions client en moins de 5 secondes.",
    Icon: MatchingIcon,
  },
  {
    category: "Scoring",
    title: "Système de Scoring Dynamique",
    description:
      "Permet d'évaluer en situation réelle les compétences et performances des talents.",
    Icon: ScoringIcon,
  },
];

export function SystemsCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.5;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      {/* Header de la section */}
      <div className="px-6 md:px-12 lg:px-24 mb-12 flex items-end justify-between gap-6">
        <div className="max-w-2xl flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Recherche &amp; infrastructure
          </p>
          <h2 className="t-h2-md">
            Les systèmes HID&nbsp;AI
          </h2>
          <p className="t-lead">
            Une infrastructure pensée pour la conformité européenne, la
            transparence et la qualité des données traitées.
          </p>
        </div>

        {/* Boutons navigation desktop */}
        <div className="hidden md:flex gap-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Carte précédente"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors flex items-center justify-center text-foreground"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Carte suivante"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors flex items-center justify-center text-foreground"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Le carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-6 md:pl-12 lg:pl-24 pr-6 md:pr-12 lg:pr-24 pb-4 hide-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {SYSTEMS.map((s, index) => {
          const Icon = s.Icon;
          return (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -4 }}
              className="snap-start flex-shrink-0 w-[85vw] max-w-[520px] md:w-[520px] min-h-[260px] relative rounded-2xl border border-white/5 hover:border-white/15 transition-colors p-8 group"
              style={{
                background:
                  "radial-gradient(circle at top left, #1a1a1a 0%, #0a0a0a 70%)",
              }}
            >
              <div className="flex gap-6 h-full">
                {/* Zone icône */}
                <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center p-3">
                  <Icon />
                </div>

                {/* Zone texte */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent/85 mb-3">
                    {s.category}
                  </p>
                  <h3 className="t-h3 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-foreground/55 leading-relaxed pr-8">
                    {s.description}
                  </p>
                </div>
              </div>

              {/* Bouton flèche bas-droite */}
              <button
                type="button"
                aria-label={`En savoir plus sur ${s.title}`}
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/25 transition-all flex items-center justify-center"
              >
                <ArrowUpRight className="w-4 h-4 text-foreground" strokeWidth={2} />
              </button>
            </motion.article>
          );
        })}
      </div>

      {/* Hint scroll mobile uniquement */}
      <div className="md:hidden mt-5 px-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
        <motion.span
          aria-hidden="true"
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <MoveHorizontal className="h-4 w-4" />
        </motion.span>
        <span>Glissez pour voir plus</span>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
