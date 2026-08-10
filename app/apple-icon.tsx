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
            d="M10 10 A6 6 0 0 0 10 22"
            stroke="#fffdf7"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M14 8 L14 24 M14 8 L19 8 M14 15 L18 15"
            stroke="#fffdf7"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 8 L25 16 M30 8 L25 16 L25 25"
            stroke="#fffdf7"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
