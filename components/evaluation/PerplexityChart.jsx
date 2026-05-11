/**
 * Graphique SVG simple de courbe Perplexity.
 * Affiche la baisse de perplexity sur N epochs (axe X) sur une échelle 0-50.
 */
export function PerplexityChart({ curve }) {
  if (!curve || curve.length === 0) return null;
  const W = 600;
  const H = 220;
  const PADDING = { top: 20, right: 16, bottom: 32, left: 40 };
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top - PADDING.bottom;

  const xMax = Math.max(...curve.map((p) => p.epoch));
  const yMax = Math.max(...curve.map((p) => p.value), 50);

  const xScale = (e) => PADDING.left + (e / xMax) * innerW;
  const yScale = (v) => PADDING.top + innerH - (v / yMax) * innerH;

  const pathD = curve
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.epoch)},${yScale(p.value)}`)
    .join(" ");

  // Lignes horizontales
  const yTicks = [0, 10, 20, 30, 40, 50];

  return (
    <div className="rounded-lg border border-white/10 bg-surface p-4 overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Courbe de perplexity sur 10 epochs"
      >
        {/* Y-axis grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PADDING.left}
              x2={W - PADDING.right}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 8}
              y={yScale(t) + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(255,255,255,0.4)"
            >
              {t}
            </text>
          </g>
        ))}

        {/* X-axis ticks */}
        {curve.map((p) => (
          <text
            key={p.epoch}
            x={xScale(p.epoch)}
            y={H - 10}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.4)"
          >
            {p.epoch}
          </text>
        ))}

        {/* Curve area */}
        <path
          d={`${pathD} L${xScale(xMax)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`}
          fill="rgba(244,180,26,0.08)"
        />

        {/* Curve line */}
        <path d={pathD} fill="none" stroke="#F4B41A" strokeWidth="2" />

        {/* Points */}
        {curve.map((p) => (
          <circle
            key={p.epoch}
            cx={xScale(p.epoch)}
            cy={yScale(p.value)}
            r="3.5"
            fill="#F4B41A"
            stroke="#0A0A0B"
            strokeWidth="1.5"
          />
        ))}

        {/* Start / end values */}
        <text
          x={xScale(0)}
          y={yScale(curve[0].value) - 10}
          fontSize="11"
          fill="#FAFAFA"
          textAnchor="start"
        >
          {curve[0].value}
        </text>
        <text
          x={xScale(xMax)}
          y={yScale(curve[curve.length - 1].value) - 10}
          fontSize="11"
          fill="#FAFAFA"
          textAnchor="end"
        >
          {curve[curve.length - 1].value}
        </text>

        {/* Axis labels */}
        <text
          x={W / 2}
          y={H - 2}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.55)"
        >
          Epochs
        </text>
        <text
          x={12}
          y={H / 2}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.55)"
          transform={`rotate(-90, 12, ${H / 2})`}
        >
          Perplexity
        </text>
      </svg>
    </div>
  );
}
