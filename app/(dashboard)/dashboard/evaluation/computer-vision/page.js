"use client";

import { useMemo, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { getTestBySlug } from "@/lib/evaluation/tests";
import { CV_GROUND_TRUTH } from "@/lib/evaluation/data/cv-ground-truth";

const TEST = getTestBySlug("computer-vision");

export default function ComputerVisionPage() {
  const [imageIdx, setImageIdx] = useState(0);
  // boxes : { imageId: [{x,y,w,h}] }
  const [boxes, setBoxes] = useState({});
  const [draft, setDraft] = useState(null); // { startX, startY, x, y, w, h }

  const image = CV_GROUND_TRUTH[imageIdx];
  const currentBoxes = boxes[image.id] || [];

  const onMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDraft({ startX: x, startY: y, x, y, w: 0, h: 0 });
  };
  const onMouseMove = (e) => {
    if (!draft) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    const x = Math.min(draft.startX, cx);
    const y = Math.min(draft.startY, cy);
    const w = Math.abs(cx - draft.startX);
    const h = Math.abs(cy - draft.startY);
    setDraft({ ...draft, x, y, w, h });
  };
  const onMouseUp = () => {
    if (!draft) return;
    if (draft.w > 0.02 && draft.h > 0.02) {
      const next = { ...boxes };
      next[image.id] = [...(next[image.id] || []), {
        x: draft.x, y: draft.y, w: draft.w, h: draft.h,
      }];
      setBoxes(next);
    }
    setDraft(null);
  };
  const removeBox = (i) => {
    const next = { ...boxes };
    next[image.id] = (next[image.id] || []).filter((_, idx) => idx !== i);
    setBoxes(next);
  };

  const casesProcessed = Object.keys(boxes).filter(
    (k) => (boxes[k] || []).length > 0
  ).length;
  const canSubmit = casesProcessed >= 3; // au moins 3 images annotées

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({ boxes })}
      casesProcessed={casesProcessed}
      totalCases={CV_GROUND_TRUTH.length}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
          <strong className="text-accent">Consigne :</strong> {image.instruction}
        </div>

        {/* Canvas zone */}
        <div className="relative aspect-video bg-[#181820] rounded-lg overflow-hidden border border-white/10 select-none">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full cursor-crosshair"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Placeholder pattern (motif décoratif puisque on n'a pas de vraies images V1) */}
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#2a2a32" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#52525b" fontSize="3">
              {image.label}
            </text>

            {/* Boxes existantes */}
            {currentBoxes.map((b, i) => (
              <g key={i}>
                <rect
                  x={b.x * 100}
                  y={b.y * 100}
                  width={b.w * 100}
                  height={b.h * 100}
                  fill="rgba(244,180,26,0.18)"
                  stroke="#F4B41A"
                  strokeWidth="0.3"
                />
                <text
                  x={b.x * 100 + 1}
                  y={b.y * 100 + 3}
                  fontSize="2"
                  fill="#F4B41A"
                  className="pointer-events-none"
                >
                  #{i + 1}
                </text>
              </g>
            ))}

            {/* Draft en cours */}
            {draft && (
              <rect
                x={draft.x * 100}
                y={draft.y * 100}
                width={draft.w * 100}
                height={draft.h * 100}
                fill="rgba(244,180,26,0.1)"
                stroke="#F4B41A"
                strokeWidth="0.25"
                strokeDasharray="0.5"
              />
            )}
          </svg>
        </div>

        {/* Liste des boxes */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-foreground/40 uppercase tracking-[0.18em]">
            Boxes pour cette image · {currentBoxes.length}
          </p>
          {currentBoxes.length === 0 ? (
            <p className="text-xs text-foreground/40 italic">
              Cliquez-glissez sur l&rsquo;image pour dessiner une bounding box.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {currentBoxes.map((b, i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/15 bg-surface text-xs text-foreground/85"
                >
                  <span className="font-mono tabular-nums">
                    #{i + 1} · {(b.w * 100).toFixed(0)}×{(b.h * 100).toFixed(0)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBox(i)}
                    aria-label="Supprimer"
                    className="text-foreground/55 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nav images */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => setImageIdx((i) => Math.max(0, i - 1))}
            disabled={imageIdx === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Image précédente
          </button>
          <span className="text-xs text-foreground/50">
            Image {imageIdx + 1} / {CV_GROUND_TRUTH.length}
          </span>
          <button
            type="button"
            onClick={() =>
              setImageIdx((i) => Math.min(CV_GROUND_TRUTH.length - 1, i + 1))
            }
            disabled={imageIdx === CV_GROUND_TRUTH.length - 1}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
          >
            Image suivante
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </TestLayout>
  );
}
