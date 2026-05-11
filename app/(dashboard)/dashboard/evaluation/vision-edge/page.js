"use client";

import { useState } from "react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { TechnicalQuiz } from "@/components/evaluation/TechnicalQuiz";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { VISION_EDGE_DATA } from "@/lib/evaluation/data/vision-edge-data";

const TEST = getTestBySlug("vision-edge");

export default function VisionEdgePage() {
  const [quiz, setQuiz] = useState({});
  const [calc, setCalc] = useState({ size_mb: "", fps: "", justification: "" });

  const quizCount = Object.keys(quiz).length;
  const calcDone =
    String(calc.size_mb).trim() !== "" &&
    String(calc.fps).trim() !== "" &&
    (calc.justification || "").trim().length >= 100;
  const total = quizCount + (calcDone ? 1 : 0);

  const canSubmit = quizCount === VISION_EDGE_DATA.quiz.length && calcDone;

  const setCalcField = (k, v) => setCalc((p) => ({ ...p, [k]: v }));

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({
        quiz: Object.entries(quiz).map(([id, choice]) => ({ id, choice })),
        calc: {
          size_mb: Number(calc.size_mb),
          fps: Number(calc.fps),
          justification: calc.justification,
        },
      })}
      casesProcessed={total}
      totalCases={VISION_EDGE_DATA.quiz.length + 1}
    >
      <ContextCard title="Optimisation Edge — surveillance locale confidentielle">
        <p>
          Vous devez optimiser un modèle <strong>YOLOv8</strong> de détection
          d&rsquo;objets pour qu&rsquo;il tourne sur un appareil mobile ou un petit serveur
          local — sans envoyer les images dans le cloud. C&rsquo;est le cas d&rsquo;usage
          typique surveillance industrielle avec contrainte de
          <strong> confidentialité</strong>. Stack : YOLOv8, ONNX, TensorRT,
          quantification INT8. Livrable : modèle quantifié avec gain FPS mesuré.
        </p>
      </ContextCard>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="t-h3 mb-2">Partie 1 — Quiz technique</h2>
          <p className="text-sm text-foreground/55 mb-4">
            10 questions sur la quantification, edge inference et formats de modèles.
          </p>
          <TechnicalQuiz
            questions={VISION_EDGE_DATA.quiz}
            value={quiz}
            onChange={setQuiz}
          />
        </section>

        <section>
          <h2 className="t-h3 mb-2">Partie 2 — Calcul d&rsquo;optimisation</h2>
          <p className="text-sm text-foreground/55 mb-4">
            Soit un <strong>{VISION_EDGE_DATA.scenario.model}</strong> en FP32 qui
            pèse <strong>{VISION_EDGE_DATA.scenario.initial_size_mb} MB</strong> et
            tourne à <strong>{VISION_EDGE_DATA.scenario.initial_fps} FPS</strong>{" "}
            sur CPU. Après quantification INT8 + déploiement via ONNX Runtime :
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <NumField
              label="Taille INT8 estimée (MB)"
              value={calc.size_mb}
              onChange={(v) => setCalcField("size_mb", v)}
            />
            <NumField
              label="FPS estimé après optimisation"
              value={calc.fps}
              onChange={(v) => setCalcField("fps", v)}
            />
          </div>

          <label className="flex flex-col gap-1.5 mt-4">
            <span className="text-xs uppercase tracking-[0.14em] text-foreground/50">
              Justification (≥ 100 caractères)
            </span>
            <textarea
              rows={4}
              value={calc.justification}
              onChange={(e) => setCalcField("justification", e.target.value)}
              placeholder="Expliquez le ratio de quantification (FP32 → INT8 = ×4), le gain typique de FPS sur ONNX Runtime, et les éventuels trade-offs (calibration, perte mAP)."
              className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent"
            />
            <span className="text-[10px] text-foreground/40 text-right">
              {(calc.justification || "").length} / 100 min
            </span>
          </label>
        </section>
      </div>
    </TestLayout>
  );
}

function NumField({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.14em] text-foreground/50">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1A1A1A] border border-white/10 rounded-md px-3 h-11 text-sm text-foreground focus:outline-none focus:border-accent"
      />
    </label>
  );
}
