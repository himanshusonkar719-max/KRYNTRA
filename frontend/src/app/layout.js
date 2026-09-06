import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "KRYNTRA — Autonomous Cyber Defense & Continuous Assessment",
  description: "Continuous & autonomous agentic cybersecurity assessment platform with multi-engine scanning, AI-driven triage, and real-time compliance validation.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0f1d] text-[#f8fafc] font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


