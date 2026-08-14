import React from "react";
import { Database } from "lucide-react";

export const DatabaseQueryHeader: React.FC = () => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      {/* Linke Seite: Icon, Titel, Badge & Endpoint-Beschreibung */}
      <div className="flex items-start md:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0 mt-1 md:mt-0">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Backend Table Query
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Direct DB Access
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Select a table and search field to query entries directly via{" "}
            <code className="text-blue-300 font-mono bg-[#0b111e] px-2 py-0.5 rounded border border-slate-800 text-[11px]">
              GET
              /api/v1/database?searchParam=&#123;key/id&#125;&value=&#123;value&#125;
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
