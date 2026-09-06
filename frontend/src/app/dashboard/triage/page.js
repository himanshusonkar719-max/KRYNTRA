"use client";

import { useState, useEffect } from "react";
import { triageApi } from "@/lib/api";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Terminal,
  Play,
  ArrowRight,
  Filter,
  Check,
  X
} from "lucide-react";

export default function TriagePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [verifyingId, setVerifyingId] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await triageApi.getQueue();
      if (Array.isArray(data)) {
        setQueue(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleToggleFalsePositive = async (vuln) => {
    const nextState = vuln.is_false_positive ? 0 : 1;
    try {
      const updated = await triageApi.overrideTriage(vuln.id, {
        is_false_positive: nextState,
      });
      setQueue((prev) => prev.map((item) => (item.id === vuln.id ? updated : item)));
    } catch (err) {
      console.error("Failed to toggle false positive:", err);
    }
  };

  const handleVerifyInSandbox = async (vuln) => {
    setVerifyingId(vuln.id);
    setVerificationResult(null);

    try {
      const res = await triageApi.verifySandbox(vuln.id);
      setVerificationResult(res);
      // Update local state
      setQueue((prev) =>
        prev.map((item) => (item.id === vuln.id ? { ...item, sandbox_status: "passed" } : item))
      );
    } catch (err) {
      console.error("Sandbox verification failed:", err);
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredQueue = queue.filter((v) => {
    if (activeTab === "critical") return v.severity === "critical" && !v.is_false_positive;
    if (activeTab === "verified") return v.sandbox_status === "passed";
    if (activeTab === "fp") return v.is_false_positive === 1;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Triage & Sandbox Verification</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous threat prioritization, exploitability assessment, and automated Docker container verification.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "all" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          All Findings ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab("critical")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "critical" ? "bg-rose-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          Critical ({queue.filter((v) => v.severity === "critical" && !v.is_false_positive).length})
        </button>
        <button
          onClick={() => setActiveTab("verified")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "verified" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
          }`}
        >
          Sandbox Verified ({queue.filter((v) => v.sandbox_status === "passed").length})
        </button>
        <button
          onClick={() => setActiveTab("fp")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "fp" ? "bg-slate-700 text-slate-200" : "text-slate-400 hover:text-white"
          }`}
        >
          False Positives ({queue.filter((v) => v.is_false_positive === 1).length})
        </button>
      </div>

      {/* Verification Terminal Modal / Result */}
      {verificationResult && (
        <div className="p-5 rounded-2xl bg-[#070b14] border border-cyan-500/40 font-mono text-xs space-y-3 animate-fade-in shadow-xl shadow-cyan-500/10">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 text-cyan-400 font-bold">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>ISOLATED DOCKER SANDBOX VERIFICATION LOGS</span>
            </div>
            <button
              onClick={() => setVerificationResult(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5 text-slate-300">
            {verificationResult.logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-cyan-500/70 select-none">&gt;</span>
                <span className={i === verificationResult.logs.length - 1 ? "text-emerald-400 font-bold" : ""}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triage List */}
      {filteredQueue.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Vulnerabilities in this View</h3>
          <p className="text-xs text-slate-400 mt-1">
            Run a scan in the Autonomous Scanner to populate the triage queue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((vuln) => (
            <div
              key={vuln.id}
              className={`p-6 rounded-2xl bg-[#0f172a] border transition-colors ${
                vuln.is_false_positive
                  ? "border-slate-800 opacity-60"
                  : vuln.severity === "critical"
                  ? "border-rose-900/50 hover:border-rose-700/60"
                  : "border-[#1e293b] hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {vuln.ai_priority && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px] font-mono font-bold">
                        AI PRIORITY #{vuln.ai_priority}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
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

                    {vuln.ai_confidence && (
                      <span className="text-[11px] font-mono text-emerald-400">
                        Confidence: {(vuln.ai_confidence * 100).toFixed(0)}%
                      </span>
                    )}

                    {vuln.sandbox_status === "passed" && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-[10px] font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Sandbox Verified
                      </span>
                    )}

                    {vuln.is_false_positive === 1 && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                        Flagged as False Positive
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{vuln.title}</h3>
                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{vuln.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleToggleFalsePositive(vuln)}
                    className="px-3 py-1.5 rounded-lg bg-[#0a0f1d] border border-[#1e293b] text-slate-400 hover:text-white text-xs font-mono transition-colors"
                  >
                    {vuln.is_false_positive ? "Restore" : "Mark FP"}
                  </button>

                  <button
                    onClick={() => handleVerifyInSandbox(vuln)}
                    disabled={verifyingId === vuln.id}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                  >
                    {verifyingId === vuln.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying in Docker...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Verify in Sandbox</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Remediation Snippet */}
              {vuln.remediation && (
                <div className="mt-4 pt-3 border-t border-[#1e293b] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-mono text-cyan-400">AI REMEDIATION PLAN:</span>
                    {vuln.owasp_category && (
                      <span className="text-[10px] font-mono text-slate-500">{vuln.owasp_category}</span>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-300 font-mono text-[11px]">
                    {vuln.remediation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
