import React from "react";
import {
  Layers,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AboutSystemInfo } from "../../models/about.model.ts";

interface AboutKpiGridProps {
  systemInfo: AboutSystemInfo | null;
  clientUptime: number;
}

export const AboutKpiGrid: React.FC<AboutKpiGridProps> = ({
  systemInfo,
  clientUptime,
}) => {
  const formatSeconds = (sec: number) => {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return d > 0 ? `${d}d ${h}m` : `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. App Version */}
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

      {/* 2. Build Timestamp */}
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
              ? new Date(systemInfo.buildTimestamp).toLocaleTimeString("de-DE")
              : "—"}{" "}
            (UTC)
          </p>
        </div>
      </div>

      {/* 3. Environment */}
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

      {/* 4. Server & Client Uptime */}
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
  );
};
