"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mountTimeRef = useRef(Date.now());
  const lastSubmitRef = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ─── SPAM / BOT PROTECTION ──────────────────────────────
    // 1. Honeypot check: If bot filled the hidden honeypot trap, silently reject
    if (honeypot.trim().length > 0) {
      console.warn("Automated bot submission detected via honeypot trap.");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError("Security verification failed. Please try again.");
      }, 1000);
      return;
    }

    // 2. Submission speed check: Forms submitted < 400ms from mount are likely bots
    if (Date.now() - mountTimeRef.current < 400) {
      setError("Please take a moment before submitting the form.");
      return;
    }

    // 3. Rate limiting / Throttling check
    if (Date.now() - lastSubmitRef.current < 1500) {
      setError("Too many attempts. Please wait a moment before trying again.");
      return;
    }
    lastSubmitRef.current = Date.now();

    // ─── CLIENT VALIDATION ──────────────────────────────────
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid work email address (e.g. analyst@company.com).");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      trackEvent("user_login_success", { method: "password" });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
      trackEvent("user_login_failure", { reason: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#0a0f1d] text-[#f8fafc]">
      {/* Left Form Section */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-r border-[#1e293b]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">KRYNTRA</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-mono">v1.0</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-300">
              Sign in to monitor your attack surface and orchestrate autonomous security agents.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-start gap-3 animate-fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* ─── BOT HONEYPOT (Hidden from humans) ─────────────── */}
            <div className="sr-only" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <label htmlFor="website_honeypot_login">Do not fill this field</label>
              <input
                type="text"
                id="website_honeypot_login"
                name="website_honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="analyst@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#1e293b] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/register" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Need an account?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#1e293b] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Authenticate & Access Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-300">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        <div className="text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-[#1e293b] pt-4">
          <span>TLS 1.3 Strict · Zero Trust Architecture</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Cyber Telemetry Feature Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#070b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
            <span className="font-semibold text-emerald-400">ORCHESTRATOR ONLINE</span>
          </div>
          <span className="border border-slate-800 bg-[#0a0f1d] px-2.5 py-1 rounded text-slate-300">FASTAPI · REST + WS</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="p-4 rounded-xl bg-[#0e1626]/80 border border-[#1e293b] backdrop-blur space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>AGENT_STATUS_STREAM</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">PORT 8000</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-slate-200">
              <div className="flex items-center justify-between">
                <span>[SCANNER: Nmap Engine]</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[SCANNER: OWASP ZAP DAST]</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[SCANNER: Trivy Container CVE]</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[SANDBOX: Isolated Docker]</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold"><CheckCircle2 className="w-3 h-3" /> Armed</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Continuous & Autonomous Security Assessment
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              KRYNTRA unifies reconnaissance, dynamic application fuzzing, container audits, and LLM-assisted vulnerability verification in an autonomous feedback loop.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-slate-400 font-mono font-medium">
          <span>SOC2 COMPLIANT</span>
          <span>•</span>
          <span>ISO 27001 READY</span>
          <span>•</span>
          <span>NIST CSF 2.0</span>
        </div>
      </div>
    </main>
  );
}
