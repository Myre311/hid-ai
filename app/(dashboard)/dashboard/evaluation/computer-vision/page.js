"use client";

import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import {
  CV_GROUND_TRUTH,
  CV_POLYGON_TARGET,
} from "@/lib/evaluation/data/cv-ground-truth";

const TEST = getTestBySlug("computer-vision");

export default function ComputerVisionPage() {
  const [imageIdx, setImageIdx] = useState(0);
  // boxes : { imageId: [{x,y,w,h,attr}] }
  const [boxes, setBoxes] = useState({});
  const [draft, setDraft] = useState(null);
  // Polygone (image dédiée)
  const [polygon, setPolygon] = useState([]);
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [showPolygon, setShowPolygon] = useState(false);

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
      next[image.id] = [
        ...(next[image.id] || []),
        { x: draft.x, y: draft.y, w: draft.w, h: draft.h, attr: "" },
      ];
      setBoxes(next);
    }
    setDraft(null);
  };
  const removeBox = (i) => {
    const next = { ...boxes };
    next[image.id] = (next[image.id] || []).filter((_, idx) => idx !== i);
    setBoxes(next);
  };
  const setBoxAttr = (i, value) => {
    const next = { ...boxes };
    const arr = [...(next[image.id] || [])];
    arr[i] = { ...arr[i], attr: value };
    next[image.id] = arr;
    setBoxes(next);
  };

  // Polygone
  const onPolygonClick = (e) => {
    if (polygonClosed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPolygon((p) => [...p, { x, y }]);
  };

  const casesProcessed = Object.keys(boxes).filter(
    (k) => (boxes[k] || []).length > 0
  ).length;

  const canSubmit =
    casesProcessed >= 3 && polygon.length >= CV_POLYGON_TARGET.minPoints;

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({ boxes, polygon })}
      casesProcessed={casesProcessed + (polygon.length > 0 ? 1 : 0)}
      totalCases={CV_GROUND_TRUTH.length + 1}
    >
      <ContextCard title="Pipeline d'annotation industrielle HID AI">
        <p>
          Pour entraîner un modèle de détection sur des chantiers en Afrique de
          l&rsquo;Ouest, vous devez annoter (1) des bounding boxes avec
          attributs sur 5 images et (2) un polygone précis sur une vue aérienne.
          Visez un <strong>IoU &gt; 0.7</strong> et choisissez le bon attribut
          pour chaque box.
        </p>
      </ContextCard>

      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShowPolygon(false)}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            !showPolygon
              ? "border-accent bg-accent/15 text-accent"
              : "border-white/15 text-foreground/75 hover:bg-white/5"
          }`}
        >
          Partie 1 — Bounding boxes ({casesProcessed} / {CV_GROUND_TRUTH.length})
        </button>
        <button
          type="button"
          onClick={() => setShowPolygon(true)}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            showPolygon
              ? "border-accent bg-accent/15 text-accent"
              : "border-white/15 text-foreground/75 hover:bg-white/5"
          }`}
        >
          Partie 2 — Polygone ({polygon.length} pts)
        </button>
      </div>

      {!showPolygon ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
            <strong className="text-accent">Consigne :</strong>{" "}
            {image.instruction}
          </div>

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
              <defs>
                <pattern
                  id="grid"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 5 0 L 0 0 0 5"
                    fill="none"
                    stroke="#2a2a32"
                    strokeWidth="0.15"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#52525b"
                fontSize="3"
              >
                {image.label}
              </text>

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

          <div className="flex flex-col gap-2">
            <p className="text-xs text-foreground/40 uppercase tracking-[0.18em]">
              Boxes pour cette image · {currentBoxes.length}
            </p>
            {currentBoxes.length === 0 ? (
              <p className="text-xs text-foreground/40 italic">
                Cliquez-glissez sur l&rsquo;image pour dessiner une bounding box.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {currentBoxes.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-md border border-white/15 bg-surface text-xs text-foreground/85"
                  >
                    <span className="font-mono tabular-nums w-20">
                      #{i + 1} · {(b.w * 100).toFixed(0)}×
                      {(b.h * 100).toFixed(0)}
                    </span>
                    <select
                      value={b.attr || ""}
                      onChange={(e) => setBoxAttr(i, e.target.value)}
                      className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-md px-2 h-8 text-xs text-foreground focus:outline-none focus:border-accent"
                    >
                      <option value="" className="bg-[#0A0A0B]">
                        Attribut…
                      </option>
                      {image.attributes.map((a) => (
                        <option key={a} value={a} className="bg-[#0A0A0B]">
                          {a}
                        </option>
                      ))}
                    </select>
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
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
            <strong className="text-accent">Consigne :</strong>{" "}
            {CV_POLYGON_TARGET.instruction}
          </div>

          <div className="relative aspect-video bg-[#181820] rounded-lg overflow-hidden border border-white/10 select-none">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className={`absolute inset-0 w-full h-full ${
                polygonClosed ? "cursor-default" : "cursor-crosshair"
              }`}
              onClick={onPolygonClick}
            >
              <rect width="100" height="100" fill="url(#grid)" />
              {/* Cible visuelle : forme floue centrale */}
              <circle cx="50" cy="50" r="28" fill="#1f1f2a" stroke="#3a3a44" strokeWidth="0.4" />
              <text x="50" y="51" textAnchor="middle" dominantBaseline="middle" fill="#4a4a55" fontSize="3">
                {CV_POLYGON_TARGET.label}
              </text>

              {/* Polygone en cours */}
              {polygon.length > 0 && (
                <polyline
                  points={polygon.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
                  fill={polygonClosed ? "rgba(244,180,26,0.18)" : "none"}
                  stroke="#F4B41A"
                  strokeWidth="0.3"
                />
              )}
              {polygonClosed && polygon.length > 0 && (
                <polygon
                  points={polygon.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
                  fill="rgba(244,180,26,0.18)"
                  stroke="#F4B41A"
                  strokeWidth="0.3"
                />
              )}
              {polygon.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x * 100}
                  cy={p.y * 100}
                  r="0.8"
                  fill="#F4B41A"
                />
              ))}
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPolygon([]);
                setPolygonClosed(false);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => setPolygonClosed(true)}
              disabled={polygon.length < CV_POLYGON_TARGET.minPoints}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-accent text-background text-xs font-medium hover:bg-accent-hover disabled:opacity-40"
            >
              Fermer le polygone
            </button>
            <span className="text-xs text-foreground/50">
              {polygon.length} / {CV_POLYGON_TARGET.minPoints} points minimum
            </span>
          </div>
        </div>
      )}
    </TestLayout>
  );
}
