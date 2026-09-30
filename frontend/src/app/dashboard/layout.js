"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Shield,
  LayoutDashboard,
  Radio,
  Cpu,
  FileCheck,
  LogOut,
  User,
  Activity,
  Menu,
  X,
  Plus,
  Settings,
  Award,
  Compass,
  BarChart2,
  Trophy,
  Wrench,
  Terminal,
  Lock
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── AUTHENTICATION ROUTE GUARD ──────────────────────────
  useEffect(() => {
    if (!loading && !user && !token) {
      router.replace("/login");
    }
  }, [loading, user, token, router]);

  const navSections = [
    {
      title: "AUTONOMOUS OPS",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Autonomous Scanner", href: "/dashboard/scanner", icon: Radio },
        { name: "AI Triage Queue", href: "/dashboard/triage", icon: Cpu },
        { name: "Continuous Compliance", href: "/dashboard/compliance", icon: FileCheck },
      ]
    },
    {
      title: "SKILLS & ASSESSMENTS",
      items: [
        { name: "Skills Assessments", href: "/dashboard/assessments", icon: Award },
        { name: "Learning Paths", href: "/dashboard/learning-paths", icon: Compass },
        { name: "Mastery Analytics", href: "/dashboard/analytics", icon: BarChart2 },
        { name: "Global Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
        { name: "Hardening Workbench", href: "/dashboard/workbench", icon: Wrench },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Terminal", href: "/dashboard/terminal", icon: Terminal },
        { name: "Settings & Config", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ];

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  // If verifying authentication state, show secure loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-mono text-cyan-400">Verifying security token...</span>
        </div>
      </div>
    );
  }

  // Prevent unauthenticated flashes
  if (!user && !token) {
    return null;
  }

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Authenticated User");
  const displayEmail = user?.email || "Security Analyst";

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f8fafc] flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-[#1e293b]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
            <Shield className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-bold tracking-wider text-white">KRYNTRA</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${mobileMenuOpen ? "block" : "hidden"
          } md:flex flex-col justify-between w-full md:w-64 bg-[#0f172a] border-r border-[#1e293b] p-5 shrink-0 z-40`}
      >
        <div>
          {/* Brand Header */}
          <Link href="/" className="hidden md:flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold tracking-wider text-white leading-tight">KRYNTRA</div>
              <div className="text-[10px] text-cyan-400 font-mono">AUTONOMOUS OPS</div>
            </div>
          </Link>

          {/* Navigation Links Grouped by Section */}
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10px] font-mono text-slate-500 tracking-wider px-3 uppercase mb-1">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#162032]"
                        }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User & System Status Card */}
        <div className="pt-6 border-t border-[#1e293b] space-y-4">
          <div className="p-3 rounded-lg bg-[#0a0f1d] border border-[#1e293b]">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
              <span>ENGINES ARMED</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">NMAP · ZAP · TRIVY</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 uppercase font-bold text-xs">
                {displayName.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {displayEmail}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 lg:px-8 border-b border-[#1e293b] bg-[#0a0f1d]/80 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">
              Autonomous Cybersecurity Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono">
              <Activity className="w-3.5 h-3.5" />
              <span>AGENT MESH ONLINE</span>
            </div>
            <Link
              href="/dashboard/scanner"
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Scan</span>
            </Link>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
