import Link from "next/link";
import { Shield, ArrowLeft, AlertTriangle, FileCheck, Scale, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions",
  description: "Terms of Service, Authorized Penetration Testing & Vulnerability Assessment Policy for KRYNTRA Autonomous Cyber Defense Platform.",
};

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>LEGAL & AUTHORIZED ASSESSMENT CHARTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service & Authorized Assessment Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last Updated: <span className="text-slate-200 font-medium">{lastUpdated}</span> · Version 1.4
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs sm:text-sm flex items-start gap-3 mb-12">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white block">Strict Authorization Requirement:</strong>
            <p className="text-amber-300/90 leading-relaxed">
              By initiating security scans, vulnerability tests, or network probes through KRYNTRA, you explicitly certify that you are the verified owner of the target assets, or hold written legal authorization from the asset owner to conduct offensive security testing.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By accessing, registering for, or operating the KRYNTRA platform (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of an enterprise or organization, you represent that you possess legal authority to bind that entity.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Authorized Use & Acceptable Target Policy</h2>
            <p>
              KRYNTRA is built exclusively for lawful defensive security assessments, vulnerability triage, and authorized penetration tests. Users must strictly adhere to the following rules:
            </p>
            <div className="space-y-2 pt-1">
              <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Target Ownership:</strong> You may only scan IP addresses, domain names, APIs, and cloud workloads that belong to your organization or for which you have explicit written consent.</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Malicious Exploitation:</strong> You may not use KRYNTRA to deploy malware, exfiltrate private credentials, cause Denial-of-Service (DoS), or disrupt third-party critical infrastructure.</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Safe Harbor & Compliance:</strong> Testing must conform to applicable international laws (including CFAA, Computer Misuse Act, and GDPR).</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. Platform Features & Automated Agents</h2>
            <p>
              KRYNTRA orchestrates simulated network discovery (Nmap), web fuzzing (OWASP ZAP), container vulnerability auditing (Trivy), and automated LLM triage. While our agents are designed to execute non-intrusive diagnostics, you acknowledge that active vulnerability scanning carries inherent residual risks to poorly-configured or fragile legacy systems. You agree to schedule intensive scans during approved maintenance windows.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Account Security & API Credentials</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and API tokens. You must immediately notify KRYNTRA at <a href="mailto:security@kryntra.io" className="text-cyan-400 hover:underline">security@kryntra.io</a> of any unauthorized account activity or compromised access keys.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Limitation of Liability & Disclaimers</h2>
            <p>
              KRYNTRA IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL KRYNTRA, ITS DIRECTORS, OR ITS EMPLOYEES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF SECURITY SCANS CONDUCTED ON UNAUTHORIZED SYSTEMS OR TARGET SERVICE DISRUPTIONS.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">6. Termination & Suspension</h2>
            <p>
              We reserve the right to immediately suspend or permanently terminate access to any account suspected of malicious targeting, abusive scanning patterns, or violation of our acceptable use charter without prior notice.
            </p>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-14 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Questions regarding compliance? Read our <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>.
          </div>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            Agree & Create Workspace
          </Link>
        </div>
      </main>
    </div>
  );
}
