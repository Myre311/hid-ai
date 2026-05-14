"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { TestLayout } from "@/components/evaluation/TestLayout";
import { ContextCard } from "@/components/evaluation/ContextCard";
import { getTestBySlug } from "@/lib/evaluation/tests";
import {
  getCvSceneSetForSession,
  getCvTrackingSetForSession,
  CV_GROUND_TRUTH as DEFAULT_GROUND_TRUTH,
  CV_POLYGON_TARGET as DEFAULT_POLYGON_TARGET,
  CV_TRACKING_GROUND_TRUTH as DEFAULT_TRACKING,
} from "@/lib/evaluation/data/cv-ground-truth";
import { FrameSequenceAnnotator } from "@/components/evaluation/cv/FrameSequenceAnnotator";

const TEST = getTestBySlug("computer-vision");

// mode: "boxes" | "polygon" | "tracking"
const MODES = {
  boxes: "boxes",
  polygon: "polygon",
  tracking: "tracking",
};

function getNormalized(e, rect) {
  const point = e.touches?.[0] || e.changedTouches?.[0] || e;
  return {
    x: (point.clientX - rect.left) / rect.width,
    y: (point.clientY - rect.top) / rect.height,
  };
}

export default function ComputerVisionPage() {
  const [mode, setMode] = useState(MODES.boxes);
  const [imageIdx, setImageIdx] = useState(0);
  // boxes : { imageId: [{x,y,w,h,attr}] }
  const [boxes, setBoxes] = useState({});
  const [draft, setDraft] = useState(null);
  // Polygone (image dédiée)
  const [polygon, setPolygon] = useState([]);
  const [polygonClosed, setPolygonClosed] = useState(false);
  // Tracking
  const [trackingAnnotations, setTrackingAnnotations] = useState({});
  // Session : on récupère l'ID pour piocher les bonnes variantes du pool.
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/evaluation/get-session")
      .then((r) => r.json())
      .then((j) => { if (alive) setSessionId(j?.session?.id || null); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Pool déterministe → set bbox + polygone pour CETTE session.
  // Fallback aux variantes par défaut si la session n'est pas encore chargée.
  const { groundTruth, polygonTarget, trackingSet } = useMemo(() => {
    if (!sessionId) {
      return {
        groundTruth: DEFAULT_GROUND_TRUTH,
        polygonTarget: DEFAULT_POLYGON_TARGET,
        trackingSet: DEFAULT_TRACKING,
      };
    }
    const set = getCvSceneSetForSession(sessionId);
    const tracking = getCvTrackingSetForSession(sessionId);
    return {
      groundTruth: set.ground_truth,
      polygonTarget: set.polygon_target,
      trackingSet: tracking,
    };
  }, [sessionId]);

  const CV_GROUND_TRUTH = groundTruth;
  const CV_POLYGON_TARGET = polygonTarget;
  const CV_TRACKING_GROUND_TRUTH = trackingSet;
  const image = CV_GROUND_TRUTH[imageIdx];
  const currentBoxes = boxes[image.id] || [];

  // --- Bounding box handlers ---

  const startDraw = (e, rect) => {
    const pos = getNormalized(e, rect);
    setDraft({ startX: pos.x, startY: pos.y, x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const moveDraw = (e, rect) => {
    if (!draft) return;
    const pos = getNormalized(e, rect);
    const x = Math.min(draft.startX, pos.x);
    const y = Math.min(draft.startY, pos.y);
    const w = Math.abs(pos.x - draft.startX);
    const h = Math.abs(pos.y - draft.startY);
    setDraft({ ...draft, x, y, w, h });
  };

  const endDraw = () => {
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

  // Mouse handlers (bbox)
  const onMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    startDraw(e, rect);
  };
  const onMouseMove = (e) => {
    if (!draft) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveDraw(e, rect);
  };
  const onMouseUp = () => endDraw();
  const onMouseLeave = () => endDraw();

  // Touch handlers (bbox)
  const onTouchStart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    startDraw(e, rect);
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (!draft) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveDraw(e, rect);
  };
  const onTouchEnd = (e) => {
    e.preventDefault();
    endDraw();
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

  // --- Polygone handlers ---

  const onPolygonClick = (e) => {
    if (polygonClosed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = getNormalized(e, rect);
    setPolygon((p) => [...p, { x: pos.x, y: pos.y }]);
  };

  const onPolygonTouchEnd = (e) => {
    e.preventDefault();
    if (polygonClosed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = getNormalized(e, rect);
    setPolygon((p) => [...p, { x: pos.x, y: pos.y }]);
  };

  // --- Stats ---

  const casesProcessed = Object.keys(boxes).filter(
    (k) => (boxes[k] || []).length > 0
  ).length;

  const trackingAnnotatedCount = Object.keys(trackingAnnotations).length;

  const canSubmit =
    casesProcessed >= 3 && polygon.length >= CV_POLYGON_TARGET.minPoints;

  const totalCasesProcessed =
    casesProcessed +
    (polygon.length > 0 ? 1 : 0) +
    (trackingAnnotatedCount > 0 ? 1 : 0);

  return (
    <TestLayout
      test={TEST}
      canSubmit={canSubmit}
      getAnswers={() => ({ boxes, polygon, tracking: trackingAnnotations })}
      casesProcessed={totalCasesProcessed}
      totalCases={CV_GROUND_TRUTH.length + 2}
    >
      <ContextCard title="Pipeline d'annotation Computer Vision HID AI">
        <p>
          Vous allez annoter trois types de données utilisés en production
          pour entraîner des modèles de détection en milieu urbain :
          (1) des <strong>bounding boxes</strong> avec attributs sur 5 scènes
          (feux, voitures, panneau STOP, personnes, vélos), (2) un{" "}
          <strong>polygone</strong> précis sur une vue aérienne, et (3) le{" "}
          <strong>tracking</strong> d&rsquo;un objet sur 50 frames avec
          occlusions. Visez un <strong>IoU &gt; 0.7</strong> et choisissez le
          bon attribut pour chaque box.
        </p>
      </ContextCard>

      {/* Mode selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          type="button"
          onClick={() => setMode(MODES.boxes)}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            mode === MODES.boxes
              ? "border-accent bg-accent/15 text-accent"
              : "border-white/15 text-foreground/75 hover:bg-white/5"
          }`}
        >
          Partie 1 — Bounding boxes ({casesProcessed} / {CV_GROUND_TRUTH.length})
        </button>
        <button
          type="button"
          onClick={() => setMode(MODES.polygon)}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            mode === MODES.polygon
              ? "border-accent bg-accent/15 text-accent"
              : "border-white/15 text-foreground/75 hover:bg-white/5"
          }`}
        >
          Partie 2 — Polygone ({polygon.length} pts)
        </button>
        <button
          type="button"
          onClick={() => setMode(MODES.tracking)}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            mode === MODES.tracking
              ? "border-accent bg-accent/15 text-accent"
              : "border-white/15 text-foreground/75 hover:bg-white/5"
          }`}
        >
          Partie 3 — Object tracking ({trackingAnnotatedCount} / 50)
        </button>
      </div>

      {/* --- Bounding boxes mode --- */}
      {mode === MODES.boxes && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
            <strong className="text-accent">Consigne :</strong>{" "}
            {image.instruction}
          </div>

          <div
            className="relative bg-[#181820] rounded-lg overflow-hidden border border-white/10 select-none"
            style={{ aspectRatio: `${image.width || 640} / ${image.height || 480}` }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full cursor-crosshair"
              style={{ touchAction: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
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
              <image
                href={image.image || `/evaluation/cv/bboxes/${image.id}.svg`}
                width="100"
                height="100"
                preserveAspectRatio="none"
              />
              <rect width="100" height="100" fill="url(#grid)" opacity="0.25" />

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
      )}

      {/* --- Polygone mode --- */}
      {mode === MODES.polygon && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
            <strong className="text-accent">Consigne :</strong>{" "}
            {CV_POLYGON_TARGET.instruction}
          </div>

          <div
            className="relative bg-[#181820] rounded-lg overflow-hidden border border-white/10 select-none"
            style={{
              aspectRatio: `${CV_POLYGON_TARGET.width || 640} / ${CV_POLYGON_TARGET.height || 480}`,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className={`absolute inset-0 w-full h-full ${
                polygonClosed ? "cursor-default" : "cursor-crosshair"
              }`}
              style={{ touchAction: "none" }}
              onClick={onPolygonClick}
              onTouchEnd={onPolygonTouchEnd}
            >
              <image
                href={CV_POLYGON_TARGET.image || "/evaluation/cv/polygon/poly-1.svg"}
                width="100"
                height="100"
                preserveAspectRatio="none"
              />
              <rect width="100" height="100" fill="url(#grid)" opacity="0.2" />

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

      {/* --- Tracking mode --- */}
      {mode === MODES.tracking && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-surface border border-white/10 p-3 text-sm text-foreground/85">
            <strong className="text-accent">Consigne :</strong>{" "}
            {CV_TRACKING_GROUND_TRUTH.videoContext} — Dessinez une bounding box
            sur la personne (<code className="text-accent">person-1</code>) pour
            chaque frame. Les frames en orange indiquent une occlusion partielle.
          </div>
          <FrameSequenceAnnotator
            frames={CV_TRACKING_GROUND_TRUTH.frames}
            annotations={trackingAnnotations}
            onChange={setTrackingAnnotations}
            width={CV_TRACKING_GROUND_TRUTH.width || 640}
            height={CV_TRACKING_GROUND_TRUTH.height || 360}
          />
        </div>
      )}
    </TestLayout>
  );
}
