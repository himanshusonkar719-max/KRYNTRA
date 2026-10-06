"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mountTimeRef = useRef(0);
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ─── SPAM / BOT PROTECTION ──────────────────────────────
    // 1. Honeypot check
    if (honeypot.trim().length > 0) {
      console.warn("Automated bot submission detected via honeypot trap.");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError("Security verification failed. Please try again.");
      }, 1000);
      return;
    }

    // 2. Submission speed check (< 500ms is inhuman)
    if (Date.now() - mountTimeRef.current < 500) {
      setError("Please take a moment before submitting the registration.");
      return;
    }

    // 3. Throttling
    if (Date.now() - lastSubmitRef.current < 1500) {
      setError("Too many registration attempts. Please wait a moment.");
      return;
    }
    lastSubmitRef.current = Date.now();

    // ─── CLIENT VALIDATION ──────────────────────────────────
    if (!name.trim()) {
      setError("Full name or organization handle is required.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (strength < 2) {
      setError("Please choose a stronger password containing numbers or uppercase letters.");
      return;
    }

    if (!termsAgreed) {
      setError("You must agree to the Terms of Service and Privacy Policy to create a security workspace.");
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      trackEvent("user_register_success", { role: "analyst" });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please check your details.");
      trackEvent("user_register_failure", { reason: err.message });
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
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-sm text-slate-300">
              Start continuous vulnerability discovery and autonomous security verification today.
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
            {/* ─── BOT HONEYPOT TRAP ─────────────────────────────── */}
            <div className="sr-only" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }}>
              <label htmlFor="website_honeypot_reg">Leave this empty</label>
              <input
                type="text"
                id="website_honeypot_reg"
                name="website_honeypot_register"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Full Name / Team Lead
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#1e293b] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                Secure Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#1e293b] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Password strength indicator */}
              <div className="mt-2 grid grid-cols-4 gap-1.5" aria-label={`Password strength: ${strength} out of 4`}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-colors ${
                      strength >= step
                        ? strength > 2
                          ? "bg-emerald-500"
                          : "bg-cyan-500"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                checked={termsAgreed}
                onChange={(e) => {
                  setTermsAgreed(e.target.checked);
                  if (error) setError("");
                }}
                className="w-4 h-4 mt-0.5 rounded bg-[#0f172a] border-[#1e293b] text-cyan-500 focus:ring-0 focus:outline-none cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline">
                  Terms of Service & Authorized Assessment Policy
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy" target="_blank" className="text-cyan-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
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
                    <span>Configuring Security Workspace...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Free Security Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign In
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

      {/* Right Feature Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#070b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 font-mono">
          <span className="text-cyan-400 font-bold">KRYNTRA ENGINE</span>
          <span className="border border-slate-800 bg-[#0a0f1d] px-2.5 py-1 rounded text-slate-300">AUTONOMOUS AGENTIC OPS</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Tri-Engine Autonomous Scans</h3>
                <p className="text-xs text-slate-300 mt-0.5">Orchestrates Nmap network recon, OWASP ZAP web fuzzing, and Trivy container CVE scans concurrently.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI-Powered Vulnerability Triage</h3>
                <p className="text-xs text-slate-300 mt-0.5">Automated exploit prioritization and false positive filtering grounded in OWASP Top 10 context.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Continuous Audit Readiness</h3>
                <p className="text-xs text-slate-300 mt-0.5">Real-time control mapping across SOC2 Type II, ISO 27001:2022, and NIST CSF 2.0 with instant export.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-mono">
          Enterprise Security Standard · Simulated Multi-Agent Pipeline
        </div>
      </div>
    </main>
  );
}
