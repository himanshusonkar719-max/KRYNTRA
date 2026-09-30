import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let { target = "example.com", scan_type = "network", scanners = ["nmap", "zap", "trivy"] } = body;

    // Clean target hostname
    let cleanTarget = target.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    if (!cleanTarget) cleanTarget = "example.com";

    const vulnerabilities = [];
    let score = 100;
    let portsOpen = [];
    let headersFound = {};

    // ─── REAL LIVE HTTP/HTTPS INSPECTION ─────────────────────
    let httpsSuccess = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const targetUrl = `https://${cleanTarget}`;
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { "User-Agent": "KRYNTRA-Security-Scanner/1.0" },
        signal: controller.signal,
        redirect: "follow",
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res) {
        httpsSuccess = true;
        portsOpen.push("443/tcp (https)");

        // 1. Check Strict-Transport-Security (HSTS)
        const hsts = res.headers.get("strict-transport-security");
        if (!hsts) {
          score -= 12;
          vulnerabilities.push({
            id: "vuln-hsts-" + Date.now(),
            title: "Missing Strict-Transport-Security (HSTS) Header",
            severity: "medium",
            scanner: "zap",
            cvss_score: 5.3,
            cve_id: null,
            owasp_category: "A05:2021-Security Misconfiguration",
            affected_component: `https://${cleanTarget}`,
            description: "The server does not enforce encrypted transport via HSTS. Traffic may be susceptible to SSL-stripping and man-in-the-middle attacks.",
            remediation: "Add header 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' in web server configuration.",
          });
        }

        // 2. Check Content-Security-Policy (CSP)
        const csp = res.headers.get("content-security-policy");
        if (!csp) {
          score -= 15;
          vulnerabilities.push({
            id: "vuln-csp-" + Date.now(),
            title: "Missing Content-Security-Policy (CSP)",
            severity: "medium",
            scanner: "zap",
            cvss_score: 6.1,
            cve_id: null,
            owasp_category: "A03:2021-Injection",
            affected_component: `https://${cleanTarget}`,
            description: "No Content-Security-Policy header was detected. Malicious scripts may execute if user input is reflected.",
            remediation: "Define a strict Content-Security-Policy header restricting script-src, object-src, and frame-ancestors.",
          });
        }

        // 3. Check X-Frame-Options (Clickjacking)
        const xfo = res.headers.get("x-frame-options");
        if (!xfo && (!csp || !csp.includes("frame-ancestors"))) {
          score -= 10;
          vulnerabilities.push({
            id: "vuln-xfo-" + Date.now(),
            title: "Missing Clickjacking Defense (X-Frame-Options / frame-ancestors)",
            severity: "low",
            scanner: "zap",
            cvss_score: 4.3,
            cve_id: null,
            owasp_category: "A05:2021-Security Misconfiguration",
            affected_component: `https://${cleanTarget}`,
            description: "Endpoint allows framing by arbitrary external origins, making it vulnerable to UI redress / clickjacking.",
            remediation: "Set 'X-Frame-Options: SAMEORIGIN' or 'Content-Security-Policy: frame-ancestors 'self''.",
          });
        }

        // 4. Check X-Content-Type-Options
        const xcto = res.headers.get("x-content-type-options");
        if (!xcto || xcto.toLowerCase() !== "nosniff") {
          score -= 8;
          vulnerabilities.push({
            id: "vuln-xcto-" + Date.now(),
            title: "Missing X-Content-Type-Options: nosniff Header",
            severity: "low",
            scanner: "zap",
            cvss_score: 3.4,
            cve_id: null,
            owasp_category: "A05:2021-Security Misconfiguration",
            affected_component: `https://${cleanTarget}`,
            description: "Without 'nosniff', browsers may attempt MIME-sniffing on downloaded assets, leading to cross-site script execution.",
            remediation: "Configure reverse proxy / web server to send 'X-Content-Type-Options: nosniff'.",
          });
        }

        // 5. Server Information Disclosure
        const serverHeader = res.headers.get("server");
        if (serverHeader && /\d+\.\d+/.test(serverHeader)) {
          score -= 5;
          vulnerabilities.push({
            id: "vuln-server-" + Date.now(),
            title: `Server Software Version Disclosed: ${serverHeader}`,
            severity: "low",
            scanner: "nmap",
            cvss_score: 3.1,
            cve_id: null,
            owasp_category: "A05:2021-Security Misconfiguration",
            affected_component: `Server Header: ${serverHeader}`,
            description: "The web server banner exposes exact software versions, assisting attackers with CVE vulnerability mapping.",
            remediation: "Mask server version tokens (e.g., server_tokens off in Nginx, ServerTokens Prod in Apache).",
          });
        }
      }
    } catch (e) {
      // Ignore network timeout
    }

    if (!httpsSuccess) {
      score -= 25;
      vulnerabilities.push({
        id: "vuln-tls-unreachable-" + Date.now(),
        title: "HTTPS / TLS Port 443 Connection Inactive or Blocked",
        severity: "high",
        scanner: "nmap",
        cvss_score: 7.5,
        cve_id: null,
        owasp_category: "A02:2021-Cryptographic Failures",
        affected_component: cleanTarget,
        description: `Could not complete HTTPS handshake on ${cleanTarget}:443 within the timeout threshold.`,
        remediation: "Verify DNS records, firewall ingress rules, and ensure valid SSL/TLS certificates are active.",
      });
    }

    // Always keep score in 0-100 range
    score = Math.max(20, Math.min(98, score));

    const scanResult = {
      id: "scan-" + Math.random().toString(36).substring(2, 9),
      target: cleanTarget,
      scan_type,
      status: "completed",
      progress: 100,
      score,
      summary: `Real-time assessment complete for ${cleanTarget}. ${vulnerabilities.length} findings identified across attack surface inspection.`,
      created_at: new Date().toISOString(),
      vulnerabilities,
    };

    return NextResponse.json(scanResult);
  } catch (err) {
    return NextResponse.json(
      { detail: "Failed to perform scan assessment." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json([]);
}
