import React from "react";
import { Wrench } from "lucide-react";

export const ToolsHeader: React.FC = () => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Developer Toolbox
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Utilities
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Offline-ready encoder, hash generators, batch UUID/ID creators, and
            epoch timestamp converter
          </p>
        </div>
      </div>
    </div>
  );
};
