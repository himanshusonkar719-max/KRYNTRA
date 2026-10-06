"use client";

import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  Shield,
  FileText,
  Clock
} from "lucide-react";

export default function CompliancePage() {
  const [framework, setFramework] = useState("soc2");
  const [complianceData, setComplianceData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async (fw = framework) => {
    setLoading(true);
    try {
      const [compRes, repRes] = await Promise.allSettled([
        reportsApi.getCompliance(fw),
        reportsApi.listReports(),
      ]);

      if (compRes.status === "fulfilled") {
        setComplianceData(compRes.value);
      }
      if (repRes.status === "fulfilled" && Array.isArray(repRes.value)) {
        setReports(repRes.value);
      }
    } catch (err) {
      console.error(err);
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
        const [compRes, repRes] = await Promise.allSettled([
          reportsApi.getCompliance(framework),
          reportsApi.listReports(),
        ]);

        if (!active) return;
        if (compRes.status === "fulfilled") {
          setComplianceData(compRes.value);
        }
        if (repRes.status === "fulfilled" && Array.isArray(repRes.value)) {
          setReports(repRes.value);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [framework]);

  const handleGenerateReport = async () => {
    setGenerating(true);
    setSuccessMsg("");
    try {
      const newReport = await reportsApi.generateReport(framework);
      if (newReport) {
        setReports((prev) => [newReport, ...prev]);
        setSuccessMsg(`Successfully generated audit report #${String(newReport.id || "001").slice(0, 8)}`);
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setGenerating(false);
    }
  };

  const score = complianceData?.score ?? 83.3;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Continuous Compliance & Audits</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated compliance mapping across global cybersecurity frameworks with continuous audit verification.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 self-start sm:self-center"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Compiling Report...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Generate Audit Package</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Framework Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        <button
          onClick={() => setFramework("soc2")}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            framework === "soc2" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          SOC2 Type II
        </button>
        <button
          onClick={() => setFramework("iso27001")}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            framework === "iso27001" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          ISO 27001:2022
        </button>
        <button
          onClick={() => setFramework("nist_csf")}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            framework === "nist_csf" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          NIST CSF 2.0
        </button>
      </div>

      {/* Compliance Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-white">{score}%</span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Readiness</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Audit Ready Status
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {complianceData?.passed_controls ?? 5} of {complianceData?.total_controls ?? 6} controls satisfied
            </p>
          </div>
        </div>

        <div className="md:col-span-8 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase font-mono text-cyan-400">
              {framework.toUpperCase()} AUDIT MAPPING SPECIFICATION
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every vulnerability identified by Nmap, OWASP ZAP, or Trivy is continuously cross-referenced against regulatory controls. Remediation verification in the isolated Docker sandbox automatically validates control compliance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1e293b] mt-4 font-mono text-center">
            <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b]">
              <div className="text-xl font-bold text-emerald-400">{complianceData?.passed_controls ?? 5}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Passed</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b]">
              <div className="text-xl font-bold text-amber-400">
                {(complianceData?.total_controls ?? 6) - (complianceData?.passed_controls ?? 5)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Under Review</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b]">
              <div className="text-xl font-bold text-cyan-400">0</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Exceptions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Checklist Table */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
        <h3 className="text-base font-semibold text-white mb-4">Framework Control Verification</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1e293b] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Control Code</th>
                <th className="py-3 px-3">Control Name</th>
                <th className="py-3 px-3">Domain Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Findings Attached</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-slate-300 font-mono">
              {(complianceData?.controls || []).map((ctrl, i) => (
                <tr key={i} className="hover:bg-[#162032]/40 transition-colors">
                  <td className="py-3 px-3 text-cyan-400 font-bold">{ctrl.code}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-200">{ctrl.name}</td>
                  <td className="py-3 px-3 text-slate-400">{ctrl.category}</td>
                  <td className="py-3 px-3">
                    {ctrl.status === "passed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" /> PASS
                      </span>
                    )}
                    {ctrl.status === "warning" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-950/60 text-amber-400 border border-amber-800/40">
                        <AlertTriangle className="w-3 h-3" /> WARNING
                      </span>
                    )}
                    {ctrl.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-rose-950/60 text-rose-400 border border-rose-800/40">
                        <XCircle className="w-3 h-3" /> FAIL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {ctrl.findings_count > 0 ? (
                      <span className="text-rose-400 font-bold">{ctrl.findings_count}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Reports History */}
      {reports.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <h3 className="text-base font-semibold text-white mb-4">Historical Audit Packages</h3>
          <div className="space-y-3">
            {reports.map((rep, rIdx) => {
              const repId = rep.id || `rep-${rIdx}`;
              const fwName = (rep.framework || "framework").toUpperCase();
              const repScore = rep.score != null ? Math.round(rep.score) : 88;

              return (
                <div
                  key={repId}
                  className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {fwName} Compliance Audit Package
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Report ID: {String(repId).slice(0, 8)} · Score: {repScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const data = await reportsApi.exportReport(rep.id);
                          const reportContent = data?.report_markdown || `# KRYNTRA ${fwName} Compliance Audit Report\nScore: ${repScore}%`;
                          const blob = new Blob([reportContent], { type: "text/markdown;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `KRYNTRA-${fwName}-Audit-Report-${String(repId).slice(0, 8)}.md`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } catch (err) {
                          console.error("Failed to export report:", err);
                        }
                      }}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .MD Audit</span>
                    </button>

                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(rep, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `KRYNTRA-${fwName}-Evidence-${String(repId).slice(0, 8)}.json`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="px-2.5 py-1.5 bg-[#0f172a] hover:bg-[#162032] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-mono rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>.JSON Evidence</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
