import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "KRYNTRA — Autonomous Cyber Defense & Continuous Assessment Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f1d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(10,15,29,0) 70%)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #06b6d4, #2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(6, 182, 212, 0.4)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "2px", color: "#ffffff" }}>
                KRYNTRA
              </span>
              <span style={{ fontSize: "14px", color: "#38bdf8", fontWeight: "600", letterSpacing: "1px" }}>
                AGENTIC DEFENSE PLATFORM
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              color: "#38bdf8",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            ENTERPRISE v1.0
          </div>
        </div>

        {/* Middle Main Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            Autonomous Cyber Defense & Continuous Assessment
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            Simulated multi-engine reconnaissance (Nmap, OWASP ZAP, Trivy) paired with LLM exploit validation and continuous SOC2 / ISO compliance auditing.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "15px", fontWeight: "600" }}>
            <span style={{ color: "#06b6d4" }}>●</span> Tri-Engine Scanner
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "15px", fontWeight: "600" }}>
            <span style={{ color: "#10b981" }}>●</span> AI Exploit Triage
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "15px", fontWeight: "600" }}>
            <span style={{ color: "#06b6d4" }}>●</span> SOC2 / ISO 27001 Mapping
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "15px", fontWeight: "600" }}>
            <span style={{ color: "#10b981" }}>●</span> Zero Trust Architecture
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
