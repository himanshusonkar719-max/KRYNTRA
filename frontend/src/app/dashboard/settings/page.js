"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Cpu,
  Server,
  Bell,
  Save,
  CheckCircle2,
  RefreshCw,
  Key,
  Database,
  Terminal,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form states
  const [concurrency, setConcurrency] = useState("4");
  const [timeout, setTimeout] = useState("300");
  const [defaultProfile, setDefaultProfile] = useState("network");
  const [enableNmap, setEnableNmap] = useState(true);
  const [enableZap, setEnableZap] = useState(true);
  const [enableTrivy, setEnableTrivy] = useState(true);

  const [aiModel, setAiModel] = useState("gemini-1.5-flash");
  const [confidenceThreshold, setConfidenceThreshold] = useState("0.85");
  const [autoSandbox, setAutoSandbox] = useState(true);

  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/KRYNTRA/DEFENSE/alerts");
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Settings & Orchestration</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure autonomous scanning agents, LLM triage parameters, and unified notification hooks.
          </p>
        </div>

        {saved && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "general" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          Scanners & Engine
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "ai" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          AI Triage & Sandbox
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "alerts" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          Integrations & Alerts
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "system" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          System Health
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scanners & Engine Settings */}
        {activeTab === "general" && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Multi-Engine Orchestration Defaults</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Default Assessment Scope
                </label>
                <select
                  value={defaultProfile}
                  onChange={(e) => setDefaultProfile(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="network">Network Infrastructure</option>
                  <option value="webapp">Web Application (OWASP ZAP)</option>
                  <option value="container">Container & Workload (Trivy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Parallel Agent Concurrency
                </label>
                <select
                  value={concurrency}
                  onChange={(e) => setConcurrency(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="2">2 Concurrent Worker Threads</option>
                  <option value="4">4 Concurrent Worker Threads (Standard)</option>
                  <option value="8">8 Concurrent Worker Threads (Aggressive)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e293b] space-y-3">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Default Engine Activation
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableNmap}
                    onChange={(e) => setEnableNmap(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0a0f1d] border-[#1e293b] text-cyan-500 focus:ring-0"
                  />
                  <span>Enable Nmap (Port discovery, service fingerprints & TLS inspection)</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableZap}
                    onChange={(e) => setEnableZap(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0a0f1d] border-[#1e293b] text-cyan-500 focus:ring-0"
                  />
                  <span>Enable OWASP ZAP (Application spidering, fuzzing & SQLi/XSS probes)</span>
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTrivy}
                    onChange={(e) => setEnableTrivy(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0a0f1d] border-[#1e293b] text-cyan-500 focus:ring-0"
                  />
                  <span>Enable Trivy (Container image CVE database & misconfigurations)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* AI Triage Settings */}
        {activeTab === "ai" && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>LLM Triage & Sandbox Parameters</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Triage Reasoning Engine
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Recommended)</option>
                  <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="local-mistral">Local Host Mistral 7B (Offline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  False Positive Confidence Gate
                </label>
                <select
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="0.75">&gt; 75% Confidence Filter</option>
                  <option value="0.85">&gt; 85% Confidence Filter (Default)</option>
                  <option value="0.95">&gt; 95% Confidence Filter (Strict)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e293b]">
              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSandbox}
                  onChange={(e) => setAutoSandbox(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0a0f1d] border-[#1e293b] text-cyan-500 focus:ring-0"
                />
                <span>Automatically test candidate remediation patches in isolated Docker sandbox</span>
              </label>
            </div>
          </div>
        )}

        {/* Integrations & Alerts */}
        {activeTab === "alerts" && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>SIEM & Webhook Alerts</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Webhook URL (Slack / Teams / Discord)
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full py-2.5 px-3 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnCritical}
                  onChange={(e) => setNotifyOnCritical(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0a0f1d] border-[#1e293b] text-cyan-500 focus:ring-0"
                />
                <span>Dispatch real-time alerts when Critical or High CVEs are discovered</span>
              </label>
            </div>
          </div>
        )}

        {/* System Health */}
        {activeTab === "system" && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Unified Architecture Diagnostics</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b]">
                <span className="text-slate-500 block text-[10px]">API PROXY STATUS:</span>
                <span className="text-emerald-400 font-bold mt-1 block">Unified (Next.js Rewrites active)</span>
                <span className="text-slate-500 text-[10px] mt-0.5 block">Routes: /api/* → :8000</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b]">
                <span className="text-slate-500 block text-[10px]">DATABASE ENGINE:</span>
                <span className="text-emerald-400 font-bold mt-1 block">SQLite via SQLAlchemy 2.0</span>
                <span className="text-slate-500 text-[10px] mt-0.5 block">File: backend/kryntra.db</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b]">
                <span className="text-slate-500 block text-[10px]">FRONTEND FRAMEWORK:</span>
                <span className="text-cyan-400 font-bold mt-1 block">Next.js 16.3 (App Router)</span>
                <span className="text-slate-500 text-[10px] mt-0.5 block">Port: 3000 (Webpack WASM)</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b]">
                <span className="text-slate-500 block text-[10px]">AUTH SPECIFICATION:</span>
                <span className="text-cyan-400 font-bold mt-1 block">JWT HS256 + PBKDF2/Bcrypt</span>
                <span className="text-slate-500 text-[10px] mt-0.5 block">Session: 24hr auto-refresh</span>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
