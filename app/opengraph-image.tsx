import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "mfaisalghozi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b1118",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#e5edf7",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          mfaisalghozi
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          Software Engineer & An Optimistic Nihilism
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: "#22c1a4",
          }}
        >
          mfaisalghozi.id
        </div>
      </div>
    ),
    { ...size },
  );
}
