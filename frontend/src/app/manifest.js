export default function manifest() {
  return {
    name: "KRYNTRA Autonomous Cyber Defense Platform",
    short_name: "KRYNTRA",
    description: "Continuous and autonomous agentic cybersecurity assessment platform with multi-engine scanning, LLM exploit validation, and real-time compliance validation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1d",
    theme_color: "#06b6d4",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
