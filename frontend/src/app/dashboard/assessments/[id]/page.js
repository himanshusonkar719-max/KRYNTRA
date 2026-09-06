"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { assessmentsApi } from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  Shield,
  Terminal,
  Code
} from "lucide-react";

export default function AssessmentRunnerPage({ params }) {
  const unwrappedParams = use(params);
  const assessmentId = unwrappedParams.id;
  const router = useRouter();

  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await assessmentsApi.get(assessmentId);
        setAssessment(data);
        setTimeLeft((data.duration_mins || 30) * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [assessmentId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    if (secs === null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const totalSecs = (assessment?.duration_mins || 30) * 60;
      const takenSecs = totalSecs - (timeLeft || 0);
      const res = await assessmentsApi.submit(assessmentId, answers, takenSecs);

      // Store in localStorage for results page
      if (typeof window !== "undefined") {
        localStorage.setItem(`kryntra_result_${res.attempt_id}`, JSON.stringify(res));
      }

      router.push(`/dashboard/assessments/${assessmentId}/results?attempt_id=${res.attempt_id}`);
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-cyan-400 animate-pulse">
        Loading Assessment Session...
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-bold text-white">Assessment not found</h2>
        <Link href="/dashboard/assessments" className="mt-4 text-xs text-cyan-400 hover:underline">
          Return to Assessments Catalog
        </Link>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIdx];
  const totalQ = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Controls Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
            {assessment.domain}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">{assessment.title}</h2>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              timeLeft && timeLeft < 300
                ? "bg-rose-950/60 border-rose-800 text-rose-400 animate-pulse"
                : "bg-[#0a0f1d] border-[#1e293b] text-cyan-400"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Question Navigation Bubbles */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {assessment.questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flagged[q.id];
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative ${
                  isCurrent
                    ? "bg-cyan-500 text-slate-950 border border-cyan-400"
                    : isAnswered
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                    : "bg-[#0a0f1d] text-slate-400 border border-[#1e293b] hover:text-white"
                }`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 shrink-0">
          Answered: {answeredCount}/{totalQ}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <span className="text-xs font-mono text-cyan-400 font-bold">
            QUESTION {currentIdx + 1} OF {totalQ}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">{currentQ.points} Points</span>
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md transition-colors ${
                flagged[currentQ.id]
                  ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flagged[currentQ.id] ? "Flagged" : "Flag"}</span>
            </button>
          </div>
        </div>

        {/* Scenario Text if present */}
        {currentQ.scenario_text && (
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1e293b] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>INCIDENT TELEMETRY SCENARIO</span>
            </div>
            {currentQ.scenario_text}
          </div>
        )}

        {/* Code Review Block if present */}
        {currentQ.code_block && (
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1e293b] font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>SOURCE CODE AUDIT</span>
            </div>
            {currentQ.code_block}
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          {currentQ.text}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500 text-white"
                    : "bg-[#0a0f1d] border-[#1e293b] text-slate-300 hover:border-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold ${
                    isSelected
                      ? "bg-cyan-500 border-cyan-400 text-slate-950"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  {opt.id.toUpperCase()}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed">{opt.text}</div>
              </button>
            );
          })}
        </div>

        {/* Bottom Prev / Next Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-[#1e293b]">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-lg bg-[#0a0f1d] border border-[#1e293b] text-xs font-mono text-slate-300 disabled:opacity-40 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIdx < totalQ - 1 ? (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finish & Grade</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
