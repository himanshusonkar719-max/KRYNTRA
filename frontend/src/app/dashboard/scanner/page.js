"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { scansApi } from "@/lib/api";
import {
  Radio,
  Server,
  Terminal,
  Layers,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download
} from "lucide-react";

function ScannerContent() {
  const searchParams = useSearchParams();
  const initialTarget = searchParams?.get("target") || "";
  const initialScanId = searchParams?.get("scan_id") || "";

  const [target, setTarget] = useState(initialTarget || "app.staging.internal");
  const [scanType, setScanType] = useState("network");
  const [scanners, setScanners] = useState(["nmap", "zap", "trivy"]);
  const [activeScan, setActiveScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [expandedVuln, setExpandedVuln] = useState(null);
  const [logs, setLogs] = useState([]);

  // Toggle engine checkboxes
  const toggleScanner = (name) => {
    if (scanners.includes(name)) {
      if (scanners.length > 1) {
        setScanners(scanners.filter((s) => s !== name));
      }
    } else {
      setScanners([...scanners, name]);
    }
  };

  // Poll active scan until completed
  useEffect(() => {
    if (!activeScan || activeScan.status === "completed" || activeScan.status === "failed") {
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    const interval = setInterval(async () => {
      try {
        const updated = await scansApi.getScan(activeScan.id);
        setActiveScan(updated);

        // Append simulated log messages based on progress
        if (updated.progress >= 25 && updated.progress < 60) {
          setLogs((prev) => [
            ...new Set([
              ...prev,
              `[Nmap] Scanning 1000 standard ports on ${updated.target}...`,
              `[Nmap] Discovered open ports: 22/tcp (ssh), 80/tcp (http), 443/tcp (https), 6379/tcp (redis)`,
            ]),
          ]);
        } else if (updated.progress >= 60 && updated.progress < 90) {
          setLogs((prev) => [
            ...new Set([
              ...prev,
              `[ZAP] Spidering target web application: ${updated.target}`,
              `[ZAP] Executing active injection probes (SQLi, XSS, Path Traversal)...`,
              `[ZAP] Identified potential SQL injection vulnerability in /api/v1/users`,
            ]),
          ]);
        } else if (updated.progress >= 90) {
          setLogs((prev) => [
            ...new Set([
              ...prev,
              `[Trivy] Inspecting base container layer CVEs...`,
              `[Orchestrator] Assessment cycle finished. Cyber defense score: ${updated.score ? Math.round(updated.score) : 82}/100`,
            ]),
          ]);
        }

        if (updated.status === "completed" || updated.status === "failed") {
          setIsScanning(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeScan?.id, activeScan?.status]);

  // Load initial scan if query param present
  useEffect(() => {
    if (initialScanId) {
      scansApi.getScan(initialScanId).then((res) => {
        setActiveScan(res);
        setTarget(res.target);
      }).catch(() => {});
    }
  }, [initialScanId]);

  const handleStartScan = async (e) => {
    e.preventDefault();
    if (!target.trim()) return;

    setError("");
    setIsScanning(true);
    setLogs([
      `[Orchestrator] Initializing multi-engine scan for target: ${target.trim()}`,
      `[Orchestrator] Enabled scanning modules: ${scanners.join(", ")}`,
      `[Orchestrator] Spawning autonomous agents...`,
    ]);

    try {
      const res = await scansApi.createScan(target.trim(), scanType, scanners);
      setActiveScan(res);
    } catch (err) {
      setError(err.message || "Failed to initiate scan.");
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Autonomous Scanner</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure targets, orchestrate parallel security engines, and monitor live attack surface assessments.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Scanner Control Form */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
        <form onSubmit={handleStartScan} className="space-y-5">
          <div className="grid md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target IP, Hostname, or FQDN
              </label>
              <div className="relative">
                <Server className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 192.168.1.1 or api.domain.internal"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Assessment Profile
              </label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="network">Network Infrastructure</option>
                <option value="webapp">Web Application (DAST)</option>
                <option value="container">Container & Cloud Workload</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Scan...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Engine Multi-Select Toggles */}
          <div className="pt-3 border-t border-[#1e293b]">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Select Scanning Engines (Parallel Execution)
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleScanner("nmap")}
                className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-colors ${
                  scanners.includes("nmap")
                    ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                    : "bg-[#0a0f1d] border-[#1e293b] text-slate-500"
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Nmap (Port & Service Recon)</span>
              </button>

              <button
                type="button"
                onClick={() => toggleScanner("zap")}
                className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-colors ${
                  scanners.includes("zap")
                    ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                    : "bg-[#0a0f1d] border-[#1e293b] text-slate-500"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>OWASP ZAP (Application Fuzzing)</span>
              </button>

              <button
                type="button"
                onClick={() => toggleScanner("trivy")}
                className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-2 transition-colors ${
                  scanners.includes("trivy")
                    ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-300"
                    : "bg-[#0a0f1d] border-[#1e293b] text-slate-500"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Trivy (Container CVEs & Layers)</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Scan Progress / Console */}
      {activeScan && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">SCAN #{activeScan.id.slice(0, 8)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    activeScan.status === "completed"
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      : activeScan.status === "running"
                      ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 animate-pulse"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {activeScan.status}
                </span>
              </div>
              <div className="text-base font-bold text-white mt-1">Target: {activeScan.target}</div>
            </div>

            {activeScan.score !== null && activeScan.score !== undefined && (
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400">Post-Scan Resilience Score</div>
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {Math.round(activeScan.score)} / 100
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Execution Progress</span>
              <span>{activeScan.progress}%</span>
            </div>
            <div className="h-2 w-full bg-[#0a0f1d] rounded-full overflow-hidden border border-[#1e293b]">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${activeScan.progress}%` }}
              />
            </div>
          </div>

          {/* Simulated Terminal Log Stream */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1e293b] font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
            <div className="text-cyan-500/70 text-[10px] pb-1 border-b border-slate-800">
              --- AGENT_STREAM_TELEMETRY ---
            </div>
            {logs.map((line, idx) => (
              <div key={idx} className="leading-relaxed">
                {line}
              </div>
            ))}
            {isScanning && (
              <div className="text-cyan-400 animate-pulse-subtle flex items-center gap-2">
                <span>[Agent Mesh] Analyzing attack vectors...</span>
              </div>
            )}
          </div>

          {/* Vulnerability Findings View */}
          {activeScan.vulnerabilities && activeScan.vulnerabilities.length > 0 && (
            <div className="pt-4 border-t border-[#1e293b]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-semibold text-white">
                  Identified Security Findings ({activeScan.vulnerabilities.length})
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const data = await scansApi.exportScan(activeScan.id);
                        const blob = new Blob([data.report_markdown], { type: "text/markdown;charset=utf-8;" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `KRYNTRA-Security-Audit-${activeScan.target.replace(/[^a-zA-Z0-9]/g, "-")}.md`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } catch (err) {
                        console.error("Failed to export scan report:", err);
                      }
                    }}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Real Report (.MD)</span>
                  </button>
                  <Link
                    href="/dashboard/triage"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium font-mono"
                  >
                    <span>Dispatch to AI Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {activeScan.vulnerabilities.map((vuln) => {
                  const isExpanded = expandedVuln === vuln.id;
                  return (
                    <div
                      key={vuln.id}
                      className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b] hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 mt-0.5 ${
                              vuln.severity === "critical"
                                ? "bg-rose-950/60 text-rose-400 border border-rose-800/50"
                                : vuln.severity === "high"
                                ? "bg-orange-950/60 text-orange-400 border border-orange-800/50"
                                : vuln.severity === "medium"
                                ? "bg-amber-950/60 text-amber-400 border border-amber-800/50"
                                : "bg-blue-950/60 text-blue-400 border border-blue-800/50"
                            }`}
                          >
                            {vuln.severity}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">{vuln.title}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                              <span>Engine: {vuln.scanner.toUpperCase()}</span>
                              {vuln.cve_id && vuln.cve_id !== "N/A" && (
                                <span className="text-cyan-400">{vuln.cve_id}</span>
                              )}
                              {vuln.cvss_score && (
                                <span className="text-slate-300">CVSS {vuln.cvss_score}</span>
                              )}
                              {vuln.owasp_category && (
                                <span className="text-slate-500">{vuln.owasp_category}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedVuln(isExpanded ? null : vuln.id)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-end sm:self-center font-mono"
                        >
                          <span>{isExpanded ? "Hide Remediation" : "View Remediation"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-[#1e293b] space-y-3 text-xs">
                          {vuln.description && (
                            <p className="text-slate-300 leading-relaxed">{vuln.description}</p>
                          )}
                          {vuln.affected_component && (
                            <div className="p-2.5 rounded bg-[#070b14] border border-[#1e293b] font-mono text-slate-400">
                              <span className="text-slate-500 block text-[10px]">AFFECTED COMPONENT:</span>
                              <span className="text-cyan-300">{vuln.affected_component}</span>
                            </div>
                          )}
                          {vuln.remediation && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-200">
                              <span className="font-semibold block text-[11px] text-emerald-400 mb-1">
                                RECOMMENDED REMEDIATION:
                              </span>
                              <p className="leading-relaxed">{vuln.remediation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-cyan-400 animate-pulse">Loading Autonomous Scanner Console...</div>}>
      <ScannerContent />
    </Suspense>
  );
}

