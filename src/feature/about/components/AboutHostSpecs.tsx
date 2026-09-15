import React from "react";
import { Monitor } from "lucide-react";

export const AboutHostSpecs: React.FC = () => {
  const clientSpecs = {
    platform: navigator.platform || "Unknown OS",
    language: navigator.language || "en-US",
    screen: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`,
    userAgent: navigator.userAgent,
  };

  return (
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
  );
};
