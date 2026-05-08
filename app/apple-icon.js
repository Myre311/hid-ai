import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          borderRadius: 36,
        }}
      >
        <svg width="124" height="124" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="14" height="100" fill="#FAFAFA" />
          <line x1="14" y1="0" x2="100" y2="50" stroke="#FAFAFA" strokeWidth="3" strokeLinecap="square" />
          <line x1="14" y1="100" x2="100" y2="50" stroke="#FAFAFA" strokeWidth="3" strokeLinecap="square" />
          <g transform="translate(42.66, 50)">
            <polygon points="0,-22 3,0 -3,0" fill="#FAFAFA" />
            <polygon points="0,22 3,0 -3,0" fill="#FAFAFA" />
            <polygon points="-12,0 0,-3 0,3" fill="#FAFAFA" />
            <polygon points="32,0 0,-3 0,3" fill="#F4B41A" />
            <circle cx="0" cy="0" r="2.6" fill="#FAFAFA" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
