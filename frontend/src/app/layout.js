import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import CookieConsent from "@/app/components/CookieConsent";
import AnalyticsProvider from "@/app/components/AnalyticsProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kryntra.io";

export const viewport = {
  themeColor: "#0a0f1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KRYNTRA — Autonomous Cyber Defense & Continuous Assessment",
    template: "%s | KRYNTRA",
  },
  description:
    "Continuous & autonomous agentic cybersecurity assessment platform with multi-engine scanning (Nmap, OWASP ZAP, Trivy), AI-driven triage, and real-time compliance validation.",
  keywords: [
    "cybersecurity",
    "autonomous security",
    "agentic AI",
    "vulnerability scanner",
    "OWASP ZAP",
    "Nmap",
    "Trivy",
    "SOC2 compliance",
    "ISO 27001",
    "attack surface management",
    "penetration testing",
  ],
  authors: [{ name: "KRYNTRA Security Labs" }],
  creator: "KRYNTRA",
  publisher: "KRYNTRA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "KRYNTRA",
    title: "KRYNTRA — Autonomous Cyber Defense & Continuous Assessment",
    description:
      "Continuous & autonomous agentic cybersecurity assessment platform with multi-engine scanning, AI-driven triage, and real-time compliance validation.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "KRYNTRA Autonomous Cyber Defense Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KRYNTRA — Autonomous Cyber Defense & Continuous Assessment",
    description:
      "Continuous & autonomous agentic cybersecurity assessment platform with multi-engine scanning, AI-driven triage, and real-time compliance validation.",
    images: ["/opengraph-image"],
    creator: "@kryntra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0f1d] text-[#f8fafc] font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider>
              {children}
              <CookieConsent />
            </AnalyticsProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
