import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// a tiny yellow plate with the blue NL strip
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a09",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 60,
            height: 36,
            borderRadius: 6,
            overflow: "hidden",
            border: "3px solid #fff",
            background: "#f7c600",
          }}
        >
          <div style={{ display: "flex", width: 14, background: "#0a3fa3" }} />
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              color: "#111",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            AM
          </div>
        </div>
      </div>
    ),
    size,
  );
}
