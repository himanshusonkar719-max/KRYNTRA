"use client";

import { useState, useEffect } from "react";
import { analyticsApi } from "@/lib/api";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Shield,
  Search,
  RefreshCw,
  UserCheck
} from "lucide-react";

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [tab, setTab] = useState("all-time");
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.getLeaderboard();
      if (Array.isArray(data)) {
        setBoard(data);
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
        const data = await analyticsApi.getLeaderboard();
        if (!active) return;
        if (Array.isArray(data)) {
          setBoard(data);
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

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Global Cybersecurity Leaderboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Competitive skill rankings based on assessment mastery, response speed, and continuous defense streak.
          </p>
        </div>

        <button
          onClick={fetchBoard}
          className="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        <button
          onClick={() => setTab("all-time")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            tab === "all-time" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          All-Time Rankings
        </button>
        <button
          onClick={() => setTab("weekly")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            tab === "weekly" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          Weekly Sprint
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#1e293b] text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Analyst / Handle</th>
                <th className="py-3 px-3">Specialization</th>
                <th className="py-3 px-3">Defense Score</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3 text-right">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-slate-300">
              {board.map((user) => (
                <tr
                  key={user.rank}
                  className={`transition-colors ${
                    user.is_current_user
                      ? "bg-cyan-950/30 border-l-2 border-cyan-400"
                      : "hover:bg-[#162032]/40"
                  }`}
                >
                  <td className="py-3.5 px-3">
                    {user.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                        1
                      </span>
                    ) : user.rank === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold flex items-center justify-center text-xs">
                        2
                      </span>
                    ) : user.rank === 3 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold ml-1.5">#{user.rank}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{user.name}</span>
                      {user.is_current_user && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[9px] uppercase font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-400">{user.title}</td>

                  <td className="py-3.5 px-3 text-cyan-400 font-bold">
                    {user.score} pts
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{user.streak}d</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-purple-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{user.badges}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
