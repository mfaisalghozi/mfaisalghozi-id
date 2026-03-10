import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "mfaisalghozi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  let iconSrc: string | null = null;
  try {
    const iconData = readFileSync(join(process.cwd(), "app/icon.png"));
    iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;
  } catch {
    // icon.png not found — render OG image without the avatar
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b1118",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          gap: "60px",
        }}
      >
        {iconSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={iconSrc}
            width={220}
            height={220}
            style={{ borderRadius: "50%" }}
            alt="mfaisalghozi"
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
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
      </div>
    ),
    { ...size },
  );
}
