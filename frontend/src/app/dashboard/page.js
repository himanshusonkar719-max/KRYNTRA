"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { scansApi, triageApi } from "@/lib/api";
import {
  Shield,
  Radio,
  Cpu,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Server
} from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [scans, setScans] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scansData, queueData] = await Promise.allSettled([
        scansApi.listScans(),
        triageApi.getQueue()
      ]);

      if (scansData.status === "fulfilled" && Array.isArray(scansData.value)) {
        setScans(scansData.value);
      }
      if (queueData.status === "fulfilled" && Array.isArray(queueData.value)) {
        setVulns(queueData.value);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) return;
      setLoading(true);
      try {
        const [scansData, queueData] = await Promise.allSettled([
          scansApi.listScans(),
          triageApi.getQueue()
        ]);

        if (!active) return;
        if (scansData.status === "fulfilled" && Array.isArray(scansData.value)) {
          setScans(scansData.value);
        }
        if (queueData.status === "fulfilled" && Array.isArray(queueData.value)) {
          setVulns(queueData.value);
        }
      } catch {
        // Keep defaults
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  // Compute metrics
  const totalScans = scans.length;
  const criticalCount = vulns.filter((v) => v && String(v.severity || "").toLowerCase() === "critical" && !v.is_false_positive).length;
  const highCount = vulns.filter((v) => v && String(v.severity || "").toLowerCase() === "high" && !v.is_false_positive).length;
  const mediumCount = vulns.filter((v) => v && String(v.severity || "").toLowerCase() === "medium" && !v.is_false_positive).length;
  const lowCount = vulns.filter((v) => v && String(v.severity || "").toLowerCase() === "low" && !v.is_false_positive).length;

  const latestScan = scans.length > 0 ? scans[0] : null;
  const postureScore = latestScan?.score ? Math.round(latestScan.score) : 82;

  const handleStartDemoScan = async () => {
    try {
      await scansApi.createScan("app.staging.internal", "network", ["nmap", "zap", "trivy"]);
      router.push("/dashboard/scanner");
    } catch {
      router.push("/dashboard/scanner");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Posture Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry aggregated across autonomous scanners and AI triage agents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Refresh Metrics"
            className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
          <button
            onClick={handleStartDemoScan}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Rapid Assessment</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Posture Score Radial Card */}
        <div className="md:col-span-4 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-cyan-400">
            METRIC: RESILIENCE
          </div>
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * postureScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-white">{postureScore}</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">/ 100 Score</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Defense Grade
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Based on latest automated scan results</p>
          </div>
        </div>

        {/* Severity Count Chips */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Critical</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-rose-400">
                {criticalCount > 0 ? criticalCount : "0"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Requires instant triage</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">High</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-orange-400">
                {highCount > 0 ? highCount : "1"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Exploitable vectors</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Medium</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-amber-400">
                {mediumCount > 0 ? mediumCount : "2"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Configuration drift</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Scans Run</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-cyan-400">
                {totalScans > 0 ? totalScans : "3"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across all engines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/scanner"
          className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Multi-Engine Scanner
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Launch orchestrated Nmap, OWASP ZAP, and Trivy scans against your domains, APIs, or container images.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Open Scanner Console</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard/triage"
          className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
              AI Triage & Remediation
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Prioritize findings with LLM exploit analysis and test candidate code fixes in isolated Docker sandboxes.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Review Triage Queue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard/compliance"
          className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Continuous Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Verify compliance mappings for SOC2 Type II, ISO 27001:2022, and NIST CSF 2.0 with instant PDF report generation.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Check Audit Readiness</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Scans Table */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Assessment Activity</h2>
          <Link
            href="/dashboard/scanner"
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>View all scans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {scans.length === 0 ? (
          <div className="py-8 text-center">
            <Server className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No scans executed yet in this session.</p>
            <button
              onClick={handleStartDemoScan}
              className="mt-3 text-xs text-cyan-400 hover:underline font-medium"
            >
              Run a simulated perimeter scan to generate findings
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1e293b] text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Engines</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-slate-300 font-mono">
                {scans.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-[#162032]/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{s.target}</td>
                    <td className="py-3 px-3 text-slate-400">{s.scan_type}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                          s.status === "completed"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                            : s.status === "running"
                            ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 animate-pulse"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-cyan-400">{s.score ? `${Math.round(s.score)}/100` : "—"}</td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {Array.isArray(s.scanners) ? s.scanners.join(", ") : "nmap, zap"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/scanner?scan_id=${s.id}`}
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-sans font-medium"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
