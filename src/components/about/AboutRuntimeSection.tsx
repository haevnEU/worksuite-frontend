import React from "react";
import { Server, Cpu, CheckCircle2 } from "lucide-react";
import { AboutSystemInfo } from "../../models/about.model.ts";

interface AboutRuntimeSectionProps {
  systemInfo: AboutSystemInfo | null;
  hasVcsKey: boolean;
  hasRedmineKey: boolean;
}

export const AboutRuntimeSection: React.FC<AboutRuntimeSectionProps> = ({
  systemInfo,
  hasVcsKey,
  hasRedmineKey,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Backend Runtime */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
          <Server className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Backend Runtime & Host OS
          </h2>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium block">
                Framework
              </span>
              <span className="font-bold text-slate-200">
                Spring Boot Framework
              </span>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 rounded-md">
              v{systemInfo?.springBootVersion || "3.x"}
            </span>
          </div>

          <div className="p-3 bg-[#0b111e] rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium block">
                JVM Architecture
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
                Host Operating System
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
                VCS (GitLab Access Token)
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
  );
};
