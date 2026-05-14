"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TRACKING_SPRITES } from "@/lib/evaluation/data/cv-tracking-sprites";

function getNormalized(e, rect) {
  const point = e.touches?.[0] || e.changedTouches?.[0] || e;
  return {
    x: (point.clientX - rect.left) / rect.width,
    y: (point.clientY - rect.top) / rect.height,
  };
}

/**
 * @param {{ frames: Array<{ frameNumber: number, imagePath: string, isOcclusion: boolean }>, annotations: Record<number, { bbox: { x: number, y: number, w: number, h: number }, objectId: string }>, onChange: (annotations: Record<number, any>) => void }} props
 */
export function FrameSequenceAnnotator({ frames, annotations, onChange }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [drawing, setDrawing] = useState(null);

  const frame = frames[currentFrame];
  const annotated = annotations[currentFrame];
  const annotatedCount = Object.keys(annotations).length;

  // --- Drawing handlers (mouse + touch) ---

  const startDraw = (e, rect) => {
    const pos = getNormalized(e, rect);
    setDrawing({ startX: pos.x, startY: pos.y, x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const moveDraw = (e, rect) => {
    if (!drawing) return;
    const pos = getNormalized(e, rect);
    const x = Math.min(drawing.startX, pos.x);
    const y = Math.min(drawing.startY, pos.y);
    const w = Math.abs(pos.x - drawing.startX);
    const h = Math.abs(pos.y - drawing.startY);
    setDrawing({ ...drawing, x, y, w, h });
  };

  const endDraw = () => {
    if (!drawing) return;
    if (drawing.w > 0.02 && drawing.h > 0.02) {
      const next = { ...annotations };
      next[currentFrame] = {
        bbox: { x: drawing.x, y: drawing.y, w: drawing.w, h: drawing.h },
        objectId: "person-1",
      };
      onChange(next);
    }
    setDrawing(null);
  };

  // Mouse handlers
  const onMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    startDraw(e, rect);
  };
  const onMouseMove = (e) => {
    if (!drawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveDraw(e, rect);
  };
  const onMouseUp = () => endDraw();
  const onMouseLeave = () => endDraw();

  // Touch handlers
  const onTouchStart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    startDraw(e, rect);
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveDraw(e, rect);
  };
  const onTouchEnd = (e) => {
    e.preventDefault();
    endDraw();
  };

  const getFrameButtonClass = (i) => {
    const isCurrent = i === currentFrame;
    const isAnnotated = !!annotations[i];
    const isOcc = frames[i]?.isOcclusion;

    if (isCurrent)
      return "w-6 h-6 rounded text-[10px] font-bold bg-accent text-background";
    if (isAnnotated)
      return "w-6 h-6 rounded text-[10px] bg-green-500/30 text-green-400";
    if (isOcc)
      return "w-6 h-6 rounded text-[10px] bg-amber-500/10 text-amber-300/60";
    return "w-6 h-6 rounded text-[10px] bg-white/5 text-foreground/40";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header info */}
      <div className="flex items-center justify-between text-xs text-foreground/60">
        <span>
          {annotatedCount} / 50 frames annotées
        </span>
        {frame?.isOcclusion && (
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[11px] font-medium border border-amber-500/25">
            Occlusion partielle
          </span>
        )}
        <span className="font-mono">
          Frame {currentFrame + 1} / {frames.length}
        </span>
      </div>

      {/* SVG canvas */}
      <div
        className="relative bg-[#181820] rounded-lg overflow-hidden border border-white/10 select-none"
        style={{ aspectRatio: "640 / 360" }}
      >
        <svg
          viewBox="0 0 640 360"
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
          <image
            href={frame?.imagePath}
            x="0"
            y="0"
            width="640"
            height="360"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Overlay piéton — sprite illustré choisi par la session */}
          {frame?.personOverlay && (() => {
            const p = frame.personOverlay;
            const W = 640, H = 360;
            const cx = p.x * W + (p.w * W) / 2;
            const top = p.y * H;
            const w = p.w * W;
            const h = p.h * H;
            const stride = (p.stride || 0) * W;
            const spriteIdx = (frame.spriteIdx ?? 0) % TRACKING_SPRITES.length;
            const Sprite = TRACKING_SPRITES[spriteIdx];
            return Sprite ? <Sprite cx={cx} top={top} w={w} h={h} stride={stride} /> : null;
          })()}

          {frame?.occluderOverlay && (() => {
            const o = frame.occluderOverlay;
            const W = 640, H = 360;
            const p = frame.personOverlay;
            const cx = p.x * W + (p.w * W) / 2;
            const top = p.y * H;
            const w = p.w * W;
            const h = p.h * H;
            if (o.type === "pole") {
              return <rect x={cx - 4} y={top - 30} width={8} height={h + 60} fill="#1c1d28" stroke="#0f1018" strokeWidth={0.5} opacity={0.94} />;
            }
            // vehicle : voiture passe au premier plan, couvre le bas de la silhouette
            return (
              <g transform={`translate(${cx - 90}, ${top + h * 0.5})`}>
                <rect x={0} y={0} width={180} height={32} rx={3} fill="#2a2c3a" stroke="#0f1018" strokeWidth={0.8} />
                <rect x={5} y={5} width={170} height={12} fill="#0a0a12" opacity={0.85} />
                <circle cx={32} cy={32} r={8} fill="#0f1018" />
                <circle cx={148} cy={32} r={8} fill="#0f1018" />
              </g>
            );
          })()}

          {/* HUD frame counter */}
          <g>
            <rect x={6} y={6} width={130} height={22} rx={3} fill="rgba(0,0,0,0.6)" />
            <text x={12} y={21} fontFamily="monospace" fontSize={12} fill="#e8e8ef">
              CAM · {String(frame?.frameNumber || 0).padStart(2, "0")}/{frames.length}
            </text>
          </g>

          {/* Existing annotation */}
          {annotated && (
            <rect
              x={annotated.bbox.x * 640}
              y={annotated.bbox.y * 360}
              width={annotated.bbox.w * 640}
              height={annotated.bbox.h * 360}
              fill="rgba(244,180,26,0.18)"
              stroke="#F4B41A"
              strokeWidth="1.5"
            />
          )}

          {/* Draft in progress */}
          {drawing && (
            <rect
              x={drawing.x * 640}
              y={drawing.y * 360}
              width={drawing.w * 640}
              height={drawing.h * 360}
              fill="rgba(244,180,26,0.10)"
              stroke="#F4B41A"
              strokeWidth="1.5"
              strokeDasharray="4"
            />
          )}
        </svg>
      </div>

      {/* Prev / Next nav */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCurrentFrame((f) => Math.max(0, f - 1))}
          disabled={currentFrame === 0}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </button>
        <button
          type="button"
          onClick={() =>
            setCurrentFrame((f) => Math.min(frames.length - 1, f + 1))
          }
          disabled={currentFrame === frames.length - 1}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-white/15 text-xs text-foreground/85 hover:bg-white/5 disabled:opacity-40"
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mini-timeline */}
      <div className="flex flex-wrap gap-1">
        {frames.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentFrame(i)}
            className={getFrameButtonClass(i)}
            aria-label={`Frame ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
