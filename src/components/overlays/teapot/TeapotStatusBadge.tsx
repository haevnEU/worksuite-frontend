import React from "react";
import { Sparkles, Sparkle } from "lucide-react";

export const TeapotStatusBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
      <span>Easter Egg Unlocked • RFC 2324</span>
      <Sparkle className="w-3 h-3 text-amber-400" />
    </div>
  );
};
