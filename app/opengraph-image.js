import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HID AI — L'infrastructure humaine de l'IA, depuis l'Afrique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image OpenGraph dynamique — affichée sur les partages sociaux (Twitter/X, LinkedIn,
 * Facebook, Slack, WhatsApp…). Générée via ImageResponse à l'edge.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 80% at 10% 0%, #16172a 0%, #0a0a0a 60%)",
          color: "#FAFAFA",
          padding: "72px 80px",
          fontFamily: "system-ui",
        }}
      >
        {/* Top — eyebrow + brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              letterSpacing: 4,
              color: "#c89530",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#c89530",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              D
            </span>
            HID AI
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#888" }}>
            hid-ai.com
          </div>
        </div>

        {/* Middle — main statement */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#888", letterSpacing: 1 }}>
            Hidea Solution
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.1,
              fontWeight: 600,
              color: "#FAFAFA",
            }}
          >
            L&rsquo;infrastructure humaine de l&rsquo;IA,
            <br />
            depuis l&rsquo;Afrique.
          </div>
        </div>

        {/* Bottom — tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#888",
            borderTop: "1px solid #222",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>
            AI Specialists · AI Engineers · Annotation premium
          </div>
          <div style={{ display: "flex", color: "#c89530" }}>500+ talents certifiés</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
