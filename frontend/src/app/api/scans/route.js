import { NextResponse } from "next/server";

const scansStore = [
  {
    id: "scan-sample-01",
    target: "api.kryntra.internal",
    scan_type: "network",
    status: "completed",
    progress: 100,
    score: 82,
    summary: "Reconnaissance completed. 2 ports open, 1 medium TLS configuration finding detected.",
    created_at: new Date().toISOString(),
    vulnerabilities: [
      {
        id: "vuln-01",
        title: "TLS 1.0 / 1.1 Legacy Cipher Suite Enabled",
        severity: "medium",
        cvss_score: 5.3,
        cve_id: "CVE-2023-TLS-01",
        description: "Deprecated cryptographic protocol negotiation accepted on port 443.",
        remediation: "Enforce TLS 1.3 strict with elliptic curve Diffie-Hellman ephemeral suites.",
        triage_status: "verified",
      },
      {
        id: "vuln-02",
        title: "Missing X-Content-Type-Options Header",
        severity: "low",
        cvss_score: 3.1,
        cve_id: null,
        description: "MIME sniffing risk allows browsers to misinterpret file content types.",
        remediation: "Set X-Content-Type-Options: nosniff on all reverse proxy endpoints.",
        triage_status: "verified",
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json(scansStore);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { target = "example.com", scan_type = "network" } = body;

  const newScan = {
    id: "scan-" + Math.random().toString(36).substring(2, 9),
    target,
    scan_type,
    status: "completed",
    progress: 100,
    score: Math.floor(75 + Math.random() * 20),
    summary: `Multi-engine assessment complete for ${target}. Reconnaissance verified.`,
    created_at: new Date().toISOString(),
    vulnerabilities: scansStore[0].vulnerabilities,
  };

  scansStore.unshift(newScan);
  return NextResponse.json(newScan);
}
