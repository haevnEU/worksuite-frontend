import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Monitor,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AboutHeader } from "../components/about/AboutHeader.tsx";
import { useAbout } from "../context/AboutContext.tsx";
import { useSettings } from "../context/SettingsContext.tsx";

export const AboutPage: React.FC = () => {
  const { systemInfo, isLoading, error, refreshSystemInfo } = useAbout();
  const { hasVcsKey, hasRedmineKey } = useSettings();
  const [clientUptime, setClientUptime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setClientUptime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
  };

  const clientSpecs = {
    platform: navigator.platform || "Unknown OS",
    language: navigator.language || "en-US",
    screen: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`,
    userAgent: navigator.userAgent,
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
      {/* Header mit Guide */}
      <AboutHeader />

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Version */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              App Version
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">
              {systemInfo?.version || "v..."}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Commit #{systemInfo?.gitCommit || "unknown"}
            </p>
          </div>
        </div>

        {/* Build Timestamp */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Build Timestamp
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">
              {systemInfo?.buildTimestamp
                ? new Date(systemInfo.buildTimestamp).toLocaleDateString(
                    "de-DE",
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    },
                  )
                : "—"}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              {systemInfo?.buildTimestamp
                ? new Date(systemInfo.buildTimestamp).toLocaleTimeString(
                    "de-DE",
                  )
                : "—"}{" "}
              (UTC)
            </p>
          </div>
        </div>

        {/* Environment */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Environment
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold text-emerald-400 capitalize flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>{systemInfo?.environment || import.meta.env.MODE}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active Backend Profile
            </p>
          </div>
        </div>

        {/* Server & Client Uptime */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Server Uptime
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-300 font-mono">
              {systemInfo ? formatSeconds(systemInfo.uptimeSeconds) : "—"}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Client session: {formatSeconds(clientUptime)}
            </p>
          </div>
        </div>
      </div>

      {/* Backend & Frontend Architecture Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backend Runtime */}
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Backend Services & JVM
              </h2>
            </div>
            <button
              type="button"
              onClick={refreshSystemInfo}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer disabled:opacity-50"
              title="Refresh telemetry data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`}
              />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  Framework
                </span>
                <span className="font-bold text-slate-200">Spring Boot</span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 rounded-md">
                v{systemInfo?.springBootVersion || "3.x"}
              </span>
            </div>

            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  Runtime Environment
                </span>
                <span className="font-bold text-slate-200">
                  {systemInfo?.javaVersion || "Java JVM"}
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-md">
                {systemInfo?.osArch || "x86_64"}
              </span>
            </div>

            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  Host OS Platform
                </span>
                <span className="font-bold text-slate-200">
                  {systemInfo?.osName || "Linux / Docker"}
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online</span>
              </span>
            </div>
          </div>
        </div>

        {/* Client & Integrations State */}
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Client & Integration State
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  Frontend Stack
                </span>
                <span className="font-bold text-slate-200">
                  React + Vite + TailwindCSS
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-purple-950/60 text-purple-300 border border-purple-800/60 rounded-md">
                v{React.version}
              </span>
            </div>

            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  VCS (GitLab Personal Access Token)
                </span>
                <span className="font-bold text-slate-200">
                  Pipeline & Review Gateway
                </span>
              </div>
              <span
                className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${
                  hasVcsKey
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {hasVcsKey ? "Configured" : "Not Set"}
              </span>
            </div>

            <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium block">
                  Redmine Issue Tracking
                </span>
                <span className="font-bold text-slate-200">
                  REST API Key Integration
                </span>
              </div>
              <span
                className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${
                  hasRedmineKey
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {hasRedmineKey ? "Configured" : "Not Set"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Host & Browser Telemetry */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Client Browser & Display Specs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Host Platform
            </span>
            <span className="font-mono text-slate-200 font-bold">
              {clientSpecs.platform}
            </span>
          </div>

          <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Locale
            </span>
            <span className="font-mono text-slate-200 font-bold">
              {clientSpecs.language}
            </span>
          </div>

          <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
              Display Resolution
            </span>
            <span className="font-mono text-slate-200 font-bold">
              {clientSpecs.screen}
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">
            User Agent
          </span>
          <p className="font-mono text-[11px] text-slate-400 break-all select-all leading-relaxed">
            {clientSpecs.userAgent}
          </p>
        </div>
      </div>
    </div>
  );
};
