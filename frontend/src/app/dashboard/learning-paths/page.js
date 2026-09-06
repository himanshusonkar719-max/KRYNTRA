"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { learningPathsApi } from "@/lib/api";
import {
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  BookOpen,
  Play,
  Award
} from "lucide-react";

export default function LearningPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await learningPathsApi.list();
        setPaths(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Cybersecurity Learning Paths</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Structured progression curricula guiding you from security foundations to specialized red/blue team capabilities.
        </p>
      </div>

      {/* Path Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  {path.domain}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  {path.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{path.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{path.description}</p>

              {/* Milestone Steps Timeline */}
              <div className="space-y-3 pt-2 border-t border-[#1e293b]">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                  CURRICULUM MILESTONES ({path.steps?.length} ASSESSMENTS)
                </span>
                {path.steps?.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-xl bg-[#0a0f1d] border border-[#1e293b] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{step.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {step.durationMins} mins · Passing grade 70%
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/assessments/${step.assessmentId}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1"
                    >
                      <span>Take</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>~{path.estimatedHours} Hours Total</span>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Award className="w-4 h-4" />
                <span>Certification Eligible</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
