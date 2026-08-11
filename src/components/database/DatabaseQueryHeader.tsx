import React from "react";
import { Database } from "lucide-react";

export const DatabaseQueryHeader: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden font-sans">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Backend Table Query
          </h1>
          <p className="text-slate-400 text-sm">
            Select a database table, choose the search field (ID or Key), and
            enter the query value. The backend will be queried via{" "}
            <code className="text-blue-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              GET
              /api/v1/database?searchParam=&#123;key/id&#125;&value=&#123;value&#125;
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
