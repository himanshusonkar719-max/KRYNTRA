"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { assessmentsApi } from "@/lib/api";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  BarChart2,
  Shield,
  FileText
} from "lucide-react";

function ResultsContent() {
  const params = useParams();
  const assessmentId = params?.id;
  const searchParams = useSearchParams();
  const attemptId = searchParams?.get("attempt_id");
  const router = useRouter();

  const [result, setResult] = useState(() => {
    if (!attemptId || typeof window === "undefined") {
      return null;
    }
    const stored = localStorage.getItem(`kryntra_result_${attemptId}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!result && !!attemptId);

  useEffect(() => {
    if (result || !attemptId) {
      return;
    }

    let active = true;
    async function loadAttempt() {
      try {
        const data = await assessmentsApi.getAttempt(attemptId);
        if (!active) return;
        if (data) {
          setResult(data);
        }
      } catch (err) {
        console.error("Failed to fetch attempt from backend:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadAttempt();

    return () => {
      active = false;
    };
  }, [attemptId, result]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-sm font-mono text-cyan-400">Loading Evaluation Results...</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-4">
        <Award className="w-12 h-12 text-cyan-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Assessment Complete</h2>
        <p className="text-xs text-slate-400">
          Your attempt score has been recorded into the platform database.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={`/dashboard/assessments/${assessmentId || "assess-web-001"}`}
            className="px-4 py-2 rounded-lg bg-[#0a0f1d] border border-[#1e293b] text-xs font-mono text-cyan-400 hover:text-white"
          >
            Retake Test
          </Link>
          <Link
            href="/dashboard/assessments"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono"
          >
            View Catalog
          </Link>
        </div>
      </div>
    );
  }

  const passed = !!result.passed;
  const mins = Math.floor((result.time_taken_secs || 0) / 60);
  const secs = (result.time_taken_secs || 0) % 60;
  const feedbackList = Array.isArray(result.feedback) ? result.feedback : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Score Summary Banner */}
      <div className="p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                passed
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                  : "bg-rose-950/60 text-rose-400 border border-rose-800/50"
              }`}
            >
              {passed ? "Assessment Passed (>= 70%)" : "Assessment Failed (< 70%)"}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Time: {mins}m {secs}s
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white">{result.assessment_title || "Security Assessment"}</h1>
          <p className="text-xs text-slate-400">
            Performance breakdown and technical explanation of results.
          </p>
        </div>

        {/* Big Score Gauge */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-extrabold font-mono text-cyan-400">
            {result.score ?? 0} / {result.total_points ?? 30}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-0.5">
            {result.percentage ?? 0}% Final Grade
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/assessments"
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <span>← Back to Catalog</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/assessments/${assessmentId || result.assessment_id || "assess-web-001"}`}
            className="px-4 py-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>View Radar Analytics</span>
          </Link>
        </div>
      </div>

      {/* Summary Note if feedback is string */}
      {typeof result.feedback === "string" && result.feedback && (
        <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          <span className="font-bold uppercase text-[10px] text-cyan-400 block mb-1">EVALUATION NOTE:</span>
          {result.feedback}
        </div>
      )}

      {/* Question Feedback List */}
      {feedbackList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white">Question Review & Technical Rationales</h2>

          {feedbackList.map((item, idx) => (
            <div
              key={item.question_id || idx}
              className={`p-6 rounded-2xl bg-[#0f172a] border transition-colors ${
                item.is_correct ? "border-emerald-950/60" : "border-rose-950/60"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-3 border-b border-[#1e293b] pb-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400 font-bold">QUESTION {idx + 1}</span>
                  {item.is_correct ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{item.points_earned ?? 10} pts)
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect (0 pts)
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Your: {item.user_answer ? String(item.user_answer).toUpperCase() : "None"} | Correct:{" "}
                  <span className="text-emerald-400 font-bold">{String(item.correct_answer || "").toUpperCase()}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed mb-3">
                {item.text}
              </p>

              {item.explanation && (
                <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-[#1e293b] text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block">
                    TECHNICAL EXPLANATION:
                  </span>
                  <p className="leading-relaxed">{item.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-cyan-400 animate-pulse">Calculating Graded Results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
