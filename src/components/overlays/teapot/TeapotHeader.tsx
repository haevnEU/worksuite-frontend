import React from "react";
import { Coffee } from "lucide-react";

export const TeapotHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Animated steam over the teapot container */}
      <div className="relative p-5 bg-gradient-to-b from-amber-500/20 to-amber-950/30 border border-amber-500/30 rounded-2xl text-amber-400 mb-6 shadow-lg shadow-amber-500/10 group">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          <span className="w-1.5 h-3 bg-amber-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-4 bg-amber-400/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-3 bg-amber-400/50 rounded-full animate-bounce" />
        </div>
        <Coffee className="w-12 h-12 text-amber-300 stroke-[1.75]" />
      </div>

      <div className="max-w-md space-y-2 mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Short & Stout! 🫖
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          You've discovered the legendary{" "}
          <span className="text-amber-400 font-semibold">
            HTTP 418 I'm a teapot
          </span>{" "}
          Easter Egg.
        </p>
        <p className="text-xs text-slate-500">
          Originally published on April 1, 1998, as part of the Hyper Text
          Coffee Pot Control Protocol (HTCPCP).
        </p>
      </div>
    </div>
  );
};
