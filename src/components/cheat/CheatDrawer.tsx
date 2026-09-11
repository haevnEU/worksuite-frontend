import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Terminal,
  Layers,
  Flag,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { CheatSheetResponseDto } from "../../models/cheatSheet.model";
import { getLevelBadgeClass } from "../../utils/cheat.util";

interface CheatDrawerProps {
  item: CheatSheetResponseDto | null;
  onClose: () => void;
}

export const CheatDrawer: React.FC<CheatDrawerProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-6 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">{item.title}</span>
            {item.level && (
              <span
                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${getLevelBadgeClass(
                  item.level,
                )}`}
              >
                {item.level}
              </span>
            )}
            {item.destructive && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border bg-rose-500/10 text-rose-400 border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> Destructive
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
            <span>Language: {item.language}</span>
            {item.category && <span>• {item.category}</span>}
            {item.subcategory && <span>/ {item.subcategory}</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Warning Banner */}
        {item.warning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span className="text-[11px] leading-relaxed">{item.warning}</span>
          </div>
        )}

        {/* Syntax & Command */}
        <section className="space-y-1.5">
          <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Syntax & Command
          </span>
          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed pr-10">
              {item.syntax}
            </pre>
            <button
              type="button"
              onClick={() => handleCopy(item.syntax)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
              title="Copy Syntax"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </section>

        {/* Explanation */}
        <section className="space-y-1.5">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Explanation
          </span>
          <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
            {item.explanation}
          </p>
        </section>

        {/* Options & Flags */}
        {item.flags && item.flags.length > 0 && (
          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Options & Flags</span>
            </div>
            <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
              {item.flags.map((f) => (
                <div key={f.flag} className="p-2.5 flex items-start gap-3">
                  <code className="font-mono text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                    {f.flag}
                  </code>
                  <span className="text-[11px] text-slate-400 leading-relaxed">
                    {f.description}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Practical Examples */}
        {item.examples && item.examples.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Practical Examples</span>
            </div>
            {item.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
              >
                <div className="font-semibold text-slate-300 text-[11px]">
                  {ex.title}
                </div>
                <pre className="font-mono text-[11px] text-blue-300 overflow-x-auto">
                  {ex.command}
                </pre>
              </div>
            ))}
          </section>
        )}

        {/* Documentation Link & Tags */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[11px]">
          {item.docUrl && (
            <a
              href={item.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official Documentation</span>
            </a>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap ml-auto">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
