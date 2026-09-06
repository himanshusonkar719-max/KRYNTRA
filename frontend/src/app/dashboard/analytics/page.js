"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analyticsApi } from "@/lib/api";
import {
  BarChart2,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Target,
  RefreshCw
} from "lucide-react";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [radar, setRadar] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovRes, radRes] = await Promise.allSettled([
        analyticsApi.getOverview(),
        analyticsApi.getRadar()
      ]);

      if (ovRes.status === "fulfilled") setOverview(ovRes.value);
      if (radRes.status === "fulfilled" && Array.isArray(radRes.value)) setRadar(radRes.value);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Skill Analytics & Mastery Radar</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual breakdown of your cybersecurity domain proficiency and weak-area practice recommendations.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-3">
            {overview?.average_score || 86}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all assessment attempts</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Active Streak</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 mt-3">
            {overview?.current_streak || 4} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Consistent daily practice</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Assessments Cleared</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-3">
            {overview?.passed_assessments || 6} / {overview?.total_assessments || 6}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Meeting &gt;=70% passing threshold</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Global Rank</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-400 mt-3">
            #{overview?.global_rank || 8}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Top 8% worldwide ranking</div>
        </div>
      </div>

      {/* Domain Proficiency Radar / Progress Bars */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Domain Competency Breakdown</h3>
            <span className="text-xs font-mono text-cyan-400">BENCHMARK: DEFENSIVE POSTURE</span>
          </div>

          <div className="space-y-4">
            {radar.map((d) => (
              <div key={d.slug} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200">{d.domain}</span>
                  <span className="text-cyan-400 font-bold">{d.score}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#0a0f1d] rounded-full overflow-hidden border border-[#1e293b]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      d.score >= 85
                        ? "bg-emerald-500"
                        : d.score >= 75
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Weak-Area Drills */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Target className="w-4 h-4" />
              <span>RECOMMENDED PRACTICE</span>
            </div>
            <h3 className="text-base font-bold text-white">Cloud Security & IAM</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your Cloud Security benchmark is currently at 72%. Practice SSRF metadata defenses, bucket permissions, and IAM least privilege to boost your overall resilience score.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-[#1e293b]">
            <Link
              href="/dashboard/assessments/assess-cloud-005"
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>Launch Practice Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
