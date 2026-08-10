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
          background: "#b9512e",
          borderRadius: 40,
        }}
      >
        <svg width="96" height="96" viewBox="0 0 32 32" fill="none">
          <path
            d="M9 16.5l4.5 4.5L23 11"
            stroke="#fffdf7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
