import React from "react";
import { AlertCircle } from "lucide-react";

export const ConnectionStatusBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <AlertCircle className="w-3.5 h-3.5" />
      <span>Connection Lost</span>
    </div>
  );
};
