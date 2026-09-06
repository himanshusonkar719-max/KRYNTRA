"use client";

import { useState } from "react";
import {
  Wrench,
  Shield,
  Copy,
  CheckCircle2,
  Lock,
  Server,
  FileCode,
  Check
} from "lucide-react";

export default function WorkbenchPage() {
  const [activeTab, setActiveTab] = useState("headers");
  const [copied, setCopied] = useState(false);
  const [targetServer, setTargetServer] = useState("nginx");

  // Header toggles
  const [hsts, setHsts] = useState(true);
  const [xframe, setXframe] = useState("DENY");
  const [nosniff, setNosniff] = useState(true);
  const [csp, setCsp] = useState(true);
  const [referrer, setReferrer] = useState("strict-origin-when-cross-origin");

  // Checklist items
  const [checklist, setChecklist] = useState({
    mfa: true,
    hsts: true,
    parameterizedSql: true,
    rateLimiting: false,
    waf: false,
    auditLogs: true,
    leastPrivilege: true,
    secretScanning: false
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generateNginxSnippet = () => {
    let out = "# KRYNTRA Recommended Security Headers (Nginx)\n";
    if (hsts) out += 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n';
    if (xframe) out += `add_header X-Frame-Options "${xframe}" always;\n`;
    if (nosniff) out += 'add_header X-Content-Type-Options "nosniff" always;\n';
    if (referrer) out += `add_header Referrer-Policy "${referrer}" always;\n`;
    if (csp) out += "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';\" always;\n";
    out += 'add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;';
    return out;
  };

  const generateNextJsSnippet = () => {
    return `// next.config.mjs
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: '${xframe}' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: '${referrer}' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self';" }
];

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  }
};`;
  };

  const codeSnippet = targetServer === "nginx" ? generateNginxSnippet() : generateNextJsSnippet();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const checklistScore = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-cyan-400" />
          <span>Security Hardening Workbench</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Defensive utilities, automated HTTP security header generator, and production posture checklist.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0f172a] border border-[#1e293b] w-fit text-xs">
        <button
          onClick={() => setActiveTab("headers")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "headers" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          Security Header Generator
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
            activeTab === "checklist" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          Hardening Checklist ({checklistScore}%)
        </button>
      </div>

      {/* Header Generator View */}
      {activeTab === "headers" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-5">
            <h3 className="text-base font-semibold text-white">Header Directives Configuration</h3>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-[#1e293b] cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Strict-Transport-Security (HSTS)</span>
                  <span className="text-[11px] text-slate-400">Forces HTTPS and enables HSTS preload</span>
                </div>
                <input
                  type="checkbox"
                  checked={hsts}
                  onChange={(e) => setHsts(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#070b14] border-[#1e293b] text-cyan-500 focus:ring-0"
                />
              </label>

              <div className="p-3 rounded-xl bg-[#0a0f1d] border border-[#1e293b] space-y-1.5">
                <span className="font-semibold text-white block">X-Frame-Options</span>
                <span className="text-[11px] text-slate-400 block mb-2">Mitigates UI Redressing & Clickjacking</span>
                <select
                  value={xframe}
                  onChange={(e) => setXframe(e.target.value)}
                  className="w-full py-1.5 px-2 bg-[#070b14] border border-[#1e293b] rounded text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="DENY">DENY (Strict)</option>
                  <option value="SAMEORIGIN">SAMEORIGIN</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-[#1e293b] cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">X-Content-Type-Options: nosniff</span>
                  <span className="text-[11px] text-slate-400">Prevents MIME-type sniffing attacks</span>
                </div>
                <input
                  type="checkbox"
                  checked={nosniff}
                  onChange={(e) => setNosniff(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#070b14] border-[#1e293b] text-cyan-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a0f1d] border border-[#1e293b] cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Content-Security-Policy (CSP)</span>
                  <span className="text-[11px] text-slate-400">Restricts script origins to eliminate XSS</span>
                </div>
                <input
                  type="checkbox"
                  checked={csp}
                  onChange={(e) => setCsp(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#070b14] border-[#1e293b] text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-white font-bold">GENERATED DIRECTIVE CONFIG</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={targetServer}
                    onChange={(e) => setTargetServer(e.target.value)}
                    className="py-1 px-2 bg-[#0a0f1d] border border-[#1e293b] rounded text-slate-300 text-[11px] font-mono focus:outline-none"
                  >
                    <option value="nginx">Nginx (nginx.conf)</option>
                    <option value="nextjs">Next.js (next.config.mjs)</option>
                  </select>

                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded bg-[#0a0f1d] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-[#070b14] border border-[#1e293b] text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {codeSnippet}
              </pre>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Direct drop-in for production servers · Tested against modern TLS 1.3 & Chromium specs
            </div>
          </div>
        </div>
      )}

      {/* Hardening Checklist View */}
      {activeTab === "checklist" && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Production Defensive Hardening Checklist</h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {completedCount}/{totalCount} Completed ({checklistScore}%)
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            {[
              { id: "mfa", title: "Enforce Multi-Factor Authentication (MFA)", cat: "Identity" },
              { id: "hsts", title: "Enable HTTP Strict Transport Security (HSTS)", cat: "Network" },
              { id: "parameterizedSql", title: "100% Parameterized SQL Database Queries", cat: "Application" },
              { id: "rateLimiting", title: "API Gateway Rate Limiting & DoS Throttling", cat: "Network" },
              { id: "waf", title: "Web Application Firewall (WAF) Inspection", cat: "Perimeter" },
              { id: "auditLogs", title: "Centralized SIEM Audit Log Ingestion", cat: "Operations" },
              { id: "leastPrivilege", title: "IAM Principle of Least Privilege (PoLP)", cat: "Cloud" },
              { id: "secretScanning", title: "Pre-commit Git Secret Scanning & Leak Detection", cat: "DevSecOps" },
            ].map((item) => (
              <label
                key={item.id}
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  checklist[item.id]
                    ? "bg-emerald-950/20 border-emerald-800/40 text-slate-200"
                    : "bg-[#0a0f1d] border-[#1e293b] text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  className="w-4 h-4 rounded bg-[#070b14] border-[#1e293b] text-emerald-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-white">{item.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400 mt-0.5 block">{item.cat}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
