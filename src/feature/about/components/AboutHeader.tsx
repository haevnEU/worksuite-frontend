import React, { useState } from "react";
import {
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Activity,
  GitBranch,
} from "lucide-react";

export const AboutHeader: React.FC = () => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                About & System Information
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Worksuite Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Application runtime telemetry, active build versions, environment
              configurations, and system health.
            </p>
          </div>
        </div>

        {/* Guide Toggle */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle system info guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
          {showGuide ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Collapsible Info Guide */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Diagnostics & Architecture Overview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Build & Release */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <GitBranch className="w-3.5 h-3.5 shrink-0" />
                  <span>Build & Pipeline Tags</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Displays the exact semantic version, active Git commit hash,
                  and compiler build timestamp generated during packaging.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Versioned Artifact Traceability</span>
              </div>
            </div>

            {/* 2. Runtime & Engine */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>Runtime & Stack</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Underlying technologies: React frontend engine running against
                  Spring Boot backend microservices and databases.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>React · Vite · Spring Boot</span>
              </div>
            </div>

            {/* 3. Integrations */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Service Integrations</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time connection states to external systems including
                  Redmine issue tracking, GitLab REST endpoints, and SSO.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>API Status & Health Checks</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
