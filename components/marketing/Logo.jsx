import { cn } from "@/lib/utils/cn";

/**
 * HID AI logo, currentColor-driven so it inherits the parent text color.
 * The amber arrow (compass east) stays #F4B41A — the brand accent — regardless of color context.
 *
 * Variants:
 *   - "lockup" (default) — full HID AI wordmark, viewBox 395×100
 *   - "mark"             — just the D + compass icon, viewBox 100×100, useful for favicons / small spots
 */
export function Logo({ variant = "lockup", className, ...rest }) {
  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        role="img"
        aria-label="HID AI"
        className={cn("inline-block h-7 w-7", className)}
        {...rest}
      >
        <title>HID AI</title>
        <g fill="currentColor">
          <rect x="0" y="0" width="14" height="100" />
          <line x1="14" y1="0" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <line x1="14" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <g transform="translate(38, 50)">
            <polygon points="0,-22 3,0 -3,0" />
            <polygon points="0,22 3,0 -3,0" />
            <polygon points="-12,0 0,-3 0,3" />
            <polygon points="32,0 0,-3 0,3" fill="#F4B41A" />
            <circle cx="0" cy="0" r="2.2" fill="currentColor" />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 395 100"
      role="img"
      aria-label="HID AI"
      className={cn("inline-block h-6 w-auto", className)}
      {...rest}
    >
      <title>HID AI</title>
      <g fill="currentColor">
        {/* H */}
        <rect x="0" y="0" width="14" height="100" />
        <rect x="0" y="43" width="70" height="14" />
        <rect x="70" y="0" width="14" height="100" />
        {/* I */}
        <rect x="110" y="0" width="14" height="100" />
        {/* D triangular outline + compass rose */}
        <g transform="translate(160, 0)">
          <rect x="0" y="0" width="14" height="100" />
          <line x1="14" y1="0" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <line x1="14" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <g transform="translate(38, 50)">
            <polygon points="0,-22 3,0 -3,0" />
            <polygon points="0,22 3,0 -3,0" />
            <polygon points="-12,0 0,-3 0,3" />
            <polygon points="32,0 0,-3 0,3" fill="#F4B41A" />
            <circle cx="0" cy="0" r="2.2" fill="currentColor" />
          </g>
        </g>
      </g>

      {/* AI */}
      <g transform="translate(295, 0)" fill="currentColor">
        <polygon points="0,100 28,0 32,0 4,100" />
        <polygon points="56,100 28,0 32,0 60,100" />
        <polygon points="28,0 32,0 30,8" />
        <rect x="14" y="62" width="32" height="12" />
        <rect x="86" y="0" width="14" height="100" />
      </g>
    </svg>
  );
}
