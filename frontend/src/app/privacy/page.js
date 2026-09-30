import Link from "next/link";
import { Shield, ArrowLeft, Lock, Database, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how KRYNTRA protects your personal data, handles scan targets under zero-knowledge principles, and complies with global privacy standards.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 28, 2026";

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0f1d]/90 border-b border-[#1e293b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-wider text-white">KRYNTRA</span>
          </Link>

          <Link
            href="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="border-b border-[#1e293b] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-mono mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>ZERO-KNOWLEDGE SECURITY STANDARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Protection
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last Updated: <span className="text-slate-200 font-medium">{lastUpdated}</span> · Effective Date: January 1, 2026
          </p>
        </div>

        {/* Policy Summary Callouts */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
            <Database className="w-5 h-5 text-cyan-400 mb-2" />
            <h2 className="text-sm font-bold text-white">Zero Target Data Sharing</h2>
            <p className="text-xs text-slate-300 mt-1">Your endpoints, vulnerability findings, and code telemetry are never sold or used for public model training.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
            <Lock className="w-5 h-5 text-emerald-400 mb-2" />
            <h2 className="text-sm font-bold text-white">End-to-End Encryption</h2>
            <p className="text-xs text-slate-300 mt-1">TLS 1.3 in transit and AES-256 at rest with customer-managed or isolated key enclaves.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
            <Eye className="w-5 h-5 text-cyan-400 mb-2" />
            <h2 className="text-sm font-bold text-white">Full GDPR / CCPA Rights</h2>
            <p className="text-xs text-slate-300 mt-1">Instant export, rectification, and hard deletion of all account data upon request.</p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Information We Collect</h2>
            <p>
              KRYNTRA (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;platform&rdquo;) operates under strict data minimization principles. We collect only the information necessary to authenticate users, deliver continuous autonomous vulnerability assessments, and ensure infrastructure stability:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Account Information:</strong> Name, work email address, hashed credentials, and organizational role provided during registration.
              </li>
              <li>
                <strong className="text-white">Scan Target Configuration:</strong> User-submitted domain names, IP addresses, CIDR blocks, API schema definitions, and container repository links.
              </li>
              <li>
                <strong className="text-white">Diagnostic & Assessment Logs:</strong> Output generated by integrated scanning engines (Nmap, OWASP ZAP, Trivy), AI exploit triage ratings, and compliance mapping records.
              </li>
              <li>
                <strong className="text-white">Telemetry & Security Audit Logs:</strong> IP addresses connecting to our API, request timestamps, user-agent metadata, and authentication attempt logs used for security monitoring and brute-force prevention.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. How We Use Target and Scan Data</h2>
            <p>
              We treat security assessment results as strictly confidential customer proprietary information. We do NOT:
            </p>
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>We never train public foundational LLMs on customer vulnerability disclosures or proprietary code.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>We never disclose customer perimeter vulnerabilities to any external third parties or advertisers.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>We isolate scanning containers and ephemeral sandboxes immediately following assessment completion.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. Cookies & Session Storage</h2>
            <p>
              KRYNTRA uses local storage and HTTP cookies strictly to maintain authenticated user sessions (JWT bearer tokens) and remember your security interface preferences (such as dark mode and telemetry consent). You can inspect, modify, or revoke your cookie preferences at any time via our Cookie Consent controls.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Data Retention & Hard Deletion</h2>
            <p>
              Assessment artifacts and triage logs are retained for the duration of your active subscription to maintain audit trails (SOC2, ISO 27001, NIST). Upon account closure or upon receiving a data erasure request, all associated assessment databases, triage reports, and encryption keys are purged within 30 calendar days.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. International Privacy Compliance (GDPR & CCPA)</h2>
            <p>
              If you reside in the European Economic Area (EEA), United Kingdom, or California, you possess statutory rights under the GDPR and CCPA:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-300">
              <li>Right of access and data portability</li>
              <li>Right to rectification of inaccurate personal records</li>
              <li>Right to erasure (&ldquo;Right to be Forgotten&rdquo;)</li>
              <li>Right to restriction and objection of processing</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">6. Security Contact & Data Protection Officer</h2>
            <p>
              If you have inquiries regarding this policy, need to submit an erasure request, or wish to report a security disclosure, contact our Security Team:
            </p>
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] font-mono text-xs text-slate-300 space-y-1">
              <div>Email: <a href="mailto:privacy@kryntra.io" className="text-cyan-400 hover:underline">privacy@kryntra.io</a></div>
              <div>Security Team: <a href="mailto:security@kryntra.io" className="text-cyan-400 hover:underline">security@kryntra.io</a></div>
              <div>Address: KRYNTRA Security Labs, Global Operations Division</div>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-14 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Need details on authorized scanning rules? Read our <Link href="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>.
          </div>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            Create Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}
