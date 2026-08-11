import React, { useMemo } from "react";
import { Loader2, Quote } from "lucide-react";

const MESSAGES_OF_THE_DAY = [
  "Clean code always looks like it was written by someone who cares.",
  "Make it work, make it right, make it fast.",
  "Simplicity is prerequisite for reliability.",
  "First, solve the problem. Then, write the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Debugging is twice as hard as writing the code in the first place.",
  "Premature optimization is the root of all evil.",
];

export const DashboardSkeleton: React.FC = () => {
  const motd = useMemo(() => {
    const index = Math.floor(Math.random() * MESSAGES_OF_THE_DAY.length);
    return MESSAGES_OF_THE_DAY[index];
  }, []);

  return (
    <div className="w-[80vw] h-[80vh] mx-auto bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between p-8 shadow-2xl relative overflow-hidden animate-in fade-in duration-300 font-sans">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full shrink-0" />

      <div className="flex flex-col items-center justify-center space-y-4 my-auto">
        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-lg shadow-blue-500/5">
          <Loader2 className="w-10 h-10 animate-spin stroke-[2.5]" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white tracking-wide">
            Loading
          </h3>
          <p className="text-xs text-slate-400">
            Fetching metrics, tickets, and pipeline data...
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3 shrink-0 backdrop-blur-sm">
        <div className="p-1.5 bg-slate-800 text-blue-400 rounded-lg shrink-0 mt-0.5">
          <Quote className="w-4 h-4" />
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Message of the Day
          </span>
          <p className="text-xs text-slate-300 italic font-sans leading-relaxed truncate">
            "{motd}"
          </p>
        </div>
      </div>
    </div>
  );
};
