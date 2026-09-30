"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Terminal,
  Activity,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Server,
  Layers,
  Lock,
  FileCheck,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function LandingPage() {
  const router = useRouter();
  const [targetInput, setTargetInput] = useState("");
  const [activeTab, setActiveTab] = useState("perimeter");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanError, setScanError] = useState("");

  const handleQuickScan = (e) => {
    e.preventDefault();
    setScanError("");
    const query = targetInput.trim();

    if (!query) {
      setScanError("Please enter a domain or IP address to initiate the scan.");
      return;
    }

    // Basic sanitize
    const sanitized = query.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    trackEvent("quick_scan_initiated", { target: sanitized });
    router.push(`/dashboard/scanner?target=${encodeURIComponent(sanitized)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] selection:bg-cyan-500 selection:text-black">
      {/* ─── TOP NAVBAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0f1d]/90 border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="KRYNTRA Home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-wider text-white">KRYNTRA</span>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Agentic v1.0
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-200" aria-label="Main Navigation">
            <a href="#diagnostic" className="hover:text-cyan-400 transition-colors">
              Live Diagnostic
            </a>
            <a href="#pillars" className="hover:text-cyan-400 transition-colors">
              Attack Vectors
            </a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">
              Autonomous Loop
            </a>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              Terms
            </Link>
          </nav>

          {/* Desktop CTA / Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-white px-3.5 py-2 rounded-lg transition-colors hover:bg-[#1e293b]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 px-4 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <span>Launch Free Scan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/register"
              className="text-xs font-bold bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-lg shadow-sm"
            >
              Scan
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1e293b] bg-[#0f172a] px-4 py-5 space-y-4 animate-fade-in">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-200">
              <a
                href="#diagnostic"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
              >
                Live Diagnostic
              </a>
              <a
                href="#pillars"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
              >
                Attack Vectors
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
              >
                Autonomous Loop
              </a>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1e293b] transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
            <div className="pt-3 border-t border-[#1e293b] flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg border border-[#334155] text-slate-200 font-semibold text-sm hover:bg-[#1e293b]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md"
              >
                Launch Free Scan
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── SCANNER HERO ────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-mono mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-subtle" />
            <span>CONTINUOUS & AUTONOMOUS AGENTIC CYBER DEFENSE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Discover, Triage & Remediate Security Threats at Machine Speed
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Orchestrates simulated multi-engine reconnaissance (Nmap, OWASP ZAP, Trivy) paired with LLM exploit validation and continuous compliance auditing.
          </p>

          {/* Quick Domain Scanner Input */}
          <form onSubmit={handleQuickScan} className="mt-10 max-w-xl mx-auto" noValidate>
            <div className="p-1.5 bg-[#0f172a] border border-[#1e293b] rounded-xl flex flex-col sm:flex-row items-center shadow-xl shadow-black/40 focus-within:border-cyan-500/80 transition-colors gap-2 sm:gap-0">
              <div className="w-full flex items-center flex-1">
                <div className="pl-3 pr-2 text-slate-400">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => {
                    setTargetInput(e.target.value);
                    if (scanError) setScanError("");
                  }}
                  placeholder="Enter domain or IP (e.g. app.corp.internal)"
                  aria-label="Target domain or IP address for vulnerability assessment"
                  className="w-full bg-transparent py-2.5 px-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 text-sm font-bold rounded-lg shrink-0 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Run Free Scan</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            {scanError && (
              <p className="mt-2 text-xs text-rose-400 font-medium text-left px-2">{scanError}</p>
            )}
            <p className="mt-2 text-xs text-slate-400">
              Zero agent install required · Simulated non-intrusive perimeter diagnostics
            </p>
          </form>

          {/* Telemetry Stats Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-[#1e293b]">
              <div className="text-2xl font-bold font-mono text-cyan-400">3-in-1</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Nmap, ZAP, Trivy Engines</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-[#1e293b]">
              <div className="text-2xl font-bold font-mono text-emerald-400">99.2%</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">AI False-Positive Reduction</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-[#1e293b]">
              <div className="text-2xl font-bold font-mono text-cyan-400">&lt; 30s</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Autonomous Scan Cycle</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f172a]/80 border border-[#1e293b]">
              <div className="text-2xl font-bold font-mono text-emerald-400">SOC2 / ISO</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Instant Audit Readiness</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE DIAGNOSTIC SECTION ─────────────────────────── */}
      <section id="diagnostic" className="py-20 border-t border-[#1e293b] bg-[#070b14]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              <span>INTERACTIVE TELEMETRY</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Real-Time Security Posture Diagnostics
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Explore dynamic posture measurements across attack surfaces, supply chain, and compliance.
            </p>
          </div>

          {/* Diagnostic Widget */}
          <div className="p-6 lg:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] max-w-5xl mx-auto shadow-2xl shadow-black/60">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse-subtle" />
                <span className="text-sm font-mono text-slate-200 font-medium">TARGET: prod-cluster-us-east.kryntra.io</span>
              </div>
              {/* Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0a0f1d] border border-[#1e293b] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("perimeter")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === "perimeter"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Perimeter Recon
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("container")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === "container"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Container CVEs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("compliance")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === "compliance"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Compliance
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8 pt-6 items-center">
              {/* Radial Gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#0a0f1d] border border-[#1e293b]">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1e293b"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="45"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold font-mono text-white">82</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">Security Score</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> High Resilience Status
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">2 critical exposures remediated</div>
                </div>
              </div>

              {/* Detail Items */}
              <div className="md:col-span-7 space-y-3 font-mono text-xs">
                {activeTab === "perimeter" && (
                  <>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Server className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>tcp/443 (HTTPS nginx/1.24)</span>
                      </div>
                      <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">PASSED (TLS 1.3)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        <span>tcp/6379 (Redis Unauthenticated)</span>
                      </div>
                      <span className="text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40">CRITICAL EXPOSURE</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Lock className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>OWASP A03 (SQL Injection Check)</span>
                      </div>
                      <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">1 FINDING TRIAGED</span>
                    </div>
                  </>
                )}

                {activeTab === "container" && (
                  <>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Layers className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>node:18-alpine base image</span>
                      </div>
                      <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">CVE-2023-3817</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Cpu className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>Docker Rootless Execution</span>
                      </div>
                      <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">COMPLIANT</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Shield className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>Simulated Sandbox Patch Test</span>
                      </div>
                      <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">VERIFIED SAFE</span>
                    </div>
                  </>
                )}

                {activeTab === "compliance" && (
                  <>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <FileCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>SOC2 Type II Controls</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">83.3% Readied</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <FileCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>ISO 27001:2022 Controls</span>
                      </div>
                      <span className="text-emerald-400 font-semibold">80.0% Compliant</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-200">
                        <FileCheck className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                        <span>NIST CSF 2.0 Identifier Matrix</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">80.0% Verified</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ATTACK PILLARS ──────────────────────────────────── */}
      <section id="pillars" className="py-24 border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Comprehensive Multi-Engine Assessment Pillars
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Synchronized agents cover every layer from network topology to application logic and supply-chain dependencies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-5">
                <Server className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Network Reconnaissance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nmap-driven port mapping, service discovery, outdated daemon detection, and insecure protocol analysis.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-5">
                <Terminal className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Dynamic Web DAST</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                OWASP ZAP active & passive crawler testing for SQLi, XSS, SSRF, broken access control, and misconfigured HTTP headers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-5">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Container CVE Scans</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trivy integration inspecting container layers, npm/pip dependency graphs, and embedded secrets in Docker images.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-5">
                <Cpu className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">AI Triage & Sandbox</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exploitability assessment filtering out false positives and validating candidate remediation patches in isolated sandboxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW STEPS ──────────────────────────────────── */}
      <section id="workflow" className="py-20 border-t border-[#1e293b] bg-[#070b14]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              The Autonomous Assessment Lifecycle
            </h2>
            <p className="mt-3 text-slate-300 text-sm">
              From zero-touch target submission to actionable, regression-tested remediation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] relative">
              <span className="text-3xl font-extrabold font-mono text-cyan-500/20 absolute top-4 right-4">01</span>
              <h3 className="text-base font-bold text-white mb-2">Multi-Engine Discovery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter your perimeter URL or IP. KRYNTRA orchestrates parallel scanners to establish a complete digital footprint.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] relative">
              <span className="text-3xl font-extrabold font-mono text-cyan-500/20 absolute top-4 right-4">02</span>
              <h3 className="text-base font-bold text-white mb-2">Contextual AI Prioritization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                LLM agents correlate CVE severity, OWASP categorization, and external reachability to eliminate alert fatigue.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0f172a] border border-[#1e293b] relative">
              <span className="text-3xl font-extrabold font-mono text-cyan-500/20 absolute top-4 right-4">03</span>
              <h3 className="text-base font-bold text-white mb-2">Sandbox Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Synthetic patches are verified inside disposable Docker test harnesses before recommendations are presented to your engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA (Unified Call To Action) ──────────────── */}
      <section className="py-20 border-t border-[#1e293b] relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>INSTANT DEPLOYMENT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to secure your perimeter autonomously?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Experience continuous attack surface monitoring, AI-driven triage, and automated compliance reports right from your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Free Scan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0f172a] hover:bg-[#162032] border border-[#1e293b] text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Live Console</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#1e293b] text-xs text-slate-400 bg-[#070b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-white tracking-wider text-sm">KRYNTRA Autonomous Cyber Defense</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/dashboard/scanner" className="hover:text-cyan-400 transition-colors">
                Scanner
              </Link>
              <Link href="/dashboard/compliance" className="hover:text-cyan-400 transition-colors">
                Compliance
              </Link>
              <Link href="/login" className="hover:text-cyan-400 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-cyan-400 transition-colors">
                Register
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>© 2026 KRYNTRA Security Platform · Zero Trust Architecture · All Rights Reserved</div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>TLS 1.3 · STRICT CSP · HSTS PRELOADED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
