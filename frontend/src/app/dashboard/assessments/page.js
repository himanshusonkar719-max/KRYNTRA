"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { assessmentsApi } from "@/lib/api";
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Filter,
  ArrowRight,
  RefreshCw,
  Layers,
  ShieldAlert
} from "lucide-react";

export default function AssessmentsCatalogPage() {
  const [assessments, setAssessments] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assessList, histList] = await Promise.allSettled([
        assessmentsApi.list(),
        assessmentsApi.getHistory()
      ]);

      if (assessList.status === "fulfilled" && Array.isArray(assessList.value)) {
        setAssessments(assessList.value);
      }
      if (histList.status === "fulfilled" && Array.isArray(histList.value)) {
        setHistory(histList.value);
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
        const [assessList, histList] = await Promise.allSettled([
          assessmentsApi.list(),
          assessmentsApi.getHistory()
        ]);

        if (!active) return;
        if (assessList.status === "fulfilled" && Array.isArray(assessList.value)) {
          setAssessments(assessList.value);
        }
        if (histList.status === "fulfilled" && Array.isArray(histList.value)) {
          setHistory(histList.value);
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
  }, []);

  const domains = [
    { id: "all", label: "All Domains" },
    { id: "web-app-security", label: "Web App Security" },
    { id: "network-security", label: "Network Security" },
    { id: "incident-response", label: "Incident Response" },
    { id: "cloud-security", label: "Cloud Security" },
    { id: "governance-compliance", label: "GRC" }
  ];

  const filtered = assessments.filter((a) => {
    if (!a) return false;
    if (selectedDomain === "all") return true;
    if (a.domain_slug === selectedDomain) return true;
    if (a.domain && a.domain.toLowerCase().replace(/[^a-z0-9]/g, "-").includes(selectedDomain)) return true;
    return false;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cybersecurity Skills Assessments</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Timed, scenario-based evaluations spanning offensive penetration testing, incident triage, and defense.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDomain(d.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              selectedDomain === d.id
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-[#1e293b] text-slate-400">
          <Layers className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
          <h3 className="text-sm font-bold text-white">No assessments found for this domain</h3>
          <p className="text-xs mt-1">Select "All Domains" to explore all cybersecurity scenarios.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-cyan-500/50 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                    {item.domain || "Cybersecurity"}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                      item.difficulty === "beginner"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                        : item.difficulty === "intermediate"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                        : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                    }`}
                  >
                    {item.difficulty || "standard"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 border-t border-[#1e293b] mt-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.duration_mins ?? item.estimated_mins ?? 30} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.question_count ?? item.questions_count ?? 3} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.total_points ?? 30} Pts</span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/assessments/${item.id}`}
                  className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Assessment</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Attempt History Table */}
      {history.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <h2 className="text-base font-semibold text-white mb-4">Your Recent Assessment Attempts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#1e293b] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Assessment</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-slate-300">
                {history.map((att) => (
                  <tr key={att.id} className="hover:bg-[#162032]/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{att.assessment_title}</td>
                    <td className="py-3 px-3 text-slate-400">{att.domain}</td>
                    <td className="py-3 px-3 text-cyan-400 font-bold">
                      {att.score} / {att.total_points} ({att.percentage}%)
                    </td>
                    <td className="py-3 px-3">
                      {att.passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-rose-950/60 text-rose-400 border border-rose-800/40">
                          <AlertCircle className="w-3 h-3" /> RETRY NEEDED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(att.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/assessments/${att.assessment_id}/results?attempt_id=${att.id}`}
                        className="text-cyan-400 hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
