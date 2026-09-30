import Link from "next/link";
import { Shield, ArrowLeft, Home, Search, Compass, AlertCircle } from "lucide-react";

export const metadata = {
  title: "404 - Endpoint Not Found",
  description: "The requested route or perimeter resource does not exist on this network.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-[#1e293b] bg-[#0a0f1d]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-wider text-white">KRYNTRA</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-200 transition-colors"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* Center 404 Hero */}
      <div className="max-w-2xl mx-auto px-4 py-16 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-mono mb-6">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>HTTP 404 // RESOURCE UNREACHABLE</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white mb-4">
          404<span className="text-cyan-400">_</span>
        </h1>

        <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-3">
          Perimeter Endpoint Not Found
        </h2>

        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          The route or resource you attempted to reach is either restricted, deprecated, or outside the monitored attack surface perimeter.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safe Perimeter</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Security Dashboard</span>
          </Link>
        </div>

        {/* Quick Diagnostic Links */}
        <div className="mt-12 p-4 rounded-xl bg-[#0f172a]/60 border border-[#1e293b] text-left">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Suggested Navigation Vectors:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link href="/dashboard/scanner" className="p-2 rounded bg-[#0a0f1d] hover:text-cyan-400 text-slate-300 border border-[#1e293b] transition-colors">
              → Multi-Engine Scanner
            </Link>
            <Link href="/dashboard/triage" className="p-2 rounded bg-[#0a0f1d] hover:text-cyan-400 text-slate-300 border border-[#1e293b] transition-colors">
              → AI Exploit Triage
            </Link>
            <Link href="/dashboard/compliance" className="p-2 rounded bg-[#0a0f1d] hover:text-cyan-400 text-slate-300 border border-[#1e293b] transition-colors">
              → Compliance Audit
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-[#1e293b] text-center text-xs text-slate-400">
        <div>KRYNTRA Security Platform · Zero Trust Architecture</div>
      </footer>
    </main>
  );
}
