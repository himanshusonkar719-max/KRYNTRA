"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, Settings2, X, Check } from "lucide-react";
import { getCookieConsent, setCookieConsent } from "@/lib/analytics";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    // Check if consent has already been chosen
    const consent = getCookieConsent();
    if (!consent) {
      // Small delay for natural entrance
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent({ essential: true, analytics: true });
    setShowBanner(false);
    setShowModal(false);
  };

  const handleDeclineNonEssential = () => {
    setCookieConsent({ essential: true, analytics: false });
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    setCookieConsent({ essential: true, analytics: analyticsEnabled });
    setShowBanner(false);
    setShowModal(false);
  };

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* ─── FLOATING BOTTOM CONSENT BANNER ─────────────────── */}
      {showBanner && !showModal && (
        <aside
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 animate-fade-in"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1726]/95 border border-[#1e293b] backdrop-blur-xl shadow-2xl shadow-black/80 text-slate-100 flex flex-col gap-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Cookie className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Privacy & Telemetry Preferences
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  KRYNTRA uses strictly essential cookies for secure session authentication and optional anonymized telemetry to optimize diagnostic engines. We never sell or share scan target data.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1e293b]/80">
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <Link href="/privacy" className="hover:text-cyan-400 underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-cyan-400 underline underline-offset-2 transition-colors">
                  Terms of Service
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-[#334155] hover:border-slate-400 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Customize
                </button>
                <button
                  type="button"
                  onClick={handleDeclineNonEssential}
                  className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-xs font-medium text-slate-200 transition-colors"
                >
                  Essential Only
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold text-xs transition-colors shadow-md shadow-cyan-500/20"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ─── CUSTOMIZE PREFERENCES MODAL ────────────────────── */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base" id="cookie-modal-title">
                <Settings2 className="w-5 h-5 text-cyan-400" />
                <span>Customize Consent</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Essential Item */}
              <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Essential & Security Tokens</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Required for JWT session authentication, TLS token verification, and CSRF protection. Cannot be disabled.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0">
                  Always Active
                </span>
              </div>

              {/* Analytics Item */}
              <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <Cookie className="w-4 h-4 text-cyan-400" />
                    <span>Telemetry & Engine Metrics</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Anonymous crash reports and performance timing to help us optimize scanning benchmarks.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Toggle telemetry and engine metrics"
                  />
                  <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeclineNonEssential}
                className="px-4 py-2 rounded-lg border border-[#334155] hover:bg-[#1e293b] text-xs font-medium text-slate-300"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
